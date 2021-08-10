m2d2.ready($ => {
    $(cases, {
        className : "active",
        onclick : function(ev) {
            if (this.className != "active") {
                this.className += "active";
                /*this.style.backgroundColor = "#1D1F21";
                statistics.style.backgroundColor = "inherit";
                settings.style.backgroundColor = "inherit";*/
            }
            cases_tab.style.display = "block";
            statistics_tab.style.display = "none";
            settings_tab.style.display = "none";
            statistics.className = "";
            settings.className = "";
        }
    });
    $(statistics, {
        onclick : function(ev) {
            if (this.className != "active") {
                this.className += "active";
                /*this.style.backgroundColor = "#1D1F21";
                records.style.backgroundColor = "inherit";
                settings.style.backgroundColor = "inherit";*/
            }
            cases_tab.style.display = "none";
            statistics_tab.style.display = "block";
            settings_tab.style.display = "none";
            cases.className = "";
            settings.className = "";
        }
    });
    $(settings, {
        onclick : function(ev) {
            if (this.className != "active") {
                this.className += "active";
                /*this.style.backgroundColor = "#1D1F21";
                records.style.backgroundColor = "inherit";
                statistics.style.backgroundColor = "inherit";*/
            }
            cases_tab.style.display = "none";
            statistics_tab.style.display = "none";
            settings_tab.style.display = "block";
            cases.className = "";
            statistics.className = "";
        }
    });
    $(cases_tab, {
        style : {
            display : "block"
        }
    });
    $(statistics_tab, {
        style : {
            display : "none"
        }
    });
    $(settings_tab, {
        style : {
            display : "none"
        }
    });
    $(case_list, {
        template : {
            li : {
                dataset : { id : "" },
                className : "list_fields",
                show : true,
                lastname : {
                    tagName : "span",
                    className : "lastname",
                    text : ""
                },
                firstname : {
                    tagName : "span",
                    className : "firstname",
                    text : ""
                },
                middlename : {
                    tagName : "span",
                    className : "middlename",
                    text : ""
                },
                birthday : {
                    tagName : "span",
                    className : "birthday",
                    text : ""
                },
                birthplace : {
                    tagName : "span",
                    className : "birthplace",
                    text : ""
                },
                gender : {
                    tagName : "span",
                    className : "gender",
                    text : ""
                },
                daterecorded : {
                    tagName : "span",
                    className : "daterecorded",
                    text : ""
                },
                casetype : {
                    tagName : "span",
                    className : "casetype",
                    text : ""
                },
                action : {
                    tagName : "span",
                    className : "action",
                    text : ""
                },
                status : {
                    tagName : "span",
                    className : "status",
                    text : ""
                },
                others : {
                    show : false,
                    tagName : "span",
                    className : "others",
                    text : ""
                },
                onclick : function(ev) {
                    $.session.set("id", this.dataset.id);
                    console.log(this.dataset.id);
                    $.message({
                           icon : "input",     // OPTIONAL: you can use : "question", "info", "error", "ok", "input", "wait"
                           css  : "special",   // Set class or classes
                           title : "Edit",
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
                                            placeholder : "Last Name",
                                            value : this.lastname.text
                                        }
                                    },
                                    fn : {
                                        tagName : "li",
                                        span : {
                                            text : "First Name:"
                                        },
                                        firstname : {
                                            tagName : "input",
                                            placeholder : "First Name",
                                            value : this.firstname.text
                                        }
                                    },
                                    mn : {
                                        tagName : "li",
                                        span : {
                                            text : "Middle Name:"
                                        },
                                        middlename : {
                                            tagName : "input",
                                            placeholder : "Middle Name",
                                            value : this.middlename.text
                                        }
                                    },
                                    brt : {
                                        tagName : "li",
                                        span : {
                                            text : "Birthday:"
                                        },
                                        birthday : {
                                            tagName : "input",
                                            placeholder : "Birthday",
                                            value : this.birthday.text
                                        }
                                    },
                                    bpc : {
                                        tagName : "li",
                                        span : {
                                            text : "Birth Place:"
                                        },
                                        birthplace : {
                                            tagName : "textarea",
                                            placeholder : "Birth place",
                                            value : this.birthplace.text
                                        }
                                    },
                                    gdr : {
                                        tagName : "li",
                                        span : {
                                            text : "Gender:"
                                        },
                                        gender : {
                                            tagName : "input",
                                            placeholder : "Gender",
                                            value : this.gender.text
                                        }
                                    },
                                    dr : {
                                        tagName : "li",
                                        span : {
                                            text : "Date Recorded:"
                                        },
                                        daterecorded : {
                                            tagName : "input",
                                            placeholder : "Date recorded",
                                            value : this.daterecorded.text
                                        }
                                    },
                                    cse : {
                                        tagName : "li",
                                        span : {
                                            text : "Case:"
                                        },
                                        casetype : {
                                            tagName : "textarea",
                                            placeholder : "Case",
                                            value : this.casetype.text
                                        }
                                    },
                                    act : {
                                        tagName : "li",
                                        span : {
                                            text : "Action Taken:"
                                        },
                                        action : {
                                            tagName : "input",
                                            placeholder : "Action Taken",
                                            value : this.action.text
                                        }
                                    },
                                    stat : {
                                        tagName : "li",
                                        span : {
                                            text : "Status:"
                                        },
                                        select : {
                                            items : ["Active", "Case closed", "For Filing"],
                                            value : this.status.text
                                        }
                                    },
                                    ors : {
                                        tagName : "li",
                                        span : {
                                            text : "Others:"
                                        },
                                        others : {
                                            tagName : "textarea",
                                            placeholder : "Other comments",
                                            value : this.others.text
                                        }
                                    }
                                },
                           },
                           buttons : ["cancel", "upload", "delete", "print", "save"], // Specify button text and classes which in this case be: "no_way" and "roger"
                           callback : function(ev) {
                               switch (ev.button) {
                                   case "save":
                                        var data = {
                                            id           : $.session.get("id"),
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
                                       $.post(urlAtn + "edit", data, (res) => {
                                           if (res.ok) {
                                               $.alert("Successfully saved!");
                                               if (res.data.length > 0) {
                                                   case_list.items.clear();
                                                   res.data.forEach( item => {
                                                       case_list.items.push({
                                                           dataset      : { id : item.id },
                                                           lastname     : { text : item.lastName },
                                                           firstname    : { text : item.firstName },
                                                           middlename   : { text : item.middleName },
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
                                                   $.session.set("id", "");
                                               } else {
                                                   console.log("data is empty");
                                               }
                                           }
                                       }, true);
                                       break;
                                   case "print":
                                       break;
                                   case "upload":
                                       break;
                                   case "delete":
                                       $.delete(urlAtn + "delete/" + $.session.get("id"), (res) => {
                                           if (res.ok) {
                                               $.alert("Case successfully deleted");
                                               if (res.data.length > 0) {
                                                   case_list.items.clear();
                                                   res.data.forEach( item => {
                                                       case_list.items.push({
                                                           dataset      : { id : item.id },
                                                           lastname     : { text : item.lastName },
                                                           firstname    : { text : item.firstName },
                                                           middlename   : { text : item.middleName },
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
                                                   $.session.set("id", "");
                                               }
                                           }
                                       });
                                       break;
                                   case "cancel":
                                       break;
                                   default:
                                       break;
                               }
                           }
                    });
                }
            }
        },
        onload : function() {
            $.get("/atn/load", (res) => {
                if (res.data.length > 0) {
                    this.items.clear();
                    res.data.forEach( item => {
                        this.items.push({
                            dataset      : { id : item.id },
                            lastname     : { text : item.lastName },
                            firstname    : { text : item.firstName },
                            middlename   : { text : item.middleName },
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
                } else {
                    console.log("data is empty");
                }
            });
        }
    });
});