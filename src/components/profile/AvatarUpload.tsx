import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
      {/* Avatar Preview */}
      <Box className="avatar-upload-preview">
        <Box className="avatar-upload-preview-image">
          {displayUrl ? (
            <Avatar
              src={displayUrl}
              alt="Avatar preview"
              sx={{ width: 120, height: 120 }}
            >
              {initials}
            </Avatar>
          ) : (
            <Avatar sx={{ width: 120, height: 120 }}>{initials}</Avatar>
          )}
        </Box>
        <Box className="avatar-upload-info">
          <Typography className="avatar-upload-name">
            {userName || 'User'}
          </Typography>
          <Typography className="avatar-upload-caption">
            Click or drag to update
          </Typography>
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

      {/* Dropzone */}
      <Box className="avatar-upload-dropzone-container">
        <Box
          {...getRootProps()}
          className={`avatar-dropzone ${isDragActive ? 'dragActive' : ''} ${
            error ? 'error' : ''
          }`}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon className="avatar-upload-dropzone-icon" />
          {isDragActive ? (
            <Typography variant="body2" className="avatar-upload-dropzone-text">
              Drop your image here
            </Typography>
          ) : (
            <Box>
              <Typography
                variant="body2"
                className="avatar-upload-dropzone-text"
              >
                Drag & drop an image, or click to browse
              </Typography>
              <Typography
                variant="caption"
                className="avatar-upload-dropzone-text"
              >
                JPG, PNG, WEBP or GIF (max 5MB)
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" className="profile-alert">
          {error}
        </Alert>
      )}

      {/* Upload Button */}
      {!isUploading && (
        <Button
          variant="outlined"
          component="label"
          fullWidth
          disabled={isUploading}
        >
          Choose File
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > MAX_FILE_SIZE) {
                  setError('File is too large. Maximum size is 5MB.');
                  return;
                }
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
                onUpload(file);
              }
            }}
          />
        </Button>
      )}
    </Box>
  );
};
