
function parliament2svg(domId, parties) {
	var MAX_ROWS = 160;	// about 100,000 seats

	// Total number of seats per number of rows in diagram:
	// Expanded by fitting a quadratic polynomial (fit ignores rounding)
	var TOTALS = [];
	for(var i=0;i<MAX_ROWS;i++)
		TOTALS.push(Math.floor(-0.5049934867548131 - 0.4684161324104589*(i+1) + 3.926494853260455*Math.pow(i+1, 2)));
	//TOTALS = [3, 15, 33, 61, 95, 138, 189, 247, 313, 388, 469, 559, 657, 762, 876, 997, 1126, 1263, 1408, 1560, 1722, 1889, 2066, 2250, 2442, 2641, 2850, 3064, 3289, 3519, 3759, 4005, 4261, 4522, 4794, 5071, 5358, 5652, 5953, 6263, 6581, 6906, 7239, 7581, 7929, 8287, 8650, 9024, 9404]

	// Keep a running total of the number of delegates in the diagram, for use later.
	var sumdelegates = parties.reduce(function(sum, party) {
	  return sum + party.seats;
	}, 0);

	if (sumdelegates > TOTALS[TOTALS.length-1]) {
		console.error("Maximum number of seats reached.");
	}

	//Initialize counters for use in layout
	var spotcounter=0, lines=0, rows;
	//Figure out how many rows are needed:
	for (var i=0;i<TOTALS.length;i++) {
		if (TOTALS[i] >= sumdelegates) {
			rows = i+1;
			break
		}
	}

	//Maximum radius of spot is 0.5/rows; leave a bit of space.
	var radius = 0.4/rows;
	var svgStr = "";

	//Write svg header:
	svgStr += ('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
	svgStr += ('<svg xmlns:svg="http://www.w3.org/2000/svg"\n')
	svgStr += ('xmlns="http://www.w3.org/2000/svg" version="1.0"\n')
	//Make 350 px wide, 175 px high diagram with a 5 px blank border
	svgStr += ('width="360" height="185">\n')
	svgStr += ('<g>\n')
	//Print the number of seats in the middle at the bottom.
	svgStr += ('<text x="175" y="175" style="font-size:36px;font-weight:bold;text-align:center;text-anchor:middle;font-family:Sans">'+sumdelegates+'</text>\n')
	//Create list of centre spots
	var poslist=[]
	for(var i = 1; i<rows; i++) {
		//Each row can contain pi/(2asin(2/(3n+4i-2))) spots, where n is the number of rows and i is the number of the current row.
		var J=Math.floor(sumdelegates/TOTALS[rows-1]*Math.PI/(2*Math.asin(2.0/(3.0*rows+4.0*i-2.0))))

		//The radius of the ith row in an N-row diagram (Ri) is (3*N+4*i-2)/(4*N)
		var R=(3.0*rows+4.0*i-2.0)/(4.0*rows)
		if (J==1) {
			poslist.push([Math.PI/2.0, 1.75*R, R])
		}
		else {
			for(var j=0;j<J;j++) {
				//The angle to a spot is n.(pi-2sin(r/Ri))/(Ni-1)+sin(r/Ri) where Ni is the number in the arc
				//x=R.cos(theta) + 1.75
				//y=R.sin(theta)
				var angle=j*(Math.PI-2.0*Math.sin(radius/R))/(J-1.0)+Math.sin(radius/R)
				poslist.push([angle,R*Math.cos(angle)+1.75,R*Math.sin(angle)])
			}
		}
	}
	var J=sumdelegates - poslist.length;
	var R=(7.0*rows-2.0)/(4.0*rows)
	if (J==1) {
		poslist.push([Math.PI/2.0, 1.75*R, R])
	} else {
		for(var j=0;j<J;j++) {
			var angle=j*(Math.PI-2.0*Math.sin(radius/R))/(J-1.0)+Math.sin(radius/R)
			//console.log(angle)
			poslist.push([angle,R*Math.cos(angle)+1.75,R*Math.sin(angle)])
		}
	}
	
	poslist.sort(function(a, b){
		if (a[0] < b[0]) return 1;
		else if (a[0] > b[0]) return -1;
		else return 0;
	});

	var Counter=-1 //How many spots have we drawn?

	for(var party of parties) {
		//Make each party's blocks an svg group
		svgStr += ('  <g style="fill:'+party.color+'" id="'+party.name+'">\n')
		var c;
		for(c = Counter+1; c<=Counter+party.seats; c++) {
			console.log(c, poslist[c][1]);
			var x = (poslist[c][1]*100.0+5.0).toFixed(2);
			var y = (100.0*(1.75-poslist[c][2])+5.0).toFixed(2);
			var r = radius*100.0;

			svgStr += ('<circle cx="'+x+'" cy="'+y+'" r="'+r+'"/>\n')
		}
		Counter = c-1;
		svgStr += ('  </g>\n')
	}
	svgStr += ('</g>\n')
	svgStr += ('</svg>\n')

	var svgDom = document.getElementById(domId);
	svgDom.innerHTML = svgStr;
};