
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, gradients, shadows, cardStyle, primaryButtonStyle, secondaryButtonStyle, radii } from '../theme';
import './Home.css';

const Home = () => {
  const rotatingWords = ['Save', 'Organize', 'Access'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="home-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '24px',
        paddingTop: '96px',
        position: 'relative',
        overflow: 'hidden',
        ['--color-primary-text']: colors.primaryText,
        ['--color-secondary-text']: colors.secondaryText,
        ['--color-muted-text']: colors.mutedText,
        ['--color-background']: colors.background,
        ['--color-border']: colors.border,
        ['--shadow-soft']: shadows.soft,
        ['--shadow-glow']: shadows.glow,
        ['--gradient-app']: gradients.app,
        ['--gradient-primary']: gradients.primary
      }}
    >
      {/* Header Navigation */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 800,
            color: colors.primaryText,
            textDecoration: 'none'
          }}>
            <span className="brand-dot" />
            Research Locker
          </Link>
          <nav className="nav">
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#pricing">Plans & Pricing</a>
            <a className="nav-link" href="#extension">Extension</a>
            <a className="nav-link" href="#support">Support</a>
            <a className="nav-link" href="#about">About Us</a>
          </nav>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to="/login" style={{ color: colors.primaryText, textDecoration: 'none', fontWeight: 600 }}>Login</Link>
            <Link to="/register" style={{
              ...primaryButtonStyle,
              borderRadius: '9999px',
              padding: '10px 16px',
              fontWeight: 700
            }}>Get Started</Link>
          </div>
        </div>
      </header>
      {/* Decorative animated background accents */}
      <div aria-hidden className="bg-blob bg-blob--1" style={{ background: `radial-gradient(closest-side, ${colors.accent}, transparent)` }} />
      <div aria-hidden className="bg-blob bg-blob--2" style={{ background: `radial-gradient(closest-side, ${colors.link}, transparent)`, animationDelay: '0.6s' }} />
      <div aria-hidden className="bg-blob bg-blob--3" style={{ background: `radial-gradient(closest-side, ${colors.highlight}, transparent)` }} />
      {/* Hero Section */}
      <section className="section card anim-slideUp" style={{ textAlign: 'center', padding: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          borderRadius: '9999px',
          background: 'rgba(13,148,136,0.08)',
          color: colors.link,
          fontWeight: 700,
          fontSize: '0.85rem',
          border: `1px solid ${colors.border}`,
          marginBottom: '12px'
        }}>
          <span aria-hidden>✨</span>
          <span>New: Save research in one click</span>
        </div>
        <h1 className="hero-title anim-slideUp" style={{ color: colors.primaryText }}>
          🚀 <span className="gradient-text" aria-live="polite">{rotatingWords[currentWordIndex]}</span> Your Research in One Place
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: colors.secondaryText,
          marginBottom: '28px',
          animation: 'slideUp 850ms ease both',
          animationDelay: '140ms'
        }}>
          Research Locker helps you securely store, categorize, and manage your purchased research articles.
          Stay organized, save time, and focus on discovery.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', animation: 'slideUp 900ms ease both', animationDelay: '200ms' }}>
          <Link to="/register" style={{
            ...primaryButtonStyle,
            padding: '12px 20px',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: shadows.glow
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = shadows.medium; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = shadows.glow; }}
          >
            Get Started Free
          </Link>
          <a href="#extension" style={{
            ...secondaryButtonStyle,
            backgroundColor: colors.background,
            color: colors.primaryText,
            border: `1px solid ${colors.border}`,
            padding: '12px 20px',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: 700
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = shadows.soft; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Extension
          </a>
        </div>
        <div style={{
          marginTop: '18px',
          color: colors.mutedText,
          fontSize: '0.95rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          <span>Trusted by 1,200+ researchers</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>5,800+ papers saved</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>4.9/5 average rating</span>
        </div>
        <div style={{
          marginTop: '16px',
          display: 'flex',
          gap: '18px',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.9
        }}>
          {['arXiv', 'IEEE', 'ACM', 'Nature', 'Science'].map((brand, i) => (
            <div key={i} style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              color: colors.secondaryText,
              background: colors.background,
              transition: 'transform 200ms ease, color 200ms ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = colors.primaryText; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = colors.secondaryText; }}
            >{brand}</div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
        ...cardStyle,
        width: '100%',
        maxWidth: '980px',
        marginBottom: '48px',
        animation: 'slideUp 750ms ease both',
        animationDelay: '120ms'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: colors.primaryText,
          textAlign: 'center',
          marginBottom: '24px'
        }}>How It Works</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '24px'
        }}>
          {[{
            icon: '1️⃣',
            title: 'Save Articles Easily',
            text: 'Save research articles directly from publishers using our Chrome Extension.'
          }, {
            icon: '2️⃣',
            title: 'Organize Smarter',
            text: 'Categorize, tag, and search across all your saved papers.'
          }, {
            icon: '3️⃣',
            title: 'Access Anywhere',
            text: 'Your library is always available, on any device.'
          }].map((item, idx) => (
            <div
              key={idx}
              style={{ textAlign: 'center', transition: 'transform 220ms ease, box-shadow 220ms ease', borderRadius: radii.md, padding: '8px' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = shadows.soft;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ color: colors.accent, fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: colors.mutedText }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ width: '100%', maxWidth: '980px', marginBottom: '48px', animation: 'slideUp 750ms ease both', animationDelay: '160ms' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: colors.primaryText,
          textAlign: 'center',
          marginBottom: '24px'
        }}>Features</h2>
        <div style={{
          ...cardStyle,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px'
        }}>
          {[
            'Store up to 10 free articles (upgrade anytime).',
            'Secure cloud storage for research papers.',
            'Chrome extension for one-click saving.',
            'Advanced search & filters.',
            'Membership plans with unlimited storage.'
          ].map((text, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', transition: 'transform 200ms ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <span style={{ color: colors.success, fontSize: '1.25rem' }}>✅</span>
              <p style={{ color: colors.primaryText }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section id="pricing" style={{ textAlign: 'center', marginBottom: '48px', width: '100%', maxWidth: '980px', animation: 'slideUp 750ms ease both', animationDelay: '200ms' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: colors.primaryText,
          marginBottom: '24px'
        }}>Membership Plans Preview</h2>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{
            ...cardStyle,
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 220ms ease, box-shadow 220ms ease'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.primaryText, marginBottom: '8px' }}>Free Plan</h3>
            <p style={{ color: colors.mutedText, marginBottom: '16px' }}>Save up to 10 articles.</p>
            <Link to="/register" style={{
              ...secondaryButtonStyle,
              backgroundColor: colors.background,
              color: colors.primaryText,
              border: `1px solid ${colors.border}`,
              borderRadius: '9999px',
              padding: '10px 16px',
              fontWeight: 700
            }}>Sign Up Free</Link>
          </div>
          <div style={{
            ...cardStyle,
            width: '320px',
            background: colors.accent,
            color: 'white',
            boxShadow: shadows.medium,
            transform: 'scale(1.02)',
            transition: 'transform 220ms ease, box-shadow 220ms ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '6px 10px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.28)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>Most popular</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Pro Plan</h3>
            <p style={{ marginBottom: '16px' }}>Unlimited saves, 1-year subscription, premium features.</p>
            <Link to="/membership" style={{
              ...primaryButtonStyle,
              background: 'white',
              color: colors.accent,
              borderRadius: '9999px'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >Upgrade to Pro</Link>
          </div>
        </div>
      </section>

      {/* Who Is It For? */}
      <section id="support" style={{ width: '100%', maxWidth: '980px', marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: colors.primaryText,
          textAlign: 'center',
          marginBottom: '24px'
        }}>Support</h2>
        <div style={{
          ...cardStyle,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px'
        }}>
          {[
            { icon: '❓', text: 'FAQs – Common questions answered.' },
            { icon: '📬', text: 'Contact – Email us for help.' },
            { icon: '📄', text: 'Docs – Setup guides and tips.' },
            { icon: '🔒', text: 'Privacy – How we protect your data.' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: colors.accent, fontSize: '1.25rem' }}>{item.icon}</span>
              <p style={{ color: colors.primaryText }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section (Bottom) */}
      <section id="extension" style={{
        width: '100%',
        maxWidth: '980px',
        background: colors.secondary,
        color: 'white',
        padding: '32px',
        borderRadius: radii.lg,
        boxShadow: shadows.soft,
        textAlign: 'center',
        animation: 'slideUp 750ms ease both',
        animationDelay: '240ms',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle animated bar */}
        <div aria-hidden style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradients.primary,
          opacity: 0.9
        }} />
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '16px' }}>
          “Start building your research library today.”
        </h2>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={{
            ...primaryButtonStyle,
            background: 'white',
            color: colors.secondary,
            borderRadius: '9999px',
            padding: '12px 20px',
            fontWeight: 700
          }}>👉 Install Chrome Extension</a>
          <Link to="/register" style={{
            ...primaryButtonStyle,
            background: 'white',
            color: colors.secondary,
            borderRadius: '9999px',
            padding: '12px 20px',
            fontWeight: 700
          }}>Sign Up Free</Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ width: '100%', maxWidth: '980px', marginTop: '24px', marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: colors.primaryText,
          textAlign: 'center',
          marginBottom: '12px'
        }}>About Us</h2>
        <div style={{ ...cardStyle }}>
          <p style={{ color: colors.primaryText }}>
            Research Locker’s mission is to make scholarly research effortless to save, organize, and revisit.
            We’re a small team of engineers and researchers focused on building a delightful, secure library for your work.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        width: '100%',
        marginTop: '48px',
        background: colors.background,
        borderTop: `1px solid ${colors.border}`,
        animation: 'slideUp 700ms ease both',
        animationDelay: '260ms'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '32px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'space-between'
        }}>
          {/* Brand removed as requested */}

          {/* Product */}
          <div style={{ minWidth: '180px', flex: '1 1 160px' }}>
            <div style={{ fontWeight: 700, color: colors.primaryText, marginBottom: '10px' }}>Product</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#features" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Features</a>
              <a href="#pricing" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Plans & Pricing</a>
              <a href="#extension" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Install Extension</a>
              <a href="#demo" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Demo Video</a>
            </nav>
          </div>

          {/* Company */}
          <div style={{ minWidth: '180px', flex: '1 1 160px' }}>
            <div style={{ fontWeight: 700, color: colors.primaryText, marginBottom: '10px' }}>Company</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#about" style={{ color: colors.secondaryText, textDecoration: 'none' }}>About Us</a>
              <a href="#blog" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Blog / Updates</a>
              <a href="#careers" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Careers</a>
              <a href="#support" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Contact</a>
            </nav>
          </div>

          {/* Support */}
          <div style={{ minWidth: '180px', flex: '1 1 160px' }}>
            <div style={{ fontWeight: 700, color: colors.primaryText, marginBottom: '10px' }}>Support</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#support" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Help Center / FAQ</a>
              <a href="#features" style={{ color: colors.secondaryText, textDecoration: 'none' }}>How it Works</a>
              <a href="#support" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Report an Issue</a>
              <a href="mailto:support@researchlocker.app" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Email Support</a>
            </nav>
          </div>

          {/* Legal */}
          <div style={{ minWidth: '180px', flex: '1 1 160px' }}>
            <div style={{ fontWeight: 700, color: colors.primaryText, marginBottom: '10px' }}>Legal</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#privacy" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#terms" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Terms of Service</a>
              <a href="#cookies" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Cookie Policy</a>
            </nav>
          </div>

          {/* Social */}
          <div style={{ minWidth: '180px', flex: '1 1 160px' }}>
            <div style={{ fontWeight: 700, color: colors.primaryText, marginBottom: '10px' }}>Social</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" style={{ color: colors.secondaryText, textDecoration: 'none' }}>LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: colors.secondaryText, textDecoration: 'none' }}>Twitter / X</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: colors.secondaryText, textDecoration: 'none' }}>YouTube</a>
            </nav>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, padding: '14px 20px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: colors.mutedText, fontSize: '0.9rem' }}>© {new Date().getFullYear()} Research Locker. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#privacy" style={{ color: colors.secondaryText, textDecoration: 'none', fontSize: '0.9rem' }}>Privacy</a>
              <a href="#terms" style={{ color: colors.secondaryText, textDecoration: 'none', fontSize: '0.9rem' }}>Terms</a>
              <a href="#cookies" style={{ color: colors.secondaryText, textDecoration: 'none', fontSize: '0.9rem' }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
