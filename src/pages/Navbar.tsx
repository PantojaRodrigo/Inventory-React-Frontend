import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import Logo from "../Netlogistik_Logo_Positivo.png";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "rgb(255,103,29)" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/*Logo Large screens*/}
            <IconButton
              sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
              color="inherit"
              aria-label="logo"
            >
              <img src={Logo} alt="Logo-md" style={{ height: "50px" }} />
            </IconButton>
            {/*Small screens*/}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", sm: "none" },
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                aria-label="menu-appbar"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <IconButton
                sx={{
                  flexShrink: 0,
                  display: { xs: "flex", sm: "none" },
                  mx: "auto",
                }}
                color="inherit"
                aria-label="logo"
              >
                <img src={Logo} alt="Logo-xs" style={{ height: "50px" }} />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/items">
                    <Typography textAlign="center" aria-label="Inventory-menu-item">
                      Inventory
                    </Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" aria-label="Login-menu-item">
                    Log In
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            {/*Buttons Large screens*/}
            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "none", sm: "flex" },
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Link to="/items" style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    my: 2,
                    color: "rgb(0,38,58)",
                    display: "flex",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                  }}
                  aria-label="Inventory-button"
                >
                  Inventory
                </Button>
              </Link>
              <Button
                sx={{
                  my: 2,
                  color: "rgb(0,38,58)",
                  display: "flex",
                  fontFamily: "arial",
                  fontWeight: 700,
                }}
                aria-label="Login-button"
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* "rgb(255,103,29)"  */}
      {/* "rgb(0,38,58)" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </>
  );
};

export default Navbar;
