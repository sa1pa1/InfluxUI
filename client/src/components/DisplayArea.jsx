import { useEffect, useState } from 'react';

const DataDisplay = () => {
  const [dimensions, setDimensions] = useState({ left: '0', height: '0' });

  useEffect(() => {
    const updateDimensions = () => {
      const sidebar = document.querySelector('.sidebar');
      const dragDropArea = document.querySelector('.drag-drop-area');
      if (sidebar && dragDropArea) {
        const sidebarWidth = sidebar.offsetWidth;
        const dragDropBottom = dragDropArea.offsetTop + dragDropArea.offsetHeight;
        const windowHeight = window.innerHeight;
        const newHeight = windowHeight - dragDropBottom;
        setDimensions({
          left: `${sidebarWidth}px`,
          height: `${newHeight}px`
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <section>
      <div
        className='data-display-area'
        style={{ 
          left: dimensions.left, 
          height: dimensions.height,
          top: 'auto',
          bottom: '0'
        }}
      >
        <p>Data display area here</p>
      </div>
    </section>
  );
};

export default DataDisplay;
