// Spotify Now Playing widget
// Mirrors the Framer SpotifyWidget component

var spotifyUrl = "#";

(function () {
  var API_URL = "https://spotify-balzhima-now-playing.vercel.app/api/now-playing";

  function timeAgo(iso) {
    var diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)    return "just now";
    if (diff < 3600)  return Math.floor(diff / 60)   + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600)  + "h ago";
    return Math.floor(diff / 86400) + "d ago";
  }

  fetch(API_URL)
    .then(function (r) { return r.json(); })
    .then(function (track) {
      if (!track || !track.title) return;

      spotifyUrl = track.songUrl || "#";

      var widget = document.getElementById("spotify-widget");
      var art    = document.getElementById("sw-art");
      var label  = document.getElementById("sw-label");
      var title  = document.getElementById("sw-title");
      var artist = document.getElementById("sw-artist");
      var time   = document.getElementById("sw-time");

      art.src    = track.albumImageUrl || "";
      art.alt    = track.title;
      label.textContent  = track.isPlaying ? "Now playing" : "Last listened to";
      title.textContent  = track.title;
      artist.textContent = track.artist;

      if (!track.isPlaying && track.playedAt) {
        time.textContent = timeAgo(track.playedAt);
      }

      widget.style.display = "flex";
    })
    .catch(function () { /* silently fail */ });
})();
