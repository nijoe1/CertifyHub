import React, { useState } from 'react';

const AttestationForm = ({ onAttestTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskFile, setTaskFile] = useState(null);

  const handleAttestTask = () => {
    // Do something with the task details and file
    onAttestTask({
      taskName,
      taskDescription,
      taskFile,
    });
    // Clear form fields after attesting
    setTaskName('');
    setTaskDescription('');
    setTaskFile(null);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setTaskFile(e.target.files[0])}
      />
      <button onClick={handleAttestTask}>Attest Task</button>
    </div>
  );
};

export default AttestationForm;
