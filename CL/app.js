
const SV = "csa-2526-ig-rpsls-c7a9e4dcdzdrgbfg.westus3-01.azurewebsites.net";

console.log("test 1");

fetch(`https://${SV}/api/game/randomchoice`)
  .then(r => r.text())
  .then(s => {
    console.log(s);
    document.querySelector("main").innerText = s;
  });

console.log("test 2");
