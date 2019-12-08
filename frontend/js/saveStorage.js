const saveStorage = (game) => {
  const formattedData = {
    id: game.id,
    name: game.name,
    selected: game.selected,
    counter: {
      buttons: game.counter.buttons
    }
  }
  localStorage.setItem(game.id, JSON.stringify(formattedData))
}
