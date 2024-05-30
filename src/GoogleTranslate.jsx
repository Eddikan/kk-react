import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const GoogleTranslate = () => {
    useEffect(() => {
        const addTranslateScript = () => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        };

        const initializeGoogleTranslate = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        window.googleTranslateElementInit = initializeGoogleTranslate;
        addTranslateScript();
    }, []);

    return (
        <div>
            <Helmet>
                <meta name="google" content="notranslate" />
                <meta name="robots" content="noindex" />
            </Helmet>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
        </div>
    );
};

export default GoogleTranslate;
