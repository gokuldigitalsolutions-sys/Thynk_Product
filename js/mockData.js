// Thynk Digital Solution - CRM & HRMS Mock Seed Data

const initialCRMData = {
  leads: [
    { id: "L001", companyName: "Nexus Retailers", contactName: "Ananya Sharma", mobile: "9876543210", email: "contact@nexusretail.com", source: "Website Inquiry", value: 45000, status: "Hot", assignedEmployeeId: "E002", notes: "Very interested in Meta Ads packages.", dateCreated: "2026-06-15" },
    { id: "L002", companyName: "Apex Wellness Cafe", contactName: "Rohan Verma", mobile: "9812345678", email: "info@apexwellness.in", source: "Instagram DM", value: 30000, status: "Warm", assignedEmployeeId: "E003", notes: "Needs logo and local SEO optimization.", dateCreated: "2026-06-20" },
    { id: "L003", companyName: "Trident Logistics", contactName: "Vikram Malhotra", mobile: "8888777766", email: "v.malhotra@tridentlog.com", source: "LinkedIn Outreach", value: 120000, status: "Cold", assignedEmployeeId: "E001", notes: "Sent agency pitch deck. Waiting for reply.", dateCreated: "2026-06-10" },
    { id: "L004", companyName: "Saffron Spices Co.", contactName: "Pooja Patel", mobile: "7776665554", email: "sales@saffronspices.com", source: "Referral", value: 85000, status: "Hot", assignedEmployeeId: "E004", notes: "Needs Website development and SEO package.", dateCreated: "2026-06-25" },
    { id: "L005", companyName: "Zenith Realties", contactName: "Kabir Mehta", mobile: "9900990099", email: "info@zenithrealty.in", source: "Google Search", value: 200000, status: "Warm", assignedEmployeeId: "E002", notes: "Inquired about Meta + Google Ads lead generation.", dateCreated: "2026-06-22" }
  ],
  
  clients: [
    {
      id: "C001",
      companyName: "Zenith Tech Labs",
      clientName: "Rahul Sen",
      mobile: "9876501234",
      whatsapp: "9876501234",
      email: "rahul@zenithlabs.com",
      website: "https://www.zenithlabs.com",
      category: "IT Services",
      gst: "27AAAAA1111A1Z1",
      address: "402, Supreme Chambers, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      logo: "Z",
      source: "Google Ads",
      assignedEmployeeId: "E001",
      status: "Active",
      priority: "High",
      dateCreated: "2025-01-10"
    },
    {
      id: "C002",
      companyName: "Bella Vita Salon & Spa",
      clientName: "Priya Nair",
      mobile: "9820011223",
      whatsapp: "9820011223",
      email: "priya@bellavitasalon.in",
      website: "https://www.bellavitasalon.in",
      category: "Beauty & Wellness",
      gst: "27BBBBB2222B2Z2",
      address: "G-12, Ground Floor, Galleria Mall",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      logo: "B",
      source: "Instagram Outreach",
      assignedEmployeeId: "E003",
      status: "Active",
      priority: "Medium",
      dateCreated: "2025-03-15"
    },
    {
      id: "C003",
      companyName: "Nutan Builders & Developers",
      clientName: "Amit Shah",
      mobile: "9930055443",
      whatsapp: "9930055443",
      email: "info@nutanbuilders.com",
      website: "https://www.nutanbuilders.com",
      category: "Real Estate",
      gst: "",
      address: "101, Nutan Heights, SV Road, Bandra",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      logo: "N",
      source: "Referral",
      assignedEmployeeId: "E002",
      status: "Active",
      priority: "High",
      dateCreated: "2024-11-20"
    },
    {
      id: "C004",
      companyName: "Globex Logistics",
      clientName: "John D'Souza",
      mobile: "9167008899",
      whatsapp: "9167008899",
      email: "operations@globexlogistics.co.in",
      website: "https://www.globexlogistics.co.in",
      category: "Logistics",
      gst: "27CCCCC3333C3Z3",
      address: "Building No. 5, Sector 17, Vashi",
      city: "Navi Mumbai",
      state: "Maharashtra",
      country: "India",
      logo: "G",
      source: "LinkedIn",
      assignedEmployeeId: "E004",
      status: "Inactive",
      priority: "Low",
      dateCreated: "2024-05-05"
    },

    {
      id: "C006",
      companyName: "ABC Builders",
      clientName: "Rakesh Gupta",
      mobile: "9911223344",
      whatsapp: "9911223344",
      email: "info@abcbuilders.com",
      website: "https://www.abcbuilders.com",
      category: "Real Estate",
      gst: "27ABCB1234A1Z1",
      address: "Building B, Central Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      logo: "A",
      source: "Referral",
      assignedEmployeeId: "E002",
      status: "Active",
      priority: "Medium",
      dateCreated: "2026-01-01"
    },

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
    { id: "S001", clientId: "C001", serviceName: "Meta Ads Management", package: "Growth Pro", startDate: "2026-01-10", endDate: "2026-07-10", renewalDate: "2026-07-10", assignedEmployeeId: "E002", cost: 60000, discount: 5000, finalAmount: 55000, status: "Running", notes: "Focus on B2B courses." },
    { id: "S002", clientId: "C001", serviceName: "SEO Management", package: "Enterprise SEO", startDate: "2026-01-10", endDate: "2027-01-10", renewalDate: "2027-01-10", assignedEmployeeId: "E004", cost: 120000, discount: 10000, finalAmount: 110000, status: "Running", notes: "Targeting high value IT keywords globally." },
    { id: "S003", clientId: "C008", serviceName: "Hosting Renewal", package: "RIG Earthing Hosting", startDate: "2023-05-15", endDate: "2024-05-15", renewalDate: "2024-05-15", assignedEmployeeId: "E001", cost: 2557, discount: 0, finalAmount: 2557, status: "Expired", notes: "Domain: rigearthing.com" },
    { id: "S004", clientId: "C010", serviceName: "Domain Renewal", package: "Agtechno Domain & Hosting", startDate: "2026-06-06", endDate: "2027-06-06", renewalDate: "2027-06-06", assignedEmployeeId: "E001", cost: 3800, discount: 0, finalAmount: 3800, status: "Running", notes: "Domain: agtechnosolutions.in" },
    
    { id: "S005", clientId: "C002", serviceName: "Social Media Management", package: "Essential Branding", startDate: "2026-03-15", endDate: "2026-09-15", renewalDate: "2026-09-15", assignedEmployeeId: "E003", cost: 35000, discount: 2000, finalAmount: 33000, status: "Running", notes: "12 Posts/month + Reels editing." },
    { id: "S006", clientId: "C002", serviceName: "Meta Ads Management", package: "Starter Lead Gen", startDate: "2026-03-20", endDate: "2026-06-20", renewalDate: "2026-07-20", assignedEmployeeId: "E003", cost: 25000, discount: 0, finalAmount: 25000, status: "Expired", notes: "Beauty package lead generation." },
    
    { id: "S007", clientId: "C003", serviceName: "Website Development", package: "Custom WordPress Portal", startDate: "2026-05-10", endDate: "2026-07-15", renewalDate: "2026-07-15", assignedEmployeeId: "E001", cost: 150000, discount: 15000, finalAmount: 135000, status: "Running", notes: "RERA compliant builder site with inventory listing." },
    { id: "S008", clientId: "C011", serviceName: "Hosting Renewal", package: "Indus Concrete Hosting", startDate: "2024-07-16", endDate: "2025-07-16", renewalDate: "2025-07-16", assignedEmployeeId: "E001", cost: 2440, discount: 0, finalAmount: 2440, status: "Expired", notes: "Domain: indusconcretepolishing.com" },
    { id: "S009", clientId: "C012", serviceName: "Domain Renewal", package: "Thynk Domain & Hosting", startDate: "2024-08-27", endDate: "2025-08-27", renewalDate: "2025-08-27", assignedEmployeeId: "E001", cost: 2440, discount: 0, finalAmount: 2440, status: "Expired", notes: "Domain: thynkdigitalsolutions.com" },
    
    { id: "S010", clientId: "C004", serviceName: "Google Ads Management", package: "B2B Standard", startDate: "2025-05-05", endDate: "2026-05-05", renewalDate: "2026-05-05", assignedEmployeeId: "E004", cost: 40000, discount: 4000, finalAmount: 36000, status: "Expired", notes: "Paused since client account inactive." }
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

  googleAds: [
    { id: "G001", clientId: "C001", campaignName: "Zenith - Cloud Services Search", objective: "Sales / Signups", packageAmount: 40000, adBudget: 25000, startDate: "2026-05-15", endDate: "2026-08-15", reach: 35000, clicks: 1890, leads: 95, cpl: 263.15, roas: 2.8, status: "Running", assignedEmployeeId: "E004", notes: "High competition keywords targeting enterprise accounts." }
  ],

  seo: [
    {
      id: "SEO01",
      clientId: "C001",
      websiteUrl: "https://www.zenithlabs.com",
      campaignName: "Zenith Tech Labs SEO",
      package: "Gold",
      startDate: "2026-01-10",
      endDate: "2026-07-10",
      budget: 60000,
      status: "Active",
      reportDate: "2026-06-30",
      reportFrequency: "Monthly",
      targetKeywords: "enterprise it consulting services, offshore cloud developer",
      currentRanking: "Page 1 - Rank 4, Page 1 - Rank 8",
      articlesPublished: 14,
      backlinks: 120,
      reportFile: "zenith_labs_seo_may_2026.pdf",
      assignedEmployeeId: "E004",
      progress: 75,
      notes: "Organic traffic increased by 22% month-on-month.",
      keywords: [
        { id: "KW001", keyword: "enterprise it consulting services", targetUrl: "https://www.zenithlabs.com/services", searchEngine: "Google", location: "Global", device: "Desktop", currentRank: 4, previousRank: 7, searchVolume: 1200, difficulty: 65, status: "Improved" },
        { id: "KW002", keyword: "offshore cloud developer", targetUrl: "https://www.zenithlabs.com/cloud", searchEngine: "Google", location: "US", device: "Desktop", currentRank: 8, previousRank: 8, searchVolume: 850, difficulty: 58, status: "No Change" },
        { id: "KW003", keyword: "it outsourcing solutions", targetUrl: "https://www.zenithlabs.com/outsourcing", searchEngine: "Google", location: "Global", device: "Mobile", currentRank: 12, previousRank: 9, searchVolume: 1500, difficulty: 72, status: "Dropped" }
      ],
      weeklyLog: [
        { weekDate: "2026-06-15", keyword: "enterprise it consulting services", prevRank: 7, currRank: 6, rankChange: 1, status: "Improved", remarks: "Backlink index update helped." },
        { weekDate: "2026-06-15", keyword: "offshore cloud developer", prevRank: 8, currRank: 8, rankChange: 0, status: "Stable", remarks: "No rank fluctuations." },
        { weekDate: "2026-06-22", keyword: "enterprise it consulting services", prevRank: 6, currRank: 4, rankChange: 2, status: "Improved", remarks: "New article indexed." },
        { weekDate: "2026-06-22", keyword: "it outsourcing solutions", prevRank: 9, currRank: 12, rankChange: -3, status: "Dropped", remarks: "Competitors bids increased." }
      ],
      uploadedReports: [
        { uploadDate: "2026-05-31", fileName: "zenith_labs_seo_may_2026.pdf", fileSize: "1.8 MB", notes: "Monthly executive summary report", type: "ga4" },
        { uploadDate: "2026-06-15", fileName: "gsc_clicks_mid_june.csv", fileSize: "450 KB", notes: "Mid-month click index raw dump", type: "gsc" }
      ],
      ga4: {
        users: 4800,
        sessions: 6200,
        engagedSessions: 3900,
        views: 12500,
        bounceRate: 37.5,
        avgEngagementTime: 145,
        conversions: 310
      },
      gsc: {
        totalClicks: 2100,
        totalImpressions: 48000,
        avgCtr: 4.38,
        avgPosition: 12.4,
        topQueries: [
          { query: "enterprise cloud consulting", clicks: 420, impressions: 3200 },
          { query: "hire offshore developers", clicks: 310, impressions: 4500 },
          { query: "it outsourcing services global", clicks: 180, impressions: 2100 }
        ],
        topPages: [
          { page: "/services/cloud-consulting", clicks: 850, impressions: 9800 },
          { page: "/careers/offshore-developer", clicks: 620, impressions: 12000 },
          { page: "/blog/it-outsourcing-guide", clicks: 410, impressions: 8400 }
        ]
      }
    },
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

  projects: [
    { id: "P001", clientId: "C003", projectName: "Nutan Custom Builders Portal", websiteType: "Real Estate Portal", domain: "nutanbuilders.com", hosting: "Hostinger Cloud", startDate: "2026-05-10", deliveryDate: "2026-07-15", progress: 80, assignedDeveloperId: "E001", status: "Running", notes: "WordPress setup done, frontend template integrated. Listing API in development." }
  ],

  payments: [
    { id: "PAY001", invoiceNo: "INV-2026-001", clientId: "C001", amount: 30000, date: "2026-01-12", paymentMode: "Bank Transfer", transactionId: "TXN987654321A", receivedById: "E001", remarks: "First advance payment for Meta Ads Setup" },
    { id: "PAY002", invoiceNo: "INV-2026-001", clientId: "C001", amount: 25000, date: "2026-02-15", paymentMode: "UPI / GPay", transactionId: "TXN123456789B", receivedById: "E001", remarks: "Final settlement for invoice 001" },
    { id: "PAY003", invoiceNo: "INV-2026-002", clientId: "C001", amount: 50000, date: "2026-01-20", paymentMode: "Bank Transfer", transactionId: "TXN345678901C", receivedById: "E001", remarks: "First milestone payment for Enterprise SEO" },
    { id: "PAY004", invoiceNo: "INV-2026-003", clientId: "C002", amount: 15000, date: "2026-03-18", paymentMode: "UPI / PhonePe", transactionId: "TXN555666777D", receivedById: "E003", remarks: "Social Media branding start budget" },
    { id: "PAY005", invoiceNo: "INV-2026-004", clientId: "C003", amount: 70000, date: "2026-05-12", paymentMode: "Bank Transfer", transactionId: "TXN777888999E", receivedById: "E001", remarks: "Advance for WordPress Portal" }
  ],

  invoices: [
    { id: "INV-2026-001", clientId: "C001", invoiceDate: "2026-01-10", dueDate: "2026-01-20", serviceId: "S001", grossAmount: 55000, gstRate: 18, gstAmount: 9900, discount: 0, netAmount: 64900, status: "Paid" },
    { id: "INV-2026-002", clientId: "C001", invoiceDate: "2026-01-10", dueDate: "2026-01-25", serviceId: "S002", grossAmount: 110000, gstRate: 18, gstAmount: 19800, discount: 5000, netAmount: 124800, status: "Partial" },
    { id: "INV-2026-003", clientId: "C002", invoiceDate: "2026-03-15", dueDate: "2026-03-30", serviceId: "S005", grossAmount: 33000, gstRate: 18, gstAmount: 5940, discount: 0, netAmount: 38940, status: "Partial" },
    { id: "INV-2026-004", clientId: "C003", invoiceDate: "2026-05-10", dueDate: "2026-05-25", serviceId: "S007", grossAmount: 135000, gstRate: 18, gstAmount: 24300, discount: 10000, netAmount: 149300, status: "Partial" },
    { id: "INV-2026-005", clientId: "C004", invoiceDate: "2025-05-05", dueDate: "2025-05-20", serviceId: "S010", grossAmount: 36000, gstRate: 18, gstAmount: 6480, discount: 0, netAmount: 42480, status: "Pending Payment" }
  ],

  followups: [
    { id: "F001", clientId: "C001", lastContact: "2026-06-20", nextFollowup: "2026-07-02", type: "WhatsApp", assignedEmployeeId: "E002", status: "Pending", remarks: "Ask about Lead Quality reports reviews." },
    { id: "F002", clientId: "C002", lastContact: "2026-06-18", nextFollowup: "2026-06-27", type: "Phone Call", assignedEmployeeId: "E003", status: "Pending", remarks: "Follow-up regarding salon campaign renewal budget." },
    { id: "F003", clientId: "C003", lastContact: "2026-06-25", nextFollowup: "2026-06-28", type: "Meeting", assignedEmployeeId: "E001", status: "Pending", remarks: "Review website landing pages structure." }
  ],

  reminders: [
    { id: "R001", title: "RIG Fabrication Hosting Expired", description: "RIG Fabrication hosting has expired. Follow up with Ravi for payment of ₹2,557.", clientId: "C008", serviceId: "S003", assignedEmployeeId: "E001", reminderDate: "2026-06-28", reminderTime: "11:00", priority: "High", status: "Active" },
    { id: "R002", title: "Client Call - Priya Nair", description: "Discuss Salon Meta Ads packages renewal budgets.", clientId: "C002", serviceId: "S006", assignedEmployeeId: "E003", reminderDate: "2026-06-27", reminderTime: "15:30", priority: "Medium", status: "Active" },
    { id: "R003", title: "Agtechnosolutions Domain & Hosting Active", description: "Agtechnosolutions domain & hosting active until June 2027.", clientId: "C010", serviceId: "S004", assignedEmployeeId: "E001", reminderDate: "2026-07-12", reminderTime: "10:00", priority: "High", status: "Active" },
    { id: "R004", title: "Generate Monthly SEO Report", description: "Publish monthly IT keywords report card.", clientId: "C001", serviceId: "S002", assignedEmployeeId: "E004", reminderDate: "2026-07-01", reminderTime: "18:00", priority: "Medium", status: "Active" }
  ],

  notes: [
    { id: "N001", clientId: "C001", title: "B2B Meta Ads Strategy", description: "Targeting CEOs, CTOs, and HR heads. Ad creative must emphasize efficiency gains.", tags: ["Strategy", "Ads"], createdById: "E002", dateCreated: "2026-06-18 10:20:00", pinned: true },
    { id: "N002", clientId: "C001", title: "SEO Keyword Refinement", description: "Include terms like AI staff augmentation and cloud consulting firms explicitly in future blog briefs.", tags: ["SEO", "Content"], createdById: "E004", dateCreated: "2026-06-22 14:15:00", pinned: false },
    { id: "N003", clientId: "C003", title: "Website Styling Preferences", description: "Amit prefers minimal layout, white backgrounds with blue accents, and responsive maps widget.", tags: ["WebDev", "Styling"], createdById: "E001", dateCreated: "2026-05-15 16:45:00", pinned: true }
  ],

  employees: [
    { id: "E001", photo: "https://randomuser.me/api/portraits/men/32.jpg", name: "Ankit Kumar", phone: "9876598765", email: "ankit@thynkdigital.in", department: "Development", designation: "Lead Web Developer", joiningDate: "2023-05-15", salary: 75000, managerId: "Admin", status: "Active" },
    { id: "E002", photo: "https://randomuser.me/api/portraits/women/44.jpg", name: "Neha Sharma", phone: "9811223344", email: "neha@thynkdigital.in", department: "Digital Marketing", designation: "Meta Ads Specialist", joiningDate: "2024-02-01", salary: 45000, managerId: "Admin", status: "Active" },
    { id: "E003", photo: "https://randomuser.me/api/portraits/women/68.jpg", name: "Sneha Patel", phone: "9900991122", email: "sneha@thynkdigital.in", department: "Client Relations", designation: "Account Manager", joiningDate: "2024-09-10", salary: 40000, managerId: "Admin", status: "Active" },
    { id: "E004", photo: "https://randomuser.me/api/portraits/men/85.jpg", name: "Deepak Rawat", phone: "8877665544", email: "deepak@thynkdigital.in", department: "Digital Marketing", designation: "SEO Lead", joiningDate: "2024-01-20", salary: 50000, managerId: "Admin", status: "Active" }
  ],

  attendance: [
    // Today: 2026-06-26
    { id: "A001", employeeId: "E001", date: "2026-06-26", clockIn: "09:15", clockOut: "18:30", hours: 9.25, status: "Present", late: "No" },
    { id: "A002", employeeId: "E002", date: "2026-06-26", clockIn: "09:48", clockOut: "18:00", hours: 8.2, status: "Late Entry", late: "Yes" },
    { id: "A003", employeeId: "E003", date: "2026-06-26", clockIn: "09:05", clockOut: "18:00", hours: 8.92, status: "Present", late: "No" },
    { id: "A004", employeeId: "E004", date: "2026-06-26", clockIn: "", clockOut: "", hours: 0, status: "Absent", late: "No" },
    
    // Yesterday: 2026-06-25
    { id: "A005", employeeId: "E001", date: "2026-06-25", clockIn: "09:08", clockOut: "18:15", hours: 9.12, status: "Present", late: "No" },
    { id: "A006", employeeId: "E002", date: "2026-06-25", clockIn: "09:20", clockOut: "18:05", hours: 8.75, status: "Present", late: "No" },
    { id: "A007", employeeId: "E003", date: "2026-06-25", clockIn: "09:02", clockOut: "18:10", hours: 9.13, status: "Present", late: "No" },
    { id: "A008", employeeId: "E004", date: "2026-06-25", clockIn: "09:12", clockOut: "18:00", hours: 8.8, status: "Present", late: "No" }
  ],

  leaves: [
    { id: "L01", employeeId: "E002", leaveType: "Sick Leave", startDate: "2026-06-12", endDate: "2026-06-13", totalDays: 2, reason: "Viral fever", status: "Approved" },
    { id: "L02", employeeId: "E004", leaveType: "Casual Leave", startDate: "2026-06-29", endDate: "2026-06-30", totalDays: 2, reason: "Family event out of town", status: "Approved" },
    { id: "L03", employeeId: "E001", leaveType: "Privilege Leave", startDate: "2026-07-15", endDate: "2026-07-20", totalDays: 5, reason: "Summer vacation trip", status: "Pending" }
  ],

  tasks: [
    { id: "T001", taskName: "Set up Nutan builders database schema", description: "Design proper RERA inventory mappings.", clientId: "C003", serviceId: "S007", assignedEmployeeId: "E001", priority: "High", startDate: "2026-05-15", dueDate: "2026-06-15", estHours: 12, progress: 100, status: "Completed", comments: [], attachments: 0 },
    { id: "T002", taskName: "Design site mockups for Amit feedback", description: "Develop mobile prototypes.", clientId: "C003", serviceId: "S007", assignedEmployeeId: "E001", priority: "High", startDate: "2026-06-10", dueDate: "2026-06-28", estHours: 20, progress: 85, status: "In Progress", comments: [], attachments: 1 },
    { id: "T003", taskName: "Review Zenith Lead quality logs", description: "Evaluate target filters optimization.", clientId: "C001", serviceId: "S001", assignedEmployeeId: "E002", priority: "Medium", startDate: "2026-06-20", dueDate: "2026-06-28", estHours: 6, progress: 60, status: "In Progress", comments: [], attachments: 0 },

    { id: "T005", taskName: "Perform audit on Zenith target IT keywords", description: "Determine backlink gap vs main competitors.", clientId: "C001", serviceId: "S002", assignedEmployeeId: "E004", priority: "High", startDate: "2026-06-22", dueDate: "2026-06-27", estHours: 10, progress: 90, status: "Review", comments: [], attachments: 2 }
  ],

  timeline: [
    { timestamp: "2026-06-26 11:30:00", eventType: "payment", icon: "fa-receipt", text: "Recorded payment of ₹70,000 for Nutan Builders (Invoice #INV-2026-004)" },
    { timestamp: "2026-06-26 10:15:00", eventType: "client", icon: "fa-user-plus", text: "Added client Zenith Tech Labs (Rahul Sen)" },
    { timestamp: "2026-06-25 15:45:00", eventType: "service", icon: "fa-cube", text: "Created service Meta Ads Management for Zenith Tech Labs" },
    { timestamp: "2026-06-24 17:00:00", eventType: "task", icon: "fa-check-double", text: "Ankit Kumar completed task 'Set up Nutan builders database schema'" }
  ],

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
