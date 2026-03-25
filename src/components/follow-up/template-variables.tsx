import { useTemplateSelectionStore } from "@/context/templates-context";
import {
  type WaTemplateComponent,
  type WaTemplateHeaderComponent,
} from "@/types/whatsapp";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CustomSelect from "../ui/custom-select";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { processPropertyForNestedOptions } from "@/lib/text-parsers";
import { getTemplateVariables } from "@/DAL/whatsapp-meta-template";

// Types needed for the context
type VariablePath = {
  obj: string;
  attr: string;
  value?: VariablePath;
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

const extractPlaceholders = (text?: string) => {
  if (!text) return [] as string[];
  const regex = /\{\{\s*([^}]+)\s*\}\}/g;
  const keys = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    const raw = (match[1] || "").trim();
    // Keep keys as they are - backend uses numeric keys (1, 2) and frontend should match
    const key = raw;
    if (key) keys.add(key);
  }
  return Array.from(keys);
};

const getComponentByType = (
  components: WaTemplateComponent[] | undefined,
  type: WaTemplateComponent["type"]
) => {
  return (components || []).find((c) => c.type === type) as any;
};

// Types for the unique ID-based selection system
type TableType = "leads" | "companies" | "contacts" | "events";

type SelectionObject = {
  id: string;
  parentId: string | null;
  value: string;
  tableType?: TableType;
  isJson?: boolean;
  jsonKeys?: string[];
  level: number;
};

// Types for custom field handling
type CustomFieldValue = {
  [key: string]: any;
};

type CustomFieldInfo = {
  isCustom: boolean;
  isJson: boolean;
  nestedKeys?: string[];
  originalValue?: any;
};

// Helper function to normalize keys to match backend format
const normalizeKey = (key: string): string => {
  // If key is already numeric (1, 2), keep it as is
  if (/^\d+$/.test(key)) return key;
  // If key starts with 'param', remove it to get the numeric part
  if (key.startsWith("param")) return key.replace(/^param/, "");
  // Otherwise return the key as is
  return key;
};

const getTableOptions = (tableType: TableType, data: any[]) => {
  // Return empty array if no data
  if (!data || data.length === 0) return [];

  // Get the first item to extract available properties
  const sampleItem = data[0];
  if (!sampleItem) return [];

  // Extract all available properties from the sample item
  const properties = Object.keys(sampleItem).filter((key) => {
    const value = sampleItem[key];
    return value !== null && value !== undefined && typeof value !== "function";
  });

  // Return properties as options
  return properties.map((prop) => ({
    value: prop,
    label: prop,
  }));
};

export default function TemplateVariables() {
  const [templateVariables, setTemplateVariables] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasRequested = useRef(false);

  // Fetch template variables on component mount
  const fetchTemplateVariables = async () => {
    if (hasRequested.current) return;

    hasRequested.current = true;
    setIsLoading(true);

    try {
      const data = await getTemplateVariables();
      setTemplateVariables(data);
    } catch (error) {
      console.error("Error fetching template variables:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateVariables();
  }, []);

  const {
    selectedTemplate,
    templateParams,
    setTemplateParams,
    templates,
    backendTemplate,
    setSelectedTemplate,
  } = useTemplateSelectionStore();

  // Local state for unique ID-based selections
  const [selections, setSelections] = useState<SelectionObject[]>([]);

  // Helper functions for managing selections
  const addSelection = (
    selection: Omit<SelectionObject, "id">
  ): SelectionObject => {
    const newSelection: SelectionObject = {
      ...selection,
      id: uuidv4(),
    };
    setSelections((prev) => [...prev, newSelection]);
    return newSelection;
  };

  const removeSelectionAndChildren = (id: string) => {
    const toRemove = new Set<string>();

    // Find all children recursively
    const findChildren = (parentId: string) => {
      selections.forEach((selection) => {
        if (selection.parentId === parentId) {
          toRemove.add(selection.id);
          findChildren(selection.id);
        }
      });
    };

    toRemove.add(id);
    findChildren(id);

    setSelections((prev) =>
      prev.filter((selection) => !toRemove.has(selection.id))
    );
  };

  const getSelectionsByParent = (
    parentId: string | null
  ): SelectionObject[] => {
    return selections.filter((selection) => selection.parentId === parentId);
  };

  const getSelectionPath = (id: string): string[] => {
    const path: string[] = [];

    const buildPath = (currentId: string) => {
      const selection = selections.find((s) => s.id === currentId);
      if (selection) {
        path.unshift(selection.value);
        if (selection.parentId) {
          buildPath(selection.parentId);
        }
      }
    };

    buildPath(id);
    return path;
  };

  // Auto-select template from backendTemplate when templates are available
  useEffect(() => {
    if (
      templates &&
      templates.length > 0 &&
      backendTemplate &&
      backendTemplate.whatsapp_template &&
      backendTemplate.whatsapp_template.template_name
    ) {
      // Try to find a matching template by name
      const backendTemplateName =
        backendTemplate.whatsapp_template.template_name;

      const matchingTemplate = templates
        .filter(Boolean)
        .find((template) => template.name === backendTemplateName);
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate);

        // Populate variables from backend response
        if (backendTemplate.whatsapp_template.variables) {
          // Update template params first
          setTemplateParams({
            ...templateParams,
            variables: backendTemplate.whatsapp_template.variables,
          });

          // Also populate the individual variable values for backward compatibility
          if (backendTemplate.whatsapp_template.variables.body) {
            const variableParams: Record<string, any> = {};
            backendTemplate.whatsapp_template.variables.body.forEach(
              (variable: TemplateVariable) => {
                if (variable.parameter_name) {
                  // Ensure the key is normalized to match the expected format
                  const normalizedKey = normalizeKey(variable.parameter_name);
                  variableParams[normalizedKey] =
                    `${variable.value.obj}:${variable.value.attr}`;
                }
              }
            );

            if (Object.keys(variableParams).length > 0) {
              setTemplateParams({
                ...templateParams,
                ...variableParams,
                variables: backendTemplate.whatsapp_template.variables,
              });
            }
          }
        }

        // Populate tags from backend response if they exist
        if (backendTemplate.required_tags || backendTemplate.exclude_tags) {
          setTemplateParams({
            ...templateParams,
            required_tags: backendTemplate.required_tags
              ? backendTemplate.required_tags.join(", ")
              : "",
            exclude_tags: backendTemplate.exclude_tags
              ? backendTemplate.exclude_tags.join(", ")
              : "",
            variables:
              backendTemplate.whatsapp_template?.variables ||
              templateParams.variables,
          });
        }
      }
    }
  }, [templates, backendTemplate, setSelectedTemplate]);

  // Pre-populate variable selections when templateParams changes
  useEffect(() => {
    if (templateParams && Object.keys(templateParams).length > 0) {
      // Clear existing selections first
      setSelections([]);

      Object.entries(templateParams).forEach(([key, value]) => {
        if (value && typeof value === "string" && value.includes(":")) {
          // Parse values that are in format "tableType:propertyPath"
          const parts = value.split(":");
          if (parts.length >= 2) {
            const tableType = parts[0] as TableType;
            const propertyPath = parts.slice(1);
            const normalizedKey = normalizeKey(key);

            // Create root selection for table type
            const rootSelection = addSelection({
              parentId: `root-${normalizedKey}`,
              value: tableType,
              tableType,
              level: 0,
            });

            // Create nested selections for each property in the path
            let currentParentId = rootSelection.id;
            propertyPath.forEach((property, index) => {
              const childSelection = addSelection({
                parentId: currentParentId,
                value: property,
                level: index + 1,
              });
              currentParentId = childSelection.id;
            });
          }
        }
      });
    }
  }, [templateParams]);

  const handleParamChange = (key: string, value: string) => {
    // Normalize the key to match backend format
    const normalizedKey = normalizeKey(key);
    setTemplateParams({
      ...templateParams,
      [normalizedKey]: value,
    });
  };

  const getTableData = (tableType: TableType) => {
    if (!templateVariables) return [];

    const tableDataMap: Record<string, any[]> = {
      leads: templateVariables?.leads || [],
      companies: templateVariables?.companies || [],
      contacts: templateVariables?.contacts || [],
      events: templateVariables?.events || [],
    };
    return tableDataMap[tableType] || [];
  };

  const getObjectKeys = (obj: any): string[] => {
    if (!obj || typeof obj !== "object") return [];

    const keys: string[] = [];

    Object.keys(obj).forEach((key) => {
      if (
        obj[key] !== null &&
        obj[key] !== undefined &&
        typeof obj[key] !== "function"
      ) {
        keys.push(key);
      }
    });

    return keys;
  };

  // Helper function to get nested options for custom fields
  const getCustomFieldNestedOptions = (
    obj: any,
    customKey: string
  ): { value: string; label: string }[] => {
    const customValue = obj[customKey];
    if (!customValue || typeof customValue !== "string") return [];

    try {
      const parsed = JSON.parse(customValue);
      if (parsed && typeof parsed === "object") {
        return Object.keys(parsed).map((nestedKey) => ({
          value: nestedKey,
          label: nestedKey,
        }));
      }
    } catch {
      // Not JSON
    }

    return [];
  };

  // Helper function to check if a value is a nested object that can be expanded
  const canExpandNestedObject = (obj: any, path: string[]): boolean => {
    if (path.length === 0) return false;

    const currentValue = getNestedValue(obj, path);
    if (!currentValue || typeof currentValue !== "object") return false;

    // If it's a string, try to parse as JSON
    if (typeof currentValue === "string") {
      try {
        const parsed = JSON.parse(currentValue);
        return (
          parsed && typeof parsed === "object" && Object.keys(parsed).length > 0
        );
      } catch {
        return false;
      }
    }

    // If it's already an object, check if it has properties
    return Object.keys(currentValue).length > 0;
  };

  const getNestedValue = (obj: any, path: string[]): any => {
    return path.reduce((current, key) => {
      if (!current) return undefined;

      // Check if this is a nested custom field (e.g., "custom_field.nested_property")
      if (key.includes(".")) {
        const [customKey, nestedKey] = key.split(".");
        const customValue = current[customKey];

        // If the custom field exists and is a string, try to parse it as JSON
        if (customValue && typeof customValue === "string") {
          try {
            const parsed = JSON.parse(customValue);
            return parsed[nestedKey];
          } catch {
            return undefined;
          }
        }
        return undefined;
      }

      const value = current[key];

      // If the value is a JSON string, try to parse it for the next iteration
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          // Only return the parsed object if it's actually an object
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return parsed;
          }
          // If it's not an object (e.g., string, number, array), return the original value
          return value;
        } catch {
          // Not JSON, return the string value
          return value;
        }
      }

      return value;
    }, obj);
  };

  // Helper function to format custom field values for display
  const formatCustomFieldValue = (value: any): string => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === "object") {
          return `JSON Object (${Object.keys(parsed).length} properties)`;
        }
      } catch {
        // Not JSON, return as is
      }
    }
    return String(value);
  };

  const bodyComponent = useMemo(() => {
    return getComponentByType(selectedTemplate.components, "BODY") as
      | {
          type: "BODY";
          text: string;
        }
      | undefined;
  }, [selectedTemplate]);

  const headerComponent = useMemo(() => {
    return getComponentByType(selectedTemplate.components, "HEADER") as
      | WaTemplateHeaderComponent
      | undefined;
  }, [selectedTemplate]);

  const bodyPlaceholders = useMemo(() => {
    return extractPlaceholders(bodyComponent?.text);
  }, [bodyComponent]);

  const headerTextPlaceholders = useMemo(() => {
    if (!headerComponent || headerComponent.format !== "TEXT")
      return [] as string[];
    return extractPlaceholders(headerComponent.text);
  }, [headerComponent]);

  const renderVariableSelector = (key: string) => {
    const normalizedKey = normalizeKey(key);

    // Get the root selection for this variable (table type)
    const rootParentId = `root-${normalizedKey}`;
    const rootSelection = selections.find(
      (selection) => selection.parentId === rootParentId
    );

    // Get property selections (children of the root)
    const propertySelections = selections.filter(
      (selection) => selection.parentId === rootSelection?.id
    );

    // Get nested property selections (children of properties)
    const nestedPropertySelections = selections.filter((selection) =>
      propertySelections.some((prop) => prop.id === selection.parentId)
    );

    // Get deeply nested property selections (children of nested properties)
    const deepNestedPropertySelections = selections.filter((selection) =>
      nestedPropertySelections.some(
        (nested) => nested.id === selection.parentId
      )
    );

    // Handle table type selection
    const handleTableTypeChange = (value: TableType) => {
      // Remove all existing selections for this variable
      const toRemove = [
        ...(rootSelection ? [rootSelection.id] : []),
        ...propertySelections.map((s) => s.id),
        ...nestedPropertySelections.map((s) => s.id),
        ...deepNestedPropertySelections.map((s) => s.id),
      ];
      setSelections((prev) =>
        prev.filter((selection) => !toRemove.includes(selection.id))
      );

      // Create new root selection
      const newSelection = addSelection({
        parentId: `root-${normalizedKey}`,
        value,
        tableType: value,
        level: 0,
      });
    };

    // Handle property selection
    const handlePropertyChange = (value: string) => {
      if (!rootSelection) return;

      // Remove existing property selections and their nested selections for this variable
      const toRemove = [
        ...propertySelections.map((s) => s.id),
        ...nestedPropertySelections.map((s) => s.id),
        ...deepNestedPropertySelections.map((s) => s.id),
      ];
      setSelections((prev) =>
        prev.filter((selection) => !toRemove.includes(selection.id))
      );

      // Create new property selection
      const newPropertySelection = addSelection({
        parentId: rootSelection.id,
        value,
        level: 1,
      });

      // Update template params
      setTemplateParams({
        ...templateParams,
        [normalizedKey]: `${rootSelection.value}:${value}`,
      });
    };

    // Get nested property options if we have a selected property
    const getNestedOptions = () => {
      if (!rootSelection || propertySelections.length === 0) return [];

      const selectedProperty = propertySelections[0];
      const tableType = rootSelection.tableType;
      if (!tableType) return [];

      const sampleData = getTableData(tableType);
      if (!sampleData || sampleData.length === 0) return [];

      // Loop through all items to find one with actual values in the selected property
      for (let i = 0; i < sampleData.length; i++) {
        const item = sampleData[i];
        const value = getNestedValue(item, [selectedProperty.value]);

        // Process the property value using the helper function
        const nestedOptions = processPropertyForNestedOptions(value);
        if (nestedOptions) {
          return nestedOptions;
        }
      }

      return [];
    };

    // Get deep nested property options (for properties like whatsapp_template.name)
    const getDeepNestedOptions = () => {
      if (!rootSelection || nestedPropertySelections.length === 0) return [];

      const selectedNestedProperty = nestedPropertySelections[0];
      const tableType = rootSelection.tableType;
      if (!tableType) return [];

      const sampleData = getTableData(tableType);
      if (!sampleData || sampleData.length === 0) return [];

      // Loop through all items to find one with actual values in the deep nested property
      for (let i = 0; i < sampleData.length; i++) {
        const item = sampleData[i];
        const propertyPath = [
          propertySelections[0]?.value,
          selectedNestedProperty.value,
        ].filter(Boolean);

        const value = getNestedValue(item, propertyPath);

        // Process the property value using the helper function
        const deepNestedOptions = processPropertyForNestedOptions(value);
        if (deepNestedOptions) {
          return deepNestedOptions;
        }
      }

      return [];
    };

    // Handle nested property selection
    const handleNestedPropertyChange = (value: string) => {
      if (!rootSelection || propertySelections.length === 0) return;

      const selectedProperty = propertySelections[0];

      // Remove existing nested selections for this property
      const existingNestedSelections = selections.filter(
        (s) => s.parentId === selectedProperty.id
      );
      const toRemove = existingNestedSelections.map((s) => s.id);
      setSelections((prev) =>
        prev.filter((selection) => !toRemove.includes(selection.id))
      );

      // Create new nested property selection
      const newNestedSelection = addSelection({
        parentId: selectedProperty.id,
        value,
        level: 2,
      });

      // Update template params with nested path
      setTemplateParams({
        ...templateParams,
        [normalizedKey]: `${rootSelection.value}:${selectedProperty.value}:${value}`,
      });
    };

    // Handle deep nested property selection (for properties like whatsapp_template.name)
    const handleDeepNestedPropertyChange = (value: string) => {
      if (!rootSelection || nestedPropertySelections.length === 0) return;

      const selectedNestedProperty = nestedPropertySelections[0];

      // Remove existing deep nested selections for this property
      const existingDeepNestedSelections = selections.filter(
        (s) => s.parentId === selectedNestedProperty.id
      );
      const toRemove = existingDeepNestedSelections.map((s) => s.id);
      setSelections((prev) =>
        prev.filter((selection) => !toRemove.includes(selection.id))
      );

      // Create new deep nested property selection
      const newDeepNestedSelection = addSelection({
        parentId: selectedNestedProperty.id,
        value,
        level: 3,
      });

      // Update template params with deep nested path
      const propertyPath = [
        propertySelections[0]?.value,
        selectedNestedProperty.value,
        value,
      ].filter(Boolean);

      setTemplateParams({
        ...templateParams,
        [normalizedKey]: `${rootSelection.value}:${propertyPath.join(":")}`,
      });
    };

    return (
      <div className="space-y-2">
        {/* Table Type Selection */}
        <Select
          value={rootSelection?.value || ""}
          onValueChange={handleTableTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="companies">Companies</SelectItem>
            <SelectItem value="contacts">Contacts</SelectItem>
            <SelectItem value="events">Events</SelectItem>
          </SelectContent>
        </Select>

        {/* Property Selection */}
        {rootSelection && (
          <CustomSelect
            value={propertySelections[0]?.value || ""}
            onValueChange={handlePropertyChange}
            placeholder="Select property"
            options={getTableOptions(
              rootSelection.tableType!,
              getTableData(rootSelection.tableType!)
            )}
          />
        )}

        {/* Nested Property Selection */}
        {rootSelection &&
          propertySelections.length > 0 &&
          (() => {
            const nestedOptions = getNestedOptions();
            if (nestedOptions.length > 0) {
              const selectedNestedValue =
                nestedPropertySelections[0]?.value || "";
              return (
                <CustomSelect
                  value={selectedNestedValue}
                  onValueChange={handleNestedPropertyChange}
                  placeholder="Select nested property"
                  options={nestedOptions}
                />
              );
            }
            return null;
          })()}

        {/* Deep Nested Property Selection */}
        {rootSelection &&
          nestedPropertySelections.length > 0 &&
          (() => {
            const deepNestedOptions = getDeepNestedOptions();
            if (deepNestedOptions.length > 0) {
              const selectedDeepNestedValue =
                deepNestedPropertySelections[0]?.value || "";
              return (
                <CustomSelect
                  value={selectedDeepNestedValue}
                  onValueChange={handleDeepNestedPropertyChange}
                  placeholder="Select deep nested property"
                  options={deepNestedOptions}
                />
              );
            }
            return null;
          })()}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading template variables...</div>;
  }

  function renderVariablePath(value: any): any {
    if (!value) return null;

    const pathElements: JSX.Element[] = [];
    let current = value;
    let depth = 0;
    const maxDepth = 10; // Prevent infinite loops

    // Use for loop instead of while loop for better debugging
    for (let i = 0; i < maxDepth && current; i++) {
      if (current.obj && current.attr) {
        pathElements.push(
          <span key={`${current.obj}-${current.attr}-${depth}`}>
            {" "}
            <span className="text-gray-500">&rarr;</span>{" "}
            <span className="italic">{current.obj}</span>{" "}
            <span className="text-gray-500">&rarr;</span>{" "}
            <span className="italic">{current.attr}</span>
          </span>
        );
        depth++;
      }
      current = current.value;
    }

    return pathElements;
  }

  // Helper function to get the current selection path for a variable
  const getCurrentSelectionPath = (key: string) => {
    const normalizedKey = normalizeKey(key);

    // First check if we have active selections (user has made changes)
    const rootParentId = `root-${normalizedKey}`;
    const rootSelection = selections.find(
      (selection) => selection.parentId === rootParentId
    );

    if (rootSelection) {
      const propertySelections = selections.filter(
        (selection) => selection.parentId === rootSelection.id
      );

      const nestedPropertySelections = selections.filter((selection) =>
        propertySelections.some((prop) => prop.id === selection.parentId)
      );

      const deepNestedPropertySelections = selections.filter((selection) =>
        nestedPropertySelections.some(
          (nested) => nested.id === selection.parentId
        )
      );

      const path = [
        rootSelection.value,
        ...propertySelections.map((p) => p.value),
        ...nestedPropertySelections.map((p) => p.value),
        ...deepNestedPropertySelections.map((p) => p.value),
      ].filter(Boolean);

      if (path.length > 1) {
        return path.join(" → ");
      }
    }

    // Fallback to backend variables data if no active selections
    if (templateParams.variables) {
      const allVariables = [
        ...(templateParams.variables.body || []),
        ...(templateParams.variables.header || []),
      ];

      const variable = allVariables.find(
        (v) => v.parameter_name === normalizedKey
      );
      if (variable && variable.value) {
        // Helper function to extract full path from nested value structure
        const extractPathFromValue = (valueObj: any): string[] => {
          const path = [valueObj.obj, valueObj.attr];
          if (valueObj.value && valueObj.value.attr) {
            path.push(valueObj.value.attr);
            // Handle deeper nesting if needed
            if (valueObj.value.value && valueObj.value.value.attr) {
              path.push(valueObj.value.value.attr);
            }
          }
          return path;
        };

        const path = extractPathFromValue(variable.value);
        return path.join(" → ");
      }
    }

    return null;
  };

  // Helper function to get the current variable value from backend data
  const getCurrentVariableValue = (key: string) => {
    const normalizedKey = normalizeKey(key);

    // First check if we have active selections (user has made changes)
    const rootParentId = `root-${normalizedKey}`;
    const rootSelection = selections.find(
      (selection) => selection.parentId === rootParentId
    );

    if (rootSelection && templateVariables) {
      const propertySelections = selections.filter(
        (selection) => selection.parentId === rootSelection.id
      );

      const nestedPropertySelections = selections.filter((selection) =>
        propertySelections.some((prop) => prop.id === selection.parentId)
      );

      const deepNestedPropertySelections = selections.filter((selection) =>
        nestedPropertySelections.some(
          (nested) => nested.id === selection.parentId
        )
      );

      const propertyPath = [
        ...propertySelections.map((p) => p.value),
        ...nestedPropertySelections.map((p) => p.value),
        ...deepNestedPropertySelections.map((p) => p.value),
      ].filter(Boolean);

      if (propertyPath.length > 0) {
        const tableType = rootSelection.tableType!;
        const tableData = getTableData(tableType);

        if (tableData && tableData.length > 0) {
          // Get the first item with actual data in the selected path
          for (const item of tableData) {
            const value = getNestedValue(item, propertyPath);
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value.toString().trim() !== ""
            ) {
              let displayValue = value;
              if (Array.isArray(value) && value.length > 0) {
                displayValue = value[0];
              }

              // Only show primitive values
              if (typeof displayValue !== "object" || displayValue === null) {
                return String(displayValue);
              }
            }
          }
        }
      }
    }

    // Fallback to backend variables data if no active selections
    if (templateParams.variables && templateVariables) {
      const allVariables = [
        ...(templateParams.variables.body || []),
        ...(templateParams.variables.header || []),
      ];

      const variable = allVariables.find(
        (v) => v.parameter_name === normalizedKey
      );
      if (variable && variable.value) {
        const tableType = variable.value.obj as TableType;

        // Helper function to extract full path from nested value structure
        const extractPropertyPath = (valueObj: any): string[] => {
          const path = [valueObj.attr];
          if (valueObj.value && valueObj.value.attr) {
            path.push(valueObj.value.attr);
            // Handle deeper nesting if needed
            if (valueObj.value.value && valueObj.value.value.attr) {
              path.push(valueObj.value.value.attr);
            }
          }
          return path;
        };

        const propertyPath = extractPropertyPath(variable.value);
        const tableData = getTableData(tableType);

        if (!tableData || tableData.length === 0) return null;

        // Get the first item with actual data in the selected path
        for (const item of tableData) {
          const value = getNestedValue(item, propertyPath);
          if (value && value.toString().trim() !== "") {
            let displayValue = value;
            if (Array.isArray(value) && value.length > 0) {
              displayValue = value[0];
            }

            // Only show primitive values
            if (typeof displayValue !== "object" || displayValue === null) {
              return String(displayValue);
            }
          }
        }
      }
    }

    return null;
  };

  return (
    <div>
      {selectedTemplate.name && (
        <div className="space-y-4">
          {/* Tags Configuration */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
            <h4 className="font-semibold text-sm">
              Template Tags Configuration
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Required Tags{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Input
                  placeholder="Enter required tags separated by commas (e.g., rec, important)"
                  value={templateParams.required_tags || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTemplateParams({
                      ...templateParams,
                      required_tags: value,
                    });
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple tags with commas.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Exclude Tags{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Input
                  placeholder="Enter tags to exclude separated by commas (e.g., pause, blocked)"
                  value={templateParams.exclude_tags || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTemplateParams({
                      ...templateParams,
                      exclude_tags: value,
                    });
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple tags with commas.
                </p>
              </div>
            </div>
          </div>

          {/* Info about custom fields */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Template Values:</strong> The values shown below are
              examples from the selected properties and will be replaced with
              actual data for each client when the template is sent.
            </div>
          </div>

          {/* Current Variable Values */}
          {(bodyPlaceholders.length > 0 ||
            headerTextPlaceholders.length > 0) && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Current Variable Values
                </div>
                <div className="space-y-1">
                  {bodyPlaceholders.map((key, index) => {
                    const path = getCurrentSelectionPath(key);
                    const currentValue = getCurrentVariableValue(key);
                    return (
                      <div key={`body-path-${key}`} className="text-xs">
                        {index + 1} → {path || "Not selected"}
                        {currentValue && (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            (Ex: {currentValue})
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {headerTextPlaceholders.map((key, index) => {
                    const path = getCurrentSelectionPath(key);
                    const currentValue = getCurrentVariableValue(key);
                    return (
                      <div
                        key={`header-path-${key}`}
                        className="text-xs text-muted-foreground"
                      >
                        {bodyPlaceholders.length + index + 1} →{" "}
                        {path || "Not selected"}
                        {currentValue && (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            (Value: {currentValue})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {bodyPlaceholders.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Body Variables</div>
                {bodyPlaceholders.map((key) => (
                  <div key={`body-${key}`}>
                    <div className="font-medium mb-1 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {` ${key}`}
                    </div>
                    {renderVariableSelector(key)}
                  </div>
                ))}
              </div>
            </>
          )}

          {headerComponent && headerComponent.format === "TEXT" && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Header Variables</div>
                {headerTextPlaceholders.length > 0 ? (
                  headerTextPlaceholders.map((key) => (
                    <div key={`header-${key}`}>
                      <div className="font-medium text-muted-foreground mb-1 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        {key}
                      </div>
                      {renderVariableSelector(key)}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    No header variables.
                  </div>
                )}
              </div>
            </>
          )}

          {headerComponent && headerComponent.format !== "TEXT" && (
            <div className="space-y-2">
              <div className="font-medium">Header Media</div>
              <div className="font-medium text-muted-foreground mb-1">
                {headerComponent.format} URL
              </div>
              <Input
                placeholder={`Enter ${headerComponent.format.toLowerCase()} URL`}
                value={templateParams.header_media_url || ""}
                onChange={(e) =>
                  handleParamChange("header_media_url", e.target.value)
                }
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="text-sm font-medium">Buttons</div>
            <div className="text-muted-foreground">
              {
                (
                  getComponentByType(selectedTemplate.components, "BUTTONS")
                    ?.buttons || []
                ).length
              }{" "}
              button(s) configured
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
