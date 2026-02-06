# Problem Solving & Debugging Dashboard

## Check List
- [x] Requirements Analysis: Clearly understand the task and constraints.
- [x] Code Impact Assessment: Identify which files are affected.
- [x] Aesthetic Check: Ensure colors and high-contrast professional design are maintained.
- [x] Responsiveness Check: Verify the fix works on mobile and desktop.
- [x] API Integrity: Ensure Gemini API calls follow the specific guidelines (apiKey, model names).

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