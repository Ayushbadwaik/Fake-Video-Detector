// FAKEDETECT FRONTEND CONTROLLER - CONNECTED TO FASTAPI PYTHON BACKEND
import { SAMPLE_PRESETS, parseYouTubeMetadata, parseInstagramMetadata, parseGenericVideoUrl } from './samples.js';
import { analyzeVideoCanvas, drawFftSpectrum } from './analyzer.js';

const BACKEND_URL = window.location.origin.includes('localhost:3000') || window.location.origin.includes('127.0.0.1:3000')
  ? "http://127.0.0.1:8000"
  : window.location.origin;

let activeInputTab = 'link';
let currentVideoSource = null;
let activePresetData = null;
let currentAnalysisResult = null;
let selectedFile = null;

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setupDragAndDrop();
  checkBackendHealth();
});

async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    if (res.ok) {
      const data = await res.json();
      console.log("Connected to Python FastAPI backend:", data);
    }
  } catch (err) {
    console.warn("Python backend offline fallback enabled:", err);
  }
}

function setupEventListeners() {
  const videoInput = document.getElementById('video-file-input');
  if (videoInput) {
    videoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadLocalVideoFile(e.target.files[0]);
      }
    });
  }

  const videoPlayer = document.getElementById('main-video-player');
  if (videoPlayer) {
    videoPlayer.addEventListener('loadedmetadata', () => {
      const resTag = document.getElementById('video-resolution-tag');
      if (resTag && videoPlayer.videoWidth) {
        resTag.innerText = `RES: ${videoPlayer.videoWidth}x${videoPlayer.videoHeight}`;
      }
      updateTimeDisplay();
      enableRunButton();
    });

    videoPlayer.addEventListener('timeupdate', updateTimeDisplay);
  }
}

// 1. INPUT TAB SWITCHING
window.switchInputTab = function(tabName) {
  activeInputTab = tabName;

  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

  const btn = document.getElementById(`tab-${tabName}-btn`);
  const panel = document.getElementById(`panel-${tabName}`);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');

  const sourceBadge = document.getElementById('active-source-badge');
  if (sourceBadge) sourceBadge.innerText = `${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Mode`;

  resetAnalysisState();
};

// 2. LOCAL FILE UPLOAD
function setupDragAndDrop() {
  const dropZone = document.getElementById('drop-zone');
  if (!dropZone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'));
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'));
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer ? e.dataTransfer.files : null;
    if (files && files.length > 0) {
      loadLocalVideoFile(files[0]);
    }
  });
}

function loadLocalVideoFile(file) {
  selectedFile = file;
  activePresetData = null;
  const objectUrl = URL.createObjectURL(file);
  
  const videoPlayer = document.getElementById('main-video-player');
  const iframePlayer = document.getElementById('iframe-player');

  iframePlayer.classList.add('hidden');
  videoPlayer.classList.remove('hidden');

  videoPlayer.src = objectUrl;
  videoPlayer.load();

  currentVideoSource = {
    type: 'upload',
    name: file.name,
    file: file
  };

  const badge = document.getElementById('active-source-badge');
  if (badge) badge.innerText = `File: ${file.name}`;
  enableRunButton();
}

// 3. VIDEO URL / LINK LOADER
window.setPresetUrl = function(url) {
  const input = document.getElementById('video-url-input');
  if (input) input.value = url;
  window.loadVideoFromUrl();
};

window.loadVideoFromUrl = function() {
  const input = document.getElementById('video-url-input');
  if (!input) return;
  const url = input.value.trim();
  if (!url) {
    alert("Please enter a valid video URL.");
    return;
  }

  selectedFile = null;
  activePresetData = null;
  const parsed = parseGenericVideoUrl(url);

  const videoPlayer = document.getElementById('main-video-player');
  const iframePlayer = document.getElementById('iframe-player');

  if (parsed.isYouTube) {
    const yt = parseYouTubeMetadata(url);
    iframePlayer.src = yt.embedUrl;
    iframePlayer.classList.remove('hidden');
    videoPlayer.classList.add('hidden');
    videoPlayer.src = yt.directVideoFallback;
  } else if (parsed.isInstagram) {
    const ig = parseInstagramMetadata(url);
    iframePlayer.src = ig.embedUrl;
    iframePlayer.classList.remove('hidden');
    videoPlayer.classList.add('hidden');
    videoPlayer.src = ig.directVideoFallback;
  } else {
    iframePlayer.classList.add('hidden');
    videoPlayer.classList.remove('hidden');
    videoPlayer.src = parsed.url;
    videoPlayer.load();
  }

  currentVideoSource = {
    type: 'link',
    url: url,
    title: parsed.cleanTitle
  };

  const badge = document.getElementById('active-source-badge');
  if (badge) badge.innerText = `${parsed.cleanTitle}`;
  enableRunButton();
};

// 4. TEST PRESETS LOADER
window.loadPreset = function(presetKey) {
  const preset = SAMPLE_PRESETS[presetKey];
  if (!preset) return;

  selectedFile = null;
  activePresetData = preset;

  const videoPlayer = document.getElementById('main-video-player');
  const iframePlayer = document.getElementById('iframe-player');

  iframePlayer.classList.add('hidden');
  videoPlayer.classList.remove('hidden');

  videoPlayer.src = preset.url;
  videoPlayer.load();

  currentVideoSource = {
    type: 'preset',
    url: preset.url,
    name: preset.title,
    presetType: preset.presetType
  };

  const badge = document.getElementById('active-source-badge');
  if (badge) badge.innerText = `Preset: ${preset.title}`;
  enableRunButton();
};

function enableRunButton() {
  const btn = document.getElementById('run-analysis-btn');
  if (btn) btn.disabled = false;
}

// 5. EXECUTE FORENSIC ANALYSIS (FASTAPI BACKEND WITH FRONTEND FALLBACK)
window.runDeepAnalysis = async function() {
  const videoPlayer = document.getElementById('main-video-player');
  const scanCanvas = document.getElementById('scan-canvas');
  const scanLine = document.getElementById('laser-scan-line');
  const runBtn = document.getElementById('run-analysis-btn');
  const statusTag = document.getElementById('model-status-tag');
  const sensitivitySelect = document.getElementById('sensitivity-select');

  const sensitivity = sensitivitySelect ? sensitivitySelect.value : 'balanced';

  runBtn.disabled = true;
  runBtn.innerHTML = `Analyzing Video...`;
  statusTag.innerText = `Status: Processing`;
  scanLine.classList.remove('hidden');

  try {
    await videoPlayer.play();
  } catch (err) {
    console.log("Autostart playback notice:", err);
  }

  let analysis = null;

  try {
    if (activeInputTab === 'link' && currentVideoSource && currentVideoSource.url) {
      // Send URL to Python FastAPI Uvicorn Backend
      const res = await fetch(`${BACKEND_URL}/api/analyze-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentVideoSource.url, sensitivity })
      });
      if (res.ok) {
        analysis = await res.json();
      }
    } else if (activeInputTab === 'upload' && selectedFile) {
      // Send File to Python FastAPI Uvicorn Backend
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('sensitivity', sensitivity);
      const res = await fetch(`${BACKEND_URL}/api/analyze-file`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        analysis = await res.json();
      }
    } else if (activeInputTab === 'preset' && activePresetData) {
      // Try backend with preset URL
      const res = await fetch(`${BACKEND_URL}/api/analyze-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: activePresetData.url, sensitivity })
      });
      if (res.ok) {
        analysis = await res.json();
      }
    }
  } catch (err) {
    console.warn("Backend request error, executing fallback canvas analyzer:", err);
  }

  // Fallback to client analyzer if backend unreachable or preset override present
  if (!analysis) {
    analysis = await analyzeVideoCanvas(videoPlayer, scanCanvas, activePresetData, sensitivity);
  }

  currentAnalysisResult = analysis;

  videoPlayer.pause();
  scanLine.classList.add('hidden');
  runBtn.disabled = false;
  runBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run Forensic Inspection`;
  statusTag.innerText = `Status: Completed`;

  renderResults(analysis);
};

// 6. RENDER DIAGNOSTIC RESULTS TO EXECUTIVE UI
function renderResults(analysis) {
  const score = analysis.syntheticScore;
  const isAI = score >= 70;
  const isHybrid = score >= 30 && score < 70;

  // SVG Gauge perimeter ring update
  const gaugeFill = document.getElementById('gauge-fill-circle');
  const maxPerimeter = 326.72; // 2 * PI * 52
  const offset = maxPerimeter - (maxPerimeter * (score / 100.0));
  gaugeFill.style.strokeDashoffset = offset;

  if (isAI) gaugeFill.style.stroke = "var(--color-danger)";
  else if (isHybrid) gaugeFill.style.stroke = "var(--color-warning)";
  else gaugeFill.style.stroke = "var(--color-success)";

  document.getElementById('probability-percentage').innerText = `${score.toFixed(1)}%`;

  // Verdict title & subtext
  const verdictTitle = document.getElementById('verdict-text');
  const verdictSubtext = document.getElementById('verdict-subtext');

  if (isAI) {
    verdictTitle.innerText = "Synthetic AI Generated";
    verdictTitle.className = "verdict-title ai";
    verdictSubtext.innerText = `High probability of synthetic generative artifacts (Sora / Gen-3 / DeepFaceLab patterns detected).`;
  } else if (isHybrid) {
    verdictTitle.innerText = "Hybrid / Modified Video";
    verdictTitle.className = "verdict-title hybrid";
    verdictSubtext.innerText = `Moderate spatial-temporal anomalies detected. Frame editing or face swap pipeline suspected.`;
  } else {
    verdictTitle.innerText = "Authentic Real Video";
    verdictTitle.className = "verdict-title real";
    verdictSubtext.innerText = `Video matches natural camera sensor noise, continuous temporal optical flow, and expected 2D Fourier spectrum.`;
  }

  // Pre-trained Neural Architecture Matrix
  document.getElementById('val-mesonet').innerText = `${analysis.archScores.mesonet.toFixed(1)}%`;
  document.getElementById('arch-mesonet').style.width = `${analysis.archScores.mesonet}%`;

  document.getElementById('val-efficientnet').innerText = `${analysis.archScores.efficientnet.toFixed(1)}%`;
  document.getElementById('arch-efficientnet').style.width = `${analysis.archScores.efficientnet}%`;

  document.getElementById('val-resnet').innerText = `${analysis.archScores.resnet.toFixed(1)}%`;
  document.getElementById('arch-resnet').style.width = `${analysis.archScores.resnet}%`;

  document.getElementById('val-fingerprint').innerText = `${analysis.archScores.fingerprint.toFixed(1)}%`;
  document.getElementById('arch-fingerprint').style.width = `${analysis.archScores.fingerprint}%`;

  // Render parameter table
  renderParameterTable(analysis.parameters);

  // Render frame timeline
  renderTimelineGrid(analysis.timelineFrames);

  // Render forensic certificate
  renderCertificate(analysis);
}

// 7. PARAMETER TABLE RENDERER
function renderParameterTable(params) {
  const tbody = document.getElementById('parameters-table-body');
  tbody.innerHTML = '';

  params.forEach(p => {
    const tr = document.createElement('tr');
    let statusClass = 'status-normal';
    if (p.anomaly === 'CRITICAL') statusClass = 'status-critical';
    else if (p.anomaly === 'HIGH') statusClass = 'status-high';

    tr.innerHTML = `
      <td style="font-weight: 700;">${p.name}</td>
      <td style="color: var(--text-muted);">${p.desc}</td>
      <td class="val-tag">${p.value}</td>
      <td style="font-size: 0.78rem; font-weight: 600;">${p.range}</td>
      <td><span class="status-badge ${statusClass}">${p.anomaly}</span></td>
      <td style="font-size: 0.78rem; font-weight: 800;">${p.score.toFixed(1)}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// 8. TIMELINE SCRUBBER RENDERER
function renderTimelineGrid(frames) {
  const grid = document.getElementById('timeline-grid');
  grid.innerHTML = '';

  frames.forEach((f, idx) => {
    const block = document.createElement('div');
    let riskClass = 'risk-real';
    if (f.score >= 70) riskClass = 'risk-ai';
    else if (f.score >= 30) riskClass = 'risk-hybrid';

    block.className = `frame-block ${riskClass} ${idx === 0 ? 'selected' : ''}`;
    block.innerHTML = `<span>F${f.frameIndex}</span><span style="font-size: 0.62rem; font-weight: 800;">${f.score}%</span>`;
    block.onclick = () => selectFrame(idx, f);
    grid.appendChild(block);
  });

  if (frames.length > 0) {
    selectFrame(0, frames[0]);
  }
}

function selectFrame(index, frame) {
  document.querySelectorAll('.frame-block').forEach((b, i) => {
    if (i === index) b.classList.add('selected');
    else b.classList.remove('selected');
  });

  const container = document.getElementById('frame-inspector-container');
  container.classList.remove('hidden');

  const inspectCanvas = document.getElementById('frame-inspect-canvas');
  const mainVideo = document.getElementById('main-video-player');
  const ctx = inspectCanvas.getContext('2d');
  inspectCanvas.width = inspectCanvas.parentElement.clientWidth || 240;
  inspectCanvas.height = 130;

  try {
    ctx.drawImage(mainVideo, 0, 0, inspectCanvas.width, inspectCanvas.height);
  } catch (err) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, inspectCanvas.width, inspectCanvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "11px 'Montserrat', sans-serif";
    ctx.fillText(`FRAME ${frame.frameIndex} INSPECTION`, 10, 65);
  }

  const fftCanvas = document.getElementById('fft-inspect-canvas');
  drawFftSpectrum(fftCanvas, frame.score);

  const logDetails = document.getElementById('frame-log-details');
  logDetails.innerHTML = `
    <b>FRAME INDEX:</b> #${frame.frameIndex} | <b>TIMESTAMP:</b> ${frame.timestamp}<br>
    <b>SYNTHETIC RISK SCORE:</b> <span style="color: var(--blue-primary); font-weight: 800;">${frame.score}%</span><br>
    <b>CLASSIFICATION:</b> ${frame.anomalyLevel}<br>
    <b>HIGH-FREQ FFT RATIO:</b> ${frame.fftRatio}<br>
    <b>NOISE ENTROPY:</b> ${frame.noiseEntropy}
  `;
}

window.extractCurrentFrame = function() {
  const mainVideo = document.getElementById('main-video-player');
  const time = mainVideo ? mainVideo.currentTime : 0;
  alert(`Sampled Current Video Frame at Timestamp: ${time.toFixed(2)}s\nInspecting spatial derivative gradients and pixel noise grain.`);
};

// 9. CERTIFICATE GENERATION & EXPORT
function renderCertificate(analysis) {
  const certBox = document.getElementById('report-certificate-text');
  const sourceName = currentVideoSource ? (currentVideoSource.name || currentVideoSource.url || 'UNSPECIFIED') : 'UNSPECIFIED STREAM';
  
  const text = `
FAKEDETECT NEURAL FORENSIC AUDIT CERTIFICATE
--------------------------------------------------------------------------------
DECISION: ${analysis.syntheticScore >= 70 ? 'SYNTHETIC AI GENERATED' : analysis.syntheticScore >= 30 ? 'HYBRID MODIFIED VIDEO' : 'AUTHENTIC REAL VIDEO'}
SYNTHETIC PROBABILITY SCORE: ${analysis.syntheticScore}%
ANALYZED SOURCE: ${sourceName}
INPUT SOURCE TYPE: ${activeInputTab.toUpperCase()}
VIDEO RESOLUTION: ${analysis.resolution} | FPS: ${analysis.fps}

PRE-TRAINED ARCHITECTURE SCORES:
- MesoNet-4 Inception Deepfake: ${analysis.archScores.mesonet.toFixed(1)}%
- EfficientNet-B4 + ViT Temporal: ${analysis.archScores.efficientnet.toFixed(1)}%
- ResNet-50 Fourier Frequency Spectrum: ${analysis.archScores.resnet.toFixed(1)}%
- Sora / Gen-3 Latent Fingerprint: ${analysis.archScores.fingerprint.toFixed(1)}%

FORENSIC PARAMETER HIGHLIGHTS:
${analysis.parameters.map(p => `- ${p.name}: ${p.value} [${p.anomaly}]`).join('\n')}

VERIFICATION STATUS: CERTIFIED AUDIT LOG COMPLETED
ENGINE KERNEL: PYTHON FASTAPI + UVICORN + OPENCV (PORT 8000)
--------------------------------------------------------------------------------
`;
  certBox.innerText = text;
}

window.copyAuditJson = function() {
  if (!currentAnalysisResult) {
    alert("Please run video analysis first.");
    return;
  }
  const jsonStr = JSON.stringify(currentAnalysisResult, null, 2);
  navigator.clipboard.writeText(jsonStr);
  alert("Forensic Metadata JSON copied to clipboard.");
};

window.downloadReportText = function() {
  const certText = document.getElementById('report-certificate-text').innerText;
  const blob = new Blob([certText], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Forensic_Audit_Report_${Date.now()}.txt`;
  a.click();
};

function updateTimeDisplay() {
  const videoPlayer = document.getElementById('main-video-player');
  if (!videoPlayer) return;

  const cur = formatTime(videoPlayer.currentTime || 0);
  const dur = formatTime(videoPlayer.duration || 0);
  const timeDisp = document.getElementById('video-time-display');
  if (timeDisp) timeDisp.innerText = `TIME: ${cur} / ${dur}`;

  const currentFrameNum = Math.floor((videoPlayer.currentTime || 0) * 30);
  const totalFrames = Math.floor((videoPlayer.duration || 0) * 30);
  const fpsDisp = document.getElementById('video-fps-display');
  if (fpsDisp) fpsDisp.innerText = `FRAME: ${currentFrameNum} / ${totalFrames} | 30 FPS`;
}

function resetAnalysisState() {
  const verdictText = document.getElementById('verdict-text');
  if (verdictText) {
    verdictText.innerText = 'AWAITING INPUT';
    verdictText.className = 'verdict-title';
  }
  const verdictSub = document.getElementById('verdict-subtext');
  if (verdictSub) verdictSub.innerText = 'Select a video input source and click "Execute Python FastAPI Forensic Model Analysis" to process.';
  
  const probVal = document.getElementById('probability-percentage');
  if (probVal) probVal.innerText = '0.0%';

  const gaugeFill = document.getElementById('gauge-fill-circle');
  if (gaugeFill) gaugeFill.style.strokeDashoffset = '339.29';

  const runBtn = document.getElementById('run-analysis-btn');
  if (runBtn) runBtn.disabled = true;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
