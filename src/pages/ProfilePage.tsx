import { useNavigate } from 'react-router-dom';
import type { VedicProfile } from '../engine/vedic';
import { getZodiacSymbol, getNakshatraRuler, getDailyForecast, getWeeklyTheme } from '../engine/vedic';
import { birthToInvite, inviteUrl, shareOrCopy } from '../store/share';
import './ProfilePage.css';

interface ProfilePageProps {
  profile: VedicProfile;
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  const navigate = useNavigate();
  const dailyForecast = getDailyForecast(profile);
  const weeklyTheme = getWeeklyTheme(profile);

  const handleShare = async () => {
    const url = inviteUrl(birthToInvite(profile.birthData));
    const shareText = `✦ My Cosmic Profile ✦\n\n${getZodiacSymbol(profile.moonSign)} Moon: ${profile.moonSign}\n⭐ Nakshatra: ${profile.nakshatra}\n${getZodiacSymbol(profile.sunSign)} Sun: ${profile.sunSign}\n${getZodiacSymbol(profile.ascendant)} Ascendant: ${profile.ascendant}\n\nSee our Bond Card:`;
    
    const result = await shareOrCopy('My Cosmic Profile — Nakshatra', shareText, url);
    if (result === 'copied') alert('Invite link copied — friends land on your Bond invite.');
  };

  return (
    <div className="page profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div>
            <span className="profile-greeting">Your cosmic identity</span>
            <h1 className="profile-name">{profile.birthData.name}</h1>
          </div>
          <button className="btn btn-sm btn-outline" onClick={handleShare}>
            Share ↗
          </button>
        </div>

        {/* Cosmic Card */}
        <div className="cosmic-card">
          <div className="cosmic-card-glow" />
          <div className="cosmic-card-content">
            <div className="cosmic-card-header">
              <span className="cosmic-card-badge badge badge-accent">Cosmic Profile</span>
              <span className="cosmic-card-logo">NAKSHATRA</span>
            </div>
            
            <div className="cosmic-card-main">
              <div className="cosmic-card-sign">
                <span className="cosmic-sign-symbol">{getZodiacSymbol(profile.moonSign)}</span>
                <div>
                  <span className="cosmic-sign-label">Moon Sign</span>
                  <span className="cosmic-sign-name">{profile.moonSign}</span>
                </div>
              </div>
              
              <div className="cosmic-card-nakshatra">
                <span className="cosmic-nakshatra-star">⭐</span>
                <div>
                  <span className="cosmic-sign-label">Nakshatra</span>
                  <span className="cosmic-sign-name">{profile.nakshatra}</span>
                  <span className="cosmic-sign-detail">Pada {profile.nakshatraPada} · Ruler: {getNakshatraRuler(profile.nakshatra)}</span>
                </div>
              </div>
            </div>
            
            <div className="cosmic-card-row">
              <div className="cosmic-card-item">
                <span className="cosmic-item-symbol">{getZodiacSymbol(profile.sunSign)}</span>
                <span className="cosmic-item-label">Sun</span>
                <span className="cosmic-item-value">{profile.sunSign}</span>
              </div>
              <div className="cosmic-card-item">
                <span className="cosmic-item-symbol">{getZodiacSymbol(profile.ascendant)}</span>
                <span className="cosmic-item-label">Ascendant</span>
                <span className="cosmic-item-value">{profile.ascendant}</span>
              </div>
              <div className="cosmic-card-item">
                <span className="cosmic-item-symbol">◎</span>
                <span className="cosmic-item-label">Element</span>
                <span className="cosmic-item-value">{profile.element}</span>
              </div>
            </div>
            
            <div className="cosmic-card-footer">
              <span>{profile.birthData.place} · {new Date(profile.birthData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Traits */}
        <div className="profile-section">
          <h2 className="profile-section-title">Your Cosmic Traits</h2>
          <div className="traits-grid">
            {profile.traits.map((trait, i) => (
              <div key={i} className="trait-chip">
                <span className="trait-dot" />
                {trait}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Forecast */}
        <div className="profile-section">
          <h2 className="profile-section-title">Today's Cosmic Weather</h2>
          <div className="forecast-card">
            <div className="forecast-header">
              <span className="forecast-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span className="badge badge-accent">{weeklyTheme}</span>
            </div>
            <p className="forecast-text">{dailyForecast}</p>
          </div>
        </div>

        {/* Planets */}
        <div className="profile-section">
          <h2 className="profile-section-title">Planetary Positions</h2>
          <div className="planets-grid">
            {profile.planetaryPositions.slice(0, 7).map((pos, i) => (
              <div key={i} className="planet-item">
                <span className="planet-name">{pos.planet}</span>
                <span className="planet-sign">{getZodiacSymbol(pos.sign)} {pos.sign}</span>
                <span className="planet-degree">{pos.degree}°</span>
              </div>
            ))}
          </div>
          <p className="profile-disclaimer">
            ⓘ Positions are calculated using simplified Vedic sidereal methods for demonstration
          </p>
        </div>

        {/* CTA */}
        <div className="profile-cta">
          <h3>Discover your cosmic compatibility</h3>
          <p>Check how your chart aligns with friends, partners, or family</p>
          <button 
            className="btn btn-primary btn-full btn-lg"
            onClick={() => navigate('/compatibility')}
          >
            Check Compatibility ✦
          </button>
        </div>
      </div>
    </div>
  );
}
