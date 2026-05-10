import { registerSlot } from "../_registry-base";
import { FooterMinimal } from "./footer-minimal";
import { FooterRich } from "./footer-rich";

registerSlot("footer-minimal", FooterMinimal);
registerSlot("footer-rich", FooterRich);
