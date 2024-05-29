import { View, Text, ActivityIndicator } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Link, Stack } from 'expo-router'
import ExploreHeader from '@/components/ExploreHeader'
import Listings from '@/components/Listings'
import { useQuery } from '@tanstack/react-query'
import { fetchLocations } from '@/api/locations'
import ListingsMap from '@/components/ListingsMap'
import ListingsBottomSheet from '@/components/ListingsBottomSheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const index = () => {
    const limit = 1000;
    const { data, isLoading, error } = useQuery({ queryKey: ['locations', limit], queryFn: () => fetchLocations(limit) });

    const [category, setCategory] = useState('Sports');

    const onDataChanged = (category: string) => {
        setCategory(category)
    }

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>{error.message}</Text>
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, marginTop: 80 }}>
                <Stack.Screen options={{
                    header: () => <ExploreHeader onCategoryChange={onDataChanged} />,
                }} />
                {/* <Listings isLoading={isLoading} items={data} category={category} /> */}
                <ListingsMap items={data} />
                <ListingsBottomSheet items={data} category={category} />
            </View>
        </GestureHandlerRootView>
    )
}

export default index