# Agent Rules & Guidelines

1. **Task Focus**: Only change and do the specified task given.
2. **Layout Integrity**: Never change the layout or overall display structure when performing a task unless explicitly asked to redesign the UI.
3. **Scope Management**: You must never change other functions or display elements not related to the specific task.
4. **Adherence**: Always look into `ps.md` for problem-solving checklists, debugging protocols, and to-do list tracking before and after implementation.
5. **Quality over Quantity**: Keep code updates minimal and precise. Avoid bloated changes that shift the aesthetic or functionality of unrelated features.
6. **Default Settings**: English (EN) must be the default language setting for all users.

## Theme & Technology Requirements

- **Black/Yellow Theme**: All UI components must follow the black background with yellow accent color scheme
- **AI Scoring**: Use Gemini-3-flash-preview for all relevance scoring and content generation
- **Color Palette**: 
  - Primary: #fbbf24 (yellow-400)
  - Background: #000000
  - Card: #111111
  - Text: #ffffff
  - Muted: #9ca3af

## Implementation Guidelines

- Follow existing code conventions and patterns
- Maintain responsive design for mobile and desktop
- Preserve functionality outside the scope of the specific task
- Use semantic HTML5 elements
- Implement proper error handling for API calls
- Ensure accessibility standards are met

---

## App Design & Architecture

This section documents the target design of the NC Jobs Hub. It is the single reference for what the app is and how it should evolve. Keep this in sync with the product guide when making design-related changes.

### 1. Core purpose

- Aggregate and normalize job listings from selected employment websites and Facebook Workplace groups related to New Caledonia.
- **Users**: discover relevant jobs, track applications, communicate with employers directly, maintain an identity profile (resume + skills).
- **OpenClaw**: retrieve structured job and user data; score job relevance based on user identity; relay meaningful events to a Telegram bot without spamming (event-based payloads only, dashboard deep links).

### 2. Data sources (selectable in app)

Sources must support enable/disable via UI controls.

- **Employment**: emploi.gouv.nc, job.nc, pole-emploi.fr (filtered for NC), nc.manpower.fr, indeed.com (Nouméa / NC filters).
- **Social**: Facebook Workplace, Facebook groups focused on NC employment.
- **Other**: local company career pages (e.g. Aircalin, SLN, hotels, construction, mining), provincial and municipal public-sector job portals.

### 3. Job listing schema (for scrapers and DB)

Each job listing must store: Job ID (unique per source), title, company, location, contract type, posted date, job description, job requirements, contact information, source website, scrape timestamp. When implementing scrapers or the backend, ensure the schema includes `scrapeTimestamp` and treats `url` as the source/original link.

### 4. Dashboard UI (reference; do not change layout unless explicitly asked)

- **Visual**: Black background, yellow accents, white text; modular panel-based layout; clean, professional, high-contrast; minimal animations; mobile-first.
- **Layout**: Top navigation bar (filters, language toggle, notifications, settings) | Left panel (source selector, job category, location) | Main panel (scrollable aggregated job cards) | Right panel, expandable (job details, user notes, application status, contact actions).

### 5. Identity section

Dedicated Identity area in the app. Identity data includes: full name, contact details, preferred language, resume (PDF/text), skills list (tag-based), certifications, experience summary, preferred job types and locations. Used to: auto-fill emails and applications, match job requirements to user skills, score job relevance. OpenClaw must be able to access identity data (read-only unless explicitly allowed).

### 6. Notifications and OpenClaw

- **In-app notifications**: New relevant job matches, job updates, job expiration reminders, employer replies (if tracked). Preferences configurable per user. Notifications synced with OpenClaw event system.
- **OpenClaw**: Polls the PWA backend for new job listings, job relevance scores, user actions. Performs deduplication, relevance scoring using identity data, event generation. **OpenClaw → Telegram**: event-based payloads only (e.g. new job match, daily digest, status changes); strict rate limits; send dashboard deep links only, never raw job data.

### 7. Email, logs, language

- **Email**: Built-in composer in job detail view; pre-filled subject/body templates; auto-insert identity data; editable before sending; support mailto or backend service; log sent emails with timestamps; email history stored per job.
- **Logs**: Each job supports status (New, Saved, Applied, Interview, Rejected), user notes, dates of interaction, contact history. Logs must be searchable, sortable, exportable.
- **Language**: Full bilingual EN/FR; language toggle available globally; UI text and templates switch dynamically; identity language preference respected for emails and notifications (default remains EN per rule above).

### 8. Technical direction (future implementation)

- **Frontend**: Modern JS framework (React in use).
- **Backend**: API for jobs, identity, logs, notifications; scraping services per source.
- **Database**: Structured schema with timestamps and source IDs.
- **PWA**: Offline caching, add to home screen, background sync where possible.
- **Security**: User authentication; secure identity data handling; error handling and scrape failure logging.