// handles all the buttons in all copies of the room.

var Multibuttons = {
  create: function(room) {
    return Multi.create(room, Buttons.create);
  }
};
