/**
 * WebSocket API
 */

// ==================== Outgoing Messages ====================
export interface BaseMessage {
    id: number;
    type: string;
}

export interface AuthMessage {
    type: 'auth';
    access_token: string;
}

export interface GetStatesMessage extends BaseMessage {
    type: 'get_states';
}

export interface SubscribeEventsMessage extends BaseMessage {
    type: 'subscribe_events';
    event_type: string;
}

export interface SubscribeEntityIdEventMessage extends BaseMessage {
    type: 'subscribe_events';
    event_type: string;
}

export interface StateTrigger {
    platform: 'state';
    entity_id: string;
    from: string;
    to: string;
}

export interface SubscribeTriggerMessage extends BaseMessage {
    type: 'subscribe_trigger';
    trigger: StateTrigger;
}

export interface UnsubscribeEventsMessage extends BaseMessage {
    type: 'unsubscribe_events';
    subscription: number;
}

export interface PingMessage extends BaseMessage {
    type: 'ping';
}

export interface GetHistoryMessage extends BaseMessage {
    type: 'history/history_during_period';
    start_time: string;
    end_time: string;
    entity_ids: string[];
    include_start_time_state: boolean;
    no_attributes: boolean;
    minimal_response: boolean;
    significant_changes_only: boolean;
}

export interface ServiceData {
    entity_id: string;
}

export interface ChangeStateMessage extends BaseMessage {
    type: 'call_service';
    domain: string;
    service: string;
    service_data: ServiceData;
}

export type OutgoingMessage =
    | AuthMessage
    | GetStatesMessage
    | SubscribeEventsMessage
    | SubscribeEntityIdEventMessage
    | SubscribeTriggerMessage
    | UnsubscribeEventsMessage
    | PingMessage
    | GetHistoryMessage
    | ChangeStateMessage;

// ==================== Incoming Messages ====================

export interface AuthRequiredMessage {
    type: 'auth_required';
    ha_version?: string;
}

export interface AuthOkMessage {
    type: 'auth_ok';
    ha_version?: string;
}

export interface AuthInvalidMessage {
    type: 'auth_invalid';
    message?: string;
}

export interface PongMessage {
    id: number;
    type: 'pong';
}

export interface BaseResponse extends BaseMessage {
    success: boolean;
}

export interface SuccessResponse<T = unknown> extends BaseResponse {
    success: true;
    result?: T;
}

export interface ErrorResponse extends BaseResponse {
    success: false;
    error?: {
        code: string;
        message: string;
    };
}

export interface EntityStateItem {
    entity_id: string;
    state: string;
    attributes?: Record<string, unknown>;
    last_changed?: string;
    last_updated?: string;
}

export interface GetStatesResponse extends SuccessResponse<EntityStateItem[]> {
    result: EntityStateItem[];
}

export interface HistoryItem {
    entity_id: string;
    state: string;
    attributes?: Record<string, unknown>;
    last_changed?: string;
    last_updated?: string;
}

export interface HistoryResponse extends SuccessResponse<HistoryItem[]> {
    result: HistoryItem[];
}

/**
 * History item from Home Assistant API response
 */
export interface HistoryItemAPI {
    s: string; // state
    a?: Record<string, unknown>; // attributes
    lu?: number; // last_updated (timestamp)
}

/**
 * History response structure from Home Assistant API
 * Object with entity_id as keys and arrays of history items as values
 */
export interface HistoryResponseAPI extends SuccessResponse<Record<string, HistoryItemAPI[]>> {
    result: Record<string, HistoryItemAPI[]>;
}

// ==================== Events ====================

export interface StateObject {
    state: string;
    attributes?: Record<string, unknown>;
    last_changed?: string;
    last_updated?: string;
    entity_id?: string;
}

export interface StateChangedEventData {
    entity_id: string;
    new_state: StateObject;
    old_state: StateObject;
}

export interface EventData {
    event_type: string;
    data: StateChangedEventData;
}

export interface EventMessage {
    id?: number;
    type: 'event';
    event: EventData;
}

export type IncomingMessage =
    | AuthRequiredMessage
    | AuthOkMessage
    | AuthInvalidMessage
    | PongMessage
    | SuccessResponse
    | ErrorResponse
    | EventMessage;

// ==================== Helper Types ====================

export type EntityStateList = Record<string, string>;

export type HistoryStateList = Record<string, string>;

export interface AuthData {
    url: string;
    token: string;
}

export interface PendingRequest {
    resolve: (value: unknown) => void;
    reject: (error: Error | unknown) => void;
}

export type WebSocketStateName = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNKNOWN';

export type WebSocketStateMap = Record<number, WebSocketStateName>;

