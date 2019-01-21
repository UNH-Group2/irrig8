var logout = $("#logout");

$(document).ready(function () {
  logout.on("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/login";
  });
});

$("#login").on("click", function () {
  localStorage.setItem("username", $("#username").val());
  localStorage.setItem("password", $("#password").val());
});

$("#login-rachio").on("click", () => {
  $("#login-form").attr("action", "/login/rachio").submit();
});