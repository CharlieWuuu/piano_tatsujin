var soundPack = [];
var sound_index = [
  1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11.5, 11,
  12, 12.5, 13, 13.5, 14, 15,
];

for (var i = 0; i < sound_index.length; i++) {
  soundPack.push({
    number: sound_index[i],
    url:
      'https://charliewuuu.github.io/piano_tatsujin/assets/music/' +
      sound_index[i] +
      '.wav',
  });
}

var vm = new Vue({
  el: '#app',
  data: {
    // 音檔
    soundData: soundPack,
    // 初始譜面
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

    // 現在譜面
    now_music: '',

    // 狀態：播放、挑戰、錄音
    is_playing: 0,
    is_challenging: 0,
    is_recording: 0,

    // 計時器、時間值；播放、錄音
    player: null,
    playing_time: -400,
    recorder: null,
    record_time: 0,

    // 錄音譜
    recorder_notes: [],

    // 現在播放音符、下一顆音符
    now_note_id: 0,
    next_note_id: 0,

    // 正在按的按鍵
    now_press_key: -1,

    // 文字：分數、說明
    score: 0,
    result: '快來挑戰!',

    // 鍵盤帶入的值（音高、對應琴鍵、黑白鍵）
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

    // 譜面
    url_database: [
      {
        urlId: 0,
        description: '蝴蝶',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/butterfly.json',
      },
      {
        urlId: 1,
        description: '小星星',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/star.json',
      },
      {
        urlId: 2,
        description: '歡樂頌',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/Ode_to_Joy.json',
      },
      {
        urlId: 3,
        description: '小步舞曲',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/minuet.json',
      },
      {
        urlId: 4,
        description: '給愛麗絲',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/elise.json',
      },
      {
        urlId: 5,
        description: '雨夜花',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/rain.json',
      },
      {
        urlId: 6,
        description: '龍貓',
        url: 'https://charliewuuu.github.io/piano_tatsujin/assets/javascript/dodoro.json',
      },
      {
        urlId: 7,
        description: '我的錄音',
        url: '',
      },
    ],
  },
  methods: {
    // 按琴鍵，帶入按的鍵盤的id（音高）
    clickNote: function (id) {
      if (this.is_recording == 1) {
        this.recorder_notes.push({ num: id, time: this.record_time });
      }
      if (this.is_challenging == 1) {
        this.getScore(id);
      }
      this.playNote(id);
    },

    // 播聲音：找該鍵盤的對應的audio，發出聲音
    playNote: function (id) {
      if (id > 0) {
        var audio_obj = $('audio[data-num="' + id + '"]')[0];
        audio_obj.volume = 1;
        audio_obj.currentTime = 0;
        audio_obj.play();
      }
    },

    // 顯示按著的琴鍵
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

    // 播譜面
    startPlay: function () {
      this.is_playing = 1;
      this.now_note_id = 0;
      this.next_note_id = 0;
      this.playing_time = -400;
      var vobj = this;

      this.player = setInterval(function () {
        vobj.playing_time++;
        // 設定now與next音符，才可以讓相鄰兩個音正確的播放
        if (vobj.playing_time >= vobj.notes[vobj.next_note_id].time) {
          vobj.playNote(vobj.notes[vobj.now_note_id].num);
          vobj.now_note_id += 1;
          if (vobj.now_note_id >= vobj.notes.length) {
            vobj.stopPlay();
          }
          vobj.next_note_id++;
        }
      }, 1);
    },

    // 顯示音符提示
    showNote: function (time) {
      if (
        (this.is_playing == 1 || this.is_challenging == 1) &&
        this.playing_time + 400 > time
      ) {
        return true;
      }
    },

    // 停播放：刪掉計時器、顯示評語、相關數值歸零
    stopPlay: function () {
      clearInterval(this.player);
      this.playing_time = -400;
      this.now_note_id = 0;
      this.next_note_id = 0;
      this.is_playing = 0;
      if (this.is_challenging == 1) this.showResult();
      this.is_challenging = 0;
    },

    // 更換譜面
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

    // 挑戰
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

    // 計分
    getScore: function (id) {
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

    // 顯示評價
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

    // 開始錄音
    startRecord: function () {
      this.is_recording = 1;
      ((this.recorder_notes = []), (this.record_time = 0)),
        (this.recorder = setInterval(function () {
          vm.record_time++;
        }));
    },

    // 結束錄音
    stopRecord: function () {
      this.recorder_notes.push({ num: 0, time: this.record_time + 400 });
      clearInterval(this.recorder);
      this.record_time = 0;
      this.is_recording = 0;
      this.notes = this.recorder_notes;
    },
  },
});

// 讓鍵盤與琴鍵對應。如果是在挑戰，會記錄按得正確的琴鍵
$(window).keydown(function (e) {
  var key = e.which;
  vm.now_press_key = key;
  for (i = 0; i < vm.display_keys.length; i++) {
    if (key == vm.display_keys[i].key) {
      vm.playNote(vm.display_keys[i].num);
    }
    if (vm.is_challenging == 1 && key == vm.display_keys[i].key) {
      vm.playNote(vm.display_keys[i].num);
      vm.getScore(vm.display_keys[i].num);
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
