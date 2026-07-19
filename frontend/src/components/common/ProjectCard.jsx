import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
      <CardMedia
        component="img"
        height="220"
        image={project.cover_image || 'https://placehold.co/400x220?text=No+Image'}
        alt={project.title}
        sx={{ objectFit: 'cover', objectPosition: 'center', width: '100%' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Chip label={project.category} size="small" color="secondary" sx={{ mb: 1 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>{project.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">{project.location}</Typography>
        </Box>
        {project.client_name && (
          <Typography variant="caption" color="text.secondary" display="block">Client: {project.client_name}</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/projects/${project.id}`} color="primary">Read More</Button>
      </CardActions>
    </Card>
  );
}
