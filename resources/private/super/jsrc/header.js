m2d2.ready($ => {
    $(logout, {
        onclick : function(ev) {
            $.confirm("Are you sure you want to logout", (res) => {
                if (res) {
                    $.get(url + "logout", (res) => {
                        if (res) {
                            var data = {
                                user : $.session.get("user")
                            };
                            $.post(urlAtn + "logout", data, (res) => {
                                if (res) {
                                    $.session.clear();
                                    window.location.href = res.page;
                                }
                            }, true);
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