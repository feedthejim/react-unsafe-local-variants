'use client'

export default function ThemeControls() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {['light', 'dark', 'system'].map((value) => (
        <button
          key={value}
          onClick={() => {
            localStorage.setItem('theme', value)
            location.reload()
          }}
          style={{
            padding: '0.5rem 1rem',
            border: '2px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--bg)',
            color: 'var(--fg)',
            cursor: 'pointer',
          }}
        >
          {value}
        </button>
      ))}
    </div>
  )
}
