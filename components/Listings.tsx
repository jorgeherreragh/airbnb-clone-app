import { View, Text, FlatList, ListRenderItem, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import defaultImage from '@/assets/images/default-image.jpg';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetFlatListMethods, BottomSheetFlatListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';

const DEFAULT_IMAGE = Image.resolveAssetSource(defaultImage).uri;
interface Props {
    items: any[];
    category: string;
    isLoading?: boolean;
    refresh: number;
}

const Listings = ({ isLoading, items, category, refresh }: Props) => {
    const listRef = useRef<BottomSheetFlatListMethods>(null);
    useEffect(() => {
        console.log('RELOAD LISTINGS')
    }, [category]);

    useEffect(() => {
        if (refresh) {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }

    }, [refresh])

    const renderRow: ListRenderItem<any> = ({ item }) => (
        <Link href={`/listing/${item._id}`} asChild>
            <TouchableOpacity>
                <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
                    <Image source={{ uri: DEFAULT_IMAGE }} style={styles.image} />
                    <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
                        <Ionicons name='heart-outline' size={24} color={'#000'} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'poppins-semi', fontSize: 16 }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                            <Ionicons name='star' size={16} />
                            <Text style={{ fontFamily: 'poppins-semi' }}>{item.reviews_per_month}</Text>
                        </View>
                    </View>

                    <Text style={{ fontFamily: 'poppins' }}>{item.room_type}</Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Text style={{ fontFamily: 'poppins-semi' }}>PEN {item.column_10}</Text>
                        <Text style={{ fontFamily: 'poppins' }}>night</Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
    return (
        <View style={defaultStyles.container}>
            <BottomSheetFlatList
                ref={listRef}
                data={isLoading ? [] : items}
                renderItem={renderRow}
                ListHeaderComponent={<Text style={styles.info}>{items.length} locations</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    listing: {
        padding: 16,
        gap: 10,
        marginVertical: 16
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10
    },
    info: {
        textAlign: 'center',
        fontFamily: 'poppins-semi',
        fontSize: 16,
        marginTop: 4
    }
});

export default Listings