$.ajax({
  type: 'GET',
  url: 'http://dust.toycode.org/ad_id',
  async: false,
  success: function(ids) {
    ids.forEach(function(id) {
      $("#ad_id").append("<option>" + id + "</option>");
    });
    $("#ad_id").change(fetchData);
  }
});

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(fetchData);

var timekey = null;
function fetchData() {
  var ad_id = $("#ad_id").val();
  $.get("http://dust.toycode.org/all/" + ad_id, function(data) {
    drawBasic(data);
  });
  clearTimeout(timekey);
  timekey = setTimeout(fetchData, 10 * 1000);
}

function drawBasic(result) {
  $("#loading").hide();
  $("#content").show();

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
