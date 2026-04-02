import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View, Dimensions } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { hideToast } from '../../store/slices/toastSlice';
import { useAppTheme, SIZES, SHADOWS } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Toast = () => {
  const { visible, message, type } = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();
  const { colors: theme, isDark } = useAppTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 60,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleHide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleHide = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(hideToast());
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return theme.primary;
      case 'error':
        return theme.destructive;
      default:
        return theme.secondary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF',
          borderColor: theme.border,
        },
        SHADOWS.deep,
      ]}>
      <View style={[styles.iconContainer, { backgroundColor: getTypeColor() + '20' }]}>
        <Ionicons name={getIcon()} size={20} color={getTypeColor()} />
      </View>
      <Text style={[styles.text, { color: theme.text }]}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    borderWidth: 1,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  text: {
    fontSize: SIZES.bodyRegular,
    fontWeight: '600',
    flex: 1,
  },
});
