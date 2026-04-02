import { useState, useEffect } from "react";
import { Project, Contribution, Contributor } from "@/api/entities";

const COVER_IMAGE = "https://media.base44.com/images/public/69ce5296d956112b2568844a/2f052aaf3_generated_image.png";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Bolivia","Brazil",
  "Cambodia","Canada","Chile","China","Colombia","Croatia","Cuba","Czech Republic","Denmark","Egypt",
  "Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Haiti","Hungary","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kenya",
  "Lebanon","Libya","Malaysia","Mexico","Morocco","Myanmar","Nepal","Netherlands","Nigeria","North Korea",
  "Norway","Pakistan","Palestine","Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia",
  "Serbia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria",
  "Taiwan","Thailand","Turkey","Uganda","Ukraine","United Kingdom","United States","Venezuela","Vietnam","Yemen",
  "Zimbabwe","Other"
];

function ShareButtons({ name, country, content }) {
  const text = encodeURIComponent(`I just wrote my line in "One World, One Book — Written by Humanity" 🌍✍️\n\n"${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"\n\n— ${name}, ${country}\n\nJoin me & write yours:`);
  const url = encodeURIComponent("https://spark-app-b2d3d2c6.base44.app");
  const waText = encodeURIComponent(`✍️ I just added my voice to a global book being written by humanity.\n\n"${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"\n\n— ${name}, ${country}\n\nWrite YOUR line here 👉 https://spark-app-b2d3d2c6.base44.app`);

  return (
    <div style={{ marginTop: 24, textAlign: "center" }}>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 12, letterSpacing: 1 }}>SHARE YOUR CONTRIBUTION — INVITE THE WORLD</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#1da1f2", color: "#fff", padding: "10px 20px", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: "bold" }}
        >
          𝕏 Share on Twitter
        </a>
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#25d366", color: "#fff", padding: "10px 20px", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: "bold" }}
        >
          💬 Share on WhatsApp
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=One+World+One+Book&summary=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#0077b5", color: "#fff", padding: "10px 20px", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: "bold" }}
        >
          in Share on LinkedIn
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const [project, setProject] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ contributor_name: "", contributor_email: "", contributor_country: "", content: "", content_type: "Line" });
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("wall");
  const [countryCount, setCountryCount] = useState(0);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const projects = await Project.list();
    if (projects.length > 0) setProject(projects[0]);
    const contribs = await Contribution.filter({ status: "Approved" }, { sort: "-created_date", limit: 50 });
    setContributions(contribs);
    const unique = new Set(contribs.map(c => c.contributor_country).filter(Boolean));
    setCountryCount(unique.size);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const score = formData.content_type === "Chapter" ? 100 : formData.content_type === "Paragraph" ? 30 : formData.content_type === "Art" ? 50 : formData.content_type === "Idea" ? 20 : 10;
    await Contribution.create({ ...formData, project_id: project?.id, contribution_score: score, status: "Approved", upvotes: 0 });
    if (project) await Project.update(project.id, { total_contributions: (project.total_contributions || 0) + 1 });
    setLoading(false);
    setSubmitted(true);
    setSubmittedData({ ...formData });
    setShowForm(false);
    loadData();
  }

  const totalContribs = project?.total_contributions || contributions.length;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0a0a0f", minHeight: "100vh", color: "#e8d5b7" }}>

      {/* HERO */}
      <div style={{
        position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(10,10,15,1) 100%), url(${COVER_IMAGE}) center/cover no-repeat`
      }}>
        <div style={{ maxWidth: 800, padding: "0 24px" }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: "#c0a060", textTransform: "uppercase", marginBottom: 20 }}>🌍 A Global Movement</div>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: "bold", lineHeight: 1.2, margin: "0 0 24px", color: "#fff", textShadow: "0 0 40px rgba(200,160,80,0.5)" }}>
            One World,<br />One Book —<br /><span style={{ color: "#c0a060" }}>Written by Humanity</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", lineHeight: 1.8, color: "#ccc", maxWidth: 600, margin: "0 auto 32px" }}>
            Wars divide us. But words unite us.<br />
            This book is being written — right now — by people from every country on Earth.<br />
            <strong style={{ color: "#e8d5b7" }}>One line from you could change everything.</strong>
          </p>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
            {[{ label: "Words Written", value: totalContribs * 12 + "+" }, { label: "Contributors", value: totalContribs }, { label: "Countries", value: countryCount || "Be the first!" }].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: "bold", color: "#c0a060" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} style={{ background: "linear-gradient(135deg, #c0a060, #e8c870)", color: "#0a0a0f", border: "none", padding: "18px 48px", fontSize: "1.1rem", fontWeight: "bold", borderRadius: 4, cursor: "pointer", letterSpacing: 1, boxShadow: "0 0 30px rgba(200,160,80,0.4)" }}>
            ✍️ ADD YOUR VOICE TO HISTORY
          </button>
          {submitted && submittedData && (
            <div style={{ marginTop: 24 }}>
              <div style={{ color: "#c0a060", fontSize: "1.1rem", marginBottom: 8 }}>🌟 Your words are now part of history. Thank you, {submittedData.contributor_name}.</div>
              <ShareButtons name={submittedData.contributor_name} country={submittedData.contributor_country} content={submittedData.content} />
            </div>
          )}
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", color: "#555", fontSize: 13 }}>↓ See the book being written in real time</div>
      </div>

      {/* EMOTIONAL BANNER */}
      <div style={{ background: "#1a0a0a", borderTop: "1px solid #3a1a1a", borderBottom: "1px solid #3a1a1a", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ maxWidth: 700, margin: "0 auto", fontSize: "1.1rem", lineHeight: 2, color: "#d4a0a0", fontStyle: "italic" }}>
          "Somewhere right now, a child in Gaza, a soldier in Ukraine, a mother in Sudan — they all share the same sky.<br />
          This book is their story. It is your story. It is our story.<br />
          <strong style={{ color: "#e8d5b7" }}>Write one line. Be the bridge.</strong>"
        </p>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid #2a2a3a" }}>
          {[["wall", "📜 Contribution Wall"], ["leaderboard", "🏆 Contributors"], ["about", "💡 How You Earn"]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ background: "none", border: "none", padding: "12px 24px", cursor: "pointer", color: activeTab === key ? "#c0a060" : "#666", borderBottom: activeTab === key ? "2px solid #c0a060" : "2px solid transparent", fontSize: "0.95rem", fontFamily: "Georgia, serif", letterSpacing: 1 }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "wall" && (
          <div>
            <h2 style={{ color: "#c0a060", marginBottom: 24, fontSize: "1.3rem", letterSpacing: 2 }}>THE BOOK IS BEING WRITTEN...</h2>
            {contributions.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
                <p>The first page is blank. Be the first to write.</p>
                <button onClick={() => setShowForm(true)} style={{ marginTop: 16, background: "#c0a060", color: "#0a0a0f", border: "none", padding: "12px 32px", cursor: "pointer", fontFamily: "Georgia, serif" }}>Write the First Line</button>
              </div>
            )}
            {contributions.map((c) => (
              <div key={c.id} style={{ borderLeft: "3px solid #c0a060", paddingLeft: 20, marginBottom: 28 }}>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#e8d5b7", margin: "0 0 8px", fontStyle: "italic" }}>"{c.content}"</p>
                <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span>✍️ {c.contributor_name}</span>
                  {c.contributor_country && <span>🌍 {c.contributor_country}</span>}
                  <span style={{ color: "#5a5a3a" }}>{c.content_type} · {c.contribution_score} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <h2 style={{ color: "#c0a060", marginBottom: 24, fontSize: "1.3rem", letterSpacing: 2 }}>HISTORY MAKERS</h2>
            {contributions.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}><p>No contributors yet. Be the first legend.</p></div>}
            {contributions.slice(0, 20).map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid #1a1a2a" }}>
                <div style={{ fontSize: "1.5rem", width: 40, textAlign: "center", color: i < 3 ? "#c0a060" : "#444" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e8d5b7", fontWeight: "bold" }}>{c.contributor_name}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>{c.contributor_country} · {c.content_type}</div>
                </div>
                <div style={{ color: "#c0a060", fontWeight: "bold" }}>{c.contribution_score} pts</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ color: "#c0a060", marginBottom: 24, fontSize: "1.3rem", letterSpacing: 2 }}>HOW THE ECONOMY WORKS</h2>
            {[
              { icon: "✍️", title: "1. Contribute", desc: "Write a line, paragraph, chapter, idea or artwork. Every contribution earns you points." },
              { icon: "📊", title: "2. Points = Ownership", desc: "Your contribution score is your share. The more you contribute, the bigger your slice." },
              { icon: "💰", title: "3. Monetization", desc: "When the book is published or licensed — revenue is split to all contributors based on their score." },
              { icon: "🚀", title: "4. Share & Multiply", desc: "Invite others. Every person you bring in boosts your referral score and earnings." },
              { icon: "🌍", title: "5. Break Records", desc: "Goal: most contributors from most countries in history. Every country. Every language. One book." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: 20, marginBottom: 28 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ color: "#c0a060", fontWeight: "bold", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "#aaa", lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ background: "#1a1a0a", border: "1px solid #3a3a1a", padding: 24, marginTop: 16 }}>
              <div style={{ color: "#c0a060", fontWeight: "bold", marginBottom: 8 }}>📐 Contribution Scoring</div>
              <div style={{ color: "#aaa", fontSize: 14, lineHeight: 2 }}>
                One Line → 10 points<br />Paragraph → 30 points<br />Chapter → 100 points<br />Artwork → 50 points<br />Idea/Concept → 20 points
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div style={{ background: "linear-gradient(135deg, #1a0a0a, #0a0a1a)", padding: "60px 24px", textAlign: "center", borderTop: "1px solid #2a1a1a" }}>
        <h2 style={{ color: "#c0a060", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: 16 }}>The world is watching.<br />What will you write?</h2>
        <p style={{ color: "#888", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          In 100 years, when people read this book, your name will be there.<br />You chose peace. You chose to build. You chose humanity.
        </p>
        <button onClick={() => setShowForm(true)} style={{ background: "linear-gradient(135deg, #c0a060, #e8c870)", color: "#0a0a0f", border: "none", padding: "18px 48px", fontSize: "1.1rem", fontWeight: "bold", borderRadius: 4, cursor: "pointer", letterSpacing: 1 }}>
          ✍️ WRITE YOUR LINE NOW
        </button>
      </div>

      {/* CONTRIBUTION FORM MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "#0f0f1a", border: "1px solid #3a3a2a", padding: 40, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#c0a060", margin: 0, fontSize: "1.3rem" }}>✍️ Add Your Voice</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            <p style={{ color: "#888", marginBottom: 24, lineHeight: 1.7, fontStyle: "italic", borderLeft: "2px solid #c0a060", paddingLeft: 12 }}>
              "Even one line from you makes this book more complete. More human. More real."
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6, letterSpacing: 1 }}>YOUR NAME *</label>
                <input required value={formData.contributor_name} onChange={e => setFormData({ ...formData, contributor_name: e.target.value })} placeholder="The name history will remember" style={{ width: "100%", background: "#1a1a2a", border: "1px solid #3a3a4a", color: "#e8d5b7", padding: "12px 16px", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6, letterSpacing: 1 }}>YOUR COUNTRY *</label>
                <select required value={formData.contributor_country} onChange={e => setFormData({ ...formData, contributor_country: e.target.value })} style={{ width: "100%", background: "#1a1a2a", border: "1px solid #3a3a4a", color: "#e8d5b7", padding: "12px 16px", fontFamily: "Georgia, serif", boxSizing: "border-box" }}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6, letterSpacing: 1 }}>EMAIL (for earnings notification)</label>
                <input type="email" value={formData.contributor_email} onChange={e => setFormData({ ...formData, contributor_email: e.target.value })} placeholder="we'll notify you when you earn" style={{ width: "100%", background: "#1a1a2a", border: "1px solid #3a3a4a", color: "#e8d5b7", padding: "12px 16px", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6, letterSpacing: 1 }}>CONTRIBUTION TYPE</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Line", "Paragraph", "Chapter", "Art", "Idea"].map(type => (
                    <button type="button" key={type} onClick={() => setFormData({ ...formData, content_type: type })} style={{ padding: "8px 16px", border: "1px solid", borderColor: formData.content_type === type ? "#c0a060" : "#3a3a4a", background: formData.content_type === type ? "#2a2010" : "none", color: formData.content_type === type ? "#c0a060" : "#666", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 13 }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6, letterSpacing: 1 }}>YOUR WORDS *</label>
                <textarea required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder={formData.content_type === "Line" ? "Write one powerful line... even 'I believe in peace' is enough." : "Share your thoughts, your story, your vision for the world..."} rows={formData.content_type === "Chapter" ? 10 : formData.content_type === "Paragraph" ? 5 : 3} style={{ width: "100%", background: "#1a1a2a", border: "1px solid #3a3a4a", color: "#e8d5b7", padding: "12px 16px", fontFamily: "Georgia, serif", resize: "vertical", lineHeight: 1.8, boxSizing: "border-box" }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#555" : "linear-gradient(135deg, #c0a060, #e8c870)", color: "#0a0a0f", border: "none", padding: "16px", fontSize: "1rem", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Georgia, serif", letterSpacing: 1 }}>
                {loading ? "Submitting..." : "✍️ SUBMIT TO HISTORY"}
              </button>
              <p style={{ color: "#555", fontSize: 11, textAlign: "center", marginTop: 12 }}>By contributing, you agree to share in the monetization of this collective work.</p>
            </form>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "20px", color: "#333", fontSize: 12 }}>
        CoCreate © 2026 — A Contribution Economy Platform by Mandar
      </div>
    </div>
  );
}
