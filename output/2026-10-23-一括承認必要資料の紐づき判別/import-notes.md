# インポート手順: 一括承認必要資料の紐づき判別

## インポート順
`package/imports.mf` に載せたのは `h4.16.ReqDocApprovalLink` の1つだけ。

## 前提
- 先にインポート済みであるべきパッケージ: h4.01〜h4.15(特に h4.13.AppWFGr。対象 Property `h4_approval_group_item`(h4_ReqDoc 側)が入っていること)。
- Innovator のバージョン: R30
- 変更の中身: h4_ReqDoc の `h4_approval_group_item` の `is_hidden2` を 1 から 0 にする(「必要資料一覧」リレーション `h4_MQPage ReqDoc` の列を出す見込み)。
- Property の指定は `where="source_id='D014A8C89FAF461FB45AC076BEE4B2E4' and name='h4_approval_group_item'"`(`source/package/Last/Import/RelationshipType/h4_MQPage ReqDoc.xml` の Property edit と同じ書き方)。Property 自体の ID(`2C0801AA1100451E8EE07DBD82A33807`)は使っていない。
- **先例なし・インポート未検証**: 別パッケージから既存 ItemType の Property を edit して見え方だけを変える先例は、原典(`source/package/`)に無い(同じ書き方の先例は、`Last` の `sort_order` 変更のみ)。

## 手動作業
- なし(新しい Method・画面コードはない)。
- 列が出ない、または列の幅・順序を直したい場合は、利用者ごとの列設定の確認が要る(推測)。

## ロールバック
- 元の状態に戻す AML(Innovator の AML 実行画面で適用):
  ```xml
  <AML>
   <Item type="Property" action="edit" where="source_id='D014A8C89FAF461FB45AC076BEE4B2E4' and name='h4_approval_group_item'">
    <is_hidden2>1</is_hidden2>
   </Item>
  </AML>
  ```
- 他の変更は含まないので、これで原典の状態に戻る(原典の値は `source/package/AppWFGr/Import/Property/h4_approval_group_item.xml` の `is_hidden2=1`)。

## 実装後の検証項目(未検証。Innovator 上でのみ確認できる)
1. インポートが成功するか(`h4.16.ReqDocApprovalLink`)。
2. SR-006: マルQページの「必要資料一覧」リレーションに「一括承認リンク」列が出るか。出ない場合、`is_hidden2` が原因という推測が外れている。
3. SR-006: `is_hidden2` の変更で、他の画面(`h4_ReqDoc` を関連先とする他のリレーション等)の列が増えていないか。
4. SR-001: 検索画面の列が、別のユーザーでも表示されるか(全員の既定か)。
5. SR-003(権限): 次の2ケースで、列の値が名前で表示されるか。
   - 自分の室課の一括承認に紐づく必要資料。
   - 他の室課の一括承認に紐づく必要資料(一括承認の World 権限がなく、名前が空やIDだけになる可能性がある。推測)。
   空やIDだけになる場合は、`answer.md` SR-003 の案(必要資料側に名前を持たせる Method 変更)を別途検討する。
6. SR-004: 既存データの値が入っているか。次を DB で確認する。
   - 現行版の一括承認(`h4_ApprovalWFGroup` の `is_current=1`)に紐づく承認対象(`h4_ApprovalWFGroup_ApTarget` の `related_id`)の必要資料のうち、`h4_approval_group_item` が空のものの件数。
   - 空があれば、補完用の AML を別途作る(今回は作っていない)。
7. SR-005: 次の操作の前後で、列の値と「一括WF作成」の重複エラー(`h4_C_E_0005`)が一致するか。
   一括承認の新規作成 / 改版 / 承認 / 承認対象の削除 / 一括承認の削除。
8. SR-006: マルQページの「必要資料一覧」リレーションの列が、他のユーザーでも出るか。
