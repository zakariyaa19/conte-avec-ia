import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { GlobalStyles } from './styles/GlobalStyles';
import { HomePage } from './pages/HomePage';
import { StoryFormPage } from './pages/StoryFormPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { AdminPage } from './pages/AdminPage';
import { ExemplesPage } from './pages/ExemplesPage';
import { FeaturesPage } from './pages/FeaturesPage';
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
import { MentionsLegalesPage } from './pages/MentionsLegalesPage';
import { PolitiqueConfidentialitePage } from './pages/PolitiqueConfidentialitePage';
import ScrollToTop from './components/utils/ScrollToTop';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story-form" element={<StoryFormPage />} />
          <Route path="/create-story" element={<StoryFormPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/order/:orderId" element={<AdminPage />} />
          <Route path="/exemples" element={<ExemplesPage />} />
          <Route path="/fonctionnalites" element={<FeaturesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
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
          {/* Pages légales */}
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
