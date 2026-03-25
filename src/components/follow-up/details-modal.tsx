import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type EventRules } from "@/types/api-collection";
import { type WaTemplate } from "@/types/whatsapp";
import { Calendar, Clock, MessageCircle, User } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/utils";

type Props = {
  followUp: EventRules;
  currentTemplate: WaTemplate | null;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

const getComponentByType = (components: any[] | undefined, type: string) => {
  return (components || []).find((c) => c.type === type);
};

// Extract example values from template components
const extractExampleValues = (components: any[] | undefined) => {
  const examples: Record<string, string> = {};

  if (!components) return examples;

  components.forEach((component) => {
    if (component.type === "BODY" && component.example) {
      // Handle body examples
      if ("body_text" in component.example && component.example.body_text) {
        // For templates with numbered parameters like {{1}}, {{2}}
        if (component.example.body_text.length > 0) {
          const firstExample = component.example.body_text[0];
          if (firstExample && Array.isArray(firstExample)) {
            firstExample.forEach((value, index) => {
              examples[`param${index + 1}`] = value || "";
            });
          }
        }
      } else if (
        "body_text_named_params" in component.example &&
        component.example.body_text_named_params
      ) {
        // For templates with named parameters like {{customer_name}}
        if (component.example.body_text_named_params.length > 0) {
          const firstExample = component.example.body_text_named_params[0];
          if (firstExample && Array.isArray(firstExample)) {
            firstExample.forEach((value, index) => {
              examples[`param${index + 1}`] = value || "";
            });
          }
        }
      }
    } else if (component.type === "HEADER" && component.example) {
      // Handle header examples
      if ("header_text" in component.example && component.example.header_text) {
        // For text headers with numbered parameters
        if (component.example.header_text.length > 0) {
          const firstExample = component.example.header_text[0];
          if (firstExample && Array.isArray(firstExample)) {
            firstExample.forEach((value, index) => {
              examples[`param${index + 1}`] = value || "";
            });
          }
        }
      } else if (
        "header_text_named_params" in component.example &&
        component.example.header_text_named_params
      ) {
        // For text headers with named parameters
        if (component.example.header_text_named_params.length > 0) {
          const firstExample = component.example.header_text_named_params[0];
          if (firstExample && Array.isArray(firstExample)) {
            firstExample.forEach((value, index) => {
              examples[`param${index + 1}`] = value || "";
            });
          }
        }
      }
    }
  });

  return examples;
};

const replacePlaceholders = (
  text: string,
  examples: Record<string, string>
) => {
  if (!text) return "";
  return text.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    const paramKey = /^\d+$/.test(trimmedKey)
      ? `param${trimmedKey}`
      : trimmedKey;
    const value = examples[paramKey];

    if (value !== undefined) {
      // Replace with the actual value and keep blue highlighting
      return `<span class="bg-blue-200 dark:bg-blue-800 px-1 rounded text-blue-900 dark:text-blue-100 font-mono">${String(value)}</span>`;
    }

    // Show unresolved placeholders with yellow highlighting
    return `<span class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded text-yellow-900 dark:text-yellow-100 font-mono">{{${trimmedKey}}}</span>`;
  });
};

export default function DetailsModal({
  followUp,
  isModalOpen,
  setIsModalOpen,
  currentTemplate,
}: Props) {
  // Template preview logic using the same functions as template-preview.tsx
  const bodyComponent = useMemo(() => {
    return getComponentByType(currentTemplate?.components, "BODY");
  }, [currentTemplate]);

  const headerComponent = useMemo(() => {
    return getComponentByType(currentTemplate?.components, "HEADER");
  }, [currentTemplate]);

  const buttonsComponent = useMemo(() => {
    return getComponentByType(currentTemplate?.components, "BUTTONS");
  }, [currentTemplate]);

  const previewBody = useMemo(() => {
    if (!bodyComponent?.text) return "";
    const examples = extractExampleValues(currentTemplate?.components);
    return replacePlaceholders(bodyComponent.text, examples);
  }, [bodyComponent, currentTemplate?.components]);

  const previewHeader = useMemo(() => {
    if (!headerComponent || headerComponent.format !== "TEXT") return "";
    const examples = extractExampleValues(currentTemplate?.components);
    return replacePlaceholders(headerComponent.text, examples);
  }, [headerComponent, currentTemplate?.components]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {followUp.name || "Unnamed Rule"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)] pr-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Offset Minutes</Label>
              </div>
              <p className="ml-6">{followUp.offset_minutes} minutes</p>

              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Event Type</Label>
              </div>
              {typeof followUp.event_type === "string" ? (
                <p className="ml-6">{followUp.event_type || "Not specified"}</p>
              ) : (
                <Badge className="ml-6" variant="outline">
                  {followUp.event_type?.name || "Not specified"}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Created At</Label>
              </div>
              <p className="ml-6">{formatDate(followUp.date_created || "")}</p>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Last Updated</Label>
              </div>
              <p className="ml-6">
                {followUp.date_updated
                  ? formatDate(followUp.date_updated)
                  : "-"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Full uuid</Label>
              </div>
              <p className="ml-6">{followUp.id}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Sub Channel</Label>
              </div>
              <p className="ml-6">
                {followUp.sub_channel[0]?.sub_channel_id?.name}
              </p>
            </div>
          </div>

          {/* WhatsApp Template Preview */}
          <div className="border rounded-lg p-4">
            <Label className="font-semibold text-green-800 mb-3 block">
              WhatsApp Template Preview
            </Label>

            {currentTemplate ? (
              <div className="space-y-4">
                {/* Template Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {currentTemplate?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentTemplate?.language} • {currentTemplate?.status}
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <div className="text-xs text-blue-800 dark:text-blue-200">
                    Variables in template, replaced values with example values
                    (blue highlighted)
                  </div>
                </div>

                {/* Header Preview */}
                {headerComponent && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Header
                    </div>
                    {headerComponent.format === "TEXT" ? (
                      <div className="space-y-2">
                        {/* Header with Replaced Values */}
                        <div className="p-3 bg-muted rounded-md">
                          <div className="text-xs text-muted-foreground mb-2">
                            Header with Values (Replaced variables highlighted):
                          </div>
                          <div
                            dangerouslySetInnerHTML={{ __html: previewHeader }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-sm font-medium">
                          {headerComponent.format}
                        </div>
                        <div className="text-xs text-muted-foreground break-all">
                          [Media URL]
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Body Preview */}
                {bodyComponent && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Body
                    </div>

                    {/* Template with Replaced Values */}
                    <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                      <div className="text-xs text-muted-foreground mb-2">
                        Template with Values:
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: previewBody,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Buttons Preview */}
                {buttonsComponent?.buttons &&
                  buttonsComponent.buttons.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Buttons
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {buttonsComponent.buttons.map(
                          (button: any, index: number) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                            >
                              {button.text}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      No Template Configured
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This follow-up doesn't have a WhatsApp template
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure a WhatsApp template in the follow-up settings to see
                  a preview here.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
