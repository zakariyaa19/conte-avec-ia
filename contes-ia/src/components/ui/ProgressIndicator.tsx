import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ProgressStep {
  id: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
}

const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${theme.colors.background.white};
  padding: ${theme.spacing.lg} 0;
  margin-bottom: ${theme.spacing.xl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const ProgressBarContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const ProgressBar = styled.div`
  position: relative;
  height: 4px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.lg};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.lightCoral});
  border-radius: ${theme.borderRadius.full};
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const StepItem = styled.div<{ $isCompleted: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${props => 
    props.$isCompleted ? theme.colors.accent.coral : 
    props.$isActive ? theme.colors.text.primary : 
    theme.colors.text.light
  };
  font-weight: ${props => props.$isActive ? 600 : 400};
  transition: all 0.3s ease;
`;

const CheckIcon = styled.span<{ $isCompleted: boolean; $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => 
    props.$isCompleted ? theme.colors.accent.coral : 
    props.$isActive ? theme.colors.accent.lightCoral : 
    theme.colors.background.secondary
  };
  color: ${props => 
    props.$isCompleted || props.$isActive ? theme.colors.background.white : 
    theme.colors.text.light
  };
  font-size: 12px;
  font-weight: 700;
  transition: all 0.3s ease;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 16px;
    height: 16px;
    font-size: 10px;
  }
`;

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  const completedSteps = steps.filter(s => s.isCompleted).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <Container>
      <ProgressBarContainer>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        <StepsContainer>
          {steps.map((step, index) => (
            <StepItem 
              key={step.id} 
              $isCompleted={step.isCompleted}
              $isActive={step.isActive}
            >
              <CheckIcon 
                $isCompleted={step.isCompleted}
                $isActive={step.isActive}
              >
                {step.isCompleted ? '✓' : index + 1}
              </CheckIcon>
              <span>{step.title}</span>
            </StepItem>
          ))}
        </StepsContainer>
      </ProgressBarContainer>
    </Container>
  );
};
