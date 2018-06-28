# NativeScript-Leaflet-Map
A lightweight Map for {N}
I wanted a fast  low memory consuption Map after {N} Mapbox chewed most of memory on device, leaflet https://leafletjs.com/ is where Mapbox was born from :). i am using webview interface https://github.com/shripalsoni04/nativescript-webview-interface to have the Map communicate with {N} and catch events as if the Map were a Native View, Also am using App.js https://github.com/devyaz/app as a Map View framework, you can use Vue or Angular if you like, App.js is no longer maintained but works excellently, i used it in my Cordova days. just remenber to give credit where its due when you want to improve it or convert it into a plugin
# Clone
``` 
git clone https://github.com/devyaz/NativeScript-Leaflet-Map.git
cd NativeScript-Leaflet-Map
```

then install
# JS
install requirements first

```
tns install
```
Then run the app
```
tns run android/ios //this will build then run the app
```
# Develop
You want to be in ```app/www/``` to change/edit the Map, it's an HTML Map in a webview Really!!
please use your Mapbox token line 56 in ``app/www/index.html``!!! 
  # API
  ```
  //Declare the Map and setting up zoom level(6)
  var map = L.map('map').setView([latt, langg], 6); 
  
  //declare the popup
  var popup = L.popup();
  //Add the map tiles and map type(id)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=YOUR-MAPBOX-ACCESS_TOKEN-HERE', {
    maxZoom: 18,
    id: 'mapbox.streets' 
  }).addTo(map);
  //Now Load the amp with an animation
  map.flyTo([latt, langg], 14,'animate');
  //Declare a Marker and bind a popup that will open the details page about this location
var littleton = L.marker([-15.80908, 35.01369] ).bindPopup('<div id="1" class="app-section" onclick="App.load(\'detail\',product[1])"><p class="w3-blue w3-container"><b>Stooge\'s Taxi</b></p></div>').openPopup()
  ```
Let me know how it goes!
