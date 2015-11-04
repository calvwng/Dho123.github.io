// handles the logic of all hint shadows.
// 
// basically, shadows should appear at the position where
// moveables will revert when the fork is picked back.

var Shadows = {
  create: function(room) {
    var fork_in_block = false;
    var already_displayed = {};
    
    return {
      process_events: function(multiroom, scene) {
        multiroom.forks.each(function (fork) {
          fork_in_block = true;
          already_displayed = {};
        });

        multiroom.merges.each(function (merge) {
          fork_in_block = false;
          already_displayed = {};
        });
        
        if (fork_in_block) {
          multiroom.each_room(function (index, room) {
            room.moves.each(function(move) {
              if (move.insert) {
                // don't add a shadow to the objects which appeared
                // during the fork's scope
                already_displayed[move.moveable.id] = true;
              } else if (move.old_pos.x != move.new_pos.x ||
                         move.old_pos.y != move.new_pos.y) {
                if (!move.moveable.forked && !already_displayed[move.moveable.id]) {
                  already_displayed[move.moveable.id] = true;
                  
                  scene.add_hint(move.old_pos, Shadows.shadow_tile_for(move.moveable.tile));
                }
              }
            });
          });
        }
      }
    };
  },
  shadow_tile_for: function(tile) {
    if (tile.player) {
      return Tile.player_shadow;
    } else if (tile.lover) {
      return Tile.lover_shadow;
    } else if (tile.color) {
      return Tile.gem_shadow;
    } else if (tile.forktopus) {
      return Tile.forktopus_shadow;
    } else {
      return Tile.block_shadow;
    }
  }
};
