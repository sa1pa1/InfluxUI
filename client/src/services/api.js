
// API functions for rendering drag and drop components
export const fetchBuckets = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/get-data', {
            headers: {
              'x-influxdb-token': localStorage['API key']
            }
          });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching buckets:', error);
        throw error;
    }
};

export const fetchMeasurements = async (bucketName) => {
    try {
        const response = await fetch(`http://localhost:3000/api/get-data/${bucketName}`, {
            headers: {
              'x-influxdb-token': localStorage['API key']
            }
          });
        if (!response.ok) {
            throw new Error(`Failed to fetch measurements: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching measurements:', error);
        throw error;
    }
};

export const fetchFields = async (bucketName, measurementName) => {
    try {
        const response = await fetch(`http://localhost:3000/api/get-data/${bucketName}/${measurementName}`, {
            headers: {
              'x-influxdb-token': localStorage['API key']
            }
          });
        if (!response.ok) {
            throw new Error(`Failed to fetch fields: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching fields:', error);
        throw error;
    }
};
