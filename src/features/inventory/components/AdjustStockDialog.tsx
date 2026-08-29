// ============================================================
// AdjustStockDialog — the only way to change a product's quantity
// ============================================================
// Not in the Figma — a necessary, disclosed addition. be-boiler's
// updateProductSchema never accepts a quantity key; every stock change
// must go through POST /:id/adjustments with a reason, so this dialog is
// the sole UI entry point for quantity changes.

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import { selectProductAdjusting } from '../inventorySelectors';
import { adjustStockThunk } from '../inventoryThunk';
import { pastelPinkButtonSx } from '../../../theme/accents';
import type { Product } from '../inventoryTypes';

interface AdjustStockDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdjustStockDialog: React.FC<AdjustStockDialogProps> = ({ open, product, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const adjusting = useAppSelector(selectProductAdjusting);

  const [direction, setDirection] = useState<'add' | 'remove'>('add');
  const [magnitude, setMagnitude] = useState('');
  const [reason, setReason] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuantity = product?.quantity ?? 0;
  const magnitudeNumber = Number(magnitude) || 0;
  const delta = direction === 'add' ? magnitudeNumber : -magnitudeNumber;
  const newQuantity = currentQuantity + delta;

  const canSubmit = product && magnitudeNumber > 0 && reason.trim().length > 0 && newQuantity >= 0;

  const handleClose = () => {
    setDirection('add');
    setMagnitude('');
    setReason('');
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!product || !canSubmit) return;
    setSubmitError(null);
    const result = await dispatch(adjustStockThunk({ id: product.id, delta, reason: reason.trim() }));
    if (adjustStockThunk.fulfilled.match(result)) {
      onSuccess?.();
      handleClose();
    } else {
      setSubmitError((result.payload as string) || 'Failed to adjust stock');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Adjust Stock</DialogTitle>
      <DialogContent>
        {product && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.name} — current quantity: <strong>{currentQuantity}</strong>
          </Typography>
        )}

        <ToggleButtonGroup
          value={direction}
          exclusive
          fullWidth
          size="small"
          onChange={(_, value) => value && setDirection(value)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="add">Add stock</ToggleButton>
          <ToggleButton value="remove">Remove stock</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          fullWidth
          type="number"
          label="Quantity"
          placeholder="Enter amount"
          value={magnitude}
          onChange={(e) => setMagnitude(e.target.value)}
          sx={{ mb: 2 }}
          error={newQuantity < 0}
          helperText={newQuantity < 0 ? 'This would result in negative stock' : undefined}
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Reason"
          placeholder="Why is this stock being adjusted?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }}>
          <Typography variant="body2">
            New stock: <strong>{Math.max(newQuantity, 0)}</strong>
          </Typography>
        </Box>

        {submitError && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {submitError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={adjusting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit || adjusting}
          startIcon={adjusting ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={pastelPinkButtonSx}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdjustStockDialog;
