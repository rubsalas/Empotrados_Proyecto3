import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '../constants';

import HomeHeader from '../components/headers/HomeHeader';
import HomeCard from '../components/cards/HomeCard';

const server_url = 'http://192.168.50.180:8888';

const HomeScreen = () => {
	return (
		<SafeAreaView style={styles.containerMain}>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.white},
					headerShadowVisible: false,
					headerTitle: ''
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<HomeHeader/>
				<HomeCard url={server_url}/>
			</ScrollView>
		</SafeAreaView>
	);s
};

const styles = StyleSheet.create({
	containerMain: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	textInstructions: {
		justifyContent: 'center',
        alignSelf: 'center',
		paddingTop: 20
	}
});

export default HomeScreen;
