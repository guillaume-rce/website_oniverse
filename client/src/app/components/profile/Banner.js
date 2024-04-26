import React, { useState } from 'react';
import modify from '../../../res/icon/modify.svg';

import './Banner.css';

function Banner({ bannerImage, onFileReady }) {
    const [overBanner, setOverBanner] = useState(false);
    if (!bannerImage) {
        bannerImage = 'https://images.unsplash.com/photo-1557683316-973673baf926';
    }

    return (
        <div alt="Banner" className="profile_banner" style={{ backgroundImage: `url(${bannerImage})` }}
            onMouseEnter={() => setOverBanner(true)} onMouseLeave={() => setOverBanner(false)}>

            {overBanner && <div className="profile_change">
                <img src={modify} alt="Change banner" className="profile_change_img" />
            </div>}
        </div>
    );
}

export default Banner;