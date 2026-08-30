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

export const usePageTitleValue = (): string | null => usePageTitleContext().title;

export const usePageTitle = (title: string | null): void => {
  const { setTitle } = usePageTitleContext();
  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);
};
