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
            $.message({
                icon : "input",     // OPTIONAL: you can use : "question", "info", "error", "ok", "input", "wait"
                css  : "special",   // Set class or classes
                title : "Add New Case",
                text  : {
                    ul : {
                        className : "edit_fields",
                        ln : {
                            tagName : "li",
                            span : {
                                text : "Last Name:"
                            },
                            lastname : {
                                tagName : "input",
                                placeholder : "Last Name"
                            }
                        },
                        fn : {
                            tagName : "li",
                            span : {
                                text : "First Name:"
                            },
                            firstname : {
                                tagName : "input",
                                placeholder : "First Name"
                            }
                        },
                        mn : {
                            tagName : "li",
                            span : {
                                text : "Middle Name:"
                            },
                            middlename : {
                                tagName : "input",
                                placeholder : "Middle Name"
                            }
                        },
                        brt : {
                            tagName : "li",
                            span : {
                                text : "Birthday:"
                            },
                            birthday : {
                                tagName : "input",
                                placeholder : "01/01/1980"
                            }
                        },
                        bpc : {
                            tagName : "li",
                            span : {
                                text : "Birth Place:"
                            },
                            birthplace : {
                                tagName : "textarea",
                                placeholder : "Birth place"
                            }
                        },
                        gdr : {
                            tagName : "li",
                            span : {
                                text : "Gender:"
                            },
                            gender : {
                                tagName : "input",
                                placeholder : "Gender"
                            }
                        },
                        dr : {
                            tagName : "li",
                            span : {
                                text : "Date Recorded:"
                            },
                            daterecorded : {
                                tagName : "input",
                                placeholder : "01/01/1980"
                            }
                        },
                        cse : {
                            tagName : "li",
                            span : {
                                text : "Case:"
                            },
                            casetype : {
                                tagName : "textarea",
                                placeholder : "Case"
                            }
                        },
                        act : {
                            tagName : "li",
                            span : {
                                text : "Action Taken:"
                            },
                            action : {
                                tagName : "input",
                                placeholder : "Action Taken"
                            }
                        },
                        stat : {
                            tagName : "li",
                            span : {
                                text : "Status:"
                            },
                            select : {
                                items : ["Active", "Case closed", "For Filing"]
                            }
                        },
                        ors : {
                            tagName : "li",
                            span : {
                                text : "Others:"
                            },
                            others : {
                                tagName : "textarea",
                                placeholder : "Other comments"
                            }
                        }
                   },
                },
                buttons : ["cancel", "upload", "save"], // Specify button text and classes which in this case be: "no_way" and "roger"
                callback : function(ev) {
                    switch (ev.button) {
                        case "save":
                            var data = {
                                id           : 0,
                                lastName     : ev.field_1,
                                firstName    : ev.field_2,
                                middleName   : ev.field_3,
                                birthday     : ev.field_4,
                                birthPlace   : ev.field_5,
                                gender       : ev.field_6,
                                dateRecorded : ev.field_7,
                                case         : ev.field_8,
                                action       : ev.field_9,
                                status       : ev.field_10,
                                others       : ev.field_11
                            }
                            $.post(urlAtn + "add", data, (res) => {
                                if (res.ok) {
                                    $.alert("New record is saved!");
                                    if (res.data.length > 0) {
                                        case_list.items.clear();
                                        res.data.forEach( item => {
                                            case_list.items.push({
                                                dataset      : { id : item.id },
                                                lastname     : { text : item.lastName },
                                                firstname    : { text : item.firstName },
                                                middlename   : { text : item.lastName },
                                                birthday     : { text : item.birthday },
                                                birthplace   : { text : item.birthPlace },
                                                gender       : { text : item.gender },
                                                daterecorded : { text : item.dateRecorded },
                                                casetype     : { text : item.case },
                                                action       : { text : item.action },
                                                status       : { text : item.status },
                                                others       : { text : item.others }
                                            });
                                        })
                                    }
                                } else {
                                    $.failure("Error getting data!");
                                }
                            }, true);
                            break;
                        case "upload":
                            break;
                        case "cancel":
                            break;
                        default:
                            break;
                    }
                }
            });
        }
    });
});