import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import modify from '../../../res/icon/modify.svg';

import './Banner.css';

function Banner({ bannerImage, onFileReady }) {
    const [overBanner, setOverBanner] = useState(false);
    const defaultProfileImage = 'https://images.unsplash.com/photo-1557683316-973673baf926';

    const [imageUrl, setImageUrl] = useState(bannerImage || defaultProfileImage);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        if (acceptedFiles[0]) {
            setImageUrl(URL.createObjectURL(acceptedFiles[0]));
            onFileReady(acceptedFiles[0], 'banner');
        }
    }, [acceptedFiles]);

    return (
        <div alt="Banner" className="profile_banner" style={{ backgroundImage: `url(${imageUrl})` }}
            onMouseEnter={() => setOverBanner(true)} onMouseLeave={() => setOverBanner(false)} {...getRootProps()}>
            
            <input {...getInputProps()} />
            {overBanner && <div className="profile_banner_change">
                <img src={modify} alt="Change banner" className="profile_change_img" />
            </div>}
        </div>
    );
}

export default Banner;