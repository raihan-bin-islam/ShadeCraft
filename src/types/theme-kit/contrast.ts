export interface ContrastIssue {
  pair: string;
  contrast: number;
  required: number;
  severity: "critical" | "warning";
}
