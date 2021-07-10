"use strict";

//client side javacript
$(document).ready(function () {
  var otp;
  var otpVarified = false;
  $('#otp').click(function () {
    $('#spinnerOTP').css("display", "block");
    var mobile = $('#mobile').val();

    if (mobile.toString().length == 10) {
      $('#otp').attr('disabled', true); //disable it

      $.post("/form/sendOTP", {
        mobile: mobile
      }, function (data, status) {
        $('#spinnerOTP').css("display", "none");
        $('#spinnerOTP').css("display", "none");
        $('#otpDiv').removeAttr('hidden'); //show this

        if (status === "success") {
          if (data.isSent) {
            otp = data.otp;
            alert("OTP sent successfully to " + mobile);
          } else {
            alert("an error occured, please try again.");
          }
        } else {
          alert("an error occured while sending sms. please try later.");
        }
      });
    } else {
      alert("Please enter valid mobile number");
    }
  });
  $('#cOTP2').click(function () {
    var userOTP = $('#cOTP').val();

    if (otp == userOTP) {
      alert('OTP confirmed successfully');
      otpVarified = true;
    } else {
      alert("OTP not matched");
    }
  });
  $('#pin').blur(function () {
    var pincode = $('#pin').val();
    var uri = "https://api.postalpincode.in/pincode/".concat(pincode);
    var place = $('#place');
    var state = $('#state');
    var country = $('#country');
    $("#spinnerPin").css("display", "block"); //spinner start

    $.get(uri, function (data, status) {
      $("#spinnerPin").css("display", "none"); //spinner vanish

      var resultArray = data[0].PostOffice;
      place.empty();
      state.empty();
      country.empty();
      place.append("<option value=\"\" > --city/villege/area-- </option>");
      state.append("<option value=\"\"> --select state-- </option>");
      country.append("<option value=\"\"> --select country-- </option>");
      var x = true;
      resultArray.forEach(function (element) {
        var placeD = element.Name;
        var stateD = element.State;
        var countryD = element.Country;
        var html1 = "<option value=\"".concat(placeD, "\"> ").concat(placeD, " </option>");
        var html2 = "<option value=\"".concat(stateD, "\"> ").concat(stateD, " </option>");
        var html3 = "<option value=\"".concat(countryD, "\"> ").concat(countryD, " </option>");
        place.append(html1);

        if (x) {
          state.append(html2);
          country.append(html3);
          x = false;
        }
      });
    });
  }); //now handle form submission here

  $('#userForm').submit(function () {
    var ok = false; //check for password format 

    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
    var password = $('#passwd').val();

    if (!pattern.test(password)) {
      alert('Password is not in the requested format!');
    } //check if both password fields have same value 


    if ($('#passwd').val() != $('#passwdC').val()) {
      alert("passwords not matched! please recheck.");
      $('passwdC').focus();
      event.preventDefault();
    }

    var place = $('#place').val();
    var state = $('#state').val();
    var country = $('#country').val();

    if (place == '' || state == '' || country == '') {
      alert('place, state or country not selected!');
      event.preventDefault();
    } //check if otp is varified 


    if (!otpVarified) {
      alert('entered mobile number not varified with otp! please check.');
      event.preventDefault();
    } //finally check for filesize 
    // let size = $('#resume').files[0].size; 


    var size = document.getElementById('resume').files[0].size;

    if (size > 2 * Math.pow(10, 6)) {
      alert("resume file size is more than allowed size!");
      $('#resume').focus();
      event.preventDefault();
    }
  });
});