import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import DomoApi from '../Domoapi/Api';

// Utility function to convert file size to a readable format
const formatFileSize = (size) => {
  if (size < 1024) return `${size} bytes`;
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

const FileTable = ({ recentFiles }) => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileList, setFileList] = useState([]);

  // Set the initial file list
  useEffect(() => {
    if (recentFiles) {
      setFileList(recentFiles);
    }
  }, [recentFiles]);

  // Handle file delete
  const handleDelete = async (fileId) => {
    if (!fileId) {
      setUploadStatus('Error: File ID is missing.');
      return;
    }

    try {
      const response = await DomoApi.DeleteDocument('fileUploader', fileId);
      if (response) {
        setUploadStatus('File deleted successfully!');
        // Update fileList by filtering out the deleted file
        setFileList((prevList) => prevList.filter((file) => file.id !== fileId));
      }
    } catch (error) {
      setUploadStatus('Error deleting file.');
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="mt-6">
      <h5 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Recent Files</h5>
      <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr className="text-gray-600 dark:text-gray-300">
              <th className="p-3 text-sm font-semibold text-left">File Name</th>
              <th className="p-3 text-sm font-semibold text-left">File Size</th>
              <th className="p-3 text-sm font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
            {(fileList || []).map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 text-sm text-gray-800 dark:text-gray-300">{file.fileName}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(file.fileSize)}
                </td>
                <td className="p-4">
                  <DeleteIcon
                    onClick={() => handleDelete(file.id)}
                    style={{ cursor: 'pointer', color: '#ef4444' }}
                    className="hover:text-red-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {uploadStatus && (
        <p className={`text-center mt-4 ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default FileTable;
