import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import LoginRegister from "pages/login-register";
import Dashboard from "pages/dashboard";
import FamilyTreeCanvas from "pages/family-tree-canvas";
import MemberProfile from "pages/member-profile";
import ImportData from "pages/import-data";
import ExportShare from "pages/export-share";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/family-tree-canvas" element={<FamilyTreeCanvas />} />
          <Route path="/member-profile" element={<MemberProfile />} />
          <Route path="/import-data" element={<ImportData />} />
          <Route path="/export-share" element={<ExportShare />} />
          <Route path="/" element={<LoginRegister />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;