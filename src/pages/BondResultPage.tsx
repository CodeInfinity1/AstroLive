import { useNavigate, useParams } from 'react-router-dom';
import type { VedicProfile } from '../engine/vedic';
import { getBondDailyInsight, getZodiacSymbol } from '../engine/vedic';
import { getBondById, isPremium } from '../store/storage';
import { birthToInvite, shareOrCopy, sharedBondUrl } from '../store/share';
import ScoreRing from '../components/ScoreRing';
import './BondResultPage.css';

interface BondResultPageProps {
  userProfile: VedicProfile;
}

export default function BondResultPage({ userProfile }: BondResultPageProps) {
  const { bondId } = useParams();
  const navigate = useNavigate();
  const bond = getBondById(bondId || '');

  if (!bond) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '40vh' }}>
          <p>Bond not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/compatibility')}>
            Check Compatibility
          </button>
        </div>
      </div>
    );
  }

  const { compatibility, profile: otherProfile } = bond;
  const premium = isPremium();
  const dailyInsight = getBondDailyInsight(userProfile, otherProfile);

  const handleShare = async () => {
    const url = sharedBondUrl({
      a: birthToInvite(userProfile.birthData),
      b: birthToInvite(otherProfile.birthData),
    });
    const shareText = `${userProfile.birthData.name} ${getZodiacSymbol(userProfile.moonSign)} × ${otherProfile.birthData.name} ${getZodiacSymbol(otherProfile.moonSign)} — ${compatibility.overallScore}% · ${compatibility.bondType}`;
    const result = await shareOrCopy('Our Cosmic Bond — Nakshatra', shareText, url);
    if (result === 'copied') {
      alert('Bond Card link copied — anyone with the link can open it.');
    }
  };

  return (
    <div className="page bond-result-page">
      <div className="container">
        {/* Bond Card */}
        <div className="bond-card">
          <div className="bond-card-bg" />
          <div className="bond-card-inner">
            <span className="bond-card-logo">NAKSHATRA</span>
            
            {/* Profiles */}
            <div className="bond-card-profiles">
              <div className="bond-profile">
                <div className="bond-avatar bond-avatar-1">
                  {userProfile.birthData.name.charAt(0)}
                </div>
                <span className="bond-profile-name">{userProfile.birthData.name}</span>
                <span className="bond-profile-sign">{getZodiacSymbol(userProfile.moonSign)} {userProfile.moonSign}</span>
              </div>
              
              <div className="bond-score-center">
                <ScoreRing score={compatibility.overallScore} size={100} fontSize="1.5rem" />
                <span className="bond-type-label">{compatibility.bondType}</span>
              </div>
              
              <div className="bond-profile">
                <div className="bond-avatar bond-avatar-2">
                  {otherProfile.birthData.name.charAt(0)}
                </div>
                <span className="bond-profile-name">{otherProfile.birthData.name}</span>
                <span className="bond-profile-sign">{getZodiacSymbol(otherProfile.moonSign)} {otherProfile.moonSign}</span>
              </div>
            </div>
            
            {/* Description */}
            <p className="bond-description">{compatibility.bondDescription}</p>
            
            {/* Guna Score */}
            <div className="bond-guna">
              <div className="bond-guna-header">
                <span>Ashtakoota Guna Milan</span>
                <span className="bond-guna-score">{compatibility.gunaScore}/{compatibility.maxGuna}</span>
              </div>
              <div className="bond-guna-bar">
                <div 
                  className="bond-guna-fill" 
                  style={{ width: `${(compatibility.gunaScore / compatibility.maxGuna) * 100}%` }} 
                />
              </div>
            </div>
            
            {/* Categories */}
            <div className="bond-categories">
              {compatibility.categories.map((cat, i) => (
                <div key={i} className="bond-category">
                  <div className="bond-cat-header">
                    <span className="bond-cat-icon">{cat.icon}</span>
                    <span className="bond-cat-name">{cat.name}</span>
                    <span className="bond-cat-hindi">{cat.nameHindi}</span>
                    <span className="bond-cat-score">{cat.score}/{cat.maxScore}</span>
                  </div>
                  <div className="bond-cat-bar">
                    <div 
                      className="bond-cat-fill" 
                      style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} 
                    />
                  </div>
                  <p className="bond-cat-desc">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Challenges */}
        <div className="bond-insights">
          <div className="bond-insight-section">
            <h3 className="bond-insight-title">✦ Cosmic Strengths</h3>
            {compatibility.strengths.map((s, i) => (
              <div key={i} className="bond-insight-item bond-strength">
                <span className="bond-insight-icon">✓</span>
                <p>{s}</p>
              </div>
            ))}
          </div>
          
          <div className="bond-insight-section">
            <h3 className="bond-insight-title">◎ Growth Areas</h3>
            {compatibility.challenges.map((c, i) => (
              <div key={i} className="bond-insight-item bond-challenge">
                <span className="bond-insight-icon">→</span>
                <p>{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily insight */}
        <div className="bond-daily">
          <span className="bond-daily-label">Today's Bond Forecast</span>
          <p className="bond-daily-text">{dailyInsight}</p>
        </div>

        {/* Deep insights */}
        {premium ? (
          <div className="bond-deep">
            <h3 className="bond-deep-title">Deep Cosmic Analysis</h3>
            <div className="bond-deep-preview">
              {compatibility.deepInsights.map((insight, i) => (
                <p key={i} className="bond-deep-item">{insight}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="bond-deep premium-lock">
            <h3 className="bond-deep-title">Deep Cosmic Analysis</h3>
            <div className="bond-deep-preview">
              {compatibility.deepInsights.slice(0, 2).map((insight, i) => (
                <p key={i} className="bond-deep-item">{insight}</p>
              ))}
            </div>
            <div className="premium-badge-overlay">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/premium')}>
                Unlock Full Report — Premium ✦
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bond-actions">
          <button className="btn btn-primary btn-full btn-lg" onClick={handleShare}>
            Share Bond Card ↗
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/compatibility')}>
            Check Another Bond
          </button>
          <button className="btn btn-ghost btn-full" onClick={() => navigate('/bonds')}>
            View All Bonds
          </button>
        </div>
      </div>
    </div>
  );
}
