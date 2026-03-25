export type TestJsonb = {
    id?: number | string;
    json1: Record<string, any> | null;
    json2: Record<string, any> | null;
    user_created?: string;   // optional – if you want ownership
  };