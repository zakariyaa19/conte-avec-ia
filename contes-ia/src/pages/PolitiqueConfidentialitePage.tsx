import React, { useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import {
  Container,
  PageHeader,
  PageTitle,
  PageIntro,
  Section,
} from '../styles/CommonPageStyles';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const PrivacyContent = styled.div`
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.8;

  h3 {
    color: var(--text-primary);
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.lg};
    margin: ${theme.spacing.xl} 0 ${theme.spacing.md} 0;
    font-weight: 600;
  }

  h4 {
    color: var(--text-primary);
    font-size: ${theme.fontSizes.base};
    margin: ${theme.spacing.md} 0 ${theme.spacing.sm} 0;
    font-weight: 600;
  }

  p {
    margin-bottom: ${theme.spacing.md};
    color: var(--text-secondary);
  }

  ul {
    margin: ${theme.spacing.md} 0;
    padding-left: ${theme.spacing.lg};

    li {
      margin-bottom: ${theme.spacing.xs};
      color: var(--text-secondary);
    }
  }

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }

  a {
    color: ${theme.colors.accent.coral};
    text-decoration: none;
    &:hover { text-decoration: underline; }
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
    const metaRobots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    metaRobots.setAttribute('content', 'noindex, follow');
    if (!document.querySelector('meta[name="robots"]')) {
      document.head.appendChild(metaRobots);
    }
  }, []);

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Politique de Confidentialité</PageTitle>
          <PageIntro>
            Protection de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
          </PageIntro>
        </PageHeader>

        <Section>
          <PrivacyContent>
            <div className="important">
              <strong>Engagement :</strong> PAUSIA s'engage à protéger la vie privée de ses utilisateurs. Cette politique décrit les données collectées, leur utilisation, et vos droits.
            </div>

            <h3>1. Responsable du traitement</h3>
            <p>
              <strong>Dénomination :</strong> PAUSIA (Entrepreneur individuel)<br/>
              <strong>SIRET :</strong> 99282930900010<br/>
              <strong>Email (DPO) :</strong> contact@contedia.fr<br/>
              <strong>Téléphone :</strong> +33 7 80 77 71 10
            </p>

            <h3>2. Données collectées</h3>

            <h4>2.1 Données fournies par l'utilisateur</h4>
            <ul>
              <li><strong>Compte utilisateur :</strong> adresse email, prénom (via inscription classique ou Google OAuth)</li>
              <li><strong>Personnalisation du conte :</strong> prénom de l'enfant, âge, couleur des yeux/cheveux/peau, thème, style d'illustration, message central</li>
              <li><strong>Photos :</strong> photos du visage de l'enfant (si option choisie), utilisées exclusivement pour la génération des illustrations du conte</li>
              <li><strong>Paiement :</strong> les données bancaires sont traitées directement par Stripe (certifié PCI DSS niveau 1). PAUSIA ne stocke jamais vos données de carte bancaire</li>
            </ul>

            <h4>2.2 Données collectées automatiquement</h4>
            <ul>
              <li>Adresse IP, type de navigateur et système d'exploitation</li>
              <li>Pages visitées et interactions avec le Site (Vercel Analytics)</li>
              <li>Données de session et d'authentification (cookies techniques)</li>
            </ul>

            <h3>3. Finalités et bases légales du traitement</h3>
            <ul>
              <li><strong>Exécution du contrat (art. 6.1.b RGPD) :</strong> création du conte personnalisé, gestion de la commande, livraison du produit numérique, gestion de l'abonnement Club</li>
              <li><strong>Obligation légale (art. 6.1.c RGPD) :</strong> conservation des factures et données comptables (10 ans)</li>
              <li><strong>Intérêt légitime (art. 6.1.f RGPD) :</strong> amélioration du service, sécurité du Site, prévention de la fraude</li>
              <li><strong>Consentement (art. 6.1.a RGPD) :</strong> cookies analytiques, communications marketing</li>
            </ul>

            <h3>4. Destinataires des données</h3>
            <p>Vos données peuvent être transmises aux sous-traitants suivants :</p>
            <ul>
              <li><strong>Stripe</strong> (San Francisco, USA) : traitement des paiements - Clauses contractuelles types (CCT) et certification PCI DSS</li>
              <li><strong>Vercel</strong> (Covina, USA) : hébergement frontend et analytics - Clauses contractuelles types (CCT)</li>
              <li><strong>Render</strong> (San Francisco, USA) : hébergement backend et base de données - Clauses contractuelles types (CCT)</li>
              <li><strong>OpenAI</strong> (San Francisco, USA) : génération des textes et illustrations par IA - Data Processing Addendum (DPA)</li>
              <li><strong>Google</strong> (Mountain View, USA) : authentification OAuth - Clauses contractuelles types (CCT)</li>
            </ul>

            <h3>5. Transferts internationaux</h3>
            <p>
              Certains de nos sous-traitants sont situés aux États-Unis. Les transferts de données sont encadrés par des clauses contractuelles types (CCT) approuvées par la Commission européenne, conformément à l'article 46.2.c du RGPD.
            </p>

            <h3>6. Durée de conservation</h3>
            <ul>
              <li><strong>Données de compte :</strong> durée de vie du compte + 3 ans après suppression</li>
              <li><strong>Données de commande et factures :</strong> 10 ans (obligation légale comptable)</li>
              <li><strong>Photos uploadées :</strong> supprimées automatiquement 30 jours après la génération du conte</li>
              <li><strong>Contes générés (PDF) :</strong> conservés tant que le compte est actif</li>
              <li><strong>Données analytiques :</strong> 26 mois</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>

            <h3>7. Vos droits</h3>
            <p>Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> (art. 15) : obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification</strong> (art. 16) : corriger des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> (art. 17) : demander la suppression de vos données</li>
              <li><strong>Droit à la limitation du traitement</strong> (art. 18) : limiter l'utilisation de vos données</li>
              <li><strong>Droit à la portabilité</strong> (art. 20) : récupérer vos données dans un format structuré (JSON/CSV)</li>
              <li><strong>Droit d'opposition</strong> (art. 21) : vous opposer au traitement pour motifs légitimes</li>
              <li><strong>Droit de retrait du consentement</strong> (art. 7.3) : retirer votre consentement à tout moment sans affecter la licéité du traitement antérieur</li>
            </ul>

            <p>
              <strong>Pour exercer vos droits :</strong> envoyez un email à <strong>contact@contedia.fr</strong> en indiquant votre demande et en justifiant votre identité. Nous répondrons dans un délai maximum de 30 jours.
            </p>

            <h3>8. Cookies</h3>

            <h4>8.1 Cookies strictement nécessaires (sans consentement)</h4>
            <ul>
              <li>Session d'authentification (JWT)</li>
              <li>Préférences de langue</li>
              <li>Sécurité (CSRF)</li>
            </ul>

            <h4>8.2 Cookies analytiques (avec consentement)</h4>
            <ul>
              <li>Vercel Analytics : mesure d'audience anonymisée</li>
              <li>Vercel Speed Insights : performances du site</li>
            </ul>

            <p>
              Aucun cookie publicitaire ou de remarketing n'est utilisé sur le Site. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
            </p>

            <h3>9. Sécurité des données</h3>
            <p>PAUSIA met en œuvre les mesures suivantes pour protéger vos données :</p>
            <ul>
              <li>Chiffrement HTTPS/TLS sur l'ensemble du Site</li>
              <li>Mots de passe hashés (bcrypt)</li>
              <li>Authentification par tokens JWT avec expiration</li>
              <li>Données bancaires traitées exclusivement par Stripe (jamais stockées par PAUSIA)</li>
              <li>Accès restreint aux données en production</li>
              <li>Sauvegardes automatiques et chiffrées de la base de données</li>
            </ul>

            <h3>10. Protection des mineurs</h3>
            <p>
              Le service Contedia est destiné aux parents et tuteurs légaux. Les commandes sont passées par des adultes. Les données de personnalisation concernant les enfants (prénom, âge) sont collectées auprès du parent/tuteur et utilisées uniquement pour la création du conte.
            </p>
            <p>
              Les photos d'enfants sont traitées de manière sécurisée et supprimées automatiquement après génération du conte. Aucune donnée d'enfant n'est partagée à des fins marketing.
            </p>

            <h3>11. Modifications</h3>
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle, les utilisateurs seront informés par email ou par notification sur le Site. La date de dernière mise à jour est indiquée ci-dessous.
            </p>

            <h3>12. Réclamation auprès de la CNIL</h3>
            <p>
              Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de :
            </p>
            <p>
              <strong>CNIL - Commission Nationale de l'Informatique et des Libertés</strong><br/>
              3 Place de Fontenoy - TSA 80715<br/>
              75334 PARIS CEDEX 07<br/>
              Téléphone : 01 53 73 22 22<br/>
              Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>

            <h3>13. Contact</h3>
            <p>
              Pour toute question relative à cette politique :<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Téléphone :</strong> +33 7 80 77 71 10
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <em>Dernière mise à jour : mars 2026</em>
            </p>
          </PrivacyContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { PolitiqueConfidentialitePage };
