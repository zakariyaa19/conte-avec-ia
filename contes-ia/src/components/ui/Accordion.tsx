import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const AccordionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const AccordionItemContainer = styled.div<{ $isOpen: boolean }>`
  border: 1px solid ${props => props.$isOpen ? theme.colors.accent.lightCoral : 'var(--border-color)'};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  transition: all ${theme.transitions.smooth};
  background: var(--bg-card);
  box-shadow: ${props => props.$isOpen ? theme.shadows.md : 'none'};

  &:hover {
    border-color: ${props => props.$isOpen ? theme.colors.accent.lightCoral : 'var(--border-color)'};
  }
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.md};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${props => props.$isOpen ? theme.colors.accent.coral : 'var(--text-primary)'};
  transition: all ${theme.transitions.base};
  line-height: 1.4;

  &:hover {
    color: ${theme.colors.accent.coral};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const AccordionIcon = styled.div<{ $isOpen: boolean }>`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.$isOpen ? theme.colors.accent.coral : 'var(--bg-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.smooth};

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${props => props.$isOpen ? theme.colors.text.white : 'var(--text-secondary)'};
    transition: all ${theme.transitions.base};
  }

  &::before {
    width: 12px;
    height: 2px;
  }

  &::after {
    width: 2px;
    height: 12px;
    transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
    opacity: ${props => props.$isOpen ? 0 : 1};
  }

  position: relative;
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height ${theme.transitions.smooth};
`;

const AccordionBody = styled.div`
  padding: 0 ${theme.spacing.xl} ${theme.spacing.lg};
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: ${theme.fontSizes.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <AccordionContainer>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <AccordionItemContainer key={item.id} $isOpen={isOpen}>
            <AccordionHeader
              $isOpen={isOpen}
              onClick={() => toggleItem(item.id)}
            >
              {item.question}
              <AccordionIcon $isOpen={isOpen} />
            </AccordionHeader>
            <AccordionContent $isOpen={isOpen}>
              <AccordionBody>
                {item.answer}
              </AccordionBody>
            </AccordionContent>
          </AccordionItemContainer>
        );
      })}
    </AccordionContainer>
  );
};
