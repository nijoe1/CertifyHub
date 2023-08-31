import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import the Link component
import { getFunders } from "@/lib/operator/index"; // Import the API function to fetch funders data
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import { randomBytes } from "crypto";
interface Funder {
  company: string;
  description: string;
  image: string;
  // ... other properties
}
const FundersPage = () => {
  const [funders, setFunders] = useState<Funder[]>([]);

  useEffect(() => {
    // Fetch funders data from your API or source
    async function fetch() {
      const fetchedFunders = await getFunders(); // Replace with your API call
      console.log(fetchedFunders);
      setFunders(fetchedFunders);
    }
    if (!funders) {
      fetch();
    }
  }, [funders]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Include the Navbar component */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Funders</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {funders &&
            (funders as any[]).map((funder) => (
              <li
                key={funder?.company + randomBytes}
                className="bg-white rounded-lg shadow-md p-4"
              >
                {/* <Link href={`/company/${funder.company}`}> */}
                <Link href={`/Funder?name=${funder.company}`}>
                  <p className="block text-xl font-semibold mb-2 hover:underline">
                    {funder.company}
                  </p>
                </Link>
                <p className="text-gray-600">{funder.description}</p>
                <img
                  src={funder.image}
                  alt={funder.company}
                  className="mt-4 rounded-lg w-full"
                />
              </li>
            ))}
        </ul>
      </div>
      <div className="flex-grow"></div>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default FundersPage;
