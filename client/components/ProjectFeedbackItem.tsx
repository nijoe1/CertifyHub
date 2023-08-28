import React from 'react';
import Link from 'next/link';

const ProjectFeedbackItem = ({ fromAddress, fromEvent, rating, comment }) => {
  return (
    <div className="bg-blue-100 p-4 rounded mb-4">
      <div className="flex justify-between">
        <h3 className="text-md font-semibold mb-1">Feedback from: {fromAddress}</h3>
        <Link href="/event">
        <p className="text-sm text-gray-500">Event: {fromEvent}</p>
        </Link>
      </div>
      <p className="text-sm text-gray-500">Rating: {rating}/5</p>
      <p className="text-sm text-gray-600 mb-2">Comment: {comment}</p>
    </div>
  );
};

export default ProjectFeedbackItem;