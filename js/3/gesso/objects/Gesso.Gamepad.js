(function(){
	var GamepadPoint = G.Class(G.Point, {
		
		point: null,

		/**
		 * X position of the point. If the point object exists (this.point),
		 * this is superseded.
		 * @type {Number}
		 */
		x: 50,
		y: 50,
		size: 3,
		lineWidth: 1,
		fillStyle: 'orange',
		sensitivity: 10,

		constructor: function(gesso, config) {
			GamepadPoint.Super.call(this, gesso, config);
			// this.data = new Object();
			this.x = gesso.centerWidth;
			this.y = gesso.centerHeight;
			//this.data.lineWidth = this.lineWidth;
			//this.data.fillStyle = this.fillStyle;
			this.setup()
		},

		/**
		 * Perform the setup of the functionset. 
		 * with this class type, the method must run before the
		 * element is initialized.
		 * 
		 * @return {[type]} [description]
		 */
		setup: function(){
			// https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library
			// debugger;
			if( Gamepad ) {
				this.gamepad = new Gamepad();
			}

			if (!this.gamepad.init()) {
			    // Your browser does not support gamepads, get the latest Google Chrome or Firefox
			    console.log("Cannot use gamepad")
			} else {
				console.log('Gamepad ready')
			
				this.setupPad(this.gamepad)
			}

			this.sensitivity = 20;
			return this;
		},

		setupPad: function(gamepad){
			console.log('Gamepad')
			var self = this;
			this.act = {}
			gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
			    // a new gamepad connected
			    self.act['connected'] = true
			    console.log('Gamepad', 'connected')
			});

			gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
			    // gamepad disconnected
			    self.act['connected'] = false
			    console.log('Gamepad', 'disconnected')
			});

			gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
			    // an unsupported gamepad connected (add new mapping)
			    console.log('Gamepad', device)
			});

			gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
			    // e.control of gamepad e.gamepad pressed down
			    console.log('Gamepad', e);
			    self.act[e.control] = Boolean(!self.act[e.control])
			});

			gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
			    // e.control of gamepad e.gamepad released
			    console.log('Gamepad', e)
			});

			gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
			    // e.axis changed to value e.value for gamepad e.gamepad
			    // console.log(e.axis, e.value);
			    self.act[e.axis] = e.value
			});
		},

		/**
		 * The step method is isolated from the main scope of the
		 * class. This is to ensure the Flywieght design of the method doesn't
		 * leak. 
		 * `this` refers to the data of the context elements. This is where you
		 * should calculate the interface, applying variables into the
		 * scope.
		 * The first argument is the class - you can reference your
		 * local variables here.
		 * @param  {Class} parent 	The class this method exists within.
		 * @return {null}       	nothing to return
		 */
		step: function(point){
			/*
			The parent class is the fiest argument. This means the `this` scope
			is the reference applied to the draw loop. This is to enforce
			a clean design pattern and writing values needed within the 
			`draw` method here, ensures nasty leaks don't occur through
			a heavy classing.

			Additionally, proving a scoped methdology to this method allows
			for webwork offset and alterating the calculation steps of the
			resulting draw.
			 */
			this.x = point.getX();
			this.y = point.getY();
			
			// map allowed public allowed variables to the data scope.
			this.lineWidth = point.lineWidth;
			this.fillStyle = point.fillStyle;
			this.size = point.size;
			
		}, 

		/**
		 * return a value for a given input name from the device.
		 * If this value does not exist (user has not used the button)
		 * A default value can be returned.
		 * @param  {String} name The name of the input element
		 * @param  {*} def  optionally return a value if name does not exist.
		 * @return {Number|string}      Value from the input key or null;
		 */
		inputValue: function(name, def){
			// debugger
			if( it(this.act).has(name) ){ 
				return this.act[name];
			}
			return def || null;
		},

		pad: function(name, def) {
			return this.inputValue(name.toUpperCase().trim())
		},

		/**
		 * Provide a number to convert to a axis biased calculation for the 
		 * input value, factoring in deadZones etc...
		 * @param {Number} value original input value
		 * @return {Number} altered input value
		 */
		axisVal: function(value){
			var value = value * ( ( Math.abs(value) * .3) * Math.abs(value));
			return value;
		},

		getX: function(){
			var x = 10;
			if(this.x) {
				x = this.x
			} else {
				if(this && this.point) {
					x = this.point.x;	
				} else if(thisx) {
					x = this.x;
				}
			}

			var inputVal = this.pad('left_stick_x', 0);
			var axisVal = this.axisVal(inputVal);
			var __x = (x || 100) + ( axisVal * (this.data.sensitivity || this.sensitivity) );
			
			return __x;

		},

		getY: function(){

			var y = 10;
			if(this.y) {
				y = this.y; 
			} else {
				if(this && this.point) {
					y = this.point.y;
				} else if(this.y) {
					y = this.y;
				}
			}


			var inputVal = this.pad('left_stick_y', 0);
			var axisVal = this.axisVal(inputVal);
			var __y = (y || 100) + ( axisVal * (this.data.sensitivity || this.sensitivity) );
			
			return __y;
		},

		/**
		 * Provided to the draaw renderer to present the values within the class.
		 * This is isolated from the main class, running within a closed scoped
		 * The data is updated within the `step` class. The `draw method should
		 * only present these values.
		 * 	
		 * @param  {Context} context 2D context provided by the renderer
		 * @return {void}         Nothing to return.
		 */
		draw: function(context, data){ 
			/*
			It's best to define this lightly only drawing should occur. 
			Any calculations required should be performed within the 
			`step` method. This is to ensure to renderer loop isn't clogged
			and the closed scope ensures less leaking.
			The data object should contain all dynamic values required to
			draw. These values were written during the `step` phase.
			 */
			context.beginPath();
			context.fillStyle = data.fillStyle;
			context.arc(data.x || 50, data.y || 50, data.size || 2, 0, Math.PI * 2, false);
	    	context.fill();
		}
	});

	G.Gamepad = GamepadPoint;
})();
