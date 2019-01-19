//begin as false for now, needs logic to determine if on or off
var isRunning = false;

//get usage info for single zone
function getZoneInfo(zoneId) {

  //console.log(zoneId + "power: " + data[0].power);

  $.get("/api/zones/" + zoneId + "/details", (data) =>{
    updateZoneInfo(data, zoneId);
  });

}

let updateZoneInfo = (data, zoneId)=>{

  var recentUsage = [data[0].ZoneUsages[data[0].ZoneUsages.length - 1], data[0].ZoneUsages[data[0].ZoneUsages.length - 2], data[0].ZoneUsages[data[0].ZoneUsages.length - 3]];

  // var test = moment(usage[0].startDateTime).format("MMM, Do");

  var usage = [
    {
      start: recentUsage[0].startDateTime,
      duration: recentUsage[0].minutes
    },
    {
      start: recentUsage[1].startDateTime,
      duration: recentUsage[1].minutes
    },
    {
      start: recentUsage[2].startDateTime,
      duration: recentUsage[2].minutes
    }
  ];

  // usage.map((currentUsage)=>{
  //   console.log("start: ", currentUsage.start);
  //   console.log("duration: ", currentUsage.duration);
  //   console.log("power: ", currentUsage.power);
    
  // }); 

  let status = "";

  console.log("duration: ", usage[0].duration);

  console.log("minutes: " + recentUsage[0].minutes);

  if (usage[0].duration === 0) {
    console.log("active");
    status = "Inactive";
  }
  else{
    console.log("inactive");
    status = "Active";
  }

  // console.log(status);

  $("#" + zoneId + "-details").html("<p>Status: " + status + "<p>start: " + usage[0].start + "<p>" + "<p>duration: " + usage[0].duration + "<p><p>start: " + usage[1].start + "<p>" + "<p>end: " + usage[1].duration + "<p><p>start: " + usage[2].start + "<p>" + "<p>end: " + usage[0].duration + "<p>");

};

//turn zone on
function zoneOn(zone) {
  $.ajax("/api/zone/on", {
    type: "POST",
    data: zone, 
    success:getZoneInfo(zone.zoneId)
  });
  // //refresh zone usage
  // getZoneInfo(zone.zoneId);
}

//turn zone off
function zoneOff(zone) {
  $.ajax("/api/zone/off", {
    type: "PUT",
    data: zone,
    success:getZoneInfo(zone.zoneId)
  });
  // //refresh zone usage
  // getZoneInfo(zone.zoneId);
}

//when we click on/off
$(".onOffBtn").on("click", function () {

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
      deviceId: $(this).data("deviceid"),
      zoneId: $(this).data("zoneid")
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

  //display collapse for given zone
  $("#" + id).toggle();
});