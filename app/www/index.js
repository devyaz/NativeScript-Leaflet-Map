(function () {
    var oWebViewInterface = window.nsWebViewInterface;
  //  var languageDD = document.getElementById('knownLanguage');

    /**
     * Registers handlers for native events.
     */
    /*function addNativeMsgListener() {
        oWebViewInterface.on('loadLanguages', function (arrLanguages) {
            for (var i = 0; i < arrLanguages.length; i++) {
                addLanguageOption(arrLanguages[i]);
            }
        });*/

 oWebViewInterface.on('marker', function (ltlng) {
    var data=ltlng.toString();
    var rmv=data.split('LatLng(');
    var interMidiate=rmv.toString().split(')')
    var cor = interMidiate[0];
    var output=cor.toString().split(',');
    var lat=output[0];
    var lang=output[1];
    console.log("Data from Home page =>"+lat+" and  long >"+lang);
 /*var myIcon = L.icon({
    iconUrl: '../css/images/green_pin_marker.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: '../css/images/marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
    });
var DynaMarker = L.marker([lat,lang], {icon: myIcon} )
    .addTo(map).bindPopup('NEW SHINY<br> MARKER')
    .openPopup();
    map.flyTo([lat, lang], 14,'animate');
 // });*/
});

    /**
     * Defines global functions which will be called from andorid/ios
     */

}
)();
