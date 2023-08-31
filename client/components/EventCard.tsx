import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
type EventProps = {
    event: any; // Specify the type of the 'text' prop
  };
  
const EventCard : React.FC<EventProps> = ({ event }) => {
  return (
    <Card className="mt-6 w-80">
      <CardHeader color="blue-gray" className="relative h-56">
        <img
          src={`data:image/png;base64,${event.fileBase64}`}
          alt="event-image"
          className="object-cover w-full h-full"
        />
      </CardHeader>
      <CardBody>
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-2 font-semibold"
        >
          Name: {event.name}
        </Typography>
        <Typography variant="body2" color="blue-gray" className="mb-2">
          Type: {event.type}
        </Typography>
        <Typography variant="body2" color="blue-gray">
          Description: {event.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button color="blue-gray">
          <a
            href={`/event?id=${event.eventID}`}
            className="cursor-pointer"
            style={{ color: "black" }}
          >
            Event Page
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default EventCard;