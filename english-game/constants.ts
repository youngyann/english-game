
import { WordItem, Theme } from './types';

export const THEMES: Theme[] = ['Animals', 'Colors', 'Fruits', 'School', 'Actions'];

export const WORD_BANK: Record<Theme, WordItem[]> = {
  Animals: [
    { word: 'Cat', translation: '貓', zhuyin: 'ㄇㄠ', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
    { word: 'Dog', translation: '狗', zhuyin: 'ㄍㄡˇ', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' },
    { word: 'Bird', translation: '鳥', zhuyin: 'ㄋㄧㄠˇ', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86747?auto=format&fit=crop&w=400&q=80' },
    { word: 'Fish', translation: '魚', zhuyin: 'ㄩˊ', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    { word: 'Elephant', translation: '大象', zhuyin: 'ㄉㄚˋ ㄒㄧㄤˋ', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80' },
    { word: 'Lion', translation: '獅子', zhuyin: 'ㄕ ㄗˇ', category: 'Animals', imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80' },
  ],
  Colors: [
    { word: 'Red', translation: '紅色', zhuyin: 'ㄏㄨㄥˊ ㄙㄜˋ', category: 'Colors', imageUrl: 'https://images.unsplash.com/photo-1541345023926-55d6e08bb53d?auto=format&fit=crop&w=400&q=80' },
    { word: 'Blue', translation: '藍色', zhuyin: 'ㄌㄢˊ ㄙㄜˋ', category: 'Colors', imageUrl: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&w=400&q=80' },
    { word: 'Green', translation: '綠色', zhuyin: 'ㄌㄩˋ ㄙㄜˋ', category: 'Colors', imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=400&q=80' },
    { word: 'Yellow', translation: '黃色', zhuyin: 'ㄏㄨㄤˊ ㄙㄜˋ', category: 'Colors', imageUrl: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?auto=format&fit=crop&w=400&q=80' },
    { word: 'Orange', translation: '橘色', zhuyin: 'ㄐㄩˊ ㄙㄜˋ', category: 'Colors', imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=400&q=80' },
    { word: 'Pink', translation: '粉紅色', zhuyin: 'ㄈㄣˇ ㄏㄨㄥˊ ㄙㄜˋ', category: 'Colors', imageUrl: 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&w=400&q=80' },
  ],
  Fruits: [
    { word: 'Apple', translation: '蘋果', zhuyin: 'ㄆㄧㄥˊ ㄍㄨㄛˇ', category: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80' },
    { word: 'Banana', translation: '香蕉', zhuyin: 'ㄒㄧㄤ ㄐㄧㄠ', category: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ad9902ed120c?auto=format&fit=crop&w=400&q=80' },
    { word: 'Orange', translation: '橘子', zhuyin: 'ㄐㄩˊ ㄗ˙', category: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1582281227055-3179a9a31700?auto=format&fit=crop&w=400&q=80' },
    { word: 'Grape', translation: '葡萄', zhuyin: 'ㄆㄨˊ ㄊㄠˊ', category: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369b41f8f?auto=format&fit=crop&w=400&q=80' },
    { word: 'Mango', translation: '芒果', zhuyin: 'ㄇㄤˊ ㄍㄨㄛˇ', category: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1553334828-03d67484b915?auto=format&fit=crop&w=400&q=80' },
  ],
  School: [
    { word: 'Book', translation: '書', zhuyin: 'ㄕㄨ', category: 'School', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80' },
    { word: 'Pen', translation: '筆', zhuyin: 'ㄅㄧˇ', category: 'School', imageUrl: 'https://images.unsplash.com/photo-1585336139118-b31b1e958742?auto=format&fit=crop&w=400&q=80' },
    { word: 'Pencil', translation: '鉛筆', zhuyin: 'ㄑㄧㄢ ㄅㄧˇ', category: 'School', imageUrl: 'https://images.unsplash.com/photo-1512044459824-032943376510?auto=format&fit=crop&w=400&q=80' },
    { word: 'Ruler', translation: '尺', zhuyin: 'ㄔˇ', category: 'School', imageUrl: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&w=400&q=80' },
    { word: 'Bag', translation: '包包', zhuyin: 'ㄅㄠ ㄅㄠ', category: 'School', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' },
  ],
  Actions: [
    { word: 'Run', translation: '跑', zhuyin: 'ㄆㄠˇ', category: 'Actions', imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80' },
    { word: 'Jump', translation: '跳', zhuyin: 'ㄊㄧㄠˋ', category: 'Actions', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80' },
    { word: 'Eat', translation: '吃', zhuyin: 'ㄔ', category: 'Actions', imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=400&q=80' },
    { word: 'Sleep', translation: '睡覺', zhuyin: 'ㄕㄨㄟˋ ㄐㄧㄠˋ', category: 'Actions', imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80' },
    { word: 'Read', translation: '讀書', zhuyin: 'ㄉㄨˊ ㄕㄨ', category: 'Actions', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80' },
  ]
};
