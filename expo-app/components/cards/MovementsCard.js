import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const MovementsCard = ( {isTriggered}) => {

	return (
	
        <View style={styles.container}>
            <Text>Last movement</Text>
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

export default MovementsCard;
