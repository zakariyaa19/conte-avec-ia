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
`;

const AccordionItemContainer = styled.div`
  border: 1px solid #E5E5E5;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md};
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: ${theme.shadows.sm};
  }
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: ${theme.spacing.lg};
  background-color: ${props => props.$isOpen ? theme.colors.accent.creamyYellow : theme.colors.background.white};
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.accent.creamyYellow};
  }
`;

const AccordionIcon = styled.span<{ $isOpen: boolean }>`
  font-size: ${theme.fontSizes.lg};
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AccordionBody = styled.div`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background.secondary};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: ${theme.fontSizes.sm};
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
          <AccordionItemContainer key={item.id}>
            <AccordionHeader
              $isOpen={isOpen}
              onClick={() => toggleItem(item.id)}
            >
              {item.question}
              <AccordionIcon $isOpen={isOpen}>
                ▼
              </AccordionIcon>
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
