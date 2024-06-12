import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const SensorCard = ({ isTriggered }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sensor Triggered: {isTriggered ? 'Yes' : 'No'}</Text>
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
    text: {
		justifyContent: 'center',
        alignSelf: 'center',
        fontSize: SIZES.xLarge,
        color: COLORS.black,
	}
});

export default SensorCard;
