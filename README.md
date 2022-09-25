# eCash JSON-RPC library

## Javascript Library to communicate with your Bitcoin ABC Node.

Compatible with Avalanche Post-Consensus (0.26.1 and later).
This is a promise-based library and `async/await` compatible.

## Installation

grab from NPM

```
  npm i ecash-rpc
```

## Usage

```
let xecRPC = require("ecash-rpc");
let xec = new xecRPC(host, username, password, port, timeout, debugging);

// timeout is 3000 by default
// debugging is true by default, false makes the library silent and requires try/catch on the app level.


```

```
 let info = await xec.getAvalancheInfo();

 console.log(info)

 // results in
 // {
 //  "ready_to_poll":true,
 //  "local":{
 //     "verified":true,
 //     "proofid":"...",
 //     "limited_proofid":"...",
 //     "master":"...",
 //     "payout_address":"ecash:qqmd..........",
 //     "stake_amount":1560000000
 //  },
 //  "network":{
 //     "proof_count":18,
 //     "connected_proof_count":18,
 //     "dangling_proof_count":0,
 //     "finalized_proof_count":18,
 //     "conflicting_proof_count":0,
 //     "immature_proof_count":4,
 //     "total_stake_amount":83681202831.85,
 //     "connected_stake_amount":83681202831.85,
 //     "dangling_stake_amount":0,
 //     "node_count":37,
 //     "connected_node_count":33,
 //     "pending_node_count":4
 //  }
 // }
 
```

or

```
 p = Promise.resolve(xec.getAvalancheInfo());
 p.then(info=>{
    console.log(info);
 })
```

## Available Methods

There is only selected RPC coverage at the moment. Please submit a PR if you'd like to
have a method added.

`getAvalancheInfo` `buildAvalancheProof` `decodeAvalancheProof`
`getAvalanchePeerInfo` `getRawAvalancheProof` `verifyAvalancheProof`
`getBlockchainInfo` `getBlockCount` `getWalletInfo` `getUnconfirmedBalance` `getBalance` `getBlockCount` `getWalletInfo` `getBlockHash` `setTxFee` 
`getBlock` `getTxOut` `listTransactions` `listUnspent` `getTransaction`
`getRawTransaction` `getRawMempool` `signRawTransaction` 
`sendRawTransaction` `decodeRawTransaction` `getTxoutProof`

## Compatible Node Implementations

You must be running a Node (Pruned mode is fine)

[Bitcoin ABC](https://www.bitcoinabc.org/)

### Tested on Node v16.17.0, NPM v8.19.1 and Bitcoin ABC 0.26.1
