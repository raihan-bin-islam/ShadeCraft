import { registerSlot } from "../_registry";
import { HeroCentered } from "./hero-centered";
import { HeroSplit } from "./hero-split";
import { HeroBento } from "./hero-bento";
import { HeroFullbleed } from "./hero-fullbleed";

registerSlot("hero-centered", HeroCentered);
registerSlot("hero-split", HeroSplit);
registerSlot("hero-bento", HeroBento);
registerSlot("hero-fullbleed", HeroFullbleed);
