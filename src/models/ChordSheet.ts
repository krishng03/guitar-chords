export type ChordPart = {
  type: "chord";
  value: string;
};

export type TextPart = {
  type: "text";
  value: string;
};

export type ChordLinePart = ChordPart | TextPart;

export type ChordLine = {
  parts: ChordLinePart[];
};

export type ChordSection = {
  title: string;
  lines: ChordLine[];
};

export type ChordSheet = {
  capo?: number;
  sections: ChordSection[];
};
