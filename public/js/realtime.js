google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(realdata);
$.get("http://dust.toycode.org/ad_id/", function(ids) {
  ids.forEach(function(item) {
    $("#ad_id").append("<option>" + item.item + "</option>");
  });
});
function realdata() {
  var ad_id = $("#ad_id").val();
  $.get("http://dust.toycode.org/all/" + ad_id, function(data) {
    drawBasic(data);
  });
  setTimeout(realdata, 10 * 1000);
}

function drawBasic(result) {
  $("#loading").hide();
  $("#content").show();

  console.log(result[0].date);
  $('#dustvalue').text(parseInt(result[0].dustvalue*100+0.5,10));
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', 'Dust Density');
  data.addColumn({type: 'string', role: 'tooltip'});
  data.addRows(
    result.map(function(obj, index) {
      var time = obj.date - obj.date % 10000,
          value = parseInt(obj.dustvalue*100+0.5,10),
          tooltip;
      tooltip = "측정시간: " + moment(time).format('h시mm분ss초', 'kr') + "\n먼지측정값 : " + value +"µg/m³";
      return [new Date(time), value, tooltip];
    })
  );

  var options = {
    hAxis: {
      gridlines: {
        count: -1,
        units: {
          days: {format: ['MMM dd']},
          hours: {format: ['HH:mm', 'ha']},
        }
      },
      minorGridlines: {
        units: {
          hours: {format: ['hh:mm:ss a', 'ha']},
          minutes: {format: ['HH:mm a Z', ':mm']}
        }
      }
    },
    vAxis: {
      title: 'Dust Density'
    },
    tooltip: {isHtml: true},
    legend: {position: 'none'}
  };


  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  chart.draw(data, options);
}
