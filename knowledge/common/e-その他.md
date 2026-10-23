<!-- meta
legacy: knowledge/_legacy/機能設計書.md L4503-L4785
source: source/package/
-->
## 7. その他の定義

### 7.1 EMail Message (7件)

全件 `from_user` = `Innovator Admin`(User)。本文(`body_html`)はXML上 HTMLエスケープ済みで、`<br>` `<a href=...>` を含む。`{...}` はプレースホルダ(置換処理はMethod側。XMLからは置換方法は読み取れない)。`body_plain` は空または未設定。

| name | subject(件名) | 本文(body_html)の内容 | 使用プレースホルダ |
|---|---|---|---|
| h4_MsgOfficeToConverterError | 【OfficeToConverter】タスク処理失敗ItemID:${Item/taskId} | 「コンバージョンタスクでのPDF変換が失敗しました。」+「アイテムリンク」(リンク先 `${Item/StartItem}`) | `${Item/taskId}`, `${Item/StartItem}` |
| h4_pullBackMail | 【引き戻し】 {KeyName} | 「{runUser}さんより引き戻しとなりました。」「レビュー対象アイテム:リンク({ItemURL})」 | `{KeyName}`, `{runUser}`, `{ItemURL}` |
| h4_WFMail | 【{Path}】 {KeyName} | 「{ItemName}が作成されました。{Request}をお願いします。{UserComment}」+ 確認手順(1. リンクをクリック 2. 画面中の「サインオフ」タブを選択 3. 「サインオフ」タブ中のVOTE NOWをクリック)+「※本メールには返信しないでください。」 | `{Path}`, `{KeyName}`, `{ItemName}`, `{Request}`, `{UserComment}`, `{ItemURL}` |
| h4_WFMailApprove | 【発行】 {KeyName} | 「{KeyName}が発行されました。確認してください。{UserComment}」+リンク({ItemURL})+「※本メールには返信しないでください。」 | `{KeyName}`, `{UserComment}`, `{ItemURL}` |
| h4_WFMailReject | 【{Path}】 {KeyName} | 「{KeyName}が否認されました。修正をお願いします。{UserComment}」+ コメント確認手順(リンク→「サインオフ」タブ→承認者コメントを確認)+ 再申請手順(1. {ItemName}を修正 2. 「サインオフ」タブ 3. VOTE NOWをクリック)+返信不可の注記 | `{Path}`, `{KeyName}`, `{ItemName}`, `{UserComment}`, `{ItemURL}` |
| h4_WFYryrApproveResult | 【{Path}】 {KeyName} | 「{KeyName}のやるやら承認依頼が{Request}されました。確認してください。{UserComment}」+リンク+返信不可の注記 | `{Path}`, `{KeyName}`, `{Request}`, `{UserComment}`, `{ItemURL}` |
| h4_WFYryrReview | 【{Path}】 {KeyName} | 「{ItemName}でやるやら承認依頼が行われました。やるやら理由の確認と承認をお願いします。」+ 確認手順(リンク→「サインオフ」タブ→VOTE NOW)+返信不可の注記 | `{Path}`, `{KeyName}`, `{ItemName}`, `{ItemURL}` |

### 7.2 UserMessage (92件、全件)

- `name` の命名は `h4_<C|S>_<E|I>_<4桁>`。命名規則そのものはXMLには明記されていない。Form内コードで確認できる呼び出し: h4_C_E_0002/0006/0404/0408/0410/0503、h4_C_I_0702(Form第5章参照)。
- 「内容」は xml:lang="ja" の `text`(`i18n:text`)。xml:lang="en" の `text` が別にある場合は `(en)` で併記。**ja が無く xml:lang="en" 側に日本語が入っている行は `※xml:lang=enのみ:` と表記**した(XMLの記載のまま)。`{0}`,`{1}`,`{2}` は呼び出し側が置換するプレースホルダ。`<br>` は改行。
- `custom` 列は UserMessage の `custom` フラグ(0/1)。
- 件数内訳(name接頭辞別): h4_C_E=30、h4_C_I=22、h4_S_E=40 (計92)。

| name | 内容 | custom |
|---|---|---|
| h4_C_E_0001 | この操作からはアイテムを作成できません。 / (en) Items cannot be created from this operation. | 0 |
| h4_C_E_0002 | メソッドでエラーが発生しました。システム管理者に連絡してください。 | 1 |
| h4_C_E_0003 | 1つ以上のアイテムを選択してください。 | 1 |
| h4_C_E_0004 | ステートが承認済み・やるやら承認依頼、WF未使用、もしくはやるやらが〇でないアイテムは選択できません。<br> 対象にできないアイテムは次の通りです。<br>{0} | 1 |
| h4_C_E_0005 | 既に一括承認アイテムの承認対象となっているアイテムは選択できません。<br> 対象にできないアイテムは次の通りです。<br>{0} | 1 |
| h4_C_E_0006 | 改訂内容と改訂理由は必須入力です。<br>両方に入力が必要です。 | 1 |
| h4_C_E_0007 | 一括承認アイテムの作成を完了できませんでした。再度作成を試してください。 | 1 |
| h4_C_E_0008 | 開達実施要領一括承認アイテムの作成を完了できませんでした。再度作成を試してください。 | 1 |
| h4_C_E_0012 | ★誤って作成したので流用可★ | 1 |
| h4_C_E_0201 | 作業中ステート以外のアイテムや、資料分類がEXP検定とそれ以外の資料分類のアイテムを同時に選択することはできません。<br> 対象にできないアイテムは次の通りです。<br> {0} | 1 |
| h4_C_E_0202 | 既に開達実施要領一括承認アイテムの承認対象となっているアイテムは選択できません。<br>対象にできないアイテムは次の通りです。<br>{0}          | 1 |
| h4_C_E_0301 | ※xml:lang=enのみ: 選択したアイテムは削除されています。 | 0 |
| h4_C_E_0401 | リレーションアイテムがロックされているので変更できません | 0 |
| h4_C_E_0402 | ※xml:lang=enのみ: 機種呼称は入力必須です | 0 |
| h4_C_E_0403 | ※xml:lang=enのみ: 機種コードは入力必須です | 0 |
| h4_C_E_0404 | ※xml:lang=enのみ: ⊿バージョンと機種呼称がマップしません。 | 0 |
| h4_C_E_0405 | ※xml:lang=enのみ: 仕向けは入力必須です | 0 |
| h4_C_E_0406 | ※xml:lang=enのみ: 利用者(同室課)は入力必須です | 0 |
| h4_C_E_0407 | マルQページの作成に失敗しました。 | 0 |
| h4_C_E_0408 | 既に同じ [室課] [グループ] [セクション] [機種呼称] [機種コード] [イベント] のマルQページが存在しています。 | 0 |
| h4_C_E_0409 | 複製するマルQページを選択してください。 | 0 |
| h4_C_E_0410 | 既に同じ [室課] [グループ] [セクション] [機種呼称] [機種コード] [イベント] の<br>マルQページが存在しています。<br><br> [室課] [グループ] [セクション]の値を変更するか<br>マルQページを再選択してください。 | 1 |
| h4_C_E_0501 | 「ワークフローの有無」がtrue、もしくは「やるやら」が×のアイテムは選択できません。<br>対象にできないアイテムは次の通りです。<br>{0} / (en) Execution is not possible because an item with “Workflow Enabled” set to true ({0}) is selected. | 1 |
| h4_C_E_0502 | ステートが承認済み・やるやら承認依頼、WF未使用、もしくはやるやらが〇でないアイテムは選択できません。<br> 対象にできないアイテムは次の通りです。<br> {0} / (en) Execution is not possible because an item with “Workflow Enabled” set to false ({0}) is selected. | 1 |
| h4_C_E_0503 | やるやら理由の入力は必須です。 | 1 |
| h4_C_E_0504 | 既に一括承認アイテムの承認対象となっているアイテムは選択できません。<br>対象にできないアイテムは次の通りです。<br>{0} | 1 |
| h4_C_E_0505 | 他のユーザーが編集中のため、やるやら変更は実施できません。 | 1 |
| h4_C_E_0601 | ※xml:lang=enのみ: 最新の指摘が作成されているため、実行できません。 | 1 |
| h4_C_E_1001 | 最新の改訂履歴が作成されているため、実行できません。 | 1 |
| h4_C_E_1101 | 表示条件に一致するマルQページが存在しません。 | 1 |
| h4_C_I_0001 | 確認 / (en) Confirm | 1 |
| h4_C_I_0002 | ※xml:lang=enのみ: ステータス変更 | 1 |
| h4_C_I_0003 | 改訂 | 1 |
| h4_C_I_0301 | 帳票マスタ選択 | 0 |
| h4_C_I_0302 | 選択した開達書式は既に追加済みです | 0 |
| h4_C_I_0401 | イベントアップしますか？ | 0 |
| h4_C_I_0402 | 設定を複製しますか？ | 0 |
| h4_C_I_0403 | マルQマスタ選択 | 0 |
| h4_C_I_0404 | 機種呼称が⊿バージョンとマップしていません | 0 |
| h4_C_I_0405 | 公開範囲変更を実行しますか？ | 1 |
| h4_C_I_0406 | マルQページ [作成] | 0 |
| h4_C_I_0407 | マルQページ [イベントアップ] | 0 |
| h4_C_I_0408 | マルQページ [複製] | 0 |
| h4_C_I_0501 | 担当者一括設定に成功しました | 1 |
| h4_C_I_0502 | やるやらを「×」から「〇」に変更します。 | 1 |
| h4_C_I_0601 | 関連指摘を作成しますか？ / (en) Would you like to create a related Point Out? | 1 |
| h4_C_I_0701 | [{0}] の値が異なっています | 1 |
| h4_C_I_0702 | [{0}] は必須入力です | 0 |
| h4_C_I_0801 | 引き戻し成功 | 1 |
| h4_C_I_0802 | ※xml:lang=enのみ: 一括承認を作成しますか？ | 1 |
| h4_C_I_0803 | 開達実施要領一括承認を作成しますか？ | 1 |
| h4_C_I_1001 | 関連改訂履歴を作成しますか？ | 1 |
| h4_S_E_0001 | 「ワークフローの有無」がtrueのときは「ステート(Direct)」を変更できません。 / (en) You cannot change the state (Direct) when the workflow is enabled (true). | 1 |
| h4_S_E_0002 | メソッドでエラーが発生しました。システム管理者に連絡してください。 | 1 |
| h4_S_E_0003 | 親マルQページが設定されていません。システム管理者に連絡してください。 | 1 |
| h4_S_E_0004 | 担当者一覧に次の役割のアイデンティティーが存在しません。<br>「担当」「確認者」「承認者」の役割を持つアイデンティティーをそれぞれ１つ以上入れてください。<br>また、非エイリアスのアイデンティティはアサインできません。 | 1 |
| h4_S_E_0005 | 担当者一覧で、アイデンティティが設定されていない役割があります。担当者一覧タブを確認してください。 / (en) 担当者一覧にアイデンティティが設定されていないです。担当者一覧タブを確認してください。 | 1 |
| h4_S_E_0006 | 担当者一覧に次の役割のアイデンティティーが存在しません。<br>「担当」「公開承認者」「承認者」の役割を持つアイデンティティーをそれぞれ１つ以上入れてください。<br>また、非エイリアスのアイデンティティはアサインできません。 | 1 |
| h4_S_E_0007 | 担当者一覧(EXP検定)に次の役割のアイデンティティーが存在しません。<br>「EXP検定担当者」「EXP検定承認者」「品質一課担当者」<br>「品質一課承認者」「公開承認者」「承認者」の役割を持つ<br>アイデンティティーをそれぞれ１つ以上入れてください。<br>また、非エイリアスのアイデンティティはアサインできません。 | 1 |
| h4_S_E_0009 | アイテムに紐づいている改訂履歴の中にロックされているものがあります。<br>編集中の改訂履歴は完了し、ロック中のものはアンロックしてください。<br>改訂履歴の親:{0}<br> 改訂履歴:{1}<br>枝番:{2} | 1 |
| h4_S_E_0010 | 配下のドキュメントでロックされているものがあります。<br>ロックを解除してください。<br>ドキュメント:{0} | 1 |
| h4_S_E_0011 | ドキュメント更新に失敗しました | 1 |
| h4_S_E_0012 | メールの送信に失敗しました。<br>担当者一覧のユーザーのメールアドレスを確認してください。<br>何度も失敗する場合は、システム管理者に連絡してください。 | 1 |
| h4_S_E_0013 | 担当者一覧に、メールアドレスが設定されていないユーザーが設定されています。<br>メールアドレスを設定してください。<br>対象ユーザー:<br>{0} | 1 |
| h4_S_E_0014 | 担当者一覧に次の役割のアイデンティティーが存在しません。<br>「担当」「承認者」の役割を持つアイデンティティーをそれぞれ１つ以上入れてください。<br>また、非エイリアスのアイデンティティはアサインできません。 | 1 |
| h4_S_E_0015 | 担当者・承認者に、メールアドレスが設定されていないユーザーが設定されています。<br>メールアドレスを設定してください。<br>対象ユーザー:<br>{0} | 1 |
| h4_S_E_0016 | 承認するアイテムにステートが「やるやら承認依頼」の必要資料が紐づいています。以下を確認してください。<br><br>マルQページの場合：リレーションの必要資料<br>一括承認の場合：<br>承認対象の必要資料・承認対象のマルQページ配下の必要資料<br><br>対象アイテム：<br>{0} | 1 |
| h4_S_E_0017 | 担当者一覧の「確認者」以外の役割で、アイデンティティが設定されていない役割があります。担当者一覧タブを確認してください。 | 1 |
| h4_S_E_0018 | 提出期限が超過している為、編集できません。 | 0 |
| h4_S_E_0201 | 紐づいている開達書式の中にロックされているものがあります。<br>編集中の開達書式は完了し、ロック中のものはアンロックしてください。<br> {0} | 1 |
| h4_S_E_0401 | マルQページと同じ利用者(同室課)、利用者(別室課)を必要資料一覧の必要資料に設定できませんでした。次の必要資料が編集できないため、アンロックしてから再試行してください。<br>{0} / (en) The same users (same-room section and different-room section) as on the Maru-Q page could not be set as required documents in the Required Documents List. Please unlock the following required documents before retrying, as they cannot be edited.<br>{0} | 1 |
| h4_S_E_0501 | やるやらの変更を行うには、担当者、承認者を設定してください。<br>※要エイリアスアイデンティティ | 1 |
| h4_S_E_0502 | 旧世代の必要資料に対してやるやら変更は実施できません。必要資料を開きなおしてください。 | 1 |
| h4_S_E_0503 | 他のユーザーが編集中のため、やるやら変更は実施できません。 | 1 |
| h4_S_E_0504 | 操作中の必要資料が作業中以外のステートになっているため、やるやら変更を行えません。<br>必要資料を開きなおしてください。 | 1 |
| h4_S_E_0601 | ”対象:必要資料”に設定できるアイテムは、”対象:マルＱ”の配下のアイテムのみです。 / (en) Only items under "Target: Maru-Q" can be set as "Target: Required Documents". | 1 |
| h4_S_E_0602 | 関連指摘にある枝番{0}がロックされているため、保存できません。 / (en) 関連指摘にある枝番{0}がロックされているため、処理を継続できません。 | 1 |
| h4_S_E_0603 | 「対象:必要資料」に設定しているアイテムがロックされているため、保存できません。 / (en) Cannot save because the item set as 'Target: Required Documents' is locked. | 1 |
| h4_S_E_0604 | ”対象:必要資料”に設定できるアイテムは、枝番が”1”のアイテムのみです。 / (en) Only items with a sub-number of "1" can be set as "Target: Required Documents". | 1 |
| h4_S_E_0605 | ”対象:必要資料”を変更することはできません。 / (en) "Target: Required Documents" cannot be modified. | 1 |
| h4_S_E_0801 | 承認対象には、複数のアイテムタイプを設定することはできません。 / (en) Multiple itemtypes cannot be set for approval targets. | 1 |
| h4_S_E_0802 | 引き戻しを実行できないステートです。 | 1 |
| h4_S_E_0803 | 引き戻しを実行できないユーザです。 | 1 |
| h4_S_E_0804 | 承認対象には、他の一括承認アイテムに紐づいているアイテムを設定できません。<br>該当の承認対象：<br>{0}<br><br>一括承認アイテム全体で該当の承認対象が１つだけ紐づくように承認対象を削除してください。<br>該当の承認対象を含む一括承認アイテム：<br>{1} / (en) You cannot set an item ({0}) linked to another bulk approval item as an approval target. | 1 |
| h4_S_E_0805 | 承認対象には、ワークフローの有無がfalseのアイテム({0})を設定できません。 / (en) You cannot set an item ({0}) without a workflow as an approval target. | 1 |
| h4_S_E_0806 | 承認対象には、承認/承認却下のアイテム({0})を設定できません。 / (en) You cannot set an item ({0}) that has already been approved or rejected as an approval target. | 1 |
| h4_S_E_0807 | 承認対象には、やるやらが×のアイテム({0})を設定できません。 / (en) Items marked as "Do or Don't" × ({0}) cannot be set as approval targets. | 1 |
| h4_S_E_0808 | 承認対象には、開達実施要領一括承認と別の種別の資料分類(EXP検定か否か)のアイテム({0})を設定できません。 | 1 |
| h4_S_E_0809 | 承認対象には、作業中ステート以外のアイテム({0})を設定できません。 | 1 |
| h4_S_E_0810 | 承認対象には、他の開達実施要領一括承認アイテムに紐づいているアイテムを設定できません。<br>該当の承認対象：<br>{0}<br><br>開達実施要領一括承認アイテム全体で該当の承認対象が１つだけ紐づくように承認対象を削除してください。<br>該当の承認対象を含む開達実施要領一括承認アイテム：<br>{1} | 1 |
| h4_S_E_0811 | 否認、仮承認の場合はコメントを入力してください。 | 1 |
| h4_S_E_1001 | 関連改訂履歴にある枝番{0}がロックされているため、処理を継続できません。 | 1 |


### 7.3 Action (2件)

| name | ラベル(ja) | type | location | target | method(実行Method) | can_execute(実行可否判定Method) | item_query |
|---|---|---|---|---|---|---|---|
| h4_SubstituteApprover | 代理承認依頼 | item | client | none | `h4_CallOpenReqSubstitute_cmn` | `h4_CallCanReqSubstitute_cmn` (id: 5AAD8CE0...) | `___is_new___` |
| h4_SubstituteApprover_DAT | 代理承認依頼 | item | client | none | `h4_CallOpenReqSubstitute_DAT` | `h4_CallCanReqSubstitute_DAT` (id: A0F6DAEF...) | `___is_new___` |

- どちらもクライアント側で実行されるアイテムアクション。ラベルは同じ「代理承認依頼」。`_cmn` 版と `_DAT` 版の2種類があること以外、対象ItemTypeの違いはXMLからは読み取れない(Action XML内にItemType指定なし)。

### 7.4 Identity (1件)

| name | description | is_alias | is_development | can_delete | その他 |
|---|---|---|---|---|---|
| h4_DATFormatBulkApplover | 開達実施要領一括承認のTOC参照ユーザー | 0 | 0 | 0 | cmn_is_old_pj_owner=0、cmn_is_selectable_mmblist=0、cmn_is_selectable_owner=0、cmn_is_selectable_step1_3_assign=0、cmn_is_selectable_virtual_org=0、cmn_is_supplier_vo=0 |

- 付随する `Member` 定義: `source_id` = このIdentity、`related_id` = `Administrators` Identity(sort_order=128)。すなわち Administrators がこのIdentityのメンバーになる。
- このIdentityは CommandBarSection `h4_AppWFGroupForDATFormat_TOC_Content` の role として使われ、TOC「開達実施要領一括承認」を表示する対象を限定している(第6章)。

### 7.5 Variable (1件)

| name | value |
|---|---|
| h4_SystemOperator | Innovator Admin |

### 7.6 ConversionRule (1件) — h4_PdfConverterRule

| 項目 | 値 |
|---|---|
| name | h4_PdfConverterRule |
| converter_type | `h3_PdfConverter`(ConverterType) |
| enabled | 1 |
| delay | 10 |
| timeout | 30 |
| cutoff | 1 |

イベントハンドラ(Method):

| 種別 | event_type | Method | sort_order | 備考 |
|---|---|---|---|---|
| ConversionRuleEventHandler | OnTaskCreating | `h4_beforePdfConv` | 128 | |
| ConversionRuleEventTemplate | OnAfterConvert | `h4_SMthCnvAttachFile` | 256 | lock_dependencies=0 |
| ConversionRuleEventTemplate | OnTaskDiscarding | `h4_SMthCnvSendErrorMail` | 384 | lock_dependencies=0 |
| ConversionRuleEventTemplate | OnBeforeConvert | `h4_SMthCnvInitDependencies` | 512 | lock_dependencies=0 |

対象ファイル種別(ConversionRuleFileType、全て enabled=1):

| sort_order | FileType |
|---|---|
| 128 | Microsoft Excel(options 空) |
| 256 | Microsoft Excel 97-2003 |
| 384 | Microsoft PowerPoint |
| 512 | Microsoft PowerPoint 97-2003 |
| 640 | Microsoft Word |
| 768 | Microsoft Word 97-2003 |

- 関連しそうな要素: EMail Message `h4_MsgOfficeToConverterError`(件名「【OfficeToConverter】タスク処理失敗」)。`OnTaskDiscarding` のMethod名 `h4_SMthCnvSendErrorMail` との関係はMethod名の類似のみで、XML上の直接の参照はない。

### 7.7 PresentationConfiguration (24件)

各PresentationConfigurationは、`PresentationCommandBarSection` により CommandBarSection(第6章)を束ねる。role は全て World。sort_order は表示順。PresentationConfiguration自体にItemTypeを指す項目はXML内に無く、どのItemType/リレーションに適用されるかは、名称(例: `h4_MQPage ReqDoc_TOC_Configuration` = MQPageのリレーション「必要資料」)からの読み取りに留まる。


| PresentationConfiguration名 | 含まれるCommandBarSection | role | sort_order |
|---|---|---|---|
| h4_ApprovalWFGroup_ApTarget_TOC_Configuration | h4_ApprovalWFGroup_ApTarget_IVRCB | World | 128 |
|  | h4_ApprovalWFGroup_ApTarget_IVRGCM | World | 256 |
| h4_ApprovalWFGroup_TOC_Configuration | h4_ApprovalWFGroup_TOC_Content | World | 128 |
|  | h4_ApprovalWFGroup_SVCB | World | 256 |
|  | h4_ApprovalWFGroup_IVICB | World | 384 |
| h4_DATFormat Doc_TOC_Configuration | h4_DATFormat Doc_IVRCB | World | 128 |
| h4_DATFormat_TOC_Configuration | h4_DATFormat_TOC_Content | World | 128 |
|  | h4_DATFormat_IVICB | World | 256 |
|  | h4_DATFormat_SVCB | World | 384 |
| h4_DATMaster DATFormat_TOC_Configuration | h4_DATMaster DATFormat_IVRCB | World | 128 |
| h4_DATMaster_TOC_Configuration | h4_DATMaster_IVICB | World | 0 |
|  | h4_DATMaster_TOC_Content | World | 128 |
|  | h4_DATMaster_SVCB | World | 384 |
| h4_DeptMQMaster_TOC_Configuration | h4_DeptMQMaster_Change | World | 1 |
|  | h4_DeptMQMaster_SVCB | World | 128 |
|  | h4_DeptMQMaster_TOC_Content | World | 128 |
|  | h4_DeptMQMaste_IVICB | World | 256 |
| h4_DMQMaster DATFormat_TOC_Configuration | h4_DMQMaster DATFormat_IVRCB | World | 256 |
| h4_MQPage CLN_TOC_Configuration | h4_MQPage CLN_IVRCB | World | 128 |
| h4_MQPage PointOut_TOC_Configuration | H4_MQPage PointOut_Control | World | 128 |
| h4_MQPage ReqDoc_TOC_Configuration | h4_MQPage ReqDoc_IVRCB | World | 128 |
| h4_MQPage ReqDocN PointOut_TOC_Configuration | H4_ReqDocN PointOut_Control | World | 128 |
| h4_MQPage_TOC_Configuration | h4_MQPage_Change | World | 1 |
|  | h4_MQPage_IVICB | World | 128 |
|  | h4_MQPage_SVCB | World | 128 |
|  | h4_MQPage_TOC_Content | World | 128 |
| h4_MQPage_Tree_TOC_Configuration | h4_MQPage_Tree_Change | World | 1 |
|  | h4_MQPage_Tree_TOC_Content | World | 128 |
| h4_PointOut Doc_TOC_Configuration | h4_PointOut Doc_IVRCB | World | 128 |
| h4_PointOut History_TOC_Configuration | h4_PointOut History_IVRCB | World | 128 |
| h4_PointOut_TOC_Configulation | h4_PointOut_IVICB | World | 128 |
|  | h4_PointOut_TOC_Content | World | 256 |
|  | h4_PointOut_SVCB | World | 384 |
| h4_ReqDoc CLN_TOC_Configuration | h4_ReqDoc CLN_IVRCB | World | 128 |
| h4_ReqDoc Doc_TOC_Configuration | h4_ReqDoc Doc_IVRCB | World | 128 |
| h4_ReqDoc PointOutt_TOC_Configuration | h4_ReqDoc PointOut_Control | World | 128 |
| h4_ReqDoc TestResult_TOC_Configuration | h4_ReqDoc TestResult_IVRCB | World | 128 |
| h4_Test_Result CLN_TOC_Configuration | h4_Test_Result CLN_IVRCB | World | 128 |
| h4_Test_Result Doc_TOC_Configuration | h4_Test_Result Doc_IVRCB | World | 128 |
| h4_Test_Result_TOC_Configuration | h4_Test_Result_TOC_Content | World | 128 |
|  | h4_Test_Result_IVICB | World | 256 |
|  | h4_Test_Result_SVCB | World | 384 |


### 7.8 Property / Field / Revision / cui_Control

**Property `h4_pdf_file`**

| 項目 | 値 |
|---|---|
| ラベル | ja: ファイル閲覧 / en: Viewing PDF Files |
| data_type | item |
| data_source | `File` ItemType(id 8052A558...) |
| 所属(source_id) | `Document` ItemType(id B88C14B9...) |
| item_behavior | float |
| is_hidden | 1(is_hidden2=0)、is_required=0、readonly=0、is_multi_valued=0、track_history=0 |
| column_alignment / sort_order | left / 104736 |

- 既存ItemType `Document` に File 参照のプロパティ(ラベル「ファイル閲覧」、隠し属性)を追加する定義。

**Field `h4_pdf_file`**

| 項目 | 値 |
|---|---|
| field_type | file item |
| ラベル | ja: ファイル閲覧 / en: Viewing PDF Files |
| propertytype_id | Property `h4_pdf_file`(上記) |
| 所属Body(source_id) | Body id 3B26FAB7...(`sk_parent_form` = `h0_Document`) |
| 位置 | x=150, y=180 / tab_index=25 / sort_order=1408 |
| 書式 | font arial,helvetica,sans-serif 8pt bold / color #333333 / label_position=top / is_visible=1, is_disabled=0 |

- `h0_Document` Form(他パッケージ側)にファイル項目を追加する定義。

**Revision `h4_RevManagementRev`**

- `revision` = 半角スペース区切りの `1` から `283` までの連番(283個)。リビジョン体系(世代が1〜283の整数)を定義するもの。

**cui_Control (2件)**

| name | control_type | parent_control | additional_data |
|---|---|---|---|
| h4_ReqDoc AccCon | AccordionElementControl | (なし) | (なし) |
| h4_ReqDoc TabCon | TabContainerControl | h4_ReqDoc AccCon | `{"attributes" : {"slot": "header"}}` |

- 名称から ReqDoc の画面(アコーディオン内のタブコンテナ)用のCUIコントロール定義と読めるが、XML内にItemTypeへの紐づけは無い。

### 7.9 その他メモ(設計書作成時に注意する事実)

- Method本体は今回の対象外のため、LC遷移・CommandBar・Formイベント・ConversionRule・Actionから呼ばれるMethodの処理内容は未確認。Method名のみ本書に記載。
- Form XMLのインライン `sk_method_code` は、Form/Field Eventに紐づくMethod名(`h4_frm_*` 等)と同時に保持される。同名のMethodアイテムがMethodフォルダに別途あるかは未確認(本書では Form XML内のインラインコードの内容を記載)。
- 命名の表記ゆれ(XML上の事実): パッケージ名 `h4.08.DptMQMaster` vs Permission `h4_DeptMQMaster` / CommandBarSection `h4_DeptMQMaster_*`、`h4_DeptMQMaste_IVICB`(末尾r欠落)、`h4_PointOut_TOC_Configulation`(綴り)、`h4_ReqDoc PointOutt_TOC_Configuration`(tt)、Method名 `h4_GetInputRevisioDialig`、Form名 `h4_RevisioDialog`、List `h4_DAT_Workflow_Role` 等の value `Creater`(Creator ではない)。
- テスト/暫定と読み取れる要素(XML内の記述): List `h4_MQLCS`・`h4_MQLDOCNULLLCS` の description に「テスト用」、Permission `h4_rd_worldtest`、CommandBarMenu `D-JP-DESIGN-BODY_VR001テスト`、UserMessage `h4_C_E_0012`(本文「★誤って作成したので流用可★」)、CommandBarMenuButton `h4_ReqDoc_IVRCB_WFReject`(ラベル「差し戻し(仮)」、ハンドラなし)、CommandBarButton `h4_MQPage_Withdraw_Ap`(ラベル・ハンドラともなし)、`h4_MQMaster_SelEvent`(ラベルのみ、ハンドラなし)。




---

<!-- ===== 第5章 Method ===== -->

