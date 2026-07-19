import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../api';
import { Container, Grid, Typography, Box, Chip, Divider, ImageList, ImageListItem, Button, CircularProgress, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { motion } from 'framer-motion';

export default function ProjectDetails() {
  const { id } = useParams();
  const { data: project, isLoading } = useQuery({ queryKey: ['project', id], queryFn: () => getProject(id) });

  if (isLoading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;
  if (!project) return <Typography textAlign="center" py={10}>Project not found.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/projects" sx={{ mb: 3 }}>Back to Projects</Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 4, height: 500 }}>
          <img src={project.cover_image || 'https://placehold.co/1200x500?text=No+Image'} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Chip label={project.category} color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h3" mb={2}>{project.title}</Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>{project.description}</Typography>

            {project.materials_used && (
              <>
                <Typography variant="h6" mb={1}>Materials Used</Typography>
                <Typography color="text.secondary" mb={3}>{project.materials_used}</Typography>
              </>
            )}

            {project.challenges && (
              <>
                <Typography variant="h6" mb={1}>Challenges</Typography>
                <Typography color="text.secondary" mb={3}>{project.challenges}</Typography>
              </>
            )}

            {(project.before_image || project.after_image) && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" mb={2}>Before & After</Typography>
                <Grid container spacing={2}>
                  {project.before_image && <Grid item xs={6}><Typography variant="caption">Before</Typography><img src={project.before_image} alt="Before" style={{ width: '100%', borderRadius: 8 }} /></Grid>}
                  {project.after_image && <Grid item xs={6}><Typography variant="caption">After</Typography><img src={project.after_image} alt="After" style={{ width: '100%', borderRadius: 8 }} /></Grid>}
                </Grid>
              </>
            )}

            {project.gallery?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" mb={2}>Gallery</Typography>
                <ImageList cols={3} gap={8}>
                  {project.gallery.map(img => (
                    <ImageListItem key={img.id} sx={{ height: 160, overflow: 'hidden', borderRadius: 2 }}>
                      <img src={img.image} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                    </ImageListItem>
                  ))}
                </ImageList>
              </>
            )}

            {project.testimonial && (
              <>
                <Divider sx={{ my: 3 }} />
                <Paper sx={{ p: 3, borderLeft: '4px solid', borderColor: 'secondary.main', bgcolor: 'grey.50' }}>
                  <Typography variant="body1" fontStyle="italic">"{project.testimonial}"</Typography>
                  {project.client_name && <Typography variant="caption" color="text.secondary" mt={1} display="block">— {project.client_name}</Typography>}
                </Paper>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
              <Typography variant="h6" mb={2}>Project Details</Typography>
              {[
                [<LocationOnIcon />, 'Location', project.location],
                [<CalendarMonthIcon />, 'Duration', project.duration],
                [<AttachMoneyIcon />, 'Budget', `₹${Number(project.budget).toLocaleString('en-IN')}`],
                project.completed_date && [<CalendarMonthIcon />, 'Completed', project.completed_date],
                project.client_name && [null, 'Client', project.client_name],
              ].filter(Boolean).map(([icon, label, value]) => (
                <Box key={label} display="flex" alignItems="center" gap={1} mb={1.5}>
                  {icon && <Box color="secondary.main">{icon}</Box>}
                  <Box>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={500}>{value}</Typography>
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Button variant="contained" color="secondary" fullWidth component={Link} to="/estimator">Get Cost Estimate</Button>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}
