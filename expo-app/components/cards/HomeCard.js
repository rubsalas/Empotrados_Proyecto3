import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

import SensorCard from './SensorCard';
import MovementsCard from './MovementsCard';

import useFetch from '../../hook/useFetch';


/*
Card principal del Home screen.
Incluye el SensorCard donde se enceuntra el estado del sensor,
la última imagen obtenida por la camara de seguridad y
el MovementCard con los ultimos moviemientos detectados por el sensor.
*/
const HomeCard = ( {url} ) => {

    const [previousDate, setPreviousDate] = useState(null);
    const [isTriggered, setIsTriggered] = useState(false);
    const timerRef = useRef(null);

    /* Uso del hook useFetch para obtener el estado del sensor */
    const { data, isLoading, error, refetch } = useFetch("time");

    /*
    Trae el ultimo tiempo en que se ha activado el sensor.
    */
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 1000); // Actualiza los datos cada segundo (1000ms)

        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }, []);

    /* El data que trae el useFetch el la ultima vez que se activo el sensor */
    const lastTriggered = data;

    /*
    Revisa la ultima fecha para actualizar lo que se trae del servidor.
    */
    useEffect(() => {
        if (lastTriggered !== previousDate) {
            setPreviousDate(lastTriggered);
            setIsTriggered(true);

            // Limpiar cualquier temporizador anterior
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Establecer un temporizador para volver a `false` después de 5 segundos
            timerRef.current = setTimeout(() => {
                setIsTriggered(false);
            }, 5000);
        }
    }, [lastTriggered, previousDate]);

    useEffect(() => {
        return () => {
            // Limpiar el temporizador cuando el componente se desmonte
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const [pictureUrl, setPictureUrl] = useState('https://i.imgur.com/7GAe73O.jpeg')

	return (
	
        <View style={styles.container}>    
            {/* Sensor Triggered */}
            <SensorCard isTriggered={isTriggered}/>
            {/* Image */}
            <Image
                source={{ uri: `${pictureUrl}` }}
                style={styles.image}
            />
            {/* Movements */}
            <MovementsCard/>
            {/* Show the data */}
            <Text>data: {data}</Text>
        </View>
    
    );
};

const imgScl = 0.6;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.xLarge,
        flex: 1,
        flexDirection: 'collumn',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: SIZES.large,
        color: COLORS.primary,
    },
    headerBtn: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
    },
    image:
      {
        width: 640 * imgScl,
        height: 480 * imgScl,
        marginTop: 20
    },
    cardsContainer: {
        marginTop: SIZES.medium,
    },
});

export default HomeCard;
