import ProductCard from './ProductCard';

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section style={{ marginTop: '5rem', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
      <h2 className="section-title" style={{ fontSize: '2rem' }}>
        Te podría interesar
      </h2>
      <div className="catalog-grid">
        {products.map((rel) => (
          <ProductCard key={rel._id} product={rel} />
        ))}
      </div>
    </section>
  );
}
