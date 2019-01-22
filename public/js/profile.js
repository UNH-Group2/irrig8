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

$("#register").on("click", function () {

  let userData = {
    username: $("#username").val(),
    password: $("#password").val(),
    rachioOAuthToken: $("#rachioOAuthToken").val()
  };

  $.ajax("/api/user", {
    type: "POST",
    data: userData, 
    success: (response) =>{
      console.log(response);
      window.location.href = "/login";
    },
    error: (response) =>{
      $("#errorMessage").text(response.responseJSON.errorMessage);
    }
  });
});