/*
async function loadJSON(path){
    let response = await fetch(path);
    let dataset = await response.json();
    return dataset;
}
*/

document.addEventListener('DOMContentLoaded',init,false);

function init(){
    /*
    var villager = loadJSON('./data/villagers.json');
    villager.then(function(s) {
        renderVillagersColumn(s);
        renderVillagersPie(s);
    }) */
    renderVillagersPie(villagers);
    renderVillagersColumn(villagers);
}

function renderVillagersPie(data){

    var gender_cnt = [['male',0],['female',0]];
    var hobbies_cnt = {};


    for (datum of data){
        /* count the number for males and females */
        let d = datum['Personality'];
        if (d.includes('♂')){
            let cnt = gender_cnt[0][1];
            gender_cnt[0] = ['male', cnt+1];
        } else {
            let cnt = gender_cnt[1][1];
            gender_cnt[1] = ['female', cnt+1];
        }

        /* count the number of hobbies for villagers */
        let hobby = datum['Hobbies'];
        if (!(hobby in hobbies_cnt)){
            hobbies_cnt[hobby] = 1;
        } else {
            hobbies_cnt[hobby] = Number(hobbies_cnt[hobby]) + 1;
        }
    }

    /* change the hobbies object into list */
    hobbies_list = []
    for(var hobby in hobbies_cnt){
        hobbies_list.push([hobby, hobbies_cnt[hobby]]);
    }

    
    Highcharts.chart('villagers_flex_item1',{
        chart: {
            type: 'pie',
            backgroundColor: 'white',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: 'Total Numbers of Villagers in Gender',
        },
        series: [{
            data: [{
                name:'Male',
                y:gender_cnt[0][1],
                color: '#4BB3B3'
            }, {
                name: 'Female',
                y:gender_cnt[1][1],
                color: '#F5E37D'
            }]
        }],
        legend: {
            enabled: true
        },
        plotOptions:{
            pie: {
                dataLabels: {
                    formatter: function(){
                        return (this.percentage).toFixed(2)+'%'
                    },
                    distance: -45,
                    style: {
                        textOutline: '0px',
                        fontSize: '13px'
                    }
                },
                showInLegend: true,
                tooltip: {
                    pointFormat: '{point.y}'
                },
                startAngle: 180
            }
        },
        credits: {
            enabled: false
        }
    });

    Highcharts.chart('villagers_flex_item2',{
        chart: {
            type: 'pie',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: 'Hobbies of Villagers'
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    formatter: function(){
                        return this.point.name
                    },
                    distance: -27,
                    style: {
                        textOutline: '0px',
                    }
                },
                tooltip: {
                    pointFormat: '{point.y}'
                },
                colors: ['#91C9E2','#A7E8BD','#D2D2BB','#FCBCB8','#F7C08D','#FFD972'],
                showInLegend: true,
                startAngle: 270
            }
        },
        series: [{
            type: 'pie',
            name: 'hobbies',
            data: hobbies_list
        }],
        credits: {
            enabled: false
        }
    })
}


function renderVillagersColumn(data){
    
    /* get the villagers species and their count */
    var villager_cnt = new Object();
    for (datum of data){
        let species = datum['Species'];
        if (!(species in villager_cnt)){
            villager_cnt[species] = 1;
        } else {
            villager_cnt[species] = Number(villager_cnt[species]) + 1;
        }
    }
    
    /* sort the count*/
    var sortable = [];
    for (var s in villager_cnt){
        sortable.push([s,villager_cnt[s]])
    };
    sortable.sort(function(a, b){
        return b[1] - a[1]
    });

    /* get the categories list */
    let cat = [];
    for (var i = 0; i < sortable.length; i++){
        cat.push(sortable[i][0])
    }

    /* draw the column chart for villagers */
    Highcharts.chart('villagers_column',{
        chart: {
            type: 'column',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: 'Species Counts of the Villagers'
        },
        xAxis: {
            categories: cat,
            title :{
                text: 'Species',
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Counts',
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        plotOptions: {
            column: {
                color: '#4BB3B3',
                pointWidth: 20,
                events: {
                    click: function(event){
                        drawVillagersTable(event.point.category, data)
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function(){
                return this.x + ': ' + this.y;
            }
        },
        series: [{
            data: sortable
        }],
        credits: {
            enabled: false
        }
    })

}

function drawVillagersTable(category,data){
    console.log(data)
    /* display the selected species title */
    document.getElementById('villagers_table_title').innerHTML = category;

    /* get the images list for selected species */
    images = [];
    names = [];
    for (datum of data){
        if (datum['Species'] == category){
            images.push(datum['Image']);
            names.push(datum['Name']);
        }
    }
    
    /* get the table element */
    var table = document.getElementById('villagers_table');

    /* remove the table if already existed */
    while (table.hasChildNodes()){
        table.removeChild(table.firstChild);
    }

    /* add images into table */
    let row_num = Math.ceil(images.length / 6);
    let index = 0;
    for(var i = 0; i < row_num; i++){
        var row = table.insertRow(i);
        for (var j = 0; j < 6; j++){
            if (index < images.length){
                var cell = row.insertCell(-1);
                cell.outerHTML = "<td><img src='" + images[index] + "' title='" + names[index] + "'></td>";
            }
            index += 1;
        }
    }
}

/*
var fishNorth = loadJSON('./data/fishNorth.json');
var fishSouth = loadJSON('./data/fishSouth.json');
var bugNorth = loadJSON('./data/bugNorth.json');
var bugSouth = loadJSON('./data/bugSouth.json');
*/

var buttonNorth = document.getElementById('northButton');
var buttonSouth = document.getElementById('southButton');
buttonNorth.addEventListener('click', function(){
    /*
    fishNorth.then(function(s){
        renderFishTimeLine(s,true)
    });
    bugNorth.then(function(s){
        renderBugTimeLine(s,true)
    })
    */
   renderFishTimeLine(fishNorth,true);
   renderBugTimeLine(bugNorth, true);
});
buttonSouth.addEventListener('click', function(){
    /*
    fishSouth.then(function(s){
        renderFishTimeLine(s,false)
    });
    bugSouth.then(function(s){
        renderBugTimeLine(s,false)
    })
    */
   renderFishTimeLine(fishSouth, false);
   renderBugTimeLine(bugSouth, false);
});


function renderFishTimeLine(data,north){
    if (north){
        var timeline_title = 'Available Types of Fish in Each Month (North)';
        var timeline_data = [{
            name:'Jan',
            label: '31 types'
        },{
            name:'Feb',
            label: '31 types'
        },{
            name:'Mar',
            label: '35 types'
        },{
            name:'Apr',
            label: '39 types'
        },{
            name:'May',
            label: '44 types'
        },{
            name:'Jun',
            label: '55 types'
        },{
            name:'Jul',
            label: '58 types'
        },{
            name:'Aug',
            label: '60 types'
        },{
            name:'Sep',
            label: '63 types'
        },{
            name:'Oct',
            label: '42 types'
        },{
            name:'Nov',
            label: '37 types'
        },{
            name:'Dec',
            label: '32 types'
        }];
    } else {
        var timeline_title = 'Available Types of Fish in Each Month (South)';
        var timeline_data = [{
            name:'Jan',
            label: '58 types'
        },{
            name:'Feb',
            label: '60 types'
        },{
            name:'Mar',
            label: '63 types'
        },{
            name:'Apr',
            label: '42 types'
        },{
            name:'May',
            label: '37 types'
        },{
            name:'Jun',
            label: '32 types'
        },{
            name:'Jul',
            label: '31 types'
        },{
            name:'Aug',
            label: '31 types'
        },{
            name:'Sep',
            label: '35 types'
        },{
            name:'Oct',
            label: '39 types'
        },{
            name:'Nov',
            label: '44 types'
        },{
            name:'Dec',
            label: '55 types'
        }];
    }


    Highcharts.chart('collects_fish_time',{
        chart: {
            type:'timeline',
            inverted: true,
            height: 550,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: timeline_title,
            style: {
                color: '#665d4a',
                fontWeight: 'normal'
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        plotOptions:{
            timeline: {
                marker: {
                    width: 25,
                    height: 25
                }
            }
        },
        series: [{
            data: timeline_data
        }],
        tooltip: {
            useHTML: true,
            formatter: function(){
                return drawCollectsTooltip(this.point.name,data)
            }
        },
        credits: {
            enabled: false
        }
    })
}

function renderBugTimeLine(data,north){
    if (north){
        var timeline_title = 'Available Types of Bug in Each Month (North)';
        var timeline_data = [{
            name:'Jan',
            label: '20 types'
        },{
            name:'Feb',
            label: '21 types'
        },{
            name:'Mar',
            label: '27 types'
        },{
            name:'Apr',
            label: '36 types'
        },{
            name:'May',
            label: '43 types'
        },{
            name:'Jun',
            label: '48 types'
        },{
            name:'Jul',
            label: '61 types'
        },{
            name:'Aug',
            label: '63 types'
        },{
            name:'Sep',
            label: '51 types'
        },{
            name:'Oct',
            label: '34 types'
        },{
            name:'Nov',
            label: '27 types'
        },{
            name:'Dec',
            label: '20 types'
        }];
    } else {
        var timeline_title = 'Available Types of Bug in Each Month (South)';
        var timeline_data = [{
            name:'Jan',
            label: '61 types'
        },{
            name:'Feb',
            label: '63 types'
        },{
            name:'Mar',
            label: '51 types'
        },{
            name:'Apr',
            label: '34 types'
        },{
            name:'May',
            label: '27 types'
        },{
            name:'Jun',
            label: '20 types'
        },{
            name:'Jul',
            label: '20 types'
        },{
            name:'Aug',
            label: '21 types'
        },{
            name:'Sep',
            label: '27 types'
        },{
            name:'Oct',
            label: '36 types'
        },{
            name:'Nov',
            label: '43 types'
        },{
            name:'Dec',
            label: '48 types'
        }];
    }


    Highcharts.chart('collects_bug_time',{
        chart: {
            type:'timeline',
            inverted: true,
            height: 550,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)'
        },
        title: {
            text: timeline_title,
            style: {
                color: '#665d4a',
                fontWeight: 'normal'
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        plotOptions:{
            timeline: {
                marker: {
                    width: 25,
                    height: 25
                }
            }
        },
        series: [{
            data: timeline_data
        }],
        tooltip: {
            useHTML: true,
            formatter: function(){
                return drawCollectsTooltip(this.point.name,data)
            }
        },
        credits: {
            enabled: false
        }
    })
}

/* draw the images on tooltips */
function drawCollectsTooltip(name,data){
    let images = '';
    let cnt = 0;
    let total = 0;
    /* store the images into html text */
    for (datum of data){
        if (Number(datum[name]) == 1){
            total += 1;
            cnt += 1;
            /* 6 images in one row */
            if (cnt == 6){
                images+='<td><img src="'+datum['Image']+'" height=35 /></td></tr><tr>';
                cnt = 0;
            } else{
                images+='<td><img src="'+datum['Image']+'" height=35 /></td>';
            }
        }
    }

    return '<p style="font-size:13px;font-weight:bold">'+name+': '+total+' in total</p><table><tr>'+images+'</tr></table>';
}