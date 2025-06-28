import { getLocaleOnServer } from '@/i18n/server'
import { TokenProvider } from '@/hooks/use-token'
import TokenAuthWrapper from '@/app/components/base/token-auth-wrapper'

import './styles/globals.css'
import './styles/markdown.scss'
import './styles/chat.css'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <TokenProvider>
          <div className="overflow-x-auto">
            <div className="w-screen h-screen min-w-[300px]">
              {children}
            </div>
          </div>
        </TokenProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
