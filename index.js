// --- Element references for each of the app's three screens ---

// Screen 1: brain dump input
const dumpView = document.getElementById('dump-view');
// Screen 2: one step at a time
const stepView = document.getElementById('step-view');
// Screen 3: calm celebration after the last step
const celebrateView = document.getElementById('celebrate-view');

// Screen 1 controls
const dumpInput = document.getElementById('dump-input'); // textarea, one line = one step
const startBtn = document.getElementById('start-btn');   // "Start with this one thing"

// Screen 2 controls
const progressDots = document.getElementById('progress-dots'); // container for the little step dots
const stepLabel = document.getElementById('step-label');       // "Step X of Y" text
const stepCard = document.getElementById('step-card');         // the card that fades out/in between steps
const stepText = document.getElementById('step-text');         // current step's text
const doneBtn = document.getElementById('done-btn');           // marks the step done
const skipBtn = document.getElementById('skip-btn');           // skips it without guilt
const skipNote = document.getElementById('skip-note');         // soft reassurance shown after a skip

// Screen 3 controls
const celebrateMsg = document.getElementById('celebrate-msg'); // random calm message
const againBtn = document.getElementById('again-btn');         // back to a fresh brain dump

// Pool of calm completion messages — one is picked at random, no confetti/streak pressure
const CELEBRATIONS = [
    'Nicely done 🌿',
    'That was it 🌊',
    'Small step, still counts ✨',
    'Nothing left to do 🤍',
];

// Pool of soft reassurances shown after a skip — no pressure, no guilt
const SKIP_NOTES = [
    'Fine. This one can wait a bit. 🐌',
    'No rush. It\'ll be right there when you\'re ready.',
    'Okay, moving on for now. 🍃',
    'That\'s allowed. Back to it later.',
];

// The current task's steps, and which one the user is on.
// Each step is an object — { text, skips } — so its skip count travels with it.
let steps = [];
let currentIndex = 0;

// Stash the current task in localStorage, so a reload doesn't lose it.
function saveState() {
    localStorage.setItem('fibo-state', JSON.stringify({ steps, currentIndex }));
}

// Swap which of the three screens is visible
function showView(view) {
    [dumpView, stepView, celebrateView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

// A very short, optional vibration — the "soft haptic" feedback for finishing a step.
// Silently does nothing on devices/browsers that don't support it.
function tick() {
    try {
        navigator.vibrate?.(12);
    } catch (_) {
        // haptics are optional, fine if unsupported
    }
}

// Turn the raw textarea text into a list of steps: one non-empty line = one step.
// If the user just typed a single line, that becomes the one and only step.
// filter(Boolean) has to run on the trimmed strings, before they become objects —
// an object like { text: '', skips: 0 } is always truthy, so filtering afterwards
// wouldn't drop empty lines.
function parseSteps(raw) {
    return raw
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(text => ({ text, skips: 0 }));
}

// Rebuild the row of progress dots to match `steps` and `currentIndex`.
// Done steps get a coral dot, the current one is a bigger teal dot, the rest stay muted.
function renderProgress() {
    progressDots.innerHTML = '';
    steps.forEach((_, i) => {
        const dot = document.createElement('li'); // progressDots is a <ul>, so each dot is a list item
        dot.className = 'dot';
        if (i < currentIndex) dot.classList.add('done');
        if (i === currentIndex) dot.classList.add('current');
        progressDots.appendChild(dot);
    });
}

// Paint the current step onto screen 2: dots, "Step X of Y" label, and the step text.
function renderStep() {
    renderProgress();
    stepLabel.textContent = `Step ${currentIndex + 1} of ${steps.length}`;
    stepText.textContent = steps[currentIndex].text;
}

// "Start with this one thing" — parse the brain dump into steps and move to screen 2.
// If nothing was typed, gently nudge the textarea instead of showing a harsh error.
function startFlow() {
    steps = parseSteps(dumpInput.value);
    if (steps.length === 0) {
        dumpInput.classList.remove('nudge');
        void dumpInput.offsetWidth; // restart the CSS animation even if it just played
        dumpInput.classList.add('nudge');
        dumpInput.focus();
        return;
    }
    currentIndex = 0;
    saveState();
    renderStep();
    showView(stepView);
}

// "Done ✓" — the step is finished, so we move on to the next one.
// The step card fades/scales out first, then we either show the next step or,
// if that was the last one, switch to the celebration screen.
function advance() {
    tick();
    stepCard.classList.add('leaving');
    setTimeout(() => {
        currentIndex += 1;
        stepCard.classList.remove('leaving'); // fades back in with the new content
        skipNote.classList.remove('visible');
        if (currentIndex >= steps.length) {
            localStorage.removeItem('fibo-state'); // the whole task is done, nothing left to resume
            celebrateMsg.textContent = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
            showView(celebrateView);
        } else {
            saveState();
            renderStep();
        }
    }, 320); // roughly matches the .leaving CSS transition duration
}

// "Skip →" — don't mark the step done, just send it to the back of the queue
// so it's still there later. The array length stays the same (nothing is
// finished), so currentIndex doesn't need to move: whatever was next slides
// into this same spot once the current step is spliced out.
function skipStep() {
    tick();
    stepCard.classList.add('leaving');
    setTimeout(() => {
        steps[currentIndex].skips += 1; // count this skip on the step itself, before it moves
        const [skippedStep] = steps.splice(currentIndex, 1); // pull the current step out
        steps.push(skippedStep); // ...and put it back at the end
        saveState();
        stepCard.classList.remove('leaving'); // fades back in with the new content
        renderStep();

        // Check in after a few skips in a row for THIS step — maybe it's the problem
        if (skippedStep.skips >= 3) {
            skipNote.textContent = 'This one doesn\'t want to happen yet — maybe it\'s too big? Making it smaller is always allowed.';
        } else {
            skipNote.textContent = SKIP_NOTES[Math.floor(Math.random() * SKIP_NOTES.length)];
        }
        skipNote.classList.add('visible');
    }, 320); // roughly matches the .leaving CSS transition duration
}

// "One more thing" — clear the input and go back to a fresh brain dump.
function resetToDump() {
    localStorage.removeItem('fibo-state'); // starting over, so there's nothing to resume anymore
    dumpInput.value = '';
    showView(dumpView);
    dumpInput.focus();
}

// On startup: if there's a task saved from last time, jump straight back into it
// instead of showing an empty brain dump.
function loadState() {
    const raw = localStorage.getItem('fibo-state');
    if (raw === null) return;

    try {
        const saved = JSON.parse(raw);
        steps = saved.steps;
        currentIndex = saved.currentIndex;
        renderStep();
        showView(stepView);
    } catch (_) {
        // storage got corrupted somehow — just forget it and start fresh
        localStorage.removeItem('fibo-state');
    }
}

// Wire up all the buttons
startBtn.addEventListener('click', startFlow);
doneBtn.addEventListener('click', advance);
skipBtn.addEventListener('click', skipStep);
againBtn.addEventListener('click', resetToDump);

// Cmd/Ctrl+Enter in the textarea is a shortcut for clicking "Start"
dumpInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        startFlow();
    }
});

loadState();