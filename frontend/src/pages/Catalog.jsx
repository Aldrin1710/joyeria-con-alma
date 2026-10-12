import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../api/productService';
import { FaTimes, FaSearch } from 'react-icons/fa';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlHashtag = searchParams.get('hashtag') || 'Todos';

  const [products, setProducts] = useState([]);
  const [availableTags, setAvailableTags] = useState(['Todos']);
  const [activeTag, setActiveTag] = useState(urlHashtag);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await productService.getUniqueHashtags();
        if (tags && tags.length > 0) {
          setAvailableTags(['Todos', ...tags]);
        }
      } catch (error) {
        console.error('Error cargando hashtags:', error);
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
        setIsLoading(true);
        const result = await productService.getProducts({
          page: currentPage,
          limit: 15, // Paginación estricta de 15 piezas
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
      } catch (error) {
        console.error('Error cargando catálogo:', error);
      } finally {
        setIsLoading(false);
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

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 className="section-title">Nuestro Catálogo</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Explora nuestra colección. Utiliza las etiquetas para encontrar la pieza ideal.
      </p>

      {/* Indicador de filtro activo por búsqueda si existe */}
      {urlSearch && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
            Resultados para: <strong>"{urlSearch}"</strong>
          </span>
          <button
            onClick={handleClearSearch}
            className="btn-quick-wa"
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
          >
            <FaTimes size={12} /> Limpiar filtro
          </button>
        </div>
      )}

      {/* Filtros Hashtags Dinámicos */}
      <div className="hashtags-container" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="hashtag"
            style={{
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTag === tag ? 'var(--gold-primary)' : '#222',
              color: activeTag === tag ? '#000' : 'var(--gold-light)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Estado de Carga */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>Consultando catálogo artesanal...</p>
        </div>
      )}

      {/* Grid de Productos */}
      {!isLoading && (
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <FaSearch size={40} color="var(--gold-primary)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No encontramos piezas disponibles
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            No hay joyas que coincidan con los filtros seleccionados. Intenta explorar otra etiqueta o limpiar el buscador.
          </p>
          {(urlSearch || activeTag !== 'Todos') && (
            <button
              onClick={() => {
                setActiveTag('Todos');
                setSearchParams({});
              }}
              className="btn-primary"
            >
              Ver todo el catálogo
            </button>
          )}
        </div>
      )}

      {/* Paginador (15 por página) */}
      {!isLoading && paginationInfo.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
          {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: currentPage === pageNum ? '2px solid var(--gold-primary)' : '1px solid #ddd',
                backgroundColor: currentPage === pageNum ? 'var(--gold-primary)' : '#fff',
                color: currentPage === pageNum ? '#fff' : 'var(--text-main)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
