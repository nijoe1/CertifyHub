import React from 'react';
import EthereumAddress from './EthereumAddress';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Rating,
} from "@material-tailwind/react";
import { useRouter } from 'next/router';

export default function HypercertCard({ hypercert, onDetailsClick }) {
  const { id, name, description, image, external_url, hypercert: hc } = hypercert;
  const router = useRouter();

  const maxDescriptionLength = 40; // Maximum description length

  const truncatedDescription =
    description.length > maxDescriptionLength
      ? `${description.substring(0, maxDescriptionLength)}...`
      : description;

  const handleDetailsClick = () => {
    // Redirect to the Hypercert page with the Hypercert ID as a query parameter
    router.push(`/project?id=${id}`);
  };

  return (
    <Card className="mt-6 w-96 mx-auto">
      <img
        src={image}
        alt="card-image"
        className="object-cover mt-4 h-full w-full"
      />
      <CardBody>
        <strong>Name:</strong>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        <strong>Description:</strong>
        <Typography color="gray">
          {truncatedDescription}
        </Typography>
        <div className="mt-2 flex items-center">
          <strong className="mr-2">Rating:</strong>
          <Rating value={4} size="sm" readonly />
        </div>
        <div className="mt-2">
          <Typography>
            <strong>Contributors:</strong>
          </Typography>
          <ul className="list-disc ml-6">
            {hc.contributors.value.map((contributor, index) => (
              <li key={index}>
                <EthereumAddress address={contributor} />
              </li>
            ))}
          </ul>
          <Typography>
            <strong>Rights:</strong> {hc.rights.display_value}
          </Typography>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <a
          href={external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 hover:underline mt-0"
        >
          Learn More
        </a>
        <Button
          onClick={handleDetailsClick}
          className="mt-2 w-full"
          color="blue"
          ripple="light"
        >
          Check More
        </Button>
      </CardFooter>
    </Card>
  );
}
