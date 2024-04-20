import { KaboomCtx } from "kaboom";

export const displayDialog = (text: string, onDisplayEnd: () => void) => {
  const dialogUI = document.getElementById(
    "dialog-container"
  ) as HTMLDivElement;
  const dialog = document.getElementById("dialog-text") as HTMLParagraphElement;

  dialogUI.style.display = "block";

  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialog.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 1);

  const closeBtn = document.getElementById("close") as HTMLButtonElement;
  const onCloseBtnClick = () => {
    onDisplayEnd();
    dialogUI.style.display = "none";
    dialog.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtnClick);
  };

  closeBtn.addEventListener("click", onCloseBtnClick);

  addEventListener("keyup", (key: KeyboardEvent) => {
    if (key.code === "Escape" || key.code === "Enter" || key.code === "Space") {
      closeBtn.click();
    }
  });
};

export const setCamScale = (k: KaboomCtx) => {
  const resizeFactor = k.width() / k.height();

  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
    return;
  }

  k.camScale(k.vec2(1.5));
};
