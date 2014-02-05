(function(){
	var Circle = G.Class(G.DrawObject, {
		
		point: null,

		/**
		 * X position of the point. If the point object exists (this.point),
		 * this is superseded.
		 * @type {Number}
		 */
		x: -1,
		y: -1,

		// radius: 20,
		size: 20,

		// strokeStyle
		strokeStyle: 'orange',
		
		// lineWidth: 2,
		width: 2,
		
		// fillStyle
		color: 'rgba(122,233,233,.3)',

		orientation: 0,
		degrees: 180,

		// closePath
		closed: true,

		constructor: function(gesso, config) {
			Circle.Super.call(this, gesso, config);
			// this.data = new Object();
			// this.data.x = this.x;
			// this.data.y = this.y;
			this.x = gesso.centerWidth;
			this.y = gesso.centerHeight;

			this.data.orientation 	= this.orientation;
			this.data.degrees 		= this.degrees;

			//this.data.lineWidth = this.lineWidth;
			//this.data.fillStyle = this.fillStyle;

		},
		
		step: function(point){
			/*
			The parent class is the first argument. This means the `this` scope
			is the reference applied to the draw loop. This is to enforce
			a clean design pattern and writing values needed within the 
			`draw` method here, ensures nasty leaks don't occur through
			a heavy classing.

			Additionally, proving a scoped methdology to this method allows
			for webwork offset and alterating the calculation steps of the
			resulting draw.

			http://www.html5canvastutorials.com/tutorials/html5-canvas-arcs/
			*/
			this.x = point.getX();
			this.y = point.getY();
			// map allowed public allowed variables to the data scope.
			this.lineWidth 		= point.lineWidth || point.width;
			// If a colour exists. Fill it.
			this.fillStyle 		= point.color 	  || this.fillStyle;
			this.strokeStyle 	= point.strokeStyle;
			this.startAngle 	= -.5 * Math.PI;
			this.endAngle 		= 1 * Math.PI;

	       	if( this.hasOwnProperty('orientation') ) {
	       		this.startAngle = (-90 + point.orientation) * (Math.PI / 180);
			};

	       	if( this.hasOwnProperty('degrees') ) {
	       		this.endAngle 	= (-90 + point.degrees + point.orientation) * (Math.PI / 180);

	       	};

	       	this.clockwise 		= point.clockwise;
			this.radius 		= point.radius || point.size;
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
		
		draw: function(context, data){
			
		    context.beginPath();
			//context.arc(data.x, data.y, data.size  , 0, Math.PI * 2, false);
	      	// context.arc(data.x, data.y, data.radius, data.startAngle, data.endAngle, false);
			context.arc(data.x, data.y, data.radius, data.startAngle, data.endAngle, data.clockwise);

			if(data.closed) context.closePath()
			

		    context.strokeStyle = data.strokeStyle;
		    context.lineWidth 	= data.lineWidth;

		    // Fill the circle if any center fill exists.
			if(data.fillStyle) {
				context.fillStyle = data.fillStyle;
				context.fill();
			}

	      	if(data.strokeStyle) {
				context.strokeStyle = data.strokeStyle;
		    	context.stroke();
	      	}

		}
	});

	G.Circle = Circle;
})();
