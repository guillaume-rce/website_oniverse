import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import modify from '../../../res/icon/modify.svg';

import './GameImageEdit.css';

function GameImageEdit({ gameImage, onFileReady }) {
    const [overGame, setOverGame] = useState(false);
    const defaultProfileImage = 'https://images.unsplash.com/photo-1557683316-973673baf926';

    const [imageUrl, setImageUrl] = useState(gameImage || defaultProfileImage);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        if (acceptedFiles[0]) {
            setImageUrl(URL.createObjectURL(acceptedFiles[0]));
            onFileReady(acceptedFiles[0]);
        }
    }, [acceptedFiles]);

    return (
        <div alt="Game" className="image-game-edit" style={{ backgroundImage: `url(${imageUrl})` }}
            onMouseEnter={() => setOverGame(true)} onMouseLeave={() => setOverGame(false)} {...getRootProps()}>
            
            <input {...getInputProps()} />
            {overGame && <div className="image-game-edit-change">
                <img src={modify} alt="Change game" className="image-game-edit-change-img" />
            </div>}
        </div>
    );
}

export default GameImageEdit;