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
Let me know how it goes!
