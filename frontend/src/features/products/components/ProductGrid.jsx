import { FaSearch } from 'react-icons/fa';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  urlSearch,
  activeTag,
  currentPage,
  totalPages,
  onPageChange,
  onResetFilters,
}) {
  return (
    <>
      <div className="catalog-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <FaSearch size={40} color="var(--gold-primary)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No encontramos piezas disponibles
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            No hay joyas que coincidan con los filtros seleccionados. Intenta explorar otra etiqueta o limpiar el buscador.
          </p>
          {(urlSearch || activeTag !== 'Todos') && (
            <button onClick={onResetFilters} className="btn-primary">
              Ver todo el catálogo
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
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
    </>
  );
}
