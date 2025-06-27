import React from 'react';

const DocumentSummary = ({ document }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Document Summary</h3>
      <div className="mt-2">
        <p>{document.parsed_data?.summary}</p>
      </div>
    </div>
  );
};

export default DocumentSummary;