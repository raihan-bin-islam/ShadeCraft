import { registerSlot } from "../_registry";
import { ListPane } from "./list-pane";
import { DetailPane } from "./detail-pane";
import { MetaPane } from "./meta-pane";

registerSlot("workspace-list-pane", ListPane);
registerSlot("workspace-detail-pane", DetailPane);
registerSlot("workspace-meta-pane", MetaPane);
