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
    document.title = 'Politique de Confidentialite | Contes d\'IA';

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
          <PageTitle>Politique de Confidentialite</PageTitle>
          <PageIntro>
            Protection de vos donnees personnelles conformement au Reglement General sur la Protection des Donnees (RGPD - Reglement UE 2016/679) et a la loi Informatique et Libertes du 6 janvier 1978 modifiee.
          </PageIntro>
        </PageHeader>

        <Section>
          <PrivacyContent>
            <div className="important">
              <strong>Engagement :</strong> PAUSIA s'engage a proteger la vie privee de ses utilisateurs. Cette politique decrit les donnees collectees, leur utilisation, et vos droits.
            </div>

            <h3>1. Responsable du traitement</h3>
            <p>
              <strong>Denomination :</strong> PAUSIA (Entrepreneur individuel)<br/>
              <strong>SIRET :</strong> 99282930900010<br/>
              <strong>Email (DPO) :</strong> contact@contedia.fr<br/>
              <strong>Telephone :</strong> +33 7 80 77 71 10
            </p>

            <h3>2. Donnees collectees</h3>

            <h4>2.1 Donnees fournies par l'utilisateur</h4>
            <ul>
              <li><strong>Compte utilisateur :</strong> adresse email, prenom (via inscription classique ou Google OAuth)</li>
              <li><strong>Personnalisation du conte :</strong> prenom de l'enfant, age, couleur des yeux/cheveux/peau, theme, style d'illustration, message central</li>
              <li><strong>Photos :</strong> photos du visage de l'enfant (si option choisie), utilisees exclusivement pour la generation des illustrations du conte</li>
              <li><strong>Paiement :</strong> les donnees bancaires sont traitees directement par Stripe (certifie PCI DSS niveau 1). PAUSIA ne stocke jamais vos donnees de carte bancaire</li>
            </ul>

            <h4>2.2 Donnees collectees automatiquement</h4>
            <ul>
              <li>Adresse IP, type de navigateur et systeme d'exploitation</li>
              <li>Pages visitees et interactions avec le Site (Vercel Analytics)</li>
              <li>Donnees de session et d'authentification (cookies techniques)</li>
            </ul>

            <h3>3. Finalites et bases legales du traitement</h3>
            <ul>
              <li><strong>Execution du contrat (art. 6.1.b RGPD) :</strong> creation du conte personnalise, gestion de la commande, livraison du produit numerique, gestion de l'abonnement Club</li>
              <li><strong>Obligation legale (art. 6.1.c RGPD) :</strong> conservation des factures et donnees comptables (10 ans)</li>
              <li><strong>Interet legitime (art. 6.1.f RGPD) :</strong> amelioration du service, securite du Site, prevention de la fraude</li>
              <li><strong>Consentement (art. 6.1.a RGPD) :</strong> cookies analytiques, communications marketing</li>
            </ul>

            <h3>4. Destinataires des donnees</h3>
            <p>Vos donnees peuvent etre transmises aux sous-traitants suivants :</p>
            <ul>
              <li><strong>Stripe</strong> (San Francisco, USA) : traitement des paiements - Clauses contractuelles types (CCT) et certification PCI DSS</li>
              <li><strong>Vercel</strong> (Covina, USA) : hebergement frontend et analytics - Clauses contractuelles types (CCT)</li>
              <li><strong>Render</strong> (San Francisco, USA) : hebergement backend et base de donnees - Clauses contractuelles types (CCT)</li>
              <li><strong>OpenAI</strong> (San Francisco, USA) : generation des textes et illustrations par IA - Data Processing Addendum (DPA)</li>
              <li><strong>Google</strong> (Mountain View, USA) : authentification OAuth - Clauses contractuelles types (CCT)</li>
            </ul>

            <h3>5. Transferts internationaux</h3>
            <p>
              Certains de nos sous-traitants sont situes aux Etats-Unis. Les transferts de donnees sont encadres par des clauses contractuelles types (CCT) approuvees par la Commission europeenne, conformement a l'article 46.2.c du RGPD.
            </p>

            <h3>6. Duree de conservation</h3>
            <ul>
              <li><strong>Donnees de compte :</strong> duree de vie du compte + 3 ans apres suppression</li>
              <li><strong>Donnees de commande et factures :</strong> 10 ans (obligation legale comptable)</li>
              <li><strong>Photos uploadees :</strong> supprimees automatiquement 30 jours apres la generation du conte</li>
              <li><strong>Contes generes (PDF) :</strong> conserves tant que le compte est actif</li>
              <li><strong>Donnees analytiques :</strong> 26 mois</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>

            <h3>7. Vos droits</h3>
            <p>Conformement au RGPD (articles 15 a 22), vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'acces</strong> (art. 15) : obtenir une copie de vos donnees personnelles</li>
              <li><strong>Droit de rectification</strong> (art. 16) : corriger des donnees inexactes</li>
              <li><strong>Droit a l'effacement</strong> (art. 17) : demander la suppression de vos donnees</li>
              <li><strong>Droit a la limitation du traitement</strong> (art. 18) : limiter l'utilisation de vos donnees</li>
              <li><strong>Droit a la portabilite</strong> (art. 20) : recuperer vos donnees dans un format structure (JSON/CSV)</li>
              <li><strong>Droit d'opposition</strong> (art. 21) : vous opposer au traitement pour motifs legitimes</li>
              <li><strong>Droit de retrait du consentement</strong> (art. 7.3) : retirer votre consentement a tout moment sans affecter la liceite du traitement anterieur</li>
            </ul>

            <p>
              <strong>Pour exercer vos droits :</strong> envoyez un email a <strong>contact@contedia.fr</strong> en indiquant votre demande et en justifiant votre identite. Nous repondrons dans un delai maximum de 30 jours.
            </p>

            <h3>8. Cookies</h3>

            <h4>8.1 Cookies strictement necessaires (sans consentement)</h4>
            <ul>
              <li>Session d'authentification (JWT)</li>
              <li>Preferences de langue</li>
              <li>Securite (CSRF)</li>
            </ul>

            <h4>8.2 Cookies analytiques (avec consentement)</h4>
            <ul>
              <li>Vercel Analytics : mesure d'audience anonymisee</li>
              <li>Vercel Speed Insights : performances du site</li>
            </ul>

            <p>
              Aucun cookie publicitaire ou de remarketing n'est utilise sur le Site. Vous pouvez gerer vos preferences de cookies via les parametres de votre navigateur.
            </p>

            <h3>9. Securite des donnees</h3>
            <p>PAUSIA met en oeuvre les mesures suivantes pour proteger vos donnees :</p>
            <ul>
              <li>Chiffrement HTTPS/TLS sur l'ensemble du Site</li>
              <li>Mots de passe hashes (bcrypt)</li>
              <li>Authentification par tokens JWT avec expiration</li>
              <li>Donnees bancaires traitees exclusivement par Stripe (jamais stockees par PAUSIA)</li>
              <li>Acces restreint aux donnees en production</li>
              <li>Sauvegardes automatiques et chiffrees de la base de donnees</li>
            </ul>

            <h3>10. Protection des mineurs</h3>
            <p>
              Le service Contes d'IA est destine aux parents et tuteurs legaux. Les commandes sont passees par des adultes. Les donnees de personnalisation concernant les enfants (prenom, age) sont collectees aupres du parent/tuteur et utilisees uniquement pour la creation du conte.
            </p>
            <p>
              Les photos d'enfants sont traitees de maniere securisee et supprimees automatiquement apres generation du conte. Aucune donnee d'enfant n'est partagee a des fins marketing.
            </p>

            <h3>11. Modifications</h3>
            <p>
              Cette politique peut etre mise a jour. En cas de modification substantielle, les utilisateurs seront informes par email ou par notification sur le Site. La date de derniere mise a jour est indiquee ci-dessous.
            </p>

            <h3>12. Reclamation aupres de la CNIL</h3>
            <p>
              Si vous estimez que le traitement de vos donnees ne respecte pas la reglementation, vous pouvez introduire une reclamation aupres de :
            </p>
            <p>
              <strong>CNIL - Commission Nationale de l'Informatique et des Libertes</strong><br/>
              3 Place de Fontenoy - TSA 80715<br/>
              75334 PARIS CEDEX 07<br/>
              Telephone : 01 53 73 22 22<br/>
              Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>

            <h3>13. Contact</h3>
            <p>
              Pour toute question relative a cette politique :<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Telephone :</strong> +33 7 80 77 71 10
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <em>Derniere mise a jour : mars 2026</em>
            </p>
          </PrivacyContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { PolitiqueConfidentialitePage };
