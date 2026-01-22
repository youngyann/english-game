
export interface WordItem {
  word: string;
  translation: string;
  zhuyin: string;
  category: string;
  imageUrl?: string;
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT'
}

export interface QuizQuestion {
  correctWord: WordItem;
  options: WordItem[];
}

export interface GameScore {
  correct: number;
  total: number;
  rewardImage?: string;
}

export type Theme = 'Animals' | 'Colors' | 'Fruits' | 'School' | 'Actions';
