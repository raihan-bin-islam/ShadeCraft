import type { SlotComponentProps } from "../_types";
import { AuthForm } from "./auth-form";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FormPanel(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="flex w-full items-center justify-center bg-background p-12 md:w-1/2">
      <AuthForm />
    </div>
  );
}
