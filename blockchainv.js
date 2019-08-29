const server = require('./bcAxiosConfig');
const shajs = require('sha.js');

function getLastProof() {
  let last_proof = '';
  
  server
    .get('last_proof/')
    .then(res => {
      console.log('Get Req Success', res.data);
      
      last_proof = JSON.stringify(res.data.proof);
      let proof = 57691853; // proof
      
      while (!valid_proof(last_proof, proof)) {
        proof = Math.floor(Math.random() * 1000000000);
        // console.log("Wrong proof, try again with new proof # ", proof)
      }
      setTimeout(() => {
        
        console.log('>>>  !!!!! FOUND Proof, posting to mine endpoint ', proof);
        
        server
        .post('mine/', { 'proof': proof })
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
function hash(string) {
  return shajs('sha256')
    .update(string)
    .digest('hex');
  }
function valid_proof(lastProof_string, proof) {
  const guess_hash = hash(`${lastProof_string}${proof}`);
  
  return guess_hash.startsWith('000000');
}
getLastProof();