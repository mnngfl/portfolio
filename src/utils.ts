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
  const dialogContent = document.getElementById(
    "dialog-content"
  ) as HTMLDivElement;
  const dialog = document.getElementById("dialog-text") as HTMLParagraphElement;
  dialogUI.style.display = "block";

  const tempEl = document.createElement("div");
  tempEl.innerHTML = text;
  const linkEl = tempEl.querySelectorAll("a");
  let linkTexts: string[] = [];
  for (const [, el] of linkEl.entries()) {
    linkTexts.push(el.textContent as string);
  }

  let replacedText = text;
  let linkIndices: {
    startIndex: number;
    endIndex: number;
    matchedString: string;
  }[] = [];
  const linkPattern = /<a\b[^>]*>|<\/a>/;

  let linkMatch;
  while ((linkMatch = linkPattern.exec(replacedText)) !== null) {
    linkIndices.push({
      startIndex: linkMatch.index,
      endIndex: linkMatch.index + linkMatch[0].length,
      matchedString: linkMatch[0],
    });
    replacedText = replacedText.replace(linkPattern, "");
  }

  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < replacedText.length) {
      let increaseIndex = 1;

      if (linkIndices[0]?.startIndex === index) {
        currentText +=
          linkIndices[0].matchedString +
          linkTexts[0] +
          linkIndices[1].matchedString;
        increaseIndex = linkTexts[0].length;
        linkIndices.shift();
        linkIndices.shift();
        linkTexts.shift();
      } else {
        currentText += replacedText[index];
      }

      dialog.innerHTML = currentText;
      dialogContent.scrollTop = dialogContent.scrollHeight;
      index += increaseIndex;
    }
  }, 5);

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
    canvas.focus();

    if (SHOW_MANUAL) {
      SHOW_MANUAL = false;
      manualUI.style.display = "none";
      manualBtn.classList.remove("active");
      return;
    }

    SHOW_MANUAL = true;
    manualUI.style.display = "block";
    manualBtn.classList.add("active");
    if (SHOW_CREDIT) {
      SHOW_CREDIT = false;
      creditUI.style.display = "none";
      creditBtn.classList.remove("active");
    }
  };

  manualBtn.addEventListener("click", toggleUI);
};

export const displayCredit = () => {
  const toggleUI = () => {
    canvas.focus();

    if (SHOW_CREDIT) {
      SHOW_CREDIT = false;
      creditUI.style.display = "none";
      creditBtn.classList.remove("active");
      return;
    }

    SHOW_CREDIT = true;
    creditUI.style.display = "block";
    creditBtn.classList.add("active");
    if (SHOW_MANUAL) {
      SHOW_MANUAL = false;
      manualUI.style.display = "none";
      manualBtn.classList.remove("active");
    }
  };

  creditBtn.addEventListener("click", toggleUI);
};
