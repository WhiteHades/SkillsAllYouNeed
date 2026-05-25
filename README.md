# SkillsAllYouNeed

A curated, single-file directory of every first-party skill, capability, tool, and extension shipping across six major AI assistant ecosystems. Named in tribute to *Attention Is All You Need*.

**Live site:** https://kishormorol.github.io/SkillsAllYouNeed/

---

## What it is

An editorial-preprint-styled reference — arXiv meets print magazine — that catalogs and compares AI assistant capabilities side by side. Searchable, filterable, deep-linkable, and printable.

**Ecosystems covered:**
- Claude (claude.ai — web, desktop, mobile)
- Claude Code (CLI + IDE)
- ChatGPT (chatgpt.com — web, desktop, mobile)
- Codex (OpenAI's coding agent — CLI, cloud, IDE)
- Gemini (Google's AI assistant — web, mobile, Workspace)
- DeepSeek (DeepSeek chat and API)

**115+ entries** across nine functional categories: Document, Code, Web, Data, Memory, Integration, Visual, Agentic, API.

---

## Features

### Browsing & filtering
- Filter by ecosystem, category, and status (Stable / Beta / Deprecated)
- Free-text search across names, descriptions, triggers, and examples
- Count badges on every filter chip show total entries per dimension
- Active filter tags bar — dismissible pills for every active filter
- Ecosystem deep-dive strip — click a card to jump directly to that ecosystem

### Cards & detail
- Asymmetric 12-column grid with featured (ink-black) cards
- Trigger phrase shown on every card; click it to copy to clipboard
- Heart button (♡/♥) on every card to save favorites — persisted in `localStorage`
- Click any card to open a full detail sheet with description, worked example, and source citation
- Sheet includes: Save, Share (Web Share API), Copy Trigger actions
- Prev / Next navigation buttons inside the sheet
- Deep-link anchor (¶) per card — copies a direct URL; hash routing auto-opens the sheet on load

### Keyboard shortcuts
| Key | Action |
|-----|--------|
| `/` | Focus the search field |
| `?` | Toggle keyboard shortcuts card |
| `Esc` | Close open sheet or shortcuts card |
| `Enter` | Open focused skill card |
| `j` / `k` | Navigate forward / backward through cards |
| `←` / `→` | Previous / next skill inside an open sheet |
| `f` | Toggle favorite on focused card or open sheet |
| `r` | Open a random skill from current results |
| `¶` | Copy deep link to a skill |

### Toolbar
- **Surprise me →** — opens a random skill from the current filtered results
- **Saved** — toggle to show only favorited skills
- **Export JSON ↓** — downloads the currently visible skills as a JSON file

### Other
- Comparison matrix (28 capability rows × 6 ecosystems)
- Sort: index order or recent (Beta-first proxy)
- Scroll-to-top button (appears after 500px scroll)
- Full print stylesheet — single column, page numbers, expanded trigger/example/source
- Clickable references with source links

---

## Design

Single HTML file, zero build step, zero dependencies.

- **Type:** Instrument Serif (display) · Newsreader (body) · JetBrains Mono (metadata)
- **Palette:** warm paper `#F2EFE6` · deep ink `#15130E` · vermillion accent `#C7401E`
- **Grid:** asymmetric 12-column hairline grid
- **Motion:** staggered fade-in only — no springs, no parallax, no scroll-jacking

---

## Versions

| Version | Changes |
|---------|---------|
| v1.0 | Initial release — 38 entries across four ecosystems |
| v1.1 | +43 entries, API category, hash routing, keyboard shortcuts, ecosystem strip, print stylesheet |
| v1.2 | Favorites, chip count badges, sheet prev/next nav, sheet actions, active filter tags, grid toolbar (Surprise / Export / Saved), j/k/f/r keyboard shortcuts, scroll-to-top, click-to-copy trigger, Gemini & DeepSeek ecosystems |

---

Corrections and additions welcome via [Issues](https://github.com/kishormorol/SkillsAllYouNeed/issues).
