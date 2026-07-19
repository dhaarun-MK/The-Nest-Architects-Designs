import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Chip, CircularProgress, Tooltip } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, deleteMessage, markRead } from '../../api';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';

export default function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({ queryKey: ['messages'], queryFn: getMessages });

  const { mutate: remove } = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['messages']); },
  });

  const { mutate: read } = useMutation({
    mutationFn: markRead,
    onSuccess: () => qc.invalidateQueries(['messages']),
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Contact Messages</Typography>
      <Paper>
        {isLoading ? <Box p={4} textAlign="center"><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map(m => (
                <TableRow key={m.id} sx={{ bgcolor: m.is_read ? 'transparent' : 'rgba(201,168,76,0.05)' }}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone || '—'}</TableCell>
                  <TableCell>{m.subject}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</TableCell>
                  <TableCell><Chip label={m.is_read ? 'Read' : 'Unread'} size="small" color={m.is_read ? 'default' : 'warning'} /></TableCell>
                  <TableCell>
                    {!m.is_read && <Tooltip title="Mark as read"><IconButton size="small" color="success" onClick={() => read(m.id)}><DoneIcon fontSize="small" /></IconButton></Tooltip>}
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { if (confirm('Delete?')) remove(m.id); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && <TableRow><TableCell colSpan={7} align="center">No messages yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
