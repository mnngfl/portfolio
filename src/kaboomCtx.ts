import kaboom from "kaboom";

export const k = kaboom({
  global: false,
  touchToMouse: true,
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  debug: false,
});
