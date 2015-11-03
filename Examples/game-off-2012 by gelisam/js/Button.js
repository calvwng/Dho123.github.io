// handles the logic of a single button.
// 
// basically, buttons are activated when you walk over them or
// when you push a block over them.
// 
// there are also some special colored buttons which can only
// be activated by a block of the same color.

var Button = {
  create: function(color) {
    var weight = 0;
    
    var regular = true;
    if (color) regular = false;
    
    return {
      active: function() {
        return (weight >= 0);
      },
      
      add_weight: function(moveable) {
        if (regular || moveable.tile.color == color) {
          ++weight;
          return true;
        }
        
        return false;
      },
      remove_weight: function(moveable) {
        if (regular || moveable.tile.color == color) {
          --weight;
          return true;
        }
        
        return false;
      }
    };
  }
};
