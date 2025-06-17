"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { validateThemeContrast, type ContrastIssue } from "@/lib/theme-kit/v2/contrast-utils";
import { themes } from "@/lib/themes";

export function ContrastValidator() {
  const [validationResults, setValidationResults] = useState<Record<string, ContrastIssue[]>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateAllThemes = async () => {
    setIsValidating(true);
    const results: Record<string, ContrastIssue[]> = {};

    // Validate each theme
    Object.entries(themes).forEach(([themeName, themeConfig]) => {
      const lightIssues = validateThemeContrast(themeConfig.cssVars.light);
      const darkIssues = validateThemeContrast(themeConfig.cssVars.dark);
      results[`${themeName}-light`] = lightIssues;
      results[`${themeName}-dark`] = darkIssues;
    });

    setValidationResults(results);
    setIsValidating(false);
  };

  const getContrastBadge = (contrast: number) => {
    if (contrast >= 7) return <Badge className="bg-green-500">AAA</Badge>;
    if (contrast >= 4.5) return <Badge className="bg-blue-500">AA</Badge>;
    if (contrast >= 3) return <Badge variant="secondary">Poor</Badge>;
    return <Badge variant="destructive">Fail</Badge>;
  };

  const getSeverityIcon = (severity: "critical" | "warning") => {
    return severity === "critical" ? (
      <XCircle className="h-4 w-4 text-red-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contrast Validation</CardTitle>
          <CardDescription>Validate contrast ratios across all themes to ensure accessibility compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={validateAllThemes} disabled={isValidating}>
            {isValidating ? "Validating..." : "Validate All Themes"}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(validationResults).length > 0 && (
        <div className="space-y-4">
          {Object.entries(validationResults).map(([themeKey, issues]) => {
            const [themeName, mode] = themeKey.split("-");
            const hasIssues = issues.length > 0;

            return (
              <Card key={themeKey}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">
                      {themeName} - {mode} mode
                    </span>
                    {hasIssues ? (
                      <Badge variant="destructive">{issues.length} issues</Badge>
                    ) : (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Perfect
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasIssues ? (
                    <div className="space-y-3">
                      {issues.map((issue, index) => (
                        <Alert key={index} variant={issue.severity === "critical" ? "destructive" : "default"}>
                          {getSeverityIcon(issue.severity)}
                          <AlertTitle className="flex items-center justify-between">
                            <span className="capitalize">{issue.pair}</span>
                            <div className="flex items-center gap-2">
                              {getContrastBadge(issue.contrast)}
                              <span className="text-sm">{issue.contrast.toFixed(2)}:1</span>
                            </div>
                          </AlertTitle>
                          <AlertDescription>
                            Current contrast: {issue.contrast.toFixed(2)}:1, Required: {issue.required}:1
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {issue.severity === "critical"
                                ? "Critical: Text may be unreadable for many users"
                                : "Warning: May not meet accessibility standards"}
                            </span>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>All Contrast Ratios Pass</AlertTitle>
                      <AlertDescription>
                        All color combinations in this theme meet WCAG AA accessibility standards.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
