/** Seed job listings with scrapeTimestamp per AGENTS.md schema. */
/** postedDate = real calendar date (days ago) so info panel shows varied announcement dates. */

const now = new Date().toISOString();
const daysAgo = (d) => {
  const d2 = new Date();
  d2.setDate(d2.getDate() - d);
  return d2.toISOString();
};

export const seedJobs = () => [
  { id: 'job-land-01', sourceId: 'annonces-nc', category: 'Gardening & Landscaping', title: 'Paysagiste Confirmé', company: 'NC Garden Design', location: 'Nouméa - Magenta', contractType: 'CDI', postedDate: daysAgo(1), description: 'Creation and maintenance of tropical gardens. Expertise in irrigation systems and local plant species required.', requirements: ['Experience in tropical landscaping', 'Knowledge of irrigation', 'Permit B'], contactPhone: '+687 23.45.67', url: 'https://www.annonces.nc/services/land-01', status: 'new', scrapeTimestamp: now },
  { id: 'job-land-02', sourceId: 'fb-workplace', category: 'Gardening & Landscaping', title: 'Entretien de jardin - Urgent', company: 'FB Group: Entraide NC', location: 'Dumbéa sur mer', contractType: 'Mission', postedDate: daysAgo(3), description: 'Looking for someone to mow the lawn and trim hedges. Large property, equipment provided.', requirements: ['Reliable', 'Available this weekend'], contactEmail: 'messenger@facebook.com', contactPhone: '+687 77.88.99', url: 'https://workplace.com/groups/entraide/posts/land-02', status: 'new', scrapeTimestamp: now },
  { id: 'job-land-03', sourceId: 'job-nc', category: 'Gardening & Landscaping', title: 'Ouvrier Espaces Verts', company: 'Cidex NC', location: 'Païta', contractType: 'CDD', postedDate: daysAgo(5), description: 'Maintenance of public spaces and roadside vegetation. Brushcutting and pruning.', requirements: ['Manual dexterity', 'Safety conscious'], contactPhone: '+687 35.10.20', url: 'https://www.job.nc/offres/land-03', status: 'new', scrapeTimestamp: now },
  { id: 'job-const-01', sourceId: 'indeed', category: 'Construction & BTP', title: 'Maçon Coffreur', company: 'Arbe NC', location: 'Nouméa - Ducos', contractType: 'CDI', postedDate: daysAgo(2), description: 'Working on a large residential complex. Concrete pouring and formwork.', requirements: ['3 years experience', 'Precision', 'Team player'], contactPhone: '+687 28.12.34', url: 'https://www.indeed.com/nc/const-01', status: 'new', scrapeTimestamp: now },
  { id: 'job-const-02', sourceId: 'manpower', category: 'Construction & BTP', title: "Conducteur d'Engins de Terrassement", company: 'Vinci Construction', location: 'Mont-Dore', contractType: 'CDD', postedDate: daysAgo(7), description: 'Operating excavators for new road construction projects.', requirements: ['CACES R482', '5 years experience'], contactPhone: '+687 43.55.66', url: 'https://nc.manpower.fr/const-02', status: 'new', scrapeTimestamp: now },
  { id: 'job-const-03', sourceId: 'job-nc', category: 'Construction & BTP', title: 'Chef de Chantier Second Œuvre', company: 'Socat NC', location: 'Koné', contractType: 'CDI', postedDate: daysAgo(10), description: 'Managing interior finishing works (plastering, painting, tiling) for public buildings in the North.', requirements: ['Leadership skills', 'Reporting', 'Site safety management'], contactPhone: '+687 47.99.00', url: 'https://www.job.nc/offres/const-03', status: 'new', scrapeTimestamp: now },
  { id: 'job-mine-01', sourceId: 'emploi-nc', category: 'Mining & Industry', title: 'Technicien de Maintenance Industrielle', company: 'SLN - Société Le Nickel', location: 'Doniambo', contractType: 'CDI', postedDate: daysAgo(4), description: 'Preventive and curative maintenance on nickel processing furnaces.', requirements: ['Electrotechnical background', 'Night shifts', 'Rigorous'], contactPhone: '+687 27.31.11', url: 'https://emploi.gouv.nc/mine-01', status: 'new', scrapeTimestamp: now },
  { id: 'job-mine-02', sourceId: 'job-nc', category: 'Mining & Industry', title: 'Géologue de Mine', company: 'Koniambo Nickel SAS', location: 'Voh', contractType: 'CDD (18 months)', postedDate: daysAgo(14), description: 'Ore control and geological mapping on the mining massif.', requirements: ['Master in Geology', 'Field experience', 'Driver license'], contactPhone: '+687 42.00.01', url: 'https://www.job.nc/offres/mine-02', status: 'new', scrapeTimestamp: now },
  { id: 'job-mine-03', sourceId: 'manpower', category: 'Mining & Industry', title: 'Opérateur de Sondeuse', company: 'Goro Nickel (Prony Resources)', location: 'Yaté', contractType: 'CDI', postedDate: daysAgo(6), description: 'Operating core drilling rigs for exploration.', requirements: ['Drilling experience', 'Endurance', 'Camp living'], contactPhone: '+687 25.00.25', url: 'https://nc.manpower.fr/mine-03', status: 'new', scrapeTimestamp: now },
  { id: 'job-pub-01', sourceId: 'emploi-nc', category: 'Public Sector', title: 'Adjoint Administratif', company: 'Mairie de Nouméa', location: 'Nouméa Centre', contractType: 'Permanent', postedDate: daysAgo(0), description: 'Processing civil status records and general administrative tasks.', requirements: ['Administration degree', 'Discretion', 'Bilingual preferred'], contactPhone: '+687 27.31.15', url: 'https://emploi.gouv.nc/pub-01', status: 'new', scrapeTimestamp: now },
  { id: 'job-pub-02', sourceId: 'emploi-nc', category: 'Public Sector', title: "Chargé d'Etudes Environnement", company: 'Province Sud', location: 'Nouméa', contractType: 'CDD', postedDate: daysAgo(9), description: 'Environmental impact assessment for coastal development projects.', requirements: ['Environment degree', 'Knowledge of local law'], contactPhone: '+687 20.30.40', url: 'https://emploi.gouv.nc/pub-02', status: 'new', scrapeTimestamp: now },
  { id: 'job-hosp-01', sourceId: 'job-nc', category: 'Hospitality & Tourism', title: 'Réceptionniste Bilingue', company: 'Château Royal Beach Resort', location: 'Anse Vata', contractType: 'CDI', postedDate: daysAgo(2), description: 'Welcoming international guests, managing bookings and concierge services.', requirements: ['Fluent English & French', 'Customer service oriented'], contactPhone: '+687 26.12.00', url: 'https://www.job.nc/offres/hosp-01', status: 'new', scrapeTimestamp: now },
  { id: 'job-hosp-02', sourceId: 'annonces-nc', category: 'Hospitality & Tourism', title: 'Chef de Partie (Cuisine)', company: 'Le Roof', location: 'Nouméa', contractType: 'CDI', postedDate: daysAgo(11), description: 'In charge of the fish and seafood section. Creative and high-end restaurant.', requirements: ['Culinary degree', 'Passion for local products'], contactPhone: '+687 25.00.50', url: 'https://www.annonces.nc/services/hosp-02', status: 'new', scrapeTimestamp: now },
  { id: 'job-trans-01', sourceId: 'manpower', category: 'Transport & Logistics', title: 'Chauffeur Poids Lourd', company: 'Sodexo NC', location: 'Païta', contractType: 'CDI', postedDate: daysAgo(8), description: 'Daily delivery of prepared meals to schools and companies across the territory.', requirements: ['Permit C', 'FIMO', 'Punctuality'], contactPhone: '+687 24.33.22', url: 'https://nc.manpower.fr/trans-01', status: 'new', scrapeTimestamp: now },
  { id: 'job-trans-02', sourceId: 'job-nc', category: 'Transport & Logistics', title: "Agent d'Escale", company: 'Aircalin', location: 'Tontouta', contractType: 'CDD (Vacations)', postedDate: daysAgo(12), description: 'Passenger check-in and boarding at Tontouta International Airport.', requirements: ['Good presentation', 'English required', 'Shift work'], contactPhone: '+687 35.11.22', url: 'https://www.job.nc/offres/trans-02', status: 'new', scrapeTimestamp: now },
  { id: 'job-health-01', sourceId: 'pole-emploi', category: 'Healthcare', title: "Infirmier Diplômé d'Etat", company: 'CHT Gaston-Bourret', location: 'Nouméa - Dumbéa', contractType: 'CDD', postedDate: daysAgo(3), description: 'Nursing duties in the Emergency department. Dynamic team.', requirements: ['State Nursing Diploma', 'Experience in ER'], contactPhone: '+687 20.80.00', url: 'https://www.pole-emploi.fr/nc/health-01', status: 'new', scrapeTimestamp: now },
  { id: 'fb-4', sourceId: 'fb-workplace', category: 'Domestic Services', title: 'Femme de ménage - 4h par semaine', company: 'Private Individual', location: 'Mont-Dore', contractType: 'Part-time', postedDate: daysAgo(1), description: 'Ironing and cleaning for a small family home.', requirements: ['Trustworthy', 'Local references'], contactEmail: 'messenger@facebook.com', contactPhone: '+687 99.88.77', url: 'https://workplace.com/posts/fb-4', status: 'new', scrapeTimestamp: now },
  { id: 'fb-5', sourceId: 'fb-workplace', category: 'Technical', title: 'Cherche mécanicien auto à domicile', company: 'FB Group: Auto NC', location: 'Nouméa - Ducos', contractType: 'Mission', postedDate: daysAgo(5), description: 'Need help to change brake pads on a Hilux. Have the parts, need to tools/expertise.', requirements: ['Auto mechanic knowledge'], contactEmail: 'messenger@facebook.com', contactPhone: '+687 77.00.11', url: 'https://workplace.com/posts/fb-5', status: 'new', scrapeTimestamp: now },
];

/** Default identity content sourced from identity/identity.md */
export const defaultIdentity = () => ({
  fullName: '',
  email: '',
  phone: '',
  language: 'en',
  resumeText: `Dependable professional with proven track record across New Caledonia's labour and service sectors. Hands-on experience spanning:

- Grounds & green spaces — gardening, landscaping, maintenance
- Construction & renovation — demolition, concreting, renovation works
- Industrial — factory operations and production environments

Adaptable worker, ready to contribute across trades and on-site roles.`,
  skills: ['gardening', 'landscaping', 'maintenance', 'demolition', 'concreting', 'renovation works', 'factory operations', 'production'],
  certifications: [],
  experienceSummary: "Dependable professional with proven track record across New Caledonia's labour and service sectors. Adaptable worker, ready to contribute across trades and on-site roles.",
  preferredLocations: ['Nouméa', 'Dumbéa', 'Païta'],
  preferredCommunes: [],
  preferredJobTypes: ['CDI', 'CDD', 'Short Term'],
  meansOfTransport: '',
  customSources: [],
  openClawApiKey: '',
});
