/**
 * Build-time RSS/Atom feed loaders for the home page panels.
 *
 * Network access is required only during `astro build` / `astro dev`. The
 * result is inlined into the generated HTML, so visitors never call these
 * URLs at runtime.
 */
import { XMLParser } from "fast-xml-parser";


export type FeedItem = {
    title: string;
    link: string;
    description: string;
    pubDate?: string;
    thumbnail?: string;
};

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "__cdata",
});

const FETCH_TIMEOUT_MS = 12_000;
const USER_AGENT = "sebastian-schwindt.org/1.0 (+https://sebastian-schwindt.org)";

async function fetchText(url: string): Promise<string | null> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
            signal: ctrl.signal,
        });
        if (!res.ok) {
            console.warn(`[feeds] ${url} -> HTTP ${res.status}`);
            return null;
        }
        return await res.text();
    } catch (err: any) {
        console.warn(`[feeds] failed to fetch ${url}: ${err?.message ?? err}`);
        return null;
    } finally {
        clearTimeout(timer);
    }
}

function stripHtml(s: string | undefined | null): string {
    if (!s) return "";
    return s
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#8211;/g, "–")
        .replace(/&#8230;/g, "…")
        .replace(/&#8217;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
}

function truncate(s: string, n: number): string {
    if (s.length <= n) return s;
    return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

function pickString(value: unknown): string {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (typeof obj.__cdata === "string") return obj.__cdata;
        if (typeof obj["#text"] === "string") return obj["#text"];
    }
    return "";
}

/**
 * Fetch the latest videos from a YouTube channel via its public Atom feed.
 */
export async function fetchYouTubeFeed(channelId: string, limit = 6): Promise<FeedItem[]> {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const xml = await fetchText(url);
    if (!xml) return [];
    try {
        const parsed = parser.parse(xml);
        const entries = parsed?.feed?.entry ?? [];
        const arr = Array.isArray(entries) ? entries : [entries];
        return arr.slice(0, limit).map((e: any) => {
            const videoId: string = e?.["yt:videoId"] ?? "";
            const title: string = pickString(e?.title);
            const link: string = e?.link?.["@_href"] ?? (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");
            const desc: string = pickString(e?.["media:group"]?.["media:description"]);
            const published: string = pickString(e?.published);
            const thumb: string = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
            return {
                title: stripHtml(title),
                link,
                description: truncate(stripHtml(desc), 200),
                pubDate: published,
                thumbnail: thumb,
            };
        }).filter(i => i.link);
    } catch (err: any) {
        console.warn(`[feeds] failed to parse YouTube feed: ${err?.message ?? err}`);
        return [];
    }
}

/**
 * Fetch the latest items from a WordPress-style RSS 2.0 feed.
 */
export async function fetchRssFeed(url: string, limit = 6): Promise<FeedItem[]> {
    const xml = await fetchText(url);
    if (!xml) return [];
    try {
        const parsed = parser.parse(xml);
        const items = parsed?.rss?.channel?.item ?? [];
        const arr = Array.isArray(items) ? items : [items];
        return arr.slice(0, limit).map((it: any) => {
            const title = pickString(it?.title);
            const link = pickString(it?.link);
            const desc = pickString(it?.description) || pickString(it?.["content:encoded"]);
            const pubDate = pickString(it?.pubDate);
            const contentEncoded = pickString(it?.["content:encoded"]);
            const imgMatch = contentEncoded.match(/<img[^>]+src=["']([^"']+)["']/i)
                ?? desc.match(/<img[^>]+src=["']([^"']+)["']/i);
            const mediaThumb = it?.["media:thumbnail"]?.["@_url"]
                ?? it?.["media:content"]?.["@_url"]
                ?? it?.enclosure?.["@_url"];
            return {
                title: stripHtml(title),
                link,
                description: truncate(stripHtml(desc), 220),
                pubDate,
                thumbnail: mediaThumb ?? imgMatch?.[1] ?? undefined,
            };
        }).filter(i => i.link);
    } catch (err: any) {
        console.warn(`[feeds] failed to parse RSS feed ${url}: ${err?.message ?? err}`);
        return [];
    }
}
