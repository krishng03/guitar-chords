import type {
  ChordLine,
  ChordLinePart,
  ChordSection,
  ChordSheet,
} from "../models/ChordSheet";

export class WrytinProcessor {
  static process(html: string): ChordSheet {
    const capo = this.extractCapo(html);

    const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) ?? [];

    const sections: ChordSection[] = [];

    let currentSection: ChordSection = {
      title: "",
      lines: [],
    };

    for (const paragraph of paragraphs) {
      const content = paragraph
        .replace(/^<p\b[^>]*>/i, "")
        .replace(/<\/p>$/i, "");

      const lines = content.split(/<br\s*\/?>/i);

      for (const line of lines) {
        const cleanedLine = line.trim();

        if (!cleanedLine) {
          continue;
        }

        const parsedLine = this.parseLine(cleanedLine);

        if (parsedLine.parts.length > 0) {
          currentSection.lines.push(parsedLine);
        }
      }
    }

    if (currentSection.lines.length > 0) {
      sections.push(currentSection);
    }

    return {
      capo,
      sections,
    };
  }

  private static extractCapo(html: string): number | undefined {
    const match = html.match(/Capo\s*-\s*(\d+)(?:st|nd|rd|th)?\s*Fret/i);

    if (!match) {
      return undefined;
    }

    return Number(match[1]);
  }

  private static parseLine(html: string): ChordLine {
    const parts: ChordLinePart[] = [];

    const regex = /<strong\b[^>]*>\s*\(([^)]+)\)\s*<\/strong>/gi;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      const textBeforeChord = html.slice(lastIndex, match.index);

      if (textBeforeChord) {
        parts.push({
          type: "text",
          value: this.stripHtml(textBeforeChord),
        });
      }

      parts.push({
        type: "chord",
        value: match[1].trim(),
      });

      lastIndex = regex.lastIndex;
    }

    const remainingText = html.slice(lastIndex);

    if (remainingText) {
      parts.push({
        type: "text",
        value: this.stripHtml(remainingText),
      });
    }

    return {
      parts,
    };
  }

  private static stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
}
