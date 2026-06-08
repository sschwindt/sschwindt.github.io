(function (global) {
    const cacheKey = 'umami-share-cache';
    const cacheTTL = 3600_000; // 1h

    /**
     * Fetch website analytics data
     * @param {string} baseUrl - Umami Cloud API base URL
     * @param {string} apiKey - API key
     * @param {string} websiteId - Website ID
     * @returns {Promise<object>} Website analytics data
     */
    async function fetchWebsiteStats(baseUrl, apiKey, websiteId) {
        // Check the cache
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < cacheTTL) {
                    return parsed.value;
                }
            } catch {
                localStorage.removeItem(cacheKey);
            }
        }

        const currentTimestamp = Date.now();
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const statsUrl = `${cleanBaseUrl}/v1/websites/${websiteId}/stats?startAt=0&endAt=${currentTimestamp}`;

        const res = await fetch(statsUrl, {
            headers: {
                'x-umami-api-key': apiKey
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch website analytics data');
        }

        const stats = await res.json();

        // Handle the V3 response format
        const normalizedStats = {
            pageviews: typeof stats.pageviews === 'object' ? stats.pageviews.value : (stats.pageviews || 0),
            visitors: typeof stats.visitors === 'object' ? stats.visitors.value : (stats.visitors || 0),
            visits: typeof stats.visits === 'object' ? stats.visits.value : (stats.visits || 0),
            bounces: typeof stats.bounces === 'object' ? stats.bounces.value : (stats.bounces || 0),
            totaltime: typeof stats.totaltime === 'object' ? stats.totaltime.value : (stats.totaltime || 0)
        };

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), value: normalizedStats }));

        return normalizedStats;
    }

    /**
     * Fetch analytics data for a specific page
     * @param {string} baseUrl - Umami Cloud API base URL
     * @param {string} apiKey - API key
     * @param {string} websiteId - Website ID
     * @param {string} urlPath - Page path
     * @param {number} startAt - Start timestamp
     * @param {number} endAt - End timestamp
     * @returns {Promise<object>} Page analytics data
     */
    async function fetchPageStats(baseUrl, apiKey, websiteId, urlPath, startAt = 0, endAt = Date.now()) {
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const statsUrl = `${cleanBaseUrl}/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&path=${encodeURIComponent(urlPath)}`;

        const res = await fetch(statsUrl, {
            headers: {
                'x-umami-api-key': apiKey
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch page analytics data');
        }

        const stats = await res.json();
        
        // Handle the V3 response format, which may be { pageviews: { value: 123 }, visitors: { value: 45 } } or { pageviews: 123, visitors: 45 }
        return {
            pageviews: typeof stats.pageviews === 'object' ? stats.pageviews.value : (stats.pageviews || 0),
            visitors: typeof stats.visitors === 'object' ? stats.visitors.value : (stats.visitors || 0),
            visits: typeof stats.visits === 'object' ? stats.visits.value : (stats.visits || 0),
            bounces: typeof stats.bounces === 'object' ? stats.bounces.value : (stats.bounces || 0),
            totaltime: typeof stats.totaltime === 'object' ? stats.totaltime.value : (stats.totaltime || 0)
        };
    }

    /**
     * Fetch Umami website analytics data
     * @param {string} baseUrl - Umami Cloud API base URL
     * @param {string} apiKey - API key
     * @param {string} websiteId - Website ID
     * @returns {Promise<object>} Website analytics data
     */
    global.getUmamiWebsiteStats = async function (baseUrl, apiKey, websiteId) {
        try {
            return await fetchWebsiteStats(baseUrl, apiKey, websiteId);
        } catch (err) {
            throw new Error(`Failed to fetch Umami analytics data: ${err.message}`);
        }
    };

    /**
     * Fetch Umami analytics data for a specific page
     * @param {string} baseUrl - Umami Cloud API base URL
     * @param {string} apiKey - API key
     * @param {string} websiteId - Website ID
     * @param {string} urlPath - Page path
     * @param {number} startAt - Start timestamp (optional)
     * @param {number} endAt - End timestamp (optional)
     * @returns {Promise<object>} Page analytics data
     */
    global.getUmamiPageStats = async function (baseUrl, apiKey, websiteId, urlPath, startAt, endAt) {
        try {
            return await fetchPageStats(baseUrl, apiKey, websiteId, urlPath, startAt, endAt);
        } catch (err) {
            throw new Error(`Failed to fetch Umami page analytics data: ${err.message}`);
        }
    };

    global.clearUmamiShareCache = function () {
        localStorage.removeItem(cacheKey);
    };
})(window);