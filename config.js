/* ══════════════════════════════════════════════════════════════════════════
   config.js — edit tasks, trees, and i18n strings here
   ══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {

  /* ── i18n strings ─────────────────────────────────────────────────────── */
  i18n: {
    fr: {
      appTitle:            'HR Service Desk – Test de navigation',
      treeLabel:           'Naviguez dans les catégories',
      breadcrumbLabel:     'Chemin sélectionné :',
      breadcrumbEmpty:     'Aucune catégorie sélectionnée',
      confirmBtn:          'Je soumettrais ma question ici',
      participantLabel:    'Votre code participant (optionnel) :',
      btnNext:             'Suivant',
      btnStart:            'Commencer le test',
      instructionsTitle:   'Instructions',
      instructionsBodyHtml: `
        <p>Vous allez répondre à <strong>8 scénarios</strong>.
        Pour chaque scénario, imaginez que vous êtes un(e) employé(e)
        qui cherche où soumettre une question au service RH.</p>
        <ol>
          <li>Lisez attentivement le scénario affiché.</li>
          <li>Naviguez dans l'arborescence des catégories.</li>
          <li>Cliquez sur la catégorie où vous soumettriez votre question,
              puis confirmez avec le bouton ci-dessous.</li>
        </ol>
        <p>Il n'y a pas de bonne ou de mauvaise réponse —
        choisissez simplement là où vous vous attendriez à trouver de l'aide.</p>`,
      scenarioLabel:       'Votre scénario',
      progressLabel:       'Scénario %d sur %n',
      confidenceQ:         'Sur une échelle de 1 à 5, à quel point étiez-vous confiant(e) dans votre choix ?',
      confidenceLow:       '1 = pas du tout confiant(e)',
      confidenceHigh:      '5 = très confiant(e)',
      commentQ:            'Avez-vous des remarques ou suggestions ? (optionnel)',
      btnNextTask:         'Scénario suivant',
      btnFinish:           'Terminer les scénarios',
      postStudyTitle:      'Questionnaire de clôture',
      easeQ:               'Dans l\'ensemble, comment évalueriez-vous la facilité à trouver les bonnes catégories ?',
      easeLow:             '1 = très difficile',
      easeHigh:            '5 = très facile',
      hardestQ:            'Quelles catégories principales étaient les plus difficiles à trouver ? (plusieurs choix possibles)',
      missingQ:            'Y a-t-il des catégories manquantes ou dont le nom prête à confusion ?',
      otherCommentsQ:      'Autres commentaires ou suggestions ?',
      btnSubmitPostStudy:  'Terminer',
      thankyouTitle:       'Merci pour votre participation !',
      thankyouBody:        'Vos résultats sont prêts. Cliquez sur le bouton ci-dessous pour les télécharger et les transmettre à l\'organisateur de l\'étude.',
      btnDownload:         'Télécharger les résultats (CSV)',
      welcomeTitle:        'Bienvenue dans cette courte étude, et merci de votre participation !',
      welcomeBody:         'Cette étude dure au maximum 15 minutes. Votre participation nous aidera à améliorer les catégories du Service Desk RH, afin que vous puissiez trouver plus facilement la bonne rubrique pour vos questions RH.',
      btnWelcomeNext:      'Continuer',
      pretestTitle:        'Quelques courtes questions sur vous d\'abord.',
      pretestGridIntro:    'Indiquez à quelle fréquence les affirmations suivantes vous correspondent :',
      pretestRows: [
        'J\'utilise un ordinateur pour mon travail',
        'J\'utilise un smartphone pour mon travail',
        'Je consulte l\'intranet WeBe',
        'Je contacte les RH pour des questions ou des remarques',
        'Je contacte les RH via leur Service Desk en ligne',
      ],
      pretestCols:         ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Incertain / Sans objet'],
      btnPretestNext:      'Continuer',
      postStudyExpIntro:   'Pour terminer, quelques questions sur votre expérience.',
      structureQ:          'Comment avez-vous trouvé la structure dans l\'ensemble ?',
      structureOptions:    ['Efficace', 'Écrasante', 'Confuse', 'Simple', 'Logique', 'Complexe'],
      structureOther:      'Autre (précisez) :',
      postStudyFinalCommentQ: '(Optionnel) Avez-vous d\'autres remarques ou suggestions ?',
    },
    nl: {
      appTitle:            'HR-dienst – Navigatietest',
      treeLabel:           'Navigeer door de categorieën',
      breadcrumbLabel:     'Geselecteerd pad:',
      breadcrumbEmpty:     'Geen categorie geselecteerd',
      confirmBtn:          'Hier zou ik mijn vraag indienen',
      participantLabel:    'Uw deelnemerscode (optioneel):',
      btnNext:             'Volgende',
      btnStart:            'Start de test',
      instructionsTitle:   'Instructies',
      instructionsBodyHtml: `
        <p>U gaat <strong>8 scenario's</strong> beantwoorden.
        Stel u bij elk scenario voor dat u een medewerker bent
        die op zoek is naar waar hij of zij een vraag kan stellen aan de HR-dienst.</p>
        <ol>
          <li>Lees het scenario aandachtig.</li>
          <li>Navigeer door de categorieënboom.</li>
          <li>Klik op de categorie waar u uw vraag zou indienen
              en bevestig met de knop hieronder.</li>
        </ol>
        <p>Er zijn geen goede of foute antwoorden —
        kies gewoon waar u de hulp zou verwachten te vinden.</p>`,
      scenarioLabel:       'Uw scenario',
      progressLabel:       'Scenario %d van %n',
      confidenceQ:         'Op een schaal van 1 tot 5, hoe zeker was u van uw keuze?',
      confidenceLow:       '1 = helemaal niet zeker',
      confidenceHigh:      '5 = zeer zeker',
      commentQ:            'Heeft u opmerkingen of suggesties? (optioneel)',
      btnNextTask:         'Volgend scenario',
      btnFinish:           'Scenario\'s afronden',
      postStudyTitle:      'Afsluitende vragenlijst',
      easeQ:               'Hoe gemakkelijk was het over het algemeen om de juiste categorieën te vinden?',
      easeLow:             '1 = zeer moeilijk',
      easeHigh:            '5 = zeer gemakkelijk',
      hardestQ:            'Welke hoofdcategorieën waren het moeilijkst te vinden? (meerdere keuzes mogelijk)',
      missingQ:            'Zijn er categorieën die ontbreken of waarvan de naam verwarrend is?',
      otherCommentsQ:      'Andere opmerkingen of suggesties?',
      btnSubmitPostStudy:  'Afronden',
      thankyouTitle:       'Bedankt voor uw deelname!',
      thankyouBody:        'Uw resultaten zijn klaar. Klik op de knop hieronder om ze te downloaden en door te sturen naar de organisator van het onderzoek.',
      btnDownload:         'Resultaten downloaden (CSV)',
      welcomeTitle:        'Welkom bij dit kort onderzoek, en bedankt dat u meedoet!',
      welcomeBody:         'U werkt maximaal 15 minuten. Uw deelname helpt ons de categorieën van het HR Service Desk overzichtelijker te maken, zodat u sneller bij de juiste plek terechtkomt met uw HR-vragen.',
      btnWelcomeNext:      'Doorgaan',
      pretestTitle:        'Eerst enkele korte vragen over uzelf.',
      pretestGridIntro:    'Geef aan hoe vaak de volgende uitspraken op u van toepassing zijn:',
      pretestRows: [
        'Ik gebruik een computer voor mijn werk',
        'Ik gebruik een smartphone voor mijn werk',
        'Ik raadpleeg het intranet WeBe',
        'Ik neem contact op met HR voor vragen of opmerkingen',
        'Ik neem contact op met HR via hun online Service Desk',
      ],
      pretestCols:         ['Nooit', 'Zelden', 'Af en toe', 'Vaak', 'Niet zeker / Niet van toepassing'],
      btnPretestNext:      'Doorgaan',
      postStudyExpIntro:   'Tot slot nog enkele vragen over uw ervaring.',
      structureQ:          'Hoe vond u de structuur over het algemeen?',
      structureOptions:    ['Efficiënt', 'Overweldigend', 'Verwarrend', 'Eenvoudig', 'Logisch', 'Complex'],
      structureOther:      'Anders (leg uit):',
      postStudyFinalCommentQ: '(Optioneel) Heeft u nog opmerkingen of suggesties?',
    }
  },

  /* ── Tasks ────────────────────────────────────────────────────────────────
     8 scenarios presented in randomised order each session.
     Fill in scenario_fr and correct_fr before running French sessions.
     ──────────────────────────────────────────────────────────────────────── */
  tasks: [
    {
      id: 'task1',
      scenario_nl: 'Gisteren klopt je prikking niet: de registratie toont dat je afwezig was, terwijl je gewoon aan het werk was. Waar ga je dit melden?',
      scenario_fr: '[FR – scénario 1 à compléter]',
      correct_nl:  'nl_werktijd_aanwezigheid',
      correct_fr:  'fr_werktijd_aanwezigheid',
    },
    {
      id: 'task2',
      scenario_nl: 'Je wil weten hoeveel verlofdagen je nog hebt dit jaar. Waar zoek je die informatie?',
      scenario_fr: '[FR – scénario 2 à compléter]',
      correct_nl:  'nl_verlof_quota_info',
      correct_fr:  'fr_verlof_quota_info',
    },
    {
      id: 'task3',
      scenario_nl: 'Je hebt je loonfiche van vorige maand nodig voor je belastingaangifte. Waar vraag je die op?',
      scenario_fr: '[FR – scénario 3 à compléter]',
      correct_nl:  'nl_loon_loonfiche',
      correct_fr:  'fr_loon_loonfiche',
    },
    {
      id: 'task4',
      scenario_nl: 'Je bent ziek thuis en wil weten hoe je een ziektemelding correct indient. Waar vind je die informatie?',
      scenario_fr: '[FR – scénario 4 à compléter]',
      correct_nl:  'nl_gezondheid_ziekte_info',
      correct_fr:  'fr_gezondheid_ziekte_info',
    },
    {
      id: 'task5',
      scenario_nl: 'Je badge is kwijt en je geraakt het gebouw niet meer in. Waar vraag je een vervangende badge aan?',
      scenario_fr: '[FR – scénario 5 à compléter]',
      correct_nl:  'nl_badge_vervanging',
      correct_fr:  'fr_badge_vervanging',
    },
    {
      id: 'task6',
      scenario_nl: 'Je wil een opleiding volgen die aangeboden wordt via de organisatie. Waar doe je een aanvraag?',
      scenario_fr: '[FR – scénario 6 à compléter]',
      correct_nl:  'nl_loopbaan_opleidingen',
      correct_fr:  'fr_loopbaan_opleidingen',
    },
    {
      id: 'task7',
      scenario_nl: 'Je hebt plots geen toegang meer tot een HR-toepassing die je dagelijks gebruikt. Waar meld je dit?',
      scenario_fr: '[FR – scénario 7 à compléter]',
      correct_nl:  'nl_hrapps_toegang',
      correct_fr:  'fr_hrapps_toegang',
    },
    {
      id: 'task8',
      scenario_nl: 'Je professioneel telefoonnummer is veranderd en je wil dit aanpassen in het systeem. Waar doe je dit?',
      scenario_fr: '[FR – scénario 8 à compléter]',
      correct_nl:  'nl_persoonsgegevens_telefoon',
      correct_fr:  'fr_persoonsgegevens_telefoon',
    },
  ],

  /* ── Trees ────────────────────────────────────────────────────────────────
     NL labels are complete. FR labels are empty — fill them in before
     running FR sessions.
     ──────────────────────────────────────────────────────────────────────── */
  trees: {
    nl: {
      id: 'root', label: 'HR-dienst',
      children: [
        { id: 'nl_werktijd', label: 'Werktijd en afwezigheden', children: [
            { id: 'nl_werktijd_registratie', label: 'Werktijdregistratie', children: [
                { id: 'nl_werktijd_prikking',     label: 'Prikking ontbreekt of is fout' },
                { id: 'nl_werktijd_aanwezigheid', label: 'Aanwezigheid of afwezigheid verkeerd geregistreerd' },
                { id: 'nl_werktijd_info',         label: 'Informatie over de registratie van je werktijd' }
            ]},
            { id: 'nl_verlof_quota', label: 'Verlofsaldo en quota', children: [
                { id: 'nl_verlof_quota_info', label: 'Informatie over je verlofquota' }
            ]},
            { id: 'nl_staven', label: 'Staven van een afwezigheid', children: [
                { id: 'nl_staven_huwelijk',         label: 'Gelegenheidsverlof huwelijk / wettelijk samenwonen' },
                { id: 'nl_staven_geboorte',         label: 'Geboorteverlof' },
                { id: 'nl_staven_rouw',             label: 'Rouwverlof' },
                { id: 'nl_staven_onbetaald',        label: 'Verlof zonder bezoldiging dwingende redenen' },
                { id: 'nl_staven_sociale_promotie', label: 'Sociale promotie' },
                { id: 'nl_staven_politiek',         label: 'Politiek Mandaat' },
                { id: 'nl_staven_andere',           label: 'Andere afwezigheid staven' }
            ]},
            { id: 'nl_werkregime', label: 'Werkregime', children: [
                { id: 'nl_werkregime_deeltijds',    label: 'Deeltijds werken' },
                { id: 'nl_werkregime_onderbreking', label: 'Voltijdse loopbaanonderbreking' },
                { id: 'nl_werkregime_info',         label: 'Werkregime' }
            ]},
            { id: 'nl_prestaties', label: 'Bijzondere prestaties en interventies', children: [
                { id: 'nl_prestaties_buiten',  label: 'Prestatie(s) buiten de diensturen' },
                { id: 'nl_prestaties_limiet',  label: 'Prestatie(s) met overschrijding van de toegelaten dagelijkse/wekelijkse limiet' },
                { id: 'nl_prestaties_weekend', label: 'Prestatie op zaterdag/zondag/feestdag/verplichte brugdag' }
            ]}
        ]},
        { id: 'nl_loon', label: 'Loon en voordelen', children: [
            { id: 'nl_loon_loonfiche',             label: 'Loonfiche' },
            { id: 'nl_loon_simulatie',             label: 'Loonsimulatie' },
            { id: 'nl_loon_reward',                label: 'New Reward Plan' },
            { id: 'nl_loon_bevordering',           label: 'Semestriële bevorderingen' },
            { id: 'nl_loon_arbeidsongeschiktheid', label: 'Financiële impact arbeidsongeschiktheid' },
            { id: 'nl_loon_bike',                  label: 'My bike' },
            { id: 'nl_verkeer', label: 'Verkeersvoordelen', children: [
                { id: 'nl_verkeer_nationaal',      label: 'Nationaal verkeer' },
                { id: 'nl_verkeer_internationaal', label: 'Internationaal verkeer' },
                { id: 'nl_verkeer_gezin',          label: 'Verkeersvoordelen voor mijn gezinsleden' },
                { id: 'nl_verkeer_verlies',        label: 'Verlies of diefstal verkeersfaciliteiten' },
                { id: 'nl_verkeer_vernieuwing',    label: 'Jaarlijkse vernieuwing van de verkeersfaciliteiten' }
            ]},
            { id: 'nl_loon_woonwerk',  label: 'Terugbetaling woon-werkverkeer' },
            { id: 'nl_loon_attesten',  label: 'Aanvraag attesten' },
            { id: 'nl_loon_andere',    label: 'Andere voordelen' },
            { id: 'nl_loon_beslag',    label: 'Loonbeslag' },
            { id: 'nl_loon_syndicaal', label: 'Syndicale bijdrage' }
        ]},
        { id: 'nl_loopbaan', label: 'Loopbaan', children: [
            { id: 'nl_loopbaan_aanwerving',    label: 'Aanwerving' },
            { id: 'nl_loopbaan_onboarding',    label: 'Onboarding' },
            { id: 'nl_loopbaan_stage',         label: 'Stage- of proefperiode' },
            { id: 'nl_loopbaan_opleidingen',   label: 'Opleidingen' },
            { id: 'nl_loopbaan_kwalificaties', label: 'Kwalificaties en certificaten' },
            { id: 'nl_loopbaan_performantie',  label: 'Performantie en evaluatie' },
            { id: 'nl_loopbaan_mobiliteit',    label: 'Interne mobiliteit' },
            { id: 'nl_loopbaan_begeleiding',   label: 'Loopbaanbegeleiding' },
            { id: 'nl_loopbaan_offboarding', label: 'Offboarding', children: [
                { id: 'nl_loopbaan_offboarding_info',     label: 'Informatie over je offboarding' },
                { id: 'nl_loopbaan_offboarding_ontslag',  label: 'Ontslag op aanvraag' },
                { id: 'nl_loopbaan_offboarding_pensioen', label: 'Uitstel van pensioen' }
            ]},
            { id: 'nl_loopbaan_studenten', label: 'Jobstudenten / stagiairs / externen', children: [
                { id: 'nl_loopbaan_studenten_beeindig', label: 'Voortijdig beëindigen van het studentencontract' },
                { id: 'nl_loopbaan_studenten_externen', label: 'Aanmaken/deactivatie Externen' },
                { id: 'nl_loopbaan_studenten_info',     label: 'Informatie over jobstudenten / stagiairs / externen' }
            ]},
            { id: 'nl_loopbaan_attesten', label: 'Aanvraag attesten' }
        ]},
        { id: 'nl_persoonsgegevens', label: 'Persoonsgegevens', children: [
            { id: 'nl_persoonsgegevens_contact', label: 'Professionele contactgegevens of contactpersoon bij nood wijzigen', children: [
                { id: 'nl_persoonsgegevens_telefoon', label: 'Mijn professioneel telefoonnummer' },
                { id: 'nl_persoonsgegevens_nood',     label: 'Mijn contactpersoon in geval van nood' }
            ]},
            { id: 'nl_persoonsgegevens_gdpr',     label: 'Privacy of gebruik van mijn persoonsgegevens (GDPR)' },
            { id: 'nl_persoonsgegevens_neven',    label: 'Vragen over nevenactiviteit of bijberoep' },
            { id: 'nl_persoonsgegevens_attesten', label: 'Aanvraag attesten' }
        ]},
        { id: 'nl_gezondheid', label: 'Gezondheid en welzijn', children: [
            { id: 'nl_gezondheid_ziekte', label: 'Ziekteperiode / ziektemelding', children: [
                { id: 'nl_gezondheid_ziekte_controle', label: 'Wijzigen datum medische controle' },
                { id: 'nl_gezondheid_ziekte_dagen',    label: 'Aantal dagen ziekte raadplegen' },
                { id: 'nl_gezondheid_ziekte_klacht',   label: 'Klacht tegen een sanctie' },
                { id: 'nl_gezondheid_ziekte_info',     label: 'Informatie over een ziektemelding' }
            ]},
            { id: 'nl_gezondheid_arbeidsongeval', label: 'Arbeidsongeval', children: [
                { id: 'nl_gezondheid_arbeidsongeval_info', label: 'Informatie over arbeidsongeval' }
            ]},
            { id: 'nl_gezondheid_zwangerschap', label: 'Zwangerschap of moederschapsverlof', children: [
                { id: 'nl_gezondheid_zwangerschap_melding', label: 'Melding van je zwangerschap' },
                { id: 'nl_gezondheid_zwangerschap_info',    label: 'Informatie over moederschap' }
            ]},
            { id: 'nl_gezondheid_terugkeer', label: 'Terugkeer naar het werk na ziekte', children: [
                { id: 'nl_gezondheid_terugkeer_reintegratie', label: 'Informatie over een re-integratietraject' },
                { id: 'nl_gezondheid_terugkeer_idewe',        label: 'Aanvraag gezondheidstoezicht (IDEWE)' },
                { id: 'nl_gezondheid_terugkeer_beroep',       label: 'Beroep tegen medische beslissing van de preventiearts' }
            ]},
            { id: 'nl_gezondheid_deeltijds', label: 'Tijdelijk deeltijds werken om medische redenen', children: [
                { id: 'nl_gezondheid_deeltijds_modaliteiten', label: 'Praktische modaliteiten medische deeltijdse werkhervatting' },
                { id: 'nl_gezondheid_deeltijds_aanvraag',     label: 'Aanvraag medische deeltijdse werkhervatting' },
                { id: 'nl_gezondheid_deeltijds_info',         label: 'Informatie over gevolgen of vergoedingen' }
            ]},
            { id: 'nl_gezondheid_langdurig', label: 'Langdurige medische ongeschiktheid', children: [
                { id: 'nl_gezondheid_langdurig_pensioen',   label: 'Modaliteiten medisch pensioen' },
                { id: 'nl_gezondheid_langdurig_financieel', label: 'Financiële impact' }
            ]}
        ]},
        { id: 'nl_badge', label: 'Badge', children: [
            { id: 'nl_badge_vervanging', label: 'De vervanging van mijn badge' },
            { id: 'nl_badge_toegang',    label: 'Een extra toegang aanvragen of toegang wijzigen' }
        ]},
        { id: 'nl_hrapps', label: 'HR-toepassingen', children: [
            { id: 'nl_hrapps_toegang',  label: 'Toegang tot een HR-toepassing' },
            { id: 'nl_hrapps_probleem', label: 'Probleem met een HR-toepassing' },
            { id: 'nl_hrapps_hulp',     label: 'Hulp nodig met een HR-toepassing' }
        ]},
        { id: 'nl_planning', label: 'Planning tijdsgegevens (voor planners)', children: [
            { id: 'nl_planning_quinyx',         label: 'Plannen van personeel Quinyx' },
            { id: 'nl_planning_sap',            label: 'Plannen van personeel in SAP' },
            { id: 'nl_planning_reglementering', label: 'Een vraag over reglementering met betrekking tot planning van personeel' },
            { id: 'nl_planning_quota',          label: 'Een vraag met betrekking tot de quota van je personeelsleden' }
        ]}
      ]
    },

    /* FR labels are empty — fill them in before running FR sessions */
    fr: {
      id: 'root', label: '',
      children: [
        { id: 'fr_werktijd', label: '', children: [
            { id: 'fr_werktijd_registratie', label: '', children: [
                { id: 'fr_werktijd_prikking',     label: '' },
                { id: 'fr_werktijd_aanwezigheid', label: '' },
                { id: 'fr_werktijd_info',         label: '' }
            ]},
            { id: 'fr_verlof_quota', label: '', children: [
                { id: 'fr_verlof_quota_info', label: '' }
            ]},
            { id: 'fr_staven', label: '', children: [
                { id: 'fr_staven_huwelijk',         label: '' },
                { id: 'fr_staven_geboorte',         label: '' },
                { id: 'fr_staven_rouw',             label: '' },
                { id: 'fr_staven_onbetaald',        label: '' },
                { id: 'fr_staven_sociale_promotie', label: '' },
                { id: 'fr_staven_politiek',         label: '' },
                { id: 'fr_staven_andere',           label: '' }
            ]},
            { id: 'fr_werkregime', label: '', children: [
                { id: 'fr_werkregime_deeltijds',    label: '' },
                { id: 'fr_werkregime_onderbreking', label: '' },
                { id: 'fr_werkregime_info',         label: '' }
            ]},
            { id: 'fr_prestaties', label: '', children: [
                { id: 'fr_prestaties_buiten',  label: '' },
                { id: 'fr_prestaties_limiet',  label: '' },
                { id: 'fr_prestaties_weekend', label: '' }
            ]}
        ]},
        { id: 'fr_loon', label: '', children: [
            { id: 'fr_loon_loonfiche',             label: '' },
            { id: 'fr_loon_simulatie',             label: '' },
            { id: 'fr_loon_reward',                label: '' },
            { id: 'fr_loon_bevordering',           label: '' },
            { id: 'fr_loon_arbeidsongeschiktheid', label: '' },
            { id: 'fr_loon_bike',                  label: '' },
            { id: 'fr_verkeer', label: '', children: [
                { id: 'fr_verkeer_nationaal',      label: '' },
                { id: 'fr_verkeer_internationaal', label: '' },
                { id: 'fr_verkeer_gezin',          label: '' },
                { id: 'fr_verkeer_verlies',        label: '' },
                { id: 'fr_verkeer_vernieuwing',    label: '' }
            ]},
            { id: 'fr_loon_woonwerk',  label: '' },
            { id: 'fr_loon_attesten',  label: '' },
            { id: 'fr_loon_andere',    label: '' },
            { id: 'fr_loon_beslag',    label: '' },
            { id: 'fr_loon_syndicaal', label: '' }
        ]},
        { id: 'fr_loopbaan', label: '', children: [
            { id: 'fr_loopbaan_aanwerving',    label: '' },
            { id: 'fr_loopbaan_onboarding',    label: '' },
            { id: 'fr_loopbaan_stage',         label: '' },
            { id: 'fr_loopbaan_opleidingen',   label: '' },
            { id: 'fr_loopbaan_kwalificaties', label: '' },
            { id: 'fr_loopbaan_performantie',  label: '' },
            { id: 'fr_loopbaan_mobiliteit',    label: '' },
            { id: 'fr_loopbaan_begeleiding',   label: '' },
            { id: 'fr_loopbaan_offboarding', label: '', children: [
                { id: 'fr_loopbaan_offboarding_info',     label: '' },
                { id: 'fr_loopbaan_offboarding_ontslag',  label: '' },
                { id: 'fr_loopbaan_offboarding_pensioen', label: '' }
            ]},
            { id: 'fr_loopbaan_studenten', label: '', children: [
                { id: 'fr_loopbaan_studenten_beeindig', label: '' },
                { id: 'fr_loopbaan_studenten_externen', label: '' },
                { id: 'fr_loopbaan_studenten_info',     label: '' }
            ]},
            { id: 'fr_loopbaan_attesten', label: '' }
        ]},
        { id: 'fr_persoonsgegevens', label: '', children: [
            { id: 'fr_persoonsgegevens_contact', label: '', children: [
                { id: 'fr_persoonsgegevens_telefoon', label: '' },
                { id: 'fr_persoonsgegevens_nood',     label: '' }
            ]},
            { id: 'fr_persoonsgegevens_gdpr',     label: '' },
            { id: 'fr_persoonsgegevens_neven',    label: '' },
            { id: 'fr_persoonsgegevens_attesten', label: '' }
        ]},
        { id: 'fr_gezondheid', label: '', children: [
            { id: 'fr_gezondheid_ziekte', label: '', children: [
                { id: 'fr_gezondheid_ziekte_controle', label: '' },
                { id: 'fr_gezondheid_ziekte_dagen',    label: '' },
                { id: 'fr_gezondheid_ziekte_klacht',   label: '' },
                { id: 'fr_gezondheid_ziekte_info',     label: '' }
            ]},
            { id: 'fr_gezondheid_arbeidsongeval', label: '', children: [
                { id: 'fr_gezondheid_arbeidsongeval_info', label: '' }
            ]},
            { id: 'fr_gezondheid_zwangerschap', label: '', children: [
                { id: 'fr_gezondheid_zwangerschap_melding', label: '' },
                { id: 'fr_gezondheid_zwangerschap_info',    label: '' }
            ]},
            { id: 'fr_gezondheid_terugkeer', label: '', children: [
                { id: 'fr_gezondheid_terugkeer_reintegratie', label: '' },
                { id: 'fr_gezondheid_terugkeer_idewe',        label: '' },
                { id: 'fr_gezondheid_terugkeer_beroep',       label: '' }
            ]},
            { id: 'fr_gezondheid_deeltijds', label: '', children: [
                { id: 'fr_gezondheid_deeltijds_modaliteiten', label: '' },
                { id: 'fr_gezondheid_deeltijds_aanvraag',     label: '' },
                { id: 'fr_gezondheid_deeltijds_info',         label: '' }
            ]},
            { id: 'fr_gezondheid_langdurig', label: '', children: [
                { id: 'fr_gezondheid_langdurig_pensioen',   label: '' },
                { id: 'fr_gezondheid_langdurig_financieel', label: '' }
            ]}
        ]},
        { id: 'fr_badge', label: '', children: [
            { id: 'fr_badge_vervanging', label: '' },
            { id: 'fr_badge_toegang',    label: '' }
        ]},
        { id: 'fr_hrapps', label: '', children: [
            { id: 'fr_hrapps_toegang',  label: '' },
            { id: 'fr_hrapps_probleem', label: '' },
            { id: 'fr_hrapps_hulp',     label: '' }
        ]},
        { id: 'fr_planning', label: '', children: [
            { id: 'fr_planning_quinyx',         label: '' },
            { id: 'fr_planning_sap',            label: '' },
            { id: 'fr_planning_reglementering', label: '' },
            { id: 'fr_planning_quota',          label: '' }
        ]}
      ]
    }
  },

}; /* END CONFIG */
