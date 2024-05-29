import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import Listings from './Listings';
import BottomSheet from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    items: any[];
    category: string;
}

const ListingsBottomSheet = ({
    items,
    category
}: Props) => {
    const [refresh, setRefresh] = useState(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['10%', '100%'], []);

    const showMap = () => {
        bottomSheetRef.current?.collapse();
        setRefresh(refresh + 1);
    }
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            handleIndicatorStyle={{ backgroundColor: Colors.grey }}
            style={styles.sheetContainer}
        >
            <View style={{ flex: 1 }}>
                <Listings items={items} category={category} refresh={refresh} />
                <View style={styles.absoluteButton}>
                    <TouchableOpacity onPress={showMap} style={styles.button}>
                        <Text style={{ fontFamily: 'poppins-semi', color: '#fff' }}>Map</Text>
                        <Ionicons name='map' size={20} color={'#fff'} />
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    absoluteButton: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        alignItems: 'center'
    },
    button: {
        backgroundColor: Colors.dark,
        padding: 16,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        gap: 8,
        marginHorizontal: 'auto'
    },
    sheetContainer: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        borderRadius: 10,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 1,
            height: 1
        }
    }
});

export default ListingsBottomSheet