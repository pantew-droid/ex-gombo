import { defineStore } from 'pinia'

interface SettingsState {
  langueUser: 'fr' | 'en'
  themeUser: 'dark' | 'light'
  typeViewModeUser: 'grid' | 'list'
  promodoDuration: number
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    langueUser: 'fr',
    themeUser: 'dark',
    typeViewModeUser: 'grid',
    promodoDuration: 300
  }),
  // getters: {
  // },
  actions: {
    getSettings(): Array<string> {
      return [this.langueUser.toString(), this.themeUser.toString(), this.typeViewModeUser.toString(), this.promodoDuration.toString()]
    },

    setSettings(l: 'fr' | 'en', t: 'dark' | 'light', typeUser: 'grid' | 'list', p: number): void {
      this.langueUser = l
      this.themeUser = t
      this.typeViewModeUser = typeUser
      this.promodoDuration = p
    },

    changeLanguage(l: 'fr' | 'en'): void {
      this.langueUser = l
    },

    changeTheme(t: 'dark' | 'light'): void {
      this.themeUser = t
    },

    changeViewMode(v: 'grid' | 'list'): void {
      this.typeViewModeUser = v
    },

    changeDuration(d: number): void {
      this.promodoDuration = d
    }
  }
})
