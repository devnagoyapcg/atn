var url = "/auth/";
var urlAtn = "/atn/";
const _ = (k) => k;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWords(string) {
    return string.replace(/(?:^|\s|-)\S/g, function(a) { return a.toUpperCase(); });
};

m2d2.ready($ => {
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
            en : "CANCEL",
        },
        upload : {
            en : "UPLOAD",
        },
        delete : {
            en : "DELETE",
        },
        edit : {
            en : "EDIT",
        },
        print : {
            en : "PRINT",
        },
        save : {
            en : "SAVE",
        }
    });
    $(user, {});
    $(admin, {
        onload : function() {
            if ($.session.get("logged") === true) {
                user.text = "Welcome, " + $.session.get("user") + "!";
                init();
            } else {
                $.session.clear();
                window.location.href = "/";
            }
        },
    });
    $.get(urlAtn + "level", (res) => {
        console.log("User level is " + res.level);
        $.session.set("level", res.level);
    });
    function init() {
        button_edit_password.disabled = true;
        user_lastname.value         = "";
        user_firstname.value        = "";
        username.value              = "";
        user_password.value         = "";
        user_confirm_password.value = "";
        $.session.set("id", 0);
        $.session.set("userid", 0);
    };
});