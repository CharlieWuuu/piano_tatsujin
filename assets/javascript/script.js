var soundPack = [];
var sound_index = [
  1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11.5, 11,
  12, 12.5, 13, 13.5, 14, 15,
];

for (var i = 0; i < sound_index.length; i++) {
  soundPack.push({
    number: sound_index[i],
    url:
      'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/music/' +
      sound_index[i] +
      '.wav',
  });
}

// for (var i = 0; i < sound_index.length; i++) {
//   soundPack.push({
//     number: sound_index[i],
//     url: './assets/music/' + sound_index[i] + '.wav',
//   });
// }

var vm = new Vue({
  el: '#app',
  data: {
    soundData: soundPack,
    notes: [
      {
        num: 1,
        time: 0,
      },
      {
        num: 2,
        time: 100,
      },
      {
        num: 3,
        time: 200,
      },
      {
        num: 4,
        time: 300,
      },
      {
        num: 5,
        time: 400,
      },
      {
        num: 6,
        time: 500,
      },
      {
        num: 7,
        time: 600,
      },
      {
        num: 8,
        time: 700,
      },
      {
        num: 0,
        time: 1100,
      },
    ],
    challenger: [],
    recorder_notes: [],

    now_note_id: 0,
    next_note_id: 0,

    playing_time: -400,
    record_time: 0,

    now_press_key: -1,
    player: null,
    recorder: null,

    is_playing: 0,
    is_challenging: 0,
    is_recording: 0,

    now_music: '蝴蝶',

    score: 0,
    result: '快來挑戰!',
    situation: '沒有',

    display_keys: [
      { num: 1, key: 90, type: 'white' },
      { num: 1.5, key: 83, type: 'black' },
      { num: 2, key: 88, type: 'white' },
      { num: 2.5, key: 68, type: 'black' },
      { num: 3, key: 67, type: 'white' },
      { num: 4, key: 86, type: 'white' },
      { num: 4.5, key: 71, type: 'black' },
      { num: 5, key: 66, type: 'white' },
      { num: 5.5, key: 72, type: 'black' },
      { num: 6, key: 78, type: 'white' },
      { num: 6.5, key: 74, type: 'black' },
      { num: 7, key: 77, type: 'white' },
      { num: 8, key: 81, type: 'white' },
      { num: 8.5, key: 50, type: 'black' },
      { num: 9, key: 87, type: 'white' },
      { num: 9.5, key: 51, type: 'black' },
      { num: 10, key: 69, type: 'white' },
      { num: 11, key: 82, type: 'white' },
      { num: 11.5, key: 53, type: 'black' },
      { num: 12, key: 84, type: 'white' },
      { num: 12.5, key: 54, type: 'black' },
      { num: 13, key: 89, type: 'white' },
      { num: 13.5, key: 55, type: 'black' },
      { num: 14, key: 85, type: 'white' },
      { num: 15, key: 73, type: 'white' },
    ],

    url_database: [
      {
        urlId: 0,
        description: '蝴蝶',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/butterfly.json',
      },
      {
        urlId: 1,
        description: '小星星',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/star.json',
      },
      {
        urlId: 2,
        description: '歡樂頌',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/Ode_to_Joy.json',
      },
      {
        urlId: 3,
        description: '小步舞曲',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/minuet.json',
      },
      {
        urlId: 4,
        description: '給愛麗絲',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/elise.json',
      },
      {
        urlId: 5,
        description: '雨夜花',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/rain.json',
      },
      {
        urlId: 6,
        description: '龍貓',
        url: 'https://charliewuuu.github.io/myWebsiteNotes/keyboard/assets/javascript/dodoro.json',
      },
      {
        urlId: 7,
        description: '我的錄音',
        url: '',
      },
    ],
  },
  methods: {
    clickNote: function (id) {
      if (this.is_recording == 1) {
        this.recorder_notes.push({ num: id, time: this.record_time });
      }
      if (this.is_challenging == 1) {
        this.showScore(id);
      }
      this.playNote(id);
    },

    load_sample: function (e) {
      urlId = e.target.value;
      this.now_music = this.url_database[urlId].description;
      this.url_database[urlId].url;
      var vobj = this;
      if (urlId == 7) {
        vobj.notes = this.recorder_notes;
      } else {
        $.ajax({
          url: this.url_database[urlId].url,
          success: function (res) {
            vobj.notes = res;
          },
        });
      }
      this.score = 0;
      this.result = '快來挑戰!';
    },
    playNote: function (id) {
      if (id > 0) {
        var audio_obj = $('audio[data-num="' + id + '"]')[0];
        audio_obj.volume = 1;
        audio_obj.currentTime = 0;
        audio_obj.play();
      }
    },
    playNext: function (playing_time) {
      var play_note = this.notes[this.now_note_id].num;
      this.playNote(play_note);
      this.now_note_id += 1;
      if (this.now_note_id >= this.notes.length) {
        this.stopPlay();
      }
    },
    startRecord: function () {
      this.is_recording = 1;
      ((this.recorder_notes = []), (this.record_time = 0)),
        (this.recorder = setInterval(function () {
          vm.record_time++;
        }));
    },

    stopRecord: function () {
      this.recorder_notes.push({ num: 0, time: this.record_time + 400 });
      clearInterval(this.recorder);
      this.record_time = 0;
      this.is_recording = 0;
      this.notes = this.recorder_notes;
    },

    startPlay: function () {
      this.is_playing = 1;
      this.now_note_id = 0;
      this.playing_time = -400;
      this.next_note_id = 0;
      var vobj = this;
      this.player = setInterval(function () {
        vobj.playing_time++;
        if (vobj.playing_time >= vobj.notes[vobj.next_note_id].time) {
          vobj.playNext(vobj.playing_time);
          vobj.next_note_id++;
        }
      }, 1);
    },

    stopPlay: function () {
      clearInterval(this.player);
      this.now_note_id = 0;
      this.playing_time = -400;
      this.next_note_id = 0;
      this.is_playing = 0;
      if (this.is_challenging == 1) this.showResult();
      this.is_challenging = 0;
    },

    getCurrentHighlight: function (id, skey) {
      if (this.now_press_key == skey) return true;
      if (this.notes.length == 0) return false;
      var cur_id = this.now_note_id - 1;
      if (cur_id < 0) cur_id = 0;
      var num = this.notes[cur_id].num;
      if (
        num == id &&
        this.playing_time > 0 &&
        this.is_playing == 1 &&
        this.is_challenging == 0
      )
        return true;
      return false;
    },

    challenge: function () {
      this.score = 0;
      this.is_challenging = 1;
      this.result = '挑戰中...';
      this.playing_time = -400;
      var vobj = this;
      var notesAmount = vobj.notes.length - 1;
      this.player = setInterval(function () {
        vobj.playing_time++;
        if (vobj.playing_time >= vobj.notes[vobj.now_note_id].time) {
          vobj.now_note_id++;
        }
        if (vobj.playing_time >= vobj.notes[notesAmount].time) {
          vobj.stopPlay();
          vobj.showResult();
        }
      }, 1);
    },

    showScore: function (id) {
      this.situation = '';
      var numStandard = this.notes[this.now_note_id].num;
      var timeStandard = this.notes[this.now_note_id].time;

      if (this.is_challenging == 1) {
        if (
          numStandard == id &&
          Math.abs(this.playing_time - timeStandard) < 100 &&
          Math.abs(this.playing_time - timeStandard) > 50
        ) {
          this.score += 59;
        }
        if (
          numStandard == id &&
          Math.abs(this.playing_time - timeStandard) <= 50
        ) {
          this.score += 178;
        }
        if (numStandard !== id) {
          this.score -= 3;
        }
      }
    },

    showResult: function () {
      var fullScore = this.notes.length * 100;
      if (this.score >= fullScore * 0.8) this.result = '你是鋼琴達人！';
      if (fullScore * 0.8 > this.score && this.score >= fullScore * 0.5)
        this.result = '太厲害了！';
      if (fullScore * 0.5 > this.score && this.score >= fullScore * 0.2)
        this.result = '很有潛力！';
      if (fullScore * 0.2 > this.score && this.score >= 0)
        this.result = '再練習看看！';
      if (0 > this.score) this.result = '不可以亂按唷！';
    },

    showNote: function (time) {
      if (
        (this.is_playing == 1 || this.is_challenging == 1) &&
        this.playing_time + 400 > time
      ) {
        return true;
      }
    },
  },
});

$(window).keydown(function (e) {
  var key = e.which;
  vm.now_press_key = key;
  for (i = 0; i < vm.display_keys.length; i++) {
    if (key == vm.display_keys[i].key) {
      vm.playNote(vm.display_keys[i].num, 1);
    }
    if (vm.is_challenging == 1 && key == vm.display_keys[i].key) {
      vm.playNote(vm.display_keys[i].num, 1);
      vm.showScore(vm.display_keys[i].num, 1);
    }
    if (vm.is_recording == 1 && key == vm.display_keys[i].key) {
      vm.recorder_notes.push({
        num: vm.display_keys[i].num,
        time: vm.record_time,
      });
    }
  }
});

$(window).keyup(function () {
  vm.now_press_key = -1;
});
