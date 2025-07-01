export interface Bet {
  id: number;
  matchId: number;
  betType: string;
  odds: number;
  result: 'pending' | 'won' | 'lost';
  match: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    matchDate: string;
    status: string;
  };
}

export interface BetSlip {
  id: number;
  userId: number;
  totalStake: number;
  totalOdds: number;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost';
  type: 'single' | 'parlay';
  createdAt: string;
  bets: Bet[];
}

export interface CreateBetRequest {
  matchId: number;
  betType: string;
}

export interface CreateBetSlipRequest {
  totalStake: number;
  type: 'single' | 'parlay';
  bets: CreateBetRequest[];
}
