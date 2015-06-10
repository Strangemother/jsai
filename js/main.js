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
	

	spawnSetup()
}


var spawnSetup = function(){
	world.agents.spawn(100, 'walker', { 
		bounciness: .1
		, maxSteeringForce: 360
		, checkEdges: false
		, motorSpeed: 2
		, minSpeed: 1
		, maxSpeed: 9
		, color: [20,20,20]
		, borderWidth: 1
		, width: 5
		, height: 5
		, borderColor: [2,60,100] 
		, followMouse: true
	});

	world.agents.spawn(10, 'character', { 
		bounciness: .1
		, maxSteeringForce: 360
		, checkEdges: false
		, motorSpeed: 2
		, minSpeed: 1
		, maxSpeed: 9
		, color: [90,120,120]
		, borderWidth: 1
		, width: 5
		, height: 5
		//, borderColor: [2,60,100] 
		, followMouse: true
	});


}

world = {

	rules: {
		// More light prodices 
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
				height: 5,
				maxSteeringForce: 360,
				checkEdges: false,
				motorSpeed: 2,
				minSpeed: 1,
				maxSpeed: 9,
				borderColor: [0, 102, 0], 
				color: [100,100,100] 
			});
			var agent = utils.Walker(walkerGenePool);
			z.extend(dna, agent, 'FILL');

			var _walker = Burner.System.add('Walker', dna);
			this.walkers.push(_walker);

			return _walker;
		},

		character: function(){
			var dna = arg(arguments, 0, {});
			return new Character(dna);			
		}
		
	}


}



document.addEventListener('DOMContentLoaded', _loader)