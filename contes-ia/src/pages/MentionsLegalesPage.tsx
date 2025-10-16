import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import {
  Container,
  PageHeader,
  PageTitle,
  PageIntro,
  Section,
  SectionTitle
} from '../styles/CommonPageStyles';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const LegalContent = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.8;
  
  h3 {
    color: ${theme.colors.text.primary};
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.lg};
    margin: ${theme.spacing.xl} 0 ${theme.spacing.md} 0;
    font-weight: 600;
  }
  
  p {
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.text.secondary};
  }
  
  ul {
    margin: ${theme.spacing.md} 0;
    padding-left: ${theme.spacing.lg};
    
    li {
      margin-bottom: ${theme.spacing.xs};
      color: ${theme.colors.text.secondary};
    }
  }
  
  strong {
    color: ${theme.colors.text.primary};
    font-weight: 600;
  }
  
  .highlight {
    background: ${theme.colors.accent.paleYellow};
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: bold;
  }
`;

const MentionsLegalesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Mentions Légales | Contes d\'IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Mentions légales de Contes d\'IA - Informations légales, éditeur, hébergeur et conditions d\'utilisation.');
    }
  }, []);

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Mentions Légales</PageTitle>
          <PageIntro>
            Informations légales concernant le site Contes d'IA et son exploitation.
          </PageIntro>
        </PageHeader>

        <Section>
          <LegalContent>
            <h3>1. Éditeur du site</h3>
            <p>
              <strong>Raison sociale :</strong> <span className="highlight">................</span><br/>
              <strong>Forme juridique :</strong> <span className="highlight">................</span><br/>
              <strong>Capital social :</strong> <span className="highlight">................</span><br/>
              <strong>Siège social :</strong> <span className="highlight">................</span><br/>
              <strong>Numéro SIRET :</strong> <span className="highlight">................</span><br/>
              <strong>Code APE :</strong> <span className="highlight">................</span><br/>
              <strong>Numéro de TVA intracommunautaire :</strong> <span className="highlight">................</span>
            </p>

            <h3>2. Directeur de la publication</h3>
            <p>
              <strong>Nom :</strong> <span className="highlight">................</span><br/>
              <strong>Qualité :</strong> <span className="highlight">................</span><br/>
              <strong>Email :</strong> <span className="highlight">................</span>
            </p>

            <h3>3. Hébergement</h3>
            <p>
              Le site est hébergé par :<br/>
              <strong>Nom de l'hébergeur :</strong> <span className="highlight">................</span><br/>
              <strong>Adresse :</strong> <span className="highlight">................</span><br/>
              <strong>Téléphone :</strong> <span className="highlight">................</span>
            </p>

            <h3>4. Propriété intellectuelle</h3>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>

            <h3>5. Responsabilité</h3>
            <p>
              Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
            </p>
            <p>
              Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email à l'adresse <span className="highlight">................</span> en décrivant le problème de la manière la plus précise possible.
            </p>

            <h3>6. Liens hypertextes</h3>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de <span className="highlight">................</span>.
            </p>

            <h3>7. Collecte et traitement de données personnelles</h3>
            <p>
              Conformément aux dispositions de la loi n° 78-17 du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de modification et de suppression des données qui vous concernent.
            </p>
            <p>
              Pour exercer ce droit, adressez-vous à :<br/>
              <span className="highlight">................</span>
            </p>

            <h3>8. Cookies</h3>
            <p>
              Le site peut être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage. Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez.
            </p>
            <p>
              Vous pouvez configurer votre navigateur pour qu'il vous signale leur présence ou les refuse automatiquement.
            </p>

            <h3>9. Droit applicable et juridiction compétente</h3>
            <p>
              Tout litige en relation avec l'utilisation du site <strong>contedia.fr</strong> est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de <span className="highlight">................</span>.
            </p>

            <h3>10. Contact</h3>
            <p>
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter à :<br/>
              <strong>Email :</strong> <span className="highlight">................</span><br/>
              <strong>Téléphone :</strong> <span className="highlight">................</span><br/>
              <strong>Adresse postale :</strong> <span className="highlight">................</span>
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
              <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em>
            </p>
          </LegalContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { MentionsLegalesPage };
