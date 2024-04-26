export const scaleFactor = 2;

export interface DialogData {
  sign: string;
  chair: string;
  computer: string;
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
  sign: `안녕하세요! 저의 <2D World Portfolio>에 방문해주셔서 감사합니다.<br>느낌표가 표시되어 있는 곳에 가까이 다가가면 다양한 내용을 확인해 보실 수 있습니다.`,
  chair: `질문이나 의견, 혹은 전달하고 싶은 이야기가 있으시다면 무엇이든지 환영합니다!<br>언제든지 아래의 연락처로 연락 주시기 바랍니다 :D<br>[Email] <a href="mailto:hyomk24@gamil.com">hyomk24@gamil.com</a>`,
  computer: `질문이나 의견, 혹은 전달하고자 하는 이야기가 있으시다면 무엇이든지 환영합니다!<br>언제든지 아래의 연락처로 연락 주시기 바랍니다 :D<br>[Email] <a href="mailto:hyomk24@gamil.com">hyomk24@gamil.com</a>`,
  door: `이곳을 떠나고 싶으시다면 탭을 닫아 종료할 수 있습니다!`,
  table: `이 공간을 만든 저는 웹 개발자 강효민이라고 합니다 :D<br><br>다른 분야들 보다도 프론트엔드 개발에 애정을 갖고 가장 집중하고 있어요. 유저와 가장 맞닿아 있는 곳에 위치하여 더 나은 사용 경험을 제공하기 위해 끊임없이 노력하고자 하며, 그러한 과정에서 큰 보람을 느끼기도 합니다.<br><br>만약 저에 대한 설명이 조금 더 필요하시다면, 저의 <a href="http://rallit.com/resumes/1272974@gya1" target="_blank">이력서</a>를 확인해 보실 수 있습니다.`,
  gallery: `이 포트폴리오는 <code>JavaScript</code>로 게임을 만들기 위한 라이브러리인 <code>Kaboom.js</code>를 통해 만들어졌습니다. 평소 관심이 많았던 게임이라는 분야를 저에게 있어 친숙한 언어를 통해 만들어 볼 수 있어 뜻깊은 경험이었던 것 같아요!`,
  book: `주로 <code>JavaScript</code> 언어와 <code>React</code>를 기반으로 웹 개발을 하고 있는데, 제 작업물은 저의 <a href="https://github.com/mnngfl" target="_blank">GitHub</a>에서 확인하실 수 있습니다.<br>또한 개인적으로 공부한 내용을 정리해 <a href="https://velog.io/@seesaw/posts" target="_blank">Blog</a>에 포스팅하고 있기도 합니다.<br><br>유저가 매 순간 편안한 사용 경험을 느끼도록 만드는 것이나, 누군가는 사소하다고 지나쳐 버릴 수도 있는 작은 문제를 해결하는 것에 흥미와 열정을 가지고 있어요.`,
  cat: null,
  radio: null,
};
