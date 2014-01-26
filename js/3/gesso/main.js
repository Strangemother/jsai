//https://github.com/malko/l.js
(function(){var e=function(e){(window.execScript||function(e){window.eval.call(window,e)})(e)},t=function(e,t){return e instanceof(t||Array)},n=document,r="getElementsByTagName",i="replace",s="match",o="length",u="readyState",a="onreadystatechange",f=n[r]("script"),l=f[f[o]-1].innerHTML[i](/^\s+|\s+$/g,"");if(typeof ljs!="undefined"){l&&e(l);return}var c=f[f[o]-1].src[s](/checkLoaded/)?!0:!1,h=n[r]("head")[0]||n.documentElement,p=function(e,t,r){var i=n.createElement(e),s;r&&(i[u]?i[a]=function(){if(i[u]==="loaded"||i[u]==="complete")i[a]=null,r()}:i.onload=r);for(s in t)i[s]=t[s];h.appendChild(i)},d=function(e,n){if(this.aliases&&this.aliases[e]){var r=this.aliases[e].slice(0);return t(r)||(r=[r]),n&&r.push(n),this.load.apply(this,r)}if(t(e)){for(var i=e.length;i--;)this.load(e[i]);return n&&e.push(n),this.load.apply(this,e)}return e[s](/\.css\b/)?this.loadcss(e,n):this.loadjs(e,n)},v={},m={aliases:{},loadjs:function(e,t){var n=e[s]("#")?e[i](/^[^#]+#/,""):null;return n&&(e=e[i](/#.*$/,"")),v[e]===!0?(t&&t(),this):v[e]!==undefined?(t&&(v[e]=function(e,t){return function(){e&&e(),t&&t()}}(v[e],t)),this):(v[e]=function(t){return function(){v[e]=!0,t&&t()}}(t),p("script",{type:"text/javascript",src:e,id:n},function(){v[e]()}),this)},loadcss:function(e,t){var n=e[s]("#")?e[i](/^[^#]+#/,""):null;return n&&(e=e[i](/#.*$/,"")),v[e]||p("link",{type:"text/css",rel:"stylesheet",href:e,id:n},function(){v[e]=!0}),v[e]=!0,t&&t(),this},load:function(){var e=arguments,n=e[o];return n===1&&t(e[0],Function)?(e[0](),this):(d.call(this,e[0],n<=1?undefined:function(){m.load.apply(m,[].slice.call(e,1))}),this)},addAliases:function(e){for(var n in e)this.aliases[n]=t(e[n])?e[n].slice(0):e[n];return this}};if(c){var g,y,b;for(g=0,y=f[o];g<y;g++)v[f[g].src]=!0;b=n[r]("link");for(g=0,y=b[o];g<y;g++)(b[g].rel==="stylesheet"||b[g].type==="text/css")&&(v[b[g].href]=!0)}ljs=m,l&&e(l)})();

var run = function() {

	gesso = new Gesso('main');


	cw = 450;
	if(!gesso.stage) return;
	
	/*
	A first example of using a basic element 
	providing the basic registered type, followed by 
	attributes for the element. 
	Any methods will be called.
	 */
	
	gesso.stage.add('text', {
		name: 'fps',
		text: function(element){
			if(!it(element).has('__fps')) element.__fps=[];

			if(element.__fps.length > 100) {
				element.__fps.pop()
			};
			
			element.__fps.push(this.fps);
			var i = element.__fps.length,
			    _fps = 0;
			while (i--) {
			  _fps = _fps + element.__fps[i];
			}

			_fps = Math.round(_fps / element.__fps.length)

			return _fps + ' fps';

		}
	})

	return 

	gesso.stage.add({
		draw: function(context){
			Gesso.primitive.Circle(context, {
				x: gesso.centerWidth * .5,
				y: gesso.centerHeight * .5,
				r: cw * .5
			});
		}
	});

	var cx =0;
	var c = {
		name: 'foo',
		x: function(){
			gesso.centerWidth
			return cx++
		},
		y: gesso.centerHeight,
		r: 220
	}

	gesso.stage.add('circle', c);

	gesso.stage.add('circle', function(){
		return {
			x: cx,
			y: 199,
			color: 'green'
		}
	})

	gesso.stage.add('text', function(){
		return {
			name: 'fps',
			text: Math.round(this.fps)
		}
	})
	return
};

// Lets boot this baby.
(function(){
	ljs.addAliases(this.assets.js);
	ljs.load(['required', 'gesso'], function(){
		ljs.load('app', function(){
			run();
		});
	});
	return this;
}).apply({
	// Application level config
	assets: {
		js: {
			gesso: [
				'Events.js',
				'Gesso.js',
				'Stage.js',
				'Map.js',
				'primitives.js',
			],
			required: [
				//'js/vendor/underscore.js',
				'../../vendor/zoe.js',
				'../minivents.js',
			],
			app: [
				'C:/Users/jay/Documents/GitHub/themis/it.js',
			]
		}
	}
})