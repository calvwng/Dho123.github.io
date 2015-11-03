# Design document

This isn't a Waterfall-style design document: I don't have a fixed idea of
where I want the project to go, or how I want it to be structured in the
future. I just thought that it would be useful to have a high-level
explanation of the way the code is *currently* structured, so you can have an
idea of what is where.

I arrived at this design gradually: I implement new features in the main
octocarina.js file, then I refactor the resulting mess into small classes,
renaming and repurposing the existing classes when appropriate. I expect the
design to continue to change as we go along, we can just trash this document
once it becomes too obsolete. For now, I just hope it's useful to you!

## Containment hierarchies

So far, there are two parallel class hierarchies:
- World contains Multirooms contains Rooms  contains Tiles
-                Theatre    contains Scenes contains Sprites


### Data hierarchy

The first hierarchy is the data. The main mechanic of this game is to fork the
timeline, so it's important to keep track of each copy; this is what Multiroom
does. Currently, there is no timeline, just multiple copies of the room.
Before the first timeline fork, the Multiroom has only one Room instance.

Rooms are built out of tiles, which represent the contents of the room at a
particular location. As blocks are pushed and the player moves around, those
tiles change from Tile.empty to Tile.block to Tile.empty again.

Individual tiles don't have identities; a Tile instance should be viewed as a
value, the tile type at a particular location in the room. The only reason I
use instances instead of, say, a number or a symbol, is so that I can use the
OO notation tile.solid() instead of Tile.is_solid(tile). I plan to add another
class, probably Entity, for level elements which can move around.


Oh, and World is where we keep the level data, using a simple ASCII format.
Feel free to add your own levels! The more, the merrier.


### View hierarchy

In parallel to the data hierarchy is a view hierarchy which takes care of
displaying all this data. Please don't add animation or css, or html data to
the data classes; add them here instead.

I chose not to call those classes boring names like "Room_View", because I
like short names, and because I don't want this code to devolve into a
Java-like mess of Room_Viewer_Factory_Worker_Singletons. It does require a bit
of cleverness while coming up with new names, though.

Each tile is represented by a Sprite. Unlike Tile, a Sprite instance does have
an identity; it represents the individual DOM element at this particular
location of the room. The Scene listen for the room's tile changes, and
updates its sprites accordingly. There is also an uninteresting intermediate
class, Layer, which deals with the fact that the floor and the obstacles are
stacked on top of each other.

In the same manner that a Multiroom contains many Rooms, a Theatre contains
many Scenes. The role of the Theatre is to listen for Multiroom changes, and
to display the many rooms accordingly.


## Events

Change of plans.

Instead of following the jQuery convention of registering and triggering
callbacks, let's follow the advice of Rich Hickey and Evan Czaplicki and eschew
callbacks. What shall we use instead?

Lists. In the top-level keypress handler, Let's:
1) perform the action, accumulating events of a given type in a list
   (wrapped in an EventQueue object, for clarity)
2) ask each module to analyse the latest events
3) clear the lists.
4) loop.

Hope you like it this way!
