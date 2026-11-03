// Setting.js
import React from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import useCompanySettings from '../../../hooks/owner/useCompanySettings';
import MenuAccess from '../../../components/owner/MenuAccess';
import CompanySetting from '../../../components/owner/CompanySetting';

function Setting() {
  const {
    activeTab,
    handleTabChange,
    companyData,
    handleInputChange,
    logoPreview,
    handleLogoChange,
    frontPagePreview,
    handleFrontPageImageChange,
    handleSubmit,
    loading,
    message,
    menuAccessData,
    handleMenuAccessChange
  } = useCompanySettings();

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="MENU ACCESS" />
          <Tab label="COMPANY SETTINGS" />
        </Tabs>
      </Paper>

      {activeTab === 1 && (
        <CompanySetting
          companyData={companyData}
          handleInputChange={handleInputChange}
          logoPreview={logoPreview}
          handleLogoChange={handleLogoChange}
          frontPagePreview={frontPagePreview}
          handleFrontPageImageChange={handleFrontPageImageChange}
          handleSubmit={handleSubmit}
          loading={loading}
          message={message}
        />
      )}

      {activeTab === 0 && (
        <MenuAccess
          menuAccessData={menuAccessData}
          handleMenuAccessChange={handleMenuAccessChange}
          message={message}
        />
      )}
    </Box>
  );
}

export default Setting;