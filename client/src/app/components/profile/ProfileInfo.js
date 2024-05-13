import React, { useState, useEffect, useRef } from 'react';
import modify from '../../../res/icon/modify.svg';
import defaultProfileImage from '../../../res/default/profile.jpg';
import admin from '../../../res/icon/admin.png';
import shopping from '../../../res/icon/shopping-cart.png';
import { useDropzone } from 'react-dropzone';

import './ProfileInfo.css';

function ProfileInfo({ profileImage, username, creationDate, role, onFileReady }) {
    const inputRef = useRef(null);

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

    function handleNameChange(name) {
        setName(name);
        const url = 'http://localhost:3001/user/pseudo'
        fetch(url, {
            // const userId = req.headers.userid;
            // const token = req.headers.token;
            // const pseudo = req.body.pseudo;
            method: 'POST',
            headers: {
                'userid': localStorage.getItem('userId') || sessionStorage.getItem('userId'),
                'token': localStorage.getItem('token') || sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pseudo: name })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Erreur lors de la modification du pseudo :', error);
            });
    }

    console.log(role);

    return (
        <div className="profile_main">
            <div alt="Profile" className="profile_image" style={{ backgroundImage: `url(${imageUrl})` }}
                onMouseEnter={() => setOverProfile(true)} onMouseLeave={() => setOverProfile(false)} {...getRootProps()}>
                {role === 1 && <img src={admin} alt="Admin" className="profile_admin" />}
                
                <input {...getInputProps()} />
                {overProfile && <div className="profile_change" style={ role === 1 ? { top: '-40px' } : { top: '0' }}>
                    <img src={modify} alt="Change profile" className="profile_change_img" />
                </div>}
            </div>
            <div className="profile_info">
                <div className="profile_username_container">
                    {!modifyName ? <div className="profile_username">{name}</div> :
                        <input className="profile_username_input" ref={inputRef} value={name}
                            onChange={(e) => handleNameChange(e.target.value)} />}

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