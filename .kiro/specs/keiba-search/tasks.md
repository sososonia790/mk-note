# Implementation Plan: 競馬情報検索アプリ (Keiba Search)

## Overview

React + TypeScriptでJRA中央競馬の競走馬情報検索Webアプリケーションを構築する。緑（#0142C2）を基調としたUIデザインで、開催一覧、出馬表、調教情報、馬検索、予想印入力機能を実装する。

## Tasks

- [x] 1. プロジェクトセットアップ
  - [x] 1.1 Vite + React + TypeScriptプロジェクト作成
    - `npm create vite@latest keiba-search -- --template react-ts`
    - 必要な依存関係をインストール（react-router-dom, recharts）
    - _Requirements: 6.1, 6.2_
  - [x] 1.2 テスト環境セットアップ
    - Vitest, fast-check, React Testing Libraryをインストール
    - vitest.config.ts設定
    - _Requirements: Testing Strategy_
  - [x] 1.3 テーマとスタイル設定
    - 緑（#0142C2）基調のカラーテーマ定義
    - グローバルスタイル設定
    - _Requirements: 6.1_

- [x] 2. 型定義とユーティリティ
  - [x] 2.1 型定義ファイル作成
    - Race, Entry, TrainingData, Horse, Prediction型を定義
    - _Requirements: 2.1, 3.1, 4.2_
  - [x] 2.2 LocalStorageユーティリティ作成
    - 予想印の保存・読み込み・削除関数
    - _Requirements: 5.3, 5.4, 5.5_
  - [x] 2.3 Property Test: 予想印ラウンドトリップ
    - **Property 11: 予想印のラウンドトリップ保存**
    - **Validates: Requirements 5.3, 5.4**

- [x] 3. 共通コンポーネント
  - [x] 3.1 Headerコンポーネント作成
    - ナビゲーションリンク（開催一覧、馬検索）
    - _Requirements: 6.1_
  - [x] 3.2 Loadingコンポーネント作成
    - ローディングインジケーター表示
    - _Requirements: 6.3_
  - [x] 3.3 ErrorMessageコンポーネント作成
    - エラーメッセージとリトライボタン表示
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 3.4 Property Test: ローディング状態表示
    - **Property 13: ローディング状態の表示**
    - **Validates: Requirements 6.3**
  - [x] 3.5 Property Test: エラー時リトライボタン
    - **Property 14: エラー時のリトライボタン表示**
    - **Validates: Requirements 7.3**

- [ ] 4. APIクライアントとモックデータ
  - [ ] 4.1 APIクライアント作成
    - fetch wrapper with error handling
    - 各エンドポイント用関数
    - _Requirements: 2.4, 7.1, 7.2_
  - [ ] 4.2 モックデータ作成
    - 開催、出馬表、調教、馬データのサンプルJSON
    - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 5. Checkpoint - 基盤確認
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. 開催一覧機能
  - [ ] 6.1 RaceListコンポーネント作成
    - 日付選択と競馬場一覧表示
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 6.2 RaceCardコンポーネント作成
    - 競馬場名とレース番号一覧
    - _Requirements: 1.3, 1.4_
  - [ ] 6.3 useRacesフック作成
    - 開催データ取得ロジック
    - _Requirements: 1.1, 1.2_
  - [ ] 6.4 Property Test: 日付選択による開催一覧
    - **Property 1: 日付選択による開催一覧取得**
    - **Validates: Requirements 1.2**
  - [ ] 6.5 Property Test: レース番号完全表示
    - **Property 2: レース番号の完全表示**
    - **Validates: Requirements 1.3**

- [ ] 7. 出馬表機能
  - [ ] 7.1 EntryTableコンポーネント作成
    - 馬番、馬名、騎手、斤量の表形式表示
    - _Requirements: 2.1_
  - [ ] 7.2 HorseRowコンポーネント作成
    - 各馬の情報行と近走成績
    - _Requirements: 2.1, 2.2_
  - [ ] 7.3 PastResultsコンポーネント作成
    - 近5走の成績表示
    - _Requirements: 2.2_
  - [ ] 7.4 useEntriesフック作成
    - 出馬表データ取得ロジック
    - _Requirements: 2.1, 2.4_
  - [ ] 7.5 Property Test: 出馬表必須情報表示
    - **Property 3: 出馬表の必須情報表示**
    - **Validates: Requirements 2.1**
  - [ ] 7.6 Property Test: 近走成績表示
    - **Property 4: 近走成績の表示**
    - **Validates: Requirements 2.2**

- [ ] 8. 調教情報機能
  - [ ] 8.1 TrainingTableコンポーネント作成
    - 坂路・CW調教タイム表示
    - _Requirements: 3.1, 3.2_
  - [ ] 8.2 TrainingChartコンポーネント作成
    - Rechartsで調教タイムグラフ描画
    - _Requirements: 3.3_
  - [ ] 8.3 useTrainingフック作成
    - 調教データ取得ロジック
    - _Requirements: 3.1, 3.4_
  - [ ] 8.4 Property Test: 調教タイム表示
    - **Property 5: 調教タイムの表示**
    - **Validates: Requirements 3.1, 3.2**
  - [ ] 8.5 Property Test: 調教グラフ表示
    - **Property 6: 調教グラフの表示**
    - **Validates: Requirements 3.3**

- [ ] 9. Checkpoint - 主要機能確認
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. 競走馬検索機能
  - [ ] 10.1 HorseSearchコンポーネント作成
    - 検索入力フォームと候補表示
    - _Requirements: 4.1, 4.4, 4.5_
  - [ ] 10.2 HorseDetailコンポーネント作成
    - 血統情報と過去戦績表示
    - _Requirements: 4.2, 4.3_
  - [ ] 10.3 useHorseSearchフック作成
    - 馬名検索ロジック（部分一致）
    - _Requirements: 4.1, 4.5_
  - [ ] 10.4 Property Test: 馬名部分一致検索
    - **Property 7: 馬名部分一致検索**
    - **Validates: Requirements 4.1**
  - [ ] 10.5 Property Test: 馬詳細情報表示
    - **Property 8: 馬詳細情報の表示**
    - **Validates: Requirements 4.2, 4.3**
  - [ ] 10.6 Property Test: 空検索防止
    - **Property 9: 空検索の防止**
    - **Validates: Requirements 4.5**

- [ ] 11. 予想印入力機能
  - [ ] 11.1 PredictionMarkコンポーネント作成
    - 予想印表示（◎○▲△×）
    - _Requirements: 5.2_
  - [ ] 11.2 MarkSelectorコンポーネント作成
    - 印選択メニュー表示
    - _Requirements: 5.1_
  - [ ] 11.3 usePredictionフック作成
    - 予想印の状態管理とLocalStorage連携
    - _Requirements: 5.3, 5.4, 5.5_
  - [ ] 11.4 Property Test: 予想印表示更新
    - **Property 10: 予想印の表示更新**
    - **Validates: Requirements 5.2**
  - [ ] 11.5 Property Test: 予想印削除
    - **Property 12: 予想印の削除**
    - **Validates: Requirements 5.5**

- [ ] 12. ルーティングと統合
  - [ ] 12.1 React Router設定
    - ルート定義（/, /race/:id, /search）
    - _Requirements: 1.4_
  - [ ] 12.2 Appコンポーネント統合
    - 全コンポーネントの統合とレイアウト
    - _Requirements: 6.1, 6.2_

- [ ] 13. Final Checkpoint - 全機能確認
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property tests are required for comprehensive quality
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- モックAPIを使用するため、実際のJRA-VAN連携は別途実装が必要
