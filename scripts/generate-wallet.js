const { ethers } = require("ethers");

// 创建一个新的随机钱包
const wallet = ethers.Wallet.createRandom();

console.log("地址:", wallet.address);
console.log("私钥:", wallet.privateKey.slice(2)); // 移除 "0x" 前缀
console.log("助记词:", wallet.mnemonic.phrase);
