(function () {
    var oWebViewInterface = window.nsWebViewInterface;
 
 oWebViewInterface.on('marker', function (ltlng) {
    var data=ltlng.toString();
    var rmv=data.split('LatLng(');
    var interMidiate=rmv.toString().split(')')
    var cor = interMidiate[0];
    var output=cor.toString().split(',');
    var lat=output[0];
    var lang=output[1];
    console.log("Data from Home page =>"+lat+" and  long >"+lang);

});

    /**
     * Defines global functions which will be called from andorid/ios
     */

}
)();
