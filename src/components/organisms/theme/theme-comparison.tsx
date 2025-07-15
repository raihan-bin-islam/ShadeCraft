"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Palette, Eye, Zap, Info, CheckCircle, AlertTriangle, Monitor, Smartphone } from "lucide-react";
import { themes } from "@/lib/themes";
import { compareColors, legacyHslThemes } from "@/lib/theme-kit/core/color-comparison";
import { cn } from "@/lib/utils";
import { ColorComparison } from "@/types/theme-kit";

export function ThemeComparison() {
  const [selectedTheme, setSelectedTheme] = useState<string>("aurora");
  const [selectedMode, setSelectedMode] = useState<"light" | "dark">("light");
  const [comparisons, setComparisons] = useState<ColorComparison[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const performComparison = async () => {
    if (!selectedTheme) return;

    setIsComparing(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing

    const hslTheme = legacyHslThemes[selectedTheme as keyof typeof legacyHslThemes];
    const oklchTheme = themes[selectedTheme as keyof typeof themes];

    if (!hslTheme || !oklchTheme) {
      setIsComparing(false);
      return;
    }

    const hslVars = hslTheme[selectedMode];
    const oklchVars = oklchTheme.cssVars[selectedMode];

    const newComparisons: ColorComparison[] = [];

    // Compare each color variable
    Object.keys(hslVars).forEach((key) => {
      const hslValue = hslVars[key as keyof typeof hslVars];
      const oklchValue = oklchVars[key];

      if (hslValue && oklchValue) {
        try {
          const comparison = compareColors(key, hslValue, oklchValue);
          newComparisons.push(comparison);
        } catch (error) {
          console.warn(`Failed to compare ${key}:`, error);
        }
      }
    });

    setComparisons(newComparisons);
    setIsComparing(false);
  };

  const getDifferenceColor = (difference: ColorComparison["difference"]["perceptualDifference"]) => {
    switch (difference) {
      case "identical":
        return "text-green-600";
      case "minimal":
        return "text-blue-600";
      case "noticeable":
        return "text-yellow-600";
      case "significant":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDifferenceBadge = (difference: ColorComparison["difference"]["perceptualDifference"]) => {
    switch (difference) {
      case "identical":
        return <Badge className="bg-green-500">Identical</Badge>;
      case "minimal":
        return <Badge className="bg-blue-500">Minimal</Badge>;
      case "noticeable":
        return <Badge variant="secondary">Noticeable</Badge>;
      case "significant":
        return <Badge variant="destructive">Significant</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getOverallStats = () => {
    if (comparisons.length === 0) return null;

    const stats = {
      identical: comparisons.filter((c) => c.difference.perceptualDifference === "identical").length,
      minimal: comparisons.filter((c) => c.difference.perceptualDifference === "minimal").length,
      noticeable: comparisons.filter((c) => c.difference.perceptualDifference === "noticeable").length,
      significant: comparisons.filter((c) => c.difference.perceptualDifference === "significant").length,
      gamutExpanded: comparisons.filter((c) => c.difference.gamutExpansion).length,
      averageDeltaE: comparisons.reduce((sum, c) => sum + c.difference.deltaE, 0) / comparisons.length,
    };

    return stats;
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            HSL vs OKLCH Theme Comparison
          </CardTitle>
          <CardDescription>
            Compare the visual and technical differences between HSL and OKLCH versions of the same theme. See how OKLCH provides
            better perceptual uniformity and wider color gamut.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aurora">Aurora</SelectItem>
                  <SelectItem value="serene">Serene</SelectItem>
                  <SelectItem value="tropical">Tropical</SelectItem>
                  <SelectItem value="midnight">Midnight</SelectItem>
                  <SelectItem value="candy">Candy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mode</label>
              <Select value={selectedMode} onValueChange={(value: "light" | "dark") => setSelectedMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={performComparison} disabled={isComparing || !selectedTheme} className="w-full">
                {isComparing ? "Comparing..." : "Compare Themes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Comparison Overview
            </CardTitle>
            <CardDescription>Statistical analysis of differences between HSL and OKLCH versions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.identical}</div>
                <div className="text-sm text-muted-foreground">Identical Colors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.minimal}</div>
                <div className="text-sm text-muted-foreground">Minimal Differences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.noticeable}</div>
                <div className="text-sm text-muted-foreground">Noticeable Differences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.significant}</div>
                <div className="text-sm text-muted-foreground">Significant Differences</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Delta E</span>
                  <span className="font-mono">{stats.averageDeltaE.toFixed(2)}</span>
                </div>
                <Progress value={Math.min(100, (stats.averageDeltaE / 10) * 100)} className="h-2" />
                <div className="text-xs text-muted-foreground">Lower is better (&lt; 2.3 is barely perceptible)</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gamut Expanded Colors</span>
                  <span className="font-mono">{stats.gamutExpanded}</span>
                </div>
                <Progress value={(stats.gamutExpanded / comparisons.length) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">Colors outside sRGB gamut (P3/Rec2020 only)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {comparisons.length > 0 && (
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Visual Comparison</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="grid gap-4">
              {comparisons.map((comparison, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base capitalize">{comparison.name.replace(/-/g, " ")}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getDifferenceBadge(comparison.difference.perceptualDifference)}
                        {comparison.difference.gamutExpansion && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            P3 Gamut
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* HSL Version */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">HSL Version</h4>
                          <Badge variant="outline">Legacy</Badge>
                        </div>
                        <div
                          className="h-16 rounded-lg border flex items-center justify-center text-sm font-mono"
                          style={{
                            backgroundColor: `rgb(${comparison.hsl.rgb.r}, ${comparison.hsl.rgb.g}, ${comparison.hsl.rgb.b})`,
                            color: comparison.hsl.value.l > 50 ? "#000" : "#fff",
                          }}
                        >
                          RGB({comparison.hsl.rgb.r}, {comparison.hsl.rgb.g}, {comparison.hsl.rgb.b})
                        </div>
                        <div className="text-xs font-mono bg-muted p-2 rounded">{comparison.hsl.css}</div>
                      </div>

                      {/* OKLCH Version */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">OKLCH Version</h4>
                          <Badge className="bg-blue-500">Modern</Badge>
                        </div>
                        <div
                          className="h-16 rounded-lg border flex items-center justify-center text-sm font-mono"
                          style={{
                            backgroundColor: `rgb(${comparison.oklch.rgb.r}, ${comparison.oklch.rgb.g}, ${comparison.oklch.rgb.b})`,
                            color: comparison.oklch.value.l > 0.5 ? "#000" : "#fff",
                          }}
                        >
                          RGB({comparison.oklch.rgb.r}, {comparison.oklch.rgb.g}, {comparison.oklch.rgb.b})
                        </div>
                        <div className="text-xs font-mono bg-muted p-2 rounded">{comparison.oklch.css}</div>
                      </div>
                    </div>

                    {/* Difference Indicator */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span>Perceptual Difference (ΔE)</span>
                        <span className={cn("font-mono", getDifferenceColor(comparison.difference.perceptualDifference))}>
                          {comparison.difference.deltaE.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={Math.min(100, (comparison.difference.deltaE / 10) * 100)} className="h-2 mt-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {comparison.difference.perceptualDifference === "identical" && "Colors appear identical to human eye"}
                        {comparison.difference.perceptualDifference === "minimal" && "Barely perceptible difference"}
                        {comparison.difference.perceptualDifference === "noticeable" && "Noticeable but acceptable difference"}
                        {comparison.difference.perceptualDifference === "significant" && "Clearly visible difference"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 border-r">Color Variable</th>
                    <th className="text-left p-3 border-r">HSL Values</th>
                    <th className="text-left p-3 border-r">OKLCH Values</th>
                    <th className="text-left p-3 border-r">Delta E</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 border-r font-medium capitalize">{comparison.name.replace(/-/g, " ")}</td>
                      <td className="p-3 border-r font-mono text-sm">
                        <div>H: {comparison.hsl.value.h.toFixed(1)}°</div>
                        <div>S: {comparison.hsl.value.s.toFixed(1)}%</div>
                        <div>L: {comparison.hsl.value.l.toFixed(1)}%</div>
                      </td>
                      <td className="p-3 border-r font-mono text-sm">
                        <div>L: {comparison.oklch.value.l.toFixed(3)}</div>
                        <div>C: {comparison.oklch.value.c.toFixed(3)}</div>
                        <div>H: {comparison.oklch.value.h.toFixed(1)}°</div>
                      </td>
                      <td className="p-3 border-r font-mono text-sm">
                        <span className={getDifferenceColor(comparison.difference.perceptualDifference)}>
                          {comparison.difference.deltaE.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {getDifferenceBadge(comparison.difference.perceptualDifference)}
                          {comparison.difference.gamutExpansion && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Extended Gamut
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Color Space Comparison Analysis</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>
                    {`This comparison shows the differences between HSL (legacy) and OKLCH (modern) color representations of the
                    same theme. Here's what the results mean:`}
                  </p>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      OKLCH Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong>Perceptual Uniformity:</strong> Equal changes in OKLCH values produce equal perceived changes in
                        color
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong>Wider Gamut:</strong> Access to colors outside sRGB (P3, Rec2020) for modern displays
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong>Better Interpolation:</strong> More natural color transitions and gradients
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong>Future-Proof:</strong> Designed for modern and future display technologies
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Understanding Delta E
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ΔE &lt; 1:</span>
                      <Badge className="bg-green-500 text-xs">Identical</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ΔE 1-2.3:</span>
                      <Badge className="bg-blue-500 text-xs">Minimal</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ΔE 2.3-5:</span>
                      <Badge variant="secondary" className="text-xs">
                        Noticeable
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ΔE &gt; 5:</span>
                      <Badge variant="destructive" className="text-xs">
                        Significant
                      </Badge>
                    </div>
                    <div className="mt-3 p-2 bg-muted rounded text-xs">
                      Delta E measures perceptual color difference. Values under 2.3 are barely perceptible to the human eye.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Display Compatibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">sRGB Displays (Standard)</div>
                      <div className="text-muted-foreground">
                        Both HSL and OKLCH work, but OKLCH provides better perceptual accuracy
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">P3 Displays (Modern)</div>
                      <div className="text-muted-foreground">OKLCH can access 25% more colors than HSL</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Rec2020 Displays (Future)</div>
                      <div className="text-muted-foreground">OKLCH provides full gamut access for next-gen displays</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Browser Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">OKLCH Support</div>
                      <div className="text-muted-foreground">Chrome 111+, Firefox 113+, Safari 15.4+</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Fallback Strategy</div>
                      <div className="text-muted-foreground">Use HSL as fallback for older browsers</div>
                    </div>
                    <div className="mt-3 p-2 bg-muted rounded text-xs">
                      Modern browsers have excellent OKLCH support. Consider progressive enhancement.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
