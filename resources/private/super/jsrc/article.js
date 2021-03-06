m2d2.ready($ => {
    $(user_lastname, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeWords(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(user_firstname, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeWords(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(username, {});
    $(user_password, {});
    $(user_confirm_password, {});
    $(list_of_users, {
        template : {
            li : {
                dataset : { id : "" },
                userStatus : {
                    tagName : "i",
                    className : "fa fa-sign-out userStatus",
                    onclick : function(ev) {
                        if (this.dataset.id == "true") {
                            $.confirm("Are you sure you want to sign-out this user?", (res) => {
                                if (res) {
                                    var data = {
                                        user : username.value
                                    };
                                    $.post(urlAtn + "logout", data, (res) => {
                                        if (res.ok) {
                                            list_of_users.repopulate(res.data);
                                        }
                                    }, true);
                                }
                            });
                        }
                    }
                },
                userDelete : {
                    tagName : "i",
                    className : "fa fa-trash-o userDelete",
                    onclick : function(ev) {
                        $.confirm("Are you sure you want to delete " + " user?", (res) => {
                            if (res) {
                                $.post(urlAtn + "deleteuser/" + $.session.get("userid") + "/" + username.value, (res) => {
                                    if (res.ok) {
                                        list_of_users.repopulate(res.data);
                                        $.success("User successfully deleted.");
                                        button_clear.clear();
                                    } else {
                                        $.failure(res.message);
                                    }
                                });
                            }
                        });
                    }
                },
                userLastName : {
                    tagName : "span",
                    className : "userLastName",
                    text : ""
                },
                userFirstName : {
                    tagName : "span",
                    className : "userFirstName",
                    text : ""
                },
                userUsername : {
                    tagName : "span",
                    className : "userUsername",
                    text : ""
                },
                onclick : function(ev) {
                    $.session.set("userid", this.dataset.id);
                    user_lastname.value     = this.userLastName.text;
                    user_firstname.value    = this.userFirstName.text;
                    username.value          = this.userUsername.text;
                    user_password.value     = "";

                    user_lastname.disabled          = true;
                    user_firstname.disabled         = true;
                    username.disabled               = true;
                    user_password.disabled          = true;
                    user_confirm_password.disabled  = true;

                    button_user_submit.text         = "EDIT";
                    button_edit_password.disabled   = false;
                }
            }
        },
        onload : function() {
            $.get(urlAtn + "users", (res) => {
                if (res.data.length > 0) {
                    this.repopulate(res.data);
                } else {
                    console.log("User's table is empty.");
                }
            }, () => {
                console.log("Server error!");
            });
        },
        repopulate : function(data) {
            this.items.clear();
            var bgColor = "";
            var enable = "";
            data.forEach( item => {
                if (item.status == true) {
                    bgColor = "#F3863D";
                    enable = "true";
                } else {
                    bgColor = "";
                    enable = "false";
                }
                this.items.push({
                    dataset         : { id : item.id },
                    userStatus      : { dataset : { id : enable }},
                    userLastName  : { text : item.lastName, style : { backgroundColor : bgColor }},
                    userFirstName : { text : item.firstName, style : { backgroundColor : bgColor }},
                    userUsername  : { text : item.user, style : { backgroundColor : bgColor }}
                });
            })
        }
    });
    $(label_hide_show, {});
    $(label_hide_show_confirm, {});
    $(show_hide, {
        onclick : function(ev) {
            if (user_password.type === "password") {
                user_password.type = "text";
                label_hide_show.text = "Hide Password"
            } else {
                user_password.type = "password";
                label_hide_show.text = "Show Password"
            }
        }
    });
    $(show_hide_confirm, {
        onclick : function(ev) {
            if (user_confirm_password.type === "password") {
                user_confirm_password.type = "text";
                label_hide_show_confirm.text = "Hide Password"
            } else {
                user_confirm_password.type = "password";
                label_hide_show_confirm.text = "Show Password"
            }
        }
    });
    $(button_user_submit, {
        text : "SAVE",
        onclick : (ev) => {
            if (button_user_submit.text == "EDIT") {
                if ($.session.get("userid") == 0 || $.session.get("userid") == 1) {
                    $.alert("You're not authorized to edit the admin account");
                } else {
                    user_lastname.disabled      = false;
                    user_firstname.disabled     = false;
                    username.disabled           = false;
                    user_password.value         = "";
                    button_user_submit.text     = "SAVED";
                    button_edit_password.show   = false;
                }
            } else {
                if (user_lastname.value != "" || user_firstname.value != "" || username.value != "" || user_password.value != "" || user_confirm_password.value != "") {
                    if (user_password.value != user_confirm_password.value) {
                        $.failure("Password do not match!");
                        return;
                    }
                    var data = {};
                    if ((user_password.value != "" && user_confirm_password.value != "") && (user_password.value === user_confirm_password.value)) {
                        data.id        = $.session.get("userid");
                        data.user      = username.value;
                        data.pass      = user_password.value;
                        data.lastName  = user_lastname.value;
                        data.firstName = user_firstname.value;
                    } else {
                        data.id        = $.session.get("userid"),
                        data.user      = username.value;
                        data.lastName  = user_lastname.value;
                        data.firstName = user_firstname.value;
                    }
                    if ($.session.get("userid") == 0 || $.session.get("userid") == null) {
                        $.post(urlAtn + "new", data, (res) => {
                            if (res.ok) {
                                list_of_users.repopulate(res.data);
                                $.success(res.message);
                                button_user_submit.clear();
                            } else {
                                $.alert(res.message);
                            }
                        }, true);
                    } else {
                        $.post(urlAtn + "update", data, (res) => {
                            if (res.ok) {
                                list_of_users.repopulate(res.data);
                                $.success("Successfully updated!");
                                button_user_submit.clear();
                            } else {
                                console.log("Server error!");
                            }
                        }, true);
                    }
                } else {
                    $.failure("No empty field is allowed.");
                }
            }
        },
        clear : (ev) => {
            user_lastname.value     = "";
            user_firstname.value    = "";
            username.value          = "";

            username.disabled               = false;
            user_password.disabled          = false;
            user_confirm_password.disabled  = false;

            user_password.value         = "";
            user_confirm_password.value = "";

            button_edit_password.show   = true;
        }
    });
    $(button_edit_password, {
        text : "EDIT PASSWORD",
        onclick : () => {
            if (button_edit_password.text == "SAVE NEW PASSWORD") {
                if ((user_password.value != "" && user_confirm_password.value != "") && (user_password.value === user_confirm_password.value)) {
                    var data = {
                        id : $.session.get("userid"),
                        pass : user_confirm_password.value
                    };
                    $.post(urlAtn + "pass", data, (res) => {
                        if (res.ok) {
                            list_of_users.repopulate(res.data);
                            $.success("Password successfully updated.");
                        } else {
                            $.failure("Failed to update password!");
                        }
                    }, true);
                    button_clear.clear();
                } else {
                    $.failure("Password do not match!");
                }
            } else {
                if ($.session.get("userid") == 0 || $.session.get("userid") == 1) {
                    if ($.session.get("level") == "SUPER") {
                        $.confirm("Are you sure you want to change your password?", (res) => {
                            if (res) {
                                user_password.disabled          = false;
                                user_confirm_password.disabled  = false;
                                button_edit_password.text       = "SAVE NEW PASSWORD";
                                button_user_submit.show         = false;
                            }
                        });
                    } else {
                        $.alert("You're not authorized to edit the admin account");
                        button_clear.clear();
                    }
                } else {
                    $.confirm("Are you sure you want to change your password?", (res) => {
                        if (res) {
                            user_password.disabled          = false;
                            user_confirm_password.disabled  = false;
                            button_edit_password.text       = "SAVE NEW PASSWORD";
                            button_user_submit.show         = false;
                        }
                    });
                }
            }
        }
    });
    $(button_clear, {
        onclick : function() {
            this.clear();
        },
        clear : function() {
            $.session.set("userid", 0);
            user_lastname.value         = "";
            user_firstname.value        = "";
            username.value              = "";
            user_password.value         = "";
            user_confirm_password.value = "";
            button_edit_password.text   = "EDIT PASSWORD";
            button_user_submit.text     = "SAVE";

            user_lastname.disabled          = false;
            user_firstname.disabled         = false;
            username.disabled               = false;
            user_password.disabled          = false;
            user_confirm_password.disabled  = false;

            button_edit_password.disabled   = true;
            button_edit_password.show       = true;
            button_user_submit.show         = true;
        }
    });
});