import type { SlotPosition } from "@/types/theme-kit/layout";

/** Props passed to every slot component by the LayoutPreview renderer. */
export interface SlotComponentProps {
  /** Optional positional hint for the slot. Most components ignore it. */
  position?: SlotPosition;
}

/** Component signature every slot variant must satisfy. */
export type SlotComponent = (props: SlotComponentProps) => React.JSX.Element;
