import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  useMediaQuery,
  Drawer,
  IconButton,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ServiceCard from "./ServiceCard";
import UserNavbar from "./UserNavbar";
import SupportChat from "../Query/SupportChat";
import VoiceCommandButton from "../../../components/user/VoiceCommandButton";
import OpenAIVoiceCommandButton from "../../../components/user/OpenAIVoiceCommandButton";
import VoiceCommandHelp from "../../../components/user/VoiceCommandHelp";
import { useUserHomeData } from "../../../hooks/user/useUserHomeData";
import { useLocation } from "react-router-dom";
import API_URL from "../../../config";
import serviceImg from "../../../assets/img/service.png";

const SIDEBAR_WIDTH = 200;

function UserHome() {
  const location = useLocation();
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all service");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);
  const [voiceFilterActive, setVoiceFilterActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");

  // Check for filter parameter from URL (from cart page voice commands)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      handleVoiceServiceFilter(filterParam);
    }
  }, [location.search]);

  const { services, servicesName, loading } = useUserHomeData();

  const triggerRefresh = () => setRefresh((prev) => !prev);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleClick = (serv_Name) => {
    setSelectedCategory(serv_Name.toLowerCase());
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Handle voice command service filtering
  const handleVoiceServiceFilter = (serviceName) => {
    const normalizedServiceName = serviceName.toLowerCase();

    // Find matching service from servicesName
    const matchingService = servicesName.find(service =>
      service.serv_Name?.toLowerCase().includes(normalizedServiceName)
    );

    if (matchingService) {
      setSelectedCategory(matchingService.serv_Name.toLowerCase());
      setVoiceFilterActive(true);

      // Clear voice filter indicator after 3 seconds
      setTimeout(() => setVoiceFilterActive(false), 3000);
    } else {
      // Try partial matching
      const partialMatch = servicesName.find(service =>
        normalizedServiceName.includes(service.serv_Name?.toLowerCase()) ||
        service.serv_Name?.toLowerCase().includes(normalizedServiceName)
      );

      if (partialMatch) {
        setSelectedCategory(partialMatch.serv_Name.toLowerCase());
        setVoiceFilterActive(true);
        setTimeout(() => setVoiceFilterActive(false), 3000);
      }
    }
  };

  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (bottom) setVisibleCount((prev) => prev + 17);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredServices = services
    .filter(
      (service) =>
        (selectedCategory === "all service" ||
          service.serv_Name?.toLowerCase() === selectedCategory) &&
        service.servSubType_Name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, visibleCount);

  const categories = [
    { name: "All Services", value: "all service", img: serviceImg },
    ...servicesName.map((service) => ({
      name: service.serv_Name,
      value: service.serv_Name.toLowerCase(),
      img: `${API_URL}/uploads/product-images/${service.imagefile}`,
    })),
  ];

  const renderSidebar = () => (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
        py: 2,
      }}
    >
      {categories.map((category, index) => (
        <Box
          key={index}
          onClick={() => handleClick(category.value)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1.5,
            cursor: "pointer",
            bgcolor: selectedCategory === category.value 
              ? theme.palette.action.selected
              : "transparent",
            borderLeft: selectedCategory === category.value 
              ? `4px solid ${theme.palette.primary.main}` 
              : "4px solid transparent",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <Box
            component="img"
            src={category.img}
            alt={category.name}
            sx={{
              width: 32,
              height: 32,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: selectedCategory === category.value ? 600 : 400,
              color: selectedCategory === category.value 
                ? theme.palette.primary.main 
                : theme.palette.text.primary,
              textTransform: "capitalize",
            }}
          >
            {category.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <UserNavbar />

      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {/* Mobile Drawer */}
        {isMobile && (
          <>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                position: "fixed",
                top: 90,
                left: 16,
                zIndex: 1200,
                bgcolor: theme.palette.background.paper,
                boxShadow: 2,
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": {
                  width: SIDEBAR_WIDTH,
                  boxSizing: "border-box",
                  mt: "64px",
                },
              }}
            >
              {renderSidebar()}
            </Drawer>
          </>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              position: "fixed",
              top: 64,
              left: 0,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              bgcolor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
              zIndex: 1100,
            }}
          >
            {renderSidebar()}
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: theme.palette.background.default,
            minHeight: "100%",
            ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          }}
        >
          {voiceFilterActive && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2">
                🎤 Voice filter applied: Showing "{selectedCategory}" services
              </Typography>
            </Box>
          )}

          {/* Header with Title and Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-end", sm: "space-between" },
              mb: 3,
              gap: 2,
              flexWrap: { xs: "wrap", sm: "nowrap" },
              ml: { xs: isMobile ? "56px" : 0, sm: 0 },
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                width: { xs: "calc(100% - 56px)", sm: "400px" },
                bgcolor: theme.palette.background.paper,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Services Grid */}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                },
                gap: 2,
              }}
            >
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.servSubType_Id}
                  triggerRefresh={triggerRefresh}
                  refresh={refresh}
                  service={service}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <SupportChat />

      {/* Voice Commands */}
      {import.meta.env.VITE_OPENAI_API_KEY ? (
        <OpenAIVoiceCommandButton
          services={services}
          onServiceFilter={handleVoiceServiceFilter}
        />
      ) : (
        <VoiceCommandButton
          services={services}
          onServiceFilter={handleVoiceServiceFilter}
        />
      )}

      <VoiceCommandHelp />
    </>
  );
}

export default UserHome;
