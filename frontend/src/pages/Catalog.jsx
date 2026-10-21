import { useProducts } from '../features/products/hooks/useProducts';
import ProductFilters from '../features/products/components/ProductFilters';
import ProductGrid from '../features/products/components/ProductGrid';
import Loader from '../components/ui/Loader';

export default function Catalog() {
  const {
    products,
    availableTags,
    activeTag,
    urlSearch,
    currentPage,
    paginationInfo,
    loading: isLoading,
    setCurrentPage,
    handleTagClick,
    handleClearSearch,
    handleResetFilters,
  } = useProducts();

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 className="section-title">Nuestro Catálogo</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Explora nuestra colección. Utiliza las etiquetas para encontrar la pieza ideal.
      </p>

      <ProductFilters
        availableTags={availableTags}
        activeTag={activeTag}
        urlSearch={urlSearch}
        onTagClick={handleTagClick}
        onClearSearch={handleClearSearch}
      />

      {isLoading ? (
        <Loader message="Consultando catálogo artesanal..." padding="4rem 0" />
      ) : (
        <ProductGrid
          products={products}
          urlSearch={urlSearch}
          activeTag={activeTag}
          currentPage={currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={setCurrentPage}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
}
