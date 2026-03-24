import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const KEY = '@reports';
const ReportsContext = createContext(undefined);

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    storageGet(KEY).then((v) => setReports(v || []));
  }, []);

  const addReport = async (slug, name, reason, detail, userEmail) => {
    const report = {
      id: Date.now().toString(),
      slug,
      name,
      reason,
      detail,
      user: userEmail || 'Ẩn danh',
      createdAt: new Date().toISOString(),
    };
    const updated = [report, ...reports];
    setReports(updated);
    await storageSet(KEY, updated);
  };

  const deleteReport = async (id) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    await storageSet(KEY, updated);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, deleteReport }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReportsContext must be used within ReportsProvider');
  return ctx;
};
