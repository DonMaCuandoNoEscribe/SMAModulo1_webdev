/* Volleyball 5-1 Rotations Animation (Top-down Half-court)
   - Coordinates normalized to 0..100 (x,y)
   - States: base -> serve_receive -> base
   - Controls: Prev, Play/Pause, Next, Jump (1..6)
*/

(function () {
  const courtEl = document.getElementById('rotation-court');
  if (!courtEl) return; // only on index.html

  const playersEl = courtEl.querySelector('#players');
  const btnPrev = courtEl.querySelector('#prev');
  const btnNext = courtEl.querySelector('#next');
  const btnPlay = courtEl.querySelector('#play');
  const selJump = courtEl.querySelector('#jump');

  // Roles and labels
  const ROLE_ORDER = ['S', 'OH1', 'OH2', 'MB1', 'MB2', 'OP'];
  const ROLE_TO_MAIN = (id) => (id.startsWith('OH') ? 'OH' : id.startsWith('MB') ? 'MB' : id);

  // Stagger delays (60–80ms increments)
  const STAGGERS_MS = [0, 70, 140, 210, 280, 350];
  const TRANSITION_MS = 800; // 600–900ms acceptable; choose 800ms

  const DATA = {
    meta: { units: 'percent-of-half-court', attack_line_y: 33 },
    rotations: {
      1: {
        base: {
          S: { x: 80, y: 70 },
          OH1: { x: 18, y: 15 },
          OH2: { x: 18, y: 85 },
          MB1: { x: 50, y: 22 },
          MB2: { x: 50, y: 78 },
          OP: { x: 82, y: 22 }
        },
        serve_receive: {
          S: { x: 85, y: 60 },
          OH1: { x: 20, y: 28 },
          OH2: { x: 20, y: 72 },
          MB1: { x: 48, y: 33 },
          MB2: { x: 48, y: 67 },
          OP: { x: 75, y: 33 }
        }
      },
      2: {
        base: {
          S: { x: 65, y: 70 },
          OH1: { x: 15, y: 20 },
          OH2: { x: 30, y: 85 },
          MB1: { x: 45, y: 22 },
          MB2: { x: 58, y: 78 },
          OP: { x: 85, y: 22 }
        },
        serve_receive: {
          S: { x: 75, y: 60 },
          OH1: { x: 22, y: 30 },
          OH2: { x: 28, y: 74 },
          MB1: { x: 46, y: 33 },
          MB2: { x: 54, y: 67 },
          OP: { x: 72, y: 33 }
        }
      },
      3: {
        base: {
          S: { x: 52, y: 70 },
          OH1: { x: 12, y: 22 },
          OH2: { x: 35, y: 85 },
          MB1: { x: 42, y: 22 },
          MB2: { x: 60, y: 78 },
          OP: { x: 85, y: 22 }
        },
        serve_receive: {
          S: { x: 68, y: 60 },
          OH1: { x: 22, y: 30 },
          OH2: { x: 32, y: 74 },
          MB1: { x: 45, y: 33 },
          MB2: { x: 57, y: 67 },
          OP: { x: 72, y: 33 }
        }
      },
      4: {
        base: {
          S: { x: 35, y: 70 },
          OH1: { x: 10, y: 25 },
          OH2: { x: 42, y: 85 },
          MB1: { x: 40, y: 22 },
          MB2: { x: 62, y: 78 },
          OP: { x: 85, y: 22 }
        },
        serve_receive: {
          S: { x: 60, y: 60 },
          OH1: { x: 20, y: 30 },
          OH2: { x: 35, y: 74 },
          MB1: { x: 45, y: 33 },
          MB2: { x: 58, y: 67 },
          OP: { x: 70, y: 33 }
        }
      },
      5: {
        base: {
          S: { x: 22, y: 70 },
          OH1: { x: 12, y: 28 },
          OH2: { x: 48, y: 85 },
          MB1: { x: 38, y: 22 },
          MB2: { x: 65, y: 78 },
          OP: { x: 85, y: 22 }
        },
        serve_receive: {
          S: { x: 50, y: 60 },
          OH1: { x: 20, y: 30 },
          OH2: { x: 40, y: 74 },
          MB1: { x: 44, y: 33 },
          MB2: { x: 60, y: 67 },
          OP: { x: 70, y: 33 }
        }
      },
      6: {
        base: {
          S: { x: 10, y: 70 },
          OH1: { x: 15, y: 30 },
          OH2: { x: 52, y: 85 },
          MB1: { x: 36, y: 22 },
          MB2: { x: 66, y: 78 },
          OP: { x: 85, y: 22 }
        },
        serve_receive: {
          S: { x: 45, y: 60 },
          OH1: { x: 22, y: 30 },
          OH2: { x: 42, y: 74 },
          MB1: { x: 43, y: 33 },
          MB2: { x: 62, y: 67 },
          OP: { x: 70, y: 33 }
        }
      }
    }
  };

  let rotationIndex = 1;
  let state = 'base';
  let playing = false;
  let playTimer = null;

  // Create player nodes once
  const playerNodes = {};
  ROLE_ORDER.forEach((id, i) => {
    const el = document.createElement('div');
    el.className = 'player';
    el.dataset.role = ROLE_TO_MAIN(id); // S, OH, MB, OP
    el.dataset.id = id; // exact label (OH1, MB1...)
    el.innerHTML = `<span class="badge">${id}</span>`;
    el.style.transitionDelay = `${STAGGERS_MS[i]}ms`;
    playersEl.appendChild(el);
    playerNodes[id] = el;
  });

  function setAriaLabels() {
    ROLE_ORDER.forEach((id) => {
      const el = playerNodes[id];
      el.setAttribute('aria-label', `${id}, Rotación ${rotationIndex}, ${state}`);
    });
    courtEl.setAttribute('data-rotation', String(rotationIndex));
    courtEl.setAttribute('data-state', state);
    courtEl.setAttribute('aria-label', `Cancha, Rotación ${rotationIndex}, ${state}`);
  }

  function applyPositions() {
    const positions = DATA.rotations[rotationIndex][state];
    ROLE_ORDER.forEach((id) => {
      const pos = positions[id];
      const el = playerNodes[id];
      if (!pos || !el) return;
      el.style.setProperty('--x', clamp01(pos.x));
      el.style.setProperty('--y', clamp01(pos.y));
    });
    setAriaLabels();
  }

  function clamp01(v) {
    // keep within [0..100]
    return Math.max(0, Math.min(100, v));
  }

  function updateUI() {
    selJump.value = String(rotationIndex);
    btnPlay.classList.toggle('playing', playing);
    btnPlay.textContent = playing ? 'Pause ❚❚' : 'Play ▶';
  }

  function goToRotation(idx, newState = 'base') {
    rotationIndex = ((idx - 1 + 6) % 6) + 1; // wrap 1..6
    state = newState;
    applyPositions();
    updateUI();
  }

  function nextRotation() {
    goToRotation(rotationIndex + 1, 'base');
  }

  function prevRotation() {
    goToRotation(rotationIndex - 1, 'base');
  }

  // Auto play: base -> serve_receive -> base -> next rotation (loop)
  function scheduleNextTick(delay) {
    clearTimeout(playTimer);
    playTimer = setTimeout(tick, delay);
  }

  function tick() {
    if (!playing) return;
    if (state === 'base') {
      state = 'serve_receive';
      applyPositions();
      scheduleNextTick(TRANSITION_MS + 250);
    } else {
      // back to base then advance rotation
      state = 'base';
      applyPositions();
      // after returning to base, advance rotation
      scheduleNextTick(TRANSITION_MS + 300);
      // chain next advance slightly after motion starts to feel natural
      setTimeout(() => {
        if (!playing) return;
        nextRotation();
      }, 120);
    }
  }

  function togglePlay() {
    playing = !playing;
    updateUI();
    if (playing) {
      // start from current state cycle
      scheduleNextTick(200);
    } else {
      clearTimeout(playTimer);
    }
  }

  // Event listeners
  btnPrev.addEventListener('click', () => {
    prevRotation();
  });
  btnNext.addEventListener('click', () => {
    nextRotation();
  });
  btnPlay.addEventListener('click', () => {
    togglePlay();
  });
  selJump.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    goToRotation(val, 'base');
  });

  // Initialize
  applyPositions();
  updateUI();
})();

