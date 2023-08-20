import Image from "next/image";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer"; // Import the Footer component

import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/utils/config";
import { Inter } from "next/font/google";
import Link from "next/link";
import ClaimTokensComponent from "../components/claimTokens";
import { useAccount } from "wagmi";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useAccount();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;

  const links = [
    {
      title: "Next.js",
      description:
        "Seamlessly integrate your decentralized application with Next.js, a popular React-based framework.",
      href: "https://nextjs.org",
    },
    {
      title: "CO2.Storage",
      description: "A powerful and easy-to-use wallet Ethereum-based dApps.",
      href: "https://www.rainbowkit.com",
    },
    {
      title: "Hypercerts",
      description:
        "wagmi is a collection of React Hooks containing everything you need to start working with Ethereum.",
      href: "https://wagmi.sh",
    },
    {
      title: "Examples",
      description:
        "Start by exploring some pre-built examples to inspire your creativity!",
      href: `${origin}/examples`,
    },
  ];
  return (
    <div className={`flex flex-col min-h-screen ${inter.className}`}>
      <Navbar />
      <main className="flex flex-col items-center justify-between p-24">
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left mt-24 lg:mt-0">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                {link.title}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {link.description}
              </p>
            </Link>
          ))}
        </div>
        {/* Add ClaimTokensComponent if needed */}
      </main>
	  <div className="flex-grow"></div> {/* Empty block to push the footer */}
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}
