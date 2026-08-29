import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '55et5l4p',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function main() {
  const processes = [
    {
      _type: 'process',
      sourceType: 'official_verified',
      category: 'business',
      status: 'published',
      tags: ['registration', 'rdb'],
      translations: {
        en: { title: 'Register a Business', summary: 'Step-by-step guide to register a business in Rwanda through RDB.' },
        fr: { title: 'Enregistrer une entreprise', summary: 'Guide pour enregistrer une entreprise au Rwanda via RDB.' },
        rw: { title: "Kwiyandikisha nk'ubucuruzi", summary: 'Incamake yo kwiyandikisha ubucuruzi mu Rwanda binyuze muri RDB.' },
      },
      steps: [
        { order: 1, text: { en: 'Visit RDB website', fr: 'Visitez le site RDB', rw: 'Musura urubuga rwa RDB' }, estimatedTime: 'same day' },
        { order: 2, text: { en: 'Fill registration form', fr: 'Remplissez le formulaire', rw: 'Uzuza ifomero' }, estimatedTime: '30 minutes' },
      ],
      fees: [{ label: 'Registration fee', amountRWF: 0, conditions: 'free' }],
      officialPortal: 'https://irembo.gov.rw/',
      sourceUrl: ['https://rdb.rw/'],
      lastVerifiedDate: '2026-08-15T00:00:00.000Z',
      confidenceScore: 0.95,
    },
    {
      _type: 'process',
      sourceType: 'official_verified',
      category: 'identity',
      status: 'published',
      tags: ['national-id'],
      translations: {
        en: { title: 'Apply for a National ID', summary: 'How to apply for a Rwandan National ID through Irembo.' },
        fr: { title: "Demander une carte d'identite", summary: "Comment demander une carte d'identite via Irembo." },
        rw: { title: 'Gusaba Indangamuntu', summary: "Uko wasaba Indangamuntu y'u Rwanda binyuze muri Irembo." },
      },
      steps: [
        { order: 1, text: { en: 'Visit Irembo.gov.rw', fr: 'Visitez Irembo.gov.rw', rw: 'Musura Irembo.gov.rw' }, estimatedTime: '10 minutes' },
        { order: 2, text: { en: 'Fill the form', fr: 'Remplissez le formulaire', rw: 'Uzuza ifomero' }, estimatedTime: '15 minutes' },
      ],
      fees: [{ label: 'Application fee', amountRWF: 0, conditions: 'free' }],
      officialPortal: 'https://irembo.gov.rw/',
      sourceUrl: ['https://irembo.gov.rw/'],
      lastVerifiedDate: '2026-08-15T00:00:00.000Z',
      confidenceScore: 0.9,
    },
    {
      _type: 'process',
      sourceType: 'official_verified',
      category: 'immigration',
      status: 'published',
      tags: ['visa', 'entry'],
      translations: {
        en: { title: 'Apply for a Visa to Rwanda', summary: 'Steps to apply for a Rwandan visa online or on arrival.' },
        fr: { title: 'Demander un visa pour le Rwanda', summary: "Etapes pour demander un visa rwandais en ligne ou a l'arrivee." },
        rw: { title: 'Gusaba Viza yo mu Rwanda', summary: "Uko wasaba viza y'u Rwanda kuri interineti cyangwa igihe uje." },
      },
      steps: [
        { order: 1, text: { en: 'Check visa type', fr: 'Verifiez le type de visa', rw: 'Reba ubwoko bwa viza' }, estimatedTime: '10 minutes' },
        { order: 2, text: { en: 'Apply online or on arrival', fr: "Demandez en ligne ou a l'arrivee", rw: 'Saba kuri interineti cyangwa igihe uje' }, estimatedTime: '1 day' },
      ],
      fees: [{ label: 'Visa fee', amountRWF: 50000, conditions: 'varies by nationality' }],
      officialPortal: 'https://www.migration.gov.rw/',
      sourceUrl: ['https://www.migration.gov.rw/'],
      lastVerifiedDate: '2026-08-15T00:00:00.000Z',
      confidenceScore: 0.9,
    },
    {
      _type: 'process',
      sourceType: 'official_verified',
      category: 'health',
      status: 'published',
      tags: ['health-insurance'],
      translations: {
        en: { title: 'Enroll in Mutuelle de Sante', summary: "How to enroll in Rwanda's community health insurance." },
        fr: { title: "S'inscrire a la Mutuelle de Sante", summary: "Comment s'inscrire a l'assurance maladie communautaire du Rwanda." },
        rw: { title: 'Kwiyandikisha mu Mutuelle de Sante', summary: "Uko kwiyandikisha mu ifatanyabikorwa ry'ubuzima bw'abaturage." },
      },
      steps: [
        { order: 1, text: { en: 'Visit local health center', fr: 'Visitez le centre de sante local', rw: "Musura ikigo cy'ubuzima" }, estimatedTime: '30 minutes' },
        { order: 2, text: { en: 'Provide ID and pay contribution', fr: "Fournissez une piece d'identite et payez", rw: 'Tanga indangamuntu wishyure' }, estimatedTime: 'same day' },
      ],
      fees: [{ label: 'Contribution', amountRWF: 0, conditions: 'income-based' }],
      officialPortal: 'https://www.mutuelle.gov.rw/',
      sourceUrl: ['https://www.mutuelle.gov.rw/'],
      lastVerifiedDate: '2026-08-15T00:00:00.000Z',
      confidenceScore: 0.95,
    },
    {
      _type: 'process',
      sourceType: 'official_verified',
      category: 'business',
      status: 'published',
      tags: ['tax', 'RRA'],
      translations: {
        en: { title: 'Register for Tax with RRA', summary: 'Steps to register for a TIN and tax obligations in Rwanda.' },
        fr: { title: "S'inscrire aux impots avec RRA", summary: 'Etapes pour obtenir un TIN et les obligations fiscales au Rwanda.' },
        rw: { title: 'Kwiyandikisha mu Korohereza Imisoro', summary: 'Uko kwiyandikisha ku misoro no guhabwa TIN.' },
      },
      steps: [
        { order: 1, text: { en: 'Prepare business documents', fr: 'Preparez les documents', rw: 'Tegura inyandiko' }, estimatedTime: '1 day' },
        { order: 2, text: { en: 'Apply at RRA office', fr: "Deposez a l'office RRA", rw: 'Saba ku biro bya RRA' }, estimatedTime: 'same day' },
      ],
      fees: [{ label: 'Registration fee', amountRWF: 0, conditions: 'free' }],
      officialPortal: 'https://www.rra.gov.rw/',
      sourceUrl: ['https://www.rra.gov.rw/'],
      lastVerifiedDate: '2026-08-15T00:00:00.000Z',
      confidenceScore: 0.9,
    },
  ]

  const guides = [
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'transport',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['flights'],
      translations: {
        en: { title: 'How to Book a Flight to Rwanda', summary: 'Tips for booking your first flight to Kigali.' },
        fr: { title: 'Comment reserver un vol vers le Rwanda', summary: 'Conseils pour reserver votre vol vers Kigali.' },
        rw: { title: "Uko kugura Ibigezanyeho Igihe uje mu Rwanda", summary: "Inama zo kugura igice cy'indege ugiyo mu Rwanda." },
      },
      steps: [
        { order: 1, text: { en: 'Compare prices on Google Flights', fr: 'Comparez les prix', rw: 'Gereranya ibiciro' } },
        { order: 2, text: { en: 'Book with RwandAir', fr: 'Reservez avec RwandAir', rw: 'Gura kuri RwandAir' } },
      ],
      typicalCosts: [{ label: 'Flight range', rangeRWF: [150000, 800000] }],
      commonPitfalls: ['Check visa requirements', 'Passport must be valid 6 months'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'housing',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['land'],
      translations: {
        en: { title: 'How to Buy a Land Plot in Rwanda', summary: 'Step-by-step guide to purchasing land safely.' },
        fr: { title: 'Comment acheter une parcelle', summary: 'Guide pour acheter un terrain en toute securite.' },
        rw: { title: 'Uko wagura ubutaka mu Rwanda', summary: 'Incamake zo kugura ubutaka mu mutekano.' },
      },
      steps: [
        { order: 1, text: { en: 'Confirm plot status via land registry', fr: 'Confirmez le statut', rw: 'Hindura ukumenya ubutaka' } },
        { order: 2, text: { en: 'Hire a licensed surveyor', fr: 'Engagez un arpenteur', rw: 'Koresha umupima' } },
      ],
      typicalCosts: [{ label: 'Surveyor fee', rangeRWF: [50000, 150000] }],
      commonPitfalls: ['Confirm ownership', 'Use licensed surveyor'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'transport',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['bus', 'city-transport'],
      translations: {
        en: { title: 'Getting Around Kigali by Bus', summary: "How to use Kigali's bus system and tap cards." },
        fr: { title: 'Se deplacer a Kigali en bus', summary: 'Comment utiliser le systeme de bus et les cartes tap.' },
        rw: { title: "Uko ugenda mu Kigali ku bisi", summary: "Uko koresha sisitemu ya bisi n'ikarita ya tap." },
      },
      steps: [
        { order: 1, text: { en: 'Buy a Tap Card', fr: 'Achetez une carte Tap', rw: 'Gura ikarita ya Tap' } },
        { order: 2, text: { en: 'Board at designated stops', fr: 'Montez aux arrets prevus', rw: 'Inyura mu mfasi zemejwe' } },
      ],
      typicalCosts: [{ label: 'Bus fare', rangeRWF: [200, 500] }],
      commonPitfalls: ['Keep your Tap Card topped up', 'Validate on boarding'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'housing',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['renting'],
      translations: {
        en: { title: 'Renting an Apartment in Rwanda', summary: 'What to know before renting in Kigali or other cities.' },
        fr: { title: 'Louer un appartement au Rwanda', summary: "Ce qu'il faut savoir avant de louer a Kigali ou ailleurs." },
        rw: { title: 'Gukodesha Izu mu Rwanda', summary: 'Ibyo ukwiye kumenya mbere yo gukodesha mu Kigali cyangwa ahandi.' },
      },
      steps: [
        { order: 1, text: { en: 'Check rental prices by area', fr: 'Verifiez les prix par zone', rw: 'Reba ibiciro byo gukodesha' } },
        { order: 2, text: { en: 'Sign a written contract', fr: 'Signez un contrat ecrit', rw: 'Andika amasezerano' } },
      ],
      typicalCosts: [{ label: 'Monthly rent range', rangeRWF: [80000, 500000] }],
      commonPitfalls: ['Ask for a written contract', 'Check water/electricity access'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'health',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['clinics'],
      translations: {
        en: { title: 'Finding a Clinic or Hospital in Rwanda', summary: 'How to find public and private health facilities near you.' },
        fr: { title: 'Trouver une clinique ou un hopital au Rwanda', summary: 'Comment trouver des etablissements de sante publics et prives.' },
        rw: { title: "Gushaka Ikigo cy'Ubuzima", summary: "Uko gushaka ibigo by'ubuzima by'abaturage cyangwa by'abagenewe." },
      },
      steps: [
        { order: 1, text: { en: 'Search nearby facilities', fr: 'Recherchez des etablissements a proximite', rw: 'Shaka ibigo biri hafi' } },
        { order: 2, text: { en: 'Bring insurance or cash', fr: 'Apportez assurance ou argent', rw: 'Zana imwanya cyangwa amafaranga' } },
      ],
      typicalCosts: [{ label: 'Consultation range', rangeRWF: [0, 15000] }],
      commonPitfalls: ['Confirm insurance acceptance', 'Carry your national ID'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'education',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['schools'],
      translations: {
        en: { title: 'Enrolling Children in School', summary: 'How to register a child in a Rwandan primary or secondary school.' },
        fr: { title: "Inscrire des enfants a l'ecole", summary: "Comment inscrire un enfant dans une ecole primaire ou secondaire." },
        rw: { title: 'Kwiyandikisha Abana mu Ishuri', summary: 'Uko kwiyandikisha umwana mu ishuri rya mbere cyangwa rya kabiri.' },
      },
      steps: [
        { order: 1, text: { en: 'Choose a nearby school', fr: 'Choisissez une ecole a proximite', rw: 'Hitamo ishuri riri hafi' } },
        { order: 2, text: { en: 'Bring birth certificate and report card', fr: 'Apportez acte de naissance et bulletin', rw: "Tana ubutabire n'ingengo" } },
      ],
      typicalCosts: [{ label: 'School fees range', rangeRWF: [0, 120000] }],
      commonPitfalls: ['Check school calendar', 'Confirm required documents'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'technology',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['sim', 'internet'],
      translations: {
        en: { title: 'Buying a SIM Card and Internet Plan', summary: 'How to get a Rwandan SIM card and affordable data plan.' },
        fr: { title: 'Acheter une carte SIM et un forfait internet', summary: 'Comment obtenir une carte SIM et un forfait data abordable.' },
        rw: { title: "Gukoresha SIM n'Ibijyanye na Internet", summary: "Uko kubona SIM y'u Rwanda n'ingengo y'amakuru." },
      },
      steps: [
        { order: 1, text: { en: 'Visit a telecom shop', fr: 'Visitez un magasin de telecoms', rw: "Musura iduka ry'itekerezo" } },
        { order: 2, text: { en: 'Register SIM with ID', fr: "Enregistrez la SIM avec une piece d'identite", rw: "Andikisha SIM na indangamuntu" } },
      ],
      typicalCosts: [{ label: 'SIM registration', rangeRWF: [0, 1000] }],
      commonPitfalls: ['SIM registration requires ID', 'Compare MTN vs Airtel prices'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'finance',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['banking', 'mobile-money'],
      translations: {
        en: { title: 'Opening a Bank Account in Rwanda', summary: 'What you need and which banks to consider.' },
        fr: { title: 'Ouvrir un compte bancaire au Rwanda', summary: "Ce qu'il faut et quelles banques considerer." },
        rw: { title: 'Gufungura Konti ya Banki', summary: "Ibyo ukwiye n'ibindi biri mu myanya yo gutanga amafaranga." },
      },
      steps: [
        { order: 1, text: { en: 'Choose a bank', fr: 'Choisissez une banque', rw: 'Hitamo banki' } },
        { order: 2, text: { en: 'Bring ID and proof of address', fr: "Apportez piece d'identite et preuve de domicile", rw: "Tana indangamuntu n'igitabo cy'iwe" } },
      ],
      typicalCosts: [{ label: 'Account opening fee', rangeRWF: [0, 5000] }],
      commonPitfalls: ['Ask about mobile banking', 'Compare account maintenance fees'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'culture',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['language', 'kinyarwanda'],
      translations: {
        en: { title: 'Basic Kinyarwanda Phrases for Newcomers', summary: 'Useful everyday phrases to help you settle in Rwanda.' },
        fr: { title: 'Phrases de base en Kinyarwanda', summary: 'Phrases utiles pour les nouveaux arrivants au Rwanda.' },
        rw: { title: "Amagambo ya Kinyarwanda Y'Abakeneye", summary: 'Amagambo y\'iminsi yose ariko gutanga ubufasha.' },
      },
      steps: [
        { order: 1, text: { en: 'Greet people politely', fr: 'Saluez poliment', rw: 'Habariza abantu' } },
        { order: 2, text: { en: 'Learn numbers and directions', fr: 'Apprenez les chiffres et directions', rw: "Iga imibare n'inzira" } },
      ],
      typicalCosts: [],
      commonPitfalls: ['Tone matters in Kinyarwanda', 'Practice with locals'],
    },
    {
      _type: 'guide',
      sourceType: 'editorial',
      category: 'emergency',
      status: 'published',
      aiDraftStatus: 'editor_reviewed',
      lastReviewedDate: '2026-08-15T00:00:00.000Z',
      researchSources: ['editor_local_knowledge'],
      tags: ['police', 'ambulance', 'fire'],
      translations: {
        en: { title: 'Emergency Numbers and Safety Tips in Rwanda', summary: 'Key emergency contacts and basic safety advice.' },
        fr: { title: "Numeros d'urgence et conseils de securite", summary: "Contacts d'urgence essentiels et conseils de securite de base." },
        rw: { title: "Nimero z'Ikoranabuhanga n'Inama z'Umutekano", summary: "Nimero ngenderwaho n'inama z'umutekano." },
      },
      steps: [
        { order: 1, text: { en: 'Save emergency numbers', fr: "Enregistrez les numeros d'urgence", rw: "Bika nimero z'ikoranabuhanga" } },
        { order: 2, text: { en: 'Know nearest hospital/police station', fr: "Sachez l'hopital/police les plus proches", rw: 'Menya ibitaro bya hafi' } },
      ],
      typicalCosts: [],
      commonPitfalls: ['Keep copies of important documents', 'Know your address in Kinyarwanda'],
    },
  ]

  const alerts = [
    {
      _type: 'alert',
      type: 'fee_change',
      severity: 'warning',
      status: 'published',
      relatedProcessId: 'process_business_registration',
      expiresAt: '2026-09-15T00:00:00.000Z',
      translations: {
        en: 'RDB business registration fee updated from free to 5,000 RWF.',
        fr: "Frais d'enregistrement RDB mis a jour de gratuit a 5 000 RWF.",
        rw: "Igiciro cy'kwiyandikisha ubucuruzi kuri RDB cyahinduwe kuva 0 kugera 5,000 RWF.",
      },
    },
    {
      _type: 'alert',
      type: 'office_closure',
      severity: 'info',
      status: 'published',
      expiresAt: '2026-09-01T00:00:00.000Z',
      translations: {
        en: 'RDB Kigali branch will be closed for maintenance on August 20, 2026.',
        fr: "L'agence RDB de Kigali sera fermee pour maintenance le 20 aout 2026.",
        rw: "Ibiro bya RDB bya Kigali bizahagarikwa ku buryo bwo gusukura ku itariki ya 20 Kanama 2026.",
      },
    },
  ]

  console.log('Seeding processes...')
  for (const doc of processes) {
    try {
      const existing = await client.fetch(`*[_type == "process" && translations.en.title == $title][0]`, { title: doc.translations.en.title })
      if (existing) {
        console.log('Skipping existing process:', doc.translations.en.title)
        continue
      }
      await client.create(doc)
      console.log('Created process:', doc.translations.en.title)
    } catch (err) {
      console.error('Failed process:', err.message)
    }
  }

  console.log('Seeding guides...')
  for (const doc of guides) {
    try {
      const existing = await client.fetch(`*[_type == "guide" && translations.en.title == $title][0]`, { title: doc.translations.en.title })
      if (existing) {
        console.log('Skipping existing guide:', doc.translations.en.title)
        continue
      }
      await client.create(doc)
      console.log('Created guide:', doc.translations.en.title)
    } catch (err) {
      console.error('Failed guide:', err.message)
    }
  }

  console.log('Seeding alerts...')
  for (const doc of alerts) {
    try {
      const existing = await client.fetch(`*[_type == "alert" && translations.en == $text][0]`, { text: doc.translations.en })
      if (existing) {
        console.log('Skipping existing alert:', doc.translations.en)
        continue
      }
      await client.create(doc)
      console.log('Created alert:', doc.translations.en)
    } catch (err) {
      console.error('Failed alert:', err.message)
    }
  }

  console.log('Done.')
}

main().catch(console.error)
