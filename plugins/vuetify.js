import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components : {
      VNumberInput,
    },
    directives,
    theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
        myCustomTheme: {
          dark: false,
          colors: {
            primary: '#850821', // Nouvelle couleur principale
            secondary: '#FFC107', // Autres couleurs personnalisées
            accent: '#FF5252',
            success: '#4CAF50',
            error: '#FF5252',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})