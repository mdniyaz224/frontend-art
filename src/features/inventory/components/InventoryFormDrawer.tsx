import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Link,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useFormik, FormikProvider, Form, useField } from 'formik';
import * as yup from 'yup';
import FormikInput from '../../../components/common/FormikInput/FormikInput';
import FormikSelect from '../../../components/common/FormikSelect/FormikSelect';
import ImageDropzone from '../../../components/common/ImageDropzone/ImageDropzone';
import { TwoColGrid, FullWidthField } from '../../../components/common/FormGrid/FormGrid';
import { pastelPinkButtonSx } from '../../../theme/accents';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import { selectProductSubmitting, selectProductCategories } from '../inventorySelectors';
import { createProductThunk, updateProductThunk, fetchProductCategoriesThunk } from '../inventoryThunk';
import { PRODUCT_STATUS_OPTIONS, PRODUCT_UNIT_OPTIONS } from '../inventoryTypes';
import type {
  Product,
  ProductCreateFormValues,
  ProductStatus,
  ProductUnit,
  ProductUpdateFormValues,
} from '../inventoryTypes';
import type { SelectOption } from '../../../types/common';

const baseShape = {
  name: yup.string().trim().required('Name is required').max(150),
  category: yup.string().trim().required('Category is required').max(60),
  price: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  unit: yup
    .mixed<ProductUnit>()
    .oneOf(PRODUCT_UNIT_OPTIONS.map((u) => u.value))
    .required('Unit is required'),
  status: yup
    .mixed<ProductStatus>()
    .oneOf(PRODUCT_STATUS_OPTIONS.map((s) => s.value))
    .required('Status is required'),
  perishable: yup.boolean().required(),
  lowStockThreshold: yup
    .number()
    .typeError('Must be a number')
    .integer('Must be a whole number')
    .positive('Must be greater than 0')
    .optional(),

  image: yup.string().trim().optional(),
};

const createSchema = yup.object({
  ...baseShape,
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .integer('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .required('Quantity is required'),
});

const updateSchema = yup.object(baseShape);

const statusOptions: SelectOption[] = PRODUCT_STATUS_OPTIONS.map((s) => ({ label: s.label, value: s.value }));
const unitOptions: SelectOption[] = PRODUCT_UNIT_OPTIONS.map((u) => ({ label: u.label, value: u.value }));

const CategoryAutocomplete: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const [field, meta, helpers] = useField<string>('category');
  const categories = useAppSelector(selectProductCategories);

  return (
    <Box>
      <Typography component="label" htmlFor="category" variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
        Category
      </Typography>
      <Autocomplete
        freeSolo
        disabled={disabled}
        options={categories}
        value={field.value}
        onChange={(_, value) => helpers.setValue(value || '')}
        onInputChange={(_, value) => helpers.setValue(value)}
        onBlur={field.onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            id="category"
            name="category"
            placeholder="Select or enter a category"
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    </Box>
  );
};

interface InventoryFormDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
  onRequestAdjustStock?: (product: Product) => void;
}

const InventoryFormDrawer: React.FC<InventoryFormDrawerProps> = ({
  open,
  mode,
  product,
  onClose,
  onSuccess,
  onRequestAdjustStock,
}) => {
  const dispatch = useAppDispatch();
  const submitting = useAppSelector(selectProductSubmitting);

  useEffect(() => {
    if (open) dispatch(fetchProductCategoriesThunk());
  }, [dispatch, open]);

  const formik = useFormik<ProductCreateFormValues>({
    initialValues: {
      name: product?.name ?? '',
      category: product?.category ?? '',
      price: product?.price ?? ('' as unknown as number),
      quantity: product?.quantity ?? ('' as unknown as number),
      unit: product?.unit ?? 'piece',
      status: product?.status ?? 'active',
      perishable: product?.perishable ?? true,
      lowStockThreshold: product?.lowStockThreshold ?? ('' as unknown as number),
      image: product?.image ?? '',
    },
    validationSchema: mode === 'create' ? createSchema : updateSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const lowStockThreshold =
        values.lowStockThreshold === ('' as unknown as number) || values.lowStockThreshold == null
          ? undefined
          : Number(values.lowStockThreshold);
      const image = values.image ? values.image : undefined;

      if (mode === 'create') {
        const result = await dispatch(createProductThunk({ ...values, lowStockThreshold, image }));
        if (createProductThunk.fulfilled.match(result)) {
          formik.resetForm();
          onSuccess?.();
          onClose();
        }
        return;
      }

      if (!product) return;
      const updateData: ProductUpdateFormValues = {
        name: values.name,
        category: values.category,
        price: values.price,
        unit: values.unit,
        status: values.status,
        perishable: values.perishable,
        lowStockThreshold,
        image,
      };
      const result = await dispatch(updateProductThunk({ id: product.id, data: updateData }));
      if (updateProductThunk.fulfilled.match(result)) {
        onSuccess?.();
        onClose();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const currentQuantity =
    mode === 'create' ? Number(formik.values.quantity) || 0 : (product?.quantity ?? 0);
  const stockLabel = currentQuantity > 0 ? 'In Stock' : 'Out of Stock';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 440 },
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            p: 3,
          },
        },
      }}
    >
      <FormikProvider value={formik}>
        <Form noValidate style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {mode === 'create' ? 'Add New Inventory' : 'Edit New Inventory'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
            <Box sx={{ mb: 3 }}>
              <ImageDropzone
                value={formik.values.image}
                onChange={(url) => formik.setFieldValue('image', url)}
                disabled={submitting}
              />
            </Box>

            <TwoColGrid>
              <FormikInput<ProductCreateFormValues>
                name="name"
                label="Name"
                placeholder="Enter inventory name"
                disabled={submitting}
              />
              <CategoryAutocomplete disabled={submitting} />

              {mode === 'create' ? (
                <FormikInput<ProductCreateFormValues>
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  disabled={submitting}
                />
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
                    Quantity
                  </Typography>
                  <TextField fullWidth disabled value={currentQuantity} />
                  {onRequestAdjustStock && product && (
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      underline="always"
                      sx={{ mt: 0.75, display: 'inline-block' }}
                      onClick={() => onRequestAdjustStock(product)}
                    >
                      Adjust Stock
                    </Link>
                  )}
                </Box>
              )}

              <Box>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
                  Stock
                </Typography>
                <TextField fullWidth disabled value={stockLabel} />
              </Box>

              <FormikSelect<ProductCreateFormValues>
                name="status"
                label="Status"
                options={statusOptions}
                disabled={submitting}
              />
              <FormikSelect<ProductCreateFormValues>
                name="unit"
                label="Unit"
                options={unitOptions}
                disabled={submitting}
              />

              <FormikInput<ProductCreateFormValues>
                name="price"
                label="Price"
                type="number"
                placeholder="Enter inventory price"
                disabled={submitting}
              />
              <FormikInput<ProductCreateFormValues>
                name="lowStockThreshold"
                label="Low Stock Alert"
                type="number"
                placeholder="Default: 10"
                disabled={submitting}
              />

              <FullWidthField>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
                  Perishable
                </Typography>
                <RadioGroup
                  row
                  value={formik.values.perishable ? 'yes' : 'no'}
                  onChange={(e) => formik.setFieldValue('perishable', e.target.value === 'yes')}
                >
                  <FormControlLabel value="yes" control={<Radio disabled={submitting} />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled={submitting} />} label="No" />
                </RadioGroup>
              </FullWidthField>
            </TwoColGrid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={handleClose}
              disabled={submitting}
              sx={{ textDecoration: 'underline', '&:hover': { textDecoration: 'underline' } }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={pastelPinkButtonSx}
            >
              Save
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Drawer>
  );
};

export default InventoryFormDrawer;
