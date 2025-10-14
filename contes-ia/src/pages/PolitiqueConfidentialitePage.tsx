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

const PrivacyContent = styled.div`
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
  
  .important {
    background: ${theme.colors.accent.lightCoral};
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    margin: ${theme.spacing.md} 0;
    border-left: 4px solid ${theme.colors.accent.coral};
  }
`;

const PolitiqueConfidentialitePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Politique de Confidentialité | Contes d\'IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Politique de confidentialité de Contes d\'IA - Protection des données personnelles, cookies et droits des utilisateurs.');
    }
  }, []);

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Politique de Confidentialité</PageTitle>
          <PageIntro>
            Protection de vos données personnelles et respect de votre vie privée sur Contes d'IA.
          </PageIntro>
        </PageHeader>

        <Section>
          <PrivacyContent>
            <div className="important">
              <strong>Engagement de confidentialité :</strong> Nous nous engageons à protéger et respecter votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
            </div>

            <h3>1. Responsable du traitement des données</h3>
            <p>
              <strong>Responsable :</strong> <span className="highlight">................</span><br/>
              <strong>Adresse :</strong> <span className="highlight">................</span><br/>
              <strong>Email :</strong> <span className="highlight">................</span><br/>
              <strong>Téléphone :</strong> <span className="highlight">................</span>
            </p>

            <h3>2. Données collectées</h3>
            <p>Nous collectons les types de données suivantes :</p>
            
            <h4>2.1 Données fournies directement par vous :</h4>
            <ul>
              <li>Informations de contact (nom, prénom, adresse email)</li>
              <li>Informations de livraison (adresse postale, téléphone)</li>
              <li>Informations de personnalisation du conte (nom de l'enfant, âge, préférences)</li>
              <li>Photos uploadées (si vous choisissez cette option)</li>
              <li>Informations de paiement (traitées par nos partenaires sécurisés)</li>
            </ul>

            <h4>2.2 Données collectées automatiquement :</h4>
            <ul>
              <li>Adresse IP</li>
              <li>Type de navigateur et version</li>
              <li>Pages visitées et temps passé sur le site</li>
              <li>Données de cookies et technologies similaires</li>
            </ul>

            <h3>3. Finalités du traitement</h3>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li><strong>Création et livraison des contes :</strong> Personnalisation et impression de votre livre</li>
              <li><strong>Gestion des commandes :</strong> Traitement des paiements et suivi des livraisons</li>
              <li><strong>Communication :</strong> Confirmation de commande, support client</li>
              <li><strong>Amélioration du service :</strong> Analyse des performances du site</li>
              <li><strong>Marketing :</strong> Avec votre consentement, envoi d'offres personnalisées</li>
            </ul>

            <h3>4. Base légale du traitement</h3>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li><strong>Exécution du contrat :</strong> Pour la création et livraison de votre conte</li>
              <li><strong>Consentement :</strong> Pour les cookies non essentiels et le marketing</li>
              <li><strong>Intérêt légitime :</strong> Pour l'amélioration de nos services</li>
              <li><strong>Obligation légale :</strong> Pour la comptabilité et les obligations fiscales</li>
            </ul>

            <h3>5. Partage des données</h3>
            <p>Nous partageons vos données uniquement avec :</p>
            <ul>
              <li><strong>Prestataires techniques :</strong> <span className="highlight">................</span> (hébergement, paiement)</li>
              <li><strong>Partenaires logistiques :</strong> <span className="highlight">................</span> (impression, livraison)</li>
              <li><strong>Services de paiement :</strong> PayPal, Stripe (données chiffrées)</li>
              <li><strong>Autorités compétentes :</strong> Si requis par la loi</li>
            </ul>

            <h3>6. Transferts internationaux</h3>
            <p>
              Certains de nos prestataires peuvent être situés hors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en place (clauses contractuelles types, décisions d'adéquation).
            </p>
            <p>
              <strong>Pays concernés :</strong> <span className="highlight">................</span><br/>
              <strong>Garanties :</strong> <span className="highlight">................</span>
            </p>

            <h3>7. Durée de conservation</h3>
            <ul>
              <li><strong>Données de commande :</strong> 10 ans (obligations comptables)</li>
              <li><strong>Données de personnalisation :</strong> 3 ans après la dernière commande</li>
              <li><strong>Photos uploadées :</strong> Supprimées après création du conte (sauf demande contraire)</li>
              <li><strong>Données marketing :</strong> Jusqu'à désabonnement + 3 ans</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>

            <h3>8. Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> Connaître les données que nous détenons sur vous</li>
              <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> Limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> Vous opposer au traitement pour motifs légitimes</li>
              <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
            </ul>

            <p>
              <strong>Pour exercer vos droits, contactez-nous à :</strong><br/>
              Email : <span className="highlight">................</span><br/>
              Courrier : <span className="highlight">................</span>
            </p>

            <h3>9. Cookies et technologies similaires</h3>
            <p>Nous utilisons différents types de cookies :</p>
            
            <h4>9.1 Cookies essentiels :</h4>
            <ul>
              <li>Fonctionnement du panier d'achat</li>
              <li>Sécurité et authentification</li>
              <li>Préférences de langue</li>
            </ul>

            <h4>9.2 Cookies analytiques :</h4>
            <ul>
              <li>Google Analytics (avec votre consentement)</li>
              <li>Statistiques de fréquentation</li>
            </ul>

            <h4>9.3 Cookies marketing :</h4>
            <ul>
              <li>Publicités personnalisées</li>
              <li>Réseaux sociaux</li>
              <li>Remarketing</li>
            </ul>

            <p>Vous pouvez gérer vos préférences de cookies via notre bandeau de consentement ou les paramètres de votre navigateur.</p>

            <h3>10. Sécurité des données</h3>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :</p>
            <ul>
              <li>Chiffrement des données sensibles (SSL/TLS)</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Sauvegardes régulières et sécurisées</li>
              <li>Formation du personnel à la protection des données</li>
              <li>Audits de sécurité réguliers</li>
            </ul>

            <h3>11. Mineurs</h3>
            <p>
              Notre service s'adresse aux parents et tuteurs légaux. Nous ne collectons pas sciemment de données personnelles d'enfants de moins de 16 ans sans le consentement des parents.
            </p>
            <p>
              Si vous pensez qu'un mineur a fourni des informations personnelles, contactez-nous immédiatement à <span className="highlight">................</span>
            </p>

            <h3>12. Modifications de cette politique</h3>
            <p>
              Cette politique peut être mise à jour occasionnellement. Nous vous informerons de tout changement significatif par email ou via une notification sur notre site.
            </p>

            <h3>13. Réclamations</h3>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
            </p>
            <p>
              <strong>CNIL</strong><br/>
              3 Place de Fontenoy - TSA 80715<br/>
              75334 PARIS CEDEX 07<br/>
              Téléphone : 01 53 73 22 22<br/>
              Site web : www.cnil.fr
            </p>

            <h3>14. Contact</h3>
            <p>
              Pour toute question concernant cette politique de confidentialité :<br/>
              <strong>Email :</strong> <span className="highlight">................</span><br/>
              <strong>Téléphone :</strong> <span className="highlight">................</span><br/>
              <strong>Adresse :</strong> <span className="highlight">................</span>
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
              <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em>
            </p>
          </PrivacyContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { PolitiqueConfidentialitePage };
