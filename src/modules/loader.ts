'use strict';

export const entities: Record<string, string> = {};

export let connection: WebSocket;
let id = 1;
const pendingRequests = new Map();

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

    // if (data.type === 'ping') {
    //     data.timestamp = Date.now();
    // }

    return new Promise((resolve, reject) => {
        pendingRequests.set(data.id, {resolve, reject});
        connection.send(JSON.stringify(data));
        console.log('Sent data:', data);
    });
}

export const pushAuthData = (link: string, token: string) => {
    let HAAuth: { url: string; token: string } = {
        url: link,
        token: token
    };
    localStorage.setItem('HAAuth', JSON.stringify(HAAuth))
}

export const getAuthData = (): { url: string; token: string } | null => {
    const data = localStorage.getItem('HAAuth');
    return data ? JSON.parse(data) : null;
}


let handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log(`Received data: ${JSON.stringify(data)}`);

    if (data.type === "auth_required") {

        return;
    }

    if (data.id && pendingRequests.has(data.id)) {
        const {resolve, reject} = pendingRequests.get(data.id);
        pendingRequests.delete(data.id);
        if (data.type === 'pong') {
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

let sendAuthMessage = (token: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const authHandler = (message: MessageEvent) => {
            const data = JSON.parse(message.data);
            if (data.type === 'auth_ok') {
                connection.removeEventListener('message', authHandler);
                resolve();
            } else if (data.type === 'auth_invalid') {
                connection.removeEventListener('message', authHandler);
                reject(new Error('Authentication failed'));
            }
        };

        connection.addEventListener('message', authHandler);

        let newAuthMessage = {...messages.auth}
        newAuthMessage.access_token = token;

        connection.send(JSON.stringify(newAuthMessage));

        console.log('Sent auth message' + JSON.stringify(newAuthMessage));
    });
}

const setupHeartbeat = () => {
    setInterval(() => {
        sendToHA(messages.ping)
            .then(() => console.log('Ping successful'))
            .catch(error => console.error('Ping failed:', error));
    }, 10000);
}

let subscribeToEvents = () => {
    sendToHA(messages.subscribe_events)
        .then(() => console.log('Subscribed to events'))
        .catch(error => console.error('Failed to subscribe to events:', error));
}

export const createConnection = (url: string, token: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
        connection = new WebSocket(url);

        connection.onopen = () => {
            console.log('WebSocket connection established');

            sendAuthMessage(token)
                .then(() => {
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
                    console.error('Authentication failed:', error);
                    connection.close();
                    reject(error);
                });
        };

        connection.onerror = (error) => {
            console.error(`WebSocket error: ${JSON.stringify(error)}`);
            reject(error);
        };

        connection.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event.code}`);
            // Reconnect after 5 seconds
            let newAuthData = getAuthData();
            if (newAuthData) {
                setTimeout(() => createConnection(newAuthData!.url, newAuthData!.token).then(resolve).catch(reject), 5000);
            }
        };

        connection.onmessage = handleMessage;
    });
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
