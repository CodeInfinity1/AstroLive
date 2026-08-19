import { useNavigate } from 'react-router-dom';
import type { VedicProfile } from '../engine/vedic';
import { getZodiacSymbol, getDailyForecast, getWeeklyTheme } from '../engine/vedic';
import { getBonds } from '../store/storage';
import { birthToInvite, copyText, inviteUrl, shareOrCopy } from '../store/share';
import { useToast } from '../components/Toast';
import './BondsPage.css';

interface BondsPageProps {
  userProfile: VedicProfile;
}

export default function BondsPage({ userProfile }: BondsPageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const bonds = getBonds();
  const dailyForecast = getDailyForecast(userProfile);
  const weeklyTheme = getWeeklyTheme(userProfile);

  const getLabelIcon = (label: string) => {
    const icons: Record<string, string> = {
      partner: '💕', crush: '✨', friend: '🤝', family: '🏠', colleague: '💼', other: '◎'
    };
    return icons[label] || '◎';
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#5BC07A';
    if (score >= 50) return '#E8A849';
    if (score >= 30) return '#D4845A';
    return '#E85A6B';
  };

  return (
    <div className="page bonds-page">
      <div className="container">
        <div className="bonds-header">
          <h1>Your Bonds</h1>
          <button className="btn btn-sm btn-primary" onClick={() => navigate('/compatibility')}>
            + New
          </button>
        </div>

        {/* Today's cosmic weather */}
        <div className="bonds-weather">
          <div className="bonds-weather-header">
            <span className="bonds-weather-label">Today's Cosmic Weather</span>
            <span className="badge badge-accent">{weeklyTheme}</span>
          </div>
          <p className="bonds-weather-text">{dailyForecast}</p>
        </div>

        {/* Bonds list */}
        {bonds.length === 0 ? (
          <div className="bonds-empty">
            <span className="bonds-empty-icon">⬡</span>
            <h3>No bonds yet</h3>
            <p>Check compatibility with someone to create your first cosmic bond</p>
            <button className="btn btn-primary" onClick={() => navigate('/compatibility')}>
              Check Compatibility ✦
            </button>
          </div>
        ) : (
          <div className="bonds-list">
            <h2 className="bonds-list-title">
              {bonds.length} Cosmic Bond{bonds.length !== 1 ? 's' : ''}
            </h2>
            
            {bonds.map(bond => (
              <button
                key={bond.id}
                className="bond-list-item"
                onClick={() => navigate(`/bond/${bond.id}`)}
              >
                <div className="bond-list-left">
                  <div className="bond-list-avatar" style={{ borderColor: getScoreColor(bond.compatibility.overallScore) }}>
                    {bond.profile.birthData.name.charAt(0)}
                  </div>
                  <div className="bond-list-info">
                    <span className="bond-list-name">
                      {bond.profile.birthData.name}
                      <span className="bond-list-label-icon">{getLabelIcon(bond.label)}</span>
                    </span>
                    <span className="bond-list-sign">
                      {getZodiacSymbol(bond.profile.moonSign)} {bond.profile.moonSign} · {bond.compatibility.bondType}
                    </span>
                  </div>
                </div>
                <div className="bond-list-right">
                  <span className="bond-list-score" style={{ color: getScoreColor(bond.compatibility.overallScore) }}>
                    {bond.compatibility.overallScore}%
                  </span>
                  <span className="bond-list-arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Invite CTA */}
        <div className="bonds-invite">
          <h3>Grow your cosmic circle</h3>
          <p>Invite friends and family to discover your cosmic bonds together</p>
          <button className="btn btn-outline btn-full" onClick={async () => {
            const url = inviteUrl(birthToInvite(userProfile.birthData));
            const result = await shareOrCopy(
              'Join Nakshatra',
              `${userProfile.birthData.name} invited you to see your Vedic Bond Card on Nakshatra by AstroLive.`,
              url
            );
            if (result === 'copied') {
              await copyText(url);
              toast('Invite link copied ✦');
            }
          }}>
            Invite Friends →
          </button>
        </div>
      </div>
    </div>
  );
}
