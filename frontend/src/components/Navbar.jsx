import { useState } from 'react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="nav-inner">
        <a className="brand" href="#main-content" onClick={closeMenu}><span className="brand-mark" aria-hidden="true">✦</span><span><strong>RailWatch</strong><small>Station intelligence</small></span></a>
        <div className="desktop-links"><a href="#overview-heading">Overview</a><a href="#search-heading">Search</a><a href="#analytics-heading">Analytics</a></div>
        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme">{darkMode ? '☼' : '◐'}</button>
          <button className="menu-button" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>☰</button>
        </div>
      </div>
      {mobileOpen && <div id="mobile-navigation" className="mobile-links"><a href="#overview-heading" onClick={closeMenu}>Overview</a><a href="#search-heading" onClick={closeMenu}>Search</a><a href="#analytics-heading" onClick={closeMenu}>Analytics</a></div>}
    </nav>
  );
};

export default Navbar;
