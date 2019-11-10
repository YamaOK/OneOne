const kindOfGame = new Vue({
  el: '#kindOfGame',
  data: {
    isShow: false,
    isEditing: false,
    games: [
      { name: '荒野行動', selected: false },
      { name: 'PUBG', selected: false },
      { name: '麻雀', selected: false },
      { name: 'ポーカー', selected: false }
    ]
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
    addGame: function () {
      this.games.push({ name: 'New Game', selected: false })
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
  mounted () {
    this.games[0].selected = true
  }
})
let chart
const counterBox = new Vue({
  el: '#counterBox',
  data: {
    counters: [
      { isEditing: false, buttons: [{ name: '勝ち', count: 100 }, { name: '負け', count: 100 }] },
      { isEditing: false, buttons: [{ name: 'ドン勝つ', count: 0 }, { name: '負け', count: 0 }] },
      { isEditing: false, buttons: [{ name: '一家', count: 0 }, { name: '二家', count: 0 }, { name: '三家', count: 0 }, { name: '四家', count: 0 }] },
      { isEditing: false, buttons: [{ name: '勝ち', count: 0 }, { name: '負け', count: 0 }] }
    ],
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
      console.log(this.chart)
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
  mounted () {
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
  }
})
