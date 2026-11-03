import { Avatar, Container, Typography, Grid, Card, CardContent, Button, Box, Paper, Divider, IconButton, useTheme as useMuiTheme } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { HomeOutlined, LocationOnOutlined } from '@mui/icons-material';
import UserNavbar from '../Home/UserNavbar';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useTheme } from '../../../theme/ThemeContext';
import { useProfile } from '../../../hooks/user/useProfile';

function UserProfile() {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const { user, handleCardClick, handleLogout } = useProfile();
  //console.log("profile",user);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const menuItems = [
    { icon: HomeOutlined, label: 'Home', path: '/user', color: muiTheme.palette.primary.main },
    { icon: LocationOnOutlined, label: 'Address', path: '/useraddress', color: muiTheme.palette.primary.main },
    { icon: PaymentIcon, label: 'Orders', path: '/history', color: muiTheme.palette.primary.main },
    { icon: FavoriteIcon, label: 'Favorites', path: '/wishlist', color: muiTheme.palette.error.main },
    { icon: ShoppingCartIcon, label: 'My Cart', path: '/cart-category', color: muiTheme.palette.primary.main },
    { icon: NotificationsIcon, label: 'Notifications', path: '/UserNotifications', color: muiTheme.palette.warning.main },
    { icon: FeedbackIcon, label: 'Feedback', path: '/feedback', color: muiTheme.palette.primary.main },
  ];

  return (
    <>
      <UserNavbar />
      <Box sx={{
        bgcolor: muiTheme.palette.background.default,
        minHeight: '100vh',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Profile Header Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              bgcolor: muiTheme.palette.background.paper,
              border: `1px solid ${muiTheme.palette.divider}`,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Gradient */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}40 0%, ${muiTheme.palette.primary.main}20 100%)`,
              zIndex: 0
            }} />

            <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Avatar
                  alt={user.user_Name}
                  src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4406.jpg?w=360"
                  sx={{
                    width: 120,
                    height: 120,
                    margin: { xs: '0 auto', sm: '0' },
                    border: `4px solid ${muiTheme.palette.background.paper}`,
                    boxShadow: muiTheme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.5)'
                      : '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={9}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: muiTheme.palette.text.primary,
                      textTransform: 'capitalize'
                    }}
                  >
                    {user.user_Name}
                  </Typography>
                  <Box sx={{
                    p: 1,
                    bgcolor: muiTheme.palette.action.hover,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary }}>
                      Theme
                    </Typography>
                    <DarkModeSwitch
                      checked={isDarkMode}
                      onChange={toggleTheme}
                      size={24}
                      sunColor={muiTheme.palette.warning.main}
                      moonColor={muiTheme.palette.primary.main}
                    />
                  </Box>
                </Box>

                <Grid container spacing={2} mt={4}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ color: muiTheme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
                        Phone:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: muiTheme.palette.text.primary }}>
                        {user.mobile_Number}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: muiTheme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
                        Email:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: muiTheme.palette.text.primary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.email_ID}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Activity Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: muiTheme.palette.text.primary,
                mb: 3
              }}
            >
              My Activity
            </Typography>

            <Grid container spacing={2}>
              {menuItems.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card
                    onClick={() => handleCardClick(item.path)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: muiTheme.palette.background.paper,
                      border: `1px solid ${muiTheme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: muiTheme.palette.mode === 'dark'
                          ? '0 8px 24px rgba(0,0,0,0.4)'
                          : '0 8px 24px rgba(0,0,0,0.12)',
                        borderColor: muiTheme.palette.primary.main,
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: muiTheme.palette.mode === 'dark'
                          ? `${item.color}20`
                          : `${item.color}15`,
                        mb: 1.5
                      }}>
                        <item.icon sx={{ fontSize: 32, color: item.color }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          color: muiTheme.palette.text.primary
                        }}
                      >
                        {item.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Logout Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: muiTheme.palette.error.main,
                '&:hover': {
                  bgcolor: muiTheme.palette.error.dark,
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default UserProfile;
