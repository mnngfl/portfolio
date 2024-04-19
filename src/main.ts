import { DialogData, dialogData, scaleFactor } from "./constants";
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
            } else {
              player.isInDialogue = false;
            }
          });
        }
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        console.log(layer, entity);

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
    k.camPos(player.pos.x, player.pos.y + 10);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

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

  k.onMouseRelease(() => {
    if (player.direction === "down") {
      player.play("idle-down");
    } else if (player.direction === "up") {
      player.play("idle-up");
    } else if (player.direction === "left") {
      player.play("idle-left");
    } else if (player.direction === "right") {
      player.play("idle-right");
    }
  });
});

k.go("main");
