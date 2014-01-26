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

	var init = function(){
		// https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library
		if( Gamepad ) {
			this.gamepad = new Gamepad();
			this.setup(this.gamepad)
		}

		if (!this.gamepad.init()) {
		    // Your browser does not support gamepads, get the latest Google Chrome or Firefox
		    console.log("Cannot use gamepad")
		}
		return this;
	}

	this.setup = function(gamepad){
		console.log('Gamepad')

		gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
		    // a new gamepad connected
		    console.log('Gamepad', device)
		});

		gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
		    // gamepad disconnected
		    console.log('Gamepad', device)
		});

		gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
		    // an unsupported gamepad connected (add new mapping)
		    console.log('Gamepad', device)
		});

		gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
		    // e.control of gamepad e.gamepad pressed down
		    console.log('Gamepad', e)
		});

		gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
		    // e.control of gamepad e.gamepad released
		    console.log('Gamepad', e)
		});

		gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
		    // e.axis changed to value e.value for gamepad e.gamepad
		    console.log('Gamepad', e)
		});
	}

	return init.apply(this, arguments)
}