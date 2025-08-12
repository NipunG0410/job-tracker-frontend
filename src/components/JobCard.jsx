import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const JobCard = ({ job, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={job._id} index={index}>
      {(provided) => (
        <div
          className="job-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-header">
            <h4>{job.title}</h4>
            <div className="card-actions">
              <button onClick={() => onEdit(job)} className="icon-button">✏️</button>
              <button onClick={() => onDelete(job._id)} className="icon-button">🗑️</button>
            </div>
          </div>

          <p>{job.company}</p>
          
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              View Posting
            </a>
          )}

          {job.referralInfo && <p className="info-chip">Referred by: {job.referralInfo}</p>}

          {job.hiringManagerLinks && job.hiringManagerLinks.length > 0 && (
            <div className="links-section">
              <strong>Hiring Managers:</strong>
              <ul>
                {job.hiringManagerLinks.map((link, i) => (
                  link && <li key={i}><a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer">Link {i + 1}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;