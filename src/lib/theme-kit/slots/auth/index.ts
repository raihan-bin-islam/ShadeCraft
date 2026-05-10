import { registerSlot } from "../_registry-base";
import { ImagePanel } from "./image-panel";
import { FormPanel } from "./form-panel";
import { CenteredForm } from "./centered-form";

registerSlot("image-panel", ImagePanel);
registerSlot("form-panel", FormPanel);
registerSlot("centered-form", CenteredForm);
