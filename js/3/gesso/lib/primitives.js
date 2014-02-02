Gesso.primitive = {};
Gesso.Addons = {}

Gesso.renderPrimitive = function(dict, scope, context) {
    /*
    Accepts an object and returns a fully rendered item
    with all methods within the dictionary called.
     */
    
    dict = dict || {}
    var rd = {};

    if( it(dict).is(Function) ){
        dict = dict(scope)
    } else if( it(dict).is(String) ){
        return dict;
    }

    /**
     * Returns a dictionary of values provided from the addon methods
     * applied through the Gesso addons. 
     * @param  {Object} primitiveData dictionary of data for the interface
     * object.
     * @return {Object}               to be merged with the primitiveData
     */
    var addons = function(primitiveData, context){

        var data;
        
        if(!primitiveData.addons) return {};
        
        for (var i = primitiveData.addons.length - 1; i >= 0; i--) {
            var addon = primitiveData.addons[i]
            if (Gesso.Addons.hasOwnProperty(addon)) {
                var _a = Gesso.Addons[addon];
                data = _a.primitive;
                
                // The stored primitive to override the current 
                // value; may be a function.
    			if( it(_a.primitive).is(Function) ) {
                    data =_a.primitive(context, primitiveData)
                }
                // merge the data with data.

                if( it(_a).has('draw') ) {
                    _a.draw(context, primitiveData, this)
                }
            }        
        }

        return data;
    }
    
    var addonData = addons.call(scope, dict, context);
    var da = zoe.extend({}, dict, 'FILL');
    zoe.extend(da, addonData, 'REPLACE');
   
    for (var prop in da) {
        if (da.hasOwnProperty(prop)) {
            var p = da[prop];
            rd[prop] = da[prop];
            // If the given element is a function, it should be
            // called to return a value
            if( p && it(p).is(Function) ) {
				// the last value given for this property is the first argument,
				// therefore a function can be pass through. 
				// If the value hasn't been overridden, the original value is returned. 
				// At this point; either can be null; 
				var lastVal = (rd[prop] != da[prop])? rd[prop]: dict[prop],
					stage = scope.stage.get(da.name || da.__DisplayObject);
                rd[prop] = da[prop].apply(scope||this, [lastVal, stage, context])
            } 
        }
    }

    
    return rd;
}




Gesso.primitive.Circle = function circle(context, config, scope) {
	var circle = Gesso.renderPrimitive(config, scope, context);

    context.beginPath();
    context.strokeStyle = circle.color || '#CCC'
    context.lineWidth 	= 1

    var orient 			= ( (2 / 360) * ( (circle.orientation || 0) + -90) ) * Math.PI;
    var _arcStart 		= orient + ( (2 / 360) * (circle.arcStart ||  0) ) * Math.PI;
    var _arc 			= orient + ( (2 / 360) * (circle.arcSize || 0) ) * Math.PI || 60;
    
    var _x = circle.x || scope.centerWidth,
        _y = circle.y || scope.centerHeight;
     
    context.arc( _x, _y, circle.r || 10, 0, Math.PI*2);
    context.stroke();
    Gesso.primitive.Point(context, {x: _x, y: _y}, scope);

    return config
};

Gesso.primitive.Point = function point(context, config, scope) {
	var point = Gesso.renderPrimitive(config, scope) || [10, 10];
	context.beginPath();

    context.fillStyle = point.color || '#999';

    var _x 		= point[0] || point.x,
		_pointX = (it(point).has('point'))? point.point.x || point.point[0]: null,
        _y 		= point[1] || point.y,
		_pointY = (it(point).has('point'))? point.point.y || point.point[1]: null;

    context.arc( _x, _y, point.size || 2, 0, Math.PI * 2, false);
    context.fill();
};

Gesso.primitive.Text = function text(context, config, scope) {
    var text = Gesso.renderPrimitive(config, scope),
        cit = it(config),
        point = Point.find(config, 'point'),
        fontName = config.fontName || config.font || 'Calibri',
        fontSize = config.fontSize || config.size || '12px';

    if( it(fontSize).is(Number) ) {
        fontSize = String(fontSize) + 'px'
    }
    context.font = 'normal ' + fontSize + ' ' + fontName;
    context.fillStyle = config.color || config.fontColor || config.fillStyle
    context.textAlign = config.align || config.alignment || config.textAlign || 'start';
    context.textBaseline = config.textBaseline || config.baseline || config.horizontalAlign || config.base || 'alphabetic';

    if( cit.is(String) ) {
        
        context.fillText(config, point.x, point.y);
    } else if( cit.is(Object) ) {
        // User can pass a Point object. The variables are 
        // flatten
        var _t = text.text || text.label || 'Text'

        // Render point object.
        if(text.text.constructor == Point) {
            _t = text.text.toFormat()
        }
        
        context.fillText( _t, point.x, point.y);
    }
};

Gesso.primitive.Crosshair = function crosshair(context, config, scope) {
        var lineColor = config.color || '#ddd';
        Gesso.primitive.Line(context, {
            color: lineColor,
            point: [
                {
                    x: function(){ 
                        return config.x
                    }, 
                    y: function(){ 
                        return gesso.height
                    }
                }, {
                    x: function(){ 
                        return config.x
                    }, 
                    y: function(){ 
                        return 0
                    }
                }
            ]
        }, this)

        Gesso.primitive.Line(context, {
            color: lineColor,
            point: [
                {
                    x: function(){ 
                        return 0
                    }, 
                    y: function(){ 
                        return config.y
                    }
                }, {
                    x: function(){ 
                        return gesso.width
                    }, 
                    y: function(){ 
                        return config.y
                    }
                }
            ]
        }, this)

        if(config.text === undefined) config.text = true;

        if(config.text) {
            var point = Point.find(config, 'text');
            point.format = 'X: %(x)d';

            Gesso.primitive.Text(context, {
                text: point,
                point: [point.x + 10, point.y - 50],
                color: '#aaa',
            }, this);

            point.format = 'Y: %(x)d';
            Gesso.primitive.Text(context, {
                text: point,
                point: [point.x + 50, point.y - 10],
                color: '#aaa',
            }, this);

        }
}

Gesso.primitive.Line = function line(context, config, scope) {
    /*
    config = {
        a: [0,0],
        b: [0,0],
        color: '#333'
    }

    gesso.stage.add('line');
    gesso.stage.add('line', [ [10, 30], [50, 90] ]);
    gesso.stage.add('line', [10, 20, 30, 40]);
    gesso.stage.add('line', [{x: 20, y: 30}, 
                             {x: 40, y: 66}]);
    
    gesso.stage.add('line', {x: 10, y: 10, x2: 100, y2: 200})
    */
    var line = Gesso.renderPrimitive(config, scope);	
    var point = new Point(config.point || config);

    context.beginPath();
    context.moveTo(point.x1, point.y1);
    context.lineTo(point.x2, point.y2);

    context.strokeStyle = config.color || config.strokeStyle || '#999'
    context.stroke();
};

Gesso.primitive.Triangle = function triangle(context, config, scope) {
    var point = Gesso.renderPrimitive(config, scope) || {},
        pointCount = 3,
        pointSize =  2;
    var _x = ( it(point).has('x') )? point.x: point[0] || scope.centerWidth,
        _y = ( it(point).has('y') )? point.y: point[1] || scope.centerHeight;
    
    context.save();
    context.translate(_x, (_y - (pointSize * .5) ) );
    
    if(!config.points) {

        config.points =function (){
            var size = (config.size || 20);
            var h =  size * (Math.sqrt(3) / 2);

            var a = [
                [1, -h / pointCount - 1],
                [-size / pointCount - 1, h / pointCount - 1],
                [size / pointCount - 1, h / pointCount - 1]
            ]

            return a;
        }
    }

        
    /*
    
    context.moveTo(0, -h / 2);
    context.lineTo( -side / 2, h / 2);
    context.lineTo(side / 2, h / 2);
    context.lineTo(0, -h / 2);
     */
    var _points
    if( it.is(Function, config.points) ) {
        _points = Gesso.renderPrimitive(config.points, scope) || {};
        var _pa = [];
        for (var prop in _points) {
            if (_points.hasOwnProperty(prop)) {
                _pa.push(_points[prop]);
            }
        }
        _points = _pa
    } else {
        _points = config.points;
    }

    for (var i = _points.length - 1; i >= 0; i--) {
        var _point = _points[i];
        var point = Gesso.renderPrimitive(config, scope) || {};

        // Point should inherit properties from parent (color etc...) if 
        // not explicit defined.
        
        // if the property exists.
        Gesso.primitive.Point(context, {
            point: _point,
            color: '#999',
            size: pointSize
        }, scope);
        
    };
    
    context.restore()
};
