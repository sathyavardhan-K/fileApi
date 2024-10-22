import React from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

// Delete click handler
const handleDeleteClick = () => {
  console.log('Delete icon clicked');
};

// Download click handler
const handleDownloadClick = () => {
  console.log('Download');
};

// Table component
const Table = ({ recentFiles }) => {
  return (
    <div className="mt-6">
      <h5 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Recent Files</h5>
      <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr className="text-gray-600 dark:text-gray-300">
              <th scope="col" className="p-3 text-sm font-semibold text-left">
                File Name
              </th>
              <th scope="col" className="p-3 text-sm font-semibold text-left">
                Last Modified
              </th>
              <th scope="col" className="p-3 text-sm font-semibold text-left">
                File Size
              </th>
              <th scope="col" className="p-3 text-sm font-semibold text-left">
                Owner
              </th>
              <th scope="col" className="p-3 text-sm font-semibold text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
            {(recentFiles || []).map((file, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 text-sm text-gray-800 dark:text-gray-300">
                  <Link
                    to=""
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={handleDownloadClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {file.name}
                  </Link>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>{file.modifiedDate}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-500">by {file.modifiedBy}</span>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{file.size}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{file.owner}</td>
                <td className="p-4">
                  <DeleteIcon
                    onClick={handleDeleteClick}
                    style={{ cursor: 'pointer', color: '#ef4444' }}
                    className="hover:text-red-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
