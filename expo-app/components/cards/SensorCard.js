import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';


const SensorCard = ( {isTriggered} ) => {

	return (
	
        <View style={styles.container}>
            <Text>Sensor Triggered</Text>
        </View>
    
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.xLarge,
        flex: 1,
        flexDirection: 'collumn',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    }
});

export default SensorCard;
