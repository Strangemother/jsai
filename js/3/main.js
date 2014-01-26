world = {
	setup: function(canvas, simulator){
		/*
		>>> new world.setup()

		Pass a canvas to setup the world
		 */
		return
		walker = flora.walker();
		walker2 = flora.walker();

		flora.system.stim('heat')

		flora.agent({
			// seekTarget: walker,
			// location: new Vec2(200, 200)
			mass: 20
		});

		var count = 0;
		var intv = window.setInterval(function(){
			flora.agent({
				// seekTarget: (Math.random() > .49) ? walker: walker2,
			});
			count++;
			if(count>0) {
				window.clearInterval(intv)
			}
		}, 2000)

		
		return this
	},
	agents: {
		school: []
	}
}


var _loader = function(canvas, simulator){
	var setup =  world.setup(canvas, simulator);
}

