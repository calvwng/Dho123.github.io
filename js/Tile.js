// an immutable representation of a tile type,
// like Tile.wall or Tile.floor;
// remember to always compare with "===".

var Tile = {
  list: {},
  from_symbol: function(symbol) {
    return this.list[symbol];
  },
  create: function(symbol, tile) {
    this.list[symbol] = tile;
    return tile;
  }
};

Tile.empty = Tile.create('', {
    sprite_class : 'empty-tile'
});
Tile.no_floor = Tile.create(' ', {
    sprite_class : 'empty-tile',
    solid        : true,
    is_floor     : true
});
Tile.floor = Tile.create('.', {
    sprite_class : 'floor-tile',
    is_floor     : true
});
Tile.bad_floor = Tile.create(',', {
    sprite_class : 'floor-tile',
    is_floor     : true
});
Tile.future_hint = Tile.create('2', {
    sprite_class : 'floor-tile',
    is_floor     : true
});
Tile.wall = Tile.create('#', {
    sprite_class : 'wall-tile',
    solid        : true
});
Tile.invisible_wall = Tile.create(';', {
    sprite_class : 'floor-tile',
    solid        : true,
    is_floor     : true
});

Tile.player = Tile.create('c', {
    sprite_class : 'player-sprite',
    player       : true,
    solid        : true,
    character    : true,
    holder       : true,
    moveable     : true
});
Tile.player_with_fork = Tile.create('C', {
    sprite_class : 'player-sprite',
    player       : true,
    solid        : true,
    forked       : 'forked',
    character    : true,
    holder       : true,
    moveable     : true
});
Tile.player_with_spork = Tile.create('S', {
    sprite_class : 'player-sprite',
    player       : true,
    solid        : true,
    forked       : 'sporked',
    character    : true,
    holder       : true,
    moveable     : true
});
Tile.lover = Tile.create('l', {
    sprite_class : 'lover-sprite',
    lover        : true,
    solid        : true,
    character    : true,
    holder       : true,
    moveable     : true
});
Tile.lover_with_fork = Tile.create('L', {
    sprite_class : 'lover-sprite',
    lover        : true,
    solid        : true,
    forked       : 'forked',
    character    : true,
    holder       : true,
    moveable     : true
});

Tile.closed_door = Tile.create('D', {
    sprite_class : 'closed-door-tile',
    solid        : true
});
Tile.open_door   = Tile.create('d', {
    sprite_class : 'open-door-tile'
});

Tile.red_button    = Tile.create('R', {
    sprite_class : 'red-button-tile',
    color        : 'red',
    is_floor     : true,
    button       : true
});
Tile.green_button  = Tile.create('G', {
    sprite_class : 'green-button-tile',
    color        : 'green',
    is_floor     : true,
    button       : true
});
Tile.blue_button   = Tile.create('B', {
    sprite_class : 'blue-button-tile',
    color        : 'blue',
    is_floor     : true,
    button       : true
});
Tile.orange_button = Tile.create('O', {
    sprite_class : 'orange-button-tile',
    color        : 'orange',
    is_floor     : true,
    button       : true
});

Tile.block        = Tile.create('w', {
    sprite_class : 'wooden-block-sprite',
    solid        : true,
    moveable     : true
});
Tile.block_with_hint = Tile.create('W', {
    sprite_class : 'hint-block-sprite',
    solid        : true,
    moveable     : true
});
Tile.hint         = Tile.create('?', {
    sprite_class : 'forked-block-hint-sprite',
    is_hint      : true,
    hint         : true
});
Tile.hint_spot    = Tile.create('', {
    sprite_class : 'hint-spot-sprite',
    is_hint      : true
});
Tile.block_with_spork = Tile.create('s', {
    sprite_class : 'green-block-sprite',
    solid        : true,
    forked       : 'sporked',
    moveable     : true
});

Tile.red_block    = Tile.create('r', {
    sprite_class : 'red-block-sprite',
    color        : 'red',
    solid        : true,
    moveable     : true
});
Tile.green_block  = Tile.create('g', {
    sprite_class : 'green-block-sprite',
    color        : 'green',
    solid        : true,
    moveable     : true
});
Tile.blue_block   = Tile.create('b', {
    sprite_class : 'blue-block-sprite',
    color        : 'blue',
    solid        : true,
    moveable     : true
});
Tile.orange_block = Tile.create('o', {
    sprite_class : 'orange-block-sprite',
    color        : 'orange',
    solid        : true,
    moveable     : true
});

Tile.blood = Tile.create('', {
    sprite_class : 'blood-on-floor',
    is_floor     : true
});
Tile.fork = Tile.create('f', {
    sprite_class : 'fork-on-floor',
    is_floor     : true
});
Tile.dropped_fork = Tile.create('', {
    sprite_class : 'dropped-fork',
    is_floor     : true
});
Tile.forktopus = Tile.create('', {
    sprite_class : 'forktopus',
    forktopus    : true,
    solid        : true,
    character    : true,
    moveable     : true
});
Tile.forktopus_with_spork = Tile.create('F', {
    sprite_class : 'forktopus',
    forktopus    : true,
    solid        : true,
    forked       : 'sporked',
    character    : true,
    holder       : true,
    moveable     : true
});

Tile.block_shadow = Tile.create('', {
    sprite_class : 'block-shadow'
});
Tile.gem_shadow = Tile.create('', {
    sprite_class : 'gem-shadow'
});
Tile.player_shadow = Tile.create('', {
    sprite_class : 'player-shadow'
});
Tile.lover_shadow = Tile.create('', {
    sprite_class : 'lover-shadow'
});
Tile.forktopus_shadow = Tile.create('', {
    sprite_class : 'forktopus-shadow'
});
