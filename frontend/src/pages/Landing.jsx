import { Box, Container, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLanding, getProjects } from '../api';
import ProjectCard from '../components/common/ProjectCard';

const MotionBox = motion(Box);

export default function Landing() {
  const { data: landing } = useQuery({ queryKey: ['landing'], queryFn: getLanding });
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const featured = projects?.filter(p => p.is_featured)?.slice(0, 3) || [];

  return (
    <Box>
      {/* Hero */}
      <Box sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: landing?.hero_image ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${landing.hero_image}) center/cover` : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white', textAlign: 'center', px: 2,
      }}>
        <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 2, color: 'secondary.main' }}>
            {landing?.company_name || 'THE NEST ARCHITECTS'}
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.2rem', md: '1.8rem' }, mb: 4, opacity: 0.9, fontWeight: 300 }}>
            {landing?.tagline || 'Designing Spaces. Creating Dreams.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/projects" sx={{ px: 4, py: 1.5 }}>
              {landing?.cta_primary || 'Get Started'}
            </Button>
            <Button variant="outlined" size="large" href={`${API_URL}/auth/google`} sx={{ px: 4, py: 1.5, color: 'white', borderColor: 'white' }}>
              {landing?.cta_secondary || 'Sign in with Google'}
            </Button>
          </Box>
        </MotionBox>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'secondary.main', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {[['150+', 'Projects Completed'], ['10+', 'Years Experience'], ['500+', 'Happy Clients'], ['50+', 'Awards Won']].map(([num, label]) => (
              <Grid item xs={6} md={3} key={label} textAlign="center">
                <Typography variant="h4" fontWeight={700} color="primary.main">{num}</Typography>
                <Typography variant="body2" color="primary.main">{label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Overview */}
      {landing?.overview && (
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <MotionBox initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Typography variant="h3" mb={3}>Who We Are</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
              {landing.overview}
            </Typography>
          </MotionBox>
        </Container>
      )}

      {/* Mission & Vision */}
      {(landing?.mission || landing?.vision) && (
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {landing?.mission && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 4, height: '100%', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                    <Typography variant="h5" mb={2} fontWeight={600}>Our Mission</Typography>
                    <Typography color="text.secondary">{landing.mission}</Typography>
                  </Paper>
                </Grid>
              )}
              {landing?.vision && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 4, height: '100%', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <Typography variant="h5" mb={2} fontWeight={600}>Our Vision</Typography>
                    <Typography color="text.secondary">{landing.vision}</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Featured Projects */}
      {featured.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" textAlign="center" mb={1}>Featured Projects</Typography>
          <Typography textAlign="center" color="text.secondary" mb={5}>Our finest work</Typography>
          <Grid container spacing={3}>
            {featured.map((project, i) => (
              <Grid item xs={12} md={4} key={project.id}>
                <MotionBox initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <ProjectCard project={project} />
                </MotionBox>
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" mt={4}>
            <Button variant="outlined" color="primary" size="large" component={Link} to="/projects">View All Projects</Button>
          </Box>
        </Container>
      )}
    </Box>
  );
}
