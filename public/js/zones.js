//when we click on/off
$(".onOffBtn").on("click", function (event) {

//get zone id and change running state
  var id = $(this).data("zoneId");
  console.log(id);
  //var runningState = ;

  //if click OFF
  //if (runningState === 0) {

  //var newState = {
  //running: 1
  //};

  $(this).text("Off");
  $(this).addClass("btn-danger");

  // Send the request.
  $.ajax("/api/device/:deviceId/zones", {
    type: "GET"
  });
//};

//if click ON
//if (runningState === 1) {

//var newState = {
//running: 0
//};

//$(this).text("On");
//$(this).addClass("btn-success");

// Send the request.
//$.ajax("/api/device/:deviceId/zones", {
//type: "GET",
//})
//};

//when we click the image


});
