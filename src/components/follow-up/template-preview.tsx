import { useTemplateSelectionStore } from "@/context/templates-context";
import { useMemo } from "react";

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

export default function TemplatePreview() {
  const { selectedTemplate, templateParams } = useTemplateSelectionStore();

  const bodyComponent = useMemo(() => {
    return getComponentByType(selectedTemplate.components, "BODY");
  }, [selectedTemplate]);

  const headerComponent = useMemo(() => {
    return getComponentByType(selectedTemplate.components, "HEADER");
  }, [selectedTemplate]);

  const buttonsComponent = useMemo(() => {
    return getComponentByType(selectedTemplate.components, "BUTTONS");
  }, [selectedTemplate]);

  const previewBody = useMemo(() => {
    if (!bodyComponent?.text) return "";
    const examples = extractExampleValues(selectedTemplate.components);
    return replacePlaceholders(bodyComponent.text, examples);
  }, [bodyComponent, selectedTemplate.components]);

  const previewHeader = useMemo(() => {
    if (!headerComponent || headerComponent.format !== "TEXT") return "";
    const examples = extractExampleValues(selectedTemplate.components);
    return replacePlaceholders(headerComponent.text, examples);
  }, [headerComponent, selectedTemplate.components]);

  const previewHeaderMedia = useMemo(() => {
    if (!headerComponent || headerComponent.format === "TEXT") return "";
    return templateParams.header_media_url || `[${headerComponent.format} URL]`;
  }, [headerComponent, templateParams]);

  if (!selectedTemplate.name) {
    return (
      <div>
        <div className="text-lg font-semibold mb-2 py-6">Template Preview</div>
        <p className="text-muted-foreground">
          Select a template to see preview
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full py-6">
      <div>
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Template Preview
        </h3>
        <p className="text-sm text-muted-foreground">
          {selectedTemplate.name} ({selectedTemplate.language})
        </p>

        {/* Legend */}
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-blue-800 dark:text-blue-200">
            Variables in template, replaced values whit example values (blue
            highlighted)
          </div>
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
                <div dangerouslySetInnerHTML={{ __html: previewHeader }} />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm font-medium">
                {headerComponent.format}
              </div>
              <div className="text-xs text-muted-foreground break-all">
                {previewHeaderMedia}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Body Preview */}
      {bodyComponent && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Body</div>

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
      {buttonsComponent?.buttons && buttonsComponent.buttons.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Buttons
          </div>
          <div className="flex flex-wrap gap-2">
            {buttonsComponent.buttons.map((button: any, index: number) => (
              <div
                key={index}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                {button.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
