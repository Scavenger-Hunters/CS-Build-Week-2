const adv = require("./bcAxiosConfig");
const SHA256 = require("crypto-js/sha256");
const miner = () => {

    let prevBlock = "";
    adv
      .get("last_proof/")
      .then(res => {
        console.log(res.data);
        let difficulty = res.data.difficulty;
        prevBlock = JSON.stringify(res.data.proof);
        console.log(prevBlock);
        let p = 615756047;
        while (test_proof(prevBlock, p, difficulty) !== true) {
          if (p % 10000 === 0) {
            console.log("p is now", p);
          }
          p = Math.floor(Math.random() * 1000000000);
        }
        console.log("proof", p);
        setTimeout(() => {
            adv
            .post('mine/')
            .then(res => console.log(res))
            .catch(err => console.log(err));
        }, 1000);
      })
      .catch(err => console.log(err));
 
};
const test_proof = (block_string, proof, difficulty) => {
  let guess = `${block_string}${proof}`;
  let guessHash = hash(guess);
  if (proof % 10000 === 0) {
    console.log("guessHash", guessHash);
  }
  let startString = "";
  for (let i = 0; i < difficulty; i++) {
    startString += 0;
  }
  return guessHash.slice(0, difficulty) === startString;
};
const hash = string => {
    return SHA256(string).toString();
};
miner();
