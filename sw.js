const CACHE_NAME = 'rinno-cache-v20260505-slider-viewport-wrap-1';
const PRECACHE_URLS = [
    './',
    'index.html',
    'manifest.json',
    'manifest.json?v=20260428-app-icon-refresh-1',
    'icon-192-v20260428-app-refresh-1.png',
    'icon-512-v20260428-app-refresh-1.png',
    'https://unpkg.com/dexie@3.2.4/dist/dexie.js',
    'style.css?v=20260505-slider-viewport-wrap-1',
    'app/style/css/style.css?v=20260425-top-chrome-controls-1',
    'app/settings/css/settings.css?v=20260423-click-cleanup-3',
    'app/prologue/css/prologue.css?v=20260423-click-cleanup-3',
    'app/private/css/private.css?v=20260429-chat-shell-icon-ready-fix-2',
    'app/private/css/private.tail-fix.css?v=20260429-chat-shell-tail-fix-1',
    'app/letter/css/letter.css?v=20260423-click-cleanup-3',
    'app/community/css/community.css?v=20260423-click-cleanup-3',
    'app/encounter/css/encounter.css?v=20260423-click-cleanup-3',
    'app/dossier/css/dossier.css?v=20260429-dossier-chat-wallpaper-fix-1',
    'app/wanye/css/wanye.css?v=20260423-new-apps-1',
    'app/lingguang/css/lingguang.css?v=20260423-new-apps-1',
    'app/guide/css/guide.css?v=20260423-new-apps-1',
    'app/zhenxuan/css/zhenxuan.css?v=20260427-zhenxuan-icon-fix-3',
    'app/phone/css/phone.css?v=20260427-zhenxuan-phone-restore-1',
    'app/assets/css/assets.css?v=20260429-assets-bank-wallet-refresh-1',
    'app/_shared/css/theme-bridge.css?v=20260501-dossier-private-fix-4',
    'app/_shared/css/contact-homepage-overrides.css?v=20260429-private-contact-layout-fix-1',
    'app/_shared/css/safe-area.css?v=20260427-private-chat-direct-fix-3',
    'script.js?v=20260504-remove-bridge-overrides-1',
    'app/style/tpl/style.tpl?v=20260501-dossier-private-fix-4',
    'app/settings/tpl/settings.tpl?v=20260501-dossier-private-fix-4',
    'app/prologue/tpl/prologue.tpl?v=20260501-dossier-private-fix-4',
    'app/private/tpl/private.tpl?v=20260501-dossier-private-fix-4',
    'app/letter/tpl/letter.tpl?v=20260501-dossier-private-fix-4',
    'app/community/tpl/community.tpl?v=20260501-dossier-private-fix-4',
    'app/encounter/tpl/encounter.tpl?v=20260501-dossier-private-fix-4',
    'app/dossier/tpl/dossier.tpl?v=20260501-dossier-private-fix-4',
    'app/wanye/tpl/wanye.tpl?v=20260501-dossier-private-fix-4',
    'app/lingguang/tpl/lingguang.tpl?v=20260501-dossier-private-fix-4',
    'app/guide/tpl/guide.tpl?v=20260501-dossier-private-fix-4',
    'app/zhenxuan/tpl/zhenxuan.tpl?v=20260501-dossier-private-fix-4',
    'app/phone/tpl/phone.tpl?v=20260501-dossier-private-fix-4',
    'app/assets/tpl/assets.tpl?v=20260501-dossier-private-fix-4',
    'app/private/js/private.js?v=20260501-dossier-private-fix-4',
    'app/letter/js/letter.js?v=20260501-dossier-private-fix-4',
    'app/settings/js/settings.js?v=20260501-dossier-private-fix-4',
    'app/prologue/js/prologue.js?v=20260501-dossier-private-fix-4',
    'app/style/js/style.js?v=20260501-dossier-private-fix-4',
    'app/community/js/community.js?v=20260501-dossier-private-fix-4',
    'app/encounter/js/encounter.js?v=20260501-dossier-private-fix-4',
    'app/dossier/js/dossier.js?v=20260501-dossier-private-fix-4',
    'app/wanye/js/wanye.js?v=20260501-dossier-private-fix-4',
    'app/lingguang/js/lingguang.js?v=20260501-dossier-private-fix-4',
    'app/guide/js/guide.js?v=20260501-dossier-private-fix-4',
    'app/zhenxuan/js/zhenxuan.js?v=20260501-dossier-private-fix-4',
    'app/phone/js/phone.js?v=20260501-dossier-private-fix-4',
    'app/assets/js/assets.js?v=20260501-dossier-private-fix-4',
    'app/style/assets/fonts/xinjie-10.ttf'
];

async function warmPrecache() {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(
        PRECACHE_URLS.map(async url => {
            try {
                await cache.add(url);
            } catch (error) {
                console.warn('[Rinno SW] precache skipped:', url, error);
            }
        })
    );
}

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        await warmPrecache();
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
        );
        await self.clients.claim();
    })());
});

function canHandleRequest(request) {
    if (!request || request.method !== 'GET') return false;
    const url = new URL(request.url);
    return url.origin === self.location.origin || request.url === 'https://unpkg.com/dexie@3.2.4/dist/dexie.js';
}

function isManifestOrAppIconRequest(request) {
    if (!request) return false;
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\//, '');
    return pathname === 'manifest.json'
        || pathname === 'icon-192-v20260428-app-refresh-1.png'
        || pathname === 'icon-512-v20260428-app-refresh-1.png';
}

async function cacheResponse(cache, request, response) {
    if (!response || (!response.ok && response.type !== 'opaque')) return response;
    await cache.put(request, response.clone());
    return response;
}

async function handleNavigation(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        await cacheResponse(cache, request, response);
        return response;
    } catch (error) {
        return (
            await cache.match(request)
            || await cache.match('index.html')
            || await cache.match('./')
            || Response.error()
        );
    }
}

async function handleAsset(event) {
    const { request } = event;
    const cache = await caches.open(CACHE_NAME);
    if (isManifestOrAppIconRequest(request)) {
        try {
            const response = await fetch(request, { cache: 'no-store' });
            return await cacheResponse(cache, request, response);
        } catch (error) {
            return (
                await cache.match(request)
                || Response.error()
            );
        }
    }
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then(response => cacheResponse(cache, request, response))
        .catch(() => null);

    if (cached) {
        event.waitUntil(networkPromise);
        return cached;
    }

    const network = await networkPromise;
    if (network) return network;

    if (request.destination === 'document') {
        return (
            await cache.match('index.html')
            || await cache.match('./')
            || Response.error()
        );
    }

    return Response.error();
}

self.addEventListener('fetch', event => {
    if (!canHandleRequest(event.request)) return;
    if (event.request.mode === 'navigate') {
        event.respondWith(handleNavigation(event.request));
        return;
    }
    event.respondWith(handleAsset(event));
});
