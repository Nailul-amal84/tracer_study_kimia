import { Link } from 'react-router-dom';

function Breadcrumb({ items }) {
  return (
    <div style={{
      background: '#f7f9fc',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 24px',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {index > 0 && (
              <span style={{ color: '#a0aec0', fontSize: '13px' }}>›</span>
            )}
            {item.url && index < items.length - 1 ? (
              <Link to={item.url} style={{
                fontSize: '13px',
                color: '#2b6cb0',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1a3a5c'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2b6cb0'}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{
                fontSize: '13px',
                color: index === items.length - 1 ? '#1a3a5c' : '#718096',
                fontWeight: index === items.length - 1 ? 600 : 400,
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Breadcrumb;