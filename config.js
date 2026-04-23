/* ══════════════════════════════════════════════════════════════════════════
   config.js — edit trees and i18n strings here
   ══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {

  /* ── i18n strings ─────────────────────────────────────────────────────── */
  i18n: {
    fr: {
      appTitle:        'HR Service Desk – Test de navigation',
      treeLabel:       'Naviguez dans les catégories',
      breadcrumbLabel: 'Chemin sélectionné :',
      breadcrumbEmpty: 'Aucune catégorie sélectionnée',
      confirmBtn:      'Je soumettrais ma question ici',
      navLogTitle:     'Parcours de navigation',
      reminderTitle:   'Avant de passer à la suite dans Lookback',
      reminderIntro:   'Répondez aux 2 questions suivantes :',
      reminderQ1:      'Sur une échelle de 1 à 5, à quel point étiez-vous confiant(e) dans votre choix ?',
      reminderQ2:      'Avez-vous des remarques ou suggestions ?',
    },
    nl: {
      appTitle:        'HR-dienst – Navigatietest',
      treeLabel:       'Navigeer door de categorieën',
      breadcrumbLabel: 'Geselecteerd pad:',
      breadcrumbEmpty: 'Geen categorie geselecteerd',
      confirmBtn:      'Hier zou ik mijn vraag indienen',
      navLogTitle:     'Navigatieverloop',
      reminderTitle:   'Voordat u verdergaat in Lookback',
      reminderIntro:   'Beantwoord de volgende 2 vragen:',
      reminderQ1:      'Op een schaal van 1 tot 5, hoe zeker was u van uw keuze?',
      reminderQ2:      'Heeft u opmerkingen of suggesties?',
    }
  },

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
