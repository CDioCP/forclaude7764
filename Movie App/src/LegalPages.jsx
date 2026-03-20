import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: { padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff', lineHeight: '1.6' },
  header: { fontSize: '2rem', marginBottom: '20px', color: '#00d4ff' },
  backLink: { display: 'block', marginBottom: '20px', color: '#888', textDecoration: 'none' }
};

export const Pricing = () => (
  <div style={styles.container}>
    <Link to="/" style={styles.backLink}>← Volver</Link>
    <h1 style={styles.header}>Precios</h1>
    <p>El servicio es gratuito para todos los usuarios actualmente.</p>
  </div>
);

export const Privacy = () => (
  <div style={styles.container}>
    <Link to="/" style={styles.backLink}>← Volver</Link>
    <h1 style={styles.header}>Política de Privacidad</h1>
    <p>No vendemos tus datos. Solo usamos tus películas favoritas para darte recomendaciones.</p>
  </div>
);

export const Terms = () => (
  <div style={styles.container}>
    <Link to="/" style={styles.backLink}>← Volver</Link>
    <h1 style={styles.header}>Términos y Condiciones</h1>
    <p>Al usar Antigravity, aceptas usar la app de forma responsable.</p>
  </div>
);

export const Refund = () => (
  <div style={styles.container}>
    <Link to="/" style={styles.backLink}>← Volver</Link>
    <h1 style={styles.header}>Política de Reembolso</h1>
    <p>Al ser un servicio gratuito, no hay transacciones ni reembolsos aplicables.</p>
  </div>
);