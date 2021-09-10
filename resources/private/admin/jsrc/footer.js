m2d2.ready($ => {
    $(search, {
        value : "",
        onkeyup : (ev) => {
            if (case_list.items.length > 0) {
                case_list.items.forEach(li => {
                    var lastName = li.lastname.text.toUpperCase();
                    var firstName = li.firstname.text.toUpperCase();
                    var middleName = li.middlename.text.toUpperCase();
                    var birthday = li.birthday.text;
                    var birthPlace = li.birthplace.text.toUpperCase();
                    var gender = li.gender.text.toUpperCase();
                    var dateRecorded = li.daterecorded.text;
                    var status = li.status.text.toUpperCase();
                    var filter = ev.target.value.toUpperCase();
                    if (lastName.indexOf(filter) > -1 ||
                        firstName.indexOf(filter) > -1 ||
                        middleName.indexOf(filter) > -1 ||
                        birthday.indexOf(filter) > -1 ||
                        birthPlace.indexOf(filter) > -1 ||
                        gender.indexOf(filter) > -1 ||
                        dateRecorded.indexOf(filter) > -1 ||
                        status.indexOf(filter) > -1
                    ) {
                        li.show = true;
                    } else {
                        li.show = false;
                    }
                })
            } else {
                console.log("Nothing to search. List is empty!");
            }
            if (ev.key === "Escape" || ev.which === 27) {
                ev.target.value = "";
                case_list.items.forEach(li => {
                    li.show = true;
                })
            }
        }
    });
    $(add_new_record, {
        onclick : function(ev) {
            if (button_save.value == "edit") {
                $.confirm("Are you sure you want to disregard your changes if theres any without saving it?", (res) => {
                    if (res) {
                        case_title.text = "Add new case";
                        button_save.value = "save";
                        this.clear();
                    }
                });
            } else {
                box.classList.toggle("show-bottom");
                this.clear();
            }
        },
        sleep : (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        clear : () => {
            $.session.set("id", 0);
            case_last_name.value     = "";
            case_first_name.value    = "";
            case_middle_name.value   = "";
            case_birthday.value      = "";
            case_birthplace.value    = "";
            case_gender.value        = "";
            case_date_recorded.value = "";
            case_case.value          = "";
            case_action_taken.value  = "";
            case_status.value        = "";
            case_priority.value      = "";
            case_officers.value      = "";
            case_others.value        = "";

            button_upload.show  = false;
            button_delete.show  = false;
            button_edit.show    = false;
            button_print.show   = false;
            case_list.onEnable();
        }
    });
});