import React, { useState } from 'react';

type FeedbackModalProps = {
  project: any; // You should replace 'any' with the actual type of your project
  onClose: () => void;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ project, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(1); // Default rating to 1

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Handle feedback submission, e.g., send feedback to server

    // Clear form inputs
    setName('');
    setDescription('');
    setRating(1);

    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Leave Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              // @ts-ignore
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <input
              type="number"
              id="rating"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={rating}
              min="1"
              max="5"
              onChange={handleRatingChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button
              type="button"
              className="ml-2 text-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;