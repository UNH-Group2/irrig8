//turn zone on
function turnZoneOn(zone) {
  $.ajax("/api/zone/on", {
    headers: {
      "Authorization": "Basic " + btoa(`${localStorage.getItem("username")}:${localStorage.getItem("password")}`)
    },
    type: "POST",
    data: zone,
    beforeSend: function() {
      console.log("calling zone on");
    },
    success: function() {
      console.log("zone on success, updating info");
      getZoneInfo(zone.zoneId); 
    },
    error: function() {
      console.log("ajax zone on failed");
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
    beforeSend: function() {
      console.log("calling zone off");
    },
    success:function() {
      console.log("zone off success, updating info");
      getZoneInfo(zone.zoneId);
    },
    error: function() {
      console.log("ajax zone off failed");
    }
  });
}

//get usage info for single zone
function getZoneInfo(zoneId) {
  $.ajax({
    headers: {
      "Authorization": "Basic " + btoa(`${localStorage.getItem("username")}:${localStorage.getItem("password")}`)
    },
    type: "GET",
    url: "/api/zones/" + zoneId + "/details",
    success: (data) => {
      updateZoneInfo(data, zoneId);
    }
  });
}

// updates the screen elements of the usage history
let updateZoneInfo = (data, zoneId) => {

  const maxRows = 5;
  let usage = [];
  let maxIdx = data[0].ZoneUsages.length < maxRows ? data[0].ZoneUsages.length : maxRows;
  for (let i = 0;
    (i < maxIdx); i++) {
    let item = data[0].ZoneUsages[i];

    let entry = {};
    entry.start = item.startDateTime;
    entry.minutes = item.minutes;
    entry.seconds = item.seconds;
    usage.push(entry);
  }

  let zone = data[0];
  let status = zone.power === "off" ? "Inactive" : "Active";

  // Construct a two column table for the card usage details and put it in a master div element
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
  for (let i = 0; (i < maxIdx); i++) {
    var tr = $("<tr>");
    var tdStart = $("<td>").html(usage[i].start);
    var tdDuration = $("<td>").html(usage[i].minutes + "m : " + usage[i].seconds + "s");
    table.append(tr);
    tr.append(tdStart);
    tr.append(tdDuration);
  }

  var detailElem = $("#" + zoneId + "-details");
  detailElem.hide();
  detailElem.html(divHTML);
  detailElem.show();

};

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
    $(this).text("Turn Off");
    $(this).removeClass("btn-success");
    $(this).addClass("btn-danger");
    $(this).data("isrunning", true);
    turnZoneOn(zone);

  } else {
    //is on, turn off

    //save data for request
    var zone = {
      rachioDeviceId: $(this).data("rachio-deviceid"),
      deviceId: $(this).data("deviceid"),
      zoneId: $(this).data("zoneid")
    };

    //run zoneOff request and change button
    $(this).text("Turn On");
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-success");
    $(this).data("isrunning", false);
    turnZoneOff(zone);
  }
});

//when we click detail
$(".detailBtn").on("click", function () {

  //get zone id from button and send request
  var id = $(this).data("zoneid");
  getZoneInfo(id);

  //display collapse for given zone
  $("#" + id).toggle();
});