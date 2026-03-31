import React from 'react';
import { Tabs } from 'expo-router';
import { theme } from '@healthscan/ui';
import { Text } from 'react-native';

function TabLabel({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
        color: focused ? theme.colors.primary : theme.colors.textSecondary,
      }}
    >
      {name}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bg },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => <TabLabel name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Tests',
          tabBarLabel: ({ focused }) => <TabLabel name="Tests" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarLabel: ({ focused }) => <TabLabel name="Reports" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarLabel: ({ focused }) => <TabLabel name="Tips" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: ({ focused }) => <TabLabel name="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
