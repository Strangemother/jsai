/*
creature existance.
Food chain with mutations? lets begin with a simple object 
genotype storage

*/
utils = {}
poolVal = function(def, min, max){
    return {
        def: def,
        min: min,
        max: max
    }
}

genePool = {
            mass: poolVal(1, 0, 5),
            maxSpeed: poolVal(1, 0, 2),
            minSpeed: poolVal(0, 0, 2),
            motorSpeed: poolVal(1, 0, 2),
            lifespan: poolVal(-1, -1, -1),
            pointToDirection: true,
            followMouse: false,
            seekTarget: null,
            isStatic: false,
            checkEdges: true,
            wrapEdges: false,
            avoidEdges: false,
            avoidEdgesStrength: 200,
            bounciness: .75,
            maxSteeringForce: 10,
            turningRadius: 60,
            thrust: 1,
            flocking: false,
            draggable: true,
            id: 1
        }

world_data = {
    fagents: [],
    agents: [
        {
            mass: genePool.mass.def,
            maxSpeed: genePool.maxSpeed.def,
            minSpeed: genePool.minSpeed.def,
            motorSpeed: genePool.motorSpeed.def,
            lifespan: genePool.lifespan.def,
            pointToDirection: genePool.pointToDirection,
            followMouse: genePool.followMouse,
            seekTarget: genePool.seekTarget,
            isStatic: genePool.isStatic,
            checkEdges: genePool.checkEdges,
            wrapEdges: genePool.wrapEdges,
            avoidEdges: genePool.avoidEdges,
            avoidEdgesStrength: genePool.avoidEdgesStrength,
            bounciness: genePool.bounciness,
            maxSteeringForce: genePool.maxSteeringForce,
            turningRadius: genePool.turningRadius,
            thrust: genePool.thrust,
            flocking: genePool.flocking,
            draggable: genePool.draggable,
            id: genePool.id
        }
    ]
}

coefficiency = 0.01


utils.newAgent = function(agent){
    fagent = new Flora.Agent(agent);
    world_data.fagents.push(fagent);

    d = {
        flora: fagent,
        data: agent,

    }

    return d
}

utils.generateUniqueID = function(){
    agent = {
        mass: Flora.Utils.getRandomNumber(genePool.mass.min,  genePool.mass.max),
        maxSpeed: Flora.Utils.getRandomNumber(genePool.maxSpeed.min,  genePool.maxSpeed.max),
        minSpeed: Flora.Utils.getRandomNumber(genePool.minSpeed.min,  genePool.minSpeed.max),
        motorSpeed: Flora.Utils.getRandomNumber(genePool.motorSpeed.min,  genePool.motorSpeed.max)
    }
    return utils.generateID(agent)
}

utils.generateID = function() {
    
    var a = arguments;
    var agent = arg(a, 0, {})

    var val = arg(agent, 'mass', 1) 
    * (arg(agent, 'maxSpeed', 1) + arg(agent, 'minSpeed', 1))
    * (arg(agent, 'motorSpeed', 1) );

    val = String(val) + arg(agent, 'id', 'no-name');
    return murmurhash3_32_gc(val)
}

// Wheel of fortune to pick fitness mutate over period
// mutation rate
/*
    mutationRate(agentOption)
    returns value of 0-1 to denote that genes mutation rate.
    this is calculated over the span of how many mutartions this gene has undertaken.
*/
utils.mutationRate = function(value, parent){
    //'Receive a value of the agents gene option, calculate across the pool of
    //known agents to denote is current range. This range will return a 0 - 1 variancy'

    return 0 // no mutation
}

utils.mate = function(){
    //'Pass arguments to determine the genes to mate. Each object has agent properties.
    //Returned is a child with mutations in effect.'
    var parents = []
    for (var i = 0; i < arguments.length; i++) {
        var parent = arguments[i];
        parents.push({parent: parent, fitness: utils.fitness(parent)});
    };

    /*
    combine each element, evaluating each element in the agent, using the
    mutationrate as a factor for pick.
    */
    var childGenes = {}
    for (var i = 0; i < parents.length; i++) {
        var parent = parents[i];

        // loop each method.
        // get each parent mutationRate 
        //  Fit 3    4    5
        //  Mut 0.2  0.1  0.2
        //  val 3    4    4
        //  Scr 3    3    4
        debugger;
        var field = 'mass';
        // How fit the current agent is
        var fitness = parent.fitness;
        // The amount of mutation this field gene has
        var mutation = utils.mutationRate(field, parent);
        // How strong this parent's gene is.
        var victorScale = (parent.parent[field] + fitness) * mutation;

        childGenes[parent] = {
            field: field,
            mutation: mutation,
            victorScale: victorScale
        }

        // give this to the child if it doesn't have it.
        // 
    };

    return childGenes
}

utils.fitness = function(agent){
    //'The fitness function will be a comparison and return a fitness value'
    var speed = (agent.maxSpeed - agent.minSpeed) + (agent.motorSpeed + agent.thrust);
    var strength = agent.mass * agent.lifespan

    return speed * strength
}

Flora.System.start(function() {
    Flora.universe.update({
        gravity: new Flora.Vector(0, 0),
        c: coefficiency
    });

    for (var i = 0; i < world_data.agents.length; i++) {
        var agent = world_data.agents[i];
        utils.newAgent(agent)
    };
    
});




function arg(_a, ia, def, returnArray) {
    var v = null;

    // if ia is an array, find the
    // first correct definition
    if (ia.constructor  == Array) {
        /*
         * Each item is checked. if the
         * item in the array is
         * a definition within the oaet
         * arguments or object - pass it
         */
        for(var i=0; i<ia.length; i++) {
            if(_a[ia[i]]){

                v = _a[ia[i]];
                break;
            }
        }
    }
    else {
        // if ia is just a value
        if(_a[ia]) v = _a[ia];
    }

    if( (v == null) && (def != undefined) ) {
        v = def;
    };

    if(returnArray){
        return [v, ia[i]];
    }
    else
    {
        return v;
    }

}




function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 = 
          ((key.charCodeAt(i) & 0xff)) |
          ((key.charCodeAt(++i) & 0xff) << 8) |
          ((key.charCodeAt(++i) & 0xff) << 16) |
          ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1: k1 ^= (key.charCodeAt(i) & 0xff);

        k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}