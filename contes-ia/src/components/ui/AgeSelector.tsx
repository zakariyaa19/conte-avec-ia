import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface AgeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
`;

const SelectorWrapper = styled.div`
  position: relative;
`;

const Select = styled.select<{ $hasError: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${props => props.$hasError ? '#e74c3c' : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 16px;
  background-color: var(--bg-input);
  transition: border-color 0.2s ease;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;

  &:focus {
    border-color: ${props => props.$hasError ? '#e74c3c' : theme.colors.accent.coral};
    outline: none;
  }

  &:hover {
    border-color: ${props => props.$hasError ? '#e74c3c' : theme.colors.accent.coral};
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  display: block;
`;

const generateAgeOptions = () => {
  const options = [];
  for (let i = 0; i <= 18; i++) {
    options.push({
      value: i.toString(),
      label: i === 0 ? 'Moins d\'1 an' : i === 1 ? '1 an' : `${i} ans`
    });
  }
  return options;
};

export const AgeSelector: React.FC<AgeSelectorProps> = ({ 
  value, 
  onChange, 
  error, 
  label = "Âge",
  required = false 
}) => {
  const ageOptions = generateAgeOptions();

  return (
    <SelectorContainer>
      <Label>
        {label} {required && '*'}
      </Label>
      <SelectorWrapper>
        <Select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          $hasError={!!error}
        >
          <option value="">Sélectionnez un âge</option>
          {ageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </SelectorWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectorContainer>
  );
};
