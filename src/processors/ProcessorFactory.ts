import { SCRAPER_DOMAINS } from "../constants/scraper";
import { WrytinProcessor } from "./WrytinProcessor";

export type Processor = {
  process(html: string): any;
};

export class ProcessorFactory {
  static getProcessor(url: string): Processor {
    const hostname = new URL(url).hostname.replace(/^www\./, "");

    switch (hostname) {
      case SCRAPER_DOMAINS.WRYTIN:
        return WrytinProcessor;

      default:
        throw new Error(
          `No processor available for domain: ${hostname}`
        );
    }
  }
}
