import React from "react";
import { Button } from "@material-tailwind/react";
import EthereumAddress from "./EthereumAddress";

const HypercertProfile = ({ hypercert }) => {
  const { name, description, image, contributors, external_url, hypercert: hc } = hypercert;

  return (
    <div className="flex flex-col items-center py-8">
      {/* Image */}
      <img src={image} alt="Hypercert Image" className="w-70 h-48  mb-4" />

      {/* Hypercert Name */}
      <h2 className="text-2xl font-semibold text-blue-600 mb-2">{name}</h2>

      {/* Hypercert Description */}
      <p className="text-gray-800 mb-4 text-center">{description}</p>

      {/* Contributors */}
      <div className="grid gap-2 mb-4">
        {hc.contributors.value.map((contributor, index) => (
          <EthereumAddress key={index} address={contributor} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button color="blue" ripple="light" onClick={() => console.log("Provide Feedback clicked")}>
          Provide Feedback
        </Button>
        <Button color="green" ripple="light" onClick={() => console.log("Fund Project clicked")}>
          Fund Project!
        </Button>
      </div>

      {/* External URL */}
      <a
        href={external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-blue-600 hover:underline mt-2"
      >
        Learn More
      </a>
    </div>
  );
};

export default HypercertProfile;
