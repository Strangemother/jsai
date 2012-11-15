/*
creature existance.
Food chain with mutations? lets begin with a simple object 
genotype storage

*/
utils = {}
poolVal = function(){
    var def = arg(arguments, 0, null);
    var min = arg(arguments, 1, null);
    var max = arg(arguments, 2, null);


    if(typeof(def) == 'boolean') {

        max = min = def
    }

    var obj = {
        def: def,
        min: min,
        max: max
    };
    var funcs = {get:function(){
        var randomVal = getRandomArbitary(min, max);
        switch(typeof(def)) {
            case 'boolean':
                return Boolean(Math.round(Math.random()))
                break;
            case 'object':
                return def

        }
        return randomVal;
    }, set:function(){}};
    Object.defineProperty(obj, "random", funcs);

    return obj
} 



genePool = {
            mass: poolVal(1, 0, 5),
            maxSpeed: poolVal(1, 0, 2),
            minSpeed: poolVal(0, 0, 2),
            motorSpeed: poolVal(1, 0, 2),
            lifespan: poolVal(-1, -1, -1),
            pointToDirection: poolVal(true),
            followMouse: poolVal(false),
            seekTarget: poolVal(null),
            isStatic: poolVal(false),
            checkEdges: poolVal(true),
            wrapEdges: poolVal(false),
            avoidEdges: poolVal(false),
            avoidEdgesStrength: poolVal(200, 0, 400),
            bounciness: poolVal(.75, 0, 1),
            maxSteeringForce: poolVal(10, 0, 11),
            turningRadius: poolVal(60, 0, 180),
            thrust: poolVal(1, 0, 2),
            flocking: poolVal(false),
            draggable: poolVal(true),
            id: 1
        }

world_data = {
    fagents: [],
    agents: [

    ]
}

coefficiency = 0.01

/*
Create a new agent to implement to the universe.

arg 0 - agentdata: new agent, 
arg 1 - name: null
arg 2 - call type: 'def'
*/
utils.newAgent = function(){
    var defaultName = null
    var agent = arg(arguments, 0, utils.defaultAgent( 
            arg(arguments, 1, defaultName), // name is argument 1 or defaultName
            arg(arguments, 2, 'def') // call type; random, min, max
        )
    )


    fagent = new Flora.Agent(agent);

    // If this agent data has been created by a mating, the
    // information of the new agent will be within .agent
    //world_data.agents.push(agent.agent || agent);

    d = {
        flora: fagent,
        data: agent,
    }
    world_data.agents.push(agent);

    return d
}

function getRandomArbitary (min, max) {

    return Math.random() * (max - min) + min;
}


utils.defaultAgent = function() {
    var name = arg(arguments, 0, utils.generateUniqueID())
    var methodCall = arg(arguments, 1, 'def') // min, max, random (within the min max range)
    return {
        mass: genePool.mass[methodCall],
        maxSpeed: genePool.maxSpeed[methodCall],
        minSpeed: genePool.minSpeed[methodCall],
        motorSpeed: genePool.motorSpeed[methodCall],
        lifespan: genePool.lifespan[methodCall],
        pointToDirection: genePool.pointToDirection[methodCall],
        followMouse: genePool.followMouse[methodCall],
        seekTarget: genePool.seekTarget[methodCall],
        isStatic: genePool.isStatic[methodCall],
        checkEdges: genePool.checkEdges[methodCall],
        wrapEdges: genePool.wrapEdges[methodCall],
        avoidEdges: genePool.avoidEdges[methodCall],
        avoidEdgesStrength: genePool.avoidEdgesStrength[methodCall],
        bounciness: genePool.bounciness[methodCall],
        maxSteeringForce: genePool.maxSteeringForce[methodCall],
        turningRadius: genePool.turningRadius[methodCall],
        thrust: genePool.thrust[methodCall],
        flocking: genePool.flocking[methodCall],
        draggable: genePool.draggable[methodCall],
        id: name
    }
}
/*
Generate a new unqiue ID for use with naming
*/
utils.generateUniqueID = function(){
    agent = {
        mass: Flora.Utils.getRandomNumber(genePool.mass.min,  genePool.mass.max),
        maxSpeed: Flora.Utils.getRandomNumber(genePool.maxSpeed.min,  genePool.maxSpeed.max),
        minSpeed: Flora.Utils.getRandomNumber(genePool.minSpeed.min,  genePool.minSpeed.max),
        motorSpeed: Flora.Utils.getRandomNumber(genePool.motorSpeed.min,  genePool.motorSpeed.max)
    }
    return utils.generateID(agent)
}

/* 
Generate a predicable ID based on an inputted agent */
utils.generateID = function() {
    
    var a = arguments;
    var agent = arg(a, 0, {})

    var val = arg(agent, 'mass', 1) 
    * (arg(agent, 'maxSpeed', 1) + arg(agent, 'minSpeed', 1))
    * (arg(agent, 'motorSpeed', 1) ) + arg(agent, 'followMouse', genePool.followMouse);

    val = String(val) + arg(agent, 'id', 'no-name');
    return murmurhash3_32_gc(val) // + arg(agent, 'id', 'no-name');
}

// Wheel of fortune to pick fitness mutate over period
// mutation rate
/*
    mutationRate(agentOption)
    returns value of 0-1 to denote that genes mutation rate.
    this is calculated over the span of how many mutartions this gene has undertaken.
*/
/*
Calculate the mutation rate of a gene (value) by receiving a percentile of the
current mutation across the entire gene pool.
*/
utils.mutationRate = function(value, parent){
    //'Receive a value of the agents gene option, calculate across the pool of
    //known agents to denote is current range. This range will return a 0 - 1 variancy'

    return 0 // no mutation
}

/*
Create a child element with new properties, inheriting the data from 2+ 
parents.

Factors are considered such as health, gene mutation rates, victorScale
*/
utils.mate = function(){
    //'Pass arguments to determine the genes to mate. Each object has agent properties.
    //Returned is a child with mutations in effect.'
    var parents = []
    var flatten = false;
    for (var i = 0; i < arguments.length; i++) {
        var parent = arguments[i];
        if(arguments[i].data){
            var parent = arg(arguments[i].data, 'genes', arguments[i])
        }
        //var parent = arguments[i].data.genes ||  arguments[i];
        parents.push({parent: parent, fitness: utils.fitness(parent)});
    };

    /*
    combine each element, evaluating each element in the agent, using the
    mutationrate as a factor for pick.
    */
    var childGenes = {}

    for (var i = 0; i < parents.length; i++) {
        // console.log("Looking at parent", parent)
        var parent = parents[i];
        

        // read each parent property
        // Create a tree of nested calcualtions.
        var significantParent = parent.parent
        for(var prop in significantParent) {
            var field = prop;
            var name = utils.generateID(significantParent)
            // How fit the current agent is
            var fitness = parent.fitness;
            // The amount of mutation this field gene has
            var mutation = utils.mutationRate(field, parent);
            // How strong this parent's gene is. 
            var victorScale = (Number(significantParent[field]) * mutation) + fitness;
            
            if(!childGenes[name]){
                childGenes[name]  = {}
            }

            childGenes[name][prop] = {
                parent: name,
                field: field,
                mutation: mutation,
                victorScale: victorScale,
                value: significantParent[prop]
            }
        }
        // give this to the child if it doesn't have it.
        // 
    }

    // console.log("child genes ready, ", childGenes)
    // gene values created after wheelOfFortune mating of all parents.
    var matedGenes = {}
    matedGenes.genes = {}
    matedGenes.agent = {}
    // loop each property in each parent
    for(var parent in childGenes){
        
        // loop each property in the loop, creating a list
        for(var prop in childGenes[parent]) {
            
            var parentValues = []
            for(var _parent in childGenes) {
                parentValues.push(childGenes[_parent][prop])
            } 
            
            matedGenes.genes[prop] = utils.wheelOfFortune(parentValues);
            matedGenes.agent[prop] = matedGenes.genes[prop].value || matedGenes.genes[prop].val;
            // convert flattened values to genepool defined values.
            if(genePool[prop]) {
                //debugger;
                var geneType = typeof(genePool[prop]);
                if(geneType == 'boolean') {
                    matedGenes.agent[prop] = Boolean(matedGenes.agent[prop])
                }
            } else {
                console.log(prop, 'missing from genePool', genePool)
            }
        }

        // console.log(matedGenes)
        break;
    }

    // Loop though each object property in the child string.
    // factoring 
    // mutationValue = mutation: a decmal value denoting the current mutation level. e.g. 0.001
    // mutateVariance = value * mutationValue
    // Send this object to the wheel of fortune to determine the final value
    // newValue = utils.wheelOfFortune([ 
    //                              { parent: p, value: 1, victorScale: 0, mutateVariance: .16},
    //                              { parent: p, value: 1, victorScale: 0, mutateVariance: .16},
    //                              { parent: p, value: 1, victorScale: 0, mutateVariance: .16}
    //                                 ])
    //WheelOffortune(value, victorScale, mutateVariance)
    // field = newValue
    var returnData = matedGenes;
    if(flatten) {
        returnData = matedGenes.agent;
        returnData.genes = matedGenes.genes
    }   

    return returnData;
}

utils.wheelOfFortune = function(propertyList){
    /*
    Supply a list of objects:
    { parent: p, value: 1, victorScale: 0, mutateVariance: .16},
    { parent: p, value: 1, victorScale: 0, mutateVariance: .16},
    { parent: p, value: 1, victorScale: 0, mutateVariance: .16}

    returned will be the parent chosen and its new value.
    The parent may be any identifier.
    */

    // get percentile.
    // debugger;
    var size = propertyList.length
    var total = 0
    //console.log('spinning wheelOfFortune on', size, 'parents')
    for (var i  = propertyList.length - 1; i >= 0; i--) {
         var val = (propertyList[i].value * propertyList[i].victorScale) // * propertyList[i].mutation;
         total += val;
         propertyList[i].val = val
         //console.log(propertyList[i].parent, propertyList[i].field, 'has a score of', val, ' + mutationVariance', propertyList[i].mutation);
    };

    winner = {};
    winner.val =0
    for (var i = propertyList.length - 1; i >= 0; i--) {
        var element = propertyList[i];
        if(total == 0) total = 1;
        var percent = ( (100 / total) * propertyList[i].val ) + element.mutation;
        //console.log(element.parent, element.field, propertyList[i].val,  percent + '%')
        
        // who wins
        
        var winnerVal = percent % propertyList[i].val;
        if(winnerVal > winner.val) {
            winner = element;
            winner.winnerVal = winnerVal;
        }
    };

    // console.log(winner)
    // get the winner value between 0 and total.
    return winner
}

utils.fitness = function(agent){
    //'The fitness function will be a comparison and return a fitness value'
    var speed = (agent.maxSpeed - agent.minSpeed) + (agent.motorSpeed + agent.thrust);
    var strength = agent.mass * agent.lifespan

    return (speed * strength) * -1
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




// ------------------------------------------------------------------------------------------------


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