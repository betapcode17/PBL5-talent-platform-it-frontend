// Google Identity Services (GIS) Config
export const googleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string
}

// Debug: Log config khi app khởi động
console.log('========== GOOGLE CONFIG DEBUG ==========')
console.log('[GoogleConfig] Client ID:', googleConfig.clientId)
if (!googleConfig.clientId || googleConfig.clientId === 'undefined') {
  console.error('[GoogleConfig] ERROR: VITE_GOOGLE_CLIENT_ID is not set!')
}
console.log('==========================================')

// Type definitions cho Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitConfig) => void
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void
          prompt: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

interface GoogleInitConfig {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

// Initialize Google Identity Services
export const initializeGoogleSignIn = (callback: (response: GoogleCredentialResponse) => void) => {
  if (!window.google) {
    console.error('[GoogleConfig] Google Identity Services not loaded!')
    return
  }

  console.log('[GoogleConfig] Initializing Google Sign-In...')

  window.google.accounts.id.initialize({
    client_id: googleConfig.clientId,
    callback: callback,
    auto_select: false,
    cancel_on_tap_outside: true
  })

  console.log('[GoogleConfig] Google Sign-In initialized')
}

// Render Google Sign-In button
export const renderGoogleButton = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`[GoogleConfig] Element with id "${elementId}" not found`)
    return
  }

  if (!window.google) {
    console.error('[GoogleConfig] Google Identity Services not loaded!')
    return
  }

  console.log('[GoogleConfig] Rendering Google button...')

  window.google.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'rectangular',
    width: 280
  })

  console.log('[GoogleConfig] Google button rendered')
}
