var flora = {
	// followMouse					boolean	 <optional>				// false	If true, object will follow mouse.
	// maxSteeringForce				number	 <optional>				// 10	Set the maximum strength of any steering force.
	// seekTarget					Object	 <optional>				// null	An object to seek.
	// flocking						boolean	 <optional>				// false	Set to true to apply flocking forces to this object.
	// desiredSeparation			number	 <optional>				// Twice the object's default width	Sets the desired separation from other objects when flocking = true.
	// separateStrength				number	 <optional>				// 1	The strength of the force to apply to separating when flocking = true.
	// alignStrength				number	 <optional>				// 1	The strength of the force to apply to aligning when flocking = true.
	// cohesionStrength				number	 <optional>				// 1	The strength of the force to apply to cohesion when flocking = true.
	// flowField					Object	 <optional>				// null	If a flow field is set, object will use it to apply a force.
	// sensors =					Array	 <optional>				// A list of sensors attached to this object.
	// color						Array	 <optional>				// 197, 177, 115	Color.
	// borderWidth					number	 <optional>				// 0	Border width.
	// borderStyle					string	 <optional>				// 'none'	Border style.
	// borderColor					string | Array	 <optional>		// 'transparent'	Border color.
	// borderRadius					number	 <optional>				// 0	Border radius.
	// width						number	 <optional> 			// 10	Width
	// height						number	 <optional> 			// 10	Height
	// color						string | Array	 <optional> 	// 255, 255, 255	Color.
	// motorSpeed					number	 <optional> 			// 2	Motor speed
	// angle						number	 <optional> 			// 0	Angle
	// pointToDirection				boolean	 <optional> 			// true	If true, object will point in the direction it's moving.
	// draggable					boolean	 <optional> 			// false	If true, object can move via drag and drop.
	// parent						Object	 <optional> 			// null	A parent object. If set, object will be fixed to the parent relative to an offset distance.
	// pointToParentDirection		boolean	 <optional> 			// false	If true, object points in the direction of the parent's velocity.
	// offsetDistance				number	 <optional> 			// 30	The distance from the center of the object's parent.
	// offsetAngle					number	 <optional> 			// 0	The rotation around the center of the object's parent.
	// beforeStep					function	 <optional> 		// null	A function to run before the step() function.
	// afterStep					function	 <optional> 		// null	A function to run after the step() function.
	agent: function(config) {
		var c = config || {};

		if(!c.tail) {
			c.tail = 5;
		}

		var dna = this.dna.merge(c);

		return this.burner(dna);
	},
	burner: function(config){

		var dna = this.dna.merge(config);
		// Fix up sensor
		var agent = Burner.System.add(dna.type, dna);
		
		var sensorObjects = agent.sensors.slice(0);
		agent.sensors = [];

		for (var i = 0; i < sensorObjects.length; i++) {
			var s = sensorObjects[i];
			flora.sensors.add(agent, s.type, s.behaviour)
		};

		if(agent.tail) {
			return this.tail(agent);
		} else {
			return agent
		}
	},
	system: {
		stim: function(type) {
			Burner.System.add('Stimulus', {
				type: type,
				draggable: true,
			})
		}
	},
	sensors: {
		add: function(agent, type, behaviour){
			/*
			receive a behaviour
			and return a method of which generates
			a sensor and applied it to the attached
			agent.
			 */
			var sensor = Burner.System.add('Sensor', { 
				type: type, 
				behaviour: behaviour,
			});

			agent.sensors.push(sensor);
			// debugger;
			
		}
	},
	walker: function(config){
		var dna = {
			type: 'Walker',
			borderRadius: 0,
			width: 2,
			height: 2,
			maxSteeringForce: 10,
			color: [255,20,20],		
			velocity: null	
		}

		var _dna = zoe.extend(dna, config, 'FILL')

		var agent = this.burner(_dna);
		return agent;
	},

	tail: function(agent){
		var tailCount = agent.tail || 5;
		var length = agent.tailLength || 10;
		var vectors =[];

		for (var i = 0; i < tailCount; i++) {
			var vector = new Vec2(
			agent.world.location.x + (i) + length, 
			agent.world.location.y + (i * length) + length);
			vectors.push(vector)
		    // entities
		};
		   
		var segment = world.simulator.lineSegments(vectors, 3);
		pin = segment.pin(0);
		agent.tail = pin;

		agent.afterStep = function(sim){
			this.tail.pos.x = this.location.x;
			this.tail.pos.y = this.location.y;
		}
		return agent;
	},

	dna: {
		rules: function(){
			return 'FILL'
		},
		merge: function(config){
			return zoe.extend(config, this.agent, this.rules())
		},
		agent: {
			type: 'Agent',
			color: [22, 203, 228],
			controlCamera: false,
			borderRadius: 0,
			sensors: [{ 
				type: 'heat', 
				behaviour: 'COWARD'
			}],
			draggable: true,
			borderWidth: 0,
			width: 10,
			motorSpeed: 3,
			maxSteering: 100,
			height: 2,
			flocking: false,
			borderRadius: 0,
			velocity: new Burner.Vector( Math.random(), Math.random()),
			desiredSeparation: 30,
			tail: false,

		}
	}
}