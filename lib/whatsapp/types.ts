export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: 'whatsapp';
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<WhatsAppInboundMessage>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppInboundMessage {
  from: string; // phone number e.g. "15551234567"
  id: string;
  timestamp: string;
  type: 'text' | 'interactive' | 'audio' | 'image' | 'button';
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
  audio?: {
    id: string;
    mime_type: string;
  };
  image?: {
    id: string;
    mime_type: string;
    caption?: string;
  };
}

export interface WhatsAppOutboundButton {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
}

export interface WhatsAppInteractiveMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'interactive';
  interactive: {
    type: 'button';
    header?: {
      type: 'text';
      text: string;
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      buttons: WhatsAppOutboundButton[];
    };
  };
}

export interface WhatsAppTextMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text';
  text: {
    body: string;
  };
}
