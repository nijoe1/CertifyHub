require("hardhat-deploy");
require("hardhat-deploy-ethers");
const {
    EAS,
    Offchain,
    SchemaEncoder,
    SchemaRegistry,
} = require("@ethereum-attestation-service/eas-sdk");

const { ethers } = require("hardhat");
const { Console } = require("console");

const private_key = network.config.accounts[0];

const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async({ deployments }) => {
    const { deploy } = deployments;
    console.log("Wallet+ Ethereum Address:", wallet.address);

    // const EAS_GOERLI = "0xF46e44C421780c9d30796469D8905D289c426caE";
    // const REGISTRY_GOERLI = "0x8AE85A65525Eb2DA7eFc654ad9D3F372b23Bfc5e";

    // const SchemaRegistry = await hre.ethers.getContractFactory("SchemaRegistry");
    // const schemaRegistry = await SchemaRegistry.deploy();
    // await schemaRegistry.deployed();

    // console.log("schemaRegistry Address=> ", schemaRegistry.address);

    // const EAS = await hre.ethers.getContractFactory("EAS");

    // const eas = await EAS.deploy(
    //     schemaRegistry.address
    // );
    // await eas.deployed();

    // console.log("eas Address=> ", eas.address);

    // const EASInstance = await EAS.attach(
    //     eas.address
    // );

};