import { Lock01 } from '@untitledui/icons'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchJefes, fetchStats } from './api'
import BossMenu from './components/BossMenu'
import Patrocinar from './components/Patrocinar'
import RainBackground from './components/RainBackground'
import LanguageToggle from './components/LanguageToggle'
import { Button } from './components/base/buttons/button'
import { formatLockRemaining, useLockRemaining } from './game/bossLock'
import PlatformerGame from './game/PlatformerGame'
import { MAX_WEAPON_LEVEL, isWeaponMaxed, pointsForRank, upgradeCostFor } from './game/progression'
import { useLanguage } from './i18n/LanguageContext'
import { useLocalStorage } from './utils/useLocalStorage'

const RETURN_TO_MENU_DELAY_MS = 2600

// The fight screen hides the language toggle (it has its own chrome) — everything
// else keeps it pinned top-right.
function LanguageToggleGate() {
  const location = useLocation()
  if (location.pathname.startsWith('/fight/')) return null
  return <LanguageToggle className="fixed top-4 right-4 z-50" />
}

function MenuRoute({ jefes, loading, error, onRetry, ...playerProps }) {
  const navigate = useNavigate()
  return (
    <BossMenu
      jefes={jefes}
      loading={loading}
      error={error}
      onRetry={onRetry}
      onSelectJefe={(jefe) => navigate(`/fight/${jefe.id}`)}
      onPatrocinar={() => navigate('/patrocinar')}
      {...playerProps}
    />
  )
}

// Shown for a stale/bad boss link or any unknown URL — a plain link back rather than
// an automatic redirect, since redirecting from an effect right around initial mount
// raced with the app's own data fetch and left the menu route stuck unrendered.
function NotFoundScreen({ message }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center text-primary">
      <p className="text-tertiary">{message}</p>
      <Button color="primary" onClick={() => navigate('/')}>
        {t('Back to menu')}
      </Button>
    </div>
  )
}

// Shown instead of the fight when the boss was defeated too recently — matches
// BossCard's lock treatment so a direct/refreshed link to a cooling-down boss
// can't be used to skip its wait.
function LockedBossScreen({ jefe, remaining, onBack }) {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center text-primary">
      <Lock01 className="size-10 text-tertiary" />
      <p className="text-tertiary">
        {t('{name} was just defeated. Try again in {time}.', {
          name: jefe.nombre_marca,
          time: formatLockRemaining(remaining),
        })}
      </p>
      <Button color="primary" onClick={onBack}>
        {t('Back to menu')}
      </Button>
    </div>
  )
}

function FightRoute({
  jefes,
  jefesLoading,
  sesionId,
  weaponLevel,
  bonusLevel,
  weaponSkinIndex,
  onWeaponSkinChange,
  onVictoryPoints,
  jefesDerrotadosAt,
}) {
  const { t } = useLanguage()
  const { jefeId } = useParams()
  const navigate = useNavigate()
  const jefe = jefes.find((j) => String(j.id) === jefeId)
  // Called unconditionally (before the early returns below) so hook order stays
  // stable across renders regardless of whether `jefe` was found yet.
  const lockRemaining = useLockRemaining(jefe ? jefesDerrotadosAt[jefe.id] : null)

  // Jefes can still be loading on a direct link/refresh (no menu visit first) —
  // wait rather than declaring it missing before the list has even arrived.
  if (jefesLoading) return null
  if (!jefe) return <NotFoundScreen message={t('This boss doesn’t exist or is no longer active.')} />
  if (lockRemaining > 0) return <LockedBossScreen jefe={jefe} remaining={lockRemaining} onBack={() => navigate('/')} />

  return (
    <PlatformerGame
      key={`${jefe.id}-${sesionId}`}
      jefe={jefe}
      weaponLevel={weaponLevel}
      bonusLevel={bonusLevel}
      weaponSkinIndex={weaponSkinIndex}
      onWeaponSkinChange={onWeaponSkinChange}
      sesionId={sesionId}
      onVictory={(defeatedJefe) => {
        onVictoryPoints(defeatedJefe)
        setTimeout(() => navigate('/'), RETURN_TO_MENU_DELAY_MS)
      }}
      onExit={() => navigate('/')}
    />
  )
}

function PatrocinarRoute({ stats, onBack }) {
  const navigate = useNavigate()
  return (
    <Patrocinar
      stats={stats}
      onBack={() => {
        navigate('/')
        onBack()
      }}
    />
  )
}

function App() {
  const [sesionId] = useState(() => crypto.randomUUID())

  const [jefes, setJefes] = useState([])
  const [jefesLoading, setJefesLoading] = useState(true)
  const [jefesError, setJefesError] = useState(null)
  const [stats, setStats] = useState(null)

  // Persisted to localStorage so progress survives a reload or the tab closing.
  const [points, setPoints] = useLocalStorage('10levels:points', 0)
  const [weaponLevel, setWeaponLevel] = useLocalStorage('10levels:weaponLevel', 0)
  // Extra damage/HP boosts bought after the weapon is maxed — uncapped, only limited
  // by how many points you have.
  const [bonusLevel, setBonusLevel] = useLocalStorage('10levels:bonusLevel', 0)
  // Purely cosmetic gun skin, pickable once the weapon is maxed — never changes damage/fireRate.
  const [weaponSkinIndex, setWeaponSkinIndex] = useLocalStorage('10levels:weaponSkinIndex', 0)
  const [jefesVencidosTotal, setJefesVencidosTotal] = useLocalStorage('10levels:jefesVencidosTotal', 0)
  // Timestamp (ms) of each boss's most recent defeat, keyed by jefe id — drives the
  // post-victory lock so the same boss can't be re-challenged immediately.
  const [jefesDerrotadosAt, setJefesDerrotadosAt] = useLocalStorage('10levels:jefesDerrotadosAt', {})

  function loadJefes() {
    setJefesLoading(true)
    setJefesError(null)
    fetchJefes()
      .then(setJefes)
      .catch(() => setJefesError('Could not connect to the API. Is the backend running?'))
      .finally(() => setJefesLoading(false))
  }

  // Mount-only fetch: reads straight into setState from the promise callbacks so no setState
  // runs synchronously inside the effect body (loadJefes is for the retry button instead).
  useEffect(() => {
    fetchJefes()
      .then(setJefes)
      .catch(() => setJefesError('Could not connect to the API. Is the backend running?'))
      .finally(() => setJefesLoading(false))
    fetchStats().then(setStats).catch(() => {})
  }, [])

  const handleVictoryPoints = (jefe) => {
    // Rank across the full leaderboard (jefes arrives sorted by monto_pagado desc from
    // the API) — not wherever the boss happened to sit in a filtered/paginated view.
    const rank = jefes.findIndex((j) => j.id === jefe.id) + 1
    setPoints((p) => p + pointsForRank(rank))
    setJefesVencidosTotal((n) => n + 1)
    setJefesDerrotadosAt((prev) => ({ ...prev, [jefe.id]: Date.now() }))
  }

  const handleUpgradeWeapon = () => {
    const cost = upgradeCostFor(weaponLevel, bonusLevel)
    if (points < cost) return
    setPoints((p) => p - cost)
    if (isWeaponMaxed(weaponLevel)) {
      setBonusLevel((b) => b + 1)
    } else {
      setWeaponLevel((l) => Math.min(MAX_WEAPON_LEVEL, l + 1))
    }
  }

  const reloadAfterSponsor = () => {
    loadJefes()
    fetchStats().then(setStats).catch(() => {})
  }

  return (
    <>
      <RainBackground />
      <LanguageToggleGate />
      <Routes>
        <Route
          path="/"
          element={
            <MenuRoute
              jefes={jefes}
              loading={jefesLoading}
              error={jefesError}
              onRetry={loadJefes}
              points={points}
              weaponLevel={weaponLevel}
              bonusLevel={bonusLevel}
              weaponSkinIndex={weaponSkinIndex}
              onUpgradeWeapon={handleUpgradeWeapon}
              jefesVencidosTotal={jefesVencidosTotal}
              jefesDerrotadosAt={jefesDerrotadosAt}
              stats={stats}
            />
          }
        />
        <Route
          path="/fight/:jefeId"
          element={
            <FightRoute
              jefes={jefes}
              jefesLoading={jefesLoading}
              sesionId={sesionId}
              weaponLevel={weaponLevel}
              bonusLevel={bonusLevel}
              weaponSkinIndex={weaponSkinIndex}
              onWeaponSkinChange={setWeaponSkinIndex}
              onVictoryPoints={handleVictoryPoints}
              jefesDerrotadosAt={jefesDerrotadosAt}
            />
          }
        />
        <Route path="/patrocinar" element={<PatrocinarRoute stats={stats} onBack={reloadAfterSponsor} />} />
        <Route path="*" element={<NotFoundScreenRoute />} />
      </Routes>
    </>
  )
}

function NotFoundScreenRoute() {
  const { t } = useLanguage()
  return <NotFoundScreen message={t('Page not found.')} />
}

export default App
