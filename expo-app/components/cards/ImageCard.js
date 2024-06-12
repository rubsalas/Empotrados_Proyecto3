import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { COLORS, SIZES } from '../../constants';

const ImageCard = ({ isTriggered, url }) => {
    const [imageSrc, setImageSrc] = useState('https://imgur.com/OzVKeIa.jpeg');

    useEffect(() => {
        if (isTriggered) {
            const fetchImage = async () => {
                try {
                    console.log('Fetching image from:', `${url}/picture`);
                    const response = await axios.get(`${url}/picture`);
                    console.log('Response data:', response.data);
                    setImageSrc(response.data['link']);
                } catch (error) {
                    console.error('Error fetching the image:', error);
                }
            };

            fetchImage();
        }
    }, [isTriggered, url]);

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imageSrc }}
                style={styles.image}
            />
        </View>
    );
};

const imgScl = 0.6;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.xLarge,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    image: {
        width: 640 * imgScl,
        height: 480 * imgScl,
        marginTop: 20,
    },
});

export default ImageCard;
