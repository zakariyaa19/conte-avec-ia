import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { ValidatedInput } from '../ui/ValidatedInput';
import { SecondaryCharacter } from '../../types/FormTypes';

interface SecondaryCharactersSectionProps {
  secondaryCharacters: SecondaryCharacter[];
  onChange: (characters: SecondaryCharacter[]) => void;
}

const MAX_CHARACTERS = 5;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SectionContainer = styled.div`
  padding: ${theme.spacing.md} 0;
`;

const SectionHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.xs};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  font-size: ${theme.fontSizes.xs};
  margin: 0;
`;

const CharacterCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s ease;
  animation: ${slideIn} 0.3s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.lg};
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.accent.creamyYellow};
`;

const CharacterNumberBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: 700;
  color: var(--text-primary);
  font-size: ${theme.fontSizes.sm};
`;

const NumberCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  color: white;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  flex-shrink: 0;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: transparent;
  border: 1px solid #ffcdd2;
  color: #c62828;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;

  &:hover {
    background: #ffebee;
    border-color: #ef9a9a;
  }
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const TypeButton = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${props => props.$isSelected ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isSelected ? theme.colors.accent.creamyYellow : 'var(--bg-card)'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: var(--text-primary);
  min-height: 48px;

  &:hover {
    border-color: ${theme.colors.accent.coral};
    box-shadow: ${theme.shadows.sm};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
    min-height: 44px;
  }
`;

const TypeIconCircle = styled.div<{ $variant: 'human' | 'animal' }>`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: ${props => props.$variant === 'human'
    ? `linear-gradient(135deg, ${theme.colors.accent.softPink}50, ${theme.colors.accent.coral}20)`
    : `linear-gradient(135deg, ${theme.colors.accent.lightGreen}50, ${theme.colors.accent.pastelBlue}20)`
  };
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid var(--border-input);
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  resize: vertical;
  min-height: 70px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15;
  }

  &::placeholder {
    color: var(--text-light);
  }

  @media (max-width: 480px) { font-size: 16px; }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
`;

const AddButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing.md};
`;

const LimitMessage = styled.p`
  text-align: center;
  color: var(--text-light);
  font-size: ${theme.fontSizes.xs};
  font-style: italic;
  margin-top: ${theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  color: var(--text-light);
  font-size: ${theme.fontSizes.sm};
`;

export const SecondaryCharactersSection: React.FC<SecondaryCharactersSectionProps> = ({
  secondaryCharacters,
  onChange
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddCharacter = () => {
    if (secondaryCharacters.length >= MAX_CHARACTERS) return;

    const newCharacter: SecondaryCharacter = {
      kind: 'human',
      name: '',
      ageOrType: '',
      physical: ''
    };

    onChange([...secondaryCharacters, newCharacter]);

    setTimeout(() => {
      const cards = document.querySelectorAll('[data-character-card]');
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = lastCard.querySelector('input');
        if (firstInput) {
          (firstInput as HTMLInputElement).focus();
        }
      }
    }, 100);
  };

  const handleDeleteCharacter = (index: number) => {
    const updated = secondaryCharacters.filter((_, i) => i !== index);
    onChange(updated);

    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${index}-`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const handleUpdateCharacter = (index: number, field: keyof SecondaryCharacter, value: string) => {
    const updated = [...secondaryCharacters];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);

    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateCharacter = (index: number): boolean => {
    const char = secondaryCharacters[index];
    const newErrors: { [key: string]: string } = {};

    if (!char.name || char.name.trim() === '') {
      newErrors[`${index}-name`] = 'Le nom est requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return false;
    }

    return true;
  };

  const canAddMore = secondaryCharacters.length < MAX_CHARACTERS;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Personnages secondaires</SectionTitle>
        <SectionDescription>
          Ajoutez jusqu'à {MAX_CHARACTERS} personnages secondaires à votre histoire
        </SectionDescription>
      </SectionHeader>

      {secondaryCharacters.length === 0 ? (
        <EmptyState>
          Aucun personnage secondaire ajouté
        </EmptyState>
      ) : (
        secondaryCharacters.map((character, index) => (
          <CharacterCard key={index} data-character-card>
            <CharacterHeader>
              <CharacterNumberBadge>
                <NumberCircle>{index + 1}</NumberCircle>
                Personnage #{index + 1}
              </CharacterNumberBadge>
              <DeleteButton onClick={() => handleDeleteCharacter(index)}>
                Supprimer
              </DeleteButton>
            </CharacterHeader>

            <TypeGrid>
              <TypeButton
                $isSelected={character.kind === 'human'}
                onClick={() => handleUpdateCharacter(index, 'kind', 'human')}
                type="button"
              >
                <TypeIconCircle $variant="human">{'\uD83D\uDC64'}</TypeIconCircle>
                Humain
              </TypeButton>
              <TypeButton
                $isSelected={character.kind === 'animal'}
                onClick={() => handleUpdateCharacter(index, 'kind', 'animal')}
                type="button"
              >
                <TypeIconCircle $variant="animal">{'\uD83D\uDC3E'}</TypeIconCircle>
                Animal
              </TypeButton>
            </TypeGrid>

            <InputGroup>
              <ValidatedInput
                label={character.kind === 'human' ? 'Nom / Prénom *' : 'Nom *'}
                value={character.name}
                onChange={(value) => handleUpdateCharacter(index, 'name', value)}
                placeholder={character.kind === 'human' ? 'Ex : Sophie, Max...' : 'Ex : Minou, Rex...'}
                required={true}
                error={errors[`${index}-name`]}
                onBlur={() => validateCharacter(index)}
              />

              <ValidatedInput
                label={character.kind === 'human' ? 'Âge' : 'Type / Espèce'}
                value={character.ageOrType}
                onChange={(value) => handleUpdateCharacter(index, 'ageOrType', value)}
                placeholder={character.kind === 'human' ? 'Ex : 6 ans' : 'Ex : chat, chien...'}
                required={false}
              />
            </InputGroup>

            <FullWidthField>
              <Label>Caractéristiques physiques (optionnel)</Label>
              <TextArea
                value={character.physical || ''}
                onChange={(e) => handleUpdateCharacter(index, 'physical', e.target.value)}
                placeholder={
                  character.kind === 'human'
                    ? 'Ex : cheveux bouclés, yeux verts, lunettes...'
                    : 'Ex : pelage noir, petite tache blanche, longues oreilles...'
                }
              />
            </FullWidthField>
          </CharacterCard>
        ))
      )}

      {canAddMore ? (
        <AddButton variant="outline" onClick={handleAddCharacter}>
          + Ajouter {secondaryCharacters.length === 0 ? 'un' : 'un autre'} personnage
        </AddButton>
      ) : (
        <LimitMessage>
          Limite atteinte ({MAX_CHARACTERS} personnages maximum)
        </LimitMessage>
      )}
    </SectionContainer>
  );
};
