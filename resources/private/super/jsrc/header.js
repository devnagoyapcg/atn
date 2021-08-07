m2d2.ready($ => {
    $(logout, {
        onclick : function(ev) {
            $.confirm("Are you sure you want to logout?", (res) => {
                if (res) {
                    $.post(url + "logout", (res) => {
                        if (res) {
                            localStorage.removeItem("logged");
                            console.log("You have been logged-out");
                            window.location.href = "login.html";
                        } else {
                            $.failure("Error logging out");
                        }
                    }, (res) => {
                        console.log("Error encountered!");
                    });
                }
            });
        }
    });
});