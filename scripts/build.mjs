import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import hljs from "highlight.js";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "dist");
const CONTENT = path.join(ROOT, "content", "blog");
const BASE = "https://arjunp.website";
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      try { return '<pre class="hljs"><code>' + hljs.highlight(code, { language }).value + '</code></pre>'; } catch {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(code) + '</code></pre>';
  }
}).use(anchor, { permalink: false });

const escape = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const readTime = s => Math.max(1, Math.ceil(s.trim().split(/\s+/).length / 220));
const dateFmt = s => new Intl.DateTimeFormat("en-IN", { day:"numeric", month:"long", year:"numeric", timeZone:"UTC" }).format(new Date(s + "T00:00:00Z"));

const files = (await fs.readdir(CONTENT)).filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
const posts = [];
for (const file of files) {
  const raw = await fs.readFile(path.join(CONTENT, file), "utf8");
  const parsed = matter(raw);
  const data = parsed.data;
  const slug = String(data.slug || file.replace(/\.mdx?$/, ""));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid slug: " + slug);
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const plain = parsed.content.replace(/\[[^\]]*\]\([^)]*\)/g, "$1").replace(/[#>*_\x60]/g, " ");
  const post = { ...data, slug, tags, body: parsed.content, html: md.render(parsed.content), words: plain.trim().split(/\s+/).filter(Boolean).length };
  post.readingTime = Number(data.readingTime) || readTime(parsed.content);
  if (!data.title || !data.description || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date || ""))) throw new Error("Missing title, description or YYYY-MM-DD date in " + file);
  if (data.published === true) posts.push(post);
}
posts.sort((a,b) => String(b.date).localeCompare(String(a.date)));
const featured = posts.find(p => p.featured) || posts[0];
const categories = [...new Set(posts.map(p => p.category).filter(Boolean))].sort();
const baseHead = (title, description, canonical, ogImage = "") => `
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f5f3ee"><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${escape(canonical)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article"><meta property="og:site_name" content="Arjun P">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(canonical)}"><meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}">
${ogImage ? `<meta property="og:image" content="${escape(ogImage)}"><meta name="twitter:image" content="${escape(ogImage)}">` : ""}
<title>${escape(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/editorial.css"><link rel="stylesheet" href="/blog.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css">
<script>try{const t=localStorage.getItem('ap-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>`;
const header = `
<header class="topbar"><nav class="nav shell" aria-label="Main navigation">
<a class="wordmark" href="/" aria-label="Arjun P home"><span class="mark">AP</span><span>Arjun P</span></a>
<div class="blog-nav"><a href="/#work">Work</a><a href="/#experience">Experience</a><a href="/blog/" aria-current="page">Writing</a><a href="/#contact">Contact</a><button class="theme-button" type="button" aria-label="Switch theme" title="Switch theme"><span class="theme-symbol" aria-hidden="true"></span></button></div>
</nav></header>`;
const footer = `<footer class="blog-footer shell"><a class="wordmark" href="/"><span class="mark">AP</span><span>Arjun P</span></a><span>Notes on data, systems and engineering.</span><a href="/">Back to portfolio ↗</a></footer>`;
const shell = (head, content) => `<!doctype html><html lang="en"><head>${head}</head><body>${header}<main>${content}</main>${footer}<script src="/blog.js" defer></script></body></html>`;
const card = (p, isFeatured=false) => `<article class="post-row ${isFeatured ? "post-featured" : ""}" data-category="${escape(p.category || "Notes")}" data-search="${escape((p.title+" "+p.description+" "+p.tags.join(" ")+" "+(p.category||"")).toLowerCase())}">
<div class="post-meta"><time datetime="${escape(p.date)}">${dateFmt(p.date)}</time><span>${p.readingTime} min read</span></div>
<div class="post-main">${isFeatured ? '<span class="featured-note">Featured note</span>' : ""}<h2><a href="/blog/${escape(p.slug)}/">${escape(p.title)}</a></h2><p>${escape(p.description)}</p><div class="post-tags"><span>${escape(p.category || "Notes")}</span>${p.tags.slice(0,3).map(t=>`<span>${escape(t)}</span>`).join("")}</div></div>
<a class="post-arrow" href="/blog/${escape(p.slug)}/" aria-label="Read ${escape(p.title)}">↗</a></article>`;
const listing = `
<section class="blog-intro shell"><p class="eyebrow">FIELD NOTES</p><h1>Writing about <em>the work.</em></h1><p class="blog-deck">Notes on data engineering, cloud systems, observability and the things I learn while building them.</p></section>
<section class="blog-listing shell"><div class="blog-tools"><label class="search-label" for="post-search">Find a note</label><input id="post-search" type="search" placeholder="Search topics, tools, ideas…" autocomplete="off"><div class="category-filters" aria-label="Filter articles"><button class="filter-button active" type="button" data-filter="all" aria-pressed="true">All writing</button>${categories.map(c=>`<button class="filter-button" type="button" data-filter="${escape(c)}" aria-pressed="false">${escape(c)}</button>`).join("")}</div></div>
${featured ? `<div class="featured-post-label">START HERE</div>${card(featured,true)}` : ""}
<div class="post-list-heading"><h2>All writing</h2><span id="post-count">${posts.length} ${posts.length===1?"article":"articles"}</span></div>
<div id="post-list">${posts.filter(p=>p!==featured).map(p=>card(p)).join("") || '<p class="empty-posts">More notes will appear here as they are published.</p>'}</div><p class="empty-posts" id="no-results" hidden>No articles match that search. Try another term.</p></section>`;
await fs.mkdir(OUT, { recursive:true });
for (const entry of await fs.readdir(ROOT, {withFileTypes:true})) {
  if (entry.isFile() && !["package.json","package-lock.json"].includes(entry.name)) await fs.copyFile(path.join(ROOT,entry.name),path.join(OUT,entry.name));
  if (entry.isDirectory() && ["assets"].includes(entry.name)) await fs.cp(path.join(ROOT,entry.name),path.join(OUT,entry.name),{recursive:true});
}
await fs.mkdir(path.join(OUT,"blog"),{recursive:true});
await fs.copyFile(path.join(ROOT,"blog.css"),path.join(OUT,"blog.css"));
await fs.copyFile(path.join(ROOT,"blog.js"),path.join(OUT,"blog.js"));
const listHead = baseHead("Writing — Arjun P","Notes on data engineering, cloud systems, observability and lessons from building.","${BASE}/blog/").replace("${BASE}","https://arjunp.website");
await fs.writeFile(path.join(OUT,"blog","index.html"),shell(listHead,listing));
for (let i=0;i<posts.length;i++) {
  const p=posts[i], previous=posts[i+1], next=posts[i-1];
  const canonical = BASE+"/blog/"+p.slug+"/";
  const headings = [...p.body.matchAll(/^##?\s+(.+)$/gm)].map(m=>({text:m[1].trim(),slug:slugify(m[1])}));
  const toc = headings.length>=3 ? `<nav class="toc" aria-label="On this page"><p>On this page</p><ol>${headings.map(h=>`<li><a href="#${escape(h.slug)}">${escape(h.text)}</a></li>`).join("")}</ol></nav>` : "";
  const schema = { "@context":"https://schema.org","@type":"BlogPosting","headline":p.title,"description":p.description,"datePublished":p.date,"author":{"@type":"Person","name":"Arjun P","url":BASE},"mainEntityOfPage":canonical,...(p.cover?{"image":p.cover.startsWith("http")?p.cover:BASE+p.cover}:{})};
  const article = `
<article class="article-shell shell"><a class="back-blog" href="/blog/">← All writing</a><header class="article-header"><p class="article-category">${escape(p.category||"Notes")}</p><h1>${escape(p.title)}</h1><p class="article-deck">${escape(p.description)}</p><div class="article-meta"><time datetime="${escape(p.date)}">${dateFmt(p.date)}</time><span>${p.readingTime} min read</span>${p.tags.map(t=>`<span>${escape(t)}</span>`).join("")}</div>${p.cover?`<img class="article-cover" src="${escape(p.cover)}" alt="${escape(p.coverAlt||p.title)}">`:""}</header>
<div class="article-layout">${toc}<div class="prose">${p.html}<div class="article-disclaimer">${p.sample? "This is a sample article demonstrating the publishing format. Replace or remove it before treating it as a personal publication.":""}</div></div></div>
<nav class="article-pagination" aria-label="Article navigation"><div>${previous?`<span>PREVIOUS</span><a href="/blog/${escape(previous.slug)}/">${escape(previous.title)}</a>`:""}</div><div>${next?`<span>NEXT</span><a href="/blog/${escape(next.slug)}/">${escape(next.title)}</a>`:""}</div></nav>
</article>`;
  const articleHead = baseHead(p.title+" — Arjun P",p.description,canonical,p.cover? (p.cover.startsWith("http")?p.cover:BASE+p.cover):"") + `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script>`;
  const dir=path.join(OUT,"blog",p.slug);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,"index.html"),shell(articleHead,article));
}
const sitemap=[BASE+"/",BASE+"/blog/",...posts.map(p=>BASE+"/blog/"+p.slug+"/")];
await fs.writeFile(path.join(OUT,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u=>`  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
await fs.writeFile(path.join(OUT,"robots.txt"),"User-agent: *\nAllow: /\nDisallow: /blog/drafts/\n\nSitemap: "+BASE+"/sitemap.xml\n");
console.log("Built "+posts.length+" published article(s) and "+(posts.length+1)+" sitemap URLs into dist/.");
