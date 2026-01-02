# Requirements Document

## Introduction

JRA中央競馬の競走馬情報検索アプリケーション。JRA-VANデータを活用し、出馬表、オッズ、成績データをWebブラウザ上で閲覧・分析できる環境を提供する。UIは緑（#0142C2）を基調としたデザインで構築する。

## Glossary

- **Keiba_Search_App**: 競馬情報検索Webアプリケーション全体
- **Race_List_View**: 開催一覧表示コンポーネント
- **Entry_Table_View**: 出馬表表示コンポーネント
- **Training_View**: 調教情報表示コンポーネント
- **Horse_Search**: 競走馬検索機能
- **Prediction_Input**: 予想印入力機能
- **Local_Storage**: ブラウザのローカルストレージ
- **API_Server**: バックエンドAPIサーバー

## Requirements

### Requirement 1: 開催一覧表示

**User Story:** As a 競馬ファン, I want to 日付ごとの開催競馬場・レース一覧を確認したい, so that 当日のレース情報を把握できる。

#### Acceptance Criteria

1. WHEN ユーザーがアプリにアクセスする THEN THE Race_List_View SHALL 当日の開催競馬場一覧を表示する
2. WHEN ユーザーが日付を選択する THEN THE Race_List_View SHALL 選択した日付の開催競馬場一覧を表示する
3. WHEN 開催競馬場が表示される THEN THE Race_List_View SHALL 各競馬場のレース番号（1R〜12R）を一覧表示する
4. WHEN ユーザーがレースを選択する THEN THE Keiba_Search_App SHALL 該当レースの出馬表画面へ遷移する

### Requirement 2: 出馬表表示

**User Story:** As a 競馬ファン, I want to レースの出馬表を確認したい, so that 出走馬の情報を把握して予想に活用できる。

#### Acceptance Criteria

1. WHEN ユーザーがレースを選択する THEN THE Entry_Table_View SHALL 馬番、馬名、騎手、斤量を表形式で表示する
2. WHEN 出馬表が表示される THEN THE Entry_Table_View SHALL 各馬の近5走の成績を表示する
3. WHEN 出馬表が表示される THEN THE Entry_Table_View SHALL 1秒以内にデータを表示する
4. IF APIからデータ取得に失敗した場合 THEN THE Entry_Table_View SHALL エラーメッセージを表示する

### Requirement 3: 調教情報表示

**User Story:** As a 競馬ファン, I want to 出走馬の調教タイムを確認したい, so that 馬の仕上がり具合を判断できる。

#### Acceptance Criteria

1. WHEN ユーザーが調教タブを選択する THEN THE Training_View SHALL 坂路1F〜4Fの調教タイムを表形式で表示する
2. WHEN ユーザーが調教タブを選択する THEN THE Training_View SHALL CW1F〜6Fの調教タイムを表形式で表示する
3. WHEN 調教データが表示される THEN THE Training_View SHALL 過去の調教タイムをグラフ形式で表示する
4. IF 調教データが存在しない場合 THEN THE Training_View SHALL データなしのメッセージを表示する

### Requirement 4: 競走馬検索

**User Story:** As a 競馬ファン, I want to 馬名で競走馬を検索したい, so that 特定の馬の過去戦績を確認できる。

#### Acceptance Criteria

1. WHEN ユーザーが馬名を入力する THEN THE Horse_Search SHALL 部分一致で候補馬を表示する
2. WHEN ユーザーが候補馬を選択する THEN THE Horse_Search SHALL 該当馬の血統情報を表示する
3. WHEN ユーザーが候補馬を選択する THEN THE Horse_Search SHALL 該当馬の過去戦績（タイム、着順）を表示する
4. IF 検索結果が0件の場合 THEN THE Horse_Search SHALL 該当馬なしのメッセージを表示する
5. WHEN 検索入力が空の場合 THEN THE Horse_Search SHALL 検索を実行せず現在の状態を維持する

### Requirement 5: 予想印入力

**User Story:** As a 競馬ファン, I want to 出馬表に予想印を入力したい, so that 自分の予想を記録・管理できる。

#### Acceptance Criteria

1. WHEN ユーザーが馬をクリックする THEN THE Prediction_Input SHALL 予想印選択メニュー（◎、○、▲、△、×）を表示する
2. WHEN ユーザーが予想印を選択する THEN THE Prediction_Input SHALL 選択した印を出馬表に表示する
3. WHEN 予想印が入力される THEN THE Prediction_Input SHALL Local_Storageに予想データを保存する
4. WHEN ユーザーが同じレースに再アクセスする THEN THE Prediction_Input SHALL 保存済みの予想印を復元表示する
5. WHEN ユーザーが予想印をクリアする THEN THE Prediction_Input SHALL 該当馬の予想印を削除しLocal_Storageを更新する

### Requirement 6: UIデザイン

**User Story:** As a ユーザー, I want to 見やすく統一感のあるUIで操作したい, so that 快適にアプリを利用できる。

#### Acceptance Criteria

1. THE Keiba_Search_App SHALL 緑（#0142C2）を基調としたカラースキームを適用する
2. THE Keiba_Search_App SHALL レスポンシブデザインでPC・タブレット・スマートフォンに対応する
3. WHEN データ読み込み中 THEN THE Keiba_Search_App SHALL ローディングインジケーターを表示する
4. THE Keiba_Search_App SHALL アクセシビリティ基準（WCAG 2.1 AA）に準拠する

### Requirement 7: エラーハンドリング

**User Story:** As a ユーザー, I want to エラー発生時に適切なフィードバックを受けたい, so that 問題を理解し対処できる。

#### Acceptance Criteria

1. IF ネットワークエラーが発生した場合 THEN THE Keiba_Search_App SHALL 接続エラーメッセージを表示する
2. IF サーバーエラーが発生した場合 THEN THE Keiba_Search_App SHALL サーバーエラーメッセージを表示する
3. WHEN エラーが発生する THEN THE Keiba_Search_App SHALL リトライボタンを表示する
