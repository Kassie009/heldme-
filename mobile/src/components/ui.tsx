import { Link } from 'expo-router';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const palette = {
  page: '#F7FBFF',
  card: '#FFFFFF',
  border: '#E1ECF5',
  title: '#14345A',
  body: '#37516F',
  muted: '#6C8098',
  primary: '#0C7487',
  primaryDark: '#0A6474',
  white: '#FFFFFF',
};

const drawerWidth = 272;
const openThreshold = drawerWidth * 0.22;
const closeThreshold = drawerWidth * 0.2;
const flingVelocity = 0.28;

const drawerWorkItems = ['Servicios', 'Solicitudes recibidas', 'Cotizaciones', 'Calendario', 'Chat'];
const drawerProfileItems = ['Cursos', 'Perfil y verificación'];

type MobileScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function MobileScreen({
  title,
  subtitle,
  children,
  footer,
  contentStyle,
}: MobileScreenProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerTranslateX = useMemo(() => new Animated.Value(-drawerWidth), []);

  const backdropOpacity = drawerTranslateX.interpolate({
    inputRange: [-drawerWidth, 0],
    outputRange: [0, 0.14],
    extrapolate: 'clamp',
  });

  const contentShiftX = drawerTranslateX.interpolate({
    inputRange: [-drawerWidth, 0],
    outputRange: [0, 16],
    extrapolate: 'clamp',
  });

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    Animated.spring(drawerTranslateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 24,
    }).start();
  }, [drawerTranslateX]);

  const closeDrawer = useCallback(() => {
    Animated.timing(drawerTranslateX, {
      toValue: -drawerWidth,
      duration: 170,
      useNativeDriver: true,
    }).start(() => {
      setIsDrawerOpen(false);
    });
  }, [drawerTranslateX]);

  const openGestureResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const horizontalMove = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          return horizontalMove && gestureState.dx > 6;
        },
        onPanResponderGrant: () => {
          drawerTranslateX.setValue(-drawerWidth);
        },
        onPanResponderMove: (_, gestureState) => {
          const nextValue = Math.max(-drawerWidth, Math.min(0, -drawerWidth + gestureState.dx));
          drawerTranslateX.setValue(nextValue);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > openThreshold || gestureState.vx > flingVelocity) {
            openDrawer();
            return;
          }

          closeDrawer();
        },
        onPanResponderTerminate: closeDrawer,
      }),
    [closeDrawer, drawerTranslateX, openDrawer],
  );

  const closeGestureResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const horizontalMove = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          return horizontalMove && gestureState.dx < -4;
        },
        onPanResponderMove: (_, gestureState) => {
          const nextValue = Math.max(-drawerWidth, Math.min(0, gestureState.dx));
          drawerTranslateX.setValue(nextValue);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -closeThreshold || gestureState.vx < -flingVelocity) {
            closeDrawer();
            return;
          }

          openDrawer();
        },
        onPanResponderTerminate: openDrawer,
      }),
    [closeDrawer, drawerTranslateX, openDrawer],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: contentShiftX }] }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, contentStyle]}
          >
            <View style={styles.headerRow}>
              <View style={styles.menuWrap}>
                <Text style={styles.menuIcon}>☰</Text>
                <Text style={styles.menuLabel}>Barra lateral</Text>
              </View>
              <View style={styles.logoWrap}>
                <Text style={styles.logoText}>HM</Text>
              </View>
              <Link href={'/'} style={styles.homeLink}>
                Inicio
              </Link>
            </View>

            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            {children}
          </ScrollView>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>

        <Animated.View
          pointerEvents={isDrawerOpen ? 'auto' : 'none'}
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        >
          <Pressable style={styles.backdropTouch} onPress={closeDrawer} />
        </Animated.View>

        <Animated.View
          pointerEvents={isDrawerOpen ? 'auto' : 'none'}
          style={[styles.drawerPanel, { transform: [{ translateX: drawerTranslateX }] }]}
          {...(isDrawerOpen ? closeGestureResponder.panHandlers : {})}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerBrand}>HeldMe!</Text>
            <Text style={styles.drawerTitle}>Barra lateral</Text>
          </View>

          <Text style={styles.drawerSection}>TRABAJO</Text>
          {drawerWorkItems.map((item) => (
            <View key={item} style={styles.drawerItemRow}>
              <Text style={styles.drawerOption}>{item}</Text>
            </View>
          ))}

          <Text style={styles.drawerSection}>CUENTA</Text>
          {drawerProfileItems.map((item) => (
            <View key={item} style={styles.drawerItemRow}>
              <Text style={styles.drawerOption}>{item}</Text>
            </View>
          ))}

          <View style={styles.drawerFooter}>
            <Text style={styles.drawerUserName}>Laura Cote</Text>
            <Text style={styles.drawerUserRole}>Profesionista</Text>
            <Text style={styles.drawerLogout}>Cerrar sesión</Text>
          </View>

          <View style={styles.drawerHandle} />
        </Animated.View>

        {!isDrawerOpen ? (
          <View style={styles.leftEdgeGestureArea} {...openGestureResponder.panHandlers}>
            <View style={styles.leftEdgeHandle} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

type CardProps = {
  children: ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, title, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

type InlineInputProps = {
  value: string;
};

export function InlineInput({ value }: InlineInputProps) {
  return (
    <View style={styles.inputFake}>
      <Text style={styles.inputValue}>{value}</Text>
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export function ActionButton({ label, variant = 'primary', style, onPress }: ActionButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isOutline ? styles.buttonOutline : null, style]}
    >
      <Text style={[styles.buttonText, isOutline ? styles.buttonTextOutline : null]}>{label}</Text>
    </Pressable>
  );
}

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type StatusBadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, toneContainerStyles[tone]]}>
      <Text style={[styles.badgeText, toneTextStyles[tone]]}>{label}</Text>
    </View>
  );
}

type SectionLabelProps = {
  children: ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.page,
  },
  page: {
    flex: 1,
    backgroundColor: palette.page,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  menuWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuIcon: {
    color: palette.primaryDark,
    fontSize: 17,
    fontWeight: '800',
  },
  menuLabel: {
    color: palette.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  logoWrap: {
    width: 34,
    height: 34,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#CDE2F1',
    backgroundColor: '#E8F4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  homeLink: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    color: palette.title,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.body,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.page,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#0D1F32',
    zIndex: 8,
  },
  backdropTouch: {
    flex: 1,
  },
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: drawerWidth,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E5F3',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 26,
    paddingHorizontal: 16,
    shadowColor: '#0A2136',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 6, height: 0 },
    elevation: 8,
    zIndex: 10,
  },
  drawerHeader: {
    marginBottom: 10,
  },
  drawerBrand: {
    color: palette.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  drawerTitle: {
    color: palette.title,
    fontSize: 13,
    fontWeight: '700',
  },
  drawerSection: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginTop: 12,
    marginBottom: 6,
  },
  drawerItemRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3EEF7',
    backgroundColor: '#F5FAFE',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  drawerOption: {
    color: palette.title,
    fontSize: 14,
    fontWeight: '700',
  },
  drawerFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#E3EDF6',
    paddingTop: 12,
    marginBottom: 16,
  },
  drawerUserName: {
    color: palette.title,
    fontSize: 15,
    fontWeight: '800',
  },
  drawerUserRole: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  drawerLogout: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },
  drawerHandle: {
    position: 'absolute',
    top: '45%',
    right: 6,
    width: 4,
    height: 64,
    borderRadius: 99,
    backgroundColor: '#C4D7E7',
  },
  leftEdgeGestureArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 34,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 12,
  },
  leftEdgeHandle: {
    width: 7,
    height: 84,
    borderTopRightRadius: 99,
    borderBottomRightRadius: 99,
    backgroundColor: '#A9C9DD',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    padding: 12,
  },
  cardTitle: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    flex: 1,
    color: palette.body,
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: palette.title,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
    maxWidth: '46%',
  },
  sectionLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginTop: 2,
    marginBottom: 4,
  },
  inputFake: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E8F3',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputValue: {
    color: palette.title,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    borderRadius: 12,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#CBE3F0',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '800',
  },
  buttonTextOutline: {
    color: palette.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 99,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  badgeSuccess: {
    backgroundColor: '#E7F8EE',
    borderColor: '#C4E9D1',
  },
  badgeWarning: {
    backgroundColor: '#FFF6E6',
    borderColor: '#F7E0B0',
  },
  badgeDanger: {
    backgroundColor: '#FFEDED',
    borderColor: '#F4C1C1',
  },
  badgeInfo: {
    backgroundColor: '#E8F5FC',
    borderColor: '#BFDFF0',
  },
  badgeNeutral: {
    backgroundColor: '#EEF2F6',
    borderColor: '#D7DFE8',
  },
  badgeSuccessText: {
    color: '#217A43',
  },
  badgeWarningText: {
    color: '#8D6715',
  },
  badgeDangerText: {
    color: '#932626',
  },
  badgeInfoText: {
    color: '#175B7E',
  },
  badgeNeutralText: {
    color: '#465769',
  },
});

const toneContainerStyles = {
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  danger: styles.badgeDanger,
  info: styles.badgeInfo,
  neutral: styles.badgeNeutral,
};

const toneTextStyles = {
  success: styles.badgeSuccessText,
  warning: styles.badgeWarningText,
  danger: styles.badgeDangerText,
  info: styles.badgeInfoText,
  neutral: styles.badgeNeutralText,
};
