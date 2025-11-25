import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/DragAndDrop.css";

// Custom hook for showing alerts
const useAlert = () => {
  const [isAlertShown, setIsAlertShown] = useState(false);
  const showAlert = useCallback((message) => {
    if (!isAlertShown) {
      setIsAlertShown(true);
      alert(message);
      // Hide alert after 1 second
      setTimeout(() => setIsAlertShown(false), 1000);
    }
  }, [isAlertShown]);

  return showAlert;
};

const DragAndDrop = ({ onBucketChange, onMeasurementChange, onFieldChange, onFilterChange, selectedBucket, selectedMeasurements, selectedFields, selectedFilters }) => {
  const [shiftLeft, setShiftLeft] = useState('0');
  const showAlert = useAlert();

  const validTypes = {
    Buckets: "buckets",
    Measurements: "measurements",
    Fields: "fields",
    Filters: "filters",
  };

  // Update the shiftLeft state when the sidebar size changes
  useEffect(() => {
    const updateLeft = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const sidebarWidth = sidebar.offsetWidth;
        setShiftLeft(`${sidebarWidth}px`);
      }
    };
    updateLeft();
    window.addEventListener('resize', updateLeft);
    return () => {
      window.removeEventListener('resize', updateLeft);
    };
  }, []);

  // Handle drop logic based on the type of item dropped
  const handleDrop = useCallback((item, type) => {
    switch (type) {
      case "Buckets":
        // Show alert if the bucket is already selected
        if (selectedBucket === item) {
          showAlert(`"${item}" is already added as the bucket.`);
        } else {
          onBucketChange(item);
        }
        break;
      case "Measurements":
        // Show alert if the measurement is already selected
        if (selectedMeasurements.includes(item)) {
          showAlert(`"${item}" is already added to Measurements.`);
        } else {
          onMeasurementChange(item, 'add');
        }
        break;
      case "Fields":
        // Show alert if the field is already selected
        if (selectedFields.includes(item)) {
          showAlert(`"${item}" is already added to Fields.`);
        } else {
          onFieldChange(item, 'add');
        }
        break;
      case "Filters":
        // Show alert if the filter is already selected
        if (selectedFilters.includes(item)) {
          showAlert(`"${item}" is already added to Filters.`);
        } else {
          onFilterChange(item, 'add');
        }
        break;
      default:
        showAlert(`Invalid drop type: ${type}`);
    }
  }, [selectedBucket, selectedMeasurements, selectedFields, selectedFilters, onBucketChange, onMeasurementChange, onFieldChange, onFilterChange, showAlert]);

  const onDrop = (event, type) => {
    event.preventDefault();
    const item = event.dataTransfer.getData("text/plain"); // Get dropped item's data
    const itemType = event.dataTransfer.getData("type"); // Get the item's type

    if (itemType === validTypes[type]) {
      handleDrop(item, type);
    } else {
      showAlert(`You can only drop ${type} items here.`);
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  // Handle item removal based on type and index
  const handleRemoveItem = (index, type) => {
    switch (type) {
      case "Buckets":
        onBucketChange(null);
        break;
      case "Measurements":
        onMeasurementChange(selectedMeasurements[index], 'remove');
        break;
      case "Fields":
        onFieldChange(selectedFields[index], 'remove');
        break;
      case "Filters":
        onFieldChange(selectedFilters[index], 'remove');
        break;
    }
  };

  // Remove all selected items
  const handleDeleteAll = () => {
    onBucketChange(null);
    selectedMeasurements.forEach(m => onMeasurementChange(m, 'remove'));
    selectedFields.forEach(f => onFieldChange(f, 'remove'));
    selectedFilters.forEach(f => onFilterChange(f, 'remove'));
  };

  // Handle query execution
  const handleExecuteQuery = () => {
    const query = { bucket: selectedBucket, measurements: selectedMeasurements, fields: selectedFields, filters: selectedFilters };
    console.log("Executing Query:", query);
    // TODO - Send query to backend
  };

  const getPreviewSummary = () => {
    return `Bucket: ${selectedBucket || "None"}
Measurement: ${selectedMeasurements.join(", ") || "None"}
Field: ${selectedFields.join(", ") || "None"}
Filters: ${selectedFilters.join(", ") || "None"}`;
  };

  return (
    <section>
      <div className='drag-drop-area' style={{ left: shiftLeft }}>
        <div className="drag-drop-container">
          <div className="query-builder">
            <div className="query-section">

              {/* Bucket drop zone */}
              <div className="dropzone-container">
                <h4 className="zone-title">Bucket</h4>
                <div
                  className="query-dropzone"
                  onDrop={(event) => onDrop(event, "Buckets")}
                  onDragOver={onDragOver}
                >
                  {selectedBucket ? (
                    <div className="dropped-item">
                      {selectedBucket}
                      <button onClick={() => handleRemoveItem(0, "Buckets")}>–</button>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>

              {/* Measurement drop zone */}
              <div className="dropzone-container">
                <h4 className="zone-title">Measurement</h4>
                <div
                  className="query-dropzone"
                  onDrop={(event) => onDrop(event, "Measurements")}
                  onDragOver={onDragOver}
                >
                  {selectedMeasurements.map((item, index) => (
                    <div key={index} className="dropped-item">
                      {item}
                      <button onClick={() => handleRemoveItem(index, "Measurements")}>–</button>
                    </div>
                  ))}
                  {selectedMeasurements.length === 0 && <p></p>}
                </div>
              </div>

              {/* Field drop zone */}
              <div className="dropzone-container">
                <h4 className="zone-title">Field</h4>
                <div
                  className="query-dropzone"
                  onDrop={(event) => onDrop(event, "Fields")}
                  onDragOver={onDragOver}
                >
                  {selectedFields.map((item, index) => (
                    <div key={index} className="dropped-item">
                      {item}
                      <button onClick={() => handleRemoveItem(index, "Fields")}>–</button>
                    </div>
                  ))}
                  {selectedFields.length === 0 && <p></p>}
                </div>
              </div>

              {/* Filters drop zone */}
              <div className="dropzone-container">
                <h4 className="zone-title">Filters</h4>
                <div
                  className="query-dropzone"
                  onDrop={(event) => onDrop(event, "Filters")}
                  onDragOver={onDragOver}
                >
                  {selectedFilters.map((item, index) => (
                    <div key={index} className="dropped-item">
                      {item}
                      <button onClick={() => handleRemoveItem(index, "Filters")}>–</button>
                    </div>
                  ))}
                  {selectedFilters.length === 0 && <p></p>}
                </div>
              </div>
              {/* Preview section */}
              <div className="preview-container">
                <h4 className="zone-title">Preview</h4>
                <div className="preview-field">
                  <pre>{getPreviewSummary()}</pre>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="buttons">
                <button className="execute-query-button" onClick={handleExecuteQuery}>
                  Execute
                </button>
                <button className="delete-all-button" onClick={handleDeleteAll}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// PropTypes validation for component props
DragAndDrop.propTypes = {
  onBucketChange: PropTypes.func.isRequired,
  onMeasurementChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  selectedBucket: PropTypes.string,
  selectedMeasurements: PropTypes.array.isRequired,
  selectedFields: PropTypes.array.isRequired,
  selectedFilters: PropTypes.array.isRequired
};

export default DragAndDrop;
