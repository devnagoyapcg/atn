var url = "/auth/";
var urlAtn = "/atn/";
const _ = (k) => k;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalizeWords(string) {
    return string.replace(/(?:^|\s|-)\S/g, function(a) { return a.toUpperCase(); });
}
function getNewDate(newDateTime) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    return newDateTime ? new Date(newDateTime) : firstDay;
}
function getDate(newDateTime) {
    return getNewDate(newDateTime).toLocaleDateString("ja-JP", { year: "numeric", month:"2-digit", day:"2-digit", timezone : "Tokyo/Asia" }).replace(/[/]/g,"-");
}
function getTime(newDateTime) {
    return getNewDate(newDateTime).toLocaleTimeString("ja-JP", { timezone : "Tokyo/Asia" });
}
const randomColor = () => {
    return "#" + Math.random().toString(16).slice(2, 8);
}

m2d2.ready($ => {
    google.charts.load('current', {packages: ['corechart']});
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
            var from = date_start.value;
            var to = date_end.value;
            var data = {
                start : from,
                end : to,
                officer : officers.value
            };
            $.post(urlAtn + "generate", data, (res) => {
                statistics_data.drawChart(res.data);
            }, true);
            search.focus();
        },
        onresize : function() {
            var from = date_start.value;
            var to = date_end.value;
            var data = {
                start : from,
                end : to,
                officer : officers.value
            };
            $.post(urlAtn + "generate", data, (res) => {
                statistics_data.drawChart(res.data);
            }, true);
        }
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
    /*window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        var confirmationMessage = "\\o/";

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    });*/
});