import {
  Anton,
  Be_Vietnam_Pro,
  Bebas_Neue,
  Cormorant_Garamond,
  IBM_Plex_Sans,
  Inter,
  Lato,
  League_Spartan,
  Lora,
  Merriweather,
  Montserrat,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Public_Sans,
  Rajdhani,
  Raleway,
  // Popular additions:
  Roboto,
  Rubik,
  Source_Sans_3,
  Space_Grotesk,
  Work_Sans,
  // New monospace fonts:
  Fira_Code,
  JetBrains_Mono,
  Source_Code_Pro,
  IBM_Plex_Mono,
  Inconsolata,
} from "next/font/google";

// Original fonts (tone-specific, brutalist, popular web)
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

// New monospace fonts
export const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-fira-code" });
export const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-jetbrains-mono" });
export const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-source-code-pro" });
export const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-ibm-plex-mono" });
export const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inconsolata" });

export const FONT_OBJECTS = {
  // tone‑specific
  inter: {
    name: "Inter",
    variable: inter.variable,
    className: inter.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  ibmPlexSans: {
    name: "IBM Plex Sans",
    variable: ibmPlexSans.variable,
    className: ibmPlexSans.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  beVietnamPro: {
    name: "Be Vietnam Pro",
    variable: beVietnamPro.variable,
    className: beVietnamPro.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  rubik: {
    name: "Rubik",
    variable: rubik.variable,
    className: rubik.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  workSans: {
    name: "Work Sans",
    variable: workSans.variable,
    className: workSans.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  publicSans: {
    name: "Public Sans",
    variable: publicSans.variable,
    className: publicSans.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  poppins: {
    name: "Poppins",
    variable: poppins.variable,
    className: poppins.className,
    group: "tone-specific",
    fallback: "sans-serif",
  },
  lora: {
    name: "Lora",
    variable: lora.variable,
    className: lora.className,
    group: "tone-specific",
    fallback: "serif",
  },
  merriweather: {
    name: "Merriweather",
    variable: merriweather.variable,
    className: merriweather.className,
    group: "tone-specific",
    fallback: "serif",
  },
  cormorantGaramond: {
    name: "Cormorant Garamond",
    variable: cormorantGaramond.variable,
    className: cormorantGaramond.className,
    group: "tone-specific",
    fallback: "serif",
  },
  playfair: {
    name: "Playfair Display",
    variable: playfair.variable,
    className: playfair.className,
    group: "tone-specific",
    fallback: "serif",
  },

  // brutalist display
  spaceGrotesk: {
    name: "Space Grotesk",
    variable: spaceGrotesk.variable,
    className: spaceGrotesk.className,
    group: "brutalist",
    fallback: "sans-serif",
  },
  anton: {
    name: "Anton",
    variable: anton.variable,
    className: anton.className,
    group: "brutalist",
    fallback: "sans-serif",
  },
  bebasNeue: {
    name: "Bebas Neue",
    variable: bebasNeue.variable,
    className: bebasNeue.className,
    group: "brutalist",
    fallback: "sans-serif",
  },
  leagueSpartan: {
    name: "League Spartan",
    variable: leagueSpartan.variable,
    className: leagueSpartan.className,
    group: "brutalist",
    fallback: "sans-serif",
  },
  rajdhani: {
    name: "Rajdhani",
    variable: rajdhani.variable,
    className: rajdhani.className,
    group: "brutalist",
    fallback: "sans-serif",
  },

  // popular web fonts
  roboto: {
    name: "Roboto",
    variable: roboto.variable,
    className: roboto.className,
    group: "popular-web",
    fallback: "sans-serif",
  },
  openSans: {
    name: "Open Sans",
    variable: openSans.variable,
    className: openSans.className,
    group: "popular-web",
    fallback: "sans-serif",
  },
  lato: {
    name: "Lato",
    variable: lato.variable,
    className: lato.className,
    group: "popular-web",
    fallback: "sans-serif",
  },
  montserrat: {
    name: "Montserrat",
    variable: montserrat.variable,
    className: montserrat.className,
    group: "popular-web",
    fallback: "sans-serif",
  },
  sourceSansPro: {
    name: "Source Sans Pro",
    variable: sourceSansPro.variable,
    className: sourceSansPro.className,
    group: "popular-web",
    fallback: "sans-serif",
  },
  raleway: {
    name: "Raleway",
    variable: raleway.variable,
    className: raleway.className,
    group: "popular-web",
    fallback: "sans-serif",
  },

  // newly added monospace fonts
  firaCode: {
    name: "Fira Code",
    variable: firaCode.variable,
    className: firaCode.className,
    group: "monospace",
    fallback: "monospace",
  },
  jetBrainsMono: {
    name: "JetBrains Mono",
    variable: jetBrainsMono.variable,
    className: jetBrainsMono.className,
    group: "monospace",
    fallback: "monospace",
  },
  sourceCodePro: {
    name: "Source Code Pro",
    variable: sourceCodePro.variable,
    className: sourceCodePro.className,
    group: "monospace",
    fallback: "monospace",
  },
  ibmPlexMono: {
    name: "IBM Plex Mono",
    variable: ibmPlexMono.variable,
    className: ibmPlexMono.className,
    group: "monospace",
    fallback: "monospace",
  },
  inconsolata: {
    name: "Inconsolata",
    variable: inconsolata.variable,
    className: inconsolata.className,
    group: "monospace",
    fallback: "monospace",
  },
};
