
import './ContextMenu.css';
import { useTranslation } from 'react-i18next';
import type { ContextMenuProps } from '@/types/clickContext.types';



const ContextMenu = ({ x, y, handleRemoveCard, handleEditCard, handleAddCard, handleRemoveSpace, handleAddSpace, handleChangeSpace, contextType }: ContextMenuProps) => {
    const { t } = useTranslation();

    return (
        <div className="context-menu" style={{ '--x': x, '--y': y } as React.CSSProperties}>
            <ul>
                {(contextType === 'space-card') && (
                    <>
                        <li>
                            <button
                                onClick={handleAddCard}
                                className='button-svg-light'>
                                <span>{t('contextMenu.add')}</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleEditCard}
                                className='button-svg-dark'>
                                <span>{t('contextMenu.edit')}</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleRemoveCard}
                                className='button-svg-error'>
                                <span>{t('contextMenu.remove')}</span>
                            </button>
                        </li>
                    </>
                )}
                {(contextType === 'space' || contextType === 'navi-bar-card') && (
                    <>
                        <li>
                            <button
                                onClick={handleAddSpace}
                                className='button-svg-light'>
                                <span>{t('contextMenu.addSpace')}</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleChangeSpace}
                                className='button-svg-dark'>
                                <span>{t('contextMenu.changeSpace')}</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleRemoveSpace}
                                className='button-svg-warn'>
                                <span>{t('contextMenu.removeSpace')}</span>
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default ContextMenu;