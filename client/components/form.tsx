import React, { useState } from "react";
 

interface HypercertFormData {
    name: string;
    description: string;
    external_url: string;
    image: string;
    version: string;
    ref: string;
    allowList: string;
    properties: Array<{ trait_type: string; value: string }>;
    // Add other properties here
  }
  
  interface HypercertFormProps {
    onSubmit: (formData: HypercertFormData) => void;
  }
  
  const HypercertForm: React.FC<HypercertFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<HypercertFormData>({
      name: "",
      description: "",
      external_url: "",
      image: "",
      version: "",
      ref: "",
      allowList: "",
      properties: [],
      // Initialize other properties here
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handlePropertiesChange = (index: number, field: keyof typeof formData.properties[0], value: string) => {
      const updatedProperties = [...formData.properties];
      updatedProperties[index] = { ...updatedProperties[index], [field]: value };
      setFormData((prevData) => ({ ...prevData, properties: updatedProperties }));
    };
  
    const handleClick = () => {
      if (validate(formData)) {
        onSubmit(formData);
      } else {
        console.log("Form data is not valid.");
      }
    };
  
    const validate = (data: HypercertFormData) => {
      // Perform validation logic here
      return true; // Return true if validation passes, false otherwise
    };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Create Hypercert</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          name="name"
          type="text"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          rows={4}
          placeholder="Enter description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="external_url">External URL</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="external_url"
          name="external_url"
          type="url"
          placeholder="Enter external URL"
          value={formData.external_url}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="image"
          name="image"
          type="url"
          placeholder="Enter image URL"
          value={formData.image}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="version">Version</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="version"
          name="version"
          type="text"
          placeholder="Enter version"
          value={formData.version}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ref">Ref</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="ref"
          name="ref"
          type="text"
          placeholder="Enter ref"
          value={formData.ref}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allowList">Allow List</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="allowList"
          name="allowList"
          type="text"
          placeholder="Enter allow list"
          value={formData.allowList}
          onChange={handleChange}
        />
      </div>

      {formData.properties.map((property, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Property {index + 1}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Trait Type"
              value={property.trait_type}
              onChange={(e) => handlePropertiesChange(index, "trait_type", e.target.value)}
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Value"
              value={property.value}
              onChange={(e) => handlePropertiesChange(index, "value", e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleClick}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export { HypercertForm };    export type { HypercertFormData };

