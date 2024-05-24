import React, { useState, useEffect } from 'react';

import './Banner.css';

function Banner({ bannerImage }) {
    const defaultProfileImage = 'https://images.unsplash.com/photo-1557683316-973673baf926';
    return (
        <div alt="Banner" className="profile_banner" style={{ backgroundImage: `url(${bannerImage || defaultProfileImage})` }}>
        </div>
    );
}

export default Banner;