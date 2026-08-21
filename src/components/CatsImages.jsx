import React , { useEffect, useState } from 'react';
import useFetchCatsData from './useFetchCatsData';
import './CatsImages.css';


function CatsImages(props) {
    return (
        <div className='cats-images-container'>
            {props.children}
        </div>
    )
}

export default CatsImages;