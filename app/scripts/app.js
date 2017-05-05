(function() {
    var apiKey = "3we26ssm6mtsj675";
    var el = new Everlive(apiKey);

    var groceryDataSource = new kendo.data.DataSource({
        type: "everlive",
        sort: { field: "Name", dir: "asc"},
        transport: {
            typeName: "Groceries",
        }
    });

    function initialize() {
        var app = new kendo.mobile.Application(document.body, {
            skin: "nova",
            transition: "slide"
        });
        $("#grocery-list").kendoMobileListView({
            dataSource: groceryDataSource,
            template: "#: Name #"
        });
        navigator.splashscreen.hide();
    }

    window.loginView = kendo.observable({
        submit: function() {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            el.Users.login(this.username, this.password, 
                function(data) {
                    window.location.href="#list";
                    groceryDataSource.read();
                }, function() {
                    navigation.notification.alert("Unfortunately we could not find your account.");
                }
            );
        }
    });

    window.registerView = kendo.observable({
        submit: function() {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notificaiton.alert("Password is required.");
                return;
            }
            el.Users.register(this.username, this.password, { Email: this.email },
                function() {
                    navigator.notification.alert("Your account was successfully created.");
                    window.location.href = "#login";
                },
                function() {
                    navigator.notification.alert("Unfortunately we were unable to create your account.");
                }
            );
        }
    });
    
    window.listView = kendo.observable({
        logout: function(event) {
            // Prevent going to the login page until the login call processes.
            event.preventDefault();
            el.Users.logout(function() {
                this.loginView.set("username", "" );
                this.loginView.set("password", "" );
                window.location.href = "#login";
            }, function() {
                navigator.notification.alert("Unfortunately an error ocurred logging out of your account.");
            });
        }
    });

    window.addView = kendo.observable({
        add: function() {
            if (!this.grocery) {
                navigator.notification.alert("Please provide a grocery.");
                return;
            }
            groceryDataSource.add({ Name: this.grocery });
            groceryDataSource.one("sync", this.close);
            groceryDataSource.sync();
            this.set("grocery", "");
        },
        close: function() {
            $("#add").data("kendoMobileModalView").close();
        }
    });

    document.addEventListener("deviceready", initialize);
}());
