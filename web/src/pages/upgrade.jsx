import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './upgrade.css';

export default function Upgrade() {
  const nav = useNavigate();
  const initials = 'RL';
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="upgrade-page">
      <div className="main">
        <div className="upgrade-content">
          <div className="back-row">
            <button className="back-btn" onClick={() => nav(-1)}>← Back</button>
          </div>
          <section className="hero">
            <div className="hero-left">
              <span className="badge">✨ Premium Access</span>
              <h2>Upgrade to Research Plus</h2>
              <p>Serious tools for serious research: unlimited storage, blazing-fast search, AI insights, and priority support.</p>
              <div className="cta-row">
                <button className="btn-primary" onClick={() => nav('/membership')}>Upgrade Now</button>
                <button className="btn-secondary" onClick={() => nav('/library')}>Back to Library</button>
              </div>
            </div>
            <div className="hero-card">
              <div className="badge" style={{ marginBottom: 8 }}>🚀 Research Plus</div>
              <div className="price">
                $9 <small>/ year</small>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 12px 0' }}>
                <li>📚 Unlimited article & PDF storage</li>
                <li>🔍 Advanced tagging + blazing-fast search</li>
                <li>🤖 AI-generated summaries & insights</li>
                <li>📌 Clean imports from web</li>
                <li>⚡ Priority human support</li>
              </ul>
             
              <div className="payments">
                <button className="pay-btn" onClick={() => nav('/membership')}>🟦 Pay with PayPal</button>
              </div>
            </div>
          </section>

         

          <section className="features">
            {[
              { title: 'Unlimited Storage', desc: 'Keep every article, PDF, and note in one place.' },
              { title: 'Smart Insights', desc: 'Auto-summaries and key takeaways for faster research.' },
              { title: 'Powerful Search', desc: 'Tag, filter, and find everything in seconds.' },
              { title: 'Clean Imports', desc: 'Save from web with our extension effortlessly.' },
              { title: 'AI Generated Summary', desc: 'Get AI-generated summaries for your saved articles and PDFs.' },
              { title: 'Priority Support', desc: 'Get help fast when you need it.' },
            ].map(card => (
              <div key={card.title} className="feature">
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </section>

          <section className="faq">
            {[
              { q: 'How long do I keep Research Plus access?', a: 'You\'ll keep access as long as your subscription is active.' },
              { q: 'Can I cancel or switch back to Starter?', a: 'Yes, you can cancel anytime and switch back to Starter.' },
            ].map((f, idx) => (
              <div key={f.q} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <span>{f.q}</span>
                  <span>{openFaq === idx ? '−' : '+'}</span>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </section>

          <section className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>Secure payments</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>Instant activation</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔄</span>
              <span>Cancel anytime</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">👥</span>
              <span>1,000+ researchers</span>
          </div>
          </section>
        </div>
      </div>
    </div>
  );
}