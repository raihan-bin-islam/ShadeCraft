import { registerSlot } from "../_registry";
import { ListPane } from "./list-pane";
import { DetailPane } from "./detail-pane";
import { MetaPane } from "./meta-pane";

registerSlot("list-pane", ListPane);
registerSlot("detail-pane", DetailPane);
registerSlot("meta-pane", MetaPane);
