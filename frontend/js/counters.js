const kindOfGame = new Vue({
  el: '#kindOfGame',
  data: {
    isShow: false,
    isEditing: false,
    games: []
  },
  methods: {
    selectGame: function (index) {
      counterBox.selected = index
      for (let i = 0; i < this.games.length; i++) {
        this.games[i].selected = i === index
      }
      counterBox.refleshChart()
      this.isShow = false
    },
    classSelected: function (game) {
      return game.selected ? 'selected' : ''
    },
    getMaxId: function () {
      const maxId = this.games.reduce((pre, cur) => {
        return pre.id > cur.id ? pre.id : cur.id
      })
      return maxId
    },
    generateNewId: function () {
      return this.getMaxId() + 1
    },
    addGame: function () {
      this.games.push({ id: this.generateNewId(), name: 'New Game', selected: false })
      counterBox.counters.push({ isEditing: true, buttons: [{ name: '', count: 0 }, { name: '', count: 0 }] })
      this.selectGame(this.games.length - 1)
    },
    editGame: function () {
      this.isEditing = !this.isEditing
    },
    trash: function (index) {
      this.games.pop(index)
      counterBox.counters.pop(index)
    }
  },
  mounted() {
    this.games[0].selected = true
  },
  watch: {
    games: {
      handler: function (val, oldVal) {
        let counter
        const selectedGame = val.filter((value, index) => {
          if (value.selected) {
            counter = counterBox.counters[index]
          }
          return value.selected
        })
        // When item deleted, no data to save
        if (!selectedGame) {
          return
        }
        saveStorage(selectedGame[0], counter)
      },
      deep: true
    }
  }
})
let chart
const counterBox = new Vue({
  el: '#counterBox',
  data: {
    counters: [],
    selected: 0,
    gameTitleEdit: '',
    newButtonName: ''
  },
  methods: {
    countUp: function (indexCnt, indexBtn) {
      this.counters[indexCnt].buttons[indexBtn].count++
      this.refleshChart()
    },
    addBtn: function (indexCnt) {
      this.counters[indexCnt].buttons.push({ name: this.newButtonName, count: 0 })
      this.refleshChart()
      this.newButtonName = ''
    },
    editBtn: function (indexCnt) {
      if (this.counters[indexCnt].isEditing) {
        kindOfGame.games[this.selected].name = this.gameTitleEdit
      } else {
        this.gameTitleEdit = kindOfGame.games[this.selected].name
      }
      this.counters[indexCnt].isEditing = !this.counters[indexCnt].isEditing
      this.refleshChart()
    },
    deleteBtn: function (indexCnt, indexBtn) {
      const confirmResult = window.confirm('本当にカウンターを削除してよろしいですか？\n※削除した内容（カウント回数）は元に戻せません')
      if (!confirmResult) {
        return
      }
      this.counters[indexCnt].buttons.pop(indexBtn)
      this.refleshChart()
    },
    refleshChart: function () {
      chart.data.labels = []
      chart.data.datasets[0].data = []
      let maxCnt = 20
      const buttons = this.counters[this.selected].buttons
      for (let index = 0; index < buttons.length; index++) {
        const button = buttons[index]
        chart.data.labels.push(button.name)
        chart.data.datasets[0].data.push(button.count)
        maxCnt = button.count * 1.2 <= maxCnt ? maxCnt : Math.floor(button.count * 1.2)
      }
      chart.options.scales.yAxes[0].ticks.max = maxCnt
      chart.update()
    }
  },
  computed: {
    gameTitle: function () {
      const index = this.selected
      return kindOfGame.games[index].name
    },
    getTitleAreaLength: function () {
      return this.gameTitleEdit.length + 2
    }
  },
  mounted() {
    const ctx = document.getElementById('chart')
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'count of buttons',
          backgroundColor: ['red', 'blue', 'yellow', 'green']
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 20
            }
          }]
        }
      }
    })
    this.refleshChart()
  },
  watch: {
    counters: {
      handler: function (val, oldVal) {
        saveStorage(kindOfGame.games[this.selected], val[this.selected])
      },
      deep: true
    },
  }
})
