import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

enum OAuthStrategy {
    Google = 'oauth_google',
    Apple = 'oauth_apple',
    Facebook = 'oauth_facebook'
}

const Login: React.FC = () => {
    useWarmUpBrowser();
    const router = useRouter();
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
    const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

    const onSelectAuth = async (strategy: OAuthStrategy) => {
        const selectedAuth = {
            [OAuthStrategy.Google]: googleAuth,
            [OAuthStrategy.Apple]: appleAuth,
            [OAuthStrategy.Facebook]: facebookAuth
        }[strategy];

        console.log(`Selected Auth Strategy: ${strategy}`);

        try {
            const { createdSessionId, setActive, signIn, signUp } =
                await selectedAuth();

            if (createdSessionId) {
                await setActive!({ session: createdSessionId });
                router.back();
            } else {
                const response = await signUp?.update({
                    username: signUp!.emailAddress!.split("@")[0].split('.')[0],
                });
                if (response?.status === "complete") {
                    await setActive!({ session: signUp!.createdSessionId });
                    router.back();
                }
            }
        } catch (error) {
            console.error(`OAuth Error: ${error}`);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                autoCapitalize="none"
                placeholder="Email"
                style={[defaultStyles.inputField, { marginBottom: 30 }]}
                keyboardType="email-address"
                accessibilityLabel="Email Input"
            />
            <TouchableOpacity style={defaultStyles.button} onPress={() => {/* Lógica para continuar con email */ }}>
                <Text style={defaultStyles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.separatorView}>
                <View style={styles.separatorLine} />
                <Text style={styles.separator}>or</Text>
                <View style={styles.separatorLine} />
            </View>

            <View style={{ gap: 20 }}>
                <TouchableOpacity style={styles.buttonOutline}>
                    <Ionicons name="call-outline" size={24} style={defaultStyles.buttonIcon} />
                    <Text style={styles.buttonOutlineText}>Continue with Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline} onPress={() => onSelectAuth(OAuthStrategy.Apple)}>
                    <Ionicons name="logo-apple" size={24} style={defaultStyles.buttonIcon} />
                    <Text style={styles.buttonOutlineText}>Continue with Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline} onPress={() => onSelectAuth(OAuthStrategy.Google)}>
                    <Ionicons name="logo-google" size={24} style={defaultStyles.buttonIcon} />
                    <Text style={styles.buttonOutlineText}>Continue with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOutline} onPress={() => onSelectAuth(OAuthStrategy.Facebook)}>
                    <Ionicons name="logo-facebook" size={24} style={defaultStyles.buttonIcon} />
                    <Text style={styles.buttonOutlineText}>Continue with Facebook</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 26
    },
    separatorView: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 30
    },
    separator: {
        fontFamily: 'poppins-semi',
        color: Colors.grey
    },
    separatorLine: {
        flex: 1,
        borderBottomColor: '#000',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    buttonOutlineText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'poppins-semi'
    }
});

export default Login;
