import React, { useEffect } from "react";
import ChromeDinoGame from "react-chrome-dino";

import "./NotFound.css";

export default function QuatreCentQuatre() {
    useEffect(() => {  // Patch pour supprimer les autres instances de ChromeDinoGame (bug de la bibliothèque)
        const runners = document.querySelectorAll('.runner-container');
        // Si runners est défini et supérieur à 0, alors on en gardera un seul
        if (runners && runners.length > 0) {
            for (let i = 1; i < runners.length; i++) {
                runners[i].remove();
            }
        }
    }, []);

    return (
        <div>
            <div className="not-found_container">
                <text className="not-found_title">404</text>
                <text className="not-found_subtitle">Vous semblez perdu... 🤔</text>
                <text className="not-found_text">La page que vous cherchez n'existe pas, en tout cas pas ici.</text>
                <button onClick={() => window.location.href = '/'} className="not-found_button">Retourner à l'accueil</button>
                <text className="not-found_dino">Mais en attendant, jouez à ce jeu ! (Tapez Espace) 🦖</text>
            </div>
            <ChromeDinoGame />
        </div>
    );
}

