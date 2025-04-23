export interface Target {
  _id: string;
  name: string;
  id: string;
}

export interface Notification {
  _id: string;
  recipient?: string;
  sender?: {
    _id: string;
    name: string;
    photo?: string;
  };
  type?: string;
  title: string;
  content: string;
  message?: string;
  read: boolean;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  target?: Target;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
}

export interface NotificationResponsePayload {
  notifications: Notification[];
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}
