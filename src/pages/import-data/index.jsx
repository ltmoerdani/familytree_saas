import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import TreeContextIndicator from 'components/ui/TreeContextIndicator';
import Icon from 'components/AppIcon';
import FileUploadArea from './components/FileUploadArea';
import DataPreviewTable from './components/DataPreviewTable';
import ColumnMappingInterface from './components/ColumnMappingInterface';
import ValidationResults from './components/ValidationResults';
import ImportProgress from './components/ImportProgress';
import ImportSummary from './components/ImportSummary';

const ImportData = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [parsedData, setParsedData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [validationResults, setValidationResults] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importComplete, setImportComplete] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Mock active tree for context indicator
  const activeTree = {
    id: 1,
    name: 'Johnson Family Tree',
    memberCount: 24,
    lastModified: new Date(),
  };

  // Mock CSV data structure
  const mockParsedData = [
    {
      'First Name': 'John',
      'Last Name': 'Johnson',
      'Birth Date': '1950-03-15',
      'Death Date': '',
      Gender: 'Male',
      Relationship: 'Father',
      Spouse: 'Mary Johnson',
      Notes: 'Family patriarch, served in military',
    },
    {
      'First Name': 'Mary',
      'Last Name': 'Johnson',
      'Birth Date': '1952-07-22',
      'Death Date': '',
      Gender: 'Female',
      Relationship: 'Mother',
      Spouse: 'John Johnson',
      Notes: 'Teacher for 30 years',
    },
    {
      'First Name': 'Michael',
      'Last Name': 'Johnson',
      'Birth Date': '1975-11-08',
      'Death Date': '',
      Gender: 'Male',
      Relationship: 'Son',
      Spouse: 'Sarah Johnson',
      Notes: 'Software engineer, lives in California',
    },
    {
      'First Name': 'Sarah',
      'Last Name': 'Johnson',
      'Birth Date': '1978-04-12',
      'Death Date': '',
      Gender: 'Female',
      Relationship: 'Daughter-in-law',
      Spouse: 'Michael Johnson',
      Notes: 'Graphic designer',
    },
    {
      'First Name': 'Emma',
      'Last Name': 'Johnson',
      'Birth Date': '2005-09-18',
      'Death Date': '',
      Gender: 'Female',
      Relationship: 'Granddaughter',
      Spouse: '',
      Notes: 'High school student, loves art',
    },
  ];

  const steps = [
    { id: 1, title: 'Upload File', icon: 'Upload' },
    { id: 2, title: 'Map Columns', icon: 'ArrowRightLeft' },
    { id: 3, title: 'Validate Data', icon: 'CheckCircle' },
    { id: 4, title: 'Import', icon: 'Download' },
  ];

  const handleFileUpload = file => {
    // Simulate file parsing
    setTimeout(() => {
      setParsedData(mockParsedData);
      setCurrentStep(2);
    }, 1000);
  };

  const handleColumnMapping = mapping => {
    setColumnMapping(mapping);
    // Simulate validation
    const mockValidation = [
      {
        type: 'error',
        message: 'Missing required field: Birth Date for John Johnson',
        row: 1,
        field: 'birthDate',
      },
      {
        type: 'warning',
        message: 'Date format inconsistency detected in row 3',
        row: 3,
        field: 'birthDate',
      },
      {
        type: 'info',
        message: 'Duplicate name detected: Michael Johnson (rows 3, 7)',
        row: 3,
        field: 'name',
      },
    ];
    setValidationResults(mockValidation);
    setCurrentStep(3);
  };

  const handleStartImport = () => {
    setCurrentStep(4);
    setIsImporting(true);

    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setImportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsImporting(false);
        setImportComplete(true);
        setImportSummary({
          totalRecords: 5,
          successfulImports: 4,
          skippedRecords: 1,
          errors: 0,
          newMembers: 3,
          updatedMembers: 1,
        });
      }
    }, 800);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setParsedData([]);
    setColumnMapping({});
    setValidationResults([]);
    setImportProgress(0);
    setImportComplete(false);
    setImportSummary(null);
    setIsImporting(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <FileUploadArea onFileUpload={handleFileUpload} />;
      case 2:
        return (
          <div className="space-y-6">
            <DataPreviewTable data={parsedData} />
            <ColumnMappingInterface
              data={parsedData}
              onMappingComplete={handleColumnMapping}
            />
          </div>
        );
      case 3:
        return (
          <ValidationResults
            results={validationResults}
            data={parsedData}
            mapping={columnMapping}
            onStartImport={handleStartImport}
          />
        );
      case 4:
        return importComplete ? (
          <ImportSummary
            summary={importSummary}
            onViewTree={() => navigate('/family-tree-canvas')}
            onImportMore={handleReset}
          />
        ) : (
          <ImportProgress progress={importProgress} isImporting={isImporting} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreeContextIndicator activeTree={activeTree} />

      <main className="pt-28 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-semibold text-text-primary mb-2">
                  Import Family Data
                </h1>
                <p className="text-text-secondary">
                  Upload and import family information from CSV or Excel files
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
              >
                <Icon name="ArrowLeft" size={20} />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between bg-surface rounded-lg p-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-3 ${
                      currentStep >= step.id
                        ? 'text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.id
                          ? 'bg-primary text-white'
                          : 'bg-background border-2 border-border'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Icon name="Check" size={20} />
                      ) : (
                        <Icon name={step.icon} size={20} />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-medium text-sm">{step.title}</div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-4 ${
                        currentStep > step.id ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-background rounded-lg border border-border shadow-card">
            {renderStepContent()}
          </div>

          {/* Action Buttons */}
          {currentStep > 1 && !importComplete && !isImporting && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
              >
                <Icon name="ArrowLeft" size={20} />
                <span>Previous Step</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
              >
                <Icon name="RotateCcw" size={20} />
                <span>Start Over</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ImportData;
