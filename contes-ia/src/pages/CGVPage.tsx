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
          <PageTitle>Conditions Generales de Vente</PageTitle>
          <PageIntro>
            Les presentes Conditions Generales de Vente (CGV) regissent les ventes de produits et services proposes sur le site contedia.fr.
          </PageIntro>
        </PageHeader>

        <Section>
          <CGVContent>
            <h3>1. Objet</h3>
            <p>
              Les presentes CGV definissent les droits et obligations des parties dans le cadre de la vente de produits numeriques (contes personnalises) et de services d'abonnement (Club) proposes par PAUSIA via le site contedia.fr (ci-apres &laquo; le Site &raquo;).
            </p>
            <p>
              Toute commande implique l'acceptation sans reserve des presentes CGV par le client.
            </p>

            <h3>2. Identite du vendeur</h3>
            <p>
              <strong>Denomination :</strong> PAUSIA<br/>
              <strong>Forme juridique :</strong> Entrepreneur individuel<br/>
              <strong>SIRET :</strong> 99282930900010<br/>
              <strong>Code APE :</strong> 6202A<br/>
              <strong>TVA :</strong> TVA non applicable, article 293 B du Code general des impots<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Telephone :</strong> +33 7 80 77 71 10
            </p>

            <h3>3. Produits et services</h3>
            <p>PAUSIA propose les produits et services suivants :</p>
            <ul>
              <li><strong>Conte personnalise (achat unitaire) :</strong> creation d'un livre numerique personnalise au format PDF, genere par intelligence artificielle a partir des informations fournies par le client (prenom, age, theme, style d'illustration, etc.)</li>
              <li><strong>Abonnement Club :</strong> abonnement mensuel donnant acces a des avantages (reduction sur les contes, contes offerts, acces prioritaire aux nouvelles fonctionnalites)</li>
            </ul>
            <p>
              Les caracteristiques essentielles des produits sont presentees sur le Site avant la commande. Les illustrations et descriptions sont aussi fideles que possible, mais de legeres variations sont possibles du fait de la generation par intelligence artificielle.
            </p>

            <h3>4. Prix</h3>
            <p>
              Les prix sont indiques en euros TTC. TVA non applicable conformement a l'article 293 B du CGI.
            </p>
            <p>
              PAUSIA se reserve le droit de modifier ses prix a tout moment. Les produits sont factures au prix en vigueur au moment de la validation de la commande.
            </p>

            <h3>5. Commande</h3>
            <p>Le processus de commande comprend les etapes suivantes :</p>
            <ul>
              <li>Personnalisation du conte (choix du theme, du style, saisie des informations du personnage)</li>
              <li>Upload optionnel de photos</li>
              <li>Recapitulatif de la commande</li>
              <li>Paiement securise via Stripe</li>
              <li>Confirmation par email</li>
            </ul>
            <p>
              La commande est consideree comme definitive apres le paiement. Un email de confirmation est envoye a l'adresse fournie. Le conte est genere automatiquement et mis a disposition dans l'espace client du Site.
            </p>

            <h3>6. Paiement</h3>
            <p>
              Le paiement s'effectue en ligne par carte bancaire via la plateforme securisee <strong>Stripe</strong> (certifiee PCI DSS niveau 1). PAUSIA ne stocke jamais les donnees de carte bancaire du client.
            </p>
            <p>
              Le paiement est debite immediatement a la validation de la commande. Pour l'abonnement Club, le paiement est preleve mensuellement a date anniversaire.
            </p>

            <h3>7. Livraison</h3>
            <p>
              Les contes personnalises sont des <strong>produits numeriques</strong> (fichiers PDF). Ils sont mis a disposition du client dans son espace personnel sur le Site, accessible apres connexion.
            </p>
            <p>
              Le delai de generation est generalement de quelques minutes a quelques heures apres le paiement. Un email de notification est envoye lorsque le conte est pret.
            </p>
            <p>
              Aucune livraison physique n'est effectuee.
            </p>

            <h3>8. Droit de retractation</h3>
            <div className="important">
              <strong>Information importante :</strong> Conformement a l'article L. 221-28 13&deg; du Code de la consommation, le droit de retractation ne peut etre exerce pour la fourniture de contenu numerique non fourni sur un support materiel dont l'execution a commence apres accord prealable expres du consommateur et renoncement expres a son droit de retractation.
            </div>
            <p>
              En validant sa commande, le client reconnait expressement :
            </p>
            <ul>
              <li>Que la generation du conte (contenu numerique) commence immediatement apres le paiement</li>
              <li>Qu'il renonce expressement a son droit de retractation de 14 jours</li>
            </ul>
            <p>
              Cette renonciation est confirmee lors du processus de commande et dans l'email de confirmation.
            </p>

            <h3>9. Abonnement Club</h3>
            <p>
              L'abonnement Club est un contrat a duree indeterminee avec paiement mensuel.
            </p>
            <ul>
              <li><strong>Souscription :</strong> le premier paiement est effectue lors de l'inscription</li>
              <li><strong>Renouvellement :</strong> l'abonnement se renouvelle automatiquement chaque mois</li>
              <li><strong>Resiliation :</strong> le client peut resilier a tout moment depuis son espace client ou par email a contact@contedia.fr. La resiliation prend effet a la fin de la periode en cours. Aucun remboursement au prorata n'est effectue pour la periode en cours</li>
              <li><strong>Modification de prix :</strong> en cas de changement de tarif, le client est prevenu par email au moins 30 jours avant l'application du nouveau prix. Il peut resilier avant la prise d'effet</li>
            </ul>

            <h3>10. Garantie et conformite</h3>
            <p>
              Conformement aux articles L. 217-3 et suivants du Code de la consommation, PAUSIA est tenu de la garantie legale de conformite pour les contenus et services numeriques.
            </p>
            <p>
              En cas de defaut de conformite constate (conte non genere, erreur manifeste dans le contenu, fichier corrompu), le client peut obtenir la mise en conformite du produit (regeneration du conte) sans frais.
            </p>
            <p>
              Le client dispose d'un delai de 2 ans a compter de la fourniture du contenu numerique pour agir au titre de la garantie legale de conformite.
            </p>

            <h3>11. Responsabilite</h3>
            <p>
              PAUSIA s'engage a mettre en oeuvre tous les moyens necessaires pour assurer la qualite du service. La responsabilite de PAUSIA est limitee au montant de la commande concernee.
            </p>
            <p>
              PAUSIA ne saurait etre tenu responsable :
            </p>
            <ul>
              <li>Des variations inherentes a la generation par intelligence artificielle</li>
              <li>De l'inexactitude des informations fournies par le client</li>
              <li>D'une interruption temporaire du service pour maintenance</li>
              <li>De tout dommage resultant d'une utilisation non conforme du produit</li>
            </ul>

            <h3>12. Propriete intellectuelle</h3>
            <p>
              Les contes generes restent la propriete intellectuelle de PAUSIA. Le client beneficie d'une <strong>licence d'utilisation personnelle et non commerciale</strong> pour les contes qu'il a commandes. Cette licence est perpetuelle, mondiale et non transmissible.
            </p>
            <p>
              Il est interdit de revendre, redistribuer ou exploiter commercialement les contes sans autorisation ecrite prealable de PAUSIA.
            </p>

            <h3>13. Donnees personnelles</h3>
            <p>
              Les donnees personnelles collectees dans le cadre des commandes sont traitees conformement a notre <a href="/politique-confidentialite">Politique de confidentialite</a>.
            </p>

            <h3>14. Service client</h3>
            <p>
              Pour toute reclamation ou question :<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Telephone :</strong> +33 7 80 77 71 10<br/>
              <strong>Delai de reponse :</strong> nous nous engageons a repondre sous 48 heures ouvrees.
            </p>

            <h3>15. Mediation</h3>
            <p>
              Conformement aux articles L. 611-1 et suivants du Code de la consommation, en cas de litige non resolu apres reclamation aupres du service client, le consommateur peut recourir gratuitement a un mediateur de la consommation :
            </p>
            <p>
              <strong>MEDICYS</strong><br/>
              73 Boulevard de Clichy<br/>
              75009 Paris<br/>
              Site web : <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer">www.medicys.fr</a>
            </p>
            <p>
              Le consommateur peut egalement utiliser la plateforme europeenne de reglement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
            </p>

            <h3>16. Droit applicable</h3>
            <p>
              Les presentes CGV sont soumises au droit francais. En cas de litige, et apres echec de la mediation, les tribunaux francais seront seuls competents.
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <em>Derniere mise a jour : mars 2026</em>
            </p>
          </CGVContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { CGVPage };
