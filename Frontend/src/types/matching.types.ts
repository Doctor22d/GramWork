// AI Matching DTOs
export interface MatchingScoreResponse {
  userId: string;
  workerSkills: string;
  totalScore: number;
  distanceScore: number;
  skillScore: number;
  wageScore: number;
  availabilityScore: number;
  ratingScore: number;
  reliabilityScore: number;
}

export interface WorkerProfileForMatching {
  userId: string;
  skill: string;
  dailyWage: number;
  availability: string;
  rating: number;
  reliabilityScore: number;
  location: {
    x: number; // longitude
    y: number; // latitude
  };
}
