const spells = {
    "QQQ": {name: "Cold Snap", img: "spells/invoker_cold_snap.png"},
    "WWW": {name: "EMP", img: "spells/invoker_emp.png"},
    "EEE": {name: "Sun Strike", img: "spells/invoker_sun_strike.png"},
    "QQW": {name: "Ghost Walk", img: "spells/invoker_ghost_walk.png"},
    "QWW": {name: "Tornado", img: "spells/invoker_tornado.png"},
    "QWE": {name: "Deafening Blast", img: "spells/invoker_deafening_blast.png"},
    "QQE": {name: "Ice Wall", img: "spells/invoker_ice_wall.png"},
    "WWE": {name: "Alacrity", img: "spells/invoker_alacrity.png"},
    "WEE": {name: "Chaos Meteor", img: "spells/invoker_chaos_meteor.png"},
    "QEE": {name: "Forge Spirit", img: "spells/invoker_forge_spirit.png"}
};

const ranks = [
    {name: "Unranked", min: 0, max: 5, img: "ranks/unranked.webp"},
    {name: "Herald", min: 5, max: 10, img: "ranks/herald.webp"},
    {name: "Guardian", min: 10, max: 15, img: "ranks/guardian.webp"},
    {name: "Crusader", min: 15, max: 20, img: "ranks/crusader.webp"},
    {name: "Archon", min: 20, max: 25, img: "ranks/archon.webp"},
    {name: "Legend", min: 25, max: 30, img: "ranks/legend.webp"},
    {name: "Ancient", min: 30, max: 35, img: "ranks/ancient.webp"},
    {name: "Divine", min: 35, max: 37, img: "ranks/divine.webp"},
    {name: "Immortal", min: 37, max: 42, img: "ranks/divine.webp"},
    {name: "Immortal Top 100", min: 42, max: 50, img: "ranks/immortal_top100.webp"},
    {name: "Immortal Top 1", min: 50, max: Infinity, img: "ranks/immortal_top1.webp"}
];

const orbImages = document.querySelectorAll('#betlog_ni_invoker img');

orbImages.forEach(orb => {
  orb.addEventListener('click', () => {
    const key = orb.getAttribute('data-key');
    handleOrbPress(key);
  });
});

function handleOrbPress(key) {
  // image press = QWER
  console.log(`${key} orb pressed!`);
 //for orb combos
  addOrbToCombo(key);
}

let spellKeys = Object.keys(spells);
let targetSpell = "";
let combo = [];
let score = 0;
let highscore = 0;
let timeLeft = 60;
let timerInterval;
let gameActive = false;

// high score
if (localStorage.getItem("highscore")) {
    highscore = parseInt(localStorage.getItem("highscore"));
}

function getRandomSpell() {
    return spellKeys[Math.floor(Math.random() * spellKeys.length)];
}

function normalizeCombo(arr) {
    return arr.slice().sort().join("");
}

function updateDisplay() {
    document.getElementById("combo").innerText = combo.join("");
    
    if (targetSpell) {
        document.getElementById("targetSpell").innerText = spells[targetSpell].name;
        const img = document.getElementById("abilityImg");
        img.src = spells[targetSpell].img;
        img.style.display = "inline-block";
    }

    document.getElementById("score").innerText = score;
    document.getElementById("highscore").innerText = highscore;
    document.getElementById("timer").innerText = timeLeft;
}

function getRank(score) {
    return ranks.find(r => score >= r.min && score < r.max) || ranks[0];
}

document.addEventListener("keydown", function (event) {
    if (!gameActive) return;

    let key = event.key.toUpperCase();
    if (["Q", "W", "E"].includes(key)) {
        if (combo.length < 3) {
            combo.push(key);
            updateDisplay();
        }
    }

    if (key === "R" && combo.length === 3) {
        if (normalizeCombo(combo) === normalizeCombo(targetSpell.split(""))) {
            score++;
        }

        targetSpell = getRandomSpell();
        combo = [];
        updateDisplay();
    }
});

function startGame() {
    score = 0;
    timeLeft = 60;
    combo = [];
    targetSpell = getRandomSpell();
    gameActive = true;
    document.getElementById("rankDisplay").innerHTML = "";
    updateDisplay();

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;

            // update highscore
            if (score > highscore) {
                highscore = score;
                localStorage.setItem("highscore", highscore);
            }

            updateDisplay();

            const rank = getRank(score);
            const displayDiv = document.getElementById("rankDisplay");
            displayDiv.innerHTML = `
                <div>Rank: ${rank.name}</div>
                <img src="${rank.img}" alt="${rank.name}"/>
            `;
        }
    }, 1000);
}

function addOrbToCombo(key) {
    if (!gameActive) return;

    if (["Q", "W", "E"].includes(key)) {
        if (combo.length < 3) {
            combo.push(key);
            updateDisplay();
        }
    }

    if (key === "R" && combo.length === 3) {
        if (normalizeCombo(combo) === normalizeCombo(targetSpell.split(""))) {
            score++;
        }

        targetSpell = getRandomSpell();
        combo = [];
        updateDisplay();
    }
}