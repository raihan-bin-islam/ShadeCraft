import { registerSlot } from "../_registry";
import { ContentBlock } from "./content-block";
import { MetaSidebar } from "./meta-sidebar";

registerSlot("content-block", ContentBlock);
registerSlot("meta-sidebar", MetaSidebar);
