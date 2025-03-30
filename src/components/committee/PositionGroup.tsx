import React from 'react';
import { MemberCard } from './MemberCard';
import { CommitteeMember } from '../../types/committee';

interface PositionGroupProps {
  title: string;
  members: CommitteeMember[];
}

export function PositionGroup({ title, members }: PositionGroupProps) {
  if (members.length === 0) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}