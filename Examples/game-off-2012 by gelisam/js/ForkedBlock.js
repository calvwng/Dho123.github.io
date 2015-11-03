var ForkedBlock = {
  create: function (room) {
    var new_block = null;
    var old_block = null;
    var observed_moves = EventQueue.create();
    var moves_to_replay = EventQueue.create();
    var moves_to_undo = EventQueue.create();

    return {
      moves_to_replay: moves_to_replay,
      moves_to_undo: moves_to_undo,
      process_events: function (events) {
        events.forks.each(function (fork) {
          old_block = fork.old_block;
          new_block = fork.new_block;
        });

        events.merges.each(function (merge) {
          var room = merge.new_room;
          
          observed_moves.each(function(move) {
            if (move.moveable === new_block) {
              moves_to_replay.add(move);
            }
            
            moves_to_undo.add(move);
          });
          
          old_block.forked = null;
          
          observed_moves.clear();
          old_block = new_block = null;
        });

        if (new_block) {
          events.each_room(function (index, room) {
            room.tile_changes.each(function(tile_change) {
              observed_moves.add(tile_change);
            });
            room.moves.each(function (move) {
              if (move.new_pos !== move.old_pos || move.dir || move.start_shaking) {
                observed_moves.add(move);
              }
            });
          });
        }
      }
    };
  }
};
