import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import FeedbackModal from '@/components/FeedbackModal';
import Link from "next/link"; // Import the Link component

const EventPage = () => {
  // Mock event data
  const event = {
    name: 'Sample Event',
    description: 'This is a sample event description.',
    image: '/path/to/event-image.jpg',
    projects: [
      {
        id: '0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-29604565922121646321313590846563834396672',
        name: 'Project 1',
        description: 'This is the description of Project 1.',
        rating: 4.5,
      },
      // Add more project data
    ],
  };

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleLeaveFeedback = (project) => {
    setSelectedProject(project);
    setFeedbackModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
    setFeedbackModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">{event.name}</h1>
        <img src={event.image} alt="Event Image" className="mb-4" />
        <p className="text-gray-600 mb-6">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.projects.map((project) => (
            <div key={project.id} className="bg-blue-100 p-4 rounded">
              <h3 className="text-md font-semibold mb-1">
                <a
                  href={`/project?id=${encodeURIComponent(project.id)}`}
                  className="text-blue-500 hover:underline"
                >
                  {project.name}
                </a>
              </h3>
              <p className="text-sm text-gray-600 mb-2">{project.description}</p>
              <p className="text-sm text-gray-500">Rating: {project.rating}</p>
              <button
                onClick={() => handleLeaveFeedback(project)}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
              >
                Leave Feedback
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow"></div>

      <Footer />

      {feedbackModalOpen && (
        <FeedbackModal project={selectedProject} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default EventPage;