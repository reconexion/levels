import { Activity, Briefcase01, Clapperboard, CpuChip01, Droplets02, GamingPad01, Grid01, ShoppingBag01 } from '@untitledui/icons'

// Fixed category taxonomy — mirrors the backend's app/categorias.py so the value
// a sponsor picks always matches what the search/filter UI expects.
export const CATEGORIAS = [
  'Comida y Bebida',
  'Tecnología',
  'Videojuegos',
  'Ropa y Moda',
  'Entretenimiento',
  'Deportes',
  'Servicios',
  'Otro',
]

// Each category gets its own icon + accent tint — used on the boss card so the
// design visibly shifts per category, not just the text label.
export const CATEGORIA_ESTILO = {
  'Comida y Bebida': { icon: Droplets02, tint: '#ff8a4d' },
  Tecnología: { icon: CpuChip01, tint: '#5ec8ff' },
  Videojuegos: { icon: GamingPad01, tint: '#b070ff' },
  'Ropa y Moda': { icon: ShoppingBag01, tint: '#ff5ec8' },
  Entretenimiento: { icon: Clapperboard, tint: '#ffd23f' },
  Deportes: { icon: Activity, tint: '#39ff9e' },
  Servicios: { icon: Briefcase01, tint: '#c7d0dc' },
  Otro: { icon: Grid01, tint: '#9a9a9a' },
}

export function categoriaEstiloFor(categoria) {
  return CATEGORIA_ESTILO[categoria] ?? CATEGORIA_ESTILO['Otro']
}

// The boss's visual skin (game/bossSkins.js BOSS_STYLES id) is picked FOR the sponsor by
// their category, not by the sponsor directly — each category gets a skin that matches
// its vibe (wood for food, neon for tech, holo for fashion, ...). Keeps every category
// visually distinct without asking sponsors to understand 10 unrelated art styles.
export const CATEGORIA_SKIN_ID = {
  'Comida y Bebida': 'competente',
  Tecnología: 'avanzado',
  Videojuegos: 'pro',
  'Ropa y Moda': 'leyenda',
  Entretenimiento: 'maestro',
  Deportes: 'experto',
  Servicios: 'principiante',
  Otro: 'noob',
}

export function skinIdForCategoria(categoria) {
  return CATEGORIA_SKIN_ID[categoria] ?? CATEGORIA_SKIN_ID['Otro']
}

// The stored value (sent to/from the API) stays this fixed Spanish string regardless
// of UI language — only the label shown to the user is translated. Pass the result
// through t() to display it.
export const CATEGORIA_LABEL_KEY = {
  'Comida y Bebida': 'Food & Drink',
  Tecnología: 'Technology',
  Videojuegos: 'Gaming',
  'Ropa y Moda': 'Fashion & Apparel',
  Entretenimiento: 'Entertainment',
  Deportes: 'Sports',
  Servicios: 'Services',
  Otro: 'Other',
}
