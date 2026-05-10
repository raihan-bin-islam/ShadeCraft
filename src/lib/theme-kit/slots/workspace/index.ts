import { registerSlot } from "../_registry-base";
import { ListPane } from "./list-pane";
import { DetailPane } from "./detail-pane";
import { MetaPane } from "./meta-pane";
import { WorkspaceMailClassic } from "./workspace-mail-classic";

registerSlot("list-pane", ListPane);
registerSlot("detail-pane", DetailPane);
registerSlot("meta-pane", MetaPane);
registerSlot("workspace-mail-classic", WorkspaceMailClassic);
