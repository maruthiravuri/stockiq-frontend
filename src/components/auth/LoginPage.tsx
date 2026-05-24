import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Tabs, Tab,
  Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ usernameOrEmail: '', email: '', username: '', password: '' });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setForm(p => ({ ...p, [k]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === 'login') {
        await login({ usernameOrEmail: form.usernameOrEmail, password: form.password });
      } else {
        await register({ email: form.email, username: form.username, password: form.password });
      }
    } catch {
      // error handled by context
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: theme => theme.palette.mode === 'dark' ? '#0A0E1A' : '#F0F2F7',
    }}>
      <Paper sx={{ width: 400, p: 4 }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center' }}>
          <AutoGraphIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 2 }}>
            STOCKIQ
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Real-time stock & ETF research platform
        </Typography>

        <Tabs value={tab} onChange={(_, v) => { setTab(v); clearError(); }}
          sx={{ mb: 3, '& .MuiTab-root': { flex: 1 } }}>
          <Tab label="Sign In" value="login" />
          <Tab label="Create Account" value="register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tab === 'register' && (
            <>
              <TextField label="Email" type="email" size="small" fullWidth required
                value={form.email} onChange={set('email')}
                slotProps={{ input: { sx: { fontSize: '0.85rem' } } }} />
              <TextField label="Username" size="small" fullWidth required
                value={form.username} onChange={set('username')}
                slotProps={{ input: { sx: { fontSize: '0.85rem' } } }} />
            </>
          )}
          {tab === 'login' && (
            <TextField label="Username or Email" size="small" fullWidth required
              value={form.usernameOrEmail} onChange={set('usernameOrEmail')}
              slotProps={{ input: { sx: { fontSize: '0.85rem' } } }} />
          )}
          <TextField
            label="Password" size="small" fullWidth required
            type={showPassword ? 'text' : 'password'}
            value={form.password} onChange={set('password')}
            slotProps={{
              input: {
                sx: { fontSize: '0.85rem' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }} />

          <Button type="submit" variant="contained" fullWidth disabled={isLoading}
            sx={{ mt: 1, height: 40, fontWeight: 700 }}>
            {isLoading ? <CircularProgress size={18} /> : tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </Box>

        {tab === 'login' && (
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
            Demo: admin / Admin@123
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LoginPage;
