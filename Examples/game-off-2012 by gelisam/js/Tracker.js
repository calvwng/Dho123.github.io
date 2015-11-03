// tracks moveables across the grid
// 
// use the tracker's methods to add and move your moveables,
// and you'll always know where they are.
// each moveable can be identified both by its position and by its id.

var Tracker = {
  from_id_table: function(id_table, moveables, next_id) {
    return {
      at: function(pos) {
        var id = id_table.at(pos, function() {
          return 0;
        });
        
        return this.from_id(id);
      },
      from_id: function(id) {
        return moveables[id];
      },
      
      // assigns a new pos and id to the entry,
      // removing any conflicting entry
      insert: function(pos, moveable) {
        var id = next_id;
        ++next_id;
        
        moveable.pos = pos;
        moveable.id = id;
        
        moveables[id] = moveable;
        id_table.change_at(pos, id);
        
        return id;
      },
      remove: function(moveable) {
        id_table.change_at(moveable.pos, 0);
      },
      
      // to move an entry, swap it with a null entry.
      // there is no method to explicitly change the position
      // of an existing entry, as that is prone to conflict:
      // what if there is already an entry at the new position?
      swap: function(pos1, pos2) {
        var id1 = id_table.at(pos1);
        var id2 = id_table.at(pos2);
        
        if (id1) moveables[id1].pos = pos2;
        if (id2) moveables[id2].pos = pos1;
        
        id_table.change_at(pos1, id2);
        id_table.change_at(pos2, id1);
      },
      
      each: function(body) {
        for(var i=0; i<next_id; ++i) {
          var moveable = moveables[i];
          
          if (moveable) {
            body(moveable);
          }
        }
      },
      
      // you can change the moveables,
      // but not their position nor id.
      map: function(body) {
        var new_moveables = {};
        var new_id_table = id_table.map(function(pos, id) {
          if (id) {
            var old_moveable = moveables[id];
            var new_moveable = body(old_moveable);
            if (new_moveable) {
              new_moveable.pos = pos;
              new_moveable.id = id;
              
              new_moveables[id] = new_moveable;
              
              return id;
            }
          }
          
          return 0;
        });
        
        return Tracker.from_id_table(new_id_table, new_moveables, next_id);
      },
      copy: function() {
        return this.map(function(moveable) {
          return moveable.copy();
        });
      }
    };
  },
  
  // the tables's moveables should either
  // all have their pos and id already set,
  // or none of them shall have either.
  from_moveable_table: function(table) {
    var max_id = 0;
    var moveables = {};
    var id_table = table.map(function(pos, moveable) {
      if (moveable) {
        moveable.pos = pos;
        
        var id = max_id + 1;
        if (moveable.id) {
          id = moveable.id;
        } else {
          moveable.id = id;
        }
        if (id > max_id) {
          max_id = id;
        }
        
        moveables[id] = moveable;
        
        return id;
      } else {
        // zero is an invalid id,
        // representing an empty cell
        // containing no moveables.
        return 0;
      }
    });
    
    return this.from_id_table(id_table, moveables, max_id + 1);
  }
};
