// Player color/skin options — shared between PlatformerGame's in-fight customization
// panel and the out-of-combat menu preview, so the menu doesn't need to import the
// whole canvas component just to know the palette and skin names. `name` is English
// canonical (never stored — only the array index is persisted), pass it through t()
// wherever it's displayed.
export const PLAYER_COLORS = [
  { id: 'blanco', name: 'White', hex: '#ffffff' },
  { id: 'naranja', name: 'Orange', hex: '#ff8a4d' },
  { id: 'azul', name: 'Blue', hex: '#4d9bff' },
  { id: 'verde', name: 'Green', hex: '#4ddc8a' },
  { id: 'rojo', name: 'Red', hex: '#ff5d5d' },
  { id: 'morado', name: 'Purple', hex: '#b070ff' },
  { id: 'plata', name: 'Silver', hex: '#c7d0dc' },
  { id: 'amarillo', name: 'Yellow', hex: '#ffd23f' },
]

export const PLAYER_SKINS = [
  { id: 'fantasma', name: 'Ghost' },
  { id: 'calabaza', name: 'Halloween Pumpkin' },
]
