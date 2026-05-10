import { Sparkles } from "lucide-react";
import type { SlotComponentProps } from "../_types";
import { AuthForm } from "./auth-form";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CenteredForm(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand mark */}
        <div className="text-center">
          <Sparkles className="h-10 w-10 mx-auto text-primary" />
          <p className="mt-2 text-xl font-semibold">Acme</p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
