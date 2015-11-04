// a stack of Layers.
// it watches a room change, and updates the sprites to match.

var Scene = {
  queue: ActionQueue.create(),
  create: function(container, room) {
    var element = $('<div class="scene"/>');
    
    // start invisible
    element.transition({opacity: 0}, 0);
    
    // add the floor
    var floor_tiles = this.create_floor(room);
    var floor_layer = Layer.create(element, floor_tiles, room);
    
    // add the actual obstacles
    var solid_tiles = this.extract_tiles(room);
    var solid_layer = Layer.create(element, solid_tiles, room);
    
    // honor each moveable's special visual features
    solid_tiles.each(function(pos, tile) {
      var moveable = room.moveable_at(pos);
      
      if (moveable) {
        var solid_sprite = solid_layer.sprite_at(pos);
        
        solid_sprite.change_moveable(moveable);
      }
    });
    
    // add the hint layer
    var hint_tiles = this.create_hints(room);
    var hint_layer = Layer.create(element, hint_tiles, room, 'hint-layer');
    
    // add color filters on the very top, to tint the entire scene
    var dark_filter = this.create_filter(element, 'dark');
    var light_filter = this.create_filter(element, 'light');
	
    container.prepend(element);
    
    var queue = ActionQueue.create();
    var hints = EventQueue.create();
    return {
      queue: queue,
      
      hide: function() {
        queue.enqueue_async(function(resume) {
          element.transition({opacity: 0}, resume);
        });
      },
      show: function(now) {
        queue.enqueue_async(function(resume) {
          element.transition({opacity: 1}, 'slow', resume);
        });
      },
      
      darken: function() {
        Scene.queue.enqueue_async(function(resume) {
          dark_filter.transition({opacity: 0.1}, 'slow', resume);
        });
      },
      undarken: function() {
        Scene.queue.enqueue_async(function(resume) {
          dark_filter.transition({opacity: 0}, 'slow', resume);
        });
      },
      lighten: function() {
        Scene.queue.enqueue_async(function(resume) {
          light_filter.transition({opacity: 0.5}, 0, function() {
            light_filter.transition({opacity: 0}, 'slow', resume);
          });
        });
      },

      move_center: function () {
        queue.enqueue_async(function(resume) {
          element.transition({ scale: 1, opacity: 1, x: 0 }, resume);
        });
      },
      move_to: function(x) {
        queue.enqueue_async(function(resume) {
          // move, scale down, and make sure it's visible
          element.transition({scale: 0.5, opacity: 1, x: x}, resume);
        });
      },
      move_left: function() {
        this.move_to(-410);
      },
      move_right: function() {
        this.move_to(410);
      },
      
      add_hint_spot: function(pos) {
        hint_layer.sprite_at(pos).set_spotted(true);
        
        hints.add(pos);
      },
      add_hint: function(pos, hint) {
        hint_layer.sprite_at(pos).change_tile(hint);
        
        hints.add(pos);
      },
      clear_hints: function() {
        hints.each(function(pos) {
          var hint_sprite = hint_layer.sprite_at(pos);
          hint_sprite.change_tile(Tile.empty);
          hint_sprite.set_spotted(false);
        });
        
        hints.clear();
      },
      process_events: function(room) {
        room.tile_changes.each(function(tile_change) {
          var pos = tile_change.pos;
          var tile = tile_change.new_tile;
          var solid_sprite = solid_layer.sprite_at(pos);
          var floor_sprite = floor_layer.sprite_at(pos);
          var hint_sprite = hint_layer.sprite_at(pos);
          var moveable = room.moveable_at(pos);
          
          if (moveable) {
            solid_sprite.change_moveable(moveable);
            if (moveable.floor.is_floor) {
              floor_sprite.change_tile(moveable.floor);
            }
          } else if (tile.is_floor) {
            solid_sprite.change_tile(Tile.empty);
            floor_sprite.change_tile(tile);
          } else if (tile.is_hint) {
            solid_sprite.change_tile(Tile.empty);
            hint_sprite.change_tile(tile);
          } else {
            solid_sprite.change_tile(tile);
            floor_sprite.change_tile(Tile.floor);
          }
        });
      },
      
      remove: function() {
        var self = this;
        
        queue.enqueue(function() {
          self.hide();
        }).then(function() {
          element.remove();
        });
      }
    };
  },
  
  create_floor: function(room) {
    // we make a special case when the last row is all walls,
    // because the row of ground tiles look out of place in that case.
    var all_walls = true;
    {
      var y = room.h - 1;
      for(var x=0; x<room.w; ++x) {
        var pos = Pos.create(x, y);
        var tile = room.tile_at(pos);
        
        if (tile !== Tile.wall) {
          all_walls = false;
          break;
        }
      }
    }
    
    return Table.create(room.size, function(pos) {
      var tile = room.floor_tile_at(pos);
      
      if (all_walls && pos.y == y) {
        return Tile.empty;
      } else if (tile.is_floor) {
        return tile;
      } else {
        return Tile.floor;
      }
    });
  },
  create_hints: function(room) {
    return Table.create(room.size, function(pos) {
      var tile = room.floor_tile_at(pos);
      
      if (tile.is_hint) {
        return tile;
      } else {
        return Tile.empty;
      }
    });
  },
  extract_tiles: function(room) {
    return Table.create(room.size, function(pos) {
      var tile = room.tile_at(pos)
      
      if (tile.is_floor || tile.is_hint) {
        return Tile.empty;
      } else {
        return tile;
      }
    });
  },
  
  create_filter: function(container, class_name) {
    var filter = $('<div class="'+class_name+' filter"/>');
    
    // start invisible
    filter.transition({opacity: 0}, 0);
    container.append(filter);
    
    return filter;
  }
};
