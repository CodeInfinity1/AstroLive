import { useNavigate, useParams } from 'react-router-dom';
import type { VedicProfile } from '../engine/vedic';
import { getBondDailyInsight, getBondTimeline, getZodiacSymbol } from '../engine/vedic';
import { getBondById, isPremium } from '../store/storage';
import { birthToInvite, shareOrCopy, sharedBondUrl } from '../store/share';
import ScoreRing from '../components/ScoreRing';
import './BondDetailPage.css';

interface BondDetailPageProps {
  userProfile: VedicProfile;
}

export default function BondDetailPage({ userProfile }: BondDetailPageProps) {
  const { bondId } = useParams();
  const navigate = useNavigate();
  const bond = getBondById(bondId || '');

  if (!bond) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '40vh' }}>
          <p>Bond not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/bonds')}>View Bonds</button>
        </div>
      </div>
    );
  }

  const { compatibility, profile: otherProfile } = bond;
  const premium = isPremium();
  const dailyInsight = getBondDailyInsight(userProfile, otherProfile);
  const timeline = getBondTimeline(userProfile, otherProfile);

  const handleShare = async () => {
    const url = sharedBondUrl({
      a: birthToInvite(userProfile.birthData),
      b: birthToInvite(otherProfile.birthData),
    });
    const result = await shareOrCopy(
      'Our Bond — Nakshatra',
      `${userProfile.birthData.name} × ${otherProfile.birthData.name} — ${compatibility.overallScore}% · ${compatibility.bondType}`,
      url
    );
    if (result === 'copied') alert('Bond Card link copied.');
  };

  return (
    <div className="page bond-detail-page">
      <div className="container">
        {/* Back */}
        <button className="detail-back" onClick={() => navigate('/bonds')}>← Back to Bonds</button>

        {/* Header card */}
        <div className="detail-header-card">
          <div className="detail-profiles">
            <div className="detail-profile">
              <div className="detail-avatar detail-avatar-1">{userProfile.birthData.name.charAt(0)}</div>
              <span className="detail-name">{userProfile.birthData.name}</span>
              <span className="detail-sign">{getZodiacSymbol(userProfile.moonSign)} {userProfile.moonSign}</span>
            </div>
            
            <ScoreRing score={compatibility.overallScore} size={90} fontSize="1.3rem" />
            
            <div className="detail-profile">
              <div className="detail-avatar detail-avatar-2">{otherProfile.birthData.name.charAt(0)}</div>
              <span className="detail-name">{otherProfile.birthData.name}</span>
              <span className="detail-sign">{getZodiacSymbol(otherProfile.moonSign)} {otherProfile.moonSign}</span>
            </div>
          </div>
          
          <div className="detail-bond-type">
            <span className="detail-bond-label">{compatibility.bondType}</span>
            <span className="detail-guna">Guna Score: {compatibility.gunaScore}/{compatibility.maxGuna}</span>
          </div>
        </div>

        {/* Today's forecast */}
        <div className="detail-section">
          <h2 className="detail-section-title">Today's Bond Forecast</h2>
          <div className="detail-forecast">
            <span className="detail-forecast-date">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <p>{dailyInsight}</p>
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="detail-section">
          <h2 className="detail-section-title">Compatibility Breakdown</h2>
          <div className="detail-categories">
            {compatibility.categories.map((cat, i) => (
              <div key={i} className="detail-cat">
                <div className="detail-cat-top">
                  <span className="detail-cat-icon">{cat.icon}</span>
                  <div className="detail-cat-info">
                    <span className="detail-cat-name">{cat.name} <span className="detail-cat-hindi">{cat.nameHindi}</span></span>
                    <span className="detail-cat-desc">{cat.description}</span>
                  </div>
                  <span className="detail-cat-score">{cat.score}/{cat.maxScore}</span>
                </div>
                <div className="detail-cat-bar">
                  <div className="detail-cat-fill" style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="detail-section">
          <h2 className="detail-section-title">7-day bond weather</h2>
          {premium ? (
            <div className="detail-timeline">
              {timeline.map((day) => (
                <div key={day.isoDate} className={`detail-timeline-item tone-${day.tone}`}>
                  <span className="detail-timeline-date">{day.dateLabel}</span>
                  <div>
                    <strong>{day.title}</strong>
                    <p>{day.note}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-lock" style={{ minHeight: 140 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                See which days this week favor conversation, space, or closeness — reason to open Nakshatra tomorrow.
              </p>
              <div className="premium-badge-overlay">
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/premium')}>
                  Unlock timeline — Premium
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Strengths */}
        <div className="detail-section">
          <h2 className="detail-section-title">What works</h2>
          {compatibility.strengths.map((s, i) => (
            <div key={i} className="detail-insight success">
              <span>✓</span><p>{s}</p>
            </div>
          ))}
        </div>

        {/* Challenges */}
        <div className="detail-section">
          <h2 className="detail-section-title">Growth areas</h2>
          {compatibility.challenges.map((c, i) => (
            <div key={i} className="detail-insight warning">
              <span>→</span><p>{c}</p>
            </div>
          ))}
        </div>

        {premium && (
          <div className="detail-section">
            <h2 className="detail-section-title">Deep analysis</h2>
            {compatibility.deepInsights.map((insight) => (
              <div key={insight} className="detail-insight success">
                <span>✦</span><p>{insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="detail-actions">
          <button className="btn btn-primary btn-full" onClick={handleShare}>Share Bond Card ↗</button>
          {!premium && (
            <button className="btn btn-outline btn-full" onClick={() => navigate('/premium')}>
              Unlock Deep Analysis ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
