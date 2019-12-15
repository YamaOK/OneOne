/**
 * LocalStorageの1つのコンテナを削除する
 * @param {number} game LocalStorageにあるコンテナのID
 */
const removeGame = (game) => {
  localStorage.removeItem(game)
}
