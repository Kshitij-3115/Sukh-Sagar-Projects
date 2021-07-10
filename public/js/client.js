


//client side javacript
$(document).ready(()=>{
    let otp; 
    let otpVarified = false; 
    $('#otp').click( () => {       
        $('#spinnerOTP').css("display","block")
        let mobile = $('#mobile').val(); 
        if(mobile.toString().length == 10){
            $('#otp').attr('disabled',true); //disable it
            
            $.post("/form/sendOTP",{mobile:mobile}, (data,status) => {
                $('#spinnerOTP').css("display","none");
                $('#spinnerOTP').css("display","none");
                $('#otpDiv').removeAttr('hidden'); //show this
                if(status==="success"){
                    if(data.isSent){
                        otp = data.otp; 
                        alert("OTP sent successfully to " + mobile);
                    } else {
                        alert("an error occured, please try again."); 
                    }
                } else {
                    alert("an error occured while sending sms. please try later.")
                }
               
            })
        } else {
            alert("Please enter valid mobile number");
        }
    })

   

    $('#cOTP2').click(() => {
        let userOTP = $('#cOTP').val();

        if(otp == userOTP){
            alert('OTP confirmed successfully');
            otpVarified = true;  
        }else {
            alert("OTP not matched"); 
        }
    })

    $('#pin').blur( () => {
        let pincode = $('#pin').val();
        let uri = `https://api.postalpincode.in/pincode/${pincode}` 
        let place = $('#place'); 
        let state = $('#state'); 
        let country = $('#country');
        $("#spinnerPin").css("display","block");  //spinner start
        $.get(uri,(data,status)=>{
            $("#spinnerPin").css("display","none"); //spinner vanish
            let resultArray = data[0].PostOffice; 
            place.empty();
            state.empty(); 
            country.empty(); 
            place.append(`<option value="" > --city/villege/area-- </option>`); 
            state.append(`<option value=""> --select state-- </option>`); 
            country.append(`<option value=""> --select country-- </option>`); 
            let x = true; 
            resultArray.forEach(element => {
               let placeD = element.Name; 
               let stateD = element.State; 
               let countryD = element.Country; 
               let html1 = `<option value="${placeD}"> ${placeD} </option>`;
               let html2 = `<option value="${stateD}"> ${stateD} </option>`; 
               let html3 = `<option value="${countryD}"> ${countryD} </option>`;
               place.append(html1); 
               if(x){
                state.append(html2); 
                country.append(html3); 
                x = false; 
               }
               

            });
             
        })
    })

    //now handle form submission here
    $('#userForm').submit( () =>{
        let ok = false;
        //check for password format 
        let pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/; 
        let password = $('#passwd').val(); 
        if(!pattern.test(password)){
            alert('Password is not in the requested format!'); 
        }
        //check if both password fields have same value 
        if($('#passwd').val() != $('#passwdC').val()){
            alert("passwords not matched! please recheck."); 
            $('passwdC').focus();
            event.preventDefault();  
        }
        let place = $('#place').val(); 
        let state = $('#state').val();
        let country = $('#country').val();
        if(place=='' || state=='' || country==''){
            alert('place, state or country not selected!'); 
            event.preventDefault(); 
        }

        //check if otp is varified 
        if(!otpVarified) {
            alert('entered mobile number not varified with otp! please check.'); 
            event.preventDefault(); 
        }
        //finally check for filesize 

        // let size = $('#resume').files[0].size; 
       let size =  document.getElementById('resume').files[0].size;  
        if(size > 2*Math.pow(10,6)){
            alert("resume file size is more than allowed size!");
            $('#resume').focus(); 
            event.preventDefault(); 
        }
        

         
    }) 


})

