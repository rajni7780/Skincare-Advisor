const video = document.getElementById("video");
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");
const scanBtn = document.getElementById("scanBtn");
const resultSection = document.getElementById("resultSection");
const skinTypeEl = document.getElementById("skinType");
const routineDiv = document.getElementById("routine");

// ---- MediaPipe FaceMesh setup ----
const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

// Camera
const camera = new Camera(video, {
  onFrame: async () => {
    await faceMesh.send({ image: video });
  },
  width: 320,
  height: 240
});
camera.start();

let lastDetection = null;

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    lastDetection = results.multiFaceLandmarks[0];
    drawConnectors(ctx, lastDetection, FACEMESH_FACE_OVAL, { color: "#ff69b4", lineWidth: 1 });
  }
}

// ---- Routines with HTML page links ----
const ROUTINES = {
  "Oily": {
    "Cleanser": "oilyc.html",
    "Moisturizer": "oilym.html",
    "Serum": "serum-oily.html",
    "Toner": "toner-oily.html",
    "Sunscreen": "sunscreen-oily.html"
  },
  "Dry": {
    "Cleanser": "dryc.html",
    "Moisturizer": "drym.html",
    "Serum": "serum-dry.html",
    "Toner": "toner-dry.html",
    "Sunscreen": "sunscreen-dry.html"
  },
  "Sensitive": {
    "Cleanser": "sensetive.html",
    "Moisturizer": "sensetivem.html",
    "Serum": "serum-sensitive.html",
    "Toner": "toner-sensitive.html",
    "Sunscreen": "sunscreen-sensitive.html"
  },
  "Combination": {
    "Cleanser": "combine.html",
    "Moisturizer": "combinem.html",
    "Serum": "combin.html",
    "Toner": "toner-combination.html",
    "Sunscreen": "sunscreen-combination.html"
  },
  "Normal": {
    "Cleanser": "normalc.html",
    "Moisturizer": "normalm.html",
    "Serum": "serum-normal.html",
    "Toner": "toner-normal.html",
    "Sunscreen": "sunscreen-normal.html"
  }
};

// ---- Scan button ----
scanBtn.addEventListener("click", () => {
  if (!lastDetection) {
    alert("Face not detected! Please look straight at the camera");
    return;
  }

  // DEMO: random skin type detection
  const types = Object.keys(ROUTINES);
  const detected = types[Math.floor(Math.random() * types.length)];

  resultSection.style.display = "block";
  skinTypeEl.textContent = `Skin Type: ${detected}`;
  routineDiv.innerHTML = "";

  const products = ROUTINES[detected];
  for (let step in products) {
    const stepDiv = document.createElement("div");
    stepDiv.className = "routine-item";

    // clickable link instead of buttons
    stepDiv.innerHTML = `
      <b>${step}:</b> 
      <a href="${products[step]}" target="_blank" style="color:#c01372; margin-left:10px;">
        View ${step} Routine
      </a>
    `;

    routineDiv.appendChild(stepDiv);
  }
});
