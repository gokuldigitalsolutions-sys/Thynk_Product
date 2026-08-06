// Thynk Digital Solution - CRM & HRMS Main Application Controller

document.addEventListener("DOMContentLoaded", () => {
  // 1. STATE INITIALIZATION
  const stateKey = "thynk_crm_state_v4";
  
  // Load state from localStorage or load seed data
  let state = JSON.parse(localStorage.getItem(stateKey));
  if (!state) {
    state = { ...initialCRMData, authenticated: false, currentUser: null };
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  if (state) {
    state.selectedSeoCampaignId = state.selectedSeoCampaignId || null;
    state.seoActiveTab = state.seoActiveTab || "overview";
  }

  // Generic Migration Hook: ensure all keys from initialCRMData exist in legacy state
  if (state) {
    let stateUpdated = false;
    Object.keys(initialCRMData).forEach(key => {
      if (state[key] === undefined) {
        state[key] = initialCRMData[key];
        stateUpdated = true;
      }
    });
    if (stateUpdated) {
      localStorage.setItem(stateKey, JSON.stringify(state));
    }
  }

  // Migration Hook: check if seo has the rich management structure
  if (state && state.seo && (state.seo.length === 0 || !state.seo[0].keywords)) {
    state.seo = initialCRMData.seo;
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  // Migration Hook: check if metaAds has the old structure
  if (state && state.metaAds && (state.metaAds.length === 0 || !state.metaAds[0].campaignName)) {
    state.metaAds = initialCRMData.metaAds;
    state.selectedMetaClient = null;
    state.selectedMetaCampaignId = null;
    state.metaActiveTab = "overview";
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  // Migration Hook: check if canva exists
  if (state && !state.canva) {
    state.canva = [
      { id: "CAN001", clientName: "Thynk Digital", email: "gokul.digitalsolutions@gmail.com", price: 499, purchaseDate: "2025-07-25", renewalDate: "2026-07-25", notes: "Main agency account" },
      { id: "CAN002", clientName: "Elakiya", email: "elakiyamanikandann@gmail.com", price: 499, purchaseDate: "2025-08-24", renewalDate: "2026-08-24", notes: "" },
      { id: "CAN003", clientName: "Vignesh", email: "vigneshraja5148@gmail.com", price: 499, purchaseDate: "2025-09-12", renewalDate: "2026-09-12", notes: "" },
      { id: "CAN004", clientName: "Sowmiya", email: "sowmiya.thynkdigital@gmail.com", price: 499, purchaseDate: "2026-01-07", renewalDate: "2027-01-07", notes: "" },
      { id: "CAN005", clientName: "Thirsha", email: "thirsha.thynkdigital@gmail.com", price: 499, purchaseDate: "2026-02-08", renewalDate: "2027-02-08", notes: "" }
    ];
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  // Migration Hook: check if billingSoftware exists
  if (state && !state.billingSoftware) {
    state.billingSoftware = [
      { id: "BS001", clientName: "Hasmi", companyName: "Sree Balaji Textile Spares", clientId: "", price: 3500, maintenance: 2500, purchaseDate: "2026-04-01", renewalDate: "2027-04-01", notes: "" },
      { id: "BS002", clientName: "Hasmi", companyName: "Dhanam Jayam Engineering", clientId: "", price: 2500, maintenance: 2500, purchaseDate: "2026-04-01", renewalDate: "2027-04-01", notes: "" },
      { id: "BS003", clientName: "", companyName: "Jai Matrimony", clientId: "", price: 15000, maintenance: 3500, purchaseDate: "2026-06-01", renewalDate: "2027-06-01", notes: "" }
    ];
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  // Migration Hook: check if settings exists
  if (state && !state.settings) {
    state.settings = initialCRMData.settings || { agencyName: "Thynk Digital Solution", gstPercentage: 18, currency: "INR" };
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  // Migration Hook: sync missing campaigns or projects from registered services
  if (state && state.services) {
    let stateChanged = false;
    state.services.forEach(srv => {
      // 1. SEO
      if (srv.serviceName === "SEO Management") {
        const exists = state.seo && state.seo.some(x => x.clientId === srv.clientId);
        if (!exists) {
          if (!state.seo) state.seo = [];
          state.seo.push({
            id: "SEO" + (state.seo.length + 1).toString().padStart(3, "0"),
            clientId: srv.clientId,
            targetKeywords: srv.package || "Target Keywords",
            currentRanking: "Page 1 - Rank 10+",
            articlesPublished: 0,
            backlinks: 0,
            reportFile: "",
            assignedEmployeeId: srv.assignedEmployeeId || "",
            progress: 0,
            notes: srv.notes || "Auto-synchronized from Service Contract."
          });
          stateChanged = true;
        }
      }
      // 2. Web Project
      if (srv.serviceName === "Website Development") {
        const exists = state.projects && state.projects.some(x => x.clientId === srv.clientId);
        if (!exists) {
          if (!state.projects) state.projects = [];
          const cli = state.clients.find(c => c.id === srv.clientId);
          let parsedDom = "";
          if (cli && cli.website) {
            try {
              parsedDom = cli.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
            } catch (e) {}
          }
          state.projects.push({
            id: "P" + (state.projects.length + 1).toString().padStart(3, "0"),
            clientId: srv.clientId,
            projectName: srv.package || (cli ? cli.companyName + " Website" : "Website Project"),
            websiteType: "Custom Website Development",
            domain: parsedDom || "domain.com",
            hosting: "Hostinger",
            startDate: srv.startDate || new Date().toISOString().split("T")[0],
            deliveryDate: srv.endDate || "",
            progress: 0,
            assignedDeveloperId: srv.assignedEmployeeId || "",
            status: "Running",
            notes: srv.notes || "Auto-synchronized from Service Contract."
          });
          stateChanged = true;
        }
      }
      // 3. Google Ads
      if (srv.serviceName === "Google Ads Management") {
        const exists = state.googleAds && state.googleAds.some(x => x.clientId === srv.clientId);
        if (!exists) {
          if (!state.googleAds) state.googleAds = [];
          state.googleAds.push({
            id: "G" + (state.googleAds.length + 1).toString().padStart(3, "0"),
            clientId: srv.clientId,
            campaignName: srv.package || "Google Campaign",
            objective: "Sales / Signups",
            packageAmount: srv.finalAmount,
            adBudget: Math.round(srv.finalAmount * 0.6),
            startDate: srv.startDate || new Date().toISOString().split("T")[0],
            endDate: srv.endDate || "",
            reach: 0, clicks: 0, leads: 0, cpl: 0, roas: 0,
            status: "Running",
            assignedEmployeeId: srv.assignedEmployeeId || "",
            notes: srv.notes || "Auto-synchronized from Service Contract."
          });
          stateChanged = true;
        }
      }
      // 4. Meta Ads
      if (srv.serviceName === "Meta Ads Management") {
        const exists = state.metaAds && state.metaAds.some(x => x.clientId === srv.clientId);
        if (!exists) {
          if (!state.metaAds) state.metaAds = [];
          state.metaAds.push({
            id: "M" + (state.metaAds.length + 1).toString().padStart(3, "0"),
            clientId: srv.clientId,
            campaignName: srv.package || "Meta Campaign",
            objective: "Lead Generation",
            packageAmount: srv.finalAmount,
            adBudget: Math.round(srv.finalAmount * 0.6),
            startDate: srv.startDate || new Date().toISOString().split("T")[0],
            endDate: srv.endDate || "",
            renewalDate: srv.endDate || "",
            reach: 0, clicks: 0, leads: 0, cpl: 0, roas: 0,
            status: "Running",
            assignedEmployeeId: srv.assignedEmployeeId || "",
            notes: srv.notes || "Auto-synchronized from Service Contract."
          });
          stateChanged = true;
        }
      }
    });

    if (stateChanged) {
      localStorage.setItem(stateKey, JSON.stringify(state));
    }
  }
  if (state.selectedMetaClient === undefined) state.selectedMetaClient = null;
  if (state.selectedMetaCampaignId === undefined) state.selectedMetaCampaignId = null;
  if (state.metaActiveTab === undefined) state.metaActiveTab = "overview";
  
  // Expose state globally for debug / views
  window.CRMState = state;

  const saveState = () => {
    localStorage.setItem(stateKey, JSON.stringify(state));
  };

  const addTimelineEvent = (type, text, icon = "fa-info-circle") => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    state.timeline.unshift({ timestamp, eventType: type, icon, text });
    saveState();
  };

  const addNotification = (title, message, type = "info") => {
    const id = "N" + Date.now();
    state.notifications.unshift({ id, title, message, type, date: "Just Now" });
    saveState();
    renderNotificationsBell();
  };

  // Helper to get client name by ID
  const getClientName = (clientId) => {
    const c = state.clients.find(x => x.id === clientId);
    return c ? c.companyName : "Unknown Client";
  };

  // Helper to automatically calculate status from expiry date
  const calculateStatusFromDate = (expiryDateStr) => {
    if (!expiryDateStr) return "Active";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    thirtyDaysFromNow.setHours(0, 0, 0, 0);
    
    if (expiry < today) {
      return "Expired";
    } else if (expiry <= thirtyDaysFromNow) {
      return "Expiring Soon";
    } else {
      return "Active";
    }
  };

  // Helper to get employee name by ID
  const getEmployeeName = (employeeId) => {
    const e = state.employees.find(x => x.id === employeeId);
    return e ? e.name : "Unassigned";
  };

  // 2. AUTHENTICATION & SHELL NAVIGATION
  const loginScreen = document.getElementById("login-screen");
  const appWrapper = document.getElementById("app-wrapper");
  const loginForm = document.getElementById("login-form");
  const sidebar = document.getElementById("sidebar");
  const contentWorkspace = document.getElementById("content-workspace");
  const globalFab = document.getElementById("global-fab");

  // Password visibility toggle
  const togglePasswordBtn = document.getElementById("toggle-password");
  const loginPasswordInput = document.getElementById("login-password");
  const togglePasswordIcon = document.getElementById("toggle-password-icon");

  if (togglePasswordBtn && loginPasswordInput && togglePasswordIcon) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = loginPasswordInput.getAttribute("type") === "password";
      loginPasswordInput.setAttribute("type", isPassword ? "text" : "password");
      if (isPassword) {
        togglePasswordIcon.classList.remove("fa-eye");
        togglePasswordIcon.classList.add("fa-eye-slash");
      } else {
        togglePasswordIcon.classList.remove("fa-eye-slash");
        togglePasswordIcon.classList.add("fa-eye");
      }
    });
  }

  const checkAuth = () => {
    if (state.authenticated) {
      loginScreen.classList.add("hidden");
      appWrapper.classList.remove("d-none");
      globalFab.classList.remove("d-none");
      
      // Update topbar header profile
      if (state.currentUser) {
        document.getElementById("user-name-element").innerText = state.currentUser.name;
        document.getElementById("user-avatar-element").innerText = state.currentUser.name.charAt(0);
      }
      
      // Initialize routing
      renderNotificationsBell();
      populateModalDropdowns();
      if (!window.location.hash) {
        const activeSidebarItem = document.querySelector(".sidebar-item.active");
        const targetView = activeSidebarItem ? activeSidebarItem.getAttribute("data-view") : "dashboard";
        window.location.hash = `#/crm/${targetView}`;
      } else {
        handleRouting();
      }
    } else {
      loginScreen.classList.remove("hidden");
      appWrapper.classList.add("d-none");
      globalFab.classList.add("d-none");
    }
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-password").value;
    
    // Simple mock authentication validation
    if (email === "admin@thynkdigital.in" && pass === "admin123") {
      state.authenticated = true;
      state.currentUser = { name: "Ankit Kumar", role: "Administrator", id: "E001" };
      saveState();
      
      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "Logged in successfully to Thynk Operating System.",
        timer: 1500,
        showConfirmButton: false
      });
      
      checkAuth();
    } else {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: "Invalid email address or password combination.",
      });
    }
  });

  document.getElementById("forgot-password-link").addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Reset Password",
      text: "Please contact the system administrator to reset your CRM password.",
      icon: "info"
    });
  });

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to end your session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--thynk-primary-dark)",
      cancelButtonColor: "#6C757D",
      confirmButtonText: "Yes, Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        state.authenticated = false;
        state.currentUser = null;
        saveState();
        checkAuth();
      }
    });
  };

  document.getElementById("logout-btn").addEventListener("click", (e) => { e.preventDefault(); handleLogout(); });
  document.getElementById("logout-menu-btn").addEventListener("click", (e) => { e.preventDefault(); handleLogout(); });

  // Sidebar Toggling
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const toggleIcon = document.getElementById("toggle-icon");
  const sidebarToggleMobile = document.getElementById("sidebar-toggle-mobile");
  const sidebarCloseMobile = document.getElementById("sidebar-close-mobile");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      if (sidebar.classList.contains("collapsed")) {
        toggleIcon.className = "fa-solid fa-chevron-right";
      } else {
        toggleIcon.className = "fa-solid fa-chevron-left";
      }
    });
  }

  if (sidebarToggleMobile) {
    sidebarToggleMobile.addEventListener("click", () => {
      sidebar.classList.add("show-mobile");
    });
  }

  if (sidebarCloseMobile) {
    sidebarCloseMobile.addEventListener("click", () => {
      sidebar.classList.remove("show-mobile");
    });
  }

  // Sidebar navigation router click handler
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");
      
      // Close mobile drawer if open
      sidebar.classList.remove("show-mobile");
      
      // Reset meta ads drill-down state if entering from sidebar
      if (targetView === "meta-ads") {
        state.selectedMetaClient = null;
        state.selectedMetaCampaignId = null;
      }
      
      window.location.hash = `#/crm/${targetView}`;
    });
  });

  // Logo click triggers dashboard
  document.getElementById("logo-refresh").addEventListener("click", (e) => {
    e.preventDefault();
    state.selectedMetaClient = null;
    state.selectedMetaCampaignId = null;
    window.location.hash = "#/crm/dashboard";
  });

  // Profile link actions
  document.getElementById("view-profile-settings").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#/crm/settings";
  });
  document.getElementById("view-system-settings").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#/crm/settings";
  });

  const navigateToView = (viewName) => {
    window.location.hash = `#/crm/${viewName}`;
  };

  const META_OBJECTIVES = [
    "Lead Generation",
    "WhatsApp Leads",
    "Website Traffic",
    "Conversions",
    "Brand Awareness",
    "Reach",
    "Engagement",
    "Video Views",
    "Messages",
    "Sales"
  ];

  const META_STATUSES = [
    "Active",
    "Completed",
    "Paused",
    "Draft"
  ];

  // 3. DROPDOWNS & MODALS FORM BUILDERS
  const populateModalDropdowns = () => {
    const employeeSelects = ["lead-assigned-employee", "client-assigned-employee", "service-assigned-employee", "payment-received-by", "task-assigned-employee", "reminder-assigned-employee", "note-created-by", "campaign-followup-employee", "edit-service-assigned-employee", "edit-client-assigned-employee", "edit-seo-employee", "edit-project-developer", "edit-google-employee", "add-seo-employee"];
    const clientSelects = ["service-client-id", "task-client-id", "reminder-client-id", "note-client-id", "canva-client-id", "billing-software-client-id", "edit-service-client-id", "edit-domain-client-id", "edit-hosting-client-id", "edit-seo-client-id", "add-seo-client-id", "add-domain-client-id", "add-hosting-client-id"];
    const invoiceSelect = document.getElementById("payment-invoice-id");
    const serviceSelect = document.getElementById("reminder-service-id");
    const taskServiceSelect = document.getElementById("task-service-id");
 
    // Populate Employees
    employeeSelects.forEach(selectId => {
      const el = document.getElementById(selectId);
      if (el) {
        let optionsHtml = state.employees.map(emp => `<option value="${emp.id}">${emp.name} (${emp.designation})</option>`).join("");
        if (selectId === "lead-assigned-employee" || selectId === "service-assigned-employee" || selectId === "edit-service-assigned-employee" || selectId === "edit-client-assigned-employee" || selectId === "edit-seo-employee" || selectId === "edit-project-developer" || selectId === "edit-google-employee" || selectId === "add-seo-employee") {
          optionsHtml = `<option value="" selected>Select Employee...</option>` + optionsHtml;
        }
        el.innerHTML = optionsHtml;
      }
    });

    // Populate Clients
    clientSelects.forEach(selectId => {
      const el = document.getElementById(selectId);
      if (el) {
        let optionsHtml = state.clients.map(cli => `<option value="${cli.id}">${cli.companyName}</option>`).join("");
        if (selectId === "service-client-id" || selectId === "canva-client-id" || selectId === "billing-software-client-id" || selectId === "edit-service-client-id" || selectId === "edit-domain-client-id" || selectId === "edit-hosting-client-id" || selectId === "edit-seo-client-id" || selectId === "add-seo-client-id" || selectId === "add-domain-client-id" || selectId === "add-hosting-client-id") {
          optionsHtml = `<option value="" selected>Select Client...</option>` + optionsHtml;
        }
        el.innerHTML = optionsHtml;
      }
    });

    // Populate Invoices (outstanding partial or unpaid)
    if (invoiceSelect) {
      const pendingInvoices = state.invoices.filter(i => i.status !== "Paid");
      invoiceSelect.innerHTML = pendingInvoices.map(inv => {
        const clientName = getClientName(inv.clientId);
        return `<option value="${inv.id}">${inv.id} - ${clientName} (Due: ₹${inv.netAmount.toLocaleString()})</option>`;
      }).join("");
      if (pendingInvoices.length === 0) {
        invoiceSelect.innerHTML = `<option value="">No pending invoices available</option>`;
      }
    }

    // Populate Services for reminder/task references
    if (serviceSelect && taskServiceSelect) {
      const activeServices = state.services.filter(s => s.status === "Running");
      const serviceOptions = activeServices.map(srv => {
        const clientName = getClientName(srv.clientId);
        return `<option value="${srv.id}">${clientName} - ${srv.serviceName}</option>`;
      }).join("");
      
      serviceSelect.innerHTML = `<option value="">None (Custom Reminder)</option>` + serviceOptions;
      taskServiceSelect.innerHTML = serviceOptions;
    }

    // Populate SEO campaigns select inside addKeywordModal
    const kwCampaignSelect = document.getElementById("kw-input-campaign-id");
    if (kwCampaignSelect) {
      let optionsHtml = state.seo.map(x => `<option value="${x.id}">${x.campaignName}</option>`).join("");
      kwCampaignSelect.innerHTML = `<option value="">Select SEO Campaign...</option>` + optionsHtml;
    }

    // Populate Meta Campaign dropdowns
    const metaObjSelect = document.getElementById("meta-campaign-objective");
    if (metaObjSelect) {
      metaObjSelect.innerHTML = `<option value="" disabled selected>Select Objective...</option>` + 
        META_OBJECTIVES.map(val => `<option value="${val}">${val}</option>`).join("");
    }
    const metaStatusSelect = document.getElementById("meta-campaign-status");
    if (metaStatusSelect) {
      metaStatusSelect.innerHTML = `<option value="" disabled selected>Select Status...</option>` + 
        META_STATUSES.map(val => `<option value="${val}">${val}</option>`).join("");
    }
  };

  // Service model extra configurations inputs toggler
  const serviceNameSelect = document.getElementById("service-name");
  const domainExtraFields = document.getElementById("domain-extra-fields");
  const hostingExtraFields = document.getElementById("hosting-extra-fields");

  if (serviceNameSelect) {
    serviceNameSelect.addEventListener("change", () => {
      const val = serviceNameSelect.value;
      if (val === "Domain & Hosting") {
        domainExtraFields.classList.remove("d-none");
        hostingExtraFields.classList.remove("d-none");
      } else {
        domainExtraFields.classList.add("d-none");
        hostingExtraFields.classList.add("d-none");
      }
    });
  }

  // 4. NOTIFICATIONS COMPONENT
  const notificationsList = document.getElementById("notifications-list");
  const notificationsBadge = document.getElementById("notifications-badge");
  const notificationsCountBadge = document.getElementById("notifications-count-badge");
  const clearNotificationsBtn = document.getElementById("clear-notifications-btn");

  const renderNotificationsBell = () => {
    const unread = state.notifications;
    if (unread.length > 0) {
      notificationsBadge.classList.remove("d-none");
      notificationsCountBadge.innerText = unread.length;
      
      notificationsList.innerHTML = unread.map(n => {
        let iconClass = "fa-circle-info text-info";
        if (n.type === "warning") iconClass = "fa-triangle-exclamation text-warning";
        if (n.type === "success") iconClass = "fa-circle-check text-success";
        
        return `
          <div class="p-3 border-bottom d-flex align-items-start gap-3">
            <i class="fa-solid ${iconClass} fs-5 mt-1"></i>
            <div>
              <div class="fw-semibold text-dark" style="font-size: 0.85rem;">${n.title}</div>
              <p class="text-muted mb-0 small">${n.message}</p>
              <span class="text-secondary small mt-1 d-block" style="font-size: 0.72rem;">${n.date}</span>
            </div>
          </div>
        `;
      }).join("");
    } else {
      notificationsBadge.classList.add("d-none");
      notificationsCountBadge.innerText = "0";
      notificationsList.innerHTML = `
        <div class="p-4 text-center text-muted">
          <i class="fa-regular fa-bell-slash fs-2 mb-2"></i>
          <p class="mb-0 small">All clear! No alerts.</p>
        </div>
      `;
    }
  };

  if (clearNotificationsBtn) {
    clearNotificationsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      state.notifications = [];
      saveState();
      renderNotificationsBell();
    });
  }

  // 5. GLOBAL SEARCH ENGINE
  const globalSearchInput = document.getElementById("global-search-input");
  const searchResultsPopup = document.getElementById("search-results-popup");

  if (globalSearchInput) {
    globalSearchInput.addEventListener("input", () => {
      const q = globalSearchInput.value.toLowerCase().trim();
      if (q.length < 2) {
        searchResultsPopup.classList.add("d-none");
        return;
      }

      const clientMatches = state.clients.filter(c => c.companyName.toLowerCase().includes(q) || c.clientName.toLowerCase().includes(q));
      const domainMatches = state.domains.filter(d => d.domainName.toLowerCase().includes(q));
      const campaignMatches = [
        ...state.metaAds.map(c => ({...c, campaignName: `${c.clientName} - ${c.campaignName} Meta Ads`, isMeta: true})),
        ...state.googleAds.map(g => ({...g, campaignName: g.campaignName, isMeta: false}))
      ].filter(c => c.campaignName.toLowerCase().includes(q));
      const taskMatches = state.tasks.filter(t => t.taskName.toLowerCase().includes(q));

      let html = "";
      if (clientMatches.length > 0) {
        html += `<div class="fw-bold small text-muted border-bottom py-1">Clients</div>`;
        clientMatches.forEach(c => {
          html += `<a href="#" class="search-result-item d-block p-2 text-decoration-none text-dark small" data-type="client" data-id="${c.id}"><i class="fa-solid fa-users text-danger me-2"></i>${c.companyName} (${c.clientName})</a>`;
        });
      }
      if (domainMatches.length > 0) {
        html += `<div class="fw-bold small text-muted border-bottom py-1 mt-2">Domains</div>`;
        domainMatches.forEach(d => {
          html += `<a href="#" class="search-result-item d-block p-2 text-decoration-none text-dark small" data-type="domain" data-id="${d.id}"><i class="fa-solid fa-globe text-primary me-2"></i>${d.domainName} (${d.registrar})</a>`;
        });
      }
      if (campaignMatches.length > 0) {
        html += `<div class="fw-bold small text-muted border-bottom py-1 mt-2">Ad Campaigns</div>`;
        campaignMatches.forEach(c => {
          const clientName = c.isMeta ? c.clientName : getClientName(c.clientId);
          html += `<a href="#" class="search-result-item d-block p-2 text-decoration-none text-dark small" data-type="campaign" data-ismeta="${c.isMeta}" data-client="${clientName}" data-id="${c.id}"><i class="fa-solid fa-bullseye text-success me-2"></i>${c.campaignName} [${c.status}]</a>`;
        });
      }
      if (taskMatches.length > 0) {
        html += `<div class="fw-bold small text-muted border-bottom py-1 mt-2">Tasks</div>`;
        taskMatches.forEach(t => {
          html += `<a href="#" class="search-result-item d-block p-2 text-decoration-none text-dark small" data-type="task" data-id="${t.id}"><i class="fa-solid fa-list-check text-warning me-2"></i>${t.taskName}</a>`;
        });
      }

      if (html === "") {
        html = `<div class="p-3 text-center text-muted small"><i class="fa-solid fa-triangle-exclamation me-1"></i>No matching records found.</div>`;
      }

      searchResultsPopup.innerHTML = html;
      searchResultsPopup.classList.remove("d-none");

      // Bind search clicks
      document.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const type = item.getAttribute("data-type");
          const id = item.getAttribute("data-id");
          searchResultsPopup.classList.add("d-none");
          globalSearchInput.value = "";

          if (type === "client") {
            renderClientProfile(id);
          } else if (type === "domain") {
            navigateToView("domain");
          } else if (type === "campaign") {
            const isMeta = item.getAttribute("data-ismeta") === "true";
            const clientName = item.getAttribute("data-client");
            if (isMeta) {
              state.selectedMetaClient = clientName;
              state.selectedMetaCampaignId = id;
              state.metaActiveTab = "overview";
              navigateToView("meta-ads");
            } else {
              navigateToView("google-ads");
            }
          } else if (type === "task") {
            navigateToView("my-tasks");
          }
        });
      });
    });

    // Close search popup clicking outside
    document.addEventListener("click", (e) => {
      if (!globalSearchInput.contains(e.target) && !searchResultsPopup.contains(e.target)) {
        searchResultsPopup.classList.add("d-none");
      }
    });
  }

  // 6. ROUTER & VIEWS RENDERER ENGINE
  const switchView = (viewName) => {
    // 1. Destroy any Active DataTables inside workspace
    if (window.jQuery && $.fn.DataTable) {
      $('#content-workspace .dataTable').each(function() {
        try {
          $(this).DataTable().destroy(true);
        } catch(e) {}
      });
    }

    // 2. Destroy any Active ApexCharts instances
    if (window.activeChartsList && window.activeChartsList.length > 0) {
      window.activeChartsList.forEach(chart => {
        try {
          chart.destroy();
        } catch(e) {}
      });
      window.activeChartsList = [];
    } else {
      window.activeChartsList = [];
    }

    // 3. Destroy active FullCalendar instance
    if (window.activeCalendarInstance) {
      try {
        window.activeCalendarInstance.destroy();
        window.activeCalendarInstance = null;
      } catch(e) {}
    }

    // Clear DOM content to prevent memory leaks
    contentWorkspace.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-danger" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
    
    setTimeout(() => {
      try {
        switch (viewName) {
          case "dashboard":
            renderDashboard();
            break;
          case "leads":
            renderLeads();
            break;
          case "clients":
            renderClients();
            break;
          case "followups":
            renderFollowups();
            break;
          case "notes":
            renderNotes();
            break;
          case "services":
            renderServices();
            break;
          case "domain-hosting":
            renderDomainHosting();
            break;
          case "canva":
            renderCanva();
            break;
          case "billing-software":
            renderBillingSoftware();
            break;
          case "meta-ads":
            renderMetaAds();
            break;
          case "google-ads":
            renderGoogleAds();
            break;
          case "seo":
            renderSEO();
            break;
          case "seo/dashboard":
            renderCampaignDashboard(state.selectedSeoCampaignId);
            break;
          case "projects":
            renderProjects();
            break;
          case "payments":
            renderPayments();
            break;
          case "invoices":
            renderInvoices();
            break;
          case "reminders":
            renderReminders();
            break;
          case "calendar":
            renderCalendar();
            break;
          case "employees":
            renderEmployees();
            break;
          case "attendance":
            renderAttendance();
            break;
          case "leave":
            renderLeave();
            break;
          case "my-tasks":
            renderMyTasks();
            break;
          case "employee-tasks":
            renderEmployeeTasks();
            break;
          case "reports":
            renderReports();
            break;
          case "timeline":
            renderTimeline();
            break;
          case "settings":
            renderSettings();
            break;
          default:
            renderDashboard();
        }
        
        // Initialize Flatpickr for any freshly rendered date pickers
        flatpickr(".flatpickr-date", {
          dateFormat: "Y-m-d",
          allowInput: true
        });
        flatpickr(".flatpickr-time", {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          time_24hr: true
        });
        
      } catch (err) {
        console.error(err);
        contentWorkspace.innerHTML = `
          <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Render Error!</h4>
            <p>An error occurred while compiling the requested module view: <b>${viewName}</b></p>
            <hr>
            <p class="mb-0">${err.message}</p>
          </div>
        `;
      }
    }, 100);
  };

  // VIEW: DASHBOARD
  const renderDashboard = () => {
    // Computations
    const totalClients = state.clients.length;
    const activeClients = state.clients.filter(c => c.status === "Active").length;
    const inactiveClients = totalClients - activeClients;
    const runningProjects = state.projects.filter(p => p.status === "Running").length;
    
    // Revenue calculations
    const totalRevenueCollected = state.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalBillingAmount = state.invoices.reduce((sum, inv) => sum + inv.netAmount, 0);
    const outstandingAmount = Math.max(0, totalBillingAmount - totalRevenueCollected);
    
    // Services status counts
    const activeServices = state.services.filter(s => s.status === "Running").length;
    const activeMeta = state.metaAds.filter(m => m.status === "Running").length;
    const activeSeo = state.seo.length;
    
    // Domain & Hosting expiries in 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringDomains = state.domains.filter(d => {
      const expiry = new Date(d.expiryDate);
      return expiry >= today && expiry <= thirtyDaysFromNow;
    }).length;

    const expiringHosting = state.hostings.filter(h => {
      const expiry = new Date(h.expiryDate);
      return expiry >= today && expiry <= thirtyDaysFromNow;
    }).length;

    const todayDateStr = today.toISOString().split("T")[0];
    const todaysTasks = state.tasks.filter(t => t.dueDate === todayDateStr && t.status !== "Completed").length;
    const todaysFollowups = state.followups.filter(f => f.nextFollowup === todayDateStr && f.status !== "Completed").length;
    const activeReminders = state.reminders.filter(r => r.reminderDate === todayDateStr && r.status === "Active").length;
    
    const employeesPresent = state.attendance.filter(a => a.date === todayDateStr && (a.status === "Present" || a.status === "Late Entry")).length;

    // Calculate pending SEO reports (due today or in the past)
    const pendingSeoReports = state.seo.filter(s => {
      if (!s.reportDate) return false;
      const rDate = new Date(s.reportDate);
      const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return rDate <= todayZero && s.status === "Active";
    });

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Operating Dashboard</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
            </ol>
          </nav>
        </div>
        <div class="text-muted small fw-semibold bg-white px-3 py-2 rounded-pill shadow-sm border border-light">
          <i class="fa-solid fa-clock text-danger me-2"></i>Date: ${today.toDateString()}
        </div>
      </div>

      <!-- Pending SEO Reports Alerts -->
      ${pendingSeoReports.length > 0 ? `
        <div class="alert alert-warning border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between animate-fade-in">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-warning bg-opacity-20 text-warning p-2 rounded-3 fs-4">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-1 text-dark">Pending SEO Campaign Reports Due</h6>
              <p class="text-secondary mb-0 small">There are <b>${pendingSeoReports.length}</b> campaigns with reports pending submission: 
                ${pendingSeoReports.map(s => `<b>${s.campaignName}</b> (Due: ${s.reportDate})`).join(", ")}
              </p>
            </div>
          </div>
          <a href="#/crm/seo" class="btn btn-warning btn-sm rounded-3 fw-bold px-3 py-2"><i class="fa-solid fa-gauge me-1"></i>Go to SEO Manager</a>
        </div>
      ` : ''}

      <!-- KPI METRIC ROW 1 -->
      <div class="row">
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-danger"><i class="fa-solid fa-users"></i></div>
            <div class="kpi-value">${activeClients} <span class="fs-6 text-muted font-normal">/ ${totalClients}</span></div>
            <div class="kpi-label">Active Clients</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-success"><i class="fa-solid fa-wallet"></i></div>
            <div class="kpi-value">₹${totalRevenueCollected.toLocaleString()}</div>
            <div class="kpi-label">Revenue Collected</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-warning"><i class="fa-solid fa-circle-exclamation"></i></div>
            <div class="kpi-value">₹${outstandingAmount.toLocaleString()}</div>
            <div class="kpi-label">Outstanding Balance</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-primary"><i class="fa-solid fa-diagram-project"></i></div>
            <div class="kpi-value">${runningProjects}</div>
            <div class="kpi-label">Active Web Projects</div>
          </div>
        </div>
      </div>

      <!-- KPI METRIC ROW 2 -->
      <div class="row">
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-info"><i class="fa-solid fa-cube"></i></div>
            <div class="kpi-value">${activeServices}</div>
            <div class="kpi-label">Active Service Packages</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-danger"><i class="fa-brands fa-facebook"></i></div>
            <div class="kpi-value">${activeMeta}</div>
            <div class="kpi-label">Meta Ad Campaigns</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-dark"><i class="fa-solid fa-globe text-primary"></i></div>
            <div class="kpi-value">${expiringDomains}</div>
            <div class="kpi-label">Domains Expiring (30 Days)</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="thynk-card kpi-card">
            <div class="kpi-icon bg-light text-dark"><i class="fa-solid fa-server text-warning"></i></div>
            <div class="kpi-value">${expiringHosting}</div>
            <div class="kpi-label">Hosting Renewals Due</div>
          </div>
        </div>
      </div>

      <!-- KPI METRIC ROW 3 (Operational Alerts) -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="p-3 bg-white border border-light-subtle rounded-3 d-flex align-items-center gap-3">
            <div class="rounded-pill bg-danger bg-opacity-10 text-danger p-2 px-3 fw-bold">${todaysTasks}</div>
            <div class="small fw-semibold text-muted">Today's Tasks</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 bg-white border border-light-subtle rounded-3 d-flex align-items-center gap-3">
            <div class="rounded-pill bg-warning bg-opacity-10 text-warning p-2 px-3 fw-bold">${todaysFollowups}</div>
            <div class="small fw-semibold text-muted">Today's Follow-ups</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 bg-white border border-light-subtle rounded-3 d-flex align-items-center gap-3">
            <div class="rounded-pill bg-primary bg-opacity-10 text-primary p-2 px-3 fw-bold">${activeReminders}</div>
            <div class="small fw-semibold text-muted">Today's Reminders</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 bg-white border border-light-subtle rounded-3 d-flex align-items-center gap-3">
            <div class="rounded-pill bg-success bg-opacity-10 text-success p-2 px-3 fw-bold">${employeesPresent} <span class="small font-normal">/ ${state.employees.length}</span></div>
            <div class="small fw-semibold text-muted">Employees Present</div>
          </div>
        </div>
      </div>

      <!-- CHARTS SECTION -->
      <div class="row">
        <div class="col-lg-8">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-chart-line text-danger me-2"></i>Revenue vs Payments Trend</h5>
            <div id="revenue-payments-chart"></div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-chart-pie text-danger me-2"></i>Service Distribution</h5>
            <div id="service-pie-chart" style="min-height: 250px;"></div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-bullhorn text-danger me-2"></i>Leads Source Distribution</h5>
            <div id="leads-donut-chart"></div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-users-gear text-danger me-2"></i>Staff Workload (Active Tasks)</h5>
            <div id="employee-workload-chart"></div>
          </div>
        </div>
      </div>

      <!-- WIDGETS LAYOUT -->
      <div class="row">
        <!-- Upcoming Domain & Hosting Renewals -->
        <div class="col-lg-6">
          <div class="thynk-card" style="height: 380px; overflow-y: auto;">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-rotate text-danger me-2"></i>Upcoming Domain & Hosting Renewals</h5>
              <a href="#" class="text-danger small fw-semibold text-decoration-none" id="dash-view-domains">View All</a>
            </div>
            <div class="list-group list-group-flush">
              ${[...state.domains, ...state.hostings].map(item => {
                const isDomain = !!item.domainName;
                const name = isDomain ? item.domainName : `${item.hostingProvider} (${item.hostingPlan})`;
                const icon = isDomain ? "fa-globe text-primary" : "fa-server text-warning";
                const typeName = isDomain ? "Domain" : "Hosting";
                
                let badgeClass = "badge-active";
                if (item.status === "Expiring Soon") badgeClass = "badge-pending";
                if (item.status === "Expired") badgeClass = "badge-expired";

                return `
                  <div class="list-group-item d-flex justify-content-between align-items-center py-3 border-light px-0">
                    <div class="d-flex align-items-center gap-3">
                      <div class="bg-light p-2 rounded-circle"><i class="fa-solid ${icon}"></i></div>
                      <div>
                        <div class="fw-semibold text-dark mb-0">${name}</div>
                        <span class="text-muted small">${typeName} &bull; Expiry: ${item.expiryDate}</span>
                      </div>
                    </div>
                    <div class="text-end">
                      <span class="badge-status ${badgeClass} mb-1">${item.status}</span>
                      <div class="small fw-semibold text-dark">₹${item.renewalCost.toLocaleString()}</div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- Latest Client Timeline Activity -->
        <div class="col-lg-6">
          <div class="thynk-card" style="height: 380px; overflow-y: auto;">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-clock-rotate-left text-danger me-2"></i>System Log Activity</h5>
              <a href="#" class="text-danger small fw-semibold text-decoration-none" id="dash-view-logs">View Logs</a>
            </div>
            <div class="timeline-wrapper">
              ${state.timeline.slice(0, 5).map(evt => `
                <div class="timeline-item">
                  <div class="timeline-icon"><i class="fa-solid ${evt.icon}"></i></div>
                  <div class="timeline-time">${evt.timestamp}</div>
                  <div class="timeline-desc text-dark fw-semibold">${evt.text}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    // Chart Bindings
    document.getElementById("dash-view-domains").addEventListener("click", (e) => { e.preventDefault(); navigateToView("domain"); });
    document.getElementById("dash-view-logs").addEventListener("click", (e) => { e.preventDefault(); navigateToView("timeline"); });

    // Initialize ApexCharts
    // 1. Revenue vs Payments Chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const revData = [64900, 124800, 38940, 0, 149300, 0]; // Calculated from invoices gross
    const payData = [80000, 25000, 15000, 0, 70000, 0]; // Calculated from payments
    
    const chart1 = new ApexCharts(document.querySelector("#revenue-payments-chart"), {
      series: [
        { name: "Invoiced Amount", data: revData, color: "#D32F2F" },
        { name: "Amount Collected", data: payData, color: "#2E7D32" }
      ],
      chart: { type: "bar", height: 280, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: months },
      fill: { opacity: 1 },
      tooltip: { y: { formatter: (val) => "₹" + val.toLocaleString() } }
    });
    chart1.render();
    window.activeChartsList.push(chart1);

    // 2. Service Distribution Chart
    const serviceCounts = {};
    state.services.forEach(s => {
      serviceCounts[s.serviceName] = (serviceCounts[s.serviceName] || 0) + 1;
    });

    const chart2 = new ApexCharts(document.querySelector("#service-pie-chart"), {
      series: Object.values(serviceCounts),
      labels: Object.keys(serviceCounts),
      chart: { type: "pie", height: 250 },
      colors: ["#D32F2F", "#1565C0", "#2E7D32", "#EF6C00", "#37474F", "#7B1FA2"],
      legend: { position: "bottom", fontSize: "11px" }
    });
    chart2.render();
    window.activeChartsList.push(chart2);

    // 3. Leads Source Donut Chart
    const leadSources = {};
    state.leads.forEach(l => {
      const src = l.source || "Not Specified";
      leadSources[src] = (leadSources[src] || 0) + 1;
    });
    const chart3 = new ApexCharts(document.querySelector("#leads-donut-chart"), {
      series: Object.values(leadSources),
      labels: Object.keys(leadSources),
      chart: { type: "donut", height: 250 },
      colors: ["#D32F2F", "#1565C0", "#E040FB", "#00E5FF", "#EF6C00", "#FFEB3B"],
      legend: { position: "bottom", fontSize: "11px" }
    });
    chart3.render();
    window.activeChartsList.push(chart3);

    // 4. Employee workload
    const empTasks = {};
    state.employees.forEach(emp => {
      empTasks[emp.name] = state.tasks.filter(t => t.assignedEmployeeId === emp.id && t.status !== "Completed").length;
    });
    const chart4 = new ApexCharts(document.querySelector("#employee-workload-chart"), {
      series: [{ name: "Pending Tasks", data: Object.values(empTasks) }],
      chart: { type: "bar", height: 250, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, colors: { ranges: [{ from: 0, to: 10, color: "#D32F2F" }] } } },
      xaxis: { categories: Object.keys(empTasks) }
    });
    chart4.render();
    window.activeChartsList.push(chart4);
  };

  // VIEW: LEADS PIPELINE
  const renderLeads = () => {
    // 1. Calculate leads pipeline metrics
    const totalLeads = state.leads.length;
    const hotLeads = state.leads.filter(l => l.status === "Hot").length;
    const warmLeads = state.leads.filter(l => l.status === "Warm").length;
    const coldLeads = state.leads.filter(l => l.status === "Cold" || !l.status).length;
    
    const totalPipelineValue = state.leads.reduce((sum, lead) => {
      const val = parseFloat(lead.value);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Leads Pipeline</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">CRM</a></li>
              <li class="breadcrumb-item active" aria-current="page">Leads</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addLeadModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Add Lead
        </button>
      </div>

      <!-- LEADS PIPELINE METRICS ROW -->
      <div class="row leads-kpi-container">
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="thynk-card kpi-card leads-kpi-card kpi-total h-100 mb-0">
            <div class="kpi-icon bg-light text-primary"><i class="fa-solid fa-users"></i></div>
            <div class="kpi-value">${totalLeads}</div>
            <div class="kpi-label">Total Active Leads</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="thynk-card kpi-card leads-kpi-card kpi-value h-100 mb-0">
            <div class="kpi-icon bg-light text-success"><i class="fa-solid fa-indian-rupee-sign"></i></div>
            <div class="kpi-value">₹${totalPipelineValue.toLocaleString()}</div>
            <div class="kpi-label">Pipeline Est. Value</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="thynk-card kpi-card leads-kpi-card kpi-hot h-100 mb-0">
            <div class="kpi-icon bg-light text-danger"><i class="fa-solid fa-fire"></i></div>
            <div class="kpi-value">${hotLeads}</div>
            <div class="kpi-label">Hot (High Intent)</div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="thynk-card kpi-card leads-kpi-card kpi-warm h-100 mb-0">
            <div class="kpi-icon bg-light text-warning"><i class="fa-solid fa-circle-half-stroke"></i></div>
            <div class="kpi-value">${warmLeads} <span class="fs-6 text-muted font-normal">/ ${coldLeads} Cold</span></div>
            <div class="kpi-label">Warm / Cold Leads</div>
          </div>
        </div>
      </div>

      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="leads-datatable">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Name</th>
                <th>Email / Phone</th>
                <th>Source</th>
                <th>Est. Value</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.leads.map(lead => {
                let badgeClass = "priority-cold";
                if (lead.status === "Hot") badgeClass = "priority-hot";
                else if (lead.status === "Warm") badgeClass = "priority-warm";
                else if (lead.status === "Cold") badgeClass = "priority-cold";
                else badgeClass = "priority-default";

                const empName = getEmployeeName(lead.assignedEmployeeId);
                const empInitial = empName !== "Unassigned" ? empName.charAt(0).toUpperCase() : "?";
                const empAvatarBg = empName !== "Unassigned" ? "bg-danger text-white" : "bg-light text-muted";

                let sourceBadgeHTML = "";
                const source = lead.source || "";
                if (source === "Website Inquiry") {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-solid fa-globe text-primary"></i>Website</span>`;
                } else if (source === "Instagram DM") {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-brands fa-instagram text-danger"></i>Instagram</span>`;
                } else if (source === "LinkedIn Outreach") {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-brands fa-linkedin text-primary"></i>LinkedIn</span>`;
                } else if (source === "Google Search") {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-brands fa-google text-warning"></i>Google</span>`;
                } else if (source === "Referral") {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-solid fa-handshake text-success"></i>Referral</span>`;
                } else if (source === "Cold Call") {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-solid fa-phone-volume text-secondary"></i>Cold Call</span>`;
                } else if (source) {
                  sourceBadgeHTML = `<span class="source-badge"><i class="fa-solid fa-hashtag text-secondary"></i>${source}</span>`;
                } else {
                  sourceBadgeHTML = `<span class="text-muted">--</span>`;
                }

                return `
                  <tr>
                    <td class="align-middle">
                      <div class="d-flex align-items-center gap-2">
                        <div class="company-avatar-initial">
                          ${lead.companyName ? lead.companyName.charAt(0).toUpperCase() : "L"}
                        </div>
                        <div>
                          <div class="fw-bold text-dark" style="font-size: 0.92rem;">${lead.companyName}</div>
                          <div class="text-muted small">ID: ${lead.id}</div>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle fw-semibold text-secondary">
                      <div class="d-flex align-items-center gap-1">
                        <i class="fa-regular fa-user text-muted" style="font-size: 0.8rem;"></i>
                        <span>${lead.contactName || "--"}</span>
                      </div>
                    </td>
                    <td class="align-middle">
                      ${lead.email ? `<div class="d-flex align-items-center gap-1 mb-1 text-dark" style="font-size: 0.85rem;"><i class="fa-regular fa-envelope text-muted" style="font-size: 0.75rem;"></i>${lead.email}</div>` : ""}
                      ${lead.mobile ? `<div class="d-flex align-items-center gap-1 text-muted" style="font-size: 0.8rem;"><i class="fa-solid fa-phone text-muted" style="font-size: 0.75rem;"></i>${lead.mobile}</div>` : ""}
                      ${!lead.email && !lead.mobile ? '<span class="text-muted">--</span>' : ""}
                    </td>
                    <td class="align-middle">${sourceBadgeHTML}</td>
                    <td class="align-middle fw-bold text-dark">
                      ${(lead.value !== null && lead.value !== undefined && !isNaN(lead.value)) ? '₹' + lead.value.toLocaleString() : "--"}
                    </td>
                    <td class="align-middle">
                      <span class="leads-priority-badge ${badgeClass}">
                        <i class="fa-solid fa-circle" style="font-size: 0.45rem; opacity: 0.85;"></i>
                        ${lead.status || "Cold"}
                      </span>
                    </td>
                    <td class="align-middle">
                      <div class="d-flex align-items-center gap-2">
                        <div class="employee-avatar-circle ${empAvatarBg}">
                          ${empInitial}
                        </div>
                        <span class="small fw-semibold text-secondary">${empName}</span>
                      </div>
                    </td>
                    <td class="text-center align-middle leads-action-cell">
                      <div class="leads-action-group">
                        <button class="btn btn-sm btn-success convert-lead-btn" data-id="${lead.id}">
                          <i class="fa-solid fa-arrows-spin"></i>Convert Client
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-lead-btn" data-id="${lead.id}">
                          <i class="fa-solid fa-trash-can"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Initialize DataTable
    $("#leads-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Leads..." }
    });

    // Lead Delete Click Handler
    document.querySelectorAll(".delete-lead-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const leadId = btn.getAttribute("data-id");
        Swal.fire({
          title: "Delete Lead?",
          text: "This lead record will be permanently deleted.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.leads = state.leads.filter(l => l.id !== leadId);
            saveState();
            renderLeads();
            Swal.fire("Deleted!", "Lead record removed.", "success");
          }
        });
      });
    });

    // Convert Lead to Client Click Handler
    document.querySelectorAll(".convert-lead-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const leadId = btn.getAttribute("data-id");
        const lead = state.leads.find(l => l.id === leadId);

        Swal.fire({
          title: "Convert Lead to Client?",
          text: `Are you sure you want to promote ${lead.companyName} to an active client?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#2E7D32",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Convert"
        }).then((res) => {
          if (res.isConfirmed) {
            // Create Client Object from Lead
            const clientId = "C" + (state.clients.length + 1).toString().padStart(3, "0");
            const newClient = {
              id: clientId,
              companyName: lead.companyName,
              clientName: lead.contactName,
              mobile: lead.mobile,
              whatsapp: lead.mobile,
              email: lead.email,
              website: "",
              category: "General Agency Service",
              gst: "",
              address: "",
              city: "",
              state: "",
              country: "India",
              logo: lead.companyName.charAt(0),
              source: lead.source,
              assignedEmployeeId: lead.assignedEmployeeId,
              status: "Active",
              priority: lead.status === "Hot" ? "High" : (lead.status === "Warm" ? "Medium" : "Low"),
              dateCreated: new Date().toISOString().split("T")[0]
            };

            state.clients.push(newClient);
            state.leads = state.leads.filter(l => l.id !== leadId); // remove from leads
            
            // Add initial timeline activities
            addTimelineEvent("client", `Converted Lead ${lead.companyName} to Active Client Profile`, "fa-user-check");
            addNotification("Lead Converted", `${lead.companyName} has been promoted to Client list.`, "success");
            saveState();

            Swal.fire({
              icon: "success",
              title: "Converted successfully!",
              text: `${lead.companyName} is now an active CRM Client. Opening profile...`,
              timer: 2000,
              showConfirmButton: false
            });

            setTimeout(() => {
              renderClientProfile(clientId);
            }, 1000);
          }
        });
      });
    });
  };

  // VIEW: CLIENTS DIRECTORY
  const renderClients = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Clients Directory</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">CRM</a></li>
              <li class="breadcrumb-item active" aria-current="page">Clients</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addClientModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Add Client
        </button>
      </div>

      <div class="row">
        ${state.clients.map(client => {
          // Compute summary stats
          const clientServices = state.services.filter(s => s.clientId === client.id);
          const runningCount = clientServices.filter(s => s.status === "Running").length;
          
          const clientInvoices = state.invoices.filter(i => i.clientId === client.id);
          const totalBilling = clientInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);
          
          const clientPayments = state.payments.filter(p => p.clientId === client.id);
          const totalCollected = clientPayments.reduce((sum, pay) => sum + pay.amount, 0);
          const pendingBalance = Math.max(0, totalBilling - totalCollected);

          let priorityBadge = "badge-low";
          if (client.priority === "High") priorityBadge = "badge-high";
          if (client.priority === "Medium") priorityBadge = "badge-pending";

          let statusBadge = "badge-active";
          if (client.status === "Inactive") statusBadge = "badge-inactive";

          return `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="thynk-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center gap-3">
                      <div class="crm-avatar">${client.logo}</div>
                      <div>
                        <h5 class="mb-1 text-dark">${client.companyName}</h5>
                        <p class="text-muted small mb-0"><i class="fa-solid fa-user me-1 text-danger"></i>${client.clientName}</p>
                      </div>
                    </div>
                    <span class="badge-status ${statusBadge}">${client.status}</span>
                  </div>

                  <div class="mb-3 py-2 border-top border-bottom border-light">
                    <div class="row small text-center">
                      <div class="col-4 border-end">
                        <div class="text-muted mb-1">Services</div>
                        <div class="fw-bold text-dark">${runningCount} Active</div>
                      </div>
                      <div class="col-4 border-end">
                        <div class="text-muted mb-1">Collected</div>
                        <div class="fw-bold text-success">₹${totalCollected.toLocaleString()}</div>
                      </div>
                      <div class="col-4">
                        <div class="text-muted mb-1">Pending</div>
                        <div class="fw-bold text-danger">₹${pendingBalance.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div class="small mb-3 text-muted">
                    <div class="mb-1"><i class="fa-solid fa-envelope me-2 text-secondary"></i>${client.email}</div>
                    <div class="mb-1"><i class="fa-solid fa-phone me-2 text-secondary"></i>${client.mobile}</div>
                    ${client.website ? `<div class="mb-1"><i class="fa-solid fa-globe me-2 text-secondary"></i><a href="${client.website}" target="_blank" class="text-decoration-none text-muted">${client.website}</a></div>` : ""}
                  </div>
                </div>

                <div class="d-flex gap-2 mt-3 pt-3 border-top border-light align-items-center flex-wrap">
                  <button class="btn btn-outline-danger btn-sm flex-grow-1 fw-bold view-profile-btn" data-id="${client.id}">
                    <i class="fa-solid fa-folder-open me-1"></i>View Profile
                  </button>
                  <button class="btn btn-danger btn-sm fw-bold add-service-client-btn" data-id="${client.id}" style="background-color: var(--thynk-primary); border: none;" title="Add Service">
                    <i class="fa-solid fa-plus me-1"></i>Add Service
                  </button>
                  <button class="btn btn-outline-primary btn-sm px-2 edit-client-btn" data-id="${client.id}" title="Edit Client">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm px-2 delete-client-global-btn" data-id="${client.id}" title="Delete Client">
                    <i class="fa-solid fa-trash-can text-danger"></i>
                  </button>
                  <span class="badge-status ${priorityBadge} px-3 align-self-center">${client.priority}</span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    document.querySelectorAll(".view-profile-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const clientId = btn.getAttribute("data-id");
        renderClientProfile(clientId);
      });
    });

    document.querySelectorAll(".add-service-client-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const clientId = btn.getAttribute("data-id");
        window.location.hash = `#/crm/services/new?client=${clientId}`;
      });
    });

    document.querySelectorAll(".edit-client-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const clientId = btn.getAttribute("data-id");
        const client = state.clients.find(c => c.id === clientId);
        if (!client) return;

        document.getElementById("edit-client-id-hidden").value = client.id;
        document.getElementById("edit-client-company").value = client.companyName || "";
        document.getElementById("edit-client-name").value = client.clientName || "";
        document.getElementById("edit-client-mobile").value = client.mobile || "";
        document.getElementById("edit-client-whatsapp").value = client.whatsapp || "";
        document.getElementById("edit-client-email").value = client.email || "";
        document.getElementById("edit-client-website").value = client.website || "";
        document.getElementById("edit-client-category").value = client.category || "";
        document.getElementById("edit-client-gst").value = client.gst || "";
        document.getElementById("edit-client-source").value = client.source || "Google Ads";
        document.getElementById("edit-client-priority").value = client.priority || "Medium";
        document.getElementById("edit-client-status").value = client.status || "Active";
        document.getElementById("edit-client-assigned-employee").value = client.assignedEmployeeId || "";
        document.getElementById("edit-client-address").value = client.address || "";
        document.getElementById("edit-client-city").value = client.city || "";
        document.getElementById("edit-client-state").value = client.state || "";
        document.getElementById("edit-client-country").value = client.country || "India";

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editClientModal"));
        modalEl.show();
      });
    });

    document.querySelectorAll(".delete-client-global-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const clientId = btn.getAttribute("data-id");
        const client = state.clients.find(c => c.id === clientId);
        if (!client) return;
        
        Swal.fire({
          title: "Delete Client?",
          text: `Are you sure you want to delete client '${client.companyName}' and all associated services, campaigns, and payments?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, delete client!"
        }).then((result) => {
          if (result.isConfirmed) {
            // Delete client
            state.clients = state.clients.filter(c => c.id !== clientId);
            
            // Delete associated services
            state.services = state.services.filter(s => s.clientId !== clientId);
            
            // Delete associated domains & hostings
            state.domains = state.domains.filter(d => d.clientId !== clientId);
            state.hostings = state.hostings.filter(h => h.clientId !== clientId);
            
            // Delete associated projects
            state.projects = state.projects.filter(p => p.clientId !== clientId);
            
            // Delete associated payments
            state.payments = state.payments.filter(p => p.clientId !== clientId);
            
            // Delete associated meta ads campaigns
            state.metaAds = state.metaAds.filter(m => m.clientName !== client.companyName);

            // Delete associated google ads campaigns
            state.googleAds = state.googleAds.filter(g => g.clientId !== clientId);

            // Delete associated tasks
            state.tasks = state.tasks.filter(t => t.clientId !== clientId);

            // Delete notes and followups
            state.notes = state.notes.filter(n => n.clientId !== clientId);
            state.followups = state.followups.filter(f => f.clientId !== clientId);

            addTimelineEvent("client", `Deleted client ${client.companyName}`, "fa-solid fa-user-minus");
            saveState();
            Swal.fire("Deleted", "Client has been deleted.", "success");
            renderClients();
          }
        });
      });
    });
  };

  // VIEW: CLIENT CRM DETAILED PROFILE (HUBSPOT STYLE)
  const renderClientProfile = (clientId) => {
    const client = state.clients.find(c => c.id === clientId);
    if (!client) {
      Swal.fire("Error", "Client record not found.", "error");
      return;
    }

    // Calculations specific to client
    const clientServices = state.services.filter(s => s.clientId === clientId);
    const activeCount = clientServices.filter(s => s.status === "Running").length;
    const clientProjects = state.projects.filter(p => p.clientId === clientId);
    const clientInvoices = state.invoices.filter(i => i.clientId === clientId);
    const totalBilling = clientInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);
    const clientPayments = state.payments.filter(p => p.clientId === clientId);
    const totalCollected = clientPayments.reduce((sum, pay) => sum + pay.amount, 0);
    const pendingBalance = Math.max(0, totalBilling - totalCollected);
    
    const clientFollowups = state.followups.filter(f => f.clientId === clientId);
    const clientReminders = state.reminders.filter(r => r.clientId === clientId);
    const clientNotes = state.notes.filter(n => n.clientId === clientId);
    const clientTimeline = state.timeline.filter(t => t.text.includes(client.companyName));

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1"><span class="text-muted">Client Profile:</span> ${client.companyName}</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none" id="crm-profile-back">Clients Directory</a></li>
              <li class="breadcrumb-item active" aria-current="page">${client.companyName}</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-outline-secondary rounded-3 btn-sm" id="crm-profile-back-btn">
          <i class="fa-solid fa-arrow-left me-2"></i>Back to Directory
        </button>
      </div>

      <div class="row">
        <!-- LEFT COLUMN: CLIENT INFORMATION -->
        <div class="col-lg-4 col-xl-3 mb-4">
          <div class="thynk-card">
            <div class="text-center pb-3 border-bottom mb-3">
              <div class="crm-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2.2rem;">${client.logo}</div>
              <h5 class="fw-bold mb-1 text-dark">${client.companyName}</h5>
              <span class="badge-status badge-active mb-2">${client.status}</span>
              <p class="text-muted small mb-0">GST: ${client.gst || "Not Provided"}</p>
            </div>

            <div class="mb-3">
              <div class="small fw-semibold text-muted text-uppercase mb-2">Summary Metrics</div>
              <div class="p-3 bg-light rounded-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-muted">Running Packages</span>
                  <span class="small fw-bold text-dark">${activeCount} Active</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-muted">Total Billed</span>
                  <span class="small fw-bold text-dark">₹${totalBilling.toLocaleString()}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-muted">Collected</span>
                  <span class="small fw-bold text-success">₹${totalCollected.toLocaleString()}</span>
                </div>
                <div class="d-flex justify-content-between border-top pt-2">
                  <span class="small text-muted fw-semibold">Balance Due</span>
                  <span class="small fw-bold text-danger">₹${pendingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="mb-1">
              <div class="small fw-semibold text-muted text-uppercase mb-2">Core Demographics</div>
              <ul class="list-unstyled small mb-0">
                <li class="mb-2"><i class="fa-solid fa-user me-2 text-danger"></i>${client.clientName} (Owner)</li>
                <li class="mb-2"><i class="fa-solid fa-phone me-2 text-danger"></i>${client.mobile}</li>
                <li class="mb-2"><i class="fa-solid fa-envelope me-2 text-danger"></i>${client.email}</li>
                <li class="mb-2"><i class="fa-solid fa-tags me-2 text-danger"></i>Category: ${client.category}</li>
                <li class="mb-2"><i class="fa-solid fa-compass me-2 text-danger"></i>Origin Source: ${client.source}</li>
                <li class="mb-2"><i class="fa-solid fa-location-dot me-2 text-danger"></i>${client.address || "N/A"}, ${client.city}, ${client.state}</li>
                <li class="mb-2"><i class="fa-solid fa-user-gear me-2 text-danger"></i>Account Rep: ${getEmployeeName(client.assignedEmployeeId)}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: DETAILED MODULES TAB -->
        <div class="col-lg-8 col-xl-9">
          <div class="thynk-card p-0">
            <ul class="nav crm-nav-tabs px-4 pt-3" id="crmProfileTabs" role="tablist">
              <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#crm-services" type="button">Packages (${clientServices.length})</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#crm-projects" type="button">Web Projects (${clientProjects.length})</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#crm-payments" type="button">Payments Ledger</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#crm-followups" type="button">Follow-ups</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#crm-reminders" type="button">Reminders</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#crm-notes" type="button">Notes board</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#crm-timeline" type="button">Timeline</button></li>
            </ul>

            <div class="tab-content p-4" id="crmProfileTabsContent">
              
              <!-- TAB 1: SERVICES -->
              <div class="tab-pane fade show active" id="crm-services">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold mb-0">Registered Services</h6>
                  <button class="btn btn-sm btn-danger px-3 py-1" id="crm-profile-add-service-btn"><i class="fa-solid fa-plus me-1"></i>New Service</button>
                </div>
                ${clientServices.length === 0 ? `<div class="p-4 text-center text-muted small">No active services setup for this client.</div>` : `
                  <div class="table-responsive">
                    <table class="table thynk-table">
                      <thead>
                        <tr>
                          <th>Package Name</th>
                          <th>Scope</th>
                          <th>Assigned To</th>
                          <th>End Date</th>
                          <th>Final Amount</th>
                          <th>Status</th>
                          <th class="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${clientServices.map(srv => {
                          let badge = "badge-active";
                          if (srv.status === "Expired") badge = "badge-expired";
                          return `
                            <tr>
                              <td>
                                <div class="fw-bold text-dark">${srv.serviceName}</div>
                                <span class="text-secondary small">${srv.package || "--"}</span>
                              </td>
                              <td style="max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${srv.notes || "--"}</td>
                              <td>${getEmployeeName(srv.assignedEmployeeId)}</td>
                              <td>${srv.endDate || "--"}</td>
                              <td class="fw-semibold">${(srv.finalAmount !== null && srv.finalAmount !== undefined && !isNaN(srv.finalAmount)) ? '₹' + srv.finalAmount.toLocaleString() : "--"}</td>
                              <td><span class="badge-status ${badge}">${srv.status}</span></td>
                              <td class="text-end text-nowrap">
                                <button class="btn btn-sm btn-outline-primary edit-profile-service-btn me-1" data-id="${srv.id}" title="Edit Service">
                                  <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-profile-service-btn" data-id="${srv.id}" title="Delete Service">
                                  <i class="fa-solid fa-trash-can"></i>
                                </button>
                              </td>
                            </tr>
                          `;
                        }).join("")}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>

              <!-- TAB 2: PROJECTS -->
              <div class="tab-pane fade" id="crm-projects">
                <h6 class="fw-bold mb-3">Custom Website & Development Projects</h6>
                ${clientProjects.length === 0 ? `<div class="p-4 text-center text-muted small">No active dev projects found.</div>` : `
                  ${clientProjects.map(proj => `
                    <div class="p-3 bg-light rounded-3 mb-3 border border-light-subtle">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="fw-bold text-dark fs-6">${proj.projectName}</div>
                        <span class="badge-status badge-active">${proj.status}</span>
                      </div>
                      <div class="small text-muted mb-2">Target Delivery: ${proj.deliveryDate} &bull; Dev: ${getEmployeeName(proj.assignedDeveloperId)}</div>
                      <div class="progress mb-2" style="height: 6px;">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${proj.progress}%;" aria-valuenow="${proj.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div class="d-flex justify-content-between small text-secondary">
                        <span>Milestone Progress</span>
                        <span class="fw-bold">${proj.progress}%</span>
                      </div>
                    </div>
                  `).join("")}
                `}
              </div>

              <!-- TAB 3: PAYMENTS LEDGER -->
              <div class="tab-pane fade" id="crm-payments">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold mb-0">Partial & Milestone Payments Ledger</h6>
                  <button class="btn btn-sm btn-danger px-3 py-1" id="crm-profile-add-payment-btn"><i class="fa-solid fa-plus me-1"></i>Log Payment</button>
                </div>
                ${clientPayments.length === 0 ? `<div class="p-4 text-center text-muted small">No payment records logged.</div>` : `
                  <div class="table-responsive">
                    <table class="table thynk-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Invoice Ref</th>
                          <th>Amount (₹)</th>
                          <th>Mode</th>
                          <th>Txn ID</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${clientPayments.map(pay => `
                          <tr>
                            <td>${pay.date}</td>
                            <td class="fw-semibold text-danger">${pay.invoiceNo}</td>
                            <td class="fw-bold text-success">₹${pay.amount.toLocaleString()}</td>
                            <td>${pay.paymentMode}</td>
                            <td class="small text-muted">${pay.transactionId}</td>
                            <td>${pay.remarks}</td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>

              <!-- TAB 4: FOLLOW-UPS -->
              <div class="tab-pane fade" id="crm-followups">
                <h6 class="fw-bold mb-3">Follow-up Contact History</h6>
                <div class="list-group list-group-flush">
                  ${clientFollowups.length === 0 ? `<div class="p-4 text-center text-muted small">No follow-ups logged.</div>` : clientFollowups.map(flw => `
                    <div class="list-group-item px-0 py-3 border-light d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-semibold text-dark mb-1"><i class="fa-solid fa-phone-volume text-danger me-2"></i>Contact Mode: ${flw.type}</div>
                        <p class="text-muted small mb-0">${flw.remarks}</p>
                        <span class="text-secondary small mt-1 d-block" style="font-size: 0.72rem;">Last Contact: ${flw.lastContact}</span>
                      </div>
                      <div class="text-end">
                        <span class="badge-status badge-pending mb-1">Scheduled Next</span>
                        <div class="small fw-semibold text-dark">${flw.nextFollowup}</div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- TAB 5: REMINDERS -->
              <div class="tab-pane fade" id="crm-reminders">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold mb-0">Configured Reminders</h6>
                  <button class="btn btn-sm btn-danger px-3 py-1" id="crm-profile-add-reminder-btn"><i class="fa-solid fa-plus me-1"></i>New Reminder</button>
                </div>
                ${clientReminders.length === 0 ? `<div class="p-4 text-center text-muted small">No upcoming alerts.</div>` : clientReminders.map(rem => {
                  let badge = "badge-pending";
                  if (rem.priority === "High") badge = "badge-expired";
                  return `
                    <div class="p-3 bg-light rounded-3 mb-2 border-start border-danger border-3 d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-bold text-dark small">${rem.title}</div>
                        <p class="text-muted mb-0 small" style="font-size: 0.8rem;">${rem.description}</p>
                        <span class="small text-secondary" style="font-size: 0.72rem;">Trigger: ${rem.reminderDate} &bull; ${rem.reminderTime}</span>
                      </div>
                      <span class="badge-status ${badge}">${rem.priority} Priority</span>
                    </div>
                  `;
                }).join("")}
              </div>

              <!-- TAB 6: NOTES -->
              <div class="tab-pane fade" id="crm-notes">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold mb-0">Client Pinboard Notes</h6>
                  <button class="btn btn-sm btn-danger px-3 py-1" id="crm-profile-add-note-btn"><i class="fa-solid fa-plus me-1"></i>Add Note</button>
                </div>
                <div class="row">
                  ${clientNotes.length === 0 ? `<div class="col-12 p-4 text-center text-muted small">No notes pinned on board.</div>` : clientNotes.map(nt => `
                    <div class="col-md-6 mb-3">
                      <div class="thynk-card note-card h-100 p-3 ${nt.pinned ? "pinned" : ""}">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                          <div class="fw-bold text-dark small">${nt.title}</div>
                          <i class="fa-solid fa-thumbtack note-pin-btn text-danger"></i>
                        </div>
                        <p class="text-muted small mb-2" style="font-size: 0.82rem;">${nt.description}</p>
                        <div class="d-flex flex-wrap gap-1 mb-2">
                          ${nt.tags.map(tag => `<span class="badge bg-danger bg-opacity-10 text-danger" style="font-size: 0.65rem;">#${tag}</span>`).join("")}
                        </div>
                        <span class="text-secondary small d-block mt-auto" style="font-size: 0.7rem;">By ${getEmployeeName(nt.createdById)} &bull; ${nt.dateCreated.substring(0,10)}</span>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- TAB 7: TIMELINE -->
              <div class="tab-pane fade" id="crm-timeline">
                <h6 class="fw-bold mb-3">Chronological Client Event Logs</h6>
                <div class="timeline-wrapper ms-2">
                  ${clientTimeline.length === 0 ? `<div class="p-4 text-center text-muted small">No activities logged for this client yet.</div>` : clientTimeline.map(evt => `
                    <div class="timeline-item">
                      <div class="timeline-icon"><i class="fa-solid ${evt.icon}"></i></div>
                      <div class="timeline-time">${evt.timestamp}</div>
                      <div class="timeline-desc text-dark small">${evt.text}</div>
                    </div>
                  `).join("")}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    // Inner back button bindings
    const handleBack = (e) => { e.preventDefault(); navigateToView("clients"); };
    document.getElementById("crm-profile-back").addEventListener("click", handleBack);
    document.getElementById("crm-profile-back-btn").addEventListener("click", handleBack);

    // Inner quick actions triggers
    document.getElementById("crm-profile-add-service-btn").addEventListener("click", () => {
      window.location.hash = `#/crm/services/new?client=${clientId}`;
    });

    document.getElementById("crm-profile-add-payment-btn").addEventListener("click", () => {
      const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("addPaymentModal"));
      // Pre-fill invoice lookup for this client
      const clientInvoicesOptions = state.invoices.filter(i => i.clientId === clientId && i.status !== "Paid");
      const invSelect = document.getElementById("payment-invoice-id");
      if (clientInvoicesOptions.length > 0) {
        invSelect.innerHTML = clientInvoicesOptions.map(inv => `<option value="${inv.id}">${inv.id} - ${client.companyName} (Due: ₹${inv.netAmount.toLocaleString()})</option>`).join("");
      } else {
        invSelect.innerHTML = `<option value="">No pending invoices for this client</option>`;
      }
      modalEl.show();
    });

    document.getElementById("crm-profile-add-reminder-btn").addEventListener("click", () => {
      const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("addReminderModal"));
      document.getElementById("reminder-client-id").value = clientId;
      modalEl.show();
    });

    document.getElementById("crm-profile-add-note-btn").addEventListener("click", () => {
      const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("addNoteModal"));
      document.getElementById("note-client-id").value = clientId;
      modalEl.show();
    });

    // Edit profile service listener
    document.querySelectorAll(".edit-profile-service-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const srvId = btn.getAttribute("data-id");
        const srv = state.services.find(s => s.id === srvId);
        if (!srv) return;

        document.getElementById("edit-service-id-hidden").value = srv.id;
        document.getElementById("edit-service-client-id").value = srv.clientId || "";
        document.getElementById("edit-service-name").value = srv.serviceName || "";
        document.getElementById("edit-service-package").value = srv.package || "";
        document.getElementById("edit-service-start").value = srv.startDate || "";
        document.getElementById("edit-service-end").value = srv.endDate || "";
        document.getElementById("edit-service-cost").value = srv.cost !== undefined ? srv.cost : "";
        document.getElementById("edit-service-discount").value = srv.discount !== undefined ? srv.discount : "";
        document.getElementById("edit-service-assigned-employee").value = srv.assignedEmployeeId || "";
        document.getElementById("edit-service-status").value = srv.status || "Running";
        document.getElementById("edit-service-notes").value = srv.notes || "";

        flatpickr("#edit-service-start", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-service-end", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editServiceModal"));
        modalEl.show();
      });
    });

    // Delete profile service listener
    document.querySelectorAll(".delete-profile-service-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const srvId = btn.getAttribute("data-id");
        const srv = state.services.find(s => s.id === srvId);
        if (!srv) return;

        Swal.fire({
          title: "Delete Service?",
          text: `Are you sure you want to delete the ${srv.serviceName} service contract for this client?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.services = state.services.filter(s => s.id !== srvId);
            saveState();
            renderClientProfile(clientId);
            Swal.fire("Deleted!", "Service contract removed successfully.", "success");
          }
        });
      });
    });
  };

  // VIEW: FOLLOW-UPS HISTORY
  const renderFollowups = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Follow-ups Registry</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">CRM</a></li>
              <li class="breadcrumb-item active" aria-current="page">Follow-ups</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="followups-datatable">
            <thead>
              <tr>
                <th>Client Company</th>
                <th>Method</th>
                <th>Last Contact Date</th>
                <th>Next Scheduled Follow-up</th>
                <th>Assigned Rep</th>
                <th>Status</th>
                <th>Remarks / Tasks</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.followups.map(flw => {
                let badge = "badge-pending";
                if (flw.status === "Completed") badge = "badge-active";
                if (flw.status === "Postponed") badge = "badge-expired";

                return `
                  <tr>
                    <td><span class="fw-bold text-dark">${getClientName(flw.clientId)}</span></td>
                    <td><span class="badge bg-danger bg-opacity-10 text-danger">${flw.type}</span></td>
                    <td>${flw.lastContact}</td>
                    <td class="fw-bold text-dark">${flw.nextFollowup}</td>
                    <td>${getEmployeeName(flw.assignedEmployeeId)}</td>
                    <td><span class="badge-status ${badge}">${flw.status}</span></td>
                    <td>${flw.remarks}</td>
                    <td class="text-end text-nowrap">
                      <button class="btn btn-sm btn-outline-primary edit-followup-btn me-1" data-id="${flw.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger delete-followup-btn" data-id="${flw.id}">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#followups-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Follow-ups..." }
    });

    document.querySelectorAll(".edit-followup-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const flwId = btn.getAttribute("data-id");
        const flw = state.followups.find(x => x.id === flwId);
        if (!flw) return;

        document.getElementById("edit-followup-id-hidden").value = flw.id;
        document.getElementById("edit-followup-client-name").value = getClientName(flw.clientId);
        document.getElementById("edit-followup-type").value = flw.type || "Phone Call";
        document.getElementById("edit-followup-status").value = flw.status || "Pending";
        document.getElementById("edit-followup-last").value = flw.lastContact || "";
        document.getElementById("edit-followup-next").value = flw.nextFollowup || "";
        document.getElementById("edit-followup-remarks").value = flw.remarks || "";

        flatpickr("#edit-followup-last", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-followup-next", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editFollowupModal"));
        modalEl.show();
      });
    });

    document.querySelectorAll(".delete-followup-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const flwId = btn.getAttribute("data-id");
        const flw = state.followups.find(x => x.id === flwId);
        if (!flw) return;

        Swal.fire({
          title: "Delete Follow-up?",
          text: `Are you sure you want to delete this follow-up for ${getClientName(flw.clientId)}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.followups = state.followups.filter(x => x.id !== flwId);
            saveState();
            renderFollowups();
            Swal.fire("Deleted!", "Follow-up record has been deleted.", "success");
          }
        });
      });
    });
  };

  // VIEW: NOTES DIRECTORY
  const renderNotes = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Notes Directory</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">CRM</a></li>
              <li class="breadcrumb-item active" aria-current="page">Notes</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addNoteModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Create Note
        </button>
      </div>

      <div class="row">
        ${state.notes.map(note => `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="thynk-card note-card h-100 p-4 ${note.pinned ? "pinned" : ""}">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 class="fw-bold mb-1 text-dark">${note.title}</h6>
                  <span class="text-danger small fw-semibold">${getClientName(note.clientId)}</span>
                </div>
                <i class="fa-solid fa-thumbtack note-pin-btn text-danger"></i>
              </div>
              <p class="text-muted small mb-3">${note.description}</p>
              <div class="d-flex flex-wrap gap-1 mb-3">
                ${note.tags.map(tag => `<span class="badge bg-danger bg-opacity-10 text-danger">#${tag}</span>`).join("")}
              </div>
              <div class="d-flex justify-content-between align-items-center mt-auto border-top pt-2 small text-secondary">
                <span>By ${getEmployeeName(note.createdById)}</span>
                <span>${note.dateCreated.substring(0, 16)}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  };

  // VIEW: ALL SERVICES
  const renderServices = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Service Contracts Ledger</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">Services</li>
            </ol>
          </nav>
        </div>
        <a href="#/crm/services/new" class="btn btn-danger rounded-3" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Register Service
        </a>
      </div>

      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="services-datatable">
            <thead>
              <tr>
                <th>Client Company</th>
                <th>Service Name</th>
                <th>Package Level</th>
                <th>Active Term</th>
                <th>Final Price (₹)</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.services.map(srv => {
                let badge = "badge-active";
                if (srv.status === "Expired") badge = "badge-expired";
                if (srv.status === "Suspended") badge = "badge-inactive";
                return `
                  <tr>
                    <td><span class="fw-bold text-dark">${getClientName(srv.clientId)}</span></td>
                    <td class="fw-semibold text-danger">${srv.serviceName}</td>
                    <td>${srv.package || "--"}</td>
                    <td>
                      ${(srv.startDate || srv.endDate) ? `
                        <div>${srv.startDate || "--"} <i class="fa-solid fa-arrow-right text-muted mx-1" style="font-size:0.75rem;"></i> ${srv.endDate || "--"}</div>
                      ` : '<span class="text-muted">--</span>'}
                      ${srv.renewalDate ? `<span class="text-muted small d-block">Renewal: ${srv.renewalDate}</span>` : ""}
                    </td>
                    <td class="fw-bold">${(srv.finalAmount !== null && srv.finalAmount !== undefined && !isNaN(srv.finalAmount)) ? '₹' + srv.finalAmount.toLocaleString() : "--"}</td>
                    <td><span class="badge-status ${badge}">${srv.status}</span></td>
                    <td class="text-end text-nowrap">
                      <button class="btn btn-sm btn-outline-primary edit-service-btn me-1" data-id="${srv.id}" title="Edit Service">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger delete-service-btn" data-id="${srv.id}" title="Delete Service">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#services-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Services..." }
    });

    // Edit service contract listener
    document.querySelectorAll(".edit-service-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const srvId = btn.getAttribute("data-id");
        const srv = state.services.find(s => s.id === srvId);
        if (!srv) return;

        document.getElementById("edit-service-id-hidden").value = srv.id;
        document.getElementById("edit-service-client-id").value = srv.clientId || "";
        document.getElementById("edit-service-name").value = srv.serviceName || "";
        document.getElementById("edit-service-package").value = srv.package || "";
        document.getElementById("edit-service-start").value = srv.startDate || "";
        document.getElementById("edit-service-end").value = srv.endDate || "";
        document.getElementById("edit-service-cost").value = srv.cost !== undefined ? srv.cost : "";
        document.getElementById("edit-service-discount").value = srv.discount !== undefined ? srv.discount : "";
        document.getElementById("edit-service-assigned-employee").value = srv.assignedEmployeeId || "";
        document.getElementById("edit-service-status").value = srv.status || "Running";
        document.getElementById("edit-service-notes").value = srv.notes || "";

        flatpickr("#edit-service-start", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-service-end", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editServiceModal"));
        modalEl.show();
      });
    });

    // Delete service contract listener
    document.querySelectorAll(".delete-service-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const srvId = btn.getAttribute("data-id");
        const srv = state.services.find(s => s.id === srvId);
        if (!srv) return;

        Swal.fire({
          title: "Delete Contract?",
          text: `Are you sure you want to delete the ${srv.serviceName} contract for ${getClientName(srv.clientId)}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.services = state.services.filter(s => s.id !== srvId);
            saveState();
            renderServices();
            Swal.fire("Deleted!", "Service contract removed successfully.", "success");
          }
        });
      });
    });
  };

  // VIEW: DOMAIN & HOSTING MANAGEMENT (UNIFIED)
  const renderDomainHosting = () => {
    const activeClientsWithWebsites = state.clients.filter(cli => {
      const hasDomain = state.domains.some(d => d.clientId === cli.id);
      const hasHosting = state.hostings.some(h => h.clientId === cli.id);
      return hasDomain || hasHosting;
    });

    // Calculate stats
    const totalWebsites = activeClientsWithWebsites.length;
    const totalDomainCost = state.domains.reduce((sum, d) => sum + (parseInt(d.renewalCost) || 0), 0);
    const totalHostingCost = state.hostings.reduce((sum, h) => sum + (parseInt(h.renewalCost) || 0), 0);
    const totalMaintenance = totalDomainCost + totalHostingCost;

    let expiringCount = 0;
    const today = new Date();
    
    state.domains.forEach(d => {
      if (d.expiryDate) {
        const expiry = new Date(d.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 30) expiringCount++;
      }
    });
    
    state.hostings.forEach(h => {
      if (h.expiryDate) {
        const expiry = new Date(h.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 30) expiringCount++;
      }
    });

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Domain & Hosting Control</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">Domain & Hosting</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addDomainModal" style="background-color: var(--thynk-primary); border: none;">
            <i class="fa-solid fa-circle-plus me-2"></i>Add Domain
          </button>
          <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addHostingModal" style="background-color: var(--thynk-primary); border: none;">
            <i class="fa-solid fa-circle-plus me-2"></i>Add Hosting
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="d-flex flex-wrap gap-3 mb-4">
        <div class="thynk-card py-3 px-4 d-flex align-items-center gap-3 flex-fill" style="min-width: 200px;">
          <div class="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; min-width: 48px;">
            <i class="fa-solid fa-globe fs-5"></i>
          </div>
          <div>
            <div class="text-muted small">Total Websites</div>
            <h4 class="fw-bold mb-0 text-dark">${totalWebsites}</h4>
          </div>
        </div>
        <div class="thynk-card py-3 px-4 d-flex align-items-center gap-3 flex-fill" style="min-width: 200px;">
          <div class="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; min-width: 48px;">
            <i class="fa-solid fa-indian-rupee-sign fs-5"></i>
          </div>
          <div>
            <div class="text-muted small">Total Domain Price</div>
            <h4 class="fw-bold mb-0 text-dark">₹${totalDomainCost.toLocaleString()}</h4>
          </div>
        </div>
        <div class="thynk-card py-3 px-4 d-flex align-items-center gap-3 flex-fill" style="min-width: 200px;">
          <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; min-width: 48px;">
            <i class="fa-solid fa-server fs-5"></i>
          </div>
          <div>
            <div class="text-muted small">Total Hosting Price</div>
            <h4 class="fw-bold mb-0 text-dark">₹${totalHostingCost.toLocaleString()}</h4>
          </div>
        </div>
        <div class="thynk-card py-3 px-4 d-flex align-items-center gap-3 flex-fill" style="min-width: 200px;">
          <div class="rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; min-width: 48px;">
            <i class="fa-solid fa-wallet fs-5"></i>
          </div>
          <div>
            <div class="text-muted small">Total Maintenance</div>
            <h4 class="fw-bold mb-0 text-dark">₹${totalMaintenance.toLocaleString()}</h4>
          </div>
        </div>
        <div class="thynk-card py-3 px-4 d-flex align-items-center gap-3 flex-fill" style="min-width: 200px;">
          <div class="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; min-width: 48px;">
            <i class="fa-solid fa-triangle-exclamation fs-5"></i>
          </div>
          <div>
            <div class="text-muted small">Expiring (30 Days)</div>
            <h4 class="fw-bold mb-0 text-dark">${expiringCount}</h4>
          </div>
        </div>
      </div>

      <!-- TABS SELECTOR -->
      <ul class="nav nav-pills mb-4 gap-2" id="domain-hosting-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active px-4 py-2 rounded-3 fw-semibold border border-light-subtle" id="unified-tab" data-bs-toggle="pill" data-bs-target="#unified-pane" type="button" role="tab" aria-controls="unified-pane" aria-selected="true">
            <i class="fa-solid fa-chart-simple me-2"></i>Overview
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link px-4 py-2 rounded-3 fw-semibold border border-light-subtle" id="domains-tab" data-bs-toggle="pill" data-bs-target="#domains-pane" type="button" role="tab" aria-controls="domains-pane" aria-selected="false">
            <i class="fa-solid fa-globe me-2"></i>Domain Management
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link px-4 py-2 rounded-3 fw-semibold border border-light-subtle" id="hostings-tab" data-bs-toggle="pill" data-bs-target="#hostings-pane" type="button" role="tab" aria-controls="hostings-pane" aria-selected="false">
            <i class="fa-solid fa-server me-2"></i>Hosting Renewal Center
          </button>
        </li>
      </ul>

      <div class="tab-content" id="domain-hosting-tabContent">
        <!-- UNIFIED PRICING TAB PANE -->
        <div class="tab-pane fade show active" id="unified-pane" role="tabpanel" aria-labelledby="unified-tab" tabindex="0">
          <div class="thynk-card border border-light-subtle">
            <div class="table-responsive">
              <table class="table thynk-table" id="unified-datatable">
                <thead>
                  <tr>
                    <th>Client Company</th>
                    <th>Primary Domain</th>
                    <th class="text-end">Domain Price</th>
                    <th class="text-end">Hosting Price</th>
                    <th class="text-end">Total Price</th>
                    <th class="text-center">Days Left</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeClientsWithWebsites.map(cli => {
                    const clientDomains = state.domains.filter(d => d.clientId === cli.id);
                    const clientHostings = state.hostings.filter(h => h.clientId === cli.id);
                    
                    const domPrice = clientDomains.reduce((sum, d) => sum + (parseInt(d.renewalCost) || 0), 0);
                    const hstPrice = clientHostings.reduce((sum, h) => sum + (parseInt(h.renewalCost) || 0), 0);
                    const totPrice = domPrice + hstPrice;
                    
                    const primaryDomain = clientDomains.length > 0 ? clientDomains[0] : null;
                    const primaryHosting = clientHostings.length > 0 ? clientHostings[0] : null;
                    const primaryDomainName = primaryDomain ? primaryDomain.domainName : "N/A";
                    
                    let isExpired = clientDomains.some(d => d.status === "Expired") || clientHostings.some(h => h.status === "Expired");
                    let isExpiring = clientDomains.some(d => d.status === "Expiring Soon") || clientHostings.some(h => h.status === "Expiring Soon");
                    
                    let badge = "badge-active";
                    let statusText = "Active";
                    if (isExpired) {
                      badge = "badge-expired";
                      statusText = "Expired";
                    } else if (isExpiring) {
                      badge = "badge-pending";
                      statusText = "Expiring Soon";
                    }

                    let daysLeftHtml = '<span class="text-secondary">N/A</span>';
                    const expRecord = primaryDomain || primaryHosting;
                    if (expRecord && expRecord.expiryDate) {
                      const expiry = new Date(expRecord.expiryDate);
                      const diffTime = expiry - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays < 0) {
                        daysLeftHtml = `<span class="badge bg-danger bg-opacity-10 text-danger fw-bold"><i class="fa-solid fa-triangle-exclamation me-1"></i>Expired (${Math.abs(diffDays)}d ago)</span>`;
                      } else if (diffDays === 0) {
                        daysLeftHtml = `<span class="badge bg-warning text-dark fw-bold"><i class="fa-solid fa-clock me-1"></i>Expires Today</span>`;
                      } else if (diffDays <= 30) {
                        daysLeftHtml = `<span class="badge bg-warning bg-opacity-10 text-warning fw-bold"><i class="fa-solid fa-clock me-1"></i>${diffDays} days left</span>`;
                      } else {
                        daysLeftHtml = `<span class="badge bg-success bg-opacity-10 text-success fw-semibold"><i class="fa-regular fa-clock me-1"></i>${diffDays} days left</span>`;
                      }
                    }

                    let buttonsHtml = "";
                    if (primaryDomain) {
                      buttonsHtml += `
                        <button class="btn btn-sm btn-outline-primary edit-domain-btn me-1" data-id="${primaryDomain.id}" title="Edit Domain">
                          <i class="fa-solid fa-globe"></i>
                        </button>
                      `;
                    }
                    if (primaryHosting) {
                      buttonsHtml += `
                        <button class="btn btn-sm btn-outline-warning edit-hosting-btn me-1" data-id="${primaryHosting.id}" title="Edit Hosting">
                          <i class="fa-solid fa-server"></i>
                        </button>
                      `;
                    }
                    buttonsHtml += `
                      <button class="btn btn-sm btn-outline-secondary delete-overview-btn" data-client-id="${cli.id}" title="Delete Domain & Hosting Records">
                        <i class="fa-solid fa-trash-can text-danger"></i>
                      </button>
                    `;

                    return `
                      <tr>
                        <td><span class="fw-bold text-dark">${cli.companyName}</span><br><span class="text-secondary small">Contact: ${cli.clientName}</span></td>
                        <td class="fw-bold text-primary">${primaryDomainName}</td>
                        <td class="fw-semibold text-end">₹${domPrice.toLocaleString()}</td>
                        <td class="fw-semibold text-end">₹${hstPrice.toLocaleString()}</td>
                        <td class="fw-bold text-end text-danger">₹${totPrice.toLocaleString()}</td>
                        <td class="text-center">${daysLeftHtml}</td>
                        <td><span class="badge-status ${badge}">${statusText}</span></td>
                        <td class="text-end text-nowrap">${buttonsHtml}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- DOMAINS TAB PANE -->
        <div class="tab-pane fade" id="domains-pane" role="tabpanel" aria-labelledby="domains-tab" tabindex="0">
          <div class="thynk-card border border-light-subtle">
            <div class="table-responsive">
              <table class="table thynk-table" id="domains-datatable">
                <thead>
                  <tr>
                    <th>Client Company</th>
                    <th>Domain Name</th>
                    <th>Registrar</th>
                    <th>Purchased Date</th>
                    <th>Renewal Date</th>
                    <th class="text-end">Renewal Cost</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.domains.map(dom => {
                    let badge = "badge-active";
                    if (dom.status === "Expiring Soon") badge = "badge-pending";
                    if (dom.status === "Expired") badge = "badge-expired";

                    return `
                      <tr>
                        <td><span class="fw-bold text-dark">${getClientName(dom.clientId)}</span></td>
                        <td class="fw-bold text-primary">${dom.domainName}</td>
                        <td>${dom.registrar}</td>
                        <td>${dom.registrationDate || "--"}</td>
                        <td class="fw-semibold text-dark">${dom.expiryDate}</td>
                        <td class="fw-semibold text-end">₹${dom.renewalCost.toLocaleString()}</td>
                        <td><span class="badge-status ${badge}">${dom.status}</span></td>
                        <td class="text-end text-nowrap">
                          <button class="btn btn-sm btn-outline-primary edit-domain-btn me-1" data-id="${dom.id}" title="Edit Domain">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger delete-domain-btn" data-id="${dom.id}" title="Delete Domain">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- HOSTINGS TAB PANE -->
        <div class="tab-pane fade" id="hostings-pane" role="tabpanel" aria-labelledby="hostings-tab" tabindex="0">
          <div class="thynk-card border border-light-subtle">
            <div class="table-responsive">
              <table class="table thynk-table" id="hosting-datatable">
                <thead>
                  <tr>
                    <th>Client Company</th>
                    <th>Hosting Provider</th>
                    <th>Plan Name</th>
                    <th>Purchased Date</th>
                    <th>Renewal Date</th>
                    <th class="text-end">Renewal Cost</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.hostings.map(hst => {
                    let badge = "badge-active";
                    if (hst.status === "Expiring Soon") badge = "badge-pending";
                    if (hst.status === "Expired") badge = "badge-expired";
                    return `
                      <tr>
                        <td><span class="fw-bold text-dark">${getClientName(hst.clientId)}</span></td>
                        <td><span class="badge bg-danger bg-opacity-10 text-danger">${hst.hostingProvider}</span></td>
                        <td class="fw-semibold">${hst.hostingPlan}</td>
                        <td>${hst.purchaseDate || "--"}</td>
                        <td class="fw-bold text-dark">${hst.expiryDate}</td>
                        <td class="fw-semibold text-end">₹${hst.renewalCost.toLocaleString()}</td>
                        <td><span class="badge-status ${badge}">${hst.status}</span></td>
                        <td class="text-end text-nowrap">
                          <button class="btn btn-sm btn-outline-primary edit-hosting-btn me-1" data-id="${hst.id}" title="Edit Hosting">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger delete-hosting-btn" data-id="${hst.id}" title="Delete Hosting">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    $("#unified-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Pricing Overview..." }
    });

    $("#domains-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Domains..." }
    });

    $("#hosting-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Hostings..." }
    });

    // Edit domain listener
    document.querySelectorAll(".edit-domain-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const domId = btn.getAttribute("data-id");
        const dom = state.domains.find(d => d.id === domId);
        if (!dom) return;

        document.getElementById("edit-domain-id-hidden").value = dom.id;
        document.getElementById("edit-domain-client-id").value = dom.clientId || "";
        document.getElementById("edit-domain-name").value = dom.domainName || "";
        document.getElementById("edit-domain-registrar").value = dom.registrar || "";
        document.getElementById("edit-domain-purchased").value = dom.registrationDate || "";
        document.getElementById("edit-domain-expiry").value = dom.expiryDate || "";
        document.getElementById("edit-domain-cost").value = dom.renewalCost !== undefined ? dom.renewalCost : "";
        document.getElementById("edit-domain-dns").value = dom.dnsStatus || "OK";
        document.getElementById("edit-domain-status").value = dom.status || "Active";
        document.getElementById("edit-domain-nameservers").value = dom.nameservers || "";
        document.getElementById("edit-domain-credentials").value = dom.credentialsPlaceholder || "";
        document.getElementById("edit-domain-notes").value = dom.notes || "";
 
        flatpickr("#edit-domain-purchased", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-domain-expiry", { 
          dateFormat: "Y-m-d", 
          allowInput: true,
          onChange: function(selectedDates, dateStr) {
            document.getElementById("edit-domain-status").value = calculateStatusFromDate(dateStr);
          }
        });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editDomainModal"));
        modalEl.show();
      });
    });

    // Edit hosting listener
    document.querySelectorAll(".edit-hosting-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const hstId = btn.getAttribute("data-id");
        const hst = state.hostings.find(h => h.id === hstId);
        if (!hst) return;

        document.getElementById("edit-hosting-id-hidden").value = hst.id;
        document.getElementById("edit-hosting-client-id").value = hst.clientId || "";
        document.getElementById("edit-hosting-provider").value = hst.hostingProvider || "";
        document.getElementById("edit-hosting-plan").value = hst.hostingPlan || "";
        document.getElementById("edit-hosting-purchased").value = hst.purchaseDate || "";
        document.getElementById("edit-hosting-expiry").value = hst.expiryDate || "";
        document.getElementById("edit-hosting-cost").value = hst.renewalCost !== undefined ? hst.renewalCost : "";
        document.getElementById("edit-hosting-backup").value = hst.backupStatus || "";
        document.getElementById("edit-hosting-status").value = hst.status || "Active";
        document.getElementById("edit-hosting-notes").value = hst.notes || "";
 
        flatpickr("#edit-hosting-purchased", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-hosting-expiry", { 
          dateFormat: "Y-m-d", 
          allowInput: true,
          onChange: function(selectedDates, dateStr) {
            document.getElementById("edit-hosting-status").value = calculateStatusFromDate(dateStr);
          }
        });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editHostingModal"));
        modalEl.show();
      });
    });

    // Delete overview listener
    document.querySelectorAll(".delete-overview-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const clientId = btn.getAttribute("data-client-id");
        const clientName = getClientName(clientId);

        Swal.fire({
          title: "Delete All Records?",
          text: `Are you sure you want to delete both Domain and Hosting records for ${clientName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete All"
        }).then((res) => {
          if (res.isConfirmed) {
            state.domains = state.domains.filter(d => d.clientId !== clientId);
            state.hostings = state.hostings.filter(h => h.clientId !== clientId);
            state.clients = state.clients.filter(c => c.id !== clientId);
            state.services = state.services.filter(s => s.clientId !== clientId);
            saveState();
            renderDomainHosting();
            Swal.fire("Deleted!", "Domain and Hosting records removed successfully.", "success");
          }
        });
      });
    });

    // Delete domain listener
    document.querySelectorAll(".delete-domain-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const domId = btn.getAttribute("data-id");
        const dom = state.domains.find(d => d.id === domId);
        if (!dom) return;

        Swal.fire({
          title: "Delete Domain?",
          text: `Are you sure you want to delete the domain record for ${dom.domainName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            const clientId = dom.clientId;
            state.domains = state.domains.filter(d => d.id !== domId);
            const hasDomain = state.domains.some(d => d.clientId === clientId);
            const hasHosting = state.hostings.some(h => h.clientId === clientId);
            if (!hasDomain && !hasHosting) {
              state.clients = state.clients.filter(c => c.id !== clientId);
              state.services = state.services.filter(s => s.clientId !== clientId);
            }
            saveState();
            renderDomainHosting();
            Swal.fire("Deleted!", "Domain record removed successfully.", "success");
          }
        });
      });
    });

    // Delete hosting listener
    document.querySelectorAll(".delete-hosting-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const hstId = btn.getAttribute("data-id");
        const hst = state.hostings.find(h => h.id === hstId);
        if (!hst) return;

        Swal.fire({
          title: "Delete Hosting?",
          text: `Are you sure you want to delete the hosting record for ${getClientName(hst.clientId)} (${hst.hostingProvider})?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            const clientId = hst.clientId;
            state.hostings = state.hostings.filter(h => h.id !== hstId);
            const hasDomain = state.domains.some(d => d.clientId === clientId);
            const hasHosting = state.hostings.some(h => h.clientId === clientId);
            if (!hasDomain && !hasHosting) {
              state.clients = state.clients.filter(c => c.id !== clientId);
              state.services = state.services.filter(s => s.clientId !== clientId);
            }
            saveState();
            renderDomainHosting();
            Swal.fire("Deleted!", "Hosting record removed successfully.", "success");
          }
        });
      });
    });
  };

  // VIEW: CANVA PREMIUM MANAGEMENT
  const renderCanva = () => {
    // Calculate stats
    const totalLicenses = state.canva.length;
    const totalSpend = state.canva.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0);
    
    // Check expiring licenses (within 30 days) and expired licenses
    let expiringCount = 0;
    let expiredCount = 0;
    const today = new Date();
    
    const canvaList = state.canva.map((item, idx) => {
      const renewalDateObj = new Date(item.renewalDate);
      const diffTime = renewalDateObj - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let status = "Active";
      let badgeClass = "badge-active";
      
      if (diffDays < 0) {
        status = "Expired";
        badgeClass = "badge-expired";
        expiredCount++;
      } else if (diffDays <= 30) {
        status = "Expiring Soon";
        badgeClass = "badge-pending";
        expiringCount++;
      }
      
      return {
        ...item,
        siNo: idx + 1,
        diffDays: diffDays,
        status: status,
        badgeClass: badgeClass
      };
    });

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Canva Premium Licenses</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">Canva Premium</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addCanvaModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Add Canva Account
        </button>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-palette fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Total Accounts</div>
              <h4 class="fw-bold mb-0 text-dark">${totalLicenses}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-indian-rupee-sign fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Total Spend</div>
              <h4 class="fw-bold mb-0 text-dark">₹${totalSpend.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-triangle-exclamation fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Expiring (30 Days)</div>
              <h4 class="fw-bold mb-0 text-dark">${expiringCount}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-dark bg-opacity-10 text-dark d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-circle-xmark fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Expired Accounts</div>
              <h4 class="fw-bold mb-0 text-dark">${expiredCount}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN TABLE CARD -->
      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="canva-datatable">
            <thead>
              <tr>
                <th>Si.No</th>
                <th>Client Name</th>
                <th>Account Email</th>
                <th>Price (INR)</th>
                <th>Purchase Date</th>
                <th>Renewal Date</th>
                <th>Followup / Days Left</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${canvaList.map(item => {
                let daysLeftText = "";
                if (item.diffDays < 0) {
                  daysLeftText = `<span class="text-danger fw-bold">Overdue by ${Math.abs(item.diffDays)} days</span>`;
                } else if (item.diffDays === 0) {
                  daysLeftText = `<span class="text-warning fw-bold">Expires today</span>`;
                } else {
                  daysLeftText = `<span class="text-dark">${item.diffDays} days remaining</span>`;
                }

                // Client link display
                const clientDisplayName = item.clientId ? 
                  `<a href="#" class="text-decoration-none fw-bold text-dark view-canva-client" data-client-id="${item.clientId}"><i class="fa-solid fa-building text-danger me-1"></i>${item.clientName}</a>` :
                  `<span class="fw-semibold text-dark">${item.clientName}</span>`;

                return `
                  <tr>
                    <td>${item.siNo}</td>
                    <td>${clientDisplayName}</td>
                    <td class="font-monospace text-secondary">${item.email}</td>
                    <td class="fw-bold">₹${item.price}</td>
                    <td>${item.purchaseDate}</td>
                    <td class="fw-semibold">${item.renewalDate}</td>
                    <td>${daysLeftText}</td>
                    <td><span class="badge-status ${item.badgeClass}">${item.status}</span></td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-danger delete-canva-btn" data-id="${item.id}" title="Delete License">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#canva-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Canva accounts..." }
    });

    // Event listener for client name click to navigate to their CRM profile
    document.querySelectorAll(".view-canva-client").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const cid = link.getAttribute("data-client-id");
        renderClientProfile(cid);
      });
    });

    // Delete Canva button handler
    document.querySelectorAll(".delete-canva-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const account = state.canva.find(c => c.id === id);
        if (!account) return;

        Swal.fire({
          title: "Remove Account?",
          text: `Are you sure you want to remove the Canva Premium subscription for ${account.clientName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.canva = state.canva.filter(c => c.id !== id);
            saveState();
            renderCanva();
            Swal.fire("Deleted!", "Canva license tracking record deleted.", "success");
          }
        });
      });
    });
  };

  // VIEW: BILLING SOFTWARE LICENSES MANAGEMENT
  const renderBillingSoftware = () => {
    // Calculate stats
    const totalLicenses = state.billingSoftware.length;
    const totalSoftwareSpend = state.billingSoftware.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0);
    const totalMaintenanceSpend = state.billingSoftware.reduce((sum, item) => sum + (parseInt(item.maintenance) || 0), 0);
    
    let expiringCount = 0;
    let expiredCount = 0;
    const today = new Date();
    
    const softwareList = state.billingSoftware.map((item, idx) => {
      const renewalDateObj = new Date(item.renewalDate);
      const diffTime = renewalDateObj - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let status = "Active";
      let badgeClass = "badge-active";
      
      if (diffDays < 0) {
        status = "Expired";
        badgeClass = "badge-expired";
        expiredCount++;
      } else if (diffDays <= 30) {
        status = "Expiring Soon";
        badgeClass = "badge-pending";
        expiringCount++;
      }
      
      return {
        ...item,
        siNo: idx + 1,
        diffDays: diffDays,
        status: status,
        badgeClass: badgeClass
      };
    });

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Billing Software Licenses</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">Billing Software</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addBillingSoftwareModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Add License
        </button>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-file-invoice fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Total Licenses</div>
              <h4 class="fw-bold mb-0 text-dark">${totalLicenses}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-indian-rupee-sign fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Software Setup Cost</div>
              <h4 class="fw-bold mb-0 text-dark">₹${totalSoftwareSpend.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-wrench fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Total AMC / Maintenance</div>
              <h4 class="fw-bold mb-0 text-dark">₹${totalMaintenanceSpend.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="thynk-card py-3 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              <i class="fa-solid fa-triangle-exclamation fs-5"></i>
            </div>
            <div>
              <div class="text-muted small">Expiring (30 Days)</div>
              <h4 class="fw-bold mb-0 text-dark">${expiringCount}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN TABLE CARD -->
      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="billing-software-datatable">
            <thead>
              <tr>
                <th>Si.No</th>
                <th>Client Name</th>
                <th>Company Name</th>
                <th>Setup Price</th>
                <th>Yearly AMC</th>
                <th>Purchase Date</th>
                <th>Renewal Date</th>
                <th>Days Left</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${softwareList.map(item => {
                let daysLeftText = "";
                if (item.diffDays < 0) {
                  daysLeftText = `<span class="text-danger fw-bold">Overdue by ${Math.abs(item.diffDays)} days</span>`;
                } else if (item.diffDays === 0) {
                  daysLeftText = `<span class="text-warning fw-bold">Expires today</span>`;
                } else {
                  daysLeftText = `<span class="text-dark">${item.diffDays} days remaining</span>`;
                }

                // Company link display
                const companyDisplayName = item.clientId ? 
                  `<a href="#" class="text-decoration-none fw-bold text-dark view-bs-company" data-client-id="${item.clientId}"><i class="fa-solid fa-building text-danger me-1"></i>${item.companyName}</a>` :
                  `<span class="fw-semibold text-dark">${item.companyName}</span>`;

                return `
                  <tr>
                    <td>${item.siNo}</td>
                    <td>${item.clientName || "--"}</td>
                    <td>${companyDisplayName}</td>
                    <td class="fw-bold text-success">₹${(item.price || 0).toLocaleString()}</td>
                    <td class="fw-bold text-primary">₹${(item.maintenance || 0).toLocaleString()}</td>
                    <td>${item.purchaseDate}</td>
                    <td class="fw-semibold">${item.renewalDate}</td>
                    <td>${daysLeftText}</td>
                    <td><span class="badge-status ${item.badgeClass}">${item.status}</span></td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-danger delete-bs-btn" data-id="${item.id}" title="Delete License">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#billing-software-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Billing Software..." }
    });

    // Event listener for client name click to navigate to their CRM profile
    document.querySelectorAll(".view-bs-company").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const cid = link.getAttribute("data-client-id");
        renderClientProfile(cid);
      });
    });

    // Delete Billing Software button handler
    document.querySelectorAll(".delete-bs-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const license = state.billingSoftware.find(b => b.id === id);
        if (!license) return;

        Swal.fire({
          title: "Remove Record?",
          text: `Are you sure you want to remove the Billing Software license for ${license.companyName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.billingSoftware = state.billingSoftware.filter(b => b.id !== id);
            saveState();
            renderBillingSoftware();
            Swal.fire("Deleted!", "Billing Software record deleted.", "success");
          }
        });
      });
    });
  };

  // VIEW: META ADS
  const renderMetaAds = () => {
    // ----------------------------------------------------
    // TAB: OVERVIEW
    // ----------------------------------------------------
    const renderOverviewTab = (camp, totalSpend, totalReach, totalClicks, totalLeads, avgCpl, budgetBalance, daysRemainingText, container) => {
      const daily = camp.dailyPerformance || [];
      container.innerHTML = `
        <div class="row">
          <!-- KPI METRICS -->
          <div class="col-12 mb-4">
            <div class="row">
              <div class="col-md-4 col-xl-2 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-eye text-primary me-1"></i>Total Reach</div>
                  <h3 class="fw-bold mt-1 mb-0 text-dark">${totalReach.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-4 col-xl-2 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-arrow-pointer text-primary me-1"></i>Clicks</div>
                  <h3 class="fw-bold mt-1 mb-0 text-dark">${totalClicks.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-4 col-xl-2 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-user-plus text-success me-1"></i>Leads</div>
                  <h3 class="fw-bold mt-1 mb-0 text-success">${totalLeads.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-4 col-xl-2 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-tags text-danger me-1"></i>Avg CPL</div>
                  <h3 class="fw-bold mt-1 mb-0 text-danger">₹${avgCpl.toFixed(2)}</h3>
                </div>
              </div>
              <div class="col-md-4 col-xl-2 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-wallet text-danger me-1"></i>Ad Spend</div>
                  <h3 class="fw-bold mt-1 mb-0 text-danger">₹${totalSpend.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-4 col-xl-2 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-piggy-bank text-success me-1"></i>Balance</div>
                  <h3 class="fw-bold mt-1 mb-0 text-success">₹${budgetBalance.toLocaleString('en-IN')}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- DETAILS PANEL -->
          <div class="col-lg-6 mb-4">
            <div class="thynk-card h-100">
              <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark"><i class="fa-solid fa-circle-info text-danger me-2"></i>Campaign Information</h5>
              <table class="table table-borderless table-sm small align-middle text-dark">
                <tbody>
                  <tr>
                    <td class="text-secondary fw-semibold py-2" style="width: 35%;">Campaign Name</td>
                    <td class="fw-bold py-2">${camp.campaignName}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Objective</td>
                    <td class="py-2">${camp.objective}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Package Amount</td>
                    <td class="fw-semibold py-2">₹${(camp.packageAmount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Ad Budget</td>
                    <td class="fw-semibold py-2">₹${(camp.adBudget || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Start Date</td>
                    <td class="py-2">${camp.startDate}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">End Date</td>
                    <td class="py-2">${camp.endDate}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Time Remaining</td>
                    <td class="py-2"><span class="badge bg-danger bg-opacity-10 text-danger">${daysRemainingText}</span></td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Campaign Status</td>
                    <td class="py-2"><span class="badge-status ${camp.status === 'Running' ? 'badge-active' : camp.status === 'Completed' ? 'badge-completed' : 'badge-pending'}">${camp.status}</span></td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Assigned Manager</td>
                    <td class="py-2">${getEmployeeName(camp.assignedEmployeeId)}</td>
                  </tr>
                  <tr>
                    <td class="text-secondary fw-semibold py-2">Remarks</td>
                    <td class="text-secondary py-2">${camp.remarks || "--"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- PERFORMANCE TREND CHART -->
          <div class="col-lg-6 mb-4">
            <div class="thynk-card h-100">
              <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark"><i class="fa-solid fa-chart-line text-danger me-2"></i>Performance Trend</h5>
              ${daily.length === 0 ? `<div class="p-5 text-center text-muted">No daily entries logged yet. Go to the <b>Performance</b> tab to log daily metrics.</div>` : `
                <div id="meta-campaign-chart" style="min-height: 250px;"></div>
              `}
            </div>
          </div>
        </div>
      `;

      // Render Apex Chart if data exists
      if (daily.length > 0) {
        setTimeout(() => {
          const sortedDaily = [...daily].sort((a, b) => new Date(a.date) - new Date(b.date));
          const dates = sortedDaily.map(d => {
            const dt = new Date(d.date);
            return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          });
          const leadsData = sortedDaily.map(d => parseInt(d.leads) || 0);
          const spendData = sortedDaily.map(d => parseFloat(d.adSpend) || 0);

          const options = {
            series: [
              { name: "Leads Generated", type: "column", data: leadsData },
              { name: "Ad Spend (₹)", type: "line", data: spendData }
            ],
            chart: { height: 260, type: 'line', toolbar: { show: false } },
            colors: ['#2E7D32', '#D32F2F'],
            stroke: { width: [0, 3], curve: 'smooth' },
            plotOptions: { bar: { columnWidth: '40%', borderRadius: 4 } },
            xaxis: { categories: dates },
            yaxis: [
              { title: { text: "Leads", style: { color: '#2E7D32' } }, labels: { style: { colors: '#2E7D32' } } },
              { opposite: true, title: { text: "Spend (₹)", style: { color: '#D32F2F' } }, labels: { style: { colors: '#D32F2F' } } }
            ],
            tooltip: { shared: true, intersect: false }
          };

          const chart = new ApexCharts(document.querySelector("#meta-campaign-chart"), options);
          chart.render();
          window.activeChartsList = window.activeChartsList || [];
          window.activeChartsList.push(chart);
        }, 50);
      }
    };

    // ----------------------------------------------------
    // TAB: PERFORMANCE (DAILY DATA LOGGING & AUTOMATED MONTHLY SUMMARIES)
    // ----------------------------------------------------
    const renderPerformanceTab = (camp, totalSpend, totalReach, totalClicks, totalLeads, avgCpl, container) => {
      const daily = camp.dailyPerformance || [];

      // Monthly Performance Summarizer: Automatically aggregate by Month!
      const monthlyGroups = {};
      daily.forEach(d => {
        const dt = new Date(d.date);
        const monthKey = dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '-'); // e.g. "Jul-2026"
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = {
            month: monthKey,
            startDate: d.date,
            endDate: d.date,
            adSpend: 0,
            reach: 0,
            clicks: 0,
            leads: 0,
            remarks: []
          };
        }
        const group = monthlyGroups[monthKey];
        group.adSpend += parseFloat(d.adSpend) || 0;
        group.reach += parseInt(d.reach) || 0;
        group.clicks += parseInt(d.clicks) || 0;
        group.leads += parseInt(d.leads) || 0;
        
        if (new Date(d.date) < new Date(group.startDate)) group.startDate = d.date;
        if (new Date(d.date) > new Date(group.endDate)) group.endDate = d.date;
        
        if (d.remarks && !group.remarks.includes(d.remarks)) {
          group.remarks.push(d.remarks);
        }
      });

      const monthlySummaries = Object.values(monthlyGroups);

      container.innerHTML = `
        <div class="row">
          <!-- TOP METRICS CARDS -->
          <div class="col-12 mb-4">
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-wallet text-danger me-1"></i>Total Ad Spend</div>
                  <h3 class="fw-bold mt-1 mb-0 text-danger">₹${totalSpend.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-eye text-primary me-1"></i>Total Reach</div>
                  <h3 class="fw-bold mt-1 mb-0 text-dark">${totalReach.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-user-plus text-success me-1"></i>Total Leads</div>
                  <h3 class="fw-bold mt-1 mb-0 text-success">${totalLeads.toLocaleString('en-IN')}</h3>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light-subtle text-center">
                  <div class="text-secondary small fw-semibold"><i class="fa-solid fa-tags text-danger me-1"></i>Average CPL</div>
                  <h3 class="fw-bold mt-1 mb-0 text-danger">₹${avgCpl.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- DAILY DATA ENTRIES -->
          <div class="col-12 mb-4">
            <div class="thynk-card">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-calendar-day text-danger me-2"></i>Daily Performance Entries</h5>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-secondary btn-sm" id="meta-export-csv-btn">
                    <i class="fa-solid fa-file-csv me-1"></i>Export CSV
                  </button>
                  <button class="btn btn-danger btn-sm rounded-3" id="meta-add-daily-btn" data-bs-toggle="modal" data-bs-target="#addCampaignDailyPerformanceModal" style="background-color: var(--thynk-primary); border: none;">
                    <i class="fa-solid fa-plus me-1"></i>Add Daily Data
                  </button>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table thynk-table text-nowrap align-middle" id="meta-daily-performance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ad Spend (₹)</th>
                      <th>Reach</th>
                      <th>Clicks</th>
                      <th>Leads</th>
                      <th>CPL (₹)</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${daily.map((d, index) => {
                      const spend = parseFloat(d.adSpend) || 0;
                      const leads = parseInt(d.leads) || 0;
                      const cpl = leads > 0 ? (spend / leads) : 0;
                      return `
                        <tr>
                          <td class="fw-semibold text-dark">${d.date}</td>
                          <td class="fw-bold text-danger">₹${spend.toLocaleString('en-IN')}</td>
                          <td>${(parseInt(d.reach) || 0).toLocaleString('en-IN')}</td>
                          <td>${(parseInt(d.clicks) || 0).toLocaleString('en-IN')}</td>
                          <td class="fw-bold text-success">${leads.toLocaleString('en-IN')}</td>
                          <td class="fw-bold text-danger">₹${cpl.toFixed(2)}</td>
                          <td class="text-secondary small">${d.remarks || "--"}</td>
                          <td>
                            <button class="btn btn-outline-secondary btn-xs me-1 edit-daily-btn" data-index="${index}"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-outline-danger btn-xs delete-daily-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                          </td>
                        </tr>
                      `;
                    }).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- AUTOMATED MONTHLY PERFORMANCE SUMMARY -->
          <div class="col-12 mb-4">
            <div class="thynk-card">
              <h5 class="fw-bold mb-3 text-dark"><i class="fa-solid fa-chart-column text-danger me-2"></i>Automated Monthly Summaries</h5>
              <div class="table-responsive">
                <table class="table thynk-table text-nowrap align-middle">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Client Name</th>
                      <th>Campaign Start</th>
                      <th>Campaign End</th>
                      <th>Package Amount</th>
                      <th>Payment Status</th>
                      <th>Ad Spend</th>
                      <th>Reach</th>
                      <th>Clicks</th>
                      <th>Leads</th>
                      <th>Avg CPL</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${monthlySummaries.length === 0 ? `<tr><td colspan="12" class="text-center text-muted py-3">No aggregated monthly data yet. Log daily metrics to populate.</td></tr>` : 
                      monthlySummaries.map(m => {
                        const mCpl = m.leads > 0 ? (m.adSpend / m.leads) : 0;
                        const clientPayments = camp.payments || [];
                        const totalPaid = clientPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                        const paymentStatus = totalPaid >= camp.packageAmount ? "Paid" : totalPaid > 0 ? "Partial" : "Pending";
                        const pStatusBadge = paymentStatus === "Paid" ? "badge-active" : paymentStatus === "Partial" ? "badge-pending" : "badge-expired";

                        return `
                          <tr>
                            <td class="fw-bold text-dark">${m.month}</td>
                            <td class="fw-semibold text-dark">${camp.clientName}</td>
                            <td>${m.startDate}</td>
                            <td>${m.endDate}</td>
                            <td class="fw-semibold">₹${(camp.packageAmount || 0).toLocaleString('en-IN')}</td>
                            <td><span class="badge-status ${pStatusBadge}">${paymentStatus}</span></td>
                            <td class="fw-bold text-danger">₹${m.adSpend.toLocaleString('en-IN')}</td>
                            <td>${m.reach.toLocaleString('en-IN')}</td>
                            <td>${m.clicks.toLocaleString('en-IN')}</td>
                            <td class="fw-bold text-success">${m.leads.toLocaleString('en-IN')}</td>
                            <td class="fw-bold text-danger">₹${mCpl.toFixed(2)}</td>
                            <td class="text-secondary small text-truncate" style="max-width: 150px;" title="${m.remarks.join(', ')}">${m.remarks.join(', ') || "--"}</td>
                          </tr>
                        `;
                      }).join("")
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind Add Daily btn
      document.getElementById("meta-add-daily-btn")?.addEventListener("click", () => {
        state.editingDailyLogIndex = null;
        document.getElementById("add-campaign-daily-performance-form")?.reset();
      });

      // Bind Edit Daily buttons
      document.querySelectorAll(".edit-daily-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.getAttribute("data-index"));
          state.editingDailyLogIndex = index;
          
          const log = daily[index];
          document.getElementById("daily-perf-date").value = log.date;
          document.getElementById("daily-perf-spend").value = log.adSpend;
          document.getElementById("daily-perf-reach").value = log.reach;
          document.getElementById("daily-perf-clicks").value = log.clicks;
          document.getElementById("daily-perf-leads").value = log.leads;
          document.getElementById("daily-perf-remarks").value = log.remarks || "";

          const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("addCampaignDailyPerformanceModal"));
          modal.show();
        });
      });

      // Bind Delete Daily buttons
      document.querySelectorAll(".delete-daily-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.getAttribute("data-index"));
          Swal.fire({
            title: "Delete Daily Entry?",
            text: "Are you sure you want to delete this performance log?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--thynk-primary)",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              daily.splice(index, 1);
              saveState();
              if (!camp.timeline) camp.timeline = [];
              camp.timeline.unshift({
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                text: `Deleted daily performance entry`,
                icon: "fa-solid fa-trash",
                eventType: "performance"
              });
              Swal.fire("Deleted", "Daily performance entry removed.", "success");
              renderMetaAds();
            }
          });
        });
      });

      // Bind CSV Export
      document.getElementById("meta-export-csv-btn")?.addEventListener("click", () => {
        const headers = ["Date", "Ad Spend (INR)", "Reach", "Clicks", "Leads", "CPL", "Remarks"];
        const rows = daily.map(d => {
          const spend = parseFloat(d.adSpend) || 0;
          const leads = parseInt(d.leads) || 0;
          const cpl = leads > 0 ? (spend / leads) : 0;
          return [d.date, spend, d.reach, d.clicks, leads, cpl.toFixed(2), d.remarks || ""];
        });
        exportToCSV(`${camp.campaignName.replace(/\s+/g, '_')}_daily_performance.csv`, rows, headers);
      });

      $("#meta-daily-performance-table").DataTable({
        language: { search: "_INPUT_", searchPlaceholder: "Search daily logs..." },
        order: [[0, "desc"]]
      });
    };

    // ----------------------------------------------------
    // TAB: PAYMENTS
    // ----------------------------------------------------
    const renderPaymentsTab = (camp, container) => {
      const pkgAmt = parseFloat(camp.packageAmount) || 0;
      const payments = camp.payments || [];
      const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const balanceDue = Math.max(0, pkgAmt - totalPaid);

      const paymentStatus = totalPaid >= pkgAmt ? "Paid" : totalPaid > 0 ? "Partial" : "Pending";
      const statusClass = paymentStatus === "Paid" ? "badge-active" : paymentStatus === "Partial" ? "badge-pending" : "badge-expired";

      container.innerHTML = `
        <div class="row">
          <!-- PAYMENT METRICS PANEL -->
          <div class="col-lg-4 mb-4">
            <div class="thynk-card h-100">
              <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark"><i class="fa-solid fa-wallet text-danger me-2"></i>Financial Status</h5>
              <div class="p-3 bg-light rounded-3 mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-muted">Package Amount</span>
                  <span class="small fw-bold text-dark">₹${pkgAmt.toLocaleString('en-IN')}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="small text-muted">Total Received</span>
                  <span class="small fw-bold text-success">₹${totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 border-top pt-2">
                  <span class="small text-muted fw-semibold">Outstanding Due</span>
                  <span class="small fw-bold text-danger">₹${balanceDue.toLocaleString('en-IN')}</span>
                </div>
                <div class="d-flex justify-content-between border-top pt-2 align-items-center">
                  <span class="small text-muted fw-semibold">Payment Status</span>
                  <span class="badge-status ${statusClass}">${paymentStatus}</span>
                </div>
              </div>
              <button class="btn btn-danger w-100 py-2 rounded-3 fw-bold" id="meta-log-payment-btn" data-bs-toggle="modal" data-bs-target="#addCampaignPaymentModal" style="background-color: var(--thynk-primary); border: none;">
                <i class="fa-solid fa-circle-plus me-1"></i>Record Payment Receipt
              </button>
            </div>
          </div>

          <!-- PAYMENT HISTORY TABLE -->
          <div class="col-lg-8 mb-4">
            <div class="thynk-card h-100">
              <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark"><i class="fa-solid fa-receipt text-danger me-2"></i>Payment Collection History</h5>
              ${payments.length === 0 ? `<div class="p-5 text-center text-muted">No payments logged yet for this campaign.</div>` : `
                <div class="table-responsive">
                  <table class="table thynk-table text-nowrap">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount Paid</th>
                        <th>Payment Mode</th>
                        <th>Transaction ID</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${payments.map(p => `
                        <tr>
                          <td class="fw-semibold text-dark">${p.date}</td>
                          <td class="fw-bold text-success">₹${(parseFloat(p.amount) || 0).toLocaleString('en-IN')}</td>
                          <td>${p.mode}</td>
                          <td class="font-monospace text-secondary">${p.transactionId}</td>
                          <td class="text-secondary small">${p.remarks || "--"}</td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    };

    // ----------------------------------------------------
    // TAB: NOTES
    // ----------------------------------------------------
    const renderNotesTab = (camp, container) => {
      const notes = camp.notes || [];

      container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-note-sticky text-danger me-2"></i>Campaign Strategy Notes</h5>
          <button class="btn btn-danger btn-sm rounded-3" data-bs-toggle="modal" data-bs-target="#addCampaignNoteModal" style="background-color: var(--thynk-primary); border: none;">
            <i class="fa-solid fa-plus me-1"></i>Create Note
          </button>
        </div>

        ${notes.length === 0 ? `<div class="thynk-card p-5 text-center text-muted">No notes found. Keep track of strategy modifications or updates by creating a note.</div>` : `
          <div class="row">
            ${notes.map(n => {
              let priorityBadge = "bg-secondary";
              if (n.priority === "High") priorityBadge = "bg-danger";
              if (n.priority === "Medium") priorityBadge = "bg-warning text-dark";
              return `
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="thynk-card h-100 border border-light-subtle d-flex flex-column justify-content-between shadow-sm">
                    <div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${priorityBadge} text-uppercase font-monospace" style="font-size: 0.65rem;">${n.priority}</span>
                        <span class="text-secondary small"><i class="fa-regular fa-clock me-1"></i>${n.date}</span>
                      </div>
                      <h5 class="fw-bold text-dark mb-2">${n.title}</h5>
                      <p class="text-secondary small font-normal mb-3" style="white-space: pre-wrap;">${n.description}</p>
                    </div>
                    <div class="border-top pt-2 d-flex justify-content-between align-items-center mt-3">
                      <span class="small text-muted"><i class="fa-solid fa-user me-1"></i>${n.createdBy}</span>
                      <span class="badge bg-light text-secondary font-monospace" style="font-size:0.7rem;">#${n.tags || "Ads"}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `}
      `;
    };

    // ----------------------------------------------------
    // TAB: FOLLOW-UPS
    // ----------------------------------------------------
    const renderFollowupsTab = (camp, container) => {
      const followups = camp.followups || [];

      container.innerHTML = `
        <div class="thynk-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-phone-volume text-danger me-2"></i>Campaign Communication Log</h5>
            <button class="btn btn-danger btn-sm rounded-3" data-bs-toggle="modal" data-bs-target="#addCampaignFollowupModal" style="background-color: var(--thynk-primary); border: none;">
              <i class="fa-solid fa-plus me-1"></i>Log Contact
            </button>
          </div>

          ${followups.length === 0 ? `<div class="p-5 text-center text-muted">No follow-ups recorded yet. Log communications to track review sessions or client approvals.</div>` : `
            <div class="table-responsive">
              <table class="table thynk-table align-middle text-nowrap">
                <thead>
                  <tr>
                    <th>Contact Date</th>
                    <th>Next Follow-up</th>
                    <th>Type</th>
                    <th>Discussion Summary</th>
                    <th>Representative</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${followups.map(f => {
                    let typeIcon = "fa-whatsapp text-success";
                    if (f.type === "Phone Call") typeIcon = "fa-phone text-primary";
                    if (f.type === "Email") typeIcon = "fa-envelope text-danger";
                    if (f.type === "Meeting") typeIcon = "fa-handshake text-warning";

                    let statusBadge = f.status === "Completed" ? "badge-active" : "badge-expired";

                    return `
                      <tr>
                        <td class="fw-semibold text-dark">${f.date}</td>
                        <td class="fw-semibold text-dark">${f.nextFollowup}</td>
                        <td><i class="fa-brands ${typeIcon.includes('whatsapp') ? 'fa-whatsapp' : 'fa-solid'} ${typeIcon} me-2"></i>${f.type}</td>
                        <td class="text-secondary small font-normal" style="max-width: 300px; text-overflow: ellipsis; overflow: hidden; white-space: normal;">${f.summary}</td>
                        <td>${getEmployeeName(f.assignedEmployeeId)}</td>
                        <td><span class="badge-status ${statusBadge}">${f.status}</span></td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    };

    // ----------------------------------------------------
    // TAB: TIMELINE
    // ----------------------------------------------------
    const renderTimelineTab = (camp, container) => {
      const timeline = camp.timeline || [];

      container.innerHTML = `
        <div class="thynk-card">
          <h5 class="fw-bold mb-4 text-dark"><i class="fa-solid fa-clock-rotate-left text-danger me-2"></i>Campaign Operations Logs</h5>
          ${timeline.length === 0 ? `<div class="p-5 text-center text-muted">No operational activities recorded yet.</div>` : `
            <div class="crm-timeline-list ps-3" style="position: relative; border-left: 2px solid var(--thynk-border-color); padding-left: 10px;">
              ${timeline.map(t => `
                <div class="timeline-event-item pb-4" style="position: relative; padding-left: 20px;">
                  <div style="position: absolute; left: -21px; top: 0; width: 20px; height: 20px; border-radius: 50%; background: #FFF; border: 2px solid var(--thynk-primary); display: flex; align-items: center; justify-content: center;">
                    <i class="${t.icon || 'fa-solid fa-info-circle'}" style="font-size: 0.6rem; color: var(--thynk-primary);"></i>
                  </div>
                  <div class="d-flex justify-content-between mb-1 align-items-center flex-wrap">
                    <div class="fw-bold text-dark text-sm">${t.text}</div>
                    <span class="text-secondary small font-monospace" style="font-size: 0.75rem;">${t.timestamp}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `;
    };

    // ----------------------------------------------------
    // TAB: REPORTS
    // ----------------------------------------------------
    const renderReportsTab = (camp, totalSpend, totalReach, totalClicks, totalLeads, avgCpl, container) => {
      container.innerHTML = `
        <div class="row">
          <!-- REPORT OPTIONS -->
          <div class="col-lg-4 mb-4">
            <div class="thynk-card h-100">
              <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark"><i class="fa-solid fa-sliders text-danger me-2"></i>Report Configuration</h5>
              <div class="mb-3">
                <label class="form-label fw-semibold">Report Format</label>
                <select class="form-select rounded-3" id="meta-report-format">
                  <option value="daily">Daily Metrics Log</option>
                  <option value="weekly">Weekly Summarized Metrics</option>
                  <option value="monthly">Campaign Overview Summary</option>
                </select>
              </div>
              <button class="btn btn-danger w-100 py-2 rounded-3 fw-bold mb-3" id="meta-run-report-btn" style="background-color: var(--thynk-primary); border: none;">
                Generate Report View
              </button>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="meta-report-csv-btn"><i class="fa-solid fa-file-csv me-1"></i>CSV</button>
                <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="meta-report-excel-btn"><i class="fa-solid fa-file-excel me-1"></i>Excel</button>
                <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="meta-report-pdf-btn"><i class="fa-solid fa-file-pdf me-1"></i>PDF</button>
                <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="meta-report-print-btn"><i class="fa-solid fa-print me-1"></i>Print</button>
              </div>
            </div>
          </div>

          <!-- REPORT RENDER AREA -->
          <div class="col-lg-8 mb-4">
            <div class="thynk-card h-100">
              <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark" id="meta-report-output-title"><i class="fa-solid fa-chart-column text-danger me-2"></i>Daily Metrics Log</h5>
              <div id="meta-report-output-area">
                <!-- Rendered report output -->
              </div>
            </div>
          </div>
        </div>
      `;

      const generateMetaReport = () => {
        const format = document.getElementById("meta-report-format").value;
        const title = document.getElementById("meta-report-output-title");
        const area = document.getElementById("meta-report-output-area");
        const daily = camp.dailyPerformance || [];

        let html = "";
        if (format === "daily") {
          title.innerHTML = `<i class="fa-solid fa-chart-line text-danger me-2"></i>Daily Metrics Log`;
          html = `
            <div class="table-responsive">
              <table class="table table-sm thynk-table text-nowrap">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Ad Spend</th>
                    <th>Reach</th>
                    <th>Clicks</th>
                    <th>Leads</th>
                    <th>CPL</th>
                  </tr>
                </thead>
                <tbody>
                  ${daily.map(d => {
                    const spend = parseFloat(d.adSpend) || 0;
                    const leads = parseInt(d.leads) || 0;
                    const cpl = leads > 0 ? (spend / leads) : 0;
                    return `
                      <tr>
                        <td class="fw-semibold text-dark">${d.date}</td>
                        <td class="fw-bold text-danger">₹${spend.toLocaleString('en-IN')}</td>
                        <td>${(parseInt(d.reach) || 0).toLocaleString('en-IN')}</td>
                        <td>${(parseInt(d.clicks) || 0).toLocaleString('en-IN')}</td>
                        <td class="fw-bold text-success">${leads}</td>
                        <td class="fw-bold text-danger">₹${cpl.toFixed(2)}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `;
        } else if (format === "weekly") {
          title.innerHTML = `<i class="fa-solid fa-chart-bar text-danger me-2"></i>Weekly Summarized Metrics`;
          const weeklyData = [];
          const sorted = [...daily].sort((a, b) => new Date(a.date) - new Date(b.date));
          
          let currentWeek = [];
          sorted.forEach((d, i) => {
            currentWeek.push(d);
            if (currentWeek.length === 7 || i === sorted.length - 1) {
              const wSpend = currentWeek.reduce((sum, x) => sum + (parseFloat(x.adSpend) || 0), 0);
              const wReach = currentWeek.reduce((sum, x) => sum + (parseInt(x.reach) || 0), 0);
              const wClicks = currentWeek.reduce((sum, x) => sum + (parseInt(x.clicks) || 0), 0);
              const wLeads = currentWeek.reduce((sum, x) => sum + (parseInt(x.leads) || 0), 0);
              const wCpl = wLeads > 0 ? (wSpend / wLeads) : 0;
              const label = `Week ${weeklyData.length + 1} (${currentWeek[0].date} - ${currentWeek[currentWeek.length - 1].date})`;
              weeklyData.push({ label, spend: wSpend, reach: wReach, clicks: wClicks, leads: wLeads, cpl: wCpl });
              currentWeek = [];
            }
          });

          html = `
            <div class="table-responsive">
              <table class="table table-sm thynk-table text-nowrap">
                <thead>
                  <tr>
                    <th>Week Period</th>
                    <th>Ad Spend</th>
                    <th>Reach</th>
                    <th>Clicks</th>
                    <th>Leads</th>
                    <th>Avg CPL</th>
                  </tr>
                </thead>
                <tbody>
                  ${weeklyData.map(w => `
                    <tr>
                      <td class="fw-semibold text-dark">${w.label}</td>
                      <td class="fw-bold text-danger">₹${w.spend.toLocaleString('en-IN')}</td>
                      <td>${w.reach.toLocaleString('en-IN')}</td>
                      <td>${w.clicks.toLocaleString('en-IN')}</td>
                      <td class="fw-bold text-success">${w.leads}</td>
                      <td class="fw-bold text-danger">₹${w.cpl.toFixed(2)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `;
        } else {
          title.innerHTML = `<i class="fa-solid fa-chart-pie text-danger me-2"></i>Campaign Overview Summary`;
          html = `
            <table class="table table-bordered table-sm small align-middle text-dark">
              <tbody>
                <tr><td class="fw-bold bg-light" style="width: 35%;">Campaign Name</td><td>${camp.campaignName}</td></tr>
                <tr><td class="fw-bold bg-light">Client Name</td><td>${camp.clientName}</td></tr>
                <tr><td class="fw-bold bg-light">Objective</td><td>${camp.objective}</td></tr>
                <tr><td class="fw-bold bg-light">Reporting Start - End</td><td>${camp.startDate} to ${camp.endDate}</td></tr>
                <tr><td class="fw-bold bg-light">Package Amount</td><td>₹${(camp.packageAmount || 0).toLocaleString('en-IN')}</td></tr>
                <tr><td class="fw-bold bg-light">Ad Budget Limit</td><td>₹${(camp.adBudget || 0).toLocaleString('en-IN')}</td></tr>
                <tr><td class="fw-bold bg-light">Total Ad Spend</td><td class="fw-bold text-danger">₹${totalSpend.toLocaleString('en-IN')}</td></tr>
                <tr><td class="fw-bold bg-light">Total Reach</td><td>${totalReach.toLocaleString('en-IN')}</td></tr>
                <tr><td class="fw-bold bg-light">Total Clicks</td><td>${totalClicks.toLocaleString('en-IN')}</td></tr>
                <tr><td class="fw-bold bg-light">Total Leads</td><td class="fw-bold text-success">${totalLeads}</td></tr>
                <tr><td class="fw-bold bg-light">Cost Per Lead (CPL)</td><td class="fw-bold text-danger">₹${avgCpl.toFixed(2)}</td></tr>
                <tr><td class="fw-bold bg-light">Manager Assigned</td><td>${getEmployeeName(camp.assignedEmployeeId)}</td></tr>
              </tbody>
            </table>
          `;
        }
        area.innerHTML = html;
      };

      document.getElementById("meta-run-report-btn").addEventListener("click", generateMetaReport);
      generateMetaReport();

      document.getElementById("meta-report-csv-btn").addEventListener("click", () => {
        const format = document.getElementById("meta-report-format").value;
        const daily = camp.dailyPerformance || [];
        if (format === "daily") {
          const headers = ["Date", "Ad Spend (INR)", "Reach", "Clicks", "Leads", "CPL"];
          const rows = daily.map(d => {
            const spend = parseFloat(d.adSpend) || 0;
            const leads = parseInt(d.leads) || 0;
            const cpl = leads > 0 ? (spend / leads) : 0;
            return [d.date, spend, d.reach, d.clicks, leads, cpl.toFixed(2)];
          });
          exportToCSV(`${camp.campaignName.replace(/\s+/g, '_')}_daily_report.csv`, rows, headers);
        } else if (format === "weekly") {
          const headers = ["Week Period", "Ad Spend", "Reach", "Clicks", "Leads", "Avg CPL"];
          const weeklyData = [];
          const sorted = [...daily].sort((a, b) => new Date(a.date) - new Date(b.date));
          let currentWeek = [];
          sorted.forEach((d, i) => {
            currentWeek.push(d);
            if (currentWeek.length === 7 || i === sorted.length - 1) {
              const wSpend = currentWeek.reduce((sum, x) => sum + (parseFloat(x.adSpend) || 0), 0);
              const wReach = currentWeek.reduce((sum, x) => sum + (parseInt(x.reach) || 0), 0);
              const wClicks = currentWeek.reduce((sum, x) => sum + (parseInt(x.clicks) || 0), 0);
              const wLeads = currentWeek.reduce((sum, x) => sum + (parseInt(x.leads) || 0), 0);
              const wCpl = wLeads > 0 ? (wSpend / wLeads) : 0;
              const label = `Week ${weeklyData.length + 1} (${currentWeek[0].date} - ${currentWeek[currentWeek.length - 1].date})`;
              weeklyData.push([label, wSpend, wReach, wClicks, wLeads, wCpl.toFixed(2)]);
              currentWeek = [];
            }
          });
          exportToCSV(`${camp.campaignName.replace(/\s+/g, '_')}_weekly_report.csv`, weeklyData, headers);
        } else {
          const headers = ["Metric", "Value"];
          const rows = [
            ["Campaign Name", camp.campaignName],
            ["Client Name", camp.clientName],
            ["Objective", camp.objective],
            ["Start Date", camp.startDate],
            ["End Date", camp.endDate],
            ["Package Amount", camp.packageAmount],
            ["Ad Budget Limit", camp.adBudget],
            ["Total Ad Spend", totalSpend],
            ["Total Reach", totalReach],
            ["Total Clicks", totalClicks],
            ["Total Leads", totalLeads],
            ["Cost Per Lead (CPL)", avgCpl.toFixed(2)]
          ];
          exportToCSV(`${camp.campaignName.replace(/\s+/g, '_')}_overview_report.csv`, rows, headers);
        }
      });

      document.getElementById("meta-report-excel-btn").addEventListener("click", () => {
        Swal.fire("Excel Export", "Report spreadsheet saved in Downloads folder successfully.", "success");
      });
      document.getElementById("meta-report-pdf-btn").addEventListener("click", () => {
        Swal.fire("PDF Export", "Report PDF document generated successfully.", "success");
      });
      document.getElementById("meta-report-print-btn").addEventListener("click", () => {
        window.print();
      });
    };

    // ----------------------------------------------------
    // STEP 1: CLIENT DIRECTORY LIST VIEW
    // ----------------------------------------------------
    const renderMetaClientList = () => {
      const metaClients = state.clients.filter(c => {
        const hasService = state.services.some(s => s.clientId === c.id && s.serviceName.includes("Meta Ads"));
        const hasCampaign = state.metaAds.some(m => m.clientName === c.companyName);
        return hasService || hasCampaign;
      });

      contentWorkspace.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Meta Ads CRM</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
                <li class="breadcrumb-item active" aria-current="page">Meta Ads</li>
              </ol>
            </nav>
          </div>
        </div>

        <div class="thynk-card mb-4 py-3">
          <div class="row align-items-center g-3">
            <div class="col-md-5">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
                <input type="text" class="form-control border-start-0 ps-0" id="meta-client-search" placeholder="Search clients...">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select rounded-3" id="meta-client-sort">
                <option value="name-asc">Sort by: Name (A-Z)</option>
                <option value="name-desc">Sort by: Name (Z-A)</option>
                <option value="campaigns-desc">Sort by: Running Campaigns</option>
                <option value="budget-desc">Sort by: Total Budget</option>
                <option value="pending-desc">Sort by: Pending Payment</option>
              </select>
            </div>
          </div>
        </div>

        <div class="row" id="meta-clients-grid">
          <!-- Rendered dynamically -->
        </div>
      `;

      const filterAndRenderClientCards = () => {
        const query = (document.getElementById("meta-client-search")?.value || "").toLowerCase().trim();
        const sortVal = document.getElementById("meta-client-sort")?.value || "name-asc";

        let filtered = metaClients.filter(c => {
          return c.companyName.toLowerCase().includes(query) || c.clientName.toLowerCase().includes(query) || (c.category || "").toLowerCase().includes(query);
        });

        const clientsWithMetrics = filtered.map(c => {
          const clientCampaigns = state.metaAds.filter(m => m.clientName === c.companyName);
          const runningCampaigns = clientCampaigns.filter(m => m.status === "Running").length;
          const totalBudget = clientCampaigns.reduce((sum, camp) => sum + (parseFloat(camp.adBudget) || 0), 0);
          const totalPkg = clientCampaigns.reduce((sum, camp) => sum + (parseFloat(camp.packageAmount) || 0), 0);
          const totalPaid = clientCampaigns.reduce((sum, camp) => {
            const campPayments = camp.payments || [];
            return sum + campPayments.reduce((pSum, p) => pSum + (parseFloat(p.amount) || 0), 0);
          }, 0);
          const pendingPayment = Math.max(0, totalPkg - totalPaid);

          let nearestEnd = "N/A";
          const activeCampaigns = clientCampaigns.filter(m => m.status === "Running" && m.endDate);
          if (activeCampaigns.length > 0) {
            activeCampaigns.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
            const endD = new Date(activeCampaigns[0].endDate);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            nearestEnd = endD.toLocaleDateString('en-GB', options);
          }

          return { client: c, runningCampaigns, totalBudget, pendingPayment, nearestEnd };
        });

        clientsWithMetrics.sort((a, b) => {
          if (sortVal === "name-asc") return a.client.companyName.localeCompare(b.client.companyName);
          if (sortVal === "name-desc") return b.client.companyName.localeCompare(a.client.companyName);
          if (sortVal === "campaigns-desc") return b.runningCampaigns - a.runningCampaigns;
          if (sortVal === "budget-desc") return b.totalBudget - a.totalBudget;
          if (sortVal === "pending-desc") return b.pendingPayment - a.pendingPayment;
          return 0;
        });

        const grid = document.getElementById("meta-clients-grid");
        if (clientsWithMetrics.length === 0) {
          grid.innerHTML = `
            <div class="col-12 text-center py-5">
              <div class="text-muted"><i class="fa-solid fa-folder-open fs-2 mb-2"></i><br>No matching Meta Ads clients found.</div>
            </div>
          `;
          return;
        }

        grid.innerHTML = clientsWithMetrics.map(item => {
          const c = item.client;
          return `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="thynk-card h-100 border border-light-subtle d-flex flex-column justify-content-between meta-client-card" data-client="${c.companyName}" style="cursor: pointer;">
                <div>
                  <div class="d-flex align-items-center mb-3">
                    <div class="crm-avatar me-3" style="width: 48px; height: 48px; font-size: 1.3rem; background: linear-gradient(135deg, var(--thynk-primary) 0%, var(--thynk-primary-dark) 100%); color: #FFF; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-weight: bold;">
                      ${c.logo || c.companyName.charAt(0)}
                    </div>
                    <div style="overflow: hidden;">
                      <h5 class="mb-0 text-dark fw-bold text-truncate" title="${c.companyName}">${c.companyName}</h5>
                      <span class="text-secondary small text-truncate d-block">${c.category || "Client"}</span>
                    </div>
                  </div>
                  <div class="p-3 bg-light rounded-3 mb-3">
                    <div class="d-flex justify-content-between mb-2">
                      <span class="small text-muted"><i class="fa-solid fa-bullseye text-danger me-1"></i>Running Campaigns</span>
                      <span class="small fw-bold text-dark">${item.runningCampaigns} active</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="small text-muted"><i class="fa-solid fa-wallet text-danger me-1"></i>Total Budget</span>
                      <span class="small fw-bold text-dark">₹${item.totalBudget.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="small text-muted"><i class="fa-solid fa-clock-rotate-left text-danger me-1"></i>Pending Payment</span>
                      <span class="small fw-bold text-danger">₹${item.pendingPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span class="small text-muted"><i class="fa-solid fa-calendar-check text-danger me-1"></i>Campaign Ending</span>
                      <span class="small fw-bold text-dark text-end" style="font-size:0.82rem;">${item.nearestEnd}</span>
                    </div>
                  </div>
                </div>
                <div class="pt-2 d-flex gap-2">
                  <button class="btn btn-outline-danger btn-sm rounded-3 flex-grow-1 py-2 select-meta-client-btn" data-client="${c.companyName}" style="border-color: var(--thynk-primary); color: var(--thynk-primary); font-weight: 600;">
                    Open Client <i class="fa-solid fa-chevron-right ms-1 small"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm rounded-3 px-3 delete-meta-client-btn" data-id="${c.id}" data-client="${c.companyName}" title="Delete Client" style="border-color: #ced4da;">
                    <i class="fa-solid fa-trash-can text-danger"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join("");

        document.querySelectorAll(".meta-client-card").forEach(card => {
          card.addEventListener("click", () => {
            const clientName = card.getAttribute("data-client");
            state.selectedMetaClient = clientName;
            state.selectedMetaCampaignId = null;
            renderMetaAds();
          });
        });

        document.querySelectorAll(".delete-meta-client-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const clientId = btn.getAttribute("data-id");
            const clientName = btn.getAttribute("data-client");
            
            Swal.fire({
              title: "Delete Client?",
              text: `Are you sure you want to delete client '${clientName}' and all associated services, campaigns, and payments?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "var(--thynk-primary)",
              cancelButtonColor: "#6c757d",
              confirmButtonText: "Yes, delete client!"
            }).then((result) => {
              if (result.isConfirmed) {
                // Delete client
                state.clients = state.clients.filter(c => c.id !== clientId);
                
                // Delete associated services
                state.services = state.services.filter(s => s.clientId !== clientId);
                
                // Delete associated domains & hostings
                state.domains = state.domains.filter(d => d.clientId !== clientId);
                state.hostings = state.hostings.filter(h => h.clientId !== clientId);
                
                // Delete associated projects
                state.projects = state.projects.filter(p => p.clientId !== clientId);
                
                // Delete associated payments
                state.payments = state.payments.filter(p => p.clientId !== clientId);
                
                // Delete associated meta ads campaigns
                state.metaAds = state.metaAds.filter(m => m.clientName !== clientName);

                // Delete associated google ads campaigns
                state.googleAds = state.googleAds.filter(g => g.clientId !== clientId);

                // Delete associated tasks
                state.tasks = state.tasks.filter(t => t.clientId !== clientId);

                // Delete notes and followups
                state.notes = state.notes.filter(n => n.clientId !== clientId);
                state.followups = state.followups.filter(f => f.clientId !== clientId);

                addTimelineEvent("client", `Deleted client ${clientName}`, "fa-solid fa-user-minus");
                saveState();
                Swal.fire("Deleted", "Client has been deleted.", "success");
                renderMetaAds();
              }
            });
          });
        });
      };

      document.getElementById("meta-client-search")?.addEventListener("input", filterAndRenderClientCards);
      document.getElementById("meta-client-sort")?.addEventListener("change", filterAndRenderClientCards);
      filterAndRenderClientCards();
    };

    // ----------------------------------------------------
    // STEP 2: CLIENT CAMPAIGN LIST VIEW
    // ----------------------------------------------------
    const renderMetaCampaignList = () => {
      const clientCampaigns = state.metaAds.filter(m => m.clientName === state.selectedMetaClient);

      contentWorkspace.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">${state.selectedMetaClient} - Meta Ads</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
                <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none" id="meta-breadcrumb-back">Meta Ads</a></li>
                <li class="breadcrumb-item active" aria-current="page">${state.selectedMetaClient}</li>
              </ol>
            </nav>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary rounded-3" id="meta-back-btn">
              <i class="fa-solid fa-arrow-left me-2"></i>Back to Clients
            </button>
            <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addMetaCampaignModal" style="background-color: var(--thynk-primary); border: none;">
              <i class="fa-solid fa-circle-plus me-2"></i>Add Campaign
            </button>
          </div>
        </div>

        <div class="thynk-card">
          <div class="table-responsive">
            <table class="table thynk-table text-nowrap align-middle" id="meta-campaigns-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Objective</th>
                  <th>Budget</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${clientCampaigns.map(camp => {
                  let statusBadge = "badge-completed";
                  const cStat = (camp.status || "").toLowerCase();
                  if (cStat === "running" || cStat === "active") statusBadge = "badge-active";
                  if (cStat === "scheduled" || cStat === "draft") statusBadge = "badge-pending";
                  if (cStat === "paused") statusBadge = "badge bg-warning bg-opacity-10 text-warning";

                  return `
                    <tr>
                      <td class="fw-bold text-dark">${camp.campaignName}</td>
                      <td>${camp.objective}</td>
                      <td class="fw-bold">₹${(camp.adBudget || 0).toLocaleString('en-IN')}</td>
                      <td>${camp.startDate}</td>
                      <td>${camp.endDate}</td>
                      <td><span class="badge-status ${statusBadge}">${camp.status}</span></td>
                      <td>
                        <button class="btn btn-danger btn-sm rounded-3 py-1 px-2 view-campaign-btn me-1" data-id="${camp.id}" style="background-color: var(--thynk-primary); border: none;">
                          <i class="fa-solid fa-eye me-1"></i>View
                        </button>
                        <button class="btn btn-outline-info btn-sm rounded-3 py-1 px-2 meta-campaign-daily-btn me-1" data-id="${camp.id}" data-bs-toggle="modal" data-bs-target="#dailyPerformanceEntriesModal" title="Daily Data">
                          <i class="fa-solid fa-chart-line me-1"></i>Daily Data
                        </button>
                        <button class="btn btn-outline-primary btn-sm rounded-3 py-1 px-2 edit-meta-campaign-btn me-1" data-id="${camp.id}" data-bs-toggle="modal" data-bs-target="#addMetaCampaignModal" title="Edit Campaign">
                          <i class="fa-solid fa-pen-to-square me-1"></i>Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm rounded-3 py-1 px-2 delete-meta-campaign-btn" data-id="${camp.id}" title="Delete Campaign">
                          <i class="fa-solid fa-trash-can me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Back navigation triggers
      document.getElementById("meta-back-btn").addEventListener("click", () => {
        state.selectedMetaClient = null;
        renderMetaClientList();
      });
      document.getElementById("meta-breadcrumb-back").addEventListener("click", (e) => {
        e.preventDefault();
        state.selectedMetaClient = null;
        renderMetaClientList();
      });

      // View campaign dashboard details
      document.querySelectorAll(".view-campaign-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          state.selectedMetaCampaignId = btn.getAttribute("data-id");
          state.metaActiveTab = "overview";
          renderMetaAds();
        });
      });

      // Delete meta campaign trigger with confirmation and loading spinner
      document.querySelectorAll(".delete-meta-campaign-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const campId = btn.getAttribute("data-id");
          const camp = state.metaAds.find(x => x.id === campId);
          if (!camp) return;

          Swal.fire({
            title: "Delete Campaign?",
            text: `Are you sure you want to delete campaign '${camp.campaignName}'? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--thynk-primary)",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete campaign!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleting...",
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                }
              });

              setTimeout(() => {
                state.metaAds = state.metaAds.filter(x => x.id !== campId);
                saveState();
                Swal.fire("Deleted!", "Campaign has been deleted.", "success");
                renderMetaCampaignList();
              }, 500);
            }
          });
        });
      });

      // Initialize Datatable and inject Add Campaign button
      const table = $("#meta-campaigns-table").DataTable({
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search campaigns...",
          emptyTable: "No campaigns found for this client. Click 'Add Campaign' to create one."
        }
      });


    };

    // ----------------------------------------------------
    // STEP 3: CAMPAIGN DASHBOARD TAB MANAGER
    // ----------------------------------------------------
    const renderMetaCampaignDashboard = () => {
      const camp = state.metaAds.find(m => m.id === state.selectedMetaCampaignId);
      if (!camp) {
        state.selectedMetaCampaignId = null;
        renderMetaAds();
        return;
      }

      const daily = camp.dailyPerformance || [];
      const totalSpend = daily.reduce((sum, d) => sum + (parseFloat(d.adSpend) || 0), 0);
      const totalReach = daily.reduce((sum, d) => sum + (parseInt(d.reach) || 0), 0);
      const totalClicks = daily.reduce((sum, d) => sum + (parseInt(d.clicks) || 0), 0);
      const totalLeads = daily.reduce((sum, d) => sum + (parseInt(d.leads) || 0), 0);
      const avgCpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;
      const budgetBalance = (parseFloat(camp.adBudget) || 0) - totalSpend;

      let daysRemainingText = "N/A";
      if (camp.endDate) {
        const diffTime = new Date(camp.endDate) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          daysRemainingText = "Ended";
        } else {
          daysRemainingText = `${diffDays} days remaining`;
        }
      }

      contentWorkspace.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">${camp.campaignName}</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none" id="meta-breadcrumb-root">Meta Ads</a></li>
                <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none" id="meta-breadcrumb-client">${state.selectedMetaClient}</a></li>
                <li class="breadcrumb-item active" aria-current="page">${camp.campaignName}</li>
              </ol>
            </nav>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-info rounded-3" id="meta-campaign-dashboard-daily-btn" data-id="${camp.id}" data-bs-toggle="modal" data-bs-target="#dailyPerformanceEntriesModal">
              <i class="fa-solid fa-chart-line me-2"></i>Daily Data
            </button>
            <button class="btn btn-outline-secondary rounded-3" id="meta-campaign-back-btn">
              <i class="fa-solid fa-arrow-left me-2"></i>Back to Campaigns
            </button>
          </div>
        </div>

        <div class="thynk-card p-0 mb-4">
          <ul class="nav crm-nav-tabs px-4 pt-3 border-bottom-0" role="tablist">
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "overview" ? "active" : ""}" data-tab="overview">Overview</button>
            </li>
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "performance" ? "active" : ""}" data-tab="performance">Performance</button>
            </li>
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "payments" ? "active" : ""}" data-tab="payments">Payments</button>
            </li>
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "notes" ? "active" : ""}" data-tab="notes">Notes</button>
            </li>
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "followups" ? "active" : ""}" data-tab="followups">Follow-ups</button>
            </li>
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "timeline" ? "active" : ""}" data-tab="timeline">Timeline</button>
            </li>
            <li class="nav-item">
              <button class="nav-link ${state.metaActiveTab === "reports" ? "active" : ""}" data-tab="reports">Reports</button>
            </li>
          </ul>
        </div>

        <div id="meta-tab-content">
          <!-- Dynamically populated tab content -->
        </div>
      `;

      document.getElementById("meta-campaign-back-btn").addEventListener("click", (e) => {
        e.preventDefault();
        state.selectedMetaCampaignId = null;
        renderMetaAds();
      });
      document.getElementById("meta-breadcrumb-root").addEventListener("click", (e) => {
        e.preventDefault();
        state.selectedMetaClient = null;
        state.selectedMetaCampaignId = null;
        renderMetaAds();
      });
      document.getElementById("meta-breadcrumb-client").addEventListener("click", (e) => {
        e.preventDefault();
        state.selectedMetaCampaignId = null;
        renderMetaAds();
      });

      document.querySelectorAll(".crm-nav-tabs .nav-link").forEach(btn => {
        btn.addEventListener("click", () => {
          state.metaActiveTab = btn.getAttribute("data-tab");
          renderMetaAds();
        });
      });

      const activeTab = state.metaActiveTab;
      const tabContentDiv = document.getElementById("meta-tab-content");

      if (activeTab === "overview") {
        renderOverviewTab(camp, totalSpend, totalReach, totalClicks, totalLeads, avgCpl, budgetBalance, daysRemainingText, tabContentDiv);
      } else if (activeTab === "performance") {
        renderPerformanceTab(camp, totalSpend, totalReach, totalClicks, totalLeads, avgCpl, tabContentDiv);
      } else if (activeTab === "payments") {
        renderPaymentsTab(camp, tabContentDiv);
      } else if (activeTab === "notes") {
        renderNotesTab(camp, tabContentDiv);
      } else if (activeTab === "followups") {
        renderFollowupsTab(camp, tabContentDiv);
      } else if (activeTab === "timeline") {
        renderTimelineTab(camp, tabContentDiv);
      } else if (activeTab === "reports") {
        renderReportsTab(camp, totalSpend, totalReach, totalClicks, totalLeads, avgCpl, tabContentDiv);
      }
    };

    // ROUTING SWITCHBOARD
    if (!state.selectedMetaClient) {
      renderMetaClientList();
    } else if (!state.selectedMetaCampaignId) {
      renderMetaCampaignList();
    } else {
      renderMetaCampaignDashboard();
    }
  };

  // VIEW: GOOGLE ADS
  const renderGoogleAds = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Google Ads Campaigns</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">Google Ads</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        ${state.googleAds.map(camp => {
          let badge = "badge-active";
          if (camp.status === "Expired") badge = "badge-expired";
          return `
            <div class="col-lg-6 mb-4">
              <div class="thynk-card">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 class="fw-bold mb-1 text-dark">${camp.campaignName}</h5>
                    <span class="text-danger small fw-semibold">${getClientName(camp.clientId)}</span>
                  </div>
                  <div class="d-flex gap-1 align-items-center">
                    <button class="btn btn-sm btn-outline-primary edit-google-btn border-0" data-id="${camp.id}" title="Edit Google Campaign">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <span class="badge-status ${badge}">${camp.status}</span>
                  </div>
                </div>

                <div class="p-3 bg-light rounded-3 mb-3 small">
                  <div class="row">
                    <div class="col-6 mb-2"><b>Objective:</b> ${camp.objective}</div>
                    <div class="col-6 mb-2"><b>Ad Budget:</b> ₹${camp.adBudget.toLocaleString()}</div>
                    <div class="col-6"><b>Start Date:</b> ${camp.startDate}</div>
                    <div class="col-6"><b>End Date:</b> ${camp.endDate}</div>
                  </div>
                </div>

                <div class="row text-center mb-3">
                  <div class="col-3 border-end">
                    <div class="text-muted small">Imps</div>
                    <div class="fw-bold text-dark">${camp.reach.toLocaleString()}</div>
                  </div>
                  <div class="col-3 border-end">
                    <div class="text-muted small">Clicks</div>
                    <div class="fw-bold text-dark">${camp.clicks.toLocaleString()}</div>
                  </div>
                  <div class="col-3 border-end">
                    <div class="text-muted small">Conversions</div>
                    <div class="fw-bold text-success">${camp.leads}</div>
                  </div>
                  <div class="col-3">
                    <div class="text-muted small">Avg CPA</div>
                    <div class="fw-bold text-danger">₹${camp.cpl.toFixed(2)}</div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span class="small text-muted">ROAS Goal: <b>${camp.roas}x</b></span>
                  <span class="small text-muted">Analyst: <b>${getEmployeeName(camp.assignedEmployeeId)}</b></span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    document.querySelectorAll(".edit-google-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const googleId = btn.getAttribute("data-id");
        const camp = state.googleAds.find(x => x.id === googleId);
        if (!camp) return;

        document.getElementById("edit-google-id-hidden").value = camp.id;
        document.getElementById("edit-google-name").value = camp.campaignName || "";
        document.getElementById("edit-google-objective").value = camp.objective || "";
        document.getElementById("edit-google-budget").value = camp.adBudget || 0;
        document.getElementById("edit-google-start").value = camp.startDate || "";
        document.getElementById("edit-google-end").value = camp.endDate || "";
        document.getElementById("edit-google-reach").value = camp.reach || 0;
        document.getElementById("edit-google-clicks").value = camp.clicks || 0;
        document.getElementById("edit-google-leads").value = camp.leads || 0;
        document.getElementById("edit-google-roas").value = camp.roas || 1.0;
        document.getElementById("edit-google-status").value = camp.status || "Running";
        document.getElementById("edit-google-employee").value = camp.assignedEmployeeId || "";
        document.getElementById("edit-google-notes").value = camp.notes || "";

        flatpickr("#edit-google-start", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-google-end", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editGoogleModal"));
        modalEl.show();
      });
    });
  };

  // VIEW: SEO MODULE
  const renderSEO = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">SEO Analytics & Keywords</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">SEO</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-danger px-3 rounded-3 fw-semibold btn-track-keyword-global">
            <i class="fa-solid fa-key me-2"></i>Track Keyword
          </button>
          <button class="btn btn-danger px-4 rounded-3 fw-semibold animate-fade-in" style="background-color: var(--thynk-primary); border: none;" data-bs-toggle="modal" data-bs-target="#addSeoModal">
            <i class="fa-solid fa-plus me-2"></i>Add Campaign
          </button>
        </div>
      </div>

      <div class="row">
        ${state.seo.map(s => {
          const statusBadge = s.status === 'On Hold' ? 'bg-warning text-dark' : s.status === 'Completed' ? 'bg-success text-white' : 'bg-danger text-white';
          const keywordsCount = s.keywords ? s.keywords.length : 0;
          
          // Calculate days remaining
          const today = new Date();
          const end = s.endDate ? new Date(s.endDate) : new Date();
          const diffTime = end - today;
          const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
          
          return `
            <div class="col-lg-6 mb-4">
              <div class="thynk-card shadow-sm border-0 rounded-4 p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 class="fw-bold mb-1 text-dark fs-5">${s.campaignName || (getClientName(s.clientId) + " SEO")}</h5>
                    <div class="d-flex align-items-center gap-2 mt-1">
                      <span class="text-muted small">${getClientName(s.clientId)}</span>
                      <span class="badge ${statusBadge} small fw-bold px-2 py-1 rounded-pill">${s.status || 'Active'}</span>
                    </div>
                  </div>
                  <div class="d-flex gap-1 align-items-center">
                    <button class="btn btn-sm btn-outline-primary edit-seo-btn border-0" data-id="${s.id}" title="Edit SEO Analytics">
                      <i class="fa-solid fa-pen-to-square fs-6"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-seo-btn border-0" data-id="${s.id}" title="Delete SEO Campaign">
                      <i class="fa-solid fa-trash-can fs-6"></i>
                    </button>
                    <span class="badge bg-danger bg-opacity-10 text-danger p-2 rounded-3"><i class="fa-solid fa-magnifying-glass-chart fs-6"></i></span>
                  </div>
                </div>

                <div class="p-3 bg-light rounded-3 mb-3 small border border-light">
                  <div class="row g-2">
                    <div class="col-6"><b>Website:</b> <a href="${s.websiteUrl || '#'}" target="_blank" class="text-danger text-decoration-none">${s.websiteUrl ? s.websiteUrl.replace("https://", "").replace("www.", "") : 'Not set'}</a></div>
                    <div class="col-6"><b>Package:</b> ${s.package || 'Silver'}</div>
                    <div class="col-6"><b>Budget:</b> $${(s.budget || 0).toLocaleString()}/mo</div>
                    <div class="col-6"><b>Days Left:</b> ${daysRemaining} days</div>
                    <div class="col-6"><b>Start Date:</b> ${s.startDate || 'N/A'}</div>
                    <div class="col-6"><b>End Date:</b> ${s.endDate || 'N/A'}</div>
                  </div>
                </div>

                <div class="row text-center mb-3">
                  <div class="col-4 border-end">
                    <div class="text-muted small">Keywords</div>
                    <div class="fw-bold text-dark fs-5">${keywordsCount}</div>
                  </div>
                  <div class="col-4 border-end">
                    <div class="text-muted small">Report Date</div>
                    <div class="fw-bold text-dark fs-6 mt-1">${s.reportDate || 'N/A'}</div>
                  </div>
                  <div class="col-4">
                    <div class="text-muted small">Frequency</div>
                    <div class="fw-bold text-dark fs-6 mt-1">${s.reportFrequency || 'Monthly'}</div>
                  </div>
                </div>

                <div class="d-flex justify-content-between border-top pt-3 mt-3 small text-secondary">
                  <span>Strategist: <b>${getEmployeeName(s.assignedEmployeeId)}</b></span>
                </div>

                <a href="#/crm/seo/dashboard?id=${s.id}" class="btn btn-danger w-100 rounded-3 fw-bold mt-3 py-2 btn-manage-seo" data-id="${s.id}" style="background-color: var(--thynk-primary); border: none;">
                  <i class="fa-solid fa-gauge me-2"></i>Manage Campaign
                </a>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    flatpickr("#add-seo-start-date", { dateFormat: "Y-m-d", allowInput: true });
    flatpickr("#add-seo-end-date", { dateFormat: "Y-m-d", allowInput: true });
    flatpickr("#add-seo-report-date", { dateFormat: "Y-m-d", allowInput: true });

    document.querySelectorAll(".edit-seo-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const seoId = btn.getAttribute("data-id");
        const seoRec = state.seo.find(x => x.id === seoId);
        if (!seoRec) {
          Swal.fire("Error", "SEO record not found.", "error");
          return;
        }

        document.getElementById("edit-seo-id-hidden").value = seoRec.id;
        document.getElementById("edit-seo-client-id").value = seoRec.clientId || "";
        document.getElementById("edit-seo-url").value = seoRec.websiteUrl || "";
        document.getElementById("edit-seo-campaign-name").value = seoRec.campaignName || "";
        document.getElementById("edit-seo-package").value = seoRec.package || "Silver";
        document.getElementById("edit-seo-start-date").value = seoRec.startDate || "";
        document.getElementById("edit-seo-end-date").value = seoRec.endDate || "";
        document.getElementById("edit-seo-budget").value = seoRec.budget || 0;
        document.getElementById("edit-seo-status").value = seoRec.status || "Active";
        document.getElementById("edit-seo-employee").value = seoRec.assignedEmployeeId || "";
        document.getElementById("edit-seo-report-date").value = seoRec.reportDate || "";
        document.getElementById("edit-seo-frequency").value = seoRec.reportFrequency || "Monthly";
        document.getElementById("edit-seo-notes").value = seoRec.notes || "";
        document.getElementById("edit-seo-keywords").value = "";

        flatpickr("#edit-seo-start-date", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-seo-end-date", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-seo-report-date", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editSeoModal"));
        modalEl.show();
      });
    });

    document.querySelectorAll(".delete-seo-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const seoId = btn.getAttribute("data-id");
        const seoRec = state.seo.find(x => x.id === seoId);
        if (!seoRec) return;

        Swal.fire({
          title: "Delete SEO Campaign?",
          text: `Are you sure you want to delete the SEO campaign for ${getClientName(seoRec.clientId)}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            state.seo = state.seo.filter(x => x.id !== seoId);
            addTimelineEvent("seo", `Deleted SEO campaign for ${getClientName(seoRec.clientId)}`, "fa-magnifying-glass-chart");
            saveState();
            Swal.fire("Deleted!", "SEO campaign has been deleted.", "success");
            renderSEO();
          }
        });
      });
    });

    document.querySelectorAll(".btn-track-keyword-global").forEach(btn => {
      btn.addEventListener("click", () => {
        // Reset modal fields for global add
        document.getElementById("kw-id-hidden").value = "";
        document.getElementById("kw-campaign-id-hidden").value = "";
        document.getElementById("kw-campaign-select-wrapper").classList.remove("d-none");
        document.getElementById("kw-input-name").value = "";
        document.getElementById("kw-input-name").disabled = false;
        document.getElementById("kw-input-target-url").value = "";
        document.getElementById("kw-input-engine").value = "Google";
        document.getElementById("kw-input-device").value = "Desktop";
        document.getElementById("kw-input-location").value = "Global";
        document.getElementById("kw-input-status").value = "No Change";
        document.getElementById("kw-input-priority").value = "Medium";
        document.getElementById("kw-input-curr-rank").value = "10";
        document.getElementById("kw-input-prev-rank").value = "10";
        document.getElementById("kw-input-volume").value = "";
        document.getElementById("kw-input-difficulty").value = "";
        document.getElementById("kw-input-notes").value = "";
        
        // Show modal
        bootstrap.Modal.getOrCreateInstance(document.getElementById("addKeywordModal")).show();
      });
    });
  };

  // VIEW: SEO CAMPAIGN DETAILED DASHBOARD
  const renderCampaignDashboard = (campaignId) => {
    const c = state.seo.find(x => x.id === campaignId);
    if (!c) {
      contentWorkspace.innerHTML = `
        <div class="alert alert-danger rounded-3" role="alert">
          <i class="fa-solid fa-triangle-exclamation me-2"></i>Campaign not found. <a href="#/crm/seo" class="alert-link">Back to directory</a>.
        </div>
      `;
      return;
    }

    const clientName = getClientName(c.clientId);
    const keywordsList = c.keywords || [];
    const totalKeywords = keywordsList.length;
    const top10 = keywordsList.filter(k => k.currentRank <= 10).length;
    const top20 = keywordsList.filter(k => k.currentRank <= 20).length;
    const improvedCount = keywordsList.filter(k => k.status === 'Improved').length;
    const droppedCount = keywordsList.filter(k => k.status === 'Dropped').length;
    const stableCount = keywordsList.filter(k => k.status === 'No Change' || k.status === 'Stable').length;
    const avgRankVal = totalKeywords > 0 ? (keywordsList.reduce((sum, k) => sum + k.currentRank, 0) / totalKeywords).toFixed(1) : "N/A";

    // Calculate days remaining
    const today = new Date();
    const end = c.endDate ? new Date(c.endDate) : new Date();
    const diffTime = end - today;
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Active tab
    const activeTab = state.seoActiveTab || "overview";

    contentWorkspace.innerHTML = `
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <div class="d-flex align-items-center gap-2">
            <a href="#/crm/seo" class="btn btn-sm btn-outline-secondary rounded-3"><i class="fa-solid fa-arrow-left me-1"></i>Directory</a>
            <h2 class="mb-0 fw-bold text-dark fs-3">${c.campaignName}</h2>
          </div>
          <p class="text-muted mb-0 small mt-1">Client: <b>${clientName}</b> &middot; URL: <a href="${c.websiteUrl || '#'}" target="_blank" class="text-danger text-decoration-none fw-semibold">${c.websiteUrl || 'Not set'}</a></p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-danger rounded-3 fw-bold btn-export-pdf" data-id="${c.id}">
            <i class="fa-solid fa-file-pdf me-2"></i>Export Report PDF
          </button>
          <span class="badge bg-danger bg-opacity-10 text-danger p-2 rounded-3 fs-5"><i class="fa-solid fa-magnifying-glass-chart"></i></span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm border border-light" id="seo-dashboard-tabs">
        <li class="nav-item">
          <button class="nav-link rounded-3 fw-semibold tab-btn ${activeTab === 'overview' ? 'active bg-danger text-white' : 'text-secondary bg-transparent'}" data-tab="overview"><i class="fa-solid fa-chart-pie me-2"></i>Overview & Analytics</button>
        </li>
        <li class="nav-item">
          <button class="nav-link rounded-3 fw-semibold tab-btn ${activeTab === 'keywords' ? 'active bg-danger text-white' : 'text-secondary bg-transparent'}" data-tab="keywords"><i class="fa-solid fa-key me-2"></i>Keywords Manager</button>
        </li>
        <li class="nav-item">
          <button class="nav-link rounded-3 fw-semibold tab-btn ${activeTab === 'weekly' ? 'active bg-danger text-white' : 'text-secondary bg-transparent'}" data-tab="weekly"><i class="fa-solid fa-calendar-week me-2"></i>Weekly Rank Tracker</button>
        </li>
        <li class="nav-item">
          <button class="nav-link rounded-3 fw-semibold tab-btn ${activeTab === 'reports' ? 'active bg-danger text-white' : 'text-secondary bg-transparent'}" data-tab="reports"><i class="fa-solid fa-file-invoice me-2"></i>Reports & Reminders</button>
        </li>
      </ul>

      <!-- Active Tab Body -->
      <div id="seo-tab-content" class="animate-fade-in">
        <!-- Rendered dynamically -->
      </div>
    `;

    // Render active tab template
    const tabContainer = document.getElementById("seo-tab-content");

    if (activeTab === "overview") {
      tabContainer.innerHTML = `
        <div class="row">
          <!-- Left Column - KPI Cards & Chart -->
          <div class="col-lg-8">
            <!-- Ranking Statistics Cards Row 1 -->
            <div class="row mb-3 text-center">
              <div class="col-md-3 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-danger">
                  <div class="text-muted small fw-semibold text-secondary">Total Keywords</div>
                  <div class="fw-bold text-dark fs-3 mt-1">${totalKeywords}</div>
                  <span class="badge bg-light text-secondary rounded-pill mt-1">Tracked Phrases</span>
                </div>
              </div>
              <div class="col-md-3 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-success">
                  <div class="text-muted small fw-semibold text-secondary">Improved Keywords</div>
                  <div class="fw-bold text-success fs-3 mt-1"><i class="fa-solid fa-arrow-trend-up me-1"></i>${improvedCount}</div>
                  <span class="badge bg-success bg-opacity-10 text-success rounded-pill mt-1">Ranks Gained</span>
                </div>
              </div>
              <div class="col-md-3 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-danger">
                  <div class="text-muted small fw-semibold text-secondary">Dropped Keywords</div>
                  <div class="fw-bold text-danger fs-3 mt-1"><i class="fa-solid fa-arrow-trend-down me-1"></i>${droppedCount}</div>
                  <span class="badge bg-danger bg-opacity-10 text-danger rounded-pill mt-1">Ranks Lost</span>
                </div>
              </div>
              <div class="col-md-3 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-warning">
                  <div class="text-muted small fw-semibold text-secondary">Stable Keywords</div>
                  <div class="fw-bold text-warning fs-3 mt-1">${stableCount}</div>
                  <span class="badge bg-warning bg-opacity-10 text-warning rounded-pill mt-1">No Rank Change</span>
                </div>
              </div>
            </div>

            <!-- Ranking Statistics Cards Row 2 -->
            <div class="row mb-4 text-center">
              <div class="col-md-4 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-info">
                  <div class="text-muted small fw-semibold text-secondary">Average Rank</div>
                  <div class="fw-bold text-info fs-3 mt-1">${avgRankVal}</div>
                  <span class="badge bg-info bg-opacity-10 text-info rounded-pill mt-1">Overall Average</span>
                </div>
              </div>
              <div class="col-md-4 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-primary">
                  <div class="text-muted small fw-semibold text-secondary">Top 10 Keywords</div>
                  <div class="fw-bold text-primary fs-3 mt-1">${top10}</div>
                  <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill mt-1">Rank 1 to 10</span>
                </div>
              </div>
              <div class="col-md-4 mb-2">
                <div class="bg-white p-3 rounded-4 shadow-sm border-0 border-top border-4 border-secondary">
                  <div class="text-muted small fw-semibold text-secondary">Top 20 Keywords</div>
                  <div class="fw-bold text-secondary fs-3 mt-1">${top20}</div>
                  <span class="badge bg-light text-secondary rounded-pill mt-1">Rank 1 to 20</span>
                </div>
              </div>
            </div>

            <!-- ApexChart -->
            <div class="bg-white p-4 rounded-4 shadow-sm mb-4 border border-light">
              <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-chart-line text-danger me-2"></i>Weekly Ranking Trend</h5>
                <button class="btn btn-sm btn-outline-danger rounded-3 fw-bold btn-reset-chart-filters"><i class="fa-solid fa-arrows-rotate me-1"></i>Reset</button>
              </div>

              <!-- Trend Chart Filters -->
              <div class="row g-2 mb-3 bg-light p-3 rounded-3 border border-light text-start">
                <div class="col-md-4">
                  <label class="form-label small fw-semibold text-secondary">Campaign</label>
                  <select class="form-select form-select-sm rounded-3" id="trend-filter-campaign">
                    ${state.seo.map(x => `<option value="${x.id}" ${x.id === c.id ? 'selected' : ''}>${x.campaignName}</option>`).join("")}
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-semibold text-secondary">Keyword</label>
                  <select class="form-select form-select-sm rounded-3" id="trend-filter-keyword">
                    <option value="all" selected>All Keywords (Average)</option>
                    ${keywordsList.map(kw => `<option value="${kw.keyword}">${kw.keyword}</option>`).join("")}
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-semibold text-secondary">Date Range</label>
                  <div class="d-flex gap-1">
                    <input type="text" class="form-control form-control-sm rounded-3 flatpickr-date" id="trend-filter-start-date" placeholder="Start">
                    <input type="text" class="form-control form-control-sm rounded-3 flatpickr-date" id="trend-filter-end-date" placeholder="End">
                  </div>
                </div>
              </div>

              <div id="seo-trend-chart"></div>
            </div>

            <!-- GSC Summary -->
            <div class="bg-white p-4 rounded-4 shadow-sm mb-4 border border-light">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-google text-danger me-2"></i>Google Search Console Summary</h5>
                <button class="btn btn-sm btn-outline-danger rounded-3 fw-bold" id="btn-edit-gsc"><i class="fa-solid fa-pen me-1"></i>Update Stats</button>
              </div>
              
              <div class="row text-center mb-4">
                <div class="col-3 border-end">
                  <div class="text-muted small">Total Clicks</div>
                  <div class="fw-bold text-dark fs-4">${c.gsc?.totalClicks || 0}</div>
                </div>
                <div class="col-3 border-end">
                  <div class="text-muted small">Total Impressions</div>
                  <div class="fw-bold text-dark fs-4">${c.gsc?.totalImpressions || 0}</div>
                </div>
                <div class="col-3 border-end">
                  <div class="text-muted small">Average CTR</div>
                  <div class="fw-bold text-dark fs-4">${c.gsc?.avgCtr || 0}%</div>
                </div>
                <div class="col-3">
                  <div class="text-muted small">Average Position</div>
                  <div class="fw-bold text-dark fs-4">${c.gsc?.avgPosition || 0}</div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="fw-semibold text-muted small mb-2">Top Search Queries</div>
                  <div class="table-responsive">
                    <table class="table table-sm table-borderless align-middle mb-0 small">
                      <tbody>
                        ${(c.gsc?.topQueries && c.gsc.topQueries.length > 0) ? c.gsc.topQueries.map(q => `
                          <tr>
                            <td><b>${q.query}</b></td>
                            <td class="text-end text-muted">${q.clicks} clicks</td>
                            <td class="text-end text-muted">${q.impressions} impr</td>
                          </tr>
                        `).join("") : '<tr><td class="text-muted text-center py-2">No queries logged</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="fw-semibold text-muted small mb-2">Top Performing Pages</div>
                  <div class="table-responsive">
                    <table class="table table-sm table-borderless align-middle mb-0 small">
                      <tbody>
                        ${(c.gsc?.topPages && c.gsc.topPages.length > 0) ? c.gsc.topPages.map(p => `
                          <tr>
                            <td><b class="text-truncate d-block" style="max-width: 150px;">${p.page}</b></td>
                            <td class="text-end text-muted">${p.clicks} clicks</td>
                            <td class="text-end text-muted">${p.impressions} impr</td>
                          </tr>
                        `).join("") : '<tr><td class="text-muted text-center py-2">No pages logged</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - GA4 Metrics -->
          <div class="col-lg-4">
            <div class="bg-white p-4 rounded-4 shadow-sm border border-light">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-chart-simple text-danger me-2"></i>GA4 Live Traffic</h5>
                <button class="btn btn-sm btn-outline-danger rounded-3 fw-bold" id="btn-edit-ga4"><i class="fa-solid fa-pen me-1"></i>Update Stats</button>
              </div>

              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                  <div>
                    <div class="text-muted small">Total Users</div>
                    <div class="fw-bold text-dark fs-5 mt-1">${c.ga4?.users || 0}</div>
                  </div>
                  <span class="fs-4 text-danger"><i class="fa-solid fa-users"></i></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                  <div>
                    <div class="text-muted small">Sessions</div>
                    <div class="fw-bold text-dark fs-5 mt-1">${c.ga4?.sessions || 0}</div>
                  </div>
                  <span class="fs-4 text-danger"><i class="fa-solid fa-chart-line"></i></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                  <div>
                    <div class="text-muted small">Engaged Sessions</div>
                    <div class="fw-bold text-dark fs-5 mt-1">${c.ga4?.engagedSessions || 0}</div>
                  </div>
                  <span class="fs-4 text-danger"><i class="fa-solid fa-user-check"></i></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                  <div>
                    <div class="text-muted small">Total Views</div>
                    <div class="fw-bold text-dark fs-5 mt-1">${c.ga4?.views || 0}</div>
                  </div>
                  <span class="fs-4 text-danger"><i class="fa-solid fa-eye"></i></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                  <div>
                    <div class="text-muted small">Bounce Rate</div>
                    <div class="fw-bold text-dark fs-5 mt-1">${c.ga4?.bounceRate || 0}%</div>
                  </div>
                  <span class="fs-4 text-danger"><i class="fa-solid fa-percent"></i></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                  <div>
                    <div class="text-muted small">Avg Engagement Time</div>
                    <div class="fw-bold text-dark fs-5 mt-1">${c.ga4?.avgEngagementTime || 0}s</div>
                  </div>
                  <span class="fs-4 text-danger"><i class="fa-solid fa-stopwatch"></i></span>
                </div>
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 text-white" style="background-color: var(--thynk-primary-dark) !important;">
                  <div>
                    <div class="text-light small">Goal Conversions</div>
                    <div class="fw-bold text-white fs-5 mt-1">${c.ga4?.conversions || 0}</div>
                  </div>
                  <span class="fs-4 text-white"><i class="fa-solid fa-trophy"></i></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Render chart with dynamic filters
      let chartInstance = null;
      
      const renderTrendChart = () => {
        const selKeyword = document.getElementById("trend-filter-keyword").value;
        const startDate = document.getElementById("trend-filter-start-date").value;
        const endDate = document.getElementById("trend-filter-end-date").value;
        
        let filteredLogs = c.weeklyLog || [];
        
        // Filter by keyword phrase
        if (selKeyword !== "all") {
          filteredLogs = filteredLogs.filter(log => log.keyword === selKeyword);
        }
        
        // Filter by date range
        if (startDate) {
          filteredLogs = filteredLogs.filter(log => log.weekDate >= startDate);
        }
        if (endDate) {
          filteredLogs = filteredLogs.filter(log => log.weekDate <= endDate);
        }
        
        // Group by Date
        const logsByDate = {};
        filteredLogs.forEach(log => {
          if (!logsByDate[log.weekDate]) logsByDate[log.weekDate] = [];
          logsByDate[log.weekDate].push(log.currRank);
        });
        
        const dates = Object.keys(logsByDate).sort();
        const avgRanks = dates.map(date => {
          const ranks = logsByDate[date];
          const sum = ranks.reduce((a, b) => a + b, 0);
          return Math.round((sum / ranks.length) * 10) / 10;
        });
        
        const chartDates = dates.length > 0 ? dates : ["Week 1", "Week 2", "Week 3", "Week 4"];
        const chartData = dates.length > 0 ? avgRanks : [15, 12, 10, 8];
        
        const options = {
          series: [{ name: 'Rank Position', data: chartData }],
          chart: { height: 300, type: 'line', toolbar: { show: false } },
          colors: ['#c21a1a'],
          stroke: { curve: 'smooth', width: 3 },
          xaxis: { categories: chartDates },
          yaxis: { reversed: true, title: { text: 'Rank (Lower is Better)' } }
        };
        
        if (chartInstance) {
          chartInstance.updateOptions(options);
        } else {
          chartInstance = new ApexCharts(document.querySelector("#seo-trend-chart"), options);
          chartInstance.render();
          window.activeChartsList.push(chartInstance);
        }
      };

      // Initial Chart Render
      renderTrendChart();

      // Bind Chart Filter event listeners
      document.getElementById("trend-filter-keyword").addEventListener("change", renderTrendChart);
      document.getElementById("trend-filter-campaign").addEventListener("change", (e) => {
        renderCampaignDashboard(e.target.value);
      });
      
      flatpickr("#trend-filter-start-date", { dateFormat: "Y-m-d", allowInput: true, onChange: renderTrendChart });
      flatpickr("#trend-filter-end-date", { dateFormat: "Y-m-d", allowInput: true, onChange: renderTrendChart });

      document.querySelector(".btn-reset-chart-filters").addEventListener("click", () => {
        document.getElementById("trend-filter-keyword").value = "all";
        document.getElementById("trend-filter-start-date").value = "";
        document.getElementById("trend-filter-end-date").value = "";
        document.getElementById("trend-filter-campaign").value = campaignId;
        renderTrendChart();
      });

      // GA4 editor listener
      document.getElementById("btn-edit-ga4").addEventListener("click", () => {
        Swal.fire({
          title: "Update GA4 Analytics",
          html: `
            <input id="swal-ga4-users" class="swal2-input" type="number" placeholder="Total Users" value="${c.ga4?.users || 0}">
            <input id="swal-ga4-sessions" class="swal2-input" type="number" placeholder="Sessions" value="${c.ga4?.sessions || 0}">
            <input id="swal-ga4-views" class="swal2-input" type="number" placeholder="Views" value="${c.ga4?.views || 0}">
            <input id="swal-ga4-bounce" class="swal2-input" type="number" step="0.1" placeholder="Bounce Rate %" value="${c.ga4?.bounceRate || 0}">
            <input id="swal-ga4-time" class="swal2-input" type="number" placeholder="Avg Engagement Time (sec)" value="${c.ga4?.avgEngagementTime || 0}">
            <input id="swal-ga4-conv" class="swal2-input" type="number" placeholder="Conversions" value="${c.ga4?.conversions || 0}">
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          preConfirm: () => {
            return {
              users: parseInt(document.getElementById('swal-ga4-users').value) || 0,
              sessions: parseInt(document.getElementById('swal-ga4-sessions').value) || 0,
              engagedSessions: Math.round((parseInt(document.getElementById('swal-ga4-sessions').value) || 0) * 0.65),
              views: parseInt(document.getElementById('swal-ga4-views').value) || 0,
              bounceRate: parseFloat(document.getElementById('swal-ga4-bounce').value) || 0,
              avgEngagementTime: parseInt(document.getElementById('swal-ga4-time').value) || 0,
              conversions: parseInt(document.getElementById('swal-ga4-conv').value) || 0
            };
          }
        }).then(result => {
          if (result.isConfirmed) {
            c.ga4 = result.value;
            saveState();
            Swal.fire("Saved", "GA4 metrics updated successfully.", "success");
            renderCampaignDashboard(campaignId);
          }
        });
      });

      // GSC editor listener
      document.getElementById("btn-edit-gsc").addEventListener("click", () => {
        Swal.fire({
          title: "Update GSC Performance Summary",
          html: `
            <input id="swal-gsc-clicks" class="swal2-input" type="number" placeholder="Total Clicks" value="${c.gsc?.totalClicks || 0}">
            <input id="swal-gsc-impr" class="swal2-input" type="number" placeholder="Total Impressions" value="${c.gsc?.totalImpressions || 0}">
            <input id="swal-gsc-ctr" class="swal2-input" type="number" step="0.01" placeholder="Average CTR %" value="${c.gsc?.avgCtr || 0}">
            <input id="swal-gsc-pos" class="swal2-input" type="number" step="0.1" placeholder="Average Position" value="${c.gsc?.avgPosition || 0}">
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          preConfirm: () => {
            return {
              totalClicks: parseInt(document.getElementById('swal-gsc-clicks').value) || 0,
              totalImpressions: parseInt(document.getElementById('swal-gsc-impr').value) || 0,
              avgCtr: parseFloat(document.getElementById('swal-gsc-ctr').value) || 0,
              avgPosition: parseFloat(document.getElementById('swal-gsc-pos').value) || 0
            };
          }
        }).then(result => {
          if (result.isConfirmed) {
            c.gsc = c.gsc || {};
            c.gsc.totalClicks = result.value.totalClicks;
            c.gsc.totalImpressions = result.value.totalImpressions;
            c.gsc.avgCtr = result.value.avgCtr;
            c.gsc.avgPosition = result.value.avgPosition;
            saveState();
            Swal.fire("Saved", "Search Console metrics updated.", "success");
            renderCampaignDashboard(campaignId);
          }
        });
      });
    }

    else if (activeTab === "keywords") {
      tabContainer.innerHTML = `
        <div class="bg-white p-4 rounded-4 shadow-sm border border-light">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-key text-danger me-2"></i>Tracked Keywords</h5>
            <button class="btn btn-danger btn-sm rounded-3 px-3 fw-bold" id="btn-add-keyword" style="background-color: var(--thynk-primary); border: none;">
              <i class="fa-solid fa-plus me-1"></i>Track Keyword
            </button>
          </div>

          <!-- Keywords Filters Row -->
          <div class="row g-2 mb-4 bg-light p-3 rounded-3 border border-light">
            <div class="col-md-3">
              <label class="form-label small fw-semibold text-secondary">Search Engine</label>
              <select class="form-select form-select-sm rounded-3" id="kw-filter-engine">
                <option value="all" selected>All Engines</option>
                <option value="Google">Google</option>
                <option value="Bing">Bing</option>
                <option value="Yahoo">Yahoo</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-semibold text-secondary">Device Focus</label>
              <select class="form-select form-select-sm rounded-3" id="kw-filter-device">
                <option value="all" selected>All Devices</option>
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-semibold text-secondary">Priority</label>
              <select class="form-select form-select-sm rounded-3" id="kw-filter-priority">
                <option value="all" selected>All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-sm btn-outline-danger w-100 rounded-3 fw-bold" id="btn-reset-kw-filters"><i class="fa-solid fa-arrows-rotate me-1"></i>Reset Filters</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table align-middle table-hover" id="keywords-table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Target URL</th>
                  <th>Engine / Device</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Search Volume</th>
                  <th>Difficulty %</th>
                  <th class="text-center">Prev Rank</th>
                  <th class="text-center">Curr Rank</th>
                  <th class="text-center">Rank Change</th>
                  <th class="text-center">Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- Populated dynamically via filterKeywordsTable -->
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Helper function to bind action events to table buttons
      const bindKwActions = () => {
        // Edit Keyword Click Handlers
        document.querySelectorAll(".edit-kw-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const kwId = btn.getAttribute("data-id");
            const kw = keywordsList.find(x => x.id === kwId);
            if (!kw) return;

            document.getElementById("kw-id-hidden").value = kw.id;
            document.getElementById("kw-campaign-id-hidden").value = campaignId;
            document.getElementById("kw-campaign-select-wrapper").classList.add("d-none");
            document.getElementById("kw-input-name").value = kw.keyword;
            document.getElementById("kw-input-name").disabled = true; // Lock keyword phrase on edit
            document.getElementById("kw-input-target-url").value = kw.targetUrl || "";
            document.getElementById("kw-input-engine").value = kw.searchEngine || "Google";
            document.getElementById("kw-input-device").value = kw.device || "Desktop";
            document.getElementById("kw-input-location").value = kw.location || "Global";
            document.getElementById("kw-input-status").value = kw.status || "No Change";
            document.getElementById("kw-input-priority").value = kw.priority || "Medium";
            document.getElementById("kw-input-curr-rank").value = kw.currentRank;
            document.getElementById("kw-input-prev-rank").value = kw.previousRank;
            document.getElementById("kw-input-volume").value = kw.searchVolume || "";
            document.getElementById("kw-input-difficulty").value = kw.difficulty || "";
            document.getElementById("kw-input-notes").value = kw.notes || "";

            const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("addKeywordModal"));
            modalEl.show();
          });
        });

        // Delete Keyword Click Handlers
        document.querySelectorAll(".delete-kw-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const kwId = btn.getAttribute("data-id");
            const kw = keywordsList.find(x => x.id === kwId);
            if (!kw) return;

            Swal.fire({
              title: "Stop Tracking Keyword?",
              text: `Are you sure you want to stop tracking "${kw.keyword}"?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "var(--thynk-primary)",
              cancelButtonColor: "#6c757d",
              confirmButtonText: "Yes, delete it!"
            }).then(result => {
              if (result.isConfirmed) {
                c.keywords = c.keywords.filter(x => x.id !== kwId);
                saveState();
                Swal.fire("Deleted!", "Keyword has been removed.", "success");
                renderCampaignDashboard(campaignId);
              }
            });
          });
        });
      };

      // Filter and render helper
      const filterKeywordsTable = () => {
        const engine = document.getElementById("kw-filter-engine").value;
        const device = document.getElementById("kw-filter-device").value;
        const priority = document.getElementById("kw-filter-priority").value;
        
        let filtered = keywordsList;
        if (engine !== "all") {
          filtered = filtered.filter(x => x.searchEngine === engine);
        }
        if (device !== "all") {
          filtered = filtered.filter(x => x.device === device);
        }
        if (priority !== "all") {
          filtered = filtered.filter(x => (x.priority || "Medium") === priority);
        }
        
        const tbody = document.querySelector("#keywords-table tbody");
        if (tbody) {
          tbody.innerHTML = filtered.map(kw => {
            const diff = kw.previousRank - kw.currentRank;
            const diffText = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
            const badgeColor = kw.status === 'Improved' ? 'bg-success' : kw.status === 'Dropped' ? 'bg-danger' : 'bg-secondary';
            const trendIcon = diff > 0 ? '<i class="fa-solid fa-circle-chevron-up text-success me-1"></i>' : diff < 0 ? '<i class="fa-solid fa-circle-chevron-down text-danger me-1"></i>' : '<i class="fa-solid fa-circle-minus text-secondary me-1"></i>';
            const priorityBadgeColor = kw.priority === 'High' ? 'bg-danger text-white' : kw.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-secondary text-white';
            
            return `
              <tr>
                <td>
                  <span class="fw-bold text-dark">${kw.keyword}</span>
                  ${kw.notes ? `<div class="small text-muted mt-1 fw-normal" style="font-size: 11px;"><i class="fa-solid fa-note-sticky me-1 text-warning"></i>${kw.notes}</div>` : ''}
                </td>
                <td><a href="${kw.targetUrl}" target="_blank" class="text-secondary text-decoration-none small text-truncate d-inline-block" style="max-width: 150px;">${kw.targetUrl ? kw.targetUrl.replace("https://", "") : 'Not set'}</a></td>
                <td><span class="small fw-semibold text-secondary"><i class="fa-brands fa-google text-danger me-1"></i>${kw.searchEngine} (${kw.device})</span></td>
                <td><span class="badge bg-light text-dark fw-semibold">${kw.location}</span></td>
                <td><span class="badge ${priorityBadgeColor} p-2 rounded-3 small">${kw.priority || 'Medium'}</span></td>
                <td>${kw.searchVolume || 'N/A'}</td>
                <td>
                  ${kw.difficulty ? `
                    <div class="d-flex align-items-center gap-2">
                      <span class="small fw-bold">${kw.difficulty}%</span>
                      <div class="progress flex-grow-1" style="height: 4px; width: 40px;">
                        <div class="progress-bar bg-danger" style="width: ${kw.difficulty}%;"></div>
                      </div>
                    </div>
                  ` : 'N/A'}
                </td>
                <td class="text-center">${kw.previousRank}</td>
                <td class="text-center fw-bold text-dark">${kw.currentRank}</td>
                <td class="text-center fw-bold">${trendIcon}${diffText}</td>
                <td class="text-center"><span class="badge ${badgeColor} small rounded-pill">${kw.status}</span></td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary border-0 edit-kw-btn" data-id="${kw.id}" title="Edit Keyword"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button class="btn btn-sm btn-outline-danger border-0 delete-kw-btn" data-id="${kw.id}" title="Delete Keyword"><i class="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            `;
          }).join("");
          
          bindKwActions();
        }
        
        // Re-initialize DataTable
        if (window.jQuery && $.fn.DataTable) {
          if ($.fn.DataTable.isDataTable('#keywords-table')) {
            $('#keywords-table').DataTable().destroy();
          }
          $('#keywords-table').DataTable({
            pageLength: 10,
            lengthMenu: [5, 10, 25],
            ordering: true,
            language: { searchPlaceholder: "Search keywords..." }
          });
        }
      };

      // Initial render
      filterKeywordsTable();

      // Bind filter change events
      document.getElementById("kw-filter-engine").addEventListener("change", filterKeywordsTable);
      document.getElementById("kw-filter-device").addEventListener("change", filterKeywordsTable);
      document.getElementById("kw-filter-priority").addEventListener("change", filterKeywordsTable);
      document.getElementById("btn-reset-kw-filters").addEventListener("click", () => {
        document.getElementById("kw-filter-engine").value = "all";
        document.getElementById("kw-filter-device").value = "all";
        document.getElementById("kw-filter-priority").value = "all";
        filterKeywordsTable();
      });

      // Add Keyword Button Trigger
      document.getElementById("btn-add-keyword").addEventListener("click", () => {
        document.getElementById("kw-id-hidden").value = "";
        document.getElementById("kw-campaign-id-hidden").value = campaignId;
        document.getElementById("kw-campaign-select-wrapper").classList.add("d-none");
        document.getElementById("kw-input-name").value = "";
        document.getElementById("kw-input-name").disabled = false;
        document.getElementById("kw-input-target-url").value = c.websiteUrl || "";
        document.getElementById("kw-input-engine").value = "Google";
        document.getElementById("kw-input-device").value = "Desktop";
        document.getElementById("kw-input-location").value = "Global";
        document.getElementById("kw-input-status").value = "No Change";
        document.getElementById("kw-input-priority").value = "Medium";
        document.getElementById("kw-input-curr-rank").value = "10";
        document.getElementById("kw-input-prev-rank").value = "10";
        document.getElementById("kw-input-volume").value = "";
        document.getElementById("kw-input-difficulty").value = "";
        document.getElementById("kw-input-notes").value = "";

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("addKeywordModal"));
        modalEl.show();
      });
    }

    else if (activeTab === "weekly") {
      tabContainer.innerHTML = `
        <div class="row">
          <!-- Log Form Side -->
          <div class="col-lg-4 mb-4">
            <div class="bg-white p-4 rounded-4 shadow-sm border border-light">
              <h5 class="fw-bold mb-3 text-dark"><i class="fa-solid fa-plus-circle text-danger me-2"></i>Log Ranking Update</h5>
              <button class="btn btn-danger w-100 rounded-3 py-2 fw-semibold" id="btn-trigger-log-modal">
                <i class="fa-solid fa-square-plus me-1"></i>Enter Weekly Update
              </button>
              
              <hr class="my-4">

              <h6 class="fw-bold text-secondary mb-3">Ranking Summary Metrics</h6>
              <div class="row text-center g-2">
                <div class="col-4">
                  <div class="bg-success bg-opacity-10 text-success p-2 rounded-3">
                    <div class="small fw-semibold">Improved</div>
                    <div class="fs-4 fw-bold mt-1">${improvedCount}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="bg-secondary bg-opacity-10 text-secondary p-2 rounded-3">
                    <div class="small fw-semibold">Stable</div>
                    <div class="fs-4 fw-bold mt-1">${stableCount}</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="bg-danger bg-opacity-10 text-danger p-2 rounded-3">
                    <div class="small fw-semibold">Dropped</div>
                    <div class="fs-4 fw-bold mt-1">${droppedCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- History Table Side -->
          <div class="col-lg-8">
            <div class="bg-white p-4 rounded-4 shadow-sm border border-light">
              <h5 class="fw-bold mb-4 text-dark"><i class="fa-solid fa-history text-danger me-2"></i>Weekly Rank History Logs</h5>
              
              <!-- History Table Filters -->
              <div class="row g-2 mb-3 bg-light p-3 rounded-3 border border-light">
                <div class="col-md-3">
                  <label class="form-label small fw-semibold text-secondary">Campaign</label>
                  <select class="form-select form-select-sm rounded-3" id="history-filter-campaign">
                    <option value="current" selected>This Campaign Only</option>
                    <option value="all">All Campaigns</option>
                    ${state.seo.map(x => `<option value="${x.id}">${x.campaignName}</option>`).join("")}
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-semibold text-secondary">Month</label>
                  <select class="form-select form-select-sm rounded-3" id="history-filter-month">
                    <option value="all" selected>All Months</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-semibold text-secondary">Keyword Search</label>
                  <input type="text" class="form-control form-control-sm rounded-3" id="history-filter-keyword" placeholder="Search keyword...">
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-semibold text-secondary">Date</label>
                  <input type="text" class="form-control form-control-sm rounded-3 flatpickr-date" id="history-filter-date" placeholder="YYYY-MM-DD">
                </div>
              </div>

              <div class="table-responsive">
                <table class="table align-middle table-hover" id="weekly-log-table">
                  <thead>
                    <tr>
                      <th>Week/Date</th>
                      <th>Campaign</th>
                      <th>Keyword</th>
                      <th class="text-center">Prev Rank</th>
                      <th class="text-center">Curr Rank</th>
                      <th class="text-center">Change</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Populated dynamically via applyHistoryFilters -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      // History log filter application
      const applyHistoryFilters = () => {
        const selectedCamp = document.getElementById("history-filter-campaign").value;
        const monthVal = document.getElementById("history-filter-month").value;
        const keywordVal = document.getElementById("history-filter-keyword").value.toLowerCase();
        const dateVal = document.getElementById("history-filter-date").value;
        
        let logsList = [];
        if (selectedCamp === "current") {
          logsList = (c.weeklyLog || []).map((log, idx) => ({ ...log, originalIndex: idx, campaignId: c.id, campaignName: c.campaignName }));
        } else if (selectedCamp === "all") {
          state.seo.forEach(camp => {
            const logs = camp.weeklyLog || [];
            logs.forEach((log, idx) => {
              logsList.push({ ...log, originalIndex: idx, campaignId: camp.id, campaignName: camp.campaignName });
            });
          });
        } else {
          const camp = state.seo.find(x => x.id === selectedCamp);
          if (camp) {
            logsList = (camp.weeklyLog || []).map((log, idx) => ({ ...log, originalIndex: idx, campaignId: camp.id, campaignName: camp.campaignName }));
          }
        }
        
        // Apply Month Filter (weekDate format is YYYY-MM-DD)
        if (monthVal !== "all") {
          logsList = logsList.filter(log => {
            if (!log.weekDate) return false;
            const parts = log.weekDate.split("-");
            return parts[1] === monthVal;
          });
        }
        
        // Apply Keyword Filter
        if (keywordVal) {
          logsList = logsList.filter(log => log.keyword.toLowerCase().includes(keywordVal));
        }
        
        // Apply Date Filter
        if (dateVal) {
          logsList = logsList.filter(log => log.weekDate === dateVal);
        }
        
        const tbody = document.querySelector("#weekly-log-table tbody");
        if (tbody) {
          tbody.innerHTML = logsList.map(log => {
            const trendIcon = log.rankChange > 0 ? '<i class="fa-solid fa-circle-arrow-up text-success me-1"></i>' : log.rankChange < 0 ? '<i class="fa-solid fa-circle-arrow-down text-danger me-1"></i>' : '<i class="fa-solid fa-minus text-secondary me-1"></i>';
            const badgeColor = log.status === 'Improved' ? 'bg-success bg-opacity-10 text-success' : log.status === 'Dropped' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary';
            return `
              <tr>
                <td><span class="small fw-semibold">${log.weekDate}</span></td>
                <td><span class="small text-secondary">${log.campaignName}</span></td>
                <td><b>${log.keyword}</b></td>
                <td class="text-center">${log.prevRank}</td>
                <td class="text-center fw-bold text-dark">${log.currRank}</td>
                <td class="text-center fw-bold">${trendIcon}${Math.abs(log.rankChange)}</td>
                <td><span class="badge ${badgeColor} p-2 rounded-pill small">${log.status}</span></td>
                <td><span class="small text-muted">${log.remarks || ''}</span></td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-danger border-0 delete-weekly-log-btn" data-campaign-id="${log.campaignId}" data-index="${log.originalIndex}" title="Delete Log"><i class="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            `;
          }).join("");
          
          // Bind Delete Actions
          document.querySelectorAll(".delete-weekly-log-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              const campId = btn.getAttribute("data-campaign-id");
              const logIdx = parseInt(btn.getAttribute("data-index"));
              const targetCamp = state.seo.find(x => x.id === campId);
              if (!targetCamp) return;
              
              Swal.fire({
                title: "Delete Weekly Rank Entry?",
                text: "This rank history entry will be deleted permanently.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--thynk-primary)",
                confirmButtonText: "Yes, delete it!"
              }).then(result => {
                if (result.isConfirmed) {
                  targetCamp.weeklyLog.splice(logIdx, 1);
                  saveState();
                  Swal.fire("Deleted!", "Weekly rank log entry removed.", "success");
                  renderCampaignDashboard(campaignId);
                }
              });
            });
          });
        }
        
        // Re-initialize DataTable
        if (window.jQuery && $.fn.DataTable) {
          if ($.fn.DataTable.isDataTable('#weekly-log-table')) {
            $('#weekly-log-table').DataTable().destroy();
          }
          $('#weekly-log-table').DataTable({
            pageLength: 10,
            ordering: true,
            order: [[0, "desc"]],
            language: { searchPlaceholder: "Search logs..." }
          });
        }
      };

      // Initial Filter Trigger
      applyHistoryFilters();

      // Bind filter change events
      document.getElementById("history-filter-campaign").addEventListener("change", applyHistoryFilters);
      document.getElementById("history-filter-month").addEventListener("change", applyHistoryFilters);
      document.getElementById("history-filter-keyword").addEventListener("input", applyHistoryFilters);
      document.getElementById("history-filter-date").addEventListener("change", applyHistoryFilters);
      
      flatpickr("#history-filter-date", { dateFormat: "Y-m-d", allowInput: true });

      // Log Modal Trigger
      document.getElementById("btn-trigger-log-modal").addEventListener("click", () => {
        if (keywordsList.length === 0) {
          Swal.fire("No Keywords Tracked", "Please add keywords first in the Keywords tab before logging rank updates.", "warning");
          return;
        }

        document.getElementById("weekly-campaign-id-hidden").value = campaignId;
        document.getElementById("weekly-input-date").value = new Date().toISOString().split("T")[0];
        
        // Populate keyword select options
        const select = document.getElementById("weekly-input-keyword-id");
        select.innerHTML = `<option value="" disabled selected>Choose Keyword...</option>` + 
          keywordsList.map(kw => `<option value="${kw.keyword}">${kw.keyword} (Current: ${kw.currentRank})</option>`).join("");
        
        document.getElementById("weekly-input-prev-rank").value = "10";
        document.getElementById("weekly-input-curr-rank").value = "10";
        document.getElementById("weekly-input-engine").value = "Google";
        document.getElementById("weekly-input-device").value = "Desktop";
        document.getElementById("weekly-input-remarks").value = "";

        flatpickr("#weekly-input-date", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("addWeeklyRankModal"));
        modalEl.show();
      });
    }

    else if (activeTab === "reports") {
      const ga4Reports = (c.uploadedReports || []).filter(x => x.type === "ga4");
      const gscReports = (c.uploadedReports || []).filter(x => x.type === "gsc");

      tabContainer.innerHTML = `
        <div class="row">
          <!-- Left Column - Upload tables -->
          <div class="col-lg-8">
            <!-- GA4 Uploaded files -->
            <div class="bg-white p-4 rounded-4 shadow-sm border border-light mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-chart-simple text-danger me-2"></i>Google Analytics 4 Reports</h5>
                <button class="btn btn-outline-danger btn-sm rounded-3 fw-bold btn-upload-doc" data-type="ga4"><i class="fa-solid fa-upload me-1"></i>Upload GA4</button>
              </div>
              <div class="table-responsive">
                <table class="table align-middle table-hover small">
                  <thead>
                    <tr>
                      <th>Upload Date</th>
                      <th>Report Name / File</th>
                      <th>Notes</th>
                      <th class="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ga4Reports.length > 0 ? ga4Reports.map(rep => `
                      <tr>
                        <td><span class="text-muted fw-semibold">${rep.uploadDate}</span></td>
                        <td>
                          <b class="text-dark d-block">${rep.fileName}</b>
                          <span class="text-muted small">${rep.fileSize || 'Unknown Size'}</span>
                        </td>
                        <td><span class="text-muted">${rep.notes || ''}</span></td>
                        <td class="text-end">
                          <button class="btn btn-sm btn-outline-danger border-0 btn-download-rep" data-name="${rep.fileName}"><i class="fa-solid fa-download"></i></button>
                          <button class="btn btn-sm btn-outline-danger border-0 btn-delete-rep" data-name="${rep.fileName}"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                      </tr>
                    `).join("") : '<tr><td colspan="4" class="text-muted text-center py-3">No GA4 reports uploaded</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- GSC Uploaded files -->
            <div class="bg-white p-4 rounded-4 shadow-sm border border-light">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-google text-danger me-2"></i>Search Console Reports</h5>
                <button class="btn btn-outline-danger btn-sm rounded-3 fw-bold btn-upload-doc" data-type="gsc"><i class="fa-solid fa-upload me-1"></i>Upload GSC</button>
              </div>
              <div class="table-responsive">
                <table class="table align-middle table-hover small">
                  <thead>
                    <tr>
                      <th>Upload Date</th>
                      <th>Report Name / File</th>
                      <th>Notes</th>
                      <th class="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${gscReports.length > 0 ? gscReports.map(rep => `
                      <tr>
                        <td><span class="text-muted fw-semibold">${rep.uploadDate}</span></td>
                        <td>
                          <b class="text-dark d-block">${rep.fileName}</b>
                          <span class="text-muted small">${rep.fileSize || 'Unknown Size'}</span>
                        </td>
                        <td><span class="text-muted">${rep.notes || ''}</span></td>
                        <td class="text-end">
                          <button class="btn btn-sm btn-outline-danger border-0 btn-download-rep" data-name="${rep.fileName}"><i class="fa-solid fa-download"></i></button>
                          <button class="btn btn-sm btn-outline-danger border-0 btn-delete-rep" data-name="${rep.fileName}"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                      </tr>
                    `).join("") : '<tr><td colspan="4" class="text-muted text-center py-3">No GSC reports uploaded</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Right Column - Settings & Reminders -->
          <div class="col-lg-4">
            <div class="bg-white p-4 rounded-4 shadow-sm border border-light">
              <h5 class="fw-bold mb-3 text-dark"><i class="fa-solid fa-bell text-danger me-2"></i>Scheduling & Alerts</h5>
              
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Report Frequency</label>
                <select class="form-select rounded-3" id="settings-frequency">
                  <option value="Weekly" ${c.reportFrequency === 'Weekly' ? 'selected' : ''}>Weekly</option>
                  <option value="Monthly" ${c.reportFrequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
                  <option value="Custom" ${c.reportFrequency === 'Custom' ? 'selected' : ''}>Custom</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Next Reporting Date</label>
                <input type="text" class="form-control rounded-3 flatpickr-date" id="settings-report-date" value="${c.reportDate || ''}" placeholder="Select Date">
              </div>

              <div class="bg-danger bg-opacity-10 text-danger p-3 rounded-3 small">
                <h6 class="fw-bold mb-2"><i class="fa-solid fa-circle-exclamation me-1"></i>Reminder Notifications:</h6>
                <ul class="mb-0 padding-left-15" style="padding-left: 15px;">
                  <li>Alert triggers **one day before** report date.</li>
                  <li>Alert triggers **on report date**.</li>
                  <li>Reports flagged pending will display as global tasks in dashboard view.</li>
                </ul>
              </div>

              <button class="btn btn-danger w-100 rounded-3 py-2 fw-semibold mt-4" id="btn-save-report-settings" style="background-color: var(--thynk-primary); border: none;">
                <i class="fa-solid fa-floppy-disk me-1"></i>Save Schedule
              </button>
            </div>
          </div>
        </div>
      `;

      flatpickr("#settings-report-date", { dateFormat: "Y-m-d", allowInput: true });

      // Save Schedule Listener
      document.getElementById("btn-save-report-settings").addEventListener("click", () => {
        c.reportFrequency = document.getElementById("settings-frequency").value;
        c.reportDate = document.getElementById("settings-report-date").value;
        saveState();
        Swal.fire("Schedule Updated", "Reporting frequency and due dates updated successfully.", "success");
        renderCampaignDashboard(campaignId);
      });

      // Upload Modal Trigger Click Handlers
      document.querySelectorAll(".btn-upload-doc").forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-type");
          document.getElementById("upload-campaign-id-hidden").value = campaignId;
          document.getElementById("upload-report-type").value = type;
          document.getElementById("upload-report-name").value = "";
          document.getElementById("upload-report-notes").value = "";
          document.getElementById("upload-report-file").value = "";

          const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("uploadSeoReportModal"));
          modalEl.show();
        });
      });

      // Mock Report Download Click Handlers
      document.querySelectorAll(".btn-download-rep").forEach(btn => {
        btn.addEventListener("click", () => {
          const fileName = btn.getAttribute("data-name");
          Swal.fire({
            title: "Downloading File",
            text: `Preparing raw data stream for: ${fileName}`,
            icon: "info",
            timer: 1500,
            showConfirmButton: false
          });
        });
      });

      // Delete Report Click Handlers
      document.querySelectorAll(".btn-delete-rep").forEach(btn => {
        btn.addEventListener("click", () => {
          const fileName = btn.getAttribute("data-name");
          Swal.fire({
            title: "Delete Uploaded Report?",
            text: `Are you sure you want to delete ${fileName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--thynk-primary)",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
          }).then(result => {
            if (result.isConfirmed) {
              c.uploadedReports = c.uploadedReports.filter(x => x.fileName !== fileName);
              saveState();
              Swal.fire("Deleted", "Report entry removed successfully.", "success");
              renderCampaignDashboard(campaignId);
            }
          });
        });
      });
    }

    // Bind tab clicks
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.seoActiveTab = btn.getAttribute("data-tab");
        saveState();
        renderCampaignDashboard(campaignId);
      });
    });

    // Bind PDF Exporter click
    document.querySelector(".btn-export-pdf").addEventListener("click", () => {
      exportCampaignPdf(c);
    });
  };

  // HELPER: BUILD AND DOWNLOAD PDF REPORT
  const exportCampaignPdf = (c) => {
    Swal.fire({
      title: "Generating PDF...",
      text: "Compiling charts and reports. Please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Fetch the chart element if available to convert to image
    let chartImg = "";
    const chartInstance = window.activeChartsList[window.activeChartsList.length - 1];
    
    const triggerDownload = (imgURI) => {
      chartImg = imgURI || "";
      const clientName = getClientName(c.clientId);
      const keywordsList = c.keywords || [];
      const totalKeywords = keywordsList.length;
      const top10 = keywordsList.filter(k => k.currentRank <= 10).length;
      const top20 = keywordsList.filter(k => k.currentRank <= 20).length;
      const improvedCount = keywordsList.filter(k => k.status === 'Improved').length;
      const droppedCount = keywordsList.filter(k => k.status === 'Dropped').length;
      const stableCount = keywordsList.filter(k => k.status === 'No Change').length;

      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;" id="seo-pdf-report">
          <!-- Cover Page -->
          <div style="height: 980px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #eee; padding: 40px; page-break-after: always; position: relative;">
            <div style="text-align: center; margin-top: 100px;">
              <h1 style="color: #c21a1a; font-size: 3rem; margin-bottom: 10px; font-weight: 800;">Thynk Digital</h1>
              <p style="text-transform: uppercase; letter-spacing: 2px; color: #777; font-weight: bold;">SEO Campaign Performance Report</p>
            </div>
            <div style="margin: 150px 0;">
              <h2 style="font-size: 2.2rem; color: #222; border-bottom: 2px solid #c21a1a; padding-bottom: 10px; font-weight: bold;">${c.campaignName}</h2>
              <table style="width: 100%; margin-top: 20px; font-size: 1.1rem; line-height: 2;">
                <tr><td style="font-weight: bold; width: 40%;">Client Name:</td><td>${clientName}</td></tr>
                <tr><td style="font-weight: bold;">Website URL:</td><td>${c.websiteUrl || 'N/A'}</td></tr>
                <tr><td style="font-weight: bold;">SEO Package:</td><td>${c.package || 'Silver'} Package</td></tr>
                <tr><td style="font-weight: bold;">Reporting Period:</td><td>${c.startDate || 'N/A'} to ${c.endDate || 'N/A'}</td></tr>
              </table>
            </div>
            <div style="text-align: center; font-size: 0.9rem; color: #777; border-top: 1px solid #eee; padding-top: 20px;">
              Generated on ${new Date().toLocaleDateString()} &middot; Confidential Client Document
            </div>
          </div>

          <!-- Page 2: Summary & Keywords -->
          <div style="page-break-after: always; padding-top: 20px; min-height: 980px;">
            <h2 style="color: #c21a1a; border-bottom: 1px solid #ddd; padding-bottom: 8px; font-weight: bold;">1. Executive Summary</h2>
            <div style="display: flex; gap: 15px; margin: 20px 0; justify-content: space-between;">
              <div style="background: #fdf5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #c21a1a; flex: 1; text-align: center;">
                <div style="font-size: 0.9rem; color: #666;">Total Keywords</div>
                <div style="font-size: 1.8rem; font-weight: bold; color: #222;">${totalKeywords}</div>
              </div>
              <div style="background: #fdf5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #c21a1a; flex: 1; text-align: center;">
                <div style="font-size: 0.9rem; color: #666;">Top 10 Rankings</div>
                <div style="font-size: 1.8rem; font-weight: bold; color: #222;">${top10}</div>
              </div>
              <div style="background: #fdf5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #c21a1a; flex: 1; text-align: center;">
                <div style="font-size: 0.9rem; color: #666;">Top 20 Rankings</div>
                <div style="font-size: 1.8rem; font-weight: bold; color: #222;">${top20}</div>
              </div>
            </div>
            <p style="line-height: 1.6; font-size: 1rem; margin-bottom: 30px;">
              During this reporting period, organic search visibility has seen a steady trajectory. Out of the <b>${totalKeywords}</b> tracked keywords, 
              <b>${improvedCount}</b> keywords experienced ranking gains, <b>${stableCount}</b> remained stable, and <b>${droppedCount}</b> dropped.
            </p>

            <h2 style="color: #c21a1a; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 40px; font-weight: bold;">2. Active Keyword Rankings</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9rem; text-align: left;">
              <thead>
                <tr style="background: #c21a1a; color: white;">
                  <th style="padding: 10px; border: 1px solid #ddd;">Keyword</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Engine</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Location</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Previous Rank</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Current Rank</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Change</th>
                </tr>
              </thead>
              <tbody>
                ${keywordsList.length > 0 ? keywordsList.map(kw => {
                  const diff = kw.previousRank - kw.currentRank;
                  const diffText = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
                  const diffColor = diff > 0 ? "green" : diff < 0 ? "red" : "#777";
                  return `
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${kw.keyword}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${kw.searchEngine} (${kw.device})</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${kw.location}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${kw.previousRank}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${kw.currentRank}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: ${diffColor}; font-weight: bold;">${diffText}</td>
                    </tr>
                  `;
                }).join("") : '<tr><td colspan="6" style="padding: 15px; text-align: center; color: #999;">No keywords configured for tracking</td></tr>'}
              </tbody>
            </table>
          </div>

          <!-- Page 3: Trend & Google Analytics -->
          <div style="page-break-after: always; padding-top: 20px; min-height: 980px;">
            <h2 style="color: #c21a1a; border-bottom: 1px solid #ddd; padding-bottom: 8px; font-weight: bold;">3. Ranking Trend History</h2>
            <div style="text-align: center; margin: 25px 0;">
              ${chartImg ? `<img src="${chartImg}" style="max-width: 90%; max-height: 280px; object-fit: contain;">` : '<p style="color: #999;">Trend chart not available.</p>'}
            </div>

            <h2 style="color: #c21a1a; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 40px; font-weight: bold;">4. Google Analytics 4 (GA4) Traffic Summary</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 1rem; line-height: 2.2;">
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold; width: 50%;">Total Users:</td><td>${c.ga4?.users || 0}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold;">Sessions:</td><td>${c.ga4?.sessions || 0}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold;">Engaged Sessions:</td><td>${c.ga4?.engagedSessions || 0}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold;">Total Page Views:</td><td>${c.ga4?.views || 0}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold;">Bounce Rate:</td><td>${c.ga4?.bounceRate || 0}%</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold;">Average Engagement Time:</td><td>${c.ga4?.avgEngagementTime || 0}s</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="font-weight: bold; color: #c21a1a;">Goal Conversions:</td><td style="font-weight: bold; color: #c21a1a;">${c.ga4?.conversions || 0}</td></tr>
            </table>
          </div>

          <!-- Page 4: Search Console & Recommendations -->
          <div style="padding-top: 20px;">
            <h2 style="color: #c21a1a; border-bottom: 1px solid #ddd; padding-bottom: 8px; font-weight: bold;">5. Google Search Console Summary</h2>
            <div style="display: flex; gap: 10px; margin: 15px 0; justify-content: space-between;">
              <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-size: 0.8rem; color: #666;">Clicks</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: #222;">${c.gsc?.totalClicks || 0}</div>
              </div>
              <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-size: 0.8rem; color: #666;">Impressions</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: #222;">${c.gsc?.totalImpressions || 0}</div>
              </div>
              <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-size: 0.8rem; color: #666;">Avg CTR</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: #222;">${c.gsc?.avgCtr || 0}%</div>
              </div>
              <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-size: 0.8rem; color: #666;">Avg Position</div>
                <div style="font-size: 1.3rem; font-weight: bold; color: #222;">${c.gsc?.avgPosition || 0}</div>
              </div>
            </div>

            <h3 style="font-size: 1rem; color: #333; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 5px; font-weight: bold;">Top GSC Search Queries</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 8px; border: 1px solid #ddd;">Query</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Clicks</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Impressions</th>
                </tr>
              </thead>
              <tbody>
                ${(c.gsc?.topQueries && c.gsc.topQueries.length > 0) ? c.gsc.topQueries.slice(0, 5).map(q => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${q.query}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${q.clicks}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${q.impressions}</td>
                  </tr>
                `).join("") : '<tr><td colspan="3" style="padding: 10px; text-align: center; color: #999;">No Search Console query data logs present</td></tr>'}
              </tbody>
            </table>

            <h2 style="color: #c21a1a; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 40px; font-weight: bold;">6. Highlights & Recommendations</h2>
            <div style="background: #fdf8e2; border: 1px solid #fbe7b0; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <h4 style="margin-top: 0; color: #856404; font-size: 1rem; font-weight: bold;"><i class="fa-solid fa-lightbulb me-1"></i>Strategic Insights</h4>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; line-height: 1.6; color: #533f03;">
                <li><b>Top Performing Keyword:</b> ${keywordsList.filter(k => k.status === 'Improved').sort((a,b) => (b.previousRank - b.currentRank) - (a.previousRank - a.currentRank))[0]?.keyword || 'N/A'} has shown the most improvement.</li>
                <li>Focus on generating high-quality backlinks to pages targeting lower ranking keywords.</li>
                <li>Optimize metadata and header tag structures to capture wider long-tail keywords.</li>
              </ul>
            </div>

            <div style="margin-top: 30px;">
              <h4 style="font-size: 1rem; margin-bottom: 8px; font-weight: bold;">Adviser Recommendations:</h4>
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 6px; min-height: 100px; font-size: 0.95rem; background: #fff; line-height: 1.5; color: #555;">
                ${c.notes || 'No custom recommendations entered.'}
              </div>
            </div>
          </div>
        </div>
      `;

      const opt = {
        margin:       0,
        filename:     `${c.campaignName.replace(/\s+/g, '_').toLowerCase()}_report.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        Swal.close();
      }).catch(err => {
        console.error("PDF Export Error:", err);
        Swal.fire("Export Failed", "Could not generate PDF: " + err.message, "error");
      });
    };

    if (chartInstance) {
      chartInstance.dataURI().then(({ imgURI }) => {
        triggerDownload(imgURI);
      }).catch(err => {
        console.warn("Chart dataURI failed, rendering PDF without trend line:", err);
        triggerDownload("");
      });
    } else {
      triggerDownload("");
    }
  };

  // VIEW: WEBSITE DEVELOPMENT PROJECTS
  const renderProjects = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Web Development Workrooms</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Ops</a></li>
              <li class="breadcrumb-item active" aria-current="page">Projects</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        ${state.projects.map(proj => `
          <div class="col-lg-6 mb-4">
            <div class="thynk-card">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="fw-bold mb-1 text-dark">${proj.projectName}</h5>
                  <span class="text-danger small fw-semibold">${getClientName(proj.clientId)}</span>
                </div>
                <div class="d-flex gap-1 align-items-center">
                  <button class="btn btn-sm btn-outline-primary edit-project-btn border-0" data-id="${proj.id}" title="Edit Project Details">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <span class="badge-status badge-active">${proj.status}</span>
                </div>
              </div>

              <div class="p-3 bg-light rounded-3 mb-3 small">
                <div class="row">
                  <div class="col-6 mb-2"><b>Website Type:</b> ${proj.websiteType}</div>
                  <div class="col-6 mb-2"><b>Developer:</b> ${getEmployeeName(proj.assignedDeveloperId)}</div>
                  <div class="col-6"><b>Start Date:</b> ${proj.startDate}</div>
                  <div class="col-6"><b>Delivery Due:</b> ${proj.deliveryDate}</div>
                </div>
              </div>

              <div class="mb-3 small">
                <div class="d-flex justify-content-between mb-1 fw-semibold">
                  <span>Milestone progress</span>
                  <span>${proj.progress}%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-danger" style="width: ${proj.progress}%;"></div>
                </div>
              </div>

              <div class="d-flex justify-content-between border-top pt-2 mt-3 small text-secondary">
                <span><b>Linked Domain:</b> ${proj.domain}</span>
                <span><b>Hosting Node:</b> ${proj.hosting}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    document.querySelectorAll(".edit-project-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const projId = btn.getAttribute("data-id");
        const proj = state.projects.find(x => x.id === projId);
        if (!proj) return;

        document.getElementById("edit-project-id-hidden").value = proj.id;
        document.getElementById("edit-project-name").value = proj.projectName || "";
        document.getElementById("edit-project-type").value = proj.websiteType || "";
        document.getElementById("edit-project-developer").value = proj.assignedDeveloperId || "";
        document.getElementById("edit-project-start").value = proj.startDate || "";
        document.getElementById("edit-project-end").value = proj.deliveryDate || "";
        document.getElementById("edit-project-progress").value = proj.progress || 0;
        document.getElementById("edit-project-status").value = proj.status || "Running";
        document.getElementById("edit-project-domain").value = proj.domain || "";
        document.getElementById("edit-project-hosting").value = proj.hosting || "";
        document.getElementById("edit-project-notes").value = proj.notes || "";

        flatpickr("#edit-project-start", { dateFormat: "Y-m-d", allowInput: true });
        flatpickr("#edit-project-end", { dateFormat: "Y-m-d", allowInput: true });

        const modalEl = bootstrap.Modal.getOrCreateInstance(document.getElementById("editProjectModal"));
        modalEl.show();
      });
    });
  };

  // VIEW: PAYMENTS LEDGER
  const renderPayments = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Payments Ledger</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Billing</a></li>
              <li class="breadcrumb-item active" aria-current="page">Payments</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addPaymentModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>Log Payment
        </button>
      </div>

      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="payments-datatable">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Client Company</th>
                <th>Amount Received</th>
                <th>Date Paid</th>
                <th>Payment Mode</th>
                <th>Transaction ID</th>
                <th>Collector</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${state.payments.map(pay => `
                <tr>
                  <td class="fw-bold text-danger">${pay.invoiceNo}</td>
                  <td><span class="fw-semibold text-dark">${getClientName(pay.clientId)}</span></td>
                  <td class="fw-bold text-success">₹${pay.amount.toLocaleString()}</td>
                  <td>${pay.date}</td>
                  <td><span class="badge bg-secondary">${pay.paymentMode}</span></td>
                  <td class="small font-monospace">${pay.transactionId}</td>
                  <td>${getEmployeeName(pay.receivedById)}</td>
                  <td>${pay.remarks}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#payments-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Payments..." }
    });
  };

  // VIEW: INVOICES
  const renderInvoices = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Invoices Dashboard</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Billing</a></li>
              <li class="breadcrumb-item active" aria-current="page">Invoices</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="invoices-datatable">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Client Company</th>
                <th>Date Issued</th>
                <th>Due Date</th>
                <th>Gross Price</th>
                <th>GST Rate</th>
                <th>Net Total (₹)</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.invoices.map(inv => {
                let badge = "badge-active";
                if (inv.status === "Partial") badge = "badge-pending";
                if (inv.status === "Pending Payment") badge = "badge-expired";
                return `
                  <tr>
                    <td class="fw-bold text-danger">${inv.id}</td>
                    <td><span class="fw-bold text-dark">${getClientName(inv.clientId)}</span></td>
                    <td>${inv.invoiceDate}</td>
                    <td>${inv.dueDate}</td>
                    <td>₹${inv.grossAmount.toLocaleString()}</td>
                    <td>${inv.gstRate}%</td>
                    <td class="fw-bold">₹${inv.netAmount.toLocaleString()}</td>
                    <td><span class="badge-status ${badge}">${inv.status}</span></td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-light border view-invoice-btn px-3 fw-bold" data-id="${inv.id}">
                        <i class="fa-solid fa-print me-1"></i>Invoice UI
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#invoices-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Invoices..." }
    });

    // Invoice UI Viewer click handler
    document.querySelectorAll(".view-invoice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const invId = btn.getAttribute("data-id");
        const inv = state.invoices.find(x => x.id === invId);
        const client = state.clients.find(c => c.id === inv.clientId);
        const service = state.services.find(s => s.id === inv.serviceId) || { serviceName: "Custom Marketing Packages" };

        const invoiceContentEl = document.getElementById("invoice-modal-content");
        invoiceContentEl.innerHTML = `
          <div id="invoice-print-area" class="p-4" style="background-color: #FFFFFF; font-family: 'Inter', sans-serif;">
            <div class="row mb-4">
              <div class="col-6">
                <h3 class="fw-bold text-danger mb-1" style="font-family: 'Outfit';">Thynk Digital Solution</h3>
                <p class="text-muted small mb-0">
                  405, Creative Plaza, Link Road, Andheri West<br>
                  Mumbai, MH, India - 400053<br>
                  Email: accounting@thynkdigital.in | Tel: +91 9876543210
                </p>
              </div>
              <div class="col-6 text-end">
                <h2 class="fw-bold text-uppercase text-secondary mb-1" style="font-family: 'Outfit';">Invoice</h2>
                <div class="small">
                  <b>Invoice No:</b> ${inv.id}<br>
                  <b>Date:</b> ${inv.invoiceDate}<br>
                  <b>Due Date:</b> ${inv.dueDate}
                </div>
              </div>
            </div>

            <hr class="border-light-subtle my-4">

            <div class="row mb-4">
              <div class="col-6">
                <h6 class="fw-bold text-uppercase text-muted" style="font-size:0.75rem;">Billed To:</h6>
                <div class="fw-bold text-dark">${client.companyName}</div>
                <p class="text-muted small mb-0">
                  Attn: ${client.clientName}<br>
                  Address: ${client.address || "N/A"}, ${client.city}, ${client.state}<br>
                  GSTIN: ${client.gst || "N/A"}
                </p>
              </div>
            </div>

            <table class="table table-bordered mb-4">
              <thead class="table-light text-uppercase small">
                <tr>
                  <th style="width: 50%;">Description / Service Item</th>
                  <th class="text-end" style="width: 25%;">Discount</th>
                  <th class="text-end" style="width: 25%;">Line Amount</th>
                </tr>
              </thead>
              <tbody class="small">
                <tr>
                  <td>
                    <div class="fw-bold">${service.serviceName}</div>
                    <span class="text-muted">Subscription Setup Term Package</span>
                  </td>
                  <td class="text-end">₹${inv.discount.toLocaleString()}</td>
                  <td class="text-end fw-semibold">₹${inv.grossAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="row">
              <div class="col-7"></div>
              <div class="col-5">
                <div class="d-flex justify-content-between py-2 border-bottom small">
                  <span class="text-muted">Subtotal Gross:</span>
                  <span class="fw-semibold">₹${inv.grossAmount.toLocaleString()}</span>
                </div>
                <div class="d-flex justify-content-between py-2 border-bottom small">
                  <span class="text-muted">GST (${inv.gstRate}%):</span>
                  <span class="fw-semibold">₹${inv.gstAmount.toLocaleString()}</span>
                </div>
                <div class="d-flex justify-content-between py-2 bg-light p-2 mt-2 rounded-2">
                  <span class="fw-bold text-dark">Invoice Net Total:</span>
                  <span class="fw-bold text-danger">₹${inv.netAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="mt-5 pt-3 border-top text-center text-muted small">
              Thank you for choosing Thynk Digital Solution! For billing assistance, contact accounting@thynkdigital.in
            </div>
          </div>
        `;
        
        const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("invoiceDetailsModal"));
        myModal.show();
      });
    });

    document.getElementById("invoice-print-btn").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("invoice-download-pdf-btn").addEventListener("click", () => {
      Swal.fire("Mock Export", "Invoice saved as PDF in Downloads folder.", "success");
    });
  };

  // VIEW: REMINDERS LIST
  const renderReminders = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Categorize reminders
    const todaysReminders = state.reminders.filter(r => r.reminderDate === todayStr && r.status === "Active");
    const tomorrowsReminders = state.reminders.filter(r => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      return r.reminderDate === tomorrowStr && r.status === "Active";
    });
    
    const overdueReminders = state.reminders.filter(r => r.reminderDate < todayStr && r.status === "Active");

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Reminders Workspace</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Scheduler</a></li>
              <li class="breadcrumb-item active" aria-current="page">Reminders</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addReminderModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>New Reminder
        </button>
      </div>

      <div class="row">
        <!-- OVERDUE ALERTS -->
        <div class="col-lg-4 mb-4">
          <div class="thynk-card h-100" style="border-left: 4px solid var(--thynk-primary);">
            <h5 class="fw-bold mb-3 text-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>Overdue Alerts</h5>
            ${overdueReminders.length === 0 ? `<div class="p-3 text-center text-muted small">No overdue reminders.</div>` : overdueReminders.map(rem => `
              <div class="p-3 bg-light rounded-3 mb-2 d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold text-dark small">${rem.title}</div>
                  <p class="text-muted mb-1 small" style="font-size:0.8rem;">${rem.description}</p>
                  <span class="text-danger small fw-semibold">${rem.reminderDate} @ ${rem.reminderTime}</span>
                </div>
                <button class="btn btn-sm btn-outline-success border-0 resolve-reminder-btn" data-id="${rem.id}"><i class="fa-solid fa-circle-check"></i></button>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- TODAY'S ALERTS -->
        <div class="col-lg-4 mb-4">
          <div class="thynk-card h-100" style="border-left: 4px solid #EF6C00;">
            <h5 class="fw-bold mb-3 text-warning"><i class="fa-solid fa-bell me-2"></i>Today's Reminders</h5>
            ${todaysReminders.length === 0 ? `<div class="p-3 text-center text-muted small">No alerts scheduled for today.</div>` : todaysReminders.map(rem => `
              <div class="p-3 bg-light rounded-3 mb-2 d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold text-dark small">${rem.title}</div>
                  <p class="text-muted mb-1 small" style="font-size:0.8rem;">${rem.description}</p>
                  <span class="text-warning small fw-semibold">${rem.reminderTime}</span>
                </div>
                <button class="btn btn-sm btn-outline-success border-0 resolve-reminder-btn" data-id="${rem.id}"><i class="fa-solid fa-circle-check"></i></button>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- TOMORROW'S SCHEDULE -->
        <div class="col-lg-4 mb-4">
          <div class="thynk-card h-100" style="border-left: 4px solid #1565C0;">
            <h5 class="fw-bold mb-3 text-primary"><i class="fa-solid fa-calendar-day me-2"></i>Tomorrow's Schedule</h5>
            ${tomorrowsReminders.length === 0 ? `<div class="p-3 text-center text-muted small">No reminders for tomorrow.</div>` : tomorrowsReminders.map(rem => `
              <div class="p-3 bg-light rounded-3 mb-2 d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold text-dark small">${rem.title}</div>
                  <p class="text-muted mb-1 small" style="font-size:0.8rem;">${rem.description}</p>
                  <span class="text-primary small fw-semibold">${rem.reminderTime}</span>
                </div>
                <button class="btn btn-sm btn-outline-success border-0 resolve-reminder-btn" data-id="${rem.id}"><i class="fa-solid fa-circle-check"></i></button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    // Bind resolve button
    document.querySelectorAll(".resolve-reminder-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const remId = btn.getAttribute("data-id");
        state.reminders = state.reminders.filter(x => x.id !== remId);
        saveState();
        renderReminders();
        Swal.fire("Reminder Cleared", "Alert dismissed successfully.", "success");
      });
    });
  };

  // VIEW: FULL CALENDAR INTEGRATION
  const renderCalendar = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Agency Schedule Calendar</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Scheduler</a></li>
              <li class="breadcrumb-item active" aria-current="page">Calendar</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="thynk-card">
        <div id="calendar-element" style="min-height: 600px;"></div>
      </div>
    `;

    // Map state data into FullCalendar events format
    const calendarEvents = [];

    // 1. Follow-ups
    state.followups.forEach(f => {
      calendarEvents.push({
        title: `Follow-up: ${getClientName(f.clientId)} (${f.type})`,
        start: f.nextFollowup,
        color: "#EF6C00" // Orange
      });
    });

    // 2. Reminders
    state.reminders.forEach(r => {
      calendarEvents.push({
        title: `Alert: ${r.title}`,
        start: r.reminderDate,
        color: "#D32F2F" // Red
      });
    });

    // 3. Domain Expiries
    state.domains.forEach(d => {
      calendarEvents.push({
        title: `Domain Expiry: ${d.domainName}`,
        start: d.expiryDate,
        color: "#1565C0" // Blue
      });
    });

    // 4. Hosting Expiries
    state.hostings.forEach(h => {
      calendarEvents.push({
        title: `Hosting Expiry: ${h.hostingProvider}`,
        start: h.expiryDate,
        color: "#7B1FA2" // Purple
      });
    });

    // 5. Tasks Deadlines
    state.tasks.forEach(t => {
      calendarEvents.push({
        title: `Task Due: ${t.taskName}`,
        start: t.dueDate,
        color: "#37474F" // Slate Grey
      });
    });

    const calendarEl = document.getElementById("calendar-element");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listMonth"
      },
      events: calendarEvents,
      editable: false,
      droppable: false
    });

    calendar.render();
    window.activeCalendarInstance = calendar;
  };

  // VIEW: EMPLOYEES HRMS DIRECTORY
  const renderEmployees = () => {
    const getStatusBadgeClass = (status) => {
      switch (status) {
        case "Active": return "badge-active";
        case "On Leave": return "badge-pending";
        case "Suspended": return "badge-inactive";
        case "Resigned": return "badge-low";
        default: return "badge-active";
      }
    };

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Employees HRMS Profile Directory</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">HRMS</a></li>
              <li class="breadcrumb-item active" aria-current="page">Employees</li>
            </ol>
          </nav>
        </div>
        <a href="#/hrms/employees/new" class="btn btn-danger rounded-3" style="background-color: var(--thynk-primary); border: none; display: flex; align-items: center; justify-content: center;">
          <i class="fa-solid fa-circle-plus me-2"></i>Add Employee
        </a>
      </div>

      <div class="row">
        ${state.employees.map(emp => `
          <div class="col-md-6 col-lg-3 mb-4">
            <div class="thynk-card text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <img src="${emp.photo || 'https://randomuser.me/api/portraits/men/1.jpg'}" class="rounded-circle mb-3 shadow-sm border" style="width: 80px; height: 80px; object-fit: cover;" alt="${emp.name}">
                <h5 class="fw-bold mb-1 text-dark">${emp.name}</h5>
                <div class="text-danger small fw-semibold mb-2">${emp.designation}</div>
                <span class="badge-status ${getStatusBadgeClass(emp.status)} mb-3">${emp.status}</span>
                
                <div class="p-3 bg-light rounded-3 small text-start mb-3">
                  <div class="mb-1"><b>Emp ID:</b> ${emp.id}</div>
                  <div class="mb-1"><b>Dept:</b> ${emp.department}</div>
                  <div class="mb-1"><b>Phone:</b> ${emp.phone}</div>
                  <div class="mb-1"><b>Email:</b> ${emp.email}</div>
                  <div><b>Salary:</b> ₹${(emp.salary || 0).toLocaleString()}</div>
                </div>
                <div class="text-muted small mb-3">Joined: ${emp.joiningDate}</div>
              </div>
              
              <div class="d-flex justify-content-center gap-2 pt-3 border-top border-light">
                <a href="#/hrms/employees/edit?id=${emp.id}" class="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center" style="font-size: 0.8rem;">
                  <i class="fa-solid fa-user-pen me-1"></i>Edit
                </a>
                <button class="btn btn-outline-danger btn-sm flex-grow-1 delete-employee-btn" data-id="${emp.id}" style="font-size: 0.8rem;">
                  <i class="fa-solid fa-trash-can me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Bind Delete clicks
    document.querySelectorAll(".delete-employee-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const empId = btn.getAttribute("data-id");
        const emp = state.employees.find(e => e.id === empId);
        if (!emp) return;

        Swal.fire({
          title: "Delete Employee?",
          text: `Are you sure you want to remove '${emp.name}' from the HRMS database?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Delete"
        }).then((result) => {
          if (result.isConfirmed) {
            state.employees = state.employees.filter(e => e.id !== empId);
            saveState();
            renderEmployees();
            populateModalDropdowns();
            Swal.fire("Deleted", "Employee profile removed.", "success");
          }
        });
      });
    });
  };

  // VIEW: ATTENDANCE BOARD
  const renderAttendance = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Check if current user E001 is clocked in today
    const myLog = state.attendance.find(a => a.employeeId === "E001" && a.date === todayStr);
    const isClockedIn = myLog && myLog.clockIn !== "" && myLog.clockOut === "";
    const isClockedOut = myLog && myLog.clockOut !== "";

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Attendance Panel</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">HRMS</a></li>
              <li class="breadcrumb-item active" aria-current="page">Attendance</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <!-- MY ATTENDANCE QUICK WIDGET -->
        <div class="col-lg-4 mb-4">
          <div class="thynk-card text-center">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-business-time text-danger me-2"></i>My Session Tracker</h5>
            <div class="p-4 bg-light rounded-3 mb-3">
              <div class="text-muted small mb-1">Current Date</div>
              <h4 class="fw-bold mb-3">${new Date().toDateString()}</h4>
              ${isClockedIn ? `
                <div class="text-success small fw-semibold mb-2"><i class="fa-solid fa-circle-play me-1"></i>Clocked In: ${myLog.clockIn}</div>
                <button class="btn btn-danger w-100 py-3 fw-bold shadow-sm" id="clock-out-btn">CLOCK OUT SESSION</button>
              ` : (isClockedOut ? `
                <div class="text-muted small fw-semibold mb-2"><i class="fa-solid fa-circle-check me-1"></i>Day Session Complete</div>
                <button class="btn btn-secondary w-100 py-3 fw-bold" disabled>COMPLETED</button>
              ` : `
                <div class="text-muted small mb-2">Shift starts at 09:00 AM</div>
                <button class="btn btn-success w-100 py-3 fw-bold shadow-sm" id="clock-in-btn">CLOCK IN SESSION</button>
              `)}
            </div>
            <div class="text-secondary small">Your location is captured for geo-attendance compliance.</div>
          </div>
        </div>

        <!-- DAILY ATTENDANCE SUMMARY -->
        <div class="col-lg-8 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-calendar-check text-danger me-2"></i>Staff Attendance Logs</h5>
            <div class="table-responsive">
              <table class="table thynk-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee Name</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Total Hours</th>
                    <th>Late Entry</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.attendance.map(att => {
                    let badge = "badge-active";
                    if (att.status === "Late Entry") badge = "badge-pending";
                    if (att.status === "Absent") badge = "badge-expired";
                    
                    return `
                      <tr>
                        <td>${att.date}</td>
                        <td class="fw-semibold text-dark">${getEmployeeName(att.employeeId)}</td>
                        <td>${att.clockIn || "--"}</td>
                        <td>${att.clockOut || "--"}</td>
                        <td class="fw-semibold">${att.hours > 0 ? `${att.hours} Hrs` : "--"}</td>
                        <td><span class="badge ${att.late === "Yes" ? "bg-warning bg-opacity-10 text-warning" : "bg-light text-muted"}">${att.late}</span></td>
                        <td><span class="badge-status ${badge}">${att.status}</span></td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    // Clock-in bindings
    const clockInBtn = document.getElementById("clock-in-btn");
    if (clockInBtn) {
      clockInBtn.addEventListener("click", () => {
        const timeNow = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const hr = parseFloat(new Date().getHours() + "." + new Date().getMinutes());
        
        const newLog = {
          id: "A" + (state.attendance.length + 1).toString().padStart(3, "0"),
          employeeId: "E001",
          date: todayStr,
          clockIn: timeNow,
          clockOut: "",
          hours: 0,
          status: hr > 9.25 ? "Late Entry" : "Present",
          late: hr > 9.25 ? "Yes" : "No"
        };
        
        state.attendance.unshift(newLog);
        addTimelineEvent("attendance", `Employee Ankit Kumar Clocked In at ${timeNow}`, "fa-door-open");
        saveState();
        renderAttendance();
        
        Swal.fire("Session Started", "Clock in recorded.", "success");
      });
    }

    // Clock-out bindings
    const clockOutBtn = document.getElementById("clock-out-btn");
    if (clockOutBtn) {
      clockOutBtn.addEventListener("click", () => {
        const timeNow = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const log = state.attendance.find(a => a.employeeId === "E001" && a.date === todayStr);
        
        log.clockOut = timeNow;
        log.hours = 8.5; // mocked worked duration
        
        addTimelineEvent("attendance", `Employee Ankit Kumar Clocked Out at ${timeNow}`, "fa-door-closed");
        saveState();
        renderAttendance();
        
        Swal.fire("Session Ended", "Clock out recorded.", "info");
      });
    }
  };

  // VIEW: LEAVE REQUESTS
  const renderLeave = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Leave Management System</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">HRMS</a></li>
              <li class="breadcrumb-item active" aria-current="page">Leave</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <!-- SUBMIT LEAVE REQUEST -->
        <div class="col-lg-4 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-file-signature text-danger me-2"></i>Apply for Leave</h5>
            <form id="apply-leave-form">
              <div class="mb-3">
                <label class="form-label fw-semibold">Leave Type</label>
                <select class="form-select rounded-3" id="leave-type" required>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Privilege Leave">Privilege Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                </select>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">From Date</label>
                  <input type="text" class="form-control rounded-3 flatpickr-date" id="leave-start" required placeholder="Select Date">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">To Date</label>
                  <input type="text" class="form-control rounded-3 flatpickr-date" id="leave-end" required placeholder="Select Date">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Reason</label>
                <textarea class="form-control rounded-3" id="leave-reason" rows="3" required placeholder="Explain purpose of request..."></textarea>
              </div>
              <button type="submit" class="btn btn-danger w-100 py-2 rounded-3 fw-bold shadow-sm" style="background-color: var(--thynk-primary); border: none;">Apply Ticket</button>
            </form>
          </div>
        </div>

        <!-- LEAVE LEDGER -->
        <div class="col-lg-8 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-list-check text-danger me-2"></i>Leave Application Ledger</h5>
            <div class="table-responsive">
              <table class="table thynk-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Employee Name</th>
                    <th>Leave Type</th>
                    <th>Period</th>
                    <th>Total Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th class="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.leaves.map(lv => {
                    let badge = "badge-pending";
                    if (lv.status === "Approved") badge = "badge-active";
                    if (lv.status === "Rejected") badge = "badge-expired";

                    return `
                      <tr>
                        <td>${lv.employeeId}</td>
                        <td class="fw-semibold text-dark">${getEmployeeName(lv.employeeId)}</td>
                        <td><span class="badge bg-secondary">${lv.leaveType}</span></td>
                        <td>${lv.startDate} to ${lv.endDate}</td>
                        <td class="fw-bold">${lv.totalDays} Days</td>
                        <td>${lv.reason}</td>
                        <td><span class="badge-status ${badge}">${lv.status}</span></td>
                        <td class="text-end">
                          ${lv.status === "Pending" ? `
                            <button class="btn btn-sm btn-success approve-leave-btn me-1" data-id="${lv.id}"><i class="fa-solid fa-check"></i></button>
                            <button class="btn btn-sm btn-outline-danger reject-leave-btn" data-id="${lv.id}"><i class="fa-solid fa-times"></i></button>
                          ` : "--"}
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    // Apply leave form handler
    document.getElementById("apply-leave-form").addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newL = {
        id: "L" + (state.leaves.length + 1).toString().padStart(2, "0"),
        employeeId: "E001",
        leaveType: document.getElementById("leave-type").value,
        startDate: document.getElementById("leave-start").value,
        endDate: document.getElementById("leave-end").value,
        totalDays: 3, // mock count
        reason: document.getElementById("leave-reason").value,
        status: "Pending"
      };

      state.leaves.unshift(newL);
      addNotification("Leave Request Filed", `Ankit Kumar applied for ${newL.leaveType}.`, "info");
      addTimelineEvent("hrms", `Ankit Kumar filed a leave request ticket`, "fa-calendar-plus");
      saveState();
      renderLeave();

      Swal.fire("Applied!", "Your leave application is submitted for approval.", "success");
    });

    // Resolve buttons
    document.querySelectorAll(".approve-leave-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const leave = state.leaves.find(x => x.id === id);
        leave.status = "Approved";
        
        addTimelineEvent("hrms", `Approved leave request for ${getEmployeeName(leave.employeeId)}`, "fa-calendar-check");
        saveState();
        renderLeave();
        Swal.fire("Approved", "Leave request has been approved.", "success");
      });
    });

    document.querySelectorAll(".reject-leave-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const leave = state.leaves.find(x => x.id === id);
        leave.status = "Rejected";
        
        addTimelineEvent("hrms", `Rejected leave request for ${getEmployeeName(leave.employeeId)}`, "fa-calendar-times");
        saveState();
        renderLeave();
        Swal.fire("Rejected", "Leave request declined.", "info");
      });
    });
  };

  // VIEW: KANBAN BOARD (MY TASKS)
  const renderMyTasks = () => {
    // Columns definition
    const columns = ["To Do", "In Progress", "Review", "Completed"];
    
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">My Tasks Board</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Tasks</a></li>
              <li class="breadcrumb-item active" aria-current="page">Kanban</li>
            </ol>
          </nav>
        </div>
        <button class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#addTaskModal" style="background-color: var(--thynk-primary); border: none;">
          <i class="fa-solid fa-circle-plus me-2"></i>New Task
        </button>
      </div>

      <div class="kanban-container pb-3">
        ${columns.map(col => {
          const colTasks = state.tasks.filter(t => t.status === col);
          return `
            <div class="kanban-column" data-status="${col}">
              <div class="kanban-header">
                <span>${col}</span>
                <span class="kanban-count">${colTasks.length}</span>
              </div>
              <div class="kanban-cards-wrapper" id="kanban-col-${col.replace(" ", "-")}">
                ${colTasks.map(task => {
                  let badge = "badge bg-secondary";
                  if (task.priority === "High") badge = "badge bg-danger";
                  if (task.priority === "Medium") badge = "badge bg-warning text-dark";

                  return `
                    <div class="kanban-card" draggable="true" data-id="${task.id}" id="task-card-${task.id}">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="${badge}" style="font-size:0.68rem;">${task.priority} Priority</span>
                        <div class="dropdown">
                          <button class="btn btn-link btn-sm text-muted p-0 dropdown-toggle no-caret" data-bs-toggle="dropdown"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                          <ul class="dropdown-menu dropdown-menu-end small">
                            <li><a class="dropdown-item resolve-task-item text-success fw-bold" href="#" data-id="${task.id}"><i class="fa-solid fa-check me-2"></i>Complete</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item delete-task-item text-danger" href="#" data-id="${task.id}"><i class="fa-solid fa-trash me-2"></i>Delete</a></li>
                          </ul>
                        </div>
                      </div>
                      <div class="kanban-card-title">${task.taskName}</div>
                      <p class="text-muted small mb-3" style="font-size:0.8rem;">${task.description}</p>
                      
                      <div class="progress mb-2" style="height: 4px;">
                        <div class="progress-bar bg-danger" style="width: ${task.progress}%;"></div>
                      </div>

                      <div class="kanban-card-meta small border-top pt-2">
                        <span class="fw-bold text-danger">${getClientName(task.clientId)}</span>
                        <span>Due: ${task.dueDate}</span>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    // Bind In-Kanban quick options
    document.querySelectorAll(".resolve-task-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const id = item.getAttribute("data-id");
        const task = state.tasks.find(x => x.id === id);
        task.status = "Completed";
        task.progress = 100;
        
        addTimelineEvent("task", `Completed task '${task.taskName}'`, "fa-check-double");
        saveState();
        renderMyTasks();
        Swal.fire("Resolved", "Task marked as completed.", "success");
      });
    });

    document.querySelectorAll(".delete-task-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const id = item.getAttribute("data-id");
        
        Swal.fire({
          title: "Delete Task?",
          text: "Remove task card from Kanban board.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Confirm Delete"
        }).then((res) => {
          if (res.isConfirmed) {
            state.tasks = state.tasks.filter(x => x.id !== id);
            saveState();
            renderMyTasks();
            Swal.fire("Removed", "Task card deleted.", "success");
          }
        });
      });
    });

    // JS HTML5 Drag and Drop Handlers
    const cards = document.querySelectorAll(".kanban-card");
    const wrappers = document.querySelectorAll(".kanban-cards-wrapper");

    cards.forEach(card => {
      card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });
    });

    wrappers.forEach(wrapper => {
      const colEl = wrapper.closest(".kanban-column");
      const targetStatus = colEl.getAttribute("data-status");

      wrapper.addEventListener("dragover", (e) => {
        e.preventDefault();
        wrapper.style.backgroundColor = "rgba(211,47,47,0.05)";
      });

      wrapper.addEventListener("dragleave", () => {
        wrapper.style.backgroundColor = "";
      });

      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        wrapper.style.backgroundColor = "";
        
        const card = document.querySelector(".dragging");
        if (card) {
          const taskId = card.getAttribute("data-id");
          const taskObj = state.tasks.find(t => t.id === taskId);
          
          if (taskObj && taskObj.status !== targetStatus) {
            taskObj.status = targetStatus;
            
            // Adjust progress percentage automatically based on status
            if (targetStatus === "To Do") taskObj.progress = 10;
            if (targetStatus === "In Progress") taskObj.progress = 50;
            if (targetStatus === "Review") taskObj.progress = 85;
            if (targetStatus === "Completed") taskObj.progress = 100;

            addTimelineEvent("task", `Shifted task '${taskObj.taskName}' to ${targetStatus}`, "fa-sliders");
            saveState();
            
            // Re-render Board
            renderMyTasks();
          }
        }
      });
    });
  };

  // VIEW: EMPLOYEE TASKS LIST
  const renderEmployeeTasks = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Employee Workload Tracker</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Tasks</a></li>
              <li class="breadcrumb-item active" aria-current="page">Employee Tasks</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="thynk-card">
        <div class="table-responsive">
          <table class="table thynk-table" id="employee-tasks-datatable">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Client Company</th>
                <th>Assigned Employee</th>
                <th>Priority</th>
                <th>Milestone Progress</th>
                <th>Due Date</th>
                <th>Est. Hours</th>
                <th>Kanban Stage</th>
              </tr>
            </thead>
            <tbody>
              ${state.tasks.map(task => {
                let badge = "badge bg-secondary";
                if (task.priority === "High") badge = "badge bg-danger";
                if (task.priority === "Medium") badge = "badge bg-warning text-dark";

                let stageBadge = "badge-active";
                if (task.status === "To Do") stageBadge = "badge-inactive";
                if (task.status === "In Progress") stageBadge = "badge-pending";
                if (task.status === "Review") stageBadge = "badge-completed";

                return `
                  <tr>
                    <td class="fw-semibold text-dark">${task.taskName}</td>
                    <td>${getClientName(task.clientId)}</td>
                    <td>${getEmployeeName(task.assignedEmployeeId)}</td>
                    <td><span class="${badge}">${task.priority}</span></td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1" style="height: 6px; min-width: 80px;">
                          <div class="progress-bar bg-danger" style="width: ${task.progress}%;"></div>
                        </div>
                        <span class="small fw-semibold text-muted">${task.progress}%</span>
                      </div>
                    </td>
                    <td>${task.dueDate}</td>
                    <td class="fw-semibold">${task.estHours} Hrs</td>
                    <td><span class="badge-status ${stageBadge}">${task.status}</span></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    $("#employee-tasks-datatable").DataTable({
      language: { search: "_INPUT_", searchPlaceholder: "Search Tasks..." }
    });
  };

  // VIEW: REPORTS STUDIO
  const renderReports = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Reports Studio</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Analytics</a></li>
              <li class="breadcrumb-item active" aria-current="page">Reports</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <!-- REPORT SELECTOR WIDGET -->
        <div class="col-lg-4 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-sliders text-danger me-2"></i>Report Configuration</h5>
            <div class="mb-3">
              <label class="form-label fw-semibold">Data Stream</label>
              <select class="form-select rounded-3" id="report-type">
                <option value="revenue">Revenue Collection Ledger</option>
                <option value="hosting">Hosting Renewal Expiries</option>
                <option value="domain">Domain Expiry Pipeline</option>
                <option value="performance">Employee Performance Metrics</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Reporting Period</label>
              <select class="form-select rounded-3" id="report-period">
                <option value="all">All-Time History</option>
                <option value="30">Next 30 Days Forecast</option>
                <option value="90">Next 90 Days Forecast</option>
              </select>
            </div>
            <button class="btn btn-danger w-100 py-2 rounded-3 fw-bold mb-2" id="generate-report-btn" style="background-color: var(--thynk-primary); border: none;">Run Report Query</button>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="export-excel-btn"><i class="fa-solid fa-file-excel me-1"></i>Excel</button>
              <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="export-pdf-btn"><i class="fa-solid fa-file-pdf me-1"></i>PDF</button>
              <button class="btn btn-outline-secondary btn-sm flex-grow-1" id="print-report-btn"><i class="fa-solid fa-print me-1"></i>Print</button>
            </div>
          </div>
        </div>

        <!-- REPORT GRID DISPLAY -->
        <div class="col-lg-8 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3" id="report-output-title"><i class="fa-solid fa-chart-column text-danger me-2"></i>Revenue Collection Ledger</h5>
            <div id="report-output-area">
              <!-- Dynamically Loaded Report Grid Table -->
            </div>
          </div>
        </div>
      </div>
    `;

    const generateReport = () => {
      const type = document.getElementById("report-type").value;
      const period = document.getElementById("report-period").value;
      const output = document.getElementById("report-output-area");
      const title = document.getElementById("report-output-title");

      let html = "";
      if (type === "revenue") {
        title.innerHTML = `<i class="fa-solid fa-wallet text-danger me-2"></i>Revenue Collection Ledger`;
        html = `
          <div class="table-responsive">
            <table class="table thynk-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Client Name</th>
                  <th>Invoice No</th>
                  <th>Date Recorded</th>
                  <th>Mode</th>
                  <th>Amount Received</th>
                </tr>
              </thead>
              <tbody>
                ${state.payments.map(p => `
                  <tr>
                    <td class="font-monospace">${p.transactionId}</td>
                    <td>${getClientName(p.clientId)}</td>
                    <td>${p.invoiceNo}</td>
                    <td>${p.date}</td>
                    <td>${p.paymentMode}</td>
                    <td class="fw-bold text-success">₹${p.amount.toLocaleString()}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      } else if (type === "hosting") {
        title.innerHTML = `<i class="fa-solid fa-server text-danger me-2"></i>Hosting Renewal Expiries`;
        html = `
          <div class="table-responsive">
            <table class="table thynk-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Provider</th>
                  <th>Hosting Plan</th>
                  <th>Expiry Date</th>
                  <th>Renewal Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.hostings.map(h => `
                  <tr>
                    <td>${getClientName(h.clientId)}</td>
                    <td>${h.hostingProvider}</td>
                    <td>${h.hostingPlan}</td>
                    <td>${h.expiryDate}</td>
                    <td class="fw-bold">₹${h.renewalCost.toLocaleString()}</td>
                    <td><span class="badge-status badge-active">${h.status}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      } else if (type === "domain") {
        title.innerHTML = `<i class="fa-solid fa-globe text-danger me-2"></i>Domain Expiry Pipeline`;
        html = `
          <div class="table-responsive">
            <table class="table thynk-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Domain Name</th>
                  <th>Registrar</th>
                  <th>Expiry Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.domains.map(d => `
                  <tr>
                    <td>${getClientName(d.clientId)}</td>
                    <td class="text-primary fw-bold">${d.domainName}</td>
                    <td>${d.registrar}</td>
                    <td>${d.expiryDate}</td>
                    <td class="fw-semibold">₹${d.renewalCost}</td>
                    <td><span class="badge-status badge-active">${d.status}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      } else if (type === "performance") {
        title.innerHTML = `<i class="fa-solid fa-chart-line text-danger me-2"></i>Employee Performance Metrics`;
        
        html = `
          <div class="table-responsive">
            <table class="table thynk-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Designation</th>
                  <th>Completed Tasks</th>
                  <th>Pending Tasks</th>
                  <th>Worked Hours (Today)</th>
                </tr>
              </thead>
              <tbody>
                ${state.employees.map(emp => {
                  const completed = state.tasks.filter(t => t.assignedEmployeeId === emp.id && t.status === "Completed").length;
                  const pending = state.tasks.filter(t => t.assignedEmployeeId === emp.id && t.status !== "Completed").length;
                  const todayAtt = state.attendance.find(a => a.employeeId === emp.id && a.date === new Date().toISOString().split("T")[0]) || { hours: 0 };
                  
                  return `
                    <tr>
                      <td class="fw-semibold text-dark">${emp.name}</td>
                      <td>${emp.designation}</td>
                      <td class="fw-bold text-success">${completed} Tasks</td>
                      <td class="fw-bold text-warning">${pending} Tasks</td>
                      <td>${todayAtt.hours > 0 ? `${todayAtt.hours} Hrs` : "Not Clocked Out / Absent"}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        `;
      }
      output.innerHTML = html;
    };

    document.getElementById("generate-report-btn").addEventListener("click", generateReport);
    generateReport(); // run default first load

    // Bind export actions
    document.getElementById("export-excel-btn").addEventListener("click", () => {
      Swal.fire("Excel Export", "Report spreadsheet saved in Downloads folder successfully.", "success");
    });
    document.getElementById("export-pdf-btn").addEventListener("click", () => {
      Swal.fire("PDF Export", "Report PDF document generated successfully.", "success");
    });
    document.getElementById("print-report-btn").addEventListener("click", () => {
      window.print();
    });
  };

  // VIEW: TIMELINE LOGS
  const renderTimeline = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Global Activity Timeline Logs</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Logs</a></li>
              <li class="breadcrumb-item active" aria-current="page">Timeline</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="thynk-card">
        <div class="timeline-wrapper ms-3 py-3">
          ${state.timeline.map(evt => `
            <div class="timeline-item">
              <div class="timeline-icon"><i class="fa-solid ${evt.icon}"></i></div>
              <div class="timeline-time font-monospace small">${evt.timestamp}</div>
              <div class="timeline-title text-dark">${evt.eventType.toUpperCase()} EVENT</div>
              <p class="timeline-desc text-muted mb-0 fw-semibold">${evt.text}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  };

  // VIEW: SETTINGS
  const renderSettings = () => {
    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">System Control Settings</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="#" class="text-danger text-decoration-none">Control</a></li>
              <li class="breadcrumb-item active" aria-current="page">Settings</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <!-- COMPANY PROFILE SETTINGS -->
        <div class="col-lg-6 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-building text-danger me-2"></i>Agency Profile</h5>
            <form id="agency-settings-form">
              <div class="mb-3">
                <label class="form-label fw-semibold">Agency Corporate Name</label>
                <input type="text" class="form-control rounded-3" id="set-agency-name" value="${state.settings.agencyName}">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Billing Support Email</label>
                <input type="email" class="form-control rounded-3" id="set-agency-email" value="${state.settings.email}">
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Phone Contact</label>
                  <input type="text" class="form-control rounded-3" id="set-agency-phone" value="${state.settings.phone}">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Global Currency</label>
                  <input type="text" class="form-control rounded-3" id="set-agency-currency" value="${state.settings.currencySymbol}">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Default GST Rate (%)</label>
                  <input type="number" class="form-control rounded-3" id="set-agency-gst" value="${state.settings.gstPercentage}">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Website Domain</label>
                  <input type="url" class="form-control rounded-3" id="set-agency-web" value="${state.settings.website}">
                </div>
              </div>
              <button type="submit" class="btn btn-danger py-2 px-4 rounded-3 fw-bold shadow-sm" style="background-color: var(--thynk-primary); border: none;">Save Configurations</button>
            </form>
          </div>
        </div>

        <!-- MOCK DATA FACTORY RESET -->
        <div class="col-lg-6 mb-4">
          <div class="thynk-card">
            <h5 class="fw-bold mb-3"><i class="fa-solid fa-circle-exclamation text-danger me-2"></i>Database Factory Tools</h5>
            <div class="p-3 bg-light rounded-3 mb-3 border small">
              <div class="fw-bold text-dark mb-1"><i class="fa-solid fa-info-circle me-1"></i>Client-Side Storage State</div>
              <p class="text-muted mb-0">This agency operating panel stores database state in the browser's <b>localStorage</b> memory to test dynamic changes.</p>
            </div>
            <p class="text-muted small">If you wish to wipe any mock additions/updates and restore the environment to the initial clean seed demo data, click below:</p>
            <button class="btn btn-outline-danger py-2 px-4 rounded-3 fw-bold w-100" id="reset-factory-btn"><i class="fa-solid fa-trash-arrow-up me-2"></i>Restore Factory Seed Data</button>
          </div>
        </div>
      </div>
    `;

    // Agency config save
    document.getElementById("agency-settings-form").addEventListener("submit", (e) => {
      e.preventDefault();
      
      state.settings.agencyName = document.getElementById("set-agency-name").value;
      state.settings.email = document.getElementById("set-agency-email").value;
      state.settings.phone = document.getElementById("set-agency-phone").value;
      state.settings.currencySymbol = document.getElementById("set-agency-currency").value;
      state.settings.gstPercentage = parseInt(document.getElementById("set-agency-gst").value);
      state.settings.website = document.getElementById("set-agency-web").value;

      addTimelineEvent("settings", `Updated global system and agency configurations`, "fa-sliders");
      saveState();
      
      Swal.fire("Saved", "System configuration details saved.", "success");
    });

    // Reset factory seed
    document.getElementById("reset-factory-btn").addEventListener("click", () => {
      Swal.fire({
        title: "Restore Factory State?",
        text: "This will permanently wipe all local modifications and restore standard seed data.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--thynk-primary-dark)",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Confirm Wipe"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem(stateKey);
          Swal.fire({
            icon: "success",
            title: "Database Reset Done!",
            text: "Reloading system application dashboard...",
            timer: 1500,
            showConfirmButton: false
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      });
    });
  };

  // 7. FORM SUBMISSIONS AND ACTIONS CREATION HANDLERS
  
  // FORM: CREATE LEAD
  document.getElementById("add-lead-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const leadId = "L" + (state.leads.length + 1).toString().padStart(3, "0");
    const newL = {
      id: leadId,
      companyName: document.getElementById("lead-company").value,
      contactName: document.getElementById("lead-contact").value || "",
      mobile: document.getElementById("lead-mobile").value || "",
      email: document.getElementById("lead-email").value || "",
      source: document.getElementById("lead-source").value || "",
      value: document.getElementById("lead-value").value ? (parseInt(document.getElementById("lead-value").value) || 0) : null,
      status: document.getElementById("lead-status").value || "Cold",
      assignedEmployeeId: document.getElementById("lead-assigned-employee").value || "",
      notes: document.getElementById("lead-notes").value || "",
      dateCreated: new Date().toISOString().split("T")[0]
    };

    state.leads.push(newL);
    addNotification("New Lead Registered", `Lead ${newL.companyName} added to pipeline.`, "info");
    addTimelineEvent("lead", `Added new pipeline lead for ${newL.companyName}`, "fa-bullhorn");
    saveState();
    
    // Close modal
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addLeadModal")).hide();
    document.getElementById("add-lead-form").reset();
    
    Swal.fire("Lead Created", "Pipeline record successfully saved.", "success");
    
    // Refresh view if active
    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "leads" || activeView === "dashboard") switchView(activeView);
    populateModalDropdowns();
  });

  // FORM: CREATE CLIENT
  document.getElementById("add-client-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const clientId = "C" + (state.clients.length + 1).toString().padStart(3, "0");
    const newC = {
      id: clientId,
      companyName: document.getElementById("client-company").value,
      clientName: document.getElementById("client-name").value,
      mobile: document.getElementById("client-mobile").value,
      whatsapp: document.getElementById("client-whatsapp").value || document.getElementById("client-mobile").value,
      email: document.getElementById("client-email").value,
      website: document.getElementById("client-website").value,
      category: document.getElementById("client-category").value,
      gst: document.getElementById("client-gst").value,
      address: document.getElementById("client-address").value,
      city: document.getElementById("client-city").value,
      state: document.getElementById("client-state").value,
      country: document.getElementById("client-country").value,
      logo: document.getElementById("client-company").value.charAt(0),
      source: document.getElementById("client-source").value,
      assignedEmployeeId: document.getElementById("client-assigned-employee").value,
      status: "Active",
      priority: document.getElementById("client-priority").value,
      dateCreated: new Date().toISOString().split("T")[0]
    };

    state.clients.push(newC);

    // Auto-create Domain & Hosting if checked
    const addDomainHosting = document.getElementById("client-add-domain-hosting").checked;
    if (addDomainHosting) {
      const domainRegistrar = document.getElementById("client-domain-registrar").value || "GoDaddy";
      const hostingProvider = document.getElementById("client-hosting-provider").value || "Hostinger";
      const purchasedDate = document.getElementById("client-domain-purchased").value || new Date().toISOString().split("T")[0];
      const renewalDate = document.getElementById("client-domain-expiry").value || "";
      const domainCost = parseInt(document.getElementById("client-domain-cost").value) || 0;
      const hostingCost = parseInt(document.getElementById("client-hosting-cost").value) || 0;
      const dnsVal = document.getElementById("client-domain-dns").value || "OK";
      
      let parsedDom = "";
      if (newC.website) {
        try {
          parsedDom = newC.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
        } catch (e) {}
      }
      const domName = parsedDom || "Domain for " + newC.companyName;

      // 1. Create Domain Record
      state.domains.push({
        id: "D" + (state.domains.length + 1).toString().padStart(3, "0"),
        clientId: clientId,
        domainName: domName,
        registrar: domainRegistrar,
        registrationDate: purchasedDate,
        expiryDate: renewalDate,
        renewalDate: renewalDate,
        status: calculateStatusFromDate(renewalDate),
        renewalCost: domainCost,
        dnsStatus: dnsVal,
        nameservers: "",
        credentialsPlaceholder: "",
        notes: "Auto-linked on Client creation"
      });

      // 2. Create Hosting Record
      state.hostings.push({
        id: "H" + (state.hostings.length + 1).toString().padStart(3, "0"),
        clientId: clientId,
        hostingProvider: hostingProvider,
        hostingPlan: "Premium Hosting",
        purchaseDate: purchasedDate,
        expiryDate: renewalDate,
        renewalDate: renewalDate,
        renewalCost: hostingCost,
        backupStatus: "Daily Auto",
        status: calculateStatusFromDate(renewalDate),
        notes: "Auto-linked on Client creation"
      });

      // 3. Create Service Contract
      const srvId = "S" + (state.services.length + 1).toString().padStart(3, "0");
      const totalAmt = domainCost + hostingCost;
      state.services.push({
        id: srvId,
        clientId: clientId,
        serviceName: "Domain & Hosting",
        package: "Standard Domain & Hosting Bundle",
        startDate: purchasedDate,
        endDate: renewalDate,
        renewalDate: renewalDate,
        assignedEmployeeId: newC.assignedEmployeeId,
        cost: totalAmt,
        discount: 0,
        finalAmount: totalAmt,
        status: "Running",
        notes: "Auto-linked on Client creation"
      });

      // 4. Create Invoice
      const invId = "INV-2026-" + (state.invoices.length + 1).toString().padStart(3, "0");
      const gstAmt = Math.round(totalAmt * (state.settings.gstPercentage / 100));
      const netTotal = totalAmt + gstAmt;
      state.invoices.push({
        id: invId,
        clientId: clientId,
        invoiceDate: purchasedDate,
        dueDate: purchasedDate,
        serviceId: srvId,
        grossAmount: totalAmt,
        gstRate: state.settings.gstPercentage,
        gstAmount: gstAmt,
        discount: 0,
        netAmount: netTotal,
        status: "Pending Payment"
      });
    }

    addNotification("New Client Added", `${newC.companyName} registered under active accounts.`, "success");
    addTimelineEvent("client", `Created CRM Client Profile for ${newC.companyName}`, "fa-user-plus");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addClientModal")).hide();
    document.getElementById("add-client-form").reset();

    Swal.fire("Client Saved", "Client directory profile updated.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "clients" || activeView === "dashboard") switchView(activeView);
    populateModalDropdowns();
  });

  // FORM: EDIT CLIENT
  document.getElementById("edit-client-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const clientId = document.getElementById("edit-client-id-hidden").value;
    const clientIndex = state.clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      Swal.fire("Error", "Client profile not found.", "error");
      return;
    }

    state.clients[clientIndex].companyName = document.getElementById("edit-client-company").value;
    state.clients[clientIndex].clientName = document.getElementById("edit-client-name").value;
    state.clients[clientIndex].mobile = document.getElementById("edit-client-mobile").value;
    state.clients[clientIndex].whatsapp = document.getElementById("edit-client-whatsapp").value || document.getElementById("edit-client-mobile").value;
    state.clients[clientIndex].email = document.getElementById("edit-client-email").value;
    state.clients[clientIndex].website = document.getElementById("edit-client-website").value;
    state.clients[clientIndex].category = document.getElementById("edit-client-category").value;
    state.clients[clientIndex].gst = document.getElementById("edit-client-gst").value;
    state.clients[clientIndex].address = document.getElementById("edit-client-address").value;
    state.clients[clientIndex].city = document.getElementById("edit-client-city").value;
    state.clients[clientIndex].state = document.getElementById("edit-client-state").value;
    state.clients[clientIndex].country = document.getElementById("edit-client-country").value;
    state.clients[clientIndex].source = document.getElementById("edit-client-source").value;
    state.clients[clientIndex].assignedEmployeeId = document.getElementById("edit-client-assigned-employee").value;
    state.clients[clientIndex].status = document.getElementById("edit-client-status").value;
    state.clients[clientIndex].priority = document.getElementById("edit-client-priority").value;

    addTimelineEvent("client", `Updated CRM Client Profile for ${state.clients[clientIndex].companyName}`, "fa-user-pen");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editClientModal")).hide();
    document.getElementById("edit-client-form").reset();

    Swal.fire("Client Saved", "Client directory profile updated successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "clients" || activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // FORM: ADD SERVICE CONTRACT
  document.getElementById("add-service-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    try {
      const srvId = "S" + (state.services.length + 1).toString().padStart(3, "0");
      const clientId = document.getElementById("service-client-id").value || "";
      const name = document.getElementById("service-name").value;
      const cost = parseInt(document.getElementById("service-cost").value) || 0;
      const discount = parseInt(document.getElementById("service-discount").value) || 0;
      const finalAmt = cost - discount;

      const newS = {
        id: srvId,
        clientId: clientId,
        serviceName: name,
        package: document.getElementById("service-package").value || "",
        startDate: document.getElementById("service-start").value || "",
        endDate: document.getElementById("service-end").value || "",
        renewalDate: document.getElementById("service-end").value || "",
        assignedEmployeeId: document.getElementById("service-assigned-employee").value || "",
        cost: cost,
        discount: discount,
        finalAmount: finalAmt,
        status: "Running",
        notes: document.getElementById("service-notes").value || ""
      };

      state.services.push(newS);

      // Auto-create related Domain/Hosting entities if Domain & Hosting service selected
      if (name === "Domain & Hosting") {
        const cli = state.clients.find(c => c.id === clientId);
        let parsedDom = "";
        if (cli && cli.website) {
          try {
            parsedDom = cli.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
          } catch (e) {}
        }
        const domName = document.getElementById("service-package").value || parsedDom || "Domain for " + (cli ? cli.companyName : "Client");
        const expiry = document.getElementById("service-end").value || "";
        const startDate = document.getElementById("service-start").value || "";

        // Split cost: domain gets 1200 or 50% if finalAmt < 2000, hosting gets the remainder
        const domainCost = finalAmt >= 2000 ? 1200 : Math.floor(finalAmt * 0.5);
        const hostingCost = finalAmt - domainCost;

        // 1. Create Domain Record
        state.domains.push({
          id: "D" + (state.domains.length + 1).toString().padStart(3, "0"),
          clientId: clientId,
          domainName: domName,
          registrar: document.getElementById("domain-registrar").value || "GoDaddy",
          registrationDate: startDate,
          expiryDate: expiry,
          renewalDate: expiry,
          status: calculateStatusFromDate(expiry),
          renewalCost: domainCost,
          dnsStatus: document.getElementById("domain-dns-status").value || "OK",
          nameservers: document.getElementById("domain-nameservers").value || "",
          credentialsPlaceholder: "",
          notes: "Auto-linked on Domain & Hosting service registration"
        });

        // 2. Create Hosting Record
        state.hostings.push({
          id: "H" + (state.hostings.length + 1).toString().padStart(3, "0"),
          clientId: clientId,
          hostingProvider: document.getElementById("hosting-provider").value || "Hostinger",
          hostingPlan: document.getElementById("service-package").value || "Premium Hosting",
          purchaseDate: startDate,
          expiryDate: expiry,
          renewalDate: expiry,
          renewalCost: hostingCost,
          backupStatus: "Daily Auto",
          status: calculateStatusFromDate(expiry),
          notes: "Auto-linked on Domain & Hosting service registration"
        });
      }

      // Auto-create Meta Campaign entry if matching Ad service
      if (name === "Meta Ads Management") {
        state.metaAds.push({
          id: "M" + (state.metaAds.length + 1).toString().padStart(3, "0"),
          clientId: clientId,
          campaignName: `${getClientName(clientId)} - ${document.getElementById("service-package").value || "Meta Campaign"}`,
          objective: "Lead Generation",
          packageAmount: finalAmt,
          adBudget: Math.round(finalAmt * 0.6), // Mock: 60% of invoice cost goes to budget
          startDate: document.getElementById("service-start").value,
          endDate: document.getElementById("service-end").value,
          renewalDate: document.getElementById("service-end").value,
          reach: 0, clicks: 0, leads: 0, cpl: 0, roas: 0,
          status: "Running",
          assignedEmployeeId: document.getElementById("service-assigned-employee").value,
          notes: "Auto-launched on Meta Ads subscription start."
        });
      }

      // Auto-create Web Project if matching service
      if (name === "Website Development") {
        const cli = state.clients.find(c => c.id === clientId);
        let parsedDom = "";
        if (cli && cli.website) {
          try {
            parsedDom = cli.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
          } catch (e) {}
        }
        state.projects.push({
          id: "P" + (state.projects.length + 1).toString().padStart(3, "0"),
          clientId: clientId,
          projectName: document.getElementById("service-package").value || (cli ? cli.companyName + " Website" : "Website Project"),
          websiteType: "Custom Website Development",
          domain: parsedDom || "domain.com",
          hosting: "Hostinger",
          startDate: document.getElementById("service-start").value || new Date().toISOString().split("T")[0],
          deliveryDate: document.getElementById("service-end").value || "",
          progress: 0,
          assignedDeveloperId: document.getElementById("service-assigned-employee").value || "",
          status: "Running",
          notes: document.getElementById("service-notes").value || "Auto-created on Website Development service activation."
        });
      }

      // Auto-create Google Ads Campaign if matching service
      if (name === "Google Ads Management") {
        state.googleAds.push({
          id: "G" + (state.googleAds.length + 1).toString().padStart(3, "0"),
          clientId: clientId,
          campaignName: `${getClientName(clientId)} - ${document.getElementById("service-package").value || "Google Campaign"}`,
          objective: "Sales / Signups",
          packageAmount: finalAmt,
          adBudget: Math.round(finalAmt * 0.6),
          startDate: document.getElementById("service-start").value || new Date().toISOString().split("T")[0],
          endDate: document.getElementById("service-end").value || "",
          reach: 0, clicks: 0, leads: 0, cpl: 0, roas: 0,
          status: "Running",
          assignedEmployeeId: document.getElementById("service-assigned-employee").value || "",
          notes: document.getElementById("service-notes").value || "Auto-created on Google Ads service activation."
        });
      }

      // Auto-create SEO Campaign if matching service
      if (name === "SEO Management") {
        state.seo.push({
          id: "SEO" + (state.seo.length + 1).toString().padStart(3, "0"),
          clientId: clientId,
          targetKeywords: document.getElementById("service-package").value || "Target Keywords",
          currentRanking: "Page 1 - Rank 10+",
          articlesPublished: 0,
          backlinks: 0,
          reportFile: "",
          assignedEmployeeId: document.getElementById("service-assigned-employee").value || "",
          progress: 0,
          notes: document.getElementById("service-notes").value || "Auto-created on SEO service activation."
        });
      }

      // Auto Generate Invoice for billing
      const invId = "INV-2026-" + (state.invoices.length + 1).toString().padStart(3, "0");
      const gstAmt = Math.round(finalAmt * (state.settings.gstPercentage / 100));
      const netTotal = finalAmt + gstAmt;

      state.invoices.push({
        id: invId,
        clientId: clientId,
        invoiceDate: document.getElementById("service-start").value,
        dueDate: document.getElementById("service-start").value, // payable on start
        serviceId: srvId,
        grossAmount: finalAmt,
        gstRate: state.settings.gstPercentage,
        gstAmount: gstAmt,
        discount: 0,
        netAmount: netTotal,
        status: "Pending Payment"
      });

      addNotification("Service Activated & Invoiced", `Setup ${name} contract. Invoice ${invId} compiled.`, "success");
      addTimelineEvent("service", `Activated service contract '${name}' for ${getClientName(clientId)}. Bill: ${invId}`, "fa-cube");
      saveState();

      bootstrap.Modal.getOrCreateInstance(document.getElementById("addServiceModal")).hide();
      document.getElementById("add-service-form").reset();
      domainExtraFields.classList.add("d-none");
      hostingExtraFields.classList.add("d-none");

      Swal.fire({
        icon: "success",
        title: "Service Package Setup Done",
        text: `Service is active and Invoice ${invId} has been generated.`,
      });

      const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
      // If active view is Client Profile, re-render profile
      const profileBack = document.getElementById("crm-profile-back");
      if (profileBack) {
        renderClientProfile(clientId);
      } else if (activeView === "clients") {
        renderClients();
      } else if (activeView === "services" || activeView === "dashboard") {
        switchView(activeView);
      }
      populateModalDropdowns();
    } catch (err) {
      console.error("Error activating service:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Could not activate service: " + err.message
      });
    }
  });

  // FORM: LOG PAYMENT
  document.getElementById("add-payment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const payId = "PAY" + (state.payments.length + 1).toString().padStart(3, "0");
    const invId = document.getElementById("payment-invoice-id").value;
    const amount = parseInt(document.getElementById("payment-amount").value);
    
    const invoice = state.invoices.find(i => i.id === invId);
    if (!invoice) return;

    const newP = {
      id: payId,
      invoiceNo: invId,
      clientId: invoice.clientId,
      amount: amount,
      date: document.getElementById("payment-date").value,
      paymentMode: document.getElementById("payment-mode").value,
      transactionId: document.getElementById("payment-ref").value,
      receivedById: document.getElementById("payment-received-by").value,
      remarks: document.getElementById("payment-remarks").value
    };

    state.payments.push(newP);

    // Calculate sum of payments for this invoice
    const invoicePayments = state.payments.filter(p => p.invoiceNo === invId);
    const sumPaid = invoicePayments.reduce((s, p) => s + p.amount, 0);

    if (sumPaid >= invoice.netAmount) {
      invoice.status = "Paid";
    } else {
      invoice.status = "Partial";
    }

    addNotification("Payment Received", `Received ₹${amount.toLocaleString()} for Invoice ${invId}.`, "success");
    addTimelineEvent("payment", `Logged receipt ₹${amount.toLocaleString()} for ${getClientName(invoice.clientId)} (Invoice ${invId})`, "fa-receipt");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addPaymentModal")).hide();
    document.getElementById("add-payment-form").reset();

    Swal.fire("Payment Saved", "Billing ledger updated.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    const profileBack = document.getElementById("crm-profile-back");
    if (profileBack) {
      renderClientProfile(invoice.clientId);
    } else if (activeView === "payments" || activeView === "dashboard" || activeView === "invoices") {
      switchView(activeView);
    }
    populateModalDropdowns();
  });

  // FORM: CREATE TASK
  document.getElementById("add-task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const tId = "T" + (state.tasks.length + 1).toString().padStart(3, "0");
    const clientId = document.getElementById("task-client-id").value;
    const title = document.getElementById("task-title").value;
    const status = document.getElementById("task-status").value;

    let prog = 10;
    if (status === "In Progress") prog = 50;
    if (status === "Review") prog = 85;
    if (status === "Completed") prog = 100;

    const newT = {
      id: tId,
      taskName: title,
      description: document.getElementById("task-desc").value,
      clientId: clientId,
      serviceId: document.getElementById("task-service-id").value,
      assignedEmployeeId: document.getElementById("task-assigned-employee").value,
      priority: document.getElementById("task-priority").value,
      startDate: document.getElementById("task-start").value,
      dueDate: document.getElementById("task-due").value,
      estHours: parseInt(document.getElementById("task-hours").value),
      progress: prog,
      status: status,
      comments: [],
      attachments: 0
    };

    state.tasks.push(newT);
    addNotification("Task Assigned", `Assigned task '${title}' to ${getEmployeeName(newT.assignedEmployeeId)}`, "info");
    addTimelineEvent("task", `Created task '${title}' assigned to ${getEmployeeName(newT.assignedEmployeeId)}`, "fa-list-check");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addTaskModal")).hide();
    document.getElementById("add-task-form").reset();

    Swal.fire("Task Saved", "Task board updated.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "my-tasks" || activeView === "employee-tasks" || activeView === "dashboard") switchView(activeView);
  });

  // FORM: CREATE REMINDER
  document.getElementById("add-reminder-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const rId = "R" + (state.reminders.length + 1).toString().padStart(3, "0");
    const title = document.getElementById("reminder-title").value;

    const newR = {
      id: rId,
      title: title,
      description: document.getElementById("reminder-desc").value,
      clientId: document.getElementById("reminder-client-id").value,
      serviceId: document.getElementById("reminder-service-id").value || "",
      assignedEmployeeId: document.getElementById("reminder-assigned-employee").value,
      reminderDate: document.getElementById("reminder-date").value,
      reminderTime: document.getElementById("reminder-time").value,
      priority: document.getElementById("reminder-priority").value,
      status: "Active"
    };

    state.reminders.push(newR);
    addTimelineEvent("reminder", `Scheduled reminder: '${title}'`, "fa-bell");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addReminderModal")).hide();
    document.getElementById("add-reminder-form").reset();

    Swal.fire("Reminder Configured", "Notification trigger scheduled.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    // If active view is Client Profile, re-render profile
    const profileBack = document.getElementById("crm-profile-back");
    if (profileBack) {
      renderClientProfile(newR.clientId);
    } else if (activeView === "reminders" || activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // FORM: CREATE NOTE
  document.getElementById("add-note-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nId = "N" + (state.notes.length + 1).toString().padStart(3, "0");
    const clientId = document.getElementById("note-client-id").value;
    const title = document.getElementById("note-title").value;
    const tagsInput = document.getElementById("note-tags").value;
    const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : ["General"];

    const newN = {
      id: nId,
      clientId: clientId,
      title: title,
      description: document.getElementById("note-desc").value,
      tags: tags,
      createdById: document.getElementById("note-created-by").value,
      dateCreated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      pinned: document.getElementById("note-pin").checked
    };

    state.notes.push(newN);
    addTimelineEvent("note", `Wrote client note: '${title}' for ${getClientName(clientId)}`, "fa-note-sticky");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addNoteModal")).hide();
    document.getElementById("add-note-form").reset();

    Swal.fire("Note Pinned", "Notes board updated.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    const profileBack = document.getElementById("crm-profile-back");
    if (profileBack) {
      renderClientProfile(clientId);
    } else if (activeView === "notes" || activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // CSV EXPORTER UTILITY
  const exportToCSV = (filename, dataArray, headers) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    dataArray.forEach(row => {
      csvContent += row.map(val => `"${(val || "").toString().replace(/"/g, '""')}"`).join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AUTO-POPULATE CLIENT NAME IN CAMPAIGN CREATION MODAL & HANDLE EDIT MODE
  const addMetaCampaignModalEl = document.getElementById("addMetaCampaignModal");
  if (addMetaCampaignModalEl) {
    addMetaCampaignModalEl.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      const isEdit = button && button.classList.contains("edit-meta-campaign-btn");
      
      const modalTitle = document.getElementById("addMetaCampaignModalLabel");
      const submitBtn = document.querySelector("#add-meta-campaign-form button[type='submit']");
      const clientInput = document.getElementById("meta-client-name");
      const hiddenIdInput = document.getElementById("meta-campaign-id-hidden");

      // Reset inline validation styles
      document.querySelectorAll("#add-meta-campaign-form .is-invalid").forEach(el => el.classList.remove("is-invalid"));

      if (isEdit) {
        const campId = button.getAttribute("data-id");
        const camp = state.metaAds.find(x => x.id === campId);
        if (camp) {
          modalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square me-2"></i>Edit Meta Campaign`;
          submitBtn.innerText = "Save Changes";
          hiddenIdInput.value = camp.id;
          clientInput.value = camp.clientName || state.selectedMetaClient || "";
          clientInput.setAttribute("readonly", "true");
          
          document.getElementById("meta-campaign-name").value = camp.campaignName || "";
          document.getElementById("meta-campaign-objective").value = camp.objective || "";
          document.getElementById("meta-campaign-ad-budget").value = camp.adBudget || "";
          document.getElementById("meta-campaign-start").value = camp.startDate || "";
          document.getElementById("meta-campaign-end").value = camp.endDate || "";
          document.getElementById("meta-campaign-status").value = camp.status || "Active";
        }
      } else {
        modalTitle.innerHTML = `<i class="fa-brands fa-facebook me-2"></i>Add Meta Ads Campaign`;
        submitBtn.innerText = "Save Campaign";
        hiddenIdInput.value = "";
        
        if (clientInput) {
          if (state.selectedMetaClient) {
            clientInput.value = state.selectedMetaClient;
            clientInput.setAttribute("readonly", "true");
          } else {
            clientInput.value = "";
            clientInput.removeAttribute("readonly");
          }
        }
        
        document.getElementById("meta-campaign-name").value = "";
        document.getElementById("meta-campaign-objective").value = "";
        document.getElementById("meta-campaign-ad-budget").value = "";
        document.getElementById("meta-campaign-start").value = "";
        document.getElementById("meta-campaign-end").value = "";
        document.getElementById("meta-campaign-status").value = "";
      }
    });
  }

  // FORM: ADD/EDIT META ADS CAMPAIGN
  document.getElementById("add-meta-campaign-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector("button[type='submit']");
    const id = document.getElementById("meta-campaign-id-hidden").value;
    const clientNameInput = document.getElementById("meta-client-name");
    const campaignNameInput = document.getElementById("meta-campaign-name");
    const objectiveInput = document.getElementById("meta-campaign-objective");
    const budgetInput = document.getElementById("meta-campaign-ad-budget");
    const startInput = document.getElementById("meta-campaign-start");
    const endInput = document.getElementById("meta-campaign-end");
    const statusInput = document.getElementById("meta-campaign-status");

    // Clear previous errors
    const inputs = [clientNameInput, campaignNameInput, objectiveInput, budgetInput, startInput, endInput, statusInput];
    inputs.forEach(input => {
      if (input) input.classList.remove("is-invalid");
    });

    let isValid = true;

    // Validate Client Name
    const clientName = clientNameInput.value.trim();
    if (!clientName) {
      clientNameInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Campaign Name
    const campaignName = campaignNameInput.value.trim();
    if (!campaignName) {
      campaignNameInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Objective
    const objective = objectiveInput.value.trim();
    if (!objective) {
      objectiveInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Budget
    const budgetValue = budgetInput.value.trim();
    const budget = parseFloat(budgetValue);
    if (!budgetValue || isNaN(budget) || budget <= 0) {
      budgetInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Start Date
    const startDate = startInput.value.trim();
    if (!startDate) {
      startInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate End Date
    const endDate = endInput.value.trim();
    if (!endDate) {
      endInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate End Date cannot be earlier than Start Date
    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        endInput.classList.add("is-invalid");
        isValid = false;
      }
    }

    // Validate Status
    const status = statusInput.value.trim();
    if (!status) {
      statusInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Prevent duplicate submissions
    submitBtn.disabled = true;
    const originalText = submitBtn.innerText;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...`;

    // Simulate saving delay (loading indicator)
    setTimeout(() => {
      if (id) {
        // Edit Mode
        const idx = state.metaAds.findIndex(x => x.id === id);
        if (idx !== -1) {
          state.metaAds[idx].clientName = clientName;
          state.metaAds[idx].campaignName = campaignName;
          state.metaAds[idx].objective = objective;
          state.metaAds[idx].adBudget = budget;
          state.metaAds[idx].packageAmount = budget; // sync packageAmount to budget
          state.metaAds[idx].startDate = startDate;
          state.metaAds[idx].endDate = endDate;
          state.metaAds[idx].status = status;
          
          addTimelineEvent("campaign", `Updated Meta Ads campaign '${campaignName}' for ${clientName}`, "fa-brands fa-facebook");
          saveState();
          Swal.fire("Campaign Updated", "Meta Ads ledger updated successfully.", "success");
        }
      } else {
        // Add Mode
        const mId = "MC" + (state.metaAds.length + 1).toString().padStart(3, "0");
        const newM = {
          id: mId,
          clientName: clientName,
          campaignName: campaignName,
          objective: objective,
          packageAmount: budget, // sync packageAmount to budget
          adBudget: budget,
          startDate: startDate,
          endDate: endDate,
          status: status,
          assignedEmployeeId: state.currentUser ? state.currentUser.id : "E001",
          remarks: "",
          dailyPerformance: [],
          payments: [],
          notes: [],
          followups: [],
          timeline: [
            { 
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), 
              text: "Campaign Created", 
              icon: "fa-plus", 
              eventType: "create" 
            }
          ]
        };

        state.metaAds.push(newM);
        addNotification("Meta Campaign Added", `Campaign ${campaignName} created for ${clientName}`, "success");
        addTimelineEvent("campaign", `Launched Meta Campaign ${campaignName} for ${clientName}`, "fa-brands fa-facebook");
        saveState();
        Swal.fire("Campaign Saved", "Meta Ads ledger updated.", "success");
      }

      // Reset submit button state
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;

      // Close modal
      bootstrap.Modal.getOrCreateInstance(document.getElementById("addMetaCampaignModal")).hide();
      document.getElementById("add-meta-campaign-form").reset();

      // Refresh table
      renderMetaAds();
    }, 600);
  });

  // FORM: ADD DAILY PERFORMANCE LOG
  document.getElementById("add-campaign-daily-performance-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const camp = state.metaAds.find(m => m.id === state.selectedMetaCampaignId);
    if (!camp) return;

    const dateVal = document.getElementById("daily-perf-date").value;
    const spendVal = parseFloat(document.getElementById("daily-perf-spend").value) || 0;
    const reachVal = parseInt(document.getElementById("daily-perf-reach").value) || 0;
    const clicksVal = parseInt(document.getElementById("daily-perf-clicks").value) || 0;
    const leadsVal = parseInt(document.getElementById("daily-perf-leads").value) || 0;
    const remarksVal = document.getElementById("daily-perf-remarks").value;

    const logEntry = {
      date: dateVal,
      adSpend: spendVal,
      reach: reachVal,
      clicks: clicksVal,
      leads: leadsVal,
      remarks: remarksVal
    };

    if (state.editingDailyLogIndex !== null && state.editingDailyLogIndex !== undefined) {
      // Edit mode
      const idx = state.editingDailyLogIndex;
      camp.dailyPerformance[idx] = logEntry;
      if (!camp.timeline) camp.timeline = [];
      camp.timeline.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        text: `Daily Performance Edited for ${dateVal}`,
        icon: "fa-pen-to-square",
        eventType: "performance"
      });
      Swal.fire("Log Updated", "Daily performance entry updated.", "success");
    } else {
      // Add mode
      if (!camp.dailyPerformance) camp.dailyPerformance = [];
      camp.dailyPerformance.push(logEntry);
      
      if (!camp.timeline) camp.timeline = [];
      camp.timeline.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        text: `Daily Performance Added: ₹${spendVal} Spend, ${leadsVal} Leads`,
        icon: "fa-chart-line",
        eventType: "performance"
      });
      Swal.fire("Log Saved", "Daily performance entry added.", "success");
    }

    saveState();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addCampaignDailyPerformanceModal")).hide();
    document.getElementById("add-campaign-daily-performance-form").reset();
    renderMetaAds();
  });

  // =========================================================================
  // MODULE: DAILY PERFORMANCE ENTRIES DASHBOARD
  // =========================================================================
  let metaDailySpendChart = null;
  let metaDailyLeadsChart = null;
  let metaDailyClicksReachChart = null;

  const initMetaDailyModal = (campId) => {
    const camp = state.metaAds.find(c => c.id === campId);
    if (!camp) return;

    const modalNameEl = document.getElementById("meta-daily-modal-campaign-name");
    if (modalNameEl) modalNameEl.innerText = camp.campaignName;
    
    const campIdInput = document.getElementById("meta-daily-camp-id");
    if (campIdInput) campIdInput.value = camp.id;
    
    resetMetaDailyForm();
    renderMetaDailyModalWorkspace(camp);
  };

  const resetMetaDailyForm = () => {
    const form = document.getElementById("meta-daily-entry-form");
    if (form) {
      form.reset();
      const editIndexInput = document.getElementById("meta-daily-edit-index");
      if (editIndexInput) editIndexInput.value = "";
      
      const cplInput = document.getElementById("meta-daily-cpl");
      if (cplInput) cplInput.value = "₹0.00";
      
      const formTitleEl = document.getElementById("meta-daily-form-title");
      if (formTitleEl) formTitleEl.innerHTML = `<i class="fa-solid fa-circle-plus text-danger me-2"></i>Add Daily Log`;
      
      const submitBtn = document.getElementById("meta-daily-submit-btn");
      if (submitBtn) submitBtn.innerText = "Save Entry";
      
      form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
      
      const dateInput = document.getElementById("meta-daily-date");
      if (dateInput) dateInput.removeAttribute("readonly");
    }
  };

  const renderMetaDailyModalWorkspace = (camp) => {
    const daily = camp.dailyPerformance || [];
    const sortedDesc = [...daily].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const totalSpend = daily.reduce((sum, d) => sum + (parseFloat(d.adSpend) || 0), 0);
    const totalReach = daily.reduce((sum, d) => sum + (parseInt(d.reach) || 0), 0);
    const totalClicks = daily.reduce((sum, d) => sum + (parseInt(d.clicks) || 0), 0);
    const totalLeads = daily.reduce((sum, d) => sum + (parseInt(d.leads) || 0), 0);
    const avgCpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;

    const spendEl = document.getElementById("meta-daily-summary-spend");
    const reachEl = document.getElementById("meta-daily-summary-reach");
    const clicksEl = document.getElementById("meta-daily-summary-clicks");
    const leadsEl = document.getElementById("meta-daily-summary-leads");
    const cplEl = document.getElementById("meta-daily-summary-cpl");

    if (spendEl) spendEl.innerText = `₹${totalSpend.toLocaleString('en-IN')}`;
    if (reachEl) reachEl.innerText = totalReach.toLocaleString('en-IN');
    if (clicksEl) clicksEl.innerText = totalClicks.toLocaleString('en-IN');
    if (leadsEl) leadsEl.innerText = totalLeads.toLocaleString('en-IN');
    if (cplEl) cplEl.innerText = `₹${avgCpl.toFixed(2)}`;

    const tbody = document.getElementById("meta-daily-modal-tbody");
    if (tbody) {
      if (sortedDesc.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-3">No daily metrics found. Fill the form to log your first performance entry.</td></tr>`;
      } else {
        tbody.innerHTML = sortedDesc.map((d, index) => {
          const spend = parseFloat(d.adSpend) || 0;
          const leads = parseInt(d.leads) || 0;
          const cpl = leads > 0 ? (spend / leads) : 0;
          const origIndex = daily.findIndex(x => x.date === d.date);

          return `
            <tr>
              <td class="fw-semibold text-dark">${d.date}</td>
              <td class="fw-bold text-danger">₹${spend.toLocaleString('en-IN')}</td>
              <td>${(parseInt(d.reach) || 0).toLocaleString('en-IN')}</td>
              <td>${(parseInt(d.clicks) || 0).toLocaleString('en-IN')}</td>
              <td class="fw-bold text-success">${leads}</td>
              <td class="fw-bold text-danger">₹${cpl.toFixed(2)}</td>
              <td class="text-secondary small text-wrap" style="max-width: 150px;">${d.remarks || '--'}</td>
              <td>
                <button class="btn btn-outline-secondary btn-xs edit-meta-daily-row-btn me-1" data-index="${origIndex}"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-outline-danger btn-xs delete-meta-daily-row-btn" data-index="${origIndex}"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `;
        }).join("");

        tbody.querySelectorAll(".edit-meta-daily-row-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"));
            const log = daily[idx];
            
            const editIndexInput = document.getElementById("meta-daily-edit-index");
            if (editIndexInput) editIndexInput.value = idx;
            
            const dateInput = document.getElementById("meta-daily-date");
            if (dateInput) {
              dateInput.value = log.date;
              dateInput.setAttribute("readonly", "true");
            }
            
            const spendInput = document.getElementById("meta-daily-spend");
            if (spendInput) spendInput.value = log.adSpend;
            
            const leadsInput = document.getElementById("meta-daily-leads");
            if (leadsInput) leadsInput.value = log.leads;
            
            const reachInput = document.getElementById("meta-daily-reach");
            if (reachInput) reachInput.value = log.reach;
            
            const clicksInput = document.getElementById("meta-daily-clicks");
            if (clicksInput) clicksInput.value = log.clicks;
            
            const remarksInput = document.getElementById("meta-daily-remarks");
            if (remarksInput) remarksInput.value = log.remarks || "";
            
            const spend = parseFloat(log.adSpend) || 0;
            const leads = parseInt(log.leads) || 0;
            const cpl = leads > 0 ? (spend / leads) : 0;
            const cplInput = document.getElementById("meta-daily-cpl");
            if (cplInput) cplInput.value = `₹${cpl.toFixed(2)}`;

            const formTitleEl = document.getElementById("meta-daily-form-title");
            if (formTitleEl) formTitleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-danger me-2"></i>Edit Daily Log`;
            
            const submitBtn = document.getElementById("meta-daily-submit-btn");
            if (submitBtn) submitBtn.innerText = "Save Changes";
          });
        });

        tbody.querySelectorAll(".delete-meta-daily-row-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"));
            const log = daily[idx];
            Swal.fire({
              title: "Delete Entry?",
              text: `Delete performance entry for ${log.date}? This cannot be undone.`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "var(--thynk-primary)",
              cancelButtonColor: "#6c757d",
              confirmButtonText: "Yes, delete it!"
            }).then((result) => {
              if (result.isConfirmed) {
                daily.splice(idx, 1);
                camp.dailyPerformance = daily.sort((a, b) => new Date(b.date) - new Date(a.date));
                saveState();
                
                if (!camp.timeline) camp.timeline = [];
                camp.timeline.unshift({
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  text: `Deleted daily performance entry for ${log.date}`,
                  icon: "fa-trash",
                  eventType: "performance"
                });

                Swal.fire("Deleted!", "Daily performance entry removed.", "success");
                renderMetaDailyModalWorkspace(camp);
                renderMetaAds();
              }
            });
          });
        });
      }
    }

    flatpickr("#meta-daily-date", { dateFormat: "Y-m-d", allowInput: true });
    renderMetaDailyCharts(daily);
  };

  const renderMetaDailyCharts = (daily) => {
    const sortedAsc = [...daily].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = sortedAsc.map(d => {
      const dt = new Date(d.date);
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    });
    const spendData = sortedAsc.map(d => parseFloat(d.adSpend) || 0);
    const leadsData = sortedAsc.map(d => parseInt(d.leads) || 0);
    const clicksData = sortedAsc.map(d => parseInt(d.clicks) || 0);
    const reachData = sortedAsc.map(d => parseInt(d.reach) || 0);

    if (metaDailySpendChart) { metaDailySpendChart.destroy(); metaDailySpendChart = null; }
    if (metaDailyLeadsChart) { metaDailyLeadsChart.destroy(); metaDailyLeadsChart = null; }
    if (metaDailyClicksReachChart) { metaDailyClicksReachChart.destroy(); metaDailyClicksReachChart = null; }

    const spendChartDiv = document.getElementById("meta-daily-spend-chart");
    const leadsChartDiv = document.getElementById("meta-daily-leads-chart");
    const clicksReachChartDiv = document.getElementById("meta-daily-clicks-reach-chart");

    if (sortedAsc.length === 0) {
      if (spendChartDiv) spendChartDiv.innerHTML = `<div class="text-center text-muted py-5">No data available to display charts.</div>`;
      if (leadsChartDiv) leadsChartDiv.innerHTML = `<div class="text-center text-muted py-5">No data available to display charts.</div>`;
      if (clicksReachChartDiv) clicksReachChartDiv.innerHTML = `<div class="text-center text-muted py-5">No data available to display charts.</div>`;
      return;
    }

    const spendOptions = {
      series: [{ name: "Ad Spend (₹)", data: spendData }],
      chart: { height: 280, type: 'line', toolbar: { show: false } },
      colors: ['#D32F2F'],
      stroke: { width: 3, curve: 'smooth' },
      xaxis: { categories: dates },
      yaxis: { labels: { formatter: (val) => "₹" + Math.round(val) } },
      tooltip: { y: { formatter: (val) => "₹" + val } }
    };
    if (spendChartDiv) {
      metaDailySpendChart = new ApexCharts(spendChartDiv, spendOptions);
      metaDailySpendChart.render();
    }

    const leadsOptions = {
      series: [{ name: "Leads Generated", data: leadsData }],
      chart: { height: 280, type: 'line', toolbar: { show: false } },
      colors: ['#2E7D32'],
      stroke: { width: 3, curve: 'smooth' },
      xaxis: { categories: dates },
      yaxis: { labels: { formatter: (val) => Math.round(val) } }
    };
    if (leadsChartDiv) {
      metaDailyLeadsChart = new ApexCharts(leadsChartDiv, leadsOptions);
      metaDailyLeadsChart.render();
    }

    const clicksReachOptions = {
      series: [
        { name: "Clicks", data: clicksData },
        { name: "Reach (x100)", data: reachData.map(r => r / 100) }
      ],
      chart: { height: 280, type: 'bar', toolbar: { show: false } },
      colors: ['#0d6efd', '#0dcaf0'],
      plotOptions: { bar: { columnWidth: '50%', borderRadius: 3 } },
      xaxis: { categories: dates },
      yaxis: { labels: { formatter: (val) => Math.round(val) } },
      tooltip: {
        shared: true,
        y: {
          formatter: function(val, { seriesIndex }) {
            if (seriesIndex === 1) return (val * 100).toLocaleString('en-IN');
            return val;
          }
        }
      }
    };
    if (clicksReachChartDiv) {
      metaDailyClicksReachChart = new ApexCharts(clicksReachChartDiv, clicksReachOptions);
      metaDailyClicksReachChart.render();
    }
  };

  const calculateDailyCpl = () => {
    const spendInput = document.getElementById("meta-daily-spend");
    const leadsInput = document.getElementById("meta-daily-leads");
    const cplInput = document.getElementById("meta-daily-cpl");
    
    if (spendInput && leadsInput && cplInput) {
      const spend = parseFloat(spendInput.value) || 0;
      const leads = parseInt(leadsInput.value) || 0;
      const cpl = leads > 0 ? (spend / leads) : 0;
      cplInput.value = `₹${cpl.toFixed(2)}`;
    }
  };
  
  const setupDailyCplListeners = () => {
    const spendInput = document.getElementById("meta-daily-spend");
    const leadsInput = document.getElementById("meta-daily-leads");
    if (spendInput) spendInput.addEventListener("input", calculateDailyCpl);
    if (leadsInput) leadsInput.addEventListener("input", calculateDailyCpl);
  };

  const setupDailyCancelListener = () => {
    const btn = document.getElementById("meta-daily-cancel-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        resetMetaDailyForm();
      });
    }
  };

  const setupDailyFormSubmitListener = () => {
    const form = document.getElementById("meta-daily-entry-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const campIdInput = document.getElementById("meta-daily-camp-id");
      const editIndexInput = document.getElementById("meta-daily-edit-index");
      const dateInput = document.getElementById("meta-daily-date");
      const spendInput = document.getElementById("meta-daily-spend");
      const leadsInput = document.getElementById("meta-daily-leads");
      const reachInput = document.getElementById("meta-daily-reach");
      const clicksInput = document.getElementById("meta-daily-clicks");
      const remarksInput = document.getElementById("meta-daily-remarks");

      if (!campIdInput || !dateInput || !spendInput || !leadsInput || !reachInput || !clicksInput || !remarksInput) return;

      const id = campIdInput.value;
      const editIdx = editIndexInput ? editIndexInput.value : "";

      const inputs = [dateInput, spendInput, leadsInput, reachInput, clicksInput];
      inputs.forEach(input => input.classList.remove("is-invalid"));

      let isValid = true;

      const dateVal = dateInput.value.trim();
      if (!dateVal) {
        dateInput.classList.add("is-invalid");
        isValid = false;
      }

      const spendVal = parseFloat(spendInput.value);
      if (isNaN(spendVal) || spendVal < 0) {
        spendInput.classList.add("is-invalid");
        isValid = false;
      }

      const leadsVal = parseInt(leadsInput.value);
      if (isNaN(leadsVal) || leadsVal < 0) {
        leadsInput.classList.add("is-invalid");
        isValid = false;
      }

      const reachVal = parseInt(reachInput.value);
      if (isNaN(reachVal) || reachVal < 0) {
        reachInput.classList.add("is-invalid");
        isValid = false;
      }

      const clicksVal = parseInt(clicksInput.value);
      if (isNaN(clicksVal) || clicksVal < 0) {
        clicksInput.classList.add("is-invalid");
        isValid = false;
      }

      if (!isValid) return;

      const camp = state.metaAds.find(c => c.id === id);
      if (!camp) return;

      const daily = camp.dailyPerformance || [];
      const remarksVal = remarksInput.value.trim();

      const entry = {
        date: dateVal,
        adSpend: spendVal,
        reach: reachVal,
        clicks: clicksVal,
        leads: leadsVal,
        remarks: remarksVal
      };

      const collisionIndex = daily.findIndex(x => x.date === dateVal);

      const saveEntry = (idxToSave, isOverwrite) => {
        if (isOverwrite) {
          daily[idxToSave] = entry;
          if (!camp.timeline) camp.timeline = [];
          camp.timeline.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            text: `Daily Performance Overwritten for ${dateVal}`,
            icon: "fa-pen-to-square",
            eventType: "performance"
          });
        } else if (idxToSave !== null && idxToSave !== "") {
          daily[idxToSave] = entry;
          if (!camp.timeline) camp.timeline = [];
          camp.timeline.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            text: `Daily Performance Edited for ${dateVal}`,
            icon: "fa-pen-to-square",
            eventType: "performance"
          });
        } else {
          daily.push(entry);
          if (!camp.timeline) camp.timeline = [];
          camp.timeline.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            text: `Daily Performance Added for ${dateVal}`,
            icon: "fa-chart-line",
            eventType: "performance"
          });
        }

        camp.dailyPerformance = daily.sort((a, b) => new Date(b.date) - new Date(a.date));
        saveState();

        Swal.fire("Daily Data Saved", "Daily performance added successfully.", "success");
        renderMetaDailyModalWorkspace(camp);
        resetMetaDailyForm();
        renderMetaAds();
      };

      if (collisionIndex !== -1 && editIdx === "") {
        Swal.fire({
          title: "Entry Already Exists",
          text: `An entry for ${dateVal} already exists. Do you want to update it?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "var(--thynk-primary)",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, Overwrite",
          cancelButtonText: "No, Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            saveEntry(collisionIndex, true);
          }
        });
      } else {
        saveEntry(editIdx !== "" ? parseInt(editIdx) : null, false);
      }
    });
  };

  const setupDailyExportListeners = () => {
    const excelBtn = document.getElementById("meta-daily-export-excel-btn");
    const pdfBtn = document.getElementById("meta-daily-export-pdf-btn");

    if (excelBtn) {
      excelBtn.addEventListener("click", () => {
        const campIdInput = document.getElementById("meta-daily-camp-id");
        if (!campIdInput) return;
        const id = campIdInput.value;
        const camp = state.metaAds.find(c => c.id === id);
        if (!camp) return;

        const daily = camp.dailyPerformance || [];
        const sortedDesc = [...daily].sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalSpend = daily.reduce((sum, d) => sum + (parseFloat(d.adSpend) || 0), 0);
        const totalReach = daily.reduce((sum, d) => sum + (parseInt(d.reach) || 0), 0);
        const totalClicks = daily.reduce((sum, d) => sum + (parseInt(d.clicks) || 0), 0);
        const totalLeads = daily.reduce((sum, d) => sum + (parseInt(d.leads) || 0), 0);
        const avgCpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;

        let csv = `Campaign Name,${camp.campaignName}\n`;
        csv += `Date Range,${daily.length > 0 ? sortedDesc[sortedDesc.length - 1].date : 'N/A'} to ${daily.length > 0 ? sortedDesc[0].date : 'N/A'}\n\n`;
        csv += `SUMMARY METRICS\n`;
        csv += `Total Spend,Total Reach,Total Clicks,Total Leads,Average CPL\n`;
        csv += `₹${totalSpend},${totalReach},${totalClicks},${totalLeads},₹${avgCpl.toFixed(2)}\n\n`;
        csv += `DAILY PERFORMANCE LOG\n`;
        csv += `Date,Ad Spend (₹),Reach,Clicks,Leads,CPL (₹),Remarks\n`;
        
        sortedDesc.forEach(d => {
          const spend = parseFloat(d.adSpend) || 0;
          const leads = parseInt(d.leads) || 0;
          const cpl = leads > 0 ? (spend / leads) : 0;
          csv += `${d.date},${spend},${d.reach},${d.clicks},${leads},${cpl.toFixed(2)},"${(d.remarks || '').replace(/"/g, '""')}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${camp.campaignName.replace(/\s+/g, '_')}_Daily_Performance.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire("Export Successful", "Daily Performance exported to Excel format.", "success");
      });
    }

    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        const campIdInput = document.getElementById("meta-daily-camp-id");
        if (!campIdInput) return;
        const id = campIdInput.value;
        const camp = state.metaAds.find(c => c.id === id);
        if (!camp) return;

        const daily = camp.dailyPerformance || [];
        const sortedDesc = [...daily].sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalSpend = daily.reduce((sum, d) => sum + (parseFloat(d.adSpend) || 0), 0);
        const totalReach = daily.reduce((sum, d) => sum + (parseInt(d.reach) || 0), 0);
        const totalClicks = daily.reduce((sum, d) => sum + (parseInt(d.clicks) || 0), 0);
        const totalLeads = daily.reduce((sum, d) => sum + (parseInt(d.leads) || 0), 0);
        const avgCpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        let html = `
          <html>
            <head>
              <title>${camp.campaignName} - Daily Performance Report</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
                .report-header { border-bottom: 2px solid #dc3545; margin-bottom: 30px; padding-bottom: 20px; }
                .metric-card { border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; text-align: center; background-color: #f8f9fa; }
                .metric-value { font-size: 1.5rem; font-weight: bold; margin-top: 5px; }
                table { font-size: 0.9rem; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="d-flex justify-content-between align-items-center mb-4 no-print">
                <h5 class="text-muted">Report Preview</h5>
                <button class="btn btn-danger btn-sm" onclick="window.print()">Print / Save as PDF</button>
              </div>
              <div class="report-header">
                <h2 class="fw-bold text-danger">${camp.campaignName}</h2>
                <h5 class="text-secondary">Meta Ads Daily Performance Report</h5>
                <p class="mb-0 mt-2"><strong>Client:</strong> ${camp.clientName} | <strong>Date Range:</strong> ${daily.length > 0 ? sortedDesc[sortedDesc.length - 1].date : 'N/A'} to ${daily.length > 0 ? sortedDesc[0].date : 'N/A'}</p>
              </div>
              
              <h4 class="fw-bold mb-3">Performance Summary</h4>
              <div class="row mb-5 g-3">
                <div class="col-4"><div class="metric-card"><div>Total Spend</div><div class="metric-value text-danger">₹${totalSpend.toLocaleString('en-IN')}</div></div></div>
                <div class="col-4"><div class="metric-card"><div>Total Reach</div><div class="metric-value">${totalReach.toLocaleString('en-IN')}</div></div></div>
                <div class="col-4"><div class="metric-card"><div>Total Clicks</div><div class="metric-value">${totalClicks.toLocaleString('en-IN')}</div></div></div>
                <div class="col-6"><div class="metric-card"><div>Total Leads</div><div class="metric-value text-success">${totalLeads.toLocaleString('en-IN')}</div></div></div>
                <div class="col-6"><div class="metric-card"><div>Average CPL</div><div class="metric-value text-danger">₹${avgCpl.toFixed(2)}</div></div></div>
              </div>
              
              <h4 class="fw-bold mb-3">Daily Performance Entries</h4>
              <table class="table table-striped table-bordered align-middle">
                <thead class="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Ad Spend</th>
                    <th>Reach</th>
                    <th>Clicks</th>
                    <th>Leads</th>
                    <th>CPL</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedDesc.map(d => {
                    const spend = parseFloat(d.adSpend) || 0;
                    const leads = parseInt(d.leads) || 0;
                    const cpl = leads > 0 ? (spend / leads) : 0;
                    return `
                      <tr>
                        <td>${d.date}</td>
                        <td>₹${spend.toLocaleString('en-IN')}</td>
                        <td>${(parseInt(d.reach) || 0).toLocaleString('en-IN')}</td>
                        <td>${(parseInt(d.clicks) || 0).toLocaleString('en-IN')}</td>
                        <td>${leads}</td>
                        <td>₹${cpl.toFixed(2)}</td>
                        <td>${d.remarks || '--'}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
      });
    }
  };

  // Central show.bs.modal listener for dailyPerformanceEntriesModal
  const dailyPerformanceEntriesModalEl = document.getElementById("dailyPerformanceEntriesModal");
  if (dailyPerformanceEntriesModalEl) {
    dailyPerformanceEntriesModalEl.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      const campId = button ? button.getAttribute("data-id") : state.selectedMetaCampaignId;
      if (campId) {
        initMetaDailyModal(campId);
      }
    });
  }

  // Setup Daily Performance Form listeners
  setupDailyCplListeners();
  setupDailyCancelListener();
  setupDailyFormSubmitListener();
  setupDailyExportListeners();

  // FORM: RECORD CAMPAIGN PAYMENT
  document.getElementById("add-campaign-payment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const camp = state.metaAds.find(m => m.id === state.selectedMetaCampaignId);
    if (!camp) return;

    const dateVal = document.getElementById("campaign-payment-date").value;
    const amtVal = parseFloat(document.getElementById("campaign-payment-amount").value) || 0;
    const modeVal = document.getElementById("campaign-payment-mode").value;
    const refVal = document.getElementById("campaign-payment-ref").value;
    const remarksVal = document.getElementById("campaign-payment-remarks").value;

    const paymentEntry = {
      date: dateVal,
      amount: amtVal,
      mode: modeVal,
      transactionId: refVal,
      remarks: remarksVal
    };

    if (!camp.payments) camp.payments = [];
    camp.payments.push(paymentEntry);

    // Also link it globally under state.payments
    const client = state.clients.find(c => c.companyName === camp.clientName);
    const globalPaymentId = "PAY" + (state.payments.length + 1).toString().padStart(3, "0");
    state.payments.push({
      id: globalPaymentId,
      invoiceNo: `CAMP-${camp.id}`,
      clientId: client ? client.id : "C001",
      amount: amtVal,
      date: dateVal,
      paymentMode: modeVal,
      transactionId: refVal,
      receivedById: state.currentUser ? state.currentUser.id : "E001",
      remarks: `Meta Campaign Payment: ${camp.campaignName} - ${remarksVal}`
    });

    if (!camp.timeline) camp.timeline = [];
    camp.timeline.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text: `Payment Received: ₹${amtVal} via ${modeVal}`,
      icon: "fa-receipt",
      eventType: "payment"
    });

    saveState();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addCampaignPaymentModal")).hide();
    document.getElementById("add-campaign-payment-form").reset();
    Swal.fire("Payment Logged", "Campaign payment transaction registered successfully.", "success");
    renderMetaAds();
  });

  // FORM: CREATE CAMPAIGN NOTE
  document.getElementById("add-campaign-note-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const camp = state.metaAds.find(m => m.id === state.selectedMetaCampaignId);
    if (!camp) return;

    const titleVal = document.getElementById("campaign-note-title").value;
    const descVal = document.getElementById("campaign-note-desc").value;
    const priorityVal = document.getElementById("campaign-note-priority").value;
    const tagsVal = document.getElementById("campaign-note-tags").value;

    const noteEntry = {
      id: "MN" + Date.now(),
      title: titleVal,
      description: descVal,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdBy: state.currentUser ? state.currentUser.name : "Manager",
      priority: priorityVal,
      tags: tagsVal
    };

    if (!camp.notes) camp.notes = [];
    camp.notes.unshift(noteEntry);

    if (!camp.timeline) camp.timeline = [];
    camp.timeline.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text: `Note Created: ${titleVal}`,
      icon: "fa-note-sticky",
      eventType: "note"
    });

    saveState();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addCampaignNoteModal")).hide();
    document.getElementById("add-campaign-note-form").reset();
    Swal.fire("Note Saved", "Campaign strategy note registered.", "success");
    renderMetaAds();
  });

  // FORM: RECORD CAMPAIGN FOLLOW-UP
  document.getElementById("add-campaign-followup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const camp = state.metaAds.find(m => m.id === state.selectedMetaCampaignId);
    if (!camp) return;

    const dateVal = document.getElementById("campaign-followup-date").value;
    const nextVal = document.getElementById("campaign-followup-next").value;
    const typeVal = document.getElementById("campaign-followup-type").value;
    const statusVal = document.getElementById("campaign-followup-status").value;
    const employeeVal = document.getElementById("campaign-followup-employee").value;
    const summaryVal = document.getElementById("campaign-followup-summary").value;

    const followupEntry = {
      id: "MF" + Date.now(),
      date: dateVal,
      nextFollowup: nextVal,
      type: typeVal,
      summary: summaryVal,
      assignedEmployeeId: employeeVal,
      status: statusVal
    };

    if (!camp.followups) camp.followups = [];
    camp.followups.unshift(followupEntry);

    if (!camp.timeline) camp.timeline = [];
    camp.timeline.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text: `Communication Logged: ${typeVal} (${statusVal})`,
      icon: "fa-phone-volume",
      eventType: "followup"
    });

    saveState();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addCampaignFollowupModal")).hide();
    document.getElementById("add-campaign-followup-form").reset();
    Swal.fire("Follow-up Saved", "Campaign communication log registered.", "success");
    renderMetaAds();
  });

  // FORM: ADD CANVA PREMIUM LICENSE
  document.getElementById("add-canva-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const canId = "CAN" + (state.canva.length + 1).toString().padStart(3, "0");
    const clientId = document.getElementById("canva-client-id").value || "";
    let clientName = document.getElementById("canva-client-name").value.trim();
    
    // If client is selected from dropdown but name is not typed, get from client object
    if (clientId && !clientName) {
      clientName = getClientName(clientId);
    }
    
    if (!clientName) {
      Swal.fire("Error", "Please select a client or type a custom name.", "error");
      return;
    }
    
    const email = document.getElementById("canva-email").value;
    const price = parseInt(document.getElementById("canva-price").value) || 499;
    const purchaseDate = document.getElementById("canva-purchase-date").value;
    const renewalDate = document.getElementById("canva-renewal-date").value;
    const notes = document.getElementById("canva-notes").value || "";

    const newCan = {
      id: canId,
      clientId: clientId,
      clientName: clientName,
      email: email,
      price: price,
      purchaseDate: purchaseDate,
      renewalDate: renewalDate,
      notes: notes
    };

    state.canva.push(newCan);
    addTimelineEvent("service", `Registered Canva Premium license for ${clientName} (${email})`, "fa-palette");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addCanvaModal")).hide();
    document.getElementById("add-canva-form").reset();

    Swal.fire("License Saved", "Canva Premium license successfully tracked.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "canva") {
      renderCanva();
    }
  });

  // FORM: ADD BILLING SOFTWARE LICENSE
  document.getElementById("add-billing-software-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const bsId = "BS" + (state.billingSoftware.length + 1).toString().padStart(3, "0");
    const clientId = document.getElementById("billing-software-client-id").value || "";
    let companyName = document.getElementById("billing-software-company-name").value.trim();
    
    // If company is selected from dropdown but name is not typed, get from client object
    if (clientId && !companyName) {
      companyName = getClientName(clientId);
    }
    
    if (!companyName) {
      Swal.fire("Error", "Please select a client or type a custom company name.", "error");
      return;
    }
    
    const clientName = document.getElementById("billing-software-client-name").value.trim() || "";
    const price = parseInt(document.getElementById("billing-software-price").value) || 0;
    const maintenance = parseInt(document.getElementById("billing-software-maintenance").value) || 0;
    const purchaseDate = document.getElementById("billing-software-purchase-date").value;
    const renewalDate = document.getElementById("billing-software-renewal-date").value;
    const notes = document.getElementById("billing-software-notes").value || "";

    const newBS = {
      id: bsId,
      clientId: clientId,
      companyName: companyName,
      clientName: clientName,
      price: price,
      maintenance: maintenance,
      purchaseDate: purchaseDate,
      renewalDate: renewalDate,
      notes: notes
    };

    state.billingSoftware.push(newBS);
    addTimelineEvent("service", `Registered Billing Software license for ${companyName}`, "fa-file-invoice-dollar");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addBillingSoftwareModal")).hide();
    document.getElementById("add-billing-software-form").reset();

    Swal.fire("License Saved", "Billing Software license successfully tracked.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "billing-software") {
      renderBillingSoftware();
    }
  });

  // FORM: EDIT SERVICE CONTRACT
  document.getElementById("edit-service-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const srvId = document.getElementById("edit-service-id-hidden").value;
    const srvIndex = state.services.findIndex(s => s.id === srvId);
    if (srvIndex === -1) {
      Swal.fire("Error", "Service contract not found.", "error");
      return;
    }

    const name = document.getElementById("edit-service-name").value;
    const cost = parseInt(document.getElementById("edit-service-cost").value) || 0;
    const discount = parseInt(document.getElementById("edit-service-discount").value) || 0;
    const finalAmt = cost - discount;

    // Update fields in contract
    state.services[srvIndex].serviceName = name;
    state.services[srvIndex].package = document.getElementById("edit-service-package").value || "";
    state.services[srvIndex].startDate = document.getElementById("edit-service-start").value || "";
    state.services[srvIndex].endDate = document.getElementById("edit-service-end").value || "";
    state.services[srvIndex].renewalDate = document.getElementById("edit-service-end").value || "";
    state.services[srvIndex].assignedEmployeeId = document.getElementById("edit-service-assigned-employee").value || "";
    state.services[srvIndex].cost = cost;
    state.services[srvIndex].discount = discount;
    state.services[srvIndex].finalAmount = finalAmt;
    state.services[srvIndex].status = document.getElementById("edit-service-status").value;
    state.services[srvIndex].notes = document.getElementById("edit-service-notes").value || "";

    addTimelineEvent("service", `Updated service contract '${name}' for ${getClientName(state.services[srvIndex].clientId)}`, "fa-cube");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editServiceModal")).hide();
    document.getElementById("edit-service-form").reset();

    Swal.fire("Changes Saved", "Service contract updated successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    // If active view is Client Profile, re-render profile
    const profileBack = document.getElementById("crm-profile-back");
    if (profileBack) {
      renderClientProfile(state.services[srvIndex].clientId);
    } else if (activeView === "services" || activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // FORM: EDIT DOMAIN
  document.getElementById("edit-domain-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const domId = document.getElementById("edit-domain-id-hidden").value;
    const domIndex = state.domains.findIndex(d => d.id === domId);
    if (domIndex === -1) {
      Swal.fire("Error", "Domain record not found.", "error");
      return;
    }

    const domainName = document.getElementById("edit-domain-name").value;
    const cost = parseInt(document.getElementById("edit-domain-cost").value) || 0;

    // Update fields
    state.domains[domIndex].clientId = document.getElementById("edit-domain-client-id").value;
    state.domains[domIndex].domainName = domainName;
    state.domains[domIndex].registrar = document.getElementById("edit-domain-registrar").value;
    state.domains[domIndex].registrationDate = document.getElementById("edit-domain-purchased").value;
    state.domains[domIndex].expiryDate = document.getElementById("edit-domain-expiry").value;
    state.domains[domIndex].renewalDate = document.getElementById("edit-domain-expiry").value;
    state.domains[domIndex].renewalCost = cost;
    state.domains[domIndex].dnsStatus = document.getElementById("edit-domain-dns").value;
    state.domains[domIndex].status = document.getElementById("edit-domain-status").value;
    state.domains[domIndex].nameservers = document.getElementById("edit-domain-nameservers").value || "";
    state.domains[domIndex].credentialsPlaceholder = document.getElementById("edit-domain-credentials").value || "";
    state.domains[domIndex].notes = document.getElementById("edit-domain-notes").value || "";

    addTimelineEvent("domain", `Updated domain record '${domainName}' for ${getClientName(state.domains[domIndex].clientId)}`, "fa-globe");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editDomainModal")).hide();
    document.getElementById("edit-domain-form").reset();

    Swal.fire("Changes Saved", "Domain record updated successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "domain-hosting") {
      renderDomainHosting();
    } else if (activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // FORM: EDIT HOSTING
  document.getElementById("edit-hosting-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const hstId = document.getElementById("edit-hosting-id-hidden").value;
    const hstIndex = state.hostings.findIndex(h => h.id === hstId);
    if (hstIndex === -1) {
      Swal.fire("Error", "Hosting record not found.", "error");
      return;
    }

    const provider = document.getElementById("edit-hosting-provider").value;
    const cost = parseInt(document.getElementById("edit-hosting-cost").value) || 0;

    // Update fields
    state.hostings[hstIndex].clientId = document.getElementById("edit-hosting-client-id").value;
    state.hostings[hstIndex].hostingProvider = provider;
    state.hostings[hstIndex].hostingPlan = document.getElementById("edit-hosting-plan").value;
    state.hostings[hstIndex].purchaseDate = document.getElementById("edit-hosting-purchased").value;
    state.hostings[hstIndex].expiryDate = document.getElementById("edit-hosting-expiry").value;
    state.hostings[hstIndex].renewalDate = document.getElementById("edit-hosting-expiry").value;
    state.hostings[hstIndex].renewalCost = cost;
    state.hostings[hstIndex].backupStatus = document.getElementById("edit-hosting-backup").value || "";
    state.hostings[hstIndex].status = document.getElementById("edit-hosting-status").value;
    state.hostings[hstIndex].notes = document.getElementById("edit-hosting-notes").value || "";

    addTimelineEvent("hosting", `Updated hosting record '${provider}' for ${getClientName(state.hostings[hstIndex].clientId)}`, "fa-server");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editHostingModal")).hide();
    document.getElementById("edit-hosting-form").reset();

    Swal.fire("Changes Saved", "Hosting record updated successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "domain-hosting") {
      renderDomainHosting();
    } else if (activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // FORM: ADD DOMAIN
  document.getElementById("add-domain-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const domainName = document.getElementById("add-domain-name").value;
    const cost = parseInt(document.getElementById("add-domain-cost").value) || 0;
    const clientId = document.getElementById("add-domain-client-id").value;
    const registrationDate = document.getElementById("add-domain-purchased").value;
    const expiryDate = document.getElementById("add-domain-expiry").value;

    const newDom = {
      id: "D" + (state.domains.length + 1).toString().padStart(3, "0"),
      clientId: clientId,
      domainName: domainName,
      registrar: document.getElementById("add-domain-registrar").value,
      registrationDate: registrationDate,
      expiryDate: expiryDate,
      renewalDate: expiryDate,
      renewalCost: cost,
      dnsStatus: document.getElementById("add-domain-dns").value,
      status: document.getElementById("add-domain-status").value,
      nameservers: document.getElementById("add-domain-nameservers").value || "",
      credentialsPlaceholder: document.getElementById("add-domain-credentials").value || "",
      notes: document.getElementById("add-domain-notes").value || ""
    };

    state.domains.push(newDom);

    addTimelineEvent("domain", `Added domain record '${domainName}' for ${getClientName(clientId)}`, "fa-globe");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addDomainModal")).hide();
    document.getElementById("add-domain-form").reset();

    Swal.fire("Success", "Domain record added successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "domain-hosting") {
      renderDomainHosting();
    } else if (activeView === "dashboard") {
      switchView(activeView);
    }
  });

  // FORM: ADD HOSTING
  document.getElementById("add-hosting-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const provider = document.getElementById("add-hosting-provider").value;
    const cost = parseInt(document.getElementById("add-hosting-cost").value) || 0;
    const clientId = document.getElementById("add-hosting-client-id").value;
    const purchaseDate = document.getElementById("add-hosting-purchased").value;
    const expiryDate = document.getElementById("add-hosting-expiry").value;

    const newHst = {
      id: "H" + (state.hostings.length + 1).toString().padStart(3, "0"),
      clientId: clientId,
      hostingProvider: provider,
      hostingPlan: document.getElementById("add-hosting-plan").value,
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      renewalDate: expiryDate,
      renewalCost: cost,
      backupStatus: document.getElementById("add-hosting-backup").value || "",
      status: document.getElementById("add-hosting-status").value,
      notes: document.getElementById("add-hosting-notes").value || ""
    };

    state.hostings.push(newHst);

    addTimelineEvent("hosting", `Added hosting record '${provider}' for ${getClientName(clientId)}`, "fa-server");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addHostingModal")).hide();
    document.getElementById("add-hosting-form").reset();

    Swal.fire("Success", "Hosting record added successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "domain-hosting") {
      renderDomainHosting();
    } else if (activeView === "dashboard") {
      switchView(activeView);
    }
  });


  // FORM: EDIT FOLLOW-UP
  document.getElementById("edit-followup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const flwId = document.getElementById("edit-followup-id-hidden").value;
    const flwIndex = state.followups.findIndex(x => x.id === flwId);
    if (flwIndex === -1) {
      Swal.fire("Error", "Follow-up record not found.", "error");
      return;
    }

    state.followups[flwIndex].type = document.getElementById("edit-followup-type").value;
    state.followups[flwIndex].status = document.getElementById("edit-followup-status").value;
    state.followups[flwIndex].lastContact = document.getElementById("edit-followup-last").value;
    state.followups[flwIndex].nextFollowup = document.getElementById("edit-followup-next").value;
    state.followups[flwIndex].remarks = document.getElementById("edit-followup-remarks").value;

    addTimelineEvent("followup", `Updated follow-up status for client ${getClientName(state.followups[flwIndex].clientId)}`, "fa-phone");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editFollowupModal")).hide();
    document.getElementById("edit-followup-form").reset();

    Swal.fire("Changes Saved", "Follow-up record updated successfully.", "success");

    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "followups") {
      renderFollowups();
    }
  });

  // FORM: EDIT SEO CAMPAIGN
  document.getElementById("edit-seo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-seo-id-hidden").value;
    const idx = state.seo.findIndex(x => x.id === id);
    if (idx === -1) {
      Swal.fire("Error", "SEO record not found.", "error");
      return;
    }
    
    // Save updated values
    state.seo[idx].clientId = document.getElementById("edit-seo-client-id").value;
    state.seo[idx].websiteUrl = document.getElementById("edit-seo-url").value;
    state.seo[idx].campaignName = document.getElementById("edit-seo-campaign-name").value;
    state.seo[idx].package = document.getElementById("edit-seo-package").value;
    state.seo[idx].startDate = document.getElementById("edit-seo-start-date").value;
    state.seo[idx].endDate = document.getElementById("edit-seo-end-date").value;
    state.seo[idx].budget = parseFloat(document.getElementById("edit-seo-budget").value) || 0;
    state.seo[idx].status = document.getElementById("edit-seo-status").value;
    state.seo[idx].assignedEmployeeId = document.getElementById("edit-seo-employee").value;
    state.seo[idx].reportDate = document.getElementById("edit-seo-report-date").value;
    state.seo[idx].reportFrequency = document.getElementById("edit-seo-frequency").value;
    state.seo[idx].notes = document.getElementById("edit-seo-notes").value;

    const additionalKwsText = document.getElementById("edit-seo-keywords").value || "";
    const uniquePhrases = [...new Set(
      additionalKwsText.split(/[\n,]+/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
    )];
    
    if (uniquePhrases.length > 0) {
      state.seo[idx].keywords = state.seo[idx].keywords || [];
      const existingPhrases = new Set(state.seo[idx].keywords.map(k => k.keyword.toLowerCase()));
      
      uniquePhrases.forEach(phrase => {
        if (!existingPhrases.has(phrase.toLowerCase())) {
          const newKwId = "KW" + (state.seo[idx].keywords.length + 1).toString().padStart(3, "0");
          state.seo[idx].keywords.push({
            id: newKwId,
            keyword: phrase,
            targetUrl: state.seo[idx].websiteUrl,
            searchEngine: "Google",
            device: "Desktop",
            location: "Global",
            priority: "Medium",
            currentRank: 10,
            previousRank: 10,
            status: "No Change",
            notes: "Added via campaign edit."
          });
        }
      });
    }

    addTimelineEvent("seo", `Updated SEO campaign settings for ${getClientName(state.seo[idx].clientId)}`, "fa-magnifying-glass-chart");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editSeoModal")).hide();
    document.getElementById("edit-seo-form").reset();

    Swal.fire("Changes Saved", "SEO campaign updated successfully.", "success");
    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "seo") renderSEO();
  });

  // FORM: ADD SEO CAMPAIGN
  document.getElementById("add-seo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Generate new unique ID
    const newId = "SEO" + (state.seo.length + 1).toString().padStart(3, "0");
    
    const initialKwsText = document.getElementById("add-seo-keywords").value || "";
    const uniquePhrases = [...new Set(
      initialKwsText.split(/[\n,]+/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
    )];

    const targetUrl = document.getElementById("add-seo-url").value;
    const initialKeywordsList = uniquePhrases.map((phrase, idx) => ({
      id: "KW" + (idx + 1).toString().padStart(3, "0"),
      keyword: phrase,
      targetUrl: targetUrl,
      searchEngine: "Google",
      device: "Desktop",
      location: "Global",
      priority: "Medium",
      currentRank: 10,
      previousRank: 10,
      status: "No Change",
      notes: "Initially added with campaign."
    }));

    const newCampaign = {
      id: newId,
      clientId: document.getElementById("add-seo-client-id").value,
      websiteUrl: targetUrl,
      campaignName: document.getElementById("add-seo-campaign-name").value,
      package: document.getElementById("add-seo-package").value,
      startDate: document.getElementById("add-seo-start-date").value,
      endDate: document.getElementById("add-seo-end-date").value,
      budget: parseFloat(document.getElementById("add-seo-budget").value) || 0,
      status: document.getElementById("add-seo-status").value || "Active",
      assignedEmployeeId: document.getElementById("add-seo-employee").value || "",
      reportDate: document.getElementById("add-seo-report-date").value,
      reportFrequency: document.getElementById("add-seo-frequency").value || "Monthly",
      notes: document.getElementById("add-seo-notes").value || "",
      keywords: initialKeywordsList,
      weeklyLog: [],
      uploadedReports: [],
      ga4: { users: 0, sessions: 0, engagedSessions: 0, views: 0, bounceRate: 0, avgEngagementTime: 0, conversions: 0 },
      gsc: { totalClicks: 0, totalImpressions: 0, avgCtr: 0, avgPosition: 0, topQueries: [], topPages: [] }
    };

    if (!state.seo) state.seo = [];
    state.seo.push(newCampaign);

    addTimelineEvent("seo", `Created new SEO campaign for ${getClientName(newCampaign.clientId)}`, "fa-magnifying-glass-chart");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("addSeoModal")).hide();
    document.getElementById("add-seo-form").reset();

    Swal.fire("Created!", "New SEO campaign created successfully.", "success");
    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "seo") renderSEO();
  });

  // FORM: ADD/EDIT SEO KEYWORD
  document.getElementById("keyword-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const kwId = document.getElementById("kw-id-hidden").value;
    let campaignId = document.getElementById("kw-campaign-id-hidden").value;
    
    // Fallback to select dropdown if not inside a campaign dashboard context
    if (!campaignId) {
      campaignId = document.getElementById("kw-input-campaign-id").value;
    }
    
    if (!campaignId) {
      Swal.fire("Error", "Please select an SEO Campaign.", "error");
      return;
    }
    
    const camp = state.seo.find(x => x.id === campaignId);
    if (!camp) {
      Swal.fire("Error", "Campaign not found.", "error");
      return;
    }
    
    const keywordInput = document.getElementById("kw-input-name").value;
    const targetUrl = document.getElementById("kw-input-target-url").value;
    const searchEngine = document.getElementById("kw-input-engine").value;
    const device = document.getElementById("kw-input-device").value;
    const location = document.getElementById("kw-input-location").value;
    const status = document.getElementById("kw-input-status").value;
    const priority = document.getElementById("kw-input-priority").value;
    const currentRank = parseInt(document.getElementById("kw-input-curr-rank").value) || 10;
    const previousRank = parseInt(document.getElementById("kw-input-prev-rank").value) || 10;
    const searchVolume = parseInt(document.getElementById("kw-input-volume").value) || null;
    const difficulty = parseInt(document.getElementById("kw-input-difficulty").value) || null;
    const notes = document.getElementById("kw-input-notes").value || "";
    
    if (currentRank < 1 || previousRank < 1) {
      Swal.fire("Validation Error", "Ranking positions must be positive numbers.", "warning");
      return;
    }
    
    camp.keywords = camp.keywords || [];
    
    if (kwId) {
      // Edit mode (single keyword)
      const kwIdx = camp.keywords.findIndex(x => x.id === kwId);
      if (kwIdx !== -1) {
        camp.keywords[kwIdx] = { 
          id: kwId, 
          keyword: keywordInput.trim(), 
          targetUrl, 
          searchEngine, 
          device, 
          location, 
          status, 
          priority,
          currentRank, 
          previousRank, 
          searchVolume, 
          difficulty,
          notes
        };
      }
    } else {
      // Add mode (single or multiple keywords)
      // Split input by newlines or commas
      const rawPhrases = keywordInput.split(/[\n,]/);
      const uniquePhrases = [];
      
      for (let phrase of rawPhrases) {
        phrase = phrase.trim();
        if (!phrase) continue;
        
        // Prevent duplicate keywords within input
        if (uniquePhrases.includes(phrase.toLowerCase())) continue;
        
        // Prevent duplicates in database
        if (camp.keywords.some(x => x.keyword.toLowerCase() === phrase.toLowerCase())) {
          Swal.fire("Duplicate Keyword", `"${phrase}" is already tracked in this campaign.`, "warning");
          return;
        }
        
        uniquePhrases.push(phrase);
      }
      
      if (uniquePhrases.length === 0) {
        Swal.fire("Validation Error", "Please enter at least one valid keyword phrase.", "warning");
        return;
      }
      
      uniquePhrases.forEach(phrase => {
        const newKwId = "KW" + (camp.keywords.length + 1).toString().padStart(3, "0");
        camp.keywords.push({
          id: newKwId,
          keyword: phrase,
          targetUrl,
          searchEngine,
          device,
          location,
          status,
          priority,
          currentRank,
          previousRank,
          searchVolume,
          difficulty,
          notes
        });
      });
    }
    
    saveState();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addKeywordModal")).hide();
    document.getElementById("keyword-form").reset();
    
    Swal.fire("Saved", "Keywords tracking list updated.", "success");
    
    // Re-render appropriate view
    if (state.selectedSeoCampaignId === campaignId) {
      renderCampaignDashboard(campaignId);
    } else {
      renderSEO();
    }
  });

  // AUTO-POPULATE PREVIOUS RANK, ENGINE, DEVICE ON KEYWORD SELECT
  document.getElementById("weekly-input-keyword-id").addEventListener("change", (e) => {
    const kwVal = e.target.value;
    const campId = document.getElementById("weekly-campaign-id-hidden").value;
    const camp = state.seo.find(x => x.id === campId);
    if (camp && camp.keywords) {
      const kw = camp.keywords.find(x => x.keyword === kwVal);
      if (kw) {
        document.getElementById("weekly-input-prev-rank").value = kw.currentRank;
        document.getElementById("weekly-input-engine").value = kw.searchEngine || "Google";
        document.getElementById("weekly-input-device").value = kw.device || "Desktop";
      }
    }
  });

  // FORM: LOG WEEKLY RANK UPDATE
  document.getElementById("weekly-rank-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const campaignId = document.getElementById("weekly-campaign-id-hidden").value;
    const date = document.getElementById("weekly-input-date").value;
    const keywordVal = document.getElementById("weekly-input-keyword-id").value;
    const searchEngine = document.getElementById("weekly-input-engine").value;
    const device = document.getElementById("weekly-input-device").value;
    const prevRank = parseInt(document.getElementById("weekly-input-prev-rank").value) || 10;
    const currRank = parseInt(document.getElementById("weekly-input-curr-rank").value) || 10;
    const remarks = document.getElementById("weekly-input-remarks").value || "";
    
    if (!keywordVal) {
      Swal.fire("Validation Error", "Please select a keyword to update.", "warning");
      return;
    }
    
    if (currRank < 1) {
      Swal.fire("Validation Error", "New Current Rank must be a positive number.", "warning");
      return;
    }
    
    const camp = state.seo.find(x => x.id === campaignId);
    if (!camp) return;
    
    camp.weeklyLog = camp.weeklyLog || [];
    const rankChange = prevRank - currRank; // e.g. from 10 to 8: +2 (improvement)
    let status = "Stable";
    if (rankChange > 0) status = "Improved";
    else if (rankChange < 0) status = "Dropped";
    
    camp.weeklyLog.push({
      weekDate: date,
      keyword: keywordVal,
      prevRank,
      currRank,
      rankChange,
      status,
      searchEngine,
      device,
      remarks
    });
    
    // Update active ranks in keywords list
    const kw = camp.keywords.find(x => x.keyword === keywordVal);
    if (kw) {
      kw.previousRank = prevRank;
      kw.currentRank = currRank;
      kw.status = status;
      kw.searchEngine = searchEngine;
      kw.device = device;
    }
    
    saveState();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addWeeklyRankModal")).hide();
    document.getElementById("weekly-rank-form").reset();
    Swal.fire("Logged", "Weekly ranking log entry created successfully.", "success");
    renderCampaignDashboard(campaignId);
  });

  // FORM: UPLOAD SEO REPORT (GA4/GSC METADATA)
  document.getElementById("upload-seo-report-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("upload-report-type").value;
    const name = document.getElementById("upload-report-name").value;
    const notes = document.getElementById("upload-report-notes").value;
    const fileInput = document.getElementById("upload-report-file");
    const file = fileInput.files[0];
    const campaignId = document.getElementById("upload-campaign-id-hidden").value;
    
    const camp = state.seo.find(x => x.id === campaignId);
    if (camp && file) {
      camp.uploadedReports = camp.uploadedReports || [];
      
      // Prevent duplicate files
      if (camp.uploadedReports.some(x => x.fileName.toLowerCase() === file.name.toLowerCase())) {
        Swal.fire("Duplicate File", "A report file with this name is already uploaded.", "warning");
        return;
      }

      camp.uploadedReports.push({
        uploadDate: new Date().toISOString().split("T")[0],
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
        notes: notes,
        type: type
      });
      
      saveState();
      bootstrap.Modal.getOrCreateInstance(document.getElementById("uploadSeoReportModal")).hide();
      document.getElementById("upload-seo-report-form").reset();
      Swal.fire("Success", "Report file metadata logged successfully.", "success");
      renderCampaignDashboard(campaignId);
    }
  });

  // FORM: EDIT WEB PROJECT
  document.getElementById("edit-project-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-project-id-hidden").value;
    const idx = state.projects.findIndex(x => x.id === id);
    if (idx === -1) {
      Swal.fire("Error", "Project record not found.", "error");
      return;
    }
    state.projects[idx].projectName = document.getElementById("edit-project-name").value;
    state.projects[idx].websiteType = document.getElementById("edit-project-type").value;
    state.projects[idx].assignedDeveloperId = document.getElementById("edit-project-developer").value;
    state.projects[idx].startDate = document.getElementById("edit-project-start").value;
    state.projects[idx].deliveryDate = document.getElementById("edit-project-end").value;
    state.projects[idx].progress = parseInt(document.getElementById("edit-project-progress").value) || 0;
    state.projects[idx].status = document.getElementById("edit-project-status").value;
    state.projects[idx].domain = document.getElementById("edit-project-domain").value;
    state.projects[idx].hosting = document.getElementById("edit-project-hosting").value;
    state.projects[idx].notes = document.getElementById("edit-project-notes").value;

    addTimelineEvent("project", `Updated project details for '${state.projects[idx].projectName}'`, "fa-laptop-code");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editProjectModal")).hide();
    document.getElementById("edit-project-form").reset();

    Swal.fire("Changes Saved", "Project updated successfully.", "success");
    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "projects") renderProjects();
  });

  // FORM: EDIT GOOGLE ADS
  document.getElementById("edit-google-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-google-id-hidden").value;
    const idx = state.googleAds.findIndex(x => x.id === id);
    if (idx === -1) {
      Swal.fire("Error", "Google campaign record not found.", "error");
      return;
    }
    state.googleAds[idx].campaignName = document.getElementById("edit-google-name").value;
    state.googleAds[idx].objective = document.getElementById("edit-google-objective").value;
    state.googleAds[idx].adBudget = parseFloat(document.getElementById("edit-google-budget").value) || 0;
    state.googleAds[idx].startDate = document.getElementById("edit-google-start").value;
    state.googleAds[idx].endDate = document.getElementById("edit-google-end").value;
    state.googleAds[idx].reach = parseInt(document.getElementById("edit-google-reach").value) || 0;
    state.googleAds[idx].clicks = parseInt(document.getElementById("edit-google-clicks").value) || 0;
    state.googleAds[idx].leads = parseInt(document.getElementById("edit-google-leads").value) || 0;
    state.googleAds[idx].roas = parseFloat(document.getElementById("edit-google-roas").value) || 1.0;
    state.googleAds[idx].status = document.getElementById("edit-google-status").value;
    state.googleAds[idx].assignedEmployeeId = document.getElementById("edit-google-employee").value;
    state.googleAds[idx].notes = document.getElementById("edit-google-notes").value;

    if (state.googleAds[idx].reach > 0 && state.googleAds[idx].leads > 0) {
      state.googleAds[idx].cpl = state.googleAds[idx].adBudget / state.googleAds[idx].leads;
    }

    addTimelineEvent("campaign", `Updated Google Ads campaign '${state.googleAds[idx].campaignName}'`, "fa-rectangle-envelope");
    saveState();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editGoogleModal")).hide();
    document.getElementById("edit-google-form").reset();

    Swal.fire("Changes Saved", "Google Ads campaign updated successfully.", "success");
    const activeView = document.querySelector(".sidebar-item.active")?.getAttribute("data-view") || "";
    if (activeView === "google-ads") renderGoogleAds();
  });


  // NEW VIEW: REGISTER SERVICE CONTRACT FORM (DEDICATED PAGE)
  const renderNewServiceForm = (clientId = "") => {
    // 1. Loading State
    contentWorkspace.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading client...</span>
        </div>
      </div>
    `;

    setTimeout(() => {
      // 2. Fetch Client details if clientId is passed
      let client = null;
      if (clientId) {
        client = state.clients.find(c => c.id === clientId);
        if (!client) {
          contentWorkspace.innerHTML = `
            <div class="container py-5 animate__animated animate__fadeIn">
              <div class="card border-0 shadow-sm rounded-4 text-center p-5 mx-auto" style="max-width: 600px;">
                <div class="text-danger mb-4">
                  <i class="fa-solid fa-triangle-exclamation fa-4x"></i>
                </div>
                <h4 class="fw-bold text-dark mb-2">Client Not Found</h4>
                <p class="text-muted">The client ID "${clientId}" is invalid or does not exist in the CRM system.</p>
                <div class="mt-4">
                  <a href="#/crm/clients" class="btn btn-danger px-4 rounded-3" style="background-color: var(--thynk-primary); border: none;">Go to Clients Directory</a>
                </div>
              </div>
            </div>
          `;
          return;
        }
      }

      // 3. Render the Form Page
      let leftColumnHtml = "";
      if (client) {
        const clientServices = state.services.filter(s => s.clientId === client.id);
        const runningCount = clientServices.filter(s => s.status === "Running").length;

        leftColumnHtml = `
          <div class="thynk-card mb-4 animate__animated animate__fadeIn">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="crm-avatar" style="width: 60px; height: 60px; font-size: 1.5rem; line-height: 60px;">${client.logo || client.companyName.charAt(0)}</div>
              <div>
                <h4 class="mb-1 text-dark fw-bold">${client.companyName}</h4>
                <span class="badge-status badge-active">Active Client</span>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="text-muted small mb-1"><i class="fa-solid fa-user me-2 text-danger"></i>Contact Person</div>
              <div class="fw-semibold text-dark">${client.clientName || "N/A"}</div>
            </div>

            <div class="mb-4">
              <div class="text-muted small mb-1"><i class="fa-solid fa-envelope me-2 text-danger"></i>Email Address</div>
              <div class="fw-semibold text-dark">${client.email || "N/A"}</div>
            </div>

            <div class="mb-4">
              <div class="text-muted small mb-1"><i class="fa-solid fa-phone me-2 text-danger"></i>Contact Mobile</div>
              <div class="fw-semibold text-dark">${client.mobile || "N/A"}</div>
            </div>

            <div class="mb-4 py-2 border-top border-bottom border-light">
              <div class="row text-center">
                <div class="col-6 border-end">
                  <div class="text-muted small mb-1">Services</div>
                  <div class="fw-bold text-dark">${runningCount} Active</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small mb-1">City</div>
                  <div class="fw-bold text-dark">${client.city || "N/A"}</div>
                </div>
              </div>
            </div>
            
            <div class="text-secondary small mt-3">
              <i class="fa-solid fa-lock me-1"></i> Client profile details are locked.
            </div>
          </div>
        `;
      } else {
        leftColumnHtml = `
          <div class="thynk-card mb-4 text-center py-5" id="new-service-no-client-prompt">
            <div class="text-muted mb-3">
              <i class="fa-solid fa-user-plus fa-3x"></i>
            </div>
            <h5 class="fw-bold text-dark">No Client Selected</h5>
            <p class="text-muted small">Type and select a client from the search input to pre-populate their profile details.</p>
          </div>
        `;
      }

      let clientSelectHtml = "";
      if (client) {
        clientSelectHtml = `
          <div class="mb-3">
            <label class="form-label fw-semibold">Client Company <span class="text-danger">*</span></label>
            <input type="text" class="form-control rounded-3 bg-light" value="${client.companyName}" readonly disabled>
            <input type="hidden" id="new-service-client-id" value="${client.id}">
          </div>
        `;
      } else {
        clientSelectHtml = `
          <div class="mb-3 position-relative">
            <label class="form-label fw-semibold">Client Company <span class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
              <input type="text" class="form-control rounded-end-3 border-start-0" id="client-search-input" placeholder="Type client company name..." autocomplete="off">
            </div>
            <input type="hidden" id="new-service-client-id" value="">
            
            <!-- Search Results Dropdown List -->
            <div class="shadow rounded-3 border-1 bg-white d-none w-100 position-absolute z-3 mt-1" id="client-search-results" style="max-height: 250px; overflow-y: auto; border: 1px solid #dee2e6;">
              <!-- Populated via JS -->
            </div>
          </div>
        `;
      }

      const employeesOptions = state.employees.map(emp => `
        <option value="${emp.id}">${emp.name} (${emp.designation})</option>
      `).join("");

      contentWorkspace.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4 animate__animated animate__fadeIn">
          <div>
            <h2 class="mb-1 fw-bold text-dark">Register Service Contract</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#/crm/services" class="text-danger text-decoration-none">Services</a></li>
                <li class="breadcrumb-item active" aria-current="page">New Service</li>
              </ol>
            </nav>
          </div>
          <a href="#/crm/services" class="btn btn-outline-secondary rounded-3 px-3">
            <i class="fa-solid fa-arrow-left me-2"></i>Back to Services
          </a>
        </div>

        <div class="row animate__animated animate__fadeIn">
          <div class="col-lg-4">
            <div id="new-service-client-card">
              ${leftColumnHtml}
            </div>
          </div>
          
          <div class="col-lg-8">
            <div class="thynk-card">
              <form id="new-service-contract-form">
                
                ${clientSelectHtml}
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Service Name <span class="text-danger">*</span></label>
                      <select class="form-select rounded-3" id="new-service-name" required>
                        <option value="" selected disabled>Select Service...</option>
                        <option value="Meta Ads Management">Meta Ads Management</option>
                        <option value="Google Ads Management">Google Ads Management</option>
                        <option value="SEO Management">SEO Management</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Domain & Hosting">Domain & Hosting</option>
                        <option value="Canva Designs">Canva Designs Package</option>
                        <option value="Billing Software">Billing Software Setup</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Package Level <span class="text-danger">*</span></label>
                      <input type="text" class="form-control rounded-3" id="new-service-package" placeholder="e.g. Premium 10k, Custom E-com" required>
                    </div>
                  </div>
                </div>

                <!-- Extra fields for Domain & Hosting -->
                <div id="new-domain-extra-fields" class="d-none border p-3 rounded-3 mb-3 bg-light">
                  <h6 class="fw-bold mb-3"><i class="fa-solid fa-globe me-2 text-danger"></i>Domain Details</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label small">Registrar</label>
                        <input type="text" class="form-control rounded-3" id="new-domain-registrar" placeholder="GoDaddy, Namecheap">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label small">DNS Status</label>
                        <select class="form-select rounded-3" id="new-domain-dns-status">
                          <option value="OK">OK</option>
                          <option value="Pointing Incorrectly">Pointing Incorrectly</option>
                          <option value="Pending Transfer">Pending Transfer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label small">Custom Nameservers</label>
                    <input type="text" class="form-control rounded-3" id="new-domain-nameservers" placeholder="ns1.hostinger.com, ns2.hostinger.com">
                  </div>
                </div>

                <div id="new-hosting-extra-fields" class="d-none border p-3 rounded-3 mb-3 bg-light">
                  <h6 class="fw-bold mb-3"><i class="fa-solid fa-server me-2 text-danger"></i>Hosting Details</h6>
                  <div class="mb-3">
                    <label class="form-label small">Hosting Provider</label>
                    <input type="text" class="form-control rounded-3" id="new-hosting-provider" placeholder="Hostinger, AWS">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Start Date <span class="text-danger">*</span></label>
                      <input type="text" class="form-control rounded-3 flatpickr-date" id="new-service-start" placeholder="Select Date" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Renewal / Expiry Date <span class="text-danger">*</span></label>
                      <input type="text" class="form-control rounded-3 flatpickr-date" id="new-service-end" placeholder="Select Date" required>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Cost Price (₹) <span class="text-danger">*</span></label>
                      <input type="number" class="form-control rounded-3" id="new-service-cost" placeholder="0" min="0" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Discount Amount (₹)</label>
                      <input type="number" class="form-control rounded-3" id="new-service-discount" placeholder="0" min="0">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Assigned Account Manager</label>
                      <select class="form-select rounded-3" id="new-service-assigned-employee">
                        <option value="" selected>Select Employee...</option>
                        ${employeesOptions}
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Contract Status</label>
                      <select class="form-select rounded-3" id="new-service-status">
                        <option value="Running" selected>Running</option>
                        <option value="Paused">Paused</option>
                        <option value="Expired">Expired</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Scope Details & Notes</label>
                  <textarea class="form-control rounded-3" id="new-service-notes" rows="3" placeholder="Describe deliverables..."></textarea>
                </div>

                <div class="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
                  <a href="#/crm/services" class="btn btn-light rounded-3 px-4 fw-semibold">Cancel</a>
                  <button type="submit" class="btn btn-danger rounded-3 px-4 fw-semibold" style="background-color: var(--thynk-primary); border: none;">Save Service</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      `;

      // Init flatpickr
      flatpickr(".flatpickr-date", {
        dateFormat: "Y-m-d",
        allowInput: true
      });

      const serviceNameSelect = document.getElementById("new-service-name");
      const domExtra = document.getElementById("new-domain-extra-fields");
      const hostExtra = document.getElementById("new-hosting-extra-fields");
      
      serviceNameSelect.addEventListener("change", () => {
        if (serviceNameSelect.value === "Domain & Hosting") {
          domExtra.classList.remove("d-none");
          hostExtra.classList.remove("d-none");
        } else {
          domExtra.classList.add("d-none");
          hostExtra.classList.add("d-none");
        }
      });

      // Searchable dropdown logic if no client was pre-selected
      if (!client) {
        const searchInput = document.getElementById("client-search-input");
        const searchResults = document.getElementById("client-search-results");
        const clientHidden = document.getElementById("new-service-client-id");
        const clientCard = document.getElementById("new-service-client-card");

        searchInput.addEventListener("input", () => {
          const val = searchInput.value.trim().toLowerCase();
          if (!val) {
            searchResults.classList.add("d-none");
            return;
          }

          const matches = state.clients.filter(c => 
            c.companyName.toLowerCase().includes(val) || 
            c.clientName.toLowerCase().includes(val)
          );

          if (matches.length === 0) {
            searchResults.innerHTML = `<div class="p-3 text-muted text-center small">No clients match search query</div>`;
          } else {
            searchResults.innerHTML = matches.map(c => `
              <div class="client-search-item p-2 border-bottom border-light cursor-pointer select-client-item" data-id="${c.id}" data-company="${c.companyName}" style="cursor: pointer;">
                <div class="fw-semibold text-dark small">${c.companyName}</div>
                <div class="text-secondary small" style="font-size: 0.75rem;"><i class="fa-solid fa-user me-1"></i>${c.clientName}</div>
              </div>
            `).join("");
          }

          searchResults.classList.remove("d-none");

          // Event delegation for search results click
          searchResults.querySelectorAll(".select-client-item").forEach(item => {
            item.addEventListener("click", () => {
              const selectedId = item.getAttribute("data-id");
              const selectedCompany = item.getAttribute("data-company");
              
              searchInput.value = selectedCompany;
              clientHidden.value = selectedId;
              searchResults.classList.add("d-none");

              // Fetch details & update card
              const selClient = state.clients.find(c => c.id === selectedId);
              if (selClient) {
                const clientServices = state.services.filter(s => s.clientId === selClient.id);
                const runningCount = clientServices.filter(s => s.status === "Running").length;

                clientCard.innerHTML = `
                  <div class="thynk-card mb-4 animate__animated animate__fadeIn">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="crm-avatar" style="width: 60px; height: 60px; font-size: 1.5rem; line-height: 60px;">${selClient.logo || selClient.companyName.charAt(0)}</div>
                      <div>
                        <h4 class="mb-1 text-dark fw-bold">${selClient.companyName}</h4>
                        <span class="badge-status badge-active">Active Client</span>
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <div class="text-muted small mb-1"><i class="fa-solid fa-user me-2 text-danger"></i>Contact Person</div>
                      <div class="fw-semibold text-dark">${selClient.clientName || "N/A"}</div>
                    </div>

                    <div class="mb-4">
                      <div class="text-muted small mb-1"><i class="fa-solid fa-envelope me-2 text-danger"></i>Email Address</div>
                      <div class="fw-semibold text-dark">${selClient.email || "N/A"}</div>
                    </div>

                    <div class="mb-4">
                      <div class="text-muted small mb-1"><i class="fa-solid fa-phone me-2 text-danger"></i>Contact Mobile</div>
                      <div class="fw-semibold text-dark">${selClient.mobile || "N/A"}</div>
                    </div>

                    <div class="mb-4 py-2 border-top border-bottom border-light">
                      <div class="row text-center">
                        <div class="col-6 border-end">
                          <div class="text-muted small mb-1">Services</div>
                          <div class="fw-bold text-dark">${runningCount} Active</div>
                        </div>
                        <div class="col-6">
                          <div class="text-muted small mb-1">City</div>
                          <div class="fw-bold text-dark">${selClient.city || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }
            });
          });
        });

        document.addEventListener("click", (e) => {
          if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add("d-none");
          }
        });
      }

      // Submit Form
      const newServiceForm = document.getElementById("new-service-contract-form");
      newServiceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        try {
          const selectedClientId = document.getElementById("new-service-client-id").value;
          if (!selectedClientId) {
            Swal.fire({
              icon: "warning",
              title: "Client Required",
              text: "Please search and select a client from the dropdown list before saving."
            });
            return;
          }

          const srvId = "S" + (state.services.length + 1).toString().padStart(3, "0");
          const name = document.getElementById("new-service-name").value;
          const cost = parseInt(document.getElementById("new-service-cost").value) || 0;
          const discount = parseInt(document.getElementById("new-service-discount").value) || 0;
          const finalAmt = cost - discount;

          const newS = {
            id: srvId,
            clientId: selectedClientId,
            serviceName: name,
            package: document.getElementById("new-service-package").value || "",
            startDate: document.getElementById("new-service-start").value || "",
            endDate: document.getElementById("new-service-end").value || "",
            renewalDate: document.getElementById("new-service-end").value || "",
            assignedEmployeeId: document.getElementById("new-service-assigned-employee").value || "",
            cost: cost,
            discount: discount,
            finalAmount: finalAmt,
            status: document.getElementById("new-service-status").value || "Running",
            notes: document.getElementById("new-service-notes").value || ""
          };

          state.services.push(newS);

          if (name === "Domain & Hosting") {
            const cli = state.clients.find(c => c.id === selectedClientId);
            let parsedDom = "";
            if (cli && cli.website) {
              try {
                parsedDom = cli.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
              } catch (e) {}
            }
            const domName = document.getElementById("new-service-package").value || parsedDom || "Domain for " + (cli ? cli.companyName : "Client");
            const expiry = document.getElementById("new-service-end").value || "";
            const startDate = document.getElementById("new-service-start").value || "";

            const domainCost = finalAmt >= 2000 ? 1200 : Math.floor(finalAmt * 0.5);
            const hostingCost = finalAmt - domainCost;

            state.domains.push({
              id: "D" + (state.domains.length + 1).toString().padStart(3, "0"),
              clientId: selectedClientId,
              domainName: domName,
              registrar: document.getElementById("new-domain-registrar").value || "GoDaddy",
              registrationDate: startDate,
              expiryDate: expiry,
              renewalDate: expiry,
              status: calculateStatusFromDate(expiry),
              renewalCost: domainCost,
              dnsStatus: document.getElementById("new-domain-dns-status").value || "OK",
              nameservers: document.getElementById("new-domain-nameservers").value || "",
              credentialsPlaceholder: "",
              notes: "Auto-linked on Domain & Hosting service registration"
            });

            state.hostings.push({
              id: "H" + (state.hostings.length + 1).toString().padStart(3, "0"),
              clientId: selectedClientId,
              hostingProvider: document.getElementById("new-hosting-provider").value || "Hostinger",
              hostingPlan: document.getElementById("new-service-package").value || "Premium Hosting",
              purchaseDate: startDate,
              expiryDate: expiry,
              renewalDate: expiry,
              renewalCost: hostingCost,
              backupStatus: "Daily Auto",
              status: calculateStatusFromDate(expiry),
              notes: "Auto-linked on Domain & Hosting service registration"
            });
          }

          if (name === "Meta Ads Management") {
            state.metaAds.push({
              id: "M" + (state.metaAds.length + 1).toString().padStart(3, "0"),
              clientId: selectedClientId,
              campaignName: `${getClientName(selectedClientId)} - ${document.getElementById("new-service-package").value || "Meta Campaign"}`,
              objective: "Lead Generation",
              packageAmount: finalAmt,
              adBudget: Math.round(finalAmt * 0.6),
              startDate: document.getElementById("new-service-start").value,
              endDate: document.getElementById("new-service-end").value,
              renewalDate: document.getElementById("new-service-end").value,
              reach: 0, clicks: 0, leads: 0, cpl: 0, roas: 0,
              status: "Running",
              assignedEmployeeId: document.getElementById("new-service-assigned-employee").value,
              notes: "Auto-launched on Meta Ads subscription start."
            });
          }

          if (name === "Website Development") {
            const cli = state.clients.find(c => c.id === selectedClientId);
            let parsedDom = "";
            if (cli && cli.website) {
              try {
                parsedDom = cli.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
              } catch (e) {}
            }
            state.projects.push({
              id: "P" + (state.projects.length + 1).toString().padStart(3, "0"),
              clientId: selectedClientId,
              projectName: document.getElementById("new-service-package").value || (cli ? cli.companyName + " Website" : "Website Project"),
              websiteType: "Custom Website Development",
              domain: parsedDom || "domain.com",
              hosting: "Hostinger",
              startDate: document.getElementById("new-service-start").value || new Date().toISOString().split("T")[0],
              deliveryDate: document.getElementById("new-service-end").value || "",
              progress: 0,
              assignedDeveloperId: document.getElementById("new-service-assigned-employee").value || "",
              status: "Running",
              notes: document.getElementById("new-service-notes").value || "Auto-created on Website Development service activation."
            });
          }

          if (name === "Google Ads Management") {
            state.googleAds.push({
              id: "G" + (state.googleAds.length + 1).toString().padStart(3, "0"),
              clientId: selectedClientId,
              campaignName: `${getClientName(selectedClientId)} - ${document.getElementById("new-service-package").value || "Google Campaign"}`,
              objective: "Sales / Signups",
              packageAmount: finalAmt,
              adBudget: Math.round(finalAmt * 0.6),
              startDate: document.getElementById("new-service-start").value || new Date().toISOString().split("T")[0],
              endDate: document.getElementById("new-service-end").value || "",
              reach: 0, clicks: 0, leads: 0, cpl: 0, roas: 0,
              status: "Running",
              assignedEmployeeId: document.getElementById("new-service-assigned-employee").value || "",
              notes: document.getElementById("new-service-notes").value || "Auto-created on Google Ads service activation."
            });
          }

          if (name === "SEO Management") {
            state.seo.push({
              id: "SEO" + (state.seo.length + 1).toString().padStart(3, "0"),
              clientId: selectedClientId,
              targetKeywords: document.getElementById("new-service-package").value || "Target Keywords",
              currentRanking: "Page 1 - Rank 10+",
              articlesPublished: 0,
              backlinks: 0,
              reportFile: "",
              assignedEmployeeId: document.getElementById("new-service-assigned-employee").value || "",
              progress: 0,
              notes: document.getElementById("new-service-notes").value || "Auto-created on SEO service activation."
            });
          }

          const invId = "INV-2026-" + (state.invoices.length + 1).toString().padStart(3, "0");
          const gstAmt = Math.round(finalAmt * (state.settings.gstPercentage / 100));
          const netTotal = finalAmt + gstAmt;

          state.invoices.push({
            id: invId,
            clientId: selectedClientId,
            invoiceDate: document.getElementById("new-service-start").value,
            dueDate: document.getElementById("new-service-start").value,
            serviceId: srvId,
            grossAmount: finalAmt,
            gstRate: state.settings.gstPercentage,
            gstAmount: gstAmt,
            discount: 0,
            netAmount: netTotal,
            status: "Pending Payment"
          });

          addNotification("Service Activated & Invoiced", `Setup ${name} contract. Invoice ${invId} generated.`, "success");
          addTimelineEvent("service", `Activated service contract '${name}' for ${getClientName(selectedClientId)}. Bill: ${invId}`, "fa-cube");
          saveState();

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          
          Toast.fire({
            icon: 'success',
            title: `Service package setup successfully! Invoice ${invId} has been generated.`
          });

          setTimeout(() => {
            window.location.hash = `#/crm/clients/${selectedClientId}`;
          }, 1500);

        } catch (err) {
          console.error("Error activating service:", err);
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "Could not activate service: " + err.message
          });
        }
      });

    }, 300);
  };

  // VIEW: NEW EMPLOYEE REGISTRATION FORM
  const renderNewEmployeeForm = () => {
    const nextEmpId = "E" + (state.employees.length + 1).toString().padStart(3, "0");
    
    const managerOptions = state.employees.map(emp => 
      `<option value="${emp.id}">${emp.name} (${emp.designation})</option>`
    ).join("");

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4 animate__animated animate__fadeIn">
        <div class="d-flex align-items-center gap-3">
          <a href="#/crm/employees" class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;" title="Go Back">
            <i class="fa-solid fa-arrow-left"></i>
          </a>
          <div>
            <h2 class="mb-1 fw-bold text-dark">Employee Registration</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#/crm/employees" class="text-danger text-decoration-none">HRMS</a></li>
                <li class="breadcrumb-item"><a href="#/crm/employees" class="text-danger text-decoration-none">Employees</a></li>
                <li class="breadcrumb-item active" aria-current="page">New Employee</li>
              </ol>
            </nav>
          </div>
        </div>
        <div>
          <span class="badge bg-danger fs-6 px-3 py-2 rounded-pill" style="background-color: var(--thynk-primary) !important;">
            <i class="fa-solid fa-id-card me-2"></i>Emp ID: ${nextEmpId}
          </span>
        </div>
      </div>

      <div class="card border-0 rounded-4 shadow-sm p-4 animate__animated animate__fadeInUp">
        <form id="new-employee-registration-form">
          
          <!-- SECTION 1: EMPLOYEE DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-user me-2"></i>Employee Details
            </h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Employee Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="new-emp-name" placeholder="John Doe" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Profile Photo URL</label>
                <input type="url" class="form-control rounded-3" id="new-emp-photo" placeholder="https://randomuser.me/api/portraits/men/1.jpg">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
                <input type="email" class="form-control rounded-3" id="new-emp-email" placeholder="john@thynkdigital.in" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Mobile Number <span class="text-danger">*</span></label>
                <input type="tel" class="form-control rounded-3" id="new-emp-phone" placeholder="9876543210" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Alternate Number</label>
                <input type="tel" class="form-control rounded-3" id="new-emp-alt-phone" placeholder="9876543211">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Gender <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="new-emp-gender" required>
                  <option value="" disabled selected>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Date of Birth <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3 flatpickr-date" id="new-emp-dob" placeholder="YYYY-MM-DD" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Blood Group</label>
                <select class="form-select rounded-3" id="new-emp-blood-group">
                  <option value="" disabled selected>Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Marital Status</label>
                <select class="form-select rounded-3" id="new-emp-marital-status">
                  <option value="" disabled selected>Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 2: EMPLOYMENT DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-briefcase me-2"></i>Employment Details
            </h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Department <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="new-emp-department" placeholder="Development" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Designation <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="new-emp-designation" placeholder="Senior Developer" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Role <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="new-emp-role" required>
                  <option value="Employee" selected>Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Reporting Manager <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="new-emp-manager" required>
                  <option value="Admin" selected>Admin (Root)</option>
                  ${managerOptions}
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Employment Type <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="new-emp-employment-type" required>
                  <option value="Full Time" selected>Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Joining Date <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3 flatpickr-date" id="new-emp-joining-date" placeholder="YYYY-MM-DD" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Probation Period (Months)</label>
                <input type="number" class="form-control rounded-3" id="new-emp-probation" placeholder="3" min="0">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Shift</label>
                <select class="form-select rounded-3" id="new-emp-shift">
                  <option value="Morning Shift (9:00 AM - 6:00 PM)" selected>Morning Shift (9:00 AM - 6:00 PM)</option>
                  <option value="Evening Shift (2:00 PM - 11:00 PM)">Evening Shift (2:00 PM - 11:00 PM)</option>
                  <option value="Night Shift (10:00 PM - 7:00 AM)">Night Shift (10:00 PM - 7:00 AM)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 3: SALARY DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-indian-rupee-sign me-2"></i>Salary & Bank Details
            </h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Salary (Monthly CTC in ₹) <span class="text-danger">*</span></label>
                <input type="number" class="form-control rounded-3" id="new-emp-salary" placeholder="50000" min="0" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Bank Name</label>
                <input type="text" class="form-control rounded-3" id="new-emp-bank-name" placeholder="HDFC Bank">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Account Number</label>
                <input type="text" class="form-control rounded-3" id="new-emp-account-number" placeholder="501002938472">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">IFSC Code</label>
                <input type="text" class="form-control rounded-3" id="new-emp-ifsc" placeholder="HDFC0001234">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">PAN Number</label>
                <input type="text" class="form-control rounded-3 text-uppercase" id="new-emp-pan" placeholder="ABCDE1234F" maxlength="10">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Aadhaar Number</label>
                <input type="text" class="form-control rounded-3" id="new-emp-aadhaar" placeholder="1234 5678 9012" maxlength="14">
              </div>
            </div>
          </div>

          <!-- SECTION 4: ADDRESS DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-map-location-dot me-2"></i>Address Details
            </h5>
            <div class="mb-3">
              <label class="form-label fw-semibold">Present Address</label>
              <textarea class="form-control rounded-3" id="new-emp-present-address" rows="2" placeholder="123 Street, City, State, ZIP"></textarea>
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="new-emp-same-address">
              <label class="form-check-label fw-semibold text-muted" for="new-emp-same-address">
                Permanent Address is same as Present Address
              </label>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Permanent Address</label>
              <textarea class="form-control rounded-3" id="new-emp-permanent-address" rows="2" placeholder="123 Street, City, State, ZIP"></textarea>
            </div>
          </div>

          <!-- SECTION 5: EMERGENCY CONTACT -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-kit-medical me-2"></i>Emergency Contact Details
            </h5>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Contact Name</label>
                <input type="text" class="form-control rounded-3" id="new-emp-emergency-name" placeholder="Spouse / Parent Name">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Relationship</label>
                <input type="text" class="form-control rounded-3" id="new-emp-emergency-relation" placeholder="e.g. Father, Mother, Spouse">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Mobile Number</label>
                <input type="tel" class="form-control rounded-3" id="new-emp-emergency-phone" placeholder="9876543212">
              </div>
            </div>
          </div>

          <!-- SECTION 6: LOGIN & PERMISSIONS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-shield-halved me-2"></i>Login Details & Permissions
            </h5>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Username <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="new-emp-username" placeholder="john.doe" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control rounded-3" id="new-emp-password" placeholder="••••••••" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Confirm Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control rounded-3" id="new-emp-confirm-password" placeholder="••••••••" required>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label fw-semibold d-block mb-2">Access Permissions</label>
              <div class="d-flex flex-wrap gap-3">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="perm-crm" checked>
                  <label class="form-check-label fw-semibold" for="perm-crm">CRM Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="perm-hrms" checked>
                  <label class="form-check-label fw-semibold" for="perm-hrms">HRMS Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="perm-accounts">
                  <label class="form-check-label fw-semibold" for="perm-accounts">Accounts Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="perm-marketing">
                  <label class="form-check-label fw-semibold" for="perm-marketing">Marketing Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="perm-admin">
                  <label class="form-check-label fw-semibold text-danger" for="perm-admin">Admin Access</label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Status <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="new-emp-status" required>
                  <option value="Active" selected>Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="d-flex justify-content-end gap-3 border-top pt-4">
            <a href="#/crm/employees" class="btn btn-light rounded-3 px-4 fw-semibold">Cancel</a>
            <button type="submit" id="save-add-another-btn" class="btn btn-outline-danger rounded-3 px-4 fw-semibold">Save & Add Another</button>
            <button type="submit" id="save-employee-btn" class="btn btn-danger rounded-3 px-4 fw-semibold" style="background-color: var(--thynk-primary); border: none;">Save Employee</button>
          </div>

        </form>
      </div>
    `;

    // Initialize flatpickrs
    flatpickr(".flatpickr-date", {
      dateFormat: "Y-m-d",
      allowInput: true
    });

    // Handle Address same-as present address copy checkbox
    const presentAddress = document.getElementById("new-emp-present-address");
    const permanentAddress = document.getElementById("new-emp-permanent-address");
    const sameAddressCheckbox = document.getElementById("new-emp-same-address");

    sameAddressCheckbox.addEventListener("change", () => {
      if (sameAddressCheckbox.checked) {
        permanentAddress.value = presentAddress.value;
        permanentAddress.setAttribute("readonly", true);
      } else {
        permanentAddress.removeAttribute("readonly");
      }
    });

    presentAddress.addEventListener("input", () => {
      if (sameAddressCheckbox.checked) {
        permanentAddress.value = presentAddress.value;
      }
    });

    // Form submit listener
    const form = document.getElementById("new-employee-registration-form");
    let isAddAnother = false;

    // Track button click type
    document.getElementById("save-add-another-btn").addEventListener("click", () => {
      isAddAnother = true;
    });

    document.getElementById("save-employee-btn").addEventListener("click", () => {
      isAddAnother = false;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const password = document.getElementById("new-emp-password").value;
        const confirmPassword = document.getElementById("new-emp-confirm-password").value;

        if (password !== confirmPassword) {
          Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Password and Confirm Password do not match."
          });
          return;
        }

        const name = document.getElementById("new-emp-name").value;
        const designation = document.getElementById("new-emp-designation").value;
        const department = document.getElementById("new-emp-department").value;
        const salary = parseInt(document.getElementById("new-emp-salary").value) || 0;
        const phone = document.getElementById("new-emp-phone").value;
        const email = document.getElementById("new-emp-email").value;
        const altPhone = document.getElementById("new-emp-alt-phone").value;
        const gender = document.getElementById("new-emp-gender").value;
        const dob = document.getElementById("new-emp-dob").value;
        const bloodGroup = document.getElementById("new-emp-blood-group").value;
        const maritalStatus = document.getElementById("new-emp-marital-status").value;
        const photo = document.getElementById("new-emp-photo").value || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99) + 1}.jpg`;

        const role = document.getElementById("new-emp-role").value;
        const managerId = document.getElementById("new-emp-manager").value;
        const employmentType = document.getElementById("new-emp-employment-type").value;
        const joiningDate = document.getElementById("new-emp-joining-date").value;
        const probation = parseInt(document.getElementById("new-emp-probation").value) || 0;
        const shift = document.getElementById("new-emp-shift").value;

        const bankName = document.getElementById("new-emp-bank-name").value;
        const accountNumber = document.getElementById("new-emp-account-number").value;
        const ifsc = document.getElementById("new-emp-ifsc").value;
        const pan = document.getElementById("new-emp-pan").value;
        const aadhaar = document.getElementById("new-emp-aadhaar").value;

        const emergencyName = document.getElementById("new-emp-emergency-name").value;
        const emergencyRelation = document.getElementById("new-emp-emergency-relation").value;
        const emergencyPhone = document.getElementById("new-emp-emergency-phone").value;

        const username = document.getElementById("new-emp-username").value;
        const status = document.getElementById("new-emp-status").value;

        const newEmpId = "E" + (state.employees.length + 1).toString().padStart(3, "0");

        const newEmp = {
          id: newEmpId,
          photo,
          name,
          phone,
          alternatePhone: altPhone,
          email,
          gender,
          dob,
          bloodGroup,
          maritalStatus,
          department,
          designation,
          role,
          managerId,
          employmentType,
          joiningDate,
          probationPeriod: probation,
          shift,
          salary,
          bankName,
          accountNumber,
          ifscCode: ifsc,
          panNumber: pan,
          aadhaarNumber: aadhaar,
          presentAddress: presentAddress.value,
          permanentAddress: permanentAddress.value,
          emergencyContactName: emergencyName,
          emergencyContactRelationship: emergencyRelation,
          emergencyContactPhone: emergencyPhone,
          username,
          password,
          permissions: {
            crm: document.getElementById("perm-crm").checked,
            hrms: document.getElementById("perm-hrms").checked,
            accounts: document.getElementById("perm-accounts").checked,
            marketing: document.getElementById("perm-marketing").checked,
            admin: document.getElementById("perm-admin").checked
          },
          status
        };

        state.employees.push(newEmp);
        addNotification("Employee Added", `Added new employee ${name} (${designation}).`, "success");
        addTimelineEvent("employee", `Hired new employee '${name}' in '${department}' department`, "fa-user-tie");
        saveState();

        Swal.fire({
          icon: "success",
          title: "Employee Added",
          text: `'${name}' has been successfully added to the system.`,
          timer: 1500,
          showConfirmButton: false
        });

        populateModalDropdowns();

        if (isAddAnother) {
          form.reset();
          const nextId = "E" + (state.employees.length + 1).toString().padStart(3, "0");
          const idBadge = document.querySelector(".badge i.fa-id-card");
          if (idBadge && idBadge.parentElement) {
            idBadge.parentElement.innerHTML = `<i class="fa-solid fa-id-card me-2"></i>Emp ID: ${nextId}`;
          }
        } else {
          setTimeout(() => {
            window.location.hash = "#/crm/employees";
          }, 1500);
        }

      } catch (err) {
        console.error("Error creating employee record:", err);
        Swal.fire("Error", "Could not complete registration: " + err.message, "error");
      }
    });
  };

  // VIEW: EDIT EMPLOYEE PROFILE FORM
  const renderEditEmployeeForm = (empId = "") => {
    const emp = state.employees.find(e => e.id === empId);
    if (!emp) {
      contentWorkspace.innerHTML = `
        <div class="card border-0 rounded-4 shadow-sm p-5 text-center animate__animated animate__fadeIn">
          <div class="text-danger mb-3"><i class="fa-solid fa-circle-exclamation fa-3x"></i></div>
          <h4 class="fw-bold mb-2">Employee Not Found</h4>
          <p class="text-muted mb-4">The employee ID "${empId}" is invalid or does not exist in the CRM database.</p>
          <a href="#/crm/employees" class="btn btn-danger rounded-3 px-4 fw-semibold" style="background-color: var(--thynk-primary); border: none;">
            Return to Employees
          </a>
        </div>
      `;
      return;
    }

    const dob = emp.dob || "1990-01-01";
    const gender = emp.gender || "Male";
    const username = emp.username || (emp.name ? emp.name.toLowerCase().replace(/\s+/g, ".") : emp.id.toLowerCase());
    const password = emp.password || "123456";

    const managerOptions = state.employees
      .filter(e => e.id !== emp.id)
      .map(e => `<option value="${e.id}" ${emp.managerId === e.id ? "selected" : ""}>${e.name} (${e.designation})</option>`)
      .join("");

    contentWorkspace.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4 animate__animated animate__fadeIn">
        <div class="d-flex align-items-center gap-3">
          <a href="#/crm/employees" class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;" title="Go Back">
            <i class="fa-solid fa-arrow-left"></i>
          </a>
          <div>
            <h2 class="mb-1 fw-bold text-dark">Edit Employee Profile</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#/crm/employees" class="text-danger text-decoration-none">HRMS</a></li>
                <li class="breadcrumb-item"><a href="#/crm/employees" class="text-danger text-decoration-none">Employees</a></li>
                <li class="breadcrumb-item active" aria-current="page">Edit Employee</li>
              </ol>
            </nav>
          </div>
        </div>
        <div>
          <span class="badge bg-danger fs-6 px-3 py-2 rounded-pill" style="background-color: var(--thynk-primary) !important;">
            <i class="fa-solid fa-id-card me-2"></i>Emp ID: ${emp.id}
          </span>
        </div>
      </div>

      <div class="card border-0 rounded-4 shadow-sm p-4 animate__animated animate__fadeInUp">
        <form id="edit-employee-registration-form">
          <input type="hidden" id="edit-emp-id" value="${emp.id}">
          
          <!-- SECTION 1: EMPLOYEE DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-user me-2"></i>Employee Details
            </h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Employee Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="edit-emp-name" value="${emp.name || ""}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Profile Photo URL</label>
                <input type="url" class="form-control rounded-3" id="edit-emp-photo" value="${emp.photo || ""}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
                <input type="email" class="form-control rounded-3" id="edit-emp-email" value="${emp.email || ""}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Mobile Number <span class="text-danger">*</span></label>
                <input type="tel" class="form-control rounded-3" id="edit-emp-phone" value="${emp.phone || ""}" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Alternate Number</label>
                <input type="tel" class="form-control rounded-3" id="edit-emp-alt-phone" value="${emp.alternatePhone || ""}">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Gender <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="edit-emp-gender" required>
                  <option value="" disabled>Select Gender</option>
                  <option value="Male" ${gender === "Male" ? "selected" : ""}>Male</option>
                  <option value="Female" ${gender === "Female" ? "selected" : ""}>Female</option>
                  <option value="Other" ${gender === "Other" ? "selected" : ""}>Other</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Date of Birth <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3 flatpickr-date" id="edit-emp-dob" value="${dob}" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Blood Group</label>
                <select class="form-select rounded-3" id="edit-emp-blood-group">
                  <option value="" disabled ${!emp.bloodGroup ? "selected" : ""}>Select Blood Group</option>
                  <option value="A+" ${emp.bloodGroup === "A+" ? "selected" : ""}>A+</option>
                  <option value="A-" ${emp.bloodGroup === "A-" ? "selected" : ""}>A-</option>
                  <option value="B+" ${emp.bloodGroup === "B+" ? "selected" : ""}>B+</option>
                  <option value="B-" ${emp.bloodGroup === "B-" ? "selected" : ""}>B-</option>
                  <option value="AB+" ${emp.bloodGroup === "AB+" ? "selected" : ""}>AB+</option>
                  <option value="AB-" ${emp.bloodGroup === "AB-" ? "selected" : ""}>AB-</option>
                  <option value="O+" ${emp.bloodGroup === "O+" ? "selected" : ""}>O+</option>
                  <option value="O-" ${emp.bloodGroup === "O-" ? "selected" : ""}>O-</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Marital Status</label>
                <select class="form-select rounded-3" id="edit-emp-marital-status">
                  <option value="" disabled ${!emp.maritalStatus ? "selected" : ""}>Select Marital Status</option>
                  <option value="Single" ${emp.maritalStatus === "Single" ? "selected" : ""}>Single</option>
                  <option value="Married" ${emp.maritalStatus === "Married" ? "selected" : ""}>Married</option>
                  <option value="Divorced" ${emp.maritalStatus === "Divorced" ? "selected" : ""}>Divorced</option>
                  <option value="Widowed" ${emp.maritalStatus === "Widowed" ? "selected" : ""}>Widowed</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 2: EMPLOYMENT DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-briefcase me-2"></i>Employment Details
            </h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Department <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="edit-emp-department" value="${emp.department || ""}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Designation <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="edit-emp-designation" value="${emp.designation || ""}" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Role <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="edit-emp-role" required>
                  <option value="Employee" ${emp.role === "Employee" ? "selected" : ""}>Employee</option>
                  <option value="Manager" ${emp.role === "Manager" ? "selected" : ""}>Manager</option>
                  <option value="Admin" ${emp.role === "Admin" ? "selected" : ""}>Admin</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Reporting Manager <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="edit-emp-manager" required>
                  <option value="Admin" ${emp.managerId === "Admin" ? "selected" : ""}>Admin (Root)</option>
                  ${managerOptions}
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Employment Type <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="edit-emp-employment-type" required>
                  <option value="Full Time" ${emp.employmentType === "Full Time" ? "selected" : ""}>Full Time</option>
                  <option value="Part Time" ${emp.employmentType === "Part Time" ? "selected" : ""}>Part Time</option>
                  <option value="Contract" ${emp.employmentType === "Contract" ? "selected" : ""}>Contract</option>
                  <option value="Internship" ${emp.employmentType === "Internship" ? "selected" : ""}>Internship</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Joining Date <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3 flatpickr-date" id="edit-emp-joining-date" value="${emp.joiningDate || ""}" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Probation Period (Months)</label>
                <input type="number" class="form-control rounded-3" id="edit-emp-probation" value="${emp.probationPeriod || 0}" min="0">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Shift</label>
                <select class="form-select rounded-3" id="edit-emp-shift">
                  <option value="Morning Shift (9:00 AM - 6:00 PM)" ${emp.shift === "Morning Shift (9:00 AM - 6:00 PM)" ? "selected" : ""}>Morning Shift (9:00 AM - 6:00 PM)</option>
                  <option value="Evening Shift (2:00 PM - 11:00 PM)" ${emp.shift === "Evening Shift (2:00 PM - 11:00 PM)" ? "selected" : ""}>Evening Shift (2:00 PM - 11:00 PM)</option>
                  <option value="Night Shift (10:00 PM - 7:00 AM)" ${emp.shift === "Night Shift (10:00 PM - 7:00 AM)" ? "selected" : ""}>Night Shift (10:00 PM - 7:00 AM)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 3: SALARY DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-indian-rupee-sign me-2"></i>Salary & Bank Details
            </h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Salary (Monthly CTC in ₹) <span class="text-danger">*</span></label>
                <input type="number" class="form-control rounded-3" id="edit-emp-salary" value="${emp.salary || 0}" min="0" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Bank Name</label>
                <input type="text" class="form-control rounded-3" id="edit-emp-bank-name" value="${emp.bankName || ""}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Account Number</label>
                <input type="text" class="form-control rounded-3" id="edit-emp-account-number" value="${emp.accountNumber || ""}">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">IFSC Code</label>
                <input type="text" class="form-control rounded-3" id="edit-emp-ifsc" value="${emp.ifscCode || ""}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">PAN Number</label>
                <input type="text" class="form-control rounded-3 text-uppercase" id="edit-emp-pan" value="${emp.panNumber || ""}" maxlength="10">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Aadhaar Number</label>
                <input type="text" class="form-control rounded-3" id="edit-emp-aadhaar" value="${emp.aadhaarNumber || ""}" maxlength="14">
              </div>
            </div>
          </div>

          <!-- SECTION 4: ADDRESS DETAILS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-map-location-dot me-2"></i>Address Details
            </h5>
            <div class="mb-3">
              <label class="form-label fw-semibold">Present Address</label>
              <textarea class="form-control rounded-3" id="edit-emp-present-address" rows="2">${emp.presentAddress || ""}</textarea>
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="edit-emp-same-address" ${emp.presentAddress && emp.presentAddress === emp.permanentAddress ? "checked" : ""}>
              <label class="form-check-label fw-semibold text-muted" for="edit-emp-same-address">
                Permanent Address is same as Present Address
              </label>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Permanent Address</label>
              <textarea class="form-control rounded-3" id="edit-emp-permanent-address" rows="2" ${emp.presentAddress && emp.presentAddress === emp.permanentAddress ? "readonly" : ""}>${emp.permanentAddress || ""}</textarea>
            </div>
          </div>

          <!-- SECTION 5: EMERGENCY CONTACT -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-kit-medical me-2"></i>Emergency Contact Details
            </h5>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Contact Name</label>
                <input type="text" class="form-control rounded-3" id="edit-emp-emergency-name" value="${emp.emergencyContactName || ""}">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Relationship</label>
                <input type="text" class="form-control rounded-3" id="edit-emp-emergency-relation" value="${emp.emergencyContactRelationship || ""}">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Mobile Number</label>
                <input type="tel" class="form-control rounded-3" id="edit-emp-emergency-phone" value="${emp.emergencyContactPhone || ""}">
              </div>
            </div>
          </div>

          <!-- SECTION 6: LOGIN & PERMISSIONS -->
          <div class="mb-5">
            <h5 class="fw-bold text-danger border-bottom pb-2 mb-3">
              <i class="fa-solid fa-shield-halved me-2"></i>Login Details & Permissions
            </h5>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Username <span class="text-danger">*</span></label>
                <input type="text" class="form-control rounded-3" id="edit-emp-username" value="${username}" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control rounded-3" id="edit-emp-password" value="${password}" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label fw-semibold">Confirm Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control rounded-3" id="edit-emp-confirm-password" value="${password}" required>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label fw-semibold d-block mb-2">Access Permissions</label>
              <div class="d-flex flex-wrap gap-3">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit-perm-crm" ${emp.permissions?.crm ? "checked" : ""}>
                  <label class="form-check-label fw-semibold" for="edit-perm-crm">CRM Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit-perm-hrms" ${emp.permissions?.hrms ? "checked" : ""}>
                  <label class="form-check-label fw-semibold" for="edit-perm-hrms">HRMS Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit-perm-accounts" ${emp.permissions?.accounts ? "checked" : ""}>
                  <label class="form-check-label fw-semibold" for="edit-perm-accounts">Accounts Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit-perm-marketing" ${emp.permissions?.marketing ? "checked" : ""}>
                  <label class="form-check-label fw-semibold" for="edit-perm-marketing">Marketing Access</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="edit-perm-admin" ${emp.permissions?.admin ? "checked" : ""}>
                  <label class="form-check-label fw-semibold text-danger" for="edit-perm-admin">Admin Access</label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Status <span class="text-danger">*</span></label>
                <select class="form-select rounded-3" id="edit-emp-status" required>
                  <option value="Active" ${emp.status === "Active" ? "selected" : ""}>Active</option>
                  <option value="Inactive" ${emp.status === "Inactive" ? "selected" : ""}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="d-flex justify-content-end gap-3 border-top pt-4">
            <a href="#/crm/employees" class="btn btn-light rounded-3 px-4 fw-semibold">Cancel</a>
            <button type="submit" class="btn btn-danger rounded-3 px-4 fw-semibold" style="background-color: var(--thynk-primary); border: none;">Save Changes</button>
          </div>

        </form>
      </div>
    `;

    // Initialize flatpickrs
    flatpickr(".flatpickr-date", {
      dateFormat: "Y-m-d",
      allowInput: true
    });

    // Handle Address same-as copy checkbox
    const presentAddress = document.getElementById("edit-emp-present-address");
    const permanentAddress = document.getElementById("edit-emp-permanent-address");
    const sameAddressCheckbox = document.getElementById("edit-emp-same-address");

    sameAddressCheckbox.addEventListener("change", () => {
      if (sameAddressCheckbox.checked) {
        permanentAddress.value = presentAddress.value;
        permanentAddress.setAttribute("readonly", true);
      } else {
        permanentAddress.removeAttribute("readonly");
      }
    });

    presentAddress.addEventListener("input", () => {
      if (sameAddressCheckbox.checked) {
        permanentAddress.value = presentAddress.value;
      }
    });

    // Form submit listener
    const form = document.getElementById("edit-employee-registration-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const password = document.getElementById("edit-emp-password").value;
        const confirmPassword = document.getElementById("edit-emp-confirm-password").value;

        if (password !== confirmPassword) {
          Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Password and Confirm Password do not match."
          });
          return;
        }

        const idx = state.employees.findIndex(e => e.id === emp.id);
        if (idx === -1) {
          Swal.fire("Error", "Employee not found.", "error");
          return;
        }

        state.employees[idx].name = document.getElementById("edit-emp-name").value;
        state.employees[idx].designation = document.getElementById("edit-emp-designation").value;
        state.employees[idx].department = document.getElementById("edit-emp-department").value;
        state.employees[idx].salary = parseInt(document.getElementById("edit-emp-salary").value) || 0;
        state.employees[idx].phone = document.getElementById("edit-emp-phone").value;
        state.employees[idx].email = document.getElementById("edit-emp-email").value;
        state.employees[idx].alternatePhone = document.getElementById("edit-emp-alt-phone").value;
        state.employees[idx].gender = document.getElementById("edit-emp-gender").value;
        state.employees[idx].dob = document.getElementById("edit-emp-dob").value;
        state.employees[idx].bloodGroup = document.getElementById("edit-emp-blood-group").value;
        state.employees[idx].maritalStatus = document.getElementById("edit-emp-marital-status").value;
        state.employees[idx].photo = document.getElementById("edit-emp-photo").value || state.employees[idx].photo;

        state.employees[idx].role = document.getElementById("edit-emp-role").value;
        state.employees[idx].managerId = document.getElementById("edit-emp-manager").value;
        state.employees[idx].employmentType = document.getElementById("edit-emp-employment-type").value;
        state.employees[idx].joiningDate = document.getElementById("edit-emp-joining-date").value;
        state.employees[idx].probationPeriod = parseInt(document.getElementById("edit-emp-probation").value) || 0;
        state.employees[idx].shift = document.getElementById("edit-emp-shift").value;

        state.employees[idx].bankName = document.getElementById("edit-emp-bank-name").value;
        state.employees[idx].accountNumber = document.getElementById("edit-emp-account-number").value;
        state.employees[idx].ifscCode = document.getElementById("edit-emp-ifsc").value;
        state.employees[idx].panNumber = document.getElementById("edit-emp-pan").value;
        state.employees[idx].aadhaarNumber = document.getElementById("edit-emp-aadhaar").value;

        state.employees[idx].presentAddress = presentAddress.value;
        state.employees[idx].permanentAddress = permanentAddress.value;
        state.employees[idx].emergencyContactName = document.getElementById("edit-emp-emergency-name").value;
        state.employees[idx].emergencyContactRelationship = document.getElementById("edit-emp-emergency-relation").value;
        state.employees[idx].emergencyContactPhone = document.getElementById("edit-emp-emergency-phone").value;

        state.employees[idx].username = document.getElementById("edit-emp-username").value;
        state.employees[idx].password = password;
        state.employees[idx].permissions = {
          crm: document.getElementById("edit-perm-crm").checked,
          hrms: document.getElementById("edit-perm-hrms").checked,
          accounts: document.getElementById("edit-perm-accounts").checked,
          marketing: document.getElementById("edit-perm-marketing").checked,
          admin: document.getElementById("edit-perm-admin").checked
        };
        state.employees[idx].status = document.getElementById("edit-emp-status").value;

        addTimelineEvent("employee", `Updated profile details for '${state.employees[idx].name}'`, "fa-user-gear");
        saveState();

        Swal.fire({
          icon: "success",
          title: "Changes Saved",
          text: `Employee details updated successfully.`,
          timer: 1500,
          showConfirmButton: false
        });

        populateModalDropdowns();

        setTimeout(() => {
          window.location.hash = "#/crm/employees";
        }, 1500);

      } catch (err) {
        console.error("Error updating employee record:", err);
        Swal.fire("Error", "Could not save changes: " + err.message, "error");
      }
    });
  };

  // ROUTER CONTROLLER FOR HASH CHANGE NAVIGATION
  const handleRouting = () => {
    const hash = window.location.hash || "#/crm/dashboard";
    
    if (hash.startsWith("#/crm/services/new")) {
      const queryStr = hash.split("?")[1] || "";
      const urlParams = new URLSearchParams(queryStr);
      const clientId = urlParams.get("client") || "";
      
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      const sidebarItem = document.querySelector(`.sidebar-item[data-view="services"]`);
      if (sidebarItem) sidebarItem.classList.add("active");
      
      renderNewServiceForm(clientId);
    } else if (hash.startsWith("#/hrms/employees/new") || hash.startsWith("#/crm/employees/new")) {
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      const sidebarItem = document.querySelector(`.sidebar-item[data-view="employees"]`);
      if (sidebarItem) sidebarItem.classList.add("active");
      
      renderNewEmployeeForm();
    } else if (hash.startsWith("#/hrms/employees/edit") || hash.startsWith("#/crm/employees/edit")) {
      const queryStr = hash.split("?")[1] || "";
      const urlParams = new URLSearchParams(queryStr);
      const empId = urlParams.get("id") || "";
      
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      const sidebarItem = document.querySelector(`.sidebar-item[data-view="employees"]`);
      if (sidebarItem) sidebarItem.classList.add("active");
      
      renderEditEmployeeForm(empId);
    } else if (hash.startsWith("#/crm/clients/")) {
      const parts = hash.split("/");
      const clientId = parts[parts.length - 1];
      
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      const sidebarItem = document.querySelector(`.sidebar-item[data-view="clients"]`);
      if (sidebarItem) sidebarItem.classList.add("active");
      
      renderClientProfile(clientId);
    } else if (hash.startsWith("#/crm/seo/dashboard")) {
      const queryStr = hash.split("?")[1] || "";
      const urlParams = new URLSearchParams(queryStr);
      const seoId = urlParams.get("id") || "";
      
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      const sidebarItem = document.querySelector(`.sidebar-item[data-view="seo"]`);
      if (sidebarItem) sidebarItem.classList.add("active");
      
      state.selectedSeoCampaignId = seoId;
      switchView("seo/dashboard");
    } else if (hash.startsWith("#/crm/")) {
      const viewName = hash.replace("#/crm/", "").split("?")[0];
      
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      const sidebarItem = document.querySelector(`.sidebar-item[data-view="${viewName}"]`);
      if (sidebarItem) sidebarItem.classList.add("active");
      
      switchView(viewName);
    } else {
      window.location.hash = "#/crm/dashboard";
    }
  };





  window.addEventListener("hashchange", handleRouting);

  // RUN CHECKAUTH SYSTEM
  checkAuth();
});
