import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../api/client';
import { Sparkles, FileUp, X, FileText, Image as ImageIcon, Plane, Hotel, CheckCircle, RefreshCw, Map } from 'lucide-react';
import './Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, generating, error
  const [error, setError] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setError(null);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setUploadProgress(30);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload File
      setUploadProgress(60);
      const uploadRes = await fetchClient('/api/documents/upload', {
        body: formData,
      });

      if (uploadRes && uploadRes.document) {
        setUploadProgress(100);
        setDocumentId(uploadRes.document._id);
        
        // 2. Generate Itinerary
        setStatus('generating');
        const generateRes = await fetchClient(`/itinerary/generate/${uploadRes.document._id}`, {
          method: 'POST'
        });

        if (generateRes && generateRes.itinerary) {
          navigate(`/itinerary/${generateRes.itinerary._id}`);
        }
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to process file');
      setUploadProgress(0);
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FileText size={24} />;
    if (filename.toLowerCase().endsWith('.pdf')) return <FileText size={24} />;
    return <ImageIcon size={24} />;
  };

  return (
    <div className="upload-container">
      <main className="upload-main">
        <div className="upload-grid">
          
          {/* Left Column */}
          <div className="upload-left">
            <h1 className="upload-title">Sync your journey</h1>
            <p className="upload-subtitle">
              Drag and drop your flight tickets and hotel vouchers. Our AI will handle the organization.
            </p>

            <div 
              className="dropzone"
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <div className="dropzone-icon">
                <FileUp size={28} strokeWidth={2.5} />
              </div>
              <h2 className="dropzone-title">Select file to upload</h2>
              <p className="dropzone-desc">or click to choose PDFs, JPEGs, or PNGs</p>
              <button className="btn-browse" type="button">Browse Files</button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleFileChange}
              />
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '16px', padding: '12px', backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
                {error}
              </div>
            )}

            {file && (
              <div className="upload-files">
                <div className="file-item">
                  <div className={`file-icon ${file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'img'}`}>
                    {getFileIcon(file.name)}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className={`file-status ${status === 'uploading' || status === 'generating' ? 'progress' : ''}`}>
                      {status === 'idle' ? 'Ready to upload' : 
                       status === 'uploading' ? `Uploading... ${uploadProgress}%` :
                       status === 'generating' ? 'Analyzing with AI...' : 
                       status === 'error' ? 'Failed' : 'Complete'}
                    </div>
                    {(status === 'uploading' || status === 'generating') && (
                      <div className="file-progress-bar">
                        <div className="file-progress-inner" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                  {status === 'idle' && (
                    <button className="file-action" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                      <X size={20} />
                    </button>
                  )}
                </div>

                {status === 'idle' && (
                  <button 
                    className="btn-add-all" 
                    style={{ marginTop: '16px' }}
                    onClick={handleUpload}
                  >
                    Start Upload
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column (AI Panel) */}
          <div className="ai-panel">
            <div className="ai-panel-title">
              <Sparkles size={24} /> AI Processing Intelligence
            </div>
            
            <div className="ai-panel-header">
              <span className="left">
                {status === 'generating' ? 'ANALYZING DOCUMENTS...' : 'WAITING FOR UPLOAD...'}
              </span>
              <span className="right">Tourify AI Agent</span>
            </div>
            <div className="ai-panel-progress">
              <div className="ai-panel-progress-inner" style={{ width: status === 'generating' ? '75%' : '0%', transition: 'width 2s ease' }}></div>
            </div>

            <div className="extracted-cards" style={{ opacity: status === 'generating' ? 0.7 : 0.3, transition: 'opacity 0.5s' }}>
              {/* Card 1 */}
              <div className="extracted-card flight">
                <div className="card-top">
                  <div className="card-type flight">
                    <Plane size={14} /> Flight Found
                  </div>
                  <CheckCircle size={16} className="card-icon-right flight" />
                </div>
                <div className="card-title">Extracting Flight Info...</div>
                <div className="card-details">
                  <span>Scanning...</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="extracted-card hotel">
                <div className="card-top">
                  <div className="card-type hotel">
                    <Hotel size={14} /> Hotel Extracted
                  </div>
                  <div className="card-icon-right hotel"></div>
                </div>
                <div className="card-title">Extracting Hotel Info...</div>
                <div className="card-details">
                  <span>Scanning...</span>
                </div>
              </div>
            </div>

            <div className="scanning-box" style={{ opacity: status === 'generating' ? 1 : 0.3 }}>
              <RefreshCw size={16} className={status === 'generating' ? 'spin' : ''} /> 
              {status === 'generating' ? 'Scanning additional pages...' : 'Ready to scan'}
            </div>

            <button className="btn-add-all" disabled style={{ opacity: 0.5 }}>
              <Map size={18} /> Generating Itinerary...
            </button>
            <div className="items-identified">
              AI model standing by
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
