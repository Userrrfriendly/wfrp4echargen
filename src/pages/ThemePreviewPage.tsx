import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

function TabPanel({
  children,
  value,
  index,
}: {
  children: ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        minWidth: 96,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          bgcolor: value,
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Typography
        variant="caption"
        align="center"
        sx={{ fontFamily: 'monospace', lineHeight: 1.3, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        sx={{ fontFamily: 'monospace' }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function SwatchRow({ colors }: { colors: { label: string; value: string }[] }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
      {colors.map(({ label, value }) => (
        <ColorSwatch key={label} label={label} value={value} />
      ))}
    </Box>
  );
}

const TYPOGRAPHY_VARIANTS = [
  { variant: 'h1', label: 'The quick brown fox' },
  { variant: 'h2', label: 'The quick brown fox' },
  { variant: 'h3', label: 'The quick brown fox' },
  { variant: 'h4', label: 'The quick brown fox' },
  { variant: 'h5', label: 'The quick brown fox' },
  { variant: 'h6', label: 'The quick brown fox' },
  { variant: 'diablo', label: 'The Diablo Display Font' },
  {
    variant: 'subtitle1',
    label: 'Subtitle 1 — supporting text under a heading',
  },
  { variant: 'subtitle2', label: 'Subtitle 2 — smaller supporting text' },
  {
    variant: 'body1',
    label:
      'Body 1 — this is the default body text style used throughout the application for all readable content.',
  },
  {
    variant: 'body2',
    label: 'Body 2 — slightly smaller body text (avoid in favour of body1).',
  },
  { variant: 'button', label: 'Button label text' },
  { variant: 'caption', label: 'Caption — small label or annotation text' },
  { variant: 'overline', label: 'Overline — uppercase category label' },
] as const;

export default function ThemePreviewPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const p = theme.palette;

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Theme Preview
      </Typography>
      <Typography
        component="div"
        variant="body1"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Current mode:{' '}
        <Chip
          label={p.mode}
          size="small"
          variant="outlined"
          sx={{
            fontFamily: 'monospace',
            '& .MuiChip-label': { opacity: 0.95 },
          }}
        />
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}
      >
        <Tab label="Palette" />
        <Tab label="Typography" />
        <Tab label="Shadows" />
      </Tabs>

      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        {/* ── Palette ─────────────────────────────────────────── */}
        <TabPanel value={tab} index={0}>
          <Section title="Primary">
            <SwatchRow
              colors={['main', 'light', 'dark', 'contrastText'].map((s) => ({
                label: `primary.${s}`,
                value: p.primary[s as keyof typeof p.primary] as string,
              }))}
            />
          </Section>

          <Section title="Secondary">
            <SwatchRow
              colors={['main', 'light', 'dark', 'contrastText'].map((s) => ({
                label: `secondary.${s}`,
                value: p.secondary[s as keyof typeof p.secondary] as string,
              }))}
            />
          </Section>

          <Section title="Feedback">
            {(['error', 'warning', 'info', 'success'] as const).map((color) => (
              <SwatchRow
                key={color}
                colors={['main', 'light', 'dark', 'contrastText'].map((s) => ({
                  label: `${color}.${s}`,
                  value: p[color][s as keyof typeof p.error] as string,
                }))}
              />
            ))}
          </Section>

          <Section title="Background">
            <SwatchRow
              colors={[
                { label: 'background.default', value: p.background.default },
                { label: 'background.paper', value: p.background.paper },
              ]}
            />
          </Section>

          <Section title="Common">
            <SwatchRow
              colors={[
                { label: 'common.black', value: p.common.black },
                { label: 'common.white', value: p.common.white },
              ]}
            />
          </Section>

          <Section title="Grey">
            <SwatchRow
              colors={Object.entries(p.grey).map(([key, value]) => ({
                label: `grey.${key}`,
                value,
              }))}
            />
          </Section>

          <Section title="Text">
            <SwatchRow
              colors={[
                { label: 'text.primary', value: p.text.primary },
                { label: 'text.secondary', value: p.text.secondary },
                { label: 'text.disabled', value: p.text.disabled },
                {
                  label: 'text.icon',
                  value:
                    (p.text as { icon?: string }).icon ??
                    'rgba(255,255,255,0.5)',
                },
              ]}
            />
          </Section>

          <Section title="Divider">
            <SwatchRow colors={[{ label: 'divider', value: p.divider }]} />
          </Section>

          <Section title="Action — Colors">
            <SwatchRow
              colors={[
                { label: 'action.active', value: p.action.active },
                { label: 'action.hover', value: p.action.hover },
                { label: 'action.selected', value: p.action.selected },
                { label: 'action.disabled', value: p.action.disabled },
                {
                  label: 'action.disabledBackground',
                  value: p.action.disabledBackground,
                },
                { label: 'action.focus', value: p.action.focus },
              ]}
            />
          </Section>

          <Section title="Action — Opacities">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {(
                [
                  'hoverOpacity',
                  'selectedOpacity',
                  'disabledOpacity',
                  'focusOpacity',
                  'activatedOpacity',
                ] as const
              ).map((key) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'monospace', fontWeight: 500 }}
                  >
                    action.{key}
                  </Typography>
                  <Chip
                    label={p.action[key]}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontFamily: 'monospace',
                      '& .MuiChip-label': { opacity: 0.95 },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Section>
        </TabPanel>

        {/* ── Typography ─────────────────────────────────────── */}
        <TabPanel value={tab} index={1}>
          {TYPOGRAPHY_VARIANTS.map(({ variant, label }) => {
            const style =
              theme.typography[variant as keyof typeof theme.typography];
            const fontFamily =
              typeof style === 'object' &&
              style !== null &&
              'fontFamily' in style
                ? String(
                    (style as { fontFamily?: string }).fontFamily ??
                      theme.typography.fontFamily,
                  )
                : theme.typography.fontFamily;
            const fontSize =
              typeof style === 'object' && style !== null && 'fontSize' in style
                ? String((style as { fontSize?: string | number }).fontSize)
                : '';
            const fontWeight =
              typeof style === 'object' &&
              style !== null &&
              'fontWeight' in style
                ? String((style as { fontWeight?: string | number }).fontWeight)
                : '';

            return (
              <Box key={variant} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.75,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    label={variant}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontFamily: 'monospace',
                      '& .MuiChip-label': { opacity: 0.95 },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {fontFamily}
                    {fontSize ? ` · ${fontSize}` : ''}
                    {fontWeight ? ` · weight ${fontWeight}` : ''}
                  </Typography>
                </Box>
                <Typography variant={variant as 'h1'}>{label}</Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          })}
        </TabPanel>

        {/* ── Shadows ─────────────────────────────────────────── */}
        <TabPanel value={tab} index={2}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 4,
            }}
          >
            {theme.shadows.map((shadow, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: '100%',
                    height: 80,
                    boxShadow: shadow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {i}
                  </Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary">
                  elevation {i}
                </Typography>
              </Box>
            ))}
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}
