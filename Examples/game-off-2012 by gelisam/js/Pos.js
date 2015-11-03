// an (x, y) coordinate.

var Pos = {
  create: function(x, y) {
    return {
      x: x,
      y: y,
      plus: function(dx, dy) {
        return Pos.create(this.x + dx, this.y + dy);
      },
      dir_name: function() {
        if (this.x < 0) {
          return "left";
        } else if (this.x > 0) {
          return "right";
        } else if (this.y < 0) {
          return "up";
        } else {
          return "down";
        }
      }
    };
  },
  distance_between: function (a, b) {
    var delta_x = b.x - a.x;
    var delta_y = b.y - a.y;
    return Pos.create(delta_x, delta_y);
  },
  each: function(w, h, body) {
    for(var y=0; y<h; ++y) {
      for(var x=0; x<w; ++x) {
        body(Pos.create(x, y));
      }
    }
  },
  each_dir: function(body) {
    body(Pos.create( 1,  0));
    body(Pos.create(-1,  0));
    body(Pos.create( 0,  1));
    body(Pos.create( 0, -1));
  }
};
