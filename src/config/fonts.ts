// fonts.ts
import {
  Inter,
  IBM_Plex_Sans,
  Be_Vietnam_Pro,
  Rubik,
  Work_Sans,
  Public_Sans,
  Poppins,
  Lora,
  Merriweather,
  Cormorant_Garamond,
  Playfair_Display,
  Space_Grotesk,
  Anton,
  Bebas_Neue,
  League_Spartan,
  Rajdhani,

  // Popular additions:
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Source_Sans_3,
  Raleway,
} from "next/font/google";

// — tone‑specific / production‑safe fonts —
export const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});
export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});
export const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-rubik" });
export const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-work-sans" });
export const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
});
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
export const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora" });
export const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-merriweather" });
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});
export const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-playfair" });

// — display fonts (brutalist only) —
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});
export const anton = Anton({ subsets: ["latin"], weight: ["400"], variable: "--font-anton" });
export const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"], variable: "--font-bebas-neue" });
export const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-league-spartan",
});
export const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-rajdhani" });

// — extra “popular” Google fonts —
export const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" });
export const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-open-sans" });
export const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" });
export const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-montserrat" });
export const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans-pro",
});
export const raleway = Raleway({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-raleway" });

export const FONT_OBJECTS = {
  // tone‑specific
  inter: {
    name: "Inter",
    variable: inter.variable,
    className: inter.className,
    group: "tone-specific",
  },
  ibmPlexSans: {
    name: "IBM Plex Sans",
    variable: ibmPlexSans.variable,
    className: ibmPlexSans.className,
    group: "tone-specific",
  },
  beVietnamPro: {
    name: "Be Vietnam Pro",
    variable: beVietnamPro.variable,
    className: beVietnamPro.className,
    group: "tone-specific",
  },
  rubik: {
    name: "Rubik",
    variable: rubik.variable,
    className: rubik.className,
    group: "tone-specific",
  },
  workSans: {
    name: "Work Sans",
    variable: workSans.variable,
    className: workSans.className,
    group: "tone-specific",
  },
  publicSans: {
    name: "Public Sans",
    variable: publicSans.variable,
    className: publicSans.className,
    group: "tone-specific",
  },
  poppins: {
    name: "Poppins",
    variable: poppins.variable,
    className: poppins.className,
    group: "tone-specific",
  },
  lora: {
    name: "Lora",
    variable: lora.variable,
    className: lora.className,
    group: "tone-specific",
  },
  merriweather: {
    name: "Merriweather",
    variable: merriweather.variable,
    className: merriweather.className,
    group: "tone-specific",
  },
  cormorantGaramond: {
    name: "Cormorant Garamond",
    variable: cormorantGaramond.variable,
    className: cormorantGaramond.className,
    group: "tone-specific",
  },
  playfair: {
    name: "Playfair Display",
    variable: playfair.variable,
    className: playfair.className,
    group: "tone-specific",
  },

  // brutalist display
  spaceGrotesk: {
    name: "Space Grotesk",
    variable: spaceGrotesk.variable,
    className: spaceGrotesk.className,
    group: "brutalist",
  },
  anton: {
    name: "Anton",
    variable: anton.variable,
    className: anton.className,
    group: "brutalist",
  },
  bebasNeue: {
    name: "Bebas Neue",
    variable: bebasNeue.variable,
    className: bebasNeue.className,
    group: "brutalist",
  },
  leagueSpartan: {
    name: "League Spartan",
    variable: leagueSpartan.variable,
    className: leagueSpartan.className,
    group: "brutalist",
  },
  rajdhani: {
    name: "Rajdhani",
    variable: rajdhani.variable,
    className: rajdhani.className,
    group: "brutalist",
  },

  // popular web fonts
  roboto: {
    name: "Roboto",
    variable: roboto.variable,
    className: roboto.className,
    group: "popular-web",
  },
  openSans: {
    name: "Open Sans",
    variable: openSans.variable,
    className: openSans.className,
    group: "popular-web",
  },
  lato: {
    name: "Lato",
    variable: lato.variable,
    className: lato.className,
    group: "popular-web",
  },
  montserrat: {
    name: "Montserrat",
    variable: montserrat.variable,
    className: montserrat.className,
    group: "popular-web",
  },
  sourceSansPro: {
    name: "Source Sans Pro",
    variable: sourceSansPro.variable,
    className: sourceSansPro.className,
    group: "popular-web",
  },
  raleway: {
    name: "Raleway",
    variable: raleway.variable,
    className: raleway.className,
    group: "popular-web",
  },
};
