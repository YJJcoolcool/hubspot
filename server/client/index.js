const formSubmitURL = window.location+"post"
const socket = io.connect('http://localhost');

$(document).ready(function() 
{
    document.querySelector("#uname").addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.querySelector("input[type='submit']").click()
            e.preventDefault();
        }
    });
    $("#login").submit(function(e) {               
        e.preventDefault(); // avoid to execute the actual submit of the form.

        if (checkvalid(document.querySelector("#uname").value)) {
            var form = $(this);
            var url = window.location+"post";
            
            $.ajax({
                type: "POST",
                url: url,
                data: form.serialize(), // serializes the form's elements.
                success: function(data) {
                    if (data==="1") {
                        document.querySelector("#error").innerHTML = "Sorry, that username is taken!";
                        document.querySelector("#error").style.display = "block";
                    }
                },
                error: function (obj, textStatus, errorThrown) {
                    console.log("Error "+textStatus+": "+errorThrown);
                }
            });
        }
        
        /*$.ajax({
            type: "POST",
            url: formSubmitURL,
            data: {
                username: username
            },
            success: function (response) {
                alert("OK")
            },
            error: function (obj, textStatus, errorThrown) {
                console.log("Error "+textStatus+": "+errorThrown);
            }
        });*/
    })
});

socket.on('username-reply',function(data){
    alert(data)
});

function checkvalid(username){
    let pass = true;
    let errmsg;
    if (!(/^[a-zA-Z].*/.test(username))){
        pass=false;
        errmsg="Username must start with a letter!";
    } else if (!(/^[a-zA-Z][a-zA-Z0-9\-\_\:\.]*$/.test(username))){
        pass=false;
        errmsg="Usernames can only contain letters (A-Z), numbers (0-9), hyphens (-), underscores (_), colons (:) and periods (.)!";
    }
    if (!pass){
        document.querySelector("#error").innerHTML = errmsg;
        document.querySelector("#error").style.display = "block";
    }
    return pass;
}