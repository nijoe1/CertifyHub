import { Address } from "viem";
import fundTheCommonsAbi from "../abi/fundTheCommonsAbi.json";
import verifierRegistryAbi from "../abi/verifierRegistryAbi.json"

//get the chains id from the env
//optmisticTestnet = 420
//base = 84531

export const CONTRACTS = {
  fundTheCommons: {
    5: {
      contract: "0x19C30fE810723Ad71E2F11A9Cd9d38417035f29B" as Address,
      abi: fundTheCommonsAbi,
    },
  },
  verifierRegistry:{
    5: {
      contract: "0xAC0FDaC7Bd983B5696791A335395dfD176CF865c" as Address,
      abi: verifierRegistryAbi
    }
  }
};