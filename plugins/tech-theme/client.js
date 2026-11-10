/**
 * Tech-theme Client half.
 *
 * Two layers, both owned by this plugin and both removed on dispose:
 *  - a palette layer stacked over the active built-in theme through
 *    `ctx.theme.overrideTokens`, so light/dark/system keeps working;
 *  - one stylesheet adding the ambient deep-space atmosphere (circuit grid and
 *    two soft glows) on the body background stack.
 *
 * Disabling the plugin therefore restores the stock look without a restart.
 */
window.__ModuleLoader__.load({
  id: '@local/tech-theme',
  factory(require) {
    /**
     * Alias-token overrides for the tech palette. Every token carries one value
     * per color scheme: the theme service refuses bare strings because a single
     * value goes illegible when the user switches color scheme.
     */
    const TOKENS = {
      // Surfaces: near-black ink in dark mode, cool paper in light mode.
      '--dsw-alias-bg-base': { light: '#f3f7fc', dark: '#05080e' },
      '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#0a1018' },
      '--dsw-alias-bg-layer-2': { light: '#eaf1f9', dark: '#0e1725' },
      '--dsw-alias-bg-overlay': { light: '#ffffff', dark: '#0b1420' },
      // Hairlines: ice-blue instead of warm grey.
      '--dsw-alias-border-l1': { light: '#d9e4f1', dark: '#16273c' },
      '--dsw-alias-border-l2': { light: '#b8cce4', dark: '#21415f' },
      // Accent: electric azure, close in luminance to the stock brand so primary
      // buttons and links keep their contrast.
      '--dsw-alias-brand-primary': { light: '#0b6ef0', dark: '#3d8bfd' },
      // Text: high-contrast ink with a cool secondary tier.
      '--dsw-alias-label-primary': { light: '#08131f', dark: '#e8f1ff' },
      '--dsw-alias-label-secondary': { light: '#4b617c', dark: '#8ea6c0' },
      // The sidebar column: the darkest, coldest surface on screen.
      '--dsw-specific-sidebar-fill': { light: '#e7eff9', dark: '#070c13' },
      // Atmosphere colors own their token names so the stylesheet below reads
      // one source of truth and the layer stays inspectable as `--tech-theme-*`.
      '--tech-theme-grid-line': {
        light: 'rgba(11, 110, 240, 0.055)',
        dark: 'rgba(56, 189, 248, 0.05)',
      },
      '--tech-theme-glow-primary': {
        light: 'rgba(11, 110, 240, 0.10)',
        dark: 'rgba(61, 139, 253, 0.15)',
      },
      '--tech-theme-glow-cyan': {
        light: 'rgba(34, 211, 238, 0.09)',
        dark: 'rgba(34, 211, 238, 0.11)',
      },
    };

    /**
     * Ambient atmosphere. It rides on the body background stack rather than a
     * pseudo-element overlay, so it can never paint over interface content and
     * needs no z-index or pointer-events handling.
     */
    const ATMOSPHERE_CSS = `
      body {
        --tech-grid-line: var(--tech-theme-grid-line, rgba(11, 110, 240, 0.055));
        --tech-glow-primary: var(--tech-theme-glow-primary, rgba(11, 110, 240, 0.10));
        --tech-glow-cyan: var(--tech-theme-glow-cyan, rgba(34, 211, 238, 0.09));
        background-image:
          linear-gradient(to right, var(--tech-grid-line) 1px, transparent 1px),
          linear-gradient(to bottom, var(--tech-grid-line) 1px, transparent 1px),
          radial-gradient(1200px 640px at 16% -12%, var(--tech-glow-primary), transparent 64%),
          radial-gradient(1000px 560px at 88% 112%, var(--tech-glow-cyan), transparent 62%);
        background-size: 48px 48px, 48px 48px, auto, auto;
        background-position: 0 0, 0 0, 0 0, 0 0;
        background-repeat: repeat, repeat, no-repeat, no-repeat;
        background-attachment: fixed, fixed, fixed, fixed;
      }
      body[data-ds-dark-theme] {
        --tech-grid-line: var(--tech-theme-grid-line, rgba(56, 189, 248, 0.05));
        --tech-glow-primary: var(--tech-theme-glow-primary, rgba(61, 139, 253, 0.15));
        --tech-glow-cyan: var(--tech-theme-glow-cyan, rgba(34, 211, 238, 0.11));
      }
      ::selection {
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 26%, transparent);
      }
    `;

    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens('@local/tech-theme', TOKENS),
          'tech-theme: palette layer',
        );
        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = '@local/tech-theme';
          tag.dataset.pluginCss = '@local/tech-theme/atmosphere.css';
          tag.textContent = ATMOSPHERE_CSS;
          document.head.appendChild(tag);
          return () => tag.remove();
        }, 'tech-theme: atmosphere stylesheet');
      },
    };
  },
});
