	gesso.stage.add({
		draw: function(context){
			Gesso.primitive.Circle(context, {
				x: gesso.centerWidth * .5,
				y: gesso.centerHeight * .5,
				r: cw * .5
			});
		}
	});

	var cx =0;
	var c = {
		name: 'foo',
		x: function(){
			gesso.centerWidth
			return cx++
		},
		y: gesso.centerHeight,
		r: 220
	}

	gesso.stage.add('circle', c);

	gesso.stage.add('circle', function(){
		return {
			x: cx,
			y: 199,
			color: 'green'
		}
	})

	gesso.stage.add('text', function(){
		return {
			name: 'fps',
			text: Math.round(this.fps)
		}
	})