import { Variants } from "../../src/Variants";
import {
  theme,
  viewMode,
  featureFlag,
  motionPref,
  colorScheme,
} from "./variants";
import ThemeControls from "./ThemeControls";
import ViewModeControls from "./ViewModeControls";

export default function Home() {
  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          react-unsafe-local-variants
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.8,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Zero-flash client-side personalization for React SSR/SSG. Read
          localStorage, cookies, URL params & media queries before first paint.
        </p>
      </header>

      {/* ========== localStorage Demo ========== */}
      <section
        className="card"
        style={{ background: "var(--primary)", color: "white", border: "none" }}
      >
        <h2 style={{ color: "white" }}>1. localStorage</h2>
        <p style={{ opacity: 0.9, marginBottom: "1rem" }}>
          Select a theme, reload the page - no flash, instant theme.
        </p>
        <ThemeControls />
        <div style={{ marginTop: "1rem" }}>
          <Variants use={theme}>
            {{
              light: (
                <div
                  className="variant-box"
                  style={{ background: "#f0f9ff", color: "#000" }}
                >
                  <strong>Light Mode</strong> - You selected light theme
                </div>
              ),
              dark: (
                <div
                  className="variant-box"
                  style={{ background: "#1a1a2e", color: "#fff" }}
                >
                  <strong>Dark Mode</strong> - You selected dark theme
                </div>
              ),
              system: (
                <div
                  className="variant-box"
                  style={{ background: "#e8e8e8", color: "#333" }}
                >
                  <strong>System Mode</strong> - Following OS preference
                </div>
              ),
            }}
          </Variants>
        </div>
        <pre
          className="code-block"
          style={{
            marginTop: "1rem",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
          }}
        >
          {`const theme = variant({
  key: 'theme-choice',
  options: ['light', 'dark', 'system'],
  default: 'system',
  read: fromLocalStorage('theme')
})`}
        </pre>
      </section>

      {/* ========== Cookie Demo ========== */}
      <section className="card" style={{ marginTop: "2rem" }}>
        <h2>2. Cookie</h2>
        <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
          View mode stored in a cookie. Works even with SSR since cookies are
          sent with the request.
        </p>
        <ViewModeControls />
        <div style={{ marginTop: "1rem" }}>
          <Variants use={viewMode}>
            {{
              grid: (
                <div
                  className="variant-box"
                  style={{ background: "#e3f2fd", color: "#000" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0.5rem",
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        style={{
                          background: "#90caf9",
                          padding: "1rem",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        Item {i}
                      </div>
                    ))}
                  </div>
                </div>
              ),
              list: (
                <div
                  className="variant-box"
                  style={{ background: "#e8f5e9", color: "#000" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          background: "#a5d6a7",
                          padding: "0.75rem 1rem",
                          borderRadius: "4px",
                        }}
                      >
                        List Item {i} - Full width row
                      </div>
                    ))}
                  </div>
                </div>
              ),
              compact: (
                <div
                  className="variant-box"
                  style={{ background: "#fff3e0", color: "#000" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          background: "#ffcc80",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "2px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Compact {i}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            }}
          </Variants>
        </div>
        <pre className="code-block">
          {`const viewMode = variant({
  key: 'view-mode',
  options: ['grid', 'list', 'compact'],
  default: 'list',
  read: fromCookie('view_mode')
})`}
        </pre>
      </section>

      {/* ========== URL Search Param Demo ========== */}
      <section className="card" style={{ marginTop: "2rem" }}>
        <h2>3. URL Search Param</h2>
        <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
          Feature flags from URL. Try adding <code>?feature=beta</code> or{" "}
          <code>?feature=experimental</code> to the URL.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <a href="?" className="button">
            ?feature=stable
          </a>
          <a href="?feature=beta" className="button">
            ?feature=beta
          </a>
          <a href="?feature=experimental" className="button">
            ?feature=experimental
          </a>
        </div>
        <Variants use={featureFlag}>
          {{
            stable: (
              <div
                className="variant-box"
                style={{
                  background: "#e8f5e9",
                  borderLeft: "4px solid #4caf50",
                  color: "#000",
                }}
              >
                <strong>Stable Release</strong>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                  You're using the stable, production-ready features.
                </p>
              </div>
            ),
            beta: (
              <div
                className="variant-box"
                style={{
                  background: "#fff3e0",
                  borderLeft: "4px solid #ff9800",
                  color: "#000",
                }}
              >
                <strong>Beta Features Enabled</strong>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                  You have access to new features being tested. Some things may
                  change.
                </p>
              </div>
            ),
            experimental: (
              <div
                className="variant-box"
                style={{
                  background: "#ffebee",
                  borderLeft: "4px solid #f44336",
                  color: "#000",
                }}
              >
                <strong>Experimental Mode</strong>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                  Cutting-edge features enabled. Expect bugs and breaking
                  changes!
                </p>
              </div>
            ),
          }}
        </Variants>
        <pre className="code-block">
          {`const featureFlag = variant({
  key: 'feature',
  options: ['stable', 'beta', 'experimental'],
  default: 'stable',
  read: fromSearchParam('feature')
})`}
        </pre>
      </section>

      {/* ========== Media Query Demo ========== */}
      <section className="card" style={{ marginTop: "2rem" }}>
        <h2>4. Media Query - Motion Preference</h2>
        <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
          Reads <code>prefers-reduced-motion</code> from OS settings. No
          JavaScript needed to respect user preferences!
        </p>
        <Variants use={motionPref}>
          {{
            full: (
              <div
                className="variant-box"
                style={{ background: "#e3f2fd", color: "#000" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    className="spinner"
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "4px solid #90caf9",
                      borderTopColor: "#1976d2",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <div>
                    <strong>Full Motion</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                      Animations are enabled
                    </p>
                  </div>
                </div>
              </div>
            ),
            reduced: (
              <div
                className="variant-box"
                style={{ background: "#f3e5f5", color: "#000" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#ce93d8",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <strong>Reduced Motion</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                      Animations are disabled for accessibility
                    </p>
                  </div>
                </div>
              </div>
            ),
          }}
        </Variants>
        <pre className="code-block">
          {`const motionPref = variant({
  key: 'motion',
  options: ['full', 'reduced'],
  default: 'full',
  read: fromMediaQuery('(prefers-reduced-motion: reduce)', {
    true: 'reduced',
    false: 'full'
  })
})`}
        </pre>
      </section>

      {/* ========== Media Query - Color Scheme ========== */}
      <section className="card" style={{ marginTop: "2rem" }}>
        <h2>5. Media Query - System Color Scheme</h2>
        <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
          Detects OS dark/light mode via <code>prefers-color-scheme</code>.
          Updates instantly when you toggle system theme!
        </p>
        <Variants use={colorScheme}>
          {{
            light: (
              <div
                className="variant-box"
                style={{ background: "#fffde7", color: "#000" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span style={{ fontSize: "2rem" }}>☀️</span>
                  <div>
                    <strong>System prefers Light Mode</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                      Your OS is set to light theme
                    </p>
                  </div>
                </div>
              </div>
            ),
            dark: (
              <div
                className="variant-box"
                style={{ background: "#263238", color: "#fff" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span style={{ fontSize: "2rem" }}>🌙</span>
                  <div>
                    <strong>System prefers Dark Mode</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                      Your OS is set to dark theme
                    </p>
                  </div>
                </div>
              </div>
            ),
          }}
        </Variants>
        <pre className="code-block">
          {`const colorScheme = variant({
  key: 'color-scheme',
  options: ['light', 'dark'],
  default: 'light',
  read: fromMediaQuery('(prefers-color-scheme: dark)', {
    true: 'dark',
    false: 'light'
  })
})`}
        </pre>
      </section>

      {/* ========== How It Works ========== */}
      <section
        className="card"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <h2>How It Works</h2>
        <ol style={{ marginLeft: "1.5rem", lineHeight: "2" }}>
          <li>
            <strong>Build:</strong> All variants rendered to HTML (SSG/ISR
            compatible)
          </li>
          <li>
            <strong>Parse:</strong> Inline script reads value, sets attribute on{" "}
            {"<html>"}
          </li>
          <li>
            <strong>Paint:</strong> CSS shows correct variant instantly (no
            flash!)
          </li>
          <li>
            <strong>Hydrate:</strong> React picks up, prunes hidden variants
            from DOM
          </li>
        </ol>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "var(--border)",
            borderRadius: "8px",
          }}
        >
          <strong>Test it:</strong>
          <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li>Change theme and reload - no flash!</li>
            <li>Throttle network to Slow 3G - still no flash</li>
            <li>Disable JavaScript - CSS fallback still works</li>
            <li>View page source - all variants are in HTML</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
