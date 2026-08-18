// PRESETS AND METADATA SAMPLE DATA FOR DEMO & BENCHMARKING

export const SAMPLE_PRESETS = {
  real_interview: {
    id: "real_interview",
    title: "Authentic News Interview & Speech Clip",
    sourceType: "Camera Recording / Unedited",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    presetType: "REAL",
    syntheticScore: 8.4,
    resolution: "1920x1080",
    fps: 30,
    duration: 15,
    mesonetScore: 6.2,
    efficientnetScore: 8.9,
    resnetScore: 7.1,
    fingerprintScore: 2.1,
    parameters: [
      { name: "Spectral FFT Attenuation", desc: "High-frequency Fourier energy ratio in 2D spectrum", value: "-3.8 dB (STABLE)", range: "-6.0 to -2.0 dB", anomaly: "NORMAL", score: 4.2 },
      { name: "Spatial Edge Gradient Variance", desc: "Pixel derivative variance across facial boundary", value: "384.5 σ² (SHARP)", range: "300 - 450 σ²", anomaly: "NORMAL", score: 3.8 },
      { name: "Temporal Motion Discontinuity", desc: "Frame-to-frame pixel velocity vector difference", value: "1.08 px/frame", range: "< 2.5 px/frame", anomaly: "NORMAL", score: 4.5 },
      { name: "Facial Landmark Jitter", desc: "Boundary displacement jitter across eyes & lips", value: "0.19 μm", range: "< 0.40 μm", anomaly: "NORMAL", score: 3.1 },
      { name: "Eye-Blink Micro-expression", desc: "Natural blink cadence & eyelid velocity curve", value: "15.8 blinks/min", range: "12 - 20 blinks/min", anomaly: "NORMAL", score: 2.5 },
      { name: "Lip-Sync Viseme Alignment", desc: "Phoneme audio spectrum sync displacement", value: "7 ms offset", range: "< 20 ms offset", anomaly: "NORMAL", score: 3.9 },
      { name: "Color Histogram Entropy", desc: "RGB channel entropy deviation ratio", value: "7.88 bits/ch", range: "7.5 - 8.0 bits", anomaly: "NORMAL", score: 3.2 },
      { name: "Quantization Artifact Ratio", desc: "DCT compression grid inconsistency", value: "0.05 %", range: "< 0.15 %", anomaly: "NORMAL", score: 4.0 },
      { name: "Spatial Noise Distribution", desc: "Gaussian sensor noise grain uniformity", value: "98.9 % sync", range: "> 95.0 %", anomaly: "NORMAL", score: 2.1 },
      { name: "Shadow Ray Continuity", desc: "Geometric light source vector consistency", value: "0.97 index", range: "> 0.90 index", anomaly: "NORMAL", score: 3.4 },
      { name: "Scene Depth Continuity", desc: "Monocular parallax depth mapping variance", value: "95.8 %", range: "> 92.0 %", anomaly: "NORMAL", score: 4.1 },
      { name: "Generative Pattern Fingerprint", desc: "Diffusion / Latent space spectral signature", value: "NOT DETECTED", range: "NOT DETECTED", anomaly: "NORMAL", score: 1.0 }
    ]
  },

  ai_sora_landscape: {
    id: "ai_sora_landscape",
    title: "AI Synthetic Generative Video (Sora / Gen-3)",
    sourceType: "AI Generative Pipeline",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    presetType: "SYNTHETIC",
    syntheticScore: 93.6,
    resolution: "1920x1080",
    fps: 30,
    duration: 10,
    mesonetScore: 91.2,
    efficientnetScore: 95.8,
    resnetScore: 94.1,
    fingerprintScore: 97.9,
    parameters: [
      { name: "Spectral FFT Attenuation", desc: "High-frequency Fourier energy ratio in 2D spectrum", value: "-14.2 dB (ATTENUATED)", range: "-6.0 to -2.0 dB", anomaly: "CRITICAL", score: 95.4 },
      { name: "Spatial Edge Gradient Variance", desc: "Pixel derivative variance across facial boundary", value: "118.2 σ² (OVER-SMOOTH)", range: "300 - 450 σ²", anomaly: "CRITICAL", score: 92.8 },
      { name: "Temporal Motion Discontinuity", desc: "Frame-to-frame pixel velocity vector difference", value: "8.42 px/frame (WARPING)", range: "< 2.5 px/frame", anomaly: "CRITICAL", score: 91.0 },
      { name: "Facial Landmark Jitter", desc: "Boundary displacement jitter across eyes & lips", value: "1.76 μm (MORPHING)", range: "< 0.40 μm", anomaly: "CRITICAL", score: 96.5 },
      { name: "Eye-Blink Micro-expression", desc: "Natural blink cadence & eyelid velocity curve", value: "2.4 blinks/min (SUPPRESSED)", range: "12 - 20 blinks/min", anomaly: "HIGH", score: 88.0 },
      { name: "Lip-Sync Viseme Alignment", desc: "Phoneme audio spectrum sync displacement", value: "58 ms offset (DRIFT)", range: "< 20 ms offset", anomaly: "CRITICAL", score: 90.2 },
      { name: "Color Histogram Entropy", desc: "RGB channel entropy deviation ratio", value: "6.18 bits/ch (SATURATED)", range: "7.5 - 8.0 bits", anomaly: "HIGH", score: 86.5 },
      { name: "Quantization Artifact Ratio", desc: "DCT compression grid inconsistency", value: "1.38 % (GENERATIVE NOISE)", range: "< 0.15 %", anomaly: "CRITICAL", score: 94.1 },
      { name: "Spatial Noise Distribution", desc: "Gaussian sensor noise grain uniformity", value: "64.1 % sync (NON-UNIFORM)", range: "> 95.0 %", anomaly: "CRITICAL", score: 92.0 },
      { name: "Shadow Ray Continuity", desc: "Geometric light source vector consistency", value: "0.45 index (IMPOSSIBLE LIGHT)", range: "> 0.90 index", anomaly: "CRITICAL", score: 95.2 },
      { name: "Scene Depth Continuity", desc: "Monocular parallax depth mapping variance", value: "56.4 % (PARALLAX FAULT)", range: "> 92.0 %", anomaly: "CRITICAL", score: 93.8 },
      { name: "Generative Pattern Fingerprint", desc: "Diffusion / Latent space spectral signature", value: "SORA / GEN-3 MATCHED", range: "NOT DETECTED", anomaly: "CRITICAL", score: 98.6 }
    ]
  },

  deepfake_face_swap: {
    id: "deepfake_face_swap",
    title: "DeepFaceLab Facial Swap Modification",
    sourceType: "Neural Face Swap Pipeline",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    presetType: "HYBRID",
    syntheticScore: 68.5,
    resolution: "1280x720",
    fps: 30,
    duration: 12,
    mesonetScore: 74.2,
    efficientnetScore: 66.8,
    resnetScore: 71.0,
    fingerprintScore: 62.4,
    parameters: [
      { name: "Spectral FFT Attenuation", desc: "High-frequency Fourier energy ratio in 2D spectrum", value: "-8.6 dB (ATTENUATED)", range: "-6.0 to -2.0 dB", anomaly: "HIGH", score: 72.1 },
      { name: "Spatial Edge Gradient Variance", desc: "Pixel derivative variance across facial boundary", value: "192.4 σ² (MASK BOUNDARY)", range: "300 - 450 σ²", anomaly: "HIGH", score: 76.5 },
      { name: "Temporal Motion Discontinuity", desc: "Frame-to-frame pixel velocity vector difference", value: "4.82 px/frame (JITTER)", range: "< 2.5 px/frame", anomaly: "HIGH", score: 68.0 },
      { name: "Facial Landmark Jitter", desc: "Boundary displacement jitter across eyes & lips", value: "0.98 μm (DISPLACEMENT)", range: "< 0.40 μm", anomaly: "HIGH", score: 81.4 },
      { name: "Eye-Blink Micro-expression", desc: "Natural blink cadence & eyelid velocity curve", value: "7.2 blinks/min (IRREGULAR)", range: "12 - 20 blinks/min", anomaly: "HIGH", score: 65.2 },
      { name: "Lip-Sync Viseme Alignment", desc: "Phoneme audio spectrum sync displacement", value: "34 ms offset", range: "< 20 ms offset", anomaly: "HIGH", score: 69.8 },
      { name: "Color Histogram Entropy", desc: "RGB channel entropy deviation ratio", value: "7.02 bits/ch", range: "7.5 - 8.0 bits", anomaly: "NORMAL", score: 32.0 },
      { name: "Quantization Artifact Ratio", desc: "DCT compression grid inconsistency", value: "0.64 % (DOUBLE COMPRESSION)", range: "< 0.15 %", anomaly: "HIGH", score: 74.5 },
      { name: "Spatial Noise Distribution", desc: "Gaussian sensor noise grain uniformity", value: "81.2 % sync", range: "> 95.0 %", anomaly: "HIGH", score: 63.8 },
      { name: "Shadow Ray Continuity", desc: "Geometric light source vector consistency", value: "0.76 index", range: "> 0.90 index", anomaly: "NORMAL", score: 42.0 },
      { name: "Scene Depth Continuity", desc: "Monocular parallax depth mapping variance", value: "85.4 %", range: "> 92.0 %", anomaly: "NORMAL", score: 38.2 },
      { name: "Generative Pattern Fingerprint", desc: "Diffusion / Latent space spectral signature", value: "DEEPFACELAB MASK", range: "NOT DETECTED", anomaly: "HIGH", score: 82.0 }
    ]
  },

  real_vlog: {
    id: "real_vlog",
    title: "Real Smartphone Camera Vlog Clip",
    sourceType: "Direct Mobile Sensor",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4",
    presetType: "REAL",
    syntheticScore: 11.2,
    resolution: "1920x1080",
    fps: 60,
    duration: 14,
    mesonetScore: 9.1,
    efficientnetScore: 12.4,
    resnetScore: 10.8,
    fingerprintScore: 3.5,
    parameters: [
      { name: "Spectral FFT Attenuation", desc: "High-frequency Fourier energy ratio in 2D spectrum", value: "-4.1 dB (STABLE)", range: "-6.0 to -2.0 dB", anomaly: "NORMAL", score: 5.1 },
      { name: "Spatial Edge Gradient Variance", desc: "Pixel derivative variance across facial boundary", value: "368.2 σ² (NATURAL)", range: "300 - 450 σ²", anomaly: "NORMAL", score: 4.8 },
      { name: "Temporal Motion Discontinuity", desc: "Frame-to-frame pixel velocity vector difference", value: "1.24 px/frame", range: "< 2.5 px/frame", anomaly: "NORMAL", score: 6.0 },
      { name: "Facial Landmark Jitter", desc: "Boundary displacement jitter across eyes & lips", value: "0.21 μm", range: "< 0.40 μm", anomaly: "NORMAL", score: 4.2 },
      { name: "Eye-Blink Micro-expression", desc: "Natural blink cadence & eyelid velocity curve", value: "16.2 blinks/min", range: "12 - 20 blinks/min", anomaly: "NORMAL", score: 3.8 },
      { name: "Lip-Sync Viseme Alignment", desc: "Phoneme audio spectrum sync displacement", value: "9 ms offset", range: "< 20 ms offset", anomaly: "NORMAL", score: 4.9 },
      { name: "Color Histogram Entropy", desc: "RGB channel entropy deviation ratio", value: "7.76 bits/ch", range: "7.5 - 8.0 bits", anomaly: "NORMAL", score: 4.1 },
      { name: "Quantization Artifact Ratio", desc: "DCT compression grid inconsistency", value: "0.08 %", range: "< 0.15 %", anomaly: "NORMAL", score: 5.2 },
      { name: "Spatial Noise Distribution", desc: "Gaussian sensor noise grain uniformity", value: "97.4 % sync", range: "> 95.0 %", anomaly: "NORMAL", score: 3.9 },
      { name: "Shadow Ray Continuity", desc: "Geometric light source vector consistency", value: "0.94 index", range: "> 0.90 index", anomaly: "NORMAL", score: 4.5 },
      { name: "Scene Depth Continuity", desc: "Monocular parallax depth mapping variance", value: "94.2 %", range: "> 92.0 %", anomaly: "NORMAL", score: 5.0 },
      { name: "Generative Pattern Fingerprint", desc: "Diffusion / Latent space spectral signature", value: "NOT DETECTED", range: "NOT DETECTED", anomaly: "NORMAL", score: 1.5 }
    ]
  }
};

export function parseYouTubeMetadata(url) {
  let videoId = "";
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      videoId = match[2];
    }
  } catch (e) {
    videoId = "";
  }

  if (!videoId) {
    if (url.includes("shorts/")) {
      videoId = url.split("shorts/")[1].split("?")[0].split("/")[0];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }
  }

  if (!videoId) videoId = "sFzFRSYYDyo";

  return {
    videoId,
    title: `YouTube Stream [ID: ${videoId}]`,
    channel: "YouTube Media Stream",
    resolution: "1080p HD (H.264 / AAC)",
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1`,
    directVideoFallback: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  };
}

export function parseInstagramMetadata(url) {
  let reelId = "";
  try {
    const regExp = /(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i;
    const match = url.match(regExp);
    if (match && match[1]) {
      reelId = match[1];
    }
  } catch (e) {
    reelId = "";
  }

  if (!reelId) {
    if (url.includes("/reels/")) {
      reelId = url.split("/reels/")[1].split("/")[0].split("?")[0];
    } else if (url.includes("/reel/")) {
      reelId = url.split("/reel/")[1].split("/")[0].split("?")[0];
    } else if (url.includes("/p/")) {
      reelId = url.split("/p/")[1].split("/")[0].split("?")[0];
    }
  }

  if (!reelId) reelId = "DcLJX_-zP0U";

  return {
    reelId,
    title: `Instagram Reel [ID: ${reelId}]`,
    account: "@instagram_video_stream",
    resolution: "1080x1920 (Vertical 9:16 Reel)",
    embedUrl: `https://www.instagram.com/p/${reelId}/embed`,
    directVideoFallback: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  };
}

export function parseGenericVideoUrl(url) {
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url);
  const isYouTube = /(youtube\.com|youtu\.be)/i.test(url);
  const isInstagram = /instagram\.com/i.test(url);

  let cleanTitle = "Web Video Stream";
  if (isDirectVideo) {
    cleanTitle = url.split('/').pop().split('?')[0] || "Direct MP4 Stream";
  } else if (isYouTube) {
    const yt = parseYouTubeMetadata(url);
    cleanTitle = yt.title;
  } else if (isInstagram) {
    const ig = parseInstagramMetadata(url);
    cleanTitle = ig.title;
  }

  return {
    url,
    isDirectVideo,
    isYouTube,
    isInstagram,
    cleanTitle,
    fallbackUrl: isDirectVideo ? url : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  };
}
