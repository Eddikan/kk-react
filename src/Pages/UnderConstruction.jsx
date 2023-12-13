import React from 'react';
import 'Assets/styles/UnderConstruction/style.css';
import Layout from 'Components/Layout/Layout';
import KoutureLogo from 'Assets/images/kouture-konect-logo.png'

const UnderConstruction = () => {
    return (
        <Layout>
            <section id="under-construction">
                <div className="under-construction-container">
                    <div className="construction-content">
                        <img
                            src={KoutureLogo}
                            alt="Kouture Konect"
                            className="construction-image mb-4"
                        />
                        <h1>Under Construction</h1>
                        <p>We're working on something awesome. Please check back later!</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default UnderConstruction;
