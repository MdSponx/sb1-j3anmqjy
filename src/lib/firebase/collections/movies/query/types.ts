import { QueryConstraint } from 'firebase/firestore';

export interface QueryBuilder {
  buildConstraints(): QueryConstraint[];
}

export interface QueryOptions {
  searchQuery?: string;
  selectedYear?: string;
}