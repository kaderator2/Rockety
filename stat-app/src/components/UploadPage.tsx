import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #ffffff;
  flex: 1;
  background: linear-gradient(45deg, #ff7f50, #6a5acd, #00ced1, #00ff7f);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

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

const UploadedFiles = styled.div`
  margin-top: 2rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FileName = styled.span`
  margin-left: 1rem;
`;

const UploadPage: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setUploadedFiles([...uploadedFiles, ...files]);
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
                        onChange={handleFileUpload}
                    />
                    <UploadButton htmlFor="replayUpload">Choose Files</UploadButton>
                    {uploadedFiles.length > 0 && (
                        <UploadedFiles>
                            {uploadedFiles.map((file, index) => (
                                <FileItem key={index}>
                                    <FileName>{file.name}</FileName>
                                </FileItem>
                            ))}
                        </UploadedFiles>
                    )}
                </UploadContainer>
            </Content>
        </Container>
    );
};

export default UploadPage;
