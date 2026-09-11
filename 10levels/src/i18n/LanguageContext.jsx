import { createContext, useContext, useMemo } from 'react'
import { translate } from './translations'
import { useLocalStorage } from '../utils/useLocalStorage'

const LanguageContext = createContext(null)

// English is the source language — t('Some sentence.') both keys the Spanish
// dictionary lookup and is the text shown when no translation is needed.
export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage('10levels:lang', 'en')

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook belongs with its context/provider
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
