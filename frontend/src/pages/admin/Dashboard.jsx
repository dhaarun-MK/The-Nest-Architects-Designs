import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getProjects, getUsers, getMessages } from '../../api';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';

function StatCard({ icon, label, value, color }) {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ bgcolor: color, borderRadius: 2, p: 1.5, color: 'white', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="h4" fontWeight={700}>{value ?? <CircularProgress size={20} />}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: messages = [] } = useQuery({ queryKey: ['messages'], queryFn: getMessages });

  const featured = projects.filter(p => p.is_featured).length;
  const unread = messages.filter(m => !m.is_read).length;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>Dashboard Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<FolderIcon />} label="Total Projects" value={projects.length} color="#1a1a2e" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PeopleIcon />} label="Total Users" value={users.length} color="#c9a84c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<MessageIcon />} label="Unread Messages" value={unread} color="#e53935" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<StarIcon />} label="Featured Projects" value={featured} color="#43a047" />
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recent Projects</Typography>
            {projects.slice(0, 5).map(p => (
              <Box key={p.id} display="flex" justifyContent="space-between" py={1} borderBottom="1px solid" borderColor="divider">
                <Typography variant="body2">{p.title}</Typography>
                <Typography variant="caption" color="text.secondary">{p.category}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recent Messages</Typography>
            {messages.slice(0, 5).map(m => (
              <Box key={m.id} display="flex" justifyContent="space-between" py={1} borderBottom="1px solid" borderColor="divider">
                <Typography variant="body2">{m.name} — {m.subject}</Typography>
                {!m.is_read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mt: 0.8 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
