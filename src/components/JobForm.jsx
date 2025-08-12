import React, { useState, useEffect } from 'react';

// CORRECTED: Added a default empty object for initialData to prevent null errors
const JobForm = ({ onSubmit, onCancel, initialData = null }) => { 
  const [formData, setFormData] = useState({});

  // If initialData changes (i.e., when editing a new job), update the form
  useEffect(() => {
    // This is the main setup logic, now it handles null correctly
    const data = initialData || {
      title: '',
      company: '',
      url: '',
      referralInfo: '',
      hiringManagerLinks: [''],
    };

    // Ensure hiringManagerLinks is an array with at least one item for the form
    if (!data.hiringManagerLinks || data.hiringManagerLinks.length === 0) {
      data.hiringManagerLinks = [''];
    }
    
    setFormData(data);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManagerChange = (index, value) => {
    // Make sure hiringManagerLinks exists on formData before trying to access it
    const newLinks = [...(formData.hiringManagerLinks || [])];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, hiringManagerLinks: newLinks }));
  };

  const addManagerInput = () => {
    setFormData(prev => ({ ...prev, hiringManagerLinks: [...(prev.hiringManagerLinks || []), ''] }));
  };

  const removeManagerInput = (index) => {
    const newLinks = formData.hiringManagerLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, hiringManagerLinks: newLinks }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      hiringManagerLinks: (formData.hiringManagerLinks || []).filter(link => link && link.trim() !== '')
    };
    onSubmit(finalData);
  };

  // If formData hasn't been initialized yet, don't render the form
  if (Object.keys(formData).length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="job-form">
      {/* CORRECTED: Check for initialData and its _id property */}
      <h2>{initialData && initialData._id ? 'Edit Job' : 'Add New Job'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Job Title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL to Posting</label>
        <input type="text" id="url" name="url" value={formData.url} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label htmlFor="referralInfo">Referral Info (if any)</label>
        <input type="text" id="referralInfo" name="referralInfo" value={formData.referralInfo} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Hiring Manager Links</label>
        {(formData.hiringManagerLinks || []).map((link, index) => (
          <div key={index} className="hiring-manager-input">
            <input type="text" value={link} onChange={(e) => handleManagerChange(index, e.target.value)} placeholder="https://linkedin.com/in/..."/>
            <button type="button" onClick={() => removeManagerInput(index)} className="icon-button">×</button>
          </div>
        ))}
        <button type="button" onClick={addManagerInput} className="add-job-btn" style={{marginTop: '8px'}}>+ Add Manager</button>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData && initialData._id ? 'Save Changes' : 'Add Job'}</button>
      </div>
    </form>
  );
};

export default JobForm;