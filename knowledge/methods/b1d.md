<!-- meta
legacy: knowledge/_legacy/機能設計書.md L5107-L5195
source: source/package/Independent/Import/Method/
-->
# B_method1d: Method AML 調査 (No.49〜60)

## 49. h4_CheckDATWFStart
- 言語: C# / id 6026864D9E54420FB5324C7001758309 / comments: 「帳票マスタ・開達書式系の担当者を確認」
- 概要: 帳票マスタ(h4_DATMaster)/開達書式(h4_DATFormat)/開達書式一括承認(h4_AppWFGroupForDATFormat)のWF開始(最初の遷移)時に、担当者一覧に必要なロールが揃っているか確認。一括承認の場合は承認対象のチェックも実施。
- 呼び出し契機(推測): WFの最初のパスのメソッド。入力は this.id = Activity ID(`this.getProperty("id")`)。
- 出力: this(OK) / newError(h4_S_E_0002, h4_S_E_0005, h4_S_E_0006, h4_S_E_0007, h4_S_E_0808, h4_S_E_0809)。
- フロー(全て Administrators権限):
  1. `Workflow Process Activity`(related_id=ActivityID)→source_id(=Workflow Process)→`Workflow`(related_id=ProcessID, select related_id,source_id,source_type,created_on)。複数あれば created_on 最新のWFを採用。source_type から ItemType名を取得。
  2. ItemType別に担当者一覧名を決定: h4_DATMaster→`h4_DATMaster CLN`; h4_DATFormat→`h4_DATFormat CLN`(h4_category=="EXPTest" なら `h4_DATFormat EXPCLN`); h4_AppWFGroupForDATFormat→`h4_AppWFGrForDATFormat CLN`(h4_isexp=="1" なら `h4_AppWFGrForDATFormat EXPCLN`)。
  3. 一括承認(h4_AppWFGroupForDATFormat)の場合のみ `h4_AppWFGr4DATFormat DATFormat` の各対象(action="delete"除外/related null除外)について: (2) h4_category の EXP 有無が一括の h4_isexp と不一致→`h4_S_E_0808`(keyed_name引数); (3) state が InProgress 以外→`h4_S_E_0809`。(1)他の一括承認への紐づき重複チェックはコメントアウト(「一括で対象にしている段階で紐づけ不可なので省略」)。参考として h4_SaveCKAppWFGroup4DATFormat を記載。
  4. 担当者一覧(related_id,h4_workflow_role)を取得。0件→`h4_S_E_0005`、related_idが空の行→`h4_S_E_0005`。is_alias!="1"の行はスキップ。ロール Creater/ReleaseApprover/Approver/InspEXPStaff/InspEXPApprover/Q1Staff/Q1Approver の存在フラグ集計。
  5. 通常(DATMaster/DATFormat/AppWFGrForDATFormat CLN): Creater・ReleaseApprover・Approver 全て必要、不足→`h4_S_E_0006`。EXP(DATFormat EXPCLN/AppWFGrForDATFormat EXPCLN): InspEXPStaff・InspEXPApprover・Q1Staff・Q1Approver・ReleaseApprover 全て必要、不足→`h4_S_E_0007`。
- 注意: 帳票マスタ/開達書式CLNの再確認で Identity取得は行うが結果は未使用。

## 50. h4_checkDeadline
- 言語: C# / id 1FBFB6E1F4F14C46A0CAE6E12264FDD4 / comments: 「提出期限を過ぎている場合は編集が出来ないようにする。」
- 概要: 提出期限(h4_deadline)超過時、承認者以外が編集(保存)できないようにする。
- 呼び出し契機(推測): 対象ItemTypeの onBeforeUpdate/onBeforeLock など(マルQページ/必要資料等。リレーション名を `this.getType()+" CLN"` で組むため担当者一覧(CLN)を持つ型)。
- フロー: ログインユーザーが Administrators(2618D6F5...)または Aras PLM(56A96DA9...)のメンバーなら許可。DBから h4_deadline 取得、未設定・パース不可なら許可。`DateTime.Now.Date <= 期限.Date`(期限日当日まで)なら許可。`<Type> CLN`(h4_workflow_role, related_id)を走査し、ロールが "Approver" の Identity にログインユーザーが属すれば許可。該当なしなら UserMessage `h4_S_E_0018` エラー。例外は h4_S_E_0002。

## 51. h4_CheckDuplicatAppTarget
- 言語: C# / id 9CF84D8D1AD94BC98CD9C9FCD4B7F15F / comments: 「一括承認対象の承認対象になっているか確認する（マルQページ・必要資料用）」
- 概要: 指定アイテムIDが既に別の(カレントの)一括承認(h4_ApprovalWFGroup)の承認対象(h4_ApprovalWFGroup_ApTarget)になっていないか確認。
- 入力(this): allItemIDList(カンマ区切りID)。出力: this / エラー(メッセージを返し呼出元で表示)。
- フロー(Administrators権限): `h4_ApprovalWFGroup_ApTarget` を `related_id IN (...)` で取得 → 各 source_id の h4_ApprovalWFGroup の `is_current`=="1" なら重複とみなし related_id を収集 → 重複があれば `h4_ApprovalTarget` の keyed_name を取得して UserMessage `h4_C_E_0005`(カンマ連結の名称)でエラー。取得エラーは `h4_C_E_0002`。
- 注意: where句にID文字列を直接連結(SQLインジェクション懸念は呼出側ID前提)。

## 52. h4_CheckDuplicatAppTargetForDat
- 言語: C# / id A504463A79544FC9A970CCA70F8E6523 / comments: 「一括承認対象の承認対象になっているか確認する（h4_AppWFGroupForDATFormat用）」
- 概要: 51の開達書式版。`h4_AppWFGr4DATFormat DATFormat`(related_id IN allItemIDList)→ source の h4_AppWFGroupForDATFormat の is_current=="1" なら重複。重複時 `h4_DATFormat` の keyed_name を取得して `h4_C_E_0202` でエラー。取得エラーは `h4_S_E_0002`。入力・Administrators権限は51と同じ。

## 53. h4_CheckIsLockRelatedDAT
- 言語: C# / id 853B53F6B8274F28ACCB1F5691297F39 / comments: 「配下の開達書式がロックされていないか確認」
- 概要: 帳票マスタ配下の開達書式が全てアンロックか確認(承認後の開達書式プロパティ変更のため事前確認。コメント「LCのPostで実装」)。
- 呼び出し契機: LCのPostメソッド(コメント記載)。this=WF Process。
- フロー: h4_GetControlledItem(this)→対象が h4_DATMaster 以外なら何もしない→`h4_CheckIsLockRelatedDAT_Core`(setID=帳票マスタID)呼出、エラーはそのメッセージで newError。
- 他Method: h4_GetControlledItem, h4_CheckIsLockRelatedDAT_Core。

## 54. h4_CheckIsLockRelatedDAT_Core
- 言語: C# / id DEF627BD0FEF4615A804214D2A5DF1B4 / comments: 「WF・LCで実行するための共通動作 配下開達書式のロックチェック」
- 概要: this.getID()=帳票マスタID。`h4_DATMaster DATFormat`(related_id)の h4_DATFormat(id,locked_by_id,keyed_name)を走査し、`locked_by_id` が空でないものの keyed_name を収集。1件でもあれば `h4_S_E_0201`(カンマ連結名)でエラー、なければ this。Administrators権限。エラー h4_S_E_0002。

## 55. h4_CheckLockHist
- 言語: C# / id 90BC781EFEEE4F72935774587BB5E400 / comments: 「配下の改訂履歴がロックされているか確認する」
- 概要: 帳票マスタ/改訂履歴/一括承認で、配下アイテムと自身の改訂履歴のロック状況を確認(公開時に改訂履歴へ値を入力する準備)。WF側ラッパー。
- フロー: h4_GetControlledItem(this)→`h4_CheckLockHist_Core`(setID=対象ID, property type=対象型名)呼出。エラーはそのメッセージで newError(h4_S_E_0002 は取得失敗時)。
- 他Method: h4_GetControlledItem, h4_CheckLockHist_Core。

## 56. h4_CheckLockHist_Core
- 言語: C# / id 233DAAE51C744501AF2EEECA7A1ACF47 / comments: 「WF・LCで実行するための共通動作 配下の改訂履歴がロックされているか確認する」
- 入力: this.getID()=親アイテムID、this.type=親型(h4_DATMaster / h4_DATFormat / h4_AppWFGroupForDATFormat)。出力: this / newError。Administrators権限。
- フロー:
  1. 自身チェック(型が h4_DATFormat または h4_DATMaster): `h4_DATMaster RevisionHistory` / `h4_DATFormat RevisionHistory` の related(h4_RevisionHistory: id,locked_by_id,keyed_name,h4_newest_revision_history)を取得し、`checkRelationHistLock`(後述)で関連改訂履歴のロックも確認。ロックあり(自身 locked_by_id が非空、または枝番にロック)ならエラー `h4_S_E_0009`(引数: 親keyed_name, 改訂履歴keyed_name, 枝番)。
  2. 配下チェック(型が h4_DATMaster または h4_AppWFGroupForDATFormat): `h4_DATMaster DATFormat` / `h4_AppWFGr4DATFormat DATFormat` の各開達書式について `h4_DATFormat RevisionHistory` の改訂履歴を同様にチェック、問題があれば開達書式keyed_nameを親として `h4_S_E_0009` でエラー(最初の1件で終了)。
  3. `checkRelationHistLock(inn, HistItem, ref errorString)`: 渡された改訂履歴(枝番1)の `h4_newest_revision_history` が自分自身なら成功。違えば最新履歴を取得して fetchLockStatus、`h4_RevisionHistory RevHist`(related_id(h4_revision_sub_number))の各関連のロック有無を確認し、ロック中の `h4_revision_sub_number` を数値昇順カンマ連結で errorString に格納、ロック有り=false を返す。
- 注意: 枝番文字列の組み立て(tmpSubNum)は、`!isSuccess` 時に結局 `tmpSubNum = tmpErrorString` で上書きされる(自身ロックの"1"は失われる)。self-lock時の初期値 ";" の分岐あり(コードのまま)。

## 57. h4_CheckLockRelationDoc
- 言語: C# / id 5CF195EFC6B9486EA2DF369A9B46CAA7 / comments: 「Relationの先のドキュメントがロックされていないことを確認する。」
- 概要: 保存時、リレーション先ドキュメント(Document)が他人にロックされていないか確認(自分のロックは保存時に解除されるため対象外)。
- 呼び出し契機(推測): onBeforeUpdate(this=マルQページ/必要資料等、コンテキストの Relationships を使用)。
- フロー: `h4_GetDocumentRelationName`(typename=this.getType())でドキュメントへのリレーションItemType名一覧取得(Administrators権限)。各リレーションについて `this.getRelationships(名)` の related_id(Document)を取得(新規追加ドキュメントは検索に引っかからずスキップ)、`getLockStatus()==2`(他人ロック)のドキュメントの keyed_name を収集。1件以上で `h4_S_E_0010`(カンマ連結)のエラー。例外は ex.ToString() をそのままエラーにする。
- 他Method: h4_GetDocumentRelationName。
- 注意: ロックステータス2=他者ロックとコメントしている(「自身がロックしている物は…」の記述と判定値の対応はコード通り)。

## 58. h4_CheckManagedByIdRequired
- 言語: C# / id 5173F1A57F77417CB1B2EE725C3529A6 / comments: 「保存時に一括承認アイテムでは編集者、開達実施要領一括承認アイテムでは管理者を必須にする。」
- 概要: managed_by_id 必須チェック(サーバー版)。対象: h4_ApprovalWFGroup(ラベル「編集者」)、h4_AppWFGroupForDATFormat(ラベル「管理者」)。他型は何もしない。
- 呼び出し契機: コード記載「想定イベント: onBeforeUpdate」。
- フロー: managed_by_id が空なら UserMessage `h4_C_I_0702`(既定 "[{0}] は必須入力です")の `{0}` をラベルで置換してエラー。

## 59. h4_checkModelName
- 言語: C# / id F07F26AE83B94612A1420006879FB3D5 / comments: 「機種呼称が⊿バージョンとマップしているか確認」(exec: Administrators)
- 概要: マルQページ保存時、機種呼称(h4_model_name=HRDPMTypModelProject ID)が⊿バージョン(h4_delta_version)とマップされているかサーバー側で確認(40のクライアント版に対応)。
- フロー: `HRDPMTypModelProject`の name 取得 → List `h4_ModelName` の Filter Value で filter==⊿バージョン かつ value==name があればOK。なければ UserMessage `h4_C_I_0404` のエラー。例外時 h4_S_E_0002。
- 呼び出し契機(推測): h4_MQPage の onBeforeAdd/Update。

## 60. h4_CheckReqDocYryrState
- 言語: C# / id 39C01BC10D4A481981109B6D51E5A9CF / comments: 「やるやら承認依頼ステートの必要資料が含まれているなら遷移中断」
- 概要: WF遷移時に配下必要資料が「やるやら承認依頼(YryrRequestApproval)」ステートなら遷移(Vote)を中止。
- 適用場面(コード記載): マルQページ系統=仮承認・承認時、一括承認で配下が必要資料=作業中からの遷移時。
- フロー(Administrators権限): h4_GetControlledItem(this)で対象と state 取得。
  - h4_MQPage: state が RequestApproval または ProvisionalApproved のときのみ。`h4_MQPage ReqDoc` の related h4_ReqDoc(state,keyed_name)を確認。
  - h4_ApprovalWFGroup: `h4_ApprovalWFGroup_ApTarget` の related(h4_ApprovalTarget)から先頭の実型を判定。承認対象がマルQページなら state が RequestApproval/ProvisionalApproved のとき、必要資料なら state が InProgress のときだけチェック(他は何もしない)。承認対象がマルQの場合はさらに各マルQの `h4_MQPage ReqDoc` の必要資料をチェック。
  - 他型は何もしない。state=="YryrRequestApproval" の必要資料の keyed_name を収集し、1件以上で UserMessage `h4_S_E_0016`(名称を `<br>` 連結)でエラー。取得エラーは h4_S_E_0002。
- 他Method: h4_GetControlledItem。


