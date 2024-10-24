import React, { useEffect, useState } from 'react';
import DomoApi from '../Domoapi/Api';
import FileTable from './FileTable';

const FileManager = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await DomoApi.ListDocuments('fileUploader');
        setRecentFiles(documents);
      } catch (error) {
        setError('Failed to fetch documents');
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return <p>Loading documents...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <FileTable recentFiles={recentFiles} />
    </div>
  );
};

export default FileManager;
