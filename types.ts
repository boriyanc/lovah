export enum AppStage {
  PASSWORD = 'PASSWORD',
  MAIN = 'MAIN',
}

export interface StickerData {
  id: number;
  x: number; // Percent
  y: number; // Percent
  imgUrl: string;
  text: string;
  delay: number;
  duration: number;
  rotation: number;
}

export interface Song {
  url: string;
  title: string;
}