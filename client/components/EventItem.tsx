import React from "react";
import Link from "next/link";

type EventProps = {
  name: string; // Specify the type of the 'text' prop
  description: string;
  eventID: string;
  image: string;
};

const EventItem: React.FC<EventProps> = ({
  name,
  description,
  eventID,
  image,
}) => {
  return (
    <div className="bg-blue-100 p-4 rounded mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="text-md font-semibold mb-1">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <Link href={`/event?id=${eventID}`}>
          <p className="text-blue-500 hover:underline">View Event Details</p>
        </Link>
      </div>
    </div>
  );
};

export default EventItem;
