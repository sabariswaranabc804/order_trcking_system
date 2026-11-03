import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProfitCard = ({ totalRevenue, totalCost }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#4CAF50",
        color: "#fff",
        height: "470px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CardContent sx={{ height: "100%" }}>
        <Box display="flex" height="100%">
          {/* Left Half - Text */}
          <Box flex={1} display="flex" flexDirection="column" sx={{ mt: 5 }}>
            <Typography variant="h4">TOTAL PROFIT</Typography>
            <Typography variant="h3" fontWeight="bold">
              INR {(totalRevenue - totalCost).toLocaleString("en-IN")}
            </Typography>
            <DotLottieReact
              src="https://lottie.host/009a25e3-3266-44cb-a631-e24b8a6317e9/ls6oaAhOIi.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </Box>

          {/* Right Half - Lottie */}
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ overflow: "hidden" }}
          >
            <DotLottieReact
              src="https://lottie.host/577a2efc-bb55-48cd-ab5c-b95ebd654b8b/0If13GNOSv.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfitCard;