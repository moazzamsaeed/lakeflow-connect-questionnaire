# Lakeflow Connect Pre-flight Checklist — Runbook

Operational reference for the developer / SA maintaining this project.
Keep this file current when commands, URLs, or architecture change.

---

## 1. Quick reference

| What | Where |
|---|---|
| Live site | https://moazzamsaeed.github.io/lakeflow-connect-preflight-checklist/ |
| Source repo | https://github.com/moazzamsaeed/lakeflow-connect-preflight-checklist |
| Local working tree | `/Users/moazzam.saeed/Documents/projects/lakeflow-connect/lakeflow-connect-preflight-checklist` |
| Default branch | `main` |
| Deploy branch | `gh-pages` (force-pushed by the deploy script) |
| Pages source | Branch `gh-pages` / path `/` (legacy build type) |
| Dev server port | 5179 |
| GitHub Pages base path | `/lakeflow-connect-preflight-checklist/` |

---

## 2. Stack

- **React 18 + Vite 5**, single-file app (`src/App.jsx`)
- **No backend, no auth, no analytics.** Every form value lives in
  the browser tab.
- **jsPDF** (dynamic-imported) for client-side PDF generation
- **DM Sans + JetBrains Mono** fonts via Google Fonts CDN
- **GitHub Pages** static hosting (no CI/CD — deploy is a local script)

---

## 3. Local development

```sh
cd /Users/moazzam.saeed/Documents/projects/lakeflow-connect/lakeflow-connect-preflight-checklist
npm install        # one-time, or after package.json changes
npm run dev        # vite dev server on http://localhost:5179/lakeflow-connect-preflight-checklist/
```

The dev server respects the same `base: "/lakeflow-connect-preflight-checklist/"`
config as production, so the local URL must include that path prefix.

```sh
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to sanity-check the build
```

### Stopping a stuck dev server

```sh
lsof -nP -iTCP:5179 -sTCP:LISTEN   # find the PID
kill <pid>
```

---

## 4. Deploying to GitHub Pages

One command:

```sh
npm run deploy
```

What that runs (see `scripts/deploy.sh`):

1. `npm run build` → produces `dist/`
2. `touch dist/.nojekyll` so GitHub doesn't try to Jekyll-process it
3. `git init` inside `dist/`, commit, force-push to `origin gh-pages`
4. Remove the temporary `.git` from `dist/`
5. GitHub Pages auto-rebuilds in ~30s once `gh-pages` updates.

### Forcing a Pages rebuild manually

```sh
gh api -X POST /repos/moazzamsaeed/lakeflow-connect-preflight-checklist/pages/builds
```

### Switching Pages source

Currently set to the `gh-pages` branch:

```sh
gh api /repos/moazzamsaeed/lakeflow-connect-preflight-checklist/pages -q '.source'
# {"branch":"gh-pages","path":"/"}
```

If you ever want to switch back to GitHub Actions:

```sh
gh api -X PUT /repos/moazzamsaeed/lakeflow-connect-preflight-checklist/pages \
  -F build_type=workflow
```

There is a workflow at `.github/workflows/deploy.yml` that does the
same thing in CI, but it's been historically flaky on `npm install`
hangs — the local `npm run deploy` script is the reliable path.

### Why we don't use the GitHub Actions workflow

`npm install` repeatedly hung 8+ minutes on the GH-Actions runner with
"Exit handler never called". Switching to local deploy avoids the runner
entirely. The workflow file is kept for future re-enablement.

---

## 5. Repository layout

```
.
├── RUNBOOK.md              ← this file
├── index.html              vite entry — embeds /src/main.jsx
├── vite.config.js          base path + react plugin + alias stubs
├── package.json            npm scripts incl. `deploy`
├── scripts/
│   └── deploy.sh           build + force-push to gh-pages
├── src/
│   ├── main.jsx            React 18 root
│   ├── App.jsx             ENTIRE app — wizard, generators, exports
│   ├── styles.css          all CSS
│   └── empty.js            no-op stub aliased to html2canvas / dompurify
├── dist/                   build output (gitignored)
└── .github/workflows/
    └── deploy.yml          CI variant of the deploy (currently bypassed)
```

`src/App.jsx` is intentionally monolithic — easy to grep, easy to
refactor later. Major sections are separated by `/* ─── ... ─── */`
banners.

---

## 6. Architecture overview

### Wizard flow (7 steps)

| # | Step | State field |
|---|---|---|
| 0 | Source category | `state.connectorCategory` |
| 1 | Connector | `state.connector` |
| 2 | Cloud | `state.cloud` |
| 3 | Source location | `state.sourceLocation` |
| 4 | Network | `state.networkModel` |
| 5 | Auth | `state.authMethod` |
| 6 | Results | (derived) |

State is held in a single `state` object in `App()`. There's an
auto-set side-effect: picking a SaaS connector auto-fills source
location to `saas`. Zerobus producers explicitly pick where the
producer runs.

### Data definitions

- `CONNECTORS` — every connector keyed by id. Fields:
  `label`, `icon`, `status`, `defaultPorts`, `authMethods`,
  `supportsPrivateLink`, `category`, `cdcMethod?`, `minVersion?`,
  `platforms`, `docsUrl`.
- `CONNECTOR_CATEGORIES` — the 5 category cards (Database, Query,
  SaaS, Streaming, Community).
- `CLOUDS` — AWS / Azure / GCP.
- `SOURCE_LOCATIONS` — same_cloud / different_cloud / on_prem / saas.
- `NETWORK_MODELS` — Private Link, VNet peering, Public + IP ACL,
  Transit Gateway, VPN/ExpressRoute, Cross-cloud VPN, Cross-cloud
  interconnect, Service-Direct PL.

### Check generation

`generateChecklist(state)` returns four sections, each from its own
generator. The generators dispatch on `state.connector` to produce
connector-specific checks.

- `genIdentity(state, conn)` — per-connector OAuth / DB-auth / SP setup
- `genNetwork(state, conn)` — per-topology connectivity checks (incl.
  Service-Direct PL block when `networkModel === "service_direct_pl"`)
- `genWorkspace(state, conn)` — UC, serverless, NCC, UC Connection SQL
- `genSource(state, conn)` — connector-specific source-side prep

The Results page calls these every render via `useMemo`.

### Network model filtering

`availableNetworkModels` is the source of truth for which network
options appear at Step 4. Important rules:

- **Zerobus + same_cloud + AWS/Azure** → `["service_direct_pl", "public_with_ip_acl"]`
- **Zerobus + same_cloud + GCP** → `["public_with_ip_acl"]` (SDPL not yet on GCP)
- **Zerobus + on_prem** → `["vpn_expressroute", "public_with_ip_acl"]`
- **Zerobus + different_cloud** → `["cross_cloud_vpn", "public_with_ip_acl"]`
- **Zerobus + saas** → `["public_with_ip_acl"]`
- All other connectors use the legacy by-source-location logic.

### Exports

- `downloadMd()` — builds a Markdown string with `[x]/[ ]` boxes per
  check, code blocks, detail lines, and a Summary footer
  (completed, remaining blockers, remaining high). Blob download.
- `downloadPdf()` — dynamic-imports `jspdf`, calls `buildPdf(...)`
  which draws boxes/pills/code blocks with `doc.text()`/`doc.rect()`,
  then `doc.save(filename)`. Real binary PDF, not a print dialog.

### Brand button behavior

Clicking "Lakeflow Connect Pre-flight Checklist" in the header calls
`reset()` — same effect as the "Restart checklist" button on the
Results page. Hard wipe of all state + return to landing.

---

## 7. How to: add a new connector

1. Add a new entry under `CONNECTORS` in `src/App.jsx`:

   ```js
   my_thing: {
     label: "My Thing",
     icon: "database",          // pick an existing one from ICON_PATHS
     status: "Beta",            // GA / Public Preview / Beta / Private Preview / Community
     defaultPorts: ["443"],
     authMethods: ["OAuth 2.0"],
     supportsPrivateLink: false,
     category: "SaaS",          // must match a CONNECTOR_CATEGORIES id
     platforms: "what hosts it",
     docsUrl: "https://docs.databricks.com/...",
   },
   ```

2. (Optional) Add connector-specific checks in the generators.
   Pattern:

   ```js
   if (state.connector === "my_thing") {
     checks.push({
       text: "...",
       priority: "high",      // blocker / high / medium / low / info
       docsUrl: "https://...",
       detail: "...",
       code: { lang: "sql", body: "..." },
     });
   }
   ```

3. (Optional) If it's a DB CDC or query-based connector, add it to the
   `UC_CONN_TYPE` map in `genWorkspace` so `CREATE CONNECTION TYPE 'X'`
   uses the right product name.

4. `npm run dev`, click through, then `npm run deploy`.

---

## 8. How to: add a new check to an existing connector

Open `src/App.jsx`, find the relevant generator (`genIdentity`,
`genNetwork`, `genWorkspace`, `genSource`), find the `if
(state.connector === "...")` block, and push another object onto
`checks`. The Markdown and PDF exports pick it up automatically.

The optional `docsUrl` field renders as a small orange "Docs ↗" pill
next to the check title.

---

## 9. How to: add a new network model

1. Add an entry to `NETWORK_MODELS` (id → `{ label, icon, desc }`).
2. Include it in the relevant branch of `availableNetworkModels`.
3. Add a generator branch in `genNetwork` to produce the checks for
   that model.

---

## 10. Troubleshooting

### Site shows old build after `npm run deploy`

GitHub Pages CDN caches HTML for ~10 minutes. Force-refresh with
`Cmd+Shift+R`, or wait. Check the served bundle hash matches the
local one:

```sh
curl -sL https://moazzamsaeed.github.io/lakeflow-connect-preflight-checklist/ \
  | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js'
ls dist/assets/ | grep '^index-.*\.js$'
```

### Pre-push hook flags "AWS access token" inside a vendor JS bundle

The Databricks gitleaks hook sometimes false-positives on random
strings in minified third-party JS. The repo already aliases
`html2canvas` and `dompurify` (the worst offenders) to a stub in
`vite.config.js`. If a new vendor library triggers this, either alias
it the same way or add a `.gitleaksignore` entry — do not bypass the
hook with `--no-verify`.

### `npm run deploy` fails inside dist's git init

The script removes `dist/.git` between runs. If you ever see a stale
`.git` in `dist/`, just `rm -rf dist/.git` and retry — the deploy
script is idempotent.

### `npm install` hangs

Happens on flaky network days. Add fetch timeouts:

```sh
npm install --no-audit --no-fund --no-progress \
  --fetch-retries 3 --fetch-timeout 120000
```

### "I picked a connector, hit Continue, the Continue button stays disabled"

The wizard requires the matching `state.*` field to be set. Check:

| Step | Required field |
|---|---|
| Category | `state.connectorCategory` |
| Connector | `state.connector` |
| Cloud | `state.cloud` |
| Source location | `state.sourceLocation` |
| Network | `state.networkModel` |
| Auth | `state.authMethod` |

If you added a new step and Continue won't enable, you probably
forgot to extend the `canNext` switch.

### PDF download produces an empty / corrupted file

The PDF generator allocates ~245 KB of jsPDF at first click (dynamic
import). If the network is offline and the chunk hasn't been cached,
the call will throw silently. Open DevTools → Network → re-click PDF;
look for a 404 on `jspdf.es.min-*.js`.

---

## 11. Useful commands

```sh
# Confirm git remote + branches
git remote -v
git branch -a

# View last few deploys
git log --oneline gh-pages | head -5

# Inspect the live Pages config
gh api /repos/moazzamsaeed/lakeflow-connect-preflight-checklist/pages | jq

# Check the latest Pages build status
gh api /repos/moazzamsaeed/lakeflow-connect-preflight-checklist/pages/builds/latest \
  -q '{status, error}'

# Re-trigger a Pages build manually
gh api -X POST /repos/moazzamsaeed/lakeflow-connect-preflight-checklist/pages/builds
```

---

## 12. Known limitations / TODO

- Detailed connector-specific check coverage exists for SQL Server CDC,
  Oracle CDC, PostgreSQL, MySQL, Oracle/Teradata query-based, Salesforce,
  ServiceNow, Workday, SharePoint, GA4, HubSpot, Jira, Confluence,
  NetSuite, Dynamics 365, Zendesk, Google/Meta/TikTok Ads, and all three
  Zerobus variants. Remaining connectors fall back to the generic auth
  flow — extend per `Section 7` above when needed.
- Network Doctor handoff JSON is generated client-side; there is no
  validation that the target Doctor notebook exists in the workspace.
- The wizard does not persist progress across reloads — by design (no
  localStorage). If/when persistence is added, watch for stale state
  carrying across connector changes.
- Pages CDN caching means deploys take up to ~10 minutes to propagate
  in the worst case.
