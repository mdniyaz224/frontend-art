// ============================================================
// ImageDropzone — drag-and-drop / click-to-browse image upload
// ============================================================
// Shared by the Staff and Inventory Add/Edit drawers. Uploads immediately
// on selection via POST /api/v1/uploads/image and reports back the
// resulting URL — callers just bind `value`/`onChange` to their existing
// profilePicture/image form field, same as the old paste-a-URL flow.

import React, { useCallback, useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, Link, Typography } from '@mui/material';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import { uploadImage } from '../../../services/uploadApi';
import { getApiErrorMessage } from '../../../utils/helpers';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — matches the backend's multer limit

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  height?: number;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ value, onChange, disabled, height = 140 }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG, WEBP, and GIF images are allowed');
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError('Image must be 5MB or smaller');
        return;
      }

      setError(null);
      setUploading(true);
      try {
        const url = await uploadImage(file);
        onChange(url);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled || uploading) return;
    void handleFile(event.dataTransfer.files[0]);
  };

  return (
    <Box>
      <Box
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !uploading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          position: 'relative',
          cursor: disabled || uploading ? 'default' : 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Avatar
          variant="rounded"
          src={value || undefined}
          sx={{
            width: '100%',
            height,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '2px dashed',
            borderColor: dragging ? 'primary.main' : 'transparent',
            transition: 'border-color 0.15s ease',
          }}
        >
          <ImageRoundedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
        </Avatar>
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.4)',
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        hidden
        disabled={disabled || uploading}
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          underline="always"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {value ? 'Change Profile Picture' : 'Upload an image'}
        </Link>
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageDropzone;
