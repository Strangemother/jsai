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
        expect(p.def).toBeFalsy();
        expect(p.min).toBeFalsy();
        expect(p.max).toBeFalsy()
    });

    it('all returns should be true', function(){
        var p = poolVal(true)
        expect(p.def).toBeTruthy();
        expect(p.min).toBeTruthy();
        expect(p.max).toBeTruthy();
    });
})