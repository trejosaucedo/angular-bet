export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    winner: {
      '1': number;
      'X': number;
      '2': number;
    };
    doubleChance: {
      '1X': number;
      '12': number;
      'X2': number;
    };
    totalGoals: {
      over_2_5: number;
      under_2_5: number;
    };
    corners: {
      over_6_5: number;
      under_6_5: number;
    };
  };
  result?: {
    homeScore: number;
    awayScore: number;
    totalCorners: number;
  };
}

export interface CreateMatchRequest {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;
  odds1: number;
  oddsX: number;
  odds2: number;
  odds1X: number;
  odds12: number;
  oddsX2: number;
  oddsOver25: number;
  oddsUnder25: number;
  oddsOver65Corners: number;
  oddsUnder65Corners: number;
}

export interface FinishMatchRequest {
  homeScore: number;
  awayScore: number;
  totalCorners: number;
}
