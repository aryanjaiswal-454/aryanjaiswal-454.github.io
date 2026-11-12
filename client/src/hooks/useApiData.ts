import { useEffect, useState } from "react";
import { fetchWithFallback } from "../services/api";

export function useApiData<T>(path: string, fallback: T) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchWithFallback(path, fallback)
      .then((result) => {
        if (active) setData(result);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path, fallback]);

  return { data, loading };
}
