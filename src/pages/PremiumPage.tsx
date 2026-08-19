import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isPremium, setPremium, purchaseReport, hasPurchasedReport } from '../store/storage';
import './PremiumPage.css';

export default function PremiumPage() {
  const navigate = useNavigate();
  const [alreadyPremium, setAlreadyPremium] = useState(isPremium());
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgrade = () => {
    setPremium(true);
    setAlreadyPremium(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (alreadyPremium && !showSuccess) {
    return (
      <div className="page premium-page">
        <div className="container">
          <div className="premium-active">
            <span className="premium-active-icon">✦</span>
            <h1>Nakshatra Premium</h1>
            <span className="badge badge-premium" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>Active</span>
            <p className="premium-active-desc">You have access to all premium features</p>
            
            <div className="premium-features-active">
              <div className="pf-item">
                <span className="pf-check">✓</span>
                <span>Unlimited compatibility checks</span>
              </div>
              <div className="pf-item">
                <span className="pf-check">✓</span>
                <span>Deep relationship reports</span>
              </div>
              <div className="pf-item">
                <span className="pf-check">✓</span>
                <span>Weekly cosmic forecasts</span>
              </div>
              <div className="pf-item">
                <span className="pf-check">✓</span>
                <span>Priority astrologer access</span>
              </div>
              <div className="pf-item">
                <span className="pf-check">✓</span>
                <span>Relationship timeline</span>
              </div>
              <div className="pf-item">
                <span className="pf-check">✓</span>
                <span>Premium Bond Card designs</span>
              </div>
            </div>
            
            <button className="btn btn-secondary btn-full" onClick={() => navigate('/compatibility')}>
              Check Compatibility →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page premium-page">
      <div className="container">
        {/* Header */}
        <div className="premium-header">
          <span className="premium-icon">✦</span>
          <h1 className="premium-title">Nakshatra <span className="text-gradient">Premium</span></h1>
          <p className="premium-subtitle">
            Unlock the full power of Vedic cosmic compatibility
          </p>
        </div>

        {/* Plan toggle */}
        <div className="plan-toggle">
          <button
            className={`plan-toggle-btn ${selectedPlan === 'monthly' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            Monthly
          </button>
          <button
            className={`plan-toggle-btn ${selectedPlan === 'yearly' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('yearly')}
          >
            Yearly
            <span className="plan-save">Save 40%</span>
          </button>
        </div>

        {/* Price card */}
        <div className="price-card">
          <div className="price-card-glow" />
          <div className="price-card-inner">
            {selectedPlan === 'monthly' ? (
              <>
                <span className="price-amount">₹199</span>
                <span className="price-period">/month</span>
                <p className="price-detail">Cancel anytime · No commitment</p>
              </>
            ) : (
              <>
                <span className="price-amount">₹1,199</span>
                <span className="price-period">/year</span>
                <p className="price-detail">₹99/month effective · Save ₹1,189</p>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="premium-features">
          <h2 className="premium-features-title">Everything in Premium</h2>
          
          <div className="premium-feature">
            <span className="premium-feature-icon">∞</span>
            <div>
              <h3>Unlimited Compatibility Checks</h3>
              <p>Check compatibility with everyone — no monthly limits</p>
            </div>
          </div>
          
          <div className="premium-feature">
            <span className="premium-feature-icon">📊</span>
            <div>
              <h3>Deep Relationship Reports</h3>
              <p>Detailed analysis with past-life connections, karmic patterns, and growth roadmap</p>
            </div>
          </div>
          
          <div className="premium-feature">
            <span className="premium-feature-icon">📅</span>
            <div>
              <h3>Weekly Cosmic Forecasts</h3>
              <p>Personalized weekly predictions for you and all your bonds</p>
            </div>
          </div>
          
          <div className="premium-feature">
            <span className="premium-feature-icon">🎯</span>
            <div>
              <h3>Relationship Timeline</h3>
              <p>See upcoming auspicious dates and challenging periods for each bond</p>
            </div>
          </div>
          
          <div className="premium-feature">
            <span className="premium-feature-icon">🌟</span>
            <div>
              <h3>Priority Astrologer Access</h3>
              <p>Skip the queue for live consultations with AstroLive's top-rated Vedic astrologers</p>
            </div>
          </div>
          
          <div className="premium-feature">
            <span className="premium-feature-icon">🎨</span>
            <div>
              <h3>Premium Bond Cards</h3>
              <p>Exclusive visual designs for sharing your compatibility results</p>
            </div>
          </div>
        </div>

        {/* One-time reports */}
        <div className="premium-reports">
          <h2 className="premium-features-title">One-Time Reports</h2>
          
          <div className="report-card">
            <div className="report-info">
              <h3>Couple Deep Dive</h3>
              <p>Complete 12-page relationship analysis with remedies</p>
            </div>
            <div className="report-price">
              <span>₹299</span>
              <button className="btn btn-sm btn-outline" onClick={() => {
                purchaseReport('couple');
                navigate('/report/couple');
              }}>
                {hasPurchasedReport('couple') ? 'Open' : 'Buy'}
              </button>
            </div>
          </div>
          
          <div className="report-card">
            <div className="report-info">
              <h3>Family Compatibility Map</h3>
              <p>Multi-person compatibility analysis for up to 5 family members</p>
            </div>
            <div className="report-price">
              <span>₹499</span>
              <button className="btn btn-sm btn-outline" onClick={() => {
                purchaseReport('family');
                navigate('/report/family');
              }}>
                {hasPurchasedReport('family') ? 'Open' : 'Buy'}
              </button>
            </div>
          </div>
        </div>

        {/* Compare */}
        <div className="premium-compare">
          <h2 className="premium-features-title">Free vs Premium</h2>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cosmic Profile</td>
                <td className="compare-yes">✓</td>
                <td className="compare-yes">✓</td>
              </tr>
              <tr>
                <td>Compatibility Checks</td>
                <td>3/month</td>
                <td className="compare-yes">Unlimited</td>
              </tr>
              <tr>
                <td>Bond Card Sharing</td>
                <td className="compare-yes">✓</td>
                <td className="compare-yes">✓ + Premium designs</td>
              </tr>
              <tr>
                <td>Daily Forecasts</td>
                <td className="compare-yes">✓</td>
                <td className="compare-yes">✓</td>
              </tr>
              <tr>
                <td>Deep Reports</td>
                <td className="compare-no">✗</td>
                <td className="compare-yes">✓</td>
              </tr>
              <tr>
                <td>Weekly Forecasts</td>
                <td className="compare-no">✗</td>
                <td className="compare-yes">✓</td>
              </tr>
              <tr>
                <td>Relationship Timeline</td>
                <td className="compare-no">✗</td>
                <td className="compare-yes">✓</td>
              </tr>
              <tr>
                <td>Priority Astrologers</td>
                <td className="compare-no">✗</td>
                <td className="compare-yes">✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="premium-cta">
          <button className="btn btn-primary btn-full btn-lg" onClick={handleUpgrade}>
            Start Premium — {selectedPlan === 'monthly' ? '₹199/mo' : '₹1,199/yr'}
          </button>
          <p className="premium-cta-note">
            This is a prototype demo. No actual payment will be processed.
          </p>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="toast" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--success)' }}>✓</span>
          Premium activated! Enjoy unlimited access.
        </div>
      )}
    </div>
  );
}
