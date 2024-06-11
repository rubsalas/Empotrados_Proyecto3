import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const MovementsCard = ({ movements }) => {
    return (
        <View style={styles.container}>
            {movements.map((movement, index) => (
                <View key={index} style={styles.movement}>
                    <Text style={styles.textMovement}>{!movement ? '' : 'Movement detected'}</Text>
                    <Text style={styles.textDate}>{!movement ? '' : movement}</Text>
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
        flex: 1,
        flexDirection: 'row',
    },
    textMovement: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        fontWeight: 'bold',
    },
    textDate: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        marginLeft: SIZES.medium
    },
});

export default MovementsCard;
