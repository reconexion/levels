import { useEffect, useState } from 'react'
import { fetchJefes, fetchStats } from './api'
import BossMenu from './components/BossMenu'
import Patrocinar from './components/Patrocinar'
import RainBackground from './components/RainBackground'
import PlatformerGame from './game/PlatformerGame'
import { MAX_WEAPON_LEVEL, POINTS_PER_VICTORY, isWeaponMaxed, upgradeCostFor } from './game/progression'
import { useLocalStorage } from './utils/useLocalStorage'

const RETURN_TO_MENU_DELAY_MS = 2600

function App() {
  const [sesionId] = useState(() => crypto.randomUUID())
  // 'menu' | 'fight' | 'patrocinar' — arranca directo en 'patrocinar' si Stripe Checkout
  // acaba de redirigir de vuelta con ?patrocinio=exito|cancelado.
  const [screen, setScreen] = useState(() =>
    new URLSearchParams(window.location.search).get('patrocinio') ? 'patrocinar' : 'menu',
  )
  const [selectedJefe, setSelectedJefe] = useState(null)

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

  function loadJefes() {
    setJefesLoading(true)
    setJefesError(null)
    fetchJefes()
      .then(setJefes)
      .catch(() => setJefesError('No se pudo conectar con la API. ¿Está corriendo el backend?'))
      .finally(() => setJefesLoading(false))
  }

  // Mount-only fetch: reads straight into setState from the promise callbacks so no setState
  // runs synchronously inside the effect body (loadJefes is for the retry button instead).
  useEffect(() => {
    fetchJefes()
      .then(setJefes)
      .catch(() => setJefesError('No se pudo conectar con la API. ¿Está corriendo el backend?'))
      .finally(() => setJefesLoading(false))
    fetchStats().then(setStats).catch(() => {})
  }, [])

  const handleSelectJefe = (jefe) => {
    setSelectedJefe(jefe)
    setScreen('fight')
  }

  const handleExitFight = () => {
    setScreen('menu')
  }

  const handleVictory = () => {
    setPoints((p) => p + POINTS_PER_VICTORY)
    setJefesVencidosTotal((n) => n + 1)
    setTimeout(() => setScreen('menu'), RETURN_TO_MENU_DELAY_MS)
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

  let screenContent
  if (screen === 'fight' && selectedJefe) {
    screenContent = (
      <PlatformerGame
        key={`${selectedJefe.id}-${sesionId}`}
        jefe={selectedJefe}
        weaponLevel={weaponLevel}
        bonusLevel={bonusLevel}
        weaponSkinIndex={weaponSkinIndex}
        onWeaponSkinChange={setWeaponSkinIndex}
        sesionId={sesionId}
        onVictory={handleVictory}
        onExit={handleExitFight}
      />
    )
  } else if (screen === 'patrocinar') {
    screenContent = (
      <Patrocinar
        stats={stats}
        onBack={() => {
          setScreen('menu')
          loadJefes()
          fetchStats().then(setStats).catch(() => {})
        }}
      />
    )
  } else {
    screenContent = (
      <BossMenu
        jefes={jefes}
        loading={jefesLoading}
        error={jefesError}
        onRetry={loadJefes}
        onSelectJefe={handleSelectJefe}
        onPatrocinar={() => setScreen('patrocinar')}
        points={points}
        weaponLevel={weaponLevel}
        bonusLevel={bonusLevel}
        weaponSkinIndex={weaponSkinIndex}
        onUpgradeWeapon={handleUpgradeWeapon}
        jefesVencidosTotal={jefesVencidosTotal}
        stats={stats}
      />
    )
  }

  return (
    <>
      <RainBackground />
      {screenContent}
    </>
  )
}

export default App
