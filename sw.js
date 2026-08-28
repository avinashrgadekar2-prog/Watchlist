const CACHE_NAME = "watchlist-shell-v2";
const SHELL_FILES = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Only ever handle GET requests for this site's own files. Everything else —
// TMDB, Firebase Auth, Firestore, YouTube embeds, etc. — is left completely
// untouched and goes straight to the network, exactly as if there were no
// service worker at all. Intercepting cross-origin calls was causing them
// to fail outright when the network hiccuped even slightly.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  let url;
  try { url = new URL(event.request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then((response) => response || Response.error())
  );
});
