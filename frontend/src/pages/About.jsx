import { Container, Typography, Grid, Box, Paper, Divider, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAbout } from '../api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function About() {
  const { data: about, isLoading } = useQuery({ queryKey: ['about'], queryFn: getAbout });
  const team = about?.team_members || [];

  if (isLoading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h2" mb={2}>About Us</Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: 600, mx: 'auto' }}>
            {about?.overview || 'Building dreams with precision and passion.'}
          </Typography>
        </MotionBox>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Mission & Vision */}
        <Grid container spacing={4} mb={8}>
          <Grid item xs={12} md={6}>
            <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Paper sx={{ p: 4, height: '100%', borderTop: '4px solid', borderColor: 'secondary.main' }}>
                <Typography variant="h5" fontWeight={700} mb={2}>Our Mission</Typography>
                <Typography color="text.secondary" lineHeight={1.8}>
                  {about?.mission || 'To deliver exceptional architectural solutions that transform spaces and enrich lives through innovative design and meticulous craftsmanship.'}
                </Typography>
              </Paper>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MotionBox initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Paper sx={{ p: 4, height: '100%', borderTop: '4px solid', borderColor: 'primary.main' }}>
                <Typography variant="h5" fontWeight={700} mb={2}>Our Vision</Typography>
                <Typography color="text.secondary" lineHeight={1.8}>
                  {about?.vision || 'To be the most trusted architecture firm, known for creating spaces that inspire, endure, and reflect the unique identity of every client.'}
                </Typography>
              </Paper>
            </MotionBox>
          </Grid>
        </Grid>

        {/* Why Choose Us */}
        <Box mb={8} textAlign="center">
          <Typography variant="h4" mb={4}>Why Choose Us</Typography>
          <Grid container spacing={3}>
            {[
              ['10+ Years', 'Of architectural excellence and innovation'],
              ['150+ Projects', 'Successfully delivered across categories'],
              ['100% Client Satisfaction', 'We prioritize your vision above all'],
              ['End-to-End Service', 'From concept to completion'],
            ].map(([title, desc]) => (
              <Grid item xs={12} sm={6} md={3} key={title}>
                <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Typography variant="h6" color="secondary.main" fontWeight={700} mb={1}>{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{desc}</Typography>
                  </Paper>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* History */}
        {about?.history && (
          <Box mb={8}>
            <Typography variant="h4" mb={3}>Our History</Typography>
            <Typography color="text.secondary" lineHeight={1.8}>{about.history}</Typography>
          </Box>
        )}

        {/* Achievements */}
        {about?.achievements && (
          <Box mb={8}>
            <Typography variant="h4" mb={3}>Achievements</Typography>
            <Typography color="text.secondary" lineHeight={1.8}>{about.achievements}</Typography>
          </Box>
        )}

        {/* Team */}
        {team.length > 0 && (
          <Box>
            <Typography variant="h4" textAlign="center" mb={4}>Our Team</Typography>
            <Grid container spacing={3} justifyContent="center">
              {team.map((member, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'secondary.main', mx: 'auto', mb: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {member.img
                          ? <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Typography variant="h5" color="white">{member.name[0]}</Typography>}
                      </Box>
                      <Typography fontWeight={600}>{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                    </Paper>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
