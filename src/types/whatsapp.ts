export type MetaTemplatesResponse = {
  messages: string;
  templates: {
    data: WaTemplate[];
  };
};

export type WaTemplate = {
  name: string;
  parameter_format: string;
  components: WaTemplateComponent[];
  language: string;
  status: "APPROVED" | "REJECTED";
  category: string;
  sub_category: string;
};

export type WaQuickReplyButton = {
  type: "QUICK_REPLY";
  text: string;
};

export type WaUrlButton = {
  type: "URL";
  text: string;
  url: string;
};

export type WaComponentButton = WaQuickReplyButton | WaUrlButton;

export type WaTemplateButtonsComponent = {
  type: "BUTTONS";
  buttons: WaComponentButton[];
};

export type WaTemplateBodyComponent = {
  type: "BODY";
  text: string;
  example: { body_text: string[][] } | { body_text_named_params: string[][] };
};

export type WaTemplateFooterComponent = {
  type: "FOOTER";
  text: string;
};

export type WaTemplateHeaderComponent = {
  type: "HEADER";
  format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  text?: string;
  example:
    | { header_handle: string[]; header_text: string[][] }
    | {
        header_handle_named_params: string[][];
        header_text_named_params: string[][];
      };
};

export type WaTemplateComponent =
  | WaTemplateBodyComponent
  | WaTemplateButtonsComponent
  | WaTemplateFooterComponent
  | WaTemplateHeaderComponent;

export type WaTemplateComponentByType = {
  BODY: WaTemplateBodyComponent;
  BUTTONS: WaTemplateButtonsComponent;
  FOOTER: WaTemplateFooterComponent;
  HEADER: WaTemplateHeaderComponent;
};
