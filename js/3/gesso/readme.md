# Super Simple Canvas Boilerplate.

Canvas is fun! Getting started with all the elements you need is boring. So I 
put together a little tool of which will serve you a canvas boilerplate without
the fuss.

Along with the core tool of being just a boilerplate (loops, rendering), there
are some extra components to help work with the basic objects. 

The essentials supplied are light wrappers around the basic functionality of
canvas drawing. Using these tools can help you quickly establish the basics and
rapidly prototype. Due to the nature of how these extras are coded, they
can be converted to your own format very quickly.

## Getting started

There are two methods to start your project using Gesso. The basic flavour 
provides you with The setup needed to simply start a canvas. The full fat method allows for clever importing, smart asset use and an easy to use API.

# Simple use.

Don't bother with all the API Gesso has and do your own thing! I advocate the simple way and it doesn't get much simpler than this:

    // pass your canvas name
    gesso = new Gesso('main');

    // the draw method is waiting.
	gesso.draw = function(context) { 
		context.font  = 'normal 12px Calibri';
		context.fillText('What?! That was easy.', 20, 20); 
	}

I Guess the HTML is required too:

    <!DOCTYPE html>
      <html>
      <head>
        <title>Gesso</title>
      </head>
      <body>
        <div class="container">
            <canvas id="main"></canvas>
        </div>
        <script src="gesso.js" type="text/javascript" charset="utf-8"></script>
      </body>
    </html>


And we're done. I hope I've tickled your fancy with how quickly you can setup your code with Gesso.

# Deeper, more!

Having the basic functionality setup is great, but I consider a boilerplate should give you enough to hit your project with all gears in full lock. So having some essentials plugged in can bridge the gap for all those boring bits.


Using Gesso, it becomes very simple to apply elements to the canvas. Within Gesso, this is called the `stage`. This is a naming conventions to convey clarity regarding the draw layer and namespace conservation.

    gesso = new Gesso('main');
    gesso.stage.add('text', {
        name: 'fps',
        text: function(){
            return Math.round(this.fps) + ' fps'
        }
    })


you can perform this act act at any time, adding an element and changing it's properties:

    var c = gesso.stage.add('circle');
    c.config('x') === undefined
    c.config('x', 100)
    c.config('x') === 100

With the above example, you'll see a circle and move it.

### DisplayObject

A display object is something to be displayed on the screen. Beneath the hood, this is just an object containing a `draw` method. Everything else it optional.

There are a few methods of implementing your display objects.

Push an object into the displayList, the object can be anything, as long as the `draw` method exists, you'll receive a canvas context to draw in.

    gesso.stage.add({
        draw: function(context){
            Gesso.primitive.Circle(context, {
                x: gesso.centerWidth * .5,
                y: gesso.centerHeight * .5,
                r: cw * .5
            });
        }
    });

By implementing a primitive object, you can access the element is an easier way, using the name of the method to assign a new display object to the stage display list.

In this example, we use the basic `circle` primitive and some values to present display list.

    var c = {
        name: 'foo',
        x: gesso.centerWidth
        y: gesso.centerHeight,
        r: 100
    }
    gesso.stage.add('circle', c);

If you need to generate your values at the right time, you can pass a function of which will be called to to revieve an object.

    gesso.stage.add('circle', function(){
          return {
              x: 20,
              y: 199,
              color: 'green'
          }
      })


To make your code very clever, you can make any value a method handler, this will be called when the value needs to be updated. In this example you'll see a circle travel across the canvas.

    var cx =0;
    var c = {
        name: 'foo',
        x: function(){
            return cx++
        },
        y: gesso.centerHeight,
        r: 220
    }
    gesso.stage.add('circle', c);


### configuration

You can change an option at any time, when you change the value, you'll see the element on the canvas update.

    var point = gesso.stage.add('point')
    point.config('x',300);

You can gain access to the same value through the associated data object. This was originally the value you passed when creating the display object (if any), you're simply updating.

    var dataPoint = point.data.x;
    dataPoint = gesso.centerWidth;