import React from 'react';
import {
  X,
  Minus,
  Smiley,
  Paperclip,
  File,
  Image as ImagePh,
  XCircle,
  ArrowClockwise,
  MagnifyingGlass,
  Microphone,
  Star,
  PencilSimple,
  Trash,
  type IconProps as PhosphorIconProps,
} from '@phosphor-icons/react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  weight?: PhosphorIconProps['weight'];
}

/** Upward arrow — reads as "send this up into the thread". */
export const SendIcon: React.FC<IconProps> = ({ size = 17, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 19V5m0 0l-6 6m6-6l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Speech bubble with a smile cut out of it. `bg` paints the smile, so it
 *  should match the surface the icon sits on (the launcher fill). */
export const ChatBubbleIcon: React.FC<IconProps & { bg?: string }> = ({
  size = 22,
  color = 'currentColor',
  className,
  bg = 'var(--cb-primary, #000000)',
}) => (
  <svg
    width={size}
    height={(size * 32) / 28}
    viewBox="0 0 28 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M25.2 0H2.8A2.8 2.8 0 0 0 0 2.8v19.6a2.8 2.8 0 0 0 2.8 2.8h3.5v5.25c0 1.05 1.19 1.65 2.03 1.02l8.36-6.27H25.2a2.8 2.8 0 0 0 2.8-2.8V2.8A2.8 2.8 0 0 0 25.2 0Z"
      fill={color}
    />
    <path
      d="M8.4 14.7c1.4 2.1 3.36 3.15 5.6 3.15s4.2-1.05 5.6-3.15"
      stroke={bg}
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, weight = 'bold' }) => (
  <X size={size} color={color} className={className} weight={weight} />
);

export const MinimizeIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, weight = 'bold' }) => (
  <Minus size={size} color={color} className={className} weight={weight} />
);

export const EmojiIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, weight = 'regular' }) => (
  <Smiley size={size} color={color} className={className} weight={weight} />
);

export const AttachmentIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, weight = 'regular' }) => (
  <Paperclip size={size} color={color} className={className} weight={weight} />
);

export const FileIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, weight = 'regular' }) => (
  <File size={size} color={color} className={className} weight={weight} />
);

export const ImageIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, weight = 'regular' }) => (
  <ImagePh size={size} color={color} className={className} weight={weight} />
);

export const RemoveIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className, weight = 'fill' }) => (
  <XCircle size={size} color={color} className={className} weight={weight} />
);

export const RestartIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, weight = 'bold' }) => (
  <ArrowClockwise size={size} color={color} className={className} weight={weight} />
);

export const SearchIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, weight = 'regular' }) => (
  <MagnifyingGlass size={size} color={color} className={className} weight={weight} />
);

export const MicIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className, weight = 'regular' }) => (
  <Microphone size={size} color={color} className={className} weight={weight} />
);

export const StarIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className, weight = 'regular' }) => (
  <Star size={size} color={color} className={className} weight={weight} />
);

export const EditIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className, weight = 'regular' }) => (
  <PencilSimple size={size} color={color} className={className} weight={weight} />
);

export const TrashIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className, weight = 'regular' }) => (
  <Trash size={size} color={color} className={className} weight={weight} />
);
