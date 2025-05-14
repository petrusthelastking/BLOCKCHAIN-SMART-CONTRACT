# Module1 - Create a Blockchain

import datetime
import hashlib
import json
from flask import Flask, jsonify

# Part 1 - Membuat a Blockchain

class Blockchain:
 
    def __init__(self):
        self.chain = []
        self.Create_block(proof=1, previous_hash='0')
    
    def Create_block(self, proof, previous_hash):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': previous_hash}
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]
    
    def proof_of_work(self, previous_hash):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_hash**2).encode()).hexdigest()
            if hash_operation[:2] == '00':
                check_proof = True
            else:
                new_proof += 1
        return new_proof

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:2] != '00':
                return False
            previous_block = block
            block_index += 1
        return True

# Part 2 - Mining our Blockchain

## Creating a Web APP
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

## Creating A Blockchain
blockchain = Blockchain()


## Mining A New Block
@app.route("/mine_block", methods=['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.Create_block(proof, previous_hash)
    response = {'massage': 'selamat kamu mendapatkan sebuah block baru',
                'index': block['index'],
                'timestamp': block['timestamp'],
                'proof': block['proof'],
                'previous_hash': block['previous_hash']}
    return jsonify(response), 200

# Getting the Full Blockchain
@app.route("/get_chain", methods=['GET'])
def get_chain():
    response = {'chain': blockchain.chain,
                'length': len(blockchain.chain)}
    return jsonify(response), 200

## Pekerjaan Rumah (PR)
@app.route("/is_valid", methods=['GET'])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'massage': 'ALL good. The Blockchain is valid.'}
    else:
        response = {'massage': 'Houston, we have a problem. the blockchain is not valid.'}
    return jsonify(response), 200

## Running The APP
app.run(host='0.0.0.0', port=5000)



