# Stat_Tracker_Server

This is the backend for Tone API.

To install the Northstar mod, go [here](https://github.com/Legonzaur/ToneAPI_servermod)

To install, you must have a [postgresql](https://www.postgresql.org/) and [redis](https://redis.io/) server. Rename the `.env.example` to `.env` and edit the values.

The serverside and clientside part are two different executables. You may need a reverse proxy like [nginx](https://www.nginx.com/) or use two different ports.

# Documentation

An OpenAPI file is located in `resources/OpenAPI.yml`

Alternatively, you can find it converted to markdown at [https://legonzaur.github.io/ToneAPI_backend/openapi](https://legonzaur.github.io/ToneAPI_backend/openapi)
