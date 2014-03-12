(function () {

  function commitTemplate(commit) {
    var html = '<div class="commit__item">'
      + '<div class="commit__avatar"><img src="' + commit.avatarUrl + '" /></div>'
      + '<div class="commit__message"><a href="' + commit.url + '">' + commit.message + '</a></div>'
      + '<div class="commit__repo-name">' + commit.repoName + '</div></div>'

    return html
  }

  var request = new XMLHttpRequest()
    , $commits = document.getElementById('js-commits')

  request.onreadystatechange = function () {
    if (request.readyState !== 4 || request.status !== 200) return

    var res = JSON.parse(request.response)

    $commits.innerHTML = ''


    res.forEach(function (commit) {
      $commits.innerHTML += commitTemplate(commit)
    })
  }

  request.open('GET', '/latest-commits', true)
  request.send()

  setInterval(function () {
    request.open('GET', '/latest-commits', true)
    request.send()
  }, 300000)

})()
