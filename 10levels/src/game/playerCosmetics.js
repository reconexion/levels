// Player color/skin options — shared between PlatformerGame's in-fight customization
// panel and the out-of-combat menu preview, so the menu doesn't need to import the
// whole canvas component just to know the palette and skin names.
export const PLAYER_COLORS = [
  { id: 'blanco', name: 'Blanco', hex: '#ffffff' },
  { id: 'naranja', name: 'Naranja', hex: '#ff8a4d' },
  { id: 'azul', name: 'Azul', hex: '#4d9bff' },
  { id: 'verde', name: 'Verde', hex: '#4ddc8a' },
  { id: 'rojo', name: 'Rojo', hex: '#ff5d5d' },
  { id: 'morado', name: 'Morado', hex: '#b070ff' },
  { id: 'plata', name: 'Plata', hex: '#c7d0dc' },
  { id: 'amarillo', name: 'Amarillo', hex: '#ffd23f' },
]

export const PLAYER_SKINS = [
  { id: 'fantasma', name: 'Fantasma' },
  { id: 'calabaza', name: 'Calabaza de Halloween' },
]
