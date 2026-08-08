(function(){
"use strict";

/* Read once, used everywhere motion/sound gets triggered — window
   animations, the screensaver, the BSOD gag, system sounds. */
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   PIXEL ICONS (8x8 grids, rendered as inline SVG rects)
   ============================================================ */
var ICONS = {
  doc: { rows:[
    ".WWWWW..",
    ".WWWWWD.",
    ".WBBBWD.",
    ".WWWWWD.",
    ".WBBBWD.",
    ".WWWWWD.",
    ".WBBWWD.",
    ".DDDDDD." ], pal:{W:"#ffffff",B:"#1084d0",D:"#5a5a5a"} },
  folder: { rows:[
    "........",
    ".YYY....",
    "YYYYYYY.",
    "YDDDDDY.",
    "YDDDDDY.",
    "YDDDDDY.",
    "YDDDDDY.",
    ".DDDDDD." ], pal:{Y:"#ffd23f",D:"#c98f00"} },
  book: { rows:[
    ".RRRRRR.",
    "RWWWWWWR",
    "RWBWBWWR",
    "RWWWWWWR",
    "RWBWBWWR",
    "RWWWWWWR",
    "RWWWWWWR",
    ".RRRRRR." ], pal:{R:"#b5121b",W:"#ffffff",B:"#1084d0"} },
  gear: { rows:[
    "..N..N..",
    ".NNNNNN.",
    "NNN..NNN",
    "NN.GG.NN",
    "NN.GG.NN",
    "NNN..NNN",
    ".NNNNNN.",
    "..N..N.." ], pal:{N:"#2e9e3f",G:"#c0c0c0"} },
  mail: { rows:[
    ".BBBBBB.",
    "BWWWWWWB",
    "BW####WB",
    "BW#WW#WB",
    "BWWWWWWB",
    "BWWWWWWB",
    "BWWWWWWB",
    ".BBBBBB." ], pal:{B:"#000080",W:"#ffffff","#":"#1084d0"} },
  bin: { rows:[
    "..GGGG..",
    ".GGGGGG.",
    "..GGGG..",
    ".DGGGGD.",
    ".DGDGDD.",
    ".DGDGDD.",
    ".DGDGDD.",
    "..DDDD.." ], pal:{G:"#d8d8d8",D:"#7f7f7f"} },
  computer: { rows:[
    ".DDDDDD.",
    "DBBBBBBD",
    "DBBBBBBD",
    "DBBBBBBD",
    ".DDDDDD.",
    "...GG...",
    "..GGGG..",
    ".GGGGGG." ], pal:{D:"#5a5a5a",B:"#1084d0",G:"#c0c0c0"} },
  bomb: { rows:[
    "...R....",
    "..RYR...",
    ".#####..",
    "#######.",
    "#######.",
    "#######.",
    ".#####..",
    "..###..." ], pal:{R:"#b5121b","#":"#101010",Y:"#ffd23f"} },
  power: { rows:[
    "..####..",
    ".#WWWW#.",
    "#WW##WW#",
    "#W####W#",
    "#W####W#",
    "#WW##WW#",
    ".#WWWW#.",
    "..####.." ], pal:{"#":"#404040",W:"#ff5c39"} },
  chart: { rows:[
    "........",
    ".......G",
    "......GG",
    "....G.GG",
    "....G.GG",
    "..G.G.GG",
    "..G.G.GG",
    "GGGGGGGG" ], pal:{G:"#2e9e3f"} },
  flag: { rows:[
    "BWBWBW..",
    "WBWBWB..",
    "BWBWBW..",
    "WBWBWB..",
    "P.......",
    "P.......",
    "P.......",
    "P......." ], pal:{B:"#101010",W:"#ffffff",P:"#8a5a2b"} },
  person: { rows:[
    "..####..",
    ".#OOOO#.",
    ".#OOOO#.",
    ".#OOOO#.",
    "..####..",
    ".GGGGGG.",
    "GGGGGGGG",
    "GGGGGGGG" ], pal:{"#":"#1a1a1a",O:"#e8b382",G:"#f5a623"} },
  bsod: { rows:[
    "########",
    "#WWWWWW#",
    "#W.WW.W#",
    "#WWWWWW#",
    "#W.WW.W#",
    "#WWWWWW#",
    "#WWWWWW#",
    "########" ], pal:{"#":"#1a1a1a",W:"#1084d0"} },
  megaphone: { rows:[
    "....###.",
    "...####.",
    "..#####.",
    "M#######",
    "M#######",
    "..#####.",
    "...####.",
    "....###." ], pal:{"#":"#c0399f",M:"#404040"} },
  trophy: { rows:[
    ".DDDDDD.",
    "DGGGGGGD",
    "DGGGGGGD",
    ".DGGGGD.",
    "..DGGD..",
    "..DGGD..",
    ".DDDDDD.",
    "DDDDDDDD" ], pal:{D:"#8a6a10",G:"#ffd23f"} },
  star: { rows:[
    "...GG...",
    "...GG...",
    ".GGGGGG.",
    "GGGGGGGG",
    ".GGGGGG.",
    "..GGGG..",
    ".GG..GG.",
    "G......G" ], pal:{G:"#ffd23f"} },
  clip: { rows:[
    "..BBBB..",
    ".B....B.",
    ".B.BB.B.",
    ".B.BB.B.",
    ".B.BB.B.",
    ".B.B..B.",
    ".B.BBBB.",
    ".B......" ], pal:{B:"#4a6ea9"} },
  note: { rows:[
    "....NN..",
    "....N.N.",
    "....N..N",
    "....N...",
    "....N...",
    ".NNNN...",
    "NNNNN...",
    ".NNN...." ], pal:{N:"#7b2fbe"} },
  article: { rows:[
    "########",
    "#WWWWWW#",
    "#WWWWWW#",
    "########",
    "#W####W#",
    "#W####W#",
    "#W####W#",
    "########" ], pal:{"#":"#1a1a1a",W:"#ffffff"} },
  /* generic "opens elsewhere" diagonal arrow, used for quick links that
     leave the site (not any specific service's logo) */
  link: { rows:[
    ".....###",
    ".....##.",
    ".....#..",
    "....#...",
    "...#....",
    "..#.....",
    ".#......",
    "#......." ], pal:{"#":"#1a1a1a"} }
};

function pixelSVG(id, cell){
  cell = cell || 4;
  var def = ICONS[id];
  if(!def) return "";
  var rows = def.rows, pal = def.pal;
  var w = rows[0].length, h = rows.length;
  var out = '<svg viewBox="0 0 '+w+' '+h+'" width="'+(w*cell)+'" height="'+(h*cell)+'" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">';
  for(var y=0;y<h;y++){
    var row = rows[y];
    for(var x=0;x<w;x++){
      var ch = row[x];
      if(ch === "." ) continue;
      var color = pal[ch] || "#000";
      out += '<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+color+'"/>';
    }
  }
  out += "</svg>";
  return out;
}

function renderIcons(root){
  var slots = (root || document).querySelectorAll("[data-icon]");
  slots.forEach(function(el){
    var id = el.getAttribute("data-icon");
    el.innerHTML = pixelSVG(id, 4);
  });
}

/* ============================================================
   CONTENT DATA
   ============================================================ */
/* RESUME_TEXT is generated below, after EXPERIENCE, so the Notepad
   r\u00e9sum\u00e9, the plain-text view, and the print/PDF output all read from
   the same dataset as the Experience.exe explorer instead of a
   hand-duplicated copy that quietly drifts out of sync with it. */

var EXPERIENCE = [
  { icon:"trophy", role:"General Manager, Program Management & Partnerships", org:"IDSA + Design, GW", date:"Aug 2026-Present",
    fileType:"Leadership Role", size:"Ongoing",
    bullets:[
      "Leading partnership strategy and deal sourcing with top design-industry players.",
      "Building and launching new venture programs for the org from the ground up."
    ]},
  { icon:"gear", role:"Special Projects Intern", org:"StateCraft Labs", date:"Fall 2026",
    url:"https://statecraft.ai/", fileType:"Internship", size:"1 sem",
    bullets:[
      "Building evaluation suites to stress-test AI agents executing real government workflows, working directly with the CTO and CEO.",
      "Mining federal contract award and procurement data to inform agent development priorities, the same terrain TradeSimple runs on.",
      "Applied AI research at the intersection of agent reliability and public-sector operations."
    ]},
  { icon:"chart", role:"Founder & Developer", org:"TradeSimple", date:"2026-Present",
    url:"https://tradesimpledev-production.up.railway.app/", fileType:"Founder-Track", size:"Ongoing",
    bullets:[
      "Built and shipped an independent research system that joins federal contract awards (USASpending), Senate LDA lobbying filings, FEC data, and Congress.gov legislative activity to public equities. Built full stack (Node.js, PostgreSQL, Supabase, third-party data APIs) and deployed on Railway.",
      "Designed and backtested a policy-catalyst scoring model (CRS) against historical federal award data; validated CRS v2 on defense-IT contractors (Spearman \u03c1 = 0.40, p = 0.0006), and identified where the model fails to generalize (detention-sector names).",
      "Shipped a hash-chained prediction ledger with a public track-record page for auditability, plus a dev preview gate; identified and remediated a critical authentication vulnerability.",
      "Applied the same modeling approach to a real election while field organizing on a NY Assembly primary campaign, building a Monte Carlo model to forecast the race."
    ]},
  { icon:"flag", role:"Founder", org:"Pitstop", date:"2026-Present",
    url:"https://pitstop.community/", fileType:"Founder-Track", size:"Ongoing",
    bullets:[
      "Built and launched a route-aware urban amenity app (NYC beta), hosted on Vercel, from idea to public launch solo.",
      "Ran go-to-market across LinkedIn, X, Reddit, and Instagram; drove 229 visitors / 480 page views in the first launch week.",
      "Testing a model where local businesses list for free and Pitstop's pitch to them is increased foot traffic."
    ]},
  { icon:"megaphone", role:"Campaign Fellow", org:"Wei-Li Tjong for NY State Assembly (AD-65)", date:"May-June 2026",
    fileType:"Campaign Role", size:"2 mo",
    bullets:[
      "Knocked 400+ doors and ran 500+ literature drops in a competitive six-way Democratic primary.",
      "Built a verified 27-location senior-center list and ran Chinese-language outreach to the district's Asian electorate, a voter bloc central to the campaign's path to victory.",
      "Tracked and reported real-time turnout at polling sites to campaign leadership on election day."
    ]},
  { icon:"megaphone", role:"Digital Advocacy Lead", org:"Students for Mental Health Action", date:"Dec 2025-Present",
    fileType:"Advocacy Role", size:"Ongoing",
    bullets:[
      "Lead communications for a bipartisan national student coalition lobbying Congress on federal mental health legislation.",
      "Met with staff for three members of Congress, including Senator Cory Booker and Senator Jon Ossoff, to advocate for three mental health bills."
    ]},
  { icon:"book", role:"Research Fellow", org:"China Affairs Forum, GWU", date:"2025-Present",
    fileType:"Research Role", size:"Ongoing",
    bullets:[
      "Research and write on Indo-Pacific trade dynamics, economic statecraft, and cross-Strait signaling.",
      "Synthesized 50+ scholarly and primary government sources into a four-case comparative analysis, under review at the GW Collegiate Journal of Chinese Affairs."
    ]},
  { icon:"doc", role:"Policy & Research Intern", org:"New York League of Conservation Voters", date:"May-Aug 2025",
    fileType:"Internship", size:"4 mo",
    bullets:[
      "Analyzed environmental compliance data across 1,000+ NYC public schools to support a public-facing advocacy tool on lead contamination in school water systems."
    ]},
  { icon:"folder", role:"Senior National Operations Associate", org:"Dream for America", date:"Aug 2024-Apr 2026",
    fileType:"Operations Role", size:"20 mo",
    bullets:[
      "Ran sponsorship and speaker-pitch operations behind $10K+ in fundraising for DFA's national youth organizing work.",
      "Directed $50K+ in ActBlue grassroots funding to progressive campus initiatives nationwide.",
      "Co-led a youth fundraiser at the 2024 DNC that landed Politico coverage, and was featured in Deutsche Welle's documentary on youth political organizing to an audience of 75,000+."
    ]},
  { icon:"folder", role:"Legislative Policy Advocate", org:"New Jersey Senate Education Committee", date:"2024-2026",
    fileType:"Advocacy Role", size:"2 yr",
    bullets:[
      "Delivered formal testimony across two sessions (S3497, S3462) on a statewide financial literacy requirement affecting 1M+ students.",
      "Both bills advanced out of committee."
    ]}
];

/* word-wraps a run of prose to `width` columns, for the monospace
   Notepad résumé — used only there; the HTML views wrap themselves. */
function wrapPlainText(text, width){
  var words = text.split(" ");
  var lines = [], cur = "";
  words.forEach(function(w){
    var candidate = cur ? cur + " " + w : w;
    if(candidate.length > width){ lines.push(cur); cur = w; }
    else cur = candidate;
  });
  if(cur) lines.push(cur);
  return lines;
}

function buildResumeText(){
  var DIV = "================================================================";
  var out = [];
  out.push("JOSHUA METTERS");
  out.push("Washington, DC | Livingston, NJ");
  out.push("joshua.metters@gwu.edu | linkedin.com/in/joshua-metters-8b0042225");
  out.push("");
  out.push("Builder and policy researcher — shipping data systems that connect");
  out.push("federal policy signals to real-world outcomes.");
  out.push("");
  out.push(DIV); out.push("EXPERIENCE"); out.push(DIV);
  EXPERIENCE.forEach(function(job, idx){
    out.push(job.role + " | " + job.org + " | " + job.date);
    if(job.url) out.push("  " + job.url.replace(/^https?:\/\//, "").replace(/\/$/, ""));
    job.bullets.forEach(function(b){
      wrapPlainText(b, 74).forEach(function(line, li){
        out.push((li === 0 ? "  - " : "    ") + line);
      });
    });
    if(idx < EXPERIENCE.length - 1) out.push("");
  });
  out.push("");
  out.push(DIV); out.push("SKILLS"); out.push(DIV);
  out.push("Technical:      Node.js and PostgreSQL/Supabase in production");
  out.push("                (TradeSimple); SQL for backtesting and data");
  out.push("                pipelines; built on USASpending, Congress.gov, FEC,");
  out.push("                and Senate LDA APIs; daily in Claude Code and Cursor.");
  out.push("Domain:         Federal legislative and regulatory tracking,");
  out.push("                lobbying disclosure analysis, and USASpending");
  out.push("                contract data via TradeSimple; policy memo drafting");
  out.push("                from NJ Senate testimony and NYLCV research.");
  out.push("Languages:      Mandarin Chinese — heritage speaker, advanced");
  out.push("                coursework.");
  out.push("Certifications: Building with the Claude API; Claude Code in Action");
  out.push("                (Anthropic, 2026)");
  out.push("");
  out.push(DIV); out.push("EDUCATION"); out.push(DIV);
  out.push("The George Washington University — Elliott School of International");
  out.push("Affairs | Expected 2029");
  out.push("B.A., International Affairs, Concentrations in International");
  out.push("Political Economy and East Asia");
  out.push("Relevant coursework: Quantitative Methods in International Affairs ·");
  out.push("International Political Economy · Introduction to International");
  out.push("Politics · Korea-Japan Relations (graduate seminar)");
  return out.join("\n") + "\n";
}

var RESUME_TEXT = buildResumeText();

var PROJECTS = [
  { icon:"chart", name:"TradeSimple", tagline:"A political-intelligence terminal.", url:"https://tradesimpledev-production.up.railway.app/", urlLabel:"Visit Site",
    brand:{ bg:"#0a0f0d", fg:"#8ee6c8", mark:"TS" },
    stat:{ label:"Validated", value:"Spearman ρ = 0.40, p = 0.0006 on defense-IT contractors" },
    readme:
"TRADESIMPLE\n" +
"============================================================\n" +
"A political-intelligence terminal. Joins federal contract\n" +
"awards, lobbying filings, campaign finance data, and\n" +
"legislation to public equities, so a catalyst shows up as\n" +
"a signal instead of a headline.\n" +
"\n" +
"Live: tradesimpledev-production.up.railway.app\n" +
"Status: two-person team, actively shipping\n" +
"\n" +
"WHAT IT DOES\n" +
"  - Pulls USASpending contract awards, Senate LDA lobbying\n" +
"    filings, FEC data, and Congress.gov activity into one\n" +
"    joined dataset\n" +
"  - Scores catalysts with CRS, a policy-catalyst model\n" +
"    backtested against historical federal award data\n" +
"  - Publishes every prediction to a hash-chained ledger with\n" +
"    a public track record, so the model can't quietly revise\n" +
"    its own history\n" +
"\n" +
"WHAT I VALIDATED\n" +
"  - CRS v2 holds on defense-IT contractors (Spearman rho =\n" +
"    0.40, p = 0.0006)\n" +
"  - It does not generalize to detention-sector names, and I\n" +
"    kept that in the writeup instead of burying it\n" +
"\n" +
"WHAT'S NEXT\n" +
"  - Natural-language search layer over the joined dataset\n" +
"  - Congressional voting patterns as an additional signal\n" +
"\n" +
"[Properties]\n" +
"  Type:      Full-stack web app\n" +
"  Stack:     Node.js, PostgreSQL, Supabase, Railway\n" +
"  Started:   2026\n" +
"  Role:      Founder & Developer" },
  { icon:"flag", name:"Pitstop", tagline:"A route-aware urban amenity app.", url:"https://pitstop.community/", urlLabel:"Visit Site",
    brand:{ bg:"#f2ede0", fg:"#5b6b47", mark:"P" },
    stat:null,
    readme:
"PITSTOP\n" +
"============================================================\n" +
"A route-aware urban amenity app. Tell it where you're\n" +
"headed and it surfaces the stops worth a detour along the\n" +
"way, not just what's nearby.\n" +
"\n" +
"Live: pitstop.community\n" +
"Status: NYC beta\n" +
"\n" +
"LAUNCH\n" +
"  - Went from idea to public launch solo\n" +
"  - Ran go-to-market across LinkedIn, X, Reddit, and\n" +
"    Instagram\n" +
"  - 229 visitors / 480 page views in the first launch week\n" +
"\n" +
"WHAT I LEARNED\n" +
"  - Reddit's response to the launch post was rough, and it\n" +
"    forced a repositioning of how the app was pitched\n" +
"  - Testing a model where local businesses list for free,\n" +
"    and the pitch to them is increased foot traffic rather\n" +
"    than a subscription fee\n" +
"\n" +
"[Properties]\n" +
"  Type:      Consumer mobile-first web app\n" +
"  Stack:     Vercel\n" +
"  Started:   2026\n" +
"  Role:      Founder" }
];

var ABOUT_TEXT =
"Not a resume. Just the desktop.\n" +
"\n" +
"I build things I actually want to exist, then find out if\n" +
"anyone else wants them too. TradeSimple started because the\n" +
"data that actually moves markets is expensive, scattered\n" +
"across a dozen federal portals, and never explained in a way\n" +
"that tells you why it matters. Pitstop started because I kept\n" +
"taking the same three exits on a familiar drive and wondered\n" +
"what I was missing on the other four hundred.\n" +
"\n" +
"I spent a lot of last year in rooms where the whole point was\n" +
"being right: testifying, organizing, arguing a bill across\n" +
"the finish line. Building is a different game. Nobody's\n" +
"grading it, and the thing either works or it doesn't. I like\n" +
"that more than I expected to.\n" +
"\n" +
"Elliott School by day, mostly for the excuse to keep reading\n" +
"about how policy actually moves money instead of just\n" +
"sounding like it does. Heritage speaker of Mandarin, which\n" +
"does more work in the East Asia coursework than I expected,\n" +
"and more work in how I think about a place I'm from but\n" +
"wasn't raised in than I usually say out loud.\n" +
"\n" +
"I ran Monte Carlo simulations for CRS and for an actual\n" +
"Assembly primary the same spring, a week apart. Same math,\n" +
"same feeling of watching a number try to guess something\n" +
"that hasn't happened yet. Uncertainty doesn't care which one\n" +
"you're pointing it at.\n" +
"\n" +
"Off the clock: thrifted workwear over anything new, a running\n" +
"list of Wong Kar-wai film stills I keep going back to for\n" +
"reasons I can't fully explain, and a rule I try to hold to:\n" +
"nothing that looks like a surveillance tool with a nicer\n" +
"logo.\n" +
"\n" +
"This site is a Windows 95 desktop because portfolios that\n" +
"take themselves too seriously are boring to build and boring\n" +
"to look at. Drag a window around. Lose to Minesweeper. Then\n" +
"go read the resume if that's what you came here for.";

var SKILLS_INI_HTML =
'<span class="ini-comment">; skills.ini \u2014 evidence, not adjectives. every line names</span>\n' +
'<span class="ini-comment">; where it actually got used.</span>\n\n' +
'<span class="ini-section">[TECHNICAL]</span>\n' +
'<span class="ini-key">NodeJS</span>=<span class="ini-val">TradeSimple,ProductionUse</span>\n' +
'<span class="ini-key">PostgreSQL_Supabase</span>=<span class="ini-val">TradeSimple,ProductionUse</span>\n' +
'<span class="ini-key">SQL</span>=<span class="ini-val">Backtesting,DataPipelines</span>\n' +
'<span class="ini-key">ThirdPartyDataAPIs</span>=<span class="ini-val">USASpending,CongressGov,FEC,SenateLDA</span>\n' +
'<span class="ini-key">ClaudeCode</span>=<span class="ini-val">DailyDriver</span>\n' +
'<span class="ini-key">Cursor</span>=<span class="ini-val">DailyDriver</span>\n\n' +
'<span class="ini-section">[DOMAIN]</span>\n' +
'<span class="ini-key">FederalLegislativeTracking</span>=<span class="ini-val">TradeSimple,CongressGovIntegration</span>\n' +
'<span class="ini-key">LobbyingDisclosureAnalysis</span>=<span class="ini-val">TradeSimple,SenateLDAPipeline</span>\n' +
'<span class="ini-key">GovContractData_USASpending</span>=<span class="ini-val">TradeSimple,CRSModel</span>\n' +
'<span class="ini-key">PolicyMemoDrafting</span>=<span class="ini-val">NJSenateTestimony,NYLCVResearch</span>\n\n' +
'<span class="ini-section">[LANGUAGES]</span>\n' +
'<span class="ini-key">English</span>=<span class="ini-val">Native</span>\n' +
'<span class="ini-key">Mandarin</span>=<span class="ini-val">HeritageSpeaker,AdvancedCoursework</span>\n\n' +
'<span class="ini-section">[CERTIFICATIONS]</span>\n' +
'<span class="ini-key">BuildingWithTheClaudeAPI</span>=<span class="ini-val">Anthropic2026</span>\n' +
'<span class="ini-key">ClaudeCodeInAction</span>=<span class="ini-val">Anthropic2026</span>\n\n' +
'<span class="ini-section">[ACTIVITIES]</span>\n' +
'<span class="ini-key">GeorgetownPolicyDebate</span>=<span class="ini-val">Novice,2024-Present</span>\n' +
'<span class="ini-key">TheGlobeAssociateEditor</span>=<span class="ini-val">ElliottSchoolResearchJournal,2025-Present</span>\n';

var DRIVES = [
  { label:"(C:) Product & Data Engineering (TradeSimple, Pitstop)", pct:85, color:"#2e9e3f" },
  { label:"(D:) Policy & Legislative Research",                     pct:78, color:"#1084d0" },
  { label:"(A:) Mandarin (heritage speaker)",                       pct:95, color:"#b5121b" }
];

var PROGRAMS_LIST_TEXT =
"National History Bowl Champion                14.2 MB   2025\n" +
"International History Olympiad Qualifier      12.8 MB   2025\n" +
"National US History Bee Qualifier (x2)        11.1 MB   2024-2025\n" +
"National Political Science Bee Qualifier       9.4 MB   2025\n" +
"NJ Governor's Letter of Recognition            8.7 MB   2024\n" +
"Congressional Certificate, Rep. Mikie Sherrill 7.9 MB   2024\n" +
"AWS Micro-Hackathon, 3rd Place                 6.2 MB   2026";

/* PLACEHOLDER — swap these for Joshua's actual three History Bowl-style
   questions before this ships. Written as obvious stand-ins on purpose
   rather than invented trivia, since getting a real fact wrong here
   would be worse than an empty state. */
var QUIZ = [
  { q:"Placeholder question 1 — replace with a real one.",
    options:["Placeholder answer A", "Placeholder answer B (correct)", "Placeholder answer C"],
    correct:1 },
  { q:"Placeholder question 2 — replace with a real one.",
    options:["Placeholder answer A (correct)", "Placeholder answer B", "Placeholder answer C"],
    correct:0 },
  { q:"Placeholder question 3 — replace with a real one.",
    options:["Placeholder answer A", "Placeholder answer B", "Placeholder answer C (correct)"],
    correct:2 }
];

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
var bootLines = [
  "JOSHUA-OS (tm) BIOS v1.98",
  "Copyright (C) Joshua Metters. All rights reserved.",
  "",
  "CPU: Elliott School Policy Engine  ....................  OK",
  "MEM: 640 KB (Mandarin, EN) — ought to be enough  ........  OK",
  "",
  "Detecting drives...",
  "  C:\\ POLICY_RESEARCH ..................  1024 MB  OK",
  "  D:\\ APPLIED_SKILLS   ..................   768 MB  OK",
  "  A:\\ MANDARIN.SYS     ..................   512 MB  OK",
  "",
  "Loading GWU.SYS ........................................  OK",
  "Loading TESTIMONY.DLL (S3497, S3462) ...................  OK",
  "Loading TRADESIMPLE.EXE ................................  OK",
  "Loading PITSTOP.EXE ....................................  OK",
  "Loading FIELD_ORGANIZING.VXD ...........................  OK",
  "",
  "Starting JOSHUA-OS..."
];

function typeBoot(){
  var el = document.getElementById("boot-text");
  var hint = document.getElementById("boot-hint");
  hint.hidden = false; /* skip is available from the first frame, not just after typing finishes */
  var li = 0, ci = 0;
  var cur = "";
  function step(){
    if(li >= bootLines.length) return;
    var line = bootLines[li];
    if(ci <= line.length){
      cur = bootLines.slice(0, li).join("\n") + (li>0 ? "\n" : "") + line.slice(0, ci);
      el.textContent = cur;
      ci++;
      setTimeout(step, line.length === 0 ? 40 : 8);
    } else {
      li++; ci = 0;
      setTimeout(step, 60);
    }
  }
  step();
}

/* Browsers refuse to play audio without a genuine user gesture. The boot
   screen listens for a click/keypress to use as that gesture, but if it
   auto-advances (the 2.8s timeout) before the visitor does either, the
   chime would otherwise be lost for good. tryPlayChime() is idempotent,
   so it's safe to also wire up as a one-time fallback on the very next
   real interaction anywhere on the page — see the boot kickoff below. */
var chimePlayed = false;
function tryPlayChime(){
  if(chimePlayed) return;
  chimePlayed = true;
  playChime();
}

function finishBoot(userGesture, instant){
  var boot = document.getElementById("boot-screen");
  var desktop = document.getElementById("desktop");
  if(boot.dataset.done) return;
  boot.dataset.done = "1";
  if(userGesture) tryPlayChime();
  function reveal(){
    boot.hidden = true;
    desktop.hidden = false;
    desktop.removeAttribute("aria-hidden");
    /* Everyone lands on Welcome.exe after boot — desktop or phone.
       The plain-text résumé stays one tap away via the skip link /
       taskbar toggle; it is no longer the mobile default. */
    if(typeof postBootSetup === "function") postBootSetup();
  }
  if(instant){
    reveal();
  } else {
    boot.style.transition = "opacity .35s ease";
    boot.style.opacity = "0";
    setTimeout(reveal, 350);
  }
}

/* ============================================================
   WINDOW MANAGER
   ============================================================ */

/* Web Animations API, not CSS transitions — a window's left/top/width
   change on every drag frame, and a blanket CSS transition on those
   properties would make dragging feel laggy. .animate() only touches
   the specific gesture it's asked for. All four no-op instantly under
   reduced-motion. */
function animateWindowOpen(el){
  if(reducedMotion || !el.animate) return;
  el.animate([{ opacity:0, transform:"scale(.94)" }, { opacity:1, transform:"scale(1)" }],
    { duration:140, easing:"ease-out" });
}
function animateWindowClose(el, onDone){
  if(reducedMotion || !el.animate){ onDone(); return; }
  var anim = el.animate([{ opacity:1, transform:"scale(1)" }, { opacity:0, transform:"scale(.94)" }],
    { duration:120, easing:"ease-in" });
  var done = false;
  function finish(){ if(!done){ done = true; onDone(); } }
  anim.onfinish = finish;
  setTimeout(finish, 200); /* safety net if onfinish never fires */
}
function animateWindowMinimize(el, onDone){
  if(reducedMotion || !el.animate){ onDone(); return; }
  var anim = el.animate([
      { opacity:1, transform:"scale(1) translateY(0)", transformOrigin:"50% 100%" },
      { opacity:0, transform:"scale(.15) translateY(10%)", transformOrigin:"50% 100%" }
    ], { duration:180, easing:"ease-in" });
  var done = false;
  function finish(){ if(!done){ done = true; onDone(); } }
  anim.onfinish = finish;
  setTimeout(finish, 260);
}
function animateWindowRestore(el){
  if(reducedMotion || !el.animate) return;
  el.animate([
    { opacity:0, transform:"scale(.15) translateY(10%)", transformOrigin:"50% 100%" },
    { opacity:1, transform:"scale(1) translateY(0)", transformOrigin:"50% 100%" }
  ], { duration:160, easing:"ease-out" });
}

var APPS = [
  { id:"welcome", title:"Welcome.exe", icon:"person" },
  { id:"resume", title:"My Resume.txt - Notepad", icon:"doc" },
  { id:"projects", title:"Projects", icon:"chart" },
  { id:"experience", title:"Experience", icon:"folder" },
  { id:"about", title:"About_Me.txt - Notepad", icon:"person" },
  { id:"writing", title:"My Writing", icon:"article" },
  { id:"extras", title:"Extras", icon:"folder" },
  { id:"education", title:"Education.txt - Notepad", icon:"book" },
  { id:"skills", title:"Skills.ini - Notepad", icon:"gear" },
  { id:"contact", title:"Contact Me.exe", icon:"mail" },
  { id:"computer", title:"My Computer", icon:"computer" },
  { id:"display", title:"Display Properties", icon:"computer" },
  { id:"controlpanel", title:"Control Panel", icon:"gear" },
  { id:"addremove", title:"Add/Remove Programs", icon:"folder" },
  { id:"media", title:"Media Player", icon:"note" },
  { id:"minesweeper", title:"Minesweeper", icon:"bomb" },
  { id:"bin", title:"Recycle Bin", icon:"bin" }
];
/* History Bowl Trivia (win-trophy) is deliberately not registered here —
   it still contains placeholder questions and shouldn't be reachable
   until real ones are supplied. The window and its JS are left intact
   so re-adding it later is a one-line change, not a rebuild. */

var zTop = 10;
var openApps = {};   // id -> {el, taskBtn, minimized}
var taskBar = document.getElementById("task-buttons");

function winEl(id){ return document.getElementById("win-" + id); }

function focusWindow(id){
  document.querySelectorAll(".win-window").forEach(function(w){ w.classList.remove("active"); });
  var el = winEl(id);
  el.classList.add("active");
  zTop += 1;
  el.style.zIndex = zTop;
  document.querySelectorAll(".task-btn").forEach(function(b){ b.classList.remove("active"); });
  if(openApps[id] && openApps[id].taskBtn) openApps[id].taskBtn.classList.add("active");
}

function makeTaskButton(app){
  var btn = document.createElement("button");
  btn.className = "task-btn raised";
  btn.innerHTML = '<span class="icon-slot" data-icon="'+app.icon+'"></span><span>'+app.title.split(" - ")[0]+"</span>";
  renderIcons(btn);
  btn.addEventListener("click", function(){
    var st = openApps[app.id];
    if(!st) return;
    if(st.el.classList.contains("active") && !st.minimized) minimizeWindow(app.id);
    else restoreWindow(app.id);
  });
  return btn;
}

function openWindow(id){
  var app = APPS.filter(function(a){ return a.id === id; })[0];
  if(!app) return;
  var el = winEl(id);
  var isFreshOpen = !openApps[id] || !el.classList.contains("open");
  if(!openApps[id]){
    var btn = makeTaskButton(app);
    taskBar.appendChild(btn);
    openApps[id] = { el:el, taskBtn:btn, minimized:false };
  }
  openApps[id].minimized = false;
  el.classList.add("open");
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", app.title);
  focusWindow(id);
  closeStartMenu();
  requestAnimationFrame(function(){ el.setAttribute("tabindex", "-1"); el.focus({preventScroll:true}); });
  saveState();
  if(isFreshOpen){ animateWindowOpen(el); playClickSound(); }
  if(id === "resume" && !resumeTypedOnce){
    resumeTypedOnce = true;
    revealResumeText();
  }
  if(id === "writing" && !writingLoaded){
    loadWritingFeed();
  }
}

function closeWindow(id){
  var st = openApps[id];
  if(!st) return;
  /* closing the Media Player silences it — minimize keeps it playing,
     like a real media player */
  if(id === "media"){
    stopMusic();
    var ytFrame = document.getElementById("media-yt-frame");
    if(ytFrame) ytFrame.innerHTML = "";
  }
  var el = st.el;
  el.classList.remove("active");
  if(st.taskBtn) st.taskBtn.remove();
  delete openApps[id];
  saveState();
  playCloseSound();
  animateWindowClose(el, function(){
    if(!openApps[id]) el.classList.remove("open"); /* was it reopened mid-animation? then leave it be */
  });
}

function minimizeWindow(id){
  var st = openApps[id];
  if(!st) return;
  st.minimized = true;
  if(st.taskBtn) st.taskBtn.classList.remove("active");
  saveState();
  playCloseSound();
  animateWindowMinimize(st.el, function(){
    if(st.minimized) st.el.classList.remove("open");
  });
}

function restoreWindow(id){
  var st = openApps[id];
  if(!st) return;
  st.minimized = false;
  st.el.classList.add("open");
  focusWindow(id);
  animateWindowRestore(st.el);
  playClickSound();
  saveState();
}

function toggleMaximize(id){
  var el = winEl(id);
  if(!reducedMotion) el.classList.add("geometry-anim");
  if(el.classList.contains("maximized")){
    el.classList.remove("maximized");
    if(el.dataset.prevRect){
      var r = JSON.parse(el.dataset.prevRect);
      el.style.left = r.l; el.style.top = r.t; el.style.width = r.w; el.style.height = r.h;
    }
  } else {
    el.dataset.prevRect = JSON.stringify({ l:el.style.left, t:el.style.top, w:el.style.width, h:el.style.height });
    el.classList.add("maximized");
  }
  focusWindow(id);
  saveState();
  setTimeout(function(){ el.classList.remove("geometry-anim"); }, 180);
}

/* ============================================================
   WINDOW STATE PERSISTENCE (localStorage)
   ============================================================ */
var STATE_KEY = "joshuaos-window-state-v1";

function saveState(){
  try{
    var state = {};
    APPS.forEach(function(app){
      var st = openApps[app.id];
      var el = winEl(app.id);
      state[app.id] = {
        open: !!(st && el.classList.contains("open")),
        minimized: !!(st && st.minimized),
        maximized: el.classList.contains("maximized"),
        left: el.style.left, top: el.style.top,
        width: el.style.width, height: el.style.height
      };
    });
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch(e){ /* storage unavailable — not fatal */ }
}

/* restoreOpen: when false, only reapplies geometry (size/position).
   Boot uses that so returning visitors aren't dumped into Resume.txt
   or a pile of leftover windows — Welcome.exe is always the first surface. */
function loadState(opts){
  opts = opts || {};
  var restoreOpen = opts.restoreOpen !== false;
  var restoredAny = false;
  try{
    var raw = localStorage.getItem(STATE_KEY);
    if(!raw) return false;
    var state = JSON.parse(raw);
    APPS.forEach(function(app){
      var s = state[app.id];
      var el = winEl(app.id);
      if(!el || !s) return;
      if(s.left) el.style.left = s.left;
      if(s.top) el.style.top = s.top;
      if(s.width) el.style.width = s.width;
      if(s.height) el.style.height = s.height;
      if(s.maximized) el.classList.add("maximized");
      if(restoreOpen && s.open){
        restoredAny = true;
        openWindow(app.id);
        if(s.minimized) minimizeWindow(app.id);
      }
    });
  } catch(e){ /* ignore corrupt state */ }
  return restoredAny;
}

/* Runs once, right after the boot screen clears. Geometry from the last
   visit comes back; open windows do not — Welcome.exe is the intentional
   first read, personality-forward, not the formal résumé. */
function postBootSetup(){
  loadState({ restoreOpen: false });
  if(typeof openWelcomeWindow === "function") openWelcomeWindow();
}

document.querySelectorAll(".win-window").forEach(function(win){
  var id = win.dataset.app;
  win.addEventListener("mousedown", function(){ focusWindow(id); });
  win.addEventListener("touchstart", function(){ focusWindow(id); }, {passive:true});

  win.querySelectorAll(".win-btn").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      var action = btn.dataset.action;
      if(action === "close") closeWindow(id);
      else if(action === "minimize") minimizeWindow(id);
      else if(action === "maximize") toggleMaximize(id);
    });
  });

  var titlebar = win.querySelector(".win-titlebar");
  titlebar.addEventListener("dblclick", function(){ toggleMaximize(id); });

  /* dragging */
  titlebar.addEventListener("pointerdown", function(e){
    if(e.target.closest(".win-btn")) return;
    if(win.classList.contains("maximized")) return;
    if(window.matchMedia("(max-width:760px)").matches) return;
    focusWindow(id);
    var startX = e.clientX, startY = e.clientY;
    var rect = win.getBoundingClientRect();
    var desktopRect = document.getElementById("desktop").getBoundingClientRect();
    var origLeft = rect.left - desktopRect.left, origTop = rect.top - desktopRect.top;
    titlebar.setPointerCapture(e.pointerId);
    function onMove(ev){
      var dx = ev.clientX - startX, dy = ev.clientY - startY;
      var nl = Math.max(-rect.width + 80, Math.min(origLeft + dx, desktopRect.width - 40));
      var nt = Math.max(0, Math.min(origTop + dy, desktopRect.height - 30));
      win.style.left = nl + "px";
      win.style.top = nt + "px";
    }
    function onUp(ev){
      titlebar.releasePointerCapture(e.pointerId);
      titlebar.removeEventListener("pointermove", onMove);
      titlebar.removeEventListener("pointerup", onUp);
      saveState();
    }
    titlebar.addEventListener("pointermove", onMove);
    titlebar.addEventListener("pointerup", onUp);
  });

  /* resizing */
  var handle = win.querySelector("[data-resize]");
  if(handle){
    handle.addEventListener("pointerdown", function(e){
      e.stopPropagation();
      if(win.classList.contains("maximized")) return;
      focusWindow(id);
      var startX = e.clientX, startY = e.clientY;
      var rect = win.getBoundingClientRect();
      handle.setPointerCapture(e.pointerId);
      function onMove(ev){
        var dw = ev.clientX - startX, dh = ev.clientY - startY;
        win.style.width = Math.max(250, rect.width + dw) + "px";
        win.style.height = Math.max(170, rect.height + dh) + "px";
      }
      function onUp(){
        handle.releasePointerCapture(e.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        saveState();
      }
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
    });
  }
});

/* Escape closes whichever window currently has focus/is active — a cheap,
   real keyboard affordance for people not using a mouse. */
document.addEventListener("keydown", function(e){
  if(e.key !== "Escape") return;
  var active = document.querySelector(".win-window.open.active");
  if(active) closeWindow(active.dataset.app);
});

/* ============================================================
   DESKTOP ICONS — grid layout (persisted per icon via localStorage),
   drag-to-reposition, marquee select, and the existing open/select
   click behavior, now all living in one place instead of split
   between a flexbox layout and ad-hoc handlers.
   ============================================================ */
var isCoarse = window.matchMedia("(pointer:coarse)").matches;
var ICON_POS_KEY = "joshuaos-icon-positions-v1";
var ICON_CELL_W = 82, ICON_CELL_H = 86;

function loadIconPositions(){
  try{ return JSON.parse(localStorage.getItem(ICON_POS_KEY) || "{}"); } catch(e){ return {}; }
}
function saveIconPositions(positions){
  try{ localStorage.setItem(ICON_POS_KEY, JSON.stringify(positions)); } catch(e){}
}

function layoutDesktopIcons(){
  var wrap = document.getElementById("desktop-icons");
  if(!wrap) return;
  var icons = Array.prototype.slice.call(wrap.querySelectorAll(".icon"));
  var positions = loadIconPositions();
  var wrapW = wrap.clientWidth || 300, wrapH = wrap.clientHeight || 400;
  var rowsPerCol = Math.max(1, Math.floor(wrapH / ICON_CELL_H));
  icons.forEach(function(icon, idx){
    var saved = positions[icon.dataset.app];
    var x, y;
    if(saved){
      x = Math.max(0, Math.min(saved.x, Math.max(0, wrapW - icon.offsetWidth)));
      y = Math.max(0, Math.min(saved.y, Math.max(0, wrapH - icon.offsetHeight)));
    } else {
      var col = Math.floor(idx / rowsPerCol), row = idx % rowsPerCol;
      x = col * ICON_CELL_W; y = row * ICON_CELL_H;
    }
    icon.style.left = x + "px";
    icon.style.top = y + "px";
  });
}

document.querySelectorAll(".icon").forEach(function(icon){
  var app = icon.dataset.app;

  icon.addEventListener("click", function(){
    if(icon._justDragged) return;
    document.querySelectorAll(".icon").forEach(function(i){ i.classList.remove("selected"); });
    icon.classList.add("selected");
    if(isCoarse) openWindow(app);
  });
  icon.addEventListener("dblclick", function(){
    if(icon._justDragged) return;
    openWindow(app);
  });
  /* keyboard users get Enter/Space instead of the double-click most
     input devices need — a focused icon should never need a mouse to
     actually open. */
  icon.addEventListener("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      openWindow(app);
    }
  });

  /* drag-to-reposition, saved per icon */
  icon.addEventListener("pointerdown", function(e){
    if(e.pointerType === "mouse" && e.button !== 0) return;
    var wrap = document.getElementById("desktop-icons");
    var wrapRect = wrap.getBoundingClientRect();
    var startX = e.clientX, startY = e.clientY;
    var origLeft = parseFloat(icon.style.left) || 0;
    var origTop = parseFloat(icon.style.top) || 0;
    var moved = false;
    icon.setPointerCapture(e.pointerId);
    function onMove(ev){
      var dx = ev.clientX - startX, dy = ev.clientY - startY;
      if(Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      var nl = Math.max(0, Math.min(origLeft + dx, wrapRect.width - icon.offsetWidth));
      var nt = Math.max(0, Math.min(origTop + dy, wrapRect.height - icon.offsetHeight));
      icon.style.left = nl + "px";
      icon.style.top = nt + "px";
    }
    function onUp(){
      icon.releasePointerCapture(e.pointerId);
      icon.removeEventListener("pointermove", onMove);
      icon.removeEventListener("pointerup", onUp);
      if(moved){
        var positions = loadIconPositions();
        positions[app] = { x: parseFloat(icon.style.left), y: parseFloat(icon.style.top) };
        saveIconPositions(positions);
        icon._justDragged = true;
        setTimeout(function(){ icon._justDragged = false; }, 50);
      }
    }
    icon.addEventListener("pointermove", onMove);
    icon.addEventListener("pointerup", onUp);
  });
});

/* click-drag on bare desktop draws a marquee selection rectangle;
   a plain click with no movement clears the selection, matching the
   old behavior. */
document.getElementById("desktop-icons").addEventListener("pointerdown", function(e){
  if(e.target !== e.currentTarget) return;
  if(e.pointerType === "mouse" && e.button !== 0) return;
  var wrap = e.currentTarget;
  var wrapRect = wrap.getBoundingClientRect();
  var startX = e.clientX - wrapRect.left, startY = e.clientY - wrapRect.top;
  var hasMoved = false;
  var box = document.createElement("div");
  box.className = "marquee";
  wrap.appendChild(box);
  wrap.setPointerCapture(e.pointerId);

  function onMove(ev){
    var x = ev.clientX - wrapRect.left, y = ev.clientY - wrapRect.top;
    if(Math.abs(x - startX) > 2 || Math.abs(y - startY) > 2) hasMoved = true;
    var l = Math.min(x, startX), t = Math.min(y, startY);
    var w = Math.abs(x - startX), h = Math.abs(y - startY);
    box.style.left = l + "px"; box.style.top = t + "px";
    box.style.width = w + "px"; box.style.height = h + "px";
    wrap.querySelectorAll(".icon").forEach(function(icon){
      var il = parseFloat(icon.style.left) || 0, it = parseFloat(icon.style.top) || 0;
      var ir = il + icon.offsetWidth, ib = it + icon.offsetHeight;
      icon.classList.toggle("selected", il < l + w && ir > l && it < t + h && ib > t);
    });
  }
  function onUp(){
    wrap.releasePointerCapture(e.pointerId);
    wrap.removeEventListener("pointermove", onMove);
    wrap.removeEventListener("pointerup", onUp);
    box.remove();
    if(!hasMoved) document.querySelectorAll(".icon").forEach(function(i){ i.classList.remove("selected"); });
  }
  wrap.addEventListener("pointermove", onMove);
  wrap.addEventListener("pointerup", onUp);
});

layoutDesktopIcons();
(function(){
  var resizeTimer = null;
  window.addEventListener("resize", function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutDesktopIcons, 150);
  });
})();

/* ============================================================
   START MENU
   ============================================================ */
var startBtn = document.getElementById("start-btn");
var startMenu = document.getElementById("start-menu");

function closeStartMenu(){
  startMenu.classList.remove("open");
  startBtn.classList.remove("pressed");
}
startBtn.addEventListener("click", function(e){
  e.stopPropagation();
  var willOpen = !startMenu.classList.contains("open");
  startMenu.classList.toggle("open", willOpen);
  startBtn.classList.toggle("pressed", willOpen);
});
document.addEventListener("click", function(e){
  if(!startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)){
    closeStartMenu();
  }
});
document.querySelectorAll("[data-toggle-sub]").forEach(function(btn){
  btn.addEventListener("click", function(e){
    e.stopPropagation();
    var sub = document.getElementById("sub-" + btn.dataset.toggleSub);
    var willOpen = !sub.classList.contains("open");
    sub.classList.toggle("open", willOpen);
    btn.classList.toggle("open-sub", willOpen);
  });
});
document.querySelectorAll("[data-open]").forEach(function(btn){
  btn.addEventListener("click", function(){ openWindow(btn.dataset.open); });
});

/* ============================================================
   RUN... DIALOG
   ============================================================ */
var RUN_ALIASES = {
  resume:"resume", myresume:"resume",
  projects:"projects", tradesimple:"projects", pitstop:"projects",
  experience:"experience",
  about:"about", aboutme:"about",
  education:"education",
  skills:"skills",
  contact:"contact",
  computer:"computer", mycomputer:"computer",
  display:"display",
  controlpanel:"controlpanel", control:"controlpanel",
  addremove:"addremove",
  trophy:"trophy", trivia:"trophy", historybowl:"trophy",
  minesweeper:"minesweeper", mines:"minesweeper",
  media:"media", music:"media", mediaplayer:"media",
  writing:"writing", substack:"writing", blog:"writing",
  bin:"bin", recycle:"bin", recyclebin:"bin"
};
var runOverlay = document.getElementById("run-overlay");
var runInput = document.getElementById("run-input");

function openRunDialog(){
  closeStartMenu();
  runOverlay.hidden = false;
  runInput.value = "";
  runInput.focus();
}
function closeRunDialog(){ runOverlay.hidden = true; }
function submitRun(){
  var raw = runInput.value.trim().toLowerCase().replace(/[\s._-]/g, "").replace(/\.(exe|txt|ini)$/, "");
  var target = RUN_ALIASES[raw];
  var typedValue = runInput.value;
  closeRunDialog(); /* always close first — never stack this overlay under the message box */
  if(target) openWindow(target);
  else alertBox("Cannot Run Program", "Cannot find '" + (typedValue || "(nothing)") + "'. Make sure you typed the name correctly, or try Start → Programs instead.");
}
document.getElementById("start-run").addEventListener("click", openRunDialog);
document.getElementById("run-ok").addEventListener("click", submitRun);
document.getElementById("run-cancel").addEventListener("click", closeRunDialog);
document.getElementById("run-x").addEventListener("click", closeRunDialog);
runOverlay.addEventListener("click", function(e){ if(e.target === runOverlay) closeRunDialog(); });
runInput.addEventListener("keydown", function(e){
  if(e.key === "Enter") submitRun();
  else if(e.key === "Escape") closeRunDialog();
});

document.getElementById("start-shutdown").addEventListener("click", function(){
  closeStartMenu();
  document.getElementById("shutdown-screen").hidden = false;
});
var shutdownScreen = document.getElementById("shutdown-screen");
shutdownScreen.addEventListener("click", function(){ shutdownScreen.hidden = true; });
document.addEventListener("keydown", function(e){
  if(!shutdownScreen.hidden){ shutdownScreen.hidden = true; }
});

/* ============================================================
   RIGHT-CLICK DESKTOP MENU
   ============================================================ */
var ctxMenu = document.getElementById("ctx-menu");
function closeCtxMenu(){ ctxMenu.classList.remove("open"); }
document.getElementById("desktop").addEventListener("contextmenu", function(e){
  if(e.target.closest(".win-window") || e.target.closest(".taskbar") || e.target.closest(".start-menu")) return;
  e.preventDefault();
  var menuW = 180, menuH = 140;
  var x = Math.min(e.clientX, window.innerWidth - menuW);
  var y = Math.min(e.clientY, window.innerHeight - menuH);
  ctxMenu.style.left = x + "px";
  ctxMenu.style.top = y + "px";
  ctxMenu.classList.add("open");
});
document.addEventListener("click", function(e){
  if(!ctxMenu.contains(e.target)) closeCtxMenu();
});
document.getElementById("ctx-arrange").addEventListener("click", function(){
  var wrap = document.getElementById("desktop-icons");
  var icons = Array.prototype.slice.call(wrap.querySelectorAll(".icon"));
  icons.sort(function(a, b){ return a.textContent.trim().localeCompare(b.textContent.trim()); });
  var rowsPerCol = Math.max(1, Math.floor((wrap.clientHeight || 400) / ICON_CELL_H));
  var positions = {};
  icons.forEach(function(icon, idx){
    var col = Math.floor(idx / rowsPerCol), row = idx % rowsPerCol;
    var x = col * ICON_CELL_W, y = row * ICON_CELL_H;
    icon.style.left = x + "px"; icon.style.top = y + "px";
    positions[icon.dataset.app] = { x:x, y:y };
  });
  saveIconPositions(positions);
  closeCtxMenu();
});
document.getElementById("ctx-refresh").addEventListener("click", function(){
  closeCtxMenu();
  location.reload();
});
document.getElementById("ctx-properties").addEventListener("click", function(){
  closeCtxMenu();
  openWindow("display");
});

/* ============================================================
   MESSAGE BOX (used for decorative menu items)
   ============================================================ */
var msgOverlay = document.getElementById("msgbox-overlay");
var msgTitle = document.getElementById("msgbox-title");
var msgText = document.getElementById("msgbox-text");
function alertBox(title, text){
  msgTitle.textContent = title;
  msgText.textContent = text;
  msgOverlay.hidden = false;
  document.getElementById("msgbox-ok").focus();
  playErrorDing();
}
function closeMsgBox(){ msgOverlay.hidden = true; }
document.getElementById("msgbox-ok").addEventListener("click", closeMsgBox);
document.getElementById("msgbox-x").addEventListener("click", closeMsgBox);
msgOverlay.addEventListener("click", function(e){ if(e.target === msgOverlay) closeMsgBox(); });

/* menu bar wiring */
document.querySelectorAll("[data-menu]").forEach(function(span){
  span.addEventListener("click", function(){
    var kind = span.dataset.menu;
    if(kind === "file-save"){
      alertBox("File", 'Use "Download .txt" or "Print / Save as PDF" in the status bar below.');
    } else if(kind === "mine-new"){
      startMinesweeper();
    } else if(kind === "quiz-new"){
      startQuiz();
    } else if(kind === "resume-edit"){
      openFind();
    } else {
      alertBox("Notice", "This menu is decorative \u2014 JoshuaOS demo edition. Try the desktop icons and Start Menu instead.");
    }
  });
});

/* ============================================================
   HAND-ROLLED PDF GENERATOR (no library, no CDN — builds a minimal but
   spec-valid single-content-stream PDF directly from RESUME_TEXT). The
   base-14 Courier font only covers WinAnsi/Latin-1, so anything outside
   that range gets swapped for an ASCII-safe equivalent before it's laid
   into the content stream.
   ============================================================ */
function sanitizeForPdf(s){
  return s
    .replace(/[–—]/g, "-")
    .replace(/·/g, "*")
    .replace(/ρ/g, "rho")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x00-\x7e\n]/g, "?");
}
function escPdfString(s){
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function buildResumePdfBlob(rawText){
  var text = sanitizeForPdf(rawText);
  var lines = text.split("\n");
  var pageW = 612, pageH = 792, margin = 50, fontSize = 10, leading = 12;
  var linesPerPage = 56;
  var pages = [];
  for(var i = 0; i < lines.length; i += linesPerPage) pages.push(lines.slice(i, i + linesPerPage));
  if(pages.length === 0) pages.push([""]);

  var pageObjNums = [], contentObjNums = [], nextNum = 4;
  pages.forEach(function(){ pageObjNums.push(nextNum++); contentObjNums.push(nextNum++); });

  var objects = {};
  objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  var kids = pageObjNums.map(function(n){ return n + " 0 R"; }).join(" ");
  objects[2] = "2 0 obj\n<< /Type /Pages /Kids [" + kids + "] /Count " + pages.length + " >>\nendobj\n";
  objects[3] = "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n";

  pages.forEach(function(pageLines, idx){
    var pageNum = pageObjNums[idx], contentNum = contentObjNums[idx];
    var startY = pageH - margin;
    var stream = "BT /F1 " + fontSize + " Tf " + leading + " TL " + margin + " " + startY + " Td";
    pageLines.forEach(function(line, li){
      var esc = escPdfString(line);
      stream += li === 0 ? " (" + esc + ") Tj" : " (" + esc + ") '";
    });
    stream += " ET";
    objects[pageNum] = pageNum + " 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pageW + " " + pageH +
      "] /Resources << /Font << /F1 3 0 R >> >> /Contents " + contentNum + " 0 R >>\nendobj\n";
    objects[contentNum] = contentNum + " 0 obj\n<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream\nendobj\n";
  });

  var totalObjects = nextNum - 1;
  var header = "%PDF-1.4\n";
  var body = "", offsets = {}, pos = header.length;
  for(var n = 1; n <= totalObjects; n++){
    offsets[n] = pos;
    body += objects[n];
    pos += objects[n].length;
  }
  var xrefStart = pos;
  var xref = "xref\n0 " + (totalObjects + 1) + "\n0000000000 65535 f \n";
  for(var n2 = 1; n2 <= totalObjects; n2++){
    xref += String(offsets[n2]).padStart(10, "0") + " 00000 n \n";
  }
  var trailer = "trailer\n<< /Size " + (totalObjects + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefStart + "\n%%EOF";
  return new Blob([header + body + xref + trailer], { type: "application/pdf" });
}

/* ============================================================
   RESUME TEXT: live word count + cursor position, a one-time
   typewriter reveal, and in-page Find (Ctrl+F) — the parts of a real
   Notepad this site was otherwise just imitating the look of.
   ============================================================ */
var resumeTypedOnce = false;
var resumeTypeAnimId = null;

function updateResumeStatus(){
  var ta = document.getElementById("resume-text");
  var text = ta.value;
  var words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById("resume-wordcount").textContent = words + " words";
  var pos = ta.selectionStart || 0;
  var before = text.slice(0, pos);
  var lines = before.split("\n");
  document.getElementById("resume-lncol").textContent = "Ln " + lines.length + ", Col " + (lines[lines.length - 1].length + 1);
}

function revealResumeText(){
  var ta = document.getElementById("resume-text");
  if(reducedMotion || !window.requestAnimationFrame){
    ta.value = RESUME_TEXT;
    updateResumeStatus();
    return;
  }
  var duration = 1400, start = null, done = false;
  function finish(){
    if(done) return;
    done = true;
    if(resumeTypeAnimId) cancelAnimationFrame(resumeTypeAnimId);
    ta.value = RESUME_TEXT;
    updateResumeStatus();
    ta.removeEventListener("pointerdown", finish);
    document.removeEventListener("keydown", finish);
  }
  ta.addEventListener("pointerdown", finish);
  document.addEventListener("keydown", finish);
  function step(ts){
    if(done) return;
    if(start === null) start = ts;
    var progress = Math.min(1, (ts - start) / duration);
    ta.value = RESUME_TEXT.slice(0, Math.floor(RESUME_TEXT.length * progress));
    updateResumeStatus();
    if(progress < 1) resumeTypeAnimId = requestAnimationFrame(step);
    else finish();
  }
  resumeTypeAnimId = requestAnimationFrame(step);
}

(function(){
  var ta = document.getElementById("resume-text");
  ["click", "keyup", "select", "focus"].forEach(function(evt){
    ta.addEventListener(evt, updateResumeStatus);
  });
})();

/* ============================================================
   FIND (Ctrl+F, Resume.txt only) — selects matches natively in the
   textarea, the same visual highlight real Notepad gives you.
   ============================================================ */
var findOverlay = document.getElementById("find-overlay");
var findInput = document.getElementById("find-input");
var findStatus = document.getElementById("find-status");
var findLastIndex = -1;

function openFind(){
  var resumeWin = document.getElementById("win-resume");
  if(!resumeWin.classList.contains("open")) openWindow("resume");
  /* Find needs the full text available immediately — don't let it race
     a still-in-progress typewriter reveal. */
  var ta = document.getElementById("resume-text");
  if(ta.value !== RESUME_TEXT){
    if(resumeTypeAnimId) cancelAnimationFrame(resumeTypeAnimId);
    ta.value = RESUME_TEXT;
    resumeTypedOnce = true;
    updateResumeStatus();
  }
  findOverlay.hidden = false;
  findStatus.textContent = "";
  findLastIndex = -1;
  findInput.focus();
  findInput.select();
}
function closeFind(){ findOverlay.hidden = true; }
function findNext(){
  var ta = document.getElementById("resume-text");
  var text = ta.value;
  var query = findInput.value;
  if(!query){ findStatus.textContent = "Type something to find."; return; }
  var searchFrom = findLastIndex >= 0 ? findLastIndex + 1 : 0;
  var idx = text.toLowerCase().indexOf(query.toLowerCase(), searchFrom);
  if(idx === -1){
    idx = text.toLowerCase().indexOf(query.toLowerCase(), 0);
    if(idx === -1){
      findStatus.textContent = 'Cannot find "' + query + '".';
      findLastIndex = -1;
      return;
    }
    findStatus.textContent = "Reached the end — continued from the top.";
  } else {
    findStatus.textContent = "";
  }
  findLastIndex = idx;
  ta.focus();
  ta.setSelectionRange(idx, idx + query.length);
  var lineNum = text.slice(0, idx).split("\n").length - 1;
  ta.scrollTop = Math.max(0, lineNum * 18.75 - ta.clientHeight / 2);
  updateResumeStatus();
}
document.getElementById("find-x").addEventListener("click", closeFind);
document.getElementById("find-cancel").addEventListener("click", closeFind);
document.getElementById("find-next").addEventListener("click", findNext);
findOverlay.addEventListener("click", function(e){ if(e.target === findOverlay) closeFind(); });
findInput.addEventListener("keydown", function(e){
  if(e.key === "Enter"){ e.preventDefault(); findNext(); }
  else if(e.key === "Escape") closeFind();
});
document.addEventListener("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f"){
    var resumeWin = document.getElementById("win-resume");
    if(resumeWin.classList.contains("open") || findOverlay.hidden === false){
      e.preventDefault();
      openFind();
    }
  }
});

/* Real "Save As" / "Print" actions reachable from the status bar. Print
   uses the dedicated #plain-view markup (see @media print), so the PDF a
   browser's Print > Save as PDF produces is a properly formatted resume,
   not a screenshot of the Notepad chrome. */
(function(){
  var statusbar = document.querySelector("#win-resume .win-statusbar");

  var dlBtn = document.createElement("button");
  dlBtn.textContent = "Download .txt";
  dlBtn.className = "btn-raised";
  dlBtn.style.fontSize = "10px";
  dlBtn.style.padding = "1px 8px";
  dlBtn.addEventListener("click", function(){
    var blob = new Blob([RESUME_TEXT], {type:"text/plain"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "Joshua-Metters-Resume.txt";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  var pdfBtn = document.createElement("button");
  pdfBtn.textContent = "Download .pdf";
  pdfBtn.className = "btn-raised";
  pdfBtn.style.fontSize = "10px";
  pdfBtn.style.padding = "1px 8px";
  pdfBtn.addEventListener("click", function(){
    var blob = buildResumePdfBlob(RESUME_TEXT);
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "Joshua-Metters-Resume.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  var printBtn = document.createElement("button");
  printBtn.textContent = "Print (typeset)";
  printBtn.className = "btn-raised";
  printBtn.style.fontSize = "10px";
  printBtn.style.padding = "1px 8px";
  printBtn.title = "Opens the browser print dialog with the formatted résumé";
  printBtn.addEventListener("click", function(){ window.print(); });

  statusbar.appendChild(printBtn);
  statusbar.appendChild(pdfBtn);
  statusbar.appendChild(dlBtn);
})();

/* ============================================================
   EXPERIENCE LIST
   ============================================================ */
(function(){
  var list = document.getElementById("exp-list");
  EXPERIENCE.forEach(function(job, idx){
    var row = document.createElement("li");
    var linkHTML = job.url
      ? ' <a class="exp-link" href="'+job.url+'" target="_blank" rel="noopener">Visit &#8599;</a>'
      : '';
    row.innerHTML =
      '<div class="exp-row" data-idx="'+idx+'">' +
        '<span class="icon-slot" data-icon="'+job.icon+'"></span>' +
        '<div class="exp-main"><div class="exp-role">'+job.role+'</div><div class="exp-org">'+job.org+linkHTML+'</div></div>' +
        '<span class="exp-type">'+(job.fileType||"")+'</span>' +
        '<span class="exp-size">'+(job.size||"")+'</span>' +
        '<div class="exp-date">'+job.date+'</div>' +
      '</div>' +
      '<div class="exp-detail" id="exp-detail-'+idx+'"><ul>' +
        job.bullets.map(function(b){ return "<li>"+b+"</li>"; }).join("") +
      '</ul></div>';
    list.appendChild(row);
  });
  renderIcons(list);
  document.getElementById("exp-count").textContent = EXPERIENCE.length + " object(s)";
  list.addEventListener("click", function(e){
    var row = e.target.closest(".exp-row");
    if(!row) return;
    var detail = document.getElementById("exp-detail-" + row.dataset.idx);
    detail.classList.toggle("open");
  });
})();

/* ============================================================
   PROJECTS LIST
   ============================================================ */
(function(){
  var list = document.getElementById("proj-list");
  if(!list) return;
  PROJECTS.forEach(function(proj, idx){
    var row = document.createElement("li");
    row.innerHTML =
      '<div class="exp-row" data-idx="'+idx+'">' +
        '<span class="icon-slot" data-icon="'+proj.icon+'"></span>' +
        '<div class="exp-main"><div class="exp-role">'+proj.name+'</div><div class="exp-org">'+proj.tagline+'</div></div>' +
        '<div class="exp-date">LIVE</div>' +
      '</div>' +
      '<div class="exp-detail" id="proj-detail-'+idx+'">' +
        (proj.brand ?
          '<div class="proj-brand" style="background:'+proj.brand.bg+';color:'+proj.brand.fg+';">' +
            '<span class="proj-brand-mark">'+proj.brand.mark+'</span>' +
            '<span class="proj-brand-note">Colors and copy pulled from the live site — a stylized preview, not a literal screenshot.</span>' +
          '</div>' : '') +
        (proj.stat ?
          '<div class="proj-stat"><span class="proj-stat-label">'+proj.stat.label+'</span><span>'+proj.stat.value+'</span></div>' : '') +
        '<pre class="proj-readme"></pre>' +
        '<div class="proj-actions"><a class="btn-raised" href="'+proj.url+'" target="_blank" rel="noopener">'+(proj.urlLabel || "Visit Site")+' &#8599;</a></div>' +
      '</div>';
    list.appendChild(row);
    /* readme uses textContent so a stray "<" or "&" in the copy can't be
       misread as markup */
    row.querySelector(".proj-readme").textContent = proj.readme;
  });
  renderIcons(list);
  document.getElementById("proj-count").textContent = PROJECTS.length + " object(s)";
  list.addEventListener("click", function(e){
    if(e.target.closest("a")) return;
    var row = e.target.closest(".exp-row");
    if(!row) return;
    var detail = document.getElementById("proj-detail-" + row.dataset.idx);
    detail.classList.toggle("open");
  });
})();

/* ============================================================
   ABOUT_ME.TXT
   ============================================================ */
(function(){
  var el = document.getElementById("about-body");
  if(el) el.textContent = ABOUT_TEXT;
})();

/* ============================================================
   SKILLS.INI
   ============================================================ */
document.getElementById("skills-ini").innerHTML = SKILLS_INI_HTML;

/* ============================================================
   MY COMPUTER DRIVES
   ============================================================ */
(function(){
  var wrap = document.getElementById("drives");
  DRIVES.forEach(function(d){
    var div = document.createElement("div");
    div.className = "drive";
    div.innerHTML =
      '<div class="drive-head"><span>'+d.label+'</span><span>'+d.pct+'% full</span></div>' +
      '<div class="drive-bar"><div class="drive-fill" style="width:'+d.pct+'%;background:'+d.color+';"></div></div>';
    wrap.appendChild(div);
  });
})();

/* ============================================================
   CONTROL PANEL > ADD/REMOVE PROGRAMS
   ============================================================ */
document.getElementById("ar-list").textContent = PROGRAMS_LIST_TEXT;
document.getElementById("ar-count").textContent = PROGRAMS_LIST_TEXT.split("\n").length + " program(s) installed";
document.getElementById("applet-addremove").addEventListener("dblclick", function(){ openWindow("addremove"); });
document.getElementById("applet-addremove").addEventListener("click", function(){ if(isCoarse) openWindow("addremove"); });

/* ============================================================
   DISPLAY PROPERTIES — three original wallpapers (all hand-drawn
   gradients/shapes, nothing scanned or copied), a working Screen
   Saver tab wired to the real idle timer, and a decorative
   Appearance tab that's honest about being decorative.
   ============================================================ */
var WALLPAPERS = {
  sky: {
    label:"Sky & Clouds",
    css:'var(--desktop-teal) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1600 900\' preserveAspectRatio=\'xMidYMid slice\'%3E%3Cdefs%3E%3ClinearGradient id=\'sky\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%230b4fb0\'/%3E%3Cstop offset=\'45%25\' stop-color=\'%233f83d6\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23bfe0f7\'/%3E%3C/linearGradient%3E%3Cfilter id=\'soft\' x=\'-20%25\' y=\'-20%25\' width=\'140%25\' height=\'140%25\'%3E%3CfeGaussianBlur stdDeviation=\'10\'/%3E%3C/filter%3E%3C/defs%3E%3Crect width=\'1600\' height=\'900\' fill=\'url(%23sky)\'/%3E%3Cg fill=\'%23ffffff\' opacity=\'0.5\' filter=\'url(%23soft)\'%3E%3Cellipse cx=\'150\' cy=\'650\' rx=\'260\' ry=\'60\'/%3E%3Cellipse cx=\'420\' cy=\'700\' rx=\'300\' ry=\'70\'/%3E%3Cellipse cx=\'1300\' cy=\'600\' rx=\'260\' ry=\'55\'/%3E%3Cellipse cx=\'1500\' cy=\'680\' rx=\'220\' ry=\'60\'/%3E%3Cellipse cx=\'250\' cy=\'120\' rx=\'180\' ry=\'30\'/%3E%3C/g%3E%3Cg fill=\'%23ffffff\' opacity=\'0.85\'%3E%3Cellipse cx=\'160\' cy=\'640\' rx=\'90\' ry=\'26\'/%3E%3Cellipse cx=\'240\' cy=\'655\' rx=\'70\' ry=\'22\'/%3E%3Cellipse cx=\'1330\' cy=\'590\' rx=\'95\' ry=\'24\'/%3E%3Cellipse cx=\'1420\' cy=\'605\' rx=\'65\' ry=\'20\'/%3E%3Cellipse cx=\'700\' cy=\'90\' rx=\'110\' ry=\'22\'/%3E%3Cellipse cx=\'820\' cy=\'105\' rx=\'70\' ry=\'18\'/%3E%3C/g%3E%3C/svg%3E") no-repeat center center / cover'
  },
  hills: {
    label:"Rolling Hills",
    css:'var(--desktop-teal) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1600 900\' preserveAspectRatio=\'xMidYMax slice\'%3E%3Cdefs%3E%3ClinearGradient id=\'sky2\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%230a5fc4\'/%3E%3Cstop offset=\'55%25\' stop-color=\'%235ea7e6\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23cfe8fa\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'hill\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%2385cf4a\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%233f8f22\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'1600\' height=\'900\' fill=\'url(%23sky2)\'/%3E%3Cg fill=\'%23ffffff\' opacity=\'0.92\'%3E%3Cellipse cx=\'220\' cy=\'150\' rx=\'95\' ry=\'28\'/%3E%3Cellipse cx=\'305\' cy=\'142\' rx=\'72\' ry=\'24\'/%3E%3Cellipse cx=\'900\' cy=\'110\' rx=\'115\' ry=\'30\'/%3E%3Cellipse cx=\'1015\' cy=\'126\' rx=\'72\' ry=\'22\'/%3E%3Cellipse cx=\'1350\' cy=\'215\' rx=\'105\' ry=\'27\'/%3E%3Cellipse cx=\'1442\' cy=\'206\' rx=\'62\' ry=\'20\'/%3E%3C/g%3E%3Cpath d=\'M0,640 C260,540 520,600 800,610 C1090,620 1340,520 1600,570 L1600,900 L0,900 Z\' fill=\'url(%23hill)\'/%3E%3Cpath d=\'M0,700 C300,650 560,690 820,680 C1100,670 1360,640 1600,660 L1600,900 L0,900 Z\' fill=\'%233c7d1f\' opacity=\'0.55\'/%3E%3C/svg%3E") no-repeat center center / cover'
  },
  teal: {
    label:"Classic Teal",
    css:"var(--desktop-teal)"
  }
};

var WALLPAPER_KEY = "joshuaos-wallpaper";
var currentWallpaper = "teal";
try{ var savedWp = localStorage.getItem(WALLPAPER_KEY); if(savedWp && WALLPAPERS[savedWp]) currentWallpaper = savedWp; } catch(e){}

function applyWallpaper(key){
  if(!WALLPAPERS[key]) return;
  document.getElementById("desktop").style.background = WALLPAPERS[key].css;
  currentWallpaper = key;
}
applyWallpaper(currentWallpaper);

(function(){
  var win = document.getElementById("win-display");
  var tabs = win.querySelectorAll(".disp-tab");
  tabs.forEach(function(tab){
    tab.addEventListener("click", function(){
      tabs.forEach(function(t){ t.classList.remove("active"); });
      tab.classList.add("active");
      ["background", "screensaver", "appearance"].forEach(function(name){
        document.getElementById("disp-panel-" + name).hidden = (name !== tab.dataset.tab);
      });
    });
  });

  var previewScreen = document.getElementById("disp-preview-screen");
  var listWrap = document.getElementById("disp-wallpaper-list");
  var pendingWallpaper = currentWallpaper;

  function renderWallpaperList(){
    listWrap.innerHTML = "";
    Object.keys(WALLPAPERS).forEach(function(key){
      var wp = WALLPAPERS[key];
      var item = document.createElement("button");
      item.type = "button";
      item.className = "disp-wp-item" + (key === pendingWallpaper ? " active" : "");
      item.innerHTML = '<span class="disp-wp-swatch" style="background:' + wp.css + ';"></span><span>' + wp.label + "</span>";
      item.addEventListener("click", function(){
        pendingWallpaper = key;
        previewScreen.style.background = wp.css;
        listWrap.querySelectorAll(".disp-wp-item").forEach(function(el){ el.classList.remove("active"); });
        item.classList.add("active");
      });
      listWrap.appendChild(item);
    });
  }
  renderWallpaperList();
  previewScreen.style.background = WALLPAPERS[currentWallpaper].css;

  function commitWallpaper(){
    applyWallpaper(pendingWallpaper);
    try{ localStorage.setItem(WALLPAPER_KEY, pendingWallpaper); } catch(e){}
  }
  document.getElementById("disp-apply").addEventListener("click", commitWallpaper);
  document.getElementById("disp-ok").addEventListener("click", function(){
    commitWallpaper();
    closeWindow("display");
  });

  var ssToggle = document.getElementById("ss-enabled-toggle");
  ssToggle.checked = screensaverEnabled;
  ssToggle.addEventListener("change", function(){
    screensaverEnabled = ssToggle.checked;
    try{ localStorage.setItem("joshuaos-screensaver-enabled", ssToggle.checked ? "1" : "0"); } catch(e){}
    resetIdleTimer();
  });
  document.getElementById("ss-preview-btn").addEventListener("click", function(){
    closeWindow("display");
    setTimeout(triggerScreensaver, 260);
  });
  /* the Appearance tab has no JS of its own — it's static copy that
     says so, on purpose (see the markup above). */
})();

/* ============================================================
   WELCOME WINDOW — auto-opens once the desktop is ready (see
   postBootSetup), answers "who is this" before anything else does.
   ============================================================ */
function openWelcomeWindow(){
  openWindow("welcome");
  /* Focus the default dialog button so Enter works like a Win95 msgbox.
     Default is Projects — résumé stays available, not the first shove. */
  var defBtn = document.getElementById("welcome-projects");
  if(defBtn) requestAnimationFrame(function(){ defBtn.focus({preventScroll:true}); });
}
document.getElementById("welcome-projects").addEventListener("click", function(){
  openWindow("projects");
});
document.getElementById("welcome-about").addEventListener("click", function(){
  openWindow("about");
});
document.getElementById("welcome-resume").addEventListener("click", function(){
  openWindow("resume");
});
document.getElementById("win-welcome").addEventListener("keydown", function(e){
  if(e.key !== "Enter") return;
  if(e.target && (e.target.id === "welcome-about" || e.target.id === "welcome-resume")) return;
  if(e.target && e.target.closest && e.target.closest(".welcome-nav")) return;
  e.preventDefault();
  document.getElementById("welcome-projects").click();
});

/* ============================================================
   CONTACT: compose button
   ============================================================ */
document.getElementById("contact-send").addEventListener("click", function(){
  window.location.href = "mailto:joshua.metters@gwu.edu?subject=" + encodeURIComponent("Hello from your Windows 95 site") + "&body=" + encodeURIComponent("Hi Joshua,\n\n");
});

/* ============================================================
   CLOCK
   ============================================================ */
function updateClock(){
  var d = new Date();
  var t = d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
  document.getElementById("clock").textContent = t;
}
updateClock();
setInterval(updateClock, 1000 * 15);

/* ============================================================
   SOUND SYSTEM: synthesized startup chime, system blips, and the
   mute toggle that governs all of it.
   ============================================================ */
var SOUND_KEY = "joshuaos-sound-muted";
var soundMuted = false;
try{ soundMuted = localStorage.getItem(SOUND_KEY) === "1"; } catch(e){}
var soundBtn = document.getElementById("sound-toggle");

function updateSoundBtn(){
  soundBtn.textContent = soundMuted ? "\u{1F507}" : "\u{1F50A}";
  soundBtn.setAttribute("aria-pressed", soundMuted ? "true" : "false");
  soundBtn.title = soundMuted ? "Unmute system sounds" : "Mute system sounds";
}
updateSoundBtn();

soundBtn.addEventListener("click", function(){
  soundMuted = !soundMuted;
  try{ localStorage.setItem(SOUND_KEY, soundMuted ? "1" : "0"); } catch(e){}
  updateSoundBtn();
});

/* short noise-burst impulse response, used to give the boot chime an
   ambient tail — synthesized, not sampled from anywhere */
function makeReverbImpulse(ctx, duration, decay){
  var rate = ctx.sampleRate;
  var length = Math.max(1, Math.floor(rate * duration));
  var impulse = ctx.createBuffer(2, length, rate);
  for(var c = 0; c < 2; c++){
    var data = impulse.getChannelData(c);
    for(var i = 0; i < length; i++){
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

/* An original ambient synth-pad chime in the spirit of mid-90s OS startup
   sounds. Not a reproduction of any specific licensed startup sound (e.g.
   the real Windows 95 chime, a copyrighted Brian Eno composition) — this
   uses a different chord entirely, written fresh. Its overall shape (a
   quick bright "ping" at the very top, a low pad entering just behind it,
   a mid layer a beat later, a high shimmer arriving late and lingering
   into a long reverb tail, ~6.5s total) is informed by spectral analysis
   of that reference sound's timing/envelope — structural facts like pacing
   and register, not its notes or its recording, which are never touched. */
function playChime(){
  if(soundMuted) return;
  try{
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return;
    var ctx = new Ctx();
    var master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    var convolver = ctx.createConvolver();
    convolver.buffer = makeReverbImpulse(ctx, 4.5, 2.1);
    var wetGain = ctx.createGain();
    wetGain.gain.value = 0.55;
    convolver.connect(wetGain).connect(master);

    var dryGain = ctx.createGain();
    dryGain.gain.value = 0.6;
    dryGain.connect(master);

    var now = ctx.currentTime;
    var hasPanner = typeof ctx.createStereoPanner === "function";

    /* one sustained voice: gain ramps up over `attack`, holds at `peak`
       for `hold`, then eases out over `release` — feeds both the dry
       mix and the reverb send. `opts` adds the texture that makes this
       read as an analog pad rather than a plain tone: a lowpass filter
       that opens up over the attack/hold (the "warming up" quality real
       synth pads have), slow chorus-style pitch drift, and stereo width. */
    function voice(freq, start, attack, hold, release, peak, type, opts){
      opts = opts || {};
      var osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;

      var t0 = now + start;
      var t1 = t0 + attack;
      var t2 = t1 + hold;
      var t3 = t2 + release;

      var filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 0.6;
      if(opts.filterFrom != null){
        filter.frequency.setValueAtTime(opts.filterFrom, t0);
        filter.frequency.linearRampToValueAtTime(opts.filterTo, t2);
        filter.frequency.exponentialRampToValueAtTime(Math.max(400, opts.filterTo * 0.55), t3);
      } else {
        filter.frequency.value = 9000; /* effectively bypassed, for the bright ping */
      }

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(peak, t1);
      g.gain.setValueAtTime(peak, t2);
      g.gain.exponentialRampToValueAtTime(0.0001, t3);

      osc.connect(filter).connect(g);

      var out = g;
      if(hasPanner && opts.pan != null){
        var panner = ctx.createStereoPanner();
        panner.pan.value = opts.pan;
        g.connect(panner);
        out = panner;
      }
      out.connect(dryGain);
      out.connect(convolver);

      if(opts.chorus){
        var lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12 + Math.random() * 0.1; /* slow, unsynced drift per voice */
        var lfoGain = ctx.createGain();
        lfoGain.gain.value = 3.5; /* cents of wobble — subtle, not a vibrato */
        lfo.connect(lfoGain).connect(osc.detune);
        lfo.start(t0);
        lfo.stop(t3 + 0.1);
      }

      osc.start(t0);
      osc.stop(t3 + 0.1);
    }

    /* a bright bell-like "ping" right at the top — quick attack, quick
       decay, no filter (kept clean), centered — the sound that opens
       everything else up */
    [1568.0, 1046.5].forEach(function(freq){ /* G6, C6 */
      voice(freq, 0.00, 0.01, 0.05, 0.55, 0.05, "sine", { pan: 0 });
    });

    /* low pad, entering just behind the ping — the warm foundation,
       held the longest, filter opening slowly from muffled to full */
    [{ f:146.83, pan:-0.35 }, { f:220.00, pan:0.35 }].forEach(function(n){ /* D3, A3 */
      [1, 1.004, 0.996].forEach(function(detune, vi){
        voice(n.f * detune, 0.12, 0.35, 1.2, 3.8, 0.045 / (vi + 1), vi === 0 ? "triangle" : "sine",
          { pan: n.pan, chorus: true, filterFrom: 500, filterTo: 2200 });
      });
    });

    /* mid layer, entering a beat later and sitting on top of the pad */
    [{ f:293.66, pan:-0.2 }, { f:369.99, pan:0.2 }].forEach(function(n){ /* D4, F#4 */
      [1, 1.004, 0.996].forEach(function(detune, vi){
        voice(n.f * detune, 0.5, 0.5, 1.8, 3.6, 0.04 / (vi + 1), vi === 0 ? "triangle" : "sine",
          { pan: n.pan, chorus: true, filterFrom: 800, filterTo: 3200 });
      });
    });

    /* high shimmer, arriving late and lingering into the reverb tail */
    [{ f:587.33, pan:-0.15 }, { f:1174.66, pan:0.15 }].forEach(function(n){ /* D5, D6 */
      voice(n.f, 2.2, 0.8, 1.0, 2.4, 0.03, "sine", { pan: n.pan, chorus: true });
    });

    setTimeout(function(){ if(ctx.close) ctx.close(); }, 6800);
  } catch(e){ /* autoplay/audio restrictions — fail silently */ }
}

/* one-off short tone, the building block for every other system sound */
function playTone(freq, duration, opts){
  if(soundMuted) return;
  opts = opts || {};
  try{
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return;
    var ctx = new Ctx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = opts.type || "sine";
    osc.frequency.value = freq;
    var vol = opts.volume || 0.07;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
    setTimeout(function(){ if(ctx.close) ctx.close(); }, (duration + 0.1) * 1000);
  } catch(e){ /* fail silently */ }
}
function playClickSound(){ playTone(720, 0.045, { type:"square", volume:0.045 }); }
function playCloseSound(){ playTone(360, 0.06, { type:"square", volume:0.045 }); }
function playErrorDing(){
  playTone(440, 0.12, { volume:0.08 });
  setTimeout(function(){ playTone(330, 0.16, { volume:0.08 }); }, 90);
}
function playWinTune(){
  [523.25, 659.25, 783.99].forEach(function(freq, i){
    setTimeout(function(){ playTone(freq, 0.14, { type:"square", volume:0.06 }); }, i * 90);
  });
}
function playLoseTone(){ playTone(160, 0.35, { type:"sawtooth", volume:0.06 }); }

/* ============================================================
   PLAIN-TEXT ACCESSIBLE VIEW (also the print/PDF source, see
   the @media print rules in <style>)
   ============================================================ */
var plainView = document.getElementById("plain-view");
var desktopEl = document.getElementById("desktop");

/* Same EXPERIENCE array that feeds Experience.exe and the Notepad
   résumé — one dataset, three renderings, no drift between them. */
(function(){
  var wrap = document.getElementById("plain-exp-list");
  if(!wrap) return;
  var html = "";
  EXPERIENCE.forEach(function(job){
    var orgHTML = job.url
      ? '<a href="' + job.url + '" target="_blank" rel="noopener">' + job.org + "</a>"
      : job.org;
    html += "<h3>" + job.role + " &mdash; " + orgHTML + "</h3>";
    html += '<p class="plain-meta">' + job.date.replace(/-/g, "&ndash;") + "</p>";
    html += "<ul>" + job.bullets.map(function(b){ return "<li>" + b + "</li>"; }).join("") + "</ul>";
  });
  wrap.innerHTML = html;
})();

function showPlain(){
  finishBoot(false);
  plainView.classList.add("visible");
  desktopEl.style.display = "none";
  var back = document.getElementById("plain-view-back");
  if(back) back.focus();
}
function hidePlain(){
  plainView.classList.remove("visible");
  desktopEl.style.display = "";
}
document.getElementById("skip-to-plain").addEventListener("click", function(e){ e.preventDefault(); showPlain(); });
document.getElementById("plain-view-toggle").addEventListener("click", function(e){ e.preventDefault(); showPlain(); });
document.getElementById("plain-view-back").addEventListener("click", function(e){ e.preventDefault(); hidePlain(); });

/* ============================================================
   IDLE SCREENSAVER EASTER EGG — flying pixel icons, reusing the same
   pixelSVG renderer already used everywhere else on the desktop.
   ============================================================ */
var IDLE_TIMEOUT = 90000;
var idleTimer = null;
var ssFrame = null;
var ssIcons = [];
var screensaverEnabled = true;
try{ screensaverEnabled = localStorage.getItem("joshuaos-screensaver-enabled") !== "0"; } catch(e){}

function resetIdleTimer(){
  if(idleTimer) clearTimeout(idleTimer);
  if(reducedMotion || !screensaverEnabled) return; /* no auto-triggered motion for this visitor, full stop */
  idleTimer = setTimeout(triggerScreensaver, IDLE_TIMEOUT);
}

function triggerScreensaver(){
  if(!bootScreenEl.hidden) return;               /* still booting */
  if(!shutdownScreen.hidden) return;              /* mid shutdown gag */
  if(!bsodScreen.hidden) return;                  /* mid BSOD gag */
  if(!msgOverlay.hidden) return;                  /* a dialog is open */
  if(startMenu.classList.contains("open")) return;
  if(plainView.classList.contains("visible")) return; /* mobile / a11y view */

  var ss = document.getElementById("screensaver");
  ss.innerHTML = "";
  var clockEl = document.createElement("div");
  clockEl.className = "ss-clock";
  ss.appendChild(clockEl);

  var iconIds = ["doc","folder","book","gear","mail","bin","computer","bomb","chart","flag","person"];
  var vw = window.innerWidth, vh = window.innerHeight;
  ssIcons = [];
  for(var i = 0; i < 7; i++){
    var id = iconIds[Math.floor(Math.random() * iconIds.length)];
    var size = 28 + Math.floor(Math.random() * 20);
    var el = document.createElement("div");
    el.className = "ss-icon";
    el.innerHTML = pixelSVG(id, Math.round(size / 8));
    ss.appendChild(el);
    ssIcons.push({
      el: el, size: size,
      x: Math.random() * Math.max(0, vw - size),
      y: Math.random() * Math.max(0, vh - size),
      dx: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.2),
      dy: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.2)
    });
  }
  ss.hidden = false;

  function tick(){
    var w = window.innerWidth, h = window.innerHeight;
    ssIcons.forEach(function(ic){
      ic.x += ic.dx; ic.y += ic.dy;
      if(ic.x <= 0 || ic.x >= w - ic.size) ic.dx *= -1;
      if(ic.y <= 0 || ic.y >= h - ic.size) ic.dy *= -1;
      ic.x = Math.max(0, Math.min(ic.x, w - ic.size));
      ic.y = Math.max(0, Math.min(ic.y, h - ic.size));
      ic.el.style.transform = "translate(" + ic.x + "px," + ic.y + "px)";
    });
    clockEl.textContent = new Date().toLocaleTimeString([], { hour:"numeric", minute:"2-digit", second:"2-digit" });
    ssFrame = requestAnimationFrame(tick);
  }
  ssFrame = requestAnimationFrame(tick);
}

function dismissScreensaver(){
  var ss = document.getElementById("screensaver");
  if(ss.hidden) return;
  ss.hidden = true;
  if(ssFrame) cancelAnimationFrame(ssFrame);
  ssFrame = null;
  ss.innerHTML = "";
  unlockAchievement("screensaver"); /* awarded on return, so the toast is actually seen */
}

["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach(function(evt){
  document.addEventListener(evt, function(){
    dismissScreensaver();
    resetIdleTimer();
  }, { passive:true });
});
resetIdleTimer(); /* arm the very first countdown, not just re-arms after activity */

/* ============================================================
   BSOD EASTER EGG — a brief, obviously-fake crash screen. Skipped
   outright for reduced-motion visitors per the spec; it's a joke, not
   something anyone should have sprung on them.
   ============================================================ */
var bsodScreen = document.getElementById("bsod-screen");
function showBsod(){
  if(reducedMotion) return;
  bsodScreen.hidden = false;
  playLoseTone();
  unlockAchievement("bsod");
  var dismissed = false;
  function dismiss(){
    if(dismissed) return;
    dismissed = true;
    bsodScreen.hidden = true;
    document.removeEventListener("keydown", dismiss);
    bsodScreen.removeEventListener("click", dismiss);
  }
  document.addEventListener("keydown", dismiss);
  bsodScreen.addEventListener("click", dismiss);
  setTimeout(dismiss, 2600);
}
(function(){
  var trigger = document.getElementById("extras-corrupted");
  if(!trigger) return;
  trigger.addEventListener("click", function(){ showBsod(); });
})();

/* ============================================================
   MINESWEEPER
   ============================================================ */
var MINE_ROWS = 9, MINE_COLS = 9, MINE_COUNT = 10;
var mineState = null;

function buildMinefield(safeIdx){
  var total = MINE_ROWS * MINE_COLS;
  var cells = [];
  for(var i=0;i<total;i++) cells.push({ mine:false, revealed:false, flagged:false, adj:0 });
  var placed = 0;
  while(placed < MINE_COUNT){
    var idx = Math.floor(Math.random() * total);
    if(idx === safeIdx || cells[idx].mine) continue;
    cells[idx].mine = true; placed++;
  }
  function neighbors(idx){
    var r = Math.floor(idx / MINE_COLS), c = idx % MINE_COLS, out = [];
    for(var dr=-1; dr<=1; dr++){
      for(var dc=-1; dc<=1; dc++){
        if(dr===0 && dc===0) continue;
        var nr = r+dr, nc = c+dc;
        if(nr>=0 && nr<MINE_ROWS && nc>=0 && nc<MINE_COLS) out.push(nr*MINE_COLS+nc);
      }
    }
    return out;
  }
  cells.forEach(function(cell, idx){
    if(cell.mine) return;
    cell.adj = neighbors(idx).filter(function(n){ return cells[n].mine; }).length;
  });
  return { cells:cells, neighbors:neighbors };
}

function renderMinefield(){
  var grid = document.getElementById("mine-grid");
  grid.style.gridTemplateColumns = "repeat(" + MINE_COLS + ", 22px)";
  grid.innerHTML = "";
  mineState.field.cells.forEach(function(cell, idx){
    var btn = document.createElement("button");
    btn.className = "mine-cell hidden";
    btn.dataset.idx = idx;
    grid.appendChild(btn);
  });
}

function startMinesweeper(){
  mineState = { field:null, started:false, over:false, timer:0, timerId:null, flags:0 };
  var placeholder = [];
  for(var i=0;i<MINE_ROWS*MINE_COLS;i++) placeholder.push({mine:false,revealed:false,flagged:false,adj:0});
  mineState.field = { cells:placeholder };
  renderMinefield();
  document.getElementById("mine-count").textContent = String(MINE_COUNT).padStart(3,"0");
  document.getElementById("mine-timer").textContent = "000";
  document.getElementById("mine-face").textContent = "\u{1F642}";
  document.getElementById("mine-msg").textContent = "";
  if(mineState.timerId) clearInterval(mineState.timerId);
}

function mineCellEl(idx){ return document.querySelector('.mine-cell[data-idx="'+idx+'"]'); }

function revealFlood(idx){
  var field = mineState.field;
  var stack = [idx];
  while(stack.length){
    var i = stack.pop();
    var cell = field.cells[i];
    if(cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    var el = mineCellEl(i);
    el.classList.remove("hidden");
    el.classList.add("revealed");
    if(cell.adj > 0){
      el.textContent = cell.adj;
      var colors = ["", "#0000ff", "#008000", "#ff0000", "#000080", "#800000", "#008080", "#000000", "#808080"];
      el.style.color = colors[cell.adj] || "#000";
    } else if(field.neighbors){
      field.neighbors(i).forEach(function(n){ if(!field.cells[n].revealed) stack.push(n); });
    }
  }
}

function checkWin(){
  var field = mineState.field;
  var allSafeRevealed = field.cells.every(function(c){ return c.mine || c.revealed; });
  if(allSafeRevealed){
    mineState.over = true;
    clearInterval(mineState.timerId);
    document.getElementById("mine-face").textContent = "\u{1F60E}";
    document.getElementById("mine-msg").textContent = "You win! Nicely swept.";
    document.getElementById("mine-count").textContent = "000";
    playWinTune();
    unlockAchievement("mine-win");
  }
}

function loseMines(hitIdx){
  mineState.over = true;
  clearInterval(mineState.timerId);
  document.getElementById("mine-face").textContent = "\u{1F635}";
  document.getElementById("mine-msg").textContent = "Boom. Click the face to try again.";
  playLoseTone();
  mineState.field.cells.forEach(function(c, i){
    if(c.mine){
      var el = mineCellEl(i);
      el.classList.remove("hidden");
      el.classList.add("revealed", i === hitIdx ? "mine" : "");
      el.textContent = "\u{1F4A3}";
    }
  });
}

document.getElementById("mine-grid").addEventListener("click", function(e){
  var el = e.target.closest(".mine-cell");
  if(!el || !mineState || mineState.over) return;
  var idx = Number(el.dataset.idx);
  var field = mineState.field;
  var cell = field.cells[idx];
  if(cell.flagged || cell.revealed) return;

  if(!mineState.started){
    mineState.started = true;
    mineState.field = buildMinefield(idx);
    field = mineState.field;
    renderMinefield();
    el = mineCellEl(idx);
    mineState.timerId = setInterval(function(){
      mineState.timer++;
      document.getElementById("mine-timer").textContent = String(Math.min(999, mineState.timer)).padStart(3,"0");
    }, 1000);
  }

  cell = field.cells[idx];
  if(cell.mine){
    var elm = mineCellEl(idx);
    elm.classList.remove("hidden"); elm.classList.add("revealed","mine");
    elm.textContent = "\u{1F4A3}";
    loseMines(idx);
    return;
  }
  revealFlood(idx);
  checkWin();
});

document.getElementById("mine-grid").addEventListener("contextmenu", function(e){
  e.preventDefault();
  if(!mineState || mineState.over) return;
  var el = e.target.closest(".mine-cell");
  if(!el) return;
  var idx = Number(el.dataset.idx);
  var cell = mineState.field.cells[idx];
  if(!cell || cell.revealed) return;
  cell.flagged = !cell.flagged;
  el.textContent = cell.flagged ? "\u{1F6A9}" : "";
  var remaining = MINE_COUNT - mineState.field.cells.filter(function(c){ return c.flagged; }).length;
  document.getElementById("mine-count").textContent = String(Math.max(0, remaining)).padStart(3,"0");
});

document.getElementById("mine-face").addEventListener("click", startMinesweeper);

/* ============================================================
   HISTORY BOWL TRIVIA — three questions, styled after the Minesweeper
   HUD (counter + a face that reacts to right/wrong answers).
   ============================================================ */
var quizState = { idx:0, score:0, answered:false };

function renderQuiz(){
  var item = QUIZ[quizState.idx];
  document.getElementById("quiz-count").textContent = "Q" + (quizState.idx + 1) + "/" + QUIZ.length;
  document.getElementById("quiz-score").textContent = quizState.score;
  document.getElementById("quiz-face").textContent = "\u{1F642}";
  document.getElementById("quiz-question").textContent = item.q;
  document.getElementById("quiz-msg").textContent = "";
  quizState.answered = false;

  var opts = document.getElementById("quiz-options");
  opts.innerHTML = "";
  item.options.forEach(function(label, i){
    var btn = document.createElement("button");
    btn.className = "quiz-opt raised";
    btn.textContent = label;
    btn.addEventListener("click", function(){ answerQuiz(i, btn); });
    opts.appendChild(btn);
  });
}

function answerQuiz(i, btn){
  if(quizState.answered) return;
  quizState.answered = true;
  var item = QUIZ[quizState.idx];
  var correct = i === item.correct;
  if(correct) quizState.score++;

  document.querySelectorAll("#quiz-options .quiz-opt").forEach(function(el, idx){
    if(idx === item.correct) el.classList.add("correct");
    else if(el === btn) el.classList.add("wrong");
  });
  document.getElementById("quiz-face").textContent = correct ? "\u{1F60E}" : "\u{1F635}";
  document.getElementById("quiz-msg").textContent = correct ? "Correct." : "Not quite.";
  document.getElementById("quiz-score").textContent = quizState.score;
  if(correct) playTone(880, 0.1, { type:"square", volume:0.05 }); else playLoseTone();

  setTimeout(function(){
    if(quizState.idx < QUIZ.length - 1){
      quizState.idx++;
      renderQuiz();
    } else {
      document.getElementById("quiz-question").textContent =
        "Final score: " + quizState.score + " / " + QUIZ.length + ".";
      document.getElementById("quiz-options").innerHTML = "";
      document.getElementById("quiz-msg").textContent = "Click Game > New Round to try again.";
      document.getElementById("quiz-face").textContent = quizState.score === QUIZ.length ? "\u{1F60E}" : "\u{1F642}";
    }
  }, 900);
}

function startQuiz(){
  quizState = { idx:0, score:0, answered:false };
  renderQuiz();
}
startQuiz();

/* ============================================================
   MY WRITING — auto-loads the latest posts from Substack's RSS
   feed. Browsers block a direct cross-origin fetch of most RSS
   feeds (no CORS header — they're built for feed readers, not
   client JS), so this tries direct first, falls back to a public
   CORS proxy, and only shows a "visit Substack directly" message
   if both fail. Fetched once, the first time the window opens.
   ============================================================ */
var SUBSTACK_URL = "https://joshmetters.substack.com";
var SUBSTACK_FEED = SUBSTACK_URL + "/feed";
var CORS_PROXY = "https://api.allorigins.win/raw?url=";
var writingLoaded = false;

function parseSubstackRSS(xmlText){
  var doc = new DOMParser().parseFromString(xmlText, "text/xml");
  if(doc.querySelector("parsererror")) return null;
  return Array.prototype.slice.call(doc.querySelectorAll("item")).map(function(el){
    var t = el.querySelector("title"), l = el.querySelector("link"), p = el.querySelector("pubDate");
    return {
      title: t ? t.textContent : "Untitled",
      link: l ? l.textContent : SUBSTACK_URL,
      pubDate: p ? p.textContent : ""
    };
  });
}

function renderWritingPosts(items){
  var list = document.getElementById("writing-list");
  var count = document.getElementById("writing-count");
  if(!items || !items.length){
    list.innerHTML = '<div class="writing-status">No posts published yet on Substack &mdash; check back soon, or read directly on <a href="' + SUBSTACK_URL + '" target="_blank" rel="noopener">joshmetters.substack.com</a>.</div>';
    count.textContent = "0 posts";
    return;
  }
  list.innerHTML = "";
  items.slice(0, 12).forEach(function(item){
    var a = document.createElement("a");
    a.className = "writing-post";
    a.href = item.link;
    a.target = "_blank";
    a.rel = "noopener";
    var dateStr = "";
    var d = item.pubDate ? new Date(item.pubDate) : null;
    if(d && !isNaN(d)) dateStr = d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
    a.innerHTML = '<span class="writing-post-title">' + item.title + ' &#8599;</span>' + (dateStr ? '<span class="writing-post-date">' + dateStr + '</span>' : "");
    list.appendChild(a);
  });
  count.textContent = items.length + " post(s)";
}

function renderWritingFallback(){
  var list = document.getElementById("writing-list");
  var count = document.getElementById("writing-count");
  list.innerHTML = '<div class="writing-status">Couldn&rsquo;t load the live feed from here. Read directly on <a href="' + SUBSTACK_URL + '" target="_blank" rel="noopener">joshmetters.substack.com</a>.</div>';
  count.textContent = "Feed unavailable";
}

function loadWritingFeed(){
  if(writingLoaded) return;
  writingLoaded = true;
  fetch(SUBSTACK_FEED)
    .then(function(r){ if(!r.ok) throw new Error("bad status"); return r.text(); })
    .then(function(text){
      var items = parseSubstackRSS(text);
      if(items === null) throw new Error("parse failed");
      renderWritingPosts(items);
    })
    .catch(function(){
      fetch(CORS_PROXY + encodeURIComponent(SUBSTACK_FEED))
        .then(function(r){ if(!r.ok) throw new Error("proxy bad status"); return r.text(); })
        .then(function(text){
          var items = parseSubstackRSS(text);
          if(items === null) throw new Error("proxy parse failed");
          renderWritingPosts(items);
        })
        .catch(renderWritingFallback);
    });
}

/* ============================================================
   MEDIA PLAYER — three original chiptune loops synthesized live
   with WebAudio (square lead, triangle bass, 16th-note step
   sequencer), plus a bring-your-own YouTube embed slot. The
   built-in tracks are original compositions, not covers — nothing
   here needs licensing or a streaming connection.
   ============================================================ */
var CHIPTUNES = [
  { name:"Teal Dreams", bpm:132,
    lead:[72,0,76,0, 79,0,76,0, 81,0,79,0, 76,0,72,0, 74,0,77,0, 81,0,77,0, 79,0,76,0, 72,0,67,0],
    bass:[48,0,0,0, 43,0,0,0, 45,0,0,0, 41,0,0,0, 48,0,0,0, 43,0,0,0, 45,0,0,0, 43,0,0,0] },
  { name:"Dial-Up Nights", bpm:96,
    lead:[69,0,0,72, 0,0,76,0, 74,0,0,72, 0,0,69,0, 67,0,0,64, 0,0,67,0, 69,0,0,0, 0,0,64,0],
    bass:[45,0,0,0, 40,0,0,0, 41,0,0,0, 43,0,0,0, 45,0,0,0, 40,0,0,0, 41,0,0,0, 43,0,0,0] },
  { name:"Ship It", bpm:144,
    lead:[65,0,69,0, 72,0,69,0, 77,0,76,0, 72,0,69,0, 74,0,72,0, 70,0,69,0, 65,0,60,0, 65,0,0,0],
    bass:[41,0,0,41, 46,0,0,46, 48,0,0,48, 43,0,0,43, 41,0,0,41, 46,0,0,46, 48,0,0,48, 43,0,0,43] }
];

var mediaState = { ctx:null, playing:false, trackIdx:0, step:0, nextStepTime:0, timerId:null, lcdId:null, startedAt:0 };

function midiToFreq(m){ return 440 * Math.pow(2, (m - 69) / 12); }

function scheduleChipNote(midi, when, dur, type, vol){
  var ctx = mediaState.ctx;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = midiToFreq(midi);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(vol, when + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.92);
  osc.connect(gain).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur);
}

function mediaScheduler(){
  var track = CHIPTUNES[mediaState.trackIdx];
  var stepDur = 60 / track.bpm / 4;
  while(mediaState.nextStepTime < mediaState.ctx.currentTime + 0.18){
    var s = mediaState.step % track.lead.length;
    if(track.lead[s]) scheduleChipNote(track.lead[s], mediaState.nextStepTime, stepDur * 1.8, "square", 0.045);
    if(track.bass[s]) scheduleChipNote(track.bass[s], mediaState.nextStepTime, stepDur * 3.2, "triangle", 0.085);
    mediaState.nextStepTime += stepDur;
    mediaState.step++;
  }
}

function updateMediaLCD(){
  var title = document.getElementById("media-lcd-title");
  var time = document.getElementById("media-lcd-time");
  if(mediaState.playing){
    title.textContent = "▶ " + CHIPTUNES[mediaState.trackIdx].name;
    var elapsed = Math.floor(mediaState.ctx.currentTime - mediaState.startedAt);
    time.textContent = String(Math.floor(elapsed / 60)).padStart(2, "0") + ":" + String(elapsed % 60).padStart(2, "0");
  } else {
    title.textContent = "■ stopped";
    time.textContent = "00:00";
  }
  document.querySelectorAll(".media-track").forEach(function(el, i){
    el.classList.toggle("playing", mediaState.playing && i === mediaState.trackIdx);
  });
  document.getElementById("media-play").innerHTML = mediaState.playing ? "&#9632;" : "&#9654;";
}

function playMusic(idx){
  stopMusic();
  try{
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return;
    if(!mediaState.ctx || mediaState.ctx.state === "closed") mediaState.ctx = new Ctx();
    if(mediaState.ctx.state === "suspended") mediaState.ctx.resume();
    mediaState.trackIdx = idx;
    mediaState.playing = true;
    mediaState.step = 0;
    mediaState.nextStepTime = mediaState.ctx.currentTime + 0.06;
    mediaState.startedAt = mediaState.ctx.currentTime;
    mediaState.timerId = setInterval(mediaScheduler, 60);
    mediaState.lcdId = setInterval(updateMediaLCD, 500);
  } catch(e){ /* audio unavailable — leave the player stopped */ }
  updateMediaLCD();
}

function stopMusic(){
  if(mediaState.timerId) clearInterval(mediaState.timerId);
  if(mediaState.lcdId) clearInterval(mediaState.lcdId);
  mediaState.timerId = mediaState.lcdId = null;
  mediaState.playing = false;
  updateMediaLCD();
}

(function(){
  var list = document.getElementById("media-tracklist");
  if(!list) return;
  CHIPTUNES.forEach(function(track, i){
    var btn = document.createElement("button");
    btn.className = "media-track";
    btn.innerHTML = '<span class="mt-num">' + (i + 1) + '</span><span>' + track.name + '</span><span class="mt-len">loop</span>';
    btn.addEventListener("click", function(){
      if(mediaState.playing && mediaState.trackIdx === i) stopMusic();
      else playMusic(i);
    });
    list.appendChild(btn);
  });
  document.getElementById("media-play").addEventListener("click", function(){
    if(mediaState.playing) stopMusic(); else playMusic(mediaState.trackIdx);
  });
  document.getElementById("media-prev").addEventListener("click", function(){
    playMusic((mediaState.trackIdx + CHIPTUNES.length - 1) % CHIPTUNES.length);
  });
  document.getElementById("media-next").addEventListener("click", function(){
    playMusic((mediaState.trackIdx + 1) % CHIPTUNES.length);
  });
})();

/* bring-your-own: paste a YouTube watch/short/playlist link, get the
   standard YouTube embed inside the window. (Blocked by CSP in the
   private Artifact preview; works on the real hosted site.) */
function parseYouTube(url){
  var m = url.match(/[?&]list=([\w-]+)/);
  if(m) return "https://www.youtube.com/embed/videoseries?list=" + m[1];
  m = url.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{6,})/);
  if(m) return "https://www.youtube.com/embed/" + m[1];
  return null;
}
(function(){
  var input = document.getElementById("media-yt-input");
  var frame = document.getElementById("media-yt-frame");
  var note = document.getElementById("media-yt-note");
  if(!input) return;
  function loadYT(){
    var src = parseYouTube(input.value.trim());
    if(!src){
      alertBox("Media Player", "That doesn't look like a YouTube link. Try a watch, share, or playlist URL.");
      return;
    }
    stopMusic(); /* one thing plays at a time */
    frame.innerHTML = "";
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "YouTube player";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");
    frame.appendChild(iframe);
    note.textContent = "If the video stays blank you're viewing the private Artifact preview, which blocks external embeds. It works on the real site.";
  }
  document.getElementById("media-yt-load").addEventListener("click", loadYT);
  input.addEventListener("keydown", function(e){ if(e.key === "Enter") loadYT(); });
})();

/* ============================================================
   ACHIEVEMENT TOASTS — Win95-style balloons for finding the fun
   parts. Unlocks persist in localStorage; each toast shows once.
   ============================================================ */
var ACHIEVEMENTS = {
  "bsod":        { title:"Achievement unlocked", text:"\u{1F3C6} Crashed the computer. It's fine. It was decorative." },
  "mine-win":    { title:"Achievement unlocked", text:"\u{1F3C6} Swept clean — beat Minesweeper on a résumé site." },
  "konami":      { title:"Cheat mode activated", text:"\u{1F3C6} +30 lives. They cannot be used for anything." },
  "screensaver": { title:"Achievement unlocked", text:"\u{1F3C6} Left long enough for the screensaver. Welcome back." },
  "clip-deny":   { title:"Achievement unlocked", text:"\u{1F3C6} Declined help from a paperclip. Historically accurate." }
};
var ACH_KEY = "joshuaos-achievements";

function unlockAchievement(id){
  var unlocked = {};
  try{ unlocked = JSON.parse(localStorage.getItem(ACH_KEY) || "{}"); } catch(e){}
  if(unlocked[id]) return;
  unlocked[id] = true;
  try{ localStorage.setItem(ACH_KEY, JSON.stringify(unlocked)); } catch(e){}
  var a = ACHIEVEMENTS[id];
  if(!a) return;
  var toast = document.createElement("div");
  toast.className = "toast raised";
  toast.innerHTML = '<span class="icon-slot" data-icon="star"></span><div><b>'+a.title+'</b>'+a.text+'</div>';
  renderIcons(toast);
  document.getElementById("toast-stack").appendChild(toast);
  playWinTune();
  var gone = false;
  function dismissToast(){
    if(gone) return; gone = true;
    if(reducedMotion || !toast.animate){ toast.remove(); return; }
    var anim = toast.animate([{opacity:1},{opacity:0}], {duration:250, easing:"ease-in"});
    anim.onfinish = function(){ toast.remove(); };
  }
  toast.addEventListener("click", dismissToast);
  setTimeout(dismissToast, 6000);
}

/* ============================================================
   KONAMI CODE — ↑↑↓↓←→←→BA
   ============================================================ */
var KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
var konamiPos = 0;
document.addEventListener("keydown", function(e){
  var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if(key === KONAMI[konamiPos]){
    konamiPos++;
    if(konamiPos === KONAMI.length){
      konamiPos = 0;
      unlockAchievement("konami");
      if(!reducedMotion){
        var desk = document.getElementById("desktop");
        desk.style.transition = "filter .3s ease";
        desk.style.filter = "hue-rotate(180deg)";
        setTimeout(function(){ desk.style.filter = ""; }, 2000);
      }
    }
  } else {
    konamiPos = key === KONAMI[0] ? 1 : 0;
  }
});

/* ============================================================
   HIT COUNTER — the classic GeoCities gag. There's no server, so
   the number is a deterministic date-seeded base plus this
   browser's own visit count: proudly fake, like the originals
   mostly were.
   ============================================================ */
(function(){
  var el = document.getElementById("hit-digits");
  if(!el) return;
  var visits = 0;
  try{
    visits = parseInt(localStorage.getItem("joshuaos-visits") || "0", 10) + 1;
    localStorage.setItem("joshuaos-visits", String(visits));
  } catch(e){ visits = 1; }
  var daysSinceLaunch = Math.max(0, Math.floor((Date.now() - Date.UTC(2026, 7, 1)) / 86400000));
  var count = 137 + daysSinceLaunch * 3 + visits;
  String(count).padStart(6, "0").split("").forEach(function(d){
    var s = document.createElement("span");
    s.textContent = d;
    el.appendChild(s);
  });
})();

/* ============================================================
   ASSISTANT — pops up once per session with one unhelpful
   observation. Dismissing it is itself an achievement.
   ============================================================ */
var ASSISTANT_LINES = [
  "It looks like you're trying to hire someone. Would you like help?",
  "It looks like you're reading a résumé. I can make this window smaller if that helps.",
  "Tip: the candidate built this entire operating system instead of using a website template. Make of that what you will.",
  "It looks like you're procrastinating. Minesweeper is in the Extras folder."
];
(function(){
  var assistant = document.getElementById("assistant");
  var shown = false;
  try{ shown = sessionStorage.getItem("joshuaos-assistant-shown") === "1"; } catch(e){}
  if(shown) return;
  setTimeout(function(){
    if(plainView.classList.contains("visible")) return; /* not over the a11y view */
    if(!bootScreen.hidden) return;
    document.getElementById("assistant-text").textContent =
      ASSISTANT_LINES[Math.floor(Math.random() * ASSISTANT_LINES.length)];
    assistant.classList.add("visible");
    try{ sessionStorage.setItem("joshuaos-assistant-shown", "1"); } catch(e){}
    playClickSound();
  }, 40000);
  document.getElementById("assistant-dismiss").addEventListener("click", function(){
    assistant.classList.remove("visible");
    unlockAchievement("clip-deny");
  });
})();

/* ============================================================
   ICON RENDER + BOOT KICKOFF
   ============================================================ */
renderIcons(document);

/* Everyone gets the full boot sequence and Welcome.exe afterward.
   Narrow viewports still get fullscreen windows via CSS; the plain-text
   résumé remains available from the skip link / taskbar toggle. */
var isMobileDefault = window.matchMedia("(max-width:760px)").matches;
var bootScreen = document.getElementById("boot-screen");

/* The joke lands once per tab session, not on every reload. */
var skipBootAnimation = false;
try{ skipBootAnimation = sessionStorage.getItem("joshuaos-booted") === "1"; } catch(e){}
try{ sessionStorage.setItem("joshuaos-booted", "1"); } catch(e){}

if(skipBootAnimation){
  finishBoot(false, true);
} else {
  typeBoot();
  bootScreen.addEventListener("click", function(){ finishBoot(true); });
  document.addEventListener("keydown", function(e){
    if(!bootScreen.hidden) finishBoot(true);
  });
  setTimeout(function(){ finishBoot(false); }, 2800);
  /* Fallback gesture: if boot auto-advances before the visitor clicks or
     types on it, catch their very next interaction anywhere on the page
     — an icon click, a button, a keypress — and use that instead. */
  ["pointerdown","keydown"].forEach(function(evt){
    document.addEventListener(evt, tryPlayChime, { once:true, passive:true });
  });
}

/* init minesweeper board (unstarted) once desktop is ready */
startMinesweeper();

})();
