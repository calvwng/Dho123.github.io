// a wrapper around the DOM element representing a particular tile.

var Sprite = {
  create_player: function(container) {
    var element = $('<div class="sprite"/>').addClass(Tile.player.sprite_class);
        element.css('position', 'absolute');
        element.css('top', '0');
        element.css('left', '0');
    container.append(element);
    
    return {
      element: element,
      move_to: function(sprite) {
      
      }
    };
  },
  create: function(container, tile) {
    var element = $('<div class="sprite"/>').addClass(tile.sprite_class);
    var dir = null;
    var say = null;
    var forked = null;
    var leaving = false;
    var shaking = false;
    var pushing = false;
    var dying = false;
    var holder = false;
    
    container.append(element);
    
    return {
      element: element,
      change_tile: function(new_tile) {
        element.removeClass(tile.sprite_class);
        if (say) {
          element.removeClass("say").removeClass(say);
          say = null;
        }
        if (forked) {
          element.removeClass(forked);
          forked = null;
        }
        if (leaving) {
          element.removeClass("under-door");
          leaving = false;
        }
        if (shaking) {
          element.removeClass("shake");
          shaking = false;
        }
        if (pushing) {
          element.removeClass("pushing");
          pushing = false;
        }
        if (holder) {
          element.removeClass("holder");
          holder = false;
        }
        
        tile = new_tile;
        
        element.addClass(tile.sprite_class)
      },
      set_spotted: function(spotted) {
        if (spotted) {
          element.addClass("spotted");
        } else {
          element.removeClass("spotted");
        }
      },
      change_moveable: function(new_moveable) {
        if (dir) {
          element.removeClass(dir.dir_name());
        }
        
        this.change_tile(new_moveable.tile);
        
        if (new_moveable.dir) {
          dir = new_moveable.dir;
          element.addClass(dir.dir_name());
        }
        if (new_moveable.say) {
          say = new_moveable.say;
          element.addClass("say").addClass(say);
        }
        if (new_moveable.forked) {
          forked = new_moveable.forked;
          element.addClass(forked);
        }
        if (new_moveable.floor == Tile.open_door) {
          leaving = true;
          element.addClass("under-door");
        }
        if (new_moveable.shaking) {
          shaking = true;
          element.addClass("shake");
        }
        if (new_moveable.pushing) {
          pushing = true;
          element.addClass("pushing");
        }
        if (new_moveable.dying) {
          dying = new_moveable.dying;
          if (dying == 'dying') {
            element.transition({opacity: 0}, 4000);
          } else {
            element.transition({opacity: 1}, 0);
          }
        }
        if (new_moveable.tile.holder && new_moveable.tile !== Tile.forktopus_with_spork) {
          holder = true;
          element.addClass("holder");
        }
      }
    };
  }
};
