Gesso.Inputs = function() {

	this.controllers = [];

	var init = function(scope) {

		// Add controllers.
		for (var controller in Gesso.Inputs.controllers) {
			if (Gesso.Inputs.controllers.hasOwnProperty(controller)) {
				var inp = new Gesso.Inputs.controllers[controller]();
				this.controllers[controller] = inp
			}
		}

		return this;
	};

	return init.apply(this, arguments);
};

Gesso.Inputs.controllers = {}

Gesso.Inputs.controllers.Gamepad = function(){
	var self = this;

	var init = function(){
		// https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library
		if( Gamepad ) {
			this.gamepad = new Gamepad();
			this.setup(this.gamepad)
		}

		if (!this.gamepad.init()) {
		    // Your browser does not support gamepads, get the latest Google Chrome or Firefox
		    console.log("Cannot use gamepad")
		} else {
			console.log('Gamepad ready')
			Gesso.Addons['Gamepad'] = this;
		}


		this.sensitivity = 10

		return this;
	}

	this.actionValue = {};

	/**
	 * return a value for a given input name from the device.
	 * If this value does not exist (user has not used the button)
	 * A default value can be returned.
	 * @param  {String} name The name of the input element
	 * @param  {*} def  optionally return a value if name does not exist.
	 * @return {Number|string}      Value from the input key or null;
	 */
	this.inputValue = function(name, def){
		// debugger
		if( it(self.actionValue).has(name) ){ 
			return self.actionValue[name];
		}
		return def || null;
	}

	this.pad = function(name, def) {
		return this.inputValue(name.toUpperCase().trim())
	}

	/**
	 * Provide a number to convert to a axis biased calculation for the 
	 * input value, factoring in deadZones etc...
	 * @param {Number} value original input value
	 * @return {Number} altered input value
	 */
	this.axisVal = function(value){
		var value = value * ( ( Math.abs(value) * .3) * Math.abs(value));
		return value;
	}

	this.draw = function(context, primitiveData, gesso){
		
		
		if(this.stage) {
			debugger;
			var displayObject = this.stage.get(primitiveData.name || primitiveData.__DisplayObject);
		}

		Gesso.primitive.Crosshair(context, {
			x: primitiveData.x,
			y: primitiveData.y,
			text: self.pad('select_back')
		})

		if(self.actionValue.connected) {

			if( self.pad('right_top_shoulder', false) ) {
				var right = Gesso.primitive.Circle(context, {
					x: primitiveData.x + 50,
					y: primitiveData.y,
					r: self.pad('right_bottom_shoulder', .3) * 90,
					color: '#637E97'
				});
			
				var tx = primitiveData.x + 55 + right.r;
				var ty = primitiveData.y + 15 + right.r;
				Gesso.primitive.Text(context, {
					x: tx,
					y: ty,
					text: right.r.toFixed()
				})
			}

			if( self.pad('left_top_shoulder', false) ) {
				var left = Gesso.primitive.Circle(context, {
					x: primitiveData.x - 50,
					y: primitiveData.y,
					r: self.pad('left_bottom_shoulder', .3) * 90,
					color: '#63976F'
				});

				var tx = primitiveData.x - 55 + left.r;
				var ty = primitiveData.y + 15 + left.r;
				Gesso.primitive.Text(context, {
					x: tx,
					y: ty,
					text: left.r.toFixed()
				})
			}

		}
	}

	this.primitive = function(){

		var obj= {
			x: function(_x, dob, context){
				var inputVal = self.pad('left_stick_x', 0);
				var axisVal = self.axisVal(inputVal);
				var __x = (_x || 100) + ( axisVal * (dob.data.sensitivity || self.sensitivity) );
				
				dob.config('x', __x)
				return __x
			},
			y: function(_y, dob, context){
				var inputVal = self.pad('left_stick_y', 0);
				var axisVal = self.axisVal(inputVal);
				var __y = (_y || 100) + ( axisVal * (dob.data.sensitivity || self.sensitivity) );
				dob.config('y', __y)
				return __y
			},
		}

		return obj;
	}

	this.setup = function(gamepad){
		console.log('Gamepad')

		gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
		    // a new gamepad connected
		    self.actionValue['connected'] = true
		    console.log('Gamepad', 'connected')
		});

		gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
		    // gamepad disconnected
		    self.actionValue['connected'] = false
		    console.log('Gamepad', 'disconnected')
		});

		gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
		    // an unsupported gamepad connected (add new mapping)
		    console.log('Gamepad', device)
		});

		gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
		    // e.control of gamepad e.gamepad pressed down
		    console.log('Gamepad', e);
		    self.actionValue[e.control] = Boolean(!self.actionValue[e.control])
		});

		gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
		    // e.control of gamepad e.gamepad released
		    console.log('Gamepad', e)
		});

		gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
		    // e.axis changed to value e.value for gamepad e.gamepad
		    // console.log(e.axis, e.value);
		    self.actionValue[e.axis] = e.value
		});
	}

	return init.apply(this, arguments)
}