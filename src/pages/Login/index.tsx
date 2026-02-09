import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  EmailOutlined as EmailIcon,
  Google,
  GitHub,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      return {
        token: 'ey-demo-token-123',
        refreshToken: 'ey-demo-refresh-token-123',
        user: {
          id: '1',
          email: data.email,
          name: 'Demo User',
        },
      };
    },
    onSuccess: (data) => {
      setAuth(data.token, data.refreshToken, data.user);
      navigate('/talha/dashboard');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const loginError = mutationError instanceof Error ? mutationError.message : mutationError ? 'Invalid credentials. Please try again.' : '';

  const handleSocialLogin = (provider: 'google' | 'github') => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              background: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                opacity: 0.1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                opacity: 0.1,
              }}
            />

            {/* Logo/Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <LockIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </motion.div>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1,
                }}
              >
                {t('auth.welcome_back')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('auth.signin_continue')}
              </Typography>
            </Box>

            {/* Login Form */}
            <Fade in={true}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {loginError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                  >
                    {loginError}
                  </Alert>
                )}

                {/* Email Field */}
                <TextField
                  fullWidth
                  label={t('auth.email')}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="you@example.com"
                  variant="outlined"
                  size="medium"
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'action.active' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="••••••••"
                  variant="outlined"
                  size="medium"
                />

                {/* Remember Me & Forgot Password */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      onClick={() => setRememberMe(!rememberMe)}
                      sx={{
                        p: 0,
                        mr: 1,
                        minWidth: 'auto',
                        color: rememberMe ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '4px',
                          border: `2px solid ${rememberMe ? theme.palette.primary.main : theme.palette.grey[400]}`,
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: rememberMe ? 'primary.main' : 'transparent',
                        }}
                      >
                        {rememberMe && (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '2px',
                              bgcolor: 'white',
                            }}
                          />
                        )}
                      </Box>
                      {t('auth.remember_me')}
                    </Button>
                  </Box>
                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      color: 'primary.main',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    {t('auth.forgot_password')}
                  </Button>
                </Box>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      t('auth.signin_btn')
                    )}
                  </Button>
                </motion.div>

                {/* Divider */}
                <Box sx={{ my: 4, position: 'relative' }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                      {t('auth.or_continue')}
                    </Typography>
                  </Divider>
                </Box>

                {/* Social Login Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('google')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: theme.palette.grey[300],
                      '&:hover': {
                        borderColor: theme.palette.grey[400],
                        background: 'rgba(219, 68, 55, 0.04)',
                      },
                    }}
                    startIcon={<Google />}
                  >
                    Google
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin('github')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: theme.palette.grey[300],
                      '&:hover': {
                        borderColor: theme.palette.grey[400],
                        background: 'rgba(51, 51, 51, 0.04)',
                      },
                    }}
                    startIcon={<GitHub />}
                  >
                    GitHub
                  </Button>
                </Box>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.no_account')}{' '}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate('/signup')} // Navigating to signup page
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'primary.main',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    >
                      {t('auth.signup_now')}
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
}

export default Login;