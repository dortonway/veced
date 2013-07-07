function Chart(left, top, first_name, second_name, max, three_d) {
	this.left = left
	this.top = top
	this.first_name = first_name
	this.second_name = second_name
	this.max = max

	Chart.linen = document.querySelector('#linen')

	if(three_d === true) {
		this.width = 100
		this.origin = {x: left, y: top + this.width}
	} else {
		this.width = 250
		if(three_d == 'from_top') {
			this.from_top = true
			this.origin = {x: left, y: top};/*console.log(333)*/}
		else
			this.origin = {x: left, y: top + this.width}
	}

	this.dot_width = 3

	if(!Chart.objects)
		Chart.objects = []

	Chart.objects.push(this)
}

Chart.prototype = {
	axis: function() {
		this.coefficient = this.width// / this.max()

		if(this.from_top) {
			//console.log(444)
			/*this.line(0, 0, this.width, 0, true)
			//this.line(0, 0, 0, this.width, true)
			this.text(this.width - 8, -20, this.first_name, '', true)
			this.text(this.width - 8, 10, Math.round(this.max()), '', true)

			this.line(0, 0, 0, -this.width, true)
			this.text(-20, this.width - 8, this.second_name, '', true)
			this.text(8, this.width - 8, Math.round(this.max()), '', true)

			this.text(-15, -15, '0', '', true)

			// arrows
			this.line(this.width, 0, this.width - 10, 5, true)
			this.line(this.width, 0, this.width - 10, -5, true)
			this.line(0, this.width, -5, this.width - 10, true)
			this.line(0, this.width, 5, this.width -10, true)*/

			this.line(0, 0, 0, this.width, true)
			this.text(this.width - 8, -20, this.second_name, '', true)
			this.text(this.width - 8, 10, /*Math.round(this.max())*/1, '', true)

			this.line(0, 0, this.width, 0, true)
			this.text(-20, -(this.width - 8), this.first_name, '', true)
			this.text(8, -(this.width - 8), /*Math.round(this.max())*/1, '', true)

			this.text(-15, -15, '0', '', true)

			// arrows
			this.line(this.width, 0, this.width - 10, 5, true)
			this.line(this.width, 0, this.width - 10, -5, true)
			this.line(0, this.width, -5, this.width - 10, true)
			this.line(0, this.width, 5, this.width -10, true)
		} else {
			//this.line(0, 0, 0, this.max())
			this.line(0, 0, 0, this.width, true)
			this.text(this.width - 8, -20, this.first_name, '', true)
			this.text(this.width - 8, 10, /*this.max().toFixed? this.max().toFixed(2) : this.max()*/1, '', true)

			this.line(0, 0, this.width, 0, true)
			this.text(-20, this.width - 8, this.second_name, '', true)
			this.text(8, this.width - 8, /*Math.round(this.max())*/1, '', true)

			this.text(-15, -15, '0', '', true)

			// arrows
			this.line(this.width, 0, this.width - 10, 5, true)
			this.line(this.width, 0, this.width - 10, -5, true)
			this.line(0, this.width, -5, this.width - 10, true)
			this.line(0, this.width, 5, this.width -10, true)
		}

	},

	axis3d: function() {
		this.coefficient = this.width// / this.max()

		// this.max() for axis because this.line() uses coefficient
		this.line(0, 0, 0, 0, 0, this.width, true)
		this.text(-14, this.width - 4, 'Z', '', true)
		this.text(3, this.width - 4, Math.round(this.max()), '', true)

		this.line(0, 0, 0, 0, this.width, 0, true)
		this.text(this.width - 4, -this.width, 'Y', '', true)
		this.text(this.width - 11, -this.width + 35, Math.round(this.max()), '', true)

		this.line(0, 0, 0, this.width, 0, 0, true)
		this.text(-this.width - 4, -this.width, 'X', '', true)
		this.text(-this.width - 11, -this.width + 35, Math.round(this.max()), '', true)

		this.text(-4, -16, '0', '', true)

		// arrows
		this.line(0, 0, this.width, 5, 0, this.width - 5, true)
		this.line(0, 0, this.width, 0, 5, this.width - 5, true)
		this.line(this.width, 0, 0, this.width - 5, 5, 0, true)
		this.line(this.width, 0, 0, this.width - 5, -5, 0, true)
		this.line(0, this.width, 0, 5, this.width - 5, 0, true)
		this.line(0, this.width, 0, -5, this.width - 5, 0, true)
	},

	// should change to the 'arguments' property
	line: function(a, b, c, d, e, f, g) {
		if(arguments.length === 4 || arguments.length === 5 || f === true) {
			x1 = a
			y1 = b
			x2 = c
			y2 = d

			if(e)
				var coefficient = 1
			else
				var coefficient = this.coefficient

			if(this.from_top) {
				//console.log(33)
				x1 = b
				y1 = -a
				x2 = d
				y2 = -c
			}
		} else {
			x1 = this.x_from3d(a, b, f)
			y1 = this.y_from3d(a, b, c)
			x2 = this.x_from3d(d, e, f)
			y2 = this.y_from3d(d, e, f)

			if(g)
				var coefficient = 1
			else
				var coefficient = this.coefficient
		}

		x1 = this.origin.x + x1 * coefficient
		y1 = this.origin.y + -y1 * coefficient
		x2 = this.origin.x + x2 * coefficient
		y2 = this.origin.y + -y2 * coefficient

		var line_el = document.createElementNS('http://www.w3.org/2000/svg', 'line')
		line_el.setAttribute('style', 'stroke: rgb(100, 100, 100); stroke-width: 1')
		line_el.setAttribute('x1', x1)
		line_el.setAttribute('y1', y1)
		line_el.setAttribute('x2', x2)
		line_el.setAttribute('y2', y2)
		Chart.linen.appendChild(line_el)
	},

	// should change to the 'arguments' property
	dot: function(a, b, c, d) {
		return true

		if(arguments.length === 3) {
			x = a
			y = b
			number = c
		} else {
			x = this.x_from3d(a, b, c)
			y = this.y_from3d(a, b, c)
			number = d
		}

		var rect_el = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		rect_el.setAttribute('x', this.origin.x + x * this.coefficient - this.dot_width/2)
		rect_el.setAttribute('y', this.origin.y + -y * this.coefficient - this.dot_width/2)
		rect_el.setAttribute('width', this.dot_width)
		rect_el.setAttribute('height', this.dot_width)
		this.text(x - this.dot_width/2 + 2, y - this.dot_width/2 + 3, number, 'font-size: 9pt')
		Chart.linen.appendChild(rect_el)
	},

	text: function(x, y, value, css, without_coef) {
		if(without_coef)
			var coefficient = 1
		else
			var coefficient = this.coefficient

		var text_el = document.createElementNS('http://www.w3.org/2000/svg', 'text')

		x = x * coefficient + this.origin.x
		y = -y * coefficient + this.origin.y

		if(css)
			text_el.setAttribute('style', css)

		text_el.setAttribute('x', x)
		text_el.setAttribute('y', y)
		text_el.appendChild(document.createTextNode(value))
		Chart.linen.appendChild(text_el)
	},

	x_from3d: function(x, y) {
		k = 1
		return y - x * k
	},

	y_from3d: function(x, y, z) {
		k = 0.82
		return z - y * k - x * k
	},

/*	x_from3d: function(x, y, z) {
		return 0.85090352453412*y+0.52532198881773*x
	},

	y_from3d: function(x, y, z) {
		return 0.224933771517*y+0.52532198881773*z-0.3643421426187*x
	}*/
}

Chart.update = function() {
	while(Chart.linen.firstChild)
		Chart.linen.removeChild(Chart.linen.firstChild)

	/*for(obj in Chart.objects)
		if(Chart.objects.hasOwnProperty(obj))
			Chart.objects[obj].axis()*/
}

Chart.dot = function(x, y) {
	var rect_el = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
	rect_el.setAttribute('x', x - 8/2)
	rect_el.setAttribute('y', y - 8/2)
	rect_el.setAttribute('width', 8)
	rect_el.setAttribute('height', 8)
	Chart.linen.appendChild(rect_el)
}

Chart.data = function(name, obj) {
	if(obj)
		localStorage[name] = JSON.stringify(obj)
	else {
		var o = JSON.parse(localStorage[name])

		for(var i in o)
			if(o.hasOwnProperty(i))
				for(var j in o[i])
					if(o[i].hasOwnProperty(j))
						o[i][j] = parseFloat(o[i][j])

		return o
	}
}
Chart.has_data = function(name) {
	if(localStorage[name].indexOf(',') > -1)
		return true
	else
		return false
}