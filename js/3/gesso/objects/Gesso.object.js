(function(){
	G.Lib = {};
	G.Class = my.Class;
})();


(function(){

	/**
		A basic DrawObject is applied to the draw layer.
		This contains fundamentally a `draw()` method to
		be sent to the drawLayer.
		If a Class extends this, it can be drawn. 
	*/
	var DrawObject = G.Class({
		constructor: function(gesso, config) {
			if(!gesso) {
				return undefined
			}
			this.gesso = gesso;

			this.addToDrawLayer(gesso.stage, gesso.steps);
			return this;
	    },
	    data: {},
		
		/**
		 * receive a context to draw an object. at it's basic entity. this 
		 * entity needed to add to a Gesso display object.
		 */
		draw: function(context){
			context.beginPath();
		    context.strokeStyle = '#CCC';
		    context.lineWidth = 1;
		    context.arc(20, 20, 10, 0, Math.PI*2);
	    	context.stroke();
		},

		/**
		 * Add this element to the draw layer. This begins to draw the object
		 * to the target canvas. Optionally pass a drawLayer to to the method, else
		 * the drawLayer will be collected from the associated Gesso passed at init()
		 * This method essentially pushes the draw method into the array list to
		 * run through the render loop
		 * 
		 * @param {Object} drawLayer drawLayer to render to.
		 */
		addToDrawLayer: function(drawLayer, stepLayer) {
			var drawLayers = (drawLayer)? drawLayer: this.gesso.drawLayers || this.gesso;
			var stepLayers = (stepLayer)? stepLayer: this.gesso.stepLayers || this.gesso;

			drawLayers.push({ 
				/* Pass the method to draw to */
				draw: this.draw, 
				/* Pass the data object to define a commincative context
				beween step() and draw() */
				data: this.data, 
				// cheap copy for the lazy
				// d: this.data 
			});

			if(this.step) {
				stepLayers.push({
					step: this.step,
					data: this.data,
					entity: this
				});
			}

			return drawLayer;
		}
	});

	G.DrawObject = DrawObject;
})();

