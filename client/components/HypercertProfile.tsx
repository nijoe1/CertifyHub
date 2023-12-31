import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import EthereumAddress from "./EthereumAddress";
import { useAccount } from "wagmi";
import FeedbackModal from "@/components/FeedbackModal";
import FundModal from "@/components/FundModal";
import AttestationForm from "@/components/AttestationForm";
import { getProjectSplitter } from "@/lib/operator/index";

type Hypercert = {
  id: string;
  name: string;
  description: string;
  image: string;
  external_url: string;
  hypercert: {
    contributors: {
      value: string[];
    };
    categories: string[];
  };
};

type HypercertProfileProps = {
  hypercert: Hypercert;
  isOwner: boolean;
};

const HypercertProfile: React.FC<HypercertProfileProps> = ({
  hypercert,
  isOwner,
}) => {
  const {
    name,
    description,
    image,
    id,
    external_url,
    hypercert: hc,
  } = hypercert;
  const { address } = useAccount();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [attestModalOpen, setAttestModalOpen] = useState(false);
  const [splitter, setSplitter] = useState([{getSplitterAddress:""}]);
  const [spli,setSplit] =useState("")

  const handleLeaveFeedback = (project: any) => {
    setFeedbackModalOpen(true);
  };

  const handleFund = (project: any) => {
    setFundModalOpen(true);
  };

  const handleAttestButtonClick = () => {
    setAttestModalOpen(true);
  };

  const getSplitterAddress = async (projectID: any) => {
    const splitter = await getProjectSplitter(projectID);
    console.log(splitter);
    return splitter;
  };


  useEffect(() => {
    async function fetchHypercerts() {
      let temp = await getSplitterAddress(
        id.replace("0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-", "")
      );
      console.log(temp);
      setSplitter(temp);
      setSplit(temp[0]?.splitterAddress)
    }
    if (splitter.length == 0) {
      fetchHypercerts();
    }
  }, [splitter]);

  return (
    <div className="grid place-items-center py-8 overflow-y-auto">
      <div className="w-3/4 max-w-xl text-center">
        {/* Image */}
        <div className="flex justify-center items-center mb-4">
          <img
            src={image}
            alt="Hypercert Image"
            className="w-1/2 h-auto" // Set the width to 50% and height auto
            style={{
              maxWidth: "50%", // Optional: You can use inline style to set max width
              height: "auto", // Optional: You can set height to auto
            }}
          />
        </div>

        {/* Hypercert Name */}
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">{name}</h2>

        {/* Hypercert Description */}
        <div className="max-h-48 overflow-y-auto">
          <p className="text-gray-800 mx-auto">{description}</p>
        </div>

        {/* Contributors */}
        <div className="grid gap-2 mt-4">
          {hc.contributors.value.slice(0, 4).map((contributor, index) => (
            <div key={index} className="flex justify-center">
              <span className="text-gray-500 mr-1">Founder:</span>
              <EthereumAddress address={contributor} />
            </div>
          ))}
          {hc.contributors.value.length > 4 && (
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">...</span>
              <span className="text-gray-500">(and more)</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <Button color="blue" onClick={() => handleLeaveFeedback(id)}>
            Provide Feedback
          </Button>
          <Button color="green" onClick={() => handleFund(id)}>
            Fund Project!
          </Button>
          {isOwner && (
            <Button color="green" onClick={() => handleAttestButtonClick()}>
              attest update
            </Button>
          )}
        </div>

        {/* External URL */}
        <a
          href={external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 hover:underline mt-4"
        >
          external url
        </a>
      </div>
      {feedbackModalOpen && (
        <FeedbackModal
          project={id.replace(
            "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-",
            ""
          )}
          onClose={() => setFeedbackModalOpen(false)}
        />
      )}
      {fundModalOpen && (
        <FundModal
          project={id.replace(
            "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-",
            ""
          )}
          split={spli}
          onClose={() => setFundModalOpen(false)}
        />
      )}
      {/* Attest Modal */}
      {attestModalOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <AttestationForm
            onClose={() => setAttestModalOpen(false)}
            // Pass necessary props to the attest modal component
          />
        </div>
      )}
    </div>
  );
};

export default HypercertProfile;
