import { DialogData, dialogData, scaleFactor, ShowMark } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialog, setCamScale } from "./utils";

k.loadSprite("character", "/characters.png", {
  sliceX: 9,
  sliceY: 9,
  anims: {
    "idle-down": 0,
    "walk-down": { from: 0, to: 2, loop: true, speed: 8 },
    "idle-up": 9,
    "walk-up": { from: 9, to: 11, loop: true, speed: 8 },
    "idle-right": 18,
    "walk-right": { from: 18, to: 20, loop: true, speed: 8 },
    "idle-left": 27,
    "walk-left": { from: 27, to: 29, loop: true, speed: 8 },
  },
});

k.loadSprite("question-mark", "/characters.png", {
  sliceX: 9,
  sliceY: 9,
  anims: {
    idle: { from: 43, to: 44, loop: true, speed: 1.5 },
  },
});

k.loadSprite("map", "/map.png");

k.setBackground(k.Color.fromHex("#cadc9f"));

k.scene("main", async () => {
  const mapData = await fetch("/map.json").then((res) => res.json());
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

  const player = k.make([
    k.sprite("character", { anim: "idle-down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x + 10, boundary.y + 8),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            const key: keyof DialogData = boundary.name;
            const dialogText: string = dialogData[key];
            if (dialogText) {
              displayDialog(dialogText, () => (player.isInDialogue = false));
              stopAnims();
            } else {
              player.isInDialogue = false;
            }
          });

          if (Object.values(ShowMark).includes(boundary.name)) {
            const questionMark = k.make([
              k.sprite("question-mark", { anim: "idle" }),
              k.pos(boundary.x + 14, boundary.y),
              k.anchor("center"),
              `question-mark-${boundary.name}`,
            ]);
            map.add(questionMark);
          }
        }
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }
      }
    }
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y - 40);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue || k.isKeyDown()) {
      return;
    }

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      if (player.curAnim() !== "walk-right") player.play("walk-right");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      if (player.curAnim() !== "walk-left") player.play("walk-left");
      player.direction = "left";
      return;
    }
  });

  const stopAnims = () => {
    if (player.direction === "down") {
      player.play("idle-down");
    } else if (player.direction === "up") {
      player.play("idle-up");
    } else if (player.direction === "left") {
      player.play("idle-left");
    } else if (player.direction === "right") {
      player.play("idle-right");
    } else {
      player.play("idle-down");
    }
  };

  k.onMouseRelease(() => stopAnims());

  k.onKeyRelease(() => stopAnims());

  k.onKeyDown((key) => {
    const keyMap = [
      k.isKeyDown("right") || k.isKeyDown("d"),
      k.isKeyDown("left") || k.isKeyDown("a"),
      k.isKeyDown("up") || k.isKeyDown("w"),
      k.isKeyDown("down") || k.isKeyDown("s"),
    ];

    if (!["right", "d", "left", "a", "up", "w", "down", "s"].includes(key)) {
      return;
    }

    let numOfKeyPressed = 0;
    for (const key of keyMap) {
      if (key) {
        numOfKeyPressed++;
      }
    }

    if (numOfKeyPressed > 2 || player.isInDialogue || k.isMouseDown("left")) {
      return;
    }

    let moveX = 0;
    let moveY = 0;
    if (keyMap[0]) {
      if (keyMap[2]) {
        moveX -= player.speed / 2;
        moveY -= player.speed / 4;
      } else if (keyMap[3]) {
        moveX -= player.speed / 2;
        moveY += player.speed / 4;
      } else if (keyMap[1]) {
        return;
      }

      if (player.curAnim() !== "walk-right") player.play("walk-right");
      moveX += player.speed;
      player.direction = "right";
      player.move(moveX, moveY);
      return;
    }

    if (keyMap[1]) {
      if (keyMap[2]) {
        moveX += player.speed / 2;
        moveY -= player.speed / 4;
      } else if (keyMap[3]) {
        moveX += player.speed / 2;
        moveY += player.speed / 4;
      } else if (keyMap[0]) {
        return;
      }

      if (player.curAnim() !== "walk-left") player.play("walk-left");
      player.direction = "left";
      moveX -= player.speed;
      player.move(moveX, moveY);
      return;
    }

    if (keyMap[2]) {
      if (keyMap[3]) {
        return;
      }

      if (player.curAnim() !== "walk-up") player.play("walk-up");
      player.direction = "up";
      moveY -= player.speed;
      player.move(moveX, moveY);
      return;
    }

    if (keyMap[3]) {
      if (keyMap[2]) {
        return;
      }

      if (player.curAnim() !== "walk-down") player.play("walk-down");
      player.direction = "down";
      moveY += player.speed;
      player.move(moveX, moveY);
      return;
    }
  });
});

k.go("main");
