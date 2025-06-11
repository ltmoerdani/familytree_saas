import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const DataPreviewTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-text-primary mb-2">Data Preview</h3>
        <p className="text-text-secondary text-sm">
          Showing {data.length} records from your uploaded file
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left text-sm font-medium text-text-primary border-b border-border">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-background">
              {currentData.map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-surface">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-3 text-sm text-text-secondary">
                      {row[column] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentData.map((row, index) => (
          <div key={index} className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">
                Record {startIndex + index + 1}
              </span>
              <Icon name="User" size={16} className="text-text-secondary" />
            </div>
            <div className="space-y-2">
              {columns.slice(0, 4).map((column) => (
                <div key={column} className="flex justify-between">
                  <span className="text-sm text-text-secondary">{column}:</span>
                  <span className="text-sm text-text-primary font-medium">
                    {row[column] || '-'}
                  </span>
                </div>
              ))}
              {columns.length > 4 && (
                <div className="text-xs text-text-secondary pt-2">
                  +{columns.length - 4} more fields
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-text-secondary">
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-smooth ${
                    currentPage === page
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-surface'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreviewTable;