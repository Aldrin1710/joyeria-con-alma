export default function Loader({ message = 'Cargando...', padding = '4rem 0' }) {
  return (
    <div style={{ textAlign: 'center', padding, color: 'var(--text-muted)' }}>
      <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>{message}</p>
    </div>
  );
}
