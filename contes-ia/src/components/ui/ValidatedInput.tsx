import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ValidatedInputProps {
  type?: 'text' | 'email' | 'tel' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  disabled?: boolean;
}

const InputContainer = styled.div`
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

const Input = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${props => props.$hasError ? '#e74c3c' : '#E5E5E5'};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 16px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
  -webkit-appearance: none;

  &:focus {
    border-color: ${props => props.$hasError ? '#e74c3c' : theme.colors.accent.coral};
    outline: none;
  }

  &::placeholder {
    color: var(--text-light);
  }

  &:disabled {
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  display: block;
`;

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  error,
  onBlur,
  disabled = false
}) => {
  return (
    <InputContainer>
      {label && (
        <Label>
          {label} {required && '*'}
        </Label>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        $hasError={!!error}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};
