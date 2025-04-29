import React, { useState } from 'react';
import { Text, SafeAreaView, Button} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { logout } from '../../utils/auth';


const Settings = () => {
    

  return (
    <SafeAreaView>
        <ScrollView>
            <Button title="Logout" onPress={async () => {
              await logout(); 
            }} />
        </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;