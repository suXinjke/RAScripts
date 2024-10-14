// This set of functions is supposed to help with automating submitting achievements/leaderboard ordering,
// when there's too much of them - it's extremely tedious and it's possible to make a mistake.

// But then, the way it's done here is extremely hacky and may stop working.
// I did these for myself, you may borrow these only if you understand what you're doing,
// otherwise it'd be better if RetroAchievements had Quality of Life drag-and-drop sorting feature.

function delay(msec = 500) {
  return new Promise(res => setTimeout(res, msec))
}

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]').content
}

/*
    achievementsAndOrder example:
    [
        ["Name", "1"],
        ["Name2", "2"]
    ]
*/
async function uploadAchievementOrder(gameId, achievementsAndOrder) {
  const nameToId = [...document.querySelectorAll('article .table-highlight tr')]
    .filter(tr => tr.querySelector('img')).reverse()
    .reduce((prev, tr) => {
      const id = tr.querySelector('input[type="checkbox"]').value
      const name = tr.querySelector('td:nth-child(3)').childNodes[0].data

      prev[name] = id
      return prev
    }, {})
  const csrf = getCsrfToken()

  for (const x of achievementsAndOrder) {
    const [name, order] = x

    await fetch("/request/achievement/update-display-order.php", {
      method: "POST",
      body: new URLSearchParams({
        'achievement': nameToId[name],
        'game': gameId.toString(), // game id could be retrieved automatically but whatever
        'number': order,
      }),
      headers: {
        'X-CSRF-TOKEN': csrf
      }
    })

    await delay(3000)
  }

  console.log('done')
}

/*
    leaderboardsAndOrder example:
    [
        ["Name", "1"],
        ["Name2", "2"]
    ]
*/
async function uploadLeaderboardOrder(leaderboardsAndOrder, fillOnly = true) {
  function waitForOkMessage() {
    return new Promise((res) => {
      const statusBlock = document.querySelector('.sticky #status')
      const handle = setInterval(() => {
        if (statusBlock.style.display == 'block' && statusBlock.textContent == 'OK.') {
          res()
          clearInterval(handle)
        }
      }, 20)
    })
  }

  const leaderboards = [...document.querySelectorAll('table tr')]
    .filter(x => x.querySelector('input[type="checkbox"]'))
    .reduce((prev, x) => {
      prev[x.querySelector('input[id$="Title"]').value] = {
        id: x.querySelector('a').textContent,
        setDisplayOrder(order) {
          x.querySelector('input[id$="DisplayOrder"]').value = order
        }
      }
      return prev
    }, {})

  for (const x of leaderboardsAndOrder) {
    const [name, order] = x
    leaderboards[name].setDisplayOrder(order)

    if (!fillOnly) {
      // globally available function
      UpdateLeaderboard(leaderboards[name].id)
      await waitForOkMessage()
      await delay(1000)
    }
  }

  console.log('done')
}

function shortAchievementInfo() {
  return Array.from(
    document.querySelectorAll('#set-achievements-list li')
  ).map(e => ({
    title: e.querySelector('.inline.mr-1').innerText.trim(),
    description: e.querySelector('p.leading-4').innerText.trim(),
    badge: Number(e.querySelector('img').src.match(/\d+/))
  }))
}