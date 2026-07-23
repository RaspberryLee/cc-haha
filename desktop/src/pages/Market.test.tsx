import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { useSettingsStore } from '../stores/settingsStore'
import { useMarketStore } from '../stores/marketStore'
import { useSkillStore } from '../stores/skillStore'
import { useUIStore } from '../stores/uiStore'
import { Market } from './Market'

vi.mock('./Settings', () => ({
  AgentsSettings: () => <div>Agents catalog</div>,
  PluginSettings: () => <div>Plugins catalog</div>,
}))

vi.mock('../components/market/MarketHome', () => ({
  MarketHome: () => <div>Skills catalog</div>,
}))

vi.mock('../components/skills/SkillDetail', () => ({
  SkillDetail: () => <div>Installed skill detail</div>,
}))


vi.mock('../components/market/MarketSkillDetail', () => ({
  MarketSkillDetail: () => <div>Skill detail</div>,
}))

vi.mock('../components/market/InstallConfirmDialog', () => ({
  InstallConfirmDialog: () => null,
}))

vi.mock('../components/shared/ConfirmDialog', () => ({
  ConfirmDialog: () => null,
}))

beforeEach(() => {
  useSettingsStore.setState({ locale: 'en' })
  useMarketStore.setState({
    selectedId: null,
    items: [],
    installingIds: new Set(),
  })
  useSkillStore.setState({ selectedSkill: null })
  useUIStore.setState({ activeCapabilitySection: 'skills' })
})

describe('Market capability tabs', () => {
  it('switches Skills, Plugins, and Agents without leaving the market page', () => {
    render(<Market />)

    expect(screen.getByTestId('market-mode-tabs')).not.toHaveAttribute('data-desktop-drag-region')
    expect(screen.queryByTestId('market-window-controls')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Skills' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Skills catalog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Plugins' }))
    expect(screen.getByRole('button', { name: 'Plugins' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Plugins catalog')).toBeInTheDocument()
    expect(screen.queryByText('Skills catalog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Agents' }))
    expect(screen.getByRole('button', { name: 'Agents' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Agents catalog')).toBeInTheDocument()
    expect(useUIStore.getState().activeCapabilitySection).toBe('agents')
    expect(localStorage.getItem('cc-haha-active-capability-section')).toBe('agents')

    fireEvent.click(screen.getByRole('button', { name: 'Skills' }))
    expect(screen.getByText('Skills catalog')).toBeInTheDocument()
  })

  it('opens installed skill details inside the Skills tab', () => {
    useSkillStore.setState({
      selectedSkill: {
        meta: {
          name: 'local-skill',
          description: 'Local skill',
          source: 'user',
          userInvocable: true,
          contentLength: 120,
          hasDirectory: true,
        },
        tree: [],
        files: [],
        skillRoot: '/skills/local-skill',
      },
    })

    render(<Market />)

    expect(screen.getByText('Installed skill detail')).toBeInTheDocument()
    expect(screen.queryByText('Skills catalog')).not.toBeInTheDocument()
  })})
