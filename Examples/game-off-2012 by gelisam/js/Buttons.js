// handles the logic of all buttons in a room.
// 
// basically, the door should open if and only if
// all switches are activated.

var Buttons = {
  create: function(room) {
    // find the door and the buttons
    var door = null;
    var button_count = 0;
    var buttons = Table.create(room.size, function(pos) {
      var tile = room.floor_tile_at(pos);
      
      if (tile == Tile.closed_door) {
        door = pos;
      }
      
      if (tile.button) {
        ++button_count;
        return Button.create(tile.color);
      } else {
        return null;
      }
    });
    
    var active_buttons = 0;
    
    return {
      solved: function() {
        return (button_count > 0 && active_buttons == button_count);
      },
      process_events: function(room) {
        // remember how things were
        var old_active = this.solved();
        
        room.moves.each(function(move) {
          var old_button = buttons.at(move.old_pos);
          var new_button = buttons.at(move.new_pos);
          
          if (old_button && old_button.remove_weight(move.moveable)) {
            --active_buttons;
          }
          if (new_button && new_button.add_weight(move.moveable)) {
            ++active_buttons;
          }
        });
        
        // have things changed?
        var new_active = this.solved();
        if (new_active != old_active) {
          if (new_active) {
            // open the door
            if (door) room.change_tile(door, Tile.open_door);
          } else {
            // close the door
            if (door) room.change_tile(door, Tile.closed_door);
          }
        }
      }
    };
  },
};
