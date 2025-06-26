import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Groups from '../screens/groups/Groups';
import GroupDetail from '../screens/groups/GroupDetail';

export type GroupStackParamList = {
  Groups: undefined;
  GroupDetail: {
    groupId: string;
    groupName: string;
    groupAvatar: string;
  };
};

const Stack = createStackNavigator<GroupStackParamList>();

export default function GroupStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Since you have custom headers
        cardStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Groups" component={Groups} />
      <Stack.Screen name="GroupDetail" component={GroupDetail} />
    </Stack.Navigator>
  );
}