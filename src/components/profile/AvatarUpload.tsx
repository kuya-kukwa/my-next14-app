import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export interface AvatarUploadProps {
  currentUrl?: string | null;
  userName?: string;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

/**
 * Avatar upload component with drag-drop support
 * Handles file validation, preview, and upload progress
 */
export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentUrl,
  userName = '',
  onUpload,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File is too large. Maximum size is 5MB.');
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload JPG, PNG, WEBP, or GIF.');
        } else {
          setError('Invalid file. Please try another image.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload file
        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
  });

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayUrl = preview || currentUrl;
  const initials = getInitials(userName);

  return (
    <Box className="avatar-upload-container">
      {/* Avatar Preview with In-Circle Dropzone */}
      <Box className="avatar-upload-preview">
        <Box
          {...getRootProps()}
          className="avatar-upload-preview-image"
          role="button"
          aria-label="Upload profile picture"
          tabIndex={0}
          aria-describedby={error ? 'avatar-upload-error' : undefined}
        >
          <input {...getInputProps()} />

          {/* Avatar */}
          {displayUrl ? (
            <Avatar
              src={displayUrl}
              alt="Avatar preview"
              sx={{ width: 160, height: 160 }}
            >
              {initials}
            </Avatar>
          ) : (
            <Avatar sx={{ width: 160, height: 160 }}>{initials}</Avatar>
          )}

          {/* Hover Overlay */}
          {!isUploading && (
            <Box
              className={`avatar-upload-hover-overlay ${
                isDragActive ? 'active' : ''
              }`}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: '2.5rem',
                  color: 'white',
                  marginBottom: '8px',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  marginBottom: '4px',
                  textAlign: 'center',
                }}
              >
                {isDragActive ? 'Drop to upload' : 'Update photo'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                }}
              ></Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
        <Box className="avatar-upload-progress">
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            className="avatar-upload-progress-bar"
          />
          <Typography variant="caption" className="avatar-upload-progress-text">
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          className="profile-alert"
          id="avatar-upload-error"
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};
