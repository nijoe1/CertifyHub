import React from 'react';
import { Navbar } from '@/components/layout';
import Footer from '@/components/Footer';
import Link from "next/link"; // Import the Link component

// Sample data for the company and its events
const companyData = {
  companyName: 'Company XYZ',
  image: 'company-image-url',
  description: 'This is a sample company description.',
  admin: 'Admin Address',
};

const eventsData = [
  {
    companyNameHost: 'Company XYZ',
    eventID: 'event-1',
    cid: 'event-metadata-cid-1',
    startTime: 'Start Time 1',
    endTime: 'End Time 1',
    verifiers: [
      'Verifier Address 1',
      'Verifier Address 2',
      // ... more verifiers
    ],
  },
  {
    companyNameHost: 'Company XYZ',
    eventID: 'event-2',
    cid: 'event-metadata-cid-2',
    startTime: 'Start Time 2',
    endTime: 'End Time 2',
    verifiers: [
      'Verifier Address 3',
      'Verifier Address 4',
      // ... more verifiers
    ],
  },
  // ... more events
];

function CompanyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Render the Navbar component */}
    <div className="flex flex-col items-center justify-center ">
         <div className="container mx-auto py-8">
      {/* Company Profile Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">{companyData.companyName}</h1>
        <img src={companyData.image} alt="Company Logo" className="w-32  mb-2" />
        <p className="text-gray-600 mb-4">{companyData.description}</p>
        <p className="text-gray-500">Admin: {companyData.admin}</p>
      </div>

      {/* Events Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Events</h2>
        {eventsData.map((event) => (
          <div key={event.eventID} className="bg-blue-100 p-4 rounded mb-4">
             <Link href={`/event`}>
                <h3 className="text-md font-semibold mb-1">{event.eventID}</h3>
                  </Link>
            <p className="text-sm text-gray-600 mb-2">
              Start Time: {event.startTime} - End Time: {event.endTime}
            </p>
            <h4 className="text-sm font-semibold mb-1">Verifiers:</h4>
            <ul className="pl-4">
              {event.verifiers.map((verifier, index) => (
                <li key={index} className="text-xs text-gray-500">{verifier}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </div>
    <div className="flex-grow"></div>
          <Footer /> {/* Render the Footer component */}
          </div>
   
  );
}

export default CompanyPage;


