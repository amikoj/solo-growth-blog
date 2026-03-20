function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json"
        }
    });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname === "/api/views" && request.method === "POST") {
            if (!env.VIEWS) {
                return jsonResponse({ error: "KV binding missing" }, 500);
            }
            const body = await request.json().catch(() => null);
            const key = body && body.key;
            if (!key) {
                return jsonResponse({ error: "key required" }, 400);
            }
            const current = Number(await env.VIEWS.get(key)) || 0;
            const next = current + 1;
            await env.VIEWS.put(key, String(next));
            return jsonResponse({ key, count: next });
        }
        if (url.pathname === "/api/views/batch" && request.method === "POST") {
            if (!env.VIEWS) {
                return jsonResponse({ error: "KV binding missing" }, 500);
            }
            const body = await request.json().catch(() => null);
            const keys = body && Array.isArray(body.keys) ? body.keys : [];
            const counts = {};
            await Promise.all(
                keys.map(async (key) => {
                    const value = await env.VIEWS.get(key);
                    if (value !== null) {
                        counts[key] = Number(value) || 0;
                    }
                })
            );
            return jsonResponse({ counts });
        }
        if (env.ASSETS) {
            let response = await env.ASSETS.fetch(request);
            if (response.status === 404) {
                const notFoundResponse = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url)));
                if (notFoundResponse.status === 200) {
                    return new Response(notFoundResponse.body, {
                        status: 404,
                        headers: notFoundResponse.headers
                    });
                }
            }
            return response;
        }
        return new Response("Not Found", { status: 404 });
    }
}
