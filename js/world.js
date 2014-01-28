//https://github.com/malko/l.js
(function(){var e=function(e){(window.execScript||function(e){window.eval.call(window,e)})(e)},t=function(e,t){return e instanceof(t||Array)},n=document,r="getElementsByTagName",i="replace",s="match",o="length",u="readyState",a="onreadystatechange",f=n[r]("script"),l=f[f[o]-1].innerHTML[i](/^\s+|\s+$/g,"");if(typeof ljs!="undefined"){l&&e(l);return}var c=f[f[o]-1].src[s](/checkLoaded/)?!0:!1,h=n[r]("head")[0]||n.documentElement,p=function(e,t,r){var i=n.createElement(e),s;r&&(i[u]?i[a]=function(){if(i[u]==="loaded"||i[u]==="complete")i[a]=null,r()}:i.onload=r);for(s in t)i[s]=t[s];h.appendChild(i)},d=function(e,n){if(this.aliases&&this.aliases[e]){var r=this.aliases[e].slice(0);return t(r)||(r=[r]),n&&r.push(n),this.load.apply(this,r)}if(t(e)){for(var i=e.length;i--;)this.load(e[i]);return n&&e.push(n),this.load.apply(this,e)}return e[s](/\.css\b/)?this.loadcss(e,n):this.loadjs(e,n)},v={},m={aliases:{},loadjs:function(e,t){var n=e[s]("#")?e[i](/^[^#]+#/,""):null;return n&&(e=e[i](/#.*$/,"")),v[e]===!0?(t&&t(),this):v[e]!==undefined?(t&&(v[e]=function(e,t){return function(){e&&e(),t&&t()}}(v[e],t)),this):(v[e]=function(t){return function(){v[e]=!0,t&&t()}}(t),p("script",{type:"text/javascript",src:e,id:n},function(){v[e]()}),this)},loadcss:function(e,t){var n=e[s]("#")?e[i](/^[^#]+#/,""):null;return n&&(e=e[i](/#.*$/,"")),v[e]||p("link",{type:"text/css",rel:"stylesheet",href:e,id:n},function(){v[e]=!0}),v[e]=!0,t&&t(),this},load:function(){var e=arguments,n=e[o];return n===1&&t(e[0],Function)?(e[0](),this):(d.call(this,e[0],n<=1?undefined:function(){m.load.apply(m,[].slice.call(e,1))}),this)},addAliases:function(e){for(var n in e)this.aliases[n]=t(e[n])?e[n].slice(0):e[n];return this}};if(c){var g,y,b;for(g=0,y=f[o];g<y;g++)v[f[g].src]=!0;b=n[r]("link");for(g=0,y=b[o];g<y;g++)(b[g].rel==="stylesheet"||b[g].type==="text/css")&&(v[b[g].href]=!0)}ljs=m,l&&e(l)})();

var run = function() {

	gesso = new Gesso('main');
	cw = 20
	gesso.stage.add('circle', function(){
		return {
			x: gesso.centerWidth,
			y: gesso.centerHeight,
			color: '#666'
		}
	});7

	return
	
    // simulation
    var sim = new VerletJS(canvas.width, canvas.height, canvas);
    sim.friction = COEFFICIENT;
    
    if (world) {
      world.simulator = sim;
    }
  
	Burner.System.init(function() {
		new Burner.StatsDisplay();
		_loader(canvas, sim)
	}, {
		gravity: new Burner.Vector(GRAVITY[0], GRAVITY[1]),
		c: COEFFICIENT,
		borderWidth: 1,
		  borderStyle: 'dashed',
		  borderColor: [100, 100, 100]
	});

};

// Lets boot this baby.
(function(){
	ljs.addAliases(this.assets.js);

	ljs.load(['gesso', 'required'], function(){
		ljs.load('app', function(){
			run();
		});
	});
	return this;
}).apply({
	// Application level config
	assets: {
		js: {
			required: [
				//'js/vendor/underscore.js',
				'js/vendor/zoe.js',
				//'js/vendor/verlet-1.0.0.min.js',
				//'js/vendor/burner.js',
				//'js/vendor/flora.js',
				//'js/vendor/backbone.js',
				//'js/vendor/two.js',
				//'js/vendor/keyboard.js',
				//'js/vendor/events.js',
				'js/3/minivents.js',
				'js/3/gesso/Input.js',
			],
			gesso: [
				'js/3/gesso/Events.js',
				'js/3/gesso/Stage.js',
				'js/3/gesso/Map.js',
				'js/3/gesso/primitives.js',
				'js/3/gesso/Gesso.js',
				
			],
			app: [
				'C:/Users/jay/Documents/GitHub/themis/it.js',
				//'js/3/floras.js',
				//'js/3/main.js',
				//'js/3/player.js',
			]
		}
	}
})