let axios = require('axios');

class ECashRPC {
  constructor(
    host,
    username,
    password,
    port,
    timeout = 3000,
    debugging = true
  ) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.port = port;
    this.timeout = timeout;

    this.debugging = debugging;
  }

  /**
   * @param {String} Method  name of the method being called
   * @param {Array}  params  various number of arguments based on method
   * @return {String} body    the plaintext body to POST
   */
  async buildBody(method, ...params) {
    var time = Date.now();

    let body = {
      jsonrpc: '1.0',
      id: time,
      method: method
    };

    if (params.length) {
      body.params = params;
    }

    return JSON.stringify(body);
  }

  /**
   * @param {String} Method  name of the method
   * @param {...[type]} params   varies based on the method
   * @return {String} Header  plaintext request object to POST to the node
   */
  async performMethod(method, ...params) {
    if (params.length) {
      var body = await this.buildBody(method.toLowerCase(), ...params);
    } else {
      var body = await this.buildBody(method.toLowerCase());
    }
    let req = {
      method: 'POST',
      url: `${this.host}:${this.port}/`,
      auth: { username: `${this.username}`, password: `${this.password}` },
      headers: {
        'Content-Type': 'text/plain'
      },
      timeout: this.timeout,
      data: `${body}`,
      rpcMethod: method
    };
    return req;
  }

  /**
   * @param {String} req  plaintext request object to POST to the node
   * @return {String} res  response information from the node
   */
  async postRequest(req) {
    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (err.response) {
          if (this.debugging) {
            console.log(err.response.data)
          }
          if (err.response.data.error) {
            throw new Error('failed in ' + req.rpcMethod + ' code=' + err.response.data.error.code +  ' message=' + err.response.data.error.message);
          } else {
            throw new Error('failed in ' + req.rpcMethod + ': ' + JSON.stringify(err.response.data));
          }
        } else {
          if (this.debugging) {
            console.log(err);
          }
          throw new Error('failed in ' + req.rpcMethod + ': ' + err);
        }
      });
  }

  /**
   * @param nodeid        (numeric, required) Node to be added to avalanche.
   * @param publickey     (string, required) The public key of the node.
   * @param proof         (string, required) Proof that the node is not a sybil.
   * @param delegation    (string) The proof delegation the the node public key
   * @return {boolean}    (boolean) Whether the addition succeeded or not.
   */
  async addAvalancheNode(...params) {
    let req = await this.performMethod('addavalanchenode', ...params);
    return this.postRequest(req)
  }

  /**
   * @param sequence      (numeric, required) The proof's sequence
   * @param expiration    (numeric, required) A timestamp indicating when the proof expire
   * @param master        (string, required) The master private key in base58-encoding
   * @param stakes        (json array, required) The stakes to be signed and associated private keys
   * @param payoutAddress (string, required) A payout address
   * @return {string}     A string that is a serialized, hex-encoded proof data.
   */
  async buildAvalancheProof(...params) {
    let req = await this.performMethod('buildavalancheproof', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param delegation    (string, required) The delegation hex string
   * @return {object}     Converts a serialized, hex-encoded avalanche proof delegation, into JSON object. The validity of the delegation is not verified.
   */
  async decodeAvalancheDelegation(...params) {
    let req = await this.performMethod('decodeavalanchedelegation', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param proof    (string, required) The proof hex string
   * @return {object} Convert a serialized, hex-encoded proof, into JSON object. The validity of the proof is not verified.
   */
  async decodeAvalancheProof(...params) {
    let req = await this.performMethod('decodeavalancheproof', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param limitedproofid    (string, required) The limited id of the proof to be delegated.
   * @param privatekey        (string, required) The private key in base58-encoding. Must match the proof master public key or the upper level parent delegation public key if  supplied.
   * @param publickey         (string, required) The public key to delegate the proof to.
   * @param delegation        (string) A string that is the serialized, hex-encoded delegation for the proof and which is a parent for the delegation to build.
   * @return {string}         (string) A hex string that is a serialized, hex-encoded delegation.
   */
  async delegateAvalancheProof(...params) {
    let req = await this.performMethod('delegateavalancheproof', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @return {Object}   Returns an object containing various state info regarding avalanche networking.
   */
  async getAvalancheInfo() {
    let req = await this.performMethod('getavalancheinfo');
    return this.postRequest(req)
  }
  
  /**
   * @return {string}   Returns the key used to sign avalanche messages.
   */
  async getAvalancheKey() {
    let req = await this.performMethod('getavalanchekey');
    return this.postRequest(req)
  }
  
  /**
   * @param proofid     (string) The hex encoded avalanche proof identifier.
   * @return {object}   Returns data about an avalanche peer as a json array of objects. If no proofid is provided, returns data about all the peers.
   */
  async getAvalanchePeerInfo(...params) {
    let req = await this.performMethod('getavalanchepeerinfo', ...params);
    return this.postRequest(req)
  }

  /**
   * @param proofid     (string, required) The hex encoded avalanche proof identifier.
   * @return {object}   Returns data about an avalanche proof by id.
   */
  async getRawAvalancheProof(...params) {
    let req = await this.performMethod('getrawavalancheproof', ...params);
    return this.postRequest(req)
  }

  /**
   * @param blockhash       (string, required) The hash of the block.
   * @return {boolean}     (boolean) Whether the block has been finalized by avalanche votes.
   */
  async isFinalBlock(...params) {
    let req = await this.performMethod('isfinalblock', ...params);
    return this.postRequest(req)
  }

  /**
   * @param txid         (string, required) The id of the transaction.
   * @param blockhash    (string) The block in which to look for the transaction
   * @return {boolean}   (boolean) Whether the transaction has been finalized by avalanche votes.
   */
  async isFinalTransaction(...params) {
    let req = await this.performMethod('isfinaltransaction', ...params);
    return this.postRequest(req)
  }

  /**
   * @param proof         (string, required) The avalanche proof to broadcast.
   * @return {boolean}   (boolean) Whether the proof was sent successfully or not.
   */
  async sendAvalancheProof(...params) {
    let req = await this.performMethod('sendavalancheproof', ...params);
    return this.postRequest(req)
  }

  /**
   * @param delegation    (string, required) The avalanche proof delegation to verify.
   * @return {boolean}    (boolean) Whether the delegation is valid or not.
   */
  async verifyAvalancheDelegation(...params) {
    let req = await this.performMethod('verifyavalanchedelegation', ...params);
    return this.postRequest(req)
  }

  /**
   * @param proof    (string, required) Proof to verify.
   * @return {boolean} Whether the proof is valid or not.
   */
  async verifyAvalancheProof(...params) {
    let req = await this.performMethod('verifyavalancheproof', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param {Number} number of blocks needed to begin confirmation
   * @return estimated transaction fee per kilobyte
   */
  async estimateFee(...params) {
    let req = await this.performMethod('estimateFee', ...params);
    return this.postRequest(req)
  }

  /**
   * @return {Object} array of all UTXOs incoming/outgoing
   */
  async listTransactions() {
    let req = await this.performMethod('listTransactions');
    return this.postRequest(req)
  }

  /**
   * @param {Number} minconf minimum number of confirmations
   * @param {Number} maxconf max number of confirmations
   * @return {Object} array of all UTXOs
   */
  async listUnspent(...params) {
    let req = await this.performMethod('listUnspent', ...params);
    return this.postRequest(req)
  }

  /**
   * @param {String} RawTX transaction as a string
   * @return {Object} hex value of transaction and complete: true
   */
  async signRawTransaction(...params) {
    let req = await this.performMethod('signrawtransactionwithkey', ...params);
    return this.postRequest(req)
  }

  /**
   * @param {String} Address  XEC address
   * @param {String} Signature  signature
   * @param {String} Message  contents of message
   * @return {Boolean} whether it is valid
   */
  async verifyMessage(...params) {
    let req = await this.performMethod('verifyMessage', ...params);
    return this.postRequest(req)
  }

  /**
   * @return {Object} array   version, walletversion, balance, block height, difficulty, tx fee
   */
  async getBlockchainInfo() {
    let req = await this.performMethod('getBlockChainInfo');
    return this.postRequest(req)
  }

  /**
   * @return {string} height   latest confirmed block number
   */
  async getBlockCount() {
    let req = await this.performMethod('getBlockCount');
    return this.postRequest(req)
  }

  /**
   * @return {Object} array   wallet version, balance, unconfirmed balance, txcount, and what the tx fee was set at
   */
  async getWalletInfo() {
    let req = await this.performMethod('getWalletInfo');
    return this.postRequest(req)
  }

  /**
   * @return {String} balance   In satoshis
   */
  async getUnconfirmedBalance() {
    let req = await this.performMethod('getUnconfirmedBalance');
    return this.postRequest(req)
  }

  /**
   * @param {Number}  blocknumber  block number you want the hash of
   * @return {String}  blockhash
   */
  async getBlockHash(...params) {
    let req = await this.performMethod('getBlockHash', ...params);
    return this.postRequest(req)
  }

  /**
   * @return {Number} blockheight   Returns the height of the most-work fully-validated chain.
   */
  async getBlockCount() {
    let req = await this.performMethod('getblockcount');
    return this.postRequest(req)
  }
  
  /**
   * @param {String} transaction id
   * @param {Boolean} verbose
   * @return {String} transaction details
   */
  async getRawTransaction(...params) {
    let req = await this.performMethod('getRawTransaction', ...params);
    return this.postRequest(req)
  }
  /**
   * @param {String} transaction id
   * @return {String} transaction details
   */
  async getTransaction(...params) {
    let req = await this.performMethod('getTransaction', ...params);
    return this.postRequest(req)
  }
  /**
   * @param {String}  account name of the account
   * @return {String} balance  in satoshis
   */
  async getBalance(...params) {
    let req = await this.performMethod('getBalance', ...params);
    return this.postRequest(req)
  }

  /**
   * @param {Number} TxFee transaction fee
   * @return {Boolean} whether it was successful
   */
  async setTxFee(...params) {
    let req = await this.performMethod('setTxFee', ...params);
    return this.postRequest(req)
  }

  /**
   * @param {String} blockhash
   * @return {obj} data       returns the block info
   */
  async getBlock(...params) {
    let req = await this.performMethod('getBlock', ...params);
    return this.postRequest(req)
  }

  /**
   * @param {String} transaction
   * @return {obj} data     returns the tx info
   */
  async decodeRawTransaction(...params) {
    let req = await this.performMethod('decodeRawTransaction', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param {String} transaction_id
   * @param {Number} vout     use 1
   * @return {obj} data       returns the tx info
   */
  async getTxOut(...params) {
    let req = await this.performMethod('getTxOut', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param {String} array of txids
   * @param {String} blockhash  looks for txid in block w/ this hash
   * @return {obj} data       returns hex encoded data for proof
   */
  async getTxoutProof(...params) {
    let req = await this.performMethod('getTxoutProof', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param {Boolean} verbose
   * @return {Object} array   txid
   */
  async getRawMempool(...params) {
    let req = await this.performMethod('getRawMempool', ...params);
    return this.postRequest(req)
  }
  
  /**
   * @param {String} hexstring
   * @return {String} transaction ID
   */
  async sendRawTransaction(...params) {
    let req = await this.performMethod('sendRawTransaction', ...params);
    return this.postRequest(req)
  }
}

module.exports = ECashRPC;
