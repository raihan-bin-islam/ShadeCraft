import { registerSlot } from "../_registry-base";
import { Features3col } from "./features-3col";
import { FeaturesBento } from "./features-bento";
import { FeaturesAlternating } from "./features-alternating";

registerSlot("features-3col", Features3col);
registerSlot("features-bento", FeaturesBento);
registerSlot("features-alternating", FeaturesAlternating);
