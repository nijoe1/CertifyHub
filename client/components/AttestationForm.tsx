import React, { ChangeEvent, useState } from 'react';
type AttestationFormProps = {
  onClose: () => void; // Specify the type of onClose prop
};
const AttestationForm: React.FC<AttestationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: undefined, // Initialize with undefined
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = event.target.files[0];
    // @ts-ignore
    setFormData((prevData) => ({
      ...prevData,
      file: file || prevData.file, // Update the file property conditionally
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const attestationData = {
      name: formData.name,
      description: formData.description,
      // @ts-ignore
      file: formData?.file ? formData.file.name : '',
    };
    console.log('Attestation Data:', attestationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Attest Completed Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block font-medium mb-1">
              File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Attest
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttestationForm;
