var $login = $("#login");

var handleLoginClick = function () {
  event.preventDefault();
  var homePassword = document.getElementById("homePassword");
  var homeEmail = document.getElementById("homeEmail");
  alert(homePassword.value);
  alert(homeEmail.value);
};
$login.click(handleLoginClick);