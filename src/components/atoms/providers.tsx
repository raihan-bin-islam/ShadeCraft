"use client";
import { ReactNode } from "react";
import { Provider } from "jotai";

type Props = { children: ReactNode };

export const Providers = (props: Props) => {
  return <Provider>{props.children}</Provider>;
};
