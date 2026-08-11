// --- Element references for each of the app's three screens ---

// Screen 1: brain dump input
const dumpView = document.getElementById('dump-view');
// Screen 2: one step at a time
const stepView = document.getElementById('step-view');
// Screen 3: calm celebration after the last step
const celebrateView = document.getElementById('celebrate-view');
// Screen 4: paralysis mode, the "too much?" SOS screen
const paralysisView = document.getElementById('paralysis-view');
// Screen 5: the vault, thoughts parked during paralysis mode
const vaultView = document.getElementById('vault-view');

// Header control
const sosBtn = document.getElementById('sos-btn'); // "🐢 Too much?" — reachable from every screen

// Screen 1 controls
const dumpInput = document.getElementById('dump-input'); // textarea, one line = one step
const startBtn = document.getElementById('start-btn');   // "Start with this one thing"
const vaultLinkBtn = document.getElementById('vault-link-btn');   // "🔒 N parked" — hidden while the vault is empty
const vaultCountText = document.getElementById('vault-count-text');

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

// Screen 4 controls — the 3-stage rescue flow, plus the resting state reached from stage 3
const paralysisStages = document.querySelectorAll('.paralysis-stage'); // all 4 stage panels, for show/hide
const stage1 = document.getElementById('paralysis-stage-1');
const stage2 = document.getElementById('paralysis-stage-2');
const stage3 = document.getElementById('paralysis-stage-3');
const restingStage = document.getElementById('paralysis-resting');
const resetText = document.getElementById('reset-text');               // stage 1's random physical reset
const resetDoneBtn = document.getElementById('reset-done-btn');        // stage 1 -> stage 2
const microActionText = document.getElementById('micro-action-text');  // stage 2's random micro-action
const microDoneBtn = document.getElementById('micro-done-btn');        // stage 2 -> stage 3
const feelBetterBtn = document.getElementById('feel-better-btn');      // stage 3: "I can continue"
const feelRestingBtn = document.getElementById('feel-resting-btn');    // stage 3: "I still need rest"
const paralysisExitBtns = document.querySelectorAll('.paralysis-exit-btn'); // every "I'm okay again" in the flow

// Parking stage (a branch off stage 1) + the confirmation stage after it
const parkThoughtBtn = document.getElementById('park-thought-btn'); // stage 1: "Something won't let go"
const parkingStage = document.getElementById('paralysis-parking');
const vaultInput = document.getElementById('vault-input');          // what's stuck, in the user's own words
const vaultSaveBtn = document.getElementById('vault-save-btn');     // "Put it away" — parks the thought
const parkCancelBtn = document.getElementById('park-cancel-btn');   // "Never mind" — back to stage 1, still calm
const safeStage = document.getElementById('paralysis-safe');
const safeMsg = document.getElementById('safe-msg');                  // random calming line, set on each park
const safeContinueBtn = document.getElementById('safe-continue-btn'); // "Continue" — back into the rescue flow

// Screen 5 controls
const vaultList = document.getElementById('vault-list');       // container for the parked-thought <li>s
const vaultBackBtn = document.getElementById('vault-back-btn'); // "← Back" to the dump screen

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

// Pool of calming lines shown right after a thought is parked in the vault —
// one is picked at random, so "Safe." never reads the exact same way twice
const VAULT_REASSURANCES = [
    'It\'s tucked away in your vault. You can come back to it whenever you\'re ready.',
    'Out of your head, not out of existence. It\'ll keep. 🌙',
    'You don\'t have to hold onto it right now. That\'s what the vault is for.',
    'Noted, and set down. Nothing more to do with it for now. 🤍',
    'It\'s not going anywhere — and neither are you having to think about it right now.',
];

// Paralysis mode stage 1: one tiny physical action, to get out of the head and into the body
const PHYSICAL_RESETS = [
    'Take 3 deep breaths.',
    'Put your feet flat on the floor.',
    'Take a sip of water.',
    'Unclench your jaw and drop your shoulders.',
    'Put one hand on something soft.',
    'Feel your feet on the floor.',
];

// Paralysis mode stage 2: one absurdly small task, just to break the freeze — not a real task
const MICRO_ACTIONS = [
    'Carry the empty mug from your desk to the kitchen. Nothing more.',
    'Pick up one thing from the floor and put it away.',
    'Open a window for a moment.',
    'Put one dish in the sink.',
    'Straighten one cushion.',
    'Throw away one piece of trash.',
];

// The current task's steps, and which one the user is on.
// Each step is an object — { text, skips } — so its skip count travels with it.
let steps = [];
let currentIndex = 0;

// Stash the current task in localStorage, so a reload doesn't lose it.
function saveState() {
    localStorage.setItem('fibo-state', JSON.stringify({ steps, currentIndex }));
}

// Thoughts parked during paralysis mode — a separate localStorage key from the current
// task, since a parked thought has nothing to do with whatever's in `steps`.
// Each entry is { text, when } — when is a Date.now() timestamp.
let vault = [];

function saveVault() {
    localStorage.setItem('fibo-vault', JSON.stringify(vault));
}

function loadVault() {
    const raw = localStorage.getItem('fibo-vault');
    if (raw === null) return;

    try {
        vault = JSON.parse(raw);
    } catch (_) {
        // storage got corrupted somehow — just forget it and start fresh
        localStorage.removeItem('fibo-vault');
    }
}

// Whichever of the main screens was active right before paralysis mode
// was triggered — this is the one place every screen switch passes through,
// so it's the one place that can reliably notice "what was on screen just now".
let lastView = null;

// Swap which of the five screens is visible
function showView(view) {
    if (view === paralysisView) {
        const current = [dumpView, stepView, celebrateView, vaultView].find(v => !v.classList.contains('hidden'));
        if (current) lastView = current;
    }
    [dumpView, stepView, celebrateView, paralysisView, vaultView].forEach(v => v.classList.add('hidden'));
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

// Show/hide the dump screen's "🔒 N parked" line depending on whether the vault has anything in it.
function renderVaultLink() {
    if (vault.length === 0) {
        vaultLinkBtn.classList.add('sub-hidden');
        return;
    }
    vaultCountText.textContent = String(vault.length);
    vaultLinkBtn.classList.remove('sub-hidden');
}

// Turns a parked thought's timestamp into a soft, relative description — never an exact
// clock time, since the point is a gentle sense of "how long ago", not precision.
function formatParkedWhen(when) {
    const parked = new Date(when);
    const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const daysAgo = Math.round((startOfDay(new Date()) - startOfDay(parked)) / 86400000);

    if (daysAgo === 0) {
        const hour = parked.getHours();
        if (hour < 12) return 'Parked this morning';
        if (hour < 18) return 'Parked this afternoon';
        return 'Parked this evening';
    }
    if (daysAgo === 1) return 'Parked yesterday';
    if (daysAgo < 7) return `Parked on ${parked.toLocaleDateString('en-US', { weekday: 'long' })}`;
    return `Parked on ${parked.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

// Rebuild the vault's list of parked thoughts — same loop/createElement/appendChild
// shape as renderProgress, just with a text + timestamp + "Let it go" button per entry
// instead of a dot. An empty vault gets a line of its own instead of staring at nothing.
function renderVaultList() {
    vaultList.innerHTML = '';

    if (vault.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'vault-empty';
        empty.textContent = 'All quiet in here. 🐢';
        vaultList.appendChild(empty);
        return;
    }

    vault.forEach((entry, i) => {
        const item = document.createElement('li'); // vaultList is a <ul>, so each entry is a list item
        item.className = 'vault-item';

        const text = document.createElement('p');
        text.className = 'vault-item-text';
        text.textContent = entry.text;

        const meta = document.createElement('p'); // groups the timestamp + button, same trick .step-actions uses
        meta.className = 'vault-item-meta';

        const time = document.createElement('time');
        time.dateTime = new Date(entry.when).toISOString();
        time.textContent = formatParkedWhen(entry.when);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-ghost';
        removeBtn.textContent = 'Let it go';
        removeBtn.addEventListener('click', () => {
            vault.splice(i, 1); // this entry is done being parked — drop it and re-save
            saveVault();
            renderVaultList();
            renderVaultLink();
        });

        meta.appendChild(time);
        meta.appendChild(removeBtn);

        item.appendChild(text);
        item.appendChild(meta);
        vaultList.appendChild(item);
    });
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

// Show one paralysis stage and hide the rest — a second, nested level of view-switching
// inside paralysis-view itself, alongside the top-level one showView() handles.
function showParalysisStage(stage) {
    paralysisStages.forEach(s => s.classList.add('sub-hidden'));
    stage.classList.remove('sub-hidden');
}

// "🐢 Too much?" — Fibo takes the wheel: mute the palette and open stage 1 of the rescue flow,
// instead of asking the user what they want to do.
function enterParalysis() {
    resetText.textContent = PHYSICAL_RESETS[Math.floor(Math.random() * PHYSICAL_RESETS.length)];
    showParalysisStage(stage1);
    document.body.classList.add('calm');
    showView(paralysisView);
}

// Stage 1 "Done" — move to stage 2: one tiny, low-stakes task to break the freeze.
function startMicroAction() {
    microActionText.textContent = MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)];
    showParalysisStage(stage2);
}

// Stage 2 "Done" — ask how it feels. No wrong answer either way.
function askHowItFeels() {
    showParalysisStage(stage3);
}

// Stage 3 "I still need rest" — no task, no pressure, just somewhere to stay as long as needed.
function restFromParalysis() {
    showParalysisStage(restingStage);
}

// Stage 1 "Something won't let go" — branch off into the parking stage instead of the reset.
function openParking() {
    vaultInput.value = '';
    vaultInput.classList.remove('nudge');
    showParalysisStage(parkingStage);
}

// Parking stage "Never mind" — back to stage 1, not out of paralysis mode entirely.
// Unlike the other exits, this one doesn't touch document.body.classList('calm') or
// showView(): whoever's here might still be overwhelmed, just misclicked into parking.
function cancelParking() {
    showParalysisStage(stage1);
}

// Parking stage "Put it away" — save the thought to the vault, then let the parking stage
// fly away before swapping to the "Safe." confirmation. The swap waits for the animation
// to actually finish (animationend) rather than guessing a setTimeout duration; { once: true }
// means this one-off listener cleans itself up instead of piling up on every park.
function parkThought() {
    const text = vaultInput.value.trim();
    if (text === '') {
        vaultInput.classList.remove('nudge');
        void vaultInput.offsetWidth; // restart the CSS animation even if it just played
        vaultInput.classList.add('nudge');
        vaultInput.focus();
        return;
    }

    vault.push({ text, when: Date.now() });
    saveVault();
    renderVaultLink();
    safeMsg.textContent = VAULT_REASSURANCES[Math.floor(Math.random() * VAULT_REASSURANCES.length)];

    parkingStage.classList.add('fly-away');
    parkingStage.addEventListener('animationend', () => {
        parkingStage.classList.remove('fly-away');
        showParalysisStage(safeStage);
    }, { once: true });
}

// The vault, on its own top-level screen — only reachable from the dump screen's vault line.
function openVault() {
    renderVaultList();
    showView(vaultView);
}

function closeVault() {
    showView(dumpView);
}

// Leaves paralysis mode entirely: drops the calm palette and returns to wherever the user
// actually was — one relevant task, shown the same one-thing-at-a-time way the rest of the
// app already works. Used by stage 3's "I can continue" and by every "I'm okay again" exit.
function exitParalysis() {
    document.body.classList.remove('calm');
    showView(lastView || dumpView);
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
sosBtn.addEventListener('click', enterParalysis);
resetDoneBtn.addEventListener('click', startMicroAction);
microDoneBtn.addEventListener('click', askHowItFeels);
feelBetterBtn.addEventListener('click', exitParalysis);
feelRestingBtn.addEventListener('click', restFromParalysis);
paralysisExitBtns.forEach(btn => btn.addEventListener('click', exitParalysis));
parkThoughtBtn.addEventListener('click', openParking);
vaultSaveBtn.addEventListener('click', parkThought);
parkCancelBtn.addEventListener('click', cancelParking);
safeContinueBtn.addEventListener('click', startMicroAction);
vaultLinkBtn.addEventListener('click', openVault);
vaultBackBtn.addEventListener('click', closeVault);

// Cmd/Ctrl+Enter in the textarea is a shortcut for clicking "Start"
dumpInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        startFlow();
    }
});

loadState();
loadVault();
renderVaultLink();