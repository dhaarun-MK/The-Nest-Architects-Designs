import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../api';

const navLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Estimator', to: '/estimator' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
          {s?.logo && <img src={s.logo} alt="logo" style={{ height: 32, objectFit: 'contain' }} />}
          <Typography variant="h6" sx={{ color: 'secondary.main', fontFamily: 'Playfair Display', fontWeight: 700 }}>
            {s?.company_name || 'THE NEST ARCHITECTS'}
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          {navLinks.map(l => (
            <Button key={l.to} component={Link} to={l.to} color="inherit">{l.label}</Button>
          ))}
          {user ? (
            <>
              <IconButton onClick={e => setAnchor(e.currentTarget)}>
                <Avatar src={user.profile} sx={{ width: 32, height: 32 }} />
              </IconButton>
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                <MenuItem disabled>{user.name}</MenuItem>
                <MenuItem onClick={() => { logout(); setAnchor(null); navigate('/'); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="contained" color="secondary" href={`${API_URL}/auth/google`}>
              Sign in with Google
            </Button>
          )}
        </Box>

        <IconButton sx={{ display: { md: 'none' } }} color="inherit" onClick={() => setDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <List sx={{ width: 220 }}>
          {navLinks.map(l => (
            <ListItem key={l.to} disablePadding>
              <ListItemButton component={Link} to={l.to} onClick={() => setDrawer(false)}>{l.label}</ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
