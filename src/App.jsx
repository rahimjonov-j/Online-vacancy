import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F5F2EC;
    --surface: #FFFFFF;
    --ink: #1A1714;
    --ink-soft: #6B6560;
    --accent: #E8470A;
    --accent-light: #FFF0EB;
    --border: #E2DDD6;
    --shadow: 0 2px 8px rgba(26,23,20,0.07), 0 0 1px rgba(26,23,20,0.08);
    --shadow-hover: 0 8px 32px rgba(26,23,20,0.13), 0 0 1px rgba(26,23,20,0.1);
    --radius: 16px;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--ink);
    font-family: var(--font-body);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  /* ── HEADER ── */
  .header {
    padding: 56px 0 40px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .header-eyebrow {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .header-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--ink);
  }
  .header-title span { color: var(--accent); }
  .header-sub {
    font-size: 16px;
    color: var(--ink-soft);
    font-weight: 300;
    margin-top: 4px;
  }

  /* ── SEARCH ── */
  .search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
  }
  .search-input-wrap {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 18px;
    color: var(--ink-soft);
    pointer-events: none;
    width: 18px; height: 18px;
    flex-shrink: 0;
  }
  .search-input {
    width: 100%;
    height: 54px;
    padding: 0 20px 0 50px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 400;
    color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .search-input::placeholder { color: var(--ink-soft); }
  .search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(232,71,10,0.10);
  }
  .search-btn {
    height: 54px;
    padding: 0 28px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.18s, transform 0.12s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  .search-btn:hover { background: #c93d08; transform: translateY(-1px); }
  .search-btn:active { transform: translateY(0); }

  /* ── CATEGORIES ── */
  .categories {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }
  .cat-btn {
    padding: 9px 20px;
    border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.01em;
  }
  .cat-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-light);
  }
  .cat-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    font-weight: 700;
  }

  /* ── RESULTS META ── */
  .results-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .results-heading {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--ink);
  }
  .results-count {
    font-size: 13px;
    color: var(--ink-soft);
    background: var(--border);
    border-radius: 100px;
    padding: 3px 12px;
    font-weight: 500;
  }

  /* ── GRID ── */
  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 900px) { .jobs-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) {
    .jobs-grid { grid-template-columns: 1fr; }
    .search-btn { padding: 0 18px; }
    .header { padding: 36px 0 28px; }
  }

  /* ── JOB CARD ── */
  .job-card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: var(--shadow);
    transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
    position: relative;
    overflow: hidden;
  }
  .job-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  .job-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-3px);
    border-color: #D4CECC;
  }
  .job-card:hover::before { transform: scaleX(1); }

  /* card top row: logo LEFT, salary badge RIGHT */
  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .company-initial {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: var(--accent-light);
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  /* salary badge — top-right of card-top */
  .salary-badge {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-light);
    border: 1.5px solid rgba(232,71,10,0.18);
    border-radius: 8px;
    padding: 4px 10px;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: flex-start;
  }

  .job-title {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.3;
    letter-spacing: -0.01em;
  }
  .job-company {
    font-size: 14px;
    color: var(--ink-soft);
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .job-city {
    font-size: 13px;
    color: var(--ink-soft);
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: -4px;
  }
  .icon-sm {
    width: 14px; height: 14px;
    flex-shrink: 0;
    opacity: 0.55;
  }

  .card-spacer { flex: 1; }

  .view-btn {
    display: block;
    width: 100%;
    padding: 11px 0;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: transparent;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.18s;
    margin-top: 4px;
    letter-spacing: 0.01em;
  }
  .view-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  /* ── STATES ── */
  .state-box {
    grid-column: 1 / -1;
    padding: 80px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .state-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: var(--accent-light);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
  .state-icon svg { color: var(--accent); }
  .state-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
  }
  .state-sub {
    font-size: 15px;
    color: var(--ink-soft);
    font-weight: 300;
    max-width: 320px;
  }

  /* ── SKELETON ── */
  .skeleton-card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .skel {
    border-radius: 8px;
    background: linear-gradient(90deg, #EDE9E3 25%, #E2DDD6 50%, #EDE9E3 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .skel-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .skel-top  { height: 42px; width: 42px; border-radius: 10px; flex-shrink: 0; }
  .skel-badge{ height: 28px; width: 90px; border-radius: 8px; }
  .skel-line { height: 14px; width: 100%; }
  .skel-line.short { width: 60%; }
  .skel-line.mid   { width: 80%; }
  .skel-btn  { height: 40px; border-radius: 10px; margin-top: 8px; }

  /* ── PAGINATION ── */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 48px;
  }
  .page-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 16px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.18s;
    box-shadow: var(--shadow);
    white-space: nowrap;
  }
  .page-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-light);
    transform: translateY(-1px);
  }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .page-num-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.18s;
    box-shadow: var(--shadow);
    flex-shrink: 0;
  }
  .page-num-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-light);
    transform: translateY(-1px);
  }
  .page-num-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    box-shadow: 0 2px 8px rgba(232,71,10,0.30);
    transform: translateY(-1px);
  }
  .page-dots {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 40px;
    font-size: 14px;
    color: var(--ink-soft);
    flex-shrink: 0;
    letter-spacing: 0.05em;
  }
  @media (max-width: 580px) {
    .pagination { gap: 4px; }
    .page-btn      { padding: 0 12px; font-size: 13px; height: 36px; }
    .page-num-btn  { width: 36px; height: 36px; font-size: 13px; }
    .page-dots     { width: 24px; }
  }
`;

/* ── CONSTANTS ── */
const CATEGORIES = [
  { label: "Frontend",  query: "frontend developer" },
  { label: "Backend",   query: "backend developer" },
  { label: "Design",    query: "UX designer" },
  { label: "Marketing", query: "marketing manager" },
  { label: "DevOps",    query: "devops engineer" },
];

/* ── HELPERS ── */
function formatSalary(salary) {
  if (!salary) return null;
  const { from, to, currency } = salary;
  const fmt = (n) => n?.toLocaleString("ru-RU");
  if (from && to) return `${fmt(from)} – ${fmt(to)} ${currency}`;
  if (from) return `от ${fmt(from)} ${currency}`;
  if (to)   return `до ${fmt(to)} ${currency}`;
  return null;
}

/* ── SKELETON CARD ── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {/* top row: logo + salary badge placeholders */}
      <div className="skel-row">
        <div className="skel skel-top" />
        <div className="skel skel-badge" />
      </div>
      <div className="skel skel-line mid" />
      <div className="skel skel-line short" />
      <div className="skel skel-line" style={{ width: "45%" }} />
      <div className="skel skel-btn" />
    </div>
  );
}

/* ── JOB CARD ── */
function JobCard({ job }) {
  const title   = job.name;
  const company = job.employer?.name || "Unknown Company";
  const city    = job.area?.name || "";
  const salary  = formatSalary(job.salary);
  const url     = job.alternate_url;
  const initial = company.trim().charAt(0).toUpperCase();

  return (
    <div className="job-card">
      {/* top row: company logo LEFT, salary badge RIGHT */}
      <div className="card-top">
        <div className="company-initial">{initial}</div>
        {salary && <div className="salary-badge">{salary}</div>}
      </div>

      <div className="job-title">{title}</div>

      <div className="job-company">
        <svg className="icon-sm" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2h12a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1zm1 2v8h10V4H3zm2 2h2v2H5V6zm4 0h2v2H9V6z"/>
        </svg>
        {company}
      </div>

      {city && (
        <div className="job-city">
          <svg className="icon-sm" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5zm0 2a3 3 0 100 6A3 3 0 008 3z"/>
          </svg>
          {city}
        </div>
      )}

      <div className="card-spacer" />

      <a href={url} target="_blank" rel="noopener noreferrer" className="view-btn">
        View Vacancy →
      </a>
    </div>
  );
}

/* ── PAGE NUMBERS HELPER ── */
function getPageNumbers(current, total) {
  // Always show at most 7 slots: prev-dots, up to 5 pages, next-dots
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = [];
  const left  = Math.max(1, current - 2);
  const right = Math.min(total - 2, current + 2);

  pages.push(0);
  if (left > 1) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 2) pages.push("...");
  pages.push(total - 1);
  return pages;
}


export default function App() {
  const [query,           setQuery]           = useState(CATEGORIES[0].query);
  const [activeCategory,  setActiveCategory]  = useState(CATEGORIES[0].label);
  const [jobs,            setJobs]            = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [searched,        setSearched]        = useState(false);
  const [page,            setPage]            = useState(0);
  const [totalPages,      setTotalPages]      = useState(1);
  const [activeQuery,     setActiveQuery]     = useState(CATEGORIES[0].query);
  const inputRef = useRef(null);

  /* ── fetch ── */
  const fetchJobs = useCallback(async (searchText, pageNum = 0) => {
    if (!searchText.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res  = await fetch(
        `https://api.hh.ru/vacancies?text=${encodeURIComponent(searchText)}&per_page=20&page=${pageNum}`
      );
      const data = await res.json();
      setJobs(data.items || []);
      const pages = data.pages ?? Math.ceil((data.found ?? 0) / 20);
      setTotalPages(Math.min(pages, 20)); // hh.ru caps at 2000 results
    } catch {
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  /* auto-load on mount */
  useEffect(() => { fetchJobs(CATEGORIES[0].query, 0); }, [fetchJobs]);

  /* ── handlers ── */
  const handleSearch = () => {
    setActiveCategory(null);
    setActiveQuery(query);
    setPage(0);
    fetchJobs(query, 0);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat.label);
    setQuery(cat.query);
    setActiveQuery(cat.query);
    setPage(0);
    fetchJobs(cat.query, 0);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchJobs(activeQuery, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="header-eyebrow">Job Board</div>
          <h1 className="header-title">
            Find Your Next<br /><span>Great Role</span>
          </h1>
          <p className="header-sub">Thousands of vacancies from top companies, updated daily.</p>
        </header>

        {/* Search */}
        <div className="search-bar">
          <div className="search-input-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6"/>
              <path d="M15 15l3 3" strokeLinecap="round"/>
            </svg>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search jobs, titles, skills…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>

        {/* Categories */}
        <div className="categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className={`cat-btn${activeCategory === cat.label ? " active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results meta */}
        {searched && !loading && (
          <div className="results-meta">
            <div className="results-heading">
              {activeCategory ? `${activeCategory} Jobs` : `Results for "${activeQuery}"`}
            </div>
            {jobs.length > 0 && (
              <div className="results-count">{jobs.length} vacancies · page {page + 1}</div>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="jobs-grid">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading && searched && jobs.length === 0 && (
            <div className="state-box">
              <div className="state-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <div className="state-title">No jobs found</div>
              <div className="state-sub">Try a different keyword or browse a category above.</div>
            </div>
          )}

          {!loading && !searched && (
            <div className="state-box">
              <div className="state-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
              </div>
              <div className="state-title">Start your search</div>
              <div className="state-sub">Type a job title or pick a category to discover opportunities.</div>
            </div>
          )}

          {!loading && jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <div className="pagination">
            {/* Previous */}
            <button
              className="page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11L5 7l4-4"/>
              </svg>
              Prev
            </button>

            {/* Numbered pages */}
            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="page-dots">···</span>
              ) : (
                <button
                  key={p}
                  className={`page-num-btn${p === page ? " active" : ""}`}
                  onClick={() => p !== page && handlePageChange(p)}
                >
                  {p + 1}
                </button>
              )
            )}

            {/* Next */}
            <button
              className="page-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l4 4-4 4"/>
              </svg>
            </button>
          </div>
        )}

      </div>
    </>
  );
}