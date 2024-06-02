const frameModule = require("@nativescript/core/ui/frame");
const geolocation = require('nativescript-geolocation');
const Accuracy = require("ui/enums");
const model = require("./search-view-model");
var nativescript_webview_interface_1 = require("nativescript-webview-interface");
var oLangWebViewInterface;
function navigatedFrom() {
  oLangWebViewInterface.destroy();
}
exports.navigatedFrom = navigatedFrom;

function backEvent(args) {
  if (model.state=="visible") {
    oLangWebViewInterface.emit('check', true);
    args.cancel = true;
  } else
  {
  console.log('Exiting')
  oLangWebViewInterface.destroy();
 geolocation.clearWatch();}
}
exports.backEvent=backEvent;

function close(args){
  oLangWebViewInterface.destroy();
  geolocation.clearWatch()
  backEvent()
//alert('Press again to Exit!!','WARNING')
}
exports.close = close;


function setupWebViewInterface(page) {
  var webView = page.getViewById('webView');
  oLangWebViewInterface = new nativescript_webview_interface_1.WebViewInterface(webView, '~/www/index.html');
  listenLangWebViewEvents();
}
function listenLangWebViewEvents() {
  oLangWebViewInterface.on('ack', function(eventData){
   console.log('map clicked at =>'+eventData.toString())
    // oLangWebViewInterface.emit('marker', model.mapdata);
    var data=eventData.toString();
    var rmv=data.split('LatLng(');
    var cor=rmv[1];
    oLangWebViewInterface.emit('marker', cor);
  });
  oLangWebViewInterface.on('status', function(eventData){
    if (eventData===1) {
      model.set("state", "visible");
    } else  {
        model.set("state","collapse");
      close()
    }
  });
}

function onNavigatingTo(args) {
    alert('WELCOME TO LEAFLET MAP!');
    console.log('page loaded');
 var locate= geolocation.watchLocation(loc => {
    this.currentGeoLocation = loc;
    latt=loc.latitude;
    lang=loc.longitude;
    console.log("Location locked !");
    setTimeout(function() {
      oLangWebViewInterface.emit('location', {latt:loc.latitude,lang:loc.longitude});
    }, 800);
  }, error => {
    alert(error);
  }, {
      desiredAccuracy: 3,
      updateDistance: 10,
      minimumUpdateTime: 1000 * 1
    });
  /*var location = geolocation.watchLocation({desiredAccuracy: 10, updateDistance: 10, maximumAge: 20000, timeout: 20000}).
  then(function(loc) {
  if (loc) {
    console.log('Locked!'+loc.longitude)
    setTimeout(function() {
      oLangWebViewInterface.emit('location', {latt:loc.latitude,lang:loc.longitude});
    }, 800);

  console.log("Current location is: " + JSON.stringify(loc));
     }
  }, function(e){
  console.log("Error: " + e.message);
  });*/

    if (args.isBackNavigation) {
        return;
    }

    const page = args.object;
    setupWebViewInterface(page);
    page.bindingContext = model;
}


//  setTimeout(function() {

//  }, 6100);

/*  setTimeout(function() {
    args.map.setZoomLevel({
      level: 9,
      animated: true
    });
  }, 8000);

  // setTimeout(function() {
    // args.map.removeMarkers([2]);
  // }, 10000);

 setTimeout(function() {
    args.map.setTilt({
      tilt: 85,
      duration: 1000
    });
  }, 2000);

  setTimeout(function() {
    args.map.animateCamera({
      target: {
        lat:latt,
        lng: lang
      },
      tilt: 80,
      zoomLevel: 15,
      duration: 3000
    });
  }, 3000);


  // setTimeout(function() {
    // args.map.removePolylines([10]);
  // }, 15000);
}*/

//exports.onMapReady = onMapReady;
/* ***********************************************************
 * According to guidelines, if you have a drawer on your page, you should always
 * have a button that opens it. Get a reference to the RadSideDrawer view and
 * use the showDrawer() function to open the app drawer section.
 *************************************************************/
function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
