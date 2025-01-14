import React, {useState} from 'react';
import {  SafeAreaView, Text } from 'react-native';

const Home = (navigation) => {
    return (
        <SafeAreaView>
            <Text>Hello</Text>
            <button onPress={() => navigation.navigate(Routes.Login)}>Login here</button>
        </SafeAreaView>
    );
};

export default Home;