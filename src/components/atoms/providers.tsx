import React, { ReactNode } from "react";
import { Provider } from "jotai";
import { CustomThemeProvider } from "@/components/organisms/theme/custom-theme-provider";

type Props = { children: ReactNode };

export const Providers = (props: Props) => {
  return (
    <Provider>
      <CustomThemeProvider defaultTheme="aurora">{props.children}</CustomThemeProvider>
    </Provider>
  );
};
