export const formatPrice = (price: number) => {
    // Custom formatting: add commas manually, prefix with $
    const rounded = Math.round(price);
    const str = Math.abs(rounded).toString();
    let result = "";
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      result = str[i] + result;
      count++;
      if (count % 3 === 0 && i !== 0) {
        result = "," + result;
      }
    }
    return (rounded < 0 ? "-$" : "$") + result;
  };
  
  export const capitalizeWord = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const capitalizePhrase = (str: string) => {
    return str.split(" ").map(capitalizeWord).join(" ");
  };
  
  /**
   * Processes a property value to extract nested object keys for dropdown options.
   * Handles JSON strings, direct objects, and primitive types gracefully.
   *
   * @param propertyValue - The value to process
   * @returns Array of key-value pairs for dropdown options, or null if no nested keys found
   */
  export const processPropertyForNestedOptions = (
    propertyValue: any
  ): { value: string; label: string }[] | null => {
    // A. Check for JSON strings that can be parsed into objects
    if (typeof propertyValue === "string") {
      try {
        const parsedValue = JSON.parse(propertyValue);
        if (
          typeof parsedValue === "object" &&
          parsedValue !== null &&
          !Array.isArray(parsedValue)
        ) {
          const keys = Object.keys(parsedValue);
          if (keys.length > 0) {
            return keys.map((key) => ({
              value: key,
              label: key,
            }));
          }
        }
      } catch {
        // Not valid JSON, continue to next item
        return null;
      }
    }
    // B. Handle direct objects
    else if (
      propertyValue !== null &&
      typeof propertyValue === "object" &&
      !Array.isArray(propertyValue)
    ) {
      const keys = Object.keys(propertyValue);
      if (keys.length > 0) {
        return keys.map((key) => ({
          value: key,
          label: key,
        }));
      }
    }
    // C. All other types (primitives) are handled silently - no console errors
    return null;
  };
  
  /**
   * Converts plural collection names to singular form for backend compatibility.
   * This ensures the collection name in the payload matches what the backend expects.
   */
  const pluralToSingular = (collectionName: string): string => {
    const pluralToSingularMap: Record<string, string> = {
      companies: "company",
      leads: "lead",
      contacts: "contact",
      events: "event",
    };
  
    return pluralToSingularMap[collectionName] || collectionName;
  };
  
  /**
   * Parses template parameters from the frontend format to the backend expected format.
   *
   * @param templateParams - Object with parameter names as keys and colon-separated paths as values
   * @returns Object with variables.body array in the format expected by the backend
   */
  export const parseTemplateParamsForBackend = (
    templateParams: Record<string, any>
  ) => {
    const bodyVariables: Array<{
      type: "text";
      parameter_name: string;
      value: any; // Can be nested structure
    }> = [];
  
    // Helper function to create nested value structure without collection name
    // This is used for deeply nested paths where we only have attr fields
    const createNestedValueWithoutCollection = (pathParts: string[]): any => {
      if (pathParts.length === 1) {
        return {
          attr: pathParts[0],
        };
      } else {
        return {
          attr: pathParts[0],
          value: createNestedValueWithoutCollection(pathParts.slice(1)),
        };
      }
    };
  
    // Helper function to create nested value structure
    const createNestedValue = (pathParts: string[]): any => {
      // Convert the first part (collection name) from plural to singular
      const collectionName = pluralToSingular(pathParts[0]);
  
      if (pathParts.length === 2) {
        // Simple case: obj:attr
        return {
          obj: collectionName,
          attr: pathParts[1],
        };
      } else if (pathParts.length === 3) {
        // Three-part case: obj:attr1:attr2
        return {
          obj: collectionName,
          attr: pathParts[1],
          value: {
            attr: pathParts[2],
          },
        };
      } else if (pathParts.length > 3) {
        // Nested case: obj:attr1:attr2:attr3:...
        // The first two parts become obj:attr, the rest become nested value
        return {
          obj: collectionName,
          attr: pathParts[1],
          value: createNestedValueWithoutCollection(pathParts.slice(2)),
        };
      }
      return null;
    };
  
    // Process each parameter in templateParams
    Object.entries(templateParams).forEach(([key, value]) => {
      // Skip non-variable properties
      if (
        key === "required_tags" ||
        key === "exclude_tags" ||
        key === "variables" ||
        key === "header_media_url"
      ) {
        return;
      }
  
      // Check if the value is a colon-separated path (e.g., "events:custom_attributes:whatsapp_template:name")
      if (typeof value === "string" && value.includes(":")) {
        const pathParts = value.split(":");
  
        if (pathParts.length >= 2) {
          const nestedValue = createNestedValue(pathParts);
  
          if (nestedValue) {
            bodyVariables.push({
              type: "text",
              parameter_name: key,
              value: nestedValue,
            });
          }
        }
      }
    });
  
    return {
      variables: {
        body: bodyVariables,
      },
    };
  };
  