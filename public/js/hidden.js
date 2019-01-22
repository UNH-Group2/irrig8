$(function() {
  let username = $("#username").val();
  let password = $("#password").val();

  localStorage.setItem("username", username);
  localStorage.setItem("password", password);

  $("#hidden-form").attr("action", "/login").submit();
});