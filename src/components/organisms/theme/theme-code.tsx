import ClickSpark from "@/components/react-bits/ClickSpark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { exportThemeToCss } from "@/lib/theme-kit/generators/css";
import { Check, Code2, Copy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export const ThemeCode = () => {
  const { currentTheme } = useThemeGenerator();
  const [isCopied, setIsCopied] = useState(false);
  const css = useMemo(() => (currentTheme ? exportThemeToCss(currentTheme?.cssVars) : null), [currentTheme]);

  const copyToClipboard = useCallback(async () => {
    try {
      setIsCopied(true);
      if (css) await navigator.clipboard.writeText(css);
    } catch (error) {
    } finally {
      setTimeout(() => setIsCopied(false), 1000);
    }
  }, [css]);

  return (
    <Dialog>
      <DialogTrigger>
        <ClickSpark sparkColor="#9AE600" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
          <Button asChild variant="outline" size="icon" className="active:scale-95">
            <span>
              <Code2 />
            </span>
          </Button>
        </ClickSpark>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 max-h-[80vh] min-w-4xl overflow-y-auto p-0">
        <DialogHeader className="bg-input border-b p-5">
          <DialogTitle>Export Theme</DialogTitle>
        </DialogHeader>
        <div className="relative grow overflow-y-auto p-5">
          <Button
            disabled={isCopied}
            onClick={copyToClipboard}
            variant="secondary"
            className="active:scale-95 min-w-28 justify-start sticky left-full top-0 w-fit"
          >
            {isCopied ? (
              <>
                <Check strokeWidth={2} /> Copied
              </>
            ) : (
              <>
                <Copy strokeWidth={2} /> Copy CSS
              </>
            )}
          </Button>
          <pre
            className="text-pretty text-sm -mt-9"
            dangerouslySetInnerHTML={{ __html: `<code class="font-code">${css ?? ""}</code>` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
