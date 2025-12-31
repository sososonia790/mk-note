# ☁️ CloudFormationテンプレートの構造

## 1. **CloudFormationとは**

- **AWSリソースをコードで作成・管理するサービス（IaC）**
    
- **JSONまたはYAML形式のテンプレート**を使用
    
- 冪等性（同じテンプレートなら何度実行しても同じ状態になる）
    

---

## 2. **基本構造**

CloudFormationテンプレートは主に以下のセクションで構成されます：

|セクション|説明|試験ポイント|
|---|---|---|
|**AWSTemplateFormatVersion**|テンプレートのバージョン（任意）|SAAでは「存在することを知っておく」程度|
|**Description**|テンプレートの説明文|省略可|
|**Parameters**|ユーザー入力値（例: VPC ID, インスタンスタイプ）|動的設定を可能にする|
|**Mappings**|固定値のマッピング（例: リージョン別AMI ID）|条件分岐で利用|
|**Conditions**|条件式によるリソース作成の制御|例: テスト環境ではEC2を作らない|
|**Resources**|作成するAWSリソースの定義（必須）|SAAで最重要！|
|**Outputs**|作成したリソースの情報出力|他スタックやユーザー参照用|
|**Transform**|マクロ/サーバーレス変換（例: AWS::Serverless-2016-10-31）|SAMテンプレート利用時|

---

## 3. **リソース（Resources）**

- テンプレートの中心
    
- AWSリソースごとに **Logical ID** を付与して定義
    
- 例：EC2、S3、IAM Role、VPCなど
    
- 依存関係は **DependsOn** で明示可能
    

`Resources:   MyEC2Instance:     Type: AWS::EC2::Instance     Properties:       InstanceType: t3.micro       ImageId: ami-0abcdef1234567890       SecurityGroupIds:         - sg-0123456789abcdef`

---

## 4. **パラメータ（Parameters）**

- テンプレート作成時に動的値を入力できる
    
- デフォルト値や制約（AllowedValues）も設定可能
    

`Parameters:   InstanceTypeParam:     Type: String     Default: t3.micro     AllowedValues:       - t2.micro       - t3.micro       - t3.small     Description: EC2 instance type`

---

## 5. **出力（Outputs）**

- 作成したリソース情報を出力
    
- 他のスタックから **ImportValue** で参照可能
    
- 例：EC2のパブリックIPやS3バケット名を出力
    

`Outputs:   InstancePublicIP:     Description: Public IP of EC2 instance     Value: !GetAtt MyEC2Instance.PublicIp`

---

## 6. **条件（Conditions）**

- 条件式でリソース作成の有無を制御
    
- !If / !Equals / !Not などを利用
    

`Conditions:   CreateProdResources: !Equals [ !Ref EnvType, prod ]  Resources:   ProdDB:     Type: AWS::RDS::DBInstance     Condition: CreateProdResources     Properties:       DBInstanceClass: db.t3.medium`

---

## 7. **Mappings**

- リージョンごとに異なる値を保持（AMI IDなど）
    

`Mappings:   RegionMap:     us-east-1:       AMI: ami-0abcdef1234567890     ap-northeast-1:       AMI: ami-0123456789abcdef`

---

## 8. **CloudFormationスタック**

- テンプレートを **スタック** としてデプロイ
    
- スタック単位でリソースの作成・更新・削除を管理
    
- **変更セット（Change Set）** で更新前に差分確認可能
    

---

## 9. SAA試験ポイントまとめ

- **必須理解**：
    
    - Resources、Parameters、Outputsの役割
        
    - スタック単位で作成・管理する
        
    - 依存関係管理（DependsOn）
        
- **応用理解**：
    
    - Mappingsでリージョン別AMIなど管理
        
    - Conditionsで環境ごとにリソースを制御
        
    - Outputsで他スタックにリソース情報を提供