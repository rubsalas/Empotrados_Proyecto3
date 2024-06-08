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

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: COLORS.white,
        paddingLeft: 20,
        paddingVertical: 20
	},
	textProject: {
        fontSize: SIZES.large,
        color: COLORS.secondary,
      },
    textTitle: {
        fontSize: SIZES.xLarge,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 2,
      },
});

export default HomeHeader;
