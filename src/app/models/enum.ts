export enum BetType {
  WIN_1 = '1',
  DRAW = 'X',
  WIN_2 = '2',
  DOUBLE_CHANCE_1X = '1X',
  DOUBLE_CHANCE_12 = '12',
  DOUBLE_CHANCE_X2 = 'X2',
  OVER_2_5 = 'over_2_5',
  UNDER_2_5 = 'under_2_5',
  OVER_6_5_CORNERS = 'over_6_5',
  UNDER_6_5_CORNERS = 'under_6_5'
}

export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  FINISHED = 'finished'
}

export enum BetSlipStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
