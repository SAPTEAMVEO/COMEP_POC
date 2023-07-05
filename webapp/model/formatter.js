sap.ui.define([], function () {
    "use strict";
    return {
        getDate: function (sDate) {
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({

                pattern: "MM/dd/YYYY"

            });
            var date = dateFormat.format(sDate);

            return date;
        },
        getStatusText: function (iStatus) {
            switch (iStatus) {
                case "N":
                    return "No GO";
                case "G":
                    return "GO";
                case "W":
                    return "Waiting";
            }    
    },
    getTitle: function (sCode , sDescription){
        var text = sCode + ' - ' + sDescription;
         return text;
    },
    getItBusinessService : function(){
        var OitemArray = [{ ItBusService: 'AETOS'},
                        { ItBusService: 'ATLAS'},
                        { ItBusService: 'BOARD'},
                        { ItBusService: 'CALYPSO'},
                        { ItBusService: 'CODAC'},
                        { ItBusService: 'CODAF'},
                        { ItBusService: 'CODSI'},
                        { ItBusService: 'COLOG'},
                        { ItBusService: 'COM2MIND'},
                        { ItBusService: 'COM2WORLD'},
                        { ItBusService: 'COMARK'},
                        { ItBusService: 'COR'},
                        { ItBusService: 'CORH'},
                        { ItBusService: 'COSPS'},
                        { ItBusService: 'CRECHE'},
                        { ItBusService: 'EXPANSION'},
                        { ItBusService: 'HOTEL'},
                        { ItBusService: 'JURIDIQUE'},
                        { ItBusService: 'PIONEER'},
                        { ItBusService: 'TRAVAUX'}
                         ];
                         return OitemArray;
    }
};
});