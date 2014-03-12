var request = require('request')
  , user = process.env.USER
  , accessToken = process.env.ACCESS_TOKEN
  , org = process.env.ORGANISATION
  , lastChecked
  , lastResponse = {}

module.exports = function (cb) {
  if (!lastChecked) lastChecked = new Date().getTime() - 30000 // 30 seconds ago
  var now = new Date().getTime()
    , difference = now - lastChecked

  if (difference < 30000) return cb(null, lastResponse)

  var url = 'https://api.github.com/users/' + user + '/events/orgs/' + org + '?access_token=' + accessToken

  request(
    { url: url
    , headers: { 'User-Agent': 'Project-Hud' }
    }
    , function (error, res, body) {
    if (error) return cb(error)

    var jsonData = JSON.parse(body)
      , commits = []
      , removeOrgRegex = new RegExp(org + '/')

    jsonData.forEach(function (data) {
      if (data.type !== 'PushEvent') return

      var commit =
        { avatarUrl: data.actor.avatar_url
        , repoName: data.repo.name.replace(removeOrgRegex, '')
        , message: data.payload.commits[0].message
        , url: 'https://github.com/' + data.repo.name + '/commit/' + data.payload.commits[0].sha
        }

      commits.push(commit)
    })

    cb(null, commits)
  })
}
