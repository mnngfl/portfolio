export const scaleFactor = 2;

export interface DialogData {
  sign: string;
  chair: string;
  door: string;
  table: string;
  gallery: string;
  book: string;
  cat: null;
  radio: null;
}

export enum ShowMark {
  sign,
  computer,
  table,
  gallery,
  book,
  cat,
  radio,
}

export const dialogData: DialogData = {
  sign: `안녕하세요!<br>저의 <2D World Portfolio>에 방문해주셔서 감사합니다.<br>화면에 느낌표가 표시된 부근에 가까이 다가가면 다양한 내용을 확인해 보실 수 있습니다!`,
  chair: `연락`,
  door: `여기서 나가고 싶으시다면 탭을 종료하면 됩니다!`,
  table: `저는 프론트엔드 개발자 강효민입니다.<br>~~에 열정을 가지고 있습니다.<br><br>저의 이력서를 확인해보고 싶으시다면 <a href="http://rallit.com/resumes/1272974@gya1" target="_blank">이 링크</a>를 클릭해 주세요!`,
  gallery: `6`,
  book: `<code>JavaScript</code>와 <code>React</code>를 활용한 개발을 주로 하고 있으며,`,
  cat: null,
  radio: null,
};
