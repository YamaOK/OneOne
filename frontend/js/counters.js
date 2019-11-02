const kindOfGame = new Vue({
  el: '#kindOfGame',
  data: {
    editFlg: false,
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
    },
    classSelected: function (game) {
      return game.selected ? 'selected' : '';
    },
    addGame: function () {
      this.games.push({ name: 'New Game', selected: false })
      counterBox.counters.push({ editFlg: true, buttons: [{ name: '', count: 0 }, { name: '', count: 0 } ] })
    },
    editGame: function () {
      this.editFlg = !this.editFlg
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
      { editFlg: false, buttons: [{ name: '勝ち', count: 100 }, { name: '負け', count: 100 }] },
      { editFlg: false, buttons: [{ name: 'ドン勝つ', count: 0 }, { name: '負け', count: 0 }] },
      { editFlg: false, buttons: [{ name: '一家', count: 0 }, { name: '二家', count: 0 }, { name: '三家', count: 0 }, { name: '四家', count: 0 }] },
      { editFlg: false, buttons: [{ name: '勝ち', count: 0 }, { name: '負け', count: 0 }] }
    ],
    selected: 0
  },
  methods: {
    countUp: function (indexCnt, indexBtn) {
      this.counters[indexCnt].buttons[indexBtn].count++
      this.refleshChart()
    },
    addBtn: function (indexCnt) {
      this.counters[indexCnt].buttons.push({ name: 'New Button', count: 0 })
      this.refleshChart()
    },
    editBtn: function (indexCnt) {
      this.counters[indexCnt].editFlg = !this.counters[indexCnt].editFlg
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
  },
  computed: {
  }
})
