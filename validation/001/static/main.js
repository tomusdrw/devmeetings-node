'use strict'

class Model {
  constructor (activities) {
    this._activities = activities
  }

  get activities () {
    return this._activities
  }
}

class View {
  constructor (model) {
    this._model = model
  }

  render () {
    return this._model.activities
      .map(activity => this.renderActivity(activity))
  }

  renderActivity (activity) {
    const $activity = document.createElement('div')
    $activity.className = 'activity'

    let $img = document.createElement('img')
    $img.classList.add('activity__img')
    $img.width = 250
    $img.height = 250
    $img.alt = activity.alt
    $img.src = `https://xpla.org/ext/lorempixel/250/250/sports/${activity.id}/`

    let $title = document.createElement('h3')
    $title.classList.add('activity__name')
    $title.textContent = activity.name

    let $time = document.createElement('p')
    $time.classList.add('activity__description')
    $time.innerHTML = `Time spent: <strong>${activity.timeSpent} min</strong>`

    let $button = document.createElement('button')
    $button.classList.add('activity__button--paused')
    $button.innerHTML = '&#9654; Start'

    $button.addEventListener('click', () => {
      window.alert(`Starting tracking: ${activity.name}`)
      console.log(activity)
    })

    $activity.appendChild($img)
    $activity.appendChild($title)
    $activity.appendChild($time)
    $activity.appendChild($button)

    return $activity
  }
}

function refresh () {
  const $activities = document.querySelector('.activities')
  $activities.innerHTML = ''

  window.fetch('v1/api/activities')
    .then(res => res.json())
    .then(activities => {
      const model = new Model(activities)
      const view = new View(model)
      view.render().map($activity => {
        $activities.appendChild($activity)
      })
    })
}

refresh()

document.querySelector('form').addEventListener('submit', (ev) => {
  ev.preventDefault()

  const name = ev.target.querySelector('input[name=name]').value
  const alt = ev.target.querySelector('input[name=alt]').value || name

  window.fetch('/v1/api/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, alt })
  }).then(res => {
    if (res.ok) {
      refresh()
    } else {
      throw res.json()
    }
  }).catch(err => {
    const message = err.error ? err.error.message : err.message
    window.alert(message)
  })
})
