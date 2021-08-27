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
            if (search.show == false || add_new_record.show == false) {
                search.show = true;
                add_new_record.show = true;
            }
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
            search.show = false;
            add_new_record.show = false;
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
            search.show = false;
            add_new_record.show = false;
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
    const box = $("#box", {});
    $(case_last_name, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeWords(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(case_first_name, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeWords(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(case_middle_name, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeWords(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(case_birthday, {});
    $(case_birthplace, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeFirstLetter(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(case_gender, {});
    $(case_date_recorded, {});
    $(case_case, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeFirstLetter(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(case_action_taken, {});
    $(case_status, {});
    $(case_priority, {});
    $(case_officers, {
        template : {
            option : {
                tagName : "option",
                text  : ""
            }
        },
        onload : function() {
            $.get(urlAtn + "officers", (res) => {
                this.items.clear();
                res.data.forEach(item => {
                    this.items.push({
                        text : item
                    })
                })
            });
        }
    });
    $(case_others, {
        onkeyup : (ev) => {
            var start = ev.target.selectionStart;
            var end = ev.target.selectionEnd;
            ev.target.value = capitalizeFirstLetter(ev.target.value)
            ev.target.setSelectionRange(start, end);
        }
    });
    $(button_cancel, {
        onclick : function(ev) {
            case_title.text = "Add new case";
            button_save.value = "save";
            add_new_record.clear();
            box.classList.remove("show-bottom");
            box.classList.toggle("show-front");
        }
    });
    $(button_upload, {
        show : false,
        onclick : function(ev) {
            this.fileSelect(ev, {
                field   : "file",
                preview : "", //Element to show a preview (if its an image)
                //upload  : urlAtn + "upload" //+ "?orig="
            });
        },
        fileSelect : function(ev, options) {
            var chosenFile;
            var name = case_last_name.value + case_first_name.value + $.session.get("id") + "-";
            const opts = Object.assign({}, {
                onSelect : (files) => { $.session.set("orig", files[0].name); },
                onUpdate : (progress_pct) => { console.log("Progress - " + progress_pct) },
                // preview  : imageElement,
                field    : "file", //Field name (when using multiple, will add '[]' to the name)
                upload   : urlAtn + "upload" + "?orig=" + name + $.session.get("orig"),
                multiple : false
            }, options);
            let el = window._protected_reference = document.createElement("INPUT");
            el.name = opts.field;
            el.type = "file";
            el.accept = "file/*";
            if (opts.multiple == true) {
                el.multiple = "multiple";
                el.name += "[]";
            }
            el.addEventListener('change', () => {
                if (el.files.length) {
                    $.session.set("orig", el.files[0].name);
                    if(opts.preview) {
                        opts.preview.src = URL.createObjectURL(el.files[0]);
                    }
                }
                // test some async handling
                new Promise((resolve) => {
                    if(opts.onSelect) {
                        opts.onSelect(el.files);
                    }
                    if(opts.upload) {
                        Array.from(el.files).forEach(file => {
                            this.fileUpload(el.name, file, opts.upload, opts.onUpdate, () => {
                                resolve();
                            });
                        });
                     }
                 }).then(() => { // clear / free reference
                    el = window._protected_reference = undefined;
                });
            });
            el.click(); // open dialog
        },
        fileUpload : function(fieldName, file, url, onUpdate, onDone) {
            const form = new FormData();
            const reader = new FileReader();
            const xhr = new XMLHttpRequest();
            if (onUpdate == undefined) { onUpdate = (pct) => {
                    console.log("Uploading..." + pct + "%");
                }
            }
            if (onDone != undefined) { onDone = () => {
                    $.success("A file is successfully uploaded.");
                }
            }
            this.xhr = xhr;
            form.append(fieldName, file, file.name);
            const self = this;
            this.xhr.upload.addEventListener("progress", function(e) {
                if (e.lengthComputable) {
                    const percentage = Math.round((e.loaded * 100) / e.total);
                    onUpdate(percentage);
                }
            }, false);
            xhr.upload.addEventListener("load", () => {
                onUpdate(100);
                onDone();
            }, false);
            xhr.upload.addEventListener("", () => {
            }, false);
            xhr.open("POST", url);
            reader.onload = function(evt) {
                xhr.send(form);
            };
            reader.readAsBinaryString(file);
        }
    });
    $(button_delete, {
        show : false,
        onclick : function(ev) {
            $.delete(urlAtn + "delete/" + $.session.get("id"), (res) => {
                if (res.ok) {
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
                                priority     : { text : item.priority },
                                officer      : { text : item.officer },
                                others       : { text : item.others }
                            });
                        })
                        $.session.set("id", 0);

                        box.classList.remove("show-bottom");
                        box.classList.toggle("show-front");

                        button_delete.show       = false;
                        button_edit.show         = false;
                        button_print.show        = false;
                    }
                    $.success("Case successfully deleted");
                }
            });
        }
    });
    $(button_edit, {
        show : false,
        onclick : function(ev) {
            case_list.onEnable();
            button_print.disabled = true;
        }
    });
    $(button_print, {
        show : false,
        onclick : function(ev) {
            var data = {
                id           : 0,
                lastName     : case_last_name.value,
                firstName    : case_first_name.value,
                middleName   : case_middle_name.value,
                birthday     : case_birthday.value,
                birthPlace   : case_birthplace.value,
                gender       : case_gender.value,
                dateRecorded : case_date_recorded.value,
                case         : case_case.value,
                action       : case_action_taken.value,
                status       : case_status.value,
                priority     : case_priority.value,
                officer      : case_officers.value,
                others       : case_others.value
            };
           case_list.onPrint(data);
        }
    });
    $(button_save, {
        value : "save",
        onclick : function(ev) {
            if (case_last_name.value == "") {
                $.failure("Last Name cannot be empty!");
            } else if (case_first_name.value == "") {
                $.failure("First Name cannot be empty!");
            } else {
                var data = {
                    id           : $.session.get("id"),
                    lastName     : case_last_name.value,
                    firstName    : case_first_name.value,
                    middleName   : case_middle_name.value,
                    birthday     : case_birthday.value,
                    birthPlace   : case_birthplace.value,
                    gender       : case_gender.value,
                    dateRecorded : case_date_recorded.value,
                    case         : case_case.value,
                    action       : case_action_taken.value,
                    status       : case_status.value,
                    priority     : case_priority.value,
                    officer      : case_officers.value,
                    others       : case_others.value
                };
                if (this.value == "save") {
                    $.post(urlAtn + "add", data, (res) => {
                        if (res.ok) {
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
                                        priority     : { text : item.priority },
                                        officer      : { text : item.officer },
                                        others       : { text : item.others }
                                    });
                                })
                            }
                            box.classList.remove("show-bottom");
                            box.classList.toggle("show-front");
                            $.success("New record is saved!");
                        } else {
                            $.failure("Error getting data!");
                        }
                    }, true);
                } else {
                    $.post(urlAtn + "edit", data, (res) => {
                        if (res.ok) {
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
                                        priority     : { text : item.priority },
                                        officer      : { text : item.officer },
                                        others       : { text : item.others }
                                    });
                                })
                                $.session.set("id", 0);

                                box.classList.remove("show-bottom");
                                box.classList.toggle("show-front");

                                button_upload.show  = false;
                                button_delete.show  = false;
                                button_edit.show    = false;
                                button_print.show   = false;
                                button_save.value   = "save";
                                button_print.disabled = false;
                            } else {
                                console.log("data is empty");
                            }
                            $.success("Successfully saved!");
                        }
                    }, true);
                }
            }
        }
    });
    $(floating_close_button, {
        onclick : (ev) => {
            case_title.text = "Add new case";
            button_save.value = "save";
            add_new_record.clear();
            box.classList.remove("show-front");
            box.classList.toggle("show-bottom");
        }
    });
    $(case_title, {
        text : "Add new case"
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
                },
                firstname : {
                    tagName : "span",
                    className : "firstname",
                },
                middlename : {
                    tagName : "span",
                    className : "middlename",
                },
                birthday : {
                    tagName : "span",
                    className : "birthday",
                },
                birthplace : {
                    tagName : "span",
                    className : "birthplace",
                },
                gender : {
                    tagName : "span",
                    className : "gender",
                },
                daterecorded : {
                    tagName : "span",
                    className : "daterecorded",
                },
                casetype : {
                    tagName : "span",
                    className : "casetype",
                },
                action : {
                    tagName : "span",
                    className : "action",
                },
                status : {
                    tagName : "span",
                    className : "status",
                },
                priority : {
                    tagName : "span",
                    className : "priority",
                },
                officer : {
                    tagName : "span",
                    className : "officer",
                },
                others : {
                    show : false,
                    tagName : "span",
                    className : "others",
                },
                onclick : function(ev) {
                    box.classList.toggle("show-bottom");
                    $.session.set("id", this.dataset.id);
                    case_title.text = "Edit case";
                    // show hidden buttons
                    button_upload.show      = true;
                    button_delete.show      = true;
                    button_edit.show        = true;
                    button_print.show       = true;
                    button_save.value       = "edit";
                    // add values to the fields
                    case_last_name.value        = this.lastname.text;
                    case_first_name.value       = this.firstname.text;
                    case_middle_name.value      = this.middlename.text;
                    case_birthday.value         = this.birthday.text;
                    case_birthplace.value       = this.birthplace.text;
                    case_gender.value           = this.gender.text;
                    case_date_recorded.value    = this.daterecorded.text;
                    case_case.value             = this.casetype.text;
                    case_action_taken.value     = this.action.text;
                    case_status.value           = this.status.text;
                    case_priority.value         = this.priority.text;
                    case_officers.value         = this.officer.text;
                    case_others.value           = this.others.text;
                    case_list.onDisable();
                }
            }
        },
        onPrint : function(data) {
            var samples = [{text : "Apple", link : window.location.origin + "/data/MorenoSem1/Online Return Center.pdf", color: 'blue'},"Mango","Banana"];
            var list = [];
            $.get(urlAtn + "files?name=" + case_last_name.value + case_first_name.value + $.session.get("id"), (res) => {
                if (res.ok) {
                    res.data.forEach(item => {
                        console.log(item.text + ":" + item.link + ":" + item.color);
                        var data = {
                            text : item.text,
                            link : window.location.origin + item.link,
                            color : item.color
                        }
                        list.push(data);
                    })
                    console.log(list);
                } else {
                    $.failure("Something wrong getting the supported files. Please check if folder exists.");
                }
            });
            var dd = {
                content : [
                    {
                        image       : 'logo',
                        width       : 300,
                        alignment   : 'center'
                    },
                    {
                        text : '\n\n'
                    },
                    {
                        text        : 'Assistance to Nationals (ATN) Unit',
                        alignment   : 'center',
                        bold        : true,
                        fontSize    : 14
                    },
                    {
                        table : {
                            widths : [100, '*'],
                            body : [
                                [{text : 'FIELDS', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc', bold: true, fontSize: 18},
                                 {text : 'INFORMATION', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc', bold: true, fontSize: 18}],
                                [{text : 'Last Name', fontSize: 14}, {text: data.lastName, fontSize: 14}],
                                [{text : 'First Name', fontSize: 14}, {text: data.firstName, fontSize: 14}],
                                [{text : 'Middle Name', fontSize: 14}, {text: data.middleName, fontSize: 14}],
                                [{text : 'Birthday', fontSize: 14}, {text: data.birthday, fontSize: 14}],
                                [{text : 'Birth Place', fontSize: 14}, {text: data.birthPlace, fontSize: 14}],
                                [{text : 'Gender', fontSize: 14}, {text: data.gender, fontSize: 14}],
                                [{text : 'Date Recorded', fontSize: 14}, {text: data.lastName, fontSize: 14}],
                                [{text : 'Case', fontSize: 14}, {text: data.case, fontSize: 14}],
                                [{text : 'Action', fontSize: 14}, {text: data.action, fontSize: 14}],
                                [{text : 'Status', fontSize: 14}, {text: data.status, fontSize: 14}],
                                [{text : 'Priority', fontSize: 14}, {text: data.priority, fontSize: 14}],
                                [{text : 'Case Officer', fontSize: 14}, {text: data.officer, fontSize: 14}],
                                [{text : 'Others', fontSize: 14}, {text: data.others, fontSize: 14}]
                            ]
                        }
                    },
                    {
                        text        : '\nSupporting document\n\n',
                        style       : 'header',
                        alignment   : 'left',
                        bold        : true,
                        fontSize    : 14
                    },
                    {
                        ul : list
                    }
                ],
                images: {
                    logo: window.location.origin + "/img/npcg.png"
                }
            };
            var now = new Date();
            var pdf = createPdf(dd, null).open();
            /*pdf.write('pdfs/case.pdf').then(() => {
            	console.log(new Date() - now);
            }, err => {
            	console.error(err);
            });*/
        },
        getBase64ImageFromURL(url) {
            return new Promise((resolve, reject) => {
                var img = new Image();
                img.setAttribute("crossOrigin", "anonymous");

                img.onload = () => {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var dataURL = canvas.toDataURL("image/jpg");

                    resolve(dataURL);
                };

                img.onerror = error => {
                    reject(error);
                };

                img.src = url;
            });
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
                            priority     : { text : item.priority },
                            officer      : { text : item.officer },
                            others       : { text : item.others }
                        });
                    })
                } else {
                    console.log("data is empty");
                }
            });
        },
        onDisable : function() {
            case_last_name.disabled     = true;
            case_first_name.disabled    = true;
            case_middle_name.disabled   = true;
            case_birthday.disabled      = true;
            case_birthplace.disabled    = true;
            case_gender.disabled        = true;
            case_date_recorded.disabled = true;
            case_case.disabled          = true;
            case_action_taken.disabled  = true;
            case_status.disabled        = true;
            case_priority.disabled      = true;
            case_officers.disabled      = true;
            case_others.disabled        = true;
        },
        onEnable : function() {
            case_last_name.disabled     = false;
            case_first_name.disabled    = false;
            case_middle_name.disabled   = false;
            case_birthday.disabled      = false;
            case_birthplace.disabled    = false;
            case_gender.disabled        = false;
            case_date_recorded.disabled = false;
            case_case.disabled          = false;
            case_action_taken.disabled  = false;
            case_status.disabled        = false;
            case_priority.disabled      = false;
            case_officers.disabled      = false;
            case_others.disabled        = false;
        }
    });
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
                i : {
                    className : "fa fa-trash-o",
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
                    this.items.clear();
                    res.data.forEach( item => {
                        this.items.push({
                            dataset       : { id : item.id },
                            userLastName  : { text : item.lastName },
                            userFirstName : { text : item.firstName },
                            userUsername  : { text : item.user }
                        });
                    })
                } else {
                    console.log("User's table is empty.");
                }
            }, () => {
                console.log("Server error!");
            });
        },
        repopulate : function(data) {
            this.items.clear();
            data.forEach( item => {
                this.items.push({
                    dataset : { id : item.id },
                    userLastName : { text : item.lastName },
                    userFirstName : { text : item.firstName },
                    userUsername : { text : item.user }
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
                if (user_lastname.value != "" && user_firstname.value != "" && username.value != "") {
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
                var data = {
                    id : $.session.get("userid"),
                    pass : user_confirm_password.value
                }
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
                if ($.session.get("userid") == 0 || $.session.get("userid") == 1) {
                    $.alert("You're not authorized to edit the admin account");
                    button_clear.clear();
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