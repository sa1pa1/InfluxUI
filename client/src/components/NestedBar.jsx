import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';

function NestedBar({ section, items, onRenameProject, onDeleteProject }) {
  const [editingProject, setEditingProject] = useState(null);
  const [newName, setNewName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle dragging start
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData('text/plain', item);
    event.dataTransfer.setData('type', section.toLowerCase());
  };

  // Handle renaming a project
  const handleRenameClick = (item) => {
    setEditingProject(item);
    setNewName(item);
    setErrorMessage('');
  };

  const handleRenameSubmit = (index) => {
    const trimmedNewName = newName.trim();
    
    if (trimmedNewName === '') {
      setErrorMessage('Project name cannot be empty.');
      return;
    }

    // Check for duplicates
    const isDuplicate = items.some(
      (name, idx) => name.trim().toLowerCase() === trimmedNewName.toLowerCase() && idx !== index
    );
    
    if (isDuplicate) {
      setErrorMessage('A project with this name already exists.');
    } else {
      setErrorMessage('');
      onRenameProject(index, trimmedNewName);
      setEditingProject(null);
    }
  };

  // Function to handle project deletion
  const handleDeleteClick = (index) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDeleteProject(index);
    }
  };

  // Handle Enter key press for renaming
  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(index);
    }
  };

  const renderItems = () => {
    if (section === 'User Projects') {
      return items.map((item, index) => (
        <div key={index} className="nested-item">
          {editingProject === item ? (
            <div className="edit-container">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
              <button onClick={() => handleRenameSubmit(index)} className="save-button">
                Save
              </button>
              {errorMessage && (
                <span className="error-message">{errorMessage}</span>
              )}
            </div>
          ) : (
            <>
              <Nav.Link
                draggable
                onDragStart={(event) => handleDragStart(event, item)}
                style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {item}
              </Nav.Link>
              <div className="edit-option">
                <button
                  onClick={() => handleRenameClick(item)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ));
    } else {
      // For non-User Projects sections, render items without edit/delete options
      return items.map((item, index) => (
        <div key={index} className="nested-item">
          <Nav.Link
            draggable
            onDragStart={(event) => handleDragStart(event, item)} // Set drag data
            style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {item}
          </Nav.Link>
        </div>
      ));
    }
  };

  return (
    <div className="nested-bar">
      <Nav className="flex-column">
        {renderItems()}
      </Nav>
    </div>
  );
}

NestedBar.propTypes = {
  section: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onRenameProject: PropTypes.func.isRequired,
  onDeleteProject: PropTypes.func.isRequired,
};

export default NestedBar;
