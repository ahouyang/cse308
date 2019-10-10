var m = L.map('map').setView([37.5159, -82.0912], 6);
m.zoomControl.remove();
var zoom = L.control.zoom();
lockMap();
var bg = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
bg.addTo(m);

var sidebar = L.control.sidebar({
    autopan: false,       // whether to maintain the centered map point when opening the sidebar
    closeButton: true,    // whether t add a close button to the panes
    container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
    position: 'left',     // left or right
}).addTo(m);

sidebar.addPanel({
    id: 'click',
    tab: '<i class="fa fa-info"></i>',
    pane: '<p> yo bruh whats up </p>'
});

var layers = {};

function clearMap() {
    m.eachLayer(function (layer) {
        if (layer !== bg)
            m.removeLayer(layer);
    });
}

function lockMap() {
    zoom.remove();
    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    // $(".leaflet-control-zoom").css("visibility", "hidden");
}

function unlockMap() {
    zoom.addTo(m);
    m.dragging.enable();
    m.touchZoom.enable();
    m.doubleClickZoom.enable();
    m.scrollWheelZoom.enable();
    m.boxZoom.enable();
    m.keyboard.enable();
}

function setMap(lat, long, zoom, overlay) {
    clearMap();
    lockMap();
    m.setView([lat, long], zoom);
    overlay.addTo(m);
    addBackButton();
    unlockMap();
}

function goHome() {
    clearMap();
    layers['va_border'].addTo(m);
    layers['ky_border'].addTo(m);
    layers['pa_border'].addTo(m);
    m.setView([37.5159, -82.0912], 6);
    lockMap();
    this.remove();
}

function addBackButton() {
    var b = L.easyButton('fa-arrow-left', goHome);
    b.button.style.width = '50px';
    b.button.style.height = '50px';
    b.addTo(m);
}

function loadGeoJSON(name, url, func, show) {
    $.getJSON(url, function (json) {
        layers[name] = new L.GeoJSON(json, {onEachFeature: func, style: {'weight': 1}});
        if (show)
            layers[name].addTo(m);
    });
}

function color_precinct(layer, dem, rep) {
    layer.bindPopup(dem + ':' + rep);
    if (dem === 0 && rep === 0) {
        layer.setStyle({fillColor: '#FFFFFF', color: '#FFFFFF'});
    } else if (dem > rep) {
        layer.setStyle({fillColor: '#3388FF', color: '#3388FF'});
    } else if (dem < rep) {
        layer.setStyle({fillColor: '#FF0000', color: '#FF0000'});
    } else if (dem === rep) {
        layer.setStyle({fillColor: '#8b008b', color: '#8b008b'});
    }
}

function ky_func(feature, layer) {
    layer.on({
        click: function () {
            setMap(37.5, -86, 8, layers['ky_precincts']);
        }
    });
}

function ky_precinct_func(feature, layer) {
    color_precinct(layer, layer.feature.properties.DemPer * 100, layer.feature.properties.RepPer * 100);
}

function va_func(feature, layer) {
    layer.on({
        click: function () {
            setMap(37.8478, -80.1567, 8, layers['va_precincts']);
        }
    });
}

function pa_func(feature, layer) {}

loadGeoJSON('ky_border', 'geoJSON/ky_border.geojson', ky_func, true);
loadGeoJSON('ky_precincts', 'geoJSON/ky_slightlysimple.geojson', ky_precinct_func, false);

loadGeoJSON('pa_border', 'geoJSON/pa_border.geojson', pa_func, true);

loadGeoJSON('va_border', 'geoJSON/va_border.geojson', va_func, true);
loadGeoJSON('va_precincts', 'geoJSON/va_precincts.geojson', function (f, l) {}, false);
