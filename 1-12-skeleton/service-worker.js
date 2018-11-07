var cacheName = 'weatherPWA';
var dataCacheName = 'weatherData';

var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/ud811.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png',
    '/node_modules/localforage/dist/localforage.js'
];

var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';


/**
 * Call install event
 */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    )
});

/**
 * Call activate
 */
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key) {
                if(key !== cacheName && key !== dataCacheName) {
                    return caches.delete(key);
                }
            }))
        })
    )
});

/**
 * Call fetch and return file if it is cached
 */
self.addEventListener('fetch', function(e) {
   console.log('Service worker: Fetch', e.request.url);
   if(e.request.url.startsWith(weatherAPIUrlBase)) {
       e.respondWith(
           fetch(e.request)
               .then(function(response){
                   return caches.open(dataCacheName).then(function(cache) {
                       cache.put(e.request, response.clone());
                       console.log('Service worker fetch and cache');
                       return response;
                   })
               })
       )
   } else {
       e.respondWith(
           caches.match(e.request).then(function(response) {
               return response || fetch((e.request));
           })
       )
   }
});