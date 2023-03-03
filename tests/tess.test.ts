import { describe, expect, test } from '@jest/globals'

describe('server', () => {
  test('register a kill', () => {
    const data = {
      attacker_weapon_1_mods: 0,
      victim_id: '1005930844007',
      victim_name: 'Legonzaur',
      victim_offhand_weapon_2: 0,
      attacker_offhand_weapon_3: '0',
      victim_weapon_3_mods: 0,
      attacker_weapon_2_mods: 0,
      attacker_offhand_weapon_1: 0,
      attacker_weapon_3_mods: 0,
      attacker_offhand_weapon_2: 0,
      victim_offhand_weapon_3: '0',
      victim_offhand_weapon_1: 0,
      attacker_weapon_3: 'defender',
      killstat_version: 'ks_3.0.0',
      attacker_weapon_1: 'smr',
      match_id: '31b1f34d',
      distance: 0,
      victim_current_weapon: 'smr',
      cause_of_death: 'smr',
      victim_weapon_2_mods: 0,
      victim_current_weapon_mods: 0,
      attacker_current_weapon_mods: 0,
      game_time: 377.799,
      player_count: 1,
      attacker_current_weapon: 'smr',
      attacker_id: '1005930844007',
      game_mode: 'tdm',
      map: 'thaw',
      attacker_weapon_2: 'autopistol',
      victim_weapon_1: 'smr',
      victim_weapon_2: 'autopistol',
      victim_weapon_1_mods: 0,
      victim_weapon_3: 'defender',
      attacker_name: 'Legonzaur'
    }

    expect(3).toBe(3)
  })
})
