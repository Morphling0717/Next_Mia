/**
 * 星眠Mia 教堂主题 —— 覆盖 @windchime/embed 默认组件样式，
 * 让 Sender / Admin / Blocklist / QR 全部融入"奶油 + 圣金 + 朱砂红"的祈祷室氛围。
 *
 * 调色板对应 globals.css 里的：
 *   --mia-cream / --mia-cream-soft / --mia-ink / --mia-gold / --mia-gold-deep
 *   --mia-blush / --mia-rose / --mia-warm-grey
 */

export const mailSenderTheme = {
  root: "w-full",
  panel:
    "relative overflow-hidden rounded-2xl border border-(--mia-gold)/40 bg-(--mia-cream-soft)/95 p-6 text-(--mia-ink) shadow-[0_18px_60px_-30px_rgba(196,169,110,0.45)] backdrop-blur-xl sm:p-8 before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top_right,rgba(196,169,110,0.22),transparent_60%)]",
  header: "mb-6 flex items-start justify-between gap-4",
  title:
    "font-display text-2xl font-bold tracking-[0.12em] text-(--mia-ink)",
  statusOpen:
    "rounded-full border border-(--mia-gold)/55 bg-(--mia-gold)/12 px-3 py-1 font-display text-[10px] tracking-wider text-(--mia-gold-deep)",
  statusPaused:
    "rounded-full border border-(--mia-rose)/55 bg-(--mia-rose)/10 px-3 py-1 font-display text-[10px] tracking-wider text-(--mia-rose)",
  tagline: "mb-5 text-sm text-(--mia-gold-deep)/80 font-serif-cn",
  textarea:
    "w-full min-h-[160px] resize-y rounded-lg border border-(--mia-warm-grey) bg-white/70 p-4 font-serif-cn text-[15px] leading-relaxed text-(--mia-ink) outline-none transition placeholder:text-(--mia-warm-grey-deep)/70 focus:border-(--mia-gold) focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,169,110,0.18)]",
  secondaryInput:
    "w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-4 py-3 font-display text-sm text-(--mia-ink) outline-none transition placeholder:text-(--mia-warm-grey-deep)/70 focus:border-(--mia-gold) focus:shadow-[0_0_0_3px_rgba(196,169,110,0.18)]",
  counter: "text-right font-display text-xs text-(--mia-gold-deep)/70",
  primaryButton:
    "relative mt-4 w-full overflow-hidden rounded-lg border border-(--mia-gold-deep) bg-(--mia-gold) px-6 py-3.5 font-display text-sm font-bold tracking-[0.2em] text-(--mia-cream) shadow-[0_8px_24px_-12px_rgba(138,111,58,0.55)] transition-all hover:bg-(--mia-gold-deep) hover:shadow-[0_10px_28px_-10px_rgba(138,111,58,0.65)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  primaryButtonDisabled:
    "pointer-events-none border-(--mia-warm-grey) bg-(--mia-warm-grey) text-(--mia-warm-grey-deep) shadow-none",
  secondaryButton:
    "rounded-lg border border-(--mia-gold)/45 bg-transparent px-4 py-2 font-display text-xs text-(--mia-gold-deep) transition hover:border-(--mia-gold) hover:bg-(--mia-gold)/10",
  successBanner:
    "rounded-lg border border-(--mia-gold)/55 bg-(--mia-gold)/12 p-4 text-center text-sm text-(--mia-gold-deep) font-serif-cn",
  errorBanner:
    "mb-4 rounded-lg border border-(--mia-rose)/55 bg-(--mia-rose)/10 p-3 text-sm text-(--mia-rose) font-serif-cn",
  turnstileWrap: "flex justify-center",
};

export const mailAdminTheme = {
  root: "w-full text-(--mia-ink)",
  panel: "flex flex-col gap-4",
  header: "flex flex-wrap items-center justify-between gap-3",
  title:
    "font-display text-xl font-bold tracking-[0.12em] text-(--mia-ink)",
  meta: "font-display text-xs text-(--mia-gold-deep)/70",
  toolbar:
    "flex flex-wrap items-center gap-2 rounded-xl border border-(--mia-gold)/25 bg-(--mia-cream-soft)/70 p-3 backdrop-blur-md",
  tabActive:
    "rounded-md border border-(--mia-gold-deep) bg-(--mia-gold) px-3 py-1.5 font-display text-xs font-bold text-(--mia-cream) shadow-[0_4px_18px_-10px_rgba(138,111,58,0.55)]",
  tabInactive:
    "rounded-md border border-(--mia-warm-grey) bg-white/60 px-3 py-1.5 font-display text-xs text-(--mia-gold-deep)/75 hover:bg-(--mia-gold)/12 hover:text-(--mia-ink)",
  button:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-(--mia-gold)/45 bg-white/70 px-3 py-1.5 font-display text-xs text-(--mia-gold-deep) transition hover:border-(--mia-gold) hover:bg-(--mia-gold)/12",
  primaryButton:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-(--mia-gold-deep) bg-(--mia-gold) px-3 py-1.5 font-display text-xs font-bold text-(--mia-cream) shadow-[0_4px_18px_-10px_rgba(138,111,58,0.55)] transition hover:bg-(--mia-gold-deep)",
  dangerButton:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-(--mia-rose)/55 bg-(--mia-rose)/10 px-3 py-1.5 font-display text-xs text-(--mia-rose) transition hover:bg-(--mia-rose) hover:text-(--mia-cream)",
  tableWrap:
    "overflow-hidden rounded-xl border border-(--mia-gold)/25 bg-(--mia-cream-soft)/70 backdrop-blur-md",
  table: "w-full text-left text-sm text-(--mia-ink)",
  th: "border-b border-(--mia-gold)/25 bg-(--mia-gold)/8 px-4 py-3 font-display text-[11px] uppercase tracking-wider text-(--mia-gold-deep)",
  td: "border-b border-(--mia-warm-grey)/45 px-4 py-3",
  rowSelected: "bg-(--mia-gold)/12",
  checkbox:
    "h-4 w-4 rounded border-(--mia-gold) bg-white text-(--mia-gold-deep) focus:ring-(--mia-gold) focus:ring-offset-0",
  favoriteActive: "text-(--mia-gold-deep)",
  link: "text-(--mia-gold-deep) hover:text-(--mia-ink) hover:underline",
  muted: "text-(--mia-warm-grey-deep)/70",
  cardGrid: "flex w-full flex-col gap-4",
  card: "group relative flex flex-col overflow-hidden rounded-xl border border-(--mia-gold)/25 bg-(--mia-cream-soft)/80 backdrop-blur-md transition-all duration-300 hover:border-(--mia-gold)/60 hover:shadow-[0_12px_32px_-18px_rgba(196,169,110,0.45)]",
  cardUnread:
    "border-(--mia-gold)/60 shadow-[0_10px_24px_-14px_rgba(196,169,110,0.45)]",
  cardFavorited:
    "border-(--mia-gold-deep)/70 shadow-[0_12px_30px_-16px_rgba(138,111,58,0.5)]",
  badge:
    "inline-flex items-center rounded-full border border-(--mia-gold)/45 bg-(--mia-gold)/10 px-2 py-0.5 font-display text-[10px] text-(--mia-gold-deep)",
};

export const mailBlocklistTheme = {
  root: "w-full text-(--mia-ink)",
  panel:
    "rounded-xl border border-(--mia-rose)/35 bg-(--mia-cream-soft)/75 p-4 backdrop-blur-md",
  header: "mb-4 flex items-center justify-between gap-3",
  title:
    "font-display text-lg font-bold tracking-[0.12em] text-(--mia-rose)",
  button:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-(--mia-rose)/45 bg-white/60 px-3 py-1.5 font-display text-xs text-(--mia-rose) transition hover:border-(--mia-rose) hover:bg-(--mia-rose)/10",
  tableWrap:
    "overflow-hidden rounded-lg border border-(--mia-warm-grey)/55 bg-white/55",
  table: "w-full text-left text-sm text-(--mia-ink)",
  th: "border-b border-(--mia-warm-grey) bg-(--mia-cream)/70 px-4 py-3 font-display text-[11px] uppercase tracking-wider text-(--mia-rose)",
  td: "border-b border-(--mia-warm-grey)/45 px-4 py-3",
  muted: "text-(--mia-warm-grey-deep)/70",
  badge:
    "inline-flex items-center rounded-full border border-(--mia-rose)/45 bg-(--mia-rose)/10 px-2 py-0.5 font-display text-[10px] text-(--mia-rose)",
};

export const mailQrTheme = {
  root: "w-full",
  panel:
    "relative overflow-hidden rounded-2xl border border-(--mia-gold)/40 bg-(--mia-cream-soft)/90 p-6 shadow-[0_18px_50px_-26px_rgba(196,169,110,0.45)] backdrop-blur-xl sm:p-8",
  title:
    "mb-1 text-center font-display text-lg font-bold tracking-[0.15em] text-(--mia-ink)",
  subtitle: "mb-6 text-center font-display text-xs text-(--mia-gold-deep)/75",
  canvasWrap:
    "relative mx-auto w-fit overflow-hidden rounded-xl border border-(--mia-gold)/55 bg-white p-3 shadow-[0_8px_24px_-14px_rgba(196,169,110,0.4)]",
  toolbar: "mt-5 flex flex-wrap items-center justify-center gap-3",
  button:
    "rounded-md border border-(--mia-gold)/45 bg-white/70 px-4 py-2 font-display text-xs text-(--mia-gold-deep) transition hover:border-(--mia-gold) hover:bg-(--mia-gold)/12",
};

export const mailPosterEditorTheme = {
  panel:
    "rounded-2xl border border-(--mia-gold)/35 bg-(--mia-cream-soft)/80 p-5 shadow-[0_14px_40px_-22px_rgba(196,169,110,0.35)] backdrop-blur-xl sm:p-6",
  title:
    "mb-3 font-display text-sm font-bold tracking-[0.15em] text-(--mia-gold-deep)",
  fieldList: "grid grid-cols-1 gap-3",
  label: "flex flex-col gap-1 font-display text-[11px] uppercase tracking-wider text-(--mia-gold-deep)/75",
  input:
    "rounded-md border border-(--mia-warm-grey) bg-white/70 px-3 py-2 text-sm text-(--mia-ink) outline-none transition focus:border-(--mia-gold) focus:ring-2 focus:ring-(--mia-gold)/20",
  textarea:
    "min-h-[60px] resize-y rounded-md border border-(--mia-warm-grey) bg-white/70 px-3 py-2 text-sm leading-relaxed text-(--mia-ink) outline-none transition focus:border-(--mia-gold) focus:ring-2 focus:ring-(--mia-gold)/20",
  avatarPreview:
    "flex items-center gap-3 rounded-md border border-(--mia-gold)/25 bg-white/55 p-2",
  avatarImg:
    "h-12 w-12 rounded-full border-2 border-(--mia-gold)/55 object-cover shadow-[0_4px_12px_-6px_rgba(196,169,110,0.4)]",
  avatarCaption: "truncate font-display text-[11px] text-(--mia-warm-grey-deep)/75",
};
