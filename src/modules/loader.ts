'use strict';
import type { SpacesState } from '../types/space.types';
import type {
    AuthMessage,
    BaseMessage,
    GetStatesMessage,
    SubscribeEventsMessage,
    SubscribeEntityIdEventMessage,
    SubscribeTriggerMessage,
    UnsubscribeEventsMessage,
    PingMessage,
    GetHistoryMessage,
    ChangeStateMessage,
    IncomingMessage,
    EventData,
    StateChangedEventData,
    EntityStateItem,
    GetStatesResponse,
    HistoryResponseAPI,
    HistoryItemAPI,
    PendingRequest,
    AuthData,
    EntityStateList,
    EventMessage
} from '../types/loaderData.types';
import { getCookie, setCookie } from './cookies';

export const entities: EntityStateList = {};

export let connection: WebSocket;
let id = 1;
const pendingRequests = new Map<number, PendingRequest>();
let pingLatency: number | null = null;
let lastPingTime: number | null = null;
let heartbeatIntervalId: number | null = null;
let reconnectTimeoutId: number | null = null;
let isAuthenticated = false;

export const messages = {
    auth: {
        type: "auth",
        access_token: ''
    } as AuthMessage,
    get_states: {
        "id": id,
        "type": "get_states"
    } as GetStatesMessage,
    subscribe_events: {
        id: id,
        type: "subscribe_events",
        event_type: "state_changed"
    } as SubscribeEventsMessage,
    subscribe_entity_id_event: {
        id: id,
        type: "subscribe_events",
        event_type: "state_changed"
    } as SubscribeEntityIdEventMessage,
    subscribe_trigger: {
        id: id,
        type: "subscribe_trigger",
        trigger: {
            platform: "state",
            entity_id: ``,
            from: "off",
            to: "on"
        }
    } as SubscribeTriggerMessage,
    unsubscribe_events: {
        id: id,
        type: "unsubscribe_events",
        subscription: 18
    } as UnsubscribeEventsMessage,
    ping: {
        "id": id,
        "type": "ping",
        // timestamp: null
    } as PingMessage,
    getHistory: {
        type: "history/history_during_period",
        id: id,
        start_time: new Date(Date.now() - 3600_000).toISOString(),
        end_time: new Date().toISOString(),
        entity_ids: [],
        include_start_time_state: true,
        no_attributes: false,
        minimal_response: false,
        significant_changes_only: true
    } as GetHistoryMessage,
    changeState: {
        id: id,
        type: "call_service",
        domain: "switch",
        service: "",
        service_data: {
            entity_id: ""
        }
    } as ChangeStateMessage

}

export let sendToHA = (data: AuthMessage | GetStatesMessage | SubscribeEventsMessage | SubscribeEntityIdEventMessage | SubscribeTriggerMessage | UnsubscribeEventsMessage | PingMessage | GetHistoryMessage | ChangeStateMessage): Promise<IncomingMessage> => {
    // AuthMessage doesn't have id, so we handle it separately
    if (data.type !== 'auth') {
        (data as BaseMessage).id = id++;
    }

    return new Promise<IncomingMessage>((resolve, reject) => {
        // Check if connection exists
        if (!connection) {
            reject(new Error('WebSocket connection is not initialized'));
            return;
        }

        // Check connection readiness before sending
        if (connection.readyState !== WebSocket.OPEN) {
            const stateNames: Record<number, string> = {
                0: 'CONNECTING',
                1: 'OPEN',
                2: 'CLOSING',
                3: 'CLOSED'
            };
            reject(new Error(`WebSocket is not ready. Current state: ${connection.readyState} (${stateNames[connection.readyState] || 'UNKNOWN'})`));
            return;
        }

        // Only add to pending requests if message has id (not auth message)
        if (data.type !== 'auth' && 'id' in data) {
            pendingRequests.set(data.id, { resolve: resolve as (value: unknown) => void, reject: reject as (error: Error | unknown) => void });
        }

        try {
            connection.send(JSON.stringify(data));
            // console.log('Sent data:', data);
            // Auth messages don't wait for response via pendingRequests
            if (data.type === 'auth') {
                // Auth response is handled separately in sendAuthMessage
                resolve({ type: 'auth_ok' } as IncomingMessage);
            }
        } catch (error) {
            if (data.type !== 'auth' && 'id' in data) {
                pendingRequests.delete(data.id);
            }
            reject(error);
        }
    });
}

export const pushAuthData = (link: string, token: string) => {
    setCookie('HA_URL', link, 30);
    setCookie('HA_TOKEN', token, 30);
}

export const getAuthData = (): AuthData | null => {
    const url = getCookie('HA_URL');
    const token = getCookie('HA_TOKEN');
    if (url && token) {
        return { url, token };
    }
    return null;
}

export const getPingLatency = (): number | null => {
    return pingLatency;
}

/**
 * Checks if an active WebSocket connection exists
 * @returns true if connection exists and is ready
 */
export const isConnectionActive = (): boolean => {
    return connection !== undefined &&
        connection !== null &&
        (connection.readyState === WebSocket.OPEN || connection.readyState === WebSocket.CONNECTING);
}

/**
 * Closes the current WebSocket connection if it exists
 */
export const closeConnection = (): void => {
    if (connection && (connection.readyState === WebSocket.OPEN || connection.readyState === WebSocket.CONNECTING)) {
        connection.close();
    }
}

/**
 * Converts URL to WebSocket format (ws:// or wss://)
 * @param url - source URL
 * @returns URL in WebSocket format
 */
export const convertToWebSocketUrl = (url: string): string => {
    let wsUrl = url.trim();
    console.log('Converting URL:', wsUrl);

    // If URL already contains /api/websocket, use it as is
    if (wsUrl.includes('/api/websocket')) {
        // Ensure protocol is correct
        if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
            if (wsUrl.startsWith('http://')) {
                wsUrl = wsUrl.replace('http://', 'ws://');
            } else if (wsUrl.startsWith('https://')) {
                wsUrl = wsUrl.replace('https://', 'wss://');
            }
        }
        console.log('URL already contains /api/websocket, result:', wsUrl);
        return wsUrl;
    }

    // Convert protocol if needed
    if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
        if (wsUrl.startsWith('http://')) {
            wsUrl = wsUrl.replace('http://', 'ws://');
        } else if (wsUrl.startsWith('https://')) {
            wsUrl = wsUrl.replace('https://', 'wss://');
        } else {
            wsUrl = `ws://${wsUrl}`;
        }
    }

    // Remove trailing slash before adding /api/websocket
    wsUrl = wsUrl.replace(/\/$/, '');

    // Add /api/websocket if it's not present
    if (!wsUrl.includes('/api/websocket')) {
        wsUrl = `${wsUrl}/api/websocket`;
    }

    console.log('Converted URL:', wsUrl);
    return wsUrl;
}

export const saveSpaces = (spaces: SpacesState): void => {
    try {
        localStorage.setItem('spaces', JSON.stringify(spaces));
    } catch (error) {
        console.error('Error saving spaces:', error);
    }
}

export const getSpaces = (): SpacesState | null => {
    try {
        const data = localStorage.getItem('spaces');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading spaces:', error);
        return null;
    }
}


let handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as IncomingMessage;
    // console.log(`Received data: ${JSON.stringify(data)}`);

    // auth_required message is normal - server just indicates authentication is needed
    // We don't handle it here as authentication happens in sendAuthMessage
    if (data.type === "auth_required") {
        console.log('Server requires authentication');
        return;
    }

    if ('id' in data && data.id && pendingRequests.has(data.id)) {
        const { resolve, reject } = pendingRequests.get(data.id)!;
        pendingRequests.delete(data.id);
        if (data.type === 'pong') {
            // Calculate ping latency
            if (lastPingTime !== null) {
                pingLatency = Date.now() - lastPingTime;
                lastPingTime = null;
            }
            resolve(data);
        } else if ('success' in data && data.success) {
            resolve(data);
        } else {
            reject(data);
        }
    } else if (data.type === 'event') {
        const eventMessage = data as EventMessage;
        handleEvent(eventMessage.event);
    } else {
        // other
        console.log('Unexpected message:', data);
    }
}

function handleEvent(event: EventData) {
    if (event.event_type === 'state_changed') {
        const eventData = event.data as StateChangedEventData;
        // console.log('State changed:', eventData);
        changeDeviceState(eventData.entity_id, eventData.new_state.state, eventData.old_state.state, true).then(() => { });
    }
}

/**
 * Waits for WebSocket connection to be ready to send messages
 * @param timeout - maximum wait time in milliseconds
 * @returns Promise that resolves when connection is ready
 */
const waitForConnectionReady = (timeout: number = 2000): Promise<void> => {
    return new Promise((resolve, reject) => {
        // If connection is already ready, resolve immediately
        if (connection && connection.readyState === WebSocket.OPEN) {
            resolve();
            return;
        }

        const startTime = Date.now();

        const checkReady = () => {
            if (!connection) {
                reject(new Error('Connection is not initialized'));
                return;
            }

            if (connection.readyState === WebSocket.OPEN) {
                resolve();
            } else if (connection.readyState === WebSocket.CLOSED || connection.readyState === WebSocket.CLOSING) {
                reject(new Error('WebSocket is closed or closing'));
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`Timeout waiting for WebSocket connection. Current state: ${connection.readyState}`));
            } else {
                // Check again after a short interval
                setTimeout(checkReady, 50);
            }
        };

        checkReady();
    });
}

let sendAuthMessage = (token: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            // Wait for connection to be ready to send messages
            await waitForConnectionReady(2000); // Wait maximum 2 seconds

            const authHandler = (message: MessageEvent) => {
                const data = JSON.parse(message.data) as IncomingMessage;
                if (data.type === 'auth_ok') {
                    connection.removeEventListener('message', authHandler);
                    resolve();
                } else if (data.type === 'auth_invalid') {
                    connection.removeEventListener('message', authHandler);
                    reject(new Error('Authentication failed: Invalid token'));
                }
            };

            connection.addEventListener('message', authHandler);

            // Check readiness again before sending
            if (connection.readyState !== WebSocket.OPEN) {
                connection.removeEventListener('message', authHandler);
                reject(new Error('WebSocket is not ready for sending'));
                return;
            }

            let newAuthMessage = { ...messages.auth }
            newAuthMessage.access_token = token;

            connection.send(JSON.stringify(newAuthMessage));
            console.log('Sent auth message:', JSON.stringify(newAuthMessage));
        } catch (error) {
            reject(error);
        }
    });
}

const setupHeartbeat = () => {
    // Clear any existing heartbeat interval
    if (heartbeatIntervalId !== null) {
        clearInterval(heartbeatIntervalId);
        heartbeatIntervalId = null;
    }

    heartbeatIntervalId = setInterval(() => {
        // Only send ping if connection is open
        if (connection && connection.readyState === WebSocket.OPEN) {
            lastPingTime = Date.now();
            sendToHA(messages.ping)
                .then(() => {
                    // Ping successful - connection is healthy
                })
                .catch(error => {
                    // Only log if connection is actually closed, not just temporarily unavailable
                    if (connection.readyState === WebSocket.CLOSED || connection.readyState === WebSocket.CLOSING) {
                        console.warn('Ping failed - connection closed:', error.message);
                    }
                });
        } else {
            // Connection is not open, stop heartbeat
            if (heartbeatIntervalId !== null) {
                clearInterval(heartbeatIntervalId);
                heartbeatIntervalId = null;
            }
        }
    }, 3000);
}

const clearHeartbeat = () => {
    if (heartbeatIntervalId !== null) {
        clearInterval(heartbeatIntervalId);
        heartbeatIntervalId = null;
    }
}

let subscribeToEvents = () => {
    sendToHA(messages.subscribe_events)
        .then(() => console.log('Subscribed to events'))
        .catch(error => console.error('Failed to subscribe to events:', error));
}

export const createConnection = (url: string, token: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
        // Check if there's already an active and open connection
        // Don't return connection in CONNECTING state as it may not be authenticated yet
        if (connection && connection.readyState === WebSocket.OPEN) {
            console.log('Connection already exists and is open, reusing existing connection');
            resolve(connection);
            return;
        }

        // If connection is in CONNECTING state, wait for it to complete
        if (connection && connection.readyState === WebSocket.CONNECTING) {
            console.log('Connection is being established, waiting for it to complete...');
            const checkInterval = setInterval(() => {
                if (connection.readyState === WebSocket.OPEN) {
                    clearInterval(checkInterval);
                    resolve(connection);
                } else if (connection.readyState === WebSocket.CLOSED || connection.readyState === WebSocket.CLOSING) {
                    clearInterval(checkInterval);
                    // If connection closed, create a new one
                    createNewConnection(url, token, resolve, reject);
                }
            }, 100);

            // Timeout in case connection hangs
            setTimeout(() => {
                clearInterval(checkInterval);
                if (connection.readyState !== WebSocket.OPEN) {
                    createNewConnection(url, token, resolve, reject);
                }
            }, 5000);
            return;
        }

        createNewConnection(url, token, resolve, reject);
    });
}

/**
 * Creates a new WebSocket connection
 */
const createNewConnection = (url: string, token: string, resolve: (ws: WebSocket) => void, reject: (error: Error) => void): void => {
    console.log('Creating new WebSocket connection to:', url);
    connection = new WebSocket(url);

    let isResolved = false; // Flag to track if Promise was already resolved

    connection.onopen = () => {
        console.log('WebSocket connection established');
        isAuthenticated = false;

        sendAuthMessage(token)
            .then(() => {
                if (isResolved) return; // If already resolved, exit
                isResolved = true;
                isAuthenticated = true;
                console.log('Authentication successful');
                setupHeartbeat();
                subscribeToEvents();
                createEntitysStateList().then((request) => {
                    Object.assign(entities, request);
                    console.log('Entitys state list created', entities);
                }).catch(error => {
                    console.error('Failed to create entity state list during connection setup:', error);
                });
                resolve(connection);
            })
            .catch((error) => {
                if (isResolved) return; // If already resolved, exit
                isResolved = true;
                isAuthenticated = false;
                console.error('Authentication failed:', error);
                if (connection.readyState === WebSocket.OPEN || connection.readyState === WebSocket.CONNECTING) {
                    connection.close();
                }
                reject(error);
            });
    };

    connection.onerror = (error) => {
        console.error(`WebSocket error: ${JSON.stringify(error)}`);
        // Don't call reject here as onclose may also call reject
        // Or if authentication hasn't completed yet, onopen.catch will handle the error
        if (!isResolved && connection.readyState === WebSocket.CLOSED) {
            isResolved = true;
            reject(new Error('WebSocket connection failed'));
        }
    };

    connection.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code}`);

        // Clear heartbeat when connection closes
        clearHeartbeat();

        // Clear any pending reconnect timeout
        if (reconnectTimeoutId !== null) {
            clearTimeout(reconnectTimeoutId);
            reconnectTimeoutId = null;
        }

        // If connection closed before successful authentication, try to reconnect
        if (!isResolved && event.code !== 1000) { // 1000 = normal closure
            let newAuthData = getAuthData();
            if (newAuthData) {
                reconnectTimeoutId = setTimeout(() => {
                    const wsUrl = convertToWebSocketUrl(newAuthData!.url);
                    createConnection(wsUrl, newAuthData!.token).then(resolve).catch(reject);
                }, 5000);
            } else if (!isResolved) {
                isResolved = true;
                reject(new Error('WebSocket connection closed unexpectedly'));
            }
        } else if (isAuthenticated && event.code !== 1000) {
            // Connection closed after authentication - attempt to reconnect
            console.log('Connection closed after authentication, attempting to reconnect...');
            isAuthenticated = false;
            const newAuthData = getAuthData();
            if (newAuthData) {
                reconnectTimeoutId = setTimeout(() => {
                    const wsUrl = convertToWebSocketUrl(newAuthData.url);
                    createConnection(wsUrl, newAuthData.token)
                        .then(() => {
                            console.log('Reconnection successful');
                        })
                        .catch((error) => {
                            console.error('Reconnection failed:', error);
                            // Schedule another reconnection attempt
                            if (newAuthData) {
                                reconnectTimeoutId = setTimeout(() => {
                                    const wsUrl = convertToWebSocketUrl(newAuthData.url);
                                    createConnection(wsUrl, newAuthData.token).catch(() => {
                                        // Will retry on next close event
                                    });
                                }, 10000); // Wait 10 seconds before next attempt
                            }
                        });
                }, 3000); // Wait 3 seconds before reconnecting
            }
        }
    };

    connection.onmessage = handleMessage;
};


export const changeDeviceState = async (entity_id: string, new_state: string, _old_state: string, serverEvent = false) => {

    if (serverEvent) {
        //make client changes
    } else {
        let newMessage: ChangeStateMessage = { ...messages.changeState }
        newMessage.service = new_state ? "turn_on" : "turn_off";
        newMessage.service_data = { entity_id: entity_id };

        try {
            const response = await sendToHA(newMessage);
            // console.log('Device state changed successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to change device state:', error);
            throw error;
        }
    }

}

export const createEntitysStateList = async () => {
    try {
        // Wait for connection to be ready before sending request
        if (!connection) {
            throw new Error('WebSocket connection is not initialized. Please establish a connection first.');
        }

        if (connection.readyState !== WebSocket.OPEN) {
            await waitForConnectionReady(5000); // Wait up to 5 seconds
        }

        const request = await sendToHA(messages.get_states) as GetStatesResponse;
        if (!request.result) {
            throw new Error('No result in get_states response');
        }
        return request.result.reduce((entitys: EntityStateList, item: EntityStateItem) => {
            entitys[item.entity_id] = item.state;
            return entitys;
        }, {});
    } catch (error) {
        console.error("Error creating entity state list:", error);
        throw error;
    }
}

export const getHistory = async (_entity_ids: string[], _start_time?: string, _end_time: string = new Date().toISOString(), pastHours: number = 1, pastDays: number = 0): Promise<Record<string, HistoryItemAPI[]>> => {
    let newMessage: GetHistoryMessage = { ...messages.getHistory }
    newMessage.entity_ids = _entity_ids;
    newMessage.start_time = _start_time || new Date(Date.now() - (3600_000 * pastHours) - (86400_000 * pastDays)).toISOString();
    newMessage.end_time = _end_time;
    try {
        const request = await sendToHA(newMessage) as HistoryResponseAPI;
        if (!request.result) {
            throw new Error('No result in getHistory response');
        }
        
        return request.result;
        
    } catch (error) {
        console.error("Error getting history:", error);
        throw error;
    }
};

