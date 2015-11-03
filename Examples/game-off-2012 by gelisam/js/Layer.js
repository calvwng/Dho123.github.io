// a grid of Sprites.
// there is a Layer of Tile.floor sprites below the room,
// on top of which is another Layer containing the actual obstacles.

var Layer = {
  create: function(container, tiles, room, extra_class) {
    var element = $('<div class="layer"/>');
    if (extra_class) element.addClass(extra_class);
    container.append(element);
    
    var spriteIndex = 0;
    var lines = new Array();
    for (var i = 1; i <= room.h; i++)
    {
      var line = $("<div class='layer-line'></div>");
      line.css('width', (room.w * 101) + 'px');
      element.append(line);
      lines.push(line);
    }
    
    var sprites = tiles.map(function(pos, tile) {
      return Sprite.create(lines[pos.y], tile);
    });
    
    return {
      sprite_at: function(pos) {
        return sprites.at(pos);
      }
    };
  }
};
