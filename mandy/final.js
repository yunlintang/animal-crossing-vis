function lineChart(search){
	let numSearch = extractData(search);
	//console.log(numSearch);
	let animal= [];
	let mario = [];
	let switches = [];
	
	for(var i = 0;i < numSearch.length;i++){
		animal.push(numSearch[i][1]);
		switches.push(numSearch[i][2]);
		mario.push(numSearch[i][3]);
        //console.log(dList[i]);
	}
	console.log(switches);
	
	var chart = Highcharts.chart('line',{
        chart:{
            type:"line"
        },
        title:{
            text:'Numbers of Searches on Youtube'
		},

		xAxis:{
            type:'datetime',
            title:{
                text:"Date"
            },
            labels:{
                align:'center',
                format:'{value:%m/%d/%y}',
			},
            
		},
		yAxis: {
            tickInterval:10,
            title:{
                text:"Adj Close Stock Price"
            },
		},
		legend:{
            layout: 'vertical',
            align: 'right',
            verticalAlign:'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true,
        },
		series:[{
			data: animal,
			name: 'Animal Crossing'
        },{
			data: switches,
			name: 'Switch'
		},{
			data: mario,
			name: 'Mario'
		}]
	});
	
}

function extractData(search){
	let numSearch = [];
    for(var i = 0;i < search.length;i++){
		let temp = [];
		let dateS = new Date(search[i].Week);
		let animal= search[i]['Animal Crossing'];
		let mario = search[i].mario;
		let switches = search[i].switch;
		temp.push(dateS)
		temp.push(animal);
		temp.push(switches);
		temp.push(mario);
		numSearch.push(temp)
    }
    return numSearch;
}

async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}
function init() {
	searchPromise = loadJSON('data.json');
	searchPromise.then(function (search) {
		lineChart(search);
		//console.log(search)
	});
}

document.addEventListener('DOMContentLoaded', init, false);