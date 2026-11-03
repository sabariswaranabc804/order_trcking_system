import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Badge, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../context/AuthContext';

const Header = ({ handleDrawerToggle, isDarkMode, toggleTheme, drawerWidth, user, loading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user: userDetails } = useAuth();
  const userType = userDetails?.userType;
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: 'none' },
            color: theme.palette.text.primary
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Dashboard
        </Typography>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: theme.palette.action.hover,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <DarkModeSwitch
              checked={isDarkMode}
              onChange={toggleTheme}
              size={24}
              sunColor={theme.palette.warning.main}
              moonColor={theme.palette.primary.main}
            />
          </Box>

          {/* Notifications */}
          <IconButton
            onClick={() => {
              if (userType == 2) {
                navigate('/admin/AdminNotifications');
              } else if (userType == 4) {
                navigate('/anchor/AnchorNotifications');
              }
            }}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            <Badge
              badgeContent={0}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: theme.palette.error.main
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <IconButton
            onClick={() => navigate('/admin/profile')}
            sx={{
              p: 0.5,
              '&:hover': {
                bgcolor: 'transparent'
              }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                fontSize: '1rem',
                border: `2px solid ${theme.palette.divider}`,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              {!loading && user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;