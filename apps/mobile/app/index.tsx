import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/auth';
import { theme } from '@healthscan/ui';

export default function Entry() {
  const { ready, accessToken, consentVersion } = useAuth();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!accessToken) return <Redirect href="/login" />;
  if (!consentVersion) return <Redirect href="/consent" />;
  return <Redirect href="/(tabs)" />;
}
