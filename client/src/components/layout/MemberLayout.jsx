import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MemberSidebar from './MemberSidebar';

const MemberLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <MemberSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="dashboard-main">
        <Outlet context={{ onToggleMobile: () => setMobileOpen(!mobileOpen) }} />
      </div>
    </div>
  );
};

export default MemberLayout;
