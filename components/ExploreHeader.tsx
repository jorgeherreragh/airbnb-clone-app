import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const eventCategories = [
    {
        name: 'Sports',
        icon: 'football', // IonIcons
        iconType: 'ionicon'
    },
    {
        name: 'Concerts',
        icon: 'musical-notes', // IonIcons
        iconType: 'ionicon'
    },
    {
        name: 'Festivals',
        icon: 'ribbon', // IonIcons
        iconType: 'ionicon'
    },
    {
        name: 'Performing Arts',
        icon: 'mic', // IonIcons
        iconType: 'ionicon'
    },
    {
        name: 'Conferences',
        icon: 'people', // IonIcons
        iconType: 'ionicon'
    },
    {
        name: 'Virtual Events',
        icon: 'laptop', // MaterialIcons
        iconType: 'material'
    }
];

interface Props {
    onCategoryChange: (category: string) => void
}

const ExploreHeader = ({ onCategoryChange }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const selectCategory = (index: number) => {
        const selected = itemsRef.current[index];
        setActiveIndex(index)

        selected?.measure((x) => {
            scrollRef.current?.scrollTo({ x: x, y: 0, animated: true })
        })

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCategoryChange(eventCategories[index].name)
    };


    return (
        <SafeAreaView style={styles.androidSafeArea}>
            <View style={styles.container}>
                <View style={styles.actionRow}>
                    <Link href={'/(modals)/booking'} asChild>
                        <TouchableOpacity style={styles.searchButton}>
                            <Ionicons name='search' size={24} />
                            <View>
                                <Text style={{ fontFamily: 'poppins-semi' }}>Where to?</Text>
                                <Text style={{ fontFamily: 'poppins', color: Colors.grey }}>Anywhere . any week</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name='options-outline' size={24} />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                    alignItems: 'center',
                    gap: 30,
                    paddingHorizontal: 16
                }} ref={scrollRef}>
                    {eventCategories.map((item, index) => (
                        <TouchableOpacity key={index} ref={(el) => itemsRef.current[index] = el}
                            style={
                                activeIndex === index ? styles.categoriesButtonActivee : styles.categoriesButton
                            }
                            onPress={() => selectCategory(index)}>
                            {
                                item.iconType === 'ionicon' ? (
                                    <Ionicons name={item.icon as any} size={24} color={activeIndex === index ? Colors.primary : Colors.grey} />
                                ) : (
                                    <MaterialIcons name={item.icon as any} size={24} color={activeIndex === index ? Colors.primary : Colors.grey} />
                                )
                            }
                            <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        backgroundColor: '#fff',
        height: 130
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 10
    },
    filterButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#c2c2c2',
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        padding: Platform.OS === 'android' ? 8 : 14,
        borderRadius: 30,
        backgroundColor: '#fff',

        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1
        }
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'poppins-semi',
        color: Colors.grey
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: 'poppins-semi',
        color: Colors.primary
    },
    categoriesButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoriesButtonActivee: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: Colors.primary,
        borderBottomWidth: 2
    }
});

export default ExploreHeader