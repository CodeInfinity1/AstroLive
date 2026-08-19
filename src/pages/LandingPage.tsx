import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page landing-page">
      {/* Ambient background */}
      <div className="landing-ambient" />
      
      <div className="container">
        {/* Header */}
        <header className="landing-header">
          <div className="landing-logo">
            <span className="landing-logo-icon">◎</span>
            <div>
              <span className="landing-logo-text">NAKSHATRA</span>
              <span className="landing-logo-sub">by AstroLive</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="landing-hero">
          <div className="landing-orbit">
            <div className="orbit-ring orbit-ring-1" />
            <div className="orbit-ring orbit-ring-2" />
            <div className="orbit-ring orbit-ring-3" />
            <div className="orbit-dot orbit-dot-1">♈</div>
            <div className="orbit-dot orbit-dot-2">♎</div>
            <div className="orbit-dot orbit-dot-3">♋</div>
            <div className="orbit-dot orbit-dot-4">♑</div>
            <div className="orbit-center">
              <span className="orbit-center-icon">✦</span>
            </div>
          </div>

          <div className="landing-hero-copy">
            <p className="landing-kicker">Vedic Bond Cards · by AstroLive</p>
            <h1 className="landing-title">
              Compatibility that only exists <span className="text-gradient">when they join</span>
            </h1>
            
            <p className="landing-subtitle">
              Nakshatra turns kundli matching into a Bond Card you create with someone, share as a public object, and reopen because the weather of the bond changes every day.
            </p>

            <button 
              className="btn btn-primary btn-lg btn-full landing-cta"
              onClick={() => navigate('/onboarding')}
            >
              Create your Vedic profile
              <span className="cta-arrow">→</span>
            </button>
            
            <p className="landing-cta-sub">Takes 30 seconds · Free · No sign-up required</p>
          </div>
        </section>

        {/* How it works */}
        <section className="landing-how">
          <h2 className="landing-section-title">How it works</h2>
          
          <div className="landing-steps">
            <div className="landing-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Enter your birth details</h3>
                <p>Date, time, and place of birth to generate your Vedic cosmic profile</p>
              </div>
            </div>
            
            <div className="landing-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Invite anyone to check</h3>
                <p>Share a link with a friend, partner, or family member to discover your cosmic bond</p>
              </div>
            </div>
            
            <div className="landing-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>See your Bond Card</h3>
                <p>Get a detailed compatibility analysis based on Ashtakoota Guna Milan — 8 dimensions of harmony</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="landing-features">
          <div className="feature-card">
            <span className="feature-icon">⬡</span>
            <h3>8-Dimension Compatibility</h3>
            <p>Based on Ashtakoota Guna Milan — the ancient Vedic system that analyzes 8 key areas of harmony between two people</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">◉</span>
            <h3>Daily Bond Forecasts</h3>
            <p>See how today's planetary transits affect your relationships — unique insights that change every day</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">✦</span>
            <h3>Shareable Bond Cards</h3>
            <p>Beautiful, visual compatibility cards designed to share with friends — because cosmic chemistry is always a conversation starter</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">◎</span>
            <h3>Your Cosmic Profile</h3>
            <p>Moon sign, Nakshatra, planetary positions, personality traits — your complete Vedic identity in one place</p>
          </div>
        </section>

        {/* Social proof */}
        <section className="landing-proof">
          <div className="proof-stats">
            <div className="proof-stat">
              <span className="proof-stat-num">27</span>
              <span className="proof-stat-label">Nakshatras Analyzed</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-num">36</span>
              <span className="proof-stat-label">Gunas Matched</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-num">8</span>
              <span className="proof-stat-label">Compatibility Dimensions</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="landing-final-cta">
          <h2>What does the cosmos say about your bonds?</h2>
          <button 
            className="btn btn-primary btn-lg btn-full"
            onClick={() => navigate('/onboarding')}
          >
            Start Free — Enter Your Birth Details
          </button>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="landing-logo" style={{ justifyContent: 'center' }}>
            <span className="landing-logo-icon" style={{ fontSize: '1rem' }}>◎</span>
            <span className="landing-logo-text" style={{ fontSize: '0.8rem' }}>NAKSHATRA</span>
          </div>
          <p className="landing-footer-text">
            A product concept for AstroLive · Built for the AstroLive Product Challenge
          </p>
          <p className="landing-footer-text" style={{ fontSize: '0.7rem', marginTop: '8px' }}>
            Prototype uses deterministic mock calculations for demonstration. Not actual astrological advice.
          </p>
        </footer>
      </div>
    </div>
  );
}
