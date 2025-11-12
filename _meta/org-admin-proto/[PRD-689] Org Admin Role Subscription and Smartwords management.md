# [PRD-689] Org Admin Role: Subscription and Smartwords management

Owner: Anton Kulikov
Last edited time: November 12, 2025 4:08 PM

Context:

- [SUPPORT-9272](https://portal.smartcat.ai/youtrack/issue/SUPPORT-9272) Word Rollover Request for Entrusted Word Ministries

Links:

- Pre-requisite for: [[PRD-690] Multi-Org Admin Role (Reseller case)](https://www.notion.so/PRD-690-Multi-Org-Admin-Role-Reseller-case-2a99370c2095818cb667c8dd01fc275b?pvs=21)
- Depends on: [[PRD-689-1] Org Admin Role: AuthZ requirements](https://www.notion.so/PRD-689-1-Org-Admin-Role-AuthZ-requirements-2a99370c209580baab05ee1538afd2d1?pvs=21)

Slack: #

---

<aside>
📎

To enable Enterprise organizations to self-manage subscriptions and Smartwords across their internal workspaces, Smartcat will introduce a dedicated **Organization Admin Role**.

This is the foundation of cross-organization management (later used by the Multi-Org Admin / Reseller case) and other [Enterprise-grade features](https://www.notion.so/658aeff8244b41bfb9b4e36e13be6a7a?pvs=21) our customers expect from the platform.

</aside>

---

| Role | Position | Person |
| --- | --- | --- |
| Accountable | **Product Manager** | @Anton Kulikov  |
| Responsible | Product Manager, Product Designer, Technical Lead | @Anton Kulikov @Artem Politov @Marina Gofman  |
| Consulted | Key stakeholders |  |
| Informed | Other stakeholders |  |

# Why/What/How

## **Context**

Even though we introduced org-level Subscriptions and Smartwords packages (with an option to share them with new and existing workspaces) Enterprise clients with multiple workspaces still cannot redistribute Smartwords across workspaces and limit their consumption. 

---

## **Problem / Opportunity**

Enterprise clients lack a way to centrally manage subscriptions and Smartwords across their workspaces. This leads to inefficient usage, unnecessary upgrades, and manual support interventions.

Introducing an Org Admin Role will:

- Unblock organization-wide Smartwords allocation.
- Reduce manual Support workload.
- Establish the base layer for future multi-organization and reseller functionality.

---

## **Solution**

Implement an **Org Admin Role** with the following capabilities inside a single organization:

1. **Manage Smartwords Packages**
    - View total org-level Smartwords balance.
    - Allocate or reclaim Smartwords between the organization and its workspaces (bi-directional flow).
    - Allow workspaces to consume from a shared org-level pool.
2. **Manage Subscription Visibility**
    - View organization-level subscription details (plan, term, limits).
    - Pause or resume workspace access to shared subscription benefits.

---

# Requirements

**Lifecycle Behavior**

- The Org Admin Role is available only for Enterprise-tier orgs.
- When the Enterprise subscription expires, Org Admin permissions are automatically paused until renewal.

## **Business Requirements**

**BS-1 Org Admin Assignment and Permissions**

- Allow Smartcat employee to assign an ORG_ADMIN role to a user within an organization.
- Role is active only for Enterprise-tier organizations.
- Permissions: access to Subscription Service + Consumables Service endpoints.

**BS-2 Role Lifecycle Control**

- On Enterprise subscription expiry, Org Admin access is suspended.

---

## **User Stories**

- **US-1 View Organization Summary**
    
    As an Org Admin, I want to see my organization’s subscription and Smartwords status.
    
    **Given** I have an Org Admin role in an Enterprise org
    
    **When** I open the Organization Management page
    
    **Then** I see org name, logo, current plan, and org-level Smartwords balance
    
    **AC-1:** Page shows the current Subscription name, end date.
    
    **AC-1:** Page shows the org-level Smartwords package state.
    
    **AC-2:** Page shows the full workspace list and each workspace’s package allocation and remaining SMWs.
    

- **US-2 Allocate Smartwords to Workspace**
    
    **As an** Org Admin I want to allocate Smartwords to a workspace.
    
    **Given** I have an available balance
    
    **When** I confirm the transfer
    
    **Then** the workspace balance increases, and the org balance decreases
    
    **AC:** Transfer record logged; balances updated immediately.
    

- **US-3 Reclaim Smartwords from Workspace**
    
    As an Org Admin I want to reclaim unused Smartwords
    
    **Given** the workspace has remaining Smartwords
    
    **When** I initiate reclaim
    
    **Then** the workspace balance decreases and org balance increases
    
    **AC:** Ledger reflects reclaimed amount.
    

- **US-4 Allocate Smartwords to Workspace**
    
    **As an** Org Admin, I want to allow all workspaces to use the shared subscription and Smartwords pool.
    
    **Given** I have an Org Admin role in an Enterprise org
    
    **When** I open the Organization Management page
    
    **Then** I can use controls to allow all new or set particular existing workspaces to use the shared subscription and org-level Smartwords package. 
    
    **AC-1:** Page shows the options to allow all new workspaces to use shared Subscription/SMWs
    
    **AC-1:** Each workspace in the list has a control to allow using shared Subscription/SMWs
    

---

## **Design Requirements**

<aside>
👉

https://www.figma.com/design/lof49ZjelayiQiD89Y8QTX/Organization-Management?node-id=2965-38039&t=UcUtZtkyTPA8CQss-4

</aside>

---

## **Technical Notes**

- Requires AUFZ (AuthZ) support for ORG_ADMIN role → [PRD-689-1].
    
    [[PRD-689-1] Org Admin Role: AuthZ requirements](https://www.notion.so/PRD-689-1-Org-Admin-Role-AuthZ-requirements-2a99370c209580baab05ee1538afd2d1?pvs=21)
    

- Extend Smartwords Service to support org↔workspace transfer logic.
- Add transactional ledger table for SMW allocations/reclaims.
- Integrate subscription status check to pause role on expiry.

---

# **Results and Tracking**

**Success metrics:**

- 

---

# **Next Steps**

[[PRD-690] Multi-Org Admin Role (Reseller case)](https://www.notion.so/PRD-690-Multi-Org-Admin-Role-Reseller-case-2a99370c2095818cb667c8dd01fc275b?pvs=21)