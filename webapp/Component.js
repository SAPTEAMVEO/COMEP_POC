/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "comep/comep/model/models",
    "sap/f/FlexibleColumnLayoutSemanticHelper"
],
    function (UIComponent, Device, models, FlexibleColumnLayoutSemanticHelper) {
        "use strict";

        return UIComponent.extend("comep.comep.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            createContent: function () {
                return sap.ui.view({
                    viewName: "comep.comep.view.App",
                    type: "XML"
                });
            }
            ,
            getHelper: function () {
                var oFCL = this.getRootControl().byId("app"),
                    oParams = jQuery.sap.getUriParameters(),
                    oSettings = {
                        defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
                        mmode: oParams.get("mode"),
                        initialColumnsCount: oParams.get("initial"),
                        maxColumnsCount: oParams.get("max")

                    };

                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            }
        });
    }
);