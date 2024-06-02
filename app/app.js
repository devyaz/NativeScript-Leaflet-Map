//require("./bundle-config");
const Application = require("@nativescript/core/application");
var frame = require("@nativescript/core/ui/frame");
if (Application.android) {
	Application.android.on(Application.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args) {
	var currentPage = frame.topmost().currentPage;
	if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function") {
		currentPage.exports.backEvent(args);
	}
}
Application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
