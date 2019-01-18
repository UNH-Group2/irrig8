//get info for single zone
function getZoneInfo(){
  $.get("/api/device/:deviceId/zones/:zoneId/details", function(data){
    console.log(data);
  });
}

//turn zone on
function zoneOn(data){
  $.ajax({
    method: "PUT",
    url: "/api/zone/on",
    data: data
  }).then(console.log(data));
}

//turn zone off
function zoneOff(data){
  $.ajax({
    method: "PUT",
    url: "/api/zone/off",
    data: data
  }).then(console.log(data));
}

$(document).ready(function(){
  
  // getZones();
  getZoneInfo();
  // zoneOn();
  // zoneOff();
},
//when we click on/off
$(".onOffBtn").on("click", function () {

//get zone id and change running state
  var id = $(this).data("zoneid");
  console.log(id);
  //var runningState = ;

  //if click OFF
  //if (runningState === 0) {

  //var newState = {
  //running: 1
  //};

  $(this).text("Turn Off");
  $(this).addClass("btn-danger");

  // Send the request.
  // $.ajax("/api/device/:deviceId/zones", {
  //   type: "GET"
  // });
//};

//if click ON
//if (runningState === 1) {

//var newState = {
//running: 0
//};

//$(this).text("Turn On");
//$(this).addClass("btn-success");

// Send the request.
//$.ajax("/api/device/:deviceId/zones", {
//type: "GET",
//})
//};

}));

//when we click manage
$(".detailBtn").on("click", function(){
  $(".collapse").toggle();
  
  var id = $(this).data("zoneid");
  console.log(id);
  
});