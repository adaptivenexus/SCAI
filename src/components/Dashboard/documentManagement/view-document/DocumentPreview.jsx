import React from 'react';

function getDocumentTypeFromUrl(url) {
  if (!url) return undefined;
  const ext = url.split('.').pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
  return "unknown";
}

const DocumentPreview = ({ document  }) => {
  const renderDocumentContent = () => {
    if (!document) return <div>No document selected</div>;

    // Adjust these lines to match your document structure
    //const type = document.parsed_data?.document_type || document.type;
    const url = document.file;
    const type = "pdf"; // For testing, you can set this to a specific type"

    console.log('Document type====:', type);
    console.log('Document URL:', url);

    switch (type) {
      case 'pdf':
        const pdfUrl = url.includes('#') ? url : `${url}#toolbar=0&navpanes=0&view=FitH`;
        return <iframe src={pdfUrl} width="100%" height="600px" title="Document Preview" />;
      case 'image':
        return <img src={url} alt="Document Preview" width="100%" />;
      default:
        return <div>Unsupported document type</div>;
    }
  };

  return (
    <div className="document-preview">
      {renderDocumentContent()}
    </div>
  );
};

export default DocumentPreview;