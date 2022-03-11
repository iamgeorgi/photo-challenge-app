import { useEffect, useState } from 'react';


const useFetch = (url, options) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setData(data);
        }
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error }
}


export default useFetch;
