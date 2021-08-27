const url = "/auth/";
const _ = (k) => k;

function checkIfEmpty(value) {
    if (value.length == 0) {
        return true;
    }
    return false;
}

m2d2.ready($ => {
    /*
     * Actions to perform during login / logout
     * @param isOn: true = login, false = logout
     */
    function authLogin(isIn) {
        if(isIn) {
            //loading.show = false;
            //login.show = false;
            //logout.show = true;
            //profile.form.css = "edit";
            // Set editable fields:
            //profile.name.readOnly = false;
            //profile.age.readOnly = false;
            //profile.hobby.readOnly = false;
            //profile.name.title = "Names are only accepted in the format: 'first_name<space>last_name'";
            $.session.set("logged", true);
            $.post("/atn/page", (res) => {
                window.location.href = res.page;
            });
        } else {
            //loading.show = false;
            //login.show = true;
            //logout.show = false;
            //profile.form.css = "";
            // Readonly fields:
            //profile.name.readOnly = true;
            //profile.age.readOnly = true;
            //profile.hobby.readOnly = true;
            //profile.name.title = "";
            $.session.clear();
        }
    }
    $.dict.set({
        yes : {
            en : "YES"
        },
        no : {
            en : "NO"
        },
        ok : {
            en : "OK"
        },
        cancel : {
            en : "CANCEL"
        }
    });
    /*$.ws.connect({
        port    : 8080,
        path    : "system",
        disconnected : () => {
            console.log("QUIT", "");
        }
    }, json => {
        console.log("Received", "pong");
        console.log(json);
        switch (json.request) {
            case "login":
                if (json.ok) {
                    applicants_list_admin.loadData(json.data);
                } else {
                    $.failure("Login failed!");
                }
                break;
            case "logout":
                if (json.ok) {
                    $.alert("Success!");
                    tools.arrived.text = json.arrived;
                } else {
                    $.failure("Logout failed!");
                }
                break;
            default:
                break;
        }
    });*/
    var user = $(username, {
        onload : function() {
            this.focus();
        }
    });
    var pass = $(password, {});
    $(form_login, {
        onsubmit : function(ev) {
            if (checkIfEmpty(user.value) || checkIfEmpty(pass.value)) {
                $.failure("Please check for empty field");
                user.focus();
            } else {
                if ($.session.get("logged") == "true") {
                    $.alert("You are already logged in.");
                } else {
                    var data = {
                        user : user.value,
                        pass : pass.value
                    };
                    $.session.set("user", user.value);
                    $.post(url + "login", data, (res) => {
                        console.log(res);
                        console.log("Login successful!");
                        authLogin(true);
                    }, () => {
                        console.log("Login failed!");
                        authLogin(false);
                        $.failure("Username or Password is incorrect");
                    }, true);
                }
            }
            return false;
        }
    });
    $(label_hide_show, {});
    $(show_hide, {
        text : "Show Password",
        onclick : function(ev) {
            if (pass.type === "password") {
                pass.type = "text";
                label_hide_show.text = "Hide Password"
            } else {
                pass.type = "password";
                label_hide_show.text = "Show Password"
            }
        }
    });
    $(login, {
        onclick : function(ev) {
            /*$.ws.request({
                request : "login",
                data : {
                    user : user.value,
                    pass : pass.value,
                    post : post.text
                }
            })*/
        },
        onload : function() {
            if ($.session.get("logged") === true) {
                authLogin(true);
            }
        }
    });
});