const saveStorage = (game, counter) => {
    let formattedData = {}
    formattedData.push(
        {
            id: game.id,
            name:game.name,
            selected:game.selected,
            counter:{
                isEditing: counter.isEditing,
                buttons:counter.buttons
            }
        }
    )
    localStorage.setItem(game.id, JSON.stringify(formattedData))
    return
}