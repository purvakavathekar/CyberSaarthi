const ComponentFunction = function() {
  // @section:imports @depends:[]
  const React = require('react');
  const { useState, useEffect, useContext, useMemo, useCallback } = React;
  const { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform, StatusBar, Switch, ActivityIndicator, KeyboardAvoidingView, FlatList, Image } = require('react-native');
  const { MaterialIcons } = require('@expo/vector-icons');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  const { createStackNavigator } = require('@react-navigation/stack');
  const { useSafeAreaInsets } = require('react-native-safe-area-context');
  const { useQuery, useMutation } = require('platform-hooks');
  const { useLocation } = require('platform-hooks');
  const { useShare } = require('platform-hooks');
  // @end:imports

  // @section:constants @depends:[]
  var TAB_MENU_HEIGHT = Platform.OS === 'web' ? 56 : 49;
  var SCROLL_EXTRA_PADDING = 16;
  var WEB_TAB_MENU_PADDING = 90;
  var FAB_SPACING = 16;

  const storageStrategy = 'all-local';
  const primaryColor = '#2E86AB';
  const accentColor = '#4ECDC4';
  const backgroundColor = '#F8FAFC';
  const cardColor = '#FFFFFF';
  const textPrimary = '#1E293B';
  const textSecondary = '#64748B';
  const designStyle = 'modern';

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  // @end:constants

  // @section:ThemeContext @depends:[]
  const ThemeContext = React.createContext({
    theme: { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary, border: '#E5E7EB', success: '#10B981', error: '#EF4444', warning: '#F59E0B' } },
    darkMode: false,
    toggleDarkMode: function() {},
    designStyle: designStyle,
  });

  const ThemeProvider = function(props) {
    const [darkMode, setDarkMode] = useState(false);
    const lightTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: backgroundColor,
          card: cardColor,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
          border: '#E5E7EB',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B'
        }
      };
    }, []);
    const darkTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: '#1F2937',
          card: '#374151',
          textPrimary: '#F9FAFB',
          textSecondary: '#D1D5DB',
          border: '#4B5563',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B'
        }
      };
    }, []);
    const theme = darkMode ? darkTheme : lightTheme;
    const toggleDarkMode = useCallback(function() {
      setDarkMode(function(prev) { return !prev; });
    }, []);
    const value = useMemo(function() {
      return { theme: theme, darkMode: darkMode, toggleDarkMode: toggleDarkMode, designStyle: designStyle };
    }, [theme, darkMode, toggleDarkMode]);
    return React.createElement(ThemeContext.Provider, { testID: 'Provider-1', value: value }, props.children);
  };

  const useTheme = function() { return useContext(ThemeContext); };
  // @end:ThemeContext

  // @section:static-data @depends:[]
  const LEARNING_LESSONS = [
    { id: '1', title: 'UPI Payment Security', description: 'Learn how to safely use UPI payment systems', icon: 'payment', category: 'payments' },
    { id: '2', title: 'Password Security', description: 'Create strong and secure passwords', icon: 'lock', category: 'security' },
    { id: '3', title: 'Phishing Scams', description: 'Identify and avoid phishing attempts', icon: 'security', category: 'scams' },
    { id: '4', title: 'Online Banking Safety', description: 'Secure practices for online banking', icon: 'account-balance', category: 'payments' },
    { id: '5', title: 'Social Media Privacy', description: 'Protect your privacy on social platforms', icon: 'privacy-tip', category: 'privacy' }
  ];

  const PRACTICE_SESSIONS = [
    { id: '1', title: 'UPI Payment Practice', description: 'Step-by-step UPI setup and payment practice', icon: 'payment', levels: 5 },
    { id: '2', title: 'Password Creation Game', description: 'Create stronger passwords through levels', icon: 'lock', levels: 8 },
    { id: '3', title: 'App Permissions Practice', description: 'Learn to manage app permissions safely', icon: 'security', levels: 6 },
    { id: '4', title: 'Scam Call/SMS Detection', description: 'AI-powered scam identification practice', icon: 'phone', levels: 10 }
  ];

  const QUIZ_CATEGORIES = [
    { id: '1', title: 'Deepfake Detection', description: 'Identify AI-generated fake images', icon: 'photo', questions: 15 },
    { id: '2', title: 'SMS Scam Detection', description: 'Identify fraudulent text messages', icon: 'message', questions: 20 },
    { id: '3', title: 'Email Phishing Quiz', description: 'Spot phishing email attempts', icon: 'email', questions: 12 },
    { id: '4', title: 'Social Media Scams', description: 'Recognize social media fraud', icon: 'group', questions: 18 }
  ];

  const SCAM_ALERTS = [
    { id: '1', title: 'Fake Bank SMS Alert', description: 'Fraudsters are sending fake bank SMS asking for OTP. Never share your OTP with anyone.', severity: 'high', date: '2024-01-15' },
    { id: '2', title: 'UPI Refund Scam', description: 'Scammers claim to process refunds via UPI and ask for payment app access.', severity: 'medium', date: '2024-01-14' },
    { id: '3', title: 'Fake Job Offers', description: 'Work-from-home job scams asking for registration fees are increasing.', severity: 'medium', date: '2024-01-13' }
  ];

  const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];
  // @end:static-data

  // @section:LoginScreen @depends:[ThemeContext,styles]
  const LoginScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = function() {
      if (!email || !password) {
        Platform.OS === 'web' ? window.alert('Please fill in all fields') : Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      navigation.replace('MainApp');
    };

    const handleSignUp = function() {
      navigation.navigate('SignUp');
    };

    return React.createElement(KeyboardAvoidingView, { testID: 'KeyboardAvoidingView-1', style: { flex: 1, backgroundColor: theme.colors.background },
      behavior: Platform.OS === 'ios' ? 'padding' : (Platform.OS === 'web' ? undefined : 'height'),
      componentId: 'login-container'
    },
      React.createElement(ScrollView, { testID: 'ScrollView-1', style: { flex: 1 },
        contentContainerStyle: { flexGrow: 1, paddingTop: insets.top + 40, paddingHorizontal: 20, paddingBottom: 40 }
      },
        React.createElement(View, { testID: 'View-1', style: styles.loginHeader, componentId: 'login-header' },
          React.createElement(Image, { testID: 'Image-1', source: { uri: 'IMAGE:digital-security-shield-icon' },
            style: styles.loginLogo,
            componentId: 'login-logo'
          }),
          React.createElement(Text, { testID: 'Text-1', style: [styles.loginTitle, { color: theme.colors.textPrimary }], componentId: 'login-title' }, 'SafeGuard Academy'),
          React.createElement(Text, { testID: 'Text-2', style: [styles.loginSubtitle, { color: theme.colors.textSecondary }], componentId: 'login-subtitle' }, 'Learn Digital Safety')
        ),
        React.createElement(View, { testID: 'View-2', style: styles.loginForm, componentId: 'login-form' },
          React.createElement(TextInput, { testID: 'TextInput-1', style: [styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }],
            value: email,
            onChangeText: setEmail,
            placeholder: 'Email Address',
            placeholderTextColor: theme.colors.textSecondary,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
            componentId: 'input-email'
          }),
          React.createElement(TextInput, { testID: 'TextInput-2', style: [styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }],
            value: password,
            onChangeText: setPassword,
            placeholder: 'Password',
            placeholderTextColor: theme.colors.textSecondary,
            secureTextEntry: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            componentId: 'input-password'
          }),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-1', style: [styles.primaryButton, { backgroundColor: theme.colors.primary }],
            onPress: handleLogin,
            componentId: 'button-login'
          },
            React.createElement(Text, { testID: 'Text-3', style: styles.buttonText, componentId: 'login-button-text' }, 'Login')
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-2', style: [styles.secondaryButton, { borderColor: theme.colors.primary }],
            onPress: handleSignUp,
            componentId: 'button-signup-nav'
          },
            React.createElement(Text, { testID: 'Text-4', style: [styles.secondaryButtonText, { color: theme.colors.primary }], componentId: 'signup-nav-text' }, 'New User? Sign Up')
          )
        )
      )
    );
  };
  // @end:LoginScreen

  // @section:SignUpScreen @depends:[ThemeContext,styles]
  const SignUpScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    const { getCurrentLocation } = useLocation();
    
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      location: '',
      language: 'en'
    });
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const updateField = function(field, value) {
      setFormData(function(prev) {
        var updated = {};
        Object.keys(prev).forEach(function(key) {
          updated[key] = prev[key];
        });
        updated[field] = value;
        return updated;
      });
    };

    const handleGetLocation = function() {
      getCurrentLocation().then(function(result) {
        if (result.error) {
          Platform.OS === 'web' ? window.alert('Location error: ' + result.error) : Alert.alert('Location Error', result.error);
        } else {
          updateField('location', result.latitude + ',' + result.longitude);
        }
      });
    };

    const handleSignUp = function() {
      if (!formData.name || !formData.phone || !formData.email) {
        Platform.OS === 'web' ? window.alert('Please fill in all required fields') : Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      navigation.replace('MainApp');
    };

    const selectedLanguage = LANGUAGES.find(function(lang) { return lang.code === formData.language; }) || LANGUAGES[0];

    return React.createElement(KeyboardAvoidingView, { testID: 'KeyboardAvoidingView-2', style: { flex: 1, backgroundColor: theme.colors.background },
      behavior: Platform.OS === 'ios' ? 'padding' : (Platform.OS === 'web' ? undefined : 'height'),
      componentId: 'signup-container'
    },
      React.createElement(ScrollView, { testID: 'ScrollView-2', style: { flex: 1 },
        contentContainerStyle: { flexGrow: 1, paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40 }
      },
        React.createElement(View, { testID: 'View-3', style: styles.signupHeader, componentId: 'signup-header' },
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-3', style: styles.backButton,
            onPress: function() { navigation.goBack(); },
            componentId: 'button-back'
          },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-1', name: 'arrow-back', size: 24, color: theme.colors.textPrimary })
          ),
          React.createElement(Text, { testID: 'Text-5', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'signup-title' }, 'Create Account')
        ),
        React.createElement(View, { testID: 'View-4', style: styles.signupForm, componentId: 'signup-form' },
          React.createElement(TextInput, { testID: 'TextInput-3', style: [styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }],
            value: formData.name,
            onChangeText: function(text) { updateField('name', text); },
            placeholder: 'Full Name',
            placeholderTextColor: theme.colors.textSecondary,
            autoCapitalize: 'words',
            componentId: 'input-name'
          }),
          React.createElement(TextInput, { testID: 'TextInput-4', style: [styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }],
            value: formData.phone,
            onChangeText: function(text) { updateField('phone', text.replace(/[^0-9+\-() ]/g, '')); },
            placeholder: 'Phone Number',
            placeholderTextColor: theme.colors.textSecondary,
            keyboardType: 'phone-pad',
            componentId: 'input-phone'
          }),
          React.createElement(TextInput, { testID: 'TextInput-5', style: [styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }],
            value: formData.email,
            onChangeText: function(text) { updateField('email', text); },
            placeholder: 'Email Address',
            placeholderTextColor: theme.colors.textSecondary,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
            componentId: 'input-email'
          }),
          React.createElement(View, { testID: 'View-5', style: styles.locationContainer, componentId: 'location-container' },
            React.createElement(TextInput, { testID: 'TextInput-6', style: [styles.input, styles.locationInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.card, color: theme.colors.textPrimary }],
              value: formData.location,
              onChangeText: function(text) { updateField('location', text); },
              placeholder: 'Location (optional)',
              placeholderTextColor: theme.colors.textSecondary,
              componentId: 'input-location'
            }),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-4', style: [styles.locationButton, { backgroundColor: theme.colors.accent }],
              onPress: handleGetLocation,
              componentId: 'button-get-location'
            },
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-2', name: 'my-location', size: 20, color: '#FFFFFF' })
            )
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-5', style: [styles.languageSelector, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }],
            onPress: function() { setShowLanguageModal(true); },
            componentId: 'button-language-selector'
          },
            React.createElement(Text, { testID: 'Text-6', style: { color: theme.colors.textPrimary }, componentId: 'language-text' }, 
              selectedLanguage.flag + ' ' + selectedLanguage.name
            ),
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-3', name: 'keyboard-arrow-down', size: 24, color: theme.colors.textSecondary })
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-6', style: [styles.primaryButton, { backgroundColor: theme.colors.primary, marginTop: 20 }],
            onPress: handleSignUp,
            componentId: 'button-signup'
          },
            React.createElement(Text, { testID: 'Text-7', style: styles.buttonText, componentId: 'signup-button-text' }, 'Create Account')
          )
        ),
        renderLanguageModal(showLanguageModal, function() { setShowLanguageModal(false); }, theme, insets.top, insets.bottom, function(langCode) {
          updateField('language', langCode);
          setShowLanguageModal(false);
        })
      )
    );
  };
  // @end:SignUpScreen

  // @section:LanguageModal @depends:[styles]
  var renderLanguageModal = function(visible, onClose, theme, insetsTop, insetsBottom, onSelect) {
    return React.createElement(Modal, { testID: 'Modal-1', visible: visible,
      animationType: 'slide',
      transparent: true,
      onRequestClose: onClose
    },
      React.createElement(View, { testID: 'View-6', style: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', marginTop: insetsTop },
        componentId: 'language-modal-overlay'
      },
        React.createElement(View, { testID: 'View-7', style: {
            flex: 1,
            maxHeight: '70%',
            marginHorizontal: 20,
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            padding: 20,
            paddingBottom: insetsBottom + 20
          },
          componentId: 'language-modal-content'
        },
          React.createElement(Text, { testID: 'Text-8', style: [styles.modalTitle, { color: theme.colors.textPrimary }], componentId: 'language-modal-title' }, 'Select Language'),
          React.createElement(ScrollView, { testID: 'ScrollView-3', style: { flex: 1, marginTop: 16 } },
            LANGUAGES.map(function(language) {
              return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-7', key: language.code,
                style: [styles.languageOption, { borderBottomColor: theme.colors.border }],
                onPress: function() { onSelect(language.code); },
                componentId: 'language-option-' + language.code
              },
                React.createElement(Text, { testID: 'Text-9', style: { fontSize: 24 } }, language.flag),
                React.createElement(Text, { testID: 'Text-10', style: [styles.languageOptionText, { color: theme.colors.textPrimary }] }, language.name)
              );
            })
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-8', style: [styles.secondaryButton, { borderColor: theme.colors.border, marginTop: 16 }],
            onPress: onClose,
            componentId: 'button-cancel-language'
          },
            React.createElement(Text, { testID: 'Text-11', style: [styles.secondaryButtonText, { color: theme.colors.textPrimary }] }, 'Cancel')
          )
        )
      )
    );
  };
  // @end:LanguageModal

  // @section:HomeScreen @depends:[ThemeContext,styles]
const HomeScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var scrollTopPadding = insets.top;

    const [currentUser] = useState({ name: 'John Doe', profilePic: null });
    const [currentScamAlert] = useState(SCAM_ALERTS[0]);
    const [reminderSet, setReminderSet] = useState(false);

    const getGreeting = function() {
      var hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    };

    const getCurrentDate = function() {
      var today = new Date();
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return today.toLocaleDateString('en-US', options);
    };

    const handleSetReminder = function() {
      setReminderSet(!reminderSet);
      var message = reminderSet ? 'Reminder cancelled' : 'Reminder set for daily scam alerts';
      Platform.OS === 'web' ? window.alert(message) : Alert.alert('Reminder', message);
    };

    return React.createElement(ScrollView, { testID: 'ScrollView-4', style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding }
    },
      React.createElement(View, { testID: 'View-8', style: styles.homeHeader, componentId: 'home-header' },
        React.createElement(View, { testID: 'View-9', style: styles.greetingContainer, componentId: 'greeting-container' },
          React.createElement(View, { testID: 'View-10', style: { flex: 1 } },
            React.createElement(Text, { testID: 'Text-12', style: [styles.greeting, { color: theme.colors.textPrimary }], componentId: 'greeting-text' }, 
              getGreeting() + ', ' + currentUser.name
            ),
            React.createElement(Text, { testID: 'Text-13', style: [styles.dateText, { color: theme.colors.textSecondary }], componentId: 'date-text' }, 
              getCurrentDate()
            )
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-9', style: styles.profilePicContainer,
            onPress: function() { navigation.navigate('Profile'); },
            componentId: 'profile-pic-button'
          },
            currentUser.profilePic 
              ? React.createElement(Image, { testID: 'Image-2', source: { uri: currentUser.profilePic },
                  style: styles.profilePic,
                  componentId: 'profile-pic'
                })
              : React.createElement(View, { testID: 'View-11', style: [styles.profilePic, styles.profilePicPlaceholder, { backgroundColor: theme.colors.accent }], componentId: 'profile-pic-placeholder' },
                  React.createElement(Text, { testID: 'Text-14', style: styles.profilePicInitial }, currentUser.name.charAt(0))
                )
          )
        )
      ),
      React.createElement(View, { testID: 'View-12', style: styles.scamAlertContainer, componentId: 'scam-alert-container' },
        React.createElement(View, { testID: 'View-13', style: [styles.scamAlertCard, { backgroundColor: theme.colors.card }], componentId: 'scam-alert-card' },
          React.createElement(View, { testID: 'View-14', style: styles.scamAlertHeader, componentId: 'scam-alert-header' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-4', name: 'warning', size: 20, color: theme.colors.error }),
            React.createElement(Text, { testID: 'Text-15', style: [styles.scamAlertTitle, { color: theme.colors.textPrimary }], componentId: 'scam-alert-title' }, 'Scam Alert of the Day')
          ),
          React.createElement(Text, { testID: 'Text-16', style: [styles.scamAlertDescription, { color: theme.colors.textPrimary }], componentId: 'scam-alert-description' }, 
            currentScamAlert.title
          ),
          React.createElement(Text, { testID: 'Text-17', style: [styles.scamAlertDetail, { color: theme.colors.textSecondary }], componentId: 'scam-alert-detail' }, 
            currentScamAlert.description
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-10', style: [styles.reminderButton, { backgroundColor: reminderSet ? theme.colors.success : theme.colors.primary }],
            onPress: handleSetReminder,
            componentId: 'button-reminder'
          },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-5', name: reminderSet ? 'notifications-on' : 'notifications-off', size: 16, color: '#FFFFFF' }),
            React.createElement(Text, { testID: 'Text-18', style: styles.reminderButtonText, componentId: 'reminder-button-text' }, 
              reminderSet ? 'Reminder Set' : 'Set Reminder'
            )
          )
        )
      ),
      React.createElement(View, { testID: 'View-15', style: styles.menuContainer, componentId: 'menu-container' },
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-11', style: [styles.menuOption, { backgroundColor: theme.colors.card }],
          onPress: function() { navigation.navigate('Learning'); },
          componentId: 'menu-learning'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-6', name: 'school', size: 32, color: theme.colors.primary }),
          React.createElement(Text, { testID: 'Text-19', style: [styles.menuOptionText, { color: theme.colors.textPrimary }] }, 'Learning Lessons')
        ),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-12', style: [styles.menuOption, { backgroundColor: theme.colors.card }],
          onPress: function() { navigation.navigate('Practice'); },
          componentId: 'menu-practice'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-7', name: 'fitness-center', size: 32, color: theme.colors.accent }),
          React.createElement(Text, { testID: 'Text-20', style: [styles.menuOptionText, { color: theme.colors.textPrimary }] }, 'Practice Session')
        ),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-13', style: [styles.menuOption, { backgroundColor: theme.colors.card }],
          onPress: function() { navigation.navigate('Quiz'); },
          componentId: 'menu-quiz'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-8', name: 'quiz', size: 32, color: theme.colors.warning }),
          React.createElement(Text, { testID: 'Text-21', style: [styles.menuOptionText, { color: theme.colors.textPrimary }] }, 'Quiz')
        ),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-14', style: [styles.menuOption, { backgroundColor: theme.colors.card }],
          onPress: function() { navigation.navigate('Community'); },
          componentId: 'menu-community'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-9', name: 'group', size: 32, color: theme.colors.error }),
          React.createElement(Text, { testID: 'Text-22', style: [styles.menuOptionText, { color: theme.colors.textPrimary }] }, 'Community')
        ),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-15', style: [styles.menuOption, { backgroundColor: theme.colors.card }],
          onPress: function() { navigation.navigate('AIAssistant'); },
          componentId: 'menu-ai'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-10', name: 'smart-toy', size: 32, color: theme.colors.success }),
          React.createElement(Text, { testID: 'Text-23', style: [styles.menuOptionText, { color: theme.colors.textPrimary }] }, 'AI Assistant')
        )
      )
    );
  };
// @end:HomeScreen

  // @section:LearningScreen @depends:[ThemeContext,styles]
  const LearningScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'payments', 'security', 'scams', 'privacy'];
    
    const filteredLessons = selectedCategory === 'all' 
      ? LEARNING_LESSONS 
      : LEARNING_LESSONS.filter(function(lesson) { return lesson.category === selectedCategory; });

    const handleLessonPress = function(lesson) {
      Platform.OS === 'web' ? window.alert('Opening lesson: ' + lesson.title) : Alert.alert('Lesson', 'Opening: ' + lesson.title);
    };

    return React.createElement(View, { testID: 'View-16', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'learning-screen' },
      React.createElement(View, { testID: 'View-17', style: [styles.screenHeader, { paddingTop: insets.top + 20, backgroundColor: theme.colors.card }], componentId: 'learning-header' },
        React.createElement(Text, { testID: 'Text-24', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'learning-title' }, 'Learning Lessons'),
        React.createElement(Text, { testID: 'Text-25', style: [styles.screenSubtitle, { color: theme.colors.textSecondary }], componentId: 'learning-subtitle' }, 'Build your digital safety knowledge')
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-5', horizontal: true,
        showsHorizontalScrollIndicator: false,
        style: { flexGrow: 'initial', maxHeight: 60, backgroundColor: theme.colors.card },
        contentContainerStyle: { paddingHorizontal: 20, paddingVertical: 10 }
      },
        categories.map(function(category) {
          var isSelected = selectedCategory === category;
          var categoryName = category.charAt(0).toUpperCase() + category.slice(1);
          return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-16', key: category,
            style: [styles.categoryTab, { 
              backgroundColor: isSelected ? theme.colors.primary : 'transparent',
              borderColor: theme.colors.primary 
            }],
            onPress: function() { setSelectedCategory(category); },
            componentId: 'category-tab-' + category
          },
            React.createElement(Text, { testID: 'Text-26', style: [styles.categoryTabText, { 
                color: isSelected ? '#FFFFFF' : theme.colors.primary 
              }] 
            }, categoryName)
          );
        })
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-6', style: { flex: 1 },
        contentContainerStyle: { paddingBottom: scrollBottomPadding, paddingHorizontal: 20, paddingTop: 20 }
      },
        filteredLessons.map(function(lesson) {
          return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-17', key: lesson.id,
            style: [styles.lessonCard, { backgroundColor: theme.colors.card }],
            onPress: function() { handleLessonPress(lesson); },
            componentId: 'lesson-card-' + lesson.id
          },
            React.createElement(View, { testID: 'View-18', style: styles.lessonCardHeader, componentId: 'lesson-header-' + lesson.id },
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-11', name: lesson.icon, size: 24, color: theme.colors.primary }),
              React.createElement(Text, { testID: 'Text-27', style: [styles.lessonTitle, { color: theme.colors.textPrimary }] }, lesson.title)
            ),
            React.createElement(Text, { testID: 'Text-28', style: [styles.lessonDescription, { color: theme.colors.textSecondary }] }, lesson.description),
            React.createElement(View, { testID: 'View-19', style: styles.lessonFooter, componentId: 'lesson-footer-' + lesson.id },
              React.createElement(View, { testID: 'View-20', style: [styles.categoryBadge, { backgroundColor: theme.colors.accent }] },
                React.createElement(Text, { testID: 'Text-29', style: styles.categoryBadgeText }, lesson.category)
              ),
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-12', name: 'arrow-forward', size: 20, color: theme.colors.textSecondary })
            )
          );
        })
      )
    );
  };
  // @end:LearningScreen

  // @section:PracticeScreen @depends:[ThemeContext,styles]
  const PracticeScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    const handlePracticePress = function(session) {
      Platform.OS === 'web' ? window.alert('Starting practice: ' + session.title) : Alert.alert('Practice', 'Starting: ' + session.title);
    };

    return React.createElement(View, { testID: 'View-21', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'practice-screen' },
      React.createElement(View, { testID: 'View-22', style: [styles.screenHeader, { paddingTop: insets.top + 20, backgroundColor: theme.colors.card }], componentId: 'practice-header' },
        React.createElement(Text, { testID: 'Text-30', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'practice-title' }, 'Practice Sessions'),
        React.createElement(Text, { testID: 'Text-31', style: [styles.screenSubtitle, { color: theme.colors.textSecondary }], componentId: 'practice-subtitle' }, 'Hands-on security skills training')
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-7', style: { flex: 1 },
        contentContainerStyle: { paddingBottom: scrollBottomPadding, paddingHorizontal: 20, paddingTop: 20 }
      },
        PRACTICE_SESSIONS.map(function(session) {
          return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-18', key: session.id,
            style: [styles.practiceCard, { backgroundColor: theme.colors.card }],
            onPress: function() { handlePracticePress(session); },
            componentId: 'practice-card-' + session.id
          },
            React.createElement(View, { testID: 'View-23', style: styles.practiceCardHeader, componentId: 'practice-header-' + session.id },
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-13', name: session.icon, size: 28, color: theme.colors.primary }),
              React.createElement(View, { testID: 'View-24', style: { flex: 1 } },
                React.createElement(Text, { testID: 'Text-32', style: [styles.practiceTitle, { color: theme.colors.textPrimary }] }, session.title),
                React.createElement(Text, { testID: 'Text-33', style: [styles.practiceDescription, { color: theme.colors.textSecondary }] }, session.description)
              )
            ),
            React.createElement(View, { testID: 'View-25', style: styles.practiceFooter, componentId: 'practice-footer-' + session.id },
              React.createElement(View, { testID: 'View-26', style: styles.levelsContainer },
                React.createElement(MaterialIcons, { testID: 'MaterialIcons-14', name: 'layers', size: 16, color: theme.colors.accent }),
                React.createElement(Text, { testID: 'Text-34', style: [styles.levelsText, { color: theme.colors.accent }] }, session.levels + ' Levels')
              ),
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-15', name: 'play-arrow', size: 24, color: theme.colors.success })
            )
          );
        })
      )
    );
  };
  // @end:PracticeScreen

  // @section:QuizScreen @depends:[ThemeContext,styles]
  const QuizScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    const handleQuizPress = function(quiz) {
      Platform.OS === 'web' ? window.alert('Starting quiz: ' + quiz.title) : Alert.alert('Quiz', 'Starting: ' + quiz.title);
    };

    return React.createElement(View, { testID: 'View-27', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'quiz-screen' },
      React.createElement(View, { testID: 'View-28', style: [styles.screenHeader, { paddingTop: insets.top + 20, backgroundColor: theme.colors.card }], componentId: 'quiz-header' },
        React.createElement(Text, { testID: 'Text-35', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'quiz-title' }, 'Knowledge Quiz'),
        React.createElement(Text, { testID: 'Text-36', style: [styles.screenSubtitle, { color: theme.colors.textSecondary }], componentId: 'quiz-subtitle' }, 'Test your scam detection skills')
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-8', style: { flex: 1 },
        contentContainerStyle: { paddingBottom: scrollBottomPadding, paddingHorizontal: 20, paddingTop: 20 }
      },
        QUIZ_CATEGORIES.map(function(quiz) {
          return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-19', key: quiz.id,
            style: [styles.quizCard, { backgroundColor: theme.colors.card }],
            onPress: function() { handleQuizPress(quiz); },
            componentId: 'quiz-card-' + quiz.id
          },
            React.createElement(View, { testID: 'View-29', style: styles.quizCardContent, componentId: 'quiz-content-' + quiz.id },
              React.createElement(View, { testID: 'View-30', style: [styles.quizIcon, { backgroundColor: theme.colors.primary }] },
                React.createElement(MaterialIcons, { testID: 'MaterialIcons-16', name: quiz.icon, size: 24, color: '#FFFFFF' })
              ),
              React.createElement(View, { testID: 'View-31', style: { flex: 1 } },
                React.createElement(Text, { testID: 'Text-37', style: [styles.quizTitle, { color: theme.colors.textPrimary }] }, quiz.title),
                React.createElement(Text, { testID: 'Text-38', style: [styles.quizDescription, { color: theme.colors.textSecondary }] }, quiz.description),
                React.createElement(Text, { testID: 'Text-39', style: [styles.questionCount, { color: theme.colors.accent }] }, quiz.questions + ' Questions')
              ),
              React.createElement(MaterialIcons, { testID: 'MaterialIcons-17', name: 'chevron-right', size: 24, color: theme.colors.textSecondary })
            )
          );
        })
      )
    );
  };
  // @end:QuizScreen

  // @section:CommunityScreen @depends:[ThemeContext,styles]
  const CommunityScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    const [selectedFeed, setSelectedFeed] = useState('global');

    const mockPosts = [
      { id: '1', author: 'Sarah M.', location: 'Mumbai', title: 'Fake UPI App Scam', description: 'Someone created a fake UPI app that looked exactly like the real one. Lost ₹5000 before realizing.', severity: 'high', time: '2 hours ago' },
      { id: '2', author: 'Rajesh K.', location: 'Delhi', title: 'OTP Phishing Call', description: 'Received call claiming to be from my bank asking for OTP. Thankfully I hung up.', severity: 'medium', time: '5 hours ago' },
      { id: '3', author: 'Priya S.', location: 'Bangalore', title: 'Work From Home Scam', description: 'Job offer requiring ₹2000 registration fee. Avoid "DataEntry Solutions Pvt Ltd".', severity: 'medium', time: '1 day ago' }
    ];

    const handleFeedSwitch = function(feed) {
      setSelectedFeed(feed);
    };

    return React.createElement(View, { testID: 'View-32', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'community-screen' },
      React.createElement(View, { testID: 'View-33', style: [styles.screenHeader, { paddingTop: insets.top + 20, backgroundColor: theme.colors.card }], componentId: 'community-header' },
        React.createElement(Text, { testID: 'Text-40', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'community-title' }, 'Community Dashboard'),
        React.createElement(Text, { testID: 'Text-41', style: [styles.screenSubtitle, { color: theme.colors.textSecondary }], componentId: 'community-subtitle' }, 'Learn from real experiences')
      ),
      React.createElement(View, { testID: 'View-34', style: [styles.feedTabs, { backgroundColor: theme.colors.card }], componentId: 'feed-tabs' },
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-20', style: [styles.feedTab, { backgroundColor: selectedFeed === 'global' ? theme.colors.primary : 'transparent' }],
          onPress: function() { handleFeedSwitch('global'); },
          componentId: 'tab-global'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-18', name: 'public', size: 20, color: selectedFeed === 'global' ? '#FFFFFF' : theme.colors.textSecondary }),
          React.createElement(Text, { testID: 'Text-42', style: [styles.feedTabText, { color: selectedFeed === 'global' ? '#FFFFFF' : theme.colors.textSecondary }] }, 'Around the World')
        ),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-21', style: [styles.feedTab, { backgroundColor: selectedFeed === 'local' ? theme.colors.primary : 'transparent' }],
          onPress: function() { handleFeedSwitch('local'); },
          componentId: 'tab-local'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-19', name: 'location-on', size: 20, color: selectedFeed === 'local' ? '#FFFFFF' : theme.colors.textSecondary }),
          React.createElement(Text, { testID: 'Text-43', style: [styles.feedTabText, { color: selectedFeed === 'local' ? '#FFFFFF' : theme.colors.textSecondary }] }, 'Around My Place')
        )
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-9', style: { flex: 1 },
        contentContainerStyle: { paddingBottom: scrollBottomPadding, paddingHorizontal: 20, paddingTop: 20 }
      },
        mockPosts.map(function(post) {
          return React.createElement(View, { testID: 'View-35', key: post.id,
            style: [styles.communityPost, { backgroundColor: theme.colors.card }],
            componentId: 'post-' + post.id
          },
            React.createElement(View, { testID: 'View-36', style: styles.postHeader, componentId: 'post-header-' + post.id },
              React.createElement(View, { testID: 'View-37', style: { flex: 1 } },
                React.createElement(Text, { testID: 'Text-44', style: [styles.postAuthor, { color: theme.colors.textPrimary }] }, post.author),
                React.createElement(Text, { testID: 'Text-45', style: [styles.postLocation, { color: theme.colors.textSecondary }] }, post.location + ' • ' + post.time)
              ),
              React.createElement(View, { testID: 'View-38', style: [styles.severityBadge, { backgroundColor: post.severity === 'high' ? theme.colors.error : theme.colors.warning }] },
                React.createElement(Text, { testID: 'Text-46', style: styles.severityText }, post.severity.toUpperCase())
              )
            ),
            React.createElement(Text, { testID: 'Text-47', style: [styles.postTitle, { color: theme.colors.textPrimary }] }, post.title),
            React.createElement(Text, { testID: 'Text-48', style: [styles.postDescription, { color: theme.colors.textSecondary }] }, post.description),
            React.createElement(View, { testID: 'View-39', style: styles.postFooter, componentId: 'post-footer-' + post.id },
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-22', style: styles.postAction, componentId: 'post-helpful-' + post.id },
                React.createElement(MaterialIcons, { testID: 'MaterialIcons-20', name: 'thumb-up', size: 16, color: theme.colors.textSecondary }),
                React.createElement(Text, { testID: 'Text-49', style: [styles.postActionText, { color: theme.colors.textSecondary }] }, 'Helpful')
              ),
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-23', style: styles.postAction, componentId: 'post-share-' + post.id },
                React.createElement(MaterialIcons, { testID: 'MaterialIcons-21', name: 'share', size: 16, color: theme.colors.textSecondary }),
                React.createElement(Text, { testID: 'Text-50', style: [styles.postActionText, { color: theme.colors.textSecondary }] }, 'Share')
              )
            )
          );
        })
      )
    );
  };
  // @end:CommunityScreen

  // @section:ProfileScreen @depends:[ThemeContext,styles]
  const ProfileScreen = function(props) {
    var navigation = props.navigation;
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    const [userData] = useState({
      name: 'John Doe',
      streak: 15,
      totalPoints: 1250,
      level: 'Security Novice',
      completedLessons: 8,
      practiceHours: 12.5
    });

    return React.createElement(View, { testID: 'View-40', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'profile-screen' },
      React.createElement(View, { testID: 'View-41', style: [styles.screenHeader, { paddingTop: insets.top + 20, backgroundColor: theme.colors.card }], componentId: 'profile-header' },
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-24', style: styles.backButton,
          onPress: function() { navigation.goBack(); },
          componentId: 'button-back-profile'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-22', name: 'arrow-back', size: 24, color: theme.colors.textPrimary })
        ),
        React.createElement(Text, { testID: 'Text-51', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'profile-title' }, 'Profile Dashboard')
      ),
      React.createElement(ScrollView, { testID: 'ScrollView-10', style: { flex: 1 },
        contentContainerStyle: { paddingBottom: scrollBottomPadding, paddingHorizontal: 20, paddingTop: 20 }
      },
        React.createElement(View, { testID: 'View-42', style: [styles.profileCard, { backgroundColor: theme.colors.card }], componentId: 'profile-info-card' },
          React.createElement(View, { testID: 'View-43', style: styles.profileInfo, componentId: 'profile-info' },
            React.createElement(View, { testID: 'View-44', style: [styles.profilePicLarge, { backgroundColor: theme.colors.accent }], componentId: 'profile-pic-large' },
              React.createElement(Text, { testID: 'Text-52', style: styles.profilePicInitialLarge }, userData.name.charAt(0))
            ),
            React.createElement(View, { testID: 'View-45', style: { flex: 1 } },
              React.createElement(Text, { testID: 'Text-53', style: [styles.profileName, { color: theme.colors.textPrimary }] }, userData.name),
              React.createElement(Text, { testID: 'Text-54', style: [styles.profileLevel, { color: theme.colors.textSecondary }] }, userData.level),
              React.createElement(View, { testID: 'View-46', style: styles.streakContainer },
                React.createElement(MaterialIcons, { testID: 'MaterialIcons-23', name: 'local-fire-department', size: 16, color: theme.colors.warning }),
                React.createElement(Text, { testID: 'Text-55', style: [styles.streakText, { color: theme.colors.warning }] }, userData.streak + ' Day Streak!')
              )
            )
          )
        ),
        React.createElement(View, { testID: 'View-47', style: styles.statsGrid, componentId: 'stats-grid' },
          React.createElement(View, { testID: 'View-48', style: [styles.statCard, { backgroundColor: theme.colors.card }], componentId: 'stat-points' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-24', name: 'stars', size: 24, color: theme.colors.accent }),
            React.createElement(Text, { testID: 'Text-56', style: [styles.statValue, { color: theme.colors.textPrimary }] }, userData.totalPoints.toLocaleString()),
            React.createElement(Text, { testID: 'Text-57', style: [styles.statLabel, { color: theme.colors.textSecondary }] }, 'Total Points')
          ),
          React.createElement(View, { testID: 'View-49', style: [styles.statCard, { backgroundColor: theme.colors.card }], componentId: 'stat-lessons' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-25', name: 'school', size: 24, color: theme.colors.primary }),
            React.createElement(Text, { testID: 'Text-58', style: [styles.statValue, { color: theme.colors.textPrimary }] }, userData.completedLessons.toString()),
            React.createElement(Text, { testID: 'Text-59', style: [styles.statLabel, { color: theme.colors.textSecondary }] }, 'Lessons Done')
          ),
          React.createElement(View, { testID: 'View-50', style: [styles.statCard, { backgroundColor: theme.colors.card }], componentId: 'stat-practice' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-26', name: 'timer', size: 24, color: theme.colors.success }),
            React.createElement(Text, { testID: 'Text-60', style: [styles.statValue, { color: theme.colors.textPrimary }] }, userData.practiceHours.toString()),
            React.createElement(Text, { testID: 'Text-61', style: [styles.statLabel, { color: theme.colors.textSecondary }] }, 'Practice Hours')
          )
        ),
        React.createElement(View, { testID: 'View-51', style: [styles.settingsSection, { backgroundColor: theme.colors.card }], componentId: 'settings-section' },
          React.createElement(Text, { testID: 'Text-62', style: [styles.sectionTitle, { color: theme.colors.textPrimary }] }, 'Settings'),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-25', style: styles.settingsOption, componentId: 'setting-notifications' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-27', name: 'notifications', size: 24, color: theme.colors.textSecondary }),
            React.createElement(Text, { testID: 'Text-63', style: [styles.settingsOptionText, { color: theme.colors.textPrimary }] }, 'Notification Preferences'),
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-28', name: 'chevron-right', size: 24, color: theme.colors.textSecondary })
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-26', style: styles.settingsOption, componentId: 'setting-language' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-29', name: 'language', size: 24, color: theme.colors.textSecondary }),
            React.createElement(Text, { testID: 'Text-64', style: [styles.settingsOptionText, { color: theme.colors.textPrimary }] }, 'Language Settings'),
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-30', name: 'chevron-right', size: 24, color: theme.colors.textSecondary })
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-27', style: styles.settingsOption, componentId: 'setting-privacy' },
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-31', name: 'privacy-tip', size: 24, color: theme.colors.textSecondary }),
            React.createElement(Text, { testID: 'Text-65', style: [styles.settingsOptionText, { color: theme.colors.textPrimary }] }, 'Privacy & Security'),
            React.createElement(MaterialIcons, { testID: 'MaterialIcons-32', name: 'chevron-right', size: 24, color: theme.colors.textSecondary })
          )
        )
      )
    );
  };
  // @end:ProfileScreen

  // @section:AIAssistantScreen @depends:[imports,useTheme,styles]
const AIAssistantScreen = function(props) {
    const themeContext = useTheme();
    const theme = themeContext.theme;
    const insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    const [messages, setMessages] = useState([
      { id: '1', text: 'Hello! I\'m your AI Safety Assistant. Ask me anything about digital security, scams, or online safety.', sender: 'ai', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = function() {
      if (!inputText.trim()) return;

      var userMessage = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: new Date() };
      setMessages(function(prev) { return [userMessage, ...prev]; });
      setInputText('');

      // Simulate AI response
      setTimeout(function() {
        var aiResponse = { 
          id: (Date.now() + 1).toString(), 
          text: 'This is a helpful response about: ' + inputText, 
          sender: 'ai', 
          timestamp: new Date() 
        };
        setMessages(function(prev) { return [aiResponse, ...prev]; });
      }, 1000);
    };

    return React.createElement(View, { testID: 'View-52', style: { flex: 1, backgroundColor: theme.colors.background }, componentId: 'ai-assistant-screen' },
      React.createElement(View, { testID: 'View-53', style: [styles.screenHeader, { paddingTop: insets.top + 20, backgroundColor: theme.colors.card }], componentId: 'ai-header' },
        React.createElement(Text, { testID: 'Text-66', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'ai-title' }, 'AI Assistant'),
        React.createElement(Text, { testID: 'Text-67', style: [styles.screenSubtitle, { color: theme.colors.textSecondary }], componentId: 'ai-subtitle' }, 'Ask any safety questions')
      ),
      React.createElement(FlatList, { testID: 'FlatList-1', data: messages,
        renderItem: function(item) {
          var message = item.item;
          var isAI = message.sender === 'ai';
          return React.createElement(View, { testID: 'View-54', key: message.id,
            style: { flexDirection: 'row', justifyContent: isAI ? 'flex-start' : 'flex-end', paddingHorizontal: 16, paddingVertical: 8 }
          },
            React.createElement(View, { testID: 'View-55', style: { 
                maxWidth: '70%',
                backgroundColor: isAI ? theme.colors.card : theme.colors.primary,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12
              }
            },
              React.createElement(Text, { testID: 'Text-68', style: { color: isAI ? theme.colors.textPrimary : '#FFFFFF', fontSize: 14 } }, message.text)
            )
          );
        },
        inverted: true,
        contentContainerStyle: { paddingBottom: 20 },
        scrollEnabled: true,
        nestedScrollEnabled: true
      }),
      React.createElement(View, { testID: 'View-56', style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.card }, componentId: 'ai-input-area' },
        React.createElement(TextInput, { testID: 'TextInput-7', style: { flex: 1, backgroundColor: theme.colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginRight: 8, color: theme.colors.textPrimary },
          value: inputText,
          onChangeText: setInputText,
          placeholder: 'Ask a question...',
          placeholderTextColor: theme.colors.textSecondary,
          multiline: true,
          maxHeight: 100,
          componentId: 'ai-input'
        }),
        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-28', style: { backgroundColor: theme.colors.primary, borderRadius: 20, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
          onPress: handleSendMessage,
          componentId: 'ai-send-button'
        },
          React.createElement(MaterialIcons, { testID: 'MaterialIcons-33', name: 'send', size: 20, color: '#FFFFFF' })
        )
      )
    );
  };
// @end:AIAssistantScreen
// @section:TabNavigator @depends:[HomeScreen,LearningScreen,PracticeScreen,QuizScreen,CommunityScreen,AIAssistantScreen]
const TabNavigator = function() {
    var insets = useSafeAreaInsets();
    var themeContext = useTheme();
    var theme = themeContext.theme;
    return React.createElement(View, { testID: 'View-57', style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' } },
      React.createElement(Tab.Navigator, { testID: 'Navigator-1', screenOptions: {
          headerShown: false,
          tabBarStyle: { 
            position: 'absolute', 
            bottom: 0, 
            height: TAB_MENU_HEIGHT + insets.bottom, 
            borderTopWidth: 0, 
            backgroundColor: theme.colors.card,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8
          },
          tabBarItemStyle: { padding: 0 },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: { fontSize: 12, fontWeight: '500' }
        }
      },
        React.createElement(Tab.Screen, { testID: 'Screen-1', name: 'Home',
          component: HomeScreen,
          options: { 
            tabBarIcon: function(props) { 
              return React.createElement(MaterialIcons, { testID: 'MaterialIcons-34', name: 'home', size: 24, color: props.color }); 
            },
            tabBarLabel: 'Home'
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-2', name: 'Learning',
          component: LearningScreen,
          options: { 
            tabBarIcon: function(props) { 
              return React.createElement(MaterialIcons, { testID: 'MaterialIcons-35', name: 'school', size: 24, color: props.color }); 
            },
            tabBarLabel: 'Learn'
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-3', name: 'Practice',
          component: PracticeScreen,
          options: { 
            tabBarIcon: function(props) { 
              return React.createElement(MaterialIcons, { testID: 'MaterialIcons-36', name: 'fitness-center', size: 24, color: props.color }); 
            },
            tabBarLabel: 'Practice'
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-4', name: 'Quiz',
          component: QuizScreen,
          options: { 
            tabBarIcon: function(props) { 
              return React.createElement(MaterialIcons, { testID: 'MaterialIcons-37', name: 'quiz', size: 24, color: props.color }); 
            },
            tabBarLabel: 'Quiz'
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-5', name: 'Community',
          component: CommunityScreen,
          options: { 
            tabBarIcon: function(props) { 
              return React.createElement(MaterialIcons, { testID: 'MaterialIcons-38', name: 'group', size: 24, color: props.color }); 
            },
            tabBarLabel: 'Community'
          }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-6', name: 'AIAssistant',
          component: AIAssistantScreen,
          options: { 
            tabBarIcon: function(props) { 
              return React.createElement(MaterialIcons, { testID: 'MaterialIcons-39', name: 'smart-toy', size: 24, color: props.color }); 
            },
            tabBarLabel: 'AI'
          }
        })
      )
    );
  };
// @end:TabNavigator

  // @section:MainNavigator @depends:[LoginScreen,SignUpScreen,ProfileScreen,TabNavigator]
  const MainNavigator = function() {
    var themeContext = useTheme();
    var theme = themeContext.theme;
    return React.createElement(Stack.Navigator, { testID: 'Navigator-2', screenOptions: { headerShown: false }
    },
      React.createElement(Stack.Screen, { testID: 'Screen-7', name: 'Login', component: LoginScreen }),
      React.createElement(Stack.Screen, { testID: 'Screen-8', name: 'SignUp', component: SignUpScreen }),
      React.createElement(Stack.Screen, { testID: 'Screen-9', name: 'MainApp', component: TabNavigator }),
      React.createElement(Stack.Screen, { testID: 'Screen-10', name: 'Profile', component: ProfileScreen })
    );
  };
  // @end:MainNavigator

  // @section:styles @depends:[]
  const styles = StyleSheet.create({
    loginHeader: {
      alignItems: 'center',
      marginBottom: 40,
    },
    loginLogo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 20,
      backgroundColor: '#E5E7EB'
    },
    loginTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    loginSubtitle: {
      fontSize: 16,
      textAlign: 'center',
    },
    loginForm: {
      flex: 1,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      marginBottom: 16,
    },
    primaryButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    signupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    signupForm: {
      flex: 1,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    locationInput: {
      flex: 1,
      marginBottom: 0,
      marginRight: 12,
    },
    locationButton: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 12,
    },
    languageSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
    },
    languageOptionText: {
      fontSize: 16,
      marginLeft: 16,
      fontWeight: '500',
    },
    homeHeader: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    greetingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    greeting: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    dateText: {
      fontSize: 14,
    },
    profilePicContainer: {
      marginLeft: 16,
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    profilePicPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    profilePicInitial: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    scamAlertContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    scamAlertCard: {
      borderRadius: 16,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    scamAlertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    scamAlertTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    scamAlertDescription: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    scamAlertDetail: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
    },
    reminderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    reminderButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    menuContainer: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    menuOption: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    menuOptionText: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 12,
    },
    screenHeader: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    screenSubtitle: {
      fontSize: 14,
      marginTop: 4,
    },
    categoryTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
    },
    categoryTabText: {
      fontSize: 14,
      fontWeight: '600',
    },
    lessonCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    lessonCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    lessonTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 12,
      flex: 1,
    },
    lessonDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
    },
    lessonFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    practiceCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    practiceCardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    practiceTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 12,
      marginBottom: 4,
    },
    practiceDescription: {
      fontSize: 14,
      lineHeight: 18,
      marginLeft: 12,
    },
    practiceFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    levelsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    levelsText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    quizCard: {
      borderRadius: 12,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    quizCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    quizIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    quizTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    quizDescription: {
      fontSize: 14,
      marginBottom: 4,
    },
    questionCount: {
      fontSize: 12,
      fontWeight: '600',
    },
    feedTabs: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    feedTab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 25,
      marginHorizontal: 4,
    },
    feedTabText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    communityPost: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    postAuthor: {
      fontSize: 16,
      fontWeight: '600',
    },
    postLocation: {
      fontSize: 12,
      marginTop: 2,
    },
    severityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    severityText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
    postTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    postDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
    },
    postFooter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postAction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    postActionText: {
      fontSize: 14,
      marginLeft: 6,
    },
    profileCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profilePicLarge: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    profilePicInitialLarge: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    profileLevel: {
      fontSize: 14,
      marginBottom: 8,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    streakText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statCard: {
      width: '31%',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    statLabel: {
      fontSize: 12,
      textAlign: 'center',
    },
    settingsSection: {
      borderRadius: 12,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    settingsOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    settingsOptionText: {
      fontSize: 16,
      marginLeft: 12,
      flex: 1,
    },
  });
  // @end:styles

  // @section:return @depends:[ThemeProvider,MainNavigator]
  return React.createElement(ThemeProvider, { testID: 'ThemeProvider-1' },
    React.createElement(View, { testID: 'View-58', style: { flex: 1, width: '100%', height: '100%' } },
      React.createElement(StatusBar, { testID: 'StatusBar-1', barStyle: 'dark-content' }),
      React.createElement(MainNavigator)
    )
  );
  // @end:return
};
return ComponentFunction;
