$(function () {
  var toplevel_container = $('#content');
  var debug = false;

  var level = 0;
  var multiroom = null;
  var multibuttons = null;
  var shadows = null;
  var forkedBlock = null;
  var theatre = Theatre.empty();
  var completed_animations = {};
  var fork_in_block = false;
  var has_forked = false;
  var forked_block = null;
  var display_events = false;
  var unlocked_puzzles = 0;
  if (window.localStorage && window.localStorage['unlocked_puzzles']) {
    unlocked_puzzles = parseInt(window.localStorage['unlocked_puzzles']);
  }


  var foreground_animations = ActionQueue.create();
  var std_delay = 600;

  function room() {
    return multiroom.current_room();
  }
  function player() {
    return room().player;
  }
  function lover() {
    return room().lover;
  }

  function is_movement_allowed() {
    // don't allow the player to move if an animation is under way
    return foreground_animations.is_empty();
  }


  var animation = {
    'left': function() {
      move_lover(-1, 0);
    },
    'right': function() {
      move_lover(1, 0);
    },
    'up': function() {
      move_lover(0, -1);
    },
    'down': function() {
      move_lover(0, 1);
    },

    'player_left': function() {
      move_player(-1, 0);
    },
    'player_right': function() {
      move_player(1, 0);
    },
    'player_up': function() {
      move_player(0, -1);
    },
    'player_down': function() {
      move_player(0, 1);
    },
    'player_?': function() {
      player_says('question');
    },

    'hidden': function() {
      display_events = false;
    },
    'unhidden': function() {
      display_events = true;
    },
    'update_forked_block': function() {
      update_moveable(forked_block);
    },

    'octo_left': function() {
      room().move_forktopus(-1, 0);
      process_events();
    },
    'octo_right': function() {
      room().move_forktopus(1, 0);
      process_events();
    },
    'octo_up': function() {
      room().move_forktopus(0, -1);
      process_events();
    },
    'octo_down': function() {
      room().move_forktopus(0, 1);
      process_events();
    },
    'octo_escape': function() {
      var r = room();
      var f = r.forktopus;
      if (f.pos.x < 5) {
        room().move_forktopus(1, 0);
      } else if (f.pos.x > 5) {
        room().move_forktopus(-1, 0);
      } else {
        room().move_forktopus(0, 1);
      }
      process_events();
    },
    'octo_spork': function() {
      var f = room().forktopus;
      f.forked = 'sporked';
      use_fork(f);
    },
    'octo_face_left': function() {
      var f = room().forktopus;
      f.dir = Pos.create(-1, 0);
      update_moveable(f);
    },
    'octo_face_right': function() {
      var f = room().forktopus;
      f.dir = Pos.create(1, 0);
      update_moveable(f);
    },
    'octo_appear': function() {
      var forktopus = Moveable.create(Tile.forktopus);
      forktopus.dir = Pos.create(0, 1);
      room().insert_moveable(Pos.create(3, 1), forktopus);
      process_events();
    },
    'octo_disappear': function() {
      var r = room();
      r.remove_moveable(r.forktopus);
      process_events();
    },
    'lover_disappear': function() {
      room().remove_moveable(lover());
      process_events();
    },
    'S_appear': function() {
      var p = Moveable.create(Tile.player_with_spork);
      p.dir = Pos.create(1, 0);
      p.forked = 'sporked';
      room().insert_moveable(Pos.create(0, 3), p);
      update_moveable(p);
    },
    'c_appear': function() {
      var p = Moveable.create(Tile.player);
      p.dir = Pos.create(1, 0);
      p.dying = 'not_dead';
      room().insert_moveable(Pos.create(0, 3), p);
      update_moveable(p);
    },

    'face_left': function() {
      change_character_dir(-1, 0);
    },
    'face_right': function() {
      change_character_dir(1, 0);
    },
    'face_up': function() {
      change_character_dir(0, -1);
    },
    'face_down': function() {
      change_character_dir(0, 1);
    },

    'player_face_left': function() {
      change_player_dir(-1, 0);
    },
    'player_face_right': function() {
      change_player_dir(1, 0);
    },
    'player_face_up': function() {
      change_player_dir(0, -1);
    },
    'player_face_down': function() {
      change_player_dir(0, 1);
    },
    'player_flip': function() {
      var dir = player().dir;
      change_player_dir(-dir.x, -dir.y);
    },

    'leave': function() {
      if (player() && player().floor === Tile.open_door) {
        room().remove_moveable(player());
      } else if (lover().floor === Tile.open_door) {
        room().remove_moveable(lover());
      }

      process_events();
    },
    'open': function() {
      var r = room();
      r.each_door(function(pos, tile) {
        r.change_tile(pos, Tile.open_door);
      });

      process_events();
    },
    'close': function() {
      var r = room();
      r.each_door(function(pos, tile) {
        r.change_tile(pos, Tile.closed_door);
      });

      process_events();
    },
    'hint': function() {
      var r = room();
      r.each_tile(function(pos, tile) {
        if (tile === Tile.future_hint) {
          r.change_tile(pos, Tile.hint);
          process_events();
        }
      });
    },

    'player_<3': function() {
      player_says('heart');
    },
    'ask-door': function() {
      player_says('door-exclam');
    },
    'ask-fork': function() {
      player_says('fork-question');
    },
    'give': function() {
      var r = room();
      var p = player();
      var l = lover();

      var forked1 = p.forked;
      var forked2 = l.forked;
      p.forked = forked2;
      l.forked = forked1;

      r.update_moveable(p);
      r.update_moveable(l);

      process_events();
    },

    'kiss': function() {
      kiss(lover(), player());
    },
    '<3': function() {
      lover_says('heart');
    },
    'Z': function() {
      lover_says('press-z');
    },
    'reminder': function() {
      if (!has_forked) {
        window.setTimeout(function() {
          if (!has_forked) {
            lover_says('press-z');
          }
        }, 1000);
      }
    },
    'door?': function() {
      lover_says('door-question');
    },
    'door!': function() {
      lover_says('door-exclam');
    },
    '?': function() {
      lover_says('question');
    },
    '!': function() {
      moveable_says(room().lover || room().forktopus, 'exclam');
    },
    'R?': function() {
      lover_says('r-question');
    },
    'fork?': function() {
      lover_says('fork-question');
    },
    'fork!': function() {
      lover_says('fork-exclam');
    },
    'spork?': function() {
      lover_says('spork-question');
    },
    'spork!': function() {
      moveable_says(room().forktopus, 'spork-exclam');
    },

    'fork': function() {
      use_fork(lover() || player());
    },

    'skip': function() {
      next_level();
    },
    'level_up': function() {
      ++level;
    },
    'check_trap': function() {
      var y = room().forktopus.pos.y;
      if (y == 9) {
        if (unlocked_puzzles) {
          level = World.index_of_bad_ending();
        } else {
          level = World.index_of_long_ending();
        }
      } else if (y < 4) {
        animate('trapped', World.load_on_trapped(level));
        level = World.index_of_best_ending();
      } else {
        level = World.index_of_good_ending();
      }

      // so that skip goes to the correct level
      --level;
    },

    'pick': function() {
      var p = player();

      p.dir = Pos.create(0, 1);
      p.forked = 'forked';
      p.floor = Tile.blood;

      update_moveable(p);
    },
    'drop': function() {
      var p = player();
      var dir = p.dir;
      var pos = player().pos.plus(dir.x, dir.y);

      room().change_tile(pos, Tile.dropped_fork);
      p.forked = null;
      update_moveable(p);
    },
    'stab': function() {
      var r = room();
      var p = r.lover;
      var f = r.forktopus;

      var forked1 = p.forked;
      var forked2 = f.forked;
      p.forked = forked2;
      f.forked = forked1;

      r.update_moveable(p);
      r.update_moveable(f);

      f.floor = Tile.blood;
      process_events();
    },
    'octo_dies': function() {
      var f = room().forktopus;
      for(var i=0; i<5; ++i) {
        foreground_animations.enqueue(function() {
          f.tile = Tile.empty;
          update_moveable(f);
        }).then_wait_for(100).enqueue(function() {
          f.tile = Tile.forktopus;
          update_moveable(f);
        }).then_wait_for(100);
      }
      foreground_animations.enqueue(function() {
        f.dying = 'dying';
        update_moveable(f);
      }).then_wait_for(3000).enqueue(function() {
        f.floor = Tile.fork;
        update_moveable(f);
      }).then_wait_for(1000).enqueue(function() {
        room().remove_moveable(f);
      });
    },
    'lover_dies': function() {
      var l = lover();
      for(var i=0; i<5; ++i) {
        foreground_animations.enqueue(function() {
          l.tile = Tile.empty;
          l.forked = false;
          update_moveable(l);
        }).then_wait_for(100).enqueue(function() {
          l.tile = Tile.lover;
          l.forked = true;
          update_moveable(l);
        }).then_wait_for(100);
      }
      foreground_animations.enqueue(function() {
        l.dying = 'dying';
        update_moveable(l);
      }).then_wait_for(3000).enqueue(function() {
        l.floor = Tile.fork;
        update_moveable(l);
      }).then_wait_for(1000).enqueue(function() {
        room().remove_moveable(l);
      });
    },
    'saved': function() {
      var p = player();
      p.say = 'heart';
      update_moveable(p);
    },
    'saved_end': function() {
      var p = player();
      p.say = null;
      update_moveable(p);
    },
    'both_right': function() {
      move_lover(1, 0);
      move_player(1, 0);
      process_events();
    },
    'credits': function() {
      roll_credit();
    },
    'show': function() {
      show_room();
    },
    'the_end': function() {
      hide_room();
      show_thanks();
    },
    'unlock1': function() {
      if (unlocked_puzzles < 1) {
        unlocked_puzzles = 1;
	if (window.localStorage)
	{
		window.localStorage['unlocked_puzzles'] = unlocked_puzzles;
	}
      }
      show_congratulations("You have unlocked a bonus level. To unlock more, try to slow down the monster somehow.");
    },
    'unlock2': function() {
      if (unlocked_puzzles < 2) {
        unlocked_puzzles = 2;
	if (window.localStorage)
	{
		window.localStorage['unlocked_puzzles'] = unlocked_puzzles;
	}
      }
      show_congratulations("You have unlocked another bonus level. For the last ending, do you think you could trap the monster somehow?");
    },
    'unlock3': function() {
      if (unlocked_puzzles < 3) {
        unlocked_puzzles = 3;
	if (window.localStorage)
	{
		window.localStorage['unlocked_puzzles'] = unlocked_puzzles;
	}
      }
      show_congratulations("You have unlocked the last bonus level. Good luck!");
    },
    'unlock4': function() {
      if (unlocked_puzzles < 4) {
        unlocked_puzzles = 4;
	if (window.localStorage)
	{
		window.localStorage['unlocked_puzzles'] = unlocked_puzzles;
	}
      }
      show_congratulations("You really are a master of the spork.");
    },

    'dummy': null
  };

  function animate(animation_key, animation_plan) {
    if (animation_plan.length > 0 && !completed_animations[animation_key]) {
      completed_animations[animation_key] = true;

      for(var i=0; i<animation_plan.length; ++i) {
        var animation_key = animation_plan[i];

        if ($.isNumeric(animation_key)) {
          var delay = animation_key;
          foreground_animations.then_wait_for(delay);

          animation_key = animation_plan[++i];
        } else {
          foreground_animations.then_wait_for(std_delay);
        }

        var animation_func = animation[animation_key];
        foreground_animations.enqueue(animation_func);
      }

      return true;
    } else {
      return false;
    }
  };


  function process_events() {
    multibuttons.process_events(multiroom);
    shadows.process_events(multiroom, theatre.current_scene());
    forkedBlock.process_events(multiroom);
    if (display_events) theatre.process_events(multiroom);
    multiroom.clear_events();

    if (!forkedBlock.moves_to_undo.empty()) {
      foreground_animations.enqueue(function() {
        theatre.current_scene().darken();
      }).then_wait_for(Scene.queue)
        .then(function() {
        process_undo_moves(forkedBlock.moves_to_undo);
      }).then(function() {
        theatre.current_scene().undarken();
      }).then_wait_for(Scene.queue)
        .then(function() {
        process_replay_moves(forkedBlock.moves_to_replay);
      }).then_wait_for(std_delay)
        .then(function() {
        var s = theatre.current_scene();
        s.lighten();
        s.clear_hints();
      });
    }

    if (multibuttons.current().solved()) {
      animate('solved', World.load_on_solved(level));
    }
  }

  function process_undo_move(move) {
    if (move.moveable && move.moveable.tile.character) {
      foreground_animations.then_wait_for(0.1*std_delay);
    }

    foreground_animations.enqueue(function() {
      if (move.new_tile) {
        room().change_tile(move.pos, move.old_tile);
      } else if (move.insert) {
        room().remove_moveable(move.moveable);
      } else {
        var delta = Pos.distance_between(move.new_pos, move.old_pos);

        if (move.dir) {
          move.moveable.dir = move.dir;
        }
        move.moveable.shaking = false;

        room().move(move.moveable, delta.x, delta.y);
      }
      process_events();
    });
  }
  function process_undo_moves(moves) {
    moves.reverse_each(process_undo_move);
    moves.clear();
  }

  function process_replay_move(move) {
    if (move.new_pos !== move.old_pos) {
      foreground_animations.then_wait_for(std_delay);
    }

    foreground_animations.then(function() {
      var r = room();
      var delta = Pos.distance_between(move.old_pos, move.new_pos);

      if (r.moveable_at(move.moveable.pos.plus(delta.x, delta.y))) {
        push_moveable(move.moveable, delta.x, delta.y);
      }

      foreground_animations.enqueue(function() {
        r.move(move.moveable, delta.x, delta.y);
        process_events();
      });
    });
  }
  function process_replay_moves(moves) {
    moves.each(process_replay_move);
    moves.clear();
  }


  function load_level(index) {
    if (index == World.levels.length) {
      roll_credit();
      hide_room();
      show_thanks();
      return;
    }

    level = index;

    foreground_animations.enqueue(function() {
      theatre.remove();
    }).then_wait_for(Theatre.queue).then(function() {
      multiroom = World.load_multiroom(index);

      var r = room();
      multibuttons = Multibuttons.create(r);
      shadows = Shadows.create(r);
      forkedBlock = ForkedBlock.create(r);

      if (r.player) r.player.dir = Pos.create(0, 1);
      if (r.lover) r.lover.dir = Pos.create(0, 1);
      if (r.forktopus) r.forktopus.dir = Pos.create(0, 1);

      var name = World.load_name(index);
      theatre = Theatre.create(toplevel_container, r, name);

      completed_animations = {};
      fork_in_block = false;
      has_forked = false;
      forked_block = null;
      display_events = true;
      animate('start', World.load_on_start(index));
    });
  }

  function try_again() {
    if (!animate('reset', World.load_on_reset(level))) {
      var index = level;
      load_level(index);

      if (_gaq) {
        _gaq.push(['_trackEvent', 'Levels', 'Restart', 'Level ' + index]);
      }
    }
  }

  function next_level() {
    var index = level + 1;
	if (window.localStorage)
	{
		window.localStorage['currentLevel'] = index;
	}
    if (index < World.index_of_first_bonus() + unlocked_puzzles) {
      load_level(index);

      if (_gaq) {
        _gaq.push(['_trackEvent', 'Levels', 'Begin', 'Level ' + index]);
      }
    } else {
      load_splash();
    }
  }

  function roll_credit() {
    if (_gaq) {
      _gaq.push(['_trackEvent', 'Levels', 'Begins', 'Credits']);
    }

    // no more player movement
    keyHandler = function() {};

    foreground_animations.enqueue_async(function(resume) {
      toplevel_container.transition({'background-color': '#000'}, 1000, resume);
    }).then_async(function(resume) {
      toplevel_container.children().transition({opacity: 0.5}, 5000);

      var credits = $('#credits');
      credits.transition({y: 10}, 0);
      toplevel_container.append(credits);

      var delta = delta = credits.height() + toplevel_container.children().height() + 40;
      credits.transition({y: -delta}, delta*15, 'linear', resume);
    }).then(function() {
      var hidden = $('#hidden');
      $('#credits').appendTo(hidden);
    });
  }
  function show_room() {
    foreground_animations.enqueue_async(function(resume) {
      toplevel_container.children().transition({opacity: 1}, 2000, resume);
    });
  }
  function hide_room() {
    foreground_animations.enqueue_async(function(resume) {
      toplevel_container.children().transition({opacity: 0}, 2000, resume);
    });
  }
  function show_thanks() {
    foreground_animations.enqueue_async(function(resume) {
      var thanks = $('#thanks');
      thanks.transition({opacity: 0}, 0);
      toplevel_container.prepend(thanks);

      thanks.transition({opacity: 0.95}, resume);
    }).then(function() {
      keyHandler = hide_congratulations;
    });
  }
  function show_congratulations(message) {
    foreground_animations.enqueue_async(function(resume) {
      var congratulations = $('#congratulations');
      congratulations.children(".message").text(message);
      congratulations.transition({opacity: 0}, 0);
      $('#thanks').after(congratulations);

      congratulations.transition({opacity: 0.95}, 3000, resume);
    });
  }
  function hide_congratulations() {
    if (_gaq) {
      _gaq.push(['_trackEvent', 'Levels', 'Begins', 'Post-Game']);
    }

    foreground_animations.enqueue_async(function(resume) {
      var hidden = $('#hidden');
      $('#thanks').appendTo(hidden);
      $('#congratulations').appendTo(hidden);

      toplevel_container.transition({'background-color': '#fff'}, 1000, resume);
    }).then(function() {
      load_splash();
    });
  }


  function update_moveable(moveable) {
    room().update_moveable(moveable);
    process_events();
  }

  function target(moveable, dx, dy) {
    if (dx || dy) {
      var pos = moveable.pos.plus(dx, dy);

      return room().moveable_at(pos);
    } else {
      var dir = moveable.dir;

      return target(moveable, dir.x, dir.y);
    }
  }

  function change_moveable_dir(moveable, dx, dy) {
    moveable.dir = Pos.create(dx, dy);
    update_moveable(moveable);
  }
  function change_player_dir(dx, dy) {
    change_moveable_dir(player(), dx, dy);
  }
  function change_lover_dir(dx, dy) {
    change_moveable_dir(lover(), dx, dy);
  }
  function change_character_dir(dx, dy) {
    change_moveable_dir(lover() || player(), dx, dy);
  }

  function look_at(moveable, target) {
    moveable.dir = Pos.distance_between(moveable.pos, target.pos);
    update_moveable(moveable);
  }

  function moveable_says(moveable, something) {
    moveable.say = something;
    update_moveable(moveable);
    foreground_animations.wait_for(2*std_delay, function() {
      moveable.say = null;
      update_moveable(moveable);

      var t = target(moveable);
      if (t) {
        look_at(t, moveable);
      }
    });
  }
  function player_says(something) {
    moveable_says(player(), something);
  }
  function lover_says(something) {
    moveable_says(lover(), something);
  }

  function kiss(kisser, kissed) {
    if (multibuttons.current().solved()) {
      if (animate('solved_kiss', World.load_on_solved_kiss(level))) {
        return;
      }
    }
    if (is_movement_allowed() && animate('kiss', World.load_on_kiss(level))) {
      return;
    }

    foreground_animations.enqueue(function() {
      moveable_says(kisser, 'heart');
    }).then(function() {
      look_at(kissed, kisser);
    }).then_wait_for(std_delay).then(function() {
      moveable_says(kissed, 'heart');
    });
  }

  function push_moveable(moveable, dx, dy) {
    if (dx || dy) {
      foreground_animations.enqueue(function() {
        moveable.dir = Pos.create(dx, dy);
        moveable.pushing = true;
        update_moveable(moveable);
      }).then_wait_for(200).then(function() {
        moveable.pushing = false;
        update_moveable(moveable);
      });
    }
  }

  function move_player(dx, dy) {
    var r = room();
    var pos = r.player.pos.plus(dx, dy);
    var block = r.moveable_at(pos);
    var old_dir = r.player.dir;
    var same_dir = old_dir && dx == old_dir.x && dy == old_dir.y;

    if (block && !same_dir) {
      change_player_dir(dx, dy);
    } else {
      if (block && block === r.lover) {
        kiss(r.player, r.lover);
      } else {
        if (block) {
          if (fork_in_block) {
            room().shake_moveable(block);
            update_moveable(block);

            if (block === forked_block) {
              theatre.current_scene().add_hint_spot(block.pos);
            }
          }

          push_moveable(r.player, dx, dy);
        }

        foreground_animations.enqueue(function() {
          r.move_player(dx, dy);
          process_events();

          if (fork_in_block && block === forked_block) {
            theatre.current_scene().add_hint_spot(block.pos);
          }

          if (block && block.floor === Tile.bad_floor && !fork_in_block) {
            foreground_animations.wait_for(std_delay, function() {
              lover_says('r-question');
            });
          }

          if (block && block.forked && block.floor === Tile.hint) {
            animate('solved', World.load_on_solved(level));
          }

          if (r.player.floor == Tile.open_door && is_movement_allowed()) {
            next_level();
          }

          var pos_key = pos.x + "," + pos.y;
          var animation_plan = World.load_position_animations(level)[pos_key];
          if( animation_plan ) {
            animate(pos_key, animation_plan);
          }
        });
      }
    }
  }
  function move_lover(dx, dy) {
    var r = room();
    var pos = r.lover.pos.plus(dx, dy);
    var block = r.moveable_at(pos);

    if (dx || dy) {
      if (block && fork_in_block) {
        room().shake_moveable(block);
        update_moveable(block);
      }
    }

    room().move_lover(dx, dy);

    process_events();
  }



  function use_fork(character) {
    var r = room();
    var dir = character.dir;
    var block = target(character);

    if (block && block.tile.character) return kiss(character, block);

    if (character.forked) {
      if (block) {
        var forked = character.forked;
        block.forked = forked;
        room().shake_moveable(block);
        fork_in_block = true;
        forked_block = block;
        r.update_moveable(block);

        character.forked = null;
        r.update_moveable(character);

        multiroom.fork(block, forked);

        process_events();
        return true;
      } else {
        // character is not facing a block.
        // maybe it's still clear which one he means, though?
        var block_count = 0;
        var block_dir = null;

        Pos.each_dir(function(dir) {
          var moveable = target(character, dir.x, dir.y);

          if (moveable) {
            ++block_count;
            block_dir = dir;
          }
        });

        if (block_count == 1) {
          // that must be the block the character meant.
          // turn towards it and try again
          character.dir = block_dir;
          update_moveable(character);

          return use_fork(character);
        }
      }
    } else {
      if (block && block.forked) {
        // pick up the fork
        {
          var forked = block.forked;
          block.forked = null;
          forked_block = block;
          fork_in_block = false;
          r.update_moveable(block);

          character.forked = forked;
          r.update_moveable(character);

          process_events();
        }

        // merge the timelines;
        // we go back into the old room, and thus need
        // to consider the block's instance from that room
        {
          multiroom.merge(block);

          r = room();
          block = r.moveable_from_id(block.id);
          character = r.moveable_from_id(character.id);
        }

        // repeat the changes in the old timeline
        {
          block.forked = null;
          r.update_moveable(block);

          character.forked = forked;
          r.update_moveable(character);
        }

        process_events();
        return true;
      } else {
        // character is not facing a block.
        // maybe it's still clear which one he means, though?
        var block_dir = null;

        Pos.each_dir(function(dir) {
          var moveable = target(character, dir.x, dir.y);

          if (moveable && moveable.forked) {
            block_dir = dir;
          }
        });

        if (block_dir) {
          // that must be the block the character meant.
          // turn towards it and try again
          character.dir = block_dir;
          update_moveable(character);

          return use_fork(character);
        }
      }
    }

    return false;
  }
  function player_uses_fork() {
    var p = player();
    var t = target(p);
    if (t && t.forked == 'sporked') {
      if (animate('spork', World.load_on_spork(level))) {
        return;
      }
    }

    if (use_fork(p)) {
      has_forked = true;

      if (fork_in_block && forked_block.tile === Tile.block_with_hint) {
        animate('fork', World.load_on_fork(level));
      } else if (!fork_in_block && target(p).floor === Tile.hint) {
        animate('unfork_solved', World.load_on_unfork_solved(level));
      } else if (!fork_in_block) {
        animate('unfork', World.load_on_unfork(level));
      }
    }
  }

  function next_room() {
    multiroom.next_room();
    process_events();
  }


  var keyHandler;
  var debug_delay = false;
  function handleKey(key) {
    // return false for keys which don't mess with the browser state,
    // this will allow browser commands like Cmd+R to work.

    if (is_movement_allowed()) {
      switch (key) {
        case Keycode.W:
        case Keycode.K:
        case Keycode.up:    move_player( 0,-1); break;

        case Keycode.A:
        case Keycode.H:
        case Keycode.left:  move_player(-1, 0); break;

        case Keycode.S:
        case Keycode.J:
        case Keycode.down:  move_player( 0, 1); break;

        case Keycode.D:
        case Keycode.L:
        case Keycode.right: move_player( 1, 0); break;

        case Keycode.esc:
        case Keycode.R: try_again(); break;

        case Keycode.Z:
        case Keycode.X:
        case Keycode.F:
        case Keycode.ctrl:
        case Keycode.space: player_uses_fork(); break;

        //case Keycode.tab: next_room(); break
      }
    } else {
      switch (key) {
        case Keycode.R: foreground_animations.fast_forward(50);
      }
    }

    if (debug) {
      var old_level = level;

      // secret level-skipping keys!
      switch (key) {
        case Keycode.O: --level; break;
        case Keycode.P: ++level; break;
      }
      if (level < 0) level = 0;

      if (level != old_level && !debug_delay) {
        debug_delay = true;
        window.setTimeout(function() {
          foreground_animations.enqueue(function() {
            debug_delay = false;
            load_level(level);
          }).fast_forward(10);
        }, 1000);
      }
    }

    if (key >= Keycode.A && key <= Keycode.Z) {
      // let the key through, in case the user
      // is trying to type a browser hotkey combination
      return false;
    } else {
      return true;
    }
  }

  function play_from_level(index) {
    toplevel_container.addClass('well').empty();
    load_level(index);
    keyHandler = handleKey;
  }
  function begin(e) {
    play_from_level(0);

    if (e == Keycode.D) debug = true;
  }
  function resume(e) {
    //set the level to start
    currentLevel = 0;
    if (window.localStorage && window.localStorage['currentLevel'])
    {
    	currentLevel = parseInt(window.localStorage['currentLevel']);
    }
    if (currentLevel > World.index_of_last_level()) {
      play_from_level(World.index_of_last_level());
    } else {
      play_from_level(currentLevel);
    }
  }
  function begin_puzzles(e) {
    play_from_level(World.index_of_first_bonus());
  }

  function create_splash() {
    var splash = $('<div id="splash"/>');

    var img = 'splash.png';
    if (unlocked_puzzles >= 4) {
      img = 'splash2.png';
    }
    splash.append($('<img class="splash-img" src="img/'+img+'" alt="Push and Fork, having fun with time"/>'));

    return splash;
  }

  function create_single_button() {
    return $('<div id="begin" class="btn btn-success"/>').text('Play now');
  }
  function create_begin_button() {
    return $('<div id="begin" class="btn btn-success"/>').text('Play from the beginning');
  }
  function create_resume_button() {
    var endings_remain = (unlocked_puzzles > 0 && unlocked_puzzles < 3);
    return $('<div id="resume" class="btn btn-success"/>').text(endings_remain ? 'Aim for a different ending'
                                                                               : 'Resume game');
  }
  function create_puzzle_button() {
    var puzzles = unlocked_puzzles;
    if (puzzles > 3) puzzles = 3;
    return $('<div id="begin-puzzles" class="btn btn-success"/>').text('Bonus Levels ('+puzzles+'/3)');
  }

  function load_splash() {
    var splash = create_splash();

    var resume_button = null;
    var puzzle_button = null;

    if (window.localStorage && window.localStorage['currentLevel']) {
      resume_button = create_resume_button();
    }
    if (unlocked_puzzles) {
      puzzle_button = create_puzzle_button();
    }

    if (resume_button || puzzle_button) {
      splash.append(create_begin_button());
    } else {
      splash.append(create_single_button());
    }

    if (resume_button) {
      splash.append(resume_button);
    }
    if (unlocked_puzzles) {
      splash.append(puzzle_button);
    }

    toplevel_container.removeClass('well').empty().append(splash);

    $('#begin').click(begin);
    $('#resume').click(resume);
    $('#begin-puzzles').click(begin_puzzles);

    keyHandler = begin;

    Voice4Game.init({
      'play now': function() {play_from_level(0);},
      'left': function() {handleKey(Keycode.left);},
      'right': function() {handleKey(Keycode.right);},
      'up': function() {handleKey(Keycode.up);},
      'down': function() {handleKey(Keycode.down);},
      'fork': player_uses_fork,
      'reset': try_again,
      'disable voice': Voice4Game.stop
    }, true);
    Voice4Game.start();
  }

  load_splash();

  // first keypress begins the game
  $(document).keydown(function (e) {
    if (keyHandler(e['keyCode'])) {
      e.preventDefault();
    }
  });
});
