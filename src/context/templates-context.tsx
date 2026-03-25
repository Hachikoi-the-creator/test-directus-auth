"use client";

import { type WaTemplate, type WaTemplateComponent } from "@/types/whatsapp";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// New types for nested variable paths
type VariablePath = {
  obj: string;
  attr: string;
  value?: VariablePath; // For nested paths
};

type TemplateVariable = {
  type: "text" | "image" | "video" | "document";
  parameter_name: string;
  value: VariablePath;
};

type TemplateVariables = {
  body: TemplateVariable[];
  header?: TemplateVariable[];
};

const defaultTemplate: WaTemplate = {
  name: "", // Empty string to indicate no template selected
  parameter_format: "",
  components: [],
  language: "",
  status: "APPROVED",
  category: "",
  sub_category: "",
};

const extractDefaultValues = (
  components: WaTemplateComponent[] | undefined
) => {
  const defaults: Record<string, string> = {};

  if (!components) return defaults;

  components.forEach((component) => {
    if (component.type === "BODY" && component.example) {
      // Handle body examples
      if ("body_text" in component.example && component.example.body_text) {
        // For templates with numbered parameters like {{1}}, {{2}}
        // Each inner array contains values for all parameters in order
        if (component.example.body_text.length > 0) {
          const firstExample = component.example.body_text[0];
          if (firstExample && Array.isArray(firstExample)) {
            firstExample.forEach((value, index) => {
              defaults[`param${index + 1}`] = value || "";
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
              // For named params, we need to extract the actual parameter names
              // This is a simplified approach - you might need to adjust based on your data structure
              defaults[`param${index + 1}`] = value || "";
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
              defaults[`param${index + 1}`] = value || "";
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
              defaults[`param${index + 1}`] = value || "";
            });
          }
        }
      }
    }
  });

  return defaults;
};

type TemplateSelectionState = {
  selectedTemplate: WaTemplate;
  templates: WaTemplate[];
  filteredTemplates: WaTemplate[];
  templateParams: Record<string, any> & {
    variables?: TemplateVariables;
  };
  backendTemplate: Record<string, any>;
  setSelectedTemplate: (template: WaTemplate) => void;
  setTemplates: (templates: WaTemplate[]) => void;
  setFilteredTemplates: (templates: WaTemplate[]) => void;
  setTemplateParams: (params: Record<string, any>) => void;
  setBackendTemplate: (template: Record<string, any>) => void;
};

export const useTemplateSelectionStore = create<TemplateSelectionState>()(
  devtools((set, get) => ({
    selectedTemplate: defaultTemplate,
    templates: [],
    filteredTemplates: [],
    templateParams: {},
    backendTemplate: defaultTemplate,
    setFilteredTemplates: (templates: WaTemplate[]) =>
      set({ filteredTemplates: templates }),
    setSelectedTemplate: (template: WaTemplate) =>
      set({ selectedTemplate: template }),
    setTemplates: (templates: WaTemplate[]) => set({ templates: templates }),
    setTemplateParams: (params: Record<string, any>) =>
      set({ templateParams: params }),
    setBackendTemplate: (template: Record<string, any>) =>
      set({ backendTemplate: template }),
  }))
);
