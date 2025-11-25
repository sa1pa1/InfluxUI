import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import NestedBar from './NestedBar';
import { fetchBuckets, fetchMeasurements, fetchFields } from '../services/api';

function Sidebar({ onBucketChange, onMeasurementChange, onFieldChange, onFilterChange, selectedBucket, selectedMeasurements, loggedIn }) {
  const [activeSection, setActiveSection] = useState(null);
  const [userProjects, setUserProjects] = useState(['Sub-Project 1', 'Sub-Project 2']);
  const [projectCounter, setProjectCounter] = useState(3); // To keep track of the number of projects
  const [buckets, setBuckets] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters] = useState(['Filter 1', 'Filter 2']);
  // const [filters, setFilters] = useState([]);

  useEffect(() => {
    const loadBuckets = async () => {
      try {
        const result = await fetchBuckets(); // Fetch buckets from API
        setBuckets(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Error in Sidebar:', error);
        setError(error.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    if ('API key' in localStorage) {
      loadBuckets(); // Fetch buckets when the component mounts and logged in
    }
  }, []);
  
  useEffect(() => {
    const loadMeasurements = async () => {
      if (selectedBucket) {
        try {
          const result = await fetchMeasurements(selectedBucket); // Fetch measurements from API
          setMeasurements(result.data);
        } catch (error) {
          console.error('Error fetching measurements:', error);
          setError(error.message || 'Failed to fetch measurements');
        }
      } else {
        setMeasurements([]); // Clear measurements if no bucket is selected
      }
    };

    if ('API key' in localStorage) {
      loadMeasurements(); // Fetch measurements when selectedBucket changes
    }
  }, [selectedBucket]);

  useEffect(() => {
    const loadFields = async () => {
      // Only fetch fields if both a bucket and measurements are selected
      if (selectedBucket && selectedMeasurements.length > 0) {
        try {
          const allFields = await Promise.all(
            selectedMeasurements.map(measurement =>
              fetchFields(selectedBucket, measurement)
            )
          );
          setFields(allFields.flatMap(result => result.data));
        } catch (error) {
          console.error('Error fetching fields:', error);
          setError(error.message || 'Failed to fetch fields');
        }
      } else {
        setFields([]);
      }
    };

    if ('API key' in localStorage) {
      loadFields(); // Fetch fields when selectedBucket or selectedMeasurements change
    }
  }, [selectedBucket, selectedMeasurements]);
  
  const handleToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleNewProject = () => {
    const newProjectName = `Sub-Project ${projectCounter}`;
    setUserProjects([...userProjects, newProjectName]);
    setProjectCounter(projectCounter + 1);
    setActiveSection('User Projects'); // Automatically expand "User Projects" section
  };

  const handleRenameProject = (index, newName) => {
    const updatedProjects = [...userProjects];
    updatedProjects[index] = newName;
    setUserProjects(updatedProjects);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = userProjects.filter((_, i) => i !== index);
    setUserProjects(updatedProjects);
  };

  const sections = ['Buckets', 'Measurements', 'Fields', 'Filters', 'User Projects'];

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <Nav className="flex-column">
          {sections.map((section) => (
            <div key={section}>
              <Nav.Link
                onClick={() => handleToggle(section)}
                className="nav-link"
              >
                {section}
              </Nav.Link>
              {activeSection === section && (
                <>
                  {loggedIn ? (
                    <NestedBar
                      section={section}
                      items={
                        section === 'Buckets'
                          ? buckets
                          : section === 'Measurements'
                            ? measurements
                            : section === 'Fields'
                              ? fields
                              : section === 'Filters'
                                ? filters
                                : userProjects
                      }
                      onItemClick={(item) => {
                        if (section === 'Buckets') {
                          onBucketChange(item);
                        } else if (section === 'Measurements') {
                          onMeasurementChange(item, 'add');
                        } else if (section === 'Fields') {
                          onFieldChange(item, 'add');
                        } else if (section === 'Filters') {
                          onFilterChange(item, 'add');
                        }
                      }}
                      onRenameProject={handleRenameProject}
                      onDeleteProject={handleDeleteProject}
                    />
                  ) : (
                    <p className='login-message'>Please log in to see available data sources.</p>
                  )}
                  
                </>
              )}
            </div>
          ))}
        </Nav>
      </div>

      {loggedIn && (
        <>
          {loading && <p className="loading-message">Loading...</p>}
          {error && <p className="error-message">Error: {error}</p>}
        </>
      )}

      {/* Add the new project section */}
      <div className="new-project-section">
        <button
          onClick={handleNewProject}
          className="new-project-button"
        >
          + New Project
        </button>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  onBucketChange: PropTypes.func.isRequired,
  onMeasurementChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  selectedBucket: PropTypes.string,
  selectedMeasurements: PropTypes.array.isRequired,
  loggedIn: PropTypes.bool.isRequired
};

export default Sidebar;
