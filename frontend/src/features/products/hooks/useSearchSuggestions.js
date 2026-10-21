import { useState, useEffect } from 'react';
import { productService } from '../api/productService.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

export function useSearchSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedTerm = useDebounce(searchTerm, 250);

  useEffect(() => {
    const trimmed = debouncedTerm.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await productService.getSearchSuggestions(trimmed);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error buscando sugerencias:', err);
        setError('Error al buscar sugerencias');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return {
    data: suggestions,
    searchTerm,
    setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    loading,
    error,
    clearSearch,
  };
}
