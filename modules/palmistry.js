/**
 * Palmistry Module - Jyotisha
 * Draggable coordinates, Hand Element readings, Mount information
 * Custom Sobel Convolution Edge Detection and Point-Snapping algorithm
 */

// Default points for tracing lines on a standard 400x500 canvas
export const DEFAULT_PALM_POINTS = {
  heart: [
    { id: 'heart_0', x: 320, y: 180, label: 'Pinky Mount Start' },
    { id: 'heart_1', x: 220, y: 170, label: 'Heart Curve Mid' },
    { id: 'heart_2', x: 120, y: 140, label: 'Index Mount End' }
  ],
  head: [
    { id: 'head_0', x: 100, y: 220, label: 'Thumb/Index Origin' },
    { id: 'head_1', x: 200, y: 230, label: 'Intellect Mid' },
    { id: 'head_2', x: 300, y: 250, label: 'Mental End' }
  ],
  life: [
    { id: 'life_0', x: 100, y: 220, label: 'Life Origin' },
    { id: 'life_1', x: 160, y: 310, label: 'Vitality Mid' },
    { id: 'life_2', x: 190, y: 420, label: 'Base Wrap End' }
  ],
  fate: [
    { id: 'fate_0', x: 210, y: 440, label: 'Wrist Origin' },
    { id: 'fate_1', x: 205, y: 210, label: 'Destiny End' }
  ]
};

// Hand Shapes database
export const HAND_SHAPES = {
  Earth: {
    title: "Earth Hand (Grounded & Practical)",
    physical: "Square palm with short, thick fingers. Skin is often firm or coarse.",
    traits: "Practical, reliable, honest, and steady. You value stability over change, love nature and hands-on activities, and are emotionally grounded. You deal with facts rather than speculation."
  },
  Air: {
    title: "Air Hand (Intellectual & Communicative)",
    physical: "Square palm with long fingers. Often has prominent knuckles and dry skin.",
    traits: "Intellectual, curious, analytical, and highly communicative. You are driven by ideas, facts, and social connection. You can be prone to overthinking, restlessness, and emotional detachment."
  },
  Fire: {
    title: "Fire Hand (Passionate & Dynamic)",
    physical: "Long, rectangular palm with short fingers. Skin is warm, and palm lines are often deep.",
    traits: "Passionate, charismatic, adventurous, and impulsive. You possess high energy, lead others with enthusiasm, and crave excitement. You follow your instincts and hate being restricted."
  },
  Water: {
    title: "Water Hand (Intuitive & Creative)",
    physical: "Long, rectangular palm with long, slender fingers. Soft skin with many fine lines.",
    traits: "Highly intuitive, sensitive, artistic, and emotional. You are a dreamer with rich creative depths and deep empathy. You are deeply affected by your environment and seek peace and connection."
  }
};

// Mounts database
export const PALM_MOUNTS = {
  Venus: { name: "Mount of Venus (Base of Thumb)", key: "vitality, passion, physical love, sensuality" },
  Jupiter: { name: "Mount of Jupiter (Below Index)", key: "ambition, leadership, pride, confidence" },
  Saturn: { name: "Mount of Saturn (Below Middle)", key: "wisdom, discipline, sobriety, solitude" },
  Apollo: { name: "Mount of Apollo/Sun (Below Ring)", key: "creativity, talent, popularity, success" },
  Mercury: { name: "Mount of Mercury (Below Pinky)", key: "communication, commerce, intelligence, agility" },
  Luna: { name: "Mount of Luna/Moon (Base of Palm, Pinky side)", key: "intuition, imagination, dreams, travel" }
};

// Distance helper
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Curvature helper
function calculateCurvature(p0, p1, p2) {
  const d01 = distance(p0, p1);
  const d12 = distance(p1, p2);
  const d02 = distance(p0, p2);
  
  if (d02 === 0) return 0;
  const ratio = (d01 + d12) / d02;
  return ratio - 1;
}

// Draw outline hand illustration
export function drawDefaultHandOutline(ctx, width, height) {
  ctx.strokeStyle = 'rgba(18, 23, 42, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = '#f6f7f9';
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  ctx.moveTo(170, 470);
  ctx.bezierCurveTo(150, 480, 250, 480, 230, 470);
  ctx.bezierCurveTo(270, 430, 350, 350, 330, 220);
  ctx.bezierCurveTo(345, 170, 315, 120, 305, 150);
  ctx.lineTo(295, 200);
  ctx.bezierCurveTo(290, 130, 260, 80, 255, 115);
  ctx.lineTo(250, 190);
  ctx.bezierCurveTo(245, 100, 210, 60, 205, 95);
  ctx.lineTo(200, 190);
  ctx.bezierCurveTo(190, 110, 155, 100, 150, 130);
  ctx.lineTo(145, 210);
  ctx.bezierCurveTo(130, 240, 75, 270, 50, 310);
  ctx.bezierCurveTo(30, 330, 40, 370, 70, 370);
  ctx.bezierCurveTo(100, 370, 130, 350, 145, 390);
  ctx.bezierCurveTo(155, 410, 160, 440, 170, 470);
  
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();

  const gradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width/2);
  gradient.addColorStop(0, 'rgba(249, 115, 22, 0.06)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(150, 100, 45, 0.75)';
  ctx.font = '9px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText('Jupiter', 145, 190);
  ctx.fillText('Saturn', 195, 180);
  ctx.fillText('Apollo', 245, 180);
  ctx.fillText('Mercury', 295, 195);
  ctx.fillText('Venus', 110, 320);
  ctx.fillText('Luna', 285, 370);
}

// Analyze the hand lines based on active coordinates
export function analyzePalmLines(points) {
  const readings = {};

  const heartLen = distance(points.heart[0], points.heart[2]);
  const heartCurve = calculateCurvature(points.heart[0], points.heart[1], points.heart[2]);
  
  if (heartLen > 240) {
    readings.heart = {
      type: "Long and Sweeping",
      meaning: "Your heart line is exceptionally long, indicating a deeply emotional and expressive nature. You love with intensity, possess high empathy, and prioritize relationships. However, you can be vulnerable to emotional drama and vulnerability."
    };
  } else if (heartCurve > 0.05) {
    readings.heart = {
      type: "Curved and Warm",
      meaning: "A nicely curved heart line indicates that you are emotionally open, warm, and highly expressive of your feelings. You communicate your affections easily and possess strong romantic ideals."
    };
  } else {
    readings.heart = {
      type: "Straight and Controlled",
      meaning: "Your heart line is relatively straight. You are highly rational and private with your emotions, keeping feelings in check. You analyze situations logically before opening your heart, valuing stability and practical love."
    };
  }

  const headLen = distance(points.head[0], points.head[2]);
  const headCurve = calculateCurvature(points.head[0], points.head[1], points.head[2]);
  
  if (headLen > 230) {
    readings.head = {
      type: "Long and Deep",
      meaning: "A long head line suggests a wide range of intellectual interests, high concentration, and deep thinking. You look at issues from multiple angles and possess excellent memory, but can prone to overthinking."
    };
  } else if (headCurve > 0.035) {
    readings.head = {
      type: "Curved / Sloping (Creative)",
      meaning: "Your head line slopes downwards towards the Mount of Luna. This indicates highly developed creative thinking, strong imagination, and artistic capabilities. You solve problems using intuition and inspiration."
    };
  } else {
    readings.head = {
      type: "Straight (Logical)",
      meaning: "A straight head line indicates a highly logical, realistic, and practical thinker. You focus on details, value facts and direct evidence, and make decisions without emotional bias."
    };
  }

  const lifeCurve = calculateCurvature(points.life[0], points.life[1], points.life[2]);
  const lifeLen = distance(points.life[0], points.life[2]);

  if (lifeCurve > 0.12) {
    readings.life = {
      type: "Deep and Wide Curve",
      meaning: "Your life line forms a wide circle around the base of the thumb. This shows immense physical vitality, robustness, love of life, and adaptability. You are a high-energy person who bounces back from illness or fatigue rapidly."
    };
  } else if (lifeLen < 180) {
    readings.life = {
      type: "Short / Faint",
      meaning: "A shorter life line does not mean a short life, but rather a tendency to feel physically drained easily, or a life heavily influenced by others. You should focus on healthy pacing and setting boundaries to preserve your vital energy."
    };
  } else {
    readings.life = {
      type: "Smooth and Balanced",
      meaning: "Your life line is smooth and well-defined. You possess a stable, balanced reservoir of physical energy. You manage stress well and live life with a solid sense of self and grounded strength."
    };
  }

  const fateLen = distance(points.fate[0], points.fate[1]);
  
  if (fateLen > 200) {
    readings.fate = {
      type: "Strong and Continuous",
      meaning: "A prominent fate line indicates a strong sense of destiny and career path from a young age. You are highly driven, ambitious, and feel guided by clear external goals and achievements."
    };
  } else if (fateLen < 100) {
    readings.fate = {
      type: "Faint or Absent",
      meaning: "A faint or absent fate line suggests a flexible lifestyle where you prefer to write your own rules rather than follow a pre-determined career or traditional track. You are highly adaptable and self-directed."
    };
  } else {
    readings.fate = {
      type: "Intermediate / Variable",
      meaning: "A standard fate line shows that your career and path will experience shifts, revisions, and personal choices rather than being locked down. You balance personal choices with life's external tides."
    };
  }

  return readings;
}

// ==========================================================================
// COMPUTER VISION: SOBEL EDGE DETECTION FILTER
// ==========================================================================

export function runSobelCreaseDetection(imgElement, width, height) {
  // Create offscreen canvas to process pixels
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d');

  // Draw scaled image
  const scale = Math.max(width / imgElement.width, height / imgElement.height);
  const x = (width - imgElement.width * scale) / 2;
  const y = (height - imgElement.height * scale) / 2;
  ctx.drawImage(imgElement, x, y, imgElement.width * scale, imgElement.height * scale);

  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;
  
  // 1. Grayscale & Gaussian Blur (3x3 smoothing kernel)
  // Create temporary array for grayscale values
  const gray = new Float32Array(width * height);
  for (let i = 0; i < src.length; i += 4) {
    // Standard luminance formula
    gray[i / 4] = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
  }

  // Apply basic 3x3 Gaussian Blur to reduce skin hair noise
  const blurred = new Float32Array(width * height);
  const blurKernel = [
    1/16, 2/16, 1/16,
    2/16, 4/16, 2/16,
    1/16, 2/16, 1/16
  ];

  for (let cy = 1; cy < height - 1; cy++) {
    for (let cx = 1; cx < width - 1; cx++) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelVal = gray[(cy + ky) * width + (cx + kx)];
          const weight = blurKernel[(ky + 1) * 3 + (kx + 1)];
          sum += pixelVal * weight;
        }
      }
      blurred[cy * width + cx] = sum;
    }
  }

  // 2. Sobel Edge Convolutions
  // Kernels:
  // Gx = [-1  0  1]   Gy = [-1 -2 -1]
  //      [-2  0  2]        [ 0  0  0]
  //      [-1  0  1]        [ 1  2  1]
  
  const edges = new Uint8Array(width * height); // binary edge map
  const magnitudes = new Float32Array(width * height);
  let maxMag = 0;

  for (let cy = 1; cy < height - 1; cy++) {
    for (let cx = 1; cx < width - 1; cx++) {
      let valX = 0;
      let valY = 0;

      // Convolve
      valX += -1 * blurred[(cy - 1) * width + (cx - 1)] + 1 * blurred[(cy - 1) * width + (cx + 1)];
      valX += -2 * blurred[(cy) * width + (cx - 1)]     + 2 * blurred[(cy) * width + (cx + 1)];
      valX += -1 * blurred[(cy + 1) * width + (cx - 1)] + 1 * blurred[(cy + 1) * width + (cx + 1)];

      valY += -1 * blurred[(cy - 1) * width + (cx - 1)] - 2 * blurred[(cy - 1) * width + (cx)] - 1 * blurred[(cy - 1) * width + (cx + 1)];
      valY +=  1 * blurred[(cy + 1) * width + (cx - 1)] + 2 * blurred[(cy + 1) * width + (cx)] + 1 * blurred[(cy + 1) * width + (cx + 1)];

      const mag = Math.sqrt(valX * valX + valY * valY);
      magnitudes[cy * width + cx] = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }

  // Threshold to isolate prominent lines and generate binary edge map
  const threshold = maxMag * 0.20; // 20% of max magnitude
  for (let i = 0; i < magnitudes.length; i++) {
    if (magnitudes[i] > threshold) {
      edges[i] = 1; // Crease detected!
    } else {
      edges[i] = 0;
    }
  }

  return {
    edges, // Uint8Array binary grid
    width,
    height
  };
}

// Point Snapping Algorithm: Searches a local 24px box for the closest detected edge pixel
export function snapPointToNearestEdge(px, py, edgeMap) {
  if (!edgeMap) return { x: px, y: py };
  
  const { edges, width, height } = edgeMap;
  const radius = 24; // search window bounds
  
  let closestX = px;
  let closestY = py;
  let minDist = Infinity;

  const startX = Math.max(0, Math.floor(px - radius));
  const endX = Math.min(width - 1, Math.ceil(px + radius));
  const startY = Math.max(0, Math.floor(py - radius));
  const endY = Math.min(height - 1, Math.ceil(py + radius));

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (edges[y * width + x] === 1) {
        // Distance check
        const dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
        if (dist < minDist) {
          minDist = dist;
          closestX = x;
          closestY = y;
        }
      }
    }
  }

  return { x: closestX, y: closestY };
}
