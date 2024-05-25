import React, { useEffect, useState } from 'react';

export default function Spinner() {

    const [showImg, setShotImg] = useState(true)
    
    return(
        <>
            {showImg ? (
                <img src = "/loading.svg"/>
            ) : (
                <h3> error: no loading image :/</h3>
            )}
        </>
    )
}