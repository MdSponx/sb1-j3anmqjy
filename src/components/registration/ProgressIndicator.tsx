import React from 'react';
import { Progress } from '../ui/progress';

interface Step {
  label: string;
  completed: boolean;
  current: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <Progress value={progress} className="mb-4" />
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              step.current
                ? 'text-red-500'
                : step.completed
                ? 'text-white'
                : 'text-gray-500'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step.current
                  ? 'bg-red-500 text-white'
                  : step.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm text-center">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}