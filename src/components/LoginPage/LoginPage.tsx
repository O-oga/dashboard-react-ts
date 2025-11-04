import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createConnection, getPingLatency, pushAuthData, convertToWebSocketUrl, getAuthData } from '../../modules/loader';
import PrivacyModal from '../ModalWindows/Privacy/PrivacyModal';
import './LoginPage.css';

type LoginPageProps = {
    onLoginSuccess: () => void;
};

function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const { t } = useTranslation();
    const [url, setUrl] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [pingLatency, setPingLatency] = useState<number | null>(null);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

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
            // Check ping immediately and then set up interval
            const checkPing = () => {
                const latency = getPingLatency();
                if (latency !== null) {
                    setPingLatency(latency);
                }
            };
            
            // Check immediately
            checkPing();
            
            // Then check every 500ms for faster updates
            const interval = setInterval(checkPing, 500);
            return () => clearInterval(interval);
        } else {
            // Reset ping when disconnected
            setPingLatency(null);
        }
    }, [isConnected]);

    const handleConnect = async () => {
        if (!url || !token) {
            setError(t('login.errorRequired'));
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
            setError(err instanceof Error ? err.message : t('login.errorConnection'));
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

    // Helper function to highlight "Home Assistant" text
    const highlightHomeAssistant = (text: string) => {
        const parts = text.split(/(Home Assistant)/i);
        return parts.map((part, index) => 
            /Home Assistant/i.test(part) ? (
                <span key={index} className="home-assistant-highlight">{part}</span>
            ) : part
        );
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">{highlightHomeAssistant(t('login.title'))}</h1>
                
                <div className="login-form">
                    <div className="form-group">
                        <label htmlFor="url">{t('login.urlLabel')}</label>
                        <input
                            id="url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t('login.urlPlaceholder')}
                            disabled={isConnecting || isConnected}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="token">{t('login.tokenLabel')}</label>
                        <input
                            id="token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder={t('login.tokenPlaceholder')}
                            disabled={isConnecting || isConnected}
                            className="form-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="button-container">
                        {isConnected && (
                            <div className={`ping-indicator ${pingLatency !== null ? 'ping-indicator-visible' : 'ping-indicator-loading'}`}>
                                {pingLatency !== null ? `${t('login.ping')}: ${pingLatency}ms` : t('login.pingWaiting')}
                            </div>
                        )}
                        <button
                            onClick={isConnected ? handleContinue : handleConnect}
                            disabled={isConnecting}
                            className={`login-button ${isConnected ? 'login-button-connected' : ''}`}
                        >
                            {isConnecting ? t('login.connecting') : isConnected ? t('login.continueButton') : t('login.connectButton')}
                        </button>
                    </div>
                    <div className='confidentiality' onClick={() => setIsPrivacyModalOpen(true)}>
                        {t('login.privacy')}
                    </div>
                </div>
            </div>
            <div className="login-page-footer">
                <div className='autor'>Valerii Monakov © 2025</div>
                <div className='version'>{t('login.version')}</div>
            </div>
            <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
        </div>
    );
}

export default LoginPage;

