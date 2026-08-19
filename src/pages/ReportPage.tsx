import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getZodiacSymbol } from '../engine/vedic';
import { getBonds, getPurchasedReports, getUserProfile } from '../store/storage';
import './ReportPage.css';

export default function ReportPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const profile = getUserProfile();
  const bonds = getBonds();
  const purchased = getPurchasedReports();
  const reportType = type === 'family' ? 'family' : 'couple';

  useEffect(() => {
    if (!profile) navigate('/');
  }, [profile, navigate]);

  if (!profile) return null;

  if (!purchased.includes(reportType)) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: '24vh', textAlign: 'center' }}>
          <h1>Report not unlocked</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
            Purchase this report from Premium to view it in the prototype.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/premium')}>Go to Premium</button>
        </div>
      </div>
    );
  }

  const primary = bonds[0];
  const familyBonds = bonds.slice(0, 5);

  return (
    <div className="page report-page">
      <div className="container">
        <button className="report-back" onClick={() => navigate('/premium')}>← Premium</button>
        <span className="badge badge-premium">Prototype report</span>
        <h1>{reportType === 'couple' ? 'Couple Deep Dive' : 'Family Compatibility Map'}</h1>
        <p className="report-lead">
          Generated for {profile.birthData.name} · {getZodiacSymbol(profile.moonSign)} {profile.moonSign} · {profile.nakshatra}
        </p>

        {reportType === 'couple' && (
          <>
            {!primary ? (
              <div className="card">
                <p>Check a partner or crush first, then reopen this report. It uses your first saved bond.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/compatibility')}>
                  Check a bond
                </button>
              </div>
            ) : (
              <div className="report-body">
                <section className="card">
                  <h2>Bond snapshot</h2>
                  <p>
                    {profile.birthData.name} × {primary.profile.birthData.name} · {primary.compatibility.overallScore}% · {primary.compatibility.bondType}
                  </p>
                  <p>{primary.compatibility.bondDescription}</p>
                </section>
                <section className="card">
                  <h2>Where the chart agrees</h2>
                  {primary.compatibility.strengths.map((s) => <p key={s}>• {s}</p>)}
                </section>
                <section className="card">
                  <h2>Work for the next 90 days</h2>
                  {primary.compatibility.challenges.map((c) => <p key={c}>• {c}</p>)}
                  <p>• Use a high-communication day from your bond timeline for one honest conversation.</p>
                </section>
                <section className="card">
                  <h2>Suggested AstroLive follow-up</h2>
                  <p>
                    After this report, route the couple to a short Vedic relationship consult on AstroLive (live chat from ₹10/min). Nakshatra should create demand for astrologers, not replace them.
                  </p>
                </section>
              </div>
            )}
          </>
        )}

        {reportType === 'family' && (
          <div className="report-body">
            <section className="card">
              <h2>Household field</h2>
              <p>
                {familyBonds.length === 0
                  ? 'Add family bonds to populate this map. Each person you check becomes a node in the household chart.'
                  : `${profile.birthData.name} currently has ${familyBonds.length} mapped relationship${familyBonds.length === 1 ? '' : 's'} in Nakshatra.`}
              </p>
            </section>
            {familyBonds.map((b) => (
              <section className="card" key={b.id}>
                <h2>{b.profile.birthData.name} · {b.label}</h2>
                <p>{b.compatibility.overallScore}% · {b.compatibility.bondType} · Guna {b.compatibility.gunaScore}/36</p>
                <p>{b.compatibility.bondDescription}</p>
              </section>
            ))}
            <section className="card">
              <h2>How this monetizes</h2>
              <p>
                Family maps are a one-time ₹499 report that naturally upsells extra member checks and a shared Premium household seat — revenue beyond per-minute chat.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
