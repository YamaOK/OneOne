const loadStorage = () => {
  let games = []
  let counters = []

  for (var i = 0; i <= localStorage.length; i++) {
    const containerStr = localStorage.getItem(localStorage.key(i))
    const container = JSON.parse(containerStr)

    games.push({
      id: container.id,
      name: container.name,
      selected: container.selected
    })
    counters.push(container.counter)
  }

  kindOfGame.games = games
  counterBox.counters = counters
}
