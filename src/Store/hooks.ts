// ============================================================
// Typed Redux Hooks
// ============================================================

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Typed version of useDispatch — use this throughout the app
 * instead of plain useDispatch.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed version of useSelector — use this throughout the app
 * instead of plain useSelector.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
