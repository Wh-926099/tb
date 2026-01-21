import React from 'react';

interface IconProps {
  className?: string;
}

export const AngelIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C13.66 2 15 3.34 15 5C15 6.66 13.66 8 12 8C10.34 8 9 6.66 9 5C9 3.34 10.34 2 12 2M18.5 9C19.88 9 21 10.12 21 11.5C21 12.88 19.88 14 18.5 14C17.12 14 16 12.88 16 11.5V10H14.5L12 18L9.5 10H8V11.5C8 12.88 6.88 14 5.5 14C4.12 14 3 12.88 3 11.5C3 10.12 4.12 9 5.5 9H7L12 22L17 9H18.5Z" />
  </svg>
);

export const LotusIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2C12,2 16,6 16,10C16,14 12,20 12,20C12,20 8,14 8,10C8,6 12,2 12,2M12,22C12,22 17,18 19,14C21,10 19,6 19,6C19,6 17,9 17,11C17,13.5 15,16.5 12,22M12,22C12,22 7,18 5,14C3,10 5,6 5,6C5,6 7,9 7,11C7,13.5 9,16.5 12,22Z" />
  </svg>
);

// Heart Icon (Service)
export const HeartIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const DropIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12 2 6 8.5 6 13.5C6 16.8 8.7 19.5 12 19.5C15.3 19.5 18 16.8 18 13.5C18 8.5 12 2 12 2Z" />
  </svg>
);

export const LightningIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
);

// Trumpet Icon (Transformation)
export const TrumpetIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2,10V14H6L11,18V6L6,10H2M19,12C19,10 18,8.33 16.5,7.42V16.58C18,15.67 19,14 19,12M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23Z" />
  </svg>
);

// X Icon (Obstacle)
export const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
  </svg>
);

// Star Icon (Inspiration)
export const StarIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// Smiley Icon (Blessing)
export const SmileyIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15.5,11C16.33,11 17,10.33 17,9.5C17,8.67 16.33,8 15.5,8C14.67,8 14,8.67 14,9.5C14,10.33 14.67,11 15.5,11M8.5,11C9.33,11 10,10.33 10,9.5C10,8.67 9.33,8 8.5,8C7.67,8 7,8.67 7,9.5C7,10.33 7.67,11 8.5,11M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z" />
  </svg>
);

// Exclamation Icon (Universe Response)
export const ExclamationIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.47 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
  </svg>
);

export const DiceIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="8" cy="8" r="2" fill="var(--bg-color, #1e293b)" />
    <circle cx="16" cy="16" r="2" fill="var(--bg-color, #1e293b)" />
    <circle cx="12" cy="12" r="2" fill="var(--bg-color, #1e293b)" />
  </svg>
);
