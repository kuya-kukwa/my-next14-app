import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ErrorIcon from '@mui/icons-material/Error';

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
    <Box className="profile-avatar-upload">
      {/* Avatar Preview */}
      <Box className="profile-avatar-preview">
        {displayUrl ? (
          <Avatar
            src={displayUrl}
            alt="Avatar preview"
            className="profile-avatar-preview-image"
          >
            {initials}
          </Avatar>
        ) : (
          <Avatar className="profile-avatar-preview-placeholder">
            {initials}
          </Avatar>
        )}
        {isUploading && (
          <Box className="profile-avatar-upload-overlay">
            <CircularProgress size={40} sx={{ color: '#fff' }} />
          </Box>
        )}
      </Box>

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
        <Box className="profile-avatar-upload-progress">
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ borderRadius: 1, height: 6 }}
          />
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Dropzone */}
      <Box
        {...getRootProps()}
        className={`profile-avatar-dropzone ${
          isDragActive ? 'profile-avatar-dropzone-active' : ''
        } ${isUploading ? 'profile-avatar-dropzone-disabled' : ''}`}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon className="profile-avatar-dropzone-icon" />
        {isDragActive ? (
          <Typography variant="body2" className="profile-avatar-dropzone-text">
            Drop your image here
          </Typography>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              className="profile-avatar-dropzone-text"
            >
              Drag & drop an image, or click to browse
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
            >
              JPG, PNG, WEBP or GIF (max 5MB)
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Box className="profile-avatar-upload-error">
          <ErrorIcon fontSize="small" />
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Upload Button */}
      {!isUploading && (
        <Button
          variant="outlined"
          component="label"
          fullWidth
          disabled={isUploading}
          sx={{ mt: 1 }}
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
