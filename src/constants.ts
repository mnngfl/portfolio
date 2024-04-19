export const scaleFactor = 2;

export interface DialogData {
  sign: string;
  chair: string;
  door: string;
  table: string;
  inst: string;
  gallery: string;
  book: string;
  radio: string;
}

export enum ShowMark {
  sign,
  computer,
  table,
  inst,
  gallery,
  book,
  cat,
  radio,
}

export const dialogData: DialogData = {
  sign: `2`,
  chair: `1`,
  door: `여기서 나가고 싶으시다면 탭을 종료하세요!`,
  table: `4`,
  inst: `5`,
  gallery: `6`,
  book: `7`,
  radio: `8`,
};
