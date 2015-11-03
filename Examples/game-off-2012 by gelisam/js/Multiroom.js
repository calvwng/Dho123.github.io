// a set of parallel Rooms.
// the current room can be changed, and you can listen for those changes.

var Multiroom = {
  max_rooms: 1,

  create: function (room) {
    var rooms = new Array(1);
    rooms[0] = room;

    var room_changes = EventQueue.create();
    var forks = EventQueue.create();
    var merges = EventQueue.create();

    return {
      room_at: function (index) {
        return rooms[index];
      },
      each_room: function (body) {
        for(var i=0; i<rooms.length; ++i) {
          body(i, rooms[i]);
        }
      },

      current_index: 0,
      current_room: function () {
        return this.room_at(this.current_index);
      },

      room_changes: room_changes,
      change_index: function (index) {
        var old_index = this.current_index;
        var new_index = index % rooms.length;
        
        var old_room = rooms[old_index];
        var new_room = rooms[new_index];
        
        this.current_index = new_index;

        // remember the change
        room_changes.add({
          old_index: old_index,
          new_index: new_index,
          old_room: old_room,
          new_room: new_room
        });
        
        return new_room;
      },
      next_room: function () {
        return this.change_index(this.current_index + 1);
      },
      
      forks: forks,
      fork: function (block, forked) {
        // remember the event
        forks.add({
          old_index: 0,
          new_index: 0,
          old_room: this.current_room(),
          new_room: this.current_room(),
          old_block: block,
          new_block: block
        });
      },
      
      merges: merges,
      merge: function (block) {
        // remember the event
        merges.add({
          old_index: 0,
          new_index: 0,
          old_room: this.current_room(),
          new_room: this.current_room()
        });
      },
      
      clear_events: function() {
        room_changes.clear();
        forks.clear();
        merges.clear();
        
        this.each_room(function(index, room) {
          room.clear_events();
        });
      }
    };
  }
};
