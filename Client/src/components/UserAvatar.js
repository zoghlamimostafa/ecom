import React from 'react';

const UserAvatar = ({ user, size = 'medium', onClick, className = '' }) => {
    // Fonction pour obtenir les initiales
    const getInitials = (user) => {
        if (!user) return 'U';
        
        const firstname = user.firstname || user.name || '';
        const lastname = user.lastname || '';
        
        let initials = '';
        
        if (firstname) {
            initials += firstname.charAt(0).toUpperCase();
        }
        
        if (lastname) {
            initials += lastname.charAt(0).toUpperCase();
        }
        
        // Si pas de nom, utiliser email
        if (!initials && user.email) {
            initials = user.email.charAt(0).toUpperCase();
        }
        
        return initials || 'U';
    };

    // Fonction pour générer une couleur basée sur le nom
    const getAvatarColor = (user) => {
        if (!user) return '#6c757d';
        
        const name = user.firstname || user.name || user.email || 'User';
        let hash = 0;
        
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colors = [
            '#007bff', '#28a745', '#dc3545', '#fd7e14', '#ff8c00',
            '#e83e8c', '#20c997', '#6c757d', '#343a40', '#17a2b8'
        ];
        
        return colors[Math.abs(hash) % colors.length];
    };

    const initials = getInitials(user);
    const backgroundColor = getAvatarColor(user);

    return (
        <div 
            className={`user-avatar user-avatar-${size} ${className}`}
            style={{ backgroundColor }}
            onClick={onClick}
            title={user?.firstname || user?.name || user?.email}
        >
            <span className="user-initials">{initials}</span>
        </div>
    );
};

export default UserAvatar;