"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertTriangle, CheckCircle, XCircle, Lightbulb, Palette, Eye, Layers, Target } from "lucide-react";
import { analyzeTheme } from "@/lib/theme-kit/analyzer";
import { cn } from "@/lib/utils";
import { ContrastValidator } from "./contrast-validator";
import type { ThemeAnalysis } from "@/types/theme-kit/analyzer";

const sampleThemes = {
  default: `:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}`,
  problematic: `:root {
  --background: 0 0% 95%;
  --foreground: 0 0% 90%;
  --card: 0 0% 93%;
  --card-foreground: 0 0% 85%;
  --primary: 120 100% 50%;
  --primary-foreground: 240 100% 50%;
  --secondary: 60 100% 50%;
  --secondary-foreground: 300 100% 50%;
  --muted: 0 0% 92%;
  --muted-foreground: 0 0% 88%;
  --accent: 180 100% 50%;
  --accent-foreground: 0 100% 50%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 0 0% 90%;
  --input: 0 0% 89%;
  --ring: 120 100% 50%;
}`,
};

export function ThemeAnalyzer() {
  const [themeCSS, setThemeCSS] = useState("");
  const [analysis, setAnalysis] = useState<ThemeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!themeCSS.trim()) return;

    setIsAnalyzing(true);
    // Add delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const result = analyzeTheme(themeCSS);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    }

    setIsAnalyzing(false);
  };

  const loadSampleTheme = (theme: keyof typeof sampleThemes) => {
    setThemeCSS(sampleThemes[theme]);
    setAnalysis(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Theme Analyzer
          </CardTitle>
          <CardDescription>Paste your existing theme CSS to get detailed analysis and improvement suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" onClick={() => loadSampleTheme("default")}>
                Load Default Theme
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadSampleTheme("problematic")}>
                Load Problematic Theme
              </Button>
            </div>
            <Textarea
              placeholder="Paste your theme CSS here (e.g., :root { --background: 0 0% 100%; ... })"
              value={themeCSS}
              onChange={(e) => setThemeCSS(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={!themeCSS.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? "Analyzing..." : "Analyze Theme"}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Theme Score</span>
                <Badge variant={getScoreBadgeVariant(analysis.score)} className="text-lg px-3 py-1">
                  {analysis.score}/100
                </Badge>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis based on accessibility, harmony, hierarchy, and consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={analysis.score} className="h-3" />
              <div className="mt-2 text-sm text-muted-foreground">
                {analysis.score >= 80 && "Excellent theme! Minor improvements possible."}
                {analysis.score >= 60 && analysis.score < 80 && "Good theme with room for improvement."}
                {analysis.score < 60 && "Theme needs significant improvements."}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="harmony">Harmony</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="validator">Validator</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-2xl font-bold", getScoreColor(analysis.accessibility.score))}>
                        {Math.round(analysis.accessibility.score)}
                      </span>
                      <Badge variant={analysis.accessibility.wcagLevel === "FAIL" ? "destructive" : "default"}>
                        {analysis.accessibility.wcagLevel}
                      </Badge>
                    </div>
                    <Progress value={analysis.accessibility.score} className="mt-2 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Harmony
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-2xl font-bold", getScoreColor(analysis.harmony.score))}>
                        {Math.round(analysis.harmony.score)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {analysis.harmony.colorRelationship}
                      </Badge>
                    </div>
                    <Progress value={analysis.harmony.score} className="mt-2 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Hierarchy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-2xl font-bold", getScoreColor(analysis.hierarchy.score))}>
                        {Math.round(analysis.hierarchy.score)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {analysis.hierarchy.backgroundLevels} levels
                      </Badge>
                    </div>
                    <Progress value={analysis.hierarchy.score} className="mt-2 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Consistency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-2xl font-bold", getScoreColor(analysis.consistency.score))}>
                        {Math.round(analysis.consistency.score)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {analysis.consistency.colorVariations} hues
                      </Badge>
                    </div>
                    <Progress value={analysis.consistency.score} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Accessibility Analysis
                  </CardTitle>
                  <CardDescription>WCAG compliance and contrast ratio analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">WCAG Compliance Level</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.accessibility.wcagLevel === "AAA" && "Exceeds accessibility standards"}
                        {analysis.accessibility.wcagLevel === "AA" && "Meets accessibility standards"}
                        {analysis.accessibility.wcagLevel === "FAIL" && "Fails accessibility standards"}
                      </p>
                    </div>
                    <Badge
                      variant={analysis.accessibility.wcagLevel === "FAIL" ? "destructive" : "default"}
                      className="text-lg px-3 py-1"
                    >
                      {analysis.accessibility.wcagLevel}
                    </Badge>
                  </div>

                  {analysis.accessibility.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Issues Found</h4>
                      {analysis.accessibility.issues.map((issue, index) => (
                        <Alert key={index} variant={issue.severity === "critical" ? "destructive" : "default"}>
                          {issue.severity === "critical" ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          <AlertTitle className="capitalize">{issue.severity} Issue</AlertTitle>
                          <AlertDescription>
                            {issue.description}
                            {issue.contrastRatio && (
                              <span className="block mt-1 text-xs">
                                Current: {issue.contrastRatio.toFixed(2)}:1, Required: {issue.minimumRequired}:1
                              </span>
                            )}
                            <span className="block mt-1 text-xs font-medium">Affects: {issue.elements.join(", ")}</span>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {analysis.accessibility.issues.length === 0 && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>No Issues Found</AlertTitle>
                      <AlertDescription>All contrast ratios meet accessibility standards.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="harmony" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Harmony Analysis
                  </CardTitle>
                  <CardDescription>Color relationships and balance evaluation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Color Relationship</h4>
                      <Badge variant="outline" className="capitalize">
                        {analysis.harmony.colorRelationship}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {analysis.harmony.colorRelationship === "complementary" && "Colors are opposite on the color wheel"}
                        {analysis.harmony.colorRelationship === "triadic" && "Colors are evenly spaced on the color wheel"}
                        {analysis.harmony.colorRelationship === "analogous" && "Colors are adjacent on the color wheel"}
                        {analysis.harmony.colorRelationship === "monochromatic" && "Colors are variations of the same hue"}
                        {analysis.harmony.colorRelationship === "custom" && "Custom color relationship"}
                        {analysis.harmony.colorRelationship === "poor" && "Colors lack harmonic relationship"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Balance Scores</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Saturation Balance</span>
                            <span>{Math.round(analysis.harmony.saturationBalance)}%</span>
                          </div>
                          <Progress value={analysis.harmony.saturationBalance} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Lightness Balance</span>
                            <span>{Math.round(analysis.harmony.lightnessBalance)}%</span>
                          </div>
                          <Progress value={analysis.harmony.lightnessBalance} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {analysis.harmony.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Issues</h4>
                      {analysis.harmony.issues.map((issue, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hierarchy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Visual Hierarchy Analysis
                  </CardTitle>
                  <CardDescription>Background levels and depth perception evaluation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.hierarchy.backgroundLevels}</div>
                      <div className="text-sm text-muted-foreground">Background Levels</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(analysis.hierarchy.depthClarity)}%</div>
                      <div className="text-sm text-muted-foreground">Depth Clarity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(analysis.hierarchy.surfaceContrast)}%</div>
                      <div className="text-sm text-muted-foreground">Surface Contrast</div>
                    </div>
                  </div>

                  {analysis.hierarchy.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Issues</h4>
                      {analysis.hierarchy.issues.map((issue, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Improvement Suggestions
                  </CardTitle>
                  <CardDescription>Actionable recommendations to enhance your theme</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.suggestions.length > 0 ? (
                    <div className="space-y-4">
                      {analysis.suggestions.map((suggestion, index) => (
                        <Alert
                          key={index}
                          className={cn(
                            suggestion.priority === "high" && "border-red-200 bg-red-50",
                            suggestion.priority === "medium" && "border-yellow-200 bg-yellow-50",
                            suggestion.priority === "low" && "border-blue-200 bg-blue-50"
                          )}
                        >
                          <Lightbulb className="h-4 w-4" />
                          <AlertTitle className="flex items-center justify-between">
                            {suggestion.title}
                            <Badge
                              variant={
                                suggestion.priority === "high"
                                  ? "destructive"
                                  : suggestion.priority === "medium"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {suggestion.priority} priority
                            </Badge>
                          </AlertTitle>
                          <AlertDescription className="space-y-2">
                            <p>{suggestion.description}</p>
                            <p className="font-medium">Action: {suggestion.action}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Great Theme!</AlertTitle>
                      <AlertDescription>No major issues found. Your theme follows good design principles.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="validator" className="space-y-4">
              <ContrastValidator />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
