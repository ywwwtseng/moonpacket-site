import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.toString() || 'https://ywwwtseng.github.io/moonpacket-site/';
  
  const robotsTxt = `User-agent: *
Allow: /

# 排除 404 页面，避免 Google 索引错误页面
Disallow: /404/
Disallow: /*/404/

# Sitemap
Sitemap: ${baseUrl}sitemap-index.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
