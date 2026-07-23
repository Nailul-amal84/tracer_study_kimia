function Spinner({ text = 'Memuat data...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #1a3a5c',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px'
      }} />
      <p style={{ color: '#718096', fontSize: '14px' }}>{text}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Spinner;