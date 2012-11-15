#Usage

##genepool

The data of which to build an agent from. This data leverages the poolVal method.

##world_data

Where data is stored

###world_data.agents

A list of all active agents.

##utils.newAgent([agent, name, callType])

+ agent data is optional - new data will be generated if nothing is passed
+ name is optional, a random sequence will be created based on the agents data.
+ callType: 
    def: 'default' values are used
    random: 'random' values are used (within genepool confines)
    min: 'min' values are used (within the genepool confines)
    max: 'max' values are used (within the genepool confines)

##utils.defaultAgent([name, callType])

get default data attributes for an agent. Call types are the same as utils.newAgent()

##utils.generateUniqueID()

Generate an ID


##utils.generateID(agent) 

Generate an ID based upon the attributes given in the mandatory 'agent' object


##utils.mutationRate(value, parent)

return a value between 0-1 to denote global mutation rate of the gene.
_not implemented_

##utils.mate(agents...)

mate one or more agents to produce new agents data inheriting attirbutes from 
the strongest parents.


##utils.wheelOfFortune(propertyList)

Supply a list of objects:

    { parent: p, value: 1, victorScale: 0, mutateVariance: .16},
    { parent: p, value: 1, victorScale: 0, mutateVariance: .16},
    { parent: p, value: 1, victorScale: 0, mutateVariance: .16}

returned will be the parent chosen and its new value.
The parent may be any identifier.

##utils.fitness(agent)

The fitness function will be a comparison and return a fitness value