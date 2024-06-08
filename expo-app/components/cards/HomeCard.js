import { useState } from 'react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

import SensorCard from './SensorCard';
import MovementsCard from './MovementsCard';

/*
Card principal del Home screen.
Incluye el SensorCard donde se enceuntra el estado del sensor,
la última imagen obtenida por la camara de seguridad y
el MovementCard con los ultimos moviemientos detectados por el sensor.
*/
const HomeCard = ( {url}) => {

    const [pictureUrl, setPictureUrl] = useState('https://i.imgur.com/7GAe73O.jpeg')

	return (
	
        <View style={styles.container}>    
            {/* Sensor Triggered */}
            <SensorCard isTriggered={url}/>
            {/* Image */}
            <Image
                source={{ uri: `${pictureUrl}` }}
                style={styles.image}
            />
            {/* Movements */}
            <MovementsCard/>
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
