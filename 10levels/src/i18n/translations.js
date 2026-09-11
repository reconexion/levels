// Lightweight i18n: English strings are the keys (and the English text itself),
// Spanish provides the translation. No external library — the app only supports
// these two languages and most strings are short/static.
export const translations = {
  es: {
    // Header / menu
    'Choose a sponsored boss and challenge them to see who is stronger.':
      'Elige un jefe patrocinado y reta a ver quién es más fuerte.',
    'is the #1 boss': 'es el jefe #1',
    'No one is the #1 boss yet': 'Nadie es el jefe #1 todavía',
    'Paid {amount}. The brand that pays the most is the #1 boss.':
      'Pagó {amount}. La marca que más paga es el jefe #1.',
    'The brand that pays the most will be the #1 boss.': 'La marca que pague más será el jefe #1.',
    'Claim your Rank': 'Reclama tu Rango',
    'Be the first #1 boss': 'Sé el primer jefe #1',
    'Your character': 'Tu personaje',
    Points: 'Puntos',
    Weapon: 'Arma',
    'Max health': 'Vida máxima',
    'Bosses defeated (session)': 'Jefes vencidos (sesión)',
    'Upgrade damage & health ({cost} pts) → {hp} HP': 'Mejorar daño y vida ({cost} pts) → {hp} HP',
    'Upgrade weapon ({cost} pts) → {hp} HP': 'Mejorar arma ({cost} pts) → {hp} HP',
    'Sponsored bosses': 'Jefes patrocinados',
    '{shown} of {total}': '{shown} de {total}',
    'Search a brand…': 'Buscar una marca…',
    'All categories': 'Todas las categorías',
    'No boss is active yet.': 'Todavía no hay jefes activos.',
    'No brand matches your search.': 'Ninguna marca coincide con tu búsqueda.',
    Retry: 'Reintentar',
    'Could not connect to the API. Is the backend running?':
      'No se pudo conectar con la API. ¿Está corriendo el backend?',

    // Boss card
    Challenge: 'Retar',
    '{amount} paid': '{amount} pagados',
    'Visit {name}’s page': 'Visitar la página de {name}',
    '+{points} pts': '+{points} pts',
    'Points earned for defeating this boss': 'Puntos que ganas al vencer a este jefe',

    // Boss tiers (derived from monto_pagado, never stored — see game/bossTier.js)
    Noob: 'Noob',
    Beginner: 'Principiante',
    Amateur: 'Amateur',
    Competent: 'Competente',
    Advanced: 'Avanzado',
    Expert: 'Experto',
    Elite: 'Élite',
    Master: 'Maestro',
    Legend: 'Leyenda',
    PRO: 'PRO',

    // Pagination
    Pagination: 'Paginación',
    'Previous page': 'Página anterior',
    'Next page': 'Página siguiente',
    'Rank {rank}': 'Puesto {rank}',

    // Sponsor form
    Back: 'Volver',
    'Sponsor your own boss': 'Patrocina tu propio jefe',
    'Pay whatever you want to join the boss list. {name} paid {amount} and is today’s #1 boss — the one who pays the most always takes that spot.':
      'Paga lo que quieras para unirte a la lista de jefes. {name} pagó {amount} y hoy es el jefe #1 — el que más paga siempre toma ese puesto.',
    'No one has sponsored a boss yet: the first to pay will be #1.':
      'Todavía nadie ha patrocinado un jefe: el primero en pagar será el #1.',
    'Payment cancelled. You can try again whenever you want.': 'Pago cancelado. Puedes intentarlo de nuevo cuando quieras.',
    'Payments aren’t active in this environment yet (Stripe isn’t configured on the backend). You can fill out the form, but the charge won’t process until the keys are added.':
      'Los pagos todavía no están activos en este entorno (falta configurar Stripe en el backend). Puedes rellenar el formulario, pero el cobro no se procesará hasta que se agreguen las claves.',
    'Your brand name': 'Nombre de tu marca',
    'Your logo URL': 'URL de tu logo',
    'Ideally square (128×128 or bigger).': 'Idealmente cuadrado (128×128 o más).',
    'Brand color': 'Color de marca',
    'Color picker': 'Selector de color',
    "Your boss's skin": 'Skin de tu jefe',
    'Each option shows with your own brand color.': 'Cada opción se ve con tu propio color de marca.',
    Category: 'Categoría',
    'Select a category': 'Selecciona una categoría',
    'Helps people find you in the boss search.': 'Ayuda a que te encuentren en el buscador de jefes.',
    "Your boss's message (optional)": 'Mensaje de tu jefe (opcional)',
    'Shown on its menu card and when the fight starts.': 'Se muestra en su tarjeta del menú y al iniciar la pelea contra él.',
    'Dare to challenge me?': '¿Te atreves a retarme?',
    'Your page link': 'Link de tu página',
    'Clicking your boss’s name takes people here.': 'Al hacer clic en el nombre de tu jefe, la gente llega aquí.',
    'Amount to pay': 'Monto a pagar',
    '🏆 With this amount you’ll be the #1 boss!': '🏆 ¡Con este monto serás el jefe #1!',
    'Your boss joins the list. Pay more than {amount} to be #1.': 'Tu jefe se une a la lista. Paga más de {amount} para ser el #1.',
    'Pay and be the #1 boss': 'Pagar y ser el jefe #1',
    'Pay and sponsor my boss': 'Pagar y patrocinar mi jefe',
    'Fill in your brand name and logo URL.': 'Rellena el nombre de tu marca y la URL de tu logo.',
    'Choose a category for your brand.': 'Elige una categoría para tu marca.',
    'Enter your page link.': 'Ingresa el link de tu página.',
    'Enter a valid amount.': 'Ingresa un monto válido.',
    'Could not start the payment.': 'No se pudo iniciar el pago.',
    'You’re already the #1 boss!': '¡Ya eres el jefe #1!',
    'Your boss is already active!': '¡Tu jefe ya está activo!',
    '{name} is now active with {amount} paid. It’s already on the boss list{top1}.':
      '{name} quedó activo con {amount} pagados. Ya aparece en la lista de jefes{top1}.',
    ', in the #1 spot': ', en el puesto #1',
    'Confirming your payment…': 'Confirmando tu pago…',
    'Stripe already received the payment; your boss activates itself once the confirmation (webhook) arrives.':
      'Stripe ya recibió el pago; en cuanto llegue la confirmación (webhook) tu jefe se activa solo.',
    'This is taking longer than usual. If you’re developing locally, check that {command} is running.':
      'Esto está tardando más de lo normal. Si estás en desarrollo local, revisa que {command} esté corriendo.',
    'Back to menu': 'Volver al menú',

    // Player preview / game chrome
    Ghost: 'Fantasma',
    'Halloween Pumpkin': 'Calabaza de Halloween',
    White: 'Blanco',
    Orange: 'Naranja',
    Blue: 'Azul',
    Green: 'Verde',
    Red: 'Rojo',
    Purple: 'Morado',
    Silver: 'Plata',
    Yellow: 'Amarillo',
    OMAKA: 'OMAKA',
    Round: 'Redondo',
    Happy: 'Feliz',
    Determined: 'Decidido',
    Wink: 'Guiño',
    'O x': 'O x',
    Cross: 'Cruz',
    Circle: 'Círculo',
    Diamond: 'Diamante',
    Dot: 'Punto',
    'Character color': 'Color del personaje',
    'Crosshair color': 'Color de la mira',
    'Challenging {name}': 'Retando a {name}',
    'Restart fight': 'Reiniciar pelea',
    'Weapon: {name}': 'Arma: {name}',
    'Damage {dmg} · Fire rate {rate}s': 'Daño {dmg} · Cadencia {rate}s',
    Background: 'Fondo',
    'Background color: {hint}': 'Color del fondo: {hint}',
    Sky: 'Cielo',
    'Neon lights': 'Luces de neón',
    Reflections: 'Reflejos',
    'Sky / sea': 'Cielo / mar',
    Sun: 'Sol',
    Moon: 'Luna',
    'Futuristic City (Night)': 'Ciudad futurista (Noche)',
    'Futuristic City (Day)': 'Ciudad futurista (Día)',
    'Beach (Day)': 'Playa (Día)',
    'Beach (Night)': 'Playa (Noche)',
    Skin: 'Skin',
    'Weapon skin': 'Skin de arma',
    Face: 'Cara',
    Color: 'Color',
    Crosshair: 'Mira',
    Arrows: 'Flechas',
    'to move': 'para moverte',
    Space: 'Espacio',
    'to jump': 'para saltar',
    'Click to shoot at the boss': 'Click para disparar al jefe',
    Character: 'Personaje',
    'You defeated {name}!': '¡Venciste a {name}!',
    'You were defeated…': 'Fuiste derrotado…',
    YOU: 'TÚ',
    DEFEAT: 'DERROTA',
    VICTORY: 'VICTORIA',
    'VICTORY!': '¡VICTORIA!',
    'Killed by: {label}': 'Eliminado por: {label}',
    '{name} is back': '{name} ha vuelto',
    'The arena shakes once again': 'La arena tiembla de nuevo',

    // Kill labels / death tips (drawn on the game canvas)
    'Boss charge': 'Embestida del jefe',
    'Projectile barrage': 'Ráfaga de proyectiles',
    'Ground slam': 'Golpe de tierra',
    'Floor spikes': 'Picos del suelo',
    'Laser beam': 'Rayo láser',
    'Contact with the boss': 'Contacto con el jefe',
    'Tip: when the boss starts glowing, get ready to jump aside.':
      'Consejo: cuando el jefe empieza a brillar, prepárate para saltar a un lado.',
    'Tip: the charge only hits once — move away as soon as you dodge it.':
      'Consejo: la embestida solo golpea una vez — aléjate en cuanto la esquives.',
    'Tip: move in a zigzag, projectiles don’t turn to follow you.':
      'Consejo: muévete en zigzag, los proyectiles no giran para seguirte.',
    'Tip: stand behind a platform to block the barrage.': 'Consejo: ponte detrás de una plataforma para bloquear la ráfaga.',
    'Tip: jump right when the boss dives toward the ground.': 'Consejo: salta justo cuando el jefe caiga en picado hacia el suelo.',
    'Tip: the ground slam only hurts if you’re standing on the floor — stay in the air.':
      'Consejo: el golpe de tierra solo daña si estás pisando el suelo — quédate en el aire.',
    'Tip: spikes appear where YOU were standing — keep moving during the red warning.':
      'Consejo: los picos aparecen donde TÚ estabas — no dejes de moverte durante el aviso rojo.',
    'Tip: run in one direction and don’t stop until the spike barrage ends.':
      'Consejo: corre en una dirección y no pares hasta que termine la ráfaga de picos.',
    'Tip: get on a raised platform to dodge the low laser.': 'Consejo: sube a una plataforma elevada para esquivar el láser rasante.',
    'Tip: jump right before the blinking laser warning ends.':
      'Consejo: salta justo antes de que termine el aviso parpadeante del láser.',
    'Tip: keep your distance, touching the boss also deals damage.':
      'Consejo: mantén las distancias, tocar al jefe también hace daño.',
    'Tip: shoot while backing away instead of approaching.': 'Consejo: dispara mientras retrocedes en vez de acercarte.',
    'Tip: your weapon doesn’t overheat, shoot without fear.': 'Consejo: tu arma no se sobrecalienta, dispara sin miedo.',
    'Tip: you’re invulnerable for an instant after each hit — use it to escape.':
      'Consejo: eres invulnerable un instante después de cada golpe — aprovéchalo para escapar.',
    'Tip: if the current difficulty is too high, lower it from the menu below.':
      'Consejo: si la dificultad actual es muy alta, bájala desde el menú de abajo.',
    'Tip: raised platforms are your best shelter from ground-level attacks.':
      'Consejo: las plataformas elevadas son tu mejor refugio contra ataques a ras de suelo.',

    // Categories (canonical values stay Spanish in the DB — this only translates display)
    'Food & Drink': 'Comida y Bebida',
    Technology: 'Tecnología',
    Gaming: 'Videojuegos',
    'Fashion & Apparel': 'Ropa y Moda',
    Entertainment: 'Entretenimiento',
    Sports: 'Deportes',
    Services: 'Servicios',
    Other: 'Otro',
  },
}

export function translate(lang, key, vars) {
  const dict = translations[lang]
  let text = (dict && dict[key]) ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, v)
    }
  }
  return text
}
