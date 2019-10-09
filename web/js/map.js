var m = L.map('map').setView([37.5159, -82.0912], 6);
lockMap();
var bg = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
bg.addTo(m);

var layers = {};

function clearMap() {
    m.eachLayer(function (layer) {
        if (layer != bg)
            m.removeLayer(layer);
    });
}

function lockMap() {
    m.dragging.disable();
    m.zoomControl.remove();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    // $(".leaflet-control-zoom").css("visibility", "hidden");
}

function setMap(lat, long, zoom, overlay) {
    clearMap();
    lockMap();
    m.setView([lat, long], zoom);
    overlay.addTo(m);
    addBackButton();
}

function goHome() {
    clearMap();
    layers['va_border'].addTo(m);
    layers['ky_border'].addTo(m);
    layers['pa_border'].addTo(m);
    m.setView([37.5159, -82.0912], 6);
    this.remove();
}

function addBackButton() {
    var b = L.easyButton('fa-arrow-left', goHome);
    b.button.style.width = '50px';
    b.button.style.height = '50px';
    b.addTo(m);
}

function loadGeoJSON(name, url, func, add) {
    $.getJSON(url, function (json) {
        layers[name] = new L.GeoJSON(json, {onEachFeature: func});
        if (add)
            layers[name].addTo(m);
    });
}

function ky_func(feature, layer) {
    layer.on({
        click: function () {
            setMap(37.5, -86, 8, layers['ky_precincts']);
        }
    });
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
loadGeoJSON('ky_precincts', 'geoJSON/ky_slightlysimple.geojson', function (feature, layer) {}, false);

loadGeoJSON('pa_border', 'geoJSON/pa_border.geojson', pa_func, true);

loadGeoJSON('va_border', 'geoJSON/va_border.geojson', va_func, true);
loadGeoJSON('va_precincts', 'geoJSON/va_precincts.geojson', function (feature, layer) {}, false);
