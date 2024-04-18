import { DialogData, dialogData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialog, setCamScale } from "./utils";

k.loadSprite("character", "/characters.png", {
  sliceX: 9,
  sliceY: 9,
  anims: {
    "idle-down": 0,
    "walk-down-1": { from: 0, to: 1, loop: false, speed: 8 },
    "walk-down-2": { from: 1, to: 2, loop: true, speed: 8 },
    "idle-up": 9,
    "walk-up-1": { from: 9, to: 10, loop: false, speed: 8 },
    "walk-up-2": { from: 10, to: 11, loop: true, speed: 8 },
    "idle-right": 18,
    "walk-right-1": { from: 18, to: 19, loop: false, speed: 8 },
    "walk-right-2": { from: 19, to: 20, loop: true, speed: 8 },
    "idle-left": 27,
    "walk-left-1": { from: 27, to: 28, loop: false, speed: 8 },
    "walk-left-2": { from: 28, to: 29, loop: true, speed: 8 },
  },
});

k.loadSprite("map", "/map.png");

k.setBackground(k.Color.fromHex("#cadc9f"));

k.scene("main", async () => {
  const mapData = await fetch("/map.json").then((res) => res.json());
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

  console.log(map);

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
            displayDialog(dialogText, () => (player.isInDialogue = false));
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
      player.curAnim() !== "walk-up-1"
    ) {
      player.play("walk-up-1");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down-1"
    ) {
      player.play("walk-down-1");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      if (player.curAnim() !== "walk-right-1") player.play("walk-right-1");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      if (player.curAnim() !== "walk-left-1") player.play("walk-left-1");
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
