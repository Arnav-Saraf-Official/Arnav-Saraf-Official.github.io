export default {
    //@ts-expect-error-any-types
    async fetch(request, env) {
    const allowedOrigins = [
      "https://arnav-saraf-official.github.io",
      "http://localhost:5173",
      "https://arnavsaraf.pages.dev"
    ];

    const origin = request.headers.get("Origin");
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);
    
    const githubUrl = `https://api.github.com${url.pathname}${url.search}`;

    const githubResponse = await fetch(githubUrl, {
      headers: {
        "User-Agent": "Cloudflare-Worker-Proxy",
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`
      }
    });

    const data = await githubResponse.text();
    return new Response(data, { status: githubResponse.status, headers: corsHeaders });
  }
};
