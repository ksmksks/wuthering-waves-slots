const attributeSymbols = [
  "fusion.webp",
  "glacio.webp",
  "aero.webp",
  "electro.webp",
  "spectro.webp",
  "havoc.webp"
];

const numberSymbols = ["1", "3", "4"];

function createReel(reelId, symbols, type) {
  const reel = document.getElementById(reelId);
  reel.innerHTML = "";

  const symbolsWrapper = document.createElement("div");
  symbolsWrapper.className = "symbols";

  // ループ感のため複製
  symbols.concat(symbols).forEach(sym => {
    const div = document.createElement("div");
    div.className = "symbol";

    if (type === "icon") {
      const img = document.createElement("img");
      img.src = `assets/icons/${sym}`;
      div.appendChild(img);
    } else if (type === "number") {
      div.classList.add("number");
      div.textContent = sym;
    }

    symbolsWrapper.appendChild(div);
  });

  reel.appendChild(symbolsWrapper);
}

function spinReel(reel, stopIndex, stopDelay) {
  return new Promise(resolve => {
    const symbolsWrapper = reel.querySelector(".symbols");
    const symbolHeight = 100;
    const totalHeight = symbolsWrapper.scrollHeight / 2;

    let pos = 0;
    let speed = 150 + Math.random() * 30;
    let animationId;

    function animate() {
      pos = (pos + speed) % totalHeight;
      symbolsWrapper.style.transform = `translateY(${-pos}px)`;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => {
      cancelAnimationFrame(animationId);

      const start = performance.now();
      const startPos = pos;

      // 必ず「下方向」で止まるように修正
      let targetPos = stopIndex * symbolHeight;
      while (targetPos < startPos) {
        targetPos += totalHeight;
      }

      const duration = 3000;

      function slowDown(time) {
        const elapsed = time - start;
        const t = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);
        const newPos = startPos + (targetPos - startPos) * easeOut;
        symbolsWrapper.style.transform = `translateY(${-newPos}px)`;

        if (t < 1) {
          requestAnimationFrame(slowDown);
        } else {
          symbolsWrapper.style.transform = `translateY(${-targetPos}px)`;
          resolve();
        }
      }

      requestAnimationFrame(slowDown);
    }, stopDelay);
  });
}

// SPINボタン
document.getElementById("spinBtn").addEventListener("click", async () => {
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
    document.getElementById("reel4"),
    document.getElementById("reel5"),
    document.getElementById("reel6")
  ];

  const stopIndices = reels.map(r => {
    const symbolsWrapper = r.querySelector(".symbols");
    const count = symbolsWrapper.children.length / 2;
    return Math.floor(Math.random() * count);
  });

  const promises = reels.map((reel, i) => {
    const delay = 3000 + i * 1000;
    return spinReel(reel, stopIndices[i], delay);
  });

  await Promise.all(promises);
});

// 初期化
window.onload = () => {
  createReel("reel1", attributeSymbols, "icon");
  createReel("reel2", numberSymbols, "number");
  createReel("reel3", attributeSymbols, "icon");
  createReel("reel4", numberSymbols, "number");
  createReel("reel5", attributeSymbols, "icon");
  createReel("reel6", numberSymbols, "number");
};
