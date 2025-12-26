import { useEffect, useRef } from "react";
import { Canvas, FabricText } from "fabric";
import * as fabric from "fabric";

type canvasRef = React.RefObject<Canvas | null>;

const handleShortcuts = (e: globalThis.KeyboardEvent, canvasRef: canvasRef) => {
  console.log(e);
  if (e.ctrlKey && e.key.toLowerCase() == "a") {
    console.log("Select all should be fired");
    selectAll(canvasRef);
  }
  switch (e.key) {
    case "Delete":
      deleteSelected(canvasRef);
      break;

    case "c":
    case "C":
      addCircle(canvasRef);
      break;

    case "r":
    case "R":
      addRectangle(canvasRef);
      break;

    default:
      break;
  }
};

const selectAll = (canvasRef: canvasRef) => {
  let canvas = canvasRef.current;
  if (!canvas) return;
  let sel = new fabric.ActiveSelection(canvas.getObjects(), {
    canvas: canvas,
  });
  canvas.setActiveObject(sel);
  canvas.requestRenderAll();
};

const addRectangle = (canvasRef: canvasRef) => {
  console.log("Rectangle added to canvas");
  const rect = new fabric.Rect({
    left: Math.random() * 800,
    top: Math.random() * 600,
    fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
    width: 100,
    height: 100,
    selectable: true,
  });
  canvasRef.current?.add(rect);
};

const addCircle = (canvasRef: canvasRef) => {
  console.log("Circle added to canvas");
  const circle = new fabric.Circle({
    left: Math.random() * 800,
    top: Math.random() * 600,
    fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
    radius: 50,
    selectable: true,
  });
  canvasRef.current?.add(circle);
};

const deleteSelected = (canvasRef: canvasRef) => {
  const active = canvasRef.current?.getActiveObject();
  if (active) {
    if (active.type === "activeselection") {
      const activeSelection = active as fabric.ActiveSelection;
      activeSelection.getObjects().forEach((obj) => {
        canvasRef.current?.remove(obj);
      });
      canvasRef.current?.discardActiveObject();
    } else {
      canvasRef.current?.remove(active);
    }
    canvasRef.current?.requestRenderAll();
  }
};

const App = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasEl.current) return;
    const canvas = new Canvas(canvasEl.current);
    canvasRef.current = canvas;

    const colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet",
    ];

    const arcs = colors.map((color, index) => {
      const radius = 200 - index * 20;
      return new fabric.Circle({
        radius: radius,
        startAngle: 180,
        endAngle: 360,
        stroke: color,
        strokeWidth: 20,
        fill: "transparent",
        originX: "center",
        originY: "center",
        selectable: false,
      });
    });

    const rainbowGroup = new fabric.Group(arcs, {
      selectable: false,
    });

    canvas.add(rainbowGroup);
    canvas.centerObject(rainbowGroup);

    const message = new FabricText("we are all going to make it 🧡", {
      fill: "#ffffff",
      fontSize: 18,
      fontFamily: "monospace",
      opacity: 0.7,
      selectable: false,
    });
    canvas.add(message);
    message.set({
      left: canvas.getWidth() - 250,
      top: canvas.getHeight() - 50,
    });

    const helloWorld = new FabricText("yupee", { fill: "white" });
    canvas.add(helloWorld);
    canvas.centerObject(helloWorld);

    helloWorld.animate(
      { angle: 360 },
      {
        duration: 2000,
        onChange: () => canvas.requestRenderAll(),
        easing: fabric.util.ease.easeInOutCubic,
      }
    );

    const hearts: FabricText[] = [];
    const maxHearts = 12;

    const addFloatingHeart = () => {
      if (hearts.length >= maxHearts) {
        const oldHeart = hearts.shift();
        if (oldHeart) canvas.remove(oldHeart);
      }

      const heart = new FabricText("🧡", {
        left: Math.random() * canvas.getWidth() + 200,
        top: canvas.getHeight(),
        fontSize: 20,
        selectable: false,
      });

      hearts.push(heart);
      canvas.add(heart);

      heart.animate(
        { top: -50 },
        {
          duration: 6000,
          easing: fabric.util.ease.easeOutQuad,
          onChange: () => canvas.requestRenderAll(),
        }
      );
    };

    const heartInterval = setInterval(addFloatingHeart, 300);
    const onKeyDown = (e: KeyboardEvent) => handleShortcuts(e, canvasRef);
    window.addEventListener("keydown", onKeyDown);
    console.log("Event listener added");

    return () => {
      clearInterval(heartInterval);
      window.removeEventListener("keydown", onKeyDown);
      canvas.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <canvas
        width={1920}
        height={1080}
        ref={canvasEl}
        className="w-full h-full"
      />
      <img
        className="hidden"
        src="https://images.unsplash.com/photo-1494869042583-f6c911f04b4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXllfGVufDB8fDB8fHww"
      />
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  w-min px-24 flex gap-2 p-4 bg-white/10 backdrop-blur rounded-lg"
      >
        <button
          onClick={() => addRectangle(canvasRef)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
        >
          Add Rectangle
        </button>
        <button
          onClick={() => addCircle(canvasRef)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
        >
          Add Circle
        </button>
        <button
          onClick={() => deleteSelected(canvasRef)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default App;
