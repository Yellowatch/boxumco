import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface UseAxiosResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useAxios = <T,>(url: string, options = {}): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance({ url, ...options });
        setData(response.data as T);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

export default useAxios;
