export interface ThemeAnalysis {
  score: number; // Overall score 0-100
  accessibility: AccessibilityAnalysis;
  harmony: HarmonyAnalysis;
  hierarchy: HierarchyAnalysis;
  consistency: ConsistencyAnalysis;
  suggestions: Suggestion[];
  improvements: ThemeImprovements;
}

export interface AccessibilityAnalysis {
  score: number;
  issues: AccessibilityIssue[];
  wcagLevel: "AA" | "AAA" | "FAIL";
}

export interface AccessibilityIssue {
  type: "contrast" | "color-blindness" | "focus";
  severity: "critical" | "warning" | "info";
  description: string;
  elements: string[];
  contrastRatio?: number;
  minimumRequired?: number;
}

export interface HarmonyAnalysis {
  score: number;
  colorRelationship: "complementary" | "triadic" | "analogous" | "monochromatic" | "custom" | "poor";
  saturationBalance: number; // 0-100
  lightnessBalance: number; // 0-100
  issues: string[];
}

export interface HierarchyAnalysis {
  score: number;
  backgroundLevels: number;
  depthClarity: number; // 0-100
  surfaceContrast: number; // 0-100
  issues: string[];
}

export interface ConsistencyAnalysis {
  score: number;
  colorVariations: number;
  semanticConsistency: number; // 0-100
  issues: string[];
}

export interface Suggestion {
  type: "accessibility" | "harmony" | "hierarchy" | "consistency" | "branding";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  before?: string;
  after?: string;
}

export interface ThemeImprovements {
  improvedColors: Record<string, string>;
  reasoning: string[];
}
