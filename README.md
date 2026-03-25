# Follow-Up Management System

## Contexts

- [catalog-context.tsx](context/catalog-context.tsx) - Catalog data management
- [follow-up-context.tsx](context/follow-up-context.tsx) - Follow-up state management
- [meta-templates-context.tsx](context/meta-templates-context.tsx) - WhatsApp template caching
- [sidebar-context.ts](context/sidebar-context.ts) - Sidebar UI state
- [templates-context.tsx](context/templates-context.tsx) - Template selection and parameters
- [user-context.tsx](context/user-context.tsx) - User authentication and session

---

Diagram with visual data flow
https://miro.com/app/board/uXjVJMUWVvA=/

## Page: Follow Up Details (`FollowUpDetailsPage.tsx`)

This document outlines the architecture and key dependencies for the follow-up details and editing page.

### Workflow / Logic

1.  On page load, the component first validates the session by calling `getValidToken()`.
2.  While initial data is being fetched, a `LoadingSkeleton` component is displayed to the user.
3.  The page makes several API calls (`getEventRule`, `getSubChannels`, etc.) to fetch the necessary data.
4.  The fetched data is managed and stored using dedicated Zustand/Redux stores.
5.  Once all required data is loaded, the main `FollowUpEditPage` component is rendered, allowing the user to view and edit the details.

---

### 🟢 State Management (Stores)

This page connects to the following state management stores to handle application-wide and local state:

- **`useUserStore`**: Manages general user information and permissions.
- **`useFollowUpStore`**: Handles the state specific to the follow-up data being viewed or edited.
- **`useMetaTemplatesStore`**: Stores metadata and templates used for dynamic form fields.
- **`useTemplateSelectionStore`**: Manages the state of the user's template selections within the page.

---

### 🔴 API Calls (Fetch Requests)

The page relies on the following asynchronous functions to fetch data from the server:

- **`getValidToken()`**: Checks if the user's authentication token is still valid before proceeding.
- **`getEventRule(token, ruleId)`**: Fetches the specific business rules associated with the event.
- **`getSubChannels(token)`**: Retrieves a list of available sub-channels for notifications or events.
- **`getEventTypes(token)`**: Gets all possible event types to populate selection fields.

---

### 🟡 Main Rendered Components

The page conditionally renders one of the following primary components:

- **`FollowUpEditPage`**: The main component containing the form and logic for viewing and editing the follow-up details. It is displayed after all data has been successfully fetched.
- **`LoadingSkeleton`**: A placeholder UI that is shown while the initial data is being fetched from the API.

---

## Page: Follow Up Main Page (`FollowUpPage.tsx`)

This document outlines the architecture and dependencies for the main follow-ups listing page, which serves as the entry point for viewing, adding, and deleting follow-up items.

### Workflow / Logic

1.  The page initializes by validating the user's session with `getValidToken()`.
2.  A `LoadingSkeleton` is displayed while the initial list of follow-ups is fetched via the `fetchFollowUps(token)` API call.
3.  Simultaneously, it fetches related metadata like event rules, types, and templates required for the page's functionality (e.g., populating forms in modals).
4.  All relevant data is loaded into the `useFollowUpStore` and other stores for state management.
5.  Once the data is loaded, the `FollowUpsTable` is rendered, displaying the list of follow-ups.
6.  User actions like adding, deleting, or viewing details trigger their respective modals (`AddFollowUpModal`, `DeleteFollowUpModal`, `DetailsModal`).

---

### 🟢 State Management (Stores)

This page uses the following stores to manage its state and data:

- **`useUserStore`**: Handles global user data and authentication status.
- **`useFollowUpStore`**: Manages the state for the list of follow-ups, including loading status, and controls the visibility of the various modals.

---

### 🔴 API Calls (Fetch Requests)

The page makes these API calls to fetch and manage its data:

- **`getValidToken()`**: Verifies the user's authentication token on page load.
- **`fetchFollowUps(token)`**: Retrieves the main list of all follow-up items to display in the table.
- **`getStoredMetaTemplates(token)`**: Fetches metadata templates used within the modals.
- **`getEventRules(token)`**: Gets all event rules, likely for filtering or for use in the "Add/Edit" modal.
- **`getEventTypes(token)`**: Retrieves the different types of events available.
- **`getChatwootWhatsapp(token)`**: Fetches WhatsApp integration data from Chatwoot.

---

### 🟡 Main Components & Modals

The page is composed of the following key UI elements:

- **`FollowUpsTable`**: The primary component that displays the list of all follow-up items.
- **`LoadingSkeleton`**: A placeholder UI shown while the initial data is being fetched.
- **`AddFollowUpModal`**: A modal window containing a form to create a new follow-up.
- **`DeleteFollowUpModal`**: A confirmation modal that appears when a user attempts to delete a follow-up.
- **`DetailsModal`**: A modal used to display the detailed information of a selected follow-up item.

# Front modified types

```js
export type EventRules = {
  custom_params?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  event_type?: string | EventTypes | null;
  id: string;
  name?: string | null;
  offset_minutes?: number | null;
  sub_channel: any[] | EventRulesSubChannel[];
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  custom_params: {} | Record<string, any>;
};

export type Products = {
  availability?: string | null;
  brand?: string | null;
  category?: string | null;
  currency?: string | null;
  custom_attributes?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  description?: string | null;
  id: string;
  images: any[] | ProductsFiles[];
  link?: string | null;
  price?: number | null;
  sku?: string | null;
  tags?: unknown | null;
  title: string;
  unit?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Catalogs = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  json_schema: Record<string, any>;
  json_data: Record<string, any>[];
  name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};
```
