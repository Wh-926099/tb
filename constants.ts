import { LevelType, SquareType } from "./types";

export const TRACK_LENGTH = 52; 

export const LEVEL_CONFIG = {
  [LevelType.PHYSICAL]: {
    color: 'text-red-400',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/50',
    name: '身体层面',
    description: '接地，行动，现实'
  },
  [LevelType.EMOTIONAL]: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/50',
    name: '情绪层面',
    description: '感受，关系，流动'
  },
  [LevelType.MENTAL]: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-500/50',
    name: '心智层面',
    description: '信念，思维，清晰'
  },
  [LevelType.SPIRITUAL]: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-500/50',
    name: '灵性层面',
    description: '本质，目标，合一'
  }
};

export const SQUARE_NAMES: Record<SquareType, string> = {
  [SquareType.ANGEL]: '天使',
  [SquareType.TEAR]: '眼泪',
  [SquareType.INTUITION]: '觉知闪电',
  [SquareType.SERVICE]: '服务',
  [SquareType.UNIVERSE]: '宇宙回应',
  [SquareType.TRANSFORMATION]: '蜕变',
  [SquareType.MIRACLE]: '奇迹',
  [SquareType.OBSTACLE]: '障碍',
  [SquareType.BLESSING]: '祝福',
  [SquareType.INSPIRATION]: '灵感',
  [SquareType.APPRECIATION]: '感谢',
  [SquareType.EMPTY]: '通道'
};

/**
 * Counts based on user request:
 * Inspiration (Star): 10
 * Obstacle (X): 8
 * Angel (Angel): 8
 * Service (Heart): 6
 * Intuition (Lightning): 5
 * Blessing (Smiley): 4
 * Miracle (Lotus): 4
 * Universe (Exclamation): 3
 * Tear (Drop): 3
 * Transformation (Trumpet): 1
 * Total: 52
 */
export const BOARD_LAYOUT: SquareType[] = [
  SquareType.EMPTY, // Start
  // A mixed layout of 52 items approximately distributed
  SquareType.INSPIRATION, SquareType.ANGEL, SquareType.OBSTACLE, SquareType.SERVICE,
  SquareType.INTUITION, SquareType.INSPIRATION, SquareType.TEAR, SquareType.BLESSING,
  SquareType.OBSTACLE, SquareType.MIRACLE, SquareType.INSPIRATION, SquareType.ANGEL,
  SquareType.SERVICE, SquareType.UNIVERSE, SquareType.OBSTACLE, SquareType.INSPIRATION,
  SquareType.INTUITION, SquareType.ANGEL, SquareType.SERVICE, SquareType.MIRACLE,
  SquareType.INSPIRATION, SquareType.OBSTACLE, SquareType.BLESSING, SquareType.TEAR,
  SquareType.ANGEL, SquareType.INTUITION, SquareType.INSPIRATION, SquareType.SERVICE,
  SquareType.OBSTACLE, SquareType.UNIVERSE, SquareType.MIRACLE, SquareType.ANGEL,
  SquareType.INSPIRATION, SquareType.OBSTACLE, SquareType.INTUITION, SquareType.BLESSING,
  SquareType.SERVICE, SquareType.ANGEL, SquareType.INSPIRATION, SquareType.OBSTACLE,
  SquareType.TEAR, SquareType.MIRACLE, SquareType.INTUITION, SquareType.ANGEL,
  SquareType.INSPIRATION, SquareType.SERVICE, SquareType.OBSTACLE, SquareType.UNIVERSE,
  SquareType.INSPIRATION, SquareType.BLESSING, SquareType.ANGEL, SquareType.TRANSFORMATION
];

export const AWARENESS_TOKENS = {
  [LevelType.PHYSICAL]: [
    "天然", "纪律", "大胆", "时间", "成就", "放心"
  ],
  [LevelType.EMOTIONAL]: [
    "勇敢", "接受", "身心健康", "童真", "即兴", "培育", "验证", "玩乐", "异想天开", "赋权/培力"
  ],
  [LevelType.MENTAL]: [
    "延展", "指导", "组织", "承诺", "照亮/启迪", "肯定", "光", "协助"
  ],
  [LevelType.SPIRITUAL]: [
    "丰富", "流", "神性", "服务", "静心/冥想", "平等", "专注当下", "能力", "壮丽", "觉醒"
  ]
};