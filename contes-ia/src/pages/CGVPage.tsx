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

const CGVContent = styled.div`
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

const CGVPage: React.FC = () => {
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
          <PageTitle>Conditions Générales de Vente</PageTitle>
          <PageIntro>
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits et services proposés sur le site contedia.fr.
          </PageIntro>
        </PageHeader>

        <Section>
          <CGVContent>
            <h3>1. Objet</h3>
            <p>
              Les présentes CGV définissent les droits et obligations des parties dans le cadre de la vente de produits numériques (contes personnalisés) et de services d'abonnement (Club) proposés par PAUSIA via le site contedia.fr (ci-après « le Site »).
            </p>
            <p>
              Toute commande implique l'acceptation sans réserve des présentes CGV par le client.
            </p>

            <h3>2. Identité du vendeur</h3>
            <p>
              <strong>Dénomination :</strong> PAUSIA<br/>
              <strong>Forme juridique :</strong> Entrepreneur individuel<br/>
              <strong>SIRET :</strong> 99282930900010<br/>
              <strong>Code APE :</strong> 6202A<br/>
              <strong>TVA :</strong> TVA non applicable, article 293 B du Code général des impôts<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Téléphone :</strong> +33 7 80 77 71 10
            </p>

            <h3>3. Produits et services</h3>
            <p>PAUSIA propose les produits et services suivants :</p>
            <ul>
              <li><strong>Conte personnalisé (achat unitaire) :</strong> création d'un livre numérique personnalisé au format PDF, généré par intelligence artificielle à partir des informations fournies par le client (prénom, âge, thème, style d'illustration, etc.)</li>
              <li><strong>Abonnement Club :</strong> abonnement mensuel donnant accès à des avantages (réduction sur les contes, contes offerts, accès prioritaire aux nouvelles fonctionnalités)</li>
            </ul>
            <p>
              Les caractéristiques essentielles des produits sont présentées sur le Site avant la commande. Les illustrations et descriptions sont aussi fidèles que possible, mais de légères variations sont possibles du fait de la génération par intelligence artificielle.
            </p>

            <h3>4. Prix</h3>
            <p>
              Les prix sont indiqués en euros TTC. TVA non applicable conformément à l'article 293 B du CGI.
            </p>
            <p>
              PAUSIA se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés au prix en vigueur au moment de la validation de la commande.
            </p>

            <h3>5. Commande</h3>
            <p>Le processus de commande comprend les étapes suivantes :</p>
            <ul>
              <li>Personnalisation du conte (choix du thème, du style, saisie des informations du personnage)</li>
              <li>Upload optionnel de photos</li>
              <li>Récapitulatif de la commande</li>
              <li>Paiement sécurisé via Stripe</li>
              <li>Confirmation par email</li>
            </ul>
            <p>
              La commande est considérée comme définitive après le paiement. Un email de confirmation est envoyé à l'adresse fournie. Le conte est généré automatiquement et mis à disposition dans l'espace client du Site.
            </p>

            <h3>6. Paiement</h3>
            <p>
              Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée <strong>Stripe</strong> (certifiée PCI DSS niveau 1). PAUSIA ne stocke jamais les données de carte bancaire du client.
            </p>
            <p>
              Le paiement est débité immédiatement à la validation de la commande. Pour l'abonnement Club, le paiement est prélevé mensuellement à date anniversaire.
            </p>

            <h3>7. Livraison</h3>
            <p>
              Les contes personnalisés sont des <strong>produits numériques</strong> (fichiers PDF). Ils sont mis à disposition du client dans son espace personnel sur le Site, accessible après connexion.
            </p>
            <p>
              Le délai de génération est généralement de quelques minutes à quelques heures après le paiement. Un email de notification est envoyé lorsque le conte est prêt.
            </p>
            <p>
              Aucune livraison physique n'est effectuée.
            </p>

            <h3>8. Droit de rétractation</h3>
            <div className="important">
              <strong>Information importante :</strong> Conformément à l'article L. 221-28 13&deg; du Code de la consommation, le droit de rétractation ne peut être exercé pour la fourniture de contenu numérique non fourni sur un support matériel dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
            </div>
            <p>
              En validant sa commande, le client reconnaît expressément :
            </p>
            <ul>
              <li>Que la génération du conte (contenu numérique) commence immédiatement après le paiement</li>
              <li>Qu'il renonce expressément à son droit de rétractation de 14 jours</li>
            </ul>
            <p>
              Cette renonciation est confirmée lors du processus de commande et dans l'email de confirmation.
            </p>

            <h3>9. Abonnement Club</h3>
            <p>
              L'abonnement Club est un contrat à durée indéterminée avec paiement mensuel.
            </p>
            <ul>
              <li><strong>Souscription :</strong> le premier paiement est effectué lors de l'inscription</li>
              <li><strong>Renouvellement :</strong> l'abonnement se renouvelle automatiquement chaque mois</li>
              <li><strong>Résiliation :</strong> le client peut résilier à tout moment depuis son espace client ou par email à contact@contedia.fr. La résiliation prend effet à la fin de la période en cours. Aucun remboursement au prorata n'est effectué pour la période en cours</li>
              <li><strong>Modification de prix :</strong> en cas de changement de tarif, le client est prévenu par email au moins 30 jours avant l'application du nouveau prix. Il peut résilier avant la prise d'effet</li>
            </ul>

            <h3>10. Garantie et conformité</h3>
            <p>
              Conformément aux articles L. 217-3 et suivants du Code de la consommation, PAUSIA est tenu de la garantie légale de conformité pour les contenus et services numériques.
            </p>
            <p>
              En cas de défaut de conformité constaté (conte non généré, erreur manifeste dans le contenu, fichier corrompu), le client peut obtenir la mise en conformité du produit (régénération du conte) sans frais.
            </p>
            <p>
              Le client dispose d'un délai de 2 ans à compter de la fourniture du contenu numérique pour agir au titre de la garantie légale de conformité.
            </p>

            <h3>11. Responsabilité</h3>
            <p>
              PAUSIA s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la qualité du service. La responsabilité de PAUSIA est limitée au montant de la commande concernée.
            </p>
            <p>
              PAUSIA ne saurait être tenu responsable :
            </p>
            <ul>
              <li>Des variations inhérentes à la génération par intelligence artificielle</li>
              <li>De l'inexactitude des informations fournies par le client</li>
              <li>D'une interruption temporaire du service pour maintenance</li>
              <li>De tout dommage résultant d'une utilisation non conforme du produit</li>
            </ul>

            <h3>12. Propriété intellectuelle</h3>
            <p>
              Les contes générés restent la propriété intellectuelle de PAUSIA. Le client bénéficie d'une <strong>licence d'utilisation personnelle et non commerciale</strong> pour les contes qu'il a commandés. Cette licence est perpétuelle, mondiale et non transmissible.
            </p>
            <p>
              Il est interdit de revendre, redistribuer ou exploiter commercialement les contes sans autorisation écrite préalable de PAUSIA.
            </p>

            <h3>13. Données personnelles</h3>
            <p>
              Les données personnelles collectées dans le cadre des commandes sont traitées conformément à notre <a href="/politique-confidentialite">Politique de confidentialité</a>.
            </p>

            <h3>14. Service client</h3>
            <p>
              Pour toute réclamation ou question :<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Téléphone :</strong> +33 7 80 77 71 10<br/>
              <strong>Délai de réponse :</strong> nous nous engageons à répondre sous 48 heures ouvrées.
            </p>

            <h3>15. Médiation</h3>
            <p>
              Conformément aux articles L. 611-1 et suivants du Code de la consommation, en cas de litige non résolu après réclamation auprès du service client, le consommateur peut recourir gratuitement à un médiateur de la consommation :
            </p>
            <p>
              <strong>MEDICYS</strong><br/>
              73 Boulevard de Clichy<br/>
              75009 Paris<br/>
              Site web : <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer">www.medicys.fr</a>
            </p>
            <p>
              Le consommateur peut également utiliser la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
            </p>

            <h3>16. Droit applicable</h3>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, et après échec de la médiation, les tribunaux français seront seuls compétents.
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <em>Dernière mise à jour : mars 2026</em>
            </p>
          </CGVContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { CGVPage };
