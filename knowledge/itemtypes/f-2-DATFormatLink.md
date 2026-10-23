<!-- meta
legacy: knowledge/_legacy/機能設計書.md L237-L257
source: source/package/DATFormatLink/Import/
-->
## 2. DATFormatLink（Form / cui のみ。ItemType定義はこのフォルダに無い）

ファイル: cui_Control/ItemView.Form.xml, cui_WindowSection/h4_DATFormatLink.xml, Form/h4_DATFormatLink.xml
- ItemType h4_DATFormatLink の定義XMLはこのパッケージにも他の調査対象にも無い（RelationshipType h4_DATFormatLink は DATFormat パッケージに存在）。
- Form `h4_DATFormatLink`（Responsive, 699x234）: Bodyのみ（Field/イベントなし）。FormComposite→cui_WindowSection `h4_DATFormatLink`。
- cui_WindowSection `h4_DATFormatLink` → ItemView.Form(id ED271989…)。
- cui_Control ItemView.Form の cui_ControlFormField 7件:
| data_source | field_type | ラベル | readonly | required | sort |
|---|---|---|---|---|---|
| h4_itemname | text | Item Name | 0 | 0 | 768 |
| h4_datformatlink | item | TE Item Link | 1 | 1 | 896 |
| h4_description | textarea | Content | 1 | 1 | 1024 |
| h4_event | text | Event | 1 | 1 | 1152 |
| h4_urllink | text | External URL | 1 | 1 | 1280 |
| classification | classification | Classification | 1 | 1 | 1408 |
| is_released | checkbox | Released | 1 | 1 | 1536 |
- レイアウト: Column Set 6（Column13=[h4_itemname, h4_datformatlink], Column14=[h4_description]）、Column Set 4（h4_event, ratio 2）、Column Set 5（h4_urllink, ratio 2）。order: Column Set 6, 4, 5, classification, is_released。
- プロパティ表はこのフォルダでは定義なし（フィールドのdata_sourceから上記プロパティ名の存在が分かるのみ。型・長さは不明）。

---

