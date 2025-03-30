import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { FeaturedProject } from './components/home/FeaturedProject';
import { News } from './components/home/News';
import { Projects } from './components/home/Projects';
import { Footer } from './components/layout/Footer';
import { History } from './pages/about/History';
import { Mission } from './pages/about/Mission';
import { ThaiFilmDefinition } from './pages/about/ThaiFilmDefinition';
import { UnderProduction } from './pages/UnderProduction';
import { NewsPage } from './pages/news/News';
import { Committee } from './pages/members/Committee';
import { MembersListPage } from './pages/members/list';
import { DirectorDirectory } from './pages/directory/DirectorDirectory';
import { CrewPage } from './pages/members/crew';
import { RegisterPage } from './pages/register';
import { DirectorSearchPage } from './pages/register/director-search';
import { DepartmentPage } from './pages/register/department';
import { PublicMemberPage } from './pages/register/public-member';
import { LoginPage } from './pages/login';
import { CreateAccountPage } from './pages/create-account';
import { ForgotPasswordPage } from './pages/forgot-password';
import { EditProfile } from './pages/profile/EditProfile';
import { PublicProfile } from './pages/profile/PublicProfile';
import { PortfolioPage } from './pages/profile/portfolio';
import { ThaiFilmsPage } from './pages/thaifilms';
import { MovieDetailsPage } from './pages/thaifilms/[id]';
import { AdminDashboard } from './pages/admin/dashboard';
import { ContentEditorPage } from './pages/admin/content';
import { ThaiFilmDataEditorPage } from './pages/admin/content/films';
import { EventEditorPage } from './pages/admin/content/events';
import { ProjectsEditorPage } from './pages/admin/content/projects';
import { CreditCertificationPage } from './pages/admin/content/credits';
import { MemberApplications } from './pages/admin/applications';
import { CrewApplicationsPage } from './pages/admin/crew-applications';
import { RoleManagement } from './pages/admin/roles';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FirebaseProvider } from './contexts/firebase';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { EventsPage } from './pages/activities/events';
import { ProjectsPage } from './pages/activities/projects';
import DirectorGeneralPublicProfile from './pages/members/director';
import { PDPAConsentSystem } from './components/pdpa/PDPAConsentSystem';

export default function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-black">
            <Navbar />
            {getContent()}
            <Footer />
            <PDPAConsentSystem />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

function getContent() {
  const pathname = window.location.pathname;
  
  // Check if path matches movie details pattern
  if (pathname.match(/^\/thaifilms\/[^/]+$/)) {
    return <MovieDetailsPage />;
  }

  // Check if path matches director profile pattern
  if (pathname.match(/^\/profile\/public\/[^/]+$/)) {
    return <DirectorGeneralPublicProfile />;
  }

  // Protected routes
  const protectedRoutes = {
    '/register/director-search': <DirectorSearchPage />,
    '/register/department': <DepartmentPage />,
    '/register/verify': <UnderProduction />,
    '/register/basic-info': <UnderProduction />,
    '/profile': <UnderProduction />,
    '/profile/public': <PublicProfile />,
    '/profile/portfolio': <PortfolioPage />,
    '/edit-profile': <EditProfile />,
    '/admin': <AdminDashboard />,
    '/admin/dashboard': <AdminDashboard />,
    '/admin/applications': <MemberApplications />,
    '/admin/crew-applications': <CrewApplicationsPage />,
    '/admin/roles': <RoleManagement />,
    '/admin/content': <ContentEditorPage />,
    '/admin/content/films': <ThaiFilmDataEditorPage />,
    '/admin/content/events': <EventEditorPage />,
    '/admin/content/projects': <ProjectsEditorPage />,
    '/admin/content/credits': <CreditCertificationPage />,
    '/admin/content/awards': <UnderProduction />
  };

  if (pathname in protectedRoutes) {
    return (
      <ProtectedRoute>
        {protectedRoutes[pathname as keyof typeof protectedRoutes]}
      </ProtectedRoute>
    );
  }
  
  // Public routes
  switch (pathname) {
    case '/about/history':
      return <History />;
    case '/about/mission':
      return <Mission />;
    case '/about/thaifilm':
      return <ThaiFilmDefinition />;
    case '/news':
      return <NewsPage />;
    case '/members/committee':
      return <Committee />;
    case '/members/list':
      return <MembersListPage />;
    case '/members/directory':
      return <DirectorDirectory />;
    case '/members/crew':
      return <CrewPage />;
    case '/register':
      return <RegisterPage />;
    case '/register/public-member':
      return <PublicMemberPage />;
    case '/login':
      return <LoginPage />;
    case '/create-account':
      return <CreateAccountPage />;
    case '/forgot-password':
      return <ForgotPasswordPage />;
    case '/thaifilms':
      return <ThaiFilmsPage />;
    case '/activities/events':
      return <EventsPage />;
    case '/activities/projects':
      return <ProjectsPage />;
    case '/about/provision':
    case '/members':
    case '/awards':
    case '/contact':
      return <UnderProduction />;
    default:
      return (
        <main>
          <Hero />
          <FeaturedProject />
          <News />
          <Projects />
        </main>
      );
  }
}