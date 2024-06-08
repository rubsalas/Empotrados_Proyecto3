import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '../constants';

import HomeHeader from '../components/headers/HomeHeader';
import HomeCard from '../components/cards/HomeCard';

const url = 'http://172.20.10.2:8888';

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
				{/* Home Layout Image */}
				{/* <View style={styles.containerImage}>
					<Image source={homeLayoutImage} style={styles.image} resizeMode="cover"/>
				</View> */}
				{/* <Text style={styles.textInstructions}>Scroll down to control your home.</Text> */}
				<HomeCard url={url}/>
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
