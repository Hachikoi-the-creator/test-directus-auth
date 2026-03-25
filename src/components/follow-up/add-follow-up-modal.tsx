"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFollowUpStore } from "@/context/follow-up-context";
import { type ChawootWhatsapp, type EventTypes } from "@/types/api-collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import LoadingSkeleton from "./loading-skeleton";
import { getChatwootWhatsapp } from "@/DAL/chatwoot-whatsapp";
import { createEventRule, getEventRules } from "@/DAL/event-rules";
import { getEventTypes } from "@/DAL/event-types";

type Props = {
  token: string;
};

export const formSchema = z.object({
  offset_minutes: z.string().min(1, "Offset minutes is required"),
  name: z.string().min(1, "Name is required"),
  event_type: z.string().min(1, "Event type is required"),
  sub_channel: z.string().min(1, "Channel is required"),
  custom_params: z.record(z.string(), z.any()),
});

export default function AddFollowUpModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [chatwootWatsapp, setChatwootWatsapp] = useState<ChawootWhatsapp[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<Error | null>(null);

  const { setFollowUps } = useFollowUpStore();
  const hasFetchedData = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      offset_minutes: "",
      event_type: "",
      sub_channel: "",
      custom_params: {},
    },
  });

  // Fetch data on component mount
  const fetchData = async () => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    try {
      setIsLoadingData(true);
      setDataError(null);

      const [chatwootData, eventTypesData] = await Promise.all([
        getChatwootWhatsapp(),
        getEventTypes(),
      ]);

      setChatwootWatsapp(chatwootData);
      setEventTypes(eventTypesData);
    } catch (err) {
      setDataError(err as Error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFollowUp = async ({
    name,
    offset_minutes,
    event_type,
    sub_channel,
  }: {
    name: string;
    offset_minutes: number;
    event_type: string;
    sub_channel: string[];
  }) => {
    try {
      setIsPending(true);
      const newFollowUp = await createEventRule({
        name,
        offset_minutes,
        custom_params: {},
        event_type: event_type,
        sub_channel: sub_channel,
      });

      // Fetch updated follow ups
      const updatedFollowUps = await getEventRules();
      setFollowUps(updatedFollowUps);

      setIsModalOpen(false);
      toast.success("Follow up added");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create event rule", {
        duration: 5000,
      });
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    try {
      handleCreateFollowUp({
        name: data.name,
        offset_minutes: Number(data.offset_minutes),
        event_type: data.event_type,
        sub_channel: [data.sub_channel],
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit form");
    }
  }, []);

  if (isLoadingData || isPending) {
    return <LoadingSkeleton />;
  }
  if (dataError) {
    return <div>Error loading data</div>;
  }

  return (
    <Dialog
      onOpenChange={(val: boolean) => {
        if (!val) form.reset();
        setIsModalOpen(val);
      }}
      open={isModalOpen}
    >
      <DialogTrigger asChild>
        <Button variant="default">Add new Follow Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Follow Up</DialogTitle>
          <DialogDescription>New follow up details</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.log("Form validation failed:", errors);
                })}
                className="mx-auto max-w-3xl space-y-4 py-3"
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
                          placeholder="Enter offset in minutes"
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(eventTypes as EventTypes[])?.map(
                            (type: EventTypes) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sub_channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chatwoot WhatsApp Channel</FormLabel>
                      <FormControl>
                        <ScrollArea className="h-[240px] w-full rounded-md border">
                          <div className="p-1">
                            {chatwootWatsapp?.map((channel) => {
                              const selected = field.value === channel.id;
                              return (
                                <button
                                  type="button"
                                  key={channel.id}
                                  onClick={() => field.onChange(channel.id)}
                                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                    selected
                                      ? "bg-primary/10 text-purple-600 dark:text-purple-300"
                                      : "hover:bg-muted hover:dark:bg-muted/70"
                                  }`}
                                >
                                  <span className="truncate">
                                    {channel.name}
                                  </span>
                                  {selected ? (
                                    <Check className="h-4 w-4" />
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Follow Up"}
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
