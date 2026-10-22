import { createContext, useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import { getTeams } from '../api/team.api';

export const TeamsContext = createContext(null);

export function TeamsProvider({ children }) {
  const { data, loading, error, reload } = useFetch(getTeams, []);

  const value = useMemo(() => ({
    teams: data ?? [],
    loading: loading && data === null,
    error,
    reload
  }), [data, loading, error, reload]
  );

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  )
}