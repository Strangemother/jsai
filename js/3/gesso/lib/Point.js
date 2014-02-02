/*
a point coordinates xy, xy coordinates.
Usage:

	var point = new Point()
	point.x == 0
	point.y == 0
	
	var point = new Point(1, 2);
	var point = new Point([1, 2]);
	var point = new Point({ x: 1, y: 2 });
	point.x == 1
	point.y == 2

	

	var point = new Point( 1, 2,            3, 4            );
	var point = new Point( [ 1, 2,          3, 4   ]        );
	var point = new Point( [ 1, 2 ], 	    [ 3, 4 ]        );
	var point = new Point( { x: 1: y: 2 },  { x: 3, y: 4 }  );
	var point = new Point( [{ x: 1: y: 2 }, { x: 3, y: 4 }] );

	point.x == 1
	point.y == 2

	point.x1 == 1
	point.y1 == 2
	point.x2 == 3
	point.y2 == 4


 */

Point = function(){
	
	var self = this;
	var _default = 10;
	
	this._data = {};
	this._data._x1 = null;
	this._data._y1 = null;
	this._data._x2 = null;
	this._data._y2 = null;

	var format = 'X1: %(x1)d, Y1: %(y1)d, X2: %(x2)d, Y2: %(y2)d';

	var init = function init() {
		var _args = arguments;
		if(_args.length > 0 && _args[0] !== undefined) this.add(_args);

	}

	this.getter = function(key) {

		return getterSetter(this, key, function(value, method) {
		   	//  console.log("x", method, value);
		   	if(key == 'x') key = 'x1';
		   	if(key == 'y') key = 'y1';

		    var v = self._data['_' + key];
	 		if(method == 'get') {	        
				if(v===undefined || v===null) return _default
		        if( it(v).is(Function) ) {
		        	var _v = v();
					return _v || _default;
		        } else {
		        	var _v = v;
					return _v || _default;
		        }

 		    } else if(method == 'set') {
		        if( it(v).is(Function) ) {
			    	self._data['_' + key](value);
			    } else {
			    	self._data['_' + key] = value;
			    }
		    }
		})
	};

	this.__init = init;

	this.data = function() {
		if(arguments.length == 0) {
			return this._data;
		} else {
			this.add.apply(this, arguments);
			return this;
		}
	}

	this.toFormat = function() {
		var _format = arguments[0] || this.format || format;
		return sprintf(_format, this);
	}

	this.add = function(args){
		if(args.length == 4) {
			// 4 individual points
			this._data._x1 = args[0];
			this._data._y1 = args[1];
			this._data._x2 = args[2];
			this._data._y2 = args[3];
			
		} else if(args.length == 2) {
			// 2 objects/arrays/numbers
			var arr = [];

			for (var i = 0; i < args.length; i++) {
				var argSet = args[i];
				arr[i] = [];
				var _it = it(argSet);

				if( _it.is(Array) )
				{
					arr[i] = argSet.slice(0);
				} 
				else if( _it.is(Object) )
				{
					arr[i].push(argSet.x);
					arr[i].push(argSet.y);
				}
				else if( _it.is(Number) )
				{
					if(this._data._x1 == null) {
						this._data._x1 = argSet
					} else {
						this._data._y1 = argSet
					}
				}
			};
			return this.__init.apply(this, [].concat.apply([], arr));

		} else if(args.length == 1) {

			var v = args[0]
			// an object or an array passed.
			if( it(v).is(Array) ) {
				// pass back through the system, accepting 2 points
				return this.__init.apply(this, v)
			} if( it(v).is(Object) ) {
				// unpack the object
				return this.__init.apply(this, [
						v.x1 || v.x,
						v.y1 || v.y,
						v.x2,
						v.y2
					]);
			} else {
				// All values is this value.
				return this.__init(v,v,v,v);
			}
			
		}

		this._data._x = this._data._x1 = args[0];
		this._data._y = this._data._y1 = args[1];
		this._data._x2 = args[2];
		this._data._y2 = args[3];		

	}

	var hooks = {
		x: this.getter('x'),
		y: this.getter('y'),
		x1: this.getter('x1'),
		y1: this.getter('y1'),
		x2: this.getter('x2'),
		y2: this.getter('y2'),
	}

	// this.hooks = hooks;

	init.apply(this, arguments)
}


/*
Collect the point data from a series of inputs,
Firstly try config[field] for .point. Failing, 
the point is collected from .x, .y from config[field].
following the native .point or the object config itself.

config.field.point
config.field.x/y
config.point
config.x/y
 */
Point.find = function(config, field){
    var tPoint;

    if( config[field] && it(config[field]).has('point') ){
        tPoint = new Point(config[field].point)
    } else if ( config[field] && it(config[field]).has('x') ) {
        tPoint = new Point(config[field]);
    } else if ( config && it(config).has('point') ) {
        tPoint = new Point(config.point);
    } else {
        tPoint = new Point(config);
    }
    return tPoint
}

var PointTest = function(){

	var points = [];
	points.push( ['4 flat arguments', 		  		new Point( 1, 2,            3, 4            ) ] );
	points.push( ['An array for 4 arguments', 		new Point( [ 1, 2,          3, 4   ]        ) ] );
	points.push( ['2 arrays as 2 arguments',  		new Point( [ 1, 2 ], 	      [ 3, 4 ]      ) ] );
	points.push( ['2 objects as 2 arguments ',		new Point( { x: 1, y: 2 },  { x: 3, y: 4 }  ) ] );
	points.push( ['An array of 2 objects', 			new Point( [{ x: 1, y: 2 }, { x: 3, y: 4 }] ) ] );
	points.push( ['An object of 4 arguments', 		new Point( { x1: 1, y1: 2 , x2: 3, y2: 4 }  ) ] );
	points.push( ['An object of Point type', 		new Point( new Point(1, 2, 3, 4)  			) ] );
	points.push( ['4 flat functions',	   			new Point( function(){ return 1 },
															   function(){ return 2 },
															   function(){ return 3 },
															   function(){ return 4 } 
															   ) ] );

	var fail = function(v){
		console.error('Fail', v)
	}

	var pass = function(v){
		console.log('Pass', v)
	}

	var test = function(val) {
		return function(con) {
			if(con) {
				pass(val)
			} else {
				fail(val)
			}
			return con;
		}
	}

	var f = fail, p = pass, t = test;
	
	for (var i = 0; i < points.length; i++) {
		console.log(points[i][0])
		var point = points[i][1];

		t('x1') (point.x1 == 1)
		t('y1') (point.y1 == 2)
		t('x2') (point.x2 == 3)
		t('y2') (point.y2 == 4)
	};

}

