import { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Chip, CircularProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Divider,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, deleteMessage, markRead, pinMessage } from '../../api';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AdminMessages() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const { data: messages = [], isLoading } = useQuery({ queryKey: ['messages'], queryFn: getMessages });

  const { mutate: remove } = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['messages']); },
  });

  const { mutate: read } = useMutation({
    mutationFn: markRead,
    onSuccess: () => qc.invalidateQueries(['messages']),
  });

  const { mutate: pin } = useMutation({
    mutationFn: pinMessage,
    onSuccess: (data) => { toast.success(data.is_pinned ? 'Pinned' : 'Unpinned'); qc.invalidateQueries(['messages']); },
  });

  const handleView = (m) => {
    setSelected(m);
    if (!m.is_read) read(m.id);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Contact Messages</Typography>
      <Paper>
        {isLoading ? <Box p={4} textAlign="center"><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 32, pr: 0 }} />
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
                <TableRow key={m.id} sx={{ bgcolor: m.is_pinned ? 'rgba(201,168,76,0.08)' : 'transparent' }}>
                  <TableCell sx={{ width: 32, pr: 0 }}>
                    {m.is_pinned && <PushPinIcon sx={{ fontSize: 15, color: '#c9a84c', transform: 'rotate(45deg)' }} />}
                  </TableCell>
                  <TableCell sx={{ fontWeight: m.is_read ? 400 : 600 }}>{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone || '—'}</TableCell>
                  <TableCell sx={{ fontWeight: m.is_read ? 400 : 600 }}>{m.subject}</TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography noWrap sx={{ fontSize: 13, maxWidth: 130 }}>{m.message}</Typography>
                      <Tooltip title="View full message">
                        <IconButton size="small" onClick={() => handleView(m)} sx={{ flexShrink: 0 }}>
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={m.is_read ? '' : 'Click to mark as read'} disableHoverListener={m.is_read}>
                      <Chip
                        label={m.is_read ? 'Read' : 'Unread'}
                        size="small"
                        color={m.is_read ? 'default' : 'warning'}
                        onClick={m.is_read ? undefined : () => read(m.id)}
                        sx={{ cursor: m.is_read ? 'default' : 'pointer' }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={m.is_pinned ? 'Unpin' : 'Pin'}>
                      <IconButton size="small" onClick={() => pin(m.id)} sx={{ color: m.is_pinned ? '#c9a84c' : 'text.secondary' }}>
                        {m.is_pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={m.is_pinned ? 'Unpin to delete' : 'Delete'}>
                      <span>
                        <IconButton size="small" color="error" disabled={m.is_pinned} onClick={() => { if (confirm('Delete this message?')) remove(m.id); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No messages yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* View Message Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {selected.subject}
              {selected.is_pinned && <PushPinIcon sx={{ fontSize: 16, color: '#c9a84c', transform: 'rotate(45deg)', ml: 0.5 }} />}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">From</Typography>
                <Typography variant="body2" fontWeight={600}>{selected.name}</Typography>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body2">{selected.email}</Typography>
                {selected.phone && <>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body2">{selected.phone}</Typography>
                </>}
                <Typography variant="body2" color="text.secondary">Date</Typography>
                <Typography variant="body2">{new Date(selected.created_at).toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" mb={0.5}>Message</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{selected.message}</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button
                size="small"
                startIcon={selected.is_pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                onClick={() => { pin(selected.id); setSelected(prev => ({ ...prev, is_pinned: !prev.is_pinned })); }}
                sx={{ color: selected.is_pinned ? '#c9a84c' : 'text.secondary', mr: 'auto' }}
              >
                {selected.is_pinned ? 'Unpin' : 'Pin'}
              </Button>
              <Button onClick={() => setSelected(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
