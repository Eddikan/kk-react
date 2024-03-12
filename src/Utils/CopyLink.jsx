import React, { useState } from 'react';
import { BsCheckLg } from "react-icons/bs";
import toast from 'react-hot-toast';
import { LuLink } from "react-icons/lu";


const CopyTo = ({ text, classes, standbyTitle, loadingTitle, icon, onCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        } catch (error) {
        }
    };

    return (
        <div>

            <button onClick={copyToClipboard} className={classes}>
                {isCopied ? (
                    <>
                        {icon &&
                            <>
                                <LuLink className='me-2' />
                            </>
                        }
                        <span>{loadingTitle || 'Link Copied'}</span>
                    </>
                ) : (
                    <>
                        {icon &&
                            <>
                                <LuLink className='me-2' />
                            </>
                        }
                        <span>{standbyTitle}</span>
                    </>
                )}
            </button>

        </div>
    );
};

export default CopyTo;