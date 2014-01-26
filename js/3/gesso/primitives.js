
Gesso.primitive.Circle = function circle(context, config, scope) {
	var circle = Gesso.renderConfig(config, scope);

    context.beginPath();
    context.strokeStyle = circle.color || '#CCC'
    context.lineWidth 	= 1

    var orient 			= ( (2 / 360) * ( (circle.orientation || 0) + -90) ) * Math.PI;
    var _arcStart 		= orient + ( (2 / 360) * (circle.arcStart ||  0) ) * Math.PI;
    var _arc 			= orient + ( (2 / 360) * (circle.arcSize || 0) ) * Math.PI || 60;
    
    var _x = circle.x || 10,
        _y = circle.y || 10;
     
    context.arc( _x, _y, circle.r || 10, 0, Math.PI*2);
    context.stroke();
    Gesso.primitive.Point(context, {x: _x, y: _y});
};

Gesso.primitive.Point = function point(context, config) {
	var point = Gesso.renderConfig(config) || {};
	context.beginPath();
    context.fillStyle = point.color || '#999';

    var _x = point.x || 10,
        _y = point.y || 10;

    context.arc( _x, _y, 2, 0, Math.PI * 2, false);
    context.fill();
};

Gesso.primitive.Text = function text(context, config, scope) {
    var text = Gesso.renderConfig(config, scope),
        cit = it(config),
        x = config.x || 10,
        y = config.y || 10;

    context.font = 'normal 12px Calibri';
    if( cit.is(String) ) {
        context.fillText(config, x, y);
    } else if( cit.is(Object) ) {
        context.fillText( text.text || text.label || 'Text', x,y);
    }
}

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
    var line = Gesso.renderConfig(config, scope),
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
}

