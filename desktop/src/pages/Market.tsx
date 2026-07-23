import { useState } from 'react'
import { useTranslation } from '../i18n'
import { useMarketStore } from '../stores/marketStore'
import { useSkillStore } from '../stores/skillStore'
import { useUIStore } from '../stores/uiStore'
import { InstallConfirmDialog } from '../components/market/InstallConfirmDialog'
import { MarketHome } from '../components/market/MarketHome'
import { MarketSkillDetail } from '../components/market/MarketSkillDetail'
import { SkillDetail } from '../components/skills/SkillDetail'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import type { NormalizedSkill } from '../types/market'
import { AgentsSettings, PluginSettings } from './Settings'


export function Market() {
  const t = useTranslation()
  const selectedId = useMarketStore((s) => s.selectedId)
  const selectedInstalledSkill = useSkillStore((s) => s.selectedSkill)
  const installingIds = useMarketStore((s) => s.installingIds)
  const [confirmInstall, setConfirmInstall] = useState<NormalizedSkill | null>(null)
  const [confirmUninstall, setConfirmUninstall] = useState<NormalizedSkill | null>(null)
  const section = useUIStore((s) => s.activeCapabilitySection)
  const setSection = useUIStore((s) => s.setActiveCapabilitySection)

  const findSkill = (id: string): NormalizedSkill | null => {
    const state = useMarketStore.getState()
    if (state.detail?.id === id) return state.detail
    return state.items.find((item) => item.id === id) ?? state.detailCache.get(id) ?? null
  }

  const requestInstall = (id: string) => {
    const skill = findSkill(id)
    if (skill) setConfirmInstall(skill)
  }

  const requestUninstall = (id: string) => {
    const skill = findSkill(id)
    if (skill) setConfirmUninstall(skill)
  }

  const runInstall = async () => {
    const skill = confirmInstall
    if (!skill) return
    const ok = await useMarketStore.getState().install(skill.id)
    setConfirmInstall(null)
    if (ok) {
      useUIStore.getState().addToast({
        type: 'success',
        message: t('market.installSuccess', { name: skill.name }),
      })
      // Keep the Settings → Skills browser in sync.
      void useSkillStore.getState().fetchSkills()
    } else {
      const error = useMarketStore.getState().installError
      if (error) {
        useUIStore.getState().addToast({
          type: 'error',
          message:
            error.kind === 'generic'
              ? t('market.installError.generic', { message: error.message })
              : t(`market.installError.${error.kind}`),
        })
      }
    }
  }

  const runUninstall = async () => {
    const skill = confirmUninstall
    if (!skill) return
    const ok = await useMarketStore.getState().uninstall(skill.id)
    setConfirmUninstall(null)
    if (ok) {
      useUIStore.getState().addToast({
        type: 'success',
        message: t('market.uninstall.success', { name: skill.name }),
      })
      void useSkillStore.getState().fetchSkills()
    } else {
      const error = useMarketStore.getState().installError
      if (error) {
        useUIStore.getState().addToast({ type: 'error', message: error.message })
      }
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--color-surface)]">
      <nav
        className="flex h-14 shrink-0 items-stretch border-b border-[var(--color-border)]/50 px-6"
        aria-label={t('sidebar.market')}
        data-testid="market-mode-tabs"
      >
        <div className="flex items-center gap-1">
          {([
            ['plugins', t('settings.tab.plugins')],
            ['skills', t('settings.tab.skills')],
            ['agents', t('settings.tab.agents')],
          ] as const).map(([id, label]) => {
            const active = section === id
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => setSection(id)}
                className={`rounded-lg px-3 py-2 text-[13px] transition-colors ${
                  active
                    ? 'bg-[var(--color-surface-container)] font-semibold text-[var(--color-text-primary)]'
                    : 'font-medium text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {section === 'skills' && (
        selectedInstalledSkill ? (
          <SkillDetail />
        ) : selectedId ? (
          <MarketSkillDetail onRequestInstall={requestInstall} onRequestUninstall={requestUninstall} />
        ) : (
          <MarketHome onRequestInstall={requestInstall} />
        )
      )}

      {section !== 'skills' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--color-surface)]">
          <div className="mx-auto flex w-full max-w-[900px] flex-col gap-7 px-6 pb-10 pt-8 lg:px-8">
            <header className="flex flex-col items-start gap-1.5">
              <h1 className="text-3xl font-bold leading-10 tracking-[-0.02em] text-[var(--color-text-primary)]">
                {section === 'plugins'
                  ? t('settings.plugins.title')
                  : t('settings.agents.browserTitle')}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
                {section === 'plugins'
                  ? t('settings.plugins.description')
                  : t('settings.agents.description')}
              </p>
            </header>
            {section === 'plugins' ? <PluginSettings showHeader={false} /> : <AgentsSettings showOverview={false} />}
          </div>
        </div>
      )}

      <InstallConfirmDialog
        skill={confirmInstall}
        open={confirmInstall !== null}
        installing={confirmInstall !== null && installingIds.has(confirmInstall.id)}
        onConfirm={() => void runInstall()}
        onClose={() => setConfirmInstall(null)}
      />

      <ConfirmDialog
        open={confirmUninstall !== null}
        onClose={() => setConfirmUninstall(null)}
        onConfirm={() => void runUninstall()}
        title={t('market.uninstall.confirmTitle')}
        body={
          confirmUninstall
            ? t('market.uninstall.confirmMessage', {
                name: confirmUninstall.name,
                path: `~/.claude/skills/${confirmUninstall.slug}/`,
              })
            : ''
        }
        confirmLabel={t('market.uninstall.action')}
        cancelLabel={t('market.installConfirm.cancel')}
        confirmVariant="danger"
        loading={confirmUninstall !== null && installingIds.has(confirmUninstall.id)}
      />
    </div>
  )
}
