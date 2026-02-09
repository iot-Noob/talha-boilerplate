import { useState } from 'react';
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
  Grid,
  LinearProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  BadgeOutlined as BadgeIcon,
  PhoneOutlined as PhoneIcon,
  CheckCircleOutline as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().optional().refine((val) => !val || /^[+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-()]/g, '')), {
    message: 'Please enter a valid phone number',
  }),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username must only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface PasswordStrength {
  score: number;
  color: 'error' | 'warning' | 'info' | 'success';
  label: string;
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

function Signup() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const passwordValue = watch('password', '');

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    const score = Object.values(criteria).filter(Boolean).length;

    let color: 'error' | 'warning' | 'info' | 'success' = 'error';
    let label = 'Very Weak';

    if (score >= 4) {
      color = 'success';
      label = 'Strong';
    } else if (score === 3) {
      color = 'info';
      label = 'Good';
    } else if (score === 2) {
      color = 'warning';
      label = 'Fair';
    }

    return { score, color, label, criteria };
  };

  const passwordStrength = calculatePasswordStrength(passwordValue);

  const { mutate: signup, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: async (data: SignupFormValues) => {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      return {
        token: 'ey-demo-token-signup',
        refreshToken: 'ey-demo-refresh-token-signup',
        user: {
          id: '2',
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
        },
      };
    },
    onSuccess: (data) => {
      setSuccessMessage('Account created successfully! Redirecting...');
      setAuth(data.token, data.refreshToken, data.user);
      setTimeout(() => navigate('/talha/dashboard'), 1500);
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    signup(data);
  };

  const signupError = mutationError instanceof Error ? mutationError.message : mutationError ? 'Something went wrong. Please try again.' : '';

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
        <Container maxWidth="md">
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
                background: 'linear-gradient(45deg, #f093fb, #f5576c)',
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
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                opacity: 0.1,
              }}
            />

            {/* Header */}
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
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </motion.div>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1,
                }}
              >
                {t('auth.create_account')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('auth.join_community')}
              </Typography>
            </Box>

            {/* Form */}
            <Fade in={true}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {signupError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    {signupError}
                  </Alert>
                )}

                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    {successMessage}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  {/* First Name */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('auth.first_name')}
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="John"
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Last Name */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('auth.last_name')}
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Doe"
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('auth.email')}
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="john@example.com"
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Phone (Optional) */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('auth.phone')}
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="+1 234 567 8900"
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Username */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.username')}
                      {...register('username')}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="johndoe"
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.password')}
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
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

                    {/* Password Strength Indicator */}
                    {passwordValue && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Password strength
                          </Typography>
                          <Typography variant="caption" color={`${passwordStrength.color}.main`} fontWeight={600}>
                            {passwordStrength.label}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrength.score * 20}
                          color={passwordStrength.color}
                          sx={{ height: 6, borderRadius: 3 }}
                        />

                        {/* Password Criteria */}
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={1}>
                            {Object.entries(passwordStrength.criteria).map(([key, met]) => (
                              <Grid item xs={6} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {met ? (
                                    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  ) : (
                                    <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                  )}
                                  <Typography variant="caption" color={met ? 'success.main' : 'text.secondary'}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Box>
                    )}
                  </Grid>

                  {/* Confirm Password */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('auth.confirm_password')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: 'action.active' }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="••••••••"
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Terms and Conditions */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('acceptTerms')}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {t('auth.accept_terms')}
                        </Typography>
                      }
                    />
                    {errors.acceptTerms && (
                      <Typography color="error" variant="caption" sx={{ display: 'block', ml: 4 }}>
                        {errors.acceptTerms.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <Box sx={{ mt: 4 }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      fullWidth
                      type="submit"
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3a9bf3 0%, #00d9e3 100%)',
                          boxShadow: '0 6px 25px rgba(79, 172, 254, 0.4)',
                        },
                        '&:disabled': {
                          background: theme.palette.grey[300],
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        t('auth.create_account')
                      )}
                    </Button>
                  </motion.div>
                </Box>

                {/* Divider */}
                <Box sx={{ my: 4, position: 'relative' }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                      {t('auth.already_account')}
                    </Typography>
                  </Divider>
                </Box>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: theme.palette.grey[300],
                      '&:hover': {
                        borderColor: theme.palette.grey[400],
                        background: 'rgba(102, 126, 234, 0.04)',
                      },
                    }}
                  >
                    {t('auth.signin_existing')}
                  </Button>
                </Box>

                {/* Additional Info */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    By creating an account, you agree to receive important updates and notifications.
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

export default Signup;