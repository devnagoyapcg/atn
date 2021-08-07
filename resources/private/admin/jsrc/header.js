m2d2.ready($ => {
    $(logout, {
        onclick : function(ev) {
            $.confirm("Are you sure you want to logout", (res) => {
                if (res) {
                    $.get(url + "logout", (res) => {
                        if (res) {
                            $.get(url + "logout", (res) => {
                                if (res) {
                                    $.session.clear();
                                    window.location.href = "/";
                                }
                            });
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