import React, { useState } from 'react';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';
import {
    Container,
    Content,
    Title,
} from './StyledComponents';

const UploadContainer = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  background-color: #63b3ed;
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4299e1;
  }
`;

const PendingFiles = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const FileName = styled.span`
  margin-right: 1rem;
`;

const UploadStatus = styled.span`
  font-size: 1.5rem;
`;

const UploadFiles = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

interface DuplicateFilesResponse {
    message: string;
    duplicates: string[];
}

const UploadPage: React.FC = () => {
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<{ file: File; success: boolean }[]>([]);
    const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);
    const [failedFiles, setFailedFiles] = useState<File[]>([]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newFiles = files.filter(file => !pendingFiles.some(pendingFile => pendingFile.name === file.name));
        const duplicates = files.filter(file => pendingFiles.some(pendingFile => pendingFile.name === file.name)).map(file => file.name);

        if (newFiles.length > 0) {
            setPendingFiles(prevPendingFiles => [...prevPendingFiles, ...newFiles]);
        }

        if (duplicates.length > 0) {
            setDuplicateFiles(prevDuplicateFiles => [...prevDuplicateFiles, ...duplicates]);
        }
    };

    const handleUpload = async () => {
        const uploadPromises = pendingFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('replays', file);

            try {
                const response = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                return { file, success: true };
            } catch (error) {
                console.error('Error uploading replay:', error);

                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 400) {
                    const duplicateFilesResponse = axiosError.response.data as DuplicateFilesResponse;
                    setDuplicateFiles(prevDuplicateFiles => [...prevDuplicateFiles, ...duplicateFilesResponse.duplicates]);
                    return { file, success: false, duplicate: true };
                }
                return { file, success: false, duplicate: false };
            }
        });

        const uploadResults = await Promise.all(uploadPromises);
        const successfulUploads = uploadResults.filter(result => result.success);
        const failedUploads = uploadResults.filter(result => !result.success && !result.duplicate).map(result => result.file);
        setUploadedFiles(prevUploadedFiles => [...prevUploadedFiles, ...successfulUploads]);
        setFailedFiles(prevFailedFiles => [...prevFailedFiles, ...failedUploads]);
        setPendingFiles([]);
    };

    return (
        <Container>
            <Content>
                <Title>Upload Replays</Title>
                <UploadContainer>
                    <UploadInput
                        type="file"
                        id="replayUpload"
                        accept=".replay"
                        multiple
                        onChange={handleFileSelect}
                    />
                    <UploadButton htmlFor="replayUpload">Choose Files</UploadButton>
                    {(pendingFiles.length > 0 || duplicateFiles.length > 0 || failedFiles.length > 0) && (
                        <PendingFiles>
                            <h3>Pending Files:</h3>
                            {pendingFiles.map((file, index) => (
                                <FileItem key={index}>
                                    <FileName>{file.name}</FileName>
                                    {duplicateFiles.includes(file.name) && (
                                        <UploadStatus>♻️</UploadStatus>
                                    )}
                                </FileItem>
                            ))}
                            {duplicateFiles.length > 0 && (
                                <div>
                                    <h4>Duplicate Files:</h4>
                                    {duplicateFiles.map((fileName, index) => (
                                        <FileItem key={index}>
                                            <FileName>{fileName}</FileName>
                                            <UploadStatus>♻️</UploadStatus>
                                        </FileItem>
                                    ))}
                                </div>
                            )}
                            {failedFiles.length > 0 && (
                                <div>
                                    <h4>Failed Files:</h4>
                                    {failedFiles.map((file, index) => (
                                        <FileItem key={index}>
                                            <FileName>{file.name}</FileName>
                                            <UploadStatus>❌</UploadStatus>
                                        </FileItem>
                                    ))}
                                </div>
                            )}
                            <UploadFiles onClick={handleUpload}>Upload</UploadFiles>
                        </PendingFiles>
                    )}
                    {uploadedFiles.length > 0 && (
                        <PendingFiles>
                            <h3>Uploaded Files:</h3>
                            {uploadedFiles.map((uploadedFile, index) => (
                                <FileItem key={index}>
                                    <FileName>{uploadedFile.file.name}</FileName>
                                    <UploadStatus>✅</UploadStatus>
                                </FileItem>
                            ))}
                        </PendingFiles>
                    )}
                </UploadContainer>
            </Content>
        </Container>
    );
};

export default UploadPage;
