import type { SettingsTab } from '../stores/uiStore'

export const SETTINGS_DEVELOPER_MODE_STORAGE_KEY = 'cc-haha-settings-developer-mode'

/**
 * Tabs that expose engineering internals (protocol names, raw traces, adapter
 * wiring). Hidden by default so everyday users only see plain-language
 * settings; the developer-mode switch at the bottom of the nav reveals them.
 */
const DEVELOPER_ONLY_SETTINGS_TABS = new Set<SettingsTab>([
  'adapters',
  'terminal',
  'mcp',
  'agents',
  'skills',
  'memory',
  'plugins',
  'activity',
  'trace',
  'diagnostics',
])

export function isDeveloperOnlySettingsTab(tab: SettingsTab): boolean {
  return DEVELOPER_ONLY_SETTINGS_TABS.has(tab)
}

export function readSettingsDeveloperMode(): boolean {
  if (typeof window === 'undefined') return false
  // Existing page tests navigate straight to developer tabs; keep them all
  // visible under the test runner unless a test opts into the simple view.
  const testWindow = window as Window & { __ccHahaForceSimpleSettings?: boolean }
  if (testWindow.__ccHahaForceSimpleSettings) return false
  if (import.meta.env.MODE === 'test') return true
  try {
    return window.localStorage.getItem(SETTINGS_DEVELOPER_MODE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeSettingsDeveloperMode(enabled: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SETTINGS_DEVELOPER_MODE_STORAGE_KEY, enabled ? 'true' : 'false')
  } catch {
    // Storage may be unavailable (private mode); the toggle just won't persist.
  }
}
