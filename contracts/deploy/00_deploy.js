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

    // paymentSplitter_X_Drips Address=>  0x0e572fd19f17c93408404F39e2c955F16DAd5027
    // factory Address=>  0x6609E5C85935b0139370300f9805d5acE8b39f98
    // tableland Address=>  0xAA1AAE87Df6e6889ace9eaE64180559dAF58bf48
    // tablelandVerifiers Address=>  0x1397334c29b25f3aBe0c624786AA56d30817DBC6
    // verifiersRegistry Address=>  0xE9cc9F27d90D0089e503162F010Cb885E4D81571
    // fundTheGoods Address=>  0x5116b711D200e366b656f623cB2Ea1F829C7792f

    // AddresDriver Address => 0x70E1E1437AeFe8024B6780C94490662b45C3B567

    const PaymentSplitter_X_Drips = await hre.ethers.getContractFactory("PaymentSplitter_X_Drips");
    const paymentSplitter_X_Drips = await PaymentSplitter_X_Drips.deploy("0x70E1E1437AeFe8024B6780C94490662b45C3B567");
    await paymentSplitter_X_Drips.deployed();
        console.log("paymentSplitter_X_Drips Address=> ", paymentSplitter_X_Drips.address);

    const Factory = await hre.ethers.getContractFactory("Factory");
    const factory = await Factory.deploy(paymentSplitter_X_Drips.address);
    await factory.deployed();
    console.log("factory Address=> ", factory.address);

    let FactoryInstance = Factory.attach(factory.address)

    let tx = await FactoryInstance.createSplitter([wallet.address],[100])
    await tx.wait()

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

    const tablelandAddress = "0x11911136E9bA5579eAC69B2e812db3bC42033726";
    const tablelandVerifiersAddress =
        "0x5e62cd517dbf8C90eD4014e541e7d7018b1c69bc";
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
        factory.address
    );

    await fundTheGoods.deployed();

    console.log("fundTheGoods Address=> ", fundTheGoods.address);

    transferOwnership = await instance.transferOwnership(fundTheGoods.address);
    await transferOwnership.wait();
    console.log("transfered to fundTheGoods");

    const FundTheGoodsAddress = "0xb8AB020E5F82178F1d6E3E5F34a928A29E6bb4AC"
    const verifiersRegistryAddress = "0x02F114CF2C25Ea0029416dD5AEeb3F9Eb69d45f8"

};