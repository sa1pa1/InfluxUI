import { useState } from 'react';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import MenuBar from './components/MenuBar';
import DataDisplay from './components/DisplayArea';
import DragAndDrop from './components/DragAndDrop';

const App = () => {
  // Define state for tracking if the nested bar is open
  const [isNestedBarOpen, setNestedBarOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  let keyPresent = 'API key' in localStorage;
  const [loggedIn, setLoggedIn] = useState(keyPresent);

  // Handler function to toggle the state of the nested bar
  const handleNestedBarToggle = (isOpen) => {
    setNestedBarOpen(isOpen);
  };

  const handleBucketChange = (bucket) => {
    setSelectedBucket(bucket);
    setSelectedMeasurements([]); // Clear measurements when bucket changes
    setSelectedFields([]);       // Clear fields when bucket changes
    setSelectedFilters([]);      // Clear filters when bucket changes
  };

  const handleMeasurementChange = (measurement, action) => {
    setSelectedMeasurements(prev => {
      if (action === 'add') {
        return [...prev, measurement];
      } else if (action === 'remove') {
        setSelectedFields([]);       // Clear fields when measurement changes
        setSelectedFilters([]);      // Clear filters when measurement changes
        return prev.filter(m => m !== measurement);
      }
      return prev;
    });
  };

  const handleFieldChange = (field, action) => {
    setSelectedFields(prev => {
      if (action === 'add') {
        return [...prev, field];
      } else if (action === 'remove') {
        setSelectedFilters([]);      // Clear filters when field changes
        return prev.filter(f => f !== field);
      }
      return prev;
    });
  };

  const handleFilterChange = (filter, action) => {
    setSelectedFilters(prev => {
      if (action === 'add') {
        return [...prev, filter];
      } else if (action === 'remove') {
        return prev.filter(f => f !== filter);
      }
      return prev;
    });
  };

  return (
    <div>
      <MenuBar 
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
      <Sidebar
        onNestedBarToggle={handleNestedBarToggle}
        onBucketChange={handleBucketChange}
        onMeasurementChange={handleMeasurementChange}
        onFieldChange={handleFieldChange}
        onFilterChange={handleFilterChange}
        selectedBucket={selectedBucket}
        selectedMeasurements={selectedMeasurements}
        selectedFields={selectedFields}
        loggedIn={loggedIn}
        selectedFilters={selectedFilters}
      />
      <DataDisplay />
      <DragAndDrop
        onBucketChange={handleBucketChange}
        onMeasurementChange={handleMeasurementChange}
        onFieldChange={handleFieldChange}
        onFilterChange={handleFilterChange}
        isExpanded={isNestedBarOpen}
        selectedBucket={selectedBucket}
        selectedMeasurements={selectedMeasurements}
        selectedFields={selectedFields}
        selectedFilters={selectedFilters}
      />
    </div>
  );
};

export default App;
