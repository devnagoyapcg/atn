var url = "/auth/";
var urlAtn = "/atn/";
const _ = (k) => k;
//var pdfmake = require('pdfmake');

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
            en : "CANCEL"
        },
        upload : {
            en : "UPLOAD"
        },
        delete : {
            en : "DELETE"
        },
        print : {
            en : "PRINT"
        },
        save : {
            en : "SAVE"
        }
    });
    $(user, {});
    $(admin, {
        onload : function() {
            if ($.session.get("logged") === true) {
                user.text = "Welcome, " + $.session.get("user") + "!";
            } else {
                $.session.clear();
                window.location.href = "/";
            }
        }
    });
});