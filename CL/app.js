

// Variables =======================================================================================


const SV = "csa-2526-ig-rpsls-c7a9e4dcdzdrgbfg.westus3-01.azurewebsites.net";
const CL = "blue-field-0977cbd1e.6.azurestaticapps.net";

let numPlayers = 0;
let numRounds = 0;
let numTurn = 0;
let arrStrChoice = [ "", "", "" ]; // n/a, p1, p2
let arrNumRoundWins = [ 0, 0, 0 ]; // tie, p1, p2
let arrNumMatchWins = [ 0, 0, 0 ]; // n/a, p1, p2

const btnTitlePlay = document.getElementById("btn-title-play");
const btnTitleHelp = document.getElementById("btn-title-help");

const btnRulesBack = document.getElementById("btn-rules-back");

const btnSetupBack = document.getElementById("btn-setup-back");
const txtSetupP = document.getElementById("txt-setup-p");
const btnSetupP1 = document.getElementById("btn-setup-p-1");
const btnSetupP2 = document.getElementById("btn-setup-p-2");
const txtSetupR = document.getElementById("txt-setup-r");
const btnSetupR1 = document.getElementById("btn-setup-r-1");
const btnSetupR3 = document.getElementById("btn-setup-r-3");
const btnSetupR5 = document.getElementById("btn-setup-r-5");
const btnSetupR7 = document.getElementById("btn-setup-r-7");
const btnSetupR9 = document.getElementById("btn-setup-r-9");
const btnSetupNext = document.getElementById("btn-setup-next");

const btnHandsBack = document.getElementById("btn-hands-back");
const txtHandsHint = document.getElementById("txt-hands-hint");
const btnHandsC1 = document.getElementById("btn-hands-c-1");
const btnHandsC2 = document.getElementById("btn-hands-c-2");
const btnHandsC3 = document.getElementById("btn-hands-c-3");
const btnHandsC4 = document.getElementById("btn-hands-c-4");
const btnHandsC5 = document.getElementById("btn-hands-c-5");
const btnHandsNext = document.getElementById("btn-hands-next");

const btnScoreBack = document.getElementById("btn-score-back");
const txtScoreMain = document.getElementById("txt-score-main");
const txtScoreHint = document.getElementById("txt-score-hint");
const txtScoreInfo = document.getElementById("txt-score-info");
const btnScoreNext = document.getElementById("btn-score-next");


// Main ============================================================================================


(async () => {

  setActive("title");

  btnTitlePlay.addEventListener("click", () => { setActive("setup"); });
  btnTitleHelp.addEventListener("click", () => { setActive("rules"); });

  btnRulesBack.addEventListener("click", () => { setActive("title"); });

  btnSetupBack.addEventListener("click", () => { setActive("title"); });
  btnSetupP1.addEventListener("click", () => { setPlayers(1); });
  btnSetupP2.addEventListener("click", () => { setPlayers(2); });
  btnSetupR1.addEventListener("click", () => { setRounds(1); });
  btnSetupR3.addEventListener("click", () => { setRounds(3); });
  btnSetupR5.addEventListener("click", () => { setRounds(5); });
  btnSetupR7.addEventListener("click", () => { setRounds(7); });
  btnSetupR9.addEventListener("click", () => { setRounds(9); });
  btnSetupNext.addEventListener("click", () => { setupNext(); });

  btnHandsBack.addEventListener("click", () => { setActive("title"); });
  btnHandsC1.addEventListener("click", () => { setChoice("rock"); });
  btnHandsC2.addEventListener("click", () => { setChoice("paper"); });
  btnHandsC3.addEventListener("click", () => { setChoice("scissors"); });
  btnHandsC4.addEventListener("click", () => { setChoice("lizard"); });
  btnHandsC5.addEventListener("click", () => { setChoice("spock"); });
  btnHandsNext.addEventListener("click", () => { handsNext(); });

  btnScoreBack.addEventListener("click", () => { setActive("title"); });
  btnScoreNext.addEventListener("click", () => { scoreNext(); });

})();


// Functions =======================================================================================


async function getRandomChoice() {
  try
  {
    const res = await fetch(`https://${SV}/api/game/randomchoice`);
    const str = await res.text();
    if (!str.trim()) throw new Error("Empty response.");

    return str;
  }
  catch (err)
  {
    console.error(err);

    return null;
  }
}

function setActive(str) {
  str = str.trim().toLowerCase();
  console.log("SET ACTIVE:", str);

  document.querySelectorAll("section.grid").forEach(e => e.classList.remove("active"));
  document.querySelector("section.grid-" + str).classList.add("active");

  if (str === "title") {
    numPlayers = 0;
    numRounds = 0;
    numTurn = 0;
    arrStrChoice = [ "", "", "" ];
    arrNumRoundWins = [ 0, 0, 0 ];
  }
  if (str === "setup") {
    txtSetupP.innerText = "Players";
    txtSetupR.innerText = "Rounds";
  }
  if (str === "hands") {
    txtHandsHint.innerText = `Player ${numTurn}'s Turn`;
  }
  if (str === "score") {
    const r = arrNumRoundWins[1] + arrNumRoundWins[2];
    if (r < numRounds) {
      const [ w, s ] = checkRound();
      arrNumRoundWins[w]++;
      txtScoreMain.innerText = w > 0 ? `Round Win For Player ${w}!` : "Tie!";
      txtScoreHint.innerText = s;
      txtScoreInfo.innerText = `Ties - ${arrNumRoundWins[0]} / P1 - ${arrNumRoundWins[1]} / P2 - ${arrNumRoundWins[2]}`;
    }
    if (r == numRounds) {
      const w = checkMatch();
      arrNumMatchWins[w]++;
      txtScoreMain.innerText = `Player ${w} Wins!`;
      txtScoreHint.innerText = `After ${arrNumRoundWins.reduce((p, c) => p + c)} rounds.`;
      txtScoreInfo.innerText = `P1 - ${arrNumMatchWins[1]} / P2 - ${arrNumMatchWins[2]}`;
    }
  }
}

function setPlayers(num) {
  console.log("SET PLAYERS:", num);

  numPlayers = num;
  txtSetupP.innerText = `Players - ${num}`;
  // TODO: highlight choice?
}

function setRounds(num) {
  console.log("SET ROUNDS:", num);

  numRounds = num;
  txtSetupR.innerText = `Rounds - ${num}`;
  // TODO: highlight choice?
}

function setupNext() {
  console.log("SETUP NEXT");

  if (numPlayers > 0 && numRounds > 0) {
    numTurn = 1;
    setActive("hands");
  }
}

function setChoice(str) {
  str = str.trim().toLowerCase();
  console.log("SET CHOICE:", str);

  arrStrChoice[numTurn] = str;
  // TODO: highlight choice?
}

async function handsNext() {
  console.log(arrStrChoice);

  if (arrStrChoice[numTurn]) {
    if (numPlayers === 1) {
      arrStrChoice[2] = await getRandomChoice();
      setActive("score");
    }
    if (numPlayers === 2) {
      if (numTurn === 1) {
        numTurn = 2;
        setActive("hands");
        return;
      }
      if (numTurn === 2) {
        numTurn = 1;
        setActive("score");
        return;
      }
    }
  }
}

function checkRound() {
  let a = arrStrChoice[1];
  let b = arrStrChoice[2];
  arrStrChoice = [ "", "", "" ];
  if (a === b) {
    return [0, `${a} ties ${b}.`];
  }
  for (let i = 1; i <= 2; i++) {
    if (a == "rock" && b == "scissors") return [i, "Rock crushes Scissors."];
    if (a == "rock" && b == "lizard") return [i, "Rock crushes Lizard."];
    if (a == "paper" && b == "rock") return [i, "Paper covers Rock."];
    if (a == "paper" && b == "spock") return [i, "Paper disproves Spock."];
    if (a == "scissors" && b == "paper") return [i, "Scissors cuts Paper."];
    if (a == "scissors" && b == "lizard") return [i, "Scissors decapitates Lizard."];
    if (a == "lizard" && b == "paper") return [i, "Lizard eats Paper."];
    if (a == "lizard" && b == "spock") return [i, "Lizard poisons Spock."];
    if (a == "spock" && b == "rock") return [i, "Spock vaporizes Rock."];
    if (a == "spock" && b == "scissors") return [i, "Spock smashes Scissors."];
    [ a, b ] = [ b, a ];
  }
  return [ 0, "" ];
}

function checkMatch() {
  if (arrNumRoundWins[1] > arrNumRoundWins[2]) return 1;
  if (arrNumRoundWins[2] > arrNumRoundWins[1]) return 2;
  return 0;
}

function scoreNext() {
  console.log("SCORE NEXT");

  const r = arrNumRoundWins[1] + arrNumRoundWins[2];
  if (r > numRounds) {
    setActive("title");
  }
  if (r < numRounds) {
    setActive("hands");
  }
  if (r == numRounds) {
    setActive("score");
    numRounds = 0;
  }
}

