import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Avatar,
  Divider,
  Badge,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode,
  LightMode,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Language as LanguageIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../hooks/useThemeMode';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 64;

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' }
];

interface NavbarProps {
  title?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Navbar({ title, isCollapsed, onToggleCollapse }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const logout = useAuthStore((state) => state.logout);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [isLangDialogOpen, setIsLangDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { text: t('common.home'), icon: <HomeIcon />, path: '/' },
    { text: t('common.dashboard'), icon: <DashboardIcon />, path: '/talha/dashboard' },
    { text: t('common.settings'), icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const filteredLanguages = useMemo(() => {
    return languages.filter(lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangDialogOpen(false);
    setSearchQuery('');
  };

  const drawerContent = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      direction: theme.direction // Ensure inner box respects direction
    }}>
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        minHeight: 64
      }}>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>T</Avatar>
            <Typography variant="h6" fontWeight={700} noWrap>
              {t('common.boilerplate')}
            </Typography>
          </Box>
        )}
        {isCollapsed && <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>T</Avatar>}
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            component="div"
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2.5,
              borderRadius: 2,
              mb: 0.5,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Tooltip title={isCollapsed ? item.text : ''} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 'auto' : 3,
                  justifyContent: 'center',
                  color: 'primary.main'
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              primary={item.text}
              sx={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <List sx={{ px: 1 }}>
          <ListItem
            component="div"
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2.5,
              borderRadius: 2,
              mb: 0.5,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Tooltip title={isCollapsed ? t('common.profile') : ""} placement="right">
              <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 'auto' : 3, justifyContent: 'center' }}>
                <PersonIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={t('common.profile')} sx={{ opacity: isCollapsed ? 0 : 1 }} />
          </ListItem>

          <ListItem
            component="div"
            onClick={handleSignOut}
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2.5,
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'error.lighter', color: 'error.main' },
            }}
          >
            <Tooltip title={isCollapsed ? t('common.logout') : ""} placement="right">
              <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 'auto' : 3, justifyContent: 'center', color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={t('common.logout')} sx={{ opacity: isCollapsed ? 0 : 1 }} />
          </ListItem>
        </List>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', p: 1 }}>
          <IconButton onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED}px)`,
          ...(theme.direction === 'rtl'
            ? { mr: isMobile ? 0 : `${isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED}px` }
            : { ml: isMobile ? 0 : `${isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED}px` }
          ),
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {title || t('common.dashboard')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher */}
            <Tooltip title={currentLanguage.name}>
              <IconButton onClick={() => setIsLangDialogOpen(true)} sx={{ color: 'text.primary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LanguageIcon />
                  <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>
                    {currentLanguage.code.toUpperCase()}
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>

            <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>

            <IconButton sx={{ color: 'text.primary' }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: 'secondary.main' }}>
              <PersonIcon fontSize="small" />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={!isCollapsed || isMobile}
        onClose={onToggleCollapse}
        sx={{
          width: isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED,
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Language Selection Dialog */}
      <Dialog
        open={isLangDialogOpen}
        onClose={() => setIsLangDialogOpen(false)}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            p: { xs: 0, sm: 1 },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' },
            width: { xs: '100%', sm: 'auto' }
          }
        }}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Select Language</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredLanguages.map((lang) => (
              <ListItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                component="div"
                sx={{
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: i18n.language === lang.code ? 'primary.lighter' : 'transparent',
                  color: i18n.language === lang.code ? 'primary.main' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, fontSize: '1.2rem' }}>
                  {lang.flag}
                </ListItemIcon>
                <ListItemText
                  primary={lang.name}
                  secondary={lang.code.toUpperCase()}
                  primaryTypographyProps={{
                    fontWeight: i18n.language === lang.code ? 600 : 400,
                    color: 'text.primary'
                  }}
                  secondaryTypographyProps={{
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
            {filteredLanguages.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                No languages found matching "{searchQuery}"
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
