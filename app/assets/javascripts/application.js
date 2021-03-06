//= require jquery3
//= require jquery_ujs
//= require jquery.timers
//= require jquery.cookie
//= require jquery.throttle-debounce
//= require popper
//= require bootstrap-sprockets
//= require osm
//= require leaflet
//= require leaflet.osm
//= require leaflet.map
//= require leaflet.zoom
//= require leaflet.locationfilter
//= require i18n
//= require oauth
//= require piwik
//= require richtext
//= require querystring

/*
 * Called as the user scrolls/zooms around to manipulate hrefs of the
 * view tab and various other links
 */
window.updateLinks = function (loc, zoom, layers, object) {
  $(".geolink").each(function (index, link) {
    var querystring = require("querystring-component"),
        href = link.href.split(/[?#]/)[0],
        args = querystring.parse(link.search.substring(1)),
        editlink = $(link).hasClass("editlink");

    delete args.node;
    delete args.way;
    delete args.relation;
    delete args.changeset;

    if (object && editlink) {
      args[object.type] = object.id;
    }

    var query = querystring.stringify(args);
    if (query) href += "?" + query;

    args = {
      lat: loc.lat,
      lon: "lon" in loc ? loc.lon : loc.lng,
      zoom: zoom
    };

    if (layers && !editlink) {
      args.layers = layers;
    }

    href += OSM.formatHash(args);

    link.href = href;
  });

  var editDisabled = zoom < 13;
  $("#edit_tab")
    .tooltip({ placement: "bottom" })
    .off("click.minzoom")
    .on("click.minzoom", function () { return !editDisabled; })
    .toggleClass("disabled", editDisabled)
    .attr("data-original-title", editDisabled ?
      I18n.t("javascripts.site.edit_disabled_tooltip") : "");
};

window.maximiseMap = function () {
  $("#content").addClass("maximised");
};

window.minimiseMap = function () {
  $("#content").removeClass("maximised");
};

$(document).ready(function () {
  var headerWidth = 0,
      compactWidth = 0;

  function updateHeader() {
    var windowWidth = $(window).width();

    if (windowWidth < compactWidth) {
      $("body").removeClass("compact-nav").addClass("small-nav");
    } else if (windowWidth < headerWidth) {
      $("body").addClass("compact-nav").removeClass("small-nav");
    } else {
      $("body").removeClass("compact-nav").removeClass("small-nav");
    }
  }

  /*
   * Chrome 60 and later seem to fire the "ready" callback
   * before the DOM is fully ready causing us to measure the
   * wrong sizes for the header elements - use a 0ms timeout
   * to defer the measurement slightly as a workaround.
   */
  setTimeout(function () {
    $("header").children(":visible").each(function (i, e) {
      headerWidth = headerWidth + $(e).outerWidth();
    });

    $("body").addClass("compact-nav");

    $("header").children(":visible").each(function (i, e) {
      compactWidth = compactWidth + $(e).outerWidth();
    });

    $("body").removeClass("compact-nav");

    updateHeader();

    $(window).resize(updateHeader);
  }, 0);

  $("#menu-icon").on("click", function (e) {
    e.preventDefault();
    $("header").toggleClass("closed");
  });

  $("nav.primary li a").on("click", function () {
    $("header").toggleClass("closed");
  });

  var application_data = $("head").data();

  I18n.default_locale = OSM.DEFAULT_LOCALE;
  I18n.locale = application_data.locale;
  I18n.fallbacks = true;

  OSM.preferred_editor = application_data.preferredEditor;

  if (application_data.user) {
    OSM.user = application_data.user;

    if (application_data.userHome) {
      OSM.home = application_data.userHome;
    }
  }

  if (application_data.location) {
    OSM.location = application_data.location;
  }
});

window.showMap = function (id) {
  var params = $("#" + id).data();
  var map = L.map(id, {
    attributionControl: false,
    zoomControl: false
  });
  map.addLayer(new L.OSM.Mapnik());
  var show_marker = true;
  if (!params.lon || !params.lat) {
    params.lon = 0;
    params.lat = 0;
    params.zoom = 1;
    show_marker = false;
  }
  map.setView([params.lat, params.lon], params.zoom);
  if (show_marker) {
    L.marker([params.lat, params.lon], { icon: OSM.getUserIcon() }).addTo(map);
  }
};

window.formMapInput = function (id, type) {
  var map = L.map(id, {
    attributionControl: false
  });
  map.addLayer(new L.OSM.Mapnik());

  var lat_field = document.getElementById(type + "_latitude");
  var lon_field = document.getElementById(type + "_longitude");

  if (lat_field.value) {
    map.setView([lat_field.value, lon_field.value], 12);
  } else {
    map.setView([0, 0], 0);
  }

  L.Control.Watermark = L.Control.extend({
    onAdd: function () {
      var container = map.getContainer();
      var img = L.DomUtil.create("img");
      img.src = "/assets/marker-blue.png"; // 25x41 px
      // img.style.width = '200px';
      img.style["margin-left"] = ((container.offsetWidth / 2) - 12) + "px";
      img.style["margin-bottom"] = ((container.offsetHeight / 2) - 20) + "px";
      return img;
    },
    onRemove: function () {
      // Nothing to do here
    }
  });
  L.control.watermark = function (opts) {
    return new L.Control.Watermark(opts);
  };
  L.control.watermark({ position: "bottomleft" }).addTo(map);

  map.on("move", function () {
    var center = map.getCenter();
    $("#" + type + "_latitude").val(center.lat);
    $("#" + type + "_longitude").val(center.lng);
    if ($("#" + type + "_min_lat")) {
      var bounds = map.getBounds();
      $("#" + type + "_min_lat").val(bounds._southWest.lat);
      $("#" + type + "_max_lat").val(bounds._northEast.lat);
      $("#" + type + "_min_lon").val(bounds._southWest.lng);
      $("#" + type + "_max_lon").val(bounds._northEast.lng);
    }
  });
};
