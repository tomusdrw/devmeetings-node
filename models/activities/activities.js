// 3/ Klasa modelu, która może być używana niezależnie. Możemy ją też osobno przetestować.
class Activities {
  constructor (data) {
    this._data = data
  }

  // 3/ Oznaczamy wszystkie funkcje jako asynchroniczne, żeby być future-proof
  async activities () {
    return this._data.slice(0)
  }

  async getActivity (id) {
    return this._data.find(x => x.id === id)
  }

  async removeActivity (id) {
    const idx = this._data.findIndex(x => x.id === id)
    if (!idx) {
      return null
    }

    const removed = this._data.splice(idx, 1)

    return removed[0]
  }

  async updateActivity (id, patch) {
    const activity = this._data.find(x => x.id === id)
    if (!activity) {
      return null
    }

    const { name, alt, timeSpent } = patch
    activity.name = name || activity.name
    activity.alt = alt || activity.alt
    activity.timeSpent = timeSpent || activity.timeSpent

    return activity
  }

  async newActivity (name, alt) {
    const id = this._data.length + 1
    const timeSpent = 0
    const activity = { id, name, alt, timeSpent }

    this._data.push(activity)

    return activity
  }
}

module.exports = new Activities([
  {
    id: 3,
    alt: 'Bicycle',
    name: 'Cycling',
    timeSpent: 120
  },
  {
    id: 7,
    alt: 'Swimmer',
    name: 'Swimming',
    timeSpent: 60
  },
  {
    id: 9,
    alt: 'Runners',
    name: 'Running',
    timeSpent: 30
  }
])
