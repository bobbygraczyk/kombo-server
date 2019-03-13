const fetch = require ('isomorphic-fetch');
const express = require ('express');
const router = express.Router();
const Session = require('../models/session');

function streamTick (data) {
  let sessionInfo = data;
  let tourneyInfo = null;
  if (sessionInfo.tournamentSlug && !sessionInfo.isPolling) {
      const query = `query TournamentQuery($id: String) {
        tournament(slug: $id){
          id
          name
        }
      }`;
      const variables = { id: sessionInfo.tournamentSlug };
      fetch("https://api.smash.gg/gql/alpha", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SMASHGG}`
      },
      body: JSON.stringify({ query: query, variables: variables })
      })
      .then(res => res.json())
      .then(res => {
        tourneyInfo = res.data.tournament;
        initPoll(sessionInfo, tourneyInfo);
      })
      .catch(err => console.log(err));
    }
}

function initPoll(sessionInfo, tourneyInfo) {
  let ms = 600000;
  let info = null;
  let poll = null;
  Session.findOneAndUpdate({"key": sessionInfo.key}, {"isPolling": true, "tournamentId": tourneyInfo.id, "tournamentName": tourneyInfo.name})
  .then(res => info = res);
  poll = setInterval(() => {
    console.log("Session " + sessionInfo.key + " expires in " + Math.floor(ms / 60000) + "m" + ((ms % 60000) / 1000) + "s");
    ms = ms - 11000;
    smashQuery(tourneyInfo.id, sessionInfo.key);
    }, 11000)
    if (sessionInfo) {
      setTimeout(() => {
        Session.findOneAndUpdate({"key": sessionInfo.key}, {"isPolling": false})
        .then(() => clearInterval(poll))
      }, 600000)
    }
}

function smashQuery (id, key) {
  let streamData = null;
  let matchData = null;
  const query = `query StreamQueues($tourneyId:Int!){
      streamQueue(tournamentId:$tourneyId, includePlayerStreams: true){
        stream{
          streamName
        }
        sets{
          id
          slots{
            entrant{
              name
            }
          }
        }
      }
    }`;
  const variables = { tourneyId: id };
  fetch("https://api.smash.gg/gql/alpha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SMASHGG}`
    },
    body: JSON.stringify({ query: query, variables: variables })
  })
    .then(res => res.json())
    .then(res => {
      updateInfo(res, key)
      if(res.data) {
      if(res.data.streamQueue){
        streamData = res.data;
        if (streamData.streamQueue[0]) {
          const query = `query SetEntrants($setId: String!) {
            set(id: $setId) {
              fullRoundText
              displayScore
              event {
                videogame {
                  name
                }
              }
            }
          }`;
          const variables = { setId: streamData.streamQueue[0].sets[0].id };
          fetch("https://api.smash.gg/gql/alpha", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.SMASHGG}`
            },
            body: JSON.stringify({ query: query, variables: variables })
          })
            .then(res => res.json())
            .then(res => {
              matchData = res.data;
              updateMatchInfo(matchData.set, key);
            })
            .catch(err => console.log(err));
        } else {
          console.log("no stream queue");
        }
      }}
    })
    .catch(err => console.log(err))
}

function updateInfo (data, key) {
  Session.findOneAndUpdate({"key": key}, {"streamInfo": data.data})
  .catch(err => console.log(err));
}

function updateMatchInfo (data, key) {
  Session.findOneAndUpdate({"key": key}, {"matchInfo": data})
  .catch(err => console.log(err));
}

router.post('/sessions/', (req, res, next) => {
  Session.create(req.body)
    .then(data => res.json(data))
    .catch(err => console.log(err))
    .catch(next)
})

router.get('/sessions/:id', (req, res, next) => {
  Session.findOne({"key": req.params.id})
    .then(data => {
      res.json(data);
      streamTick(data)
    })
    .catch(err => console.log(err))
    .catch(next)
})

router.post('/sessions/:id/messages', (req, res, next) => {
  Session.findOneAndUpdate({"key": req.params.id}, {$push: {messages: {user: req.body.user, body: req.body.body, date: req.body.date}}})
    .catch(err => console.log(err))
    .catch(next)
})

router.post('/sessions/:id/updateTournament', (req, res, next) => {
  Session.findOneAndUpdate({"key": req.params.id}, {"tournamentSlug": req.body.tournamentSlug})
    .then(data => res.json(data))
    .catch(err => console.log(err))
    .catch(next)
})

router.post('/sessions/:id/updateStream', (req, res, next) => {
  Session.findOneAndUpdate({"key": req.params.id}, {"stream": req.body.streamId})
    .then(data => res.json(data))
    .catch(err => console.log(err))
    .catch(next)
})

router.post('/sessions/:id/scoreboard', (req, res, next) => {
  Session.findOneAndUpdate({"key": req.params.id}, {"streamLayout": req.body})
    .then(data => res.json(data))
    .catch(err => console.log(err))
    .catch(next)
})

module.exports = router;