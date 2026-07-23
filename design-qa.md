# Design QA

source visual truth paths:
- C:/Users/63163/AppData/Local/Temp/codex-clipboard-6a6a54b0-6621-4899-8a4b-c589f77b1467.png
- C:/Users/63163/AppData/Local/Temp/codex-clipboard-8ffdb871-2de9-4fdc-b536-d895144419bc.png

implementation screenshot paths:
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/cc-haha-agents-responsive-fixed.png
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/cc-haha-home-responsive-fixed.png

viewport:
- Restored Electron window: 1346 x 898 CSS pixels at devicePixelRatio 1.25.
- Captured implementation: 1683 x 1122 physical pixels.
- Agents source: 1668 x 1122 physical pixels.
- Home source: 1669 x 1122 physical pixels.
- Implementation captures were normalized to each source width for side-by-side comparison; height already matched.

state:
- Windows Electron desktop runtime, restored window.
- Agents capability tab selected with six built-in Agents visible.
- New-session home state with starter actions and composer visible.
- Custom Windows minimize, maximize/restore, and close controls visible.

full-view comparison evidence:
- Agents: C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/cc-haha-agents-responsive-comparison.png
- Home: C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/cc-haha-home-responsive-comparison.png
- In each comparison the reported broken state is on the left and the post-restart real-window capture is on the right.

focused region comparison evidence:
- Agents content container spans x=360.4 to x=1260.4 in a main surface spanning x=280 to x=1346.4. Container center is 810.4 and main-surface center is 813.2, a 2.8 px difference caused by the vertical scrollbar.
- Home heading center and main-surface center both equal x=813.2.
- Restored-window controls span x=1208.4 to x=1346.4 and remain fully visible.
- Maximized-window controls span x=1014 to x=1152 and remain fully visible.

findings:
- No P0, P1, or P2 issue remains after resetting the stale debug viewport.
- The reported displacement was not a production CSS regression. The Electron renderer retained the 2166 x 1250 QA viewport while the native window had returned to about 1346 x 898 CSS pixels, placing centered content and right-edge controls outside the visible native window.
- No product source change was required.

comparison history:
- Iteration 1 finding [P1]: both the main content and Windows controls were laid out against a stale 2166 x 1250 renderer viewport and appeared clipped in the restored window.
- Iteration 1 fix: fully restarted Vite and Electron using independent redirected logs, removing the stale CDP viewport state.
- Iteration 2 evidence: restored viewport reports 1346 x 898, home center delta is 0 px, Agents center delta is 2.8 px, all three controls are within the viewport, and no horizontal overflow container is present.
- Iteration 2 resize evidence: maximize and restore both preserve center alignment, visible controls, and zero horizontal overflow.

required fidelity surfaces:
- Fonts and typography: unchanged from the approved implementation; headings and compact UI labels remain legible without clipping.
- Spacing and layout rhythm: content is centered within the main surface in both restored and maximized windows.
- Colors and visual tokens: unchanged warm-white surface, subtle borders, selected pills, and muted secondary text.
- Image quality and assets: supplied product logo and existing icon assets remain sharp at devicePixelRatio 1.25.
- Copy and content: all visible Chinese navigation and home text is complete; Agent descriptions wrap within the card instead of being cut off.

primary interactions tested:
- Open Skill Market, switch to Agents, and return to New Session.
- Maximize and restore the Electron window.
- Confirm Minimize, Maximize/Restore, and Close controls remain in the visible top-right corner.
- Confirm no horizontally scrollable content container exists in either tested state.

final result: passed
## Navigation Architecture QA - 2026-07-23

reference visual truth:
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/chatgpt-capability-reference.png

implementation screenshots:
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/navigation-current.png
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/navigation-market-skills.png
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/navigation-market-agents.png
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/navigation-work-return.png
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/navigation-settings.png

combined comparison:
- C:/Users/63163/.codex/visualizations/2026/07/20/019f7f2e-e5ce-79c3-b021-c3c6733d54f0/navigation-chatgpt-comparison.png

verified behavior:
- The global work-tab strip remains visible on work and standalone application pages.
- Windows minimize, maximize/restore, and close controls remain above every page.
- Opening Skill Center or Settings preserves the work tab without showing it as selected.
- Clicking the preserved work tab returns to the prior session.
- Skill Center uses Plugins, Skills, and Agents as internal navigation and restores the last selected section.
- Task-only toolbar controls are hidden on standalone application pages.
- Settings replaces the project sidebar with its own settings navigation while retaining the global top bar.
- Skill and Agent content remains centered in the available main surface without horizontal overflow.

visual comparison findings:
- The implementation preserves the ChatGPT reference's restrained white canvas, muted sidebar, pill selection, compact two-column inventory, and centered maximum-width content.
- The persistent work-tab row above the capability navigation is an intentional product difference required by the approved architecture.
- No P0, P1, or P2 visual or interaction issue remains in the tested Electron states.

final result: passed
