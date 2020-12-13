import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AnimatedTabBar, {TabsConfig, BubbleTabBarItemConfig} from '@gorhom/animated-tabbar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Home } from '../screens/Home/Home';
import { Contacts } from '../screens/Contacts/Contacts';
import { Profile } from '../screens/Profile/Profile';
import { useTheme } from 'react-native-paper';

// const tabs: TabsConfig<BubbleTabBarItemConfig> = {
//   Home: {
//     labelStyle: {
//       color: '#603F83',
//     },
//     icon: {
//       component: <MaterialCommunityIcons name="home" color="#603F83" size={14}/>,
//       activeColor: '#603F83',
//       inactiveColor: '#000000',
//     },
//     background: {
//       activeColor: '#603F8377',
//       inactiveColor: '#603F8300',
//     },
//   },
//   Contacts: {
//     labelStyle: {
//       color: '#603F83',
//     },
//     icon: {
//       component: <MaterialCommunityIcons name="account-multiple-outline" color="#603F83" size={14}/>,
//       activeColor: '#603F83',
//       inactiveColor: '#000000',
//     },
//     background: {
//       activeColor: '#603F8377',
//       inactiveColor: '#603F8300',
//     },
//   },
//   Profile: {
//     labelStyle: {
//       color: '#603F83',
//     },
//     icon: {
//       component: <MaterialCommunityIcons name="account-outline" color="#603F83" size={14}/>,
//       activeColor: '#603F83',
//       inactiveColor: '#000000',
//     },
//     background: {
//       activeColor: '#603F8377',
//       inactiveColor: '#603F8300',
//     },
//   },
// };

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: colors.surface }}
      inactiveColor={colors.disabled}
      initialRouteName="Home"
      // tabBar={(props: any) => (
      //   <AnimatedTabBar tabs={tabs} {...props} />
      // )}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ 
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name={focused ? "home" : "home-outline"} color={focused ? colors.text : colors.disabled} size={21}/>
          ),
          tabBarColor: colors.primary
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name={focused ? "account-multiple" : "account-multiple-outline"} color={focused ? colors.text : colors.disabled} size={21} />
          )
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name={focused ? "account" : "account-outline"} color={focused ? colors.text : colors.disabled} size={21} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export {
  BottomNavigator
}