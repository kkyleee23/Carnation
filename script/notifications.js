// Notification System
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        this.container = container;

        // Add CSS if not already added
        if (!document.getElementById('notificationCSS')) {
            this.addNotificationCSS();
        }
    }

    addNotificationCSS() {
        const css = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            }

            .notification {
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 16px 20px;
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                max-width: 300px;
                min-width: 250px;
                position: relative;
                pointer-events: auto;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification.hide {
                transform: translateX(400px);
                opacity: 0;
            }

            .notification::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #8B5CF6, #A855F7);
            }

            .notification.success::before {
                background: linear-gradient(90deg, #10B981, #059669);
            }

            .notification.error::before {
                background: linear-gradient(90deg, #EF4444, #DC2626);
            }

            .notification.warning::before {
                background: linear-gradient(90deg, #F59E0B, #D97706);
            }

            .notification.info::before {
                background: linear-gradient(90deg, #3B82F6, #2563EB);
            }

            .notification-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
            }

            .notification-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            .notification-title {
                font-weight: 600;
                font-size: 15px;
            }

            .notification-close {
                background: none;
                border: none;
                color: #b3b3b3;
                cursor: pointer;
                font-size: 16px;
                padding: 4px;
                margin-left: auto;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .notification-close:hover {
                color: #fff;
                background: rgba(255, 255, 255, 0.1);
            }

            .notification-message {
                color: #e5e5e5;
                line-height: 1.4;
            }

            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }

            .notification-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .notification-btn.primary {
                background: linear-gradient(135deg, #8B5CF6, #A855F7);
                border: none;
            }

            .notification-btn.primary:hover {
                background: linear-gradient(135deg, #7C3AED, #9333EA);
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                background: rgba(255, 255, 255, 0.3);
                transition: width linear;
            }

            @keyframes notificationSlideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            @media (max-width: 768px) {
                .notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }

                .notification {
                    max-width: none;
                    min-width: auto;
                }
            }
        `;

        const style = document.createElement('style');
        style.id = 'notificationCSS';
        style.textContent = css;
        document.head.appendChild(style);
    }

    show(message, type = 'info', options = {}) {
        const {
            title = null,
            duration = 4000,
            actions = [],
            persistent = false,
            icon = null
        } = options;

        const id = Date.now() + Math.random();
        const notification = this.createNotification(id, message, type, {
            title,
            duration,
            actions,
            persistent,
            icon
        });

        this.container.appendChild(notification);
        this.notifications.push({ id, element: notification, type });

        // Trigger show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-hide if not persistent
        if (!persistent && duration > 0) {
            this.scheduleHide(id, duration);
        }

        return id;
    }

    createNotification(id, message, type, options) {
        const { title, actions, persistent, icon, duration } = options;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('data-id', id);

        const typeIcons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            default: '🎵'
        };

        const displayIcon = icon || typeIcons[type] || typeIcons.default;

        let html = '';

        if (title || !persistent) {
            html += '<div class="notification-header">';
            html += `<span class="notification-icon">${displayIcon}</span>`;
            if (title) {
                html += `<span class="notification-title">${title}</span>`;
            }
            if (!persistent) {
                html += '<button class="notification-close" onclick="hideNotification(' + id + ')">×</button>';
            }
            html += '</div>';
        }

        html += `<div class="notification-message">${message}</div>`;

        if (actions && actions.length > 0) {
            html += '<div class="notification-actions">';
            actions.forEach(action => {
                const btnClass = action.primary ? 'notification-btn primary' : 'notification-btn';
                html += `<button class="${btnClass}" onclick="${action.handler}">${action.text}</button>`;
            });
            html += '</div>';
        }

        // Add progress bar for auto-hide notifications
        if (!persistent && duration > 0) {
            html += '<div class="notification-progress"></div>';
        }

        notification.innerHTML = html;

        // Add progress bar animation
        if (!persistent && duration > 0) {
            const progressBar = notification.querySelector('.notification-progress');
            setTimeout(() => {
                progressBar.style.width = '0%';
                progressBar.style.transition = `width ${duration}ms linear`;
            }, 100);
        }

        return notification;
    }

    scheduleHide(id, duration) {
        setTimeout(() => {
            this.hide(id);
        }, duration);
    }

    hide(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.element.classList.remove('show');
            notification.element.classList.add('hide');

            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.parentNode.removeChild(notification.element);
                }
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 400);
        }
    }

    hideAll() {
        this.notifications.forEach(notification => {
            this.hide(notification.id);
        });
    }

    // Music-specific notifications
    showMusicNotification(message, songData = null) {
        let title = 'Now Playing';
        let displayMessage = message;
        
        if (songData) {
            title = songData.title;
            displayMessage = `by ${songData.artist}`;
        }

        return this.show(displayMessage, 'default', {
            title: title,
            duration: 3000,
            icon: '🎵'
        });
    }

    showPlaylistNotification(action, playlistName) {
        const messages = {
            added: `Added to ${playlistName}`,
            removed: `Removed from ${playlistName}`,
            created: `Created playlist "${playlistName}"`,
            deleted: `Deleted playlist "${playlistName}"`
        };

        return this.show(messages[action] || action, 'success', {
            title: 'Playlist Updated',
            duration: 2500,
            icon: '📋'
        });
    }

    showVolumeNotification(volume) {
        const volumeIcon = volume === 0 ? '🔇' : volume < 30 ? '🔈' : volume < 70 ? '🔉' : '🔊';
        
        return this.show(`Volume: ${Math.round(volume)}%`, 'info', {
            duration: 1500,
            icon: volumeIcon
        });
    }
}

// global notif system
const notificationSystem = new NotificationSystem();

// global functions.
window.showNotification = (message, type = 'info', options = {}) => {
    return notificationSystem.show(message, type, options);
};

window.hideNotification = (id) => {
    return notificationSystem.hide(id);
};

window.showMusicNotification = (message, songData = null) => {
    return notificationSystem.showMusicNotification(message, songData);
};

window.showPlaylistNotification = (action, playlistName) => {
    return notificationSystem.showPlaylistNotification(action, playlistName);
};

window.showVolumeNotification = (volume) => {
    return notificationSystem.showVolumeNotification(volume);
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}