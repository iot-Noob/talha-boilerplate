// MainPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { DashboardSkeleton } from '../../components/Skeletons';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Notifications as NotificationsIcon,
  Download as DownloadIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

// ==================== ECHARTS COMPONENT ====================
const ChartContainer = ({ option, style, title, subtitle }: {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  title?: string;
  subtitle?: string;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [option]);

  return (
    <Box>
      {(title || subtitle) && (
        <Box mb={2}>
          {title && <Typography variant="h6" fontWeight={600}>{title}</Typography>}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <div ref={chartRef} style={{ width: '100%', height: '300px', ...style }} />
    </Box>
  );
};

// ==================== MAIN COMPONENT ====================
const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  // Chart 1: Enrollment Trends
  const enrollmentOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }],
    yAxis: [{ type: 'value', name: 'Students' }],
    series: [{
      name: 'Enrollments',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130, 180, 210, 240, 190, 220],
      itemStyle: { color: '#4f46e5', borderRadius: [4, 4, 0, 0] }
    }]
  };

  // Chart 3: Performance Gauge
  const performanceOption: echarts.EChartsOption = {
    series: [{
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      progress: { show: true, width: 18, itemStyle: { color: '#4f46e5' } },
      axisLine: { lineStyle: { width: 18, color: [[1, '#e5e7eb']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 24,
        fontWeight: 'bold'
      },
      data: [{ value: 78.5 }]
    }]
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <Box sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100vh',
      bgcolor: 'background.default',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 4
      }}>
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            gutterBottom
            color="text.primary"
          >
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard.welcome_prof')}
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-end', md: 'flex-start' } }}
        >
          <IconButton
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={handleSignOut}
            title={t('common.logout')}
          >
            <LogoutIcon color="error" fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
            title={t('common.notifications')}
          >
            <NotificationsIcon fontSize="small" />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            {t('dashboard.export')}
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
        {[
          { title: t('dashboard.total_students'), value: '2,847', change: '+12.5%', icon: <PeopleIcon />, color: '#4f46e5' },
          { title: t('dashboard.active_courses'), value: '48', change: '+3', icon: <SchoolIcon />, color: '#10b981' },
          { title: t('dashboard.completion_rate'), value: '84.2%', change: '+5.3%', icon: <TrendingUpIcon />, color: '#f59e0b' },
          { title: t('dashboard.avg_study_time'), value: '6.2 hrs', change: '+1.4 hrs', icon: <AccessTimeIcon />, color: '#ef4444' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        bgcolor: `${stat.color}15`,
                        color: stat.color,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Box>
                  <Avatar sx={{
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 }
                  }}>
                    {React.cloneElement(stat.icon as React.ReactElement, { fontSize: isMobile ? 'small' : 'medium' })}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <ChartContainer
              option={enrollmentOption}
              title={t('dashboard.enrollment_trends')}
              subtitle={t('dashboard.monthly_enrollment')}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <ChartContainer
              option={performanceOption}
              title={t('dashboard.overall_performance')}
              subtitle={t('dashboard.avg_performance')}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainPage;