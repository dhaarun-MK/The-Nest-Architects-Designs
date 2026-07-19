import { useState } from 'react';
import { Container, Grid, Typography, Box, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Button, Paper, Divider, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api';
import ProjectCard from '../components/common/ProjectCard';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Villa', 'House', 'Interior', 'Commercial', 'Office', 'Apartment', 'School', 'Hospital'];
const MotionGrid = motion(Grid);

export default function Projects() {
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = projects.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" textAlign="center" mb={1}>Our Projects</Typography>
      <Typography textAlign="center" color="text.secondary" mb={5}>Explore our portfolio of architectural excellence</Typography>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap" alignItems="center">
        <TextField size="small" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} sx={{ minWidth: 220 }} />
        <Box display="flex" gap={1} flexWrap="wrap">
          {CATEGORIES.map(cat => (
            <Chip key={cat} label={cat} onClick={() => setCategory(cat)} color={category === cat ? 'secondary' : 'default'} variant={category === cat ? 'filled' : 'outlined'} />
          ))}
        </Box>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((project, i) => (
            <MotionGrid item xs={12} sm={6} md={4} key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ProjectCard project={project} />
            </MotionGrid>
          ))}
          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Typography textAlign="center" color="text.secondary" py={6}>No projects found.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
