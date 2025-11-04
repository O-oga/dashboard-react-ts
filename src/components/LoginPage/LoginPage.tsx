import { useState, useEffect } from 'react';
import { createConnection, getPingLatency, pushAuthData, convertToWebSocketUrl, getAuthData } from '../../modules/loader';
import './LoginPage.css';

type LoginPageProps = {
    onLoginSuccess: () => void;
};

function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [url, setUrl] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [pingLatency, setPingLatency] = useState<number | null>(null);

    // Load saved data from cookies on mount
    useEffect(() => {
        const authData = getAuthData();
        if (authData) {
            setUrl(authData.url);
            setToken(authData.token);
        }
    }, []);

    // Track ping latency when connected
    useEffect(() => {
        if (isConnected) {
            const interval = setInterval(() => {
                const latency = getPingLatency();
                if (latency !== null) {
                    setPingLatency(latency);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isConnected]);

    const handleConnect = async () => {
        if (!url || !token) {
            setError('Пожалуйста, введите URL и токен');
            return;
        }

        setIsConnecting(true);
        setError('');

        try {
            // Convert URL to WebSocket format
            const wsUrl = convertToWebSocketUrl(url);

            await createConnection(wsUrl, token);
            setIsConnected(true);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка подключения');
            setIsConnected(false);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleContinue = () => {
        // Save to cookies via pushAuthData (saves original URL)
        pushAuthData(url, token);
        onLoginSuccess();
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Подключение к Home Assistant</h1>
                
                <div className="login-form">
                    <div className="form-group">
                        <label htmlFor="url">URL Home Assistant</label>
                        <input
                            id="url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="ws://homeassistant.local:8123/api/websocket"
                            disabled={isConnecting || isConnected}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="token">Токен доступа</label>
                        <input
                            id="token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Введите токен"
                            disabled={isConnecting || isConnected}
                            className="form-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="button-container">
                        {isConnected && pingLatency !== null && (
                            <div className="ping-indicator">
                                Пинг: {pingLatency}ms
                            </div>
                        )}
                        <button
                            onClick={isConnected ? handleContinue : handleConnect}
                            disabled={isConnecting}
                            className="login-button"
                        >
                            {isConnecting ? 'Подключение...' : isConnected ? 'Продолжить' : 'Подключиться'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

