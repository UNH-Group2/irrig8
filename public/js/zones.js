
$(document).ready(function() {

//get usage info for single zone
  function getZoneInfo(zoneId) {
    $.ajax
    ({
      headers: {
        "Authorization": "Basic " + btoa(`${localStorage.getItem("username")}:${localStorage.getItem("password")}`)
      },
      type: "GET",
      url: "/api/zones/" + zoneId + "/details",
      success: (data) =>{
        updateZoneInfo(data, zoneId);
      }
    });
  }

  let updateZoneInfo = (data, zoneId) => {

    updateOnOffButtonState(data, zoneId); 

    const maxRows = 5;
    let status = data[0].power === "off" ? "Inactive" : "Active";
    var divHTML = $("<div>");
    var table = $("<table>");
    var thStart = $("<th>").append("Start");
    var thDuration = $("<th>").append("Duration (min:sec)");
    var trHdr = $("<tr>");
    var pStatus = $("<p>").text("Status: " + status);

    pStatus.addClass("usage-status-lbl");
    table.addClass("usage-detail-tbl");
    divHTML.append(pStatus);
    divHTML.append(table);
    table.append(trHdr);
    trHdr.append(thStart);
    trHdr.append(thDuration);

    let maxIdx = data[0].ZoneUsages.length < maxRows ? data[0].ZoneUsages.length : maxRows;
    for (let i=0; (i < maxIdx); i++) {
      let item = data[0].ZoneUsages[i];
      var tr = $("<tr>");
      var tdStart = $("<td>").html(item.startDateTime);
      var tdDuration = $("<td>").html(item.minutes + "m : " + item.seconds + "s" );
      table.append(tr);
      tr.append(tdStart);
      tr.append(tdDuration);
    }

    $("#" + zoneId + "-details").hide();
    $("#" + zoneId + "-details").html(divHTML);
    $("#" + zoneId + "-details").show();
  };

  function updateOnOffButtonState(data, zoneId) {

    let onOffbtn = $("#" + zoneId + "-onOffBtn");

    if (data[0].power === "on") {
      onOffbtn.text("Turn Off");
      onOffbtn.removeClass("btn-success");
      onOffbtn.addClass("btn-danger");
      onOffbtn.data("isrunning", true);
    } else {
      onOffbtn.text("Turn On");
      onOffbtn.removeClass("btn-danger");
      onOffbtn.addClass("btn-success");
      onOffbtn.data("isrunning", false);
    }
  }
  
  //when we click on/off
  $(".onOffBtn").on("click", function () {

    //save data for request  
    var zone = {
      rachioZoneId: $(this).data("rachio-zoneid"),
      deviceId: $(this).data("deviceid"),
      zoneId: $(this).data("zoneid")
    };

      //if off, turn on
    let isRunning = $(this).data("isrunning");
    if (!isRunning) {

      turnZoneOn(zone);
    } else {

      //is on, turn off
      turnZoneOff(zone);
    }
  });

  //turn zone on
  function turnZoneOn(zone) {
    $.ajax("/api/zone/on", {
      headers: {
        "Authorization": "Basic " + btoa(`${localStorage.getItem("username")}:${localStorage.getItem("password")}`)
      },
      type: "POST",
      data: zone, 
      success: () =>{
        $(".onOffBtn").trigger("powerStateRefresh");
      }
    });
  }

  //turn zone off
  function turnZoneOff(zone) {
    $.ajax("/api/zone/off", {
      headers: {
        "Authorization": "Basic " + btoa(`${localStorage.getItem("username")}:${localStorage.getItem("password")}`)
      },
      type: "PUT",
      data: zone,
      success: () =>{
        $(".onOffBtn").trigger("powerStateRefresh");
      }
    });
  }

  //when we click manage
  $(".detailBtn").on("click", function () {
    //get zone id from button and send request
    var id = $(this).data("zoneid");
    getZoneInfo(id);

    //display collapse for given zone
    $("#" + id).toggle();
  });

  // If one zone powers off, all zones should now be refreshed to off too
  $(".onOffBtn").on("powerStateRefresh", function () {
    let id = $(this).data("zoneid");
    getZoneInfo(id);
  });

});