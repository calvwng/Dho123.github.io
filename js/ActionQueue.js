// run code in order despite asyncronous callbacks.
// 
// this requires collaboration with all asynchronous calls,
// as in the following example:
// 
//   var actionQueue = ActionQueue.create();
//    actionQueue.enqueue(function() {
//      // this block executes first
//    }).then_async(function(resume) {
//      // then this animation.
//      $('body').transition({opacity: 0}, function() {
//        // this callback runs when the animation finishes.
//        // tell the actionQueue to continue
//        resume();
//    }).then(function() {
//      // this block runs once the animation is over
//    });
// 
// this particular example could be achieved in a simpler way
// by using the animation's callback directly;
// explicit action queues are more useful when you need
// more control over the execution, for instance to have
// multiple interacting queues.

var ActionQueue = {
  create: function() {
    var paused = false;
    var nested = false;
    var fast_forward = false;
    var queue = [];
    
    return {
      is_empty: function() {
        if (paused) {
          // an element is still running, even if its no longer on the queue.
          return false;
        } else {
          return (queue.length == 0);
        }
      },
      run_queue: function() {
        if (nested) return;
        
        nested = true;
        while (queue.length > 0 && !paused) {
          var body = queue.shift();
          if (body != 'dummy') {
            var remaining_events = queue;
            queue = ['dummy'];
            
            body();
            
            // next, play the events enqueued by body(),
            // (which are already in the queue)
            // then play the remaining events
            for(var i=0; i<remaining_events.length; ++i) {
              queue.push(remaining_events[i]);
            }
          }
        }
        nested = false;
        if (!paused) {
          fast_forward = false;
        }
      },
      
      enqueue: function(body) {
        if (this.is_empty() && !nested) {
          // run immediately
          body();
        } else {
          // run later
          queue.push(body);
        }
        
        return this;
      },
      enqueue_async: function(body) {
        var self = this;
        var resumed = false;
        var resume = function() {
          if (!resumed) {
            // don't resume twice
            resumed = true;
            
            self.resume();
          }
        };
        
        return self.enqueue(function() {
          self.stop();
          body(resume);
        });
      },
      then: function(body) {
        // synonym for enqueue
        return this.enqueue(body);
      },
      then_async: function(body) {
        // synonym for enqueue_async
        return this.enqueue_async(body);
      },
      
      wait_for: function(other_queue, then_do) {
        var self = this;
        self.stop();
        
        var resume = function() {
          if (then_do) then_do();
          
          self.resume();
        };
        
        // dual purpose! depending on the argument type,
        // either wait for another queue of for time to pass.
        if ($.isNumeric(other_queue)) {
          var delay = other_queue;
          if (fast_forward && delay > fast_forward) delay = fast_forward;
          window.setTimeout(resume, delay);
        } else {
          other_queue.enqueue(resume);
        }
      },
      then_wait_for: function(other_queue) {
        var self = this;
        self.enqueue(function() {
          self.wait_for(other_queue);
        });
        
        return self;
      },
      
      stop: function() {
        paused = true;
      },
      resume: function() {
        if (paused) {
          paused = false;
          
          this.run_queue();
        }
      },
      
      fast_forward: function(forced_delay) {
        if (!this.is_empty()) {
          fast_forward = forced_delay;
        }
      },
      clear: function() {
        queue = [];
        this.resume();
      }
    };
  }
};
