// This is the CreateProjectModal component for creating or editing a project
import { useState, useEffect } from 'react';
import { X, Plus, Minus, Upload } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import './CreateProjectModal.css';

function CreateProjectModal({ onClose, projectToEdit }) {
  // State for current step in the modal
  const [currentStep, setCurrentStep] = useState(0);
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industry: '',
    stage: '',
    openPositions: [{ role: '', skills: [], isPaid: false }],
    funding: '',
    timeline: '',
    teamMembers: []
  });
  
  const { createProject, editProject } = useProjects();
  const { user } = useAuth();
  const isEditMode = Boolean(projectToEdit);

  // Initialize form with project data when editing
  useEffect(() => {
    if (projectToEdit) {
      // Format team members, excluding the founder
      const teamMembersWithoutFounder = projectToEdit.teamMembers
        .filter(member => member.role !== "Founder")
        .map(member => ({
          name: member.name,
          position: member.role,
          id: member.id
        }));
      
      setFormData({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        industry: projectToEdit.industry || '',
        stage: projectToEdit.stage || '',
        openPositions: projectToEdit.openPositions && projectToEdit.openPositions.length > 0 
          ? projectToEdit.openPositions 
          : [{ role: '', skills: [], isPaid: false }],
        funding: projectToEdit.funding || '',
        timeline: projectToEdit.timeline || '',
        teamMembers: teamMembersWithoutFounder || []
      });
    }
  }, [projectToEdit]);

  // Steps for the modal
  const steps = [
    { title: 'Project Basics', component: 'basics' },
    { title: 'Team Requirements', component: 'team' },
    { title: 'Team Members', component: 'members' },
    { title: 'Project Details', component: 'details' }
  ];

  // Industry options
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
    'Entertainment', 'Food & Beverage', 'Travel', 'Real Estate', 'Other'
  ];

  // Project stage options
  const stages = [
    'Idea Validation', 'MVP Development', 'Beta Testing', 'Market Ready', 'Scaling'
  ];

  // State for custom skill input
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);

  // Skill options for positions
  const skillOptions = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'UI/UX Design',
    'Product Management', 'Marketing', 'Sales', 'Data Science', 'Machine Learning',
    'Mobile Development', 'DevOps', 'Blockchain', 'AI/ML', 'Backend Development',
    'Frontend Development', 'Full Stack', 'Digital Marketing', 'Content Writing',
    'Other'
  ];

  // Handle adding a custom skill
  const handleCustomSkillAdd = (positionIndex) => {
    if (customSkill.trim()) {
      handlePositionSkillToggle(positionIndex, customSkill.trim());
      setCustomSkill('');
      setShowCustomSkillInput(false);
    }
  };

  // Handle input change for form fields
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle change for a specific open position
  const handlePositionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      openPositions: prev.openPositions.map((pos, i) =>
        i === index ? { ...pos, [field]: value } : pos
      )
    }));
  };

  // Handle toggling a skill for a position
  const handlePositionSkillToggle = (positionIndex, skill) => {
    if (skill === 'Other') {
      setShowCustomSkillInput(true);
      return;
    }

    setFormData(prev => ({
      ...prev,
      openPositions: prev.openPositions.map((pos, i) =>
        i === positionIndex
          ? {
            ...pos,
            skills: pos.skills.includes(skill)
              ? pos.skills.filter(s => s !== skill)
              : [...pos.skills, skill]
          }
          : pos
      )
    }));
  };

  // Add a new open position
  const addPosition = () => {
    setFormData(prev => ({
      ...prev,
      openPositions: [...prev.openPositions, { role: '', skills: [], isPaid: false }]
    }));
  };

  // Remove an open position
  const removePosition = (index) => {
    setFormData(prev => ({
      ...prev,
      openPositions: prev.openPositions.filter((_, i) => i !== index)
    }));
  };

  // Handle change for a team member
  const handleTeamMemberChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  // Profile pic upload is no longer needed with UserAvatar component

  // Add a new team member
  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', position: '' }]
    }));
  };

  // Remove a team member
  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // Handle moving to the next step or submitting
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle moving to the previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!user) return;

    // Process team members for submission
    const processedTeamMembers = formData.teamMembers
      .filter(member => member.name.trim() !== '')
      .map(member => ({
        id: member.id || Date.now() + Math.random(),
        name: member.name,
        role: member.position // Map position to role
      }));

    // Create project data object
    const projectData = {
      ...formData,
      openPositions: formData.openPositions.filter(pos => pos.role.trim() !== '')
    };

    if (isEditMode) {
      // When editing, we don't change the team members structure completely
      // We just update the non-founder members
      editProject(projectToEdit.id, {
        ...projectData,
        // No need to include teamMembers here as editProject will preserve the founder
        // and we've already filtered out the founder when setting formData
        teamMembers: processedTeamMembers,
      });
    } else {
      // For new projects, add the current user as a founder
      projectData.teamMembers = [
        { id: user.id, name: user.name, role: "Founder" },
        ...processedTeamMembers
      ];
      createProject(projectData);
    }

    onClose();
  };

  // Check if the user can proceed to the next step
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.title && formData.description && formData.industry && formData.stage;
      case 1:
        return formData.openPositions.some(pos => pos.role.trim() !== '');
      case 2:
        return true; // Team members are optional
      case 3:
        return formData.funding && formData.timeline;
      default:
        return false;
    }
  };

  // Render the content for the current step
  const renderStepContent = () => {
    switch (steps[currentStep].component) {
      case 'basics':
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your project title"
              />
            </div>

            <div className="form-group">
              <label>Project Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project, its goals, and what problem it solves"
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group industry-form-group">
                <label>Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div className="form-group stage-form-group">
                <label>Project Stage *</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                >
                  <option value="">Select stage</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Open Positions *</label>
              {formData.openPositions.map((position, index) => (
                <div key={index} className="position-form">
                  <div className="position-header">
                    <input
                      type="text"
                      value={position.role}
                      onChange={(e) => handlePositionChange(index, 'role', e.target.value)}
                      placeholder="Position title (e.g., Frontend Developer)"
                    />
                    <div className="position-paid-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          checked={position.isPaid}
                          onChange={(e) => handlePositionChange(index, 'isPaid', e.target.checked)}
                        />
                        Paid
                      </label>
                    </div>
                    {formData.openPositions.length > 1 && (
                      <button
                        type="button"
                        className="remove-position-btn"
                        onClick={() => removePosition(index)}
                      >
                        <Minus size={14} />
                      </button>
                    )}
                  </div>
                  <div className="position-skills">
                    <label>Required skills for this position:</label>
                    <div className="skills-input-container">
                      <select
                        className="skills-dropdown"
                        onChange={(e) => {
                          if (e.target.value && !position.skills.includes(e.target.value)) {
                            handlePositionSkillToggle(index, e.target.value);
                          }
                          e.target.value = '';
                        }}
                        value=""
                      >
                        <option value="">Select a skill to add</option>
                        {skillOptions
                          .filter(skill => !position.skills.includes(skill))
                          .map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                      </select>
                      {showCustomSkillInput && (
                        <div className="custom-skill-input">
                          <input
                            type="text"
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            placeholder="Enter custom skill"
                          />
                          <button
                            type="button"
                            className="add-custom-skill-btn"
                            onClick={() => handleCustomSkillAdd(index)}
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                    {position.skills.length > 0 && (
                      <div className="selected-skills">
                        {position.skills.map(skill => (
                          <span key={skill} className="selected-skill-tag">
                            {skill}
                            <button
                              type="button"
                              className="remove-skill-btn"
                              tabIndex={0}
                              aria-label={`Remove skill ${skill}`}
                              onClick={() => handlePositionSkillToggle(index, skill)}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="add-position-btn"
                onClick={addPosition}
              >
                <Plus size={16} />
                Add Another Position
              </button>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Team Members (Optional)</label>
              <p className="form-description">Add existing team members to your project</p>

              {formData.teamMembers.map((member, index) => (
                <div key={index} className="team-member-form">
                  <div className="member-avatar-section">
                    <div className="avatar-preview">
                      {member.name ? (
                        <UserAvatar user={member} size="medium" />
                      ) : (
                        <div className="avatar-placeholder">
                          <Upload size={24} />
                        </div>
                      )}
                    </div>
                    {/* Avatar is now automatically generated */}
                  </div>

                  <div className="member-details">
                    <div className="form-row">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        placeholder="Member name"
                      />
                      <input
                        type="text"
                        value={member.position}
                        onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
                        placeholder="Position/Role"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-member-btn"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-member-btn"
                onClick={addTeamMember}
              >
                <Plus size={16} />
                Add Team Member
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Funding Goal *</label>
              <input
                type="text"
                value={formData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                placeholder="e.g., ₹25,00,000"
              />
            </div>

            <div className="form-group">
              <label>Project Timeline *</label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="e.g., 6 months to MVP"
              />
            </div>

            <div className="project-preview">
              <h4>Project Preview</h4>
              <div className="preview-card">
                <h5>{formData.title}</h5>
                <p>{formData.description}</p>
                <div className="preview-meta">
                  <span>Industry: {formData.industry}</span>
                  <span>Stage: {formData.stage}</span>
                  <span>Funding: {formData.funding}</span>
                  <span>Team: {formData.teamMembers.length + 1} members</span>
                </div>
                <div className="preview-skills">
                  {formData.openPositions.slice(0, 3).map((pos, index) => (
                    <span key={index} className="skill-tag">
                      {pos.role}
                      {pos.isPaid ? ' (Paid)' : ' (Unpaid)'}
                    </span>
                  ))}
                  {formData.openPositions.length > 3 && (
                    <span className="skill-tag">+{formData.openPositions.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render the modal UI
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-project-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Project' : 'Create New Project'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="modal-content">
          <div className="step-header">
            <h3>{steps[currentStep].title}</h3>
            <span className="step-counter">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {renderStepContent()}

          <div className="step-actions">
            {currentStep > 0 && (
              <button className="prev-btn" onClick={handlePrevious}>
                Previous
              </button>
            )}
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length - 1 ? (isEditMode ? 'Save Changes' : 'Create Project') : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the CreateProjectModal component
export default CreateProjectModal;