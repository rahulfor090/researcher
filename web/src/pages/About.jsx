import { useAuth } from '../auth';
import { colors, gradients } from '../theme';
import './About.scss';

export default function About() {
  const { user } = useAuth();

  // Example plan data (customize as needed)
  const proSpecs = [
    { label: 'Storage', value: '50GB' },
    { label: 'Embeddable Links', value: '∞' },
    { label: 'Password Protected Links', value: '∞' },
    { label: 'Custom Product Attributes', value: '∞' },
    { label: 'Subaccounts', value: '∞' },
    { label: 'Catalogs', value: '∞' },
    { label: 'Embeddable Links', value: '∞' },
    { label: 'Image Download Format', value: 'JPG, PNG, PDF' },
    { label: 'Image Download Size Selection', value: '∞' },
    { label: 'Support', value: '24/7 chat & email support\nDedicated Accounts Manager' },
  ];
  const freeSpecs = [
    { label: 'Storage', value: '3GB' },
    { label: 'Embeddable Links', value: '3' },
    { label: 'Password Protected Links', value: 'NA' },
    { label: 'Custom Product Attributes', value: 'NA' },
    { label: 'Subaccounts', value: 'NA' },
    { label: 'Catalogs', value: 'NA' },
    { label: 'Embeddable Links', value: '3' },
    { label: 'Image Download Format', value: 'JPG Only' },
    { label: 'Image Download Size Selection', value: 'NA' },
    { label: 'Support', value: '24/7 chat & email support' },
  ];

  const proFeatures = [
    { label: 'AI Background Removal', value: '∞' },
    { label: 'AI Retouching', value: '∞' },
    { label: 'AI Dust Removal', value: '∞' },
    { label: 'AI Description writing', value: '∞' },
    { label: 'Virtual Model Try-On', value: '∞' },
    { label: 'AI Social Media Post', value: '∞' },
    { label: 'Integrations', value: 'Shopify, Replit, The Edge' },
  ];
  const freeFeatures = [
    { label: 'AI Background Removal', value: '10/month' },
    { label: 'AI Retouching', value: '10/month' },
    { label: 'AI Dust Removal', value: '10/month' },
    { label: 'AI Description writing', value: 'NA' },
    { label: 'Virtual Model Try-On', value: 'NA' },
    { label: 'AI Social Media Post', value: 'NA' },
    { label: 'Integrations', value: 'NA' },
  ];

  // User's plan
  const isPro = user?.plan === 'pro';
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 0'
    }}>
      {/* User Profile */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: gradients.accent || 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
        }}>
          {initials}
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: '2.2rem',
          letterSpacing: '0.02em',
          color: '#0f172a'
        }}>
          {user?.name ? user.name : 'USER'}
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0px',
        maxWidth: 900,
        margin: '0 auto',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Pro Plan */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          color: 'white',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 220
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: '1.3rem',
            marginBottom: '12px',
            letterSpacing: '0.01em'
          }}>
            <span style={{ marginRight: 8 }}>💎</span>Pro Plan
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: 24, opacity: 0.9 }}>Best for professionals</div>
          <div style={{ width: '100%' }}>
            {proSpecs.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: idx !== proSpecs.length - 1 ? '1px solid #38bdf8' : 'none',
                fontSize: '1rem'
              }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 600, whiteSpace: 'pre-line' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ margin: '24px 0 8px 0', fontWeight: 600, fontSize: '1.1rem' }}>AI Features & Integration</div>
          <div style={{ width: '100%' }}>
            {proFeatures.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: idx !== proFeatures.length - 1 ? '1px solid #38bdf8' : 'none',
                fontSize: '1rem'
              }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Free Plan */}
        <div style={{
          flex: 1,
          background: '#f1f5f9',
          color: '#0f172a',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 220
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: '1.3rem',
            marginBottom: '12px',
            letterSpacing: '0.01em'
          }}>
            Free Plan
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: 24, opacity: 0.8 }}>For getting started</div>
          <div style={{ width: '100%' }}>
            {freeSpecs.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: idx !== freeSpecs.length - 1 ? '1px solid #e2e8f0' : 'none',
                fontSize: '1rem'
              }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ margin: '24px 0 8px 0', fontWeight: 600, fontSize: '1.1rem' }}>AI Features & Integration</div>
          <div style={{ width: '100%' }}>
            {freeFeatures.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: idx !== freeFeatures.length - 1 ? '1px solid #e2e8f0' : 'none',
                fontSize: '1rem'
              }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {!isPro && (
        <div style={{
          margin: '32px auto 0 auto',
          maxWidth: 500,
          background: 'white',
          color: '#2563eb',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '2px solid #3b82f6'
        }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Upgrade to Pro</h2>
          <p style={{ margin: '0 0 24px 0', fontWeight: 500 }}>
            Get access to <span style={{ color: '#06b6d4' }}>unlimited articles</span>, <span style={{ color: '#3b82f6' }}>advanced analytics</span>, and <span style={{ color: '#06b6d4' }}>priority support</span>!
          </p>
          <button
            onClick={() => window.location.href = '/pricing'}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 8px rgba(59,130,246,0.15)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}