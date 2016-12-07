(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var draw = require("aframe-draw-component").component;
var textwrap = require("aframe-textwrap-component").component;
AFRAME.registerComponent("draw", draw);
AFRAME.registerComponent("textwrap", textwrap);

function returnMovieName(data) {
    console.log(data.Title);
}
function getMovieName(query) {
    $.ajax({
        url: 'http://omdbapi.com',
        type: "GET",
        dataType: "JSON",
        data: {
          t: query
        }
    }).done(returnMovieName);
}
$(document).ready(function() {
    $("a-box").on("click", function() {
        getMovieName($(this).attr("id"));
    });
    $("a-cylinder").on("click", function() {
        getMovieName($(this).attr("id"));
    });
});

},{"aframe-draw-component":2,"aframe-textwrap-component":3}],2:[function(require,module,exports){
module.exports.component = {
	schema: {
		width: {
			default: 256
		},
		height: {
			default: 256
		},
		background: {
			default: "#FFFFFF"
		}
	},

	init: function () {
		this.registers = []; //order of eventing after render
		this.update();
	},

	register: function(render) {
		this.registers.push(render);
	},

	update: function (oldData) {
		if (!oldData) this.createCanvas(this.data.width, this.data.height);
	},

	createCanvas: function (w, h) {
		var _ = this;
		var canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		canvas.style = "display: none";
		_.canvas = canvas;
		_.ctx = canvas.getContext("2d");

		this.texture = new THREE.Texture(_.canvas); //renders straight from a canvas
		if(this.el.object3D.children.length > 0) { //backwards compatibility
			this.el.object3D.children[0].material = new THREE.MeshBasicMaterial();
			this.el.object3D.children[0].material.map = this.texture;
		}
		else { //backwards compatibility
			this.el.object3D.material = new THREE.MeshBasicMaterial();
			this.el.object3D.material.map = this.texture;
		}
		if(!this.el.hasLoaded) this.el.addEventListener("loaded", function() {
			_.render();
		});
		else _.render();
	},

	render: function() {
		if(this.registers.length > 0) { //backwards compatibility
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = this.data.background;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.registers.forEach(function(item) {
				item();
			});
		}
		this.texture.needsUpdate = true;
	},

	//not the most removable component out there, so will leave blank for now
	remove: function () {}
};

},{}],3:[function(require,module,exports){
module.exports.component = {
	dependencies: ["draw"],
	schema: {
		text: {
			default: "Sample Text"
		},
		x: {
			default: 5
		},
		y: {
			default: 20
		},
		font: {
			default: "20px sans-serif"
		},
		color: {
			default: "#000000"
		},
		textAlign: {
			default: "start"
		},
		textBaseline: {
			default: "alphabetic"
		},
		direction: {
			default: "inherit"
		},
		width: {
			default: 256
		},
		lineHeight: {
			default: 20
		}
	},

	/**
	 * Called once when component is attached. Generally for initial setup.
	 */
	init: function () {
		this.draw = this.el.components.draw;
		this.draw.register(this.render.bind(this));
	},

	/**
	 * Called when component is attached and when component data changes.
	 * Generally modifies the entity based on the data.
	 */
	update: function () {
		this.filterEscapeUrl(); //for escaping colons, semicolons, etc
		this.draw.render();
	},

	filterEscapeUrl: function () {
		var match = this.data.text.match(/^url\((.*)\)$/);
		if (match) this.data.text = match[1];
	},

	render: function () {
		var ctx = this.draw.ctx;
		var canvas = this.draw.canvas;

		if (this.data.bg) {
			ctx.fillStyle = this.data.bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		ctx.fillStyle = this.data.color;
		ctx.font = this.data.font;
		ctx.textAlign = this.data.textAlign;
		ctx.textBaseline = this.data.textBaseline;
		ctx.direction = this.data.direction;
		wrapText(ctx, this.data.text, this.data.x, this.data.y, this.data.width, this.data.lineHeight);

		//stolen from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
		function wrapText(context, text, x, y, maxWidth, lineHeight) {
			var words = text.split(" ");
			var line = "";

			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + " ";
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					context.fillText(line, x, y);
					line = words[n] + " ";
					y += lineHeight;
				} else {
					line = testLine;
				}
			}
			context.fillText(line, x, y);
		}
	},

	/**
	 * Called when a component is removed (e.g., via removeAttribute).
	 * Generally undoes all modifications to the entity.
	 */
	remove: function () {}
};

},{}]},{},[1]);
