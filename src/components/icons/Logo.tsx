import { cn } from "@/lib/utils";
import * as React from "react";
import { SVGProps } from "react";
export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 99.45 94.71"
    {...props}
    className={cn(
      "[&>path:nth-of-type(1)]:fill-yellow-400 [&>path:nth-of-type(2)]:fill-lime-400 [&>path:nth-of-type(3)]:stroke-cyan-900",
      props.className
    )}
  >
    <path d="M49.75 67.35h20.16v-18H25.09v-26h44.82V7H7V67.36h42.75v-.01z" />
    <path d="M92.45 35.97v-8.62H29.58v18H74.4V71.36H29.58V87.71H92.45V35.97z" />
    <path
      d="M92.45 23.31v.04H73.91V3H7v.03H3v68.35l4-.03h18.58V91.7h66.87v-.04h4V23.31h-4ZM7 67.36V7h62.91v16.35H25.09v26h44.82v18H7Zm85.45-9.34v29.69H29.58V71.36H74.4v-26H29.58v-18h62.87v30.66Z"
      style={{
        strokeWidth: 6,
        strokeMiterlimit: 10,
      }}
    />
  </svg>
);
