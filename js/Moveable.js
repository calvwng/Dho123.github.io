// a game object which can move,
// such as blocks and the player.

var Moveable = {
  create: function(tile) {
    return {
      tile: tile,
      floor: Tile.floor,
      pos: null,
      id: null,
      
      forked: null,
      dir: null,
      
      copy: function() {
        var other = Moveable.create(this.tile);
        
        other.floor = this.floor;
        other.pos = this.pos;
        other.id = this.id;
        
        other.forked = this.forked;
        other.dir = this.dir;
        
        return other;
      }
    };
  }
};
