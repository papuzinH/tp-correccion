import { useMemo, useState } from 'react';
import { Entrega } from '../types';

export const useVersions = (entrega: Entrega) => {
  const [showHistory, setShowHistory] = useState(false);

  const sortedVersions = useMemo(() =>
    [...entrega.versiones].sort((a, b) =>
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    ),
    [entrega.versiones]
  );

  const versionsToShow = showHistory ? sortedVersions : [sortedVersions[sortedVersions.length - 1]];
  const previousVersionsCount = sortedVersions.length - 1;

  const toggleHistory = () => setShowHistory(!showHistory);

  return {
    versionsToShow,
    previousVersionsCount,
    showHistory,
    toggleHistory,
  };
};