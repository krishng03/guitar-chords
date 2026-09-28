import { SCRAPER_DOMAINS } from "../constants/scraper";
import { WrytinScraper } from "./WrytinScraper";

export type Scraper = {
  scrape(html: string): string;
};

export class ScraperFactory {
  static getScraper(url: string): Scraper {
    const hostname = new URL(url).hostname.replace(/^www\./, "");

    switch (hostname) {
      case SCRAPER_DOMAINS.WRYTIN:
        return WrytinScraper;

      default:
        throw new Error(`No scraper available for domain: ${hostname}`);
    }
  }
}
