import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, SIZES } from '../../constants';

const HomeHeader = () => {
	return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>Security Cam</Text>
            <Text style={styles.textProject}>Proyecto 3</Text>
        </View>
    );
};

const textScale = 1.5;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: COLORS.white,
        paddingLeft: 20,
        paddingVertical: 20
	},
	textProject: {
        fontSize: SIZES.large * textScale,
        color: COLORS.secondary,
      },
    textTitle: {
        fontSize: SIZES.xLarge * textScale,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 5
      },
});

export default HomeHeader;
