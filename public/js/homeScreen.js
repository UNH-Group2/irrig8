var $login = $("#login");

var handleLoginClick = function () {
  alert("login click selected");
  event.preventDefault();
  var password = document.getElementById("password");
  var username = document.getElementById("username");
  alert(password.value);
  alert(username.value);
};
// $login.click(handleLoginClick);
