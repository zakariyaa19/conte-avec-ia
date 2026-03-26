import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { StoryFormPage } from './pages/StoryFormPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ClubCheckoutPage } from './pages/ClubCheckoutPage';
import { ReferralPage } from './pages/ReferralPage';
import { CancelSubscriptionPage } from './pages/CancelSubscriptionPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { AccountPage } from './pages/AccountPage';
import { ClubPage } from './pages/ClubPage';
import { PublicStoryPage } from './pages/PublicStoryPage';
import { ExemplesPage } from './pages/ExemplesPage';
import { CGVPage } from './pages/CGVPage';
import ThemesContesPage from './pages/ThemesContesPage';
import ContesParAgePage from './pages/ContesParAgePage';
import StylesIllustrationPage from './pages/StylesIllustrationPage';
import ContesMultilinguesPage from './pages/ContesMultilinguesPage';
import ValeursEducativesPage from './pages/ValeursEducativesPage';
import IdeesCadeauxPage from './pages/IdeesCadeauxPage';
import IACreationContePage from './pages/IACreationContePage';
import BlogPage from './pages/BlogPage';
import BlogArticle1 from './pages/BlogArticle1';
import BlogArticle2 from './pages/BlogArticle2';
import BlogArticle3 from './pages/BlogArticle3';
import BlogArticle4 from './pages/BlogArticle4';
import BlogArticle5 from './pages/BlogArticle5';
import BlogArticleAnimaux1 from './pages/BlogArticleAnimaux1';
import BlogArticleAnimaux2 from './pages/BlogArticleAnimaux2';
import BlogArticleAnimaux3 from './pages/BlogArticleAnimaux3';
import BlogArticleAnimaux4 from './pages/BlogArticleAnimaux4';
import BlogArticleAnimaux5 from './pages/BlogArticleAnimaux5';
import BlogArticleFoi1 from './pages/BlogArticleFoi1';
import BlogArticleFoi2 from './pages/BlogArticleFoi2';
import BlogArticleFoi3 from './pages/BlogArticleFoi3';
import BlogArticleFoi4 from './pages/BlogArticleFoi4';
import BlogArticleFoi5 from './pages/BlogArticleFoi5';
import BlogArticleNouveau1 from './pages/BlogArticleNouveau1';
import BlogArticleNouveau2 from './pages/BlogArticleNouveau2';
import BlogArticleNouveau3 from './pages/BlogArticleNouveau3';
import BlogArticleNouveau4 from './pages/BlogArticleNouveau4';
import BlogArticleNouveau5 from './pages/BlogArticleNouveau5';
import BlogArticleNouveau6 from './pages/BlogArticleNouveau6';
import BlogArticleNouveau7 from './pages/BlogArticleNouveau7';
import BlogArticleNouveau8 from './pages/BlogArticleNouveau8';
import BlogArticleNouveau9 from './pages/BlogArticleNouveau9';
import BlogArticleNouveau10 from './pages/BlogArticleNouveau10';
import BlogArticleSEO1 from './pages/BlogArticleSEO1';
import BlogArticleSEO2 from './pages/BlogArticleSEO2';
import BlogArticleSEO3 from './pages/BlogArticleSEO3';
import BlogArticleSEO4 from './pages/BlogArticleSEO4';
import { MentionsLegalesPage } from './pages/MentionsLegalesPage';
import { PolitiqueConfidentialitePage } from './pages/PolitiqueConfidentialitePage';
import ScrollToTop from './components/utils/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import { WebViewBanner } from './components/ui/WebViewBanner';
import { MagicLoginPage } from './pages/MagicLoginPage';
import { UpgradePage } from './pages/UpgradePage';
import { ThemeContextProvider } from './contexts/ThemeContext';

const AdminLoginRoute = () => (
  <AdminLoginPage onLoginSuccess={() => { window.location.href = '/admin'; }} />
);

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
    <HelmetProvider>
      <GlobalStyles />
      <Router>
        <AuthProvider>
        <ThemeContextProvider>
        <WebViewBanner />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story-form" element={<StoryFormPage />} />
          <Route path="/create-story" element={<StoryFormPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/magic-login" element={<MagicLoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/story/:id" element={<ProtectedRoute><StoryDetailPage /></ProtectedRoute>} />
          <Route path="/dashboard/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/club" element={<ClubPage />} />
          <Route path="/club/checkout" element={<ClubCheckoutPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/account/cancel" element={<ProtectedRoute><CancelSubscriptionPage /></ProtectedRoute>} />
          <Route path="/upgrade" element={<Navigate to="/club/checkout" replace />} />
          <Route path="/story/:shareToken" element={<PublicStoryPage />} />
          <Route path="/admin/login" element={<AdminLoginRoute />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/admin/orders" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/admin/order/:orderId" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/admin/generation" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/admin/funnel" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/admin/clients" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/admin/clients/:clientId" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
          <Route path="/exemples" element={<ExemplesPage />} />
          {/* Nouvelles pages SEO */}
          <Route path="/themes-de-contes" element={<ThemesContesPage />} />
          <Route path="/contes-par-age" element={<ContesParAgePage />} />
          <Route path="/styles-illustration" element={<StylesIllustrationPage />} />
          <Route path="/contes-multilingues" element={<ContesMultilinguesPage />} />
          <Route path="/valeurs-educatives" element={<ValeursEducativesPage />} />
          <Route path="/idees-cadeaux" element={<IdeesCadeauxPage />} />
          <Route path="/ia-creation-conte" element={<IACreationContePage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Articles de blog */}
          <Route path="/blog/histoire-animal-compagnie-livre-personnalise" element={<BlogArticle1 />} />
          <Route path="/blog/nouveaux-personnages-styles-aventures-ados" element={<BlogArticle2 />} />
          <Route path="/blog/evolution-livres-enfants-contes-fees-aventures-personnalisees" element={<BlogArticle3 />} />
          <Route path="/blog/ia-revolution-creation-histoires-enfants" element={<BlogArticle4 />} />
          <Route path="/blog/integrer-valeurs-religieuses-contes-personnalises" element={<BlogArticle5 />} />
          {/* Articles sur les animaux de compagnie */}
          <Route path="/blog/animal-compagnie-stimule-imagination-enfant" element={<BlogArticleAnimaux1 />} />
          <Route path="/blog/conte-personnalise-noel-cadeau-amoureux-animaux" element={<BlogArticleAnimaux2 />} />
          <Route path="/blog/photo-heros-conte-ia-transforme-animal-personnage" element={<BlogArticleAnimaux3 />} />
          <Route path="/blog/lire-compagnon-quatre-pattes-rituel-lien-enfant-animal" element={<BlogArticleAnimaux4 />} />
          <Route path="/blog/top-5-themes-histoires-animal-heros-conte" element={<BlogArticleAnimaux5 />} />
          {/* Articles sur la foi et la religion */}
          <Route path="/blog/transmettre-foi-histoires-contes-personnalises-spiritualite" element={<BlogArticleFoi1 />} />
          <Route path="/blog/fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali" element={<BlogArticleFoi2 />} />
          <Route path="/blog/personnaliser-foi-ia-adapte-valeurs-religieuses" element={<BlogArticleFoi3 />} />
          <Route path="/blog/heros-foi-inspirer-enfants-personnages-spirituels" element={<BlogArticleFoi4 />} />
          <Route path="/blog/foi-tolerance-ouverture-respect-differentes-religions" element={<BlogArticleFoi5 />} />
          {/* Nouveaux articles 2026 */}
          <Route path="/blog/livre-personnalise-enfant-2026" element={<BlogArticleNouveau1 />} />
          <Route path="/blog/conte-personnalise-confiance-imagination-enfant" element={<BlogArticleNouveau2 />} />
          <Route path="/blog/livre-personnalise-vs-livre-classique-enfant" element={<BlogArticleNouveau3 />} />
          <Route path="/blog/intelligence-artificielle-histoires-enfants" element={<BlogArticleNouveau4 />} />
          <Route path="/blog/enfant-heros-propre-histoire" element={<BlogArticleNouveau5 />} />
          <Route path="/blog/conte-personnalise-rituel-coucher" element={<BlogArticleNouveau6 />} />
          <Route path="/blog/livre-personnalise-enfant-timide" element={<BlogArticleNouveau7 />} />
          <Route path="/blog/cadeau-livre-personnalise-enfant" element={<BlogArticleNouveau8 />} />
          <Route path="/blog/creation-histoires-personnalisees-conte-ia" element={<BlogArticleNouveau9 />} />
          <Route path="/blog/bienfaits-lecture-personnalisee-enfant" element={<BlogArticleNouveau10 />} />
          {/* Articles SEO 2026 */}
          <Route path="/blog/guide-livre-personnalise-enfant-2026" element={<BlogArticleSEO1 />} />
          <Route path="/blog/meilleurs-livres-personnalises-enfants-comparatif-2026" element={<BlogArticleSEO2 />} />
          <Route path="/blog/conteuse-personnalisable-alternative-numerique-2026" element={<BlogArticleSEO3 />} />
          <Route path="/blog/livre-conte-personnalise-histoire-unique-enfant" element={<BlogArticleSEO4 />} />
          {/* Pages légales */}
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
          <Route path="/conditions-generales-de-vente" element={<CGVPage />} />
        </Routes>
        </ThemeContextProvider>
        </AuthProvider>
      </Router>
      <Analytics />
      <SpeedInsights />
    </HelmetProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
