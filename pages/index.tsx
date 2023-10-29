import React, { useState, useEffect } from 'react';

const TypeAheadSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedQuery = useDebounce(query, 50);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://type-ahead.2.sg-1.fl0.io/search?query=${debouncedQuery}`);
        const responseJson = await response.json();
        console.log(responseJson);
        setResults(responseJson.html_results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedQuery) {
      fetchData();
    }
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className='text-xl p-2 my-4 dark:text-blue-400'>Search Movie as you type. <span className='text-sm'>Fuzzy search enabled</span> </h2>
      <input
        type="text"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mb-4 w-96 rounded-md dark:text-black"
      />
      {/* {loading && <p>Loading...</p>} */}
      <ul className="h-full overflow-y-auto bg-gray-100 w-90 rounded-md pl-2 dark:text-black">
        {results.map((result, idx) => (
          <li key={idx} className="border-b p-2 overflow-x-scroll">
            <span style={{whiteSpace: 'nowrap'}}  dangerouslySetInnerHTML={{ __html: result }}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default TypeAheadSearch;
