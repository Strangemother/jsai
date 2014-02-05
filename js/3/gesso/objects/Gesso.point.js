(function(){
	var Point = G.Class(G.DrawObject, {
		
		point: null,

		/**
		 * X position of the point. If the point object exists (this.point),
		 * this is superseded.
		 * @type {Number}
		 */
		x: 10,
		y: 10,
		size: 2,
		lineWidth: 1,
		fillStyle: '#999',

		constructor: function(gesso, config) {
			Point.Super.call(this, gesso, config);
			// this.data = new Object();
			this.data.x = this.x;
			this.data.y = this.y;

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

			return x;
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
			return y;
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

	G.Point = Point;
})();
