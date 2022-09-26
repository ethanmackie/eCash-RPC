# eCash JSON-RPC library

## Javascript Library to communicate with your eCash Node.

Compatible with **Avalanche Post-Consensus** (0.26.1 and later).

![header](https://github.com/ethanmackie/eCash-RPC/blob/master/avalanchelogo.PNG)

This is a promise-based library and `async/await` compatible.

## Installation

#### 1. Install from NPM

```
  npm i ecash-rpc
```

#### 2. Node configuration
Configure your eCash Avalanche Node for remote RPC calls based on your node's security needs. This includes:
- add `server=1`, `rpcallowip=`, `rpcbind=` and `rpcauth/rpcuser/rpcpassword=` parameters to your node configuration in bitcoin.conf. (refer to the **Server Configuration section** of [this Blockchain Dev guide](https://www.buildblockchain.tech/blog/btc-node-developers-guide))
- a reverse proxy server such as [nginx](http://nginx.org/) to serve RPC data to external web apps subject to your eCash node's rpcallowip whitelist
- install a digital certificate (e.g. [Let's Encrypt](https://letsencrypt.org)) on your node to enable HTTPS if desired


## Usage

```
let ECashRPC = require("ecash-rpc");
let xecNode = new ECashRPC(
  host, // your eCash node e.g. 'https://hostname.blah'
  username, // as per your node's bitcoin.conf
  password, // as per your node's bitcoin.conf
  port, // as per your node's default port
  timeout, // timeout is 3000 by default
  debugging // debugging is true by default, false makes the library silent and requires try/catch on the app level.
);

```

```
 let info = await xecNode.getAvalancheInfo();

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
 p = Promise.resolve(xecNode.getAvalancheInfo());
 p.then(info=>{
    console.log(info);
 })
```

## Available Methods

There is only selected RPC coverage at the moment. Please submit a PR if you'd like to
have a specific RPC method added.

`addAvalancheNode` `buildAvalancheProof` `decodeAvalancheDelegation` `decodeAvalancheProof` `delegateAvalancheProof` `getAvalancheInfo` 
`getAvalancheKey`  `getAvalanchePeerInfo` `getRawAvalancheProof` 
`isFinalBlock` `isFinalTransaction` `sendAvalancheProof` 
`verifyavalanchedelegation` `verifyAvalancheProof`

`getBlockchainInfo` `getBlockCount` `getWalletInfo` `getUnconfirmedBalance` `getBalance` `getBlockCount` `getWalletInfo` `getBlockHash` `setTxFee` 
`getBlock` `getTxOut` `listTransactions` `listUnspent` `getTransaction`
`getRawTransaction` `getRawMempool` `signRawTransaction` 
`sendRawTransaction` `decodeRawTransaction` `getTxoutProof`

## Troubleshooting

#### Common errors: 
- **Connection timeout:** your app is failing to communicate with your node. Check firewall settings and node configuration whitelists.
- **Network errors:** these errors can be misleading - in most cases your app is connecting to your node however is likely failing authentication. Check your RPC authentication parameters or your reverse proxy server settings.
- **CORS Policy errors:** your app is encountering Cross-Origin Resource Sharing restrictions e.g. you may be using your local dev instance on http://localhost:3000 to connect to your eCash node on a separate host (https://someip:someport) See [this article](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [nginx's headers module](http://nginx.org/en/docs/http/ngx_http_headers_module.html) on how to address this.

## Compatible Node Implementations

You must be running a Node (Pruned mode is fine)

[Bitcoin ABC](https://www.bitcoinabc.org/)

### Tested on Node v16.17.0, NPM v8.19.1 and Bitcoin ABC 0.26.1
