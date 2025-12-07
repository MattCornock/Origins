import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { parseCSVData } from '../utils/dataTypes';

const FileUpload = ({ onDataLoaded }) => {
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    if (fileExtension === 'csv') {
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const jobs = parseCSVData(results.data);
            onDataLoaded(jobs);
          } catch (error) {
            console.error('Error parsing CSV data:', error);
            alert('Error parsing CSV file. Please check the file format.');
          }
        },
        error: (error) => {
          console.error('Error reading CSV file:', error);
          alert('Error reading CSV file.');
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      // Parse Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          const jobs = parseCSVData(jsonData);
          onDataLoaded(jobs);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          alert('Error parsing Excel file. Please check the file format.');
        }
      };
      reader.onerror = () => {
        alert('Error reading Excel file.');
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
    }
  }, [onDataLoaded]);

  return (
    <div className="file-upload-container">
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Upload size={48} />
          </div>
          <h2 className="empty-state-title">Upload Production Schedule Data</h2>
          <p className="empty-state-description">
            Upload your factPlan data file (CSV or Excel format) to begin analyzing your production schedule.
          </p>
          <p className="empty-state-description" style={{ fontSize: '12px', marginBottom: '20px' }}>
            Expected columns: ProductionLine, LineStatus, ProductCode, WorkOrder, Start, Finish, Tonnage
          </p>
          <label htmlFor="file-input" className="button button-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
            Choose File
          </label>
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
