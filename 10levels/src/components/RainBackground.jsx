import '../styles/rain-bg.css'

// Fixed, full-viewport animated backdrop behind every screen (see App.jsx). Purely
// decorative — aria-hidden and pointer-events:none (in rain-bg.css) so it never
// interferes with the actual UI.
export default function RainBackground() {
  return <div className="rain-bg" aria-hidden="true" />
}
