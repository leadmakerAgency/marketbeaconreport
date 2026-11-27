// Builds the Market Beacon Report autoblog n8n workflow JSON.
// Usage: node build-workflow.mjs <out.json>
import fs from "node:fs";

const OWNER = { __rl: true, value: "leadmakerAgency", mode: "list", cachedResultName: "leadmakerAgency", cachedResultUrl: "https://github.com/leadmakerAgency" };
const REPO = { __rl: true, value: "marketbeaconreport", mode: "list", cachedResultName: "marketbeaconreport", cachedResultUrl: "https://github.com/leadmakerAgency/marketbeaconreport" };
const SHEET_DOC = { __rl: true, value: "", mode: "list" }; // pick your Market Beacon sheet in n8n after import
const SHEET_TAB = { __rl: true, value: "gid=0", mode: "list", cachedResultName: "Sheet1" };
const SHEETS_CRED = { googleSheetsOAuth2Api: { id: "8CGBmJJQ5Xzf0DxE", name: "Lead Agency Spreadsheet" } };
const OPENAI_CRED = { openAiApi: { id: "TuUAbXRBeFVhVWxO", name: "Mark OpenAI Key" } };
const GITHUB_CRED = { githubApi: { id: "oPh1BILDv4rasQFO", name: "leadmakerAgency github" } };

const col = (id) => ({ id, displayName: id, required: false, defaultMatch: false, display: true, type: "string", canBeUsedToMatch: true });
const SCHEMA = ["Keyword", "Desk", "Title", "Used"].map(col);

const model = (name, x, y) => ({
  parameters: { model: { __rl: true, value: "gpt-5-mini", mode: "list", cachedResultName: "gpt-5-mini" }, builtInTools: {}, options: {} },
  type: "@n8n/n8n-nodes-langchain.lmChatOpenAi", typeVersion: 1.3, position: [x, y], id: crypto.randomUUID(), name, credentials: OPENAI_CRED,
});
const agent = (name, x, text, systemMessage) => ({
  parameters: { promptType: "define", text, options: { systemMessage } },
  type: "@n8n/n8n-nodes-langchain.agent", typeVersion: 3, position: [x, -528], id: crypto.randomUUID(), name,
  retryOnFail: true, maxTries: 3, waitBetweenTries: 5000,
});
const code = (name, x, jsCode) => ({ parameters: { jsCode }, type: "n8n-nodes-base.code", typeVersion: 2, position: [x, -528], id: crypto.randomUUID(), name });
const sheetUpdate = (name, x, value, extra = {}) => ({
  parameters: {
    operation: "appendOrUpdate", documentId: SHEET_DOC, sheetName: SHEET_TAB,
    columns: { mappingMode: "defineBelow", value, matchingColumns: ["Keyword"], schema: SCHEMA, attemptToConvertTypes: false, convertFieldsToString: false },
    options: {},
  },
  type: "n8n-nodes-base.googleSheets", typeVersion: 4.7, position: [x, -528], id: crypto.randomUUID(), name,
  retryOnFail: true, maxTries: 5, waitBetweenTries: 5000, credentials: SHEETS_CRED, ...extra,
});

// ---------- Prompts ----------

const TITLE_SYSTEM = `You are the headline editor of Market Beacon Report, a free email and web publication with short, plain-English briefings on stocks, mining and minerals, and technology across the United States, Canada and Germany. Readers are self-directed investors who make their own decisions.

Write one headline for an article about the keyword/topic the user gives you.

Rules:
- Sentence case (capitalise only the first word and proper nouns).
- 45 to 75 characters.
- Put the main keyword or its natural wording near the beginning.
- Calm, specific and factual. It should read like a business news headline, not a marketing line.
- No clickbait, no hype words (soaring, skyrocketing, explosive, shocking, must-buy, insane).
- No price predictions, no promises of returns, no "best stocks to buy".
- No quotation marks, no emojis, no colon-heavy SEO formats, no all caps.
- Never use the em dash character (—).
- Return only the headline and nothing else.`;

const TITLE_TEXT = `=Desk: {{ $('Get Keyword').item.json.Desk || 'The Weekly Beacon' }}
Keyword/topic: {{ $json.Keyword }}

Write the headline.`;

const ARTICLE_SYSTEM = `You are a senior writer at Market Beacon Report. The publication sends short, plain-English briefings on stocks, mining and minerals, and technology to self-directed investors in the United States, Canada and Germany. Its promise: less hype, more insight. No stock tips, no pressure to invest, just information worth the reader's time.

You write one complete article from a headline, a keyword and a desk. You have no access to live data or news, so you write evergreen explainers and analysis, not breaking news.

ACCURACY RULES (most important)
- Do not invent facts. Never make up prices, percentages, company results, dates, deals, quotes, people, reports or statistics.
- Only use figures and facts that are long-established and widely known (for example, what a metal is used for, how an index or a royalty works). If you are not certain, describe it in general terms instead.
- Do not quote anyone. Do not attribute claims to named analysts, firms or publications.
- Do not describe recent events as if you know they happened. Avoid "this week", "yesterday", "recently announced".
- Never give personal financial advice. Do not tell readers to buy, sell or hold anything, and do not predict prices. You can explain what investors usually watch, the risks, and the questions worth asking.

HOUSE STYLE
- Plain English, short paragraphs (2 to 4 sentences), active voice, confident and calm.
- British spelling (centre, programme, licence, analyse). Write money as US$, C$ or € before the number.
- Explain any jargon the first time it appears, in a few words.
- Specific and concrete. Use real-world examples of how things work, not vague generalities.
- Use bold only for the lead-in words of list items.

STRUCTURE (markdown)
- No H1 title.
- Open with one or two short paragraphs that say plainly what the article is about and why it matters to an investor. No throat-clearing.
- Then 4 to 6 sections, each starting with a "## " heading written as a short plain phrase (for example: ## Why it matters, ## How the economics work, ## The risks). Each section has at least two paragraphs or one paragraph and a short list.
- Use at most two bullet lists in the whole article, each 3 to 5 items, each item starting with a short bold lead-in followed by a full sentence.
- Somewhere in the middle of the article, include exactly one highlighted takeaway as a single markdown quote line in this exact form:
  > **The takeaway:** one or two sentences that sum up the key point.
- The last section must be "## What we're watching", with 3 to 4 bullet points on the signals, data releases or developments investors can follow on this topic (described generally, without inventing dates).
- Do not add a conclusion section, a disclaimer, a sources list, FAQs, tables, images or links. The website adds the disclaimer and the sign-up boxes itself.

LENGTH
- 700 to 1,100 words.

BANNED
- The em dash character (—). Use commas, full stops or brackets instead.
- Phrases: in today's world, in today's fast-paced, game-changer, delve, dive in, unlock, landscape, navigate the, it's important to note, in conclusion, buckle up, to the moon, not financial advice.

Before answering, check silently: no invented numbers, names, quotes or events; no advice to buy or sell; one "> **The takeaway:**" line; last section is "## What we're watching"; no em dashes; no H1.

Return only the article in markdown.`;

const ARTICLE_TEXT = `=Headline: {{ $('Create Title').item.json.output }}
Keyword: {{ $('Get Keyword').item.json.Keyword }}
Desk: {{ $('Get Keyword').item.json.Desk || 'The Weekly Beacon' }}

Write the full article now.`;

const IMAGE_SYSTEM = `You are the photo editor of Market Beacon Report, a business publication about stocks, mining and minerals, and technology.

From an article headline, write one image generation prompt for the article's lead photo.

The photo must:
- Show the real, literal subject of the article in an editorial news-photography style, like a picture in a serious financial newspaper. Examples: an open-pit mine or ore samples for a mining story, a semiconductor wafer or data centre aisle for a chip story, a port with containers for a trade story, a stock exchange building exterior or trading screens with abstract charts for a markets story.
- Be photorealistic, sharp and natural, with soft directional daylight and a calm, sober colour palette (deep blues, greys, earth tones).
- Have a clean composition with one clear focal point, wide horizontal 16:9 framing.

The photo must not:
- Contain any text, words, letters, numbers, tickers, logos, brand names or flags with text.
- Show identifiable real people, celebrities, executives or politicians, or any real company's branding or products.
- Use metaphors or clichés: no bulls and bears, no rockets, no piles of cash or coins, no handshakes, no floating holograms, no glowing arrows.

Return only the prompt, as one detailed paragraph in English, with no explanation. Always end it with exactly:
No text, no words, no letters, no numbers, no logos, no watermarks, photorealistic editorial photograph, high resolution, 16:9.`;

const IMAGE_TEXT = `=Article headline: {{ $('Create Title').item.json.output }}
Desk: {{ $('Get Keyword').item.json.Desk || 'The Weekly Beacon' }}

Write the image prompt.`;

// ---------- Code nodes ----------

const SLUG_JS = `const title = String($input.first().json.output || '').trim();

const slug = title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\\u0300-\\u036f]/g, '')
  .replace(/[^a-z0-9\\s-]/g, '')
  .trim()
  .replace(/[\\s-]+/g, '-')
  .slice(0, 80)
  .replace(/-+$/g, '');

return { json: { ...$json, slug } };`;

const PREVIEW_JS = `// Preview text (the dek under the headline): the article's opening, cut at a sentence end.
const body = String($json.output || '').trim();
const firstPara = body.split(/\\n\\s*\\n/).map((p) => p.trim()).find((p) => p && !/^[#>\\-*]/.test(p)) || '';
const plain = firstPara.replace(/\\*\\*|__|\\*|_|\`/g, '').replace(/\\[([^\\]]+)\\]\\([^)]*\\)/g, '$1').replace(/\\s+/g, ' ').trim();
const sentences = plain.match(/[^.!?]+[.!?]+/g) || [plain];
let preview = '';
for (const s of sentences) {
  if ((preview + s).length > 220 && preview) break;
  preview += s;
}
preview = preview.replace(/\\s*—\\s*/g, ', ').trim();
if (preview.length > 240) preview = preview.slice(0, 237).replace(/\\s+\\S*$/, '') + '...';

return { json: { ...$json, preview } };`;

const NORMALIZE_JS = `// Builds the post file in the format Sveltia CMS and the site read (content/posts/*.md).
const DRAFT = false; // true = save as a draft to review in /admin before it goes live

const title = String($('Create Title').first().json.output || '').replace(/[\\r\\n]+/g, ' ').replace(/^["']|["']$/g, '').trim();
const slug = $('Create slug').first().json.slug;
const preview = $('Create preview').first().json.preview || '';
const keyword = $('Get Keyword').first().json.Keyword || '';
const deskRaw = String($('Get Keyword').first().json.Desk || '').toLowerCase();
const imagePath = $('Create image path').first().json.imagePath;

// Desk column can say "Stocks", "mining", "Mining and Minerals", "Technology", "tech", "Weekly"...
const desk = /stock/.test(deskRaw) ? 'stocks' : /min/.test(deskRaw) ? 'mining' : /tech/.test(deskRaw) ? 'tech' : 'weekly';

let body = String($('Create the Article').first().json.output || '').trim();
body = body
  .replace(/^\\s*#\\s+.*\\n+/, '')                // drop an H1 if the model added one
  .replace(/\\n#{1,2}\\s*(sources|references|disclaimer)\\b[\\s\\S]*$/i, '') // no sources/disclaimer sections
  .replace(/\\s*—\\s*/g, ', ')                    // no em dashes
  .trim();

const q = (v) => JSON.stringify(String(v || '').replace(/[\\r\\n]+/g, ' ').trim());
const now = new Date();
const date = now.toISOString().replace(/\\.\\d{3}Z$/, 'Z');
const day = date.slice(0, 10);

const markdown = [
  '---',
  'title: ' + q(title),
  'slug: ' + slug,
  'date: ' + date,
  'draft: ' + DRAFT,
  'desk: ' + desk,
  'preview: ' + q(preview),
  'photo:',
  '  image: /' + imagePath.replace(/^public\\//, ''),
  '  alt: ' + q('Illustration for the article: ' + title),
  '  caption: ' + q('AI-generated illustration.'),
  '---',
  '',
  body,
  '',
].join('\\n');

return [{ json: { slug, title, keyword, desk, postPath: 'content/posts/' + day + '-' + slug + '.md', markdown } }];`;

const IMAGE_PATH_JS = `const slug = $('Create slug').first().json.slug;
const imagePath = 'public/images/posts/' + slug + '-' + $execution.id + '.jpg';
return $input.all().map((item) => ({ json: { ...item.json, imagePath }, binary: item.binary }));`;

// ---------- Nodes ----------

const nodes = [
  {
    parameters: { rule: { interval: [{ triggerAtHour: 10 }] } },
    type: "n8n-nodes-base.scheduleTrigger", typeVersion: 1.2, position: [-240, -528], id: crypto.randomUUID(), name: "Schedule Trigger",
  },
  {
    parameters: { documentId: SHEET_DOC, sheetName: SHEET_TAB, filtersUI: { values: [{ lookupColumn: "Used", lookupValue: "No" }] }, options: { returnFirstMatch: true } },
    type: "n8n-nodes-base.googleSheets", typeVersion: 4.7, position: [-32, -528], id: crypto.randomUUID(), name: "Get Keyword",
    retryOnFail: true, maxTries: 5, waitBetweenTries: 5000, credentials: SHEETS_CRED,
  },
  sheetUpdate("Mark keyword as Used", 176, { Keyword: "={{ $json.Keyword }}", Used: "Yes" }),
  agent("Create Title", 400, TITLE_TEXT, TITLE_SYSTEM),
  model("OpenAI Chat Model", 400, -288),
  code("Create slug", 752, SLUG_JS),
  sheetUpdate("Save Title", 976, { Keyword: "={{ $('Get Keyword').item.json.Keyword }}", Title: "={{ $('Create Title').item.json.output }}" }, { onError: "continueRegularOutput" }),
  agent("Create the Article", 1184, ARTICLE_TEXT, ARTICLE_SYSTEM),
  model("OpenAI Chat Model1", 1184, -304),
  code("Create preview", 1536, PREVIEW_JS),
  agent("Create Prompt for Image", 1760, IMAGE_TEXT, IMAGE_SYSTEM),
  model("OpenAI Chat Model2", 1760, -304),
  {
    parameters: {
      method: "POST", url: "https://api.openai.com/v1/images/generations",
      authentication: "predefinedCredentialType", nodeCredentialType: "openAiApi",
      sendBody: true, specifyBody: "json",
      jsonBody: `={{ JSON.stringify({ model: 'gpt-image-2', prompt: $json.output + "\\n\\nGenerate this image now. Follow the description exactly. Wide horizontal format, photorealistic editorial photograph, high resolution, absolutely no text, words, letters, numbers or logos.", size: '1536x1024', output_format: 'jpeg', output_compression: 85, n: 1 }) }}`,
      options: { timeout: 180000 },
    },
    type: "n8n-nodes-base.httpRequest", typeVersion: 4.2, position: [2112, -528], id: crypto.randomUUID(), name: "Generate an image",
    retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, credentials: OPENAI_CRED,
  },
  {
    parameters: { operation: "toBinary", sourceProperty: "data[0].b64_json", options: { fileName: "image.jpg", mimeType: "image/jpeg" } },
    type: "n8n-nodes-base.convertToFile", typeVersion: 1.1, position: [2352, -528], id: crypto.randomUUID(), name: "Image to File",
  },
  code("Create image path", 2464, IMAGE_PATH_JS),
  {
    parameters: {
      resource: "file", owner: OWNER, repository: REPO,
      filePath: "={{ $json.imagePath }}", binaryData: true,
      commitMessage: "=Image for: {{ $('Create Title').item.json.output }}",
    },
    type: "n8n-nodes-base.github", typeVersion: 1.1, position: [2576, -528], id: crypto.randomUUID(), name: "Upload image",
    retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, credentials: GITHUB_CRED,
  },
  code("Normalize", 2768, NORMALIZE_JS),
  {
    parameters: {
      resource: "file", owner: OWNER, repository: REPO,
      filePath: "={{ $json.postPath }}", fileContent: "={{ $json.markdown }}",
      commitMessage: "=New post: {{ $json.title }}",
    },
    type: "n8n-nodes-base.github", typeVersion: 1.1, position: [2944, -528], id: crypto.randomUUID(), name: "Create post file",
    retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, credentials: GITHUB_CRED,
  },
];

const chain = ["Schedule Trigger", "Get Keyword", "Mark keyword as Used", "Create Title", "Create slug", "Save Title", "Create the Article", "Create preview", "Create Prompt for Image", "Generate an image", "Image to File", "Create image path", "Upload image", "Normalize", "Create post file"];
const connections = {};
chain.slice(0, -1).forEach((n, i) => { connections[n] = { main: [[{ node: chain[i + 1], type: "main", index: 0 }]] }; });
for (const [m, a] of [["OpenAI Chat Model", "Create Title"], ["OpenAI Chat Model1", "Create the Article"], ["OpenAI Chat Model2", "Create Prompt for Image"]]) {
  connections[m] = { ai_languageModel: [[{ node: a, type: "ai_languageModel", index: 0 }]] };
}

const workflow = { name: "Market Beacon Report autoblog", nodes, connections, pinData: {}, settings: { executionOrder: "v1" }, meta: { templateCredsSetupCompleted: false } };
fs.writeFileSync(process.argv[2], JSON.stringify(workflow, null, 2) + "\n");
console.log("wrote", process.argv[2], nodes.length, "nodes");
