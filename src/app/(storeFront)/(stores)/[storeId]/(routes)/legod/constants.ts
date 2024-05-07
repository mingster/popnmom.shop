export interface iBigCrossContext {
  Lego11: string;
  Lego12: string;
  Lego13: string;
  Lego14: string;
  Lego21: string;
  Lego22: string;
  Lego23: string;
  Lego24: string;
  Lego25: string;
  Lego31: string;
  Lego32: string;
  Lego33: string;
  Lego34: string;
  Chain: string;
  words: string;
}
export interface iSmallCrossContext {
  Lego11: string;
  Lego12: string;
  Lego13: string;
  Lego21: string;
  Lego22: string;
  Lego23: string;
  Lego31: string;
  Lego32: string;
  Lego33: string;
  Chain: string;
  words: string;
}

export type CrossPreset = {
  name: string;
  words: string;
  parts: LegoPart[];
};
export type LegoPart = {
  name: string;
  color: LEGO_Color;
};
export type LEGO_Color = {
  color: string;
  name: string;
};

export const LEGO_COLORS: LEGO_Color[] = [
  { color: '#0057b8', name: '藍2935C' },
  { color: '#00afd7', name: '粉藍638C' },
  { color: '#003057', name: '深藍540C' },
  { color: '#d22630', name: '紅1795C' },
  { color: '#00843d', name: '綠348C' },
  { color: '#97d700', name: '萊姆綠375C' },
  { color: '#ffcd00', name: '鵝黃116C' },
  { color: '#ecb3cb', name: '淺粉203C' },
  { color: '#e56db1', name: '深粉218C' },
  { color: '#a2aaad', name: '淺灰429C' },
  { color: '#5b6770', name: '深灰431C' },
  { color: '#101820', name: '黑Black6' },
  { color: '#f1f0ed', name: '白 000C' },
];

export const CHAIN_COLORS: LEGO_Color[] = [
  { color: '#a2aaad', name: '淺灰429C' },
  { color: '#5b6770', name: '深灰431C' },
];

export const DefaultBigCrossPreset: CrossPreset = {
  name: 'DefaultBigCrossPreset',
  words: 'LEGOD',
  parts: [
    //{ name: "Lego11", color: { color: "#003057", name: "藍2935C" } },
    { name: 'Lego11', color: LEGO_COLORS[0] },
    { name: 'Lego12', color: LEGO_COLORS[1] },
    { name: 'Lego13', color: LEGO_COLORS[2] },
    { name: 'Lego14', color: LEGO_COLORS[3] },
    { name: 'Lego21', color: LEGO_COLORS[4] },
    { name: 'Lego22', color: LEGO_COLORS[5] },
    { name: 'Lego23', color: LEGO_COLORS[6] },
    { name: 'Lego24', color: LEGO_COLORS[7] },
    { name: 'Lego25', color: LEGO_COLORS[8] },
    { name: 'Lego31', color: LEGO_COLORS[1] },
    { name: 'Lego32', color: LEGO_COLORS[2] },
    { name: 'Lego33', color: LEGO_COLORS[3] },
    { name: 'Lego34', color: LEGO_COLORS[4] },
    { name: 'Chain', color: CHAIN_COLORS[0] },
  ],
};

export const DefaultSmallCrossPreset: CrossPreset = {
  name: 'DefaultSmallCrossPreset',
  words: 'GOD',
  parts: [
    { name: 'Lego11', color: LEGO_COLORS[0] },
    { name: 'Lego12', color: LEGO_COLORS[1] },
    { name: 'Lego13', color: LEGO_COLORS[2] },

    { name: 'Lego21', color: LEGO_COLORS[3] },
    { name: 'Lego22', color: LEGO_COLORS[4] },
    { name: 'Lego23', color: LEGO_COLORS[5] },

    { name: 'Lego31', color: LEGO_COLORS[1] },
    { name: 'Lego32', color: LEGO_COLORS[2] },
    { name: 'Lego33', color: LEGO_COLORS[3] },

    { name: 'Chain', color: CHAIN_COLORS[0] },
  ],
};
