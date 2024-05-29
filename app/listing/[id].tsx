import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { fetchLocationById } from '@/api/locations';
import { useQuery } from '@tanstack/react-query';
import defaultImage from '@/assets/images/default-image.jpg';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const DEFAULT_IMAGE = Image.resolveAssetSource(defaultImage).uri;
const Page = () => {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({ queryKey: ['locations', id], queryFn: () => fetchLocationById(id as any) });

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        };
    }, []);

    const shareListing = async () => {
        try {
            await Share.share({
                title: data.name,
                url: 'https://google.com.pe',
            });
        } catch (err) {
            console.log(err);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerTransparent: true,

            headerBackground: () => (
                <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
                        <Ionicons name="share-outline" size={22} color={'#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton}>
                        <Ionicons name="heart-outline" size={22} color={'#000'} />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={'#000'} />
                </TouchableOpacity>
            ),
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                ref={scrollRef}
                scrollEventThrottle={16}
            >
                <Animated.Image source={{ uri: DEFAULT_IMAGE }} style={[styles.image, imageAnimatedStyle]} />

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{data?.name}</Text>
                    <Text style={styles.location}>
                        {data?.room_type} in {data?.smart_location}
                    </Text>
                    <Text style={styles.rooms}>
                        {data?.guests_included} guests · {data?.bedrooms} bedrooms · {data?.beds} bed ·{' '}
                        {data?.bathrooms} bathrooms
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons name="star" size={16} />
                        <Text style={styles.ratings}>
                            {data?.review_scores_rating / 20} · {data?.number_of_reviews} reviews
                        </Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image source={{ uri: data?.host_picture_url }} style={styles.host} />

                        <View>
                            <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {data?.host_name}</Text>
                            <Text>Host since {data?.host_since}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.description}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, earum ducimus! Est, iste, corporis laboriosam fugiat beatae quo ad ea delectus voluptate dolorum perspiciatis minima distinctio illum necessitatibus unde neque.</Text>
                </View>
            </Animated.ScrollView>

            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.footerText}>
                        <Text style={styles.footerPrice}>PEN {data?.column_10}</Text>
                        <Text style={{ fontFamily: 'poppins' }}>night</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[defaultStyles.button, { paddingHorizontal: 20 }]}>
                        <Text style={defaultStyles.buttonText}>Reserve</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    image: {
        height: IMG_HEIGHT,
        width: width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'poppins-semi',
    },
    location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'poppins-semi',
    },
    rooms: {
        fontSize: 16,
        color: Colors.grey,
        marginVertical: 4,
        fontFamily: 'poppins',
    },
    ratings: {
        fontSize: 16,
        fontFamily: 'poppins-semi',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
    },
    host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
    },
    hostView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    footerText: {
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerPrice: {
        fontSize: 18,
        fontFamily: 'poppins-semi',
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary,
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    header: {
        backgroundColor: '#fff',
        height: 100,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
    },

    description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'poppins',
    },
});
export default Page