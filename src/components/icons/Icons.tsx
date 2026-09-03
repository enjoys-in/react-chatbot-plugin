import React from 'react';
import {
  PaperPlaneRight,
  ChatCircleDots,
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

export const SendIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className, weight = 'fill' }) => (
  <PaperPlaneRight size={size} color={color} className={className} weight={weight} />
);

export const ChatBubbleIcon: React.FC<IconProps> = ({ size = 28, color = 'currentColor', className, weight = 'regular' }) => (
  <ChatCircleDots size={size} color={color} className={className} weight={weight} />
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
