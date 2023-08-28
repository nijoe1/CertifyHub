import {
    EAS,
    Offchain,
    createOffchainURL,
    SchemaEncoder,
    SchemaRegistry,
    ZERO_ADDRESS
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

export const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Sepolia v0.26

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = new ethers.JsonRpcProvider("https://opt-goerli.g.alchemy.com/v2/Qs0oArxRd6ljm5ELdIzJ1qHhbvbjndSu");

// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
eas.connect(provider);

const signer = new ethers.Wallet(
    "304030045e69a283fbc39a3f1b7b281ede03afdefa6f480a682e8974bc20b547",
    provider
);

const schemaRegistryContractAddress = "0x4200000000000000000000000000000000000020";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

schemaRegistry.connect(signer);

const schema = "uint256 eventId, uint8 voteIndex";
const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
const revocable = true;

// const transaction = await schemaRegistry.register({
//     schema,
//     ZERO_ADDRESS,
//     revocable,
// });

// // Optional: Wait for transaction to be validated
// console.log(await transaction.wait());

const offchain = await eas.getOffchain();

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
const encodedData = schemaEncoder.encodeData([
    { name: "eventId", value: 1, type: "uint256" },

    { name: "voteIndex", value: 1, type: "uint8" },
]);

// Signer is an ethers.js Signer instance

const offchainAttestation = await offchain.signOffchainAttestation({
        recipient: ZERO_ADDRESS,
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: BigInt(Math.floor(Date.now() / 1000)),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        version: 1,
        nonce: 0,
        schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
    },
    signer
);

console.log(offchainAttestation);


const easscanAttestationUrl =
    'https://optimism-goerli-bedrock.easscan.org' +
    createOffchainURL({
        sig: offchainAttestation,
        signer: signer.address,
    });
// private by default, share the object

// const tx = await eas.timestamp(offchainAttestation?.uid);
// const timestampResults = await tx.wait();

// const etherscanTxUrl = etherscanUrl + '/address/';
// console.log('timestampResults', timestampResults, tx);

// need to force chainId to be number otherwise signature failed at UI
const verifyResults = await offchain.verifyOffchainAttestationSignature(
    signer.address,
    offchainAttestation
);

// potentially payload issue for Signature check failed
console.log('verify signature', verifyResults);
console.log({
    // etherscanTxUrl,
    easscanAttestationUrl,
});