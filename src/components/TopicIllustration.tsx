import type { QuizQuestion } from '../types/game';

interface TopicIllustrationProps {
  diagram: NonNullable<QuizQuestion['diagram']>;
}

export function TopicIllustration({ diagram }: TopicIllustrationProps) {
  return (
    <div className="my-4 rounded-xl border border-slate-700/70 bg-slate-900/70 p-3.5 flex items-center justify-center">
      {diagram === 'distance-displacement' && (
        <svg viewBox="0 0 360 92" className="w-full max-w-[340px] h-auto" aria-label="Ilustrasi lintasan gerak timur dan barat">
          <line x1="24" y1="68" x2="336" y2="68" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="48" cy="68" r="4" fill="#10B981" />
          <text x="48" y="84" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">Start</text>
          <path d="M52 44 H304" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
          <polygon points="304,40 314,44 304,48" fill="#38BDF8" />
          <text x="180" y="36" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontFamily="JetBrains Mono, monospace">40 m ke Timur →</text>
          <path d="M308 56 H120" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
          <polygon points="120,52 110,56 120,60" fill="#F59E0B" />
          <text x="215" y="82" textAnchor="middle" fill="#FCD34D" fontSize="11" fontFamily="JetBrains Mono, monospace">← 30 m ke Barat</text>
        </svg>
      )}

      {diagram === 'resultant-force' && (
        <svg viewBox="0 0 360 88" className="w-full max-w-[340px] h-auto" aria-label="Ilustrasi dua gaya berlawanan arah">
          <line x1="36" y1="48" x2="124" y2="48" stroke="#F43F5E" strokeWidth="3" />
          <polygon points="36,42 22,48 36,54" fill="#F43F5E" />
          <text x="76" y="34" textAnchor="middle" fill="#FDA4AF" fontSize="11" fontFamily="JetBrains Mono, monospace">F₂ = 20 N</text>

          <rect x="132" y="26" width="84" height="44" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <text x="174" y="52" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="600">Benda</text>

          <line x1="224" y1="48" x2="328" y2="48" stroke="#10B981" strokeWidth="3" />
          <polygon points="328,42 342,48 328,54" fill="#10B981" />
          <text x="278" y="34" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="JetBrains Mono, monospace">F₁ = 30 N</text>
        </svg>
      )}

      {diagram === 'lever' && (
        <svg viewBox="0 0 360 96" className="w-full max-w-[340px] h-auto" aria-label="Diagram prinsip tuas atau pengungkit">
          <line x1="38" y1="54" x2="322" y2="54" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
          <polygon points="150,56 136,80 164,80" fill="#F59E0B" />
          <text x="150" y="92" textAnchor="middle" fill="#FCD34D" fontSize="10">Titik Tumpu</text>

          <rect x="48" y="30" width="32" height="22" rx="3" fill="#0F766E" stroke="#34D399" strokeWidth="1.5" />
          <text x="64" y="45" textAnchor="middle" fill="#ECFDF5" fontSize="10" fontFamily="JetBrains Mono, monospace">w</text>
          <text x="102" y="46" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">Lb</text>

          <line x1="306" y1="22" x2="306" y2="46" stroke="#38BDF8" strokeWidth="2.5" />
          <polygon points="301,44 306,52 311,44" fill="#38BDF8" />
          <text x="306" y="16" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="JetBrains Mono, monospace">Kuasa (F)</text>
          <text x="228" y="46" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">Lk</text>
        </svg>
      )}

      {diagram === 'pulley' && (
        <svg viewBox="0 0 360 96" className="w-full max-w-[340px] h-auto" aria-label="Ilustrasi sistem katrol">
          <line x1="120" y1="12" x2="240" y2="12" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <line x1="180" y1="12" x2="180" y2="38" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="180" cy="40" r="16" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="180" cy="40" r="3" fill="#F59E0B" />
          <line x1="164" y1="40" x2="164" y2="72" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="150" y="72" width="28" height="18" rx="3" fill="#0F766E" stroke="#34D399" strokeWidth="1.5" />
          <text x="164" y="84" textAnchor="middle" fill="#ECFDF5" fontSize="9" fontFamily="JetBrains Mono, monospace">w</text>
          <line x1="196" y1="40" x2="196" y2="82" stroke="#38BDF8" strokeWidth="2" />
          <polygon points="192,80 196,88 200,80" fill="#38BDF8" />
          <text x="214" y="78" fill="#7DD3FC" fontSize="10" fontFamily="JetBrains Mono, monospace">F</text>
        </svg>
      )}

      {diagram === 'inclined-plane' && (
        <svg viewBox="0 0 360 98" className="w-full max-w-[340px] h-auto" aria-label="Ilustrasi bidang miring">
          <polygon points="56,80 286,80 286,26" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <text x="160" y="45" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontFamily="JetBrains Mono, monospace" transform="rotate(-13 160 45)">s (panjang)</text>
          <text x="308" y="58" textAnchor="middle" fill="#FCD34D" fontSize="11" fontFamily="JetBrains Mono, monospace">h</text>
          <rect x="122" y="45" width="28" height="20" rx="3" fill="#0F766E" stroke="#34D399" strokeWidth="1.5" transform="rotate(-13 136 55)" />
        </svg>
      )}

      {diagram === 'plant-tissue' && (
        <svg viewBox="0 0 360 94" className="w-full max-w-[340px] h-auto" aria-label="Ilustrasi berkas pengangkut tumbuhan">
          <rect x="34" y="16" width="292" height="14" rx="4" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
          <text x="180" y="26" textAnchor="middle" fill="#D1FAE5" fontSize="9">Epidermis Atas + Kutikula</text>
          <circle cx="145" cy="52" r="14" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.5" />
          <text x="145" y="55" textAnchor="middle" fill="#DBEAFE" fontSize="9">Xilem</text>
          <circle cx="215" cy="52" r="14" fill="#78350F" stroke="#FBBF24" strokeWidth="1.5" />
          <text x="215" y="55" textAnchor="middle" fill="#FEF3C7" fontSize="9">Floem</text>
          <rect x="34" y="72" width="124" height="12" rx="3" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
          <rect x="202" y="72" width="124" height="12" rx="3" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
          <text x="180" y="81" textAnchor="middle" fill="#6EE7B7" fontSize="9">Stomata</text>
        </svg>
      )}

      {diagram === 'skull-joint' && (
        <svg viewBox="0 0 360 92" className="w-full max-w-[340px] h-auto" aria-label="Ilustrasi sutura pada tulang tengkorak">
          <path d="M128 72 C128 30, 152 16, 180 16 C208 16, 232 30, 232 72 Z" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
          <path d="M180 16 L176 26 L184 34 L175 43 L183 52 L177 62 L180 72" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <text x="275" y="42" textAnchor="middle" fill="#FCD34D" fontSize="10">Garis Sutura</text>
          <text x="275" y="56" textAnchor="middle" fill="#94A3B8" fontSize="9">(Sendi Mati)</text>
        </svg>
      )}
    </div>
  );
}
