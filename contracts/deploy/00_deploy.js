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

    const Tableland = await hre.ethers.getContractFactory("Tableland");
    const tableland = await Tableland.deploy();
    await tableland.deployed();

    console.log("tableland Address=> ", tableland.address);


    const TablelandVerifiers = await hre.ethers.getContractFactory(
        "TablelandVerifiers"
    );
    const tablelandVerifiers = await TablelandVerifiers.deploy();
    await tablelandVerifiers.deployed();

    console.log("tablelandVerifiers Address=> ", tablelandVerifiers.address);


    // tableland Address => 0xf5b9c85F82Dc5BD8412e8C44FDbcc322774eF2C2
    // tablelandVerifiers Address => 0xeAceE940B3dBF549c743fFFFC96Bf0F8A1551C0B
    // verifiersRegistry Address => 0x03190FF1CE6f978Ae72C7695590E10C8a639C11E
    // transfered to verifiersRegistry
    // fundTheGoods Address => 0xf53380a7a622a2A5ef2b054b5079fE63e1E042d8

    const tablelandAddress = "0x11911136E9bA5579eAC69B2e812db3bC42033726";
    const tablelandVerifiersAddress =
        "0x5e62cd517dbf8C90eD4014e541e7d7018b1c69bc";
    const EAS_GOERLI = "0xF46e44C421780c9d30796469D8905D289c426caE";
    const REGISTRY_GOERLI = "0x8AE85A65525Eb2DA7eFc654ad9D3F372b23Bfc5e";
    const SPLITTERIMPLEMENTATION = "0x4616fC6060D6d6176F49Edc6bb6975197F0D2e4A";
    const THIRDWEBFACTORY = "0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0";
    const HYPERCERT = "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07";

    const instance = Tableland.attach(tableland.address);
    const TablelandVerifiersInstance = TablelandVerifiers.attach(
        tablelandVerifiers.address
    );







    const VerifiersRegistry = await hre.ethers.getContractFactory(
        "VerifiersRegistry"
    );
    const verifiersRegistry = await VerifiersRegistry.deploy(
        tablelandVerifiers.address
    );
    await verifiersRegistry.deployed();

    console.log("verifiersRegistry Address=> ", verifiersRegistry.address);

    let transferOwnership = await TablelandVerifiersInstance.transferOwnership(
        verifiersRegistry.address
    );
    await transferOwnership.wait();

    console.log("transfered to verifiersRegistry");

    const FundTheGoods = await hre.ethers.getContractFactory("CertifyHub");
    const fundTheGoods = await FundTheGoods.deploy(
        verifiersRegistry.address,
        HYPERCERT,
        tableland.address,
        THIRDWEBFACTORY,
        SPLITTERIMPLEMENTATION,
        EAS_GOERLI
    );

    await fundTheGoods.deployed();

    console.log("fundTheGoods Address=> ", fundTheGoods.address);

    transferOwnership = await instance.transferOwnership(fundTheGoods.address);
    await transferOwnership.wait();
    console.log("transfered to fundTheGoods");

    const FundTheGoodsAddress = "0xb8AB020E5F82178F1d6E3E5F34a928A29E6bb4AC"
    const verifiersRegistryAddress = "0x02F114CF2C25Ea0029416dD5AEeb3F9Eb69d45f8"

};