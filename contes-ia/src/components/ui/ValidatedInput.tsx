import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ValidatedInputProps {
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
`;

const Input = styled.input<{ $hasError: boolean }>`
  padding: ${theme.spacing.md};
  border: 2px solid ${props => props.$hasError ? '#e74c3c' : '#E5E5E5'};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: ${props => props.$hasError ? '#e74c3c' : theme.colors.accent.coral};
    outline: none;
  }
  
  &::placeholder {
    color: ${theme.colors.text.light};
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
  onBlur
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
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};
