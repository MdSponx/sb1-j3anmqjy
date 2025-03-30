interface TagColor {
  bgColor: string;
  textColor: string;
  hoverBg: string;
}

const TAG_COLORS: Record<string, TagColor> = {
  'Discussion': {
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    hoverBg: 'bg-blue-500/30'
  },
  'Workshop': {
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    hoverBg: 'bg-purple-500/30'
  },
  'Film Screening': {
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    hoverBg: 'bg-red-500/30'
  },
  'Film Premiere': {
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    hoverBg: 'bg-amber-500/30'
  },
  'OFOS': {
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    hoverBg: 'bg-yellow-500/30'
  },
  'Press Conference': {
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    hoverBg: 'bg-green-500/30'
  },
  'Recreation': {
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    hoverBg: 'bg-pink-500/30'
  }
};

export function getTagColor(tag: string): TagColor {
  return TAG_COLORS[tag] || {
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    hoverBg: 'bg-gray-500/30'
  };
}