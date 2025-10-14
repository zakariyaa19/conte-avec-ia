import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { FormStep } from '../../types/FormTypes';

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
}

const StepContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.spacing['2xl']};
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const StepItem = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 200px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    max-width: none;
    width: 100%;
    justify-content: flex-start;
    gap: ${theme.spacing.md};
  }
`;

const StepCircle = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.spacing.sm};
  transition: all 0.2s ease;
  
  ${props => {
    if (props.$isCompleted) {
      return `
        background-color: ${theme.colors.accent.coral};
        color: ${theme.colors.text.white};
        border: 2px solid ${theme.colors.accent.coral};
      `;
    } else if (props.$isActive) {
      return `
        background-color: ${theme.colors.accent.creamyYellow};
        color: ${theme.colors.text.primary};
        border: 2px solid ${theme.colors.accent.coral};
      `;
    } else {
      return `
        background-color: ${theme.colors.background.secondary};
        color: ${theme.colors.text.light};
        border: 2px solid #E5E5E5;
      `;
    }
  }}
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin-bottom: 0;
    width: 40px;
    height: 40px;
    font-size: ${theme.fontSizes.base};
  }
`;

const StepContent = styled.div`
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    text-align: left;
    flex: 1;
  }
`;

const StepTitle = styled.div<{ $isActive: boolean }>`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.$isActive ? theme.colors.text.primary : theme.colors.text.light};
  margin-bottom: 4px;
`;

const StepDescription = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  line-height: 1.3;
`;

const StepConnector = styled.div<{ $isCompleted: boolean }>`
  height: 2px;
  flex: 1;
  margin: 0 ${theme.spacing.md};
  margin-top: 25px;
  background-color: ${props => props.$isCompleted ? theme.colors.accent.coral : '#E5E5E5'};
  transition: background-color 0.2s ease;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <StepContainer>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepItem
            $isActive={step.isActive}
            $isCompleted={step.isCompleted}
          >
            <StepCircle
              $isActive={step.isActive}
              $isCompleted={step.isCompleted}
            >
              {step.isCompleted ? '✓' : step.id}
            </StepCircle>
            <StepContent>
              <StepTitle $isActive={step.isActive}>
                {step.title}
              </StepTitle>
              <StepDescription>
                {step.description}
              </StepDescription>
            </StepContent>
          </StepItem>
          {index < steps.length - 1 && (
            <StepConnector $isCompleted={step.isCompleted} />
          )}
        </React.Fragment>
      ))}
    </StepContainer>
  );
};
