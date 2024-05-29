import { View, Text, StyleSheet, Platform } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import { defaultStyles } from '@/constants/Styles';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

interface Props {
    items: any;
}

const INITIAL_REGION = {
    latitude: 37.33,
    longitude: -122,
    latitudeDelta: 9,
    longitudeDelta: 9
}



const ListingsMap = memo(({ items }: Props) => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const onMarkerSelected = (item: any) => {
        console.log(item);
        router.push(`/listing/${item._id}`);
    }

    const renderCluster = (cluster: any) => {
        const { id, geometry, onPress, properties } = cluster;
        const points = properties.point_count;

        return (
            <Marker
                key={`cluster-${id}`}
                onPress={onPress}
                coordinate={{
                    latitude: geometry.coordinates[0],
                    longitude: geometry.coordinates[1]
                }}>
                <View style={styles.marker}>
                    <Text style={{
                        color: '#000',
                        textAlign: 'center',
                        fontFamily: 'poppins-semi'
                    }}>{points}</Text>
                </View>
            </Marker>
        )
    }

    return (
        <View style={defaultStyles.container}>
            <MapView
                style={StyleSheet.absoluteFill}
                showsUserLocation
                showsMyLocationButton
                initialRegion={INITIAL_REGION}
                animationEnabled={false}
                clusterColor='#fff'
                clusterTextColor='#000'
                clusterFontFamily='poppins-semi'
            // renderCluster={renderCluster}
            >
                {items.map((item: any, index: number) => (
                    <Marker key={index} coordinate={{
                        latitude: item.coordinates?.lat,
                        longitude: item.coordinates?.lon
                    }}
                        onPress={() => onMarkerSelected(item)}
                    >
                        <View style={styles.marker}>
                            <Text style={styles.markerText}>S/ {item.column_10}</Text>
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    marker: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        padding: 6,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        }
    },
    markerText: {
        fontSize: 14,
        fontFamily: 'poppins-semi'
    }
});

export default ListingsMap