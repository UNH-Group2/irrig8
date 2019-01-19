var logout = $("#logout");

$(document).ready(function () {
  logout.on("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/login";
  });
});