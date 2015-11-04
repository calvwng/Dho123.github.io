// instantiates one Thing per room,
// where Thing can be any object which can be obtained from a room
// and has a process_events(room) method to handle its room's events.

var Multi = {
  create: function(room, factory) {
    var current_thing = factory(room);
    
    var things = new Array(1);
    things[0] = current_thing;
    
    return {
      current: function() {
        return current_thing;
      },
      at: function(index) {
        return things[index];
      },
      
      count: function() {
        return things.length;
      },
      each: function(body) {
        for(var i=0; i<things.length; ++i) {
          body(i, things[i]);
        }
      },
      
      process_events: function(events) {
        // let each thing process the events of its room
        events.each_room(function(index, room) {
          var thing = things[index];
          
          thing.process_events(room);
        });
      }
    };
  }
};
