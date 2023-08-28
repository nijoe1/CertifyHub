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

    // QUERY PREFIX = https://testnets.tableland.network/api/v1/query?statement=


    const tablelandAddress = "0xf5b9c85F82Dc5BD8412e8C44FDbcc322774eF2C2";
    const tablelandVerifiersAddress =
        "0xeAceE940B3dBF549c743fFFFC96Bf0F8A1551C0B";
    const EAS_GOERLI = "0xF46e44C421780c9d30796469D8905D289c426caE";
    const REGISTRY_GOERLI = "0x8AE85A65525Eb2DA7eFc654ad9D3F372b23Bfc5e";
    const FundTheGoodsAddress = "0xf53380a7a622a2A5ef2b054b5079fE63e1E042d8"
    const verifiersRegistryAddress = "0x03190FF1CE6f978Ae72C7695590E10C8a639C11E"
    const SPLITTERIMPLEMENTATION = "0x4616fC6060D6d6176F49Edc6bb6975197F0D2e4A";
    const THIRDWEBFACTORY = "0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0";
    const HYPERCERT = "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07";

    const VerifiersRegistry = await hre.ethers.getContractFactory(
        "VerifiersRegistry"
    );

    const FundTheGoods = await hre.ethers.getContractFactory("CertifyHub");

    const VerifiersRegistryInstance = VerifiersRegistry.attach(tableland.address);

    const FundTheGoodsInstance = FundTheGoods.attach(
        FundTheGoodsAddress
    );

};