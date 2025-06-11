"use client";

import { useState, useEffect } from "react";
import { generatePrimaryColor } from "@/utils/generate-primary";
import { generateTheme, ColorHarmony } from "@/utils/theme-generator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const harmonyOptions: { value: ColorHarmony; label: string }[] = [
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic" },
  { value: "monochromatic", label: "Monochromatic" },
  { value: "split-complementary", label: "Split Complementary" },
];

export default function PalettePreviewerPage() {
  const [primaryColor, setPrimaryColor] = useState("#6d28d9"); // Default purple
  const [harmony, setHarmony] = useState<ColorHarmony>("analogous");
  const [apply6030Rule, setApply6030Rule] = useState(true);
  const [palette, setPalette] = useState<any>(null);
  const [cssVars, setCssVars] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode state based on document class
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // Generate a theme when inputs change
  useEffect(() => {
    if (primaryColor) {
      const result = generateTheme(primaryColor, harmony, "both", true, apply6030Rule);
      setPalette(result.palette);
      setCssVars(result.css);

      // Apply the CSS variables to the document
      const styleElement = document.getElementById("theme-style") || document.createElement("style");
      styleElement.id = "theme-style";
      styleElement.textContent = result.css;
      if (!document.getElementById("theme-style")) {
        document.head.appendChild(styleElement);
      }

      // Apply CSS variables directly to the document root element
      const root = document.documentElement;

      // Extract and apply CSS variables from the generated CSS
      const rootVarsMatch = result.css.match(/:root\s*{([^}]*)}/s);
      if (rootVarsMatch && rootVarsMatch[1]) {
        const rootVars = rootVarsMatch[1].match(/--[^:]+:\s*[^;]+;/g) || [];
        rootVars.forEach((varDeclaration) => {
          const [name, value] = varDeclaration.split(/:\s*/);
          if (name && value) {
            root.style.setProperty(name.trim(), value.replace(/;$/, "").trim());
          }
        });
      }

      // Check if we're in dark mode and apply dark mode variables if needed
      if (document.documentElement.classList.contains("dark")) {
        const darkVarsMatch = result.css.match(/\.dark\s*{([^}]*)}/s);
        if (darkVarsMatch && darkVarsMatch[1]) {
          const darkVars = darkVarsMatch[1].match(/--[^:]+:\s*[^;]+;/g) || [];
          darkVars.forEach((varDeclaration) => {
            const [name, value] = varDeclaration.split(/:\s*/);
            if (name && value) {
              root.style.setProperty(name.trim(), value.replace(/;$/, "").trim());
            }
          });
        }
      }
    }
  }, [primaryColor, harmony, apply6030Rule]);

  // Generate a random primary color
  const handleRandomColor = () => {
    const newColor = generatePrimaryColor();
    setPrimaryColor(newColor.hex);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const root = document.documentElement;
    const newDarkMode = !root.classList.contains("dark");

    if (newDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setIsDarkMode(newDarkMode);

    // Re-apply the appropriate CSS variables based on current mode
    if (cssVars) {
      // Extract the appropriate set of variables
      const varsMatch = newDarkMode ? cssVars.match(/\.dark\s*{([^}]*)}/s) : cssVars.match(/:root\s*{([^}]*)}/s);

      if (varsMatch && varsMatch[1]) {
        const vars = varsMatch[1].match(/--[^:]+:\s*[^;]+;/g) || [];
        vars.forEach((varDeclaration) => {
          const [name, value] = varDeclaration.split(/:\s*/);
          if (name && value) {
            root.style.setProperty(name.trim(), value.replace(/;$/, "").trim());
          }
        });
      }
    }
  };

  // Color swatch component
  const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-md border border-border" style={{ backgroundColor: color }} />
      <span className="text-xs mt-1">{name}</span>
      <span className="text-xs text-muted-foreground">{color}</span>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shadcn Theme Palette Previewer</h1>
        <Button variant="outline" onClick={toggleDarkMode}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Theme Controls</CardTitle>
          <CardDescription>Customize your theme settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-10 h-10 rounded-md border border-border" style={{ backgroundColor: primaryColor }} />
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-24"
                  />
                  <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-32" />
                  <Button onClick={handleRandomColor}>Random</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="harmony-type">Harmony Type</Label>
                <Select value={harmony} onValueChange={(value) => setHarmony(value as ColorHarmony)}>
                  <SelectTrigger id="harmony-type" className="mt-1">
                    <SelectValue placeholder="Select harmony type" />
                  </SelectTrigger>
                  <SelectContent>
                    {harmonyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="apply-6030-rule" checked={apply6030Rule} onCheckedChange={setApply6030Rule} />
                <Label htmlFor="apply-6030-rule">Apply 60-30-10 Rule</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Palette Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Preview of the generated color palette</CardDescription>
        </CardHeader>
        <CardContent>
          {palette && (
            <Tabs defaultValue="light">
              <TabsList className="mb-4">
                <TabsTrigger value="light">Light Mode</TabsTrigger>
                <TabsTrigger value="dark">Dark Mode</TabsTrigger>
              </TabsList>

              <TabsContent value="light" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Background & Foreground</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.background.light} name="Background" />
                    <ColorSwatch color={palette.hex.foreground.light} name="Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Primary Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.primary.light} name="Primary" />
                    <ColorSwatch color={palette.hex["primary-foreground"].light} name="Primary Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Secondary Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.secondary.light} name="Secondary" />
                    <ColorSwatch color={palette.hex["secondary-foreground"].light} name="Secondary Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Accent Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.accent.light} name="Accent" />
                    <ColorSwatch color={palette.hex["accent-foreground"].light} name="Accent Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">UI Elements</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.muted.light} name="Muted" />
                    <ColorSwatch color={palette.hex["muted-foreground"].light} name="Muted Foreground" />
                    <ColorSwatch color={palette.hex.card.light} name="Card" />
                    <ColorSwatch color={palette.hex["card-foreground"].light} name="Card Foreground" />
                    <ColorSwatch color={palette.hex.popover.light} name="Popover" />
                    <ColorSwatch color={palette.hex["popover-foreground"].light} name="Popover Foreground" />
                    <ColorSwatch color={palette.hex.border.light} name="Border" />
                    <ColorSwatch color={palette.hex.input.light} name="Input" />
                    <ColorSwatch color={palette.hex.ring.light} name="Ring" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Semantic Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.destructive.light} name="Destructive" />
                    <ColorSwatch color={palette.hex["destructive-foreground"].light} name="Destructive Foreground" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dark" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Background & Foreground</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.background.dark} name="Background" />
                    <ColorSwatch color={palette.hex.foreground.dark} name="Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Primary Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.primary.dark} name="Primary" />
                    <ColorSwatch color={palette.hex["primary-foreground"].dark} name="Primary Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Secondary Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.secondary.dark} name="Secondary" />
                    <ColorSwatch color={palette.hex["secondary-foreground"].dark} name="Secondary Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Accent Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.accent.dark} name="Accent" />
                    <ColorSwatch color={palette.hex["accent-foreground"].dark} name="Accent Foreground" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">UI Elements</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.muted.dark} name="Muted" />
                    <ColorSwatch color={palette.hex["muted-foreground"].dark} name="Muted Foreground" />
                    <ColorSwatch color={palette.hex.card.dark} name="Card" />
                    <ColorSwatch color={palette.hex["card-foreground"].dark} name="Card Foreground" />
                    <ColorSwatch color={palette.hex.popover.dark} name="Popover" />
                    <ColorSwatch color={palette.hex["popover-foreground"].dark} name="Popover Foreground" />
                    <ColorSwatch color={palette.hex.border.dark} name="Border" />
                    <ColorSwatch color={palette.hex.input.dark} name="Input" />
                    <ColorSwatch color={palette.hex.ring.dark} name="Ring" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Semantic Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch color={palette.hex.destructive.dark} name="Destructive" />
                    <ColorSwatch color={palette.hex["destructive-foreground"].dark} name="Destructive Foreground" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Component Previews */}
      <Card>
        <CardHeader>
          <CardTitle>Component Previews</CardTitle>
          <CardDescription>See how the theme looks on various components</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buttons">
            <TabsList className="mb-4">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="dialogs">Dialogs</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
            </TabsList>

            <TabsContent value="buttons" className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Link Button</Button>
                <Button variant="destructive">Destructive Button</Button>
              </div>
            </TabsContent>

            <TabsContent value="badges" className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
                <Badge variant="destructive">Destructive Badge</Badge>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Card</CardTitle>
                    <CardDescription>This is a primary card component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card uses the primary color theme.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary">Action</Button>
                  </CardFooter>
                </Card>

                <Card className="bg-secondary text-secondary-foreground rounded-lg border border-border">
                  <CardHeader>
                    <CardTitle>Secondary Card</CardTitle>
                    <CardDescription className="text-secondary-foreground/70">This is a secondary card component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card uses the secondary color theme.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Action</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dialogs" className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>This is a dialog component with the current theme applied.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Dialog content goes here. This shows how your theme looks on dialog components.</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>

            <TabsContent value="tables" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>
                      <Badge variant="outline">Inactive</Badge>
                    </TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bob Johnson</TableCell>
                    <TableCell>
                      <Badge variant="secondary">On Leave</Badge>
                    </TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* CSS Variables */}
      <div className="mt-8">
        <Button variant="outline" onClick={() => window.open("/palette-previewer/css-vars", "_blank")}>
          View CSS Variables
        </Button>
      </div>
    </div>
  );
}
