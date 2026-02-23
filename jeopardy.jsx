import { useState } from "react";

const CATEGORIES_R1 = ["Cloud Basics", "Service & Deploy", "Data DNA", "S3 & Storage", "Lock It Down"];
const CATEGORIES_R2 = ["DB Showdown", "Pick a Platform", "Compute Power", "Container Life", "Build the Pipe"];
const VALUES_R1 = [200, 400, 600, 800, 1000];
const VALUES_R2 = [400, 800, 1200, 1600, 2000];

const DEFAULT_TEAM_NAMES = ["AWS", "Azure", "GCP", "Oracle Cloud", "IBM Cloud", "Alibaba Cloud"];
const TEAM_COLORS = ["#FF9900", "#0078D4", "#4285F4", "#C74634", "#054ADA", "#FF6A00"];

const QUESTIONS_R1 = [
  [
    { q: "This NIST characteristic means you can provision resources like servers or storage without needing to call a human.", a: "What is on-demand self-service?" },
    { q: "This NIST characteristic ensures cloud services are accessible from laptops, phones, and tablets over standard networks.", a: "What is broad network access?" },
    { q: "If sequential processing takes 90 minutes and distributed processing takes 15 minutes, this is the speedup value.", a: "What is 6x?" },
    { q: "This NIST characteristic allows cloud resources to scale up or down quickly to match demand.", a: "What is rapid elasticity?" },
    { q: "This is the term for the extra time spent coordinating between nodes in a distributed system, and it limits real-world speedup.", a: "What is communication overhead?" }
  ],
  [
    { q: "In this service model, the provider manages everything and the customer simply uses the application. Gmail is a common example.", a: "What is SaaS?" },
    { q: "In this service model, the customer manages the OS, middleware, and applications while the provider handles virtualization and hardware.", a: "What is IaaS?" },
    { q: "This deployment model combines on-premises infrastructure with public cloud services, allowing workloads to move between them.", a: "What is a hybrid cloud?" },
    { q: "This deployment model is shared by several organizations with common concerns, such as compliance requirements in healthcare.", a: "What is a community cloud?" },
    { q: "In this service model, the provider manages the runtime and OS, and the customer only manages applications and data. Think Heroku or Elastic Beanstalk.", a: "What is PaaS?" }
  ],
  [
    { q: "XML and JSON are common examples of this type of data that has tags or markers but no rigid tabular schema.", a: "What is semi-structured data?" },
    { q: "This schema approach validates and structures data before it is stored, enforcing quality at write time.", a: "What is schema-on-write?" },
    { q: "This columnar file format, developed by Apache, supports compression and predicate pushdown, making it ideal for analytics workloads.", a: "What is Parquet?" },
    { q: "Images, video, audio, and free-form text are all examples of this data type that has no predefined structure.", a: "What is unstructured data?" },
    { q: "This schema approach applies structure only when data is queried, offering flexibility for exploratory analytics but risking quality issues at read time.", a: "What is schema-on-read?" }
  ],
  [
    { q: "S3 bucket names must be globally unique and follow these kinds of naming rules, similar to website addresses.", a: "What are DNS-compliant naming rules?" },
    { q: "These are the three layers of a data warehouse model, moving from ingestion to analyst-ready datasets.", a: "What are raw, processed, and curated?" },
    { q: "In S3, every stored item consists of a key, the data itself, and this third component that describes attributes like content type.", a: "What is metadata?" },
    { q: "Storing all files in a single flat prefix without partitioning is an example of this kind of S3 design mistake.", a: "What is poor partition design (or lack of partitioning)?" },
    { q: "This row-oriented, plain-text format is the simplest for data exchange but lacks schema enforcement, compression, and type information.", a: "What is CSV?" }
  ],
  [
    { q: "In AWS IAM policy evaluation, this type of statement always wins, regardless of any allow statements.", a: "What is an explicit deny?" },
    { q: "This AWS service adds fine-grained column-level and row-level permissions on top of raw S3 bucket access.", a: "What is Lake Formation?" },
    { q: "This is a cloud risk where a provider outage takes down your application because you depend entirely on their infrastructure.", a: "What is vendor lock-in (or single point of failure / availability risk)?" },
    { q: "Lake Formation governs access but does not check whether values are valid, complete, or consistent \u2014 that requires this type of separate tooling.", a: "What is data quality tooling?" },
    { q: "NIST\u2019s measured service characteristic enables this billing approach where you pay only for what you consume.", a: "What is pay-as-you-go (or metered billing)?" }
  ]
];

const QUESTIONS_R2 = [
  [
    { q: "This type of database workload handles high-volume, low-latency transactions like point-of-sale systems and user logins.", a: "What is OLTP?" },
    { q: "Amazon RDS uses this strategy to provide high availability by synchronously replicating data to a standby instance in a different availability zone.", a: "What is Multi-AZ deployment?" },
    { q: "This Google service uses a serverless, pay-per-query model and is column-oriented, making it a strong fit for ad-hoc analytics.", a: "What is BigQuery?" },
    { q: "These are asynchronous copies of an RDS instance used to offload read traffic, not for failover.", a: "What are read replicas?" },
    { q: "When a workload requires both fast transactional writes and heavy analytical queries, this architecture separates the two concerns into different services.", a: "What is an RDS + warehouse split?" }
  ],
  [
    { q: "A web app needs sub-second lookups, modest data volume, and has no DBA. This managed relational service is the recommended fit.", a: "What is Amazon RDS (or Aurora Serverless)?" },
    { q: "This is one of the five decision-framework questions, and it asks about the expected data size and how fast it will grow.", a: "What is data volume and growth?" },
    { q: "A retail analytics team runs predictable weekly aggregate queries over multi-terabyte data with dedicated engineers. This provisioned warehouse fits best.", a: "What is Amazon Redshift?" },
    { q: "When the team lacks deep infrastructure expertise, the decision framework steers toward this type of managed or serverless service.", a: "What is a serverless (or fully managed) platform?" },
    { q: "A marketing team with highly variable ad-hoc SQL usage and no infrastructure support should choose this pay-per-query platform.", a: "What is Google BigQuery?" }
  ],
  [
    { q: "This workload type \u2014 such as nightly ETL \u2014 typically has relaxed SLAs and is best served by scheduled, ephemeral compute.", a: "What is batch ETL?" },
    { q: "Dollars per terabyte processed is an example of this category of metric used when defining a compute pattern.", a: "What is a cost metric?" },
    { q: "This distributed processing framework is preferred over serverless SQL when you need complex multi-stage transformations on very large datasets.", a: "What is Spark?" },
    { q: "Near-real-time fraud alerting within 2 minutes requires this general type of compute pattern, as opposed to batch.", a: "What is streaming (or always-on / near-real-time) compute?" },
    { q: "Query P95 latency is an example of this category of metric tracked when defining workload requirements.", a: "What is a speed metric?" }
  ],
  [
    { q: "This is a read-only, packaged snapshot of an application and its dependencies used to create running containers.", a: "What is a container image?" },
    { q: "This property means a container job can be run multiple times and produce the same result, making retries safe.", a: "What is idempotency?" },
    { q: "Pinning a container image to a specific digest or version tag so it can never be overwritten is called using this.", a: "What is an immutable image tag?" },
    { q: "This defines the expected inputs and outputs of a containerized job, such as reading from an S3 path and writing to another.", a: "What is an I/O contract?" },
    { q: "When a partitioned Spark job fails and retries, this container property prevents duplicate or corrupted output data.", a: "What is idempotency?" }
  ],
  [
    { q: "In the class lab, this AWS service provided a managed Kubernetes environment for running containerized jobs.", a: "What is EKS?" },
    { q: "When EKS jobs start but cannot access S3, this is the most likely cause.", a: "What is a missing or misconfigured IAM role (or service account permissions)?" },
    { q: "Partitioning data by date or category reduces the amount of data scanned by these two query services, lowering cost.", a: "What are Athena and BigQuery?" },
    { q: "When a pipeline rerun produces duplicate outputs, this design principle was likely not followed.", a: "What is idempotency?" },
    { q: "A fraud team needs 2-minute alerts (always-on streaming) and weekly reconciliation reports (scheduled batch). A single batch-only pipeline fails because of this fundamental limitation.", a: "What is the inability to meet real-time latency requirements?" }
  ]
];

const DAILY_DOUBLES_R1 = [[2, 3], [4, 2]];
const DAILY_DOUBLES_R2 = [[1, 4], [3, 3]];

export default function JeopardyGame() {
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState(DEFAULT_TEAM_NAMES.map(() => 0));
  const [teamNames, setTeamNames] = useState([...DEFAULT_TEAM_NAMES]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [numTeams, setNumTeams] = useState(4);
  const [revealed, setRevealed] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDailyDouble, setIsDailyDouble] = useState(false);
  const [ddWager, setDdWager] = useState("");
  const [ddTeam, setDdTeam] = useState(null);
  const [ddConfirmed, setDdConfirmed] = useState(false);
  const [animatingDD, setAnimatingDD] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const categories = round === 1 ? CATEGORIES_R1 : CATEGORIES_R2;
  const values = round === 1 ? VALUES_R1 : VALUES_R2;
  const questions = round === 1 ? QUESTIONS_R1 : QUESTIONS_R2;
  const dailyDoubles = round === 1 ? DAILY_DOUBLES_R1 : DAILY_DOUBLES_R2;
  const roundKey = `r${round}`;

  const isDDCell = (col, row) => dailyDoubles.some(([c, r]) => c === col && r === row);

  const handleCellClick = (col, row) => {
    const key = `${roundKey}-${col}-${row}`;
    if (revealed[key] || round === 0) return;
    if (isDDCell(col, row)) {
      setActiveCell({ col, row });
      setAnimatingDD(true);
      setIsDailyDouble(true);
      setDdWager("");
      setDdTeam(null);
      setDdConfirmed(false);
      setShowAnswer(false);
      setTimeout(() => setAnimatingDD(false), 1800);
    } else {
      setActiveCell({ col, row });
      setIsDailyDouble(false);
      setShowAnswer(false);
    }
    setRevealed(prev => ({ ...prev, [key]: true }));
  };

  const awardPoints = (teamIdx, correct) => {
    if (activeCell === null) return;
    let pts = isDailyDouble && ddConfirmed ? (parseInt(ddWager) || 0) : values[activeCell.row];
    setScores(prev => {
      const next = [...prev];
      next[teamIdx] += correct ? pts : -pts;
      return next;
    });
  };

  const closeQuestion = () => {
    setActiveCell(null);
    setIsDailyDouble(false);
    setDdConfirmed(false);
    setShowAnswer(false);
    setAnimatingDD(false);
  };

  const startRound = (r) => {
    setRound(r);
    setActiveCell(null);
    setShowAnswer(false);
  };

  const allRevealed = () => {
    for (let c = 0; c < 5; c++)
      for (let r = 0; r < 5; r++)
        if (!revealed[`${roundKey}-${c}-${r}`]) return false;
    return true;
  };

  // Final scores screen
  if (gameOver) {
    const activeScores = scores.slice(0, numTeams).map((s, i) => ({ name: teamNames[i], score: s, color: TEAM_COLORS[i], idx: i }));
    activeScores.sort((a, b) => b.score - a.score);
    return (
      <div style={styles.setupContainer}>
        <div style={{ ...styles.setupInner, maxWidth: 600 }}>
          <div style={styles.logoArea}>
            <div style={styles.logoText}>CLOUD COMPUTING</div>
            <div style={styles.logoSubtext}>JEOPARDY!</div>
            <div style={{ ...styles.logoMini, marginBottom: 20 }}>FINAL RESULTS</div>
          </div>
          {activeScores.map((t, rank) => (
            <div key={t.idx} style={{
              display: "flex", alignItems: "center", gap: 16, width: "100%",
              padding: "14px 20px", borderRadius: 12,
              background: rank === 0 ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.03)",
              border: rank === 0 ? "2px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: rank === 0 ? "#FFD700" : "#556", width: 36, textAlign: "center" }}>
                {rank === 0 ? "\u{1F3C6}" : `#${rank + 1}`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.color, fontSize: 18, fontWeight: 700 }}>{t.name}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.score < 0 ? "#ff6b6b" : "#FFD700" }}>
                {t.score < 0 ? "\u2212" : ""}${Math.abs(t.score).toLocaleString()}
              </div>
            </div>
          ))}
          <button onClick={() => { setGameOver(false); setRound(0); setRevealed({}); setScores(DEFAULT_TEAM_NAMES.map(() => 0)); }}
            style={{ ...styles.startBtn, marginTop: 12, maxWidth: 300 }}>New Game</button>
        </div>
      </div>
    );
  }

  // Setup screen
  if (round === 0) {
    return (
      <div style={styles.setupContainer}>
        <div style={styles.setupInner}>
          <div style={styles.logoArea}>
            <div style={styles.logoText}>CLOUD COMPUTING</div>
            <div style={styles.logoSubtext}>JEOPARDY!</div>
            <div style={styles.logoMini}>DSBA 6190 Midterm Review</div>
          </div>
          <div style={styles.setupCard}>
            <div style={styles.setupLabel}>Number of Teams</div>
            <div style={styles.teamCountRow}>
              {[2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => {
                  setNumTeams(n);
                  setScores(prev => { const s = [...prev]; while (s.length < n) s.push(0); return s; });
                  setTeamNames(prev => { const t = [...prev]; while (t.length < n) t.push(DEFAULT_TEAM_NAMES[t.length] || `Team ${t.length+1}`); return t; });
                }} style={{ ...styles.countBtn, ...(numTeams === n ? styles.countBtnActive : {}) }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={styles.setupLabel}>Team Names</div>
            {Array.from({ length: numTeams }).map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: TEAM_COLORS[i], flexShrink: 0 }} />
                <input value={teamNames[i] || DEFAULT_TEAM_NAMES[i]}
                  onChange={e => { const names = [...teamNames]; names[i] = e.target.value; setTeamNames(names); }}
                  style={styles.nameInput} placeholder={DEFAULT_TEAM_NAMES[i]} />
              </div>
            ))}
            <button onClick={() => startRound(1)} style={styles.startBtn}>Start Round 1</button>
          </div>
        </div>
      </div>
    );
  }

  // Question overlay
  if (activeCell !== null) {
    const cellQ = questions[activeCell.col][activeCell.row];
    return (
      <div style={styles.overlay}>
        {animatingDD ? (
          <div style={styles.ddReveal}>
            <div style={styles.ddStar}>\u2605</div>
            <div style={styles.ddText}>DAILY DOUBLE!</div>
          </div>
        ) : isDailyDouble && !ddConfirmed ? (
          <div style={styles.ddWagerPanel}>
            <div style={styles.ddBadge}>\u2605 DAILY DOUBLE \u2605</div>
            <div style={styles.ddInstructions}>Select the team and enter a wager</div>
            <div style={styles.ddTeamRow}>
              {Array.from({ length: numTeams }).map((_, i) => (
                <button key={i} onClick={() => setDdTeam(i)} style={{
                  ...styles.ddTeamBtn,
                  ...(ddTeam === i ? { borderColor: TEAM_COLORS[i], background: `${TEAM_COLORS[i]}18`, color: TEAM_COLORS[i] } : {})
                }}>
                  {teamNames[i]}
                  <span style={styles.ddTeamScore}>${scores[i].toLocaleString()}</span>
                </button>
              ))}
            </div>
            <input type="number" placeholder="Enter wager" value={ddWager}
              onChange={e => setDdWager(e.target.value)} style={styles.wagerInput} min={0} />
            <button onClick={() => { if (ddTeam !== null && ddWager) setDdConfirmed(true); }}
              style={{ ...styles.wagerConfirmBtn, opacity: ddTeam !== null && ddWager ? 1 : 0.4 }}>
              Confirm Wager
            </button>
          </div>
        ) : (
          <div style={styles.questionPanel}>
            {isDailyDouble && <div style={styles.ddBadgeSmall}>{"\u2605"} DAILY DOUBLE {"\u2014"} ${parseInt(ddWager).toLocaleString()} {"\u2605"}</div>}
            <div style={styles.categoryLabel}>{categories[activeCell.col]}</div>
            <div style={styles.valueLabel}>${isDailyDouble ? parseInt(ddWager).toLocaleString() : values[activeCell.row].toLocaleString()}</div>
            <div style={styles.questionText}>{cellQ.q}</div>
            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)} style={styles.revealBtn}>Reveal Answer</button>
            ) : (
              <>
                <div style={styles.answerText}>{cellQ.a}</div>
                {isDailyDouble && ddTeam !== null ? (
                  <div style={styles.awardRow}>
                    <span style={{ ...styles.awardLabel, color: TEAM_COLORS[ddTeam] }}>{teamNames[ddTeam]}:</span>
                    <button onClick={() => { awardPoints(ddTeam, true); closeQuestion(); }} style={styles.correctBtn}>Correct</button>
                    <button onClick={() => { awardPoints(ddTeam, false); closeQuestion(); }} style={styles.wrongBtn}>Incorrect</button>
                  </div>
                ) : (
                  <div style={styles.awardSection}>
                    <div style={styles.awardTitle}>Award points:</div>
                    <div style={styles.awardGrid}>
                      {Array.from({ length: numTeams }).map((_, i) => (
                        <div key={i} style={styles.awardRow}>
                          <span style={{ ...styles.awardLabel, color: TEAM_COLORS[i] }}>{teamNames[i]}</span>
                          <button onClick={() => awardPoints(i, true)} style={styles.correctBtn}>+${values[activeCell.row]}</button>
                          <button onClick={() => awardPoints(i, false)} style={styles.wrongBtn}>{"\u2212"}${values[activeCell.row]}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={closeQuestion} style={styles.closeBtn}>Back to Board</button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Game board
  return (
    <div style={styles.gameContainer}>
      <div style={styles.header}>
        <div style={styles.roundIndicator}>
          {round === 1 ? "ROUND 1 \u2014 JEOPARDY!" : "ROUND 2 \u2014 DOUBLE JEOPARDY!"}
        </div>
      </div>
      <div style={styles.scoreboard}>
        {Array.from({ length: numTeams }).map((_, i) => (
          <div key={i} style={{ ...styles.scoreCard, borderColor: `${TEAM_COLORS[i]}44` }}>
            <div style={{ width: "100%", height: 3, background: TEAM_COLORS[i], borderRadius: "8px 8px 0 0", marginTop: -8 }} />
            {editingTeam === i ? (
              <input value={teamNames[i]} onChange={e => { const n = [...teamNames]; n[i] = e.target.value; setTeamNames(n); }}
                onBlur={() => setEditingTeam(null)} onKeyDown={e => e.key === "Enter" && setEditingTeam(null)}
                autoFocus style={styles.scoreNameInput} />
            ) : (
              <div style={{ ...styles.scoreName, color: TEAM_COLORS[i] }} onClick={() => setEditingTeam(i)}>{teamNames[i]}</div>
            )}
            <div style={{ ...styles.scoreValue, color: scores[i] < 0 ? "#ff6b6b" : "#FFD700" }}>
              {scores[i] < 0 ? "\u2212" : ""}${Math.abs(scores[i]).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.board}>
        <div style={styles.boardRow}>
          {categories.map((cat, ci) => (
            <div key={ci} style={styles.catCell}>
              <span style={styles.catText}>{cat.toUpperCase()}</span>
            </div>
          ))}
        </div>
        {values.map((val, ri) => (
          <div key={ri} style={styles.boardRow}>
            {categories.map((_, ci) => {
              const key = `${roundKey}-${ci}-${ri}`;
              const used = revealed[key];
              return (
                <div key={ci} onClick={() => handleCellClick(ci, ri)}
                  style={{ ...styles.cell, ...(used ? styles.cellUsed : styles.cellActive), cursor: used ? "default" : "pointer" }}>
                  {!used && <span style={styles.cellValue}>${val}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={styles.navRow}>
        {round === 1 && (
          <button onClick={() => startRound(2)} style={allRevealed() ? styles.nextRoundBtn : styles.skipBtn}>
            {allRevealed() ? "Proceed to Double Jeopardy \u2192" : "Skip to Round 2 \u2192"}
          </button>
        )}
        {round === 2 && (
          <button onClick={() => setGameOver(true)} style={styles.nextRoundBtn}>Final Scores</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  setupContainer: {
    minHeight: "100vh", background: "linear-gradient(135deg, #0a0e2a 0%, #0c1445 40%, #1a0a3e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", padding: 20,
  },
  setupInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 520 },
  logoArea: { textAlign: "center" },
  logoText: { fontSize: 16, letterSpacing: 6, color: "#8899cc", fontWeight: 600, marginBottom: 4 },
  logoSubtext: { fontSize: 48, fontWeight: 900, color: "#FFD700", textShadow: "0 2px 20px rgba(255,215,0,0.3)", letterSpacing: 2 },
  logoMini: { fontSize: 13, color: "#6677aa", marginTop: 8, letterSpacing: 2 },
  setupCard: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16, padding: "28px 28px 24px", width: "100%", display: "flex", flexDirection: "column", gap: 10,
  },
  setupLabel: { color: "#aabbdd", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 6 },
  teamCountRow: { display: "flex", gap: 6 },
  countBtn: {
    flex: 1, padding: "10px 0", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#ccc", fontSize: 18, fontWeight: 700, cursor: "pointer",
  },
  countBtnActive: { background: "rgba(255,215,0,0.15)", borderColor: "#FFD700", color: "#FFD700" },
  nameInput: {
    flex: 1, padding: "9px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, color: "#eee", fontSize: 15, outline: "none",
  },
  startBtn: {
    marginTop: 12, padding: "14px 0", background: "linear-gradient(135deg, #FFD700, #FFA500)",
    border: "none", borderRadius: 10, color: "#1a0a3e", fontSize: 18, fontWeight: 800, cursor: "pointer", letterSpacing: 1,
  },
  gameContainer: {
    minHeight: "100vh", background: "linear-gradient(180deg, #0a0e2a 0%, #0c1445 100%)",
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", padding: "10px 10px 16px",
    display: "flex", flexDirection: "column", gap: 8,
  },
  header: { textAlign: "center" },
  roundIndicator: { fontSize: 14, fontWeight: 700, color: "#FFD700", letterSpacing: 3, textTransform: "uppercase" },
  scoreboard: { display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" },
  scoreCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,215,0,0.15)",
    borderRadius: 8, padding: "8px 14px 6px", textAlign: "center", minWidth: 85, position: "relative", overflow: "hidden",
  },
  scoreName: { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", marginTop: 4 },
  scoreNameInput: {
    background: "transparent", border: "none", borderBottom: "1px solid #FFD700",
    color: "#eee", fontSize: 10, fontWeight: 600, textAlign: "center", outline: "none", width: 65, marginTop: 4,
  },
  scoreValue: { fontSize: 20, fontWeight: 900, color: "#FFD700", marginTop: 2 },
  board: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  boardRow: { display: "flex", gap: 3, flex: 1 },
  catCell: {
    flex: 1, background: "linear-gradient(180deg, #1a237e, #0d1457)", borderRadius: 5,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 4px", minHeight: 48,
  },
  catText: { color: "#FFD700", fontSize: 11, fontWeight: 800, textAlign: "center", letterSpacing: 0.8, lineHeight: 1.3 },
  cell: { flex: 1, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 54, transition: "all 0.15s ease" },
  cellActive: { background: "linear-gradient(180deg, #1a3a8a, #0d1f6a)", border: "1px solid rgba(255,215,0,0.12)" },
  cellUsed: { background: "rgba(10,14,42,0.6)", border: "1px solid rgba(255,255,255,0.03)" },
  cellValue: { color: "#FFD700", fontSize: 26, fontWeight: 900, textShadow: "0 1px 8px rgba(255,215,0,0.25)" },
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "linear-gradient(135deg, #060b24 0%, #0c1445 50%, #1a0a3e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", padding: 20,
  },
  questionPanel: { maxWidth: 700, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  categoryLabel: { color: "#8899cc", fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" },
  valueLabel: { color: "#FFD700", fontSize: 18, fontWeight: 800 },
  questionText: { color: "#eef0ff", fontSize: 24, fontWeight: 500, lineHeight: 1.5, padding: "12px 0", maxWidth: 600 },
  answerText: {
    color: "#7fff7f", fontSize: 22, fontWeight: 700, padding: "10px 22px",
    background: "rgba(127,255,127,0.06)", borderRadius: 12, border: "1px solid rgba(127,255,127,0.15)",
  },
  revealBtn: {
    padding: "11px 34px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 10, color: "#ccc", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 6,
  },
  awardSection: { display: "flex", flexDirection: "column", gap: 6, marginTop: 8, width: "100%", maxWidth: 500, alignItems: "center" },
  awardTitle: { color: "#8899cc", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" },
  awardGrid: { display: "flex", flexDirection: "column", gap: 6, width: "100%" },
  awardRow: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center" },
  awardLabel: { color: "#ccc", fontSize: 13, fontWeight: 700, minWidth: 100, textAlign: "right" },
  correctBtn: {
    padding: "7px 16px", background: "rgba(80,200,80,0.12)", border: "1px solid rgba(80,200,80,0.35)",
    borderRadius: 7, color: "#7fff7f", fontSize: 13, fontWeight: 700, cursor: "pointer",
  },
  wrongBtn: {
    padding: "7px 16px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)",
    borderRadius: 7, color: "#ff6b6b", fontSize: 13, fontWeight: 700, cursor: "pointer",
  },
  closeBtn: {
    marginTop: 12, padding: "9px 28px", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#aaa", fontSize: 13, cursor: "pointer",
  },
  ddReveal: { textAlign: "center" },
  ddStar: { fontSize: 80, color: "#FFD700", textShadow: "0 0 40px rgba(255,215,0,0.6)" },
  ddText: { fontSize: 42, fontWeight: 900, color: "#FFD700", letterSpacing: 4, textShadow: "0 0 30px rgba(255,215,0,0.4)", marginTop: 8 },
  ddWagerPanel: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: 520, width: "100%" },
  ddBadge: { color: "#FFD700", fontSize: 20, fontWeight: 800, letterSpacing: 3 },
  ddBadgeSmall: { color: "#FFD700", fontSize: 13, fontWeight: 700, letterSpacing: 2, opacity: 0.8 },
  ddInstructions: { color: "#8899cc", fontSize: 13 },
  ddTeamRow: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  ddTeamBtn: {
    padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 9, color: "#ccc", fontSize: 13, fontWeight: 600, cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
  },
  ddTeamScore: { fontSize: 10, opacity: 0.6 },
  wagerInput: {
    padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 10, color: "#FFD700", fontSize: 22, fontWeight: 700, textAlign: "center", outline: "none", width: 180,
  },
  wagerConfirmBtn: {
    padding: "11px 32px", background: "linear-gradient(135deg, #FFD700, #FFA500)",
    border: "none", borderRadius: 10, color: "#1a0a3e", fontSize: 15, fontWeight: 800, cursor: "pointer",
  },
  navRow: { display: "flex", justifyContent: "center", gap: 12, paddingTop: 2 },
  nextRoundBtn: {
    padding: "11px 26px", background: "linear-gradient(135deg, #FFD700, #FFA500)",
    border: "none", borderRadius: 10, color: "#1a0a3e", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5,
  },
  skipBtn: {
    padding: "9px 22px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, color: "#8899cc", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
};
