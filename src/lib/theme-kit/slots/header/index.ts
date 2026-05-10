import { registerSlot } from "../_registry-base";
import { HeaderMinimal } from "./header-minimal";
import { HeaderGlass } from "./header-glass";
import { HeaderBold } from "./header-bold";

registerSlot("header-minimal", HeaderMinimal);
registerSlot("header-glass", HeaderGlass);
registerSlot("header-bold", HeaderBold);
