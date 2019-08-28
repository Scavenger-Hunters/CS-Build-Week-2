const adv = require("./axiosConfig");
const SHA256 = require("crypto-js/sha256");
const axios = require("axios");

// Initialization
// adv
//   .get("init")
//   .then(res => {
//     console.log("Init: ", res.data);

//     // Set Current Room as res.data
//     currentRoom = res.data;

//     // Check ID and Exit data
//     console.log("ID: ", currentRoom.room_id);
//     console.log("Exits: ", currentRoom.exits);

//     // get cooldown value for current room for setTimeout()
//     roomCD = currentRoom.cooldown;
//   })
//   .catch(err => console.error(err));

// Creating Blockchain class

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2017", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

while (true) {
  axios
    .get("https://lambda-treasure-hunt.herokuapp.com/api/bc/last_proof/")
    .then(res => {
      console.log("last_proof", res.data);

      currentBlock = res.data;
      lastProof = currentBlock.proof;
      new_proof = Block.mineBlock(currentBlock.difficulty);
      console.log("new_proof", new_proof);

      post_data = {
        'proof': new_proof
      };

    //   setTimeout(() => {
    //     axios
    //       .post(
    //         "https://lambda-treasure-hunt.herokuapp.com/api/bc/mine/",
    //         post_data
    //       )
    //       .then(res => {
    //         new_block_mined = res.data;
    //         console.log("new_block_mined", new_block_mined);
    //       })
    //       .catch(err => console.log(`new block not mined, error: ${err}`));
    //   }, currentBlock.cooldown * 1000);
    })
    .catch(err => console.log(`Did not make get request for proof: ${err}`));
}

// while True:
//         r = requests.get(url=node + '/last_block')
//         data = r.json()
//         last_block = data['last_block']
//         print('Last block is:')
//         print(last_block)
//         new_proof = proof_of_work(last_block)
//         print('found a proof: {new_proof}')

//         post_data = {
//             'proof': new_proof
//         }

//         r = requests.post(url=node + '/mine', json=post_data)
//         data = r.json()

//         if data['message'] == 'New Block Forged':
//             # keep track of the coins we've mined
//             print(data['message'])
//         else:
//             print('handle failure message')
