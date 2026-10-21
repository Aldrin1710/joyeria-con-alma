import { FaTimes } from 'react-icons/fa';

export default function ProductFilters({
  availableTags,
  activeTag,
  urlSearch,
  onTagClick,
  onClearSearch,
}) {
  return (
    <>
      {urlSearch && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
            Resultados para: <strong>"{urlSearch}"</strong>
          </span>
          <button
            onClick={onClearSearch}
            className="btn-quick-wa"
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
          >
            <FaTimes size={12} /> Limpiar filtro
          </button>
        </div>
      )}

      <div className="hashtags-container" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
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
    </>
  );
}
