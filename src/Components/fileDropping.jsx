import React, { useState, useCallback, useEffect } from 'react';
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

  // Fetch existing documents when the component mounts
useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await DomoApi.ListDocuments('fileUploader');
        console.log("documents",documents);
        
        // Check if documents is defined and is an array
        const formattedDocuments = documents.map(doc => ({
              id: doc.fileId,  // Assuming this is the correct property
              fileName: doc.content.fileName, // Make sure to match the keys to your schema
              fileSize: doc.content.fileSize, // Make sure to match the keys to your schema
            }))
          ;
        setFileList(formattedDocuments);
        console.log("formattedDocuments",formattedDocuments);
        
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
  
    fetchDocuments();
  }, []); // Empty dependency array to run once when the component mounts

  // Handle upload function
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
          // Gather the details to store
          const fileDetails = {
            fileId: fileId,
            fileName: selectedFile.name,
            fileSize: selectedFile.size.toString(), // Ensure it's a string
            owner: "currentUserId" // Replace with the actual user ID
          };
  
          // Create a new document in the fileUploader collection
          await DomoApi.CreateDocument('fileUploader', fileDetails);
          setUploadStatus('File uploaded successfully!');
  
          // Update the file list with the new file details
          setFileList(prevList => [...prevList, fileDetails]);
        } else {
          setUploadStatus('Error uploading file.');
        }
      } catch (error) {
        setUploadStatus('Error uploading file.');
        console.error('Error uploading file:', error);
      }
    };

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
