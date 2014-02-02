Gesso.Map = function(){
	// A dictionary of names, providing an object to
	// use for the draw method. this allows an easier 
	// application of common object to the stage layer.
	//
	this.primitiveMap = {};
	
	var init = function(){
		for (var prim in Gesso.primitive) {
			if (Gesso.primitive.hasOwnProperty(prim)) {
				var prim = Gesso.primitive[prim];
				this.add(prim.name, prim);
			}
		}		
		return this;
	}

	this.add = function(name, data) {
		this.primitiveMap[name] = data;
		return data;
	}
		
	

	this.get = function(name) {
		return this.primitiveMap[name]
	}

	this.remove = function(name) {
		this.primitiveMap[name] = null;
		delete this.primitiveMap[name];	
	}

	return init.apply(this, arguments);
}
