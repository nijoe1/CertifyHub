import { Address } from "viem";
import fundTheCommonsAbi from "../abi/fundTheCommonsAbi.json";
import verifierRegistryAbi from "../abi/verifierRegistryAbi.json";

export const CONTRACTS = {
  fundTheCommons: {
    5: {
      contract: "0x17A61dd87dD725C16BA7681b94904789FA870a02" as Address,
      abi: fundTheCommonsAbi,
    },
  },
  verifierRegistry: {
    5: {
      contract: "0xa83Ce42F9572972EcE795874102322c67a6BbB36" as Address,
      abi: verifierRegistryAbi,
    },
  },
};
