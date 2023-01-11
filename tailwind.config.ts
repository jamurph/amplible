import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                primary: '#F99969',
                'primary-dark10': '#e08a5f',
                'primary-dark20': '#c77a54',
                'primary-light10': '#faa378',
                'primary-light20': '#faad87',
                secondary: '#5959BD',
                'secondary-dark10' : '#5050aa',
                'secondary-dark20' : '#474797',
                'secondary-light10' : '#6a6ac4',
                'secondary-light20' : '#7a7aca',
                dark: '#111727',
                'dark-light10': '#292e3d',
                'dark-light20': '#414552',
                light: '#EFEDEB',
                'light-dark10': '#d7d5d4',
                'light-dark20': '#bfbebc',
            },
        },
        fontFamily: {
            'ubuntu': ['Ubuntu', ...defaultTheme.fontFamily.sans],
        }
  }
}