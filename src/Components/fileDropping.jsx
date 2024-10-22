import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import DomoApi from '../Domoapi/Api';
import FileTable from './table';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileList, setFileList] = useState([]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  // handleUpload function
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus('Please select a file first!');
      return;
    }

    try {
      const res = await DomoApi.UploadFile(selectedFile, "filename", "ajsdi", true);
      const fileId = res.dataFileId;
      if (fileId) {
        await DomoApi.CreateDocument('fileUploader', { fileId });
        setUploadStatus('File uploaded successfully!');

        // Update the file list with the new file details
        setFileList([...fileList, { id: fileId, name: selectedFile.name, size: selectedFile.size }]);
      } else {
        setUploadStatus('Error uploading file.');
      }
    } catch (error) {
      setUploadStatus('Error uploading file.');
      console.error('Error uploading file:', error);
    }
  };

  // handleDelete function
  

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h3 className="text-lg font-bold mb-4 text-center">Upload a File</h3>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'} transition duration-300`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-blue-500">Drop the file here...</p>
        ) : (
          <p className="text-center text-gray-500">Drag & drop a file here, or click to select one</p>
        )}
      </div>

      <form onSubmit={handleUpload} className="space-y-4 mt-4">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Upload
        </button>
      </form>

      {uploadStatus && (
        <p className={`text-center mt-4 ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {uploadStatus}
        </p>
      )}

     
      <FileTable recentFiles={fileList} />
    </div>
  );
};

export default FileUpload;
