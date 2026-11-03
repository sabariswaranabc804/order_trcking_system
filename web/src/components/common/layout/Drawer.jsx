import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Collapse, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMenuItems } from './MenuItems';
import { useState } from 'react';

import useCompanySettings from '../../../hooks/owner/useCompanySettings';
import API_URL from '../../../config';

const SideDrawer = ({ handleLogout, isDarkMode, isMobile, setMobileOpen, user, loading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const menuItems = getMenuItems(user, loading);
  const [openSubMenu, setOpenSubMenu] = useState('');
  const { companyData } = useCompanySettings();

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setOpenSubMenu(openSubMenu === item.text ? '' : item.text);
    } else {
      navigate(item.path);
      if (isMobile) setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: theme.palette.primary.main,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height:"70px"
        }}
      >
        <Box
          component="img"
          src={`${API_URL}/uploads/company/logo/${companyData.logo}`}
          alt="Company Logo"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `2px solid ${theme.palette.primary.contrastText}`,
            objectFit: 'cover'
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.contrastText,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {companyData.name}
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ p: 0, m: 0, flexGrow: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                selected={location.pathname === item.path}
                sx={{
                  py: 1.5,
                  px: 2,
                  color: theme.palette.text.primary,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }}
                />
                {item.subMenu && (
                  openSubMenu === item.text ? (
                    <ExpandLess sx={{ fontSize: 20 }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 20 }} />
                  )
                )}
              </ListItemButton>
            </ListItem>

            {item.subMenu && (
              <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subMenu.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      sx={{
                        pl: 6,
                        py: 1,
                        color: theme.palette.text.primary,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(122, 215, 204, 0.15)'
                            : 'rgba(65, 179, 163, 0.1)',
                          borderLeft: `3px solid ${theme.palette.primary.main}`,
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          },
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                      onClick={() => {
                        navigate(subItem.path);
                        if (isMobile) setMobileOpen(false);
                      }}
                      selected={location.pathname === subItem.path}
                    >
                      <ListItemIcon
                        sx={{
                          color: location.pathname === subItem.path
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                          minWidth: 36
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: location.pathname === subItem.path ? 600 : 400
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* Logout Button */}
      <Box>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.error.contrastText,
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.text.secondary,
                minWidth: 40
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default SideDrawer;