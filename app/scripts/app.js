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
