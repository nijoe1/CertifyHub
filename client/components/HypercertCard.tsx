import React from "react";
import EthereumAddress from "./EthereumAddress";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Rating,
} from "@material-tailwind/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";

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

type HypercertCardProps = {
  hypercert: Hypercert;
  onDetailsClick: () => void;
};

export default function HypercertCard({
  hypercert,
  onDetailsClick,
}: HypercertCardProps) {
  const {
    id,
    name,
    description,
    image,
    external_url,
    hypercert: hc,
  } = hypercert;
  const router = useRouter();

  const maxDescriptionLength = 40;

  const truncatedDescription =
    description.length > maxDescriptionLength
      ? `${description.substring(0, maxDescriptionLength)}...`
      : description;

  const handleDetailsClick = () => {
    router.push(`/project?id=${id}`);
  };

  const badgeWidth = 100;
  const badgesPerSlide = 3;

  const sliderSettings = {
    // dots should be a boolean (true or false)
    // If you want to show dots, set it to true; otherwise, omit it
    dots: true, // or false
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
  };

  const uniqueCategories = Array.from(new Set(hc.categories.map((c) => c)));
  const uniqueContributors = Array.from(new Set(hc.contributors.value));

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
        <Typography color="gray">{truncatedDescription}</Typography>
        <div className="mt-2 flex items-center">
          <strong className="mr-2">Rating:</strong>
          <Rating value={4} readonly />
        </div>
        <div className="mt-2">
          <Typography>
            <strong>Contributors:</strong>
          </Typography>
          <Slider {...sliderSettings}>
            {uniqueContributors.map((contributor, index) => (
              <EthereumAddress
                key={index}
                address={contributor}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap"
                // @ts-ignore
                style={{
                  width: `${badgeWidth}px`,
                  marginRight: "8px", // Add space between badges
                }}
              />
            ))}
          </Slider>
        </div>
        <div className="mt-2">
          <Typography>
            <strong>Categories:</strong>
          </Typography>
          <Slider {...sliderSettings}>
            {uniqueCategories.map((category, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap"
                style={{
                  width: `${badgeWidth}px`,
                  marginRight: "8px", // Add space between badges
                }}
              >
                {category as string}
              </span>
            ))}
          </Slider>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <a
          href={external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 hover:underline mt-0"
        >
          external url
        </a>
        <Button
          onClick={handleDetailsClick}
          className="mt-2 w-full"
          color="blue"
          ripple // Enable ripple effect by setting it to true
        >
          Check More
        </Button>
      </CardFooter>
    </Card>
  );
}
