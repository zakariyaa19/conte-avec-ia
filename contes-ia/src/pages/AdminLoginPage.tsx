import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.accent.coral} 0%, ${theme.colors.accent.coral} 100%);
  padding: ${theme.spacing.md};
`;

const LoginCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.lg};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  font-size: 2rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 2px solid ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.button.primary};
  }

  &:invalid {
    border-color: ${theme.colors.status.error};
  }
`;

const Button = styled.button`
  background: ${theme.colors.button.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: ${theme.spacing.md};

  &:hover:not(:disabled) {
    background: ${theme.colors.button.primaryHover};
  }

  &:disabled {
    background: ${theme.colors.text.light};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.status.error}20;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.status.error};
  margin-top: ${theme.spacing.sm};
`;

const SuccessMessage = styled.div`
  background: ${theme.colors.status.success}20;
  color: ${theme.colors.status.success};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.status.success};
  margin-top: ${theme.spacing.sm};
`;

interface AdminLoginPageProps {
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await ApiService.adminLogin(formData.email, formData.password);
      
      if (response.success) {
        setSuccess('Connexion réussie ! Redirection...');
        console.log('🔐 Token sauvegardé:', response.data.token.substring(0, 20) + '...');
        localStorage.setItem('adminToken', response.data.token);
        setTimeout(() => {
          onLoginSuccess(response.data.token);
        }, 1000);
      } else {
        setError(response.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Administration</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@contedia.fr"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLoginPage;
