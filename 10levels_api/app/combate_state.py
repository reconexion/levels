"""In-memory, per-session combat state.

There are no player accounts (see project notes), so a boss fight's live HP is
tracked server-side per (sesion_id, jefe_id) pair rather than persisted to the
`jefes` table — `jefes.hp_max` stays the boss's fixed max HP. This is fine for
a single-process MVP; a multi-worker deployment would need to move this into
Redis instead of a module-level dict.
"""

import time

ACTIVE_SESSION_WINDOW_SECONDS = 5 * 60

_combat_hp: dict[tuple[str, int], float] = {}
_session_last_seen: dict[str, float] = {}


def get_hp(sesion_id: str, jefe_id: int, hp_max: int) -> float:
    _session_last_seen[sesion_id] = time.monotonic()
    return _combat_hp.setdefault((sesion_id, jefe_id), float(hp_max))


def apply_damage(sesion_id: str, jefe_id: int, hp_max: int, danio: float) -> float:
    hp_actual = get_hp(sesion_id, jefe_id, hp_max)
    hp_actual = max(0.0, hp_actual - danio)
    _combat_hp[(sesion_id, jefe_id)] = hp_actual
    return hp_actual


def reset(sesion_id: str, jefe_id: int, hp_max: int) -> None:
    _combat_hp[(sesion_id, jefe_id)] = float(hp_max)


def count_active_sessions() -> int:
    cutoff = time.monotonic() - ACTIVE_SESSION_WINDOW_SECONDS
    stale = [sid for sid, seen in _session_last_seen.items() if seen < cutoff]
    for sid in stale:
        _session_last_seen.pop(sid, None)
    return len(_session_last_seen)
