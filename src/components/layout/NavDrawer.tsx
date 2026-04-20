import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Divider,
  Toolbar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from './constants';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const navSections = [
  {
    subheader: 'Reference',
    items: [
      { label: 'Careers', path: '/reference/careers' },
      { label: 'Skills', path: '/reference/skills' },
      { label: 'Talents', path: '/reference/talents' },
      { label: 'Trappings', path: '/reference/trappings' },
      { label: 'Spells', path: '/reference/spells' },
      { label: 'Prayers', path: '/reference/prayers' },
    ],
  },
  {
    subheader: 'Characters',
    items: [{ label: 'My Characters', path: '/characters' }],
  },
  {
    subheader: 'Tools',
    items: [
      { label: 'Dice Roller', path: '/dice' },
      { label: 'Settings', path: '/settings' },
    ],
  },
];

export default function NavDrawer({ open, onClose, isMobile }: NavDrawerProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : undefined}
      onClose={onClose}
      sx={{
        width: isMobile ? 'auto' : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      {!isMobile && <Toolbar />}
      <List disablePadding>
        {navSections.map(({ subheader, items }) => (
          <div key={subheader}>
            <ListSubheader disableSticky sx={{ lineHeight: '36px', mt: 1 }}>
              {subheader}
            </ListSubheader>
            {items.map(({ label, path }) => (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  selected={isActive(path)}
                  onClick={() => handleNav(path)}
                  sx={{ pl: 3 }}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 1 }} />
          </div>
        ))}
      </List>
    </Drawer>
  );
}
