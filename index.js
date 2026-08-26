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
// Screen 0: energy check-in, asked once per day before anything else
const energyView = document.getElementById('energy-view');
// Screen 6: home — the default landing, and where the header logo always returns to
const homeView = document.getElementById('home-view');
// Screen 7: the planner — the collect-place, reachable only via home's quiet link
const plannerView = document.getElementById('planner-view');

// Header controls
const homeBtn = document.getElementById('home-btn'); // Fibo logo/wordmark — doubles as a "back to home" link
const sosBtn = document.getElementById('sos-btn'); // "🐢 Too much?" — reachable from every screen
const energyBadgeBtn = document.getElementById('energy-badge-btn'); // always-visible battery icon, tap to recalibrate

// Screen 0 controls
const energyBtns = document.querySelectorAll('.btn-energy'); // 🪫/🔋/⚡ — level read from btn.dataset.level
const energyUnsureBtn = document.getElementById('energy-unsure-btn'); // "🤷 No idea" — plays it safe as Low

// Screen 6 controls (home)
const homeGreeting = document.getElementById('home-greeting'); // time of day + today's energy
const homeMainBtn = document.getElementById('home-main-btn');  // one button, two faces — see renderHome()
const vaultLinkBtn = document.getElementById('vault-link-btn');   // "🔒 N parked" — hidden while the vault is empty
const vaultCountText = document.getElementById('vault-count-text');
const plannerLinkBtn = document.getElementById('planner-link-btn'); // "📅 Planner" — always there, unlike the vault line

// Screen 7 controls (planner)
const plannerInput = document.getElementById('planner-input');   // the new item's text
const plannerDue = document.getElementById('planner-due');       // native date picker, entirely optional
const plannerAddBtn = document.getElementById('planner-add-btn');
const plannerTodayList = document.getElementById('planner-today-list');
const plannerSoonList = document.getElementById('planner-soon-list');
const plannerSomedayList = document.getElementById('planner-someday-list');
const plannerBackBtn = document.getElementById('planner-back-btn'); // "← Back" to home

// Screen 1 controls
const dumpInput = document.getElementById('dump-input'); // textarea, one line = one step
const dumpHint = document.getElementById('dump-hint');    // swapped for a softer line on a Low day
const startBtn = document.getElementById('start-btn');   // "Start with this one thing"
const micBtn = document.getElementById('mic-btn'); // 🎙️ — speak the brain dump instead of typing it; hidden if unsupported

// Screen 2 controls
const progressDots = document.getElementById('progress-dots'); // container for the little step dots
const stepLabel = document.getElementById('step-label');       // "Step X of Y" text
const stepCard = document.getElementById('step-card');         // the card that fades out/in between steps
const stepText = document.getElementById('step-text');         // current step's text
const doneBtn = document.getElementById('done-btn');           // marks the step done
const skipBtn = document.getElementById('skip-btn');           // skips it without guilt
const skipNote = document.getElementById('skip-note');         // soft reassurance shown after a skip
const stepMain = document.getElementById('step-main');         // step-card + its actions, swapped out for the breakdown panel
const breakdownBtn = document.getElementById('breakdown-btn'); // "Too big? Break it down" — always there, quietly
const breakdownPanel = document.getElementById('breakdown-panel');
const breakdownOriginal = document.getElementById('breakdown-original'); // shows which step is being broken down
const breakdownInput = document.getElementById('breakdown-input');       // the mini brain dump for this one step
const breakdownConfirmBtn = document.getElementById('breakdown-confirm-btn'); // "Replace it"
const breakdownCancelBtn = document.getElementById('breakdown-cancel-btn');   // "Never mind"

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

// Shown whenever a Low day automatically parks the overflow of a task — see capStepsForLowEnergy()
const LOW_ENERGY_PARK_NOTE = 'Today we\'re keeping it light — the rest is waiting safely in your vault for whenever you\'re ready. 🌙';

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

// Planner items — the collect-place, entirely separate from `steps` (the do-place).
// Each entry is { text, due } — due is a 'YYYY-MM-DD' string from the date picker, or
// null for "someday, no date". Its own localStorage key, same reasoning as the vault.
let planner = [];

function savePlanner() {
    localStorage.setItem('fibo-planner', JSON.stringify(planner));
}

function loadPlanner() {
    const raw = localStorage.getItem('fibo-planner');
    if (raw === null) return;

    try {
        planner = JSON.parse(raw);
    } catch (_) {
        // storage got corrupted somehow — just forget it and start fresh
        localStorage.removeItem('fibo-planner');
    }
}

// Today's energy level — asked once per day, before anything else.
// { level, date } — date is a toDateString() like "Tue Aug 11 2026" (no time), so a
// stale entry from a previous day is a plain string mismatch, nothing to parse.
let energy = null;

function saveEnergy(level) {
    energy = { level, date: new Date().toDateString() };
    localStorage.setItem('fibo-energy', JSON.stringify(energy));
    applyEnergyEffects();
}

function loadEnergy() {
    const raw = localStorage.getItem('fibo-energy');
    if (raw === null) return;

    try {
        energy = JSON.parse(raw);
    } catch (_) {
        // storage got corrupted somehow — just forget it and start fresh
        localStorage.removeItem('fibo-energy');
    }
}

// Whether today's check-in still needs asking: either there's never been one, or the
// last one was on a different day.
function needsEnergyCheckIn() {
    return energy === null || energy.date !== new Date().toDateString();
}

// True only on an actual Low day. "No idea" is deliberately saved as 'low' itself (see the
// energy-unsure-btn handler) — playing it safe rather than adding a third neutral state.
function isLowEnergy() {
    return energy !== null && energy.level === 'low';
}

// Swaps the dump screen's hint for a level-appropriate line.
function updateDumpHint() {
    if (isLowEnergy()) {
        dumpHint.textContent = 'Just the essentials today. One tiny thing is plenty.';
    } else if (energy?.level === 'high') {
        dumpHint.textContent = 'Plenty of room for something bigger today. Just remember to drink some water and take a break now and then. ⚡';
    } else {
        dumpHint.textContent = 'Write it down. Or break it into tiny steps right away — one per line.';
    }
}

// Keeps the header's battery badge icon in sync with today's level.
function updateEnergyBadge() {
    const icons = { low: '🪫', medium: '🔋', high: '⚡' };
    energyBadgeBtn.textContent = icons[energy?.level] ?? '🔋';
}

// Low/High get a light visual treatment (see body.low-battery / body.high-battery in the
// CSS) — Medium is the default palette, so it just means neither class is present.
function updateEnergyTheme() {
    document.body.classList.toggle('low-battery', energy?.level === 'low');
    document.body.classList.toggle('high-battery', energy?.level === 'high');
}

// Everything that depends on today's energy level, applied together: the dump-screen hint,
// the Low/High visual treatment, and the battery badge's icon.
function applyEnergyEffects() {
    updateDumpHint();
    updateEnergyTheme();
    updateEnergyBadge();
}

// Whichever of the main screens was active right before paralysis mode
// was triggered — this is the one place every screen switch passes through,
// so it's the one place that can reliably notice "what was on screen just now".
let lastView = null;

// Swap which of the eight screens is visible
function showView(view) {
    if (view === paralysisView) {
        const current = [homeView, dumpView, stepView, celebrateView, vaultView, energyView, plannerView].find(v => !v.classList.contains('hidden'));
        if (current) lastView = current;
    }
    [homeView, dumpView, stepView, celebrateView, paralysisView, vaultView, energyView, plannerView].forEach(v => v.classList.add('hidden'));
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

// --- Voice input for the brain dump ---
// Some browsers only expose this behind a webkit- prefix — check both, and if neither
// exists, hide the mic button and stop there. Optimistic build, with a fallback.
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!Recognition) {
    micBtn.classList.add('sub-hidden');
}

// The live SpeechRecognition instance while listening, null the rest of the time —
// same "hold the one active thing" trick lastView uses for paralysis mode.
let recognition = null;

// 🎙️ tap toggles listening on/off. Each spoken sentence lands as its own new line in
// the textarea — the same one-line-per-step shape parseSteps() already expects, so a
// pause in speech quietly becomes a future step.
function toggleListening() {
    if (recognition) {
        recognition.stop(); // 'end' listener below does the rest of the cleanup
        return;
    }

    recognition = new Recognition();
    recognition.continuous = true; // keep listening across pauses, until the mic is tapped again
    recognition.lang = 'nl-BE';    // Fibo's UI is English, but its steps are usually thought in Flemish

    recognition.addEventListener('result', (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript.trim();
        if (transcript === '') return;
        dumpInput.value = dumpInput.value === '' ? transcript : `${dumpInput.value}\n${transcript}`;
    });

    recognition.addEventListener('end', () => {
        micBtn.classList.remove('listening');
        recognition = null;
    });

    micBtn.classList.add('listening');
    recognition.start();
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

// Show/hide home's "🔒 N parked" line depending on whether the vault has anything in it.
function renderVaultLink() {
    if (vault.length === 0) {
        vaultLinkBtn.classList.add('sub-hidden');
        return;
    }
    vaultCountText.textContent = String(vault.length);
    vaultLinkBtn.classList.remove('sub-hidden');
}

// A short greeting for whatever part of the day it is — lowercase, a little dry, no
// forced enthusiasm. 22:00-06:00 gets its own nudge instead of a plain "evening", since
// that's the one bucket where the honest thing to say is "you should probably be asleep".
function timeOfDayGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning. let\'s ease in';
    if (hour >= 12 && hour < 18) return 'hey, it\'s the afternoon now';
    if (hour >= 18 && hour < 22) return 'evening bestie 🌙';
    return 'it\'s late bestie, sleep >>> tasks';
}

// Paint home: the greeting (time of day, plus today's energy if it changes anything),
// and the one main button — its label and destination both depend on whether a task is
// currently running. handleHomeMainBtn() re-checks `steps` itself at click time, so this
// is the only place that needs to know the button's two faces.
function renderHome() {
    const greeting = timeOfDayGreeting();
    if (isLowEnergy()) {
        homeGreeting.textContent = `${greeting}. Low battery day — we'll keep it small. 🐢`;
    } else if (energy?.level === 'high') {
        homeGreeting.textContent = `${greeting}. Feeling energized today. ⚡`;
    } else {
        homeGreeting.textContent = `${greeting}.`;
    }

    homeMainBtn.textContent = steps.length > 0
        ? `Continue: step ${currentIndex + 1} of ${steps.length}`
        : "What's spinning in your head?";

    renderVaultLink();
}

// Home's one button, two faces: resume the running task, or open a fresh brain dump.
function handleHomeMainBtn() {
    if (steps.length > 0) {
        renderStep();
        showView(stepView);
    } else {
        showView(dumpView);
        dumpInput.focus();
    }
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

// Today as a 'YYYY-MM-DD' string — the ISO date format sorts and compares correctly with
// plain string operators, which is what makes the bucket logic below so simple.
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

// Turns a 'YYYY-MM-DD' due date into a short calendar label ("Sep 1") — parsed as
// explicit year/month/day rather than handed straight to `new Date()`, since that reads
// the string as UTC midnight and can print the wrong local day near a timezone boundary.
function formatDue(due) {
    const [year, month, day] = due.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Which of the three buckets a due date belongs in. ISO date strings compare correctly
// with plain <=, so "today or earlier" needs no Date parsing at all — overdue lands in
// Today right along with it, no separate case, which is exactly the point of the
// No-Shame rule: a missed date isn't a different, worse category, just the same one.
// Only the 7-day cutoff needs actual day arithmetic (same ms-per-day division
// formatParkedWhen uses for "how long ago").
function plannerBucket(due) {
    if (due === null) return 'someday';

    const today = todayStr();
    if (due <= today) return 'today';

    const daysUntil = Math.round((new Date(due) - new Date(today)) / 86400000);
    return daysUntil <= 7 ? 'soon' : 'someday';
}

// The quiet line under a planner item: the No-Shame "still here, no rush" for something
// overdue in Today, or just the due date for Soon/Someday. Nothing for a dateless
// Someday item, or a Today item genuinely due today — the bucket already says enough.
function plannerItemNote(item, bucket) {
    if (item.due === null) return null;
    if (bucket === 'today') return item.due < todayStr() ? 'still here, no rush' : null;
    return formatDue(item.due);
}

// One bucket's <ul> — same one-<li>-per-entry shape renderVaultList uses, three times
// over via renderPlanner() below.
function fillPlannerList(listEl, items, bucket) {
    listEl.innerHTML = '';

    if (items.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'planner-empty';
        empty.textContent = 'Nothing here.';
        listEl.appendChild(empty);
        return;
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'planner-item';

        const text = document.createElement('p');
        text.className = 'planner-item-text';
        text.textContent = item.text;
        li.appendChild(text);

        const note = plannerItemNote(item, bucket);
        if (note) {
            const noteEl = document.createElement('p');
            noteEl.className = 'planner-item-note';
            noteEl.textContent = note;
            li.appendChild(noteEl);
        }

        listEl.appendChild(li);
    });
}

// Sorts `planner` into its three buckets and paints all three lists.
function renderPlanner() {
    const buckets = { today: [], soon: [], someday: [] };
    planner.forEach(item => buckets[plannerBucket(item.due)].push(item));

    fillPlannerList(plannerTodayList, buckets.today, 'today');
    fillPlannerList(plannerSoonList, buckets.soon, 'soon');
    fillPlannerList(plannerSomedayList, buckets.someday, 'someday');
}

// "Add" — due date is optional; an empty picker becomes null rather than '', so the
// bucket logic only ever has to check for one "no date" value. Same empty-input nudge
// pattern as the brain dump and the vault-parking textarea.
function addPlannerItem() {
    const text = plannerInput.value.trim();
    if (text === '') {
        plannerInput.classList.remove('nudge');
        void plannerInput.offsetWidth; // restart the CSS animation even if it just played
        plannerInput.classList.add('nudge');
        plannerInput.focus();
        return;
    }

    planner.push({ text, due: plannerDue.value || null });
    savePlanner();
    plannerInput.value = '';
    plannerDue.value = '';
    renderPlanner();
    plannerInput.focus();
}

// Home's quiet "📅 Planner" link, and the way back from it.
function openPlanner() {
    renderPlanner();
    showView(plannerView);
}

function closePlanner() {
    goToStartScreen();
}

// On a Low day, only a couple of steps stay active — the rest moves to the vault
// automatically. No warning, no red cross, just quietly parked somewhere safe for later.
// Used both when starting a fresh task and when the energy level changes mid-task (the
// energy-badge handlers below also call this). Returns whether it actually parked anything.
function capStepsForLowEnergy() {
    if (!isLowEnergy()) return false;
    const remaining = steps.length - currentIndex;
    if (remaining <= 2) return false;

    const overflow = steps.splice(currentIndex + 2); // keep the current step + 1 more
    overflow.forEach(step => vault.push({ text: step.text, when: Date.now() }));
    saveVault();
    renderVaultLink();
    saveState();
    return true;
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
    const capped = capStepsForLowEnergy();
    saveState();
    renderStep();
    showView(stepView);

    // Reuses the same skip-note element/CSS the post-skip reassurances already use.
    if (capped) {
        skipNote.textContent = LOW_ENERGY_PARK_NOTE;
        skipNote.classList.add('visible');
    } else {
        skipNote.classList.remove('visible');
    }
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
            // The whole task is done — clear it from memory too, not just storage. Otherwise
            // `steps` still holds the finished array and `currentIndex` sits one past its end,
            // so anything checking "is there a task to resume?" (like goToStartScreen) would
            // wrongly say yes, and then crash trying to read the step that isn't there.
            steps = [];
            currentIndex = 0;
            dumpInput.value = ''; // so a fresh dump screen doesn't show the just-finished task's text
            localStorage.removeItem('fibo-state'); // nothing left to resume
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
            skipNote.textContent = 'This one doesn\'t want to happen yet — try "Too big? Break it down" below.';
        } else {
            skipNote.textContent = SKIP_NOTES[Math.floor(Math.random() * SKIP_NOTES.length)];
        }
        skipNote.classList.add('visible');
    }, 320); // roughly matches the .leaving CSS transition duration
}

// "Too big? Break it down" — swap step-main for the breakdown panel, pre-filled with
// which step is being broken down. Always available, not just after repeated skips.
function openBreakdown() {
    breakdownOriginal.textContent = steps[currentIndex].text;
    breakdownInput.value = '';
    breakdownInput.classList.remove('nudge');
    stepMain.classList.add('sub-hidden');
    breakdownPanel.classList.remove('sub-hidden');
    breakdownInput.focus();
}

// "Never mind" — back to the step as it was, nothing changed.
function closeBreakdown() {
    breakdownPanel.classList.add('sub-hidden');
    stepMain.classList.remove('sub-hidden');
}

// "Replace it" — parse the smaller pieces the same way the brain dump does, then splice
// them into `steps` right where the too-big step was. currentIndex doesn't need to move:
// it already points at that slot, so it now points at the first of the new small steps.
// A Low day still means "max 2 active steps" even here — the same cap startFlow() applies
// up front runs again afterward, so a 6-piece breakdown doesn't quietly blow past it.
function confirmBreakdown() {
    const pieces = parseSteps(breakdownInput.value);
    if (pieces.length === 0) {
        breakdownInput.classList.remove('nudge');
        void breakdownInput.offsetWidth; // restart the CSS animation even if it just played
        breakdownInput.classList.add('nudge');
        breakdownInput.focus();
        return;
    }

    steps.splice(currentIndex, 1, ...pieces);
    const capped = capStepsForLowEnergy();
    saveState();
    closeBreakdown();
    renderStep();

    if (capped) {
        skipNote.textContent = LOW_ENERGY_PARK_NOTE;
        skipNote.classList.add('visible');
    } else {
        skipNote.classList.remove('visible');
    }
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

// The vault, on its own top-level screen — only reachable from home's vault line.
function openVault() {
    renderVaultList();
    showView(vaultView);
}

function closeVault() {
    goToStartScreen();
}

// Leaves paralysis mode entirely: drops the calm palette and returns to wherever the user
// actually was — one relevant task, shown the same one-thing-at-a-time way the rest of the
// app already works. Used by stage 3's "I can continue" and by every "I'm okay again" exit.
function exitParalysis() {
    document.body.classList.remove('calm');
    showView(lastView || homeView);
}

// "One more thing" — clear the input and go back to a fresh brain dump.
function resetToDump() {
    localStorage.removeItem('fibo-state'); // starting over, so there's nothing to resume anymore
    dumpInput.value = '';
    showView(dumpView);
    dumpInput.focus();
}

// On startup: load a task saved from last time into memory, if there is one. Doesn't
// decide navigation itself — the energy check-in (screen 0) may need to go first, so
// what to actually show is decided once, after all startup data is loaded.
function loadState() {
    const raw = localStorage.getItem('fibo-state');
    if (raw === null) return;

    try {
        const saved = JSON.parse(raw);
        steps = saved.steps;
        currentIndex = saved.currentIndex;
    } catch (_) {
        // storage got corrupted somehow — just forget it and start fresh
        localStorage.removeItem('fibo-state');
    }
}

// Saves the chosen level, re-caps the current task if that just made today Low (works both
// at the initial check-in and when recalibrating mid-day via the battery badge), and lands
// on whichever screen actually applies.
function chooseEnergy(level) {
    saveEnergy(level);
    const parked = capStepsForLowEnergy();
    goToStartScreen();
    if (parked) {
        skipNote.textContent = LOW_ENERGY_PARK_NOTE;
        skipNote.classList.add('visible');
    }
}

// Where to land once the energy check-in is settled (today's, or none needed): home,
// with its greeting and main button freshly painted for however things stand right now.
function goToStartScreen() {
    renderHome();
    showView(homeView);
}

// The Fibo logo, tapped as a "home" link from anywhere — same destination as
// goToStartScreen(), just also dropping the calm palette in case it's tapped straight
// out of paralysis mode.
function goHome() {
    document.body.classList.remove('calm');
    goToStartScreen();
}

// Wire up all the buttons
homeBtn.addEventListener('click', goHome);
homeMainBtn.addEventListener('click', handleHomeMainBtn);
startBtn.addEventListener('click', startFlow);
if (Recognition) micBtn.addEventListener('click', toggleListening);
doneBtn.addEventListener('click', advance);
skipBtn.addEventListener('click', skipStep);
breakdownBtn.addEventListener('click', openBreakdown);
breakdownConfirmBtn.addEventListener('click', confirmBreakdown);
breakdownCancelBtn.addEventListener('click', closeBreakdown);
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
plannerLinkBtn.addEventListener('click', openPlanner);
plannerAddBtn.addEventListener('click', addPlannerItem);
plannerBackBtn.addEventListener('click', closePlanner);
energyBtns.forEach(btn => btn.addEventListener('click', () => chooseEnergy(btn.dataset.level)));
energyUnsureBtn.addEventListener('click', () => chooseEnergy('low')); // plays it safe; the badge can scale it up later
energyBadgeBtn.addEventListener('click', () => showView(energyView)); // recalibrate any time, no daily gate

// Cmd/Ctrl+Enter in the textarea is a shortcut for clicking "Start"
dumpInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        startFlow();
    }
});

// Enter in the planner's single-line input is a shortcut for clicking "Add" — unlike the
// brain dump's textarea, there's no multi-line use for a plain Enter here.
plannerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPlannerItem();
});

// Startup: load everything first, decide navigation once. Two conditions want a say in
// what shows first — an unanswered energy check-in, and a resumable task — and they don't
// agree, so the decision has to happen after both are known: energy always goes first when
// it's needed, and only once it's settled does whether-there's-a-task decide where next.
loadState();
loadVault();
renderVaultLink();
loadPlanner();
loadEnergy();
applyEnergyEffects();

if (needsEnergyCheckIn()) {
    showView(energyView);
} else {
    goToStartScreen();
}