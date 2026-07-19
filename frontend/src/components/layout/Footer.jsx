import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../api';

export default function Footer() {
  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', pt: 6, pb: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: 'secondary.main', mb: 1 }}>
              {s?.company_name || 'THE NEST ARCHITECTS'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Designing Spaces. Creating Dreams.
            </Typography>
            <Box mt={2}>
              {s?.instagram && <IconButton color="inherit" href={s.instagram} target="_blank"><InstagramIcon /></IconButton>}
              {s?.facebook && <IconButton color="inherit" href={s.facebook} target="_blank"><FacebookIcon /></IconButton>}
              {s?.linkedin && <IconButton color="inherit" href={s.linkedin} target="_blank"><LinkedInIcon /></IconButton>}
              {!s?.instagram && !s?.facebook && !s?.linkedin && (
                <>
                  <IconButton color="inherit" href="#"><InstagramIcon /></IconButton>
                  <IconButton color="inherit" href="#"><FacebookIcon /></IconButton>
                  <IconButton color="inherit" href="#"><LinkedInIcon /></IconButton>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Quick Links</Typography>
            {[['Projects', '/projects'], ['About', '/about'], ['Contact', '/contact'], ['Estimator', '/estimator']].map(([label, to]) => (
              <Box key={to}>
                <Link component={RouterLink} to={to} color="inherit" underline="hover" sx={{ opacity: 0.7, fontSize: 14 }}>
                  {label}
                </Link>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Contact</Typography>
            {s?.email && <Typography variant="body2" sx={{ opacity: 0.7 }}>{s.email}</Typography>}
            {s?.phone && <Typography variant="body2" sx={{ opacity: 0.7 }}>{s.phone}</Typography>}
            {!s?.email && <Typography variant="body2" sx={{ opacity: 0.7 }}>dhaarun@gmail.com</Typography>}
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="body2" align="center" sx={{ opacity: 0.5 }}>
          {s?.footer_text || `© ${new Date().getFullYear()} ${s?.company_name || 'THE NEST ARCHITECTS'}. All rights reserved.`}
        </Typography>
      </Container>
    </Box>
  );
}
