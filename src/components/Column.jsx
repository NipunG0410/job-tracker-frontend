import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import JobCard from './JobCard';

const Column = ({ title, jobs, onAddJob, onEditJob, onDeleteJob }) => {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{`${title} (${jobs.length})`}</h3>
      </div>
      
      {title === 'Opportunities' && (
        <button onClick={onAddJob} className="add-job-btn">
          + Add new job
        </button>
      )}

      <Droppable droppableId={title}>
        {(provided) => (
          <div
            className="job-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {jobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                onEdit={onEditJob}
                onDelete={onDeleteJob}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;