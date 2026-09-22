// Thynk Digital Solution - CRM & HRMS Mock Seed Data

const initialCRMData = {
  leads: [],
  
  clients: [
    {
      id: "C008",
      companyName: "RIG Fabrication",
      clientName: "Ravi",
      mobile: "9988776655",
      whatsapp: "9988776655",
      email: "contact@rigearthing.com",
      website: "https://www.rigearthing.com/",
      category: "Industrial Manufacturing",
      gst: "27RIGE1234C1Z1",
      address: "GIDC Industrial Estate",
      city: "Vadodara",
      state: "Gujarat",
      country: "India",
      logo: "R",
      source: "Google Search",
      assignedEmployeeId: "E001",
      status: "Active",
      priority: "High",
      dateCreated: "2024-05-15"
    },
    {
      id: "C009",
      companyName: "Indus Dental Care",
      clientName: "Sudharshan",
      mobile: "9876123456",
      whatsapp: "9876123456",
      email: "appointments@indusdentalcare.com",
      website: "https://www.indusdentalcare.com/",
      category: "Healthcare",
      gst: "27INDD1234D1Z1",
      address: "Flat 2, Prime Avenue, MG Road",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      logo: "I",
      source: "Instagram Outreach",
      assignedEmployeeId: "E003",
      status: "Active",
      priority: "Medium",
      dateCreated: "2024-10-28"
    },
    {
      id: "C010",
      companyName: "Agtechnosolutions",
      clientName: "Arun",
      mobile: "9821102233",
      whatsapp: "9821102233",
      email: "arun@agtechnosolutions.in",
      website: "https://agtechnosolutions.in/",
      category: "IT Services",
      gst: "",
      address: "12, Tech Park, Phase 1",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      logo: "A",
      source: "Referral",
      assignedEmployeeId: "E001",
      status: "Active",
      priority: "Medium",
      dateCreated: "2026-06-06"
    },
    {
      id: "C011",
      companyName: "Indus Flooring",
      clientName: "Sudharshan",
      mobile: "9834455667",
      whatsapp: "9834455667",
      email: "sudharshan@indusconcretepolishing.com",
      website: "https://indusconcretepolishing.com/",
      category: "Flooring & Construction",
      gst: "",
      address: "Industrial Area Gate 3",
      city: "Coimbatore",
      state: "Tamil Nadu",
      country: "India",
      logo: "I",
      source: "Google Search",
      assignedEmployeeId: "E003",
      status: "Active",
      priority: "Medium",
      dateCreated: "2025-07-16"
    },
    {
      id: "C012",
      companyName: "Thynk Digital",
      clientName: "Gokul",
      mobile: "9876543210",
      whatsapp: "9876543210",
      email: "gokul@thynkdigitalsolutions.com",
      website: "https://www.thynkdigitalsolutions.com/",
      category: "Digital Agency",
      gst: "",
      address: "Main Road, Cross 2",
      city: "Coimbatore",
      state: "Tamil Nadu",
      country: "India",
      logo: "T",
      source: "Direct",
      assignedEmployeeId: "E002",
      status: "Active",
      priority: "High",
      dateCreated: "2025-08-27"
    },
    {
      id: "C013",
      companyName: "MPS Hospital .IN",
      clientName: "Manikandan",
      mobile: "9812233445",
      whatsapp: "9812233445",
      email: "manikandan@mpshospitals.in",
      website: "https://mpshospitals.in/",
      category: "Healthcare",
      gst: "",
      address: "MPS Road, City Center",
      city: "Salem",
      state: "Tamil Nadu",
      country: "India",
      logo: "M",
      source: "Referral",
      assignedEmployeeId: "E004",
      status: "Active",
      priority: "Medium",
      dateCreated: "2024-09-08"
    },
    {
      id: "C014",
      companyName: "MPS Hospital .com",
      clientName: "Manikandan",
      mobile: "9812233445",
      whatsapp: "9812233445",
      email: "manikandan@mpshospitals.com",
      website: "https://mpshospitals.com/",
      category: "Healthcare",
      gst: "",
      address: "MPS Road, City Center",
      city: "Salem",
      state: "Tamil Nadu",
      country: "India",
      logo: "M",
      source: "Referral",
      assignedEmployeeId: "E004",
      status: "Active",
      priority: "Medium",
      dateCreated: "2024-09-08"
    },
    {
      id: "C015",
      companyName: "Wincube Solutions",
      clientName: "Raj Kumar",
      mobile: "9894455667",
      whatsapp: "9894455667",
      email: "rajkumar@wincube5s.com",
      website: "https://www.wincube5s.com/",
      category: "Consulting",
      gst: "",
      address: "5S Office Block, G-3",
      city: "Erode",
      state: "Tamil Nadu",
      country: "India",
      logo: "W",
      source: "LinkedIn Outreach",
      assignedEmployeeId: "E002",
      status: "Active",
      priority: "Medium",
      dateCreated: "2026-06-28"
    }
  ],

  services: [
    { id: "S003", clientId: "C008", serviceName: "Hosting Renewal", package: "RIG Earthing Hosting", startDate: "2023-05-15", endDate: "2024-05-15", renewalDate: "2024-05-15", assignedEmployeeId: "E001", cost: 2557, discount: 0, finalAmount: 2557, status: "Expired", notes: "Domain: rigearthing.com" },
    { id: "S004", clientId: "C010", serviceName: "Domain Renewal", package: "Agtechno Domain & Hosting", startDate: "2026-06-06", endDate: "2027-06-06", renewalDate: "2027-06-06", assignedEmployeeId: "E001", cost: 3800, discount: 0, finalAmount: 3800, status: "Running", notes: "Domain: agtechnosolutions.in" },
    { id: "S008", clientId: "C011", serviceName: "Hosting Renewal", package: "Indus Concrete Hosting", startDate: "2024-07-16", endDate: "2025-07-16", renewalDate: "2025-07-16", assignedEmployeeId: "E001", cost: 2440, discount: 0, finalAmount: 2440, status: "Expired", notes: "Domain: indusconcretepolishing.com" },
    { id: "S009", clientId: "C012", serviceName: "Domain Renewal", package: "Thynk Domain & Hosting", startDate: "2024-08-27", endDate: "2025-08-27", renewalDate: "2025-08-27", assignedEmployeeId: "E001", cost: 2440, discount: 0, finalAmount: 2440, status: "Expired", notes: "Domain: thynkdigitalsolutions.com" }
  ],

  domains: [
    {
      id: "D001",
      clientId: "C008",
      domainName: "rigearthing.com",
      registrar: "GoDaddy",
      registrationDate: "2023-05-15",
      expiryDate: "2024-05-15",
      renewalDate: "2024-05-15",
      autoRenewal: "No",
      status: "Expired",
      renewalCost: 1200,
      dnsStatus: "OK",
      sslStatus: "Expired",
      nameservers: "ns1.godaddy.com, ns2.godaddy.com",
      credentialsPlaceholder: "Managed on client profile",
      notes: "Payment Status: Paid. Remarks: 2,557"
    },
    {
      id: "D002",
      clientId: "C010",
      domainName: "agtechnosolutions.in",
      registrar: "Hostinger",
      registrationDate: "2026-06-06",
      expiryDate: "2027-06-06",
      renewalDate: "2027-06-06",
      autoRenewal: "Yes",
      status: "Active",
      renewalCost: 1300,
      dnsStatus: "OK",
      sslStatus: "Active",
      nameservers: "ns1.dns-serv.com, ns2.dns-serv.com",
      credentialsPlaceholder: "Username: agtechno | Pass: **********",
      notes: "Purchased Date: 06/06/2026. Payment Status: Paid."
    },
    {
      id: "D003",
      clientId: "C011",
      domainName: "indusconcretepolishing.com",
      registrar: "Namecheap",
      registrationDate: "2024-07-16",
      expiryDate: "2025-07-16",
      renewalDate: "2025-07-16",
      autoRenewal: "No",
      status: "Expired",
      renewalCost: 1000,
      dnsStatus: "OK",
      sslStatus: "Expired",
      nameservers: "dns1.namecheaphosting.com, dns2.namecheaphosting.com",
      credentialsPlaceholder: "Managed on client profile",
      notes: "Yearly Maintenance: 5000. Remarks: 2440."
    },
    {
      id: "D004",
      clientId: "C012",
      domainName: "thynkdigitalsolutions.com",
      registrar: "GoDaddy",
      registrationDate: "2024-08-27",
      expiryDate: "2025-08-27",
      renewalDate: "2025-08-27",
      autoRenewal: "No",
      status: "Expired",
      renewalCost: 1000,
      dnsStatus: "OK",
      sslStatus: "Expired",
      nameservers: "ns3.godaddy.com, ns4.godaddy.com",
      credentialsPlaceholder: "Managed on client profile",
      notes: "Remarks: 2440."
    },
    {
      id: "D005",
      clientId: "C013",
      domainName: "mpshospitals.in",
      registrar: "Hostinger",
      registrationDate: "2023-09-08",
      expiryDate: "2024-09-08",
      renewalDate: "2024-09-08",
      autoRenewal: "No",
      status: "Expired",
      renewalCost: 1261,
      dnsStatus: "OK",
      sslStatus: "Expired",
      nameservers: "ns1.hostinger.com, ns2.hostinger.com",
      credentialsPlaceholder: "Username: mpshosp | Pass: **********",
      notes: "Remarks: 1951 + 1261 (1261 domain, 1951 hosting)."
    },
    {
      id: "D006",
      clientId: "C014",
      domainName: "mpshospitals.com",
      registrar: "Hostinger",
      registrationDate: "2023-09-08",
      expiryDate: "2024-09-08",
      renewalDate: "2024-09-08",
      autoRenewal: "No",
      status: "Expired",
      renewalCost: 1179,
      dnsStatus: "OK",
      sslStatus: "Expired",
      nameservers: "ns1.hostinger.com, ns2.hostinger.com",
      credentialsPlaceholder: "Username: mpshosp | Pass: **********",
      notes: "Remarks: 1179."
    },
    {
      id: "D007",
      clientId: "C009",
      domainName: "indusdentalcare.com",
      registrar: "GoDaddy",
      registrationDate: "2023-10-28",
      expiryDate: "2024-10-28",
      renewalDate: "2024-10-28",
      autoRenewal: "No",
      status: "Expired",
      renewalCost: 1200,
      dnsStatus: "OK",
      sslStatus: "Expired",
      nameservers: "ns5.godaddy.com, ns6.godaddy.com",
      credentialsPlaceholder: "Managed on client profile",
      notes: "Remarks: 2522."
    },
    {
      id: "D008",
      clientId: "C015",
      domainName: "wincube5s.com",
      registrar: "Hostinger",
      registrationDate: "2025-11-02",
      expiryDate: "2026-11-02",
      renewalDate: "2026-11-02",
      autoRenewal: "Yes",
      status: "Active",
      renewalCost: 1440,
      dnsStatus: "OK",
      sslStatus: "Active",
      nameservers: "ns1.hostinger.com, ns2.hostinger.com",
      credentialsPlaceholder: "Username: wincube | Pass: **********",
      notes: "Remarks: 1,440."
    }
  ],

  hostings: [
    {
      id: "H001",
      clientId: "C008",
      hostingProvider: "Hostinger",
      hostingPlan: "Premium Shared Hosting",
      serverType: "Linux",
      purchaseDate: "2023-05-15",
      expiryDate: "2024-05-15",
      renewalDate: "2024-05-15",
      renewalCost: 1357,
      diskSpace: "100 GB SSD",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2024-05-15",
      backupStatus: "Weekly Auto",
      status: "Expired",
      notes: "Remarks: 2,557. Payment Status: Paid."
    },
    {
      id: "H002",
      clientId: "C010",
      hostingProvider: "Hostinger",
      hostingPlan: "Cloud Startup",
      serverType: "Linux",
      purchaseDate: "2026-06-06",
      expiryDate: "2027-06-06",
      renewalDate: "2027-06-06",
      renewalCost: 2500,
      diskSpace: "200 GB SSD",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2027-06-06",
      backupStatus: "Daily Auto",
      status: "Active",
      notes: "Purchased Date: 06/06/2026. Payment Status: Paid."
    },
    {
      id: "H003",
      clientId: "C011",
      hostingProvider: "Hostinger",
      hostingPlan: "Premium Shared",
      serverType: "Linux",
      purchaseDate: "2024-07-16",
      expiryDate: "2025-07-16",
      renewalDate: "2025-07-16",
      renewalCost: 1440,
      diskSpace: "100 GB",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2025-07-16",
      backupStatus: "Weekly Auto",
      status: "Expired",
      notes: "Yearly Maintenance: 5000. Remarks: 2440."
    },
    {
      id: "H004",
      clientId: "C012",
      hostingProvider: "Hostinger",
      hostingPlan: "Cloud Professional",
      serverType: "Linux",
      purchaseDate: "2024-08-27",
      expiryDate: "2025-08-27",
      renewalDate: "2025-08-27",
      renewalCost: 1440,
      diskSpace: "250 GB",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2025-08-27",
      backupStatus: "Daily Auto",
      status: "Expired",
      notes: "Remarks: 2440."
    },
    {
      id: "H005",
      clientId: "C013",
      hostingProvider: "Hostinger",
      hostingPlan: "Premium Shared",
      serverType: "Linux",
      purchaseDate: "2023-09-08",
      expiryDate: "2024-09-08",
      renewalDate: "2024-09-08",
      renewalCost: 1951,
      diskSpace: "100 GB",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2024-09-08",
      backupStatus: "Weekly Auto",
      status: "Expired",
      notes: "Remarks: 1951 + 1261 (1951 hosting, 1261 domain)."
    },
    {
      id: "H006",
      clientId: "C014",
      hostingProvider: "Hostinger",
      hostingPlan: "Premium Shared",
      serverType: "Linux",
      purchaseDate: "2023-09-08",
      expiryDate: "2024-09-08",
      renewalDate: "2024-09-08",
      renewalCost: 0,
      diskSpace: "100 GB",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2024-09-08",
      backupStatus: "Weekly Auto",
      status: "Expired",
      notes: "Remarks: 1179."
    },
    {
      id: "H007",
      clientId: "C009",
      hostingProvider: "Hostinger",
      hostingPlan: "Premium Shared",
      serverType: "Linux",
      purchaseDate: "2023-10-28",
      expiryDate: "2024-10-28",
      renewalDate: "2024-10-28",
      renewalCost: 1322,
      diskSpace: "100 GB",
      bandwidth: "Unlimited",
      controlPanel: "hPanel",
      sslExpiry: "2024-10-28",
      backupStatus: "Weekly Auto",
      status: "Expired",
      notes: "Remarks: 2522."
    },
    {
      id: "H008",
      clientId: "C015",
      hostingProvider: "Hostinger",
      hostingPlan: "Single Shared",
      serverType: "Linux",
      purchaseDate: "2025-11-02",
      expiryDate: "2026-11-02",
      renewalDate: "2026-11-02",
      renewalCost: 0,
      diskSpace: "50 GB",
      bandwidth: "100 GB",
      controlPanel: "hPanel",
      sslExpiry: "2026-11-02",
      backupStatus: "Weekly Auto",
      status: "Active",
      notes: "Remarks: 1,440."
    }
  ],

  metaAds: [
    {
      id: "MC001",
      clientName: "RIG Fabrication",
      campaignName: "Earthing Leads",
      objective: "Lead Generation",
      packageAmount: 15000,
      adBudget: 10000,
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      status: "Running",
      assignedEmployeeId: "E002",
      remarks: "Good response so far",
      dailyPerformance: [
        { date: "2026-07-01", adSpend: 350, reach: 2850, clicks: 78, leads: 6, remarks: "Good response" },
        { date: "2026-07-02", adSpend: 420, reach: 3420, clicks: 95, leads: 9, remarks: "CPL improved" },
        { date: "2026-07-03", adSpend: 380, reach: 3100, clicks: 82, leads: 7, remarks: "Stable performance" }
      ],
      payments: [
        { date: "2026-07-01", amount: 5000, mode: "UPI", transactionId: "TXN123", remarks: "Advance" },
        { date: "2026-07-10", amount: 5000, mode: "Bank Transfer", transactionId: "TXN155", remarks: "Second Payment" },
        { date: "2026-07-28", amount: 5000, mode: "Cash", transactionId: "TXN199", remarks: "Final Payment" }
      ],
      notes: [
        { id: "MN101", title: "Budget Adjustment", description: "Increased daily budget limit to capture peak hour traffic.", date: "2026-07-02 10:00", createdBy: "Neha Sharma", priority: "Medium", tags: "Budget" },
        { id: "MN102", title: "Creative Refresh", description: "Uploaded new Earth-rod product display banners.", date: "2026-07-05 14:30", createdBy: "Neha Sharma", priority: "Low", tags: "Creative" }
      ],
      followups: [
        { id: "MF101", date: "2026-07-01", nextFollowup: "2026-07-05", type: "WhatsApp", summary: "Sent onboarding checklist for Meta campaign", assignedEmployeeId: "E002", status: "Completed" },
        { id: "MF102", date: "2026-07-05", nextFollowup: "2026-07-15", type: "Phone Call", summary: "Reviewed week 1 leads sheet with client", assignedEmployeeId: "E002", status: "Completed" }
      ],
      timeline: [
        { timestamp: "2026-07-01 09:00:00", text: "Campaign Created", icon: "fa-plus", eventType: "create" },
        { timestamp: "2026-07-01 18:30:00", text: "Daily Performance Added", icon: "fa-chart-line", eventType: "performance" },
        { timestamp: "2026-07-02 10:00:00", text: "Budget Increased to ₹500/day", icon: "fa-arrow-up", eventType: "budget" },
        { timestamp: "2026-07-05 12:00:00", text: "₹5,000 Payment Received", icon: "fa-receipt", eventType: "payment" }
      ]
    },
    {
      id: "MC002",
      clientName: "RIG Fabrication",
      campaignName: "Lightning Arrestor",
      objective: "WhatsApp Leads",
      packageAmount: 20000,
      adBudget: 12000,
      startDate: "2026-06-15",
      endDate: "2026-07-15",
      status: "Completed",
      assignedEmployeeId: "E002",
      remarks: "High conversions",
      dailyPerformance: [
        { date: "2026-06-15", adSpend: 400, reach: 3100, clicks: 88, leads: 8, remarks: "Launched successfully" },
        { date: "2026-06-16", adSpend: 410, reach: 3200, clicks: 90, leads: 9, remarks: "Consistent response" }
      ],
      payments: [
        { date: "2026-06-15", amount: 10000, mode: "UPI", transactionId: "TXN150", remarks: "50% Advance" },
        { date: "2026-07-15", amount: 10000, mode: "UPI", transactionId: "TXN151", remarks: "Final Settlement" }
      ],
      notes: [],
      followups: [],
      timeline: [
        { timestamp: "2026-06-15 09:30:00", text: "Campaign Created", icon: "fa-plus", eventType: "create" }
      ]
    },
    {
      id: "MC003",
      clientName: "RIG Fabrication",
      campaignName: "GI Strip Campaign",
      objective: "Messages",
      packageAmount: 10000,
      adBudget: 7000,
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      status: "Scheduled",
      assignedEmployeeId: "E002",
      remarks: "Banners approved by client",
      dailyPerformance: [],
      payments: [
        { date: "2026-06-25", amount: 5000, mode: "UPI", transactionId: "TXN180", remarks: "Initial token booking amount" }
      ],
      notes: [],
      followups: [],
      timeline: [
        { timestamp: "2026-06-25 11:00:00", text: "Campaign Scheduled & Token Received", icon: "fa-calendar", eventType: "schedule" }
      ]
    },
    {
      id: "MC004",
      clientName: "Indus Dental Care",
      campaignName: "Dental Implants Campaign",
      objective: "Lead Generation",
      packageAmount: 12000,
      adBudget: 8000,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      status: "Completed",
      assignedEmployeeId: "E002",
      remarks: "Satisfactory cost per lead",
      dailyPerformance: [
        { date: "2026-02-01", adSpend: 300, reach: 2100, clicks: 60, leads: 5, remarks: "Initial launch" },
        { date: "2026-02-02", adSpend: 320, reach: 2400, clicks: 72, leads: 6, remarks: "Cost per lead stable" }
      ],
      payments: [
        { date: "2026-02-01", amount: 6000, mode: "UPI", transactionId: "TXN201", remarks: "First Milestone" },
        { date: "2026-02-20", amount: 6000, mode: "Bank Transfer", transactionId: "TXN202", remarks: "Final Settlement" }
      ],
      notes: [],
      followups: [],
      timeline: [
        { timestamp: "2026-02-01 10:00:00", text: "Campaign Created", icon: "fa-plus", eventType: "create" }
      ]
    },
    {
      id: "MC005",
      clientName: "Indus Dental Care",
      campaignName: "Teeth Whitening Promo",
      objective: "WhatsApp Leads",
      packageAmount: 13000,
      adBudget: 9000,
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      status: "Completed",
      assignedEmployeeId: "E002",
      remarks: "Full advance paid",
      dailyPerformance: [
        { date: "2026-03-01", adSpend: 250, reach: 1800, clicks: 50, leads: 4, remarks: "Good response" }
      ],
      payments: [
        { date: "2026-03-01", amount: 13000, mode: "Bank Transfer", transactionId: "TXN301", remarks: "Full Advance Package Cost" }
      ],
      notes: [],
      followups: [],
      timeline: [
        { timestamp: "2026-03-01 09:00:00", text: "Campaign Created", icon: "fa-plus", eventType: "create" }
      ]
    }
  ],

  googleAds: [],

  seo: [
    {
      id: "SEO002",
      clientId: "C009",
      websiteUrl: "https://www.indusdentalcare.com",
      campaignName: "Indus Dental Care SEO",
      package: "Silver",
      startDate: "2026-02-15",
      endDate: "2026-08-15",
      budget: 35000,
      status: "Active",
      reportDate: "2026-07-02",
      reportFrequency: "Weekly",
      targetKeywords: "Target Keywords",
      currentRanking: "Page 1 - Rank 10+",
      articlesPublished: 0,
      backlinks: 0,
      reportFile: "",
      assignedEmployeeId: "",
      progress: 0,
      notes: "Auto-synchronized from Service Contract.",
      keywords: [
        { id: "KW004", keyword: "Target Keywords", targetUrl: "https://www.indusdentalcare.com", searchEngine: "Google", location: "Local", device: "Mobile", currentRank: 11, previousRank: 15, searchVolume: 500, difficulty: 32, status: "Improved" }
      ],
      weeklyLog: [
        { weekDate: "2026-06-20", keyword: "Target Keywords", prevRank: 15, currRank: 11, rankChange: 4, status: "Improved", remarks: "Local business listing verified." }
      ],
      uploadedReports: [],
      ga4: {
        users: 1200,
        sessions: 1600,
        engagedSessions: 950,
        views: 2800,
        bounceRate: 40.5,
        avgEngagementTime: 98,
        conversions: 45
      },
      gsc: {
        totalClicks: 320,
        totalImpressions: 9500,
        avgCtr: 3.37,
        avgPosition: 22.8,
        topQueries: [
          { query: "best dentist in location", clicks: 120, impressions: 1800 },
          { query: "indus dental care appointments", clicks: 95, impressions: 500 }
        ],
        topPages: [
          { page: "/", clicks: 210, impressions: 3800 },
          { page: "/book-appointment", clicks: 90, impressions: 2500 }
        ]
      }
    }
  ],

  projects: [],

  payments: [],

  invoices: [],

  followups: [],

  reminders: [
    { id: "R001", title: "RIG Fabrication Hosting Expired", description: "RIG Fabrication hosting has expired. Follow up with Ravi for payment of ₹2,557.", clientId: "C008", serviceId: "S003", assignedEmployeeId: "E001", reminderDate: "2026-06-28", reminderTime: "11:00", priority: "High", status: "Active" },
    { id: "R003", title: "Agtechnosolutions Domain & Hosting Active", description: "Agtechnosolutions domain & hosting active until June 2027.", clientId: "C010", serviceId: "S004", assignedEmployeeId: "E001", reminderDate: "2026-07-12", reminderTime: "10:00", priority: "High", status: "Active" }
  ],

  notes: [],

  employees: [],

  attendance: [],

  leaves: [],

  tasks: [],

  timeline: [],

  notifications: [
    { id: "N1", title: "RIG Fabrication Expired", message: "Hosting for RIG Fabrication expired on May 15, 2024.", type: "danger", date: "May 15" },
    { id: "N2", title: "Payment Received", message: "₹3,800 received from Arun (Agtechnosolutions).", type: "success", date: "June 6" },
    { id: "N3", title: "Leave Request", message: "Ankit Kumar requested 5 days leave starting July 15.", type: "info", date: "June 25" }
  ],
  
  canva: [
    { id: "CAN001", clientName: "Thynk Digital", email: "gokul.digitalsolutions@gmail.com", price: 499, purchaseDate: "2025-07-25", renewalDate: "2026-07-25", notes: "Main agency account" },
    { id: "CAN002", clientName: "Elakiya", email: "elakiyamanikandann@gmail.com", price: 499, purchaseDate: "2025-08-24", renewalDate: "2026-08-24", notes: "" },
    { id: "CAN003", clientName: "Vignesh", email: "vigneshraja5148@gmail.com", price: 499, purchaseDate: "2025-09-12", renewalDate: "2026-09-12", notes: "" },
    { id: "CAN004", clientName: "Sowmiya", email: "sowmiya.thynkdigital@gmail.com", price: 499, purchaseDate: "2026-01-07", renewalDate: "2027-01-07", notes: "" },
    { id: "CAN005", clientName: "Thirsha", email: "thirsha.thynkdigital@gmail.com", price: 499, purchaseDate: "2026-02-08", renewalDate: "2027-02-08", notes: "" }
  ],

  billingSoftware: [
    { id: "BS001", clientName: "Hasmi", companyName: "Sree Balaji Textile Spares", clientId: "", price: 3500, maintenance: 2500, purchaseDate: "2026-04-01", renewalDate: "2027-04-01", notes: "" },
    { id: "BS002", clientName: "Hasmi", companyName: "Dhanam Jayam Engineering", clientId: "", price: 2500, maintenance: 2500, purchaseDate: "2026-04-01", renewalDate: "2027-04-01", notes: "" },
    { id: "BS003", clientName: "", companyName: "Jai Matrimony", clientId: "", price: 15000, maintenance: 3500, purchaseDate: "2026-06-01", renewalDate: "2027-06-01", notes: "" }
  ],
  
  settings: {
    agencyName: "Thynk Digital Solution",
    email: "contact@thynkdigital.in",
    phone: "9876543210",
    website: "https://www.thynkdigital.in",
    currencySymbol: "₹",
    gstPercentage: 18
  }
};
