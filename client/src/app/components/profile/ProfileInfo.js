import React, { useState, useEffect } from 'react';
import modify from '../../../res/icon/modify.svg';
import defaultProfileImage from '../../../res/default/profile.jpg';
import { useDropzone } from 'react-dropzone';

import './ProfileInfo.css';

function ProfileInfo({ profileImage, username, creationDate, onFileReady }) {
    const [overProfile, setOverProfile] = useState(false);
    const [modifyName, setModifyName] = useState(false);

    const [name, setName] = useState(username);

    const [imageUrl, setImageUrl] = useState(profileImage || defaultProfileImage);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        if (acceptedFiles[0]) {
            setImageUrl(URL.createObjectURL(acceptedFiles[0]));
            onFileReady(acceptedFiles[0], 'profile');
        }
    }, [acceptedFiles]);

    return (
        <div className="profile_main">
            <div alt="Profile" className="profile_image" style={{ backgroundImage: `url(${imageUrl})` }}
                onMouseEnter={() => setOverProfile(true)} onMouseLeave={() => setOverProfile(false)} {...getRootProps()}>

                <input {...getInputProps()} />
                {overProfile && <div className="profile_change" style={{ borderRadius: '50%' }} >
                    <img src={modify} alt="Change profile" className="profile_change_img" />
                </div>}
            </div>
            <div className="profile_info">
                <div className="profile_username_container">
                    {!modifyName ? <div className="profile_username">{name}</div> :
                        <span role="textbox" contentEditable="true" className="profile_username_input"
                            onInput={(e) => setName(e.target.innerText)}>{name}</span>}

                    <div className="profile_edit_name_button" onClick={() => setModifyName(!modifyName)}>
                        <img src={modify} alt="Edit username" className="profile_edit_name" />
                    </div>
                </div>

                <div className="profile_creation">Membre depuis {Math.floor((new Date() - new Date(creationDate)) / (1000 * 60 * 60 * 24))} jours</div>
            </div>
        </div>
    );
}

export default ProfileInfo;