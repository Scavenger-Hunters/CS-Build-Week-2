const server = require("./bc_axiosConfig");
const shajs = require("sha.js");

// 1. Get request for last_proof
// 2. Proof_of_work(last proof)
// 3. Hash last_proof and proof str
// 4. Validate proof ()
// 5. If validate proof returns false, change proof (random), repeat entire flow
// 6. If validate proof returns true, send proof in post request to mine endpoint

// let proof = 10000235791539;
// let proof = 1;

// proof_of_work function
function proof_of_work(lastProof) {
    lastProof_string = lastProof.toString();

    console.log("Starting finding valid proof at...", proof)

    if (!valid_proof(lastProof_string, proof)) {

        // proof += 3
        
        proof = Math.floor(Math.random() * 1000000000)

        console.log("Wrong proof, try again with new proof # ", proof)

        //  no new_proof, so get request repeats with all other functions but with new proof

    } else {

        console.log(">>>  !!!!! FOUND Proof, posting to mind endpoint ", proof)

        return proof
        
    }

}

// hash function for valid proof()
function hash(string) {
    return shajs('sha256').update(string).digest('hex')
  }

// valid_proof function
function valid_proof(lastProof_string, proof) {

    const guess_hash = hash(`${lastProof_string}${proof}`)

    // console.log("Proof + Hash: ", proof, guess_hash)

    return guess_hash.startsWith("000000")

}

// #1: GET request to retrieve last proof and difficulty value

function getLastProof() {

    let last_proof = "";
    
    server
        .get('last_proof/')
        .then(res => { 
            console.log("Get Req Success", res.data);
            last_proof = JSON.stringify(res.data.proof);

            let proof = 57691853 // proof

            while (!valid_proof(last_proof, proof)) {

                proof = Math.floor(Math.random() * 1000000000);
                // console.log("Wrong proof, try again with new proof # ", proof)
            }

            // If valid_proof returns true
            // Post proof to mine endpoint 
            // add setTimeout here?
            setTimeout(() => {
                console.log(">>>  !!!!! FOUND Proof, posting to mind endpoint ", proof)

                server
                .post('mine/', {"proof": proof})
                .then(res => { 
                    console.log("Success!", res.data);
        
                })
                .catch(err => {
                    console.log("Post Proof Error!", err.response); 
                    getLastProof();})
            }, 1000)
 
        })
        .catch(err => console.log("GET req error:", err))

}

getLastProof()