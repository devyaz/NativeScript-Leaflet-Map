'use strict';

(function (factory, window) {

    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory(require('leaflet'));
    } else if (typeof window !== 'undefined') {
        if (typeof window.L === 'undefined') {
            throw 'Leaflet must be loaded first!';
        }
        factory(window.L);
    }
}(function (L) {

    /**
     * The Offline Layer should work in the same way as the Tile Layer does
     * when there are no offline tile images saved.
     */
    L.TileLayer.Offline = L.TileLayer.extend({

        /**
         * Constructor of the layer.
         * 
         * @param {String} url URL of the tile map provider.
         * @param {Object} tilesDb An object that implements a certain interface
         * so it's able to serve as the database layer to save and remove the tiles.
         * @param {Object} options This is the same options parameter as the Leaflet
         * Tile Layer, there are no additional parameters. Check their documentation
         * for up-to-date information.
         */
        initialize: function (url, tilesDb, options) {
            this._url = url;
            this._tilesDb = tilesDb;

            options = L.Util.setOptions(this, options);

            if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {
                options.tileSize = Math.floor(options.tileSize / 2);

                if (!options.zoomReverse) {
                    options.zoomOffset++;
                    options.maxZoom--;
                } else {
                    options.zoomOffset--;
                    options.minZoom++;
                }

                options.minZoom = Math.max(0, options.minZoom);
            }

            if (typeof options.subdomains === 'string') {
                options.subdomains = options.subdomains.split('');
            }

            if (!L.Browser.android) {
                this.on('tileunload', this._onTileRemove);
            }
        },

        /**
         * Overrides the method from the Tile Layer. Loads a tile given its
         * coordinates.
         * 
         * @param {Object} coords Coordinates of the tile.
         * @param {Function} done A callback to be called when the tile has been
         * loaded.
         * @returns {HTMLElement} An <img> HTML element with the appropriate
         * image URL.
         */
        createTile: function (coords, done) {
            var tile = document.createElement('img');

            L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile));
            L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile));

            if (this.options.crossOrigin) {
                tile.crossOrigin = '';
            }

            tile.alt = '';

            tile.setAttribute('role', 'presentation');

            this.getTileUrl(coords).then(function (url) {
                tile.src = url;
            }).catch(function (err) {
                throw err;
            });

            return tile;
        },

        /**
         * Overrides the method from the Tile Layer. Returns the URL for a tile
         * given its coordinates. It tries to get the tile image offline first,
         * then if it fails, it falls back to the original Tile Layer
         * implementation.
         * 
         * @param {Object} coords Coordinates of the tile.
         * @returns {String} The URL for a tile image.
         */
        getTileUrl: function (coords) {
            var url = L.TileLayer.prototype.getTileUrl.call(this, coords);
            var dbStorageKey = this._getStorageKey(url);

            var resultPromise = this._tilesDb.getItem(dbStorageKey).then(function (data) {
                if (data && typeof data === 'object') {
                    return URL.createObjectURL(data);
                }
                return url;
            }).catch(function (err) {
                throw err;
            });

            return resultPromise;
        },

        /**
         * Gets the URLs for all the tiles that are inside the given bounds.
         * Every element of the result array is in this format:
         * {key: <String>, url: <String>}. The key is the key used on the
         * database layer to find the tile image offline. The URL is the
         * location from where the tile image will be downloaded.
         * 
         * @param {Object} bounds The bounding box of the tiles.
         * @param {Number} zoom The zoom level of the bounding box.
         * @returns {Array} An array containing all the URLs inside the given
         * bounds.
         */
        getTileUrls: function (bounds, zoom) {
            var tiles = [];
            var originalurl = this._url;

            this.setUrl(this._url.replace('{z}', zoom), true);

            var tileBounds = L.bounds(
                bounds.min.divideBy(this.getTileSize().x).floor(),
                bounds.max.divideBy(this.getTileSize().x).floor()
            );

            for (var i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                for (var j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
                    var tilePoint = new L.Point(i, j);
                    var url = L.TileLayer.prototype.getTileUrl.call(this, tilePoint);

                    tiles.push({
                        'key': this._getStorageKey(url),
                        'url': url,
                    });
                }
            }

            this.setUrl(originalurl, true);

            return tiles;
        },

        /**
         * Determines the key that will be used on the database layer given
         * a URL.
         * 
         * @param {String} url The URL of a tile image.
         * @returns {String} The key that will be used on the database layer
         * to find a tile image.
         */
        _getStorageKey: function (url) {
            var key = null;

            if (url.indexOf('{s}')) {
                var regexstring = new RegExp('[' + this.options.subdomains.join('|') + ']\.');
                key = url.replace(regexstring, this.options.subdomains['0'] + '.');
            }

            return key || url;
        },
    });

    /**
     * Factory function as suggested by the Leaflet team.
     * 
     * @param {String} url URL of the tile map provider.
     * @param {Object} tilesDb An object that implements a certain interface
     * so it's able to serve as the database layer to save and remove the tiles.
     * @param {Object} options This is the same options parameter as the Leaflet
     * Tile Layer, there are no additional parameters. Check their documentation
     * for up-to-date information.
     */
    L.tileLayer.offline = function (url, tilesDb, options) {
        return new L.TileLayer.Offline(url, tilesDb, options);
    };
}, window));

'use strict';

(function (factory, window) {

    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory(require('leaflet'));
    } else if (typeof window !== 'undefined') {
        if (typeof window.L === 'undefined') {
            throw 'Leaflet must be loaded first!';
        }
        factory(window.L);
    }
}(function (L) {

    /**
     * The Offline Control to be used together with the Offline Layer.
     */
    L.Control.Offline = L.Control.extend({
        options: {
            position: 'topleft',
            saveButtonHtml: 'S',
            saveButtonTitle: 'Save tiles',
            removeButtonHtml: 'R',
            removeButtonTitle: 'Remove tiles',
            minZoom: 0,
            maxZoom: 19,
            confirmSavingCallback: null,
            confirmRemovalCallback: null
        },

        /**
         * Constructor of the control.
         * 
         * @param {Object} baseLayer The Offline Layer to work together with the
         * control.
         * @param {Object} tilesDb An object that implements a certain interface
         * so it's able to serve as the database layer to save and remove the tiles.
         * @param {Object} options This is the same parameter as the Leaflet
         * Control, but it has some additions. Check the README for more.
         */
        initialize: function (baseLayer, tilesDb, options) {
            this._baseLayer = baseLayer;
            this._tilesDb = tilesDb;

            L.Util.setOptions(this, options);
        },

        /**
         * Creates the container DOM element for the control and add listeners
         * on relevant map events.
         * 
         * @param {Object} map The Leaflet map.
         * @returns {HTMLElement} The DOM element for the control.
         */
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control-offline leaflet-bar');

            this._createButton(this.options.saveButtonHtml, this.options.saveButtonTitle, 'save-tiles-button', container, this._saveTiles);
            this._createButton(this.options.removeButtonHtml, this.options.removeButtonTitle, 'remove-tiles-button', container, this._removeTiles);

            return container;
        },

        /**
         * Auxiliary method that creates a button DOM element.
         * 
         * @param {String} html The HTML that will be used inside the button
         * DOM element.
         * @param {String} title The title of the button DOM element.
         * @param {String} className The class name for the button DOM element.
         * @param {HTMLElement} container The container DOM element for the
         * buttons.
         * @param {Function} fn A function that will be executed when the button
         * is clicked.
         * @returns {HTMLElement} A button DOM element.
         */
        _createButton: function (html, title, className, container, fn) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = title;

            L.DomEvent.disableClickPropagation(link);
            L.DomEvent.on(link, 'click', L.DomEvent.stop);
            L.DomEvent.on(link, 'click', fn, this);
            L.DomEvent.on(link, 'click', this._refocusOnMap, this);

            return link;
        },

        /**
         * The function executed when the button to save tiles is clicked.
         */
        _saveTiles: function () {
            var self = this;

            var bounds = null;
            var zoomLevels = [];
            var tileUrls = [];
            var currentZoom = this._map.getZoom();
            var latlngBounds = this._map.getBounds();

            if (currentZoom < this.options.minZoom) {
                self._baseLayer.fire('offline:below-min-zoom-error');

                return;
            }

            for (var zoom = currentZoom; zoom <= this.options.maxZoom; zoom++) {
                zoomLevels.push(zoom);
            }

            for (var i = 0; i < zoomLevels.length; i++) {
                bounds = L.bounds(this._map.project(latlngBounds.getNorthWest(), zoomLevels[i]),
                    this._map.project(latlngBounds.getSouthEast(), zoomLevels[i]));
                tileUrls = tileUrls.concat(this._baseLayer.getTileUrls(bounds, zoomLevels[i]));
            }

            var continueSaveTiles = function () {
                self._baseLayer.fire('offline:save-start', {
                    nTilesToSave: tileUrls.length
                });

                self._tilesDb.saveTiles(tileUrls).then(function () {
                    self._baseLayer.fire('offline:save-end');
                }).catch(function (err) {
                    self._baseLayer.fire('offline:save-error', {
                        error: err
                    });
                });
            };

            if (this.options.confirmSavingCallback) {
                this.options.confirmSavingCallback(tileUrls.length, continueSaveTiles);
            } else {
                continueSaveTiles();
            }
        },

        /**
         * The function executed when the button to remove tiles is clicked.
         */
        _removeTiles: function () {
            var self = this;

            var continueRemoveTiles = function () {
                self._baseLayer.fire('offline:remove-start');

                self._tilesDb.clear().then(function () {
                    self._baseLayer.fire('offline:remove-end');
                }).catch(function (err) {
                    self._baseLayer.fire('offline:remove-error', {
                        error: err
                    });
                });
            };

            if (self.options.confirmRemovalCallback) {
                self.options.confirmRemovalCallback(continueRemoveTiles);
            } else {
                continueRemoveTiles();
            }
        }
    });

    /**
     * Factory function as suggested by the Leaflet team.
     * 
     * @param {Object} baseLayer The Offline Layer to work together with the
     * control.
     * @param {Object} tilesDb An object that implements a certain interface
     * so it's able to serve as the database layer to save and remove the tiles.
     * @param {Object} options This is the same parameter as the Leaflet
     * Control, but it has some additions. Check the README for more.
     */
    L.control.offline = function (baseLayer, tilesDb, options) {
        return new L.Control.Offline(baseLayer, tilesDb, options);
    };
}, window));

'use strict';

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./TileLayer.Offline', './Control.Offline'], factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory(require('./TileLayer.Offline'), require('./Control.Offline'));
    }
}(function (TileLayerOffline, ControlOffline) {
}));
