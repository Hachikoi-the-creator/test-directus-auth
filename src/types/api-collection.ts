export type AIAgents = {
  catalog?: string | Catalogs | null;
  date_created?: string | null;
  date_updated?: string | null;
  Files: any[] | AIAgentsFiles[];
  id: string;
  images: any[] | AIAgentsFiles1[];
  llm_model?: string | null;
  Name?: string | null;
  post_workflow_id?: string | null;
  System_Prompt?: string | SystemPrompts | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  vector_store?: string | null;
  workflow_id?: string | null;
};

export type AIAgentsFiles = {
  AI_Agents_id?: string | AIAgents | null;
  directus_files_id?: string | DirectusFiles | null;
  id: number;
  vector_store_file_id?: string | null;
  vectorized?: boolean | null;
};

export type AIAgentsFiles1 = {
  AI_Agents_id?: string | AIAgents | null;
  description?: string | null;
  directus_files_id?: string | DirectusFiles | null;
  id: number;
  title?: string | null;
};

export type AIAgentsProducts = {
  AI_Agents_id?: string | AIAgents | null;
  id: number;
};

export type Campaigns = {
  campaign_name?: string | null;
  company?: string | Companies | null;
  contacts: any[] | CampaignsContacts[];
  custom_attributes?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type CampaignsContacts = {
  campaigns_id?: string | Campaigns | null;
  contacts_id?: string | Contacts | null;
  id: number;
};

export type Chatwoot = {
  chatwoot_id?: number | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  name?: string | null;
  owner?: string | DirectusUsers | null;
  sub_channels: any[] | ChatwootSubChannels[];
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  waba?: string | null;
};

export type ChatwootSubChannels = {
  chatwoot_id?: string | Chatwoot | null;
  id: number;
  sub_channel?: string | null;
  sub_channel_id?: string | any | null;
};

export type ChawootWhatsapp = {
  ai_agent?: string | AIAgents | null;
  api_key?: string | null;
  custom_attributes?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  inbox_id?: number | null;
  name?: string | null;
  owner?: string | DirectusUsers | null;
  phone_number?: string | null;
  phone_number_id?: string | null;
  pin_code?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Companies = {
  account_name?: string | null;
  ai_agent?: string | AIAgents | null;
  channels: any[] | CompaniesChannels[];
  chatwoot_id?: string | null;
  custom_fields?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  instructions?: string | null;
  owner?: string | DirectusUsers | null;
  phone_numbers: any[] | PhoneNumbers[];
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  waba?: string | null;
  wabas: any[] | Wabas[];
};

export type CompaniesChannels = {
  channel?: string | null;
  channel_id?: string | any | null;
  companies_id?: string | Companies | null;
  id: number;
};

export type ContactSchema = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  schema?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Contacts = {
  assistant_phone?: number | PhoneNumbers | null;
  company?: string | Companies | null;
  custom_attributes?: unknown | null;
  custom_field?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  email?: string | null;
  id: string;
  inbox_id?: string | null;
  leads: any[] | Leads[];
  name?: string | null;
  phone?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type ContentTypes = {
  date_created?: string | null;
  date_updated?: string | null;
  description?: string | null;
  id: number;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Continental = {
  chatwoot_whatsapp?: string | ChawootWhatsapp | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_empresa?: number | null;
  motivo_resultado?: number | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusAccess = {
  id: string;
  policy: string | DirectusPolicies;
  role?: string | DirectusRoles | null;
  sort?: number | null;
  user?: string | DirectusUsers | null;
};

export type DirectusActivity = {
  action: string;
  collection: string;
  id: number;
  ip?: string | null;
  item: string;
  origin?: string | null;
  revisions: any[] | DirectusRevisions[];
  timestamp: string;
  user?: string | DirectusUsers | null;
  user_agent?: string | null;
};

export type DirectusCollections = {
  accountability?: string | null;
  archive_app_filter: boolean;
  archive_field?: string | null;
  archive_value?: string | null;
  collapse: string;
  collection: string;
  color?: string | null;
  display_template?: string | null;
  group?: string | DirectusCollections | null;
  hidden: boolean;
  icon?: string | null;
  item_duplication_fields?: unknown | null;
  note?: string | null;
  preview_url?: string | null;
  singleton: boolean;
  sort?: number | null;
  sort_field?: string | null;
  translations?: unknown | null;
  unarchive_value?: string | null;
  versioning: boolean;
};

export type DirectusComments = {
  collection: string | DirectusCollections;
  comment: string;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  item: string;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusDashboards = {
  color?: string | null;
  date_created?: string | null;
  icon: string;
  id: string;
  name: string;
  note?: string | null;
  panels: any[] | DirectusPanels[];
  user_created?: string | DirectusUsers | null;
};

export type DirectusExtensions = {
  bundle?: string | null;
  enabled: boolean;
  folder: string;
  id: string;
  source: string;
};

export type DirectusFields = {
  collection: string | DirectusCollections;
  conditions?: unknown | null;
  display?: string | null;
  display_options?: unknown | null;
  field: string;
  group?: string | DirectusFields | null;
  hidden: boolean;
  id: number;
  interface?: string | null;
  note?: string | null;
  options?: unknown | null;
  readonly: boolean;
  required?: boolean | null;
  searchable: boolean;
  sort?: number | null;
  special?: unknown | null;
  translations?: unknown | null;
  validation?: unknown | null;
  validation_message?: string | null;
  width?: string | null;
};

export type DirectusFiles = {
  charset?: string | null;
  created_on: string;
  description?: string | null;
  duration?: number | null;
  embed?: string | null;
  filename_disk?: string | null;
  filename_download: string;
  filesize?: number | null;
  focal_point_x?: number | null;
  focal_point_y?: number | null;
  folder?: string | DirectusFolders | null;
  height?: number | null;
  id: string;
  location?: string | null;
  metadata?: unknown | null;
  modified_by?: string | DirectusUsers | null;
  modified_on: string;
  storage: string;
  tags?: unknown | null;
  title?: string | null;
  tus_data?: unknown | null;
  tus_id?: string | null;
  type?: string | null;
  uploaded_by?: string | DirectusUsers | null;
  uploaded_on?: string | null;
  width?: number | null;
};

export type DirectusFlows = {
  accountability?: string | null;
  color?: string | null;
  date_created?: string | null;
  description?: string | null;
  icon?: string | null;
  id: string;
  name: string;
  operation?: string | DirectusOperations | null;
  operations: any[] | DirectusOperations[];
  options?: unknown | null;
  status: string;
  trigger?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type DirectusFolders = {
  id: string;
  name: string;
  parent?: string | DirectusFolders | null;
};

export type DirectusMigrations = {
  name: string;
  timestamp?: string | null;
  version: string;
};

export type DirectusNotifications = {
  collection?: string | null;
  id: number;
  item?: string | null;
  message?: string | null;
  recipient: string | DirectusUsers;
  sender?: string | DirectusUsers | null;
  status?: string | null;
  subject: string;
  timestamp?: string | null;
};

export type DirectusOperations = {
  date_created?: string | null;
  flow: string | DirectusFlows;
  id: string;
  key: string;
  name?: string | null;
  options?: unknown | null;
  position_x: number;
  position_y: number;
  reject?: string | DirectusOperations | null;
  resolve?: string | DirectusOperations | null;
  type: string;
  user_created?: string | DirectusUsers | null;
};

export type DirectusPanels = {
  color?: string | null;
  dashboard: string | DirectusDashboards;
  date_created?: string | null;
  height: number;
  icon?: string | null;
  id: string;
  name?: string | null;
  note?: string | null;
  options?: unknown | null;
  position_x: number;
  position_y: number;
  show_header: boolean;
  type: string;
  user_created?: string | DirectusUsers | null;
  width: number;
};

export type DirectusPermissions = {
  action: string;
  collection: string;
  fields?: unknown | null;
  id: number;
  permissions?: unknown | null;
  policy: string | DirectusPolicies;
  presets?: unknown | null;
  validation?: unknown | null;
};

export type DirectusPolicies = {
  admin_access: boolean;
  app_access: boolean;
  description?: string | null;
  enforce_tfa: boolean;
  icon: string;
  id: string;
  ip_access?: unknown | null;
  name: string;
  permissions: any[] | DirectusPermissions[];
  roles: any[] | DirectusAccess[];
  users: any[] | DirectusAccess[];
};

export type DirectusPresets = {
  bookmark?: string | null;
  collection?: string | null;
  color?: string | null;
  filter?: unknown | null;
  icon?: string | null;
  id: number;
  layout?: string | null;
  layout_options?: unknown | null;
  layout_query?: unknown | null;
  refresh_interval?: number | null;
  role?: string | DirectusRoles | null;
  search?: string | null;
  user?: string | DirectusUsers | null;
};

export type DirectusRelations = {
  id: number;
  junction_field?: string | null;
  many_collection: string;
  many_field: string;
  one_allowed_collections?: unknown | null;
  one_collection?: string | null;
  one_collection_field?: string | null;
  one_deselect_action: string;
  one_field?: string | null;
  sort_field?: string | null;
};

export type DirectusRevisions = {
  activity: number | DirectusActivity;
  collection: string;
  data?: unknown | null;
  delta?: unknown | null;
  id: number;
  item: string;
  parent?: number | DirectusRevisions | null;
  version?: string | DirectusVersions | null;
};

export type DirectusRoles = {
  children: any[] | DirectusRoles[];
  description?: string | null;
  icon: string;
  id: string;
  name: string;
  parent?: string | DirectusRoles | null;
  policies: any[] | DirectusAccess[];
  users: any[] | DirectusUsers[];
  users_group: string;
};

export type DirectusSessions = {
  expires: string;
  ip?: string | null;
  next_token?: string | null;
  origin?: string | null;
  share?: string | DirectusShares | null;
  token: string;
  user?: string | DirectusUsers | null;
  user_agent?: string | null;
};

export type DirectusSettings = {
  ai_group: string;
  auth_login_attempts?: number | null;
  auth_password_policy?: string | null;
  basemaps?: unknown | null;
  custom_aspect_ratios?: unknown | null;
  custom_css?: string | null;
  default_appearance: string;
  default_language: string;
  default_theme_dark?: string | null;
  default_theme_light?: string | null;
  id: number;
  mapbox_key?: string | null;
  mcp_allow_deletes: boolean;
  mcp_enabled: boolean;
  mcp_prompts_collection?: string | null;
  mcp_prompts_collection_validation: string;
  mcp_system_prompt?: string | null;
  mcp_system_prompt_enabled: boolean;
  module_bar?: unknown | null;
  org_name?: string | null;
  product_updates?: boolean | null;
  project_color: string;
  project_descriptor?: string | null;
  project_id?: string | null;
  project_logo?: string | DirectusFiles | null;
  project_name: string;
  project_owner?: string | null;
  project_status?: string | null;
  project_url?: string | null;
  project_usage?: string | null;
  public_background?: string | DirectusFiles | null;
  public_favicon?: string | DirectusFiles | null;
  public_foreground?: string | DirectusFiles | null;
  public_note?: string | null;
  public_registration: boolean;
  public_registration_email_filter?: unknown | null;
  public_registration_role?: string | DirectusRoles | null;
  public_registration_verify_email: boolean;
  report_bug_url?: string | null;
  report_error_url?: string | null;
  report_feature_url?: string | null;
  storage_asset_presets?: unknown | null;
  storage_asset_transform?: string | null;
  storage_default_folder?: string | DirectusFolders | null;
  theme_dark_overrides?: unknown | null;
  theme_light_overrides?: unknown | null;
  theming_group: string;
  visual_editor_urls?: unknown | null;
};

export type DirectusShares = {
  collection: string | DirectusCollections;
  date_created?: string | null;
  date_end?: string | null;
  date_start?: string | null;
  id: string;
  item: string;
  max_uses?: number | null;
  name?: string | null;
  password?: string | null;
  role?: string | DirectusRoles | null;
  times_used?: number | null;
  user_created?: string | DirectusUsers | null;
};

export type DirectusTranslations = {
  id: string;
  key: string;
  language: string;
  value: string;
};

export type DirectusUsers = {
  appearance?: string | null;
  auth_data?: unknown | null;
  avatar?: string | DirectusFiles | null;
  company?: string | Companies | null;
  description?: string | null;
  email?: string | null;
  email_notifications?: boolean | null;
  external_identifier?: string | null;
  first_name?: string | null;
  id: string;
  language?: string | null;
  last_access?: string | null;
  last_name?: string | null;
  last_page?: string | null;
  location?: string | null;
  password?: string | null;
  policies: any[] | DirectusAccess[];
  provider: string;
  role?: string | DirectusRoles | null;
  status: string;
  tags?: unknown | null;
  text_direction: string;
  tfa_secret?: string | null;
  theme_dark?: string | null;
  theme_dark_overrides?: unknown | null;
  theme_light?: string | null;
  theme_light_overrides?: unknown | null;
  title?: string | null;
  token?: string | null;
};

export type DirectusVersions = {
  collection: string | DirectusCollections;
  date_created?: string | null;
  date_updated?: string | null;
  delta?: unknown | null;
  hash?: string | null;
  id: string;
  item: string;
  key: string;
  name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusWebhooks = {
  actions: unknown;
  collections: unknown;
  data: boolean;
  headers?: unknown | null;
  id: number;
  method: string;
  migrated_flow?: string | DirectusFlows | null;
  name: string;
  status: string;
  url: string;
  was_active_before_deprecation: boolean;
};

export type EventRulesSubChannel<T> = {
  event_rules_id: null;
  id: number;
  sub_channel: string | null;
  sub_channel_id: T | null;
};

export type EventSchema = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  schema?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type EventTypes = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Events = {
  contact?: string | Contacts | null;
  custom_attributes?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  event_description?: string | null;
  event_type?: string | EventTypes | null;
  gmt_time?: string | null;
  id: string;
  is_active?: boolean | null;
  is_executed?: boolean | null;
  lead?: string | Leads | null;
  parent_event?: string | Events | null;
  processed_params?: unknown | null;
  start?: string | null;
  title?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type FollowUp = {
  attemp_num?: number | null;
  company?: string | Companies | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  instructions?: string | null;
  minutes?: number | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type FollowUps = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  name?: string | null;
  offset_minutes?: number | null;
  rules_schema?: unknown | null;
  sub_channels: any[] | FollowUpsSubChannels[];
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type FollowUpsSubChannel = {
  collection?: string | null;
  follow_ups_id?: string | FollowUps | null;
  id: number;
  item?: string | any | null;
};

export type FollowUpsSubChannels = {
  collection?: string | null;
  follow_ups_id?: string | FollowUps | null;
  id: number;
  item?: string | any | null;
};

export type HumanAgents = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_active?: boolean | null;
  sub_channel?: string | ChawootWhatsapp | null;
  user?: string | DirectusUsers | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type KB = {
  Content?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  Name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type LeadSchema = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  schema?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Leads = {
  active?: boolean | null;
  chatwoot_whatsapp?: string | ChawootWhatsapp | null;
  contact?: string | Contacts | null;
  custom_field?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  Events: any[] | Events[];
  external_id?: string | null;
  id: string;
  last_interaction_time?: string | null;
  notes?: string | null;
  source?: string | null;
  status?: string | null;
  success_contact?: boolean | null;
  tags?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type LeadsSubChannel = {
  id: number;
  leads_id?: string | Leads | null;
  sub_channel?: string | null;
  sub_channel_id?: string | any | null;
};

export type MessageTypes = {
  date_created?: string | null;
  date_updated?: string | null;
  description?: string | null;
  id: number;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Messages = {
  attached_file?: string | DirectusFiles | null;
  company?: string | Companies | null;
  contact?: string | Contacts | null;
  content?: string | null;
  content_type?: number | ContentTypes | null;
  date_created?: string | null;
  date_updated?: string | null;
  delivered?: string | null;
  id: number;
  id_meta?: string | null;
  inbox_id?: number | null;
  lead?: string | Leads | null;
  message_type?: number | MessageTypes | null;
  read?: string | null;
  send?: string | null;
  source?: string | null;
  source_promt?: number | SystemPromptsVersions | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  wamid?: string | null;
};

export type PhoneNumbers = {
  ai_agent?: string | AIAgents | null;
  company?: string | Companies | null;
  custom_attributes?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  display_name?: string | null;
  id: number;
  inbox_id?: string | null;
  meta_token?: string | null;
  phone_number?: string | null;
  phone_number_id?: string | null;
  pin_code?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  waba?: string | Wabas | null;
};

export type ProductsFiles = {
  directus_files_id?: string | DirectusFiles | null;
  id: number;
};

export type Reminders = {
  date_created?: string | null;
  date_updated?: string | null;
  event_type?: string | EventTypes | null;
  id: string;
  minutes_before_event: number;
  phone_number: number | PhoneNumbers;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type RulesSchema = {
  date_created?: string | null;
  date_updated?: string | null;
  event_type_apply?: string | EventTypes | null;
  id: string;
  schema?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type SubChannelSchema = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  schema?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type SystemPrompts = {
  date_created?: string | null;
  date_updated?: string | null;
  Description?: string | null;
  id: string;
  Name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  Versions: any[] | SystemPromptsVersions[];
};

export type SystemPromptsVersions = {
  date_created?: string | null;
  date_updated?: string | null;
  Description?: string | null;
  id: number;
  is_active?: boolean | null;
  Prompt_Content?: string | null;
  System_Prompt?: string | SystemPrompts | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  Version_Tag?: string | null;
};

export type Tags = {
  active?: boolean | null;
  company?: string | Companies | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  name?: string | null;
  system_tag?: boolean | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type TESTJSONB = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  JSON_1?: unknown | null;
  JSON_2?: unknown | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Testing = {
  dat?: string | null;
  date?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Wabas = {
  company?: string | Companies | null;
  custom_attributes?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  phone_numbers: any[] | PhoneNumbers[];
  token?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  waba_id: string;
};

export type Zenvia = {
  api_key: string;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  name?: string | null;
  sub_channels: any[] | ZenviaSubChannels[];
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type ZenviaSubChannels = {
  id: number;
  sub_channel?: string | null;
  sub_channel_id?: string | any | null;
  zenvia_id?: string | Zenvia | null;
};

export type ZenviaWhatsapp = {
  agent_id?: string | null;
  agent_name?: string | null;
  ai_agent?: string | AIAgents | null;
  attachments: any[] | ZenviaWhatsappFiles[];
  cover_letter?: string | DirectusFiles | null;
  custom_attributes?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  group_id?: string | null;
  group_name?: string | null;
  id: string;
  name?: string | null;
  phone_number?: string | null;
  testing?: boolean | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type ZenviaWhatsappFiles = {
  directus_files_id?: string | DirectusFiles | null;
  id: number;
  zenvia_whatsapp_id?: string | ZenviaWhatsapp | null;
};

export type CustomDirectusTypes = {
  AI_Agents: AIAgents[];
  AI_Agents_files: AIAgentsFiles[];
  AI_Agents_files_1: AIAgentsFiles1[];
  AI_Agents_products: AIAgentsProducts[];
  campaigns: Campaigns[];
  campaigns_contacts: CampaignsContacts[];
  catalogs: Catalogs[];
  chatwoot: Chatwoot[];
  chatwoot_sub_channels: ChatwootSubChannels[];
  chawoot_whatsapp: ChawootWhatsapp[];
  companies: Companies[];
  companies_channels: CompaniesChannels[];
  contact_schema: ContactSchema[];
  contacts: Contacts[];
  content_types: ContentTypes[];
  continental: Continental[];
  directus_access: DirectusAccess[];
  directus_activity: DirectusActivity[];
  directus_collections: DirectusCollections[];
  directus_comments: DirectusComments[];
  directus_dashboards: DirectusDashboards[];
  directus_extensions: DirectusExtensions[];
  directus_fields: DirectusFields[];
  directus_files: DirectusFiles[];
  directus_flows: DirectusFlows[];
  directus_folders: DirectusFolders[];
  directus_migrations: DirectusMigrations[];
  directus_notifications: DirectusNotifications[];
  directus_operations: DirectusOperations[];
  directus_panels: DirectusPanels[];
  directus_permissions: DirectusPermissions[];
  directus_policies: DirectusPolicies[];
  directus_presets: DirectusPresets[];
  directus_relations: DirectusRelations[];
  directus_revisions: DirectusRevisions[];
  directus_roles: DirectusRoles[];
  directus_sessions: DirectusSessions[];
  directus_settings: DirectusSettings;
  directus_shares: DirectusShares[];
  directus_translations: DirectusTranslations[];
  directus_users: DirectusUsers[];
  directus_versions: DirectusVersions[];
  directus_webhooks: DirectusWebhooks[];
  event_rules: EventRules[];
  event_rules_sub_channel: EventRulesSubChannel<Record<string, any>>[];
  event_schema: EventSchema[];
  event_types: EventTypes[];
  events: Events[];
  follow_up: FollowUp[];
  follow_ups: FollowUps[];
  follow_ups_sub_channel: FollowUpsSubChannel[];
  follow_ups_sub_channels: FollowUpsSubChannels[];
  human_agents: HumanAgents[];
  KB: KB[];
  lead_schema: LeadSchema[];
  leads: Leads[];
  leads_sub_channel: LeadsSubChannel[];
  message_types: MessageTypes[];
  messages: Messages[];
  phone_numbers: PhoneNumbers[];
  products_files: ProductsFiles[];
  reminders: Reminders[];
  rules_schema: RulesSchema[];
  sub_channel_schema: SubChannelSchema[];
  System_Prompts: SystemPrompts[];
  System_Prompts_Versions: SystemPromptsVersions[];
  tags: Tags[];
  TEST_JSONB: TESTJSONB[];
  testing: Testing[];
  wabas: Wabas[];
  zenvia: Zenvia[];
  zenvia_sub_channels: ZenviaSubChannels[];
  zenvia_whatsapp: ZenviaWhatsapp[];
  zenvia_whatsapp_files: ZenviaWhatsappFiles[];
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

export type EventRules = {
  date_created?: string | null;
  date_updated?: string | null;
  event_type?: string | EventTypes | null;
  id: string;
  name?: string | null;
  offset_minutes?: number | null;
  sub_channel: any[] | EventRulesSubChannel<Record<string, any>>[];
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
