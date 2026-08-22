import { useEffect, useState } from 'react';

const CATS_IMAGES_URL = "https://api.thecatapi.com/v1/images/search?limit=10&page=1";
const CAT_BREED_DATA = "https://api.thecatapi.com/v1/images"; // ${id}"

function useFetchCatsData() {
    const [state, setState] = useState({
        isLoading: false, 
        error: '', 
        data: [],
    });

    useEffect(() => {
        const controller = new AbortController();

        async function doFetch() {

            try {
                setState((prev) => ({
                    ...prev, 
                    isLoading: true
                }))

                const response = await fetch(CATS_IMAGES_URL, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch cats data; http error: ${response.status}`)
                }

                const data = await response.json();

                // const breedPromises = []

                const breedPromises = data.map(item => {
                    const promise = new Promise((accept) => {
                        let breedData = {};

                        const url = `${CAT_BREED_DATA}/${item.id}`;
                        fetch(url, {
                            signal: controller.signal,
                        }).then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Fetching breed data for ' + item.id + ' failed with http status ' + response.status);
                            }
                        }).then((json) => {
                            breedData = json.breeds[0];
                        }).catch(error => {
                            console.error(error);
                        }).finally(() => {
                            item.breed = breedData;
                            accept();
                        });
                    });
                    return promise;
                })

                await Promise.allSettled(breedPromises);

                setState((prev) => ({
                    ...prev, 
                    isLoading: false,
                    data: data
                }));

            } catch(error) {
                if (controller.signal.aborted) {
                    return;
                }
                setState((prev) => ({
                    ...prev, 
                    isLoading: false,
                    error: error
                }));
            } 
        }

        doFetch();

        return () => {
            controller.abort('Unmounting');
        }
    }, []);

    return state;
}

export default useFetchCatsData;