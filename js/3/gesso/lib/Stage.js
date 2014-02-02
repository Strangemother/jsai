
Gesso.Stage = function(){
	// Stage logic, to Assign a display layer to draw to.
	// This is an extension of the Canvas, but saves the namespace.
	
	var init = function(canvas, context) {
		// Hold an array of elements to 
		// render when the draw procedure is asked.
		this.displayObjects = [];
		this.map = new Gesso.Map()
		return this;
	} 

	/**
	 * Get an element from the displaylist based upon it's name
	 * @param  {String} name the name of the element
	 * @return {DisplayObject}      returns the element matching the name passed
	 */
	this.get = function(name) {

		var d = this.displayObjects[this.map.get(name)];

		if(d) return d;

		for (var prop in this.displayObjects) {
			if (this.displayObjects[prop].hasOwnProperty('data')) {
				if( this.displayObjects[prop].data.name == name ||
					this.displayObjects[prop].data.__DisplayObject == name ) {
					return this.displayObjects[prop]
				}
			}
		}	
	}

	/**
	 * Add a display object to the render list A function
	 * or an object can be passed with a resulting `draw` method
	 * expecting a context to draw.
	 * 
	 * @param {Object|Function} DisplayObject Element to add to the interface
	 */
	this.add = function(DisplayObject){
		
		var displayObject = DisplayObject;
		var data = arguments[1] || {}

		
		// Create a test display object
		var tdo = it(DisplayObject);

		// Objects can be implemented.
		if( tdo.is(Object, displayObject) ) {
			
			var d = displayObject;
			if( !tdo.has('draw') ){
				d = {draw: displayObject };
			}

			if( !(tdo).has('data') ){
				d.data = data || {}
			}

			if( !(tdo).has('config') ){
				d.config= function(k, v){
					
					if(v === undefined) {

						return displayObject[k]
					} else {
						displayObject.data[k] = v
						return displayObject
					}
				}
				
			}

			if(!d.name) {
				// debugger;
				d.name = (displayObject.data)? displayObject.data.name: Gesso.randomString()
			}

			d.__map = Gesso.randomString();
			
			var position = this.displayObjects.push(d) -1;

			this.map.add(d.__map, position);
			this.map.add(d.name, position);

			return d

		} else if( tdo.is(Function, displayObject) ) {
			return this.add(displayObject())

		} else if( tdo.is(String, displayObject) ) {
			/*
			this.add('circle', {})
			*/
			var prim = {
				primitive: 	this.map.get(DisplayObject),
				data: 	data
			}
			prim.data.__DisplayObject = DisplayObject;
			return this.add({
				// Merge the user data into a stage object
				data: data || prim.data,
				draw: function(context){
					(function(prim){
						if(!prim || !prim.primitive) {
							return this.events.error(3, "Element '" + prim.data.__DisplayObject + "' not defined")
						}

						return prim.primitive.call(
							this,
							context, 
							prim.data, // prim.config
							this
						);
						

					}).apply(gesso, [prim])
				}
			});
		}

		return displayObject;
	}

	
	return init.apply(this, arguments)
}

 Gesso.Stage.prototype = {
 	draw: function(context) {
 		// prototype
		for (var i = this.displayObjects.length - 1; i >= 0; i--) {
			var displayObject = this.displayObjects[i];
			if( it(displayObject).has('draw') ) {
				displayObject.draw(context);
			}
		};
	}
}
