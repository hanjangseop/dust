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

google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(fetchData);

function fetchData() {
  var ad_id = $("#ad_id").val();
  $.get("http://dust.toycode.org/avg/" + ad_id, function(data) {
    drawBasic(data);
  });
}

function drawBasic(result) {
  $("#loading").hide();
  $("#content").show();
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', 'Dust Density');
  data.addColumn({type: 'string', role: 'tooltip'});
  data.addRows(
    result.map(function(obj, index) {
      var time = obj[0]._id - obj[0]._id % 10000,
          value = parseInt(obj[0].dustvalue*100+0.5,10),
          tooltip;
      tooltip = "측정시간: " + moment(time).format('h a', 'kr') + "\n먼지측정값 : " + value;
      return [new Date(time), value, tooltip];
    })
  );

  var options = {
    hAxis: {
     title: 'Time of Day',
     format: 'dd일 h a',
     gridlines: {
       count: -1
     },
   },
    vAxis: {
      title: 'Dust Density'
    },
    tooltip: {isHtml: true},
    legend: {position: 'none'}
  };


  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));


  chart.draw(data, options);
}
