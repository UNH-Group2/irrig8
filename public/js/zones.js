
$(document).ready(function() {

  //get usage info for single zone
  function getZoneInfo(zoneId) {

    $.get("/api/zones/" + zoneId + "/details", (data) =>{
      updateZoneInfo(data, zoneId);
    });

  }

  let updateZoneInfo = (data, zoneId)=>{

    const maxRows = 5;
    let usage = [];
    let maxIdx = data[0].ZoneUsages.length < maxRows ? data[0].ZoneUsages.length : maxRows;
    for (let i=0; (i < maxIdx); i++) {
      let item = data[0].ZoneUsages[i];
  
      let entry = {};
      entry.start = item.startDateTime;
      entry.minutes = item.minutes;
      entry.seconds = item.seconds;
      usage.push(entry);
    }

    let zone = data[0];
    let status = "";
    if (zone.power === "off") {
      status = "Inactive";
    }
    else{
      status = "Active";
    }

    // Construct a table for the card usage details
    // <div>
    //   <p>Status: Active/Inactive</p>
    //   <table>
    //     <tr>
    //       <th>Start</th>
    //       <th>Duration</th>
    //     </tr>
    //     <tr>
    //       <td>YYYY-MM-DD HH:mm:ss</td>
    //       <td>mm:ss</td>
    //     </tr>
    //   </table>
    // </div>
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
    for (let i=0; (i < maxIdx); i++) {
      var tr = $("<tr>");
      var tdStart = $("<td>").html(usage[i].start);
      var tdDuration = $("<td>").html(usage[i].minutes + "m : " + usage[i].seconds + "s" );
      table.append(tr);
      tr.append(tdStart);
      tr.append(tdDuration);
    }
    $("#" + zoneId + "-details").html(divHTML);

  };

  //turn zone on
  function turnZoneOn(zone) {
    $.ajax("/api/zone/on", {
      type: "POST",
      data: zone, 
      success:getZoneInfo(zone.zoneId)
    });
  }

  //turn zone off
  function turnZoneOff(zone) {
    $.ajax("/api/zone/off", {
      type: "PUT",
      data: zone,
      success:getZoneInfo(zone.zoneId)
    });
  }

  //when we click on/off
  $(".onOffBtn").on("click", function () {

    //if off, turn on
    let isRunning = $(this).data("isrunning");
    if (!isRunning) {

      //save data for request  
      var zone = {
        rachioZoneId: $(this).data("rachio-zoneid"),
        zoneId: $(this).data("zoneid")
      };

      //run zoneOn request and change button
      turnZoneOn(zone);
      $(this).text("Turn Off");
      $(this).removeClass("btn-success");
      $(this).addClass("btn-danger");
      $(this).data("isrunning", true);

    } else {
      //is on, turn off

      //save data for request
      var zone = {
        rachioDeviceId: $(this).data("rachio-deviceid"),
        deviceId: $(this).data("deviceid"),
        zoneId: $(this).data("zoneid")
      };

      //run zoneOff request and change button
      turnZoneOff(zone);
      $(this).text("Turn On");
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-success");
      $(this).data("isrunning", false);
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

});