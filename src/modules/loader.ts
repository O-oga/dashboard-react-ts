'use strict';
import type { State } from '../types/space.types';
import { getCookie, setCookie } from './cookies';

export const entities: Record<string, string> = {};

export let connection: WebSocket;
let id = 1;
const pendingRequests = new Map();
let pingLatency: number | null = null;
let lastPingTime: number | null = null;

export const messages = {
    auth: {
        type: "auth",
        access_token: ''
    },
    get_states: {
        "id": id,
        "type": "get_states"
    },
    subscribe_events: {
        id: id,
        type: "subscribe_events",
        event_type: "state_changed"
    },
    subscribe_entity_id_event: {
        id: id,
        type: "subscribe_events",
        event_type: "state_changed"
    },
    subscribe_trigger: {
        id: id,
        type: "subscribe_trigger",
        trigger: {
            platform: "state",
            entity_id: ``,
            from: "off",
            to: "on"
        }
    },
    unsubscribe_events: {
        id: id,
        type: "unsubscribe_events",
        subscription: 18
    },
    ping: {
        "id": id,
        "type": "ping",
        // timestamp: null
    },
    getHistory: {
        type: "history/history_during_period",
        id: id,
        start_time: "2023-01-01T00:00:00Z",
        end_time: "2024-12-31T23:59:59Z",
        entity_ids: ["sensor.voltage", "sensor.current_ma"],
        minimal_response: false,
        significant_changes_only: false
    },
    changeState: {
        id: id,
        type: "call_service",
        domain: "switch",
        service: "",
        service_data: {
            entity_id: ""
        }
    }

}

export let sendToHA = (data: any) => {
    data.id = id++;

    return new Promise((resolve, reject) => {
        // Check connection readiness before sending
        if (connection.readyState !== WebSocket.OPEN) {
            reject(new Error(`WebSocket is not ready. Current state: ${connection.readyState}`));
            return;
        }

        pendingRequests.set(data.id, {resolve, reject});
        
        try {
            connection.send(JSON.stringify(data));
            console.log('Sent data:', data);
        } catch (error) {
            pendingRequests.delete(data.id);
            reject(error);
        }
    });
}

export const pushAuthData = (link: string, token: string) => {
    setCookie('HA_URL', link, 30);
    setCookie('HA_TOKEN', token, 30);
}

export const getAuthData = (): { url: string; token: string } | null => {
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

export const saveSpaces = (spaces: State): void => {
    try {
        localStorage.setItem('spaces', JSON.stringify(spaces));
    } catch (error) {
        console.error('Error saving spaces:', error);
    }
}

export const getSpaces = (): State | null => {
    try {
        const data = localStorage.getItem('spaces');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading spaces:', error);
        return null;
    }
}


let handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log(`Received data: ${JSON.stringify(data)}`);

    // auth_required message is normal - server just indicates authentication is needed
    // We don't handle it here as authentication happens in sendAuthMessage
    if (data.type === "auth_required") {
        console.log('Server requires authentication');
        return;
    }

    if (data.id && pendingRequests.has(data.id)) {
        const {resolve, reject} = pendingRequests.get(data.id);
        pendingRequests.delete(data.id);
        if (data.type === 'pong') {
            // Calculate ping latency
            if (lastPingTime !== null) {
                pingLatency = Date.now() - lastPingTime;
                lastPingTime = null;
            }
            resolve(data);
        } else if (data.success) {
            resolve(data);
        } else {
            reject(data);
        }
    } else if (data.type === 'event') {
        handleEvent(data.event);
    } else {
        // other
        console.log('Unexpected message:', data);
    }
}

function handleEvent(event: { event_type: string; data: { entity_id: string; new_state: { state: string }; old_state: { state: string } } }) {
    if (event.event_type === 'state_changed') {
        console.log('State changed:', event.data);
        changeDeviceState(event.data.entity_id, event.data.new_state.state, event.data.old_state.state, true).then(()=>{});
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
                const data = JSON.parse(message.data);
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

            let newAuthMessage = {...messages.auth}
            newAuthMessage.access_token = token;

            connection.send(JSON.stringify(newAuthMessage));
            console.log('Sent auth message:', JSON.stringify(newAuthMessage));
        } catch (error) {
            reject(error);
        }
    });
}

const setupHeartbeat = () => {
    setInterval(() => {
        lastPingTime = Date.now();
        sendToHA(messages.ping)
            .then(() => console.log('Ping successful'))
            .catch(error => console.error('Ping failed:', error));
    }, 3000);
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

        sendAuthMessage(token)
            .then(() => {
                if (isResolved) return; // If already resolved, exit
                isResolved = true;
                console.log('Authentication successful');
                setupHeartbeat();
                subscribeToEvents();
                createEntitysStateList().then((request)=>{
                    Object.assign(entities, request);
                    console.log('Entitys state list created', entities);
                });
                resolve(connection);
            })
            .catch((error) => {
                if (isResolved) return; // If already resolved, exit
                isResolved = true;
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
        
        // If connection closed before successful authentication, try to reconnect
        if (!isResolved && event.code !== 1000) { // 1000 = normal closure
            let newAuthData = getAuthData();
            if (newAuthData) {
                setTimeout(() => {
                    const wsUrl = convertToWebSocketUrl(newAuthData!.url);
                    createConnection(wsUrl, newAuthData!.token).then(resolve).catch(reject);
                }, 5000);
            } else if (!isResolved) {
                isResolved = true;
                reject(new Error('WebSocket connection closed unexpectedly'));
            }
        }
    };

    connection.onmessage = handleMessage;
};


export const changeDeviceState = async (entity_id: string, new_state: string, _old_state: string, serverEvent = false) => {

    if (serverEvent) {
        //make client changes
    } else {
        let newMessage = {...messages.changeState}
        newMessage.service = new_state ? "turn_on" : "turn_off";
        newMessage.service_data = {entity_id: entity_id};

        try {
            const response = await sendToHA(newMessage);
            console.log('Device state changed successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to change device state:', error);
            throw error;
        }
    }

}

export const createEntitysStateList = async () => {
    try {
        const request = await sendToHA(messages.get_states) as { result: Array<{ entity_id: string; state: string }> };
        return request.result.reduce((entitys: Record<string, string>, item: { entity_id: string; state: string }) => {
            entitys[item.entity_id] = item.state;
            return entitys;
        }, {});
    } catch (error) {
        console.error("Error creating entity state list:", error);
        throw error;
    }
}

export const getHistory = async (_entity_ids: string[], _start_time: string, _end_time: string) => {
    // TODO: Implement history retrieval
};

// export const getAllEntity = () => {
//     sendToHA(messages.get_states).then(request => {
//         return request.result.map(item => item.entity_id);
//     })
// };
