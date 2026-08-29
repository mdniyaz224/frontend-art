// ============================================================
// PageTitleContext — Dynamic Top App Bar Title + Back Navigation
// ============================================================
// The Staff Management design's top bar always shows "‹ <page title>"
// instead of the usual sidebar-toggle hamburger — e.g. "Staff Management"
// on the list page, the staff member's name on their detail page. Pages
// opt in via `usePageTitle(title)`; when no page has set one, the Header
// falls back to its normal hamburger toggle.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface PageTitleContextValue {
  title: string | null;
  setTitle: (title: string | null) => void;
}

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string | null>(null);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>;
};

const usePageTitleContext = (): PageTitleContextValue => {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error('usePageTitleContext must be used within PageTitleProvider');
  return ctx;
};

/** Header-only: reads the current title (null when no page has set one). */
export const usePageTitleValue = (): string | null => usePageTitleContext().title;

/**
 * Pages call this to show "‹ {title}" in the top app bar in place of the
 * sidebar-toggle hamburger. Clears itself on unmount so navigating to a
 * page that doesn't opt in falls back to the default hamburger.
 */
export const usePageTitle = (title: string | null): void => {
  const { setTitle } = usePageTitleContext();
  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);
};
