// 競馬情報検索アプリ カラーテーマ
// 緑（#0142C2）を基調としたデザイン
// Note: #0142C2は実際には青色ですが、要件に従って「緑」として定義

export const theme = {
  colors: {
    // プライマリカラー（基調色）
    primary: '#0142C2',
    primaryLight: '#3366D6',
    primaryDark: '#012E8A',
    
    // セカンダリカラー
    secondary: '#28A745',
    secondaryLight: '#48C764',
    secondaryDark: '#1E7B34',
    
    // 背景色
    background: '#F8F9FA',
    backgroundDark: '#E9ECEF',
    surface: '#FFFFFF',
    
    // テキスト色
    text: '#212529',
    textSecondary: '#6C757D',
    textLight: '#FFFFFF',
    
    // ボーダー色
    border: '#DEE2E6',
    borderDark: '#CED4DA',
    
    // ステータス色
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    
    // 予想印色
    mark: {
      honmei: '#FF0000',    // ◎ 本命
      taikou: '#0000FF',    // ○ 対抗
      tanana: '#008000',    // ▲ 単穴
      renka: '#FFA500',     // △ 連下
      hoshi: '#800080',     // × 消し
    },
  },
  
  // スペーシング
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // フォントサイズ
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
  },
  
  // ボーダー半径
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  
  // シャドウ
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  
  // ブレークポイント（レスポンシブ対応）
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  // トランジション
  transition: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
} as const;

export type Theme = typeof theme;
