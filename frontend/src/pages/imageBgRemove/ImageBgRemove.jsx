import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    // 파이썬 서버에 파일을 업로드하고 응답받기
    axios.post('http://localhost:8000/api/remove-background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setUploadedFiles(response.data.data)
    })
    .catch(error => {
      console.error('Error uploading files:', error);
    });
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h3>Uploaded Files:</h3>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <img src={file.url} alt={file.filename} style={{ maxWidth: '200px', maxHeight: '200px' }} />
            <p>{file.filename}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;
