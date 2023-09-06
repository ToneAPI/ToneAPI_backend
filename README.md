# Stat_Tracker_Server

This is the backend for Tone API.

To install the Northstar mod, go [here](https://github.com/Legonzaur/ToneAPI_servermod).

To install, you must have a [postgresql](https://www.postgresql.org/) server. Rename the `.env.example` to `.env` and edit the values.

The serverside and clientside parts are two different executables. You may need a reverse proxy like [nginx](https://www.nginx.com/) or use two different ports.

# Documentation

An OpenAPI file is located in `docs` directory.

Alternatively, you can find it converted at https://toneapi.github.io/ToneAPI_backend/


# V3 Roadmap
### Server mod
- [x] Match registration
- [x] Player stats
- [x] Match stats
- [x] Weapon shots, hits, crits, ricochets
- [ ] Grenade shots

### Backend
- [x] Match registration
- [x] Kill stats
- [ ] Match stats

### Frontend
- [ ] Everything