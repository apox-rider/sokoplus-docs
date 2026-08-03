import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { RootLayout } from '@/app/RootLayout'
import { HomePage } from '@/app/HomePage'
import { DocsLayout } from '@/app/DocsLayout'
import { SectionIndex } from '@/app/SectionIndex'
import { ArticlePage } from '@/app/ArticlePage'
import { NotFoundPage } from '@/app/NotFoundPage'
import { LoginPage } from '@/app/LoginPage'
import { RedeemPage } from '@/app/RedeemPage'
import { AdminTokensPageGate } from '@/app/AdminTokensPage'
import { RestrictedArticlePageGate } from '@/app/RestrictedArticlePage'
import { isRestricted } from '@/lib/restricted'

function DevelopersArticle() {
  const { slug = '' } = useParams<{ slug?: string }>()
  return isRestricted(slug) ? <RestrictedArticlePageGate /> : <ArticlePage section="developers" />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/en" replace /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: ':lang',
        children: [
          { index: true, element: <HomePage /> },
          { path: 'redeem', element: <RedeemPage /> },
          { path: 'admin/tokens', element: <AdminTokensPageGate /> },
          {
            path: 'help',
            element: <DocsLayout section="help" />,
            children: [
              { index: true, element: <SectionIndex section="help" /> },
              { path: ':slug', element: <ArticlePage section="help" /> },
            ],
          },
          {
            path: 'developers',
            element: <DocsLayout section="developers" />,
            children: [
              { index: true, element: <SectionIndex section="developers" /> },
              { path: ':slug', element: <DevelopersArticle /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
