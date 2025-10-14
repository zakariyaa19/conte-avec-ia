import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { HomePage } from './pages/HomePage';
import { StoryFormPage } from './pages/StoryFormPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { AdminPage } from './pages/AdminPage';
import { ExemplesPage } from './pages/ExemplesPage';
import { FonctionnalitesPage } from './pages/FonctionnalitesPage';
import { FeaturesPage } from './pages/FeaturesPage';
import ThemesContesPage from './pages/ThemesContesPage';
import ContesParAgePage from './pages/ContesParAgePage';
import StylesIllustrationPage from './pages/StylesIllustrationPage';
import ContesMultilinguesPage from './pages/ContesMultilinguesPage';
import ValeursEducativesPage from './pages/ValeursEducativesPage';
import IdeesCadeauxPage from './pages/IdeesCadeauxPage';
import IACreationContePage from './pages/IACreationContePage';
import BlogPage from './pages/BlogPage';
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
          {/* Nouvelles pages SEO */}
          <Route path="/themes-de-contes" element={<ThemesContesPage />} />
          <Route path="/contes-par-age" element={<ContesParAgePage />} />
          <Route path="/styles-illustration" element={<StylesIllustrationPage />} />
          <Route path="/contes-multilingues" element={<ContesMultilinguesPage />} />
          <Route path="/valeurs-educatives" element={<ValeursEducativesPage />} />
          <Route path="/idees-cadeaux" element={<IdeesCadeauxPage />} />
          <Route path="/ia-creation-conte" element={<IACreationContePage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Pages légales */}
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
