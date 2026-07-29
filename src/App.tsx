import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AdminProvider } from './context/AdminContext';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AmenitiesPage } from './pages/AmenitiesPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { UpdatesDetailPage } from './pages/UpdatesDetailPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { ScheduleVisitPage } from './pages/ScheduleVisitPage';
import { FaqPage } from './pages/FaqPage';
import { CareersPage } from './pages/CareersPage';
import { PartnerPage } from './pages/PartnerPage';
import { PrivacyPolicyPage, TermsPage, CookiePolicyPage } from './pages/PolicyPages';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AdminProvider isAdmin={false}>
      <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-surface">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/amenities" element={<AmenitiesPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/updates/:slug" element={<UpdatesDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/schedule-site-visit" element={<ScheduleVisitPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/partner-with-us" element={<PartnerPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
