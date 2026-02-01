import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { ValidatedInput } from '../ui/ValidatedInput';
import { SelectionCard } from '../ui/SelectionCard';
import { SecondaryCharacter } from '../../types/FormTypes';

interface SecondaryCharactersSectionProps {
  secondaryCharacters: SecondaryCharacter[];
  onChange: (characters: SecondaryCharacter[]) => void;
}

const MAX_CHARACTERS = 5;

const SectionContainer = styled.div`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    margin-left: -${theme.spacing.xs};
    margin-right: -${theme.spacing.xs};
  }
`;

const SectionHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-family: ${theme.fonts.heading};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const SectionDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.md};
`;

const CharacterCard = styled.div`
  background: ${theme.colors.background.white};
  border: 2px solid ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.background.secondary};
`;

const CharacterNumber = styled.span`
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  font-size: ${theme.fontSizes.lg};
`;

const DeleteButton = styled.button`
  background: transparent;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff4444;
    color: white;
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

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.body};
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
  }
  
  &::placeholder {
    color: ${theme.colors.text.light};
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
`;

const AddButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing.md};
`;

const LimitMessage = styled.p`
  text-align: center;
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  font-style: italic;
  margin-top: ${theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
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

    // Auto-scroll vers le nouveau personnage
    setTimeout(() => {
      const cards = document.querySelectorAll('[data-character-card]');
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus sur le premier champ
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
    
    // Clear errors for deleted character
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

    // Clear error for this field
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
        <SectionTitle>🧸 Personnages secondaires (optionnel)</SectionTitle>
        <SectionDescription>
          Ajoutez jusqu'à {MAX_CHARACTERS} personnages secondaires à votre histoire
        </SectionDescription>
      </SectionHeader>

      {secondaryCharacters.length === 0 ? (
        <EmptyState>
          <p>Aucun personnage secondaire ajouté</p>
        </EmptyState>
      ) : (
        secondaryCharacters.map((character, index) => (
          <CharacterCard key={index} data-character-card>
            <CharacterHeader>
              <CharacterNumber>Personnage secondaire #{index + 1}</CharacterNumber>
              <DeleteButton onClick={() => handleDeleteCharacter(index)}>
                Supprimer
              </DeleteButton>
            </CharacterHeader>

            <FullWidthField>
              <Label>Type *</Label>
              <TypeGrid>
                <SelectionCard
                  value="human"
                  label="Humain"
                  icon="👤"
                  isSelected={character.kind === 'human'}
                  onClick={() => handleUpdateCharacter(index, 'kind', 'human')}
                />
                <SelectionCard
                  value="animal"
                  label="Animal"
                  icon="🐾"
                  isSelected={character.kind === 'animal'}
                  onClick={() => handleUpdateCharacter(index, 'kind', 'animal')}
                />
              </TypeGrid>
            </FullWidthField>

            <InputGroup>
              <ValidatedInput
                label={character.kind === 'human' ? 'Nom / Prénom *' : 'Nom *'}
                value={character.name}
                onChange={(value) => handleUpdateCharacter(index, 'name', value)}
                placeholder={character.kind === 'human' ? 'Ex: Sophie, Max...' : 'Ex: Minou, Rex...'}
                required={true}
                error={errors[`${index}-name`]}
                onBlur={() => validateCharacter(index)}
              />

              <ValidatedInput
                label={character.kind === 'human' ? 'Âge' : 'Type / Espèce'}
                value={character.ageOrType}
                onChange={(value) => handleUpdateCharacter(index, 'ageOrType', value)}
                placeholder={character.kind === 'human' ? 'Ex: 6 ans' : 'Ex: chat, chien...'}
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
                    ? 'Ex: cheveux bouclés, yeux verts, lunettes...'
                    : 'Ex: pelage noir, petite tache blanche, longues oreilles...'
                }
              />
            </FullWidthField>
          </CharacterCard>
        ))
      )}

      {canAddMore ? (
        <AddButton variant="outline" onClick={handleAddCharacter}>
          + Ajouter {secondaryCharacters.length === 0 ? 'un' : 'un autre'} personnage secondaire
        </AddButton>
      ) : (
        <LimitMessage>
          Limite atteinte ({MAX_CHARACTERS} personnages secondaires maximum)
        </LimitMessage>
      )}
    </SectionContainer>
  );
};
