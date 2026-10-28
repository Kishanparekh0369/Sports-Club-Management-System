import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="dashboard-main">
        <Outlet context={{ onToggleMobile: () => setMobileOpen(!mobileOpen) }} />
      </div>
    </div>
  );
};

export default AdminLayout;
