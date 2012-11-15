describe('Utils tests', function(){
  it('generating a random id from nothing', function(){
    expect(utils.generateID()).toEqual(2927126750)
  })
})

describe('PoolVal with (null)', function(){
    var p = poolVal(null)
    it('all returns should be null', function(){
        expect(p.def).toBe(null);
        expect(p.min).toBe(null);
        expect(p.max).toBe(null);
        expect(p.random).toBe(null);
    });

    it('all returns should be false', function(){
        var p =     poolVal(false)
        expect(p.def).toBe(false);
        expect(p.min).toBe(false);
        expect(p.max).toBe(false);
    });

    it('all returns should be true', function(){
        var p = poolVal(true)
        expect(p.def).toBeTruthy();
        expect(p.min).toBeTruthy();
        expect(p.max).toBeTruthy();
    });
})

describe('Seed Generator', function(){
    var seed = utils.seedValue();
    var seed1 = utils.seedValue('flappy');
    var seed2 = utils.seedValue('flappy');
    var seed3 = utils.seedValue('fishy');
    var seed4 = utils.seedValue('fishy');
    expect(seed).toBe(1)
    expect(seed1).toBe(seed2)
    expect(seed3).toBe(seed4)
})