var ObjectManager = function(list){
	this.all =  function() {
		return list
	};

	return this;
}


var Character = function(){
	var dna = arg(arguments, 0, {});

	var ctr = {
		/*
		A character generator
		 */
		init: function(){

			ctr.agent = utils.newAgent(dna);
			ctr.objects = new ObjectManager(world_data.agents);

			return this;
		},

		mateWith: function(){
			return utils.mateByNames.apply(this, arguments)
		}
	}
	ctr.init.apply(this, arguments)

	return ctr;
}


var _loader = function(){

	// spawnSetup()
	creature = world.creatures.long({
		 
	})
}

var spawnSetup = function(){
	world.agents.spawn(10, 'walker', { 
		bounciness: .1, 
		maxSteeringForce: 100, 
		checkEdges: false, 
		motorSpeed: 2, 
		minSpeed: 1, 
		maxSpeed: 9,
		color: [20,20,20],
		borderWidth: 1,
		width: 5,
		height: 5,
		borderColor: [2,60,100]
	});
}

world = {
	timers: {
		timer: function(agent, frames) {
			debugger;
		}
	},
	rules: {
		// More light prodices 
	},
	creatures: {
		short: function(){
			return world.agents.bug({
				segments: 6,
				segmentLength: 5
			})
		},
		long: function(){
			return world.agents.bug({
				followMouse: true,
				segments: 15,
				segmentLength: 10
			})
		}
	},

	agents: {

		spawn: function(count, method){
			var dna = arg(arguments, 2, {})
			// Spawn a number of elements.
			var returns=[];
			for (var i = 0; i < count; i++) {
				var a = this[method](dna);
				returns.push(a);
			};
			return returns
		}, 
		walkers: [],

		walker: function(){
			
			var dna = arg(arguments, 0, { 	
				bounciness: .1,
				width: 5,
				stiffness: 0,
				height: 5,
				maxSteeringForce: 360,
				checkEdges: false,
				motorSpeed: 2,
				minSpeed: 1,
				maxSpeed: 9,
				borderColorwalker: [0, 102, 0], 
				color: [100,100,100] 
			});

			var agent = utils.Walker(walkerGenePool);
			z.extend(dna, agent, 'FILL');

			var _walker = Burner.System.add('Walker', dna);

			_walker.render = function(){
				// method to be called at render sequence, 
				// for addition to the canvas render loop (ie tails)
			}
			this.walkers.push(_walker);

			return _walker;
		},
		school: [],

		sensor:  {

			create: function(stimuli, behavior, name) {
				var name = arg(arguments, 2, '__lastSensor');
				var bug = arg(arguments, 3, null);
				
				if(this.hasOwnProperty(name) && name != null) {
					return this[name](bug)

				}

				this[name] = function(bug){
					
					var sensor = Burner.System.add('Sensor', {
		 					type: stimuli,
		 					behavior: behavior
		 				})
					

					if(bug) {
						sensor.target = bug;
					}

					return sensor;
				}

				return this[name](bug)
			}
		},
		bug: function(dna){
			var bugType = arg(arguments, 1, 'agent');

			z.extend(dna, { 
				bounciness: .1, 
				stiffness: 16,
				segments: 6,
				segmentLength: 10,
				followMouse: false,
				maxSteeringForce: 5, 
				checkEdges: false, 
				motorSpeed: 1, 
				minSpeed: 1, 
				maxSpeed: 4,
				color: [20, 20, 20],
				borderWidth: 1,
				width: 5,
				height: 5,
				borderStyle: 'solid',
				borderColor: [100,100, 100],
				
			}, 'FILL')

			var newbug;

			switch (bugType) {
				case 'agent':
			 		newbug = utils.newAgent(dna);
			 		
			 		break;
			 	case 'walker':
			 		newbug = this.walker(dna);
			 		break;

			 	default:
			 		newbug = this.character(dna);
			}

			var vectors =[];
			
			for (var i = 0; i < newbug.segments; i++) {
				var vector = new Vec2(
					newbug.world.location.x + (i) + newbug.segmentLength, 
					newbug.world.location.y + (i * newbug.segmentLength) + newbug.segmentLength);
				vectors.push(vector)
			};
			
			this.school.push(newbug);
		    
		    // entities
		    var segment = world.simulator.lineSegments(vectors, 3);

		    pin = segment.pin(0);
		    newbug.tail = pin;

		    newbug.render = function(sim){
      			this.tail.pos.x = this.flora.location.x;
      			this.tail.pos.y = this.flora.location.y;

		    }

			
		    return newbug;
		},

		character: function(){
			var dna = arg(arguments, 0, {});


			return new Character(dna);			
		}
		
	}


}



// document.addEventListener('DOMContentLoaded', _loader)