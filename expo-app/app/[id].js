import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '../constants';

import HomeHeader from '../components/headers/HomeHeader';
import HomeCard from '../components/cards/HomeCard';

const server_url = 'http://192.168.50.180:8888';

const HomeScreen = () => {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.containerMain}>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.white},
					headerShadowVisible: false,
					headerTitle: ""
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<HomeHeader/>
				<HomeCard url={server_url}/>
			</ScrollView>
		</SafeAreaView>
	);
};

const imgScl = 0.6;

const styles = StyleSheet.create({
	containerMain: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	homeCard: {
		padding: 10
	},
	containerImage: {
        width: 498 * imgScl,
		height: 895 * imgScl,
        justifyContent: 'center',
        alignSelf: 'center',
		borderWidth: 3,
		borderColor: COLORS.gray,
    },
	image: {
        width: '100%',
        height: '100%', 
        resizeMode: 'contain',
    },
	textInstructions: {
		justifyContent: 'center',
        alignSelf: 'center',
		paddingTop: 20
	}
});

export default HomeScreen;
