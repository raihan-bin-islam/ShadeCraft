import { describe, it, expect } from "vitest";
import { createCssVarsBuilder } from "./css-vars-builder";

describe("createCssVarsBuilder", () => {
  it("light() adds tokens unprefixed", () => {
    const vars = createCssVarsBuilder().light({ background: "white", foreground: "black" }).build();
    expect(vars).toEqual({ background: "white", foreground: "black" });
  });

  it("dark() prefixes tokens with 'dark-'", () => {
    const vars = createCssVarsBuilder().dark({ background: "black", foreground: "white" }).build();
    expect(vars).toEqual({ "dark-background": "black", "dark-foreground": "white" });
  });

  it("both() adds tokens in both light and dark forms", () => {
    const vars = createCssVarsBuilder().both({ toneId: "minimalist" }).build();
    expect(vars).toEqual({ toneId: "minimalist", "dark-toneId": "minimalist" });
  });

  it("merge() adds pre-prefixed tokens verbatim", () => {
    const vars = createCssVarsBuilder().merge({ "chart-1": "red", "dark-chart-1": "darkred" }).build();
    expect(vars).toEqual({ "chart-1": "red", "dark-chart-1": "darkred" });
  });

  it("build() returns a shallow copy (mutation does not affect builder state)", () => {
    const builder = createCssVarsBuilder().light({ background: "white" });
    const first = builder.build();
    first.background = "mutated";
    const second = builder.build();
    expect(second.background).toBe("white");
  });

  it("methods are chainable", () => {
    const vars = createCssVarsBuilder()
      .light({ a: "1" })
      .dark({ a: "2" })
      .both({ b: "3" })
      .merge({ "c-merged": "4" })
      .build();
    expect(vars).toEqual({ a: "1", "dark-a": "2", b: "3", "dark-b": "3", "c-merged": "4" });
  });
});
