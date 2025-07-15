import { HSL } from "@/types/theme-kit/color-space";
import {
  AccessibilityAnalysis,
  AccessibilityIssue,
  ConsistencyAnalysis,
  HarmonyAnalysis,
  HierarchyAnalysis,
  Suggestion,
  ThemeAnalysis,
  ThemeImprovements,
} from "@/types/theme-kit/analyzer";
import { parseColorToHsl, parseOklchString, parseThemeCSS } from "@/lib/theme-kit/core/parser";
import { getContrastRatio } from "@/lib/theme-kit/core";

// Analyze accessibility
function analyzeAccessibility(theme: Record<string, string>): AccessibilityAnalysis {
  const issues: AccessibilityIssue[] = [];
  let totalContrast = 0;
  let contrastChecks = 0;

  // Key contrast pairs to check
  const contrastPairs = [
    { fg: "foreground", bg: "background", elements: ["body text", "main content"] },
    { fg: "primary-foreground", bg: "primary", elements: ["primary buttons", "primary text"] },
    { fg: "secondary-foreground", bg: "secondary", elements: ["secondary buttons"] },
    { fg: "muted-foreground", bg: "muted", elements: ["muted text", "placeholders"] },
    { fg: "card-foreground", bg: "card", elements: ["card content"] },
    { fg: "accent-foreground", bg: "accent", elements: ["accent elements"] },
  ];

  for (const pair of contrastPairs) {
    const fgColor = parseOklchString(theme[pair.fg] || "");
    const bgColor = parseOklchString(theme[pair.bg] || "");

    if (fgColor && bgColor) {
      const contrast = getContrastRatio(fgColor, bgColor);

      totalContrast += contrast;
      contrastChecks++;

      if (contrast < 4.5) {
        issues.push({
          type: "contrast",
          severity: contrast < 3 ? "critical" : "warning",
          description: `Low contrast ratio between ${pair.fg} and ${pair.bg}`,
          elements: pair.elements,
          contrastRatio: contrast,
          minimumRequired: 4.5,
        });
      }
    }
  }

  const averageContrast = contrastChecks > 0 ? totalContrast / contrastChecks : 0;
  const wcagLevel: "AA" | "AAA" | "FAIL" = averageContrast >= 7 ? "AAA" : averageContrast >= 4.5 ? "AA" : "FAIL";

  const score = Math.min(100, Math.max(0, (averageContrast - 3) * 25));

  return {
    score,
    issues,
    wcagLevel,
  };
}

// Analyze color harmony
function analyzeHarmony(theme: Record<string, string>): HarmonyAnalysis {
  const colors: HSL[] = [];
  const colorKeys = ["primary", "secondary", "accent"];

  for (const key of colorKeys) {
    const color = parseColorToHsl(theme[key] || "");
    if (color) colors.push(color);
  }

  if (colors.length < 2) {
    return {
      score: 0,
      colorRelationship: "poor",
      saturationBalance: 0,
      lightnessBalance: 0,
      issues: ["Insufficient color data for harmony analysis"],
    };
  }

  // Analyze hue relationships
  const hues = colors.map((c) => c.h);
  const hueDistances = [];

  for (let i = 0; i < hues.length - 1; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      let distance = Math.abs(hues[i] - hues[j]);
      if (distance > 180) distance = 360 - distance;
      hueDistances.push(distance);
    }
  }

  // Determine color relationship
  let colorRelationship: HarmonyAnalysis["colorRelationship"] = "custom";
  const avgDistance = hueDistances.reduce((a, b) => a + b, 0) / hueDistances.length;

  if (avgDistance < 30) colorRelationship = "analogous";
  else if (avgDistance > 150) colorRelationship = "complementary";
  else if (hueDistances.some((d) => Math.abs(d - 120) < 20)) colorRelationship = "triadic";
  else if (hues.every((h) => Math.abs(h - hues[0]) < 10)) colorRelationship = "monochromatic";

  // Analyze saturation balance
  const saturations = colors.map((c) => c.s);
  const saturationRange = Math.max(...saturations) - Math.min(...saturations);
  const saturationBalance = Math.max(0, 100 - saturationRange);

  // Analyze lightness balance
  const lightnesses = colors.map((c) => c.l);
  const lightnessRange = Math.max(...lightnesses) - Math.min(...lightnesses);
  const lightnessBalance = lightnessRange > 20 && lightnessRange < 60 ? 100 : Math.max(0, 100 - Math.abs(lightnessRange - 40));

  const issues: string[] = [];
  if (saturationBalance < 50) issues.push("Saturation levels are too varied");
  if (lightnessBalance < 50) issues.push("Lightness levels need better balance");
  // @ts-expect-error maybe it is not being assigned the value of poor anywhere in the codebase, check back later
  if (colorRelationship === "poor") issues.push("Colors lack harmonic relationship");

  const score = (saturationBalance + lightnessBalance) / 2;

  return {
    score,
    colorRelationship,
    saturationBalance,
    lightnessBalance,
    issues,
  };
}

// Analyze visual hierarchy
function analyzeHierarchy(theme: Record<string, string>): HierarchyAnalysis {
  const backgroundKeys = ["background", "card", "muted", "secondary", "accent"];
  const backgrounds: HSL[] = [];

  for (const key of backgroundKeys) {
    const color = parseColorToHsl(theme[key] || "");
    if (color) backgrounds.push(color);
  }

  if (backgrounds.length < 3) {
    return {
      score: 0,
      backgroundLevels: backgrounds.length,
      depthClarity: 0,
      surfaceContrast: 0,
      issues: ["Insufficient background levels for proper hierarchy"],
    };
  }

  // Check lightness progression
  const lightnesses = backgrounds.map((bg) => bg.l).sort((a, b) => a - b);
  const lightnessSteps = [];

  for (let i = 1; i < lightnesses.length; i++) {
    lightnessSteps.push(lightnesses[i] - lightnesses[i - 1]);
  }

  const avgStep = lightnessSteps.reduce((a, b) => a + b, 0) / lightnessSteps.length;
  const stepConsistency = lightnessSteps.every((step) => Math.abs(step - avgStep) < 10) ? 100 : 50;

  const depthClarity = avgStep > 5 ? Math.min(100, avgStep * 10) : 0;
  const surfaceContrast = stepConsistency;

  const issues: string[] = [];
  if (depthClarity < 50) issues.push("Background levels too similar - poor depth perception");
  if (surfaceContrast < 50) issues.push("Inconsistent spacing between surface levels");
  if (backgrounds.length < 4) issues.push("Consider adding more surface levels for better hierarchy");

  const score = (depthClarity + surfaceContrast) / 2;

  return {
    score,
    backgroundLevels: backgrounds.length,
    depthClarity,
    surfaceContrast,
    issues,
  };
}

// Analyze consistency
function analyzeConsistency(theme: Record<string, string>): ConsistencyAnalysis {
  const allColors: HSL[] = [];
  const colorKeys = Object.keys(theme).filter(
    (key) => !key.includes("foreground") && !key.includes("border") && !key.includes("ring")
  );

  for (const key of colorKeys) {
    const color = parseColorToHsl(theme[key] || "");
    if (color) allColors.push(color);
  }

  if (allColors.length < 3) {
    return {
      score: 0,
      colorVariations: allColors.length,
      semanticConsistency: 0,
      issues: ["Insufficient color data for consistency analysis"],
    };
  }

  // Check hue consistency
  const hues = allColors.map((c) => c.h);
  const uniqueHues = [...new Set(hues.map((h) => Math.round(h / 30) * 30))]; // Group by 30° segments
  const hueConsistency = uniqueHues.length <= 3 ? 100 : Math.max(0, 100 - (uniqueHues.length - 3) * 20);

  // Check saturation consistency
  const saturations = allColors.map((c) => c.s);
  const saturationRange = Math.max(...saturations) - Math.min(...saturations);
  const saturationConsistency = saturationRange < 40 ? 100 : Math.max(0, 100 - (saturationRange - 40));

  const semanticConsistency = (hueConsistency + saturationConsistency) / 2;

  const issues: string[] = [];
  if (hueConsistency < 70) issues.push("Too many different hue families - consider limiting to 2-3 main hues");
  if (saturationConsistency < 70) issues.push("Saturation levels vary too much across the theme");
  if (uniqueHues.length > 4) issues.push("Consider using a more limited color palette");

  const score = semanticConsistency;

  return {
    score,
    colorVariations: uniqueHues.length,
    semanticConsistency,
    issues,
  };
}

// Generate improvement suggestions
function generateSuggestions(
  accessibility: AccessibilityAnalysis,
  harmony: HarmonyAnalysis,
  hierarchy: HierarchyAnalysis,
  consistency: ConsistencyAnalysis
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Accessibility suggestions
  if (accessibility.wcagLevel === "FAIL") {
    suggestions.push({
      type: "accessibility",
      priority: "high",
      title: "Critical Contrast Issues",
      description: "Several color combinations fail WCAG accessibility standards",
      action: "Increase contrast between foreground and background colors, especially for text elements",
    });
  }

  accessibility.issues.forEach((issue) => {
    if (issue.severity === "critical") {
      suggestions.push({
        type: "accessibility",
        priority: "high",
        title: `Fix ${issue.elements.join(", ")} contrast`,
        description: `Current contrast ratio: ${issue.contrastRatio?.toFixed(2)}, Required: ${issue.minimumRequired}`,
        action: "Darken the text color or lighten the background color",
      });
    }
  });

  // Harmony suggestions
  if (harmony.score < 60) {
    suggestions.push({
      type: "harmony",
      priority: "medium",
      title: "Improve Color Harmony",
      description: "Colors lack harmonic relationship",
      action: "Consider using complementary, triadic, or analogous color schemes",
    });
  }

  if (harmony.saturationBalance < 50) {
    suggestions.push({
      type: "harmony",
      priority: "medium",
      title: "Balance Saturation Levels",
      description: "Saturation varies too much between colors",
      action: "Adjust saturation levels to be within 30% of each other",
    });
  }

  // Hierarchy suggestions
  if (hierarchy.score < 60) {
    suggestions.push({
      type: "hierarchy",
      priority: "medium",
      title: "Improve Visual Hierarchy",
      description: "Background levels are too similar",
      action: "Create more distinct lightness levels between background, card, and muted surfaces",
    });
  }

  // Consistency suggestions
  if (consistency.score < 60) {
    suggestions.push({
      type: "consistency",
      priority: "low",
      title: "Improve Color Consistency",
      description: "Too many different color families",
      action: "Limit your palette to 2-3 main hue families for better cohesion",
    });
  }

  return suggestions;
}

// Main analysis function
export function analyzeTheme(themeCSS: string): ThemeAnalysis {
  const theme = parseThemeCSS(themeCSS);

  const accessibility = analyzeAccessibility(theme);
  const harmony = analyzeHarmony(theme);
  const hierarchy = analyzeHierarchy(theme);
  const consistency = analyzeConsistency(theme);

  const suggestions = generateSuggestions(accessibility, harmony, hierarchy, consistency);

  // Calculate overall score
  const score = Math.round(accessibility.score * 0.4 + harmony.score * 0.25 + hierarchy.score * 0.2 + consistency.score * 0.15);

  // Generate improvements (simplified for now)
  const improvements: ThemeImprovements = {
    improvedColors: {},
    reasoning: [
      "Improved contrast ratios for better accessibility",
      "Adjusted saturation levels for better harmony",
      "Enhanced background hierarchy for clearer visual depth",
    ],
  };

  return {
    score,
    accessibility,
    harmony,
    hierarchy,
    consistency,
    suggestions,
    improvements,
  };
}
