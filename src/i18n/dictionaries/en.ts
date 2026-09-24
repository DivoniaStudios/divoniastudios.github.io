import type { Dictionary } from "./tr";

/** Date For Dead copy comes from the official English Steam page. */
export const en: Dictionary = {
  meta: {
    siteName: "Divonia Studios",
    title: "Divonia Studios · Game studio",
    description:
      "An independent studio making games for PC, mobile and physical spaces. Our first game, Date For Dead, is coming to Steam.",
  },
  common: {
    skipToContent: "Skip to content",
    wishlist: "Wishlist",
    wishlistLong: "Wishlist on Steam",
    startProject: "Start a project",
    opensNewTab: "opens in a new tab",
  },
  nav: {
    home: "Home",
    games: "Games",
    services: "Services",
    contact: "Contact",
    mainNav: "Main menu",
    menu: "Open menu",
    close: "Close menu",
    paused: "PAUSED",
    resume: "Resume",
    langLabel: "Language",
  },
  hud: {
    level: "LEVEL",
    progress: "PROGRESS",
  },
  hero: {
    title: [
      { text: "We make our own games.", accent: false },
      { text: " Yours too.", accent: true },
    ],
    subtitle:
      "Divonia Studios is an independent studio making games for PC, mobile and physical spaces.",
    ctaPrimary: "Explore Date For Dead",
    panels: [
      {
        title: "Our own game: Date For Dead",
        text: "A narrative-driven dating sim where your choices shape your relationships. What Victoria is looking for isn’t a new love; it’s a way to bring love back.",
        link: "See the game",
      },
      {
        title: "Games for brands",
        text: "We developed a PC game for Logo’s Software Development Center at KidZania Istanbul, where kids discover the world of software by playing. We design every game around the brand’s space and goal.",
        link: "See services",
      },
      {
        title: "PC, mobile, venues",
        text: "We take games from a screen all the way into a physical space. PhotoSensia Kids is live on iOS and Android.",
        link: "All games",
      },
    ],
  },
  deck: {
    title: "Swipe right. Fall in love. Don't ask what it costs.",
    text: "Date For Dead is a narrative-driven dating sim where your choices shape your relationships. As Victoria Frankenstein, swipe through profiles, flirt and go on dates. But what Victoria is looking for isn’t a new love; it’s a way to bring love back.",
    facts: [
      { k: "Platform", v: "Windows" },
      { k: "Languages", v: "English, Turkish" },
      { k: "Status", v: "Early Access, coming soon" },
    ],
    pass: "Pass",
    like: "Like",
    hint: "Drag the card or use the arrow keys.",
    matched: "It's a match",
    mysteryName: "And others",
    mysteryRole: "And others who might actually care about you",
    endTitle: "They're all waiting.",
    endText: "Wishlist Date For Dead and be the first to know when it launches.",
    restart: "Start over",
    matches: "Matches",
    ageLabel: "years old",
    deckLabel: "Date For Dead character deck",
    more: "Game page",
  },
  quests: {
    title: "Completed quests",
    intro: "Games we made for brands and institutions.",
    client: "Client",
    platform: "Platform",
    year: "Year",
    done: "COMPLETE",
  },
  platforms: {
    pc: "PC",
    ios: "iOS",
    android: "Android",
    installation: "Venue installation",
  },
  stores: {
    steam: "Steam",
    appstore: "App Store",
    googleplay: "Google Play",
    web: "Visit the center",
  },
  skills: {
    title: "Skill tree",
    intro: "What we do, and the game behind each skill.",
    proof: "Play",
    items: [
      {
        id: "custom",
        title: "Custom game development",
        text: "End-to-end production for PC and mobile, from idea to launch.",
        game: "date-for-dead",
      },
      {
        id: "mobile",
        title: "Mobile games",
        text: "Games for iOS and Android, store release included.",
        game: "photosensia-kids",
      },
      {
        id: "brand",
        title: "Brand experiences",
        text: "Interactive installations and games for venues and brands.",
        game: "kidzania",
      },
      {
        id: "unity",
        title: "Unity prototyping",
        text: "Quick prototypes that show whether an idea is actually fun to play.",
        game: "",
      },
    ],
  },
  continueScreen: {
    title: "CONTINUE?",
    text: "Got a game in mind? Tell us about it and we'll make it playable.",
    or: "or write to us directly:",
  },
  footer: {
    tagline: "An independent studio making games for PC, mobile and venues.",
    rights: "All rights reserved.",
    follow: "Follow",
    email: "contact@divoniastudios.com",
  },
  gamesPage: {
    title: "Games",
    subtitle: "Our own game, and the ones we made for brands.",
    own: "Our game",
    client: "Client work",
    view: "View game",
  },
  gamePage: {
    about: "About the game",
    speaker: "Narrator",
    lines: [
      "What if moving on wasn't that simple?",
      "You play as Victoria Frankenstein, a brilliant scientist navigating life after a devastating loss.",
      "Trying to move forward, she turns to a dating app. Meeting strangers, forming connections, chasing something that feels just out of reach.",
      "Behind every perfect date lies a secret: You're not looking for love. You're trying to bring love back.",
    ],
    next: "Next",
    replay: "Read again",
    dialogueHint: "Click or press Enter",
    featuresTitle: "A different kind of dating sim",
    features: [
      {
        title: "Choices that shape more",
        text: "Build attraction through dialogue and actions, discover hidden sides of each character, decide how far you're willing to go.",
      },
      {
        title: "Something beneath the surface",
        text: "Some moments repeat in strange ways. Some connections feel heavier than they should. Some silences say too much.",
      },
      {
        title: "Funny, uncomfortable, tragic",
        text: "Dark romantic comedy, emotional storytelling and philosophical undertones. Intimate, and ultimately tragic.",
      },
    ],
    castTitle: "Who you'll meet",
    galleryTitle: "Screenshots",
    galleryLabel: "Screenshot",
    factsTitle: "Details",
    facts: [
      { k: "Developer", v: "Divonia Studios" },
      { k: "Publisher", v: "Divonia Studios" },
      { k: "Platform", v: "Windows 10/11 (64-bit)" },
      { k: "Languages", v: "English, Turkish" },
      { k: "Genre", v: "Visual novel, dating sim" },
      { k: "Release", v: "To be announced (Early Access)" },
    ],
    ctaTitle: "Be the first to know.",
    ctaText: "Add it to your wishlist and Steam will tell you the day it launches.",
  },
  servicesPage: {
    title: "Services",
    subtitle:
      "We make games for brands and institutions, and bring what we learn building our own game into your project.",
    processTitle: "How we work",
    process: [
      {
        title: "Make it playable",
        text: "We turn the idea into a small, playable prototype first. Not everything that reads well on paper feels good in a game.",
      },
      {
        title: "Build it together",
        text: "Design, code and art run in one team. You follow progress through playable builds, not slide decks.",
      },
      {
        title: "Get it to players",
        text: "Steam, the App Store, Google Play or an installation on site: we stay on it until the game reaches its players.",
      },
    ],
  },
  contactPage: {
    title: "Contact",
    subtitle:
      "A game idea, a brand project or a press question. Write to us and we'll get back to you.",
    form: {
      name: "Your name",
      email: "Email",
      subject: "Topic",
      subjects: [
        "Custom game",
        "Brand experience",
        "Mobile game",
        "Press and publishers",
        "Other",
      ],
      message: "Message",
      messagePlaceholder: "Tell us briefly about the project, the goal and the timeline.",
      submit: "Send",
      note: "Pressing Send opens your email app with this message.",
      required: "This field is required.",
      invalidEmail: "Enter a valid email address.",
    },
    direct: "Email us directly",
    social: "Social",
  },
};
