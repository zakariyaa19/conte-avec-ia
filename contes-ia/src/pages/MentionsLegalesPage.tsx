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

const LegalContent = styled.div`
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
`;

const MentionsLegalesPage: React.FC = () => {
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
          <PageTitle>Mentions Legales</PageTitle>
          <PageIntro>
            Informations legales concernant le site contedia.fr, conformement a l'article 6 de la loi n&deg; 2004-575 du 21 juin 2004 pour la confiance dans l'economie numerique (LCEN).
          </PageIntro>
        </PageHeader>

        <Section>
          <LegalContent>
            <h3>1. Editeur du site</h3>
            <p>
              Le site <strong>contedia.fr</strong> (ci-apres &laquo; le Site &raquo;) est edite par :<br/>
              <strong>Denomination :</strong> PAUSIA<br/>
              <strong>Forme juridique :</strong> Entrepreneur individuel<br/>
              <strong>Numero SIRET :</strong> 99282930900010<br/>
              <strong>Code APE :</strong> 6202A - Conseil en systemes et logiciels informatiques<br/>
              <strong>TVA :</strong> TVA non applicable, article 293 B du Code general des impots<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Telephone :</strong> +33 7 80 77 71 10
            </p>

            <h3>2. Directeur de la publication</h3>
            <p>
              Le directeur de la publication est le representant legal de PAUSIA, en sa qualite d'entrepreneur individuel.<br/>
              <strong>Email :</strong> contact@contedia.fr
            </p>

            <h3>3. Hebergement</h3>
            <p>
              Le Site est heberge par :<br/><br/>
              <strong>Frontend :</strong><br/>
              Vercel Inc.<br/>
              440 N Barranca Ave #4133, Covina, CA 91723, Etats-Unis<br/>
              Site web : vercel.com<br/><br/>
              <strong>Backend / API :</strong><br/>
              Render Services, Inc.<br/>
              525 Brannan St, Suite 300, San Francisco, CA 94107, Etats-Unis<br/>
              Site web : render.com
            </p>

            <h3>4. Activite</h3>
            <p>
              Contedia est un service en ligne de creation de livres numeriques personnalises pour enfants, generes a l'aide de l'intelligence artificielle. Le service propose la creation de contes personnalises (produit numerique) et un abonnement mensuel (Club).
            </p>

            <h3>5. Propriete intellectuelle</h3>
            <p>
              L'ensemble des elements du Site (textes, images, illustrations, logo, structure, code source) est protege par le droit d'auteur et la legislation francaise et internationale sur la propriete intellectuelle.
            </p>
            <p>
              Toute reproduction, representation, modification, publication ou adaptation de tout ou partie des elements du Site est interdite sans l'autorisation ecrite prealable de PAUSIA.
            </p>
            <p>
              Les contes generes pour les clients restent la propriete de PAUSIA. Le client beneficie d'une licence d'utilisation personnelle et non commerciale pour les contes qu'il a commandes.
            </p>

            <h3>6. Responsabilite</h3>
            <p>
              PAUSIA s'efforce d'assurer l'exactitude des informations diffusees sur le Site, mais ne saurait etre tenu responsable des omissions, inexactitudes ou carences dans la mise a jour.
            </p>
            <p>
              PAUSIA ne saurait etre tenu responsable des dommages directs ou indirects causes au materiel de l'utilisateur lors de l'acces au Site, resultant soit de l'utilisation d'un materiel ne repondant pas aux specifications, soit de l'apparition d'un bug ou d'une incompatibilite.
            </p>

            <h3>7. Liens hypertextes</h3>
            <p>
              Le Site peut contenir des liens vers d'autres sites. PAUSIA n'exerce aucun controle sur ces sites et decline toute responsabilite quant a leur contenu.
            </p>

            <h3>8. Donnees personnelles</h3>
            <p>
              Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes du 6 janvier 1978 modifiee, vous disposez de droits sur vos donnees personnelles. Pour en savoir plus, consultez notre <a href="/politique-confidentialite" style={{ color: '#E17055' }}>Politique de confidentialite</a>.
            </p>
            <p>
              Pour exercer vos droits, contactez-nous a : <strong>contact@contedia.fr</strong>
            </p>

            <h3>9. Cookies</h3>
            <p>
              Le Site utilise des cookies necessaires a son fonctionnement (authentification, session) ainsi que des cookies analytiques (Vercel Analytics). Vous pouvez configurer votre navigateur pour refuser les cookies non essentiels.
            </p>

            <h3>10. Droit applicable et juridiction competente</h3>
            <p>
              Les presentes mentions legales sont soumises au droit francais. En cas de litige, et apres tentative de resolution amiable, les tribunaux francais seront seuls competents.
            </p>
            <p>
              Conformement a l'article L. 612-1 du Code de la consommation, le consommateur peut recourir gratuitement au service de mediation MEDICYS, 73 Boulevard de Clichy, 75009 Paris, <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#E17055' }}>www.medicys.fr</a>.
            </p>

            <h3>11. Contact</h3>
            <p>
              Pour toute question concernant ces mentions legales :<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Telephone :</strong> +33 7 80 77 71 10
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <em>Derniere mise a jour : mars 2026</em>
            </p>
          </LegalContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { MentionsLegalesPage };
