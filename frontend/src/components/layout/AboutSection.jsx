import creadoraImg from '../../assets/creadora.png';

export default function AboutSection() {
  return (
    <section id="nosotros" className="container" style={{ margin: '6rem auto 3rem auto' }}>
      <div className="about-grid">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            Nuestra Historia
          </span>
          <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', fontSize: '2.5rem', margin: '0.5rem 0 1.5rem 0' }}>
            Joyería con Alma
          </h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <img
              src={creadoraImg}
              alt="Creadora de Joyería con Alma"
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold-primary)' }}
            />
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
              "Cada pieza lleva consigo horas de dedicación, amor y la magia de nuestras tradiciones."
            </p>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Somos un taller artesanal dedicado a rescatar y exaltar la belleza de la joyería tradicional con un toque contemporáneo. Diseñamos tocados, rosarios y aretes que acompañan tus momentos más memorables.
          </p>
        </div>

        <div>
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Síguenos en Facebook
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100027233036988&tabs=timeline&width=340&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="340"
              height="400"
              style={{ border: 'none', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Facebook Wireframe"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
