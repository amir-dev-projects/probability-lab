import Link from "next/link";
import { games } from "@/lib/lottery/games";

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="./" aria-label="LotteryLab home">
          <span className="brand-mark">L</span>
          <span>Lottery<span className="brand-light">Lab</span></span>
        </a>
        <span className="top-note">STATISTICS · RESEARCH · TRANSPARENCY</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="status-dot" /> RESEARCH WORKSPACE</div>
        <h1>Understand the numbers.<br /><span>Respect the odds.</span></h1>
        <p className="hero-copy">
          Explore historical draws, test statistical ideas, and see what the data
          can — and cannot — tell us.
        </p>
        <div className="hero-note">
          <span className="note-icon">i</span>
          Lottery outcomes are random. Historical patterns do not predict future draws.
        </div>
      </section>

      <section className="section-heading">
        <div>
          <div className="eyebrow">YOUR WORKSPACE</div>
          <h2>Choose a lottery</h2>
        </div>
        <span className="phase-label">PHASE 1 · FOUNDATION</span>
      </section>

      <section className="game-grid" aria-label="Lottery games">
        {games.map((game, index) => (
          <article className={index === 0 ? "game-card featured" : "game-card"} key={game.id}>
            <div className="card-topline">
              <span className="game-index">0{index + 1}</span>
              <span className={game.status === "In progress" ? "tag tag-active" : "tag"}>
                {game.status}
              </span>
            </div>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <div className="card-bottom">
              <span>{game.scope}</span>
              {game.id === "daily-grand" ? <Link className="card-preview-link" href="/daily-grand">Open preview ↗</Link> : <span className="arrow" aria-hidden="true">↗</span>}
            </div>
          </article>
        ))}
      </section>

      <section className="lower-grid">
        <article className="panel">
          <div className="eyebrow">ANALYSIS TOOLKIT</div>
          <h2>From raw draws to useful questions</h2>
          <div className="tool-list">
            <div><span className="tool-number">01</span><span><b>Frequency analysis</b><small>How often has each number appeared?</small></span></div>
            <div><span className="tool-number">02</span><span><b>Patterns &amp; distributions</b><small>Sums, odd/even splits, ranges and pairs.</small></span></div>
            <div><span className="tool-number">03</span><span><b>Walk-forward backtesting</b><small>Test ideas only against draws that came later.</small></span></div>
          </div>
        </article>
        <aside className="panel panel-muted">
          <div className="eyebrow">DATA INTEGRITY</div>
          <h2>No shortcuts. No false promises.</h2>
          <p>
            Every analysis will show its source, date range, sample size, and
            assumptions. Strategies will be compared with random picks using
            the same game rules.
          </p>
          <div className="integrity-line"><span className="integrity-check">✓</span> No future-data leakage</div>
          <div className="integrity-line"><span className="integrity-check">✓</span> Rule changes respected</div>
          <div className="integrity-line"><span className="integrity-check">✓</span> Random baseline included</div>
        </aside>
      </section>

      <footer>
        <span>LOTTERYLAB <span className="footer-muted">· An independent research project</span></span>
        <span>Built for curiosity, not prediction.</span>
      </footer>
    </main>
  );
}
