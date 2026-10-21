import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (err) {
      setError({ message: getErrorMessage(err), status: err.response?.status });
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
}