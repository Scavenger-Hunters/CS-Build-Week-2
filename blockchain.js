const server = require('./bc_axiosConfig');
const shajs = require('sha.js');
// 1. Get request for last_proof function
// 2. In the .then():
// 3. last proof = Stringify res.data.proof
// 4. get difficulty
// 5. choose starting proof number (suggested proof)
// 6. (set up valid proof function elsewhere)
// 7. (set up hash function elsewhere for valid proof func)
// 8. while loop: while valid proof returns false, change proof to new random num
// 9. Once valid proof returns true, pass the proof to the POST req at mine endpoint after cooldown time elapses (wrap in setTimeout)
// 10. If catch error to mine endpoint, repeat main function (invoke get req func again)
// #1: GET request to retrieve last proof and difficulty value
function getLastProof() {
  let last_proof = '';

  server
    .get('last_proof/')
    .then(res => {
      console.log('Get Req Success', res.data);
      last_proof = JSON.stringify(res.data.proof);
      let difficulty = res.data.difficulty;
      let proof = 57691853; // proof
      while (!valid_proof(last_proof, proof, difficulty)) {
        proof = Math.floor(Math.random() * 1000000000);
        // console.log("Wrong proof, try again with new proof # ", proof)
      }
      // If valid_proof returns true
      // Post proof to mine endpoint
      // add setTimeout here?
      setTimeout(() => {
        console.log('>>>  !!!!! FOUND Proof, posting to mine endpoint ', proof);
        server
          .post('mine/', { proof: proof })
          .then(res => {
            console.log('Success!', res.data);
          })
          .catch(err => {
            console.log('Post Proof Error!', err.response);
            getLastProof();
          });
      }, 1000);
    })
    .catch(err => console.log('GET req error:', err));
}
// #7. hash function for valid proof()
function hash(string) {
  return shajs('sha256')
    .update(string)
    .digest('hex');
}
// #6. valid_proof function
function valid_proof(lastProof_string, proof, difficulty) {
  const guess_hash = hash(`${lastProof_string}${proof}`);
  // console.log("Proof + Hash: ", proof, guess_hash)
  var leadingZeros = '';
  for (let i = 0; i < difficulty; i++) {
    leadingZeros += 0;
  }
  // console.log("Leading Zeros: ", leadingZeros);
  return guess_hash.startsWith(leadingZeros); // startsWith "000000" when difficulty is 6
}

module.exports = getLastProof;
