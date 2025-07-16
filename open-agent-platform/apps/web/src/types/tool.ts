

export type InputSchema = {
  type: "object";
  properties?: Record<string, any>;
  required?: string[];
};

export interface Tool {
  name: string;
  description?: string;
  inputSchema: InputSchema;

  /** ✅ Source can now include all valid options */
  source?: "arcade" | "langserve" | "lastmile" | "custom";
}
