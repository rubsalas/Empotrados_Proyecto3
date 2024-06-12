import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const MovementsCard = ({ movements }) => {
    return (
        <View style={styles.container}>
            {movements.length > 0 && movements.map((movement, index) => (
                <View key={index} style={styles.movement}>
                    <Text style={styles.textMovement}>Movement detected</Text>
                    <Text style={styles.textDate}>{movement}</Text>
                </View>
            ))}
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
    movement: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textMovement: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        fontWeight: 'bold',
    },
    textDate: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        marginLeft: SIZES.medium,
    },
});

export default MovementsCard;
