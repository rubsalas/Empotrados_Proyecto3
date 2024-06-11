import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook para realizar solicitudes GET
const useGet = (url, dynamicPath) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const options = {
        method: 'GET',
        url: `${url}/${dynamicPath}`,
        headers: {
            'Accept-Encoding': 'application/gzip'
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.request(options);
            console.log(response.data);
            console.log(typeof response.data);
            setIsLoading(true);
            

            console.log(resultList);

            setData(resultList);

        } catch (error) {
            console.error(error);
            setError(error);
            alert('There is a fetching error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => {
        setIsLoading(true);
        fetchData();
    }

    return { data, isLoading, error, refetch };
};

export default useGet;
