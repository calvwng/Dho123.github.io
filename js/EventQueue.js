// a list of events.
// let's try passing events around by storing them into queues
// instead of registering callbacks. I hear this makes the code easier
// to follow.

var EventQueue = {
  create: function() {
    var events = new Array();
    return {
      empty: function() {
        return (events.length == 0);
      },
      add: function(e) {
        events.push(e);
      },
      each: function(body) {
        for(var i=0; i<events.length; ++i) {
          body(events[i]);
        }
      },
      reverse_each: function(body) {
        for(var i=events.length; i-->0;) {
          body(events[i]);
        }
      },
      clear: function() {
        events = new Array();
      }
    };
  }
};
