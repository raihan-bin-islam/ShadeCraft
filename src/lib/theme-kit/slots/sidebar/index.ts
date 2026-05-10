import { registerSlot } from "../_registry-base";
import { SidebarIcon } from "./sidebar-icon";
import { SidebarRich } from "./sidebar-rich";
import { SidebarFloating } from "./sidebar-floating";

registerSlot("sidebar-icon", SidebarIcon);
registerSlot("sidebar-rich", SidebarRich);
registerSlot("sidebar-floating", SidebarFloating);
