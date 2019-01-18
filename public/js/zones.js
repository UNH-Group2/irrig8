//get info for single zone
function getZoneInfo(zone ){
  $.get("/api/zones/" + zone + "/details", function(data){
    console.log("here!", data);
  });
}

//when we click on/off
$(".onOffBtn").on("click", function () {

//get zone id and change running state
  var id = $(this).data("zoneid");
  console.log(id);

  $(this).text("Turn Off");
  $(this).addClass("btn-danger");

  
});

//when we click manage
$(".detailBtn").on("click", function(){
  
  var id = $(this).data("zoneid");
  console.log("We clicked: ",id);
  getZoneInfo(id);
  $("#" + id).toggle();
  
});