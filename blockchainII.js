const adv = require("./bcAxiosConfig");
const SHA256 = require("crypto-js/sha256");

// Creating Blockchain class

class Block {
  constructor(proof, difficulty, cooldown, messages, errors) {
    this.proof = proof;
    this.difficulty = difficulty;
    this.cooldown = cooldown;
    this.messages = messages;
    this.errors = errors;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.proof +
        this.difficulty +
        this.cooldown +
        this.messages +
        this.errors,
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

const proof_of_work = last_block => {
  block_string = JSON.stringify(last_block);
  proof = 0;
  while (!valid_proof(block_string, proof)) {
    proof += 1;

    return proof;
  }
};

const valid_proof = (block_string, proof) => {
  guess = `${block_string}${proof}`;
  guess_hash = SHA256(guess).toString();

  return guess_hash.substring(0, 8) == '0000000';
};

adv
  .get("last_proof/")
  .then(res => {
    console.log("last_proof", res.data);

    currentBlock = res.data;
    lastProof = currentBlock.proof;
    console.log(lastProof);
    console.log(SHA256(lastProof).toString());
    new_proof = proof_of_work(lastProof)
    console.log('new_proof', new_proof)

      post_data = {
        'proof': new_proof
      };

      setTimeout(() => {
        adv
          .post(
            "https://lambda-treasure-hunt.herokuapp.com/api/bc/mine/",
            post_data
          )
          .then(res => {
            new_block_mined = res.data;
            console.log("new_block_mined", new_block_mined);
          })
          .catch(err => console.log(`new block not mined: ${err}`));
      }, currentBlock.cooldown * 1000);
  })
  .catch(err => console.log(`Did not make get request for proof: ${err}`));

