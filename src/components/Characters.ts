// Recortes ilustrados de los cuatro personajes (SVG inline, estilo papel recortado).
const S = 'stroke="#fffaf0" stroke-width="5" stroke-linejoin="round" paint-order="stroke"';

export interface Character {
  id: string;
  label: string;
  svg: string;
}

export const characters: Character[] = [
  {
    id: 'llama',
    label: 'Llama peruana',
    svg: `<svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" fill="#e8832b" opacity=".22"/>
      <g ${S}>
        <path d="M30 100 L30 70 Q28 52 46 52 L78 52 Q92 52 92 66 L92 100 L82 100 L82 80 L40 80 L40 100Z" fill="#f3e6c9"/>
        <path d="M70 56 L74 22 Q76 12 88 14 L100 20 Q108 24 104 30 L92 30 L86 56Z" fill="#f3e6c9"/>
        <path d="M80 16 L78 4 L86 12Z M92 16 L98 4 L98 17Z" fill="#f3e6c9"/>
      </g>
      <rect x="34" y="58" width="52" height="8" fill="#c23a2b"/><rect x="34" y="66" width="52" height="5" fill="#1f2a52"/><rect x="34" y="71" width="52" height="5" fill="#e8832b"/>
      <circle cx="94" cy="22" r="2.4" fill="#15162b"/><path d="M100 28 L104 28" stroke="#15162b" stroke-width="2"/>
    </svg>`,
  },
  {
    id: 'gallo',
    label: 'Gallo cubano peludo',
    svg: `<svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" fill="#1f2a52" opacity=".16"/>
      <g ${S}>
        <path d="M18 62 Q6 40 24 30 Q18 54 34 56Z" fill="#b9553a"/><path d="M14 74 Q-2 58 12 44 Q10 64 28 66Z" fill="#e8832b"/>
        <path d="M30 80 Q24 66 34 58 Q30 48 42 48 Q40 38 52 42 Q58 30 68 40 Q80 38 80 50 Q92 52 88 64 Q98 72 88 82 Q90 94 76 92 Q70 104 56 98 Q44 106 38 94 Q26 94 30 80Z" fill="#d9a05a"/>
        <circle cx="76" cy="42" r="15" fill="#f3e6c9"/>
        <path d="M70 28 Q72 16 76 24 Q80 12 84 24 Q90 18 86 30Z" fill="#c23a2b"/>
      </g>
      <path d="M88 42 L102 47 L88 52Z" fill="#e8832b" stroke="#15162b" stroke-width="1.5"/>
      <path d="M86 52 Q90 62 84 62 Q82 56 84 52Z" fill="#c23a2b"/>
      <circle cx="80" cy="40" r="2.4" fill="#15162b"/>
      <path d="M52 98 L52 112 M62 98 L62 112 M46 112 L58 112 M58 112 L70 112" stroke="#e8832b" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'pantera',
    label: 'Pantera negra',
    svg: `<svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" fill="#c23a2b" opacity=".18"/>
      <g ${S}>
        <path d="M30 104 Q22 70 40 56 L36 30 L50 40 Q60 36 70 40 L84 30 L80 56 Q98 70 90 104 Q84 112 72 104 L64 82 L56 104 Q40 112 30 104Z" fill="#15162b"/>
        <path d="M90 100 Q116 96 112 70 Q110 60 102 62" fill="none" stroke="#15162b" stroke-width="8" stroke-linecap="round"/>
      </g>
      <ellipse cx="52" cy="54" rx="5" ry="3.5" fill="#d7e24a"/><ellipse cx="70" cy="54" rx="5" ry="3.5" fill="#d7e24a"/>
      <rect x="51" y="51" width="2" height="6" fill="#15162b"/><rect x="69" y="51" width="2" height="6" fill="#15162b"/>
      <path d="M58 62 L64 62 L61 66Z" fill="#b9553a"/>
    </svg>`,
  },
  {
    id: 'larva',
    label: 'Larva con gafas de sol y sombrero',
    svg: `<svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" fill="#f3e6c9" opacity=".6"/>
      <g ${S}>
        <path d="M14 96 Q12 70 36 70 Q50 52 74 58 Q104 62 100 88 Q98 106 70 104 L28 106 Q14 106 14 96Z" fill="#e8832b"/>
      </g>
      <g stroke="#b9553a" stroke-width="3" stroke-linecap="round" fill="none"><path d="M32 76 Q28 90 34 102"/><path d="M48 70 Q44 88 50 104"/><path d="M64 70 Q61 88 66 104"/><path d="M80 74 Q78 90 82 102"/></g>
      <g fill="#15162b"><rect x="70" y="68" width="14" height="10" rx="4"/><rect x="88" y="70" width="12" height="9" rx="4"/><rect x="83" y="71" width="6" height="3"/></g>
      <path d="M74 86 Q84 92 94 86" fill="none" stroke="#15162b" stroke-width="2.5" stroke-linecap="round"/>
      <g ${S}><path d="M52 52 Q58 22 84 24 Q100 30 102 54Z" fill="#e6d1a6"/><path d="M36 56 Q76 44 118 58 Q78 66 36 56Z" fill="#d6bb82"/></g>
      <path d="M58 48 Q78 42 100 48" stroke="#c23a2b" stroke-width="5" fill="none"/>
    </svg>`,
  },
  {
    id: 'pulpo',
    label: 'Pulpo',
    svg: `<svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" fill="#2c3a6e" opacity=".2"/>
      <g ${S}>
        <path d="M22 100 Q10 96 14 84 Q18 76 26 82 Q22 88 30 92Z" fill="#c23a2b"/>
        <path d="M98 100 Q110 96 106 84 Q102 76 94 82 Q98 88 90 92Z" fill="#c23a2b"/>
        <path d="M36 104 Q26 108 28 96 Q30 86 40 90Z M84 104 Q94 108 92 96 Q90 86 80 90Z" fill="#c23a2b"/>
        <path d="M46 106 Q42 114 52 112 Q56 104 56 94Z M74 106 Q78 114 68 112 Q64 104 64 94Z" fill="#c23a2b"/>
        <path d="M24 62 Q24 18 60 18 Q96 18 96 62 Q96 90 84 96 L36 96 Q24 90 24 62Z" fill="#d9503a"/>
      </g>
      <circle cx="46" cy="58" r="11" fill="#fffaf0"/><circle cx="74" cy="58" r="11" fill="#fffaf0"/>
      <circle cx="48" cy="60" r="5" fill="#15162b"/><circle cx="72" cy="60" r="5" fill="#15162b"/>
      <path d="M50 78 Q60 86 70 78" fill="none" stroke="#15162b" stroke-width="3" stroke-linecap="round"/>
      <g fill="#f3e6c9"><circle cx="40" cy="34" r="3"/><circle cx="52" cy="28" r="2.4"/><circle cx="78" cy="32" r="3"/></g>
    </svg>`,
  },
];
