import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout";
import Footer from "@/components/Footer";
import HypercertCard from "@/components/HypercertCard";
import {
  getData,
  getClaims,
  getRegisteredProjects,
  getCategories,
} from "../lib/operator/index";
import { Input, Select, Option } from "@material-tailwind/react";

type ProjectsProps = {
  hypercerts: Array<any>;
};

const Projects = () => {
  const [hypercerts, setHypercerts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [categoriesSetted, setCategoriesSetted] = useState(false)

  const handleSearchInputChange = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleCategoryChange = (value: any) => {
    setSelectedCategory(value);
  };

  useEffect(() => {
    async function fetchHypercerts() {
      const hypercertIdsData = await getRegisteredProjects(selectedCategory);
      if(!categoriesSetted){
        const cats = await getCategories();
        setCategories(cats);
        setCategoriesSetted(true)
      }

      const hypercertList = [];

      for (const Hypercert of hypercertIdsData) {
        const id =
          "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-" +
          Hypercert?.claimID?.toString();
        const claimTokens = await getClaims(id);
        const metadataUri = claimTokens?.claimTokens[0]?.claim?.uri;
        const metadata = await getData(metadataUri);
        metadata.hypercert.categories = Hypercert?.categories.map(
          (item: any) => item.category
        );
        metadata.id = id ? id : undefined;

        hypercertList.push(metadata);
      }
      if (hypercertList) {
        // @ts-ignore
        setHypercerts(hypercertList);
      }
    }

    fetchHypercerts();
  }, [selectedCategory,categoriesSetted]);


  const categoryOptions = [
    { value: "All Categories", label: "All Categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-4">Projects Page</h1>

        <div className="flex flex-col md:flex-row md:items-center ml-8 mr-8 mb-8">
          <div className="md:flex md:items-center">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className="w-full md:w-96 py-3"
            />
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full md:w-96 py-5"
            >
              {categoryOptions.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  // @ts-ignore
                  style={{
                    cursor: "pointer",
                    // @ts-ignore
                    ":hover": { backgroundColor: "#e2e8f0" },
                  }}
                >
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 mx-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-50">
          {hypercerts.map((hypercert) => (
            <HypercertCard
              // @ts-ignore
              key={hypercert.id}
              hypercert={hypercert}
              // @ts-ignore
              onDetailsClick={undefined}
            />
          ))}
        </div>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Projects;
