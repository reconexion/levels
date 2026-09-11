import { useLanguage } from '../i18n/LanguageContext'

// Fixed top-right on every screen (see App.jsx) — a two-way pill switch rather than
// a dropdown, since there are only ever two languages to pick from.
export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className={`glass-card inline-flex items-center gap-0.5 rounded-full border border-secondary p-0.5 shadow-lg shadow-black/30 ${className}`}
      role="group"
      aria-label="Language"
    >
      {['en', 'es'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={
            'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-150' +
            (lang === code ? ' bg-brand-solid text-white' : ' text-tertiary hover:text-primary')
          }
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
