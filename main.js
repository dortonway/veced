localStorage.ribs = []
localStorage.verteces = []

/* linen */

var chart_yz = new Chart(35, 20, 'Y', 'Z', function() {return y_max > z_max ? y_max : z_max})
var chart_xz = new Chart(350, 20, 'X', 'Z', function() {return x_max > z_max ? x_max : z_max})
var chart_xy = new Chart(35, 350, 'X', 'Y', function() {return x_max > y_max ? x_max : y_max}, 'from_top')
var chart_xyz = new Chart(475, 350, 'X', 'Y', function() {return Math.abs(x_max > y_max && x_max > z_max ? x_max : y_max > z_max ? y_max : z_max)}, true)

function msg(text, warning) {
	if(!msg.box) {
		msg.box = document.createElement('div')
		msg.box.className = 'msg'
		document.body.appendChild(msg.box)
	}

	msg.box.style.display = 'block'

	if(warning) {
		msg.box.style.backgroundColor = '#ffe9e9'
		msg.box.style.color = '#ff5757'
	} else {
		msg.box.style.backgroundColor = '#eaffe9'
		msg.box.style.color = '#18c835'
	}

	msg.box.innerHTML = text
	msg.box.style.left = (document.body.offsetWidth - msg.box.offsetWidth)/2

	function hide() {
		msg.box.style.display = 'none'
	}
	setTimeout(hide, 3000)
}

var x_max = y_max = z_max = 0, ver_inputs = [], rib_inputs = []
function draw_and_data_update() {
	x_max = y_max = z_max = 0
	var verteces_table = document.querySelector('#verteces_block .scroll table'),
		vertex_number = 0
		
	verteces_table.innerHTML = ''
	if(Chart.has_data('verteces')) {
		var verteces = JSON.parse(localStorage.verteces)

		for(row in verteces)
			if(verteces.hasOwnProperty(row)) {
				if(x_max < verteces[row][0])
					x_max = verteces[row][0]
				if(y_max < verteces[row][1])
					y_max = verteces[row][1]
				if(z_max < verteces[row][2])
					z_max = verteces[row][2]


				/* table */

				++vertex_number
				var tr = document.createElement('tr'),
					n = document.createElement('td'),
					x = document.createElement('td'),
					y = document.createElement('td'),
					z = document.createElement('td'),
					attrs = {'n': vertex_number, 'x': verteces[row][0], 'y': verteces[row][1], 'z': verteces[row][2]}

				for(var i in attrs)
					if(attrs.hasOwnProperty(i)) {
						n.setAttribute('data-' + i, attrs[i])
						x.setAttribute('data-' + i, attrs[i])
						y.setAttribute('data-' + i, attrs[i])
						z.setAttribute('data-' + i, attrs[i])
					}

				ver_inputs[parseInt(row)] = [document.createElement('input'), document.createElement('input'), document.createElement('input')]

				ver_inputs[parseInt(row)][0].value = verteces[row][0]
				ver_inputs[parseInt(row)][1].value = verteces[row][1]
				ver_inputs[parseInt(row)][2].value = verteces[row][2]

				n.style.backgroundColor = '#EEE'
				n.innerHTML = vertex_number
				x.appendChild(ver_inputs[parseInt(row)][0])
				y.appendChild(ver_inputs[parseInt(row)][1])
				z.appendChild(ver_inputs[parseInt(row)][2])
				tr.appendChild(n)
				tr.appendChild(x)
				tr.appendChild(y)
				tr.appendChild(z)
				verteces_table.appendChild(tr)
			}

		// chart-dotting. new cycle because it need correct maximums
		if(chart_yz) {
			Chart.update()
			chart_yz.axis()
			chart_xz.axis()
			chart_xy.axis()
			chart_xyz.axis3d()
			var yz_were = [], xz_were = [], xy_were = []

			function overlays_cleaning(chart, were, first_coordinate, second_coordinate, number) {
				for(var i = 0; i < were.length; ++i)
					if(first_coordinate === were[i][0] && second_coordinate === were[i][1]) {
						were[i][2].push(number)
						break
					}
				// yz_were[i] === false because the last step of the cycle 'i' was increased
				if(!were[i])
					were.push([first_coordinate, second_coordinate, [number]])
			}

			function dotting(chart, were) {
				for(var i in were)
					chart.dot(were[i][0], were[i][1], were[i][2].join(', '))
			}

			for(row in verteces)
				if(verteces.hasOwnProperty(row)) {
					number = parseInt(row) + 1
					overlays_cleaning(chart_yz, yz_were, verteces[row][1], verteces[row][2], number)
					overlays_cleaning(chart_xz, xz_were, verteces[row][0], verteces[row][2], number)
					overlays_cleaning(chart_xy, xy_were, verteces[row][0], verteces[row][1], number)

					chart_xyz.dot(verteces[row][0], verteces[row][1], verteces[row][2], number)
				}
			dotting(chart_yz, yz_were)
			dotting(chart_xz, xz_were)
			dotting(chart_xy, xy_were)
		}


		if(localStorage.ribs) {
			var ribs = JSON.parse(localStorage.ribs)

			for(row in ribs)
				if(ribs.hasOwnProperty(row)) {
					chart_yz.line(verteces[ribs[row][0]][1], verteces[ribs[row][0]][2], verteces[ribs[row][1]][1], verteces[ribs[row][1]][2])
					chart_xz.line(verteces[ribs[row][0]][0], verteces[ribs[row][0]][2], verteces[ribs[row][1]][0], verteces[ribs[row][1]][2])
					chart_xy.line(verteces[ribs[row][0]][0], verteces[ribs[row][0]][1], verteces[ribs[row][1]][0], verteces[ribs[row][1]][1])

					chart_xyz.line(verteces[ribs[row][0]][0], verteces[ribs[row][0]][1], verteces[ribs[row][0]][2], verteces[ribs[row][1]][0], verteces[ribs[row][1]][1], verteces[ribs[row][1]][2])
				}
		}

	} else
		Chart.update()

	var ribs_table = document.querySelector('#ribs_block .scroll table'),
		rib_number = 0
		ribs_table.innerHTML = ''
	if(localStorage.ribs) {
		var ribs = JSON.parse(localStorage.ribs)
		for(row in ribs)
			if(ribs.hasOwnProperty(row)) {
				++rib_number
				var tr = document.createElement('tr'),
					n = document.createElement('td'),
					begin = document.createElement('td'),
					end = document.createElement('td'),
					attrs = {'n': rib_number, 'begin': ribs[row][0], 'end': ribs[row][1]}

				/*n.style.backgroundColor = '#EEE'
				n.innerHTML = rib_number
				begin.innerHTML = ribs[row][0] + 1
				end.innerHTML = ribs[row][1] + 1
				tr.appendChild(n)
				tr.appendChild(begin)
				tr.appendChild(end)
				ribs_table.appendChild(tr)*/

				for(var i in attrs)
					if(attrs.hasOwnProperty(i)) {
						n.setAttribute('data-' + i, attrs[i])
						begin.setAttribute('data-' + i, attrs[i])
						end.setAttribute('data-' + i, attrs[i])
					}

				rib_inputs[parseInt(row)] = [document.createElement('input'), document.createElement('input')]

				rib_inputs[parseInt(row)][0].value = ribs[row][0] + 1
				rib_inputs[parseInt(row)][1].value = ribs[row][1] + 1
				rib_inputs[parseInt(row)][0].class = 'inps'
				rib_inputs[parseInt(row)][1].class = 'inps'
				/*rib_inputs[parseInt(row)][0].type = 'text'
				rib_inputs[parseInt(row)][1].type = 'text'*/

				n.style.backgroundColor = '#EEE'
				n.innerHTML = rib_number
				begin.appendChild(rib_inputs[parseInt(row)][0])
				end.appendChild(rib_inputs[parseInt(row)][1])
				tr.appendChild(n)
				tr.appendChild(begin)
				tr.appendChild(end)
				ribs_table.appendChild(tr)
			}
	}

	// statusbar update
	document.querySelector('#statusbar').innerHTML = 'Shift: X = ' + shift.x + ', Y = ' + shift.y + ', Z = ' + shift.z +
		'; scale: X = ' + scale.x + ', Y = ' + scale.y + ', Z = ' + scale.z +
		'; turning: X = ' + turning.x + ', Y = ' + turning.y + ', Z = ' + turning.z

	//normalize()
}
var x_max = y_max = z_max = 0, ver_inputs = [], rib_inputs = []
function data_update() {
	//document.querySelector('#content').innerHTML = '<svg id = "linen"></svg>'
	x_max = y_max = z_max = 0
	var verteces_table = document.querySelector('#verteces_block .scroll table'),
		vertex_number = 0
		
	verteces_table.innerHTML = ''
	if(Chart.has_data('verteces')) {
		var verteces = JSON.parse(localStorage.verteces)

		for(row in verteces)
			if(verteces.hasOwnProperty(row)) {
				if(x_max < verteces[row][0])
					x_max = verteces[row][0]
				if(y_max < verteces[row][1])
					y_max = verteces[row][1]
				if(z_max < verteces[row][2])
					z_max = verteces[row][2]


				/* table */

				++vertex_number
				var tr = document.createElement('tr'),
					n = document.createElement('td'),
					x = document.createElement('td'),
					y = document.createElement('td'),
					z = document.createElement('td'),
					attrs = {'n': vertex_number, 'x': verteces[row][0], 'y': verteces[row][1], 'z': verteces[row][2]}

				for(var i in attrs)
					if(attrs.hasOwnProperty(i)) {
						n.setAttribute('data-' + i, attrs[i])
						x.setAttribute('data-' + i, attrs[i])
						y.setAttribute('data-' + i, attrs[i])
						z.setAttribute('data-' + i, attrs[i])
					}

				ver_inputs[parseInt(row)] = [document.createElement('input'), document.createElement('input'), document.createElement('input')]

				ver_inputs[parseInt(row)][0].value = verteces[row][0]
				ver_inputs[parseInt(row)][1].value = verteces[row][1]
				ver_inputs[parseInt(row)][2].value = verteces[row][2]

				n.style.backgroundColor = '#EEE'
				n.innerHTML = vertex_number
				x.appendChild(ver_inputs[parseInt(row)][0])
				y.appendChild(ver_inputs[parseInt(row)][1])
				z.appendChild(ver_inputs[parseInt(row)][2])
				tr.appendChild(n)
				tr.appendChild(x)
				tr.appendChild(y)
				tr.appendChild(z)
				verteces_table.appendChild(tr)
			}

// drawing was moved
/*
		if(localStorage.ribs) {
			var ribs = JSON.parse(localStorage.ribs)

			for(row in ribs)
				if(ribs.hasOwnProperty(row)) {
					chart_yz.line(verteces[ribs[row][0]][1], verteces[ribs[row][0]][2], verteces[ribs[row][1]][1], verteces[ribs[row][1]][2])
					chart_xz.line(verteces[ribs[row][0]][0], verteces[ribs[row][0]][2], verteces[ribs[row][1]][0], verteces[ribs[row][1]][2])
					chart_xy.line(verteces[ribs[row][0]][0], verteces[ribs[row][0]][1], verteces[ribs[row][1]][0], verteces[ribs[row][1]][1])

					chart_xyz.line(verteces[ribs[row][0]][0], verteces[ribs[row][0]][1], verteces[ribs[row][0]][2], verteces[ribs[row][1]][0], verteces[ribs[row][1]][1], verteces[ribs[row][1]][2])
				}
		}
*/
	} else
		Chart.update()

	var ribs_table = document.querySelector('#ribs_block .scroll table'),
		rib_number = 0
		ribs_table.innerHTML = ''
	if(localStorage.ribs) {
		var ribs = JSON.parse(localStorage.ribs)
		for(row in ribs)
			if(ribs.hasOwnProperty(row)) {
				++rib_number
				var tr = document.createElement('tr'),
					n = document.createElement('td'),
					begin = document.createElement('td'),
					end = document.createElement('td'),
					attrs = {'n': rib_number, 'begin': ribs[row][0], 'end': ribs[row][1]}

				/*n.style.backgroundColor = '#EEE'
				n.innerHTML = rib_number
				begin.innerHTML = ribs[row][0] + 1
				end.innerHTML = ribs[row][1] + 1
				tr.appendChild(n)
				tr.appendChild(begin)
				tr.appendChild(end)
				ribs_table.appendChild(tr)*/

				for(var i in attrs)
					if(attrs.hasOwnProperty(i)) {
						n.setAttribute('data-' + i, attrs[i])
						begin.setAttribute('data-' + i, attrs[i])
						end.setAttribute('data-' + i, attrs[i])
					}

				rib_inputs[parseInt(row)] = [document.createElement('input'), document.createElement('input')]

				rib_inputs[parseInt(row)][0].value = ribs[row][0] + 1
				rib_inputs[parseInt(row)][1].value = ribs[row][1] + 1
				rib_inputs[parseInt(row)][0].class = 'inps'
				rib_inputs[parseInt(row)][1].class = 'inps'
				/*rib_inputs[parseInt(row)][0].type = 'text'
				rib_inputs[parseInt(row)][1].type = 'text'*/

				n.style.backgroundColor = '#EEE'
				n.innerHTML = rib_number
				begin.appendChild(rib_inputs[parseInt(row)][0])
				end.appendChild(rib_inputs[parseInt(row)][1])
				tr.appendChild(n)
				tr.appendChild(begin)
				tr.appendChild(end)
				ribs_table.appendChild(tr)
			}
	}

	// statusbar update
	document.querySelector('#statusbar').innerHTML = 'Shift: X = ' + shift.x + ', Y = ' + shift.y + ', Z = ' + shift.z +
		'; scale: X = ' + scale.x + ', Y = ' + scale.y + ', Z = ' + scale.z +
		'; turning: X = ' + turning.x + ', Y = ' + turning.y + ', Z = ' + turning.z

	//normalize()
}

var	menu = {'file': document.querySelector('#menu_block #file'),
			'do': document.querySelector('#menu_block #do'),
			'creation': document.querySelector('#creation')}

for(var i in menu)
	menu[i].visible = function(visible_r) {
		for(var i in menu)
			if(menu.hasOwnProperty(i))
				if(visible_r)
					if(this.id == i)
						menu[i].style.display = 'block'
					else
						menu[i].style.display = 'none'
				else
					menu[i].style.display = 'none'
	}


/* menu events */

document.querySelector('#menu #file').onclick = function() {
	menu.file.visible(true)
}

document.querySelector('#menu_block #file #create').onclick = function() {
	Chart.data('verteces', [])
	Chart.data('ribs', [])

	data_update()
	msg('The data was removed for a new object', false)
}

document.querySelector('#menu_block #file #open').onchange = function() {
	var fr = new FileReader()

	fr.onload = function(event) {
		var file_data = JSON.parse(event.target.result)
		Chart.data('verteces', file_data.verteces)
		Chart.data('ribs', file_data.ribs)

		normalize()
		draw_and_data_update()
	}

	f = document.querySelector('#menu_block #file #open').files[0]
	fr.readAsText(f)
}

document.querySelector('#menu_block #file #save').onclick = function() {
	var state = JSON.stringify({'verteces': Chart.data('verteces'), 'ribs': Chart.data('ribs')}),
		blob = new Blob([state])
	//console.log(window.URL.createObjectURL(blob))
	document.querySelector('#save_lnk').href = window.URL.createObjectURL(blob)
}

document.querySelector('#menu_block #file #export').onclick = function() {
	var svg = '<svg>' + document.querySelector('#content').innerHTML.substr(19, document.querySelector('#content').innerHTML.length).trim()
	var blob = new Blob([svg])
	//console.log(window.URL.createObjectURL(blob))
	document.querySelector('#export_lnk').href = window.URL.createObjectURL(blob)
}

document.querySelector('#menu_block #file #edit').onclick = function() {
	menu.creation.visible(true)
}

document.querySelector('#creation #verteces_block #edit').onclick = function() {
	var verteces = Chart.data('verteces')
	for(var i in ver_inputs)
		if(ver_inputs.hasOwnProperty(i)) {
			if(ver_inputs[i][0].value != ver_inputs[i][0].parentNode.getAttribute('data-x'))
				verteces[i][0] = ver_inputs[i][0].value
			if(ver_inputs[i][1].value != ver_inputs[i][1].parentNode.getAttribute('data-y'))
				verteces[i][1] = ver_inputs[i][1].value
			if(ver_inputs[i][2].value != ver_inputs[i][2].parentNode.getAttribute('data-z'))
				verteces[i][2] = ver_inputs[i][2].value
		}
	Chart.data('verteces', verteces)

	data_update()
}

document.querySelector('#creation #ribs_block #edit').onclick = function() {
	var ribs = Chart.data('ribs')
	for(var i in rib_inputs)
		if(rib_inputs.hasOwnProperty(i)) {
			if(rib_inputs[i][0].value != rib_inputs[i][0].parentNode.getAttribute('data-begin') + 1)
				ribs[i][0] = rib_inputs[i][0].value - 1
			if(rib_inputs[i][1].value != rib_inputs[i][1].parentNode.getAttribute('data-end') + 1)
				ribs[i][1] = rib_inputs[i][1].value - 1
		}
	Chart.data('ribs', ribs)

	data_update()
}

document.querySelector('#menu #do').onclick = function() {
	normalize()
	setTimeout('normalize(); data_update()', 500)
	data_update()
	menu.do.visible(true)
}

document.querySelector('#menu #print').onclick = function() {
	window.print()
}

document.querySelector('#menu #exit').onclick = function() {
	document.querySelector('#question').style.display = 'block'
}


/* events of actions */

function rough_show() {
	document.querySelector('#exactly').style.display = 'none'
	document.querySelector('#rough').style.display = 'block'
	document.querySelector('#rough_btn').checked = true
}

document.querySelector('#rough_btn').onclick = rough_show

var shift = {x: 0, y: 0, z: 0},
	scale = {x: 1, y: 1, z: 1},
	turning = {x: 0, y: 0, z: 0}
function rough(less) {
	var how_many = parseFloat(document.querySelector('#rough_value').value),
		x_exactly_vl = parseFloat(document.querySelector('#x_exactly_vl').value),
		y_exactly_vl = parseFloat(document.querySelector('#y_exactly_vl').value),
		z_exactly_vl = parseFloat(document.querySelector('#z_exactly_vl').value),
		verteces = Chart.data('verteces'), statusbar_was_changed = false
//console.log('hm' + how_many + 'to(h_m)' + typeof(how_many) + 'shift.x' + shift.x + 'tf(shift)' + typeof(shift.x))
	if(document.querySelector('#shift').checked) {
		if(less)
			how_many = -how_many

		for(var i in verteces)
			if(verteces.hasOwnProperty(i)) {
				if(document.querySelector('#rough_btn').checked) {
					if(document.querySelector('#xxx').checked) {
						//console.log('ho_many: ' + how_many + ' vertex: ' + verteces[i][0] + ' sum: ' + (how_many + verteces[i][0]))
						if(!statusbar_was_changed)
							shift.x += how_many

						/*if(how_many + verteces[i][0] > 1 || how_many + verteces[i][0] < 0)
							return false*/
						
						verteces[i][0] += how_many
					}
					if(document.querySelector('#yyy').checked) {
						if(!statusbar_was_changed)
							shift.y += how_many

						/*if(how_many + verteces[i][1] > 1 || how_many + verteces[i][1] < 0)
							return false*/

						verteces[i][1] += how_many
					}
					if(document.querySelector('#zzz').checked) {
						if(!statusbar_was_changed)
							shift.z += how_many

						/*if(how_many + verteces[i][2] > 1 || how_many + verteces[i][2] < 0)
							return false*/

						verteces[i][2] += how_many
					}
				} else if(document.querySelector('#exactly_btn').checked) {
					if(document.querySelector('#x_exactly_cb').checked) {
						if(!statusbar_was_changed)
							shift.x += x_exactly_vl

						/*if(x_exactly_vl + verteces[i][0] > 1 || x_exactly_vl + verteces[i][0] < 0)
							return false*/

						verteces[i][0] += x_exactly_vl
					}
					if(document.querySelector('#y_exactly_cb').checked) {
						if(!statusbar_was_changed)
							shift.y += y_exactly_vl

						/*if(y_exactly_vl + verteces[i][1] > 1 || y_exactly_vl + verteces[i][1] < 0)
							return false*/

						verteces[i][1] += y_exactly_vl
					}
					if(document.querySelector('#z_exactly_cb').checked) {
						if(!statusbar_was_changed)
							shift.z += z_exactly_vl

						/*if(z_exactly_vl + verteces[i][2] > 1 || z_exactly_vl + verteces[i][2] < 0)
							return false*/

						verteces[i][2] += z_exactly_vl
					}
				}
				statusbar_was_changed = true
			}
	}
	if(document.querySelector('#scale').checked) {
		if(less)
			how_many = 1/how_many

		for(var i in verteces)
			if(verteces.hasOwnProperty(i)) {
				if(document.querySelector('#rough_btn').checked) {
					/*console.log()
					if(how_many <= 0 || x_exactly_vl <= 0 || y_exactly_vl <= 0 || z_exactly_vl <= 0) {
						msg('Неверный ввод', 1)
						return
					}*/

					if(document.querySelector('#xxx').checked) {
						verteces[i][0] *= how_many
						if(!statusbar_was_changed)
							scale.x *= how_many
					}
					if(document.querySelector('#yyy').checked) {
						verteces[i][1] *= how_many
						if(!statusbar_was_changed)
							scale.y *= how_many
					}
					if(document.querySelector('#zzz').checked) {
						verteces[i][2] *= how_many
						if(!statusbar_was_changed)
							scale.z *= how_many
					}
				} else if(document.querySelector('#exactly_btn').checked) {
					if(document.querySelector('#x_exactly_cb').checked) {
						verteces[i][0] *= x_exactly_vl
						if(!statusbar_was_changed)
							scale.x *= x_exactly_vl
					}
					if(document.querySelector('#y_exactly_cb').checked) {
						verteces[i][1] *= y_exactly_vl
						if(!statusbar_was_changed)
							scale.y *= y_exactly_vl
					}
					if(document.querySelector('#z_exactly_cb').checked) {
						verteces[i][2] *= z_exactly_vl
						if(!statusbar_was_changed)
							scale.z *= z_exactly_vl
					}
				}
				statusbar_was_changed = true
			}
	}
	if(document.querySelector('#turning').checked) {
		if(less)
			how_many = -how_many
		//console.log(verteces)
		for(var i in verteces)
			if(verteces.hasOwnProperty(i)) {
				var alpha = how_many * 3.14 / 180

				if(document.querySelector('#rough_btn').checked) {
					if(document.querySelector('#xxx').checked) {
						//console.log('x')

						var res = mult_mx(
							[[verteces[i][0], verteces[i][1], verteces[i][2], 0]],
							[[1, 0, 0, 0],
							 [0, Math.cos(alpha), -Math.sin(alpha), 0],
							 [0, Math.sin(alpha), Math.cos(alpha), 0],
							 [0, 0, 0, 1]]
						)

						verteces[i][1] = res[0][1]
						verteces[i][2] = res[0][2]
					}
					if(document.querySelector('#yyy').checked) {
						//console.log('y')

						var res = mult_mx(
							[[verteces[i][0], verteces[i][1], verteces[i][2], 0]],
							[[Math.cos(alpha), 0, -Math.sin(alpha), 0],
							 [0, 1, 0, 0],
							 [Math.sin(alpha), 0, Math.cos(alpha), 0],
							 [0, 0, 0, 1]]
						)

						verteces[i][0] = res[0][0]
						verteces[i][2] = res[0][2]
					}
					if(document.querySelector('#zzz').checked) {
						//console.log('z')

						var res = mult_mx(
							[[verteces[i][0], verteces[i][1], verteces[i][2], 0]],
							[[Math.cos(alpha), Math.sin(alpha), 0, 0],
							 [-Math.sin(alpha), Math.cos(alpha), 0, 0],
							 [0, 0, 1, 0],
							 [0, 0, 0, 1]]
						)

						verteces[i][0] = res[0][0]
						verteces[i][1] = res[0][1]
					}
				} else if(document.querySelector('#exactly_btn').checked) {
					if(document.querySelector('#x_exactly_cb').checked)
						verteces[i][0] *= parseFloat(document.querySelector('#x_exactly_vl').value)
					if(document.querySelector('#y_exactly_cb').checked)
						verteces[i][1] *= parseFloat(document.querySelector('#y_exactly_vl').value)
					if(document.querySelector('#z_exactly_cb').checked)
						verteces[i][2] *= parseFloat(document.querySelector('#z_exactly_vl').value)
				}
			}
	}
	rough_show()
	Chart.data('verteces', verteces)

	data_update()
}

function rough_check_and_do(less) {
	if(document.querySelector('#scale').checked && parseFloat(document.querySelector('#rough_value').value) == 0)
		msg('Неверный ввод', true)
	else
		rough(less)
}
function exactly_check_and_do(less) {
	if(document.querySelector('#scale').checked
		&& ((document.querySelector('#x_exactly_cb').checked && parseFloat(document.querySelector('#x_exactly_vl').value) == 0)
		|| (document.querySelector('#y_exactly_cb').checked && parseFloat(document.querySelector('#y_exactly_vl').value) == 0)
		|| (document.querySelector('#z_exactly_cb').checked && parseFloat(document.querySelector('#z_exactly_vl').value) == 0)))
		msg('Неверный ввод', true)
	else
		rough(less)
}
document.querySelector('#less').onclick = function() {
	rough_check_and_do(true)

	normalize()
	draw_and_data_update()
}
document.querySelector('#more').onclick = function() {
	rough_check_and_do(false)

	normalize()
	draw_and_data_update()
}
document.querySelector('#exactly_do').onclick = function() {
	exactly_check_and_do(true)

	normalize()
	draw_and_data_update()
}

document.querySelector('#exactly_btn').onclick = function() {
	document.querySelector('#rough').style.display = 'none'
	document.querySelector('#exactly').style.display = 'block'

	/*if(document.querySelector('#scale').checked)
		document.querySelector('#x_exactly_vl').value = 1*/
}

function exactly_zeros() {
	document.querySelector('#x_exactly_vl').value = 0
	document.querySelector('#y_exactly_vl').value = 0
	document.querySelector('#z_exactly_vl').value = 0
	document.querySelector('#rough_value').value = 0
}

document.querySelector('#shift').onclick = exactly_zeros
document.querySelector('#scale').onclick = function() {
	document.querySelector('#x_exactly_vl').value = 1
	document.querySelector('#y_exactly_vl').value = 1
	document.querySelector('#z_exactly_vl').value = 1
	document.querySelector('#rough_value').value = 1

	/*console.log(99999999999999999999999999999999999)
	function without_zero(e) {
		console.log('dddd ' + e.target.value)
		//if(e.target.value.length == 1 && e.target.value.charAt(0) === '0' && Number(String.fromCharCode(e.keyCode)) === 0) {
		if(e.target.value.length == 1 && e.target.value.charAt(0) === '0') {
			msg('Недопустимый ввод', true)
			e.target.value = '0.1'
		}
		//else
		//	e.target.value += String.fromCharCode(e.keyCode)
	}

	document.querySelector('#rough_value').addEventListener('keypress', without_zero, false)
	document.querySelector('#x_exactly_vl').addEventListener('keypress', without_zero, false)
	document.querySelector('#y_exactly_vl').addEventListener('keypress', without_zero, false)
	document.querySelector('#z_exactly_vl').addEventListener('keypress', without_zero, false)*/
}
document.querySelector('#turning').onclick = exactly_zeros


document.querySelector('#draw').onclick = function() {
	normalize()
	//data_update()
	draw_and_data_update()
}

document.querySelectorAll('#question .buttons')[0].onclick = function() {
	document.querySelector('#question').style.display = 'none'
	document.querySelector('#question_save').style.display = 'block'

	document.querySelectorAll('#question_save .buttons')[0].onclick = function() {
		document.querySelector('#save').click()
		window.location = 'about:blank'
	}

	document.querySelectorAll('#question_save .buttons')[1].onclick = function() {
		window.location = 'about:blank'
	}
}

document.querySelectorAll('#question .buttons')[1].onclick = function() {
	document.querySelector('#question').style.display = 'none'
}

function normalize() {
	var verteces = Chart.data('verteces'), max = {x: 0, y: 0, z: 0}, min = {x: 1000, y: 1000, z: 1000},
		common_max, common_min, bad = false

	for(var i in verteces)
		if(verteces.hasOwnProperty(i) && (verteces[i][0] > 1 || verteces[i][1] > 1 || verteces[i][2] > 1
			|| verteces[i][0] < 0 || verteces[i][1] < 0 || verteces[i][2] < 0))
			bad = true
	if(!bad)
		return false

	for(var i in verteces)
		if(verteces.hasOwnProperty(i)) {
			if(verteces[i][0] < min.x)
				min.x = verteces[i][0]
			if(verteces[i][1] < min.y)
				min.y = verteces[i][1]
			if(verteces[i][2] < min.z)
				min.z = verteces[i][2]
		}

	for(var i in verteces)
		if(verteces.hasOwnProperty(i)) {
			verteces[i][0] -= min.x
			verteces[i][1] -= min.y
			verteces[i][2] -= min.z
		}


	bad = false
	for(var i in verteces)
		if(verteces.hasOwnProperty(i) && (verteces[i][0] > 1 || verteces[i][1] > 1 || verteces[i][2] > 1
			|| verteces[i][0] < 0 || verteces[i][1] < 0 || verteces[i][2] < 0))
			bad = true
	if(!bad) {
		Chart.data('verteces', verteces)
		return false
	}

	for(var i in verteces)
		if(verteces.hasOwnProperty(i)) {
			if(verteces[i][0] > max.x)
				max.x = verteces[i][0]
			if(verteces[i][1] > max.y)
				max.y = verteces[i][1]
			if(verteces[i][2] > max.z)
				max.z = verteces[i][2]
		}
	common_max = Math.max(max.x, max.y, max.z)

	for(var i in verteces)
		if(verteces.hasOwnProperty(i)) {
			verteces[i][0] = (verteces[i][0] / common_max).toFixed(3)
			verteces[i][1] = (verteces[i][1] / common_max).toFixed(3)
			verteces[i][2] = (verteces[i][2] / common_max).toFixed(3)
		}
	Chart.data('verteces', verteces)

	msg('Normalization was completed')
}


/* vertices */

// add
document.querySelector('#verteces_block #add').onclick = function() {
	if(!localStorage.verteces)
		localStorage.verteces = '[]'

	var verteces = JSON.parse(localStorage.verteces),
		x = parseInt(document.querySelector('#verteces_block #x').value),
		y = parseInt(document.querySelector('#verteces_block #y').value),
		z = parseInt(document.querySelector('#verteces_block #z').value)

	if((!x && x !== 0) || (!y && y !== 0 ) || (!z && z !== 0 ) || x == -1 || y == -1 || z == -1) {
		msg('Invalid input', 1)
		return false
	}

	for(var i = 0; i < verteces.length; ++i)
		if(verteces[i][0] == x && verteces[i][1] == y && verteces[i][2] == z) {
			msg('You can not add a duplicate vertex', true)
			return false
		}

	verteces.push([x, y, z])
	localStorage.verteces = JSON.stringify(verteces)
	msg('The vertex was added')

	data_update()
}

// remove
document.querySelector('#verteces_block #remove').onclick = function() {
	if(!localStorage.verteces)
		localStorage.verteces = '[]'
	else
		var verteces = JSON.parse(localStorage.verteces)

	var new_verteces = [],
		removed = false,
		x = parseInt(document.querySelector('#verteces_block #x').value),
		y = parseInt(document.querySelector('#verteces_block #y').value),
		z = parseInt(document.querySelector('#verteces_block #z').value)

	for(var i = 0; i < verteces.length; ++i)
		if(verteces[i][0] == x && verteces[i][1] == y && verteces[i][2] == z) {
			removed = true
			var removed_number = i
		} else
			new_verteces.push([verteces[i][0], verteces[i][1], verteces[i][2]])

	localStorage.verteces = JSON.stringify(new_verteces)

	if(removed) {
		msg('The vertex was removed')
		removed = false
	} else
		msg('The vertex was not found', true)

	var ribs = JSON.parse(localStorage.ribs),
		new_ribs = []

	//++removed_number
	for(var el = ribs[j = 0]; j < ribs.length; el = ribs[++j])
		if(el[0] != removed_number && el[1] != removed_number) {
			if(el[0] > removed_number)
				--el[0]
			if(el[1] > removed_number)
				--el[1]

			new_ribs.push([el[0], el[1]])
		}
	localStorage.ribs = JSON.stringify(new_ribs)

	data_update()
}


/* ribs */

// add
if(!localStorage.ribs)
	localStorage.ribs = '[]'
document.querySelector('#ribs_block #add').onclick = function() {
	var begin = parseInt(document.querySelector('#ribs_block #begin').value) - 1,
		end = parseInt(document.querySelector('#ribs_block #end').value) - 1,
		ribs = JSON.parse(localStorage.ribs),
		verteces = JSON.parse(localStorage.verteces)

	if((!begin && begin !== 0) || (!end && end !== 0 ) || begin == -1 || end == -1) {
		msg('Invalid input', 1)
		return false
	}

	if(begin === end) {
		msg('', true)
		return false
	}
	if(begin > verteces.length || end > verteces.length) {
		msg('You can not create a rib from a single point', true)
		return false
	}

	for(var el = ribs[i = 0]; i < ribs.length; el = ribs[++i])
		if((el[0] == begin && el[1] == end) || (el[0] == end && el[1] == begin)) {
			msg('You can not add a duplicate rib', true)
			return false
		}

	ribs.push([begin, end])
	localStorage.ribs = JSON.stringify(ribs)
	msg('The rib was added')

	data_update()
}

// remove
document.querySelector('#ribs_block #remove').onclick = function() {
	if(!localStorage.ribs)
		localStorage.ribs = '[]'
	else
		var ribs = JSON.parse(localStorage.ribs)

	var new_ribs = [],
		removed = false,
		begin = parseInt(document.querySelector('#ribs_block #begin').value) - 1,
		end = parseInt(document.querySelector('#ribs_block #end').value) - 1

	for(var i = 0; i < ribs.length; ++i)
		if((ribs[i][0] == begin && ribs[i][1] == end) || (ribs[i][0] == end && ribs[i][1] == begin))
			removed = true
		else
			new_ribs.push([ribs[i][0], ribs[i][1], ribs[i][2]])

	localStorage.ribs = JSON.stringify(new_ribs)

	if(removed) {
		msg('The rib was removed')
		removed = false
	} else
		msg('The rib was not found', true)

	data_update()
}

function without_dots(e) {
	if(String.fromCharCode(e.keyCode) == '.') {
		msg('Invalid input', true)
		e.target.value = e.target.value.substr(0, e.target.value - 2)
		return false//e.target.value = e.target.value.substr(0, e.target.value - 1)
	}
}
document.querySelector('#begin').addEventListener('keypress', without_dots, false)

function checker(e) {
	if(!Number(String.fromCharCode(e.keyCode)) && Number(String.fromCharCode(e.keyCode)) !== 0 && String.fromCharCode(e.keyCode) != '.')
		msg('Invalid character', true)
	else
		if(String.fromCharCode(e.keyCode) == '.' && e.target.value.indexOf('.') > -1)
			msg('Invalid character', true)
		else
			e.target.value += String.fromCharCode(e.keyCode)

	return false
}
document.querySelectorAll('.verteces')[1].onkeypress = checker
document.querySelector('.ribs').onkeypress = checker
var inps = document.querySelectorAll('input[type="text"]')
for(var inp in inps)
	if(inps.hasOwnProperty(inp))
		inps[inp].onkeypress = checker

function mult_mx(A, B) {
    var rows_A = A.length,
        rows_B = B.length,
        cols_B = B[0].length,
        C = new Array(rows_A)

    for(var i = 0; i < rows_A; i++)
    	C[i] = new Array(cols_B)

    for(var k = 0; k < cols_B; k++)
        for(var i = 0; i < rows_A; i++) {
        	var temp = 0
            for (var j = 0; j < rows_B; j++)
            	temp += A[i][j] * B[j][k]

            C[i][k] = temp
        }

    return C
}
 
data_update()