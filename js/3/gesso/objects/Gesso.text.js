(function(){
	var Text = G.Class(G.Point, {
		constructor: function(gesso, config) {
			Text.Super.call(this, gesso, config);
			if( config ) {
				this.text = config.text || this.text;
				this.size = config.size || this.size;
			}

		},
		
		size: 12,
		text: 'new label!',
		fillStyle: 'green',

		step: function(text, gesso){
			
			// map allowed public allowed variables to the data scope.
			var cit 		= it(text.text);
			// this.lineWidth 	= text.lineWidth;
			this.fillStyle 	= text.fillStyle;
			var size 		= text.size;
			this.x 			= text.getX();
			this.y 			= text.getY();
		    this.text 		= text.text || this.text;
	        this.fontName 	= this.font || this.fontName || 'Calibri';
	        this.fontSize 	= size || this.fontSize || '12px';
		    this.textBaseline = text.textBaseline || text.base || 'top';

		    if( it(this.fontSize).is(Number) ) {
		        this.fontSize = String(this.fontSize) + 'px'
		    }

		    if( cit.is(Object) ) {
		        this.text = text.text || text.label || 'Text';
		    }

		    if( it(this.text).is(Function) ) {
		    	this.text = this.text.call(this, gesso)
		    }
		}, 

		draw: function(context, data){ 
		    context.font 		= 'normal ' + data.fontSize + ' ' + data.fontName;
		    context.fillStyle 	= data.fillStyle
		    context.textAlign 	= data.textAlign 		|| 'start';
		    context.textBaseline = data.textBaseline 	|| 'top';
		    context.fillText( data.text, data.x, data.y);
		}
	});

	G.Text = Text;
})();
