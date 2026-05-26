import { useTranslation } from 'react-i18next'

const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--rock)',
    padding: 'var(--page-padding)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  noise: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '128px',
    pointerEvents: 'none',
    opacity: 0.5,
    zIndex: 0,
  },

  container: {
    width: '100%',
    maxWidth: '640px',
    position: 'relative',
    zIndex: 1,
  },

  header: {
    marginBottom: '2.5rem',
  },

  eyebrow: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'var(--hold)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.4rem',
  },

  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 'var(--title-3xl)',
    fontWeight: 800,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    margin: '0 0 1rem 0',
    lineHeight: 0.95,
  },

  titleUnderline: {
    width: '2.5rem',
    height: '3px',
    background: 'var(--hold)',
  },

  section: {
    borderLeft: '2px solid var(--line)',
    padding: '1.5rem 1.75rem',
    marginBottom: '1.5rem',
    background: 'var(--granite)',
  },

  sectionAccent: {
    borderLeft: '2px solid var(--hold)',
    padding: '1.5rem 1.75rem',
    marginBottom: '1.5rem',
    background: 'var(--granite)',
  },

  bodyText: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 300,
    color: 'var(--chalk)',
    lineHeight: 1.65,
    margin: 0,
  },

  bodyMuted: {
    fontFamily: 'Barlow, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'var(--muted)',
    lineHeight: 1.6,
    margin: 0,
  },

  list: {
    listStyle: 'none',
    padding: 0,
    margin: '1rem 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  listItem: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: 'var(--chalk)',
    paddingLeft: '1rem',
    borderLeft: '2px solid var(--hold)',
  },

  divider: {
    height: '1px',
    background: 'var(--line)',
    margin: '1.25rem 0',
  },

  sectionTitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--chalk)',
    marginBottom: '0.6rem',
  },
}

export default function About() {
  const { t } = useTranslation()

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>
        <div style={S.header}>
          <span style={S.eyebrow}>{t('about.eyebrow')}</span>
          <h1 style={S.title}>{t('about.title')}</h1>
          <div style={S.titleUnderline} />
        </div>

        <div style={S.section}>
          <p style={S.bodyText}>{t('about.community')}</p>
        </div>

        <div style={S.sectionAccent}>
          <p style={S.bodyText}>{t('about.pitch')}</p>
          <ul style={S.list}>
            <li style={S.listItem}>{t('about.items')}</li>
          </ul>
        </div>

        <div style={S.section}>
          <div style={S.sectionTitle}>{t('about.recTitle')}</div>
          <p style={S.bodyText}>{t('about.recDesc')}</p>
        </div>

        <div style={S.section}>
          <div style={S.sectionTitle}>{t('about.notTitle')}</div>
          <p style={S.bodyText}>{t('about.notDesc')}</p>
        </div>

        <div style={S.section}>
          <p style={S.bodyMuted}>{t('about.commentModeration')}</p>
        </div>

      </div>
    </div>
  )
}
