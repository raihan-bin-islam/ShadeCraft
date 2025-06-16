import { ThemeFormat, useThemeExport, type UseThemeExportOptions } from "@/hooks/theme-module/use-theme-export";
import { useThemeFormat } from "@/hooks/theme-module/use-theme-format";
import { useThemeGenerator, type UseThemeGeneratorOptions } from "@/hooks/theme-module/use-theme-generator";

export interface UseThemeGeneratorCompositeModuleOptions extends UseThemeGeneratorOptions, UseThemeExportOptions {
  defaultFormat?: ThemeFormat;
}

export const useThemeGeneratorCompositeModule = (options: UseThemeGeneratorCompositeModuleOptions = {}) => {
  const { defaultFormat = "oklch", ...restOptions } = options;

  const themeGenerator = useThemeGenerator(restOptions);
  const themeExport = useThemeExport(restOptions);
  const themeFormat = useThemeFormat(defaultFormat);

  return {
    ...themeGenerator,
    ...themeExport,
    ...themeFormat,
  };
};
