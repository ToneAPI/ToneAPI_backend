---
title: ToneAPI v1.0
language_tabs:
  - javascript: JavaScript
language_clients:
  - javascript: request.
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="toneapi">ToneAPI v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Stats tracking API for Titanfall 2 Northstar 

Base URLs:

* <a href="https://tone.sleepycat.date/v1">https://tone.sleepycat.date/v1</a>

Web: <a href="https://github.com/Legonzaur">Legonzaur</a> 
License: <a href="https://unlicense.org/">The Unlicense</a>

# Authentication

- HTTP Authentication, scheme: basic 

<h1 id="toneapi-default">Default</h1>

## get-server-list

<a id="opIdget-server-list"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/servers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /client/servers`

*List of servers*

An array containing the list of servers as objects

> Example responses

> OK

```json
[
  {
    "id": 1,
    "name": "fvnknoots 7v7"
  }
]
```

<h3 id="get-server-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-server-list-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» Server|object|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-client-weapons

<a id="opIdget-client-weapons"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/weapons',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /client/weapons`

*Statistics for all weapons*

A JSON Object with weapon IDs as key and weapon data as value

> Body parameter

<h3 id="get-client-weapons-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|server|query|number|false|Fetch data for specific server|
|player|query|number|false|Fetch data for specific player|

> Example responses

> OK

```json
{
  "hemlock": {
    "max_kill_distance": 0,
    "avg_kill_distance": 0,
    "kills": 0
  },
  "lstar": {
    "max_kill_distance": 0,
    "avg_kill_distance": 0,
    "kills": 0
  }
}
```

<h3 id="get-client-weapons-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-client-weapons-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» hemlock|object|false|none|none|
|»» max_kill_distance|integer|false|none|none|
|»» avg_kill_distance|number|false|none|none|
|»» kills|integer|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-client-weapons-weaponId

<a id="opIdget-client-weapons-weaponId"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/weapons/{weaponId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /client/weapons/{weaponId}`

*Statistics for a single weapon*

Data for a specific weapon

> Body parameter

<h3 id="get-client-weapons-weaponid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|server|query|number|false|Fetch data for specific server|
|player|query|number|false|Fetch data for specific player|
|weaponId|path|string|true|ID of a weapon|

> Example responses

> 200 Response

```json
{
  "max_kill_distance": 0,
  "avg_kill_distance": 0,
  "kills": 0
}
```

<h3 id="get-client-weapons-weaponid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-client-weapons-weaponid-responseschema">Response Schema</h3>

Status Code **200**

*Weapon*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» max_kill_distance|integer|false|none|none|
|» avg_kill_distance|number|false|none|none|
|» kills|integer|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-client-players

<a id="opIdget-client-players"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/players',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /client/players`

*Statistics for all players*

A JSON Object with player IDs as key and player data as value

<h3 id="get-client-players-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|weapon|query|string|false|Fetch data for specific weapon|
|server|query|number|false|Fetch data for specific server|

> Example responses

> OK

```json
{
  "2250125460": {
    "name": "Legonzaur",
    "deaths": 0,
    "kills": 0,
    "max_kill_distance": 0,
    "avg_kill_distance": 0
  }
}
```

<h3 id="get-client-players-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-client-players-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» 2250125460|object|false|none|none|
|»» name|string|false|none|none|
|»» deaths|integer|false|none|none|
|»» kills|integer|false|none|none|
|»» max_kill_distance|integer|false|none|none|
|»» avg_kill_distance|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-client-players-playerId

<a id="opIdget-client-players-playerId"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/players/{playerId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /client/players/{playerId}`

*Statistics for a single player*

Data for a specific player

<h3 id="get-client-players-playerid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|server|query|number|false|Fetch data for specific server|
|weapon|query|string|false|Fetch data for specific weapon|
|playerId|path|string|true|ID of a player|

> Example responses

> 200 Response

```json
{
  "name": "Legonzaur",
  "deaths": 0,
  "kills": 0,
  "max_kill_distance": 0,
  "avg_kill_distance": 0
}
```

<h3 id="get-client-players-playerid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-client-players-playerid-responseschema">Response Schema</h3>

Status Code **200**

*Player*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» name|string|false|none|none|
|» deaths|integer|false|none|none|
|» kills|integer|false|none|none|
|» max_kill_distance|integer|false|none|none|
|» avg_kill_distance|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post-servers-serverId

<a id="opIdpost-servers-serverId"></a>

> Code samples

```javascript

fetch('https://tone.sleepycat.date/v1/servers/{serverId}',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /servers/{serverId}`

Used to test auth

<h3 id="post-servers-serverid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|serverId|path|string|true|ID of the server|

<h3 id="post-servers-serverid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
Auth_Token
</aside>

## post-kills

<a id="opIdpost-kills"></a>

> Code samples

```javascript
const inputBody = '{
  "tone_version": "string",
  "match_id": "string",
  "game_mode": "string",
  "map": "string",
  "game_time": "14:15:22Z",
  "player_count": 0,
  "attacker_name": "string",
  "attacker_id": 0,
  "attacker_current_weapon": "string",
  "attacker_current_weapon_mods": 0,
  "attacker_weapon_1": "string",
  "attacker_weapon_1_mods": 0,
  "attacker_weapon_2": "string",
  "attacker_weapon_2_mods": 0,
  "attacker_weapon_3": "string",
  "attacker_weapon_3_mods": 0,
  "attacker_offhand_weapon_1": 0,
  "attacker_offhand_weapon_2": 0,
  "victim_name": "string",
  "victim_id": 0,
  "victim_current_weapon": "string",
  "victim_current_weapon_mods": 0,
  "victim_weapon_1": "string",
  "victim_weapon_1_mods": 0,
  "victim_weapon_2": "string",
  "victim_weapon_2_mods": 0,
  "victim_weapon_3": "string",
  "victim_weapon_3_mods": 0,
  "victim_offhand_weapon_1": 0,
  "victim_offhand_weapon_2": 0,
  "cause_of_death": "string",
  "distance": 0
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('https://tone.sleepycat.date/v1/servers/{serverId}/kills',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /servers/{serverId}/kills`

*Post kills*

Allows a Northstar server to record kills on the database

> Body parameter

```json
{
  "tone_version": "string",
  "match_id": "string",
  "game_mode": "string",
  "map": "string",
  "game_time": "14:15:22Z",
  "player_count": 0,
  "attacker_name": "string",
  "attacker_id": 0,
  "attacker_current_weapon": "string",
  "attacker_current_weapon_mods": 0,
  "attacker_weapon_1": "string",
  "attacker_weapon_1_mods": 0,
  "attacker_weapon_2": "string",
  "attacker_weapon_2_mods": 0,
  "attacker_weapon_3": "string",
  "attacker_weapon_3_mods": 0,
  "attacker_offhand_weapon_1": 0,
  "attacker_offhand_weapon_2": 0,
  "victim_name": "string",
  "victim_id": 0,
  "victim_current_weapon": "string",
  "victim_current_weapon_mods": 0,
  "victim_weapon_1": "string",
  "victim_weapon_1_mods": 0,
  "victim_weapon_2": "string",
  "victim_weapon_2_mods": 0,
  "victim_weapon_3": "string",
  "victim_weapon_3_mods": 0,
  "victim_offhand_weapon_1": 0,
  "victim_offhand_weapon_2": 0,
  "cause_of_death": "string",
  "distance": 0
}
```

<h3 id="post-kills-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» id|body|integer|false|none|
|» server|body|string|false|none|
|» tone_version|body|string|false|none|
|» match_id|body|string|false|none|
|» game_mode|body|string|false|none|
|» map|body|string|false|none|
|» game_time|body|string(time)|false|none|
|» player_count|body|integer|false|none|
|» attacker_name|body|string|false|none|
|» attacker_id|body|integer|false|none|
|» attacker_current_weapon|body|string|false|none|
|» attacker_current_weapon_mods|body|integer|false|none|
|» attacker_weapon_1|body|string|false|none|
|» attacker_weapon_1_mods|body|integer|false|none|
|» attacker_weapon_2|body|string|false|none|
|» attacker_weapon_2_mods|body|integer|false|none|
|» attacker_weapon_3|body|string|false|none|
|» attacker_weapon_3_mods|body|integer|false|none|
|» attacker_offhand_weapon_1|body|integer|false|none|
|» attacker_offhand_weapon_2|body|integer|false|none|
|» victim_name|body|string|false|none|
|» victim_id|body|integer|false|none|
|» victim_current_weapon|body|string|false|none|
|» victim_current_weapon_mods|body|integer|false|none|
|» victim_weapon_1|body|string|false|none|
|» victim_weapon_1_mods|body|integer|false|none|
|» victim_weapon_2|body|string|false|none|
|» victim_weapon_2_mods|body|integer|false|none|
|» victim_weapon_3|body|string|false|none|
|» victim_weapon_3_mods|body|integer|false|none|
|» victim_offhand_weapon_1|body|integer|false|none|
|» victim_offhand_weapon_2|body|integer|false|none|
|» cause_of_death|body|string|true|none|
|» distance|body|number|false|none|
|serverId|path|string|true|ID of the server|

<h3 id="post-kills-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
Auth_Token
</aside>

# Schemas

<h2 id="tocS_Player">Player</h2>
<!-- backwards compatibility -->
<a id="schemaplayer"></a>
<a id="schema_Player"></a>
<a id="tocSplayer"></a>
<a id="tocsplayer"></a>

```json
{
  "name": "Legonzaur",
  "deaths": 0,
  "kills": 0,
  "max_kill_distance": 0,
  "avg_kill_distance": 0
}

```

Player

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|deaths|integer|false|none|none|
|kills|integer|false|none|none|
|max_kill_distance|integer|false|none|none|
|avg_kill_distance|number|false|none|none|

<h2 id="tocS_Weapon">Weapon</h2>
<!-- backwards compatibility -->
<a id="schemaweapon"></a>
<a id="schema_Weapon"></a>
<a id="tocSweapon"></a>
<a id="tocsweapon"></a>

```json
{
  "max_kill_distance": 0,
  "avg_kill_distance": 0,
  "kills": 0
}

```

Weapon

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|max_kill_distance|integer|false|none|none|
|avg_kill_distance|number|false|none|none|
|kills|integer|false|none|none|

<h2 id="tocS_Server">Server</h2>
<!-- backwards compatibility -->
<a id="schemaserver"></a>
<a id="schema_Server"></a>
<a id="tocSserver"></a>
<a id="tocsserver"></a>

```json
{
  "id": 1,
  "name": "fvnknoots 7v7"
}

```

Server

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|name|string|false|none|none|

<h2 id="tocS_Kill">Kill</h2>
<!-- backwards compatibility -->
<a id="schemakill"></a>
<a id="schema_Kill"></a>
<a id="tocSkill"></a>
<a id="tocskill"></a>

```json
{
  "id": 0,
  "server": "string",
  "tone_version": "string",
  "match_id": "string",
  "game_mode": "string",
  "map": "string",
  "game_time": "14:15:22Z",
  "player_count": 0,
  "attacker_name": "string",
  "attacker_id": 0,
  "attacker_current_weapon": "string",
  "attacker_current_weapon_mods": 0,
  "attacker_weapon_1": "string",
  "attacker_weapon_1_mods": 0,
  "attacker_weapon_2": "string",
  "attacker_weapon_2_mods": 0,
  "attacker_weapon_3": "string",
  "attacker_weapon_3_mods": 0,
  "attacker_offhand_weapon_1": 0,
  "attacker_offhand_weapon_2": 0,
  "victim_name": "string",
  "victim_id": 0,
  "victim_current_weapon": "string",
  "victim_current_weapon_mods": 0,
  "victim_weapon_1": "string",
  "victim_weapon_1_mods": 0,
  "victim_weapon_2": "string",
  "victim_weapon_2_mods": 0,
  "victim_weapon_3": "string",
  "victim_weapon_3_mods": 0,
  "victim_offhand_weapon_1": 0,
  "victim_offhand_weapon_2": 0,
  "cause_of_death": "string",
  "distance": 0
}

```

Kill

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|read-only|none|
|server|string|false|read-only|none|
|tone_version|string|false|none|none|
|match_id|string|false|none|none|
|game_mode|string|false|none|none|
|map|string|false|none|none|
|game_time|string(time)|false|none|none|
|player_count|integer|false|none|none|
|attacker_name|string|false|none|none|
|attacker_id|integer|false|none|none|
|attacker_current_weapon|string|false|none|none|
|attacker_current_weapon_mods|integer|false|none|none|
|attacker_weapon_1|string|false|none|none|
|attacker_weapon_1_mods|integer|false|none|none|
|attacker_weapon_2|string|false|none|none|
|attacker_weapon_2_mods|integer|false|none|none|
|attacker_weapon_3|string|false|none|none|
|attacker_weapon_3_mods|integer|false|none|none|
|attacker_offhand_weapon_1|integer|false|none|none|
|attacker_offhand_weapon_2|integer|false|none|none|
|victim_name|string|false|none|none|
|victim_id|integer|false|none|none|
|victim_current_weapon|string|false|none|none|
|victim_current_weapon_mods|integer|false|none|none|
|victim_weapon_1|string|false|none|none|
|victim_weapon_1_mods|integer|false|none|none|
|victim_weapon_2|string|false|none|none|
|victim_weapon_2_mods|integer|false|none|none|
|victim_weapon_3|string|false|none|none|
|victim_weapon_3_mods|integer|false|none|none|
|victim_offhand_weapon_1|integer|false|none|none|
|victim_offhand_weapon_2|integer|false|none|none|
|cause_of_death|string|true|none|none|
|distance|number|false|none|none|

