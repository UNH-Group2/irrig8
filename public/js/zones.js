//begin as false for now, needs logic to determine if on or off
var isRunning = false;

//turn zone on
function zoneOn(zone) {
  $.ajax("/api/zone/on", {
    type: "POST",
    data: zone
  });
}

//turn zone off
function zoneOff(zone) {
  $.ajax("/api/zone/off", {
    type: "PUT",
    data: zone
  });
}

//when we click on/off
$(".onOffBtn").on("click", function () {

  //hide all detail content
  $(".collapse").hide();

  //if off, turn on
  if (!isRunning) {

    //save data for request  
    var zone = {
      rachioZoneId: $(this).data("rachio-zoneid"),
      zoneId: $(this).data("zoneid")
    };

    //run zoneOn request and change button
    zoneOn(zone);
    $(this).text("Turn Off");
    $(this).removeClass("btn-success");
    $(this).addClass("btn-danger");
    isRunning = true;
  }

  //if on, turn off
  else if (isRunning) {

    //save data for request
    var zone = {
      rachioDeviceId: $(this).data("rachio-deviceid"),
      deviceId: $(this).data("deviceid")
    };

    //run zoneOff request and change button
    zoneOff(zone);
    $(this).text("Turn On");
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-success");
    isRunning = false;
  }

});

//when we click manage
$(".detailBtn").on("click", function () {

  //get zone id from button and send request
  var id = $(this).data("zoneid");
  getZoneInfo(id);

  //get info for single zone
  function getZoneInfo(zone) {
    $.get("/api/zones/" + zone + "/details", function (data) {
      
      var lastUsage = data[0].ZoneUsages[data[0].ZoneUsages.length-1];

      $("#" + id + "-details").html("<p>start: " + lastUsage.startDateTime + "<p>" + "<p>end: " + lastUsage.endDateTime + "<p>");
    
      //display collapse for given zone
      $("#" + id).toggle();
    });
  }
});