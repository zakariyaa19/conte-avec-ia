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
          <PageTitle>Mentions Légales</PageTitle>
          <PageIntro>
            Informations légales concernant le site contedia.fr, conformément à l'article 6 de la loi n&deg; 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
          </PageIntro>
        </PageHeader>

        <Section>
          <LegalContent>
            <h3>1. Éditeur du site</h3>
            <p>
              Le site <strong>contedia.fr</strong> (ci-après « le Site ») est édité par :<br/>
              <strong>Dénomination :</strong> PAUSIA<br/>
              <strong>Forme juridique :</strong> Entrepreneur individuel<br/>
              <strong>Numéro SIRET :</strong> 99282930900010<br/>
              <strong>Code APE :</strong> 6202A - Conseil en systèmes et logiciels informatiques<br/>
              <strong>TVA :</strong> TVA non applicable, article 293 B du Code général des impôts<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Téléphone :</strong> +33 7 80 77 71 10
            </p>

            <h3>2. Directeur de la publication</h3>
            <p>
              Le directeur de la publication est le représentant légal de PAUSIA, en sa qualité d'entrepreneur individuel.<br/>
              <strong>Email :</strong> contact@contedia.fr
            </p>

            <h3>3. Hébergement</h3>
            <p>
              Le Site est hébergé par :<br/><br/>
              <strong>Frontend :</strong><br/>
              Vercel Inc.<br/>
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br/>
              Site web : vercel.com<br/><br/>
              <strong>Backend / API :</strong><br/>
              Render Services, Inc.<br/>
              525 Brannan St, Suite 300, San Francisco, CA 94107, États-Unis<br/>
              Site web : render.com
            </p>

            <h3>4. Activité</h3>
            <p>
              Contedia est un service en ligne de création de livres numériques personnalisés pour enfants, générés à l'aide de l'intelligence artificielle. Le service propose la création de contes personnalisés (produit numérique) et un abonnement mensuel (Club).
            </p>

            <h3>5. Propriété intellectuelle</h3>
            <p>
              L'ensemble des éléments du Site (textes, images, illustrations, logo, structure, code source) est protégé par le droit d'auteur et la législation française et internationale sur la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du Site est interdite sans l'autorisation écrite préalable de PAUSIA.
            </p>
            <p>
              Les contes générés pour les clients restent la propriété de PAUSIA. Le client bénéficie d'une licence d'utilisation personnelle et non commerciale pour les contes qu'il a commandés.
            </p>

            <h3>6. Responsabilité</h3>
            <p>
              PAUSIA s'efforce d'assurer l'exactitude des informations diffusées sur le Site, mais ne saurait être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour.
            </p>
            <p>
              PAUSIA ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au Site, résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications, soit de l'apparition d'un bug ou d'une incompatibilité.
            </p>

            <h3>7. Liens hypertextes</h3>
            <p>
              Le Site peut contenir des liens vers d'autres sites. PAUSIA n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>

            <h3>8. Données personnelles</h3>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez de droits sur vos données personnelles. Pour en savoir plus, consultez notre <a href="/politique-confidentialite" style={{ color: '#E17055' }}>Politique de confidentialité</a>.
            </p>
            <p>
              Pour exercer vos droits, contactez-nous à : <strong>contact@contedia.fr</strong>
            </p>

            <h3>9. Cookies</h3>
            <p>
              Le Site utilise des cookies nécessaires à son fonctionnement (authentification, session) ainsi que des cookies analytiques (Vercel Analytics). Vous pouvez configurer votre navigateur pour refuser les cookies non essentiels.
            </p>

            <h3>10. Droit applicable et juridiction compétente</h3>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
            </p>
            <p>
              Conformément à l'article L. 612-1 du Code de la consommation, le consommateur peut recourir gratuitement au service de médiation MEDICYS, 73 Boulevard de Clichy, 75009 Paris, <a href="https://www.medicys.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#E17055' }}>www.medicys.fr</a>.
            </p>

            <h3>11. Contact</h3>
            <p>
              Pour toute question concernant ces mentions légales :<br/>
              <strong>Email :</strong> contact@contedia.fr<br/>
              <strong>Téléphone :</strong> +33 7 80 77 71 10
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <em>Dernière mise à jour : mars 2026</em>
            </p>
          </LegalContent>
        </Section>
      </Container>
    </PageLayout>
  );
};

export { MentionsLegalesPage };
