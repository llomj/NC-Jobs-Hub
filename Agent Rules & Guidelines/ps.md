# Problem Solving & Debugging Dashboard

## Check List
- [x] Requirements Analysis: Clearly understand the task and constraints.
- [x] Code Impact Assessment: Identify which files are affected.
- [x] Aesthetic Check: Ensure colors and high-contrast professional design are maintained.
- [x] Responsiveness Check: Verify the fix works on mobile and desktop.
- [x] API Integrity: Ensure Gemini API calls follow the specific guidelines (apiKey, model names).

## Problem-shooting: do not repeat the same fix

Before changing code again for the same issue:
1. **Confirm what’s actually failing** — Get the exact error (step name + message) from the failing Actions run. Do not assume it’s the same as before.
2. **Confirm what’s on GitHub** — Local edits don’t run. After any workflow change: commit **and** push. Check the “Files changed” / workflow file on GitHub to see the version that runs.
3. **Checklist already done for this issue** — If the fix was “use @v3.0.0 not @3”, confirm the workflow on GitHub shows `upload-pages-artifact@v3.0.0` (or @v4). If it still shows @3, the push didn’t reach GitHub or the wrong branch ran.
4. **One fix per cause** — Fix the root cause (e.g. action ref, path, permissions). Don’t re-apply the same fix without verifying it wasn’t applied (e.g. push not done).

### GitHub Pages deploy – troubleshooting checklist

| Step | Check | If wrong |
|------|--------|----------|
| 1 | Workflow uses `actions/upload-pages-artifact@v3.0.0` or `@v4` (with “v”), never `@3` | Edit workflow, commit, **push** |
| 2 | Repo Settings → Pages → Source = **GitHub Actions** | Set source to GitHub Actions |
| 3 | Repo Settings → Actions → General → Workflow permissions = **Read and write** | Change and save |
| 4 | Last run used the latest commit (workflow file on GitHub matches local after push) | Push again; trigger “Run workflow” from Actions tab |
| 5 | Build step: `Agent Rules & Guidelines` path has no typo; artifact is copied to `deploy/` | Fix path or copy step in workflow |
| 6 | Deploy step: needs `pages: write`, `id-token: write` (and optionally `actions: read`) | Add permissions in workflow |

## To-Do List
- [x] Fix Settings Icon (changed to gear logo fa-gear) 🟢
- [x] Restore Language Toggle visibility in settings 🟢
- [x] Ensure English is default language 🟢
- [x] Create agents.md 🟢
- [x] Create ps.md 🟢
- [x] Add contact phone to Job Details underneath coordinates 🟢
- [x] Add Date of Announcement to info 🟢
- [x] Change Date of Announcement format to DD.MM.YYYY 🟢
- [x] Add English Default rule to agents.md 🟢
- [x] Add Location & Mobility section in Settings (Nouméa, Dumbéa, etc.) 🟢
- [x] Implement location-based filtering with preferred communes 🟢
- [x] Add Geolocation Connect icon next to Tracking Logs 🟢
- [x] Add "Custom Sources" (Scraper Links) management icon and modal 🟢
- [x] Implement folding/grouping for Location & Mobility settings 🟢
- [x] Fix mobility panel folding in/out logic 🟢
- [ ] Monitor user feedback on "Global Index" options.
- [ ] Verify relevance scoring with "Means of Transport" field.

## Issue Tracking
| Issue | Status | Notes |
| :--- | :--- | :--- |
| Settings Icon changed to layer group | 🟢 Fixed | Reverted and then updated to fa-gear logo as requested. |
| Language buttons missing/hidden | 🟢 Fixed | Restored and improved visibility in settings panel. |
| Missing job categories in index | 🟢 Fixed | Expanded mock data to include Gardening, Construction, etc. |
| Missing phone contact in detail view | 🟢 Fixed | Added contact phone section below map button in JobDetail. |
| Missing listing date in detail view | 🟢 Fixed | Added Date of Announcement section in JobDetail info tab. |
| Inconsistent date format | 🟢 Fixed | Forced DD.MM.YYYY format for announcement dates. |
| Geographic filtering missing | 🟢 Fixed | Added commune selectors in settings and updated feed logic. |
| Source management missing | 🟢 Fixed | Added Custom Sources modal next to Location icon. |
| Cluttered settings panel | 🟢 Fixed | Implemented folding logic for Location & Mobility section. |
| Mobility folding panels unresponsive | 🟢 Fixed | Corrected master toggle and event propagation for region sub-panels. |

*Legend: 🟢 Fixed/Done | 🔴 Failed/Pending*