const server = require("./bc_axiosConfig");
const shajs = require("sha.js");

const miner = () => {
    // make sure we're in the mining room
    if (currentRoom.room_id === 250) {
      let prevBlock = '';
      
      server
        .get('last_proof/')
        .then(res => {
          console.log("Get Req Good: ", res.data);

          let difficulty = res.data.difficulty;
          prevBlock = JSON.stringify(res.data.proof)
          console.log("Prev Block: ", prevBlock);

          let p = 550867667 // proof
          while (test_proof(prevBlock, p, difficulty) !== true) {
            if (p % 10000 === 0) {
              console.log('p is now', p);
            }
            p = Math.floor(Math.random() * 1000000000);
          }
          console.log('proof', p);
          setTimeout(() => {
            axios.post(`${baseUrl}/bc/mine`, {"proof": p}, authHeader)
              .then(res => console.log(res))
              .catch(err => console.log(err))
          }, 1000);
        })
        .catch(err => console.log(err))
    }
  }
  const test_proof = (block_string, proof, difficulty) => {
    let guess = `${block_string}${proof}`
    let guessHash = hash(guess)
    if (proof % 10000 === 0) {
      console.log('guessHash', guessHash);
    }
    let startString = ''
    for (let i = 0; i < difficulty; i++) {
      startString += 0
    }
    return guessHash.slice(0, difficulty) === startString
  }
  const hash = string => {
    return shajs('sha256').update(string).digest('hex')
  }