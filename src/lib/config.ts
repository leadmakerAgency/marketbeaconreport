// Brevo IDs created for Market Beacon Report. Not secret: they only work with the API key.
export const LISTS = { weekly: 4, stocks: 5, mining: 6, tech: 7, pending: 8, enquiries: 9 } as const;
export const TEMPLATES = { confirm: 1, reminder: 2, already: 3, welcome: 4, goodbye: 5 } as const;
export const SENDER = { name: "Market Beacon Report", email: "editor@marketbeaconreport.com" };

export type DeskSlug = "weekly-beacon" | "stocks" | "mining-minerals" | "technology";

export type Desk = {
  slug: DeskSlug;
  key: keyof typeof LISTS;
  listId: number;
  /** Brevo campaign tag used to file sent issues in the web archive. */
  tag: string;
  name: string;
  short: string;
  code: string;
  cadence: string;
  sendTime: string;
  readTime: string;
  flagship?: boolean;
  description: string;
  covers: string[];
};

export const DESKS: Desk[] = [
  {
    slug: "weekly-beacon", key: "weekly", listId: LISTS.weekly, tag: "weekly",
    name: "The Weekly Beacon", short: "Weekly Beacon", code: "ALL MARKETS / SUNDAY", cadence: "Weekly",
    sendTime: "Sunday, 18:00 CET / 12:00 ET", readTime: "8 min read", flagship: true,
    description: "The five themes that moved markets this week across stocks, resources and tech, plus the calendar and watchlist for the week ahead.",
    covers: ["Five themes that moved markets", "Week-ahead calendar: rates, inflation, earnings", "Watchlist across stocks, mining and tech", "One chart that explains the week"],
  },
  {
    slug: "stocks", key: "stocks", listId: LISTS.stocks, tag: "stocks",
    name: "Stocks", short: "Stocks", code: "NYSE / NASDAQ / TSX / XETRA", cadence: "Weekdays",
    sendTime: "Weekdays, 08:00 ET", readTime: "3 min read",
    description: "Wall Street, Toronto and Frankfurt before the US open: futures, earnings, guidance changes and the five moves that matter today.",
    covers: ["S&P 500, S&P/TSX and DAX in one table", "Earnings beats, misses and guidance changes", "Financings, buybacks and corporate news", "The data release or decision to watch today"],
  },
  {
    slug: "mining-minerals", key: "mining", listId: LISTS.mining, tag: "mining",
    name: "Mining and Minerals", short: "Mining", code: "TSX-V / ASX / LME", cadence: "Twice weekly",
    sendTime: "Tuesday and Friday", readTime: "5 min read",
    description: "Commodity prices, drill results, resource updates and critical minerals policy across copper, gold, uranium, lithium and antimony.",
    covers: ["Gold, copper, uranium and lithium prices", "Drill results and resource upgrades", "Critical minerals policy and offtake deals", "Junior explorer financings"],
  },
  {
    slug: "technology", key: "tech", listId: LISTS.tech, tag: "tech",
    name: "Technology", short: "Tech", code: "AI / SEMIS / SOFTWARE", cadence: "Weekly",
    sendTime: "Wednesday", readTime: "5 min read",
    description: "Listed technology through an investor's lens: AI infrastructure spending, semiconductors, software earnings and the IPO pipeline.",
    covers: ["AI infrastructure and data centre spending", "Semiconductor supply and demand", "Software and platform earnings", "Tech IPOs and deals"],
  },
];

export const ARCHIVE_TAGS: Record<string, string> = {
  weekly: "The Weekly Beacon",
  stocks: "Stocks",
  mining: "Mining and Minerals",
  tech: "Technology",
  monthly: "Monthly Review",
  flash: "Market Flash",
};

export function getDesk(slug: string) {
  return DESKS.find((d) => d.slug === slug);
}
export const DESK_SLUGS = DESKS.map((d) => d.slug) as [DeskSlug, ...DeskSlug[]];
export const DESK_LIST_IDS: number[] = DESKS.map((d) => d.listId);
