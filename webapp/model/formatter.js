sap.ui.define([], function () {
    "use strict";
    return {
        getDate: function (sDate) {
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({

                pattern: "MM/dd/YYYY"

            });
            var date = dateFormat.format(sDate);

            return date;
        }
    };
});