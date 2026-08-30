import React from 'react';
import { Drawer, Box, Typography, IconButton, Button, CircularProgress } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useFormik, FormikProvider, Form } from 'formik';
import * as yup from 'yup';
import FormikInput from '../../../components/common/FormikInput/FormikInput';
import FormikSelect from '../../../components/common/FormikSelect/FormikSelect';
import FormikDatePicker from '../../../components/common/FormikDatePicker/FormikDatePicker';
import FormikTimePicker from '../../../components/common/FormikTimePicker/FormikTimePicker';
import ImageDropzone from '../../../components/common/ImageDropzone/ImageDropzone';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import { selectStaffSubmitting } from '../staffSelectors';
import { createStaffThunk, updateStaffThunk } from '../staffThunk';
import { STAFF_ROLE_OPTIONS } from '../staffTypes';
import type { Staff, StaffCreateFormValues, StaffUpdateFormValues } from '../staffTypes';
import type { SelectOption } from '../../../types/common';
import { TwoColGrid, FullWidthField } from './StaffForm.styles';
import { staffAccentButtonSx } from '../staffAccent';

const PHONE_REGEX = /^\+?[0-9]{7,15}$/;
const SHIFT_TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MIN_STAFF_AGE = 16;

const baseShape = {
  name: yup.string().trim().required('Full name is required').max(100),
  email: yup.string().trim().email('Invalid email address').required('Email is required'),
  phone: yup
    .string()
    .trim()
    .matches(PHONE_REGEX, 'Invalid phone number')
    .required('Phone number is required'),
  salary: yup
    .number()
    .typeError('Salary must be a number')
    .min(0, 'Salary cannot be negative')
    .required('Salary is required'),
  dateOfBirth: yup
    .string()
    .nullable()
    .required('Date of birth is required')
    .test(
      'is-past',
      'Date of birth must be a valid past date',
      (value) => !value || new Date(value).getTime() <= Date.now(),
    )
    .test('min-age', `Staff must be at least ${MIN_STAFF_AGE}`, (value) => {
      if (!value) return true;
      const age = (Date.now() - new Date(value).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= MIN_STAFF_AGE;
    }),
  shiftStart: yup
    .string()
    .trim()
    .matches(SHIFT_TIME_REGEX, 'Enter a valid shift start time')
    .required('Shift start timing is required'),
  shiftEnd: yup
    .string()
    .trim()
    .matches(SHIFT_TIME_REGEX, 'Enter a valid shift end time')
    .required('Shift end timing is required'),
  address: yup.string().trim().max(250).optional(),
  additionalDetails: yup.string().trim().max(1000).optional(),
  // No .url() here — yup's URL regex rejects bare-hostname URLs like
  // http://localhost:5000/..., which every local dev environment uses.
  profilePicture: yup.string().trim().optional(),
};

// password and role are create-only — the update route rejects both fields.
const createSchema = yup.object({
  ...baseShape,
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/\d/, 'Must contain a number')
    .matches(/[^a-zA-Z0-9]/, 'Must contain a special character')
    .required('Password is required'),
  role: yup
    .mixed<StaffCreateFormValues['role']>()
    .oneOf(STAFF_ROLE_OPTIONS.map((r) => r.value))
    .required('Role is required'),
});

const updateSchema = yup.object(baseShape);

const roleOptions: SelectOption[] = STAFF_ROLE_OPTIONS.map((r) => ({ label: r.label, value: r.value }));

interface StaffFormDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  staff?: Staff | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const StaffFormDrawer: React.FC<StaffFormDrawerProps> = ({ open, mode, staff, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const submitting = useAppSelector(selectStaffSubmitting);

  const formik = useFormik<StaffCreateFormValues>({
    initialValues: {
      name: staff?.name ?? '',
      email: staff?.email ?? '',
      password: '',

      role: staff?.role ?? ('' as StaffCreateFormValues['role']),
      phone: staff?.phone ?? '',
      salary: staff?.salary ?? ('' as unknown as number),
      dateOfBirth: staff?.dateOfBirth ?? null,
      shiftStart: staff?.shiftStart ?? '',
      shiftEnd: staff?.shiftEnd ?? '',
      address: staff?.address ?? '',
      additionalDetails: staff?.additionalDetails ?? '',
      profilePicture: staff?.profilePicture ?? '',
    },
    validationSchema: mode === 'create' ? createSchema : updateSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (mode === 'create') {
        const result = await dispatch(createStaffThunk(values));
        if (createStaffThunk.fulfilled.match(result)) {
          formik.resetForm();
          onSuccess?.();
          onClose();
        }
        return;
      }

      if (!staff) return;
      const updateData: StaffUpdateFormValues = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        salary: values.salary,
        dateOfBirth: values.dateOfBirth,
        shiftStart: values.shiftStart,
        shiftEnd: values.shiftEnd,
        address: values.address,
        additionalDetails: values.additionalDetails,
        profilePicture: values.profilePicture,
      };
      const result = await dispatch(updateStaffThunk({ id: staff.id, data: updateData }));
      if (updateStaffThunk.fulfilled.match(result)) {
        onSuccess?.();
        onClose();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

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
              {mode === 'create' ? 'Add Staff' : 'Edit Staff'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
            <Box sx={{ mb: 3 }}>
              <ImageDropzone
                value={formik.values.profilePicture}
                onChange={(url) => formik.setFieldValue('profilePicture', url)}
                disabled={submitting}
              />
            </Box>

            <TwoColGrid>
              <FormikInput<StaffCreateFormValues>
                name="name"
                label="Full Name"
                placeholder="Enter full name"
                disabled={submitting}
              />
              <FormikInput<StaffCreateFormValues>
                name="email"
                label="Email"
                type="email"
                placeholder="Enter email address"
                disabled={submitting}
              />

              {mode === 'create' ? (
                <>
                  <FormikInput<StaffCreateFormValues>
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    disabled={submitting}
                  />
                  <FormikSelect<StaffCreateFormValues>
                    name="role"
                    label="Role"
                    options={roleOptions}
                    placeholder="Select role"
                    disabled={submitting}
                  />
                </>
              ) : null}

              <FormikInput<StaffCreateFormValues>
                name="phone"
                label="Phone number"
                placeholder="Enter phone number"
                disabled={submitting}
              />
              <FormikInput<StaffCreateFormValues>
                name="salary"
                label="Salary"
                type="number"
                placeholder="Enter Salary"
                disabled={submitting}
              />

              <FormikDatePicker<StaffCreateFormValues>
                name="dateOfBirth"
                label="Date of birth"
                placeholder="Enter date of birth"
                disabled={submitting}
              />
              <FormikTimePicker<StaffCreateFormValues>
                name="shiftStart"
                label="Shift start timing"
                placeholder="Enter start timing"
                disabled={submitting}
              />
              <FormikTimePicker<StaffCreateFormValues>
                name="shiftEnd"
                label="Shift end timing"
                placeholder="Enter end timing"
                disabled={submitting}
              />

              <FullWidthField>
                <FormikInput<StaffCreateFormValues>
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  disabled={submitting}
                />
              </FullWidthField>
              <FullWidthField>
                <FormikInput<StaffCreateFormValues>
                  name="additionalDetails"
                  label="Additional details"
                  placeholder="Enter additional details"
                  multiline
                  rows={3}
                  disabled={submitting}
                />
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
              sx={staffAccentButtonSx}
            >
              Confirm
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Drawer>
  );
};

export default StaffFormDrawer;
