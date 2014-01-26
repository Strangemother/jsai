Gesso.primitive = {};
Gesso.Addons = {}

Gesso.renderPrimitive = function(dict, scope) {
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



    for (var prop in dict) {
        if (dict.hasOwnProperty(prop)) {
            var p = dict[prop];
            rd[prop] = dict[prop];
            // If the given element is a function, it should be
            // called to return a value
            if( p && it(p).is(Function) ) {
                rd[prop] = dict[prop].apply(scope||this, [scope.stage.get(dict.name)])
            } 
        }
    }

    for (var addon in Gesso.Addons) {
        if (Gesso.Addons.hasOwnProperty(addon)) {
            Gesso.Addons[addon];
        }
    }
    return rd;
}


Gesso.primitive.Circle = function circle(context, config, scope) {
	var circle = Gesso.renderPrimitive(config, scope);

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
    Gesso.primitive.Point(context, {x: _x, y: _y});
};

Gesso.primitive.Point = function point(context, config) {
	var point = Gesso.renderPrimitive(config) || [10, 10];
	context.beginPath();
    context.fillStyle = point.color || '#999';

    var _x = point[0] || point.x || point.point.x || point.point[0] || 10,
        _y = point[1] || point.y || point.point.y || point.point[1] || 10;

    context.arc( _x, _y, point.size || 2, 0, Math.PI * 2, false);
    context.fill();
};

Gesso.primitive.Text = function text(context, config, scope) {
    var text = Gesso.renderPrimitive(config, scope),
        cit = it(config),
        x = (config.point)? config.point.x: config.x || 10,
        y = (config.point)? config.point.y: config.y || 10;

    context.font = 'normal 12px Calibri';
    if( cit.is(String) ) {
        context.fillText(config, x, y);
    } else if( cit.is(Object) ) {
        context.fillText( text.text || text.label || 'Text', x,y);
    }
};

Gesso.primitive.Line = function line(context, config, scope) {
    /*
    config = {
        a: [0,0],
        b: [0,0]
    }

    gesso.stage.add('line');
    gesso.stage.add('line', { a: [10, 30], b:[50, 90] });
    gesso.stage.add('line', [10, 20, 30, 40]);
    gesso.stage.add('line', [{x: 20, y: 30}, 
                             {x: 40, y: 66}]);
    */
    var line = Gesso.renderPrimitive(config, scope),
        cit = it(config);

    var ax = 10, 
        ay = 20, 
        bx = 100, 
        by = 20;

    if( cit.is(Array) ) {

        if( it(config[0]).is(Object) ) {
            ax = config[0].x;
            ay = config[0].y;
        } else {
            if( config[0] ) ax = config[0];
            if( config[1] ) ay = config[1];        
        }

        if( it(config[1]).is(Object) ) {
            bx = config[1].x;
            by = config[1].y;
        } else if( it(config[2]).is(Number) ){
            if( config[2] ) bx = config[2];
            if( config[3] ) by = config[3];
        }

    } else if( cit.is(Object) ) {
        var from = 'from', 
            fromX = 0,
            fromY = 1,
            to = 'to',
            toX = 0,
            toY = 1;

        if( cit.has('a') ) {
            from = 'a'
        }

        if(config[from] && it(config[from]).is(Object) ) {
            fromX = 'x';
            fromY = 'y';
        }
        
        if( cit.has('b') ) {
            to = 'b'
        }
       
        if(config[to] && it(config[to]).is(Object) ) {
            toX = 'x';
            toY = 'y';
        }
        
        ax = it(config).has(from)? config[from][fromX]: ax;
        ay = it(config).has(from)? config[from][fromY]: ay;
        bx = it(config).has(to)? config[to][toX]: bx;
        by = it(config).has(to)? config[to][toY]: by;
        

    } else {
        if(!config[from]) config[from] = {};
        config[from][0] = config[from].x = ax;
        config[from][1] = config[from].y = ay;
        
        if(!config.b) config.b = {};
        config.b[0] = config.b.x = bx;
        config.b[1] = config.b.y = by;
    }



    context.beginPath();    
    context.moveTo(ax,ay);
    context.lineTo(bx,by);
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
        });
        
    };
    
    context.restore()
};

Gesso.animate = {}

Gesso.animate.range = function(property, from, to) {
    debugger;
}