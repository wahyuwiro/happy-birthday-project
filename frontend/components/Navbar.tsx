"use client";

import { 
  ExpandMore, 
  PersonOutline, 
  AccountCircle,
  ExitToApp,
  Cake
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter , usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();


  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  // Handlers for Profile Dropdown
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
    handleMenuClick("profile")
  };

  // Function to handle active menu click
  const handleMenuClick = (menu: string) => {
    console.log("menu", menu);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    if (menu === "home") router.push(baseUrl);
    else router.push(baseUrl + "/" + menu);
  };

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (!session) {
      // Redirect to signin page if no session is available
      if (pathname !== '/auth/signup') router.push('/auth/signin');
    }
  }, [session, status, router]);

  return (
    <AppBar
      position="static"
      className="shadow-none"
      sx={{
        "& .MuiToolbar-root": {
          paddingX: "1rem",
          backgroundColor: "white",
        },
        " & .MuiTypography-h6": {
          fontSize: "1rem",
        }
      }}>
      <Toolbar className="flex justify-between">
        <Box className="flex gap-1 cursor-pointer" onClick={() => handleMenuClick("home")}>
          <Cake className="text-black" />
          <Typography
            variant="h6"
            className="text-black my-auto">
            Birthday User Management
          </Typography>
        </Box>

        {session && (
          <Box className="flex items-center">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className="flex items-center"
              sx={{
                "&:hover": { backgroundColor: "transparent" },
                "& img": {
                  width: "24px",
                  height: "24px",
                  borderRadius: "90%"
                }
              }}>
              <AccountCircle className="text-black" />
              <span className="text-black text-sm ml-1">{session?.user?.firstName || ""}</span>{" "}
              <ExpandMore className="text-black" />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={profileAnchorEl}
              keepMounted
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}>
              <MenuItem onClick={handleProfileMenuClose}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonOutline className="text-black" />
                Profile
              </Box>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  signOut();
                  router.push('/auth/signin');
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ExitToApp className="text-black" />
                  Logout
                </Box>              
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      <div className="opacity-50 h-[0.5px] bg-[#777A7D]"></div>
    </AppBar>
  );
}
