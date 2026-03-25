"use client";

import TemplatePreview from "@/components/follow-up/template-preview";
import TemplateVariables from "@/components/follow-up/template-variables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/ui/custom-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-scroll-select";
import { useFollowUpStore } from "@/context/follow-up-context";
import { useMetaTemplatesStore } from "@/context/meta-templates-context";
import { useTemplateSelectionStore } from "@/context/templates-context";
import { getEventRules } from "@/DAL/event-rules";
import { getEventTypes } from "@/DAL/event-types";
import { getFollowUpById, updateFollowUp } from "@/DAL/follow-ups";
import { CustomSubChannelId, getSubChannels } from "@/DAL/sub-channels";
import type {
  EventRules,
  EventRulesSubChannel,
  EventTypes,
} from "@/types/api-collection";
import type { WaTemplate, WaTemplateHeaderComponent } from "@/types/whatsapp";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalizePhrase, parseTemplateParamsForBackend } from "@/lib/text-parsers";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  offset_minutes: z
    .string()
    .refine((val) => val !== "" && !Number.isNaN(Number(val)), {
      message: "Offset must be a number",
    }),
  event_type: z.string().min(1, "Event type is required"),
  sub_channel: z.string().min(1, "Sub channel is required"),
  sub_channel_type: z.string().min(1, "Sub channel type is required"),
});

type Props = {
  ruleId: string;
};

// Helper function to convert comma-separated tags to arrays for backend
// Use this function when saving to convert the comma-separated strings back to arrays
const parseTags = (tags: string) => {
  if (!tags || tags.trim() === "") {
    return []; // Return empty array for empty/null tags
  }
  return tags
    .split(",")
    .map((tag: string) => tag.trim())
    .filter(Boolean);
};

export default function FollowUpEditClient({ ruleId }: Props) {
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
  const [waTemplates, setWaTemplates] = useState<WaTemplate[]>([]);
  const [subChannels, setSubChannels] = useState<
    EventRulesSubChannel<CustomSubChannelId>[]
  >([]);
  const [currentRule, setCurrentRule] = useState<EventRules | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWaTemplates, setIsLoadingWaTemplates] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedData = useRef(false);
  const { setFollowUps } = useFollowUpStore();
  const {
    selectedTemplate,
    setSelectedTemplate,
    setFilteredTemplates,
    setTemplates,
    filteredTemplates,
    templateParams,
    setBackendTemplate,
  } = useTemplateSelectionStore();
  const { getStoredMetaTemplates, latestUpdated } = useMetaTemplatesStore(
    (store) => store
  );

  // Check if the selected template has a header media (image/video/document)
  const hasHeaderMedia = useMemo(() => {
    if (!selectedTemplate?.components) return false;
    const headerComponent = selectedTemplate.components.find(
      (c) => c.type === "HEADER"
    ) as WaTemplateHeaderComponent;
    return headerComponent && headerComponent.format !== "TEXT";
  }, [selectedTemplate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      offset_minutes: "",
      event_type: "",
      sub_channel: "",
      sub_channel_type: "",
    },
  });

  // Fetch all data on component mount
  const fetchData = async () => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [eventTypesData, subChannelsData, currentRuleData] =
        await Promise.all([
          getEventTypes(),
          getSubChannels(),
          getFollowUpById(ruleId),
        ]);
      console.log("options data", eventTypesData, subChannelsData);

      setEventTypes(eventTypesData);
      setSubChannels(subChannelsData);
      setCurrentRule(currentRuleData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ruleId) {
      fetchData();
    }
  }, [ruleId, latestUpdated, setTemplates]);

  // Load templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoadingWaTemplates(true);
        const templates = await getStoredMetaTemplates();
        setTemplates(templates);
        setWaTemplates(templates);
      } catch (error) {
        console.error("Error loading templates:", error);
      } finally {
        setIsLoadingWaTemplates(false);
      }
    };

    loadTemplates();
  }, [getStoredMetaTemplates, setTemplates]);

  // Also set loading to false when templates are available from context
  useEffect(() => {
    if (waTemplates && waTemplates.length > 0) {
      setIsLoadingWaTemplates(false);
    }
  }, [waTemplates]);

  useEffect(() => {
    if (!currentRule) return;
    const eventTypeId =
      typeof currentRule.event_type === "object" && currentRule.event_type
        ? (currentRule.event_type as EventTypes).id
        : (currentRule.event_type as string) || "";

    // Extract the sub_channel data from the current rule
    const subChannelData = currentRule.sub_channel?.[0];
    const subChannelType = subChannelData?.sub_channel || "";
    const subChannelId = subChannelData?.sub_channel_id?.id || "";

    form.reset({
      name: currentRule.name || "",
      offset_minutes: (currentRule.offset_minutes ?? "").toString(),
      event_type: eventTypeId,
      sub_channel: subChannelId,
      sub_channel_type: subChannelType,
    });

    // Connect custom_params to template context if they exist
    if (
      currentRule.custom_params &&
      typeof currentRule.custom_params === "object"
    ) {
      const customParams = currentRule.custom_params as Record<string, any>;
      if (Object.keys(customParams).length > 0) {
        setBackendTemplate(customParams);
      }
    }
  }, [currentRule, form, subChannels]);

  // Handle saving changes
  const [isPending, setIsPending] = useState(false);

  const saveChanges = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsPending(true);

      const subChannelData = subChannels?.find(
        (sc) => sc.sub_channel_id?.id === data.sub_channel
      );

      // Merge existing backend template variables with current templateParams
      const customParams =
        (currentRule?.custom_params as Record<string, any>) || {};
      const existingTemplateVariables =
        customParams?.whatsapp_template?.variables || {};

      // Convert existing backend variables to colon-separated format for the parser
      const existingVariableParams: Record<string, string> = {};
      if (existingTemplateVariables.body) {
        existingTemplateVariables.body.forEach((variable: any) => {
          if (variable.parameter_name && variable.value) {
            // Reconstruct the colon-separated path from the nested structure
            let path = `${variable.value.obj}:${variable.value.attr}`;
            if (variable.value.value && variable.value.value.attr) {
              path += `:${variable.value.value.attr}`;
              // Handle deeper nesting if needed
              if (
                variable.value.value.value &&
                variable.value.value.value.attr
              ) {
                path += `:${variable.value.value.value.attr}`;
              }
            }
            existingVariableParams[variable.parameter_name] = path;
          }
        });
      }

      const mergedTemplateParams = {
        ...templateParams,
        ...existingVariableParams,
      };

      const body: Record<string, any> = {
        id: ruleId,
        name: data.name,
        event_type: data.event_type,
        offset_minutes: Number(data.offset_minutes),
        sub_channel: [subChannelData?.id],
        custom_params: {
          event_type: "whatsapp_template",
          required_tags: parseTags(templateParams.required_tags),
          parameter_format: "POSITIONAL", //add variant from selectec template
          exclude_tags: parseTags(templateParams.exclude_tags),
          whatsapp_template: {
            ...parseTemplateParamsForBackend(mergedTemplateParams),
            template_name: selectedTemplate.name,
            language: selectedTemplate.language,
          },
        },
      };

      const updatedFollowUp = await updateFollowUp(body as EventRules);
      const updatedFollowUps = await getEventRules();
      setFollowUps(updatedFollowUps);
      return updatedFollowUp;
    } catch (error: any) {
      toast.error(error.message, { duration: 500 });
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/follow-ups">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Follow Ups
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Follow Up</h1>
            <p className="text-sm text-muted-foreground">{currentRule?.id}</p>
          </div>
          <div className="ml-auto">
            <Button
              type="submit"
              form="follow-up-form"
              disabled={isPending || isLoading || hasHeaderMedia}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
          <Card className="order-1 md:order-1">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="follow-up-form"
                  className="space-y-4"
                  onSubmit={form.handleSubmit(async (data) => {
                    try {
                      await saveChanges(data);
                    } catch (error) {
                      console.error("Form submission error:", error);
                    }
                  })}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="offset_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offset Minutes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Minutes"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <FormControl>
                          <CustomSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select an event type"
                            options={(eventTypes || [])
                              .filter((type) => type.name)
                              .map((type) => ({
                                value: type.id,
                                label: type.name!,
                              }))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {subChannels && (
                    <>
                      <FormField
                        control={form.control}
                        name="sub_channel_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub Channel Type</FormLabel>
                            <FormControl>
                              <CustomSelect
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select sub channel type"
                                options={Object.keys(
                                  subChannels.reduce(
                                    (acc, channel) => {
                                      if (channel.sub_channel) {
                                        acc[channel.sub_channel] = true;
                                      }
                                      return acc;
                                    },
                                    {} as Record<string, boolean>
                                  )
                                ).map((channelType) => ({
                                  value: channelType,
                                  label: capitalizePhrase(
                                    channelType.replace("_", " ")
                                  ),
                                }))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sub_channel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub Channel</FormLabel>
                            <FormControl>
                              <CustomSelect
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select a WhatsApp channel"
                                options={(() => {
                                  const optionsCheck: Record<string, boolean> =
                                    {};
                                  const uniqueOptions: {
                                    id: string;
                                    name: string;
                                  }[] = [];

                                  for (const element of subChannels) {
                                    // filter by sub channel type
                                    if (
                                      element.sub_channel !==
                                      form.watch("sub_channel_type")
                                    )
                                      continue;
                                    // doesnt have sub_channel_id, continue
                                    if (!element.sub_channel_id) continue;
                                    // already added, continue
                                    if (optionsCheck[element.sub_channel_id.id])
                                      continue;
                                    // add to unique options
                                    uniqueOptions.push({
                                      id: element.sub_channel_id.id,
                                      name: element.sub_channel_id.name,
                                    });
                                    optionsCheck[element.sub_channel_id.id] =
                                      true;
                                  }

                                  return uniqueOptions.map((option) => ({
                                    value: option.id,
                                    label: option.name,
                                  }));
                                })()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="order-2 md:order-3 md:col-span-2">
            <CardHeader>
              <CardTitle>Template and Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">
                    WhatsApp Template
                  </div>
                  {isLoadingWaTemplates ? (
                    <div className="text-sm text-muted-foreground">
                      Loading templates...
                    </div>
                  ) : (
                    <SearchableSelect
                      items={
                        filteredTemplates.length > 0
                          ? filteredTemplates.map((template) => ({
                              ...template,
                              label: `${template.name} (${template.language})`,
                            }))
                          : waTemplates?.filter(Boolean).map((template) => ({
                              ...template,
                              label: `${template.name} (${template.language})`,
                            })) || []
                      }
                      className="mt-1"
                      filterHandler={(query) => {
                        // Filter templates based on query
                        if (!query.trim()) {
                          // If query is empty, don't show any templates
                          // Templates should only show when user searches or when custom_params contain template info
                          setFilteredTemplates([]);
                        } else {
                          const filtered = waTemplates?.filter((template) =>
                            template.name
                              .toLowerCase()
                              .includes(query.toLowerCase())
                          );
                          setFilteredTemplates(filtered || []);
                        }
                      }}
                      itemLabel={
                        selectedTemplate?.name
                          ? `${selectedTemplate.name} (${selectedTemplate.language})`
                          : ""
                      }
                      onSelect={(template) => {
                        setSelectedTemplate(template);
                      }}
                    />
                  )}

                  {/* Warning if template has header media */}
                  {hasHeaderMedia && selectedTemplate?.name && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        Template not supported - This template has a header
                        image
                      </div>
                    </div>
                  )}
                </div>
                <TemplateVariables />

                {/* <ReworkVariables /> */}
              </div>
            </CardContent>
          </Card>

          <Card className="order-3 md:order-2">
            <CardContent>
              <TemplatePreview />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* extra space so the dropdowns have space to show */}
      <div className="h-40 w-full"></div>
    </div>
  );
}
