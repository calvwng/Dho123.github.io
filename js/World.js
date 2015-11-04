// all the rooms in the world. here for you.

var World = {
  levels: [
    { // Level 0
      name: "Move using the arrow keys",
      ascii: ["#####d##",
              "#......#",
              "#......#",
              "#.c....#",
              "#......#",
              "########"]
    }
    ,
    { // Level 1
      ascii: ["#D##.###",
              ".c.#.###",
              "...#.#d#",
              "w#w#....",
              "...w....",
              "...w.Lw."],
      on_start: [
        600, 'face_left', '!',
        'left', 200, 'up', 200, 'up', 200, 'up', 200, 'up', 200,
        'face_left', '<3', 0, 'player_face_right', 'player_<3', 1000,
        
        'face_down', 300, 'down', 300, 'down', 300, 'down', 300,
        'down', 300, 'right',
        
        'face_left', '!',
        
        'face_right', 'Z', 0, 'fork',
        
        'face_up', 200, 'up', 200, 'up', 200, 'right', 200,
        'face_down',
        'fork!' ],
      position_animations: {
        '5,5': [0, 'reminder'],
        '6,4': [0, 'reminder']
      },
      on_unfork: [ 'face_left', '<3' ]
    }
    ,
    { // Level 2
      ascii: ["#D######",
              "#cLw,,,#",
              "#,....,#",
              "#,....,#",
              "#,2..W,#",
              "#,,,,,,#"],
      on_kiss: [ 0, 'ask-fork', 'give' ],
      position_animations: {
        '5,3': [0, 'reminder'],
        '4,4': [0, 'reminder']
      },
      on_fork: [ '<3',
        'down', 300, 'right', 300, 'right', 300, 'up', 300,
        'face_left', 'left', 'left', 'face_down',
        
        'player_face_left', 'player_?', '!',
        'hint' ],
      on_solved: [ 'Z' ],
      on_unfork: [ 'face_down', 'R?' ],
      on_unfork_solved: [
        '<3',
        'left', 300, 'face_up', 'open',
        'face_right', 300, 'right', 300, 'face_down',
        'door?']
    }
    ,
    { // Level 3
      ascii: ["####D###",
              "###.....",
              "###...#.",
              ".cL..#..",
              "....#...",
              "....#,gG"],
      on_start: [ 1000, 'face_left', 'kiss', 'face_down', '<3' ],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 4
      name: "1 / 25",
      ascii: ["     #d#",
              "     #.#",
              "     #.#",
              "######.#",
              "Lc.w....",
              "########"],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 5 -- lover makes a mistake
      name: "2 / 25",
      ascii: ["###d###",
              "###.###",
              "##.w.##",
              "#.w.w.#",
              ".w.w.w.",
              "wcwLw.w"],
      on_start: [
        0, 'face_up', 300,
        'up', 'left', 'up', 1000,
        'face_right', 300, 'face_up', 'face_right', 1000,
        'face_down', 'R?'],
      on_reset: [ 'skip' ],
      on_kiss: [ 0, 'R?' ]
    }
    ,
    { // Level 6
      name: "2 / 25",
      ascii: ["###d###",
              "###.###",
              "##.w.##",
              "#.w.w.#",
              ".w.w.w.",
              "wcwLw.w"],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 7
      name: "3 / 25",
      ascii: ["###d###",
              "###.###",
              "##.w.##",
              "##w.W##",
              "#Lc...#",
              "#...2.#"],
      on_kiss: [ 0, 'ask-fork', 'give' ],
      on_fork: [ 'hint' ],
      on_solved: [ 'fork!' ]
    }
    ,
    { // Level 8
      name: "4 / 25",
      ascii: ["   #####",
              "  #..#D#",
              "###..o,#",
              "....##.#",
              ".L.w....",
              ".c.O####"],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 9
      name: "5 / 25",
      ascii: ["########",
              ".L.w.#d#",
              ".c.w...#",
              "...w.###",
              "########"],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 10
      name: "6 / 25",
      ascii: ["#d######",
              ".....,..",
              "####www#",
              ".L.w..,w",
              ".c.w...w"],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 11
      name: "7 / 25",
      ascii: ["#.w.####",
              "c.w.####",
              "LgwG##D#",
              "..w.#...",
              "#.w....."],
      on_start: [
        'down', 300, 'right', 300, 'down', 300, 'face_right',
        'right', 'right', 'right', 'right',
        'face_up', 300, 'up', 300, 'right', 300, 'face_up', 1500,
        'face_left', 'door?', 'level_up' ],
      on_solved: [
        'face_up', 1000,
        'face_left', 'door!',
        'face_up', 300, 'up', 300, 'leave'],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 12
      name: "7 / 25",
      ascii: ["#.w.####",
              "c.w.####",
              ".gwG##D#",
              "..w.#.L.",
              "#.....w."],
      on_solved: [
        'face_up', 1000,
        'face_left', 'door!',
        'face_up', 300, 'up', 300, 'leave'],
      on_kiss: [ 0, 'ask-fork', 'give' ]
    }
    ,
    { // Level 13
      name: "8 / 25",
      ascii: ["#######d",
              ".w.w.w..",
              ".w.w.wL.",
              "cw.w.w.#",
              ".w.w.w.#",
              ".w.w.w.#"],
      on_start: [ 0, 'face_right',
        'face_right', 300, 'right', 300, 'up', 300, 'up', 300, 'leave' ]
    }
    ,
    { // Level 14 -- Foreshadowing
      ascii: ["   #...#",
              "   ..g..",
              "## .....",
              "..   .  ",
              "...o...o",
              "........",
              "........",
              "........",
              "........",
              ".....F.."],
      on_start: [
        'octo_up', 800, 'octo_up', 800, 'octo_up', 800, 'octo_up', 800,
        'octo_up', 800, 'octo_up', 800, 'octo_up', 800,
        'octo_spork', 800, 'skip' ]
    }
    ,
    { // Level 15
      name: "9 / 25",
      ascii: ["#####D#",
              "c..#...",
              ".#.#...",
              "Ggo..O.",
              "...#..."]
    }
    ,
    { // Level 16
      name: "10 / 25",
      ascii: ["##D##",
              ".....",
              ".w.w.",
              "wgwGw",
              ".w.w.",
              "..c.."]
    }
    ,
    { // Level 17 -- something terrible has happened
      name: "",
      ascii: ["###D######",
              "..#.#...;;",
              "........;;",
              "c.......;;",
              "...fw...;;"],
      position_animations: {
        "3,4": ['face_down', 'pick', 'open']
      }
    }
    ,
    { // Level 18
      name: "11 / 25",
      ascii: ["#d###",
              ".....",
              "###.#",
              "?.ww.",
              ".....",
              "..C.."]
    }
    ,
    { // Level 19
      name: "12 / 25",
      ascii: ["#D###..",
              "..GGgg.",
              "....C.."]
    }
    ,
    { // Level 20
      name: "13 / 25",
      ascii: ["#####D#",
              "C..w..#",
              ".Gg..##"]
    }
    ,
    { // Level 21
      name: "14 / 25",
      ascii: ["#####D",
              "C..#..",
              ".#.#..",
              "Ggo..O",
              "...#.."]
    }
    ,
    { // Level 22
      name: "15 / 25",
      ascii: ["###D#",
              "#CB.#",
              "#.b.#",
              "#wow#",
              "#.O.#"]
    }
    ,
    { // Level 23
      name: "16 / 25",
      ascii: ["#####D#",
              "..w.w.#",
              "C.Gg..#",
              "..w.w.#",
              "#######"]
    }
    ,
    { // Level 24
      name: "17 / 25",
      ascii: ["####D#",
              "#....#",
              "#CgwG#",
              "#..#.#",
              "#.##.#",
              "#....#"]
    }
    ,
    { // Level 25
      name: "18 / 25",
      ascii: ["...####",
              ".C.####",
              ".b.#B#D",
              ".w...w.",
              ".wwwww.",
              "......."]
    }
    ,
    { // Level 26
      name: "19 / 25",
      ascii: ["#D####",
              "#.C.##",
              "#.ogOG",
              "###.##"]
    }
    ,
    { // Level 27
      name: "20 / 25",
      ascii: ["###D#",
              "#...#",
              "#.g.#",
              "#www#",
              "#...#",
              "#CG.#"]
    }
    ,
    { // Level 28
      name: "21 / 25",
      ascii: [" ###D#",
              " Gg..#",
              "CGg..#",
              " Gg..#"]
    }
    ,
    { // Level 29
      name: "22 / 25",
      ascii: ["#.w.###",
              "..w.###",
              "CgwG###",
              "..w.#D#",
              "#.w...#"]
    }
    ,
    { // Level 30
      name: "23 / 25",
      ascii: ["###D###",
              "..w.w..",
              ".wgwGw.",
              "..w.w..",
              "...C..."]
    }
    ,
    { // Level 31
      name: "24 / 25",
      ascii: ["###D##",
              "..Rr..",
              "C#..#.",
              "..gG.."]
    }
    ,
    { // Level 32
      name: "25 / 25",
      ascii: ["###D###",
              "###.###",
              "#..G..#",
              "#wwwww#",
              "#..g..#",
              "##.C.##"]
    }
    ,
    { // Level 33 -- The lair
      ascii: ["   #...#",
              "   ..g..",
              "## .....",
              "..   .  ",
              "...o...o",
              "........",
              "........",
              "........",
              ".c......",
              ".....F.."],
      last_level: true,
      on_start: [
        0, 'hidden',
        0, 'octo_up', 0, 'octo_up', 0, 'octo_up', 0, 'octo_up',
        0, 'octo_up', 0, 'octo_up', 0, 'octo_up',
        0, 'octo_spork',
        0, 'octo_down', 0, 'octo_down', 0, 'octo_down', 0, 'octo_down',
        0, 'octo_down', 0, 'octo_down', 0, 'octo_down', 0, 'octo_down',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'octo_left', 0, 'octo_right', 0, 'octo_left', 0, 'octo_right',
        0, 'unhidden',
        0, 'update_forked_block',
        'player_up', 'player_up'],
      on_spork: [
        0, 'fork',
        'octo_face_left', 'octo_face_right', 'spork!',
        'octo_escape', 600, 'octo_escape', 600,
        'octo_escape', 600, 'octo_escape', 600,
        'octo_escape', 600, 'octo_escape', 600,
        'octo_down', 'check_trap',
        'skip'
      ],
      on_trapped: [
        'octo_face_left', 'octo_face_right', '!'
      ]
    }
    ,
    { // Level 34 -- second visit
      name: "9 / 25",
      long_ending: true,
      ascii: ["#####D#",
              "S..#...",
              ".#.#...",
              "Ggo..O.",
              "...#..."]
    }
    ,
    { // Level 35 -- second visit
      name: "10 / 25",
      ascii: ["##d##",
              "w.w..",
              ".wLw.",
              "...gw",
              ".w.w.",
              "..S.."],
      on_start: [
        0, 'face_up',
        'face_left', 500, 'left', 500, 'face_up', 300, 'up', 300,
        'face_right', 'right', 500, 'face_up', 300, 'up', 300, 'leave']
    }
    ,
    { // Level 36 -- something terrible, explained
      ascii: ["###D######",
              "..#.#.....",
              "..........",
              "L.........",
              "....w....."],
      bad_ending: true,
      on_start: [
        0, 'face_right', 'right', 'right', 'right', 'face_up',
        'up', 500, 'up', 1500, 'door?',
        'face_down', 500, 'down', 500, 'down', 500,
        'open', 300, 'octo_appear', 300, 'close', 0,
        'face_up', 'face_left', 300, 'face_right', 300, 'face_up', '!',
        'down', 0, 'face_up', 1200,
        'octo_down', 600, 'octo_down', 600,
        'lover_dies',
        'octo_up', 600, 'octo_up', 600,
        'open', 300, 'octo_disappear', 300, 'close', 300,
        'credits',
        'c_appear',
        'show',
        'player_right', 'player_right', 'player_down', 'player_right',
        'pick', 'open', 'face_up', 1500,
        'player_up', 'player_up', 'player_up', 'player_up', 'leave',
        'the_end', 'unlock1'
      ]
    }
    ,
    { // Level 37 -- something terrible, avoided
      ascii: ["###D######",
              "..#.#.....",
              "..........",
              "L.........",
              "....w....."],
      good_ending: true,
      on_start: [
        0, 'face_right', 'right', 'right', 'right', 'face_up',
        'up', 500, 'up', 1500, 'door?',
        'face_down', 500, 'down', 500, 'down', 500,
        'down',
        'face_right', '?', 'fork',
        'open', 300, 'octo_appear', 300, 'close', 0,
        'face_up', 'face_left', 300, 'face_right', 300, 'face_up', 600,
        'octo_down', 1200, '!', 0, 'octo_down', 300,
        'face_right', 300, 'fork',
        'face_down', '!',
        'face_up', 200, 'up', 200, 'right', 200, 'right', 200, 'up', 200, 'up', 200, 'face_down',
        'open', 'octo_appear', 1200,
        'octo_down', 1200, 'octo_down', 1200, 'octo_down', 600,
        'down', 150, 'left', 150, 'left', 150, 'down', 150, 'stab',
        'octo_dies',
        '!', 'up', 'up', 'up', 300, 'leave', 300, 'close', 0,
        'credits',
        'c_appear',
        'show',
        'player_right', 'player_right', 'player_down', 'player_right',
        'pick', 'open', 'player_face_up', 1500,
        'player_up', 'player_up', 'player_up', 'player_up', 'leave',
        'the_end', 'unlock2'
      ]
    }
    ,
    { // Level 38 -- nothing terrible has ever happened
      ascii: ["###D######",
              "..#.#.....",
              "..........",
              "L.........",
              "....w....."],
      best_ending: true,
      on_start: [
        0, 'face_right', 'right', 'right', 'right', 'face_up',
        'up', 500, 'up', 1500, 'door?',
        'face_down', 500, 'down', 500, 'down', 500,
        'S_appear', 0, 'player_face_right',
        'face_left', '!',
        'left', 0, 'player_right',
        'saved', 0, '<3', 0, 'saved_end', 1000,
        'player_face_down', 0, 'face_down', 0,
        'credits',
        'show',
        'face_left', 'spork?',
        'the_end', 'unlock3'
      ]
    }
    ,
    { // Level 39
      name: "Bonus Level &mdash; 1 / 3",
      first_bonus: true,
      ascii: ["##D##",
              "R...G",
              ".rwg.",
              ".w.w.",
              ".bwo.",
              "B.S.O"]
    }
    ,
    { // Level 40
      name: "Bonus Level &mdash; 2 / 3",
      ascii: ["##D##",
              "G...R",
              ".rwg.",
              ".w.w.",
              ".bwo.",
              "O.S.B"]
    }
    ,
    { // Level 41
      name: "Bonus Level &mdash; 3 / 3",
      ascii: ["#####",
              "O...B",
              ".wwg.",
              ".w.w.",
              ".bwo.",
              "G.S.."],
      on_solved: [ 'credits', 'the_end', 'unlock4' ]
    }
  ],
  
  index_of_special_level: function(feature) {
    if (!this[feature]) {
      for(var i=0; i<this.levels.length; ++i) {
        if (this.levels[i][feature]) {
          this[feature] = i;
          break;
        }
      }
    }
    
    return this[feature];
  },
  index_of_last_level: function() {
    return this.index_of_special_level('last_level');
  },
  index_of_first_bonus: function() {
    return this.index_of_special_level('first_bonus');
  },
  index_of_long_ending: function() {
    return this.index_of_special_level('long_ending');
  },
  index_of_bad_ending: function() {
    return this.index_of_special_level('bad_ending');
  },
  index_of_good_ending: function() {
    return this.index_of_special_level('good_ending');
  },
  index_of_best_ending: function() {
    return this.index_of_special_level('best_ending');
  },
  load_room: function(index) {
    var data = this.levels[index];
    
    if (!data.symbols) {
      var h = data.ascii.length;
      var w = data.ascii[0].length;
      
      data.symbols = Table.create(w, h, function(pos) {
        return data.ascii[pos.y][pos.x];
      });
    }
    
    return Room.from_data(data);
  },
  load_multiroom: function(index) {
    var room = this.load_room(index);
    
    return Multiroom.create(room);
  },
  load_name: function(index) {
    var data = this.levels[index];
    
    return data.name ? data.name : "";
  },
  load_animation: function(index, animation_type) {
    var data = this.levels[index];
    return data[animation_type]
        ? data[animation_type]
        : [];
  },
  load_on_start: function(index) {
    return this.load_animation(index, 'on_start');
  },
  load_on_kiss: function(index) {
    return this.load_animation(index, 'on_kiss');
  },
  load_on_fork: function(index) {
    return this.load_animation(index, 'on_fork');
  },
  load_on_spork: function(index) {
    return this.load_animation(index, 'on_spork');
  },
  load_on_unfork: function(index) {
    return this.load_animation(index, 'on_unfork');
  },
  load_on_unfork_solved: function(index) {
    return this.load_animation(index, 'on_unfork_solved');
  },
  load_on_solved: function(index) {
    return this.load_animation(index, 'on_solved');
  },
  load_on_solved_kiss: function(index) {
    return this.load_animation(index, 'on_solved_kiss');
  },
  load_on_reset: function(index) {
    return this.load_animation(index, 'on_reset');
  },
  load_on_trapped: function(index) {
    return this.load_animation(index, 'on_trapped');
  },
  load_position_animations: function(index) {
    var data = this.levels[index];
    return data.position_animations
        ? data.position_animations
        : {};
  }
};
