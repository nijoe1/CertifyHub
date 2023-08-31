import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import { getData, getUserProjects } from "../lib/operator/index";
import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import { CONTRACTS } from "@/constants/contracts";

const RegisterPage = () => {
  const { address } = useAccount();
  const [projectIDs, setProjectIDs] = useState([]);
  const [metadata, setMetadata] = useState([]);

  useEffect(() => {
    async function fetchHypercert() {
      let tokens = [];
      let metadataArray = [];
      const hypercertIdsData = await getUserProjects(address);
      console.log(hypercertIdsData);
      // for(const hypercertID of hypercertIdsData.claims){
      //     console.log(hypercertID.tokenID)
      //     tokens.push(hypercertID.tokenID)
      //     const data = await getData(hypercertID?.uri);
      //     metadataArray.push(data)
      // }

      // setProjectIDs(names)
      // setMetadata(metadataArray)
      // const metadata = await getData(hypercertIdsData?.metadataUri);
      //         metadata.hypercert.categories = registeredCategories;

      // console.log(metadata)
    }
    fetchHypercert();
  }, [address]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-9">
        <h1 className="text-2xl font-semibold ">Your Projects</h1>
      </div>

      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
