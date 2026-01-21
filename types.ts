export enum GamePhase {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export enum LevelType {
  PHYSICAL = 'PHYSICAL',
  EMOTIONAL = 'EMOTIONAL',
  MENTAL = 'MENTAL',
  SPIRITUAL = 'SPIRITUAL'
}

export enum SquareType {
  ANGEL = 'ANGEL',           // 天使 (Angel Icon)
  TEAR = 'TEAR',             // 眼泪 (Drop Icon)
  INTUITION = 'INTUITION',   // 觉知闪电 (Lightning Icon)
  SERVICE = 'SERVICE',       // 服务 (Heart Icon)
  UNIVERSE = 'UNIVERSE',     // 宇宙回应 (Exclamation Icon)
  TRANSFORMATION = 'TRANSFORMATION', // 蜕变 (Trumpet Icon)
  MIRACLE = 'MIRACLE',       // 奇迹 (Lotus Icon)
  OBSTACLE = 'OBSTACLE',     // 障碍 (X Icon)
  BLESSING = 'BLESSING',     // 祝福 (Smiley Icon)
  INSPIRATION = 'INSPIRATION', // 灵感 (Star Icon)
  APPRECIATION = 'APPRECIATION', // 感谢
  EMPTY = 'EMPTY'            // 通道
}

export interface PlayerState {
  intention: string;
  currentLevel: LevelType;
  position: number; // 0 to Track Length
  awarenessTokens: number;
  serviceTokens: number;
  painTokens: number;
  angels: string[]; // List of angel qualities collected
}

export interface LogEntry {
  id: string;
  type: 'MOVE' | 'CARD' | 'SYSTEM' | 'ERROR';
  message: string;
  details?: string; // AI generated details
  timestamp: number;
}

export interface CardContent {
  title: string;
  description: string;
  action: string;
  effect: {
    awareness?: number;
    pain?: number;
    service?: number;
  };
}