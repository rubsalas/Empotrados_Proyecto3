import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

import SensorCard from './SensorCard';
import MovementsCard from './MovementsCard';
import ImageCard from './ImageCard';

import useFetch from '../../hook/useFetch';

/*
Card principal del Home screen.
Incluye el SensorCard donde se enceuntra el estado del sensor,
la última imagen obtenida por la camara de seguridad y
el MovementCard con los ultimos moviemientos detectados por el sensor.
*/
const HomeCard = ({ url }) => {
    const [previousDate, setPreviousDate] = useState(null);
    const [isTriggered, setIsTriggered] = useState(false);
    const [movements, setMovements] = useState([]);
    const timerRef = useRef(null);
    const movementsRef = useRef([]);

    /* Uso del hook useFetch para obtener el estado del sensor */
    const { data, isLoading, error, refetch } = useFetch(url, 'sensor');

    /*
    Trae el ultimo tiempo en que se ha activado el sensor.
    */
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 1000); // Actualiza los datos cada segundo

        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }, []);

    /* El data que trae el useFetch es la última vez que se activó el sensor */
    const lastTriggered = data;

    /*
    Revisa la última fecha para actualizar lo que se trae del servidor.
    */
    useEffect(() => {
        if (lastTriggered && lastTriggered !== previousDate) {
            setPreviousDate(lastTriggered);
            setIsTriggered(true);

            // Modificar la referencia y eliminar el último elemento si es necesario
            let updatedMovements = [lastTriggered, ...movementsRef.current];

            // Verificar si el último elemento es un array vacío
            if (Array.isArray(updatedMovements[updatedMovements.length - 1]) && updatedMovements[updatedMovements.length - 1].length === 0) {
                updatedMovements = updatedMovements.slice(0, -1);
            }

            movementsRef.current = updatedMovements;
            setMovements(updatedMovements);

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

    return (
        <View style={styles.container}>    
            {/* Sensor Triggered */}
            <SensorCard isTriggered={isTriggered}/>
            {/* Image */}
            <ImageCard isTriggered={isTriggered} url={url} />
            {/* Movements */}
            <MovementsCard movements={movements}/>
            {/* Mostrar el último movimiento */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.xLarge,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: SIZES.large,
        color: COLORS.primary,
    },
    headerBtn: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
    },
    cardsContainer: {
        marginTop: SIZES.medium,
    },
});

export default HomeCard;
