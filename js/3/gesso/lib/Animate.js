/**
 * Animate(stage, displayObject, config);
 * 
 */


var Animate = function(){
	/*
	 * The focus for a large extension of an entity I consider another 
	 * methodology. Having a large amount of code within the rendering
	 * chain is too technically verbose. Implement heavy logic outside the
	 * rendering chain within a `setup` method, and expose a `draw` method
	 * to the rendering chain. 
	 * Reacting externally to the draw event and providing a scoped variable
	 * set will clean up the memory management. Flyweight Factory style.
	 * 
	 */
	
	/*
	give it a data and a scope and a property is ran through during loop
	cycles.
	 */
	
	/**
	 * The Animate should work within and outside the scope of
	 * an entity. If the class is passed a scope, this is referenced
	 * and variables changed are locally bound.
	 * 
	 * animate = new Animate(gesso|gesso.stage, entity, { config });
	 *
	 * Apply options, with scope.
	 * circle.animate('spin', Animate({ config }) )
	 */
	
	var init = function(stage, displayObject, config){
		
		this.displayObject = displayObject;
		this.stage = stage;
		this.config = config;
		this.rotate = 0;

		this.setup(config)
	}

	this.setup = function(config){
		// Perform heavy setup here.
		console.log('Animate');
		
	}

	this.entity = function(entity) {
		if(entity) {
			this._entity = entity;
			return this;
		}
		return this._entity;
	}

	this.displayObjectDraw = function(context) {

	}

	this.draw = function(context) {
		// expose drawing only.
		this.displayObject.rotate(this.rotate++);
		this.displayObject.draw(context);
		if( it(this.config).has('draw') ) {
			this.config.draw(context);
		}
	}

	return init.apply(this, arguments);	
}

Gesso.animate = {};

/**
 * returns a new animator for variable accesss. The draw method should
 * be supplied to a renderer
 * @param  {[type]} element [description]
 * @param  {[type]} config  [description]
 * @return {[type]}         [description]
 */
Gesso.animator = function(element, name, config) {
	var action = Gesso.animate[name];
	if( !it(Gesso.animators).has(name) ){
		Gesso.animators[name] = action(element, config).draw;
	}
	
	debugger;
	// Extend the gesso draw method with an extension.
	zoe.on(element, 'draw', function(context){
		console.log('raw')
		for (var prop in Gesso.animators) {
			if (Gesso.animators.hasOwnProperty(prop)) {
				var draw = Gesso.animators[prop];
				draw(context)
			}
		}	
	})

	return Gesso.animators[name]
}


Gesso.animators = {}
Gesso.Animator = Animate


/**
 * cycle through a linear range of values from then to a value.
 * The property within the scope is passed a new iterrative value 
 * upon each cycle until the range is exausted. If the range is interrupted,
 * the range stops
 * @param  {String} property              property on the scope to alter through the range itteration.
 * @param  {Object|String} to|from|config If an object is mapped, the values are used,
 *                                        if a single value is passed, this is the 
 *                                        end value to range from the current
 * @param {String} to                     Optionally Provide a value to associate
 *                                        with the given 'from' value, becoming from/to range.
 *                                        If the first option is an object, is the range count.
 */
Gesso.animate.range = function(property, from, to) {
    debugger;
}

/*
Simple wrapper for the Animate class, designed to expose a draw
method an a step sequence to alter the coordinates returned.

Pass a count of how many full rotations to perform. 0.5 is half a full rotation.
If count is passed, duration is optionally passed. 
Delay default value is 1 full rotation.
 */
Gesso.animate.spin = function(element, config) {
    console.log("Spin");

    var anim = new Animate(this, element, {
        type: 'spin',
        count: config.count || 2,
        duration: config.duration || -1,
        draw: function(){
        	console.log("Draw")
        }
    });

    return anim;
}
