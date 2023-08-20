import React from 'react';
import EthereumAddress from './EthereumAddress';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useRouter } from 'next/router';


export default function HypercertCard({ hypercert, onDetailsClick }) {
  const { id, name, description, image, external_url, hypercert: hc } = hypercert;
  const router = useRouter();

  const handleDetailsClick = () => {
    // Redirect to the Hypercert page with the Hypercert ID as a query parameter
    router.push(`/project?id=${id}`);
  };
  return (
    <Card className="mt-6 w-96">
      <div className="h-110 mt-6">
        <img
          src={image}
          alt="card-image"
          className="object-cover h-full w-full"
        />
            </div>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        <Typography color="gray">
          {description}
        </Typography>
        <div className="mt-4">
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
          className="block text-blue-600 hover:underline mt-2"
        >
          Learn More
        </a>
        <Button
          onClick={handleDetailsClick}
          className="mt-4"
          color="blue"
          ripple="light"
        >
          Check More
        </Button>
      </CardFooter>
    </Card>
  );
}
