export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const pageShell = "min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,_#f8fffb_0%,_#f5f7fb_100%)]";
export const contentShell = "rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl";
export const sectionHeader = "border-b border-slate-200/80 pb-4";
export const sectionTitle = "text-2xl font-semibold tracking-tight text-slate-950";
export const sectionSubtitle = "mt-1 text-sm text-slate-600";
export const surfaceCard = "rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)]";
export const surfaceCardMuted = "rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/70 shadow-[0_18px_50px_rgba(16,185,129,0.10)]";
export const asideShell = "h-full w-80 border-l border-white/60 bg-slate-950/95 text-slate-100 shadow-[-24px_0_60px_rgba(15,23,42,0.28)] backdrop-blur-2xl";
export const asideCard = "rounded-2xl border border-white/10 bg-white/6 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.16)]";
export const inputBase = "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400";
export const textareaBase = `${inputBase} min-h-[120px] resize-y`;
export const selectBase = `${inputBase} pr-10`;
export const softBadge = "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700";
export const subtleBadge = "inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600";

export const buttonStyles = {
  primary: "inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none",
  secondary: "inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
  accent: "inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none",
  ghost: "inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-60",
  danger: "inline-flex items-center justify-center rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300",
  tinted: "inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
};
