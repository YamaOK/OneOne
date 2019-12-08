let chart
const templateGame = { id: 1, name: 'New Game', selected: true, counter: { buttons: [{ name: 'hoghoge', count: 0 }, { name: 'fugafuga', count: 0 }] } }

Vue.component('counter-box', {
  props: ['gameTitle', 'isEditing', 'game'],
  data: function () {
    return {
      gameTitleEdit: '',
      newButtonName: ''
    }
  },
  methods: {
    countUp: function (indexBtn) {
      this.game.counter.buttons[indexBtn].count++
    },
    addBtn: function () {
      this.game.counter.buttons.push({ name: this.newButtonName, count: 0 })
      this.newButtonName = ''
    },
    editBtn: function () {
      if (this.isEditing) {
        this.game.name = this.gameTitleEdit
      } else {
        this.gameTitleEdit = this.game.name
      }
      this.isEditing = !this.isEditing
    },
    deleteBtn: function (indexBtn) {
      const confirmResult = window.confirm('本当にカウンターを削除してよろしいですか？\n※削除した内容（カウント回数）は元に戻せません')
      if (!confirmResult) {
        return
      }
      this.game.counter.buttons.pop(indexBtn)
    }
  },
  computed: {
    getTitleAreaLength: function () {
      return this.gameTitleEdit.length + 2
    }
  },
  template: `
    <div id="counterBox">
        <div class="counterArea">
            <div id="gameTitle">
                <span v-show="!isEditing">"{{game.name}}"</span>
                <input type="text" class="gameTitleEdit" :size='getTitleAreaLength'  v-model="gameTitleEdit" v-show="isEditing">
                <button class="btnEdit" @click="editBtn()">
                    <span v-show="!isEditing"><i class="fas fa-pen-nib fa-xs"></i></span>
                    <span v-show="isEditing"><i class="fas fa-check fa-sm"></i></span>
                </button>
            </div>
            <template v-for="(button, indexBtn) in game.counter.buttons">
                <div class="counter"  v-show="!isEditing">
                    <div class="counterBtn" @click="countUp(indexBtn)">
                        {{button.name}}
                    </div>
                    <div class="counterResult">
                        {{button.count}}
                    </div>
                </div>
            </template>
            <template v-for="(button, indexBtn) in game.counter.buttons">
                <div class="counter"  v-show="isEditing">
                    <div class="counterBtn">
                        <input type="text" class="buttonName" name="buttonName" v-model="button.name" />
                        <span @click="deleteBtn(indexBtn)"><i class="fas fa-backspace"></i></span>
                    </div>
                    <div class="counterResult">
                        <input type="number" class="counterEdit" name="counterEdit" v-model="button.count" />
                    </div>
                </div>
            </template>
            <div class="counter" v-show="isEditing">
                <input type="text" name="newCounterBtn" id="newCounterBtn" placeholder="new button name" v-model="newButtonName" @keydown.enter="addBtn()"/>
                <div class="counterResult">
                </div>
            </div>
        </div>
    </div>`
})
const kindOfGame = new Vue({
  el: '#kindOfGame',
  data: {
    isShow: false,
    isEditing: false,
    games: [
    ]
  },
  methods: {
    selectGame: function (index) {
      for (let i = 0; i < this.games.length; i++) {
        this.games[i].selected = false
      }
      this.games[index].selected = true
      this.refleshChart(this.games[index].counter)
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
      this.games.push({ id: this.generateNewId(), name: 'New Game', selected: false, counter: { isEditing: true, buttons: [{ name: '', count: 0 }, { name: '', count: 0 }] } })
      this.selectGame(this.games.length - 1)
      this.refleshChart(this.games[this.games.length - 1].counter)
    },
    editGame: function () {
      this.isEditing = !this.isEditing
    },
    trash: function (index) {
      this.games.pop(index)
    },
    refleshChart: function (counter) {
      chart.data.labels = []
      chart.data.datasets[0].data = []
      let maxCnt = 20
      const buttons = counter.buttons
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
  mounted() {
    this.games = loadStorage()
    if (this.games.length === 0) {
      this.games.push(templateGame)
    }
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
  },
  watch: {
    games: {
      handler: function (val, oldVal) {
        const selectedGame = val.reduce((pre, cur) => {
          return pre.selected ? pre : cur
        })
        if (selectedGame) {
          this.refleshChart(selectedGame.counter)
          saveStorage(selectedGame)
        }
      },
      deep: true
    }
  }
})
