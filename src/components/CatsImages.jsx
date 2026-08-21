import React , { useEffect, useState } from 'react';
import useFetchCatsData from './useFetchCatsData';
import './CatsImages.css';

function CatImage(props) {
    let {id, url, width, height} = props.data;
    const maxSize = 200; // pixels
    const widthRatio = maxSize/width;
    const heightRatio = maxSize/height;
    const ratio = Math.min(widthRatio, heightRatio);
    return (
        <div className='cat-image-container'>
            <img src={url} width={width*ratio} height={height*ratio} alt=''/>
        </div>
    )
}

function CatsImages() {
    const state = useFetchCatsData();
    console.log('state = ', state);

    let contents = "";
    if (state.error) {
        contents = state.error
    } else if (state.isLoading) {
        contents = 'Loading ...';
    } else if (Array.isArray(state.data)) {
        contents = state.data.map(item => <CatImage data={item} key={item.id}/>)
    } else {
        contents = 'Unexpected error; pleaes reload the page';
    }

    return (
        <div className='cats-images-container'>
            {
                contents
            }
        </div>
    )
}

export default CatsImages;