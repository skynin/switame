export default class TestAI {

  sendTestData(dispatcher) {

    let ttt = 500
    for(let tstData of ttt3x3) {
      setTimeout(() => dispatcher(JSON.parse(tstData)), ttt)
      console.log('TestAI', tstData)
      ttt += 500
    }
  }
}

var arrTestSends = [
  `
  {
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "42",
            "chip": "O",
            "info": "user походил 42",
            "effect": "WIN"
        }
    ],
    "wait": true,
    "stamp": "sg233"
}
  `,
`
{
  "receiver": {
      "kind": "board"
  },
  "cells": [
      {
          "id": "41",
          "kind": "cell",
          "game": "g101",
          "brim": "brim",
          "chip": "O",
          "wait": false,
          "effect": "WIN"
      },
      {
          "id": "42",
          "chip": "O",
          "info": "user походил 42",
          "effect": "WIN"
      },
      {
          "id": "43",
          "kind": "cell",
          "game": "g101",
          "brim": "brim",
          "chip": "O",
          "wait": false,
          "effect": "WIN"
      }
  ],
  "stamp": "sg233"
}
`,
`
{
  "act": "status-new",
  "actData": "finish",
  "info": {
      "winner": "O",
      "info": ""
  },
  "receiver": {
      "kind": "game"
  },
  "wait": true,
  "stamp": "sg233"
}
`
]

/*
{
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "42",
            "chip": "O",
            "info": "user походил 42",
            "effect": "WIN"
        }
    ],
    "wait": true,
    "stamp": "sg233"
}
--
{
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "41",
            "kind": "cell",
            "game": "g101",
            "brim": "brim",
            "chip": "O",
            "wait": false,
            "effect": "WIN"
        },
        {
            "id": "42",
            "chip": "O",
            "info": "user походил 42",
            "effect": "WIN"
        },
        {
            "id": "43",
            "kind": "cell",
            "game": "g101",
            "brim": "brim",
            "chip": "O",
            "wait": false,
            "effect": "WIN"
        }
    ],
    "stamp": "sg233"
}

{
    "act": "status-new",
    "actData": "finish",
    "info": {
        "winner": "O",
        "info": ""
    },
    "receiver": {
        "kind": "game"
    },
    "wait": true,
    "stamp": "sg233"
}
*/

var ttt3x3 = [
`
{
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "32",
            "chip": "O",
            "info": "user походил 32",
            "effect": "WIN"
        }
    ],
    "wait": true,
    "stamp": "sg340"
}
`,
`
{
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "12",
            "kind": "cell",
            "game": "g100",
            "brim": "brim",
            "chip": "O",
            "wait": false,
            "effect": "WIN"
        },
        {
            "id": "22",
            "kind": "cell",
            "game": "g100",
            "brim": "brim",
            "chip": "O",
            "wait": false,
            "effect": "WIN"
        },
        {
            "id": "32",
            "chip": "O",
            "info": "user походил 32",
            "effect": "WIN"
        }
    ],
    "stamp": "sg340"
}`
,
`
{
    "act": "status-new",
    "actData": "finish",
    "info": {
        "winner": "O",
        "info": ""
    },
    "receiver": {
        "kind": "game"
    },
    "wait": true,
    "stamp": "sg340"
}
`
]

/*
{
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "32",
            "chip": "O",
            "info": "user походил 32",
            "effect": "WIN"
        }
    ],
    "wait": true,
    "stamp": "sg340"
}

{
    "receiver": {
        "kind": "board"
    },
    "cells": [
        {
            "id": "12",
            "kind": "cell",
            "game": "g100",
            "brim": "brim",
            "chip": "O",
            "wait": false,
            "effect": "WIN"
        },
        {
            "id": "22",
            "kind": "cell",
            "game": "g100",
            "brim": "brim",
            "chip": "O",
            "wait": false,
            "effect": "WIN"
        },
        {
            "id": "32",
            "chip": "O",
            "info": "user походил 32",
            "effect": "WIN"
        }
    ],
    "stamp": "sg340"
}

{
    "act": "status-new",
    "actData": "finish",
    "info": {
        "winner": "O",
        "info": ""
    },
    "receiver": {
        "kind": "game"
    },
    "wait": true,
    "stamp": "sg340"
}
*/