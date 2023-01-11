import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                primary: '#F99969',
                secondary: '#5959BD',
                dark: '#111727',
                light: '#EFEDEB',
            },
        },
        fontFamily: {
            'ubuntu': ['Ubuntu', ...defaultTheme.fontFamily.sans],
        }
  }
}