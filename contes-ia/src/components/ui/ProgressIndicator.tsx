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
  margin-bottom: ${theme.spacing['2xl']};
  position: sticky;
  top: 72px;
  z-index: 50;
  background: rgba(254, 252, 248, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: ${theme.spacing.lg} 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  @media (max-width: ${theme.breakpoints.md}) {
    top: 64px;
    padding: ${theme.spacing.md} 0;
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ProgressBarContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const ProgressBar = styled.div`
  position: relative;
  height: 6px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.md};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: ${theme.borderRadius.full};
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${theme.shadows.glow};
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const StepItem = styled.div<{ $isCompleted: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: ${theme.fontSizes.sm};
  color: ${props =>
    props.$isCompleted ? theme.colors.accent.coral :
    props.$isActive ? theme.colors.text.primary :
    theme.colors.text.light
  };
  font-weight: ${props => props.$isActive || props.$isCompleted ? 600 : 400};
  transition: all ${theme.transitions.smooth};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};

    span {
      display: none;
    }
  }
`;

const StepDot = styled.div<{ $isCompleted: boolean; $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${theme.borderRadius.full};
  background: ${props =>
    props.$isCompleted ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})` :
    props.$isActive ? theme.colors.accent.lightCoral :
    theme.colors.background.secondary
  };
  color: ${props =>
    props.$isCompleted || props.$isActive ? theme.colors.text.white :
    theme.colors.text.light
  };
  font-size: 11px;
  font-weight: 700;
  transition: all ${theme.transitions.smooth};
  flex-shrink: 0;
  box-shadow: ${props => props.$isCompleted ? theme.shadows.glow : 'none'};

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
`;

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  const completedSteps = steps.filter(s => s.isCompleted).length;
  const activeIndex = steps.findIndex(s => s.isActive);
  const totalSteps = steps.length;
  const progress = activeIndex >= 0
    ? ((completedSteps + 0.5) / totalSteps) * 100
    : (completedSteps / totalSteps) * 100;

  return (
    <Container>
      <ProgressBarContainer>
        <ProgressBar>
          <ProgressFill $progress={Math.min(progress, 100)} />
        </ProgressBar>
        <StepsContainer>
          {steps.map((step, index) => (
            <StepItem
              key={step.id}
              $isCompleted={step.isCompleted}
              $isActive={step.isActive}
            >
              <StepDot
                $isCompleted={step.isCompleted}
                $isActive={step.isActive}
              >
                {step.isCompleted ? '✓' : index + 1}
              </StepDot>
              <span>{step.title}</span>
            </StepItem>
          ))}
        </StepsContainer>
      </ProgressBarContainer>
    </Container>
  );
};
