GessoEvents = function() {
	/*
	Use events.
	 */

	var init = function(scope){
		this._scope = scope || {};

		if( !Events ) {
			this.error(2, 'Events missing. Import minivents.js')
		}
		Events(this._scope);
		return this
	};

	/**
	 * dispatch an error event and print and error console log.
	 * @param  {Number} code    error code Number
	 * @param  {String} message Message string
	 * @return {this.dispatch}         return a signal dispatch
	 */
	this.error = function(code, message) {
	
		console.error('Error:', code, message);

		return this.dispatch('error', {
			type: 'error',
			code: code,
			message: message,
		})
	}

	/**
	 * add a callback to an event name
	 * this.on('foo', function(){})
	 * @param  {String} name Name of the event to listen for
	 * @param  {Function} func Handler to capture the diaptched event
	 * @return {undefined}
	 */
	this.on = function(name, func){
		return this._scope.on(name, func);
	};

	/**
	 * Dispatch for all listeners to react to.
	 * @param  {String} name Name of the event to dispatch
	 * @param  {Object} data Data object to provide to all listeners
	 * @return {undefined}
	 */
	this.dispatch = function(name, data) {
		return this._scope.emit(name, data);
	}

	this.off = function(name) {
		return this._scope.off(name);
	}

	return init.apply(this, arguments);
};



var Gesso = function() {
	/*
	Enhance an easier use of the basic canvas. For prepped, not low-level
	javascript drawing.

	What does it do:
		+ Augment the drawing api - a thin wrapper to common logic
		+ Easy base, removing canvas boilerplate
		+ Plug n play usage

	What does it not do:
		+ does not give you a platform for a game
		+ does not provide 2d vector physics or gravity or textures

	This is essentially a cut of all the good open source, packaged into a 
	no fuss object. This project has been created out of my own fustration.
	I simply wanted a canvas boilerplate; alike html5 boilerplates...
	 */
	var self = this;

	var init = function(name, width){
		// The name of the canvas element
		this.name 		= name;
		this.fps_last 	= (new Date);
		this.width 		= width || null;
		this.fps_el 	= document.getElementById('fps');
	    this.fps 	 	= 0;
		window.requestAnimFrame = this.browserAnimationFrame;
		
		this.events = GessoEvents();
		this.inputs = Gesso.Inputs()
		
		var setup = this.setupCanvas(name);

		if(setup){
			this.loop();
		}

		return this;
	};

	this.setupCanvas = function(name, w, h){
        this.width 		 = w || this.width || (window.screen.availWidth * .9);
        this.height 	 = h || this.height || (window.screen.availHeight * .9);
		this.centerWidth 	 = this.width * .5;
		this.centerHeight 	 = this.height * .5;

		var dpr, 
			width    = this.width, 
			height   = this.height,
	        canvas 	 = document.getElementById(name);

		if(!canvas)	{
			this.events.error(1, 'missing canvas');
			return false;
		}

	    dpr = this.devicePixelRatio  = window.devicePixelRatio || 1;
	  
	    canvas.width 	= width  * dpr;
	    canvas.height 	= height * dpr;
	    canvas.setAttribute('height', height);
	    canvas.setAttribute('width',  width);

	    this.context = canvas.getContext("2d");
	    // debugger;
	    this.context.scale(dpr, dpr);

	    if(Gesso.Stage) {
	    	this.stage = new Gesso.Stage(canvas, this.context);
	    }
	    // List of elements to render.
		this.drawLayers	= [this.stage];
	    return true
	};

	this.browserAnimationFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function(/* function */ callback, /* DOMElement */ element){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	this.render = function() {
        /* FPS setup */
        var fps_now = new Date;
        self.fps = 1000 / (fps_now - self.fps_last);
        self.fps_last = fps_now;

    	this.context.clearRect( 0, 0, this.width, this.height );
        self.context.save();
        self.draw(self.context)
        self.context.restore();
        
    };

	this.loop = function() {
	    var _loop = function(){
	        (function animloop(){
	            requestAnimFrame(animloop);
	            self.render();
	        })();
	    }

	    _loop()
	};

	this.draw = function(){
		// loop through the drawLayers - assuming this element has
		// a draw() method.
		for (var i = this.drawLayers.length - 1; i >= 0; i--) {
			if(this.drawLayers[i] && it(this.drawLayers[i]).has('draw') ) {
			 this.drawLayers[i].draw(this.context)
			}
		};
	};

	this.data = {};

	init.apply(this, arguments);
};

G = Gesso;
G.d = Gesso.data;
// Static Methods
x = 0;

Gesso.randomString = function(){
	return Number(String( Math.random() ).replace('.', +(new Date) ) ).toString(36)
}
