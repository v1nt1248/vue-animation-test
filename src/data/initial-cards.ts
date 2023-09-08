import type { CardSuit, CardMode } from '@/components/Card.vue'

export interface CardListItem {
  id: string;
  ref?: HTMLDivElement;
  suit: CardSuit;
  value: string;
  mode: CardMode;
  isAvailable: boolean;
  isMoved: boolean;
}

export function initialCards(): Record<string, CardListItem> {
  return {
    'A-clubs': {
      id: 'A-clubs',
      suit: "clubs",
      value: 'A',
      mode: 'shirt',
      isAvailable: true,
      isMoved: false,
    },
    '10-hearts': {
      id: '10-hearts',
      suit: 'hearts',
      value: '10',
      mode: 'shirt',
      isAvailable: true,
      isMoved: false,
    },
    'D-spades': {
      id: 'D-spades',
      suit: 'spades',
      value: 'D',
      mode: 'shirt',
      isAvailable: true,
      isMoved: false,
    },
  }
}
