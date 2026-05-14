import { useEffect, useMemo, useRef, useState } from "react";

/* ───────── ICONS ───────── */

const ICON_PATHS = {
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/></>,
  cloud:     <path d="M17.5 19a4.5 4.5 0 100-9h-1.26A8 8 0 104 16.5"/>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
  wrench:    <path d="M14.7 6.3a4 4 0 005.66 5.66l-9.36 9.36a2 2 0 01-2.83-2.83l9.36-9.36a4 4 0 01-2.83-2.83z"/>,
  folder:    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>,
  chart:     <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
  globe:     <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
  home:      <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  building:  <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/></>,
  lock:      <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
  link:      <><path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07L11.17 5"/><path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07L12.83 19"/></>,
  satellite: <><path d="M14.83 5.17a4 4 0 00-5.66 5.66l-3 3a4 4 0 005.66 5.66"/><path d="M2 22l5-5"/><circle cx="18" cy="6" r="3"/></>,
  plug:      <><path d="M9 2v6M15 2v6"/><path d="M5 8h14v2a5 5 0 01-5 5h-4a5 5 0 01-5-5z"/><path d="M12 15v7"/></>,
  shield:    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6z"/>,
  network:   <><circle cx="12" cy="12" r="2"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l4.3 3.3M17.7 10.3L14 7M6 17l4.3-3.3M17.7 13.7L14 17"/></>,
  key:       <><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2"/><path d="M16 7l3 3"/><path d="M18 5l3 3"/></>,
  cog:       <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8L4.2 6a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V2a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
  stethoscope: <><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 0012 0V4a2 2 0 00-2-2h-1a.2.2 0 100 .3"/><path d="M8 15a6 6 0 006 6 4 4 0 004-4v-4"/><circle cx="20" cy="10" r="2"/></>,
  clipboard: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/></>,
  check:     <polyline points="20 6 9 17 4 12"/>,
  download:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  restart:   <><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 102.13-9.36L1 10"/></>,
  arrowRight:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  chevronDown: <polyline points="6 9 12 15 18 9"/>,
  fileText:    <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>,
  github:    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>,
  flow:      <><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M8.5 18h7M6 8.5v7M18 8.5v7"/></>,
};

function Icon({ name, size = 16, strokeWidth = 1.75, className }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {path}
    </svg>
  );
}

/* ───────── CONNECTOR DEFINITIONS ───────── */

const CONNECTORS = {
  sql_server: {
    label: "SQL Server",
    icon: "database",
    status: "GA",
    defaultPorts: ["1433"],
    authMethods: ["SQL Auth", "Entra ID (AAD)", "OAuth M2M"],
    supportsPrivateLink: true,
    category: "Database",
    cdcMethod: "Change Tracking / CDC",
    minVersion: "2012 (CT), 2012 SP1 CU3 (CDC)",
    platforms: "Azure SQL, Azure SQL MI, Amazon RDS, EC2, On-Premises",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/sql-server",
  },
  postgresql: {
    label: "PostgreSQL",
    icon: "database",
    status: "Public Preview",
    defaultPorts: ["5432"],
    authMethods: ["Database Auth", "Entra ID (AAD)"],
    supportsPrivateLink: true,
    category: "Database",
    cdcMethod: "Logical Replication",
    minVersion: "13+",
    platforms: "Azure DB for PostgreSQL, AWS RDS, Aurora, EC2, GCP Cloud SQL, On-Premises",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/postgresql",
  },
  mysql: {
    label: "MySQL",
    icon: "database",
    status: "Public Preview",
    defaultPorts: ["3306"],
    authMethods: ["Database Auth"],
    supportsPrivateLink: true,
    category: "Database",
    cdcMethod: "Binary Log (binlog) Replication",
    minVersion: "5.7.44+ (RDS), 8.0+ (self-hosted)",
    platforms: "Amazon RDS, Aurora MySQL, Azure DB for MySQL, GCP Cloud SQL, EC2",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/mysql",
  },
  salesforce: {
    label: "Salesforce",
    icon: "cloud",
    status: "GA",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "salesforce.com",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/salesforce",
  },
  workday: {
    label: "Workday",
    icon: "briefcase",
    status: "GA",
    defaultPorts: ["443"],
    authMethods: ["ISU Credentials", "OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "workday.com tenants",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/workday-reports",
  },
  servicenow: {
    label: "ServiceNow",
    icon: "wrench",
    status: "GA",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0", "Basic Auth"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "service-now.com instances",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/servicenow",
  },
  sharepoint: {
    label: "SharePoint",
    icon: "folder",
    status: "Public Preview",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0 (App Registration)"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "Microsoft 365 / SharePoint Online",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/sharepoint",
  },
  google_analytics: {
    label: "Google Analytics 4",
    icon: "chart",
    status: "Public Preview",
    defaultPorts: ["443"],
    authMethods: ["Service Account Key"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "analytics.google.com (GA4)",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/google-analytics",
  },
  workday_hcm: {
    label: "Workday HCM",
    icon: "briefcase",
    status: "Public Preview",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "workday.com tenants (HCM module)",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/workday-hcm-overview",
  },
  hubspot: {
    label: "HubSpot",
    icon: "briefcase",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth U2M"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "hubspot.com",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/hubspot-overview",
  },
  jira: {
    label: "Jira",
    icon: "wrench",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "Atlassian Jira (Cloud + on-prem)",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/jira-source-setup",
  },
  confluence: {
    label: "Confluence",
    icon: "folder",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "Atlassian Confluence (Cloud + on-prem)",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/confluence-source-setup",
  },
  netsuite: {
    label: "NetSuite",
    icon: "briefcase",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0", "Token-Based Auth"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "Oracle NetSuite",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/netsuite-source-setup",
  },
  dynamics_365: {
    label: "Microsoft Dynamics 365",
    icon: "briefcase",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0 (Entra ID)"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "Dynamics 365 (via Azure Synapse Link)",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/d365-source-setup",
  },
  zendesk: {
    label: "Zendesk Support",
    icon: "wrench",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0", "API Token"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "zendesk.com",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/zendesk-support-overview",
  },
  google_ads: {
    label: "Google Ads",
    icon: "chart",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "ads.google.com",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/google-ads-overview",
  },
  meta_ads: {
    label: "Meta Ads",
    icon: "chart",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "Facebook / Instagram Ads",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/meta-ads",
  },
  tiktok_ads: {
    label: "TikTok Ads",
    icon: "chart",
    status: "Beta",
    defaultPorts: ["443"],
    authMethods: ["OAuth 2.0"],
    supportsPrivateLink: false,
    category: "SaaS",
    platforms: "ads.tiktok.com",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/tiktok-ads-overview",
  },
  zerobus: {
    label: "Zerobus (gRPC)",
    icon: "satellite",
    status: "Private Preview",
    defaultPorts: ["443"],
    authMethods: ["Service Principal (Entra ID / OAuth M2M)"],
    supportsPrivateLink: true,
    category: "Streaming",
    cdcMethod: "Push-based gRPC stream → Delta",
    platforms: "Your own producer (Python / Java / Go / TS / Rust SDK)",
    docsUrl: "https://docs.databricks.com/aws/en/ingestion/zerobus",
  },
  github_community: {
    label: "GitHub",
    icon: "github",
    status: "Community",
    defaultPorts: ["443"],
    authMethods: ["Personal Access Token", "GitHub App"],
    supportsPrivateLink: false,
    category: "Community",
    platforms: "github.com / GitHub Enterprise",
    docsUrl: "https://github.com/databrickslabs/lakeflow-community-connectors",
  },
  stripe_community: {
    label: "Stripe",
    icon: "cloud",
    status: "Community",
    defaultPorts: ["443"],
    authMethods: ["API Key"],
    supportsPrivateLink: false,
    category: "Community",
    platforms: "stripe.com",
    docsUrl: "https://github.com/databrickslabs/lakeflow-community-connectors",
  },
};

const CONNECTOR_CATEGORIES = [
  {
    id: "Database",
    label: "Database (CDC)",
    icon: "database",
    desc: "Stream changes from operational databases via change data capture.",
  },
  {
    id: "SaaS",
    label: "SaaS application",
    icon: "cloud",
    desc: "Pull from cloud SaaS products — CRM, ITSM, HR, ads, helpdesk.",
  },
  {
    id: "Streaming",
    label: "Streaming / standard",
    icon: "satellite",
    desc: "Push events directly into Delta via Zerobus gRPC or other low-level SDKs.",
  },
  {
    id: "Community",
    label: "Community",
    icon: "github",
    desc: "Open-source connectors built and maintained by the community.",
  },
];

const CLOUDS = [
  { id: "aws",   label: "AWS",   hint: "Amazon Web Services workspace" },
  { id: "azure", label: "Azure", hint: "Microsoft Azure workspace" },
  { id: "gcp",   label: "GCP",   hint: "Google Cloud Platform workspace" },
];

const SOURCE_LOCATIONS = [
  { id: "same_cloud", label: "Same cloud as Databricks workspace", icon: "home", desc: "Source lives in the same cloud provider as your workspace." },
  { id: "different_cloud", label: "Different cloud provider", icon: "cloud", desc: "Source is hosted in a different cloud (e.g. AWS source, Azure workspace)." },
  { id: "on_prem", label: "On-premises data center", icon: "building", desc: "Source is on-prem and reachable via VPN, ExpressRoute, or Direct Connect." },
  { id: "saas", label: "SaaS / internet-hosted", icon: "globe", desc: "Auto-detected for SaaS connectors. Connectivity uses HTTPS over the public internet." },
];

const NETWORK_MODELS = {
  private_link: {
    label: "Private Link / Private Endpoint",
    icon: "lock",
    desc: "Fully private connectivity using a Private Endpoint to the source service.",
  },
  vnet_peering: {
    label: "VNet / VPC Peering",
    icon: "link",
    desc: "Direct network peering between your Databricks VNet/VPC and the source network.",
  },
  public_with_ip_acl: {
    label: "Public Endpoint + IP ACL",
    icon: "globe",
    desc: "Public connectivity restricted by source-side IP allowlists for Databricks egress IPs.",
  },
  transit_gateway: {
    label: "Transit Gateway / Hub-Spoke",
    icon: "satellite",
    desc: "Routed through a transit hub or hub-and-spoke topology.",
  },
  vpn_expressroute: {
    label: "VPN / ExpressRoute / Direct Connect",
    icon: "plug",
    desc: "Hybrid connectivity from cloud to on-premises data center.",
  },
  cross_cloud_vpn: {
    label: "Cross-Cloud Site-to-Site VPN",
    icon: "shield",
    desc: "IPsec VPN tunnel between two cloud providers.",
  },
  cross_cloud_interconnect: {
    label: "Cross-Cloud via Interconnect Provider",
    icon: "network",
    desc: "Dedicated circuits via an interconnect partner (Equinix, Megaport, etc).",
  },
};

/* ───────── HELPERS ───────── */

// Cloud where the source is hosted, derived from selections.
//   same_cloud      → workspace cloud
//   different_cloud → "other" (we don't know which of the other 2)
//   on_prem         → "onprem"
//   saas            → "saas"
function sourceCloud(state) {
  if (!state.sourceLocation) return null;
  if (state.sourceLocation === "same_cloud") return state.cloud;
  if (state.sourceLocation === "on_prem") return "onprem";
  if (state.sourceLocation === "saas") return "saas";
  return "other";
}

/* ───────── CHECKLIST GENERATORS ───────── */

function generateChecklist(state) {
  const conn = CONNECTORS[state.connector];
  if (!conn) return [];
  return [
    { category: "Identity & Credentials", icon: "key", checks: genIdentity(state, conn) },
    { category: "Network & Connectivity", icon: "network", checks: genNetwork(state, conn) },
    { category: "Databricks Workspace Configuration", icon: "cog", checks: genWorkspace(state, conn) },
    { category: "Source System Preparation", icon: "database", checks: genSource(state, conn) },
  ];
}

function genIdentity(state, conn) {
  const checks = [];
  const auth = state.authMethod || conn.authMethods[0];

  if (auth === "OAuth 2.0") {
    checks.push({ text: `Register an OAuth 2.0 application for ${conn.label} with the right scopes`, priority: "high" });
    checks.push({ text: "Store OAuth client ID and secret in a Databricks Secret Scope", priority: "high" });
  }
  if (auth === "OAuth M2M") {
    checks.push({ text: "Register an Entra ID App Registration for machine-to-machine (client credentials) auth", priority: "high" });
  }
  if (auth.includes("Entra") || auth.includes("AAD")) {
    checks.push({ text: "Create an Entra ID (AAD) App Registration with required permissions on the source", priority: "high" });
  }
  if (auth === "SQL Auth" || auth === "Database Auth") {
    checks.push({ text: `Create a dedicated database service account for Databricks ingestion`, priority: "high", detail: "Grant only the minimum permissions needed for replication / CDC." });
    checks.push({
      text: "Store database credentials in a Databricks Secret Scope",
      priority: "high",
      code: { lang: "bash", body: "# Create a scope\ndatabricks secrets create-scope lakeflow-ingest\n\n# Add username + password\ndatabricks secrets put-secret lakeflow-ingest src_user\ndatabricks secrets put-secret lakeflow-ingest src_password\n\n# Grant the workspace service principal READ on the scope\ndatabricks secrets put-acl lakeflow-ingest \\\n  <pipeline-service-principal-id> READ" },
    });
  }
  if (auth === "ISU Credentials") {
    checks.push({ text: "Create a Workday Integration System User (ISU) with the required Integration System Security Group", priority: "high" });
  }
  if (auth === "Service Account Key") {
    checks.push({ text: "Create a GCP Service Account with Analytics Viewer permission and download the JSON key", priority: "high" });
  }
  if (auth === "OAuth 2.0 (App Registration)") {
    checks.push({ text: "Register an Entra ID App with Microsoft Graph Sites.Read.All / Sites.Selected permission", priority: "high" });
  }

  checks.push({ text: "Document credential rotation schedule and ownership", priority: "medium" });
  return checks;
}

function genNetwork(state, conn) {
  const checks = [];
  const net = state.networkModel;
  const cloud = state.cloud;
  const srcLoc = state.sourceLocation;

  // ── Cross-cloud
  if (srcLoc === "different_cloud") {
    if (net === "cross_cloud_vpn") {
      checks.push({ text: "Provision a Site-to-Site VPN tunnel between the two clouds", priority: "blocker" });
      checks.push({ text: "Configure BGP or static routes for cross-cloud address space", priority: "high" });
      checks.push({ text: "Verify non-overlapping CIDR ranges between the two cloud networks", priority: "blocker" });
      checks.push({ text: "Confirm IPsec tunnel is UP on both sides", priority: "high" });
    }
    if (net === "cross_cloud_interconnect") {
      checks.push({ text: "Provision dedicated circuits to a common interconnect provider", priority: "blocker" });
      checks.push({ text: "Configure BGP route exchange between both cloud circuits", priority: "high" });
      if (cloud === "azure") {
        checks.push({ text: "Enable Azure ExpressRoute FastPath on the workspace circuit", priority: "medium" });
      }
    }
  }

  // ── Same-cloud Private Link
  if (net === "private_link" && srcLoc !== "different_cloud") {
    if (!conn.supportsPrivateLink && conn.category === "SaaS") {
      checks.push({ text: `${conn.label} is a SaaS service — connectivity uses HTTPS over the public internet, not Private Link`, priority: "info" });
    } else {
      checks.push({ text: "Create a Private Endpoint targeting the source database service", priority: "blocker" });
      checks.push({ text: "Configure Private DNS zone for endpoint hostname resolution", priority: "high" });
      checks.push({ text: "Verify the Private Endpoint connection status is 'Approved'", priority: "high" });
    }
  }

  // ── VNet / VPC peering
  if (net === "vnet_peering") {
    checks.push({ text: "Establish bidirectional VNet/VPC peering between Databricks and the source network", priority: "blocker" });
    checks.push({ text: "Update route tables to allow traffic between peered networks", priority: "high" });
  }

  // ── Public + IP ACL
  if (net === "public_with_ip_acl") {
    {
      const egress = {
        aws: "# AWS — NAT gateway public IPs of the workspace VPC\naws ec2 describe-nat-gateways \\\n  --filter Name=vpc-id,Values=<workspace-vpc-id> \\\n  --query 'NatGateways[].NatGatewayAddresses[].PublicIp'",
        azure: "# Azure — workspace NAT gateway public IP(s)\naz network nat gateway show \\\n  -g <rg> -n <nat-gw-name> \\\n  --query 'publicIpAddresses[].id'\n\n# Or if using a Public IP Prefix:\naz network public-ip prefix show \\\n  -g <rg> -n <prefix> --query 'ipPrefix'",
        gcp: "# GCP — Cloud NAT external IP addresses\ngcloud compute routers nats describe <nat-name> \\\n  --router=<router> --region=<region> \\\n  --format='value(natIps)'",
      };
      checks.push({
        text: "Identify Databricks egress IPs (NAT gateway or serverless egress)",
        priority: "blocker",
        detail: `For classic compute: NAT gateway IPs of your workspace ${cloud === "azure" ? "VNet" : "VPC"}. For serverless: published per-region — see Databricks docs "Serverless egress IPs".`,
        code: { lang: "bash", body: egress[cloud] || "# Select a workspace cloud first." },
      });
    }
    checks.push({ text: `Add all Databricks egress IPs to ${conn.label} firewall / IP allowlist`, priority: "blocker" });
  }

  // ── Hub-Spoke / Transit Gateway
  if (net === "transit_gateway") {
    checks.push({ text: "Verify transit hub routes include Databricks subnet CIDR ranges", priority: "high" });
    checks.push({ text: "Confirm hub firewall allows traffic on required database ports", priority: "high" });
  }

  // ── VPN / ExpressRoute / Direct Connect
  if (net === "vpn_expressroute") {
    checks.push({ text: "Verify the ExpressRoute / VPN / Direct Connect circuit is operational and stable", priority: "blocker" });
    checks.push({ text: "Confirm on-premises firewall rules allow inbound from Databricks subnets", priority: "high" });
    checks.push({ text: "Configure DNS resolution for on-premises hostnames from the Databricks workspace", priority: "high" });
  }

  // ── Universal — reachability tests, runnable from a notebook on the gateway cluster
  if (conn.category === "Database") {
    const port = conn.defaultPorts[0];
    checks.push({
      text: `Verify NSG / Security Group allows outbound TCP on port ${conn.defaultPorts.join(", ")}`,
      priority: "high",
      detail: "Run from a notebook cell on the same compute the ingestion gateway will use — that's the only network path that matters.",
      code: {
        lang: "bash",
        body: `# DNS first — resolves the hostname?\n%sh getent hosts <source-host>\n%sh dig +short <source-host>\n\n# TCP reachability — port ${port} open from this compute?\n%sh nc -vz -w 5 <source-host> ${port}\n# expected: "Connection to <host> ${port} port [tcp/*] succeeded!"\n\n# Optional path tracing for cross-region / on-prem\n%sh tracepath <source-host>`,
      },
    });

    if (state.connector === "sql_server") {
      checks.push({
        text: "Confirm the ingestion gateway can authenticate to SQL Server",
        priority: "high",
        detail: "Goes one level deeper than nc — proves credentials work and CDC/CT objects are reachable. Run from a notebook on the gateway cluster.",
        code: {
          lang: "bash",
          body: `%sh apt-get install -y mssql-tools18 unixodbc 2>/dev/null\n\n%sh /opt/mssql-tools18/bin/sqlcmd \\\n  -S "<source-host>,1433" \\\n  -U "<ingest-user>" -P "<password>" \\\n  -d "<database>" -C \\\n  -Q "SELECT @@VERSION; SELECT name, is_cdc_enabled FROM sys.databases WHERE name = '<database>';"`,
        },
      });
    }
    if (state.connector === "postgresql") {
      checks.push({
        text: "Confirm the ingestion gateway can authenticate to PostgreSQL",
        priority: "high",
        code: {
          lang: "bash",
          body: `%sh apt-get install -y postgresql-client 2>/dev/null\n\n%sh PGPASSWORD='<password>' psql \\\n  "host=<source-host> port=5432 dbname=<db> user=databricks_replication sslmode=require" \\\n  -c "SELECT version();" \\\n  -c "SELECT slot_name, plugin, active FROM pg_replication_slots;"`,
        },
      });
    }
    if (state.connector === "mysql") {
      checks.push({
        text: "Confirm the ingestion gateway can authenticate to MySQL",
        priority: "high",
        code: {
          lang: "bash",
          body: `%sh apt-get install -y mysql-client 2>/dev/null\n\n%sh mysql \\\n  --host=<source-host> --port=3306 \\\n  --user=databricks_ingest --password='<password>' \\\n  --ssl-mode=REQUIRED \\\n  -e "SELECT VERSION(); SHOW VARIABLES LIKE 'log_bin'; SHOW MASTER STATUS;"`,
        },
      });
    }
  }

  if (conn.category === "SaaS") {
    checks.push({
      text: "Verify the SaaS endpoint is reachable from serverless egress",
      priority: "high",
      detail: "All SaaS connectors run on serverless. Test the actual hostname with curl from a notebook to prove DNS + TLS handshake succeed.",
      code: {
        lang: "bash",
        body: `# DNS\n%sh getent hosts <saas-host>\n\n# TLS handshake + status\n%sh curl -v --max-time 10 https://<saas-host>/ 2>&1 | head -40\n\n# Inspect the cert chain\n%sh openssl s_client -connect <saas-host>:443 -servername <saas-host> </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates`,
      },
    });
  }

  if (srcLoc === "on_prem" || srcLoc === "different_cloud") {
    checks.push({
      text: "Baseline end-to-end latency and throughput",
      priority: "medium",
      detail: "Round-trip latency dominates extract throughput when the source is far away. Capture a baseline before go-live so you can spot regressions.",
      code: {
        lang: "bash",
        body: `# 50 ICMP pings — gives you mean / stddev / loss\n%sh ping -c 50 <source-host>\n\n# TCP RTT + jitter — works even when ICMP is blocked\n%sh hping3 -S -p ${conn.defaultPorts[0]} -c 30 <source-host>\n\n# Cold throughput sample (databases) — fetch ~100MB and time it\n%sh time PGPASSWORD='<password>' psql \\\n  "host=<source-host> dbname=<db> user=<user>" \\\n  -c "COPY (SELECT * FROM <large_table> LIMIT 1000000) TO STDOUT" > /dev/null`,
      },
    });
  }

  return checks;
}

function genWorkspace(state, conn) {
  const checks = [];
  checks.push({ text: "Confirm Unity Catalog is enabled and a metastore is attached to the workspace", priority: "blocker" });
  checks.push({ text: "Verify serverless compute is enabled for the workspace", priority: "high" });
  checks.push({ text: "Create target catalog and schema for ingested data", priority: "high" });

  if (conn.category === "Database") {
    checks.push({ text: "Create a staging catalog/schema for the ingestion gateway", priority: "high" });
  }

  checks.push({
    text: "Create a Unity Catalog Connection object for the source",
    priority: "high",
    code: { lang: "sql", body: `-- Run in a SQL editor against the workspace metastore\nCREATE CONNECTION ${state.connector || "src"}_conn\n  TYPE ${conn.category === "Database" ? `'${(state.connector || "").toUpperCase()}'` : `'${(conn.label || "").toUpperCase().replace(/\\s+/g, "_")}'`}\n  OPTIONS (\n    host     '<source-host>',\n    port     '${conn.defaultPorts[0]}',\n    user     secret('lakeflow-ingest', 'src_user'),\n    password secret('lakeflow-ingest', 'src_password')\n  );\n\n-- Verify\nDESCRIBE CONNECTION ${state.connector || "src"}_conn;` },
  });

  if (state.cloud === "azure" && state.networkModel === "private_link") {
    checks.push({ text: "Configure a Network Connectivity Configuration (NCC) for serverless Private Link", priority: "high", detail: "Required for serverless compute to reach private endpoints in your VNet." });
  }
  if (state.cloud === "aws" && state.networkModel === "private_link") {
    checks.push({ text: "Configure NCC + private endpoint rules for serverless egress to your VPC", priority: "high" });
  }

  return checks;
}

function genSource(state, conn) {
  const checks = [];

  if (state.connector === "sql_server") {
    checks.push({
      text: "Confirm SQL Server version: 2012+ for Change Tracking, 2012 SP1 CU3+ for CDC",
      priority: "blocker",
      code: { lang: "sql", body: "SELECT @@VERSION;\nSELECT SERVERPROPERTY('ProductVersion') AS Version,\n       SERVERPROPERTY('Edition')         AS Edition;" },
    });
    checks.push({
      text: "Enable CDC at the database level",
      priority: "blocker",
      detail: "Required once per database before enabling CDC on individual tables.",
      code: { lang: "sql", body: "USE <your_database>;\nGO\nEXEC sys.sp_cdc_enable_db;\nGO\n\n-- Verify\nSELECT name, is_cdc_enabled\nFROM   sys.databases\nWHERE  name = '<your_database>';" },
    });
    checks.push({
      text: "Enable Change Tracking on tables with primary keys (preferred for CT path)",
      priority: "high",
      detail: "Use Change Tracking for tables that have a primary key — it's lighter weight than CDC.",
      code: { lang: "sql", body: "-- Database level\nALTER DATABASE <your_database>\n  SET CHANGE_TRACKING = ON\n  (CHANGE_RETENTION = 7 DAYS, AUTO_CLEANUP = ON);\n\n-- Per table\nALTER TABLE dbo.<your_table>\n  ENABLE CHANGE_TRACKING\n  WITH (TRACK_COLUMNS_UPDATED = ON);" },
    });
    checks.push({
      text: "Enable CDC on tables without primary keys (or where row-level history is needed)",
      priority: "high",
      code: { lang: "sql", body: "EXEC sys.sp_cdc_enable_table\n  @source_schema      = N'dbo',\n  @source_name        = N'<your_table>',\n  @role_name          = NULL,        -- or a gating role\n  @supports_net_changes = 1;\n\n-- Verify\nSELECT s.name AS schema_name, t.name AS table_name, t.is_tracked_by_cdc\nFROM   sys.tables t\nJOIN   sys.schemas s ON s.schema_id = t.schema_id\nWHERE  t.is_tracked_by_cdc = 1;" },
    });
    checks.push({
      text: "Download and run the Databricks utility objects script on the source database",
      priority: "high",
      detail: "Provided in the Databricks docs. Creates helper procs/functions used by the gateway. Run as a sysadmin / db_owner.",
      docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/sql-server-utility",
    });
    checks.push({
      text: "Grant minimum permissions to the ingestion user",
      priority: "high",
      code: { lang: "sql", body: "-- Replace <ingest_user> and <your_database>\nUSE <your_database>;\n\nGRANT SELECT                ON SCHEMA::cdc TO [<ingest_user>];\nGRANT SELECT                ON SCHEMA::dbo TO [<ingest_user>];\nGRANT VIEW CHANGE TRACKING  ON DATABASE   :: TO [<ingest_user>];\nGRANT VIEW DATABASE STATE   TO [<ingest_user>];\n\n-- Plus per-table SELECT for the tables you ingest\nGRANT SELECT ON dbo.<your_table> TO [<ingest_user>];" },
    });
    if (sourceCloud(state) === "onprem") {
      checks.push({
        text: "Ensure SQL Server Agent is running on the host (CDC capture jobs)",
        priority: "high",
        detail: "Required only for IaaS / on-prem SQL Server. Azure SQL DB and Azure SQL Managed Instance run CDC capture as a managed service — no Agent action needed.",
        code: { lang: "powershell", body: "# On the SQL Server host\nGet-Service SQLSERVERAGENT\nStart-Service SQLSERVERAGENT\nSet-Service  SQLSERVERAGENT -StartupType Automatic" },
      });
    }
    checks.push({
      text: "Confirm fn_cdc_get_max_lsn() returns a non-NULL LSN",
      priority: "medium",
      detail: "If this returns NULL the CDC capture job hasn't started or there's no activity yet.",
      code: { lang: "sql", body: "SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;" },
    });
  }

  if (state.connector === "postgresql") {
    checks.push({
      text: "Confirm PostgreSQL version 13 or later",
      priority: "blocker",
      code: { lang: "sql", body: "SELECT version();\nSHOW server_version_num;" },
    });
    {
      const sc = sourceCloud(state);
      const blocks = {
        aws: "-- AWS RDS / Aurora PostgreSQL\n-- Set in the cluster/instance parameter group, then reboot:\n--   rds.logical_replication        = 1\n--   max_replication_slots          >= 10\n--   max_wal_senders                >= 10\n\naws rds modify-db-parameter-group \\\n  --db-parameter-group-name <pg-group> \\\n  --parameters \"ParameterName=rds.logical_replication,ParameterValue=1,ApplyMethod=pending-reboot\"\n\naws rds reboot-db-instance --db-instance-identifier <id>",
        azure: "-- Azure DB for PostgreSQL — Server Parameters\n-- (Portal: Server parameters; or via CLI)\n\naz postgres flexible-server parameter set \\\n  -g <rg> -s <server> -n wal_level             -v LOGICAL\n\naz postgres flexible-server parameter set \\\n  -g <rg> -s <server> -n max_replication_slots -v 10\n\naz postgres flexible-server parameter set \\\n  -g <rg> -s <server> -n max_wal_senders       -v 10\n\naz postgres flexible-server restart -g <rg> -n <server>",
        gcp: "-- GCP Cloud SQL for PostgreSQL\ngcloud sql instances patch <instance> \\\n  --database-flags=cloudsql.logical_decoding=on,max_replication_slots=10,max_wal_senders=10",
        onprem: "-- Self-hosted / on-prem\nALTER SYSTEM SET wal_level             = 'logical';\nALTER SYSTEM SET max_wal_senders       = 10;\nALTER SYSTEM SET max_replication_slots = 10;\n-- restart Postgres for wal_level to take effect\nsudo systemctl restart postgresql",
      };
      const body = blocks[sc] || "-- Source cloud unknown — apply the variant for your source's host:\n-- self-hosted: ALTER SYSTEM SET wal_level='logical' (restart required)\n-- AWS RDS:     parameter group → rds.logical_replication = 1 (reboot)\n-- Azure:       Server parameters → wal_level = LOGICAL (restart)\n-- GCP CloudSQL: cloudsql.logical_decoding = on";
      checks.push({
        text: "Set wal_level = logical and replication parameters",
        priority: "blocker",
        detail: "wal_level changes require a database restart. max_replication_slots / max_wal_senders ≥ 10 is the recommended baseline.",
        code: { lang: "sql", body },
      });
    }
    checks.push({
      text: "Create a dedicated replication user",
      priority: "high",
      code: { lang: "sql", body: "CREATE USER databricks_replication WITH\n  LOGIN\n  REPLICATION\n  PASSWORD '<strong-password>';\n\n-- Read access to the schemas/tables to ingest\nGRANT USAGE  ON SCHEMA public TO databricks_replication;\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO databricks_replication;\nALTER DEFAULT PRIVILEGES IN SCHEMA public\n  GRANT SELECT ON TABLES TO databricks_replication;" },
    });
    checks.push({
      text: "Create a publication for the tables to replicate",
      priority: "high",
      docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/postgresql-source-setup",
      code: { lang: "sql", body: "-- Specific tables\nCREATE PUBLICATION databricks_pub\n  FOR TABLE public.orders, public.customers;\n\n-- Or, all tables in the database (use cautiously)\n-- CREATE PUBLICATION databricks_pub FOR ALL TABLES;\n\n-- Verify\nSELECT * FROM pg_publication;\nSELECT * FROM pg_publication_tables WHERE pubname = 'databricks_pub';" },
    });
    checks.push({
      text: "Create a logical replication slot (one per database) using pgoutput",
      priority: "high",
      code: { lang: "sql", body: "SELECT pg_create_logical_replication_slot(\n  'databricks_slot',\n  'pgoutput'\n);\n\n-- Inspect\nSELECT slot_name, plugin, slot_type, active, restart_lsn\nFROM   pg_replication_slots;" },
    });
    checks.push({
      text: "Configure REPLICA IDENTITY on tables without primary keys",
      priority: "high",
      detail: "REPLICA IDENTITY FULL writes the entire old row to WAL — required for UPDATE/DELETE replication when no PK exists. It increases WAL volume.",
      code: { lang: "sql", body: "ALTER TABLE public.<your_table> REPLICA IDENTITY FULL;\n\n-- Or, use a unique index instead of FULL\n-- ALTER TABLE public.<your_table>\n--   REPLICA IDENTITY USING INDEX <unique_index_name>;" },
    });
    checks.push({
      text: "⚠️ Plan for replication slot cleanup when deleting pipelines",
      priority: "high",
      detail: "Inactive slots cause WAL retention forever — disk fills, autovacuum can't reclaim. Drop the slot when retiring the pipeline.",
      code: { lang: "sql", body: "-- After confirming the pipeline is deleted\nSELECT pg_drop_replication_slot('databricks_slot');" },
    });
  }

  if (state.connector === "mysql") {
    checks.push({
      text: "Confirm MySQL version: 5.7.44+ (RDS), Aurora 5.7.mysql_aurora.2.11.4+, or 8.0+ self-hosted",
      priority: "blocker",
      code: { lang: "sql", body: "SELECT VERSION();\nSHOW VARIABLES LIKE 'version%';" },
    });
    {
      const sc = sourceCloud(state);
      const blocks = {
        onprem: {
          lang: "ini",
          body: "# /etc/mysql/my.cnf — self-hosted, restart mysqld after edit\n[mysqld]\nserver_id                  = 1\nlog_bin                    = mysql-bin\nbinlog_format              = ROW\nbinlog_row_image           = FULL\nbinlog_expire_logs_seconds = 86400        # 24h, longer if gateway downtime expected\nenforce_gtid_consistency   = ON\ngtid_mode                  = ON",
        },
        aws: {
          lang: "bash",
          body: "# AWS RDS / Aurora MySQL — set in the DB parameter group, then reboot.\n# Required parameters:\n#   binlog_format            = ROW\n#   binlog_row_image         = FULL\n#   binlog_expire_logs_seconds = 86400\n\naws rds modify-db-parameter-group \\\n  --db-parameter-group-name <mysql-group> \\\n  --parameters \\\n    \"ParameterName=binlog_format,ParameterValue=ROW,ApplyMethod=pending-reboot\" \\\n    \"ParameterName=binlog_row_image,ParameterValue=FULL,ApplyMethod=pending-reboot\"\n\naws rds reboot-db-instance --db-instance-identifier <id>",
        },
        azure: {
          lang: "bash",
          body: "# Azure DB for MySQL — Server parameters\naz mysql flexible-server parameter set \\\n  -g <rg> -s <server> -n binlog_row_image -v FULL\n# binlog_format is ROW by default and not user-modifiable on Flexible Server.",
        },
        gcp: {
          lang: "bash",
          body: "# GCP Cloud SQL for MySQL — database flags\ngcloud sql instances patch <instance> \\\n  --database-flags=binlog_row_image=FULL\n# binlog_format=ROW is the Cloud SQL default; cannot be changed.",
        },
      };
      const block = blocks[sc] || { lang: "ini", body: "# Source cloud unknown — apply the variant matching your source host\n# self-hosted: edit my.cnf, restart mysqld\n# AWS RDS:     parameter group → binlog_format=ROW, binlog_row_image=FULL\n# Azure:       Server parameters → binlog_row_image=FULL\n# GCP CloudSQL: database flag binlog_row_image=FULL" };
      checks.push({
        text: "Enable binary logging with ROW format and FULL row image",
        priority: "blocker",
        detail: "binlog_format=ROW and binlog_row_image=FULL are required for the MySQL CDC reader. Managed services apply via parameter groups; self-hosted edits my.cnf.",
        docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/mysql-source-setup",
        code: block,
      });
    }
    checks.push({
      text: "Verify binlog settings",
      priority: "high",
      code: { lang: "sql", body: "SHOW VARIABLES LIKE 'log_bin';\nSHOW VARIABLES LIKE 'binlog_format';\nSHOW VARIABLES LIKE 'binlog_row_image';\nSHOW VARIABLES LIKE 'binlog_expire_logs_seconds';" },
    });
    checks.push({
      text: "Create a dedicated MySQL user with replication and read privileges",
      priority: "high",
      code: { lang: "sql", body: "CREATE USER 'databricks_ingest'@'%' IDENTIFIED BY '<strong-password>';\n\nGRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'databricks_ingest'@'%';\nGRANT SELECT ON <your_database>.*           TO 'databricks_ingest'@'%';\n\nFLUSH PRIVILEGES;" },
    });
    {
      const sc = sourceCloud(state);
      const retentionBlocks = {
        aws: "-- AWS RDS / Aurora\nCALL mysql.rds_set_configuration('binlog retention hours', 24);\nCALL mysql.rds_show_configuration;",
        azure: "-- Azure DB for MySQL Flexible Server\n-- (controlled by binlog_expire_logs_seconds parameter)\n-- $ az mysql flexible-server parameter set \\\n--     -g <rg> -s <server> -n binlog_expire_logs_seconds -v 86400\nSHOW VARIABLES LIKE 'binlog_expire_logs_seconds';",
        gcp: "-- GCP Cloud SQL\n-- $ gcloud sql instances patch <instance> --database-flags=binlog_expire_logs_seconds=86400\nSHOW VARIABLES LIKE 'binlog_expire_logs_seconds';",
        onprem: "-- Self-hosted, MySQL 8.0+\nSET GLOBAL binlog_expire_logs_seconds = 86400;",
      };
      checks.push({
        text: "Set binlog retention to at least 24 hours",
        priority: "high",
        detail: "Once binlogs expire, the gateway must do a full re-snapshot. Increase if you expect maintenance windows or gateway downtime longer than this.",
        code: { lang: "sql", body: retentionBlocks[sc] || "-- Source cloud unknown — pick the matching variant.\n-- AWS:     CALL mysql.rds_set_configuration('binlog retention hours', 24);\n-- Azure:   az mysql … parameter set binlog_expire_logs_seconds 86400\n-- GCP:     gcloud sql instances patch --database-flags=binlog_expire_logs_seconds=86400\n-- onprem:  SET GLOBAL binlog_expire_logs_seconds = 86400;" },
      });
    }
    checks.push({
      text: "⚠️ Aurora MySQL read replicas are NOT supported — point ingestion at the writer endpoint",
      priority: "blocker",
      detail: "Replica binlogs aren't compatible with Lakeflow Connect's CDC reader.",
    });
  }

  if (state.connector === "salesforce") {
    checks.push({
      text: "Create a Connected App in Salesforce with OAuth 2.0 enabled",
      priority: "high",
      detail: "Setup → App Manager → New Connected App → Enable OAuth Settings. Add the Databricks callback URL (shown when you create the UC Connection).",
      docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/salesforce-concepts",
      code: { lang: "yaml", body: "OAuth Scopes:\n  - api               # Access and manage your data\n  - refresh_token     # Required for long-lived ingestion\n  - offline_access    # 8.0+ orgs\n\nCallback URL:\n  https://<workspace-host>/login/oauth/salesforce/callback\n\nIP Relaxation:\n  Relax IP restrictions for refresh tokens (for non-IP-restricted ingest)" },
    });
    checks.push({
      text: "Verify API access is enabled on the Salesforce org",
      priority: "high",
      detail: "Setup → User → Profile of the integration user → System Permissions → 'API Enabled'. Required on the user's Profile (not just Permission Sets).",
    });
    checks.push({
      text: "Confirm the integration user's profile has read permissions on objects to ingest",
      priority: "high",
      detail: "Setup → Profiles or Permission Sets → Object Settings → grant Read on every Standard/Custom Object that will be ingested. Field-Level Security must also be enabled for sensitive fields.",
    });
    checks.push({
      text: "Check Salesforce API rate limits for your org edition",
      priority: "medium",
      detail: "Lakeflow uses Bulk API 2.0 by default. Standard editions get 15K calls/24h per license; Enterprise/Unlimited get more. Sandboxes get fewer.",
      code: { lang: "sql", body: "-- Run in Developer Console → Query Editor\nSELECT  Name, DailyApiRequests.Max, DailyApiRequests.Remaining\nFROM    OrganizationLimits\n-- or Workbench → REST Explorer → /services/data/vXX.X/limits/" },
    });
    checks.push({
      text: "Enable Change Data Capture in Salesforce (only if using CDC ingestion mode)",
      priority: "medium",
      detail: "Setup → Change Data Capture → select objects to publish. Bulk API 2.0 ingestion does NOT require this; only the streaming CDC mode does.",
    });
  }

  // ── Lighter coverage for the remaining SaaS connectors ──

  if (state.connector === "workday") {
    checks.push({ text: "Create an Integration System User (ISU) in Workday", priority: "high", detail: "Workbench → Create Integration System User → assign to an Integration System Security Group with the right Domain Security Policies." });
    checks.push({ text: "Configure Workday Reports (Custom Reports) that expose the data to ingest", priority: "high", detail: "Lakeflow Connect for Workday reads from Workday-as-a-Service URLs of Custom Reports — make sure each report is enabled as a web service.", docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/workday-reports-source-setup" });
    checks.push({ text: "Verify Workday API access and tenant URL", priority: "high" });
  }

  if (state.connector === "servicenow") {
    checks.push({ text: "Create an OAuth application in ServiceNow or configure a Basic Auth integration user", priority: "high", detail: "System OAuth → Application Registry → New → Create an OAuth API endpoint for external clients.", docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/servicenow-source-setup" });
    checks.push({ text: "Grant table-level read ACLs to the integration user", priority: "high" });
    checks.push({ text: "Verify the ServiceNow instance allows REST API access", priority: "high" });
  }

  if (state.connector === "sharepoint") {
    checks.push({ text: "Register an Entra ID App with Microsoft Graph Sites.Read.All or Sites.Selected", priority: "high", docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/sharepoint-source-setup-overview" });
    checks.push({ text: "Identify SharePoint site IDs and document library paths to ingest", priority: "high" });
  }

  if (state.connector === "google_analytics") {
    checks.push({ text: "Create a GCP Service Account and grant Viewer role on the GA4 property", priority: "high", docsUrl: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/google-analytics" });
    checks.push({ text: "Note the GA4 Property ID", priority: "high", detail: "Find this in GA4 Admin → Property Settings → Property ID." });
  }

  return checks;
}

function genSecurity(state, conn) {
  const checks = [];

  // ── 1. TLS enforcement — verifiable per connector
  if (state.connector === "postgresql") {
    checks.push({
      text: "Confirm TLS is enforced on the PostgreSQL server",
      priority: "high",
      detail: "Connect with psql and confirm SSL is on. Then check the server config.",
      code: { lang: "sql", body: "-- 1. Check if your current session is using TLS\nSELECT ssl, version, cipher\nFROM   pg_stat_ssl\nWHERE  pid = pg_backend_pid();\n\n-- 2. Check server-wide setting\nSHOW ssl;             -- expect 'on'\nSHOW ssl_min_protocol_version;  -- expect 'TLSv1.2' or later\n\n-- 3. Reject non-SSL clients in pg_hba.conf:\n-- hostssl  all  databricks_replication  0.0.0.0/0  scram-sha-256" },
    });
  } else if (state.connector === "mysql") {
    checks.push({
      text: "Confirm TLS is enforced on the MySQL server",
      priority: "high",
      detail: "Verify the server has SSL enabled and that the ingestion user requires it.",
      code: { lang: "sql", body: "-- 1. Server-wide TLS\nSHOW VARIABLES LIKE 'have_ssl';        -- expect 'YES'\nSHOW VARIABLES LIKE 'tls_version';     -- expect TLSv1.2 / TLSv1.3\n\n-- 2. Current session\nSHOW STATUS LIKE 'Ssl_cipher';         -- non-empty value = TLS in use\n\n-- 3. Force TLS for the ingestion user\nALTER USER 'databricks_ingest'@'%' REQUIRE SSL;\nFLUSH PRIVILEGES;\n\n-- Verify\nSELECT user, host, ssl_type FROM mysql.user\nWHERE user = 'databricks_ingest';" },
    });
  } else if (state.connector === "sql_server") {
    const sc = sourceCloud(state);
    const isManaged = sc === "azure"; // Azure SQL DB / MI on Azure same-cloud
    checks.push({
      text: "Confirm TLS is enforced on SQL Server",
      priority: "high",
      detail: isManaged
        ? "On Azure SQL DB / Managed Instance TLS is enforced server-side and cannot be disabled — just verify your sessions are encrypted."
        : "Use sys.dm_exec_connections to inspect the encryption state of live connections, then set ForceEncryption = Yes via SQL Server Configuration Manager.",
      code: {
        lang: "sql",
        body: isManaged
          ? "-- Inspect live sessions — expect encrypt_option = 'TRUE'\nSELECT session_id, encrypt_option, protocol_type, client_net_address\nFROM   sys.dm_exec_connections;\n\n-- Azure SQL DB / Managed Instance: nothing to configure — TLS is enforced."
          : "-- Inspect live sessions — expect encrypt_option = 'TRUE'\nSELECT session_id, encrypt_option, protocol_type, client_net_address\nFROM   sys.dm_exec_connections;\n\n-- IaaS / on-prem: in SQL Server Configuration Manager →\n--   SQL Server Network Configuration → Protocols for <instance> → Properties\n--   → Force Encryption = Yes",
      },
    });
  } else if (conn?.category === "SaaS") {
    checks.push({
      text: `${conn.label} connectivity is HTTPS-only`,
      priority: "info",
      detail: "All Lakeflow Connect SaaS connectors use HTTPS over TLS 1.2+ — no further server-side action required. Verifying the certificate chain is the responsibility of the SaaS provider.",
    });
  }

  // ── 2. Workspace audit logs — directly queryable
  checks.push({
    text: "Verify Databricks audit logs are flowing (system.access.audit)",
    priority: "high",
    detail: "system.access.audit is the authoritative source for who-did-what in the workspace. If it returns 0 rows, audit-log delivery isn't enabled.",
    code: { lang: "sql", body: "SELECT  COUNT(*)         AS events_24h,\n        MAX(event_time)  AS last_event,\n        APPROX_COUNT_DISTINCT(user_identity.email) AS distinct_users\nFROM    system.access.audit\nWHERE   event_time >= current_timestamp() - INTERVAL 1 DAY;" },
  });

  // ── 3. Pipeline events — gives lineage / failure visibility
  checks.push({
    text: "Verify Lakeflow pipeline event logs are queryable",
    priority: "high",
    detail: "Every pipeline writes events to event_log(<pipeline_id>). Confirm at least one pipeline has emitted events in the past day.",
    code: { lang: "sql", body: "-- Replace with your pipeline's event_log table reference\nSELECT  origin.flow_name,\n        event_type,\n        level,\n        timestamp,\n        message\nFROM    event_log(\"<pipeline-id>\")\nWHERE   timestamp >= current_timestamp() - INTERVAL 1 DAY\nORDER BY timestamp DESC\nLIMIT 50;" },
  });

  // ── 4. Source-side audit logging — connector-specific, verifiable
  if (state.connector === "postgresql") {
    checks.push({
      text: "Confirm source-side audit logging is enabled (PostgreSQL)",
      priority: "medium",
      detail: "log_connections + log_disconnections give a record of every ingestion connection. pgaudit (extension) gives DML-level audit if needed.",
      code: { lang: "sql", body: "SHOW log_connections;     -- expect 'on'\nSHOW log_disconnections;  -- expect 'on'\nSHOW log_statement;       -- 'ddl' or higher recommended\n\n-- Optional: check pgaudit is loaded\nSELECT * FROM pg_available_extensions WHERE name = 'pgaudit';" },
    });
  } else if (state.connector === "mysql") {
    const sc = sourceCloud(state);
    const auditConfig = {
      aws:    { detail: "On AWS RDS / Aurora MySQL, audit logging is provided by the MariaDB Audit Plugin enabled in the DB parameter group.", body: "SHOW VARIABLES LIKE 'server_audit%';" },
      azure:  { detail: "Azure DB for MySQL Flexible Server provides server-side audit logs; enable the audit_log_enabled parameter and ship logs to Diagnostic Settings.", body: "SHOW VARIABLES LIKE 'audit_log%';" },
      gcp:    { detail: "GCP Cloud SQL writes audit logs to Cloud Logging when cloudsql.enable_pgaudit / audit flags are set on the instance.", body: "-- Verify in Cloud Logging:\n--   resource.type=\"cloudsql_database\" log_id=\"cloudsql.googleapis.com/mysql-audit\"" },
      onprem: { detail: "Self-hosted MySQL: install the audit_log plugin (Enterprise) or Percona Audit Plugin.", body: "SHOW VARIABLES LIKE 'audit_log%';" },
    };
    const cfg = auditConfig[sc] || { detail: "Pick the audit-logging mechanism for your MySQL host platform.", body: "-- AWS RDS:    SHOW VARIABLES LIKE 'server_audit%';\n-- Azure DB:   SHOW VARIABLES LIKE 'audit_log%';\n-- self-hosted: SHOW VARIABLES LIKE 'audit_log%';" };
    checks.push({
      text: "Confirm source-side audit logging is enabled (MySQL)",
      priority: "medium",
      detail: cfg.detail,
      code: { lang: "sql", body: cfg.body },
    });
  } else if (state.connector === "sql_server") {
    checks.push({
      text: "Confirm source-side audit logging is enabled (SQL Server)",
      priority: "medium",
      detail: "Server Audit captures successful/failed logins and DML to a file or Event Log. Required by most compliance frameworks.",
      code: { lang: "sql", body: "SELECT name, is_state_enabled, type_desc\nFROM   sys.server_audits;\n\nSELECT a.name AS audit, s.name AS spec, s.is_state_enabled\nFROM   sys.server_audit_specifications s\nJOIN   sys.server_audits a ON a.audit_guid = s.audit_guid;" },
    });
  } else if (state.connector === "salesforce") {
    checks.push({
      text: "Confirm Salesforce Setup Audit Trail covers the integration user",
      priority: "medium",
      detail: "Setup → Setup Audit Trail. Also enable Login History (Setup → Identity → Login History) to track every API session by the integration user.",
    });
  }

  // ── 5. Region / residency — workspace + source cloud only
  {
    const sc = sourceCloud(state);
    const wsBlock = {
      aws:   "# Workspace region (AWS)\ndatabricks workspaces get <workspace-id> --output JSON \\\n  | python3 -c \"import json,sys; print(json.load(sys.stdin).get('aws_region'))\"",
      azure: "# Workspace region (Azure)\naz databricks workspace show \\\n  -g <rg> -n <workspace-name> \\\n  --query 'location'",
      gcp:   "# Workspace region (GCP)\ngcloud databricks workspaces describe <workspace-id> \\\n  --location=<region> --format='value(location)'",
    }[state.cloud] || "# Select a workspace cloud first.";
    const srcBlocks = {
      aws:   conn?.category === "Database" ? "\n\n# Source region — AWS\naws rds describe-db-instances \\\n  --db-instance-identifier <id> \\\n  --query 'DBInstances[0].AvailabilityZone'" : "",
      azure: conn?.category === "Database" ? `\n\n# Source region — Azure\naz ${state.connector === "postgresql" ? "postgres" : state.connector === "mysql" ? "mysql" : "sql"} flexible-server show \\\n  -g <rg> -n <server> --query 'location'` : "",
      gcp:   conn?.category === "Database" ? "\n\n# Source region — GCP Cloud SQL\ngcloud sql instances describe <instance> \\\n  --format='value(region)'" : "",
      onprem: "\n\n# Source region — on-prem: capture data-center location and country in your security doc",
      saas:   "",
      other:  "\n\n# Source is in a different cloud — run the matching cloud CLI for the source\n# (we don't currently capture the source cloud separately)",
    };
    const body = wsBlock + (srcBlocks[sc] || "");
    checks.push({
      text: "Document workspace region and confirm it matches the source region (or cross-region transfer is approved)",
      priority: "high",
      detail: "Cross-region replication has cost + residency implications. Capture both regions explicitly so security review has a definitive answer.",
      code: { lang: "bash", body },
    });
  }

  // ── 6. Service-principal ownership — actually verifiable
  checks.push({
    text: "Confirm the pipeline runs as a service principal, not a human user",
    priority: "high",
    detail: "Pipelines tied to a person's identity break when that person leaves. Run as a SP and grant CONNECTION USAGE + the destination catalog/schema permissions to the SP.",
    code: { lang: "bash", body: "# List Lakeflow pipelines and their run-as identity\ndatabricks pipelines list-pipelines --output JSON \\\n  | python3 -c \"\nimport json, sys\nfor p in json.load(sys.stdin).get('statuses', []):\n    print(p['name'], '→', p.get('run_as_user_name') or p.get('creator_user_name'))\n\"" },
  });

  // ── 7. Secret scope ACLs — verifiable
  checks.push({
    text: "Confirm secret scope ACLs are restricted to the pipeline service principal",
    priority: "high",
    detail: "If the scope grants READ to a broad group, anyone in that group can pull the source credentials.",
    code: { lang: "bash", body: "# Show every principal with ACL on the scope\ndatabricks secrets list-acls lakeflow-ingest\n\n# Tighten if needed — remove broad principals\ndatabricks secrets delete-acl lakeflow-ingest <broad-group-or-user>" },
  });

  // ── 8. Source-at-rest encryption — pick the right cloud
  if (conn?.category === "Database") {
    const sc = sourceCloud(state);
    const blocks = {
      aws:    "# AWS RDS — StorageEncrypted should be true\naws rds describe-db-instances \\\n  --db-instance-identifier <id> \\\n  --query 'DBInstances[0].{StorageEncrypted:StorageEncrypted,KmsKeyId:KmsKeyId}'",
      azure:  `# Azure — encryption is on by default; capture CMK status\naz ${state.connector === "postgresql" ? "postgres" : state.connector === "mysql" ? "mysql" : "sql"} flexible-server show \\\n  -g <rg> -n <server> --query 'dataEncryption'`,
      gcp:    "# GCP Cloud SQL\ngcloud sql instances describe <instance> \\\n  --format='value(diskEncryptionConfiguration.kmsKeyName)'",
      onprem: "# On-prem — capture disk-encryption posture in your security review doc.\n# Common controls: BitLocker (Windows), LUKS / dm-crypt (Linux),\n# TDE (SQL Server / Oracle), filesystem-level (ZFS/Btrfs encryption).",
      other:  "# Source is in a different cloud — run the matching cloud's CLI:\n#   AWS:    aws rds describe-db-instances ... StorageEncrypted\n#   Azure:  az <db> flexible-server show ... dataEncryption\n#   GCP:    gcloud sql instances describe ... diskEncryptionConfiguration",
    };
    if (sc !== "saas") {
      checks.push({
        text: "Confirm source storage encryption is enabled",
        priority: "medium",
        detail: sc === "onprem"
          ? "On-prem source — record the disk-encryption mechanism (BitLocker / LUKS / TDE / etc.) in your security review."
          : "Cloud-managed databases expose this via their describe API. Capture both the boolean and the KMS key reference.",
        code: { lang: "bash", body: blocks[sc] || blocks.other },
      });
    }
  }

  // ── 9. UC Connection visibility — directly verifiable
  checks.push({
    text: "Confirm the UC Connection object is visible only to the right principals",
    priority: "medium",
    detail: "An over-privileged Connection lets anyone with USE CONNECTION reuse the stored credentials in another pipeline.",
    code: { lang: "sql", body: `-- List principals with privileges on the connection\nSHOW GRANTS ON CONNECTION ${state.connector || "src"}_conn;\n\n-- Tighten — only the pipeline SP needs USE CONNECTION\nREVOKE ALL PRIVILEGES ON CONNECTION ${state.connector || "src"}_conn FROM \`account users\`;\nGRANT  USE CONNECTION ON CONNECTION ${state.connector || "src"}_conn TO \`<pipeline-sp>\`;` },
  });

  return checks;
}

/* ───────── Network Doctor handoff ───────── */

function genDoctorParams(state) {
  const conn = CONNECTORS[state.connector];
  if (!conn) return null;
  const endpoints = [];
  if (state.sourceHost) {
    conn.defaultPorts.forEach((p) =>
      endpoints.push({ host: state.sourceHost, port: p, protocol: "TCP" })
    );
  }
  const dnsChecks = [];
  if (state.sourceHost) {
    dnsChecks.push(state.sourceHost);
    if (state.networkModel === "private_link") {
      const parts = state.sourceHost.split(".");
      if (parts.length > 1) dnsChecks.push(`privatelink.${parts.slice(1).join(".")}`);
    }
  }
  return {
    connector: conn.label,
    networkModel: NETWORK_MODELS[state.networkModel]?.label || "—",
    endpoints,
    dnsChecks,
  };
}

/* ───────── PRIMITIVES ───────── */

const PRIORITY_ORDER = { blocker: 0, high: 1, medium: 2, low: 3, info: 4 };

const STATUS_STYLE = {
  "GA":              { cls: "status-ga",   label: "GA" },
  "Public Preview":  { cls: "status-pupr", label: "Public Preview" },
  "Private Preview": { cls: "status-prpr", label: "Private Preview" },
  "Beta":            { cls: "status-beta", label: "Beta" },
};

function StatusBadge({ status, size = "sm" }) {
  const s = STATUS_STYLE[status] || { cls: "status-other", label: status || "—" };
  return <span className={`status-badge ${s.cls} ${size === "lg" ? "status-lg" : ""}`}>{s.label}</span>;
}

function PriorityBadge({ priority }) {
  const map = {
    blocker: { cls: "priority-blocker", label: "Blocker" },
    high: { cls: "priority-high", label: "High" },
    medium: { cls: "priority-medium", label: "Medium" },
    low: { cls: "priority-low", label: "Low" },
    info: { cls: "priority-info", label: "Info" },
  };
  const m = map[priority] || map.medium;
  return <span className={`priority-badge ${m.cls}`}>{m.label}</span>;
}

function Caret({ open }) {
  return (
    <span className={`caret ${open ? "open" : ""}`} aria-hidden>
      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 1.5L7 5L3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

function SidebarNav({ steps, current, onSelect, maxReachable }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {steps.map((s, i) => {
          const isActive = i === current;
          const isDone = i < current;
          const cls = `nav-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`.trim();
          const disabled = i > maxReachable;
          return (
            <button
              key={s}
              className={cls}
              onClick={() => !disabled && onSelect(i)}
              disabled={disabled}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="nav-step-num">
                {isDone ? <Icon name="check" size={12} strokeWidth={2.5} /> : i + 1}
              </span>
              <span>{s}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function AppHeader({ onHome }) {
  return (
    <header className="app-header">
      <button className="brand brand-button" onClick={onHome} aria-label="Go to home page">
        <span className="brand-mark"><Icon name="flow" size={26} strokeWidth={1.75} /></span>
        <span className="brand-title">
          Lakeflow Connect <span className="brand-accent">Questionnaire</span>
        </span>
      </button>
      <div className="header-right">
        <a
          href="https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/"
          target="_blank"
          rel="noreferrer"
        >
          Docs
        </a>
        <a
          href="https://github.com/databricks"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" size={16} /> GitHub
        </a>
      </div>
    </header>
  );
}

function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-eyebrow">
          <Icon name="flow" size={12} /> Lakeflow Connect
        </div>
        <h1 className="landing-title">
          Plan a production-ready <span className="accent">ingestion rollout</span> in minutes.
        </h1>
        <p className="landing-subtitle">
          A guided pre-flight questionnaire for Lakeflow Connect. Generates a tailored checklist
          across identity, networking, workspace, source-system prep, and security — built from
          your connector, cloud, and topology choices.
        </p>
        <div className="landing-ctas">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Start questionnaire <Icon name="arrowRight" />
          </button>
          <a
            className="btn btn-ghost btn-lg"
            href="https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/"
            target="_blank"
            rel="noreferrer"
          >
            View Connect docs
          </a>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-eyebrow">What you get</div>
        <h2 className="landing-section-title">A checklist that actually applies to your setup</h2>
        <p className="landing-section-subtitle">
          Every check is conditional on what you select — no boilerplate, no
          "consult your cloud team" hand-waving.
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><Icon name="key" size={18} /></div>
            <div className="feature-title">Identity &amp; credentials</div>
            <div className="feature-desc">
              Connector-specific auth setup — OAuth apps, secret scopes, service principals,
              least-privilege grants.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="network" size={18} /></div>
            <div className="feature-title">Network &amp; connectivity</div>
            <div className="feature-desc">
              Private Link, peering, NAT egress, cross-cloud VPN — only the topology options that
              fit your source location.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="cog" size={18} /></div>
            <div className="feature-title">Workspace configuration</div>
            <div className="feature-desc">
              Unity Catalog, serverless, NCC, UC Connection objects — workspace prep ready to
              copy-paste into a SQL editor.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="database" size={18} /></div>
            <div className="feature-title">Source-side prep</div>
            <div className="feature-desc">
              CDC enablement, replication slots, binlog config, publication setup — with
              cloud-specific snippets for AWS, Azure, GCP, and on-prem.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="shield" size={18} /></div>
            <div className="feature-title">Security &amp; compliance</div>
            <div className="feature-desc">
              TLS enforcement, audit logs, region/residency, secret-scope ACLs, source-at-rest
              encryption — verifiable, not aspirational.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icon name="stethoscope" size={18} /></div>
            <div className="feature-title">Network Doctor handoff</div>
            <div className="feature-desc">
              Auto-generates endpoint and DNS check payloads to paste into the Network Doctor
              notebook — no manual translation.
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-eyebrow">How it works</div>
        <h2 className="landing-section-title">Six steps from idea to checklist</h2>
        <div className="flow-steps">
          <div className="flow-step">
            <div className="flow-step-num">1</div>
            <div className="flow-step-title">Pick source</div>
            <div className="flow-step-desc">SQL Server, Postgres, MySQL, Salesforce, Workday, ServiceNow, SharePoint, GA4.</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-num">2</div>
            <div className="flow-step-title">Choose cloud</div>
            <div className="flow-step-desc">AWS, Azure, or GCP — drives all cloud-specific guidance.</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-num">3</div>
            <div className="flow-step-title">Define topology</div>
            <div className="flow-step-desc">Same cloud, cross-cloud, on-prem, or SaaS — networking branches off this.</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-num">4</div>
            <div className="flow-step-title">Get the plan</div>
            <div className="flow-step-desc">Prioritized checklist, code snippets, and a Network Doctor handoff payload.</div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-eyebrow">Cloud-aware</div>
        <h2 className="landing-section-title">Tailored to your workspace cloud</h2>
        <p className="landing-section-subtitle">
          Every snippet is scoped to the cloud you pick — no generic shell scripts that don't
          match your environment.
        </p>
        <div className="cloud-grid">
          <div className="cloud-card tint-aws">
            <div className="cloud-card-title">AWS</div>
            <div className="cloud-card-sub">Amazon Web Services</div>
            <ul className="cloud-card-list">
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> RDS / Aurora parameter groups</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> NAT gateway egress IPs</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> NCC + serverless PrivateLink</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> GovCloud-friendly checks</li>
            </ul>
          </div>
          <div className="cloud-card tint-azure">
            <div className="cloud-card-title">Azure</div>
            <div className="cloud-card-sub">Microsoft Azure</div>
            <ul className="cloud-card-list">
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> Flexible-server parameters</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> Private Endpoints + Private DNS</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> Entra ID app registrations</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> ExpressRoute / hub-spoke routing</li>
            </ul>
          </div>
          <div className="cloud-card tint-gcp">
            <div className="cloud-card-title">GCP</div>
            <div className="cloud-card-sub">Google Cloud Platform</div>
            <ul className="cloud-card-list">
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> Cloud SQL database flags</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> Cloud NAT egress IPs</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> Service Account keys for GA4</li>
              <li><Icon name="check" size={14} strokeWidth={2.5} className="tick" /> VPC peering / PSC</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="final-cta">
        <h3>Ready to plan your Lakeflow Connect rollout?</h3>
        <p>No sign-in. No data leaves your browser. Six steps. About 2 minutes.</p>
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          Start questionnaire <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <Icon name="flow" size={14} />
        <span>Lakeflow Connect Questionnaire</span>
      </div>
      <div className="footer-right">
        <a
          href="https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/"
          target="_blank"
          rel="noreferrer"
        >
          Connect Docs
        </a>
        <span className="sep">|</span>
        <a
          href="https://www.databricks.com/product/lakeflow"
          target="_blank"
          rel="noreferrer"
        >
          Lakeflow
        </a>
        <span className="sep">|</span>
        <span>Everything runs in your browser</span>
      </div>
    </footer>
  );
}

/* ───────── MAIN APP ───────── */

const STEPS = ["Category", "Connector", "Cloud", "Source", "Network", "Auth", "Results"];
const initialState = { connectorCategory: null, connector: null, cloud: null, sourceLocation: null, networkModel: null, authMethod: null, sourceHost: "" };

export default function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [state, setState] = useState(initialState);
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState({});
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef(null);

  const conn = state.connector ? CONNECTORS[state.connector] : null;

  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Auto-set SaaS source location when SaaS connector is picked
  useEffect(() => {
    if (conn?.category === "SaaS" && state.sourceLocation !== "saas") {
      setState((s) => ({ ...s, sourceLocation: "saas", networkModel: "public_with_ip_acl" }));
    }
  }, [state.connector]); // eslint-disable-line

  const availableNetworkModels = useMemo(() => {
    const loc = state.sourceLocation;
    if (loc === "saas") return ["public_with_ip_acl"];
    if (loc === "on_prem") return ["vpn_expressroute", "transit_gateway", "public_with_ip_acl"];
    if (loc === "different_cloud") return ["cross_cloud_vpn", "cross_cloud_interconnect", "public_with_ip_acl"];
    if (loc === "same_cloud") return ["private_link", "vnet_peering", "public_with_ip_acl"];
    return [];
  }, [state.sourceLocation]);

  const checklist = useMemo(() => generateChecklist(state), [state]);
  const allChecks = useMemo(() => checklist.flatMap((c) => c.checks), [checklist]);
  const checkedCount = useMemo(() => {
    let n = 0;
    checklist.forEach((cat) => {
      cat.checks.forEach((c, i) => {
        if (checked[checkRowKey(cat.category, i, c.text)]) n++;
      });
    });
    return n;
  }, [checklist, checked]);
  const blockerCount = allChecks.filter((c) => c.priority === "blocker").length;
  const highCount = allChecks.filter((c) => c.priority === "high").length;

  const canNext = (() => {
    if (step === 0) return !!state.connectorCategory;
    if (step === 1) return !!state.connector;
    if (step === 2) return !!state.cloud;
    if (step === 3) return !!state.sourceLocation;
    if (step === 4) return !!state.networkModel;
    if (step === 5) return !!state.authMethod;
    return false;
  })();

  const reset = () => {
    setState(initialState);
    setStep(0);
    setExpanded({});
    setChecked({});
    setFilter("all");
    setStarted(false);
  };

  // Furthest step the user has reached (highest visited index)
  const maxReachable = useMemo(() => {
    let m = 0;
    if (state.connectorCategory) m = Math.max(m, 1);
    if (state.connector) m = Math.max(m, 2);
    if (state.cloud) m = Math.max(m, 3);
    if (state.sourceLocation) m = Math.max(m, 4);
    if (state.networkModel) m = Math.max(m, 5);
    if (state.authMethod) m = Math.max(m, 6);
    return Math.max(m, step);
  }, [state, step]);

  const goHome = () => {
    setChecked({});
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="app-shell">
        <AppHeader onHome={goHome} />
        <main className="app-main-fullwidth">
          <LandingPage onStart={() => setStarted(true)} />
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader onHome={goHome} />

      <div className="app-body">
        <SidebarNav
          steps={STEPS}
          current={step}
          maxReachable={maxReachable}
          onSelect={setStep}
        />

        <main className="app-main" ref={scrollRef}>
          <div className="step-body" key={step}>
            {step === 0 && <StepCategory state={state} set={set} />}
            {step === 1 && <StepConnector state={state} set={set} />}
            {step === 2 && <StepCloud state={state} set={set} />}
            {step === 3 && <StepSource state={state} set={set} conn={conn} />}
            {step === 4 && <StepNetwork state={state} set={set} models={availableNetworkModels} />}
            {step === 5 && <StepAuth state={state} set={set} conn={conn} />}
            {step === 6 && (
              <StepResults
                state={state}
                checklist={checklist}
                checked={checked}
                setChecked={setChecked}
                expanded={expanded}
                setExpanded={setExpanded}
                filter={filter}
                setFilter={setFilter}
                checkedCount={checkedCount}
                total={allChecks.length}
                blockerCount={blockerCount}
                highCount={highCount}
                onReset={reset}
              />
            )}
          </div>

          {step < 6 && (
            <div className="actions">
              <div className="actions-group">
                <button className="btn btn-ghost" onClick={back} disabled={step === 0}>
                  <Icon name="arrowLeft" /> Back
                </button>
                <button className="btn btn-primary" onClick={next} disabled={!canNext}>
                  {step === STEPS.length - 2 ? "Generate Checklist" : "Continue"}
                  <Icon name="arrowRight" />
                </button>
              </div>
              <div className="actions-progress">
                Step {step + 1} of {STEPS.length}
              </div>
            </div>
          )}
        </main>
      </div>

      <AppFooter />
    </div>
  );
}

// Canonical key for a check row — must match what the checkbox UI uses
// in StepResults so progress counting / export pick up the same boxes.
function checkRowKey(category, idx, text) {
  return `${category}-${idx}-${text.slice(0, 32)}`;
}

/* ───────── STEPS ───────── */

function StepCategory({ state, set }) {
  const pick = (id) => {
    set("connectorCategory", id);
    // Clear a stale connector selection if it doesn't belong to the
    // newly chosen category — otherwise the next step would claim a
    // hidden selection.
    if (state.connector && CONNECTORS[state.connector]?.category !== id) {
      set("connector", null);
    }
  };

  return (
    <>
      <div className="step-eyebrow">Step 1 · Source category</div>
      <h1 className="step-title">What kind of source are you ingesting from?</h1>
      <p className="step-desc">
        We'll narrow the connector list in the next step to fit the category you pick here.
      </p>
      <div className="tile-grid compact-2x2">
        {CONNECTOR_CATEGORIES.map((cat) => {
          const sel = state.connectorCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`tile ${sel ? "selected" : ""}`}
              onClick={() => pick(cat.id)}
              aria-pressed={sel}
            >
              <span className="tile-check" aria-hidden>
                <Icon name="check" size={12} strokeWidth={2.5} />
              </span>
              <div className="tile-head">
                <span className="tile-icon"><Icon name={cat.icon} size={22} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tile-label">{cat.label}</div>
                  <div className="tile-cat">{cat.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepConnector({ state, set }) {
  const filtered = useMemo(() => {
    if (!state.connectorCategory) return [];
    return Object.entries(CONNECTORS).filter(
      ([, c]) => c.category === state.connectorCategory
    );
  }, [state.connectorCategory]);

  const activeCat = CONNECTOR_CATEGORIES.find((c) => c.id === state.connectorCategory);

  return (
    <>
      <div className="step-eyebrow">
        Step 2 · {activeCat?.label || "Source"} connector
      </div>
      <h1 className="step-title">Pick the source you want to ingest</h1>
      <p className="step-desc">
        {activeCat
          ? `Choose a ${activeCat.label.toLowerCase()} — we'll tailor every downstream check to it.`
          : "Pick the connector — every downstream check is tailored to your choice."}
      </p>
      {filtered.length === 0 ? (
        <div className="empty">No connectors in this category yet. Go back and pick a different one.</div>
      ) : (
        <div className="tile-grid">
          {filtered.map(([id, c]) => {
            const sel = state.connector === id;
            return (
              <button
                key={id}
                className={`tile ${sel ? "selected" : ""}`}
                onClick={() => set("connector", id)}
                aria-pressed={sel}
              >
                <span className="tile-check" aria-hidden>
                  <Icon name="check" size={12} strokeWidth={2.5} />
                </span>
                <div className="tile-head">
                  <span className="tile-icon"><Icon name={c.icon} size={22} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tile-label">{c.label}</div>
                    <div className="tile-cat-row">
                      <span className="tile-cat">{c.category}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                </div>
                <div className="tile-meta">
                  <div className="tile-meta-row"><span>Default ports</span><b>{c.defaultPorts.join(", ")}</b></div>
                  <div className="tile-meta-row"><span>Auth</span><b>{c.authMethods[0]}{c.authMethods.length > 1 ? ` +${c.authMethods.length - 1}` : ""}</b></div>
                  {c.cdcMethod && <div className="tile-meta-row"><span>CDC</span><b>{c.cdcMethod}</b></div>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

function StepCloud({ state, set }) {
  return (
    <>
      <div className="step-eyebrow">Step 3 · Workspace cloud</div>
      <h1 className="step-title">Where does your Databricks workspace live?</h1>
      <p className="step-desc">
        Used to scope cloud-specific networking guidance (NCC, Private Endpoint, NAT egress, etc).
      </p>
      <div className="tile-grid compact">
        {CLOUDS.map((c) => {
          const sel = state.cloud === c.id;
          return (
            <button
              key={c.id}
              className={`tile tint-${c.id} ${sel ? "selected" : ""}`}
              onClick={() => set("cloud", c.id)}
              aria-pressed={sel}
            >
              <span className="tile-check" aria-hidden><Icon name="check" size={12} strokeWidth={2.5} /></span>
              <div className="tile-head">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tile-label">{c.label}</div>
                  <div className="tile-cat">{c.hint}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepSource({ state, set, conn }) {
  const isSaaS = conn?.category === "SaaS";
  return (
    <>
      <div className="step-eyebrow">Step 4 · Source location</div>
      <h1 className="step-title">Where does the source system run?</h1>
      <p className="step-desc">
        {isSaaS
          ? `${conn.label} is a SaaS service, so we've auto-selected internet-hosted connectivity.`
          : "This drives which network topology options are available in the next step."}
      </p>
      <div className="option-list" style={{ maxWidth: 720 }}>
        {SOURCE_LOCATIONS.map((loc) => {
          const sel = state.sourceLocation === loc.id;
          const disabled = isSaaS && loc.id !== "saas";
          return (
            <button
              key={loc.id}
              className={`option ${sel ? "selected" : ""}`}
              onClick={() => !disabled && set("sourceLocation", loc.id)}
              aria-pressed={sel}
              disabled={disabled}
              style={disabled ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
            >
              <span className="option-icon"><Icon name={loc.icon} size={18} /></span>
              <div className="option-text">
                <div className="opt-label">{loc.label}</div>
                <div className="opt-desc">{loc.desc}</div>
              </div>
              <span className="option-radio" />
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepNetwork({ state, set, models }) {
  return (
    <>
      <div className="step-eyebrow">Step 5 · Connectivity</div>
      <h1 className="step-title">How will Databricks reach the source?</h1>
      <p className="step-desc">
        Only the topologies compatible with your source location are shown.
      </p>
      <div className="option-list" style={{ maxWidth: 720 }}>
        {models.length === 0 && <div className="empty">Select a source location first.</div>}
        {models.map((id) => {
          const m = NETWORK_MODELS[id];
          const sel = state.networkModel === id;
          return (
            <button
              key={id}
              className={`option ${sel ? "selected" : ""}`}
              onClick={() => set("networkModel", id)}
              aria-pressed={sel}
            >
              <span className="option-icon"><Icon name={m.icon} size={18} /></span>
              <div className="option-text">
                <div className="opt-label">{m.label}</div>
                <div className="opt-desc">{m.desc}</div>
              </div>
              <span className="option-radio" />
            </button>
          );
        })}
      </div>

      <div className="field-group" style={{ marginTop: 28 }}>
        <div className="field">
          <label htmlFor="srcHost">Source hostname / FQDN <span className="field-optional">(optional, used for Network Doctor handoff)</span></label>
          <input
            id="srcHost"
            type="text"
            placeholder="e.g. mydb.abc123.us-east-1.rds.amazonaws.com"
            value={state.sourceHost}
            onChange={(e) => set("sourceHost", e.target.value)}
          />
          <div className="field-hint">If provided, we'll generate a ready-to-paste set of endpoints + DNS lookups for the Network Doctor.</div>
        </div>
      </div>
    </>
  );
}

function StepAuth({ state, set, conn }) {
  if (!conn) return null;
  return (
    <>
      <div className="step-eyebrow">Step 6 · Authentication</div>
      <h1 className="step-title" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        How will Databricks authenticate to {conn.label}?
        <StatusBadge status={conn.status} />
      </h1>
      <p className="step-desc">
        Only the methods supported by this connector are shown.
        {conn.docsUrl && <> · <a href={conn.docsUrl} target="_blank" rel="noreferrer" className="doc-link">Docs ↗</a></>}
      </p>
      <div className="option-list" style={{ maxWidth: 720 }}>
        {conn.authMethods.map((m) => {
          const sel = state.authMethod === m;
          return (
            <button key={m} className={`option ${sel ? "selected" : ""}`} onClick={() => set("authMethod", m)} aria-pressed={sel}>
              <span className="option-icon"><Icon name="key" size={18} /></span>
              <div className="option-text">
                <div className="opt-label">{m}</div>
                <div className="opt-desc">{authBlurb(m, conn)}</div>
              </div>
              <span className="option-radio" />
            </button>
          );
        })}
      </div>
    </>
  );
}

function authBlurb(m, conn) {
  switch (m) {
    case "OAuth 2.0": return "Standard OAuth — register a Connected App / OAuth client.";
    case "OAuth M2M": return "Machine-to-machine via Entra ID client credentials.";
    case "Entra ID (AAD)": return "Microsoft Entra ID identity (managed identity or app registration).";
    case "SQL Auth": return "Native SQL Server username/password.";
    case "Database Auth": return "Native database username/password.";
    case "ISU Credentials": return "Workday Integration System User credentials.";
    case "Service Account Key": return "GCP Service Account JSON key.";
    case "Basic Auth": return "Basic HTTP authentication (username/password).";
    case "OAuth 2.0 (App Registration)": return "Microsoft Graph OAuth via an Entra ID app registration.";
    default: return `Authenticate to ${conn.label} using ${m}.`;
  }
}

/* ───────── RESULTS ───────── */

function StepResults({
  state,
  checklist,
  checked,
  setChecked,
  expanded,
  setExpanded,
  filter,
  setFilter,
  checkedCount,
  total,
  blockerCount,
  highCount,
  onReset,
}) {
  const conn = CONNECTORS[state.connector];
  const cloud = CLOUDS.find((c) => c.id === state.cloud);
  const loc = SOURCE_LOCATIONS.find((s) => s.id === state.sourceLocation);
  const net = NETWORK_MODELS[state.networkModel];
  const doctor = genDoctorParams(state);

  const filteredChecklist = useMemo(() => {
    return checklist
      .map((cat) => ({
        ...cat,
        checks: cat.checks.filter((c) => filter === "all" || c.priority === filter),
      }))
      .filter((cat) => cat.checks.length > 0);
  }, [checklist, filter]);

  // Counts of remaining items by priority across the whole checklist
  const exportSummary = useMemo(() => {
    let total = 0, done = 0, blockerRem = 0, highRem = 0;
    checklist.forEach((cat) => {
      cat.checks.forEach((c, i) => {
        total++;
        const isDone = !!checked[checkRowKey(cat.category, i, c.text)];
        if (isDone) done++;
        else if (c.priority === "blocker") blockerRem++;
        else if (c.priority === "high") highRem++;
      });
    });
    return { total, done, blockerRem, highRem, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [checklist, checked]);

  const downloadMd = () => {
    const lines = [];
    lines.push(`# Lakeflow Connect Pre-Flight Checklist`);
    lines.push("");
    lines.push(`**Connector:** ${conn?.label}`);
    lines.push(`**Cloud:** ${cloud?.label}`);
    lines.push(`**Source location:** ${loc?.label}`);
    lines.push(`**Network model:** ${net?.label}`);
    lines.push(`**Auth:** ${state.authMethod}`);
    lines.push(`**Generated:** ${new Date().toLocaleString()}`);
    lines.push("");
    checklist.forEach((cat) => {
      lines.push(`## ${cat.category}`);
      lines.push("");
      cat.checks.forEach((c, i) => {
        const isDone = !!checked[checkRowKey(cat.category, i, c.text)];
        const box = isDone ? "[x]" : "[ ]";
        lines.push(`- ${box} **[${c.priority.toUpperCase()}]** ${c.text}`);
        if (c.detail) lines.push(`    > ${c.detail}`);
        if (c.code) {
          lines.push("");
          lines.push("    ```" + c.code.lang);
          c.code.body.split("\n").forEach((ln) => lines.push("    " + ln));
          lines.push("    ```");
        }
      });
      lines.push("");
    });
    const { total, done, blockerRem, highRem, pct } = exportSummary;
    lines.push(`## Summary`);
    lines.push("");
    lines.push(`- **Completed:** ${done}/${total} (${pct}%)`);
    lines.push(`- **Remaining blockers:** ${blockerRem}`);
    lines.push(`- **Remaining high priority:** ${highRem}`);
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lakeflow-checklist-${state.connector}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    buildPdf({
      jsPDF, conn, cloud, loc, net, state, checklist, checked,
      summary: exportSummary,
    }).save(`lakeflow-checklist-${state.connector}.pdf`);
  };

  const copyDoctor = () => {
    if (!doctor) return;
    navigator.clipboard.writeText(JSON.stringify(doctor, null, 2));
  };

  return (
    <>
      <div className="step-eyebrow">Results</div>
      <h1 className="step-title">Your Lakeflow Connect pre-flight plan</h1>
      <p className="step-desc">
        Tailored checklist across identity, networking, workspace, source-system prep, and security. Tick off as you go.
      </p>

      <div className="results-summary">
        <div className="summary-card">
          <div className="label">Connector</div>
          <div className="value">
            {conn && <span className="icon"><Icon name={conn.icon} size={18} /></span>}
            <span style={{ flex: 1 }}>{conn?.label}</span>
            {conn?.status && <StatusBadge status={conn.status} />}
          </div>
        </div>
        <div className="summary-card">
          <div className="label">Topology</div>
          <div className="value">
            {net && <span className="icon"><Icon name={net.icon} size={18} /></span>}
            {net?.label}
          </div>
        </div>
        <div className="summary-card">
          <div className="label">Total checks</div>
          <div className="value">{total}</div>
        </div>
        <div className="summary-card">
          <div className="label">Blockers · High</div>
          <div className="value" style={{ gap: 10 }}>
            <span style={{ color: "var(--prio-blocker)" }}>{blockerCount}</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span style={{ color: "var(--prio-high)" }}>{highCount}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="label">Progress</div>
          <div className="value">
            {checkedCount}/{total}
            <div style={{
              flex: 1,
              height: 6,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 999,
              overflow: "hidden",
              marginLeft: 8,
            }}>
              <div style={{
                height: "100%",
                width: `${total ? (checkedCount / total) * 100 : 0}%`,
                background: "var(--accent)",
                transition: "width 220ms ease",
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          {[
            ["all", "All"],
            ["blocker", "Blockers"],
            ["high", "High"],
            ["medium", "Medium"],
          ].map(([id, label]) => {
            const count = id === "all" ? total : checklist.flatMap((c) => c.checks).filter((c) => c.priority === id).length;
            return (
              <button key={id} className={`chip ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>
                {label} <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>

      </div>

      {filteredChecklist.length === 0 && (
        <div className="empty">No checks match the current filter.</div>
      )}

      {filteredChecklist.map((cat, ci) => {
        const isOpen = expanded[cat.category] !== false; // default open
        const total = cat.checks.length;
        const done = cat.checks.filter((c, i) => checked[checkRowKey(cat.category, i, c.text)]).length;
        const pct = total ? (done / total) * 100 : 0;
        return (
          <div className="section" key={cat.category}>
            <button
              className="section-head"
              onClick={() => setExpanded((e) => ({ ...e, [cat.category]: !isOpen }))}
              aria-expanded={isOpen}
            >
              <div className="section-head-left">
                <span className="section-icon"><Icon name={cat.icon} size={16} /></span>
                <div>
                  <div className="section-title">{cat.category}</div>
                  <div className="section-meta">{done}/{total} complete</div>
                </div>
              </div>
              <div className="section-progress">
                <div className="section-progress-bar">
                  <div className="section-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="section-progress-text">{Math.round(pct)}%</div>
                <Caret open={isOpen} />
              </div>
            </button>
            {isOpen && (
              <div className="section-body">
                {[...cat.checks]
                  .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 5) - (PRIORITY_ORDER[b.priority] ?? 5))
                  .map((c, i) => {
                    const key = checkRowKey(cat.category, i, c.text);
                    const isChecked = !!checked[key];
                    return (
                      <div key={key} className={`check-row ${isChecked ? "checked" : ""}`}>
                        <button
                          className="check-box"
                          onClick={() => setChecked((s) => ({ ...s, [key]: !s[key] }))}
                          aria-checked={isChecked}
                          role="checkbox"
                          aria-label={c.text}
                        >
                          {isChecked && <Icon name="check" size={12} strokeWidth={2.5} />}
                        </button>
                        <div className="check-content">
                          <div className="check-text">
                            {c.text}
                            {c.docsUrl && (
                              <a
                                href={c.docsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="check-doc-link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Docs <Icon name="arrowRight" size={11} />
                              </a>
                            )}
                          </div>
                          {c.detail && <div className="check-detail">{c.detail}</div>}
                          {c.code && <CodeBlock code={c.code} />}
                        </div>
                        <PriorityBadge priority={c.priority} />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}

      {doctor && doctor.endpoints.length > 0 && (
        <div className="doctor">
          <div className="doctor-head">
            <div className="doctor-icon"><Icon name="stethoscope" size={18} /></div>
            <div>
              <div className="doctor-title">Network Doctor handoff</div>
              <div className="doctor-sub">Paste this into the Network Doctor notebook to validate connectivity from the workspace.</div>
            </div>
            <button className="btn-mini" style={{ marginLeft: "auto" }} onClick={copyDoctor}>
              <Icon name="clipboard" size={13} /> Copy JSON
            </button>
          </div>
          <div className="doctor-grid">
            <div className="doctor-item">
              <div className="label">Connector</div>
              <div className="value">{doctor.connector}</div>
            </div>
            <div className="doctor-item">
              <div className="label">Network model</div>
              <div className="value">{doctor.networkModel}</div>
            </div>
            <div className="doctor-item">
              <div className="label">Endpoints</div>
              <ul className="doctor-list">
                {doctor.endpoints.map((e, i) => (
                  <li key={i}><code>{e.host}:{e.port}</code> ({e.protocol})</li>
                ))}
              </ul>
            </div>
            <div className="doctor-item">
              <div className="label">DNS resolutions</div>
              <ul className="doctor-list">
                {doctor.dnsChecks.map((h, i) => (<li key={i}><code>{h}</code></li>))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="restart">
        <div className="restart-text">
          <div className="restart-title">Done with this connector?</div>
          <div className="restart-sub">
            Download your checklist, or start over to assess a different source.
          </div>
        </div>
        <div className="restart-actions">
          <DownloadMenu onMarkdown={downloadMd} onPdf={downloadPdf} />
          <button className="btn btn-primary btn-lg" onClick={onReset}>
            <Icon name="restart" size={16} /> Restart questionnaire
          </button>
        </div>
      </div>
    </>
  );
}

function DownloadMenu({ onMarkdown, onPdf }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="download-menu" ref={ref}>
      <button
        className="btn btn-primary btn-lg"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="download" size={16} /> Download
        <Icon name="chevronDown" size={14} />
      </button>
      {open && (
        <div className="download-menu-pop" role="menu">
          <button
            role="menuitem"
            className="download-menu-item"
            onClick={() => { onMarkdown(); setOpen(false); }}
          >
            <Icon name="fileText" size={16} />
            <div>
              <div className="download-menu-label">Markdown</div>
              <div className="download-menu-desc">Editable plain-text format</div>
            </div>
          </button>
          <button
            role="menuitem"
            className="download-menu-item"
            onClick={() => { onPdf(); setOpen(false); }}
          >
            <Icon name="fileText" size={16} />
            <div>
              <div className="download-menu-label">PDF</div>
              <div className="download-menu-desc">Print-ready, share with stakeholders</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// Build a real PDF document with jsPDF — produces a true file download
// (not a print preview). Layout is flowing, with page breaks handled
// automatically when y exceeds the bottom margin.
function buildPdf({ jsPDF, conn, cloud, loc, net, state, checklist, checked, summary }) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  // Page geometry
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - margin * 2;
  let y = margin;

  const PRIO_FILL = {
    blocker: [254, 226, 226], high: [254, 243, 199], medium: [219, 234, 254],
    low:     [209, 250, 229], info: [229, 231, 235],
  };
  const PRIO_TEXT = {
    blocker: [153, 27, 27], high: [146, 64, 14], medium: [30, 64, 175],
    low:     [6, 95, 70],   info: [55, 65, 81],
  };

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawText = (text, opts = {}) => {
    const {
      size = 10, style = "normal", color = [17, 24, 39], indent = 0,
      lineGap = 4, maxW = contentW - indent,
    } = opts;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text ?? ""), maxW);
    const lineH = size * 1.25;
    lines.forEach((line) => {
      ensureSpace(lineH);
      doc.text(line, margin + indent, y + lineH * 0.8);
      y += lineH;
    });
    y += lineGap;
  };

  const drawHr = () => {
    ensureSpace(8);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentW, y);
    y += 8;
  };

  const drawCheckbox = (x, cy, checked) => {
    doc.setDrawColor(107, 114, 128);
    doc.setLineWidth(0.6);
    doc.rect(x, cy, 9, 9);
    if (checked) {
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(1.2);
      doc.line(x + 1.5, cy + 4.5, x + 4, cy + 7.5);
      doc.line(x + 4, cy + 7.5, x + 8, cy + 2);
    }
  };

  const drawPrioPill = (priority, x, cy) => {
    const label = priority.toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    const w = doc.getTextWidth(label) + 8;
    const fill = PRIO_FILL[priority] || PRIO_FILL.info;
    const text = PRIO_TEXT[priority] || PRIO_TEXT.info;
    doc.setFillColor(...fill);
    doc.roundedRect(x, cy, w, 11, 2, 2, "F");
    doc.setTextColor(...text);
    doc.text(label, x + 4, cy + 7.8);
    return w;
  };

  // ── Header ─────────────────────────────────────────
  drawText("Lakeflow Connect Pre-Flight Checklist", { size: 18, style: "bold", lineGap: 2 });
  drawText(
    `${conn?.label || "—"} · ${cloud?.label || "—"} · ${net?.label || "—"}`,
    { size: 10, color: [107, 114, 128], lineGap: 12 }
  );

  // Metadata table
  const metaRows = [
    ["Connector", `${conn?.label || "—"}${conn?.status ? `  (${conn.status})` : ""}`],
    ["Cloud", cloud?.label || "—"],
    ["Source location", loc?.label || "—"],
    ["Network model", net?.label || "—"],
    ["Auth", state.authMethod || "—"],
    ["Generated", new Date().toLocaleString()],
  ];
  metaRows.forEach(([k, v]) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(k, margin, y + 9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);
    const lines = doc.splitTextToSize(String(v), contentW - 120);
    lines.forEach((ln, i) => {
      if (i > 0) y += 12;
      doc.text(ln, margin + 110, y + 9);
    });
    y += 14;
  });
  y += 8;
  drawHr();

  // ── Sections ───────────────────────────────────────
  checklist.forEach((cat) => {
    ensureSpace(28);
    drawText(cat.category, { size: 13, style: "bold", lineGap: 6 });
    cat.checks.forEach((c, i) => {
      const isDone = !!checked[checkRowKey(cat.category, i, c.text)];

      // Estimate height to keep one check together if possible
      const textLines = doc.splitTextToSize(c.text, contentW - 90).length;
      const detailLines = c.detail
        ? doc.splitTextToSize(c.detail, contentW - 18).length
        : 0;
      const codeLines = c.code ? c.code.body.split("\n").length : 0;
      const approxH =
        textLines * 12 + detailLines * 11 + codeLines * 9 + 18;
      ensureSpace(Math.min(approxH, pageH - margin * 2));

      // Checkbox + priority pill + title
      const rowTop = y;
      drawCheckbox(margin, rowTop + 2, isDone);
      const pillX = margin + 16;
      const pillW = drawPrioPill(c.priority, pillX, rowTop + 1);

      // Title text wraps after the pill
      const titleX = pillX + pillW + 6;
      const titleMaxW = contentW - (titleX - margin);
      doc.setFont("helvetica", isDone ? "normal" : "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(isDone ? 107 : 17, isDone ? 114 : 24, isDone ? 128 : 39);
      const titleLines = doc.splitTextToSize(c.text, titleMaxW);
      titleLines.forEach((line, idx) => {
        doc.text(line, titleX, rowTop + 9 + idx * 12);
      });
      y = rowTop + Math.max(14, titleLines.length * 12 + 4);

      // Detail text
      if (c.detail) {
        drawText(c.detail, {
          size: 9, color: [75, 85, 99], indent: 16, lineGap: 4,
        });
      }

      // Code block
      if (c.code) {
        const codeFont = "courier";
        doc.setFont(codeFont, "normal");
        doc.setFontSize(8);
        const codeLines = c.code.body.split("\n").flatMap((ln) =>
          doc.splitTextToSize(ln || " ", contentW - 32)
        );
        const lineH = 10;
        const blockH = codeLines.length * lineH + 12;
        ensureSpace(blockH);
        doc.setFillColor(243, 244, 246);
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin + 16, y, contentW - 16, blockH, 3, 3, "FD");
        doc.setTextColor(17, 24, 39);
        codeLines.forEach((line, idx) => {
          doc.text(line, margin + 24, y + 9 + idx * lineH);
        });
        y += blockH + 6;
      }

      y += 4;
    });
    y += 6;
  });

  // ── Summary ────────────────────────────────────────
  drawHr();
  drawText("Summary", { size: 13, style: "bold", lineGap: 6 });
  drawText(
    `Completed: ${summary.done} / ${summary.total}  (${summary.pct}%)`,
    { size: 10.5, lineGap: 2 }
  );
  drawText(
    `Remaining blockers: ${summary.blockerRem}`,
    { size: 10.5, color: PRIO_TEXT.blocker, lineGap: 2 }
  );
  drawText(
    `Remaining high priority: ${summary.highRem}`,
    { size: 10.5, color: PRIO_TEXT.high, lineGap: 2 }
  );

  return doc;
}

function CodeBlock({ code }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const lineCount = (code.body.match(/\n/g) || []).length + 1;
  const firstLine = code.body.split("\n").find((l) => l.trim()) || "";

  const onCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className={`code ${open ? "code-open" : ""}`}>
      <button
        type="button"
        className="code-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="code-head-left">
          <Caret open={open} />
          <span className="code-lang">{code.lang}</span>
          {!open && (
            <span className="code-preview">{firstLine}{lineCount > 1 ? ` … (${lineCount} lines)` : ""}</span>
          )}
        </span>
        <span className="code-copy" onClick={onCopy} role="button" tabIndex={0}>
          {copied ? (
            <><Icon name="check" size={12} strokeWidth={2.5} /> Copied</>
          ) : (
            <><Icon name="clipboard" size={12} /> Copy</>
          )}
        </span>
      </button>
      {open && <pre className="code-body"><code>{code.body}</code></pre>}
    </div>
  );
}
