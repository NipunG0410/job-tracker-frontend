import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import Modal from './Modal';
import JobForm from './JobForm';

const Dashboard = () => {
  // State for the main data
  const [jobs, setJobs] = useState([]);
  // NEW: State for loading and error messages
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // Holds the job being edited

  const columnOrder = ['Opportunities', 'Applied', 'Applied with Referral', 'Hiring Managers', 'Archived'];

  // Fetch initial data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await axios.get('${process.env.REACT_APP_API_URL}/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('Failed to fetch jobs. Please try refreshing the page.');
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- Modal Handlers ---
  const openAddModal = () => {
    setEditingJob(null); // Make sure we're not in edit mode
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  // --- CRUD Handlers ---
  const handleFormSubmit = async (formData) => {
    const jobData = { ...formData };
    if (editingJob) {
      // --- UPDATE LOGIC ---
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/jobs/${editingJob._id}`, jobData);
        setJobs(jobs.map(job => job._id === editingJob._id ? response.data : job));
      } catch (err) {
        console.error("Error updating job:", err);
        alert("Failed to update job.");
      }
    } else {
      // --- CREATE LOGIC ---
      try {
        const response = await axios.post('${process.env.REACT_APP_API_URL}/api/jobs', jobData);
        setJobs(prevJobs => [...prevJobs, response.data]);
      } catch (err) {
        console.error("Error creating job:", err);
        alert("Failed to add job.");
      }
    }
    closeModal();
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err) {
        console.error("Error deleting job:", err);
        alert('Failed to delete job.');
      }
    }
  };
  
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId;
    const updatedFields = { status: newStatus };

    // Optimistic UI Update
    const originalJobs = [...jobs];
    const updatedJobs = jobs.map(job =>
      job._id === draggableId ? { ...job, ...updatedFields } : job
    );
    setJobs(updatedJobs);

    // Backend Update
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/jobs/${draggableId}`, updatedFields);
    } catch (err) {
      console.error("Error updating job status:", err);
      setJobs(originalJobs); // Revert on failure
      alert('Failed to move job.');
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="status-indicator">Loading...</div>;
  }
  if (error) {
    return <div className="status-indicator">{error}</div>;
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="dashboard">
          {columnOrder.map((columnName) => {
            const columnJobs = jobs.filter((job) => job.status === columnName);
            return (
              <Column
                key={columnName}
                title={columnName}
                jobs={columnJobs}
                onAddJob={openAddModal} // Now opens the modal
                onEditJob={openEditModal} // New prop
                onDeleteJob={handleDeleteJob}
              />
            );
          })}
        </div>
      </DragDropContext>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <JobForm
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          initialData={editingJob}
        />
      </Modal>
    </>
  );
};

export default Dashboard;