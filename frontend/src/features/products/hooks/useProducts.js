import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../api/productService.js';

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlHashtag = searchParams.get('hashtag') || 'Todos';

  const [products, setProducts] = useState([]);
  const [availableTags, setAvailableTags] = useState(['Todos']);
  const [activeTag, setActiveTag] = useState(urlHashtag);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await productService.getUniqueHashtags();
        if (tags && tags.length > 0) {
          setAvailableTags(['Todos', ...tags]);
        }
      } catch (err) {
        console.error('Error cargando hashtags:', err);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    setActiveTag(urlHashtag);
    setCurrentPage(1);
  }, [urlHashtag, urlSearch]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productService.getProducts({
          page: currentPage,
          limit: 15,
          hashtag: activeTag,
          search: urlSearch,
        });

        setProducts(result?.data || []);
        if (result?.pagination) {
          setPaginationInfo({
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
          });
        }
      } catch (err) {
        console.error('Error cargando catálogo:', err);
        setError('No fue posible cargar el catálogo.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [activeTag, urlSearch, currentPage]);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (tag === 'Todos') {
      newParams.delete('hashtag');
    } else {
      newParams.set('hashtag', tag);
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setActiveTag('Todos');
    setSearchParams({});
  };

  return {
    data: products,
    products,
    availableTags,
    activeTag,
    urlSearch,
    currentPage,
    paginationInfo,
    loading,
    error,
    setCurrentPage,
    handleTagClick,
    handleClearSearch,
    handleResetFilters,
  };
}
