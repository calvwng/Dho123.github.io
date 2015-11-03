// a 2D array.

var Table = {
  create: function(w, h, body) {
    if (arguments.length == 2) {
      var size = w;
      body = h;
      
      w = size.w;
      h = size.h;
    }
    
    var data = new Array(h);
    for(var y=0; y<h; ++y) {
      data[y] = new Array(w);
      for(var x=0; x<w; ++x) {
        data[y][x] = body(Pos.create(x, y));
      }
    }
    
    return {
      at: function(pos, body) {
        if (arguments.length == 2 && !this.contains(pos)) {
          // default value
          return body();
        }
        return data[pos.y][pos.x];
      },
      change_at: function(pos, value) {
        data[pos.y][pos.x] = value;
      },
      
      size: {w: w, h: h},
      w: w,
      h: h,
      
      contains: function(pos) {
        return (pos.x >= 0 && pos.y >= 0 && pos.x < w && pos.y < h);
      },
      
      each: function(body) {
        var self = this;
        Pos.each(self.w, self.h, function(pos) {
          body(pos, self.at(pos));
        });
      },
      map: function(body) {
        var self = this;
        return Table.create(self.w, self.h, function(pos) {
          return body(pos, self.at(pos));
        });
      },
      copy: function() {
        return this.map(function(pos, value) {
          return value;
        });
      }
    };
  },
};
