import { useState, useEffect } from 'react';
import axios from 'axios';

// const url = 'http://172.20.10.2:8888';
const url = 'http://192.168.50.180:8888';

const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [error, setError] = useState(null);

    const options = {
        method: 'GET',
        url: `${url}/${endpoint}`
    };

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await axios.request(options);

            /* */
            console.log(response.data);
            
            // Procesar el response.data para obtener solo el texto del campo specific-date
            const specificDate = response.data;//['lastTriggered'];

            setData(specificDate);
            /* */

            setIsLoading(false);
        } catch (error) {
            setError(error);
            //alert('There is a fetching error')
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();

         // Configuramos un intervalo para que se actualicen los datos cada 500ms
         // const interval = setInterval(fetchData, 500);

         // Limpiamos el intervalo cuando el componente se desmonta para evitar fugas de memoria
         // return () => clearInterval(interval);
    }, []);

    const refetch = () => {
        setIsLoading(true);
        fetchData();
    }

    return { data, isLoading, error, refetch };
}

export default useFetch;
