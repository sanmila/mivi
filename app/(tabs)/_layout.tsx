import { Tabs } from 'expo-router';
import { Activity, Dumbbell, Utensils, HeartPulse, BarChart } from 'lucide-react-native';
import { View, Text, Platform } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { COLORS } from '../../constants/theme';

const TabIcon = ({ Icon, label, focused }: any) => {
  const color = focused ? '#FFFFFF' : 'rgba(255,255,255,0.6)';
  const iconSize = 26; 
  
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center', 
      minWidth: 64,
    }}>
      <Icon size={iconSize} color={color} strokeWidth={focused ? 2.2 : 1.8} />
      
      <Text style={{
        fontFamily: focused ? 'Inter_600SemiBold' : 'Inter_500Medium',
        fontSize: 10,
        textTransform: 'uppercase',
        color: color,
        letterSpacing: 0,
        textAlign: 'center',
        marginTop: 2,
        width: '100%'
      }} 
      numberOfLines={1} 
      adjustsFontSizeToFit 
      minimumFontScale={0.5}>
        {label}
      </Text>
      
      <View style={{
        marginTop: 2,
        height: 2,
        width: 20,
        backgroundColor: focused ? '#FFFFFF' : 'transparent',
        borderRadius: 1,
      }} />
    </View>
  );
};

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0F14',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => <TabIcon Icon={Activity} label={t('tabSystem')} {...props} />,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          tabBarIcon: (props) => <TabIcon Icon={Dumbbell} label={t('tabTrain')} {...props} />,
        }}
      />
      <Tabs.Screen
        name="recovery"
        options={{
          tabBarIcon: (props) => <TabIcon Icon={HeartPulse} label={t('tabRecover')} {...props} />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          tabBarIcon: (props) => <TabIcon Icon={Utensils} label={t('tabFuel')} {...props} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: (props) => <TabIcon Icon={BarChart} label={t('tabData')} {...props} />,
        }}
      />
    </Tabs>
  );
}
