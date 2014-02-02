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
			this.gesso = gesso
			this.addToDrawLayer(gesso.stage);
			return this;
	    },

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
		addToDrawLayer: function(drawLayer) {
			this.drawLayers = (drawLayer)? drawLayer: this.gesso.drawLayers || this.gesso;
			this.drawLayers.push({ draw: this.draw });
			return drawLayer;
		}
	});

	G.DrawObject = DrawObject;

	var Point = G.Class(DrawObject, {
		
		point: null,
		size: 2,
		lineWidth: 1,
		fillStyle: '#999',
		constructor: function(gesso, config) {
			Point.Super.call(this, gesso, config);
		},

		draw: function(context){ 
			context.beginPath();
			context.fillStyle = this.fillStyle;
			context.arc(this.point.x, this.point.y, this.size, 0, Math.PI * 2, false);
	    	context.fill();
		}
	});

	G.Point = Point;
})();

