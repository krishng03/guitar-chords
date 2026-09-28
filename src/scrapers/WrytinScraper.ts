export class WrytinScraper {
  static scrape(html: string): string {
    // Find:
    // <div class="content wrytUp">
    // ...
    // </div>

    const match = html.match(
      /<div\b[^>]*class=["'][^"']*\bcontent\b[^"']*\bwrytUp\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
    );

    if (!match) {
      throw new Error('Wrytin content div not found');
    }

    return match[1];
  }
}
