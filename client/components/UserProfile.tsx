import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchEnsName } from "@wagmi/core";
import { getProfile } from "@/lib/operator/index";

const UserProfile = () => {
  const { address } = useAccount();
  const [ens, setEns] = useState(undefined);

  const [profileData, setProfileData] = useState({
    name: "Name",
    title: "Web Developer",
    image:
      "https://gateway.lighthouse.storage/ipfs/QmbWt4Fyggz6dWEvvGFW6TjSSyL4TLo2FfBKmC7MWD1r6n",
    github: "https://github.com",
    twitter: "https://twitter.com",
  });

  useEffect(() => {
    async function fetchHypercerts() {
      let resolvedAddress = await fetchEnsName({
        address: address as `0x{string}`,
      });

      if (resolvedAddress) {
        // @ts-ignore
        setEns(resolvedAddress);
      }
      if (ens) {
        console.log("Dfd");
        setProfileData(await getProfile(ens));
        console.log(profileData);
      }
    }

    fetchHypercerts();
  }, [ens]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
        <div className="flex items-center justify-center mb-4">
          <img
            src={profileData.image}
            alt="User Profile"
            className="w-40 h-40 rounded-full"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">{ens}</h2>
          <p className="text-gray-600 mb-2">{profileData.title}</p>
          <div className="flex justify-center space-x-2">
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
            <a
              href={profileData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitter
            </a>
          </div>
          <div className="flex justify-center space-x-2">
            {ens ? (
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Update Profile
              </button>
            ) : (
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                RegisterENS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
