import React, { useState, useEffect } from 'react';
import modify from '../../../res/icon/modify.svg';
import defaultProfileImage from '../../../res/default/profile.jpg';
import { useDropzone } from 'react-dropzone';

import './ProfileInfo.css';

function ProfileInfo({ profileImage, username, creationDate, onFileReady }) {
    const [overProfile, setOverProfile] = useState(false);
    console.log(profileImage);
    const [imageUrl, setImageUrl] = useState(profileImage || defaultProfileImage);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        if (acceptedFiles[0]) {
            setImageUrl(URL.createObjectURL(acceptedFiles[0]));
            onFileReady(acceptedFiles[0]);
        }
    }, [acceptedFiles]);

    return (
        <div className="profile_main">
            <div alt="Profile" className="profile_image" style={{ backgroundImage: `url(${imageUrl})` }}
                onMouseEnter={() => setOverProfile(true)} onMouseLeave={() => setOverProfile(false)} {...getRootProps()}>
                {overProfile && <div className="profile_change" style={{ borderRadius: '50%' }}>
                    <input {...getInputProps()} />
                    <img src={modify} alt="Change profile" className="profile_change_img" />
                </div>}
            </div>
            <div className="profile_info">
                <div className="profile_username">{username}</div>
                <div className="profile_creation">Membre depuis {Math.floor((new Date() - new Date(creationDate)) / (1000 * 60 * 60 * 24))} jours</div>
            </div>
        </div>
    );
}

export default ProfileInfo;