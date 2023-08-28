import React from "react";
import { Button } from "@material-tailwind/react";
import EthereumAddress from "./EthereumAddress";

const HypercertProfile = ({ hypercert }) => {
  const { name, description, image, contributors, external_url, hypercert: hc } = hypercert;

  return (
    <div className="grid place-items-center py-8 overflow-y-auto">
      <div className="w-3/4 max-w-xl text-center">
        {/* Image */}
        <div className="flex justify-center items-center mb-4" >
          <img
            src={image}
            alt="Hypercert Image"
            className="w-1/2 h-auto" // Set the width to 50% and height auto
            style={{
              maxWidth: '50%',   // Optional: You can use inline style to set max width
              height: 'auto',    // Optional: You can set height to auto
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
          className="block text-blue-600 hover:underline mt-4"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default HypercertProfile;
