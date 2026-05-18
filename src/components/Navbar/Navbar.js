import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 2, marginBottom: -1 }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const Navbar = () => {
  const { currentUser, isUserLoading, logout } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showReadMenu, setShowReadMenu] = useState(false);
  const [mobileReadOpen, setMobileReadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [topCategories, setTopCategories] = useState([]);
  const readMenuTimer = useRef(null);
  const navigate = useNavigate();

  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

  /* Fetch top categories once — used for the Read dropdown */
  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data : (data?.categories || []);
        setTopCategories(cats.slice(0, 6));
      })
      .catch(() => {});
  }, [host]);

  const openReadMenu = () => {
    clearTimeout(readMenuTimer.current);
    setShowReadMenu(true);
  };
  const closeReadMenu = () => {
    readMenuTimer.current = setTimeout(() => setShowReadMenu(false), 120);
  };

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    setShowUserMenu(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setIsMobileOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-[0.8rem] tracking-[0.04em] uppercase transition-colors duration-150 ${
      isActive
        ? "text-[color:var(--accent)]"
        : "text-[color:var(--text2)] hover:text-[color:var(--text)]"
    }`;

  const iconBtnClass = "p-1.5 rounded text-[color:var(--text3)] hover:text-[color:var(--text)] transition-colors duration-150 bg-transparent border-0 cursor-pointer";

  return (
    <nav
      style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      aria-label="Global navigation"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 3rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link to="/" style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 500, color: "var(--text)", textDecoration: "none", letterSpacing: "0.01em" }}>
          √2
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-7">

          {/* Read — with dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={openReadMenu}
            onMouseLeave={closeReadMenu}
          >
            <NavLink
              to="/home"
              className={navLinkClass}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              Read <ChevronDown />
            </NavLink>

            {showReadMenu && (
              <div
                onMouseEnter={openReadMenu}
                onMouseLeave={closeReadMenu}
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 240,
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-md)",
                  zIndex: 60,
                  overflow: "hidden",
                }}
              >
                {/* All posts */}
                <Link
                  to="/home"
                  onClick={() => setShowReadMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.625rem 1rem",
                    fontSize: "0.875rem",
                    color: "var(--text)",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background var(--transition)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  All posts <span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>→</span>
                </Link>

                {/* Divider + Topics heading */}
                <div style={{ borderTop: "1px solid var(--border)", padding: "0.5rem 1rem 0.375rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>
                      Topics
                    </span>
                    <Link
                      to="/categories"
                      onClick={() => setShowReadMenu(false)}
                      style={{ fontSize: "0.6875rem", color: "var(--accent)", textDecoration: "none" }}
                    >
                      See all →
                    </Link>
                  </div>

                  {/* Category pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", paddingBottom: "0.625rem" }}>
                    {topCategories.length > 0
                      ? topCategories.map((cat) => (
                          <Link
                            key={cat._id}
                            to={`/category/${cat._id}`}
                            onClick={() => setShowReadMenu(false)}
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text2)",
                              background: "var(--bg3)",
                              border: "1px solid var(--border)",
                              borderRadius: "2px",
                              padding: "0.2rem 0.5rem",
                              textDecoration: "none",
                              transition: "color var(--transition), border-color var(--transition)",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                          >
                            {cat.name}
                          </Link>
                        ))
                      : /* fallback pills while loading */
                        ["Salesforce", "JavaScript", "AI"].map((name) => (
                          <span
                            key={name}
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text3)",
                              background: "var(--bg3)",
                              border: "1px solid var(--border)",
                              borderRadius: "2px",
                              padding: "0.2rem 0.5rem",
                            }}
                          >
                            {name}
                          </span>
                        ))
                    }
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/photos" className={navLinkClass}>Photos</NavLink>
          <NavLink to="/my-notes" className={navLinkClass}>Write</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
              style={{
                width: 160,
                padding: "0.375rem 2rem 0.375rem 0.75rem",
                fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--text)",
                outline: "none",
              }}
            />
            <button type="submit" className={iconBtnClass} style={{ position: "absolute", right: 4 }} aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className={iconBtnClass} aria-label={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* User area desktop */}
          <div className="hidden sm:block" style={{ position: "relative" }}>
            {!isUserLoading && currentUser ? (
              <>
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--text2)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {currentUser.profilePictureUrl
                    ? <img src={currentUser.profilePictureUrl} alt={currentUser.name} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
                    : (
                      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--linen)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600, color: "var(--text2)" }}>
                        {currentUser.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    )
                  }
                  <span>{currentUser.name}</span>
                </button>
                {showUserMenu && (
                  <div
                    onMouseLeave={() => setShowUserMenu(false)}
                    style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 160, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)", overflow: "hidden", zIndex: 60 }}
                  >
                    {[
                      { to: "/profile", label: "Profile" },
                      { to: "/my-notes", label: "My Notes" },
                      { to: "/edit-profile", label: "Settings" },
                    ].map(({ to, label }) => (
                      <Link
                        key={to} to={to} onClick={() => setShowUserMenu(false)}
                        style={{ display: "block", padding: "0.6rem 1rem", fontSize: "0.875rem", color: "var(--text2)", textDecoration: "none", transition: "background var(--transition)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "0.6rem 1rem", fontSize: "0.875rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", borderTop: "1px solid var(--border)" }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" style={{ fontSize: "0.875rem", color: "var(--text2)", textDecoration: "none" }}>Login</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem" }}>Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className={`sm:hidden ${iconBtnClass}`} onClick={() => setIsMobileOpen((s) => !s)} aria-label="Menu">
            {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg2)", padding: "1rem 1.5rem 1.5rem" }}>
          <form onSubmit={handleSearch} className="flex items-center mb-4" style={{ position: "relative" }}>
            <input
              type="text" placeholder="Search…" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: "0.5rem 2rem 0.5rem 0.75rem", fontSize: "0.875rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text)", outline: "none", fontFamily: "var(--font-sans)" }}
            />
            <button type="submit" className={iconBtnClass} style={{ position: "absolute", right: 4 }} aria-label="Search"><SearchIcon /></button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            {/* Read — expandable on mobile */}
            <button
              onClick={() => setMobileReadOpen((s) => !s)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: "0.9375rem", color: "var(--text2)", background: "none", border: "none",
                cursor: "pointer", padding: "0.5rem 0", textAlign: "left", width: "100%",
              }}
            >
              Read
              <ChevronDown />
            </button>

            {mobileReadOpen && (
              <div style={{ paddingLeft: "1rem", paddingBottom: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Link to="/home" onClick={() => setIsMobileOpen(false)}
                  style={{ fontSize: "0.875rem", color: "var(--text2)", textDecoration: "none" }}>
                  All posts
                </Link>
                <Link to="/categories" onClick={() => setIsMobileOpen(false)}
                  style={{ fontSize: "0.875rem", color: "var(--accent)", textDecoration: "none" }}>
                  All topics →
                </Link>
                {topCategories.map((cat) => (
                  <Link key={cat._id} to={`/category/${cat._id}`} onClick={() => setIsMobileOpen(false)}
                    style={{ fontSize: "0.875rem", color: "var(--text3)", textDecoration: "none" }}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {[
              { to: "/photos", label: "Photos" },
              { to: "/my-notes", label: "Write" },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass} onClick={() => setIsMobileOpen(false)}
                style={{ fontSize: "0.9375rem", letterSpacing: 0, textTransform: "none", padding: "0.5rem 0" }}>
                {label}
              </NavLink>
            ))}

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />
            {!isUserLoading && currentUser ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileOpen(false)} style={{ fontSize: "0.9375rem", color: "var(--text2)", textDecoration: "none", padding: "0.25rem 0" }}>{currentUser.name}</Link>
                <button onClick={handleLogout} style={{ textAlign: "left", fontSize: "0.9375rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0" }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileOpen(false)} style={{ fontSize: "0.9375rem", color: "var(--text2)", textDecoration: "none", padding: "0.25rem 0" }}>Login</Link>
                <Link to="/signup" onClick={() => setIsMobileOpen(false)} style={{ fontSize: "0.9375rem", color: "var(--accent)", textDecoration: "none", padding: "0.25rem 0" }}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
