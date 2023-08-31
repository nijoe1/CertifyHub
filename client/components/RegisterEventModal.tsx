import React, { useState } from "react";
type RegisterEventModalProps = {
  onClose: () => void;
  onRegister: (eventData: any) => void; // Replace 'any' with the actual type of your event data
};

const RegisterEventModal: React.FC<RegisterEventModalProps> = ({
  onClose,
  onRegister,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEventType(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // @ts-ignore

    setEventImage(file);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // @ts-ignore
        const base64Data = event.target.result.split(",")[1];
        setFileBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = () => {
    const eventData = {
      name: eventName,
      description: eventDescription,
      type: eventType,
      fileBase64,
    };
    onRegister(eventData);
    setEventName("");
    setEventDescription("");
    setEventType("");
    setEventImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Register Event</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Event Description
            </label>
            <textarea
              id="eventDescription"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              // @ts-ignore
              rows="3"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventType"
              className="block text-sm font-medium text-gray-700"
            >
              Event Type
            </label>
            <select
              id="eventType"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              value={eventType}
              onChange={handleEventTypeChange}
              required
            >
              <option value="" disabled>
                Select an event type
              </option>
              <option value="dataValidation">Data Validation</option>
              <option value="grants">Grants</option>
              <option value="hackathon">Hackathon</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              File Upload
            </label>
            <input
              type="file"
              id="file"
              className="mt-1 px-3 py-2 border rounded-md w-full"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRegister}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Register
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

export default RegisterEventModal;
