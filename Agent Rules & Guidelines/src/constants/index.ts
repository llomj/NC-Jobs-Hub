import { JobSource, Language, CustomSource } from '../types';

/** Default custom sources (see custom_source.md). New users can delete any. */
export const DEFAULT_CUSTOM_SOURCES: CustomSource[] = [
  { type: 'website', url: 'https://emploi.gouv.nc' },
  { type: 'website', url: 'https://www.nouvelle-caledonie.gouv.fr/Publications/Recrutement' },
  { type: 'website', url: 'https://www.noumea.nc/noumea-pratique/mes-demarches/candidater-job-ete' },
  { type: 'website', url: 'https://www.job.nc' },
  { type: 'website', url: 'https://www.lemploi.nc' },
  { type: 'website', url: 'https://annonces.nc/embauche' },
  { type: 'website', url: 'https://www.jobijoba.com/fr/emploi/lieu/Nouvelle-caledonie' },
  { type: 'website', url: 'https://fr.indeed.com/l-nouvelle-cal%C3%A9donie-emplois.html' },
  { type: 'website', url: 'https://candidat.francetravail.fr/offres/recherche?lieux=988D' },
  { type: 'website', url: 'https://www.hellowork.com/fr-fr/emploi/departement_nouvelle-caledonie-988.html' },
  { type: 'website', url: 'https://fr.linkedin.com/jobs/emplois-dans-noum%C3%A9a' },
  { type: 'website', url: 'https://www.aboro.nc/offres-demploi' },
  { type: 'website', url: 'https://manpower.nc/' },
  { type: 'website', url: 'https://www.facebook.com/groups/258684861704541' },
  { type: 'website', url: 'https://www.facebook.com/groups/628046117849854' },
  { type: 'website', url: 'https://www.facebook.com/groups/391213758343789' },
  { type: 'website', url: 'https://www.facebook.com/jobs' },
  { type: 'facebook_workplace', url: 'https://www.facebook.com/workplace' }
];

/** Scrapable source types for Custom Sources. Extend when adding new platforms. */
export interface ScrapableSourceType {
  id: string;
  labelEn: string;
  labelFr: string;
}

export const SCRAPABLE_SOURCE_TYPES: ScrapableSourceType[] = [
  { id: 'website', labelEn: 'Website', labelFr: 'Site web' },
  { id: 'facebook_workplace', labelEn: 'Facebook Workplace', labelFr: 'Facebook Workplace' }
];

export const COLORS = {
  primary: '#fbbf24', // yellow-400
  bg: '#000000',
  card: '#111111',
  text: '#ffffff',
  muted: '#9ca3af'
};

export const COMMUNES = [
  'Nouméa',
  'Dumbéa',
  'Mont-Dore',
  'Païta',
  'Boulouparis',
  'La Foa',
  'Bourail',
  'Koné',
  'Voh',
  'Koumac',
  'Poindimié',
  'Canala',
  'Lifou',
  'Maré',
  'Ouvéa'
];

/** Primary Facebook group ID for Social Feed. */
export const SOCIAL_FEED_FACEBOOK_GROUP_ID = '258684861704541';

/** Primary Facebook group URL for Social Feed: view job announcements and join group. */
export const SOCIAL_FEED_FACEBOOK_GROUP_URL = `https://www.facebook.com/groups/${SOCIAL_FEED_FACEBOOK_GROUP_ID}`;

/** fb:// URL scheme to open group in Facebook app (falls back to web if app not installed). */
export const SOCIAL_FEED_FACEBOOK_APP_URL = `fb://group/${SOCIAL_FEED_FACEBOOK_GROUP_ID}/`;

export const SOURCES: JobSource[] = [
  { id: 'emploi-nc', name: 'Emploi.gouv.nc', url: 'https://emploi.gouv.nc', enabled: true },
  { id: 'job-nc', name: 'Job.nc', url: 'https://www.job.nc', enabled: true },
  { id: 'annonces-nc', name: 'Annonces.nc (Services)', url: 'https://www.annonces.nc', enabled: true },
  { id: 'pole-emploi', name: 'Pôle Emploi (NC)', url: 'https://www.pole-emploi.fr', enabled: true },
  { id: 'manpower', name: 'Manpower NC', url: 'https://nc.manpower.fr', enabled: true },
  { id: 'indeed', name: 'Indeed (Nouméa)', url: 'https://www.indeed.com', enabled: false },
  { id: 'fb-workplace', name: 'Facebook Workplace', url: 'https://workplace.com', enabled: true }
];

export const UI_LABELS = {
  [Language.EN]: {
    dashboard: 'Dashboard',
    identity: 'Identity',
    saved: 'Saved',
    logs: 'Tracking Logs',
    settings: 'Settings',
    search: 'Search jobs...',
    filterSources: 'Sources',
    filterLocations: 'Locations',
    contractTypes: 'Contract Types',
    apply: 'Apply Now',
    save: 'Save Job',
    relevance: 'Relevance',
    status: 'Status',
    newJobs: 'New Jobs',
    matchingLabel: 'Match Score',
    emailCompose: 'Draft Application',
    sendEmail: 'Send Email',
    identityTitle: 'My Identity',
    resumeSection: 'Resume & Skills',
    openClawStatus: 'OpenClaw Connection',
    telegramSync: 'Telegram Bot Sync',
    active: 'Active',
    lastSync: 'Last Sync',
    mobilitySettings: 'Location & Mobility',
    customSources: 'Custom Sources',
    addLink: 'Add Scraper Link',
    linkPlaceholder: 'https://example.nc/careers',
    sourceTypeLabel: 'Source type',
    deleteSourceConfirmTitle: 'Remove this source?',
    deleteSourceConfirmMessage: 'This source will no longer be used to fetch jobs. You can add it again later.',
    cancel: 'Cancel',
    confirmDelete: 'Remove',
    openClawApiKeyLabel: 'OpenClaw / Scraper API key',
    openClawApiKeyHint: 'Used by your Telegram bot to authenticate or call scraping services.',
    openClawApiKeyPlaceholder: 'Enter API key',
    socialFeedOpenFacebook: 'View job announcements on Facebook',
    socialFeedJoinGroup: 'Not in the group? Join the group',
    socialFeedCardDesc: 'View job announcements and join the community group.'
  },
  [Language.FR]: {
    dashboard: 'Tableau de bord',
    identity: 'Identité',
    saved: 'Enregistrés',
    logs: 'Historique',
    settings: 'Paramètres',
    search: 'Rechercher...',
    filterSources: 'Sources',
    filterLocations: 'Lieux',
    contractTypes: 'Types de contrat',
    apply: 'Postuler',
    save: 'Sauvegarder',
    relevance: 'Pertinence',
    status: 'Statut',
    newJobs: 'Nouvelles Offres',
    matchingLabel: 'Score de match',
    emailCompose: 'Rédiger Candidature',
    sendEmail: 'Envoyer l\'e-mail',
    identityTitle: 'Mon Profil',
    resumeSection: 'CV & Compétences',
    openClawStatus: 'Connexion OpenClaw',
    telegramSync: 'Sync Bot Telegram',
    active: 'Actif',
    lastSync: 'Dernière Sync',
    mobilitySettings: 'Lieux & Mobilité',
    customSources: 'Sources Personnalisées',
    addLink: 'Ajouter un lien',
    linkPlaceholder: 'https://exemple.nc/carrieres',
    sourceTypeLabel: 'Type de source',
    deleteSourceConfirmTitle: 'Retirer cette source ?',
    deleteSourceConfirmMessage: 'Cette source ne sera plus utilisée pour récupérer les offres. Vous pourrez la rajouter plus tard.',
    cancel: 'Annuler',
    confirmDelete: 'Retirer',
    openClawApiKeyLabel: 'Clé API OpenClaw / Scraper',
    openClawApiKeyHint: 'Utilisée par votre bot Telegram pour s\'authentifier ou appeler des services de scraping.',
    openClawApiKeyPlaceholder: 'Saisir la clé API',
    socialFeedOpenFacebook: 'Voir les annonces d\'emploi sur Facebook',
    socialFeedJoinGroup: 'Pas encore membre ? Rejoindre le groupe',
    socialFeedCardDesc: 'Voir les annonces d\'emploi et rejoindre le groupe.'
  }
};