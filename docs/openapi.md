---
title: OpenAPI v1.0
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

<h1 id="openapi">OpenAPI v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Base URLs:

* <a href="https://tone.sleepycat.date/v1">https://tone.sleepycat.date/v1</a>

# Authentication

- HTTP Authentication, scheme: basic 

<h1 id="openapi-default">Default</h1>

## post-servers-register

<a id="opIdpost-servers-register"></a>

> Code samples

```javascript
const inputBody = '{
  "name": "string",
  "description": "string",
  "auth_port": 8081
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/servers/register',
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

`POST /servers/register`

Register a server on Tone API.
The server needs to be online on masterserver and reacheable by Tone.

> Body parameter

```json
{
  "name": "string",
  "description": "string",
  "auth_port": 8081
}
```

<h3 id="post-servers-register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» name|body|string|true|The name of your server as it appears on Northstar|
|» description|body|string|true|The description of your server as it appears on Northstar|
|» auth_port|body|integer(uri)|true|In most cases, this is the IP address of your server with the TCP port you forwarded|

> Example responses

> 201 Response

```json
{
  "id": 0,
  "token": "string"
}
```

<h3 id="post-servers-register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|None|

<h3 id="post-servers-register-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» token|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="openapi-server">server</h1>

Everything about servers

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
|serverId|path|string|true|none|

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
|body|body|[Kill](#schemakill)|false|none|
|serverId|path|string|true|none|

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

<h1 id="openapi-weapon">weapon</h1>

Everything about weapons

## get-weapon-list

<a id="opIdget-weapon-list"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/weapons/',
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

`GET /weapons/`

*List Weapons*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "Kraber",
    "description": "string",
    "image": "https://static.wikia.nocookie.net/titanfall_gamepedia/images/8/8b/Icon_kraber.png"
  }
]
```

<h3 id="get-weapon-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-weapon-list-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Weapon](#schemaweapon)]|false|none|none|
|» Weapon|[Weapon](#schemaweapon)|false|none|none|
|»» id|[WeaponID](#schemaweaponid)|true|none|none|
|»» name|string|false|none|none|
|»» description|string|false|none|none|
|»» image|string(uri)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="openapi-map">map</h1>

Everything about maps

## get-map-list

<a id="opIdget-map-list"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/maps/',
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

`GET /maps/`

*List Maps*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "Angel City",
    "description": "string",
    "image": "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/articles-tf2-welcome-header.jpg.adapt.320w.jpg"
  }
]
```

<h3 id="get-map-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-map-list-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Map](#schemamap)]|false|none|none|
|» Map|[Map](#schemamap)|false|none|none|
|»» id|[MapID](#schemamapid)|true|none|none|
|»» name|string|false|none|none|
|»» description|string|false|none|none|
|»» image|string(uri)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="openapi-client">client</h1>

## get-server-list

<a id="opIdget-server-list"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/servers/',
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

`GET /client/servers/`

*Get Server list*

> Example responses

> 200 Response

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
|*anonymous*|[[Server](#schemaserver)]|false|none|none|
|» Server|[Server](#schemaserver)|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-player-list-for-server

<a id="opIdget-player-list-for-server"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/servers/{serverId}/players',
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

`GET /client/servers/{serverId}/players`

*List Players for Server*

<h3 id="get-player-list-for-server-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|serverId|path|string|true|none|

> Example responses

> OK

```json
{
  "2250487322": {
    "kills": "16",
    "deaths": "3"
  },
  "2264540539": {
    "kills": "0",
    "deaths": "3"
  },
  "2275398718": {
    "kills": "28",
    "deaths": "36"
  },
  "2279483655": {
    "kills": "124",
    "deaths": "80"
  },
  "2293751643": {
    "kills": "88",
    "deaths": "122"
  },
  "2317053736": {
    "kills": "3",
    "deaths": "6"
  },
  "2365696799": {
    "kills": "69",
    "deaths": "64"
  },
  "2369053412": {
    "kills": "1",
    "deaths": "4"
  },
  "2372259449": {
    "kills": "2",
    "deaths": "8"
  },
  "2383354003": {
    "kills": "8",
    "deaths": "8"
  },
  "2394254742": {
    "kills": "31",
    "deaths": "19"
  },
  "2420152141": {
    "kills": "52",
    "deaths": "34"
  },
  "2434511212": {
    "kills": "2",
    "deaths": "9"
  },
  "2459505766": {
    "kills": "31",
    "deaths": "17"
  },
  "2480498234": {
    "kills": "60",
    "deaths": "26"
  },
  "2547349226": {
    "kills": "2",
    "deaths": "1"
  },
  "2651468854": {
    "kills": "37",
    "deaths": "27"
  },
  "2789001756": {
    "kills": "1",
    "deaths": "3"
  },
  "2793671940": {
    "kills": "1",
    "deaths": "10"
  },
  "2808303632": {
    "kills": "9",
    "deaths": "14"
  },
  "1004339478890": {
    "kills": "209",
    "deaths": "75"
  },
  "1009631167271": {
    "kills": "152",
    "deaths": "79"
  },
  "1010859553275": {
    "kills": "152",
    "deaths": "95"
  },
  "1013394101159": {
    "kills": "146",
    "deaths": "157"
  },
  "1008532828425": {
    "kills": "120",
    "deaths": "160"
  },
  "1005930844007": {
    "kills": "116",
    "deaths": "71"
  },
  "1008777336129": {
    "kills": "113",
    "deaths": "62"
  },
  "1006452683408": {
    "kills": "89",
    "deaths": "118"
  },
  "1009306948106": {
    "kills": "79",
    "deaths": "77"
  },
  "1001539583158": {
    "kills": "77",
    "deaths": "54"
  },
  "1008553404453": {
    "kills": "74",
    "deaths": "41"
  },
  "1000785195758": {
    "kills": "71",
    "deaths": "97"
  },
  "1012146561597": {
    "kills": "70",
    "deaths": "67"
  },
  "1008048039568": {
    "kills": "69",
    "deaths": "43"
  },
  "1006792160784": {
    "kills": "64",
    "deaths": "84"
  },
  "1000243552229": {
    "kills": "64",
    "deaths": "82"
  },
  "1002847919723": {
    "kills": "63",
    "deaths": "42"
  },
  "1006547511738": {
    "kills": "59",
    "deaths": "29"
  },
  "1008296544768": {
    "kills": "56",
    "deaths": "63"
  },
  "1010475004425": {
    "kills": "53",
    "deaths": "28"
  },
  "1009683708233": {
    "kills": "53",
    "deaths": "127"
  },
  "1007916824452": {
    "kills": "52",
    "deaths": "38"
  },
  "1005789878582": {
    "kills": "50",
    "deaths": "41"
  },
  "1000208553932": {
    "kills": "48",
    "deaths": "40"
  },
  "1011886375716": {
    "kills": "47",
    "deaths": "27"
  },
  "1010766135749": {
    "kills": "45",
    "deaths": "56"
  },
  "1009353300588": {
    "kills": "44",
    "deaths": "18"
  },
  "1000563596599": {
    "kills": "44",
    "deaths": "47"
  },
  "1008076070452": {
    "kills": "42",
    "deaths": "33"
  },
  "1000170397365": {
    "kills": "41",
    "deaths": "33"
  },
  "1007384912695": {
    "kills": "41",
    "deaths": "55"
  },
  "1009289344839": {
    "kills": "40",
    "deaths": "91"
  },
  "1002547370637": {
    "kills": "40",
    "deaths": "21"
  },
  "1008848730302": {
    "kills": "40",
    "deaths": "78"
  },
  "1002965199684": {
    "kills": "39",
    "deaths": "40"
  },
  "1008704914497": {
    "kills": "38",
    "deaths": "21"
  },
  "1000680732650": {
    "kills": "38",
    "deaths": "21"
  },
  "1009020277340": {
    "kills": "37",
    "deaths": "43"
  },
  "1009001081875": {
    "kills": "37",
    "deaths": "57"
  },
  "1002862920668": {
    "kills": "34",
    "deaths": "26"
  },
  "1007927614255": {
    "kills": "34",
    "deaths": "61"
  },
  "1007344081350": {
    "kills": "32",
    "deaths": "54"
  },
  "1000689836348": {
    "kills": "30",
    "deaths": "24"
  },
  "1002365588355": {
    "kills": "28",
    "deaths": "32"
  },
  "1000599975674": {
    "kills": "28",
    "deaths": "18"
  },
  "1009981913274": {
    "kills": "26",
    "deaths": "16"
  },
  "1003950824662": {
    "kills": "26",
    "deaths": "13"
  },
  "1000474582791": {
    "kills": "26",
    "deaths": "32"
  },
  "1007213425353": {
    "kills": "26",
    "deaths": "44"
  },
  "1009295548275": {
    "kills": "25",
    "deaths": "41"
  },
  "1007246486495": {
    "kills": "23",
    "deaths": "26"
  },
  "1012332759108": {
    "kills": "22",
    "deaths": "21"
  },
  "1004355057125": {
    "kills": "21",
    "deaths": "54"
  },
  "1010246320749": {
    "kills": "21",
    "deaths": "23"
  },
  "1009763674601": {
    "kills": "19",
    "deaths": "21"
  },
  "1000991748686": {
    "kills": "19",
    "deaths": "14"
  },
  "1003495333189": {
    "kills": "19",
    "deaths": "32"
  },
  "1012863344924": {
    "kills": "19",
    "deaths": "28"
  },
  "1005030069502": {
    "kills": "18",
    "deaths": "24"
  },
  "1011188414213": {
    "kills": "17",
    "deaths": "13"
  },
  "1006943687079": {
    "kills": "17",
    "deaths": "28"
  },
  "1000314539111": {
    "kills": "17",
    "deaths": "13"
  },
  "1007803613856": {
    "kills": "12",
    "deaths": "19"
  },
  "1006068335533": {
    "kills": "12",
    "deaths": "16"
  },
  "1009495187105": {
    "kills": "10",
    "deaths": "6"
  },
  "1009388895366": {
    "kills": "9",
    "deaths": "41"
  },
  "1007511112791": {
    "kills": "8",
    "deaths": "11"
  },
  "1004230608953": {
    "kills": "7",
    "deaths": "6"
  },
  "1009058558981": {
    "kills": "7",
    "deaths": "8"
  },
  "1009752496386": {
    "kills": "7",
    "deaths": "35"
  },
  "1007983554545": {
    "kills": "7",
    "deaths": "4"
  },
  "1012165044680": {
    "kills": "6",
    "deaths": "4"
  },
  "1011679847131": {
    "kills": "6",
    "deaths": "11"
  },
  "1009810188385": {
    "kills": "6",
    "deaths": "6"
  },
  "1003340724325": {
    "kills": "5",
    "deaths": "2"
  },
  "1000250176837": {
    "kills": "4",
    "deaths": "4"
  },
  "1006902817643": {
    "kills": "4",
    "deaths": "8"
  },
  "1000436348239": {
    "kills": "4",
    "deaths": "3"
  },
  "1011584031432": {
    "kills": "4",
    "deaths": "6"
  },
  "1013302746779": {
    "kills": "4",
    "deaths": "10"
  },
  "1002319733641": {
    "kills": "3",
    "deaths": "8"
  },
  "1008766563524": {
    "kills": "3",
    "deaths": "5"
  },
  "1010590824824": {
    "kills": "3",
    "deaths": "6"
  },
  "1014450712715": {
    "kills": "3",
    "deaths": "15"
  },
  "1011819105616": {
    "kills": "3",
    "deaths": "11"
  },
  "1013339742185": {
    "kills": "3",
    "deaths": "11"
  },
  "1007720444069": {
    "kills": "3",
    "deaths": "6"
  },
  "1010050271094": {
    "kills": "3",
    "deaths": "9"
  },
  "1008220179508": {
    "kills": "3",
    "deaths": "17"
  },
  "1008335546916": {
    "kills": "3",
    "deaths": "7"
  },
  "1008176168711": {
    "kills": "3",
    "deaths": "10"
  },
  "1007793002161": {
    "kills": "3",
    "deaths": "14"
  },
  "1009137965834": {
    "kills": "2",
    "deaths": "9"
  },
  "1012089978411": {
    "kills": "2",
    "deaths": "10"
  },
  "1003566577430": {
    "kills": "2",
    "deaths": "9"
  },
  "1006446444857": {
    "kills": "2",
    "deaths": "1"
  },
  "1009129948330": {
    "kills": "2",
    "deaths": "2"
  },
  "1009320303734": {
    "kills": "2",
    "deaths": "4"
  },
  "1011425349538": {
    "kills": "2",
    "deaths": "7"
  },
  "1000082780513": {
    "kills": "2",
    "deaths": "28"
  },
  "1009059593350": {
    "kills": "2",
    "deaths": "12"
  },
  "1008930859124": {
    "kills": "2",
    "deaths": "3"
  },
  "1011062416507": {
    "kills": "2",
    "deaths": "15"
  },
  "1008322047749": {
    "kills": "1",
    "deaths": "5"
  },
  "1010909176351": {
    "kills": "1",
    "deaths": "3"
  },
  "1009015699732": {
    "kills": "1",
    "deaths": "9"
  },
  "1010938099750": {
    "kills": "1",
    "deaths": "10"
  },
  "1009920857596": {
    "kills": "1",
    "deaths": "3"
  },
  "1001248580325": {
    "kills": "1",
    "deaths": "2"
  },
  "1003395331672": {
    "kills": "1",
    "deaths": "0"
  },
  "1008850794164": {
    "kills": "1",
    "deaths": "1"
  },
  "1002970526901": {
    "kills": "1",
    "deaths": "10"
  },
  "1009585427210": {
    "kills": "0",
    "deaths": "7"
  },
  "1010044829720": {
    "kills": "0",
    "deaths": "2"
  },
  "1010302326976": {
    "kills": "0",
    "deaths": "2"
  },
  "1011336094869": {
    "kills": "0",
    "deaths": "1"
  },
  "1010890839674": {
    "kills": "0",
    "deaths": "2"
  },
  "1003009344333": {
    "kills": "0",
    "deaths": "2"
  },
  "1010690831586": {
    "kills": "0",
    "deaths": "1"
  },
  "1012016676172": {
    "kills": "0",
    "deaths": "3"
  },
  "1010958615370": {
    "kills": "0",
    "deaths": "1"
  },
  "1010804831845": {
    "kills": "0",
    "deaths": "4"
  },
  "1014036958511": {
    "kills": "0",
    "deaths": "5"
  },
  "1013377950364": {
    "kills": "0",
    "deaths": "3"
  },
  "1003516913859": {
    "kills": "0",
    "deaths": "2"
  },
  "1005317405570": {
    "kills": "0",
    "deaths": "1"
  },
  "1010373048502": {
    "kills": "0",
    "deaths": "1"
  },
  "1000319933061": {
    "kills": "0",
    "deaths": "2"
  },
  "1013284789566": {
    "kills": "0",
    "deaths": "4"
  },
  "1000180555075": {
    "kills": "0",
    "deaths": "5"
  },
  "1004519819956": {
    "kills": "0",
    "deaths": "1"
  },
  "1008082281599": {
    "kills": "0",
    "deaths": "2"
  },
  "1009413737635": {
    "kills": "0",
    "deaths": "1"
  },
  "1003853474628": {
    "kills": "0",
    "deaths": "4"
  },
  "1013146253403": {
    "kills": "0",
    "deaths": "5"
  },
  "1010845289697": {
    "kills": "0",
    "deaths": "4"
  },
  "1007170712677": {
    "kills": "0",
    "deaths": "3"
  },
  "1011747811565": {
    "kills": "0",
    "deaths": "3"
  },
  "1008770977823": {
    "kills": "0",
    "deaths": "1"
  },
  "1006338144987": {
    "kills": "0",
    "deaths": "1"
  }
}
```

<h3 id="get-player-list-for-server-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-player-list-for-server-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» [id]|object|false|none|none|
|»» kills|integer|false|none|none|
|»» deaths|integer|false|none|none|
|»» last_seen|string(date-time)|false|none|none|
|»» first_seen|string(date-time)|false|none|none|
|»» max_kill_distance|number|false|none|none|
|»» avg_kill_distance|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-weapons-report-for-server

<a id="opIdget-weapons-report-for-server"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/servers/{serverId}/weapons',
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

`GET /client/servers/{serverId}/weapons`

*Get Weapon report for server*

<h3 id="get-weapons-report-for-server-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|serverId|path|string|true|none|

> Example responses

> OK

```json
{
  "sniper": {
    "kills": "1180",
    "avg_kill_distance": "806",
    "max_kill_distance": "3454"
  },
  "wingman_n": {
    "kills": "831",
    "avg_kill_distance": "608",
    "max_kill_distance": "2834"
  },
  "mastiff": {
    "kills": "425",
    "avg_kill_distance": "318",
    "max_kill_distance": "1570"
  },
  "epg": {
    "kills": "386",
    "avg_kill_distance": "468",
    "max_kill_distance": "3023"
  },
  "semipistol": {
    "kills": "196",
    "avg_kill_distance": "370",
    "max_kill_distance": "1104"
  },
  "thermite_grenade": {
    "kills": "142",
    "avg_kill_distance": "469",
    "max_kill_distance": "1472"
  },
  "softball": {
    "kills": "139",
    "avg_kill_distance": "435",
    "max_kill_distance": "1303"
  },
  "doubletake": {
    "kills": "136",
    "avg_kill_distance": "852",
    "max_kill_distance": "2618"
  },
  "shotgun_pistol": {
    "kills": "135",
    "avg_kill_distance": "439",
    "max_kill_distance": "1419"
  },
  "wingman": {
    "kills": "98",
    "avg_kill_distance": "473",
    "max_kill_distance": "1854"
  },
  "shotgun": {
    "kills": "87",
    "avg_kill_distance": "311",
    "max_kill_distance": "745"
  },
  "pilot_emptyhanded": {
    "kills": "65",
    "avg_kill_distance": "44",
    "max_kill_distance": "115"
  },
  "defender": {
    "kills": "62",
    "avg_kill_distance": "1070",
    "max_kill_distance": "3835"
  },
  "satchel": {
    "kills": "54",
    "avg_kill_distance": "503",
    "max_kill_distance": "1047"
  },
  "grenade_sonar": {
    "kills": "43",
    "avg_kill_distance": "491",
    "max_kill_distance": "1205"
  },
  "smr": {
    "kills": "27",
    "avg_kill_distance": "490",
    "max_kill_distance": "1405"
  },
  "grenade_electric_smoke": {
    "kills": "8",
    "avg_kill_distance": "527",
    "max_kill_distance": "987"
  },
  "human_execution": {
    "kills": "4",
    "avg_kill_distance": "45",
    "max_kill_distance": "71"
  },
  "fall": {
    "kills": "1",
    "avg_kill_distance": "876",
    "max_kill_distance": "876"
  },
  "arc_launcher": {
    "kills": "1",
    "avg_kill_distance": "454",
    "max_kill_distance": "454"
  }
}
```

<h3 id="get-weapons-report-for-server-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="get-weapons-report-for-server-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» [weaponID]|object|false|none|none|
|»» kills|integer|false|none|none|
|»» avg_kill_distance|number|false|none|none|
|»» max_kill_distance|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get-player-on-server

<a id="opIdget-player-on-server"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('https://tone.sleepycat.date/v1/client/servers/{serverId}/players/{playerId}',
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

`GET /client/servers/{serverId}/players/{playerId}`

*Get Player report for Server*

<h3 id="get-player-on-server-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|playerId|path|integer|true|none|
|serverId|path|integer|true|none|

> Example responses

> OK

```json
{
  "last_seen": "Mon Mar 13 2023 13:42:15 GMT+0100 (heure normale d’Europe centrale)",
  "max_kill_distance": "1160",
  "avg_kill_distance": "400.5000000000000000",
  "first_seen": "Mon Mar 13 2023 13:30:13 GMT+0100 (heure normale d’Europe centrale)",
  "deaths": "21",
  "kills": "22",
  "weapons": {
    "epg": {
      "kills": "21",
      "deaths": "8",
      "avg_kill_distance": "395",
      "max_kill_distance": "1160"
    },
    "thermite_grenade": {
      "kills": "1",
      "deaths": "0",
      "avg_kill_distance": "505",
      "max_kill_distance": "505"
    },
    "mastiff": {
      "kills": "0",
      "deaths": "5",
      "avg_kill_distance": "0",
      "max_kill_distance": "0"
    },
    "wingman_n": {
      "kills": "0",
      "deaths": "8",
      "avg_kill_distance": "0",
      "max_kill_distance": "0"
    }
  }
}
```

<h3 id="get-player-on-server-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not Found|None|

<h3 id="get-player-on-server-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» kills|integer|false|none|Number of kills of the user in this server|
|» deaths|integer|false|none|Number of deaths of the user in this server|
|» first_time_seen|string(date-time)|false|none|none|
|» last_time_seen|string(date-time)|false|none|none|
|» max_kill_distance|number|false|none|none|
|» avg_kill_distance|number|false|none|none|
|» weapons|object|false|none|none|
|»» [weaponId]|[PrefferedWeapon](#schemaprefferedweapon)|false|none|none|
|»»» kills|integer|false|none|none|
|»»» deaths|integer|false|none|none|
|»»» max_kill_distance|integer|false|none|none|
|»»» avg_kill_distance|integer|false|none|none|

<aside class="success">
This operation does not require authentication
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
  "id": 0,
  "name": "Legonzaur",
  "opt-out": false,
  "hide_TOS": false
}

```

Player

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|[PlayerID](#schemaplayerid)|true|none|none|
|name|string|false|none|none|
|opt-out|boolean|false|none|If set to true, kills and deaths about this user won't be sent to the database|
|hide_TOS|boolean|false|none|If set to true, TOS will be hidden when player joins a server|

<h2 id="tocS_Weapon">Weapon</h2>
<!-- backwards compatibility -->
<a id="schemaweapon"></a>
<a id="schema_Weapon"></a>
<a id="tocSweapon"></a>
<a id="tocsweapon"></a>

```json
{
  "id": "string",
  "name": "Kraber",
  "description": "string",
  "image": "https://static.wikia.nocookie.net/titanfall_gamepedia/images/8/8b/Icon_kraber.png"
}

```

Weapon

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|[WeaponID](#schemaweaponid)|true|none|none|
|name|string|false|none|none|
|description|string|false|none|none|
|image|string(uri)|false|none|none|

<h2 id="tocS_Map">Map</h2>
<!-- backwards compatibility -->
<a id="schemamap"></a>
<a id="schema_Map"></a>
<a id="tocSmap"></a>
<a id="tocsmap"></a>

```json
{
  "id": "string",
  "name": "Angel City",
  "description": "string",
  "image": "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/articles-tf2-welcome-header.jpg.adapt.320w.jpg"
}

```

Map

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|[MapID](#schemamapid)|true|none|none|
|name|string|false|none|none|
|description|string|false|none|none|
|image|string(uri)|false|none|none|

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

<h2 id="tocS_PlayerID">PlayerID</h2>
<!-- backwards compatibility -->
<a id="schemaplayerid"></a>
<a id="schema_PlayerID"></a>
<a id="tocSplayerid"></a>
<a id="tocsplayerid"></a>

```json
0

```

PlayerId

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|PlayerId|integer|false|none|none|

<h2 id="tocS_WeaponID">WeaponID</h2>
<!-- backwards compatibility -->
<a id="schemaweaponid"></a>
<a id="schema_WeaponID"></a>
<a id="tocSweaponid"></a>
<a id="tocsweaponid"></a>

```json
"string"

```

WeaponID

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|WeaponID|string|false|none|none|

<h2 id="tocS_MapID">MapID</h2>
<!-- backwards compatibility -->
<a id="schemamapid"></a>
<a id="schema_MapID"></a>
<a id="tocSmapid"></a>
<a id="tocsmapid"></a>

```json
"string"

```

MapID

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|MapID|string|false|none|none|

<h2 id="tocS_PrefferredServer">PrefferredServer</h2>
<!-- backwards compatibility -->
<a id="schemaprefferredserver"></a>
<a id="schema_PrefferredServer"></a>
<a id="tocSprefferredserver"></a>
<a id="tocsprefferredserver"></a>

```json
{
  "server": {
    "id": 1,
    "name": "fvnknoots 7v7"
  },
  "killCount": 4988,
  "deathCount": 4671
}

```

PrefferredServer

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|server|[Server](#schemaserver)|false|none|none|
|killCount|integer|false|none|none|
|deathCount|integer|false|none|none|

<h2 id="tocS_PrefferedWeapon">PrefferedWeapon</h2>
<!-- backwards compatibility -->
<a id="schemaprefferedweapon"></a>
<a id="schema_PrefferedWeapon"></a>
<a id="tocSprefferedweapon"></a>
<a id="tocsprefferedweapon"></a>

```json
{
  "kills": 0,
  "deaths": 0,
  "max_kill_distance": 0,
  "avg_kill_distance": 0
}

```

PrefferedWeapon

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|kills|integer|false|none|none|
|deaths|integer|false|none|none|
|max_kill_distance|integer|false|none|none|
|avg_kill_distance|integer|false|none|none|

<h2 id="tocS_PrefferedMap">PrefferedMap</h2>
<!-- backwards compatibility -->
<a id="schemaprefferedmap"></a>
<a id="schema_PrefferedMap"></a>
<a id="tocSprefferedmap"></a>
<a id="tocsprefferedmap"></a>

```json
{
  "map": {
    "id": "string",
    "name": "Angel City",
    "description": "string",
    "image": "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/articles-tf2-welcome-header.jpg.adapt.320w.jpg"
  },
  "killCount": 0,
  "deathCount": 0
}

```

PrefferedMap

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|map|[Map](#schemamap)|false|none|none|
|killCount|integer|false|none|none|
|deathCount|integer|false|none|none|

<h2 id="tocS_TopPlayers">TopPlayers</h2>
<!-- backwards compatibility -->
<a id="schematopplayers"></a>
<a id="schema_TopPlayers"></a>
<a id="tocStopplayers"></a>
<a id="tocstopplayers"></a>

```json
{
  "player": {
    "id": 0,
    "name": "Legonzaur",
    "opt-out": false,
    "hide_TOS": false
  },
  "kill_count": 0,
  "death_count": 0
}

```

TopPlayers

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|player|[Player](#schemaplayer)|false|none|none|
|kill_count|integer|false|none|none|
|death_count|integer|false|none|none|

