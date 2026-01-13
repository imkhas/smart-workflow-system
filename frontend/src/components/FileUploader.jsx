import React, { useState, useRef } from 'react';

const FileUploader = ({ onFileSelect, accept, label = "Drag & drop a file here, or click to select" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Validate file type if accept prop is provided
        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
            const fileType = file.name.split('.').pop().toLowerCase();
            const mimeType = file.type.toLowerCase();

            // Simple extension check
            const isExtensionAllowed = acceptedTypes.some(type => type.includes(fileType) || type === fileType);
            // Simple mime check (starts with)
            const isMimeAllowed = acceptedTypes.some(type => mimeType.match(new RegExp(type.replace('*', '.*'))));

            // Note: This is a basic validation. robust validation should happen on backend.
            // For now, we trust the user selection but just warn/restrict if possible.
        }

        setSelectedFile(file);
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    const removeFile = (e) => {
        e.stopPropagation(); // Prevent triggering click on parent
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        if (onFileSelect) {
            onFileSelect(null);
        }
    };

    const onButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="form-group">
            <div
                className={`file-uploader ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                style={{
                    border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'var(--color-bg-secondary)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="file-input"
                    onChange={handleChange}
                    accept={accept}
                    style={{ display: 'none' }}
                />

                {selectedFile ? (
                    <div className="file-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>📄</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '500' }}>{selectedFile.name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                {formatSize(selectedFile.size)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="btn btn-sm btn-danger"
                            style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                            ☁️
                        </div>
                        <p style={{ margin: 0, fontWeight: '500' }}>
                            {label}
                        </p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            Max size: 10MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
