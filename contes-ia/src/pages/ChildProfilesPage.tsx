import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ApiService } from '../config/api';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
`;

const ChildCard = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChildInfo = styled.div`
  h3 {
    font-size: ${theme.fontSizes.lg};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing.xs};
  }
  p {
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    margin: 0;
  }
`;

const ChildActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const AddForm = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.card};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: ${theme.spacing.md};
  align-items: end;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  label {
    font-weight: 600;
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.text.primary};
  }

  input {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 2px solid var(--border-input);
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.base};

    &:focus {
      outline: none;
      border-color: ${theme.colors.accent.coral};
    }
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.accent.coral};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  margin-bottom: ${theme.spacing.lg};

  &:hover { text-decoration: underline; }
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  background: ${props => props.$variant === 'danger' ? theme.colors.status.error : theme.colors.accent.coral};
  color: white;
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: opacity ${theme.transitions.fast};

  &:hover { opacity: 0.85; }
`;

export const ChildProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');

  useEffect(() => { loadChildren(); }, []);

  const loadChildren = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await ApiService.getClientChildren(token);
      if (response.success) setChildren(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await ApiService.createChild(token, {
        name: newName.trim(),
        age: newAge ? parseInt(newAge) : undefined
      });
      if (response.success) {
        setChildren(prev => [...prev, response.data]);
        setNewName('');
        setNewAge('');
      }
    } catch (error) {
      console.error('Erreur ajout:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await ApiService.updateChild(token, id, {
        name: editName,
        age: editAge ? parseInt(editAge) : null
      });
      if (response.success) {
        setChildren(prev => prev.map(c => c.id === id ? response.data : c));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Erreur modification:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce profil enfant ?')) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      await ApiService.deleteChild(token, id);
      setChildren(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const startEdit = (child: any) => {
    setEditingId(child.id);
    setEditName(child.name);
    setEditAge(child.age?.toString() || '');
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <BackLink onClick={() => navigate('/dashboard')}>&larr; Retour a ma bibliotheque</BackLink>
        <PageTitle>Profils enfants</PageTitle>

        <AddForm>
          <FormRow>
            <InputField>
              <label>Prenom</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Prenom de l'enfant"
              />
            </InputField>
            <InputField>
              <label>Age</label>
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                placeholder="Age"
                min="0"
                max="18"
              />
            </InputField>
            <Button variant="primary" size="md" onClick={handleAdd}>
              Ajouter
            </Button>
          </FormRow>
        </AddForm>

        {loading ? (
          <p>Chargement...</p>
        ) : children.length === 0 ? (
          <p style={{ textAlign: 'center', color: theme.colors.text.secondary }}>
            Aucun profil enfant. Ajoutez-en un pour associer vos contes.
          </p>
        ) : (
          children.map(child => (
            <ChildCard key={child.id}>
              {editingId === child.id ? (
                <FormRow style={{ flex: 1 }}>
                  <InputField>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </InputField>
                  <InputField>
                    <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                  </InputField>
                  <ChildActions>
                    <ActionButton onClick={() => handleUpdate(child.id)}>Sauver</ActionButton>
                    <ActionButton $variant="danger" onClick={() => setEditingId(null)}>Annuler</ActionButton>
                  </ChildActions>
                </FormRow>
              ) : (
                <>
                  <ChildInfo>
                    <h3>{child.name}</h3>
                    <p>{child.age ? `${child.age} ans` : 'Age non renseigne'} - {child.orders?.length || 0} conte(s)</p>
                  </ChildInfo>
                  <ChildActions>
                    <ActionButton onClick={() => startEdit(child)}>Modifier</ActionButton>
                    <ActionButton $variant="danger" onClick={() => handleDelete(child.id)}>Supprimer</ActionButton>
                  </ChildActions>
                </>
              )}
            </ChildCard>
          ))
        )}
      </MainContent>
      <Footer />
    </PageContainer>
  );
};
