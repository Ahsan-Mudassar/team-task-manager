import { useContext } from 'react';
import { TeamsContext } from '../context/TeamsContext';

export default function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeams must be used inside TeamsProvider');
  return ctx;
}