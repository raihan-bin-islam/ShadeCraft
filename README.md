# Shadcn Theme Generator

A powerful and flexible theme generator for [shadcn/ui](https://ui.shadcn.com/) components, leveraging modern color science with OKLCH color space to create beautiful, accessible, and harmonious themes.

## Features

- **Advanced Color Harmonies**: Generate themes using various color harmony models:

  - Analogous
  - Complementary
  - Triadic
  - Tetradic
  - Monochromatic
  - Split-complementary

- **OKLCH Color Space**: Uses perceptually uniform OKLCH color space for better color representation and accessibility

- **Dark/Light Mode Support**: Automatically generates appropriate colors for both dark and light modes

- **Flexible Output Formats**: Export your theme as CSS variables or JSON

- **Chart Colors**: Includes a set of chart colors that work well with your theme

## Installation

```bash
# Clone the repository
git clone https://github.com/raihan-bin-islam/ShadeCraft.git
cd ShadeCraft

# Install dependencies
npm install
# or
yarn
# or
pnpm install
```

## Development

```bash
# Start the development server with Turbopack
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Basic Usage

```typescript
import { generateTheme } from "./utils/theme-generator";

// Generate a theme with default settings (analogous harmony, CSS output)
const theme = generateTheme("#3b82f6"); // Use any hex color as your primary color

// Apply the theme to your application
console.log(theme); // CSS string with all theme variables
```

### Advanced Usage

```typescript
import { generateTheme } from "./utils/theme-generator";

// Generate a theme with custom settings
const theme = generateTheme(
  "#3b82f6", // Primary color (hex)
  "complementary", // Color harmony
  "both", // Output format: "css", "json", or "both"
  true // Include hex values in CSS comments (for debugging)
);

// If output format is "both", you get an object with CSS and palette properties
const { css, palette } = theme;

// Apply the CSS to your application
document.documentElement.style.cssText = css;

// Or use the palette object for custom processing
console.log(palette);
```

### Available Color Harmonies

- `"analogous"` - Colors that are adjacent to each other on the color wheel
- `"complementary"` - Colors that are opposite each other on the color wheel
- `"triadic"` - Three colors equally spaced around the color wheel
- `"tetradic"` - Four colors arranged into two complementary pairs
- `"monochromatic"` - Different shades and tints of a single color
- `"split-complementary"` - A color and two colors adjacent to its complement

## Theme Structure

The generated theme includes variables for:

- Primary, secondary, and accent colors
- Background and foreground colors
- Card, popover, and sidebar components
- Muted and destructive states
- Input and border styles
- Chart colors for data visualization

## Upcoming Features

- **Custom Color Palette Editor**: Visual interface for creating and editing custom color palettes
- **Theme Export Options**: Additional export formats including Tailwind config
- **Accessibility Checker**: Built-in tools to verify WCAG compliance for generated themes
- **Theme Sharing**: Ability to share themes via URL or community gallery
- **Component Preview**: Live preview of all shadcn/ui components with your theme applied
- **Theme Version Control**: Save and track changes to your themes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
