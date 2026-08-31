import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface PageTitleContextValue {
  title: string | null;
  showBack: boolean;
  setTitle: (title: string | null, showBack?: boolean) => void;
}

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitleState] = useState<string | null>(null);
  const [showBack, setShowBack] = useState(false);
  const setTitle = useCallback((nextTitle: string | null, nextShowBack = false) => {
    setTitleState(nextTitle);
    setShowBack(nextShowBack);
  }, []);
  const value = useMemo(() => ({ title, showBack, setTitle }), [title, showBack, setTitle]);
  return <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>;
};

const usePageTitleContext = (): PageTitleContextValue => {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error('usePageTitleContext must be used within PageTitleProvider');
  return ctx;
};

export const usePageTitleValue = (): { title: string | null; showBack: boolean } => {
  const { title, showBack } = usePageTitleContext();
  return { title, showBack };
};

/**
 * Sets the header title. `showBack` should only be true for a genuine sub-page
 * reached by drilling into another page (e.g. a detail view) — the header then
 * shows a back-chevron that navigates up, instead of its usual hamburger toggle.
 * Top-level pages reached directly from the sidebar should leave it false.
 */
export const usePageTitle = (title: string | null, showBack = false): void => {
  const { setTitle } = usePageTitleContext();
  useEffect(() => {
    setTitle(title, showBack);
    return () => setTitle(null);
  }, [title, showBack, setTitle]);
};
