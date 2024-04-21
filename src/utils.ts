import { KaboomCtx } from "kaboom";

let SHOW_MANUAL = false;
let SHOW_CREDIT = false;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const creditUI = document.getElementById("credit") as HTMLDivElement;
const creditBtn = document.getElementById("credit-btn") as HTMLButtonElement;
const manualUI = document.getElementById("manual") as HTMLDivElement;
const manualBtn = document.getElementById("manual-btn") as HTMLButtonElement;

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
    canvas.focus();
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

  if (resizeFactor < 1 && k.width() <= 768) {
    k.camScale(k.vec2(1));
    return;
  }

  k.camScale(k.vec2(1.5));
};

export const displayManual = () => {
  const toggleUI = () => {
    if (SHOW_MANUAL) {
      SHOW_MANUAL = false;
      manualUI.style.display = "none";
      manualBtn.classList.remove("active");
    } else {
      SHOW_MANUAL = true;
      manualUI.style.display = "block";
      manualBtn.classList.add("active");
      if (SHOW_CREDIT) {
        SHOW_CREDIT = false;
        creditUI.style.display = "none";
        creditBtn.classList.remove("active");
      }
    }
    canvas.focus();
  };

  manualBtn.addEventListener("click", toggleUI);
};

export const displayCredit = () => {
  const toggleUI = () => {
    if (SHOW_CREDIT) {
      SHOW_CREDIT = false;
      creditUI.style.display = "none";
      creditBtn.classList.remove("active");
    } else {
      SHOW_CREDIT = true;
      creditUI.style.display = "block";
      creditBtn.classList.add("active");
      if (SHOW_MANUAL) {
        SHOW_MANUAL = false;
        manualUI.style.display = "none";
        manualBtn.classList.remove("active");
      }
    }

    canvas.focus();
  };

  creditBtn.addEventListener("click", toggleUI);
};
