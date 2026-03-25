/** JSON Schema primitive type keyword */
export type JsonSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object"
  | "file"
  | "image"
  | "null";

/** Root catalog schema */
export type CatalogJSONSchema = Record<string, any>

export function isCatalogJSONSchema(
  value: unknown
): value is CatalogJSONSchema {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const o = value as Record<string, unknown>;
  return (
    o.type === "object" &&
    typeof o.properties === "object" &&
    o.properties !== null &&
    !Array.isArray(o.properties)
  );
}

/** internal format: { fields: string[], [fieldName]: string | { type, fields, ... } } */
export type CatalogSchema = {
  fields: string[];
  [fieldName: string]:
  | string[]
  | string
  | { type: string; fields?: string[];[k: string]: unknown }
  | undefined;
};

export function isCatalogSchema(
  value: unknown
): value is CatalogSchema {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const o = value as Record<string, unknown>;
  return Array.isArray(o.fields) && o.fields.length >= 0;
}
