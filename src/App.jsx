import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Layers, PenTool, TrendingUp, Check, X, Sparkles, Trophy, Flame, Filter, Target, Cloud, MessageCircle } from 'lucide-react';

// ========== 字庫資料 ==========
// 字根字庫:80 個高頻字根,每根 8-12 個例字
// 難度標籤:JH=國中, SH=高中, GEPT-M=中級, GEPT-MH=中高級
const ROOTS_DATA = [
  // ========== 1. 動作類字根 ==========
  { root: 'ced / cess / ceed', meaning: '走、行進', origin: '拉丁文 cedere', category: '動作', words: [
    { word: 'proceed', parts: [['pro','向前'],['ceed','走']], def: 'v. 繼續進行', mnemonic: '向前走 → 繼續', level: 'SH' },
    { word: 'process', parts: [['pro','向前'],['cess','走']], def: 'n. 過程', mnemonic: '一步步往前走的歷程', level: 'JH' },
    { word: 'success', parts: [['suc','在下'],['cess','走']], def: 'n. 成功', mnemonic: '一步步走到目標', level: 'JH' },
    { word: 'access', parts: [['ac','朝向'],['cess','走']], def: 'n./v. 接近、存取', mnemonic: '走向…', level: 'SH' },
    { word: 'exceed', parts: [['ex','向外'],['ceed','走']], def: 'v. 超過', mnemonic: '走出範圍 → 超過', level: 'SH' },
    { word: 'recede', parts: [['re','向後'],['cede','走']], def: 'v. 後退、減退', mnemonic: '往後走', level: 'GEPT-MH' },
    { word: 'precede', parts: [['pre','前'],['cede','走']], def: 'v. 在…之前', mnemonic: '走在前面', level: 'GEPT-M' },
    { word: 'unprecedented', parts: [['un','無'],['pre','前'],['ced','走'],['ent','adj.']], def: 'adj. 史無前例的', mnemonic: '無前人走過的', level: 'GEPT-MH' },
    { word: 'concede', parts: [['con','一起'],['cede','走']], def: 'v. 讓步、承認', mnemonic: '一起走 → 讓步', level: 'GEPT-MH' },
    { word: 'ancestor', parts: [['an','前'],['cest','走'],['or','人']], def: 'n. 祖先', mnemonic: '走在前面的人', level: 'SH' },
  ]},
  { root: 'duc / duct', meaning: '引導、帶領', origin: '拉丁文 ducere', category: '動作', words: [
    { word: 'introduce', parts: [['intro','向內'],['duce','帶']], def: 'v. 介紹', mnemonic: '把人帶進來', level: 'JH' },
    { word: 'produce', parts: [['pro','向前'],['duce','帶']], def: 'v. 生產', mnemonic: '帶出來 → 生產', level: 'JH' },
    { word: 'reduce', parts: [['re','向後'],['duce','帶']], def: 'v. 減少', mnemonic: '帶回去 → 減少', level: 'JH' },
    { word: 'conduct', parts: [['con','一起'],['duct','帶']], def: 'v. 進行、指揮', mnemonic: '一起帶領', level: 'SH' },
    { word: 'educate', parts: [['e','向外'],['duc','帶'],['ate','v.']], def: 'v. 教育', mnemonic: '把潛能帶出來', level: 'JH' },
    { word: 'product', parts: [['pro','向前'],['duct','帶']], def: 'n. 產品', mnemonic: '帶出來的成果', level: 'JH' },
    { word: 'induce', parts: [['in','向內'],['duce','帶']], def: 'v. 引起、誘導', mnemonic: '帶入', level: 'GEPT-M' },
    { word: 'deduce', parts: [['de','向下'],['duce','帶']], def: 'v. 推論', mnemonic: '從上往下帶 → 推導', level: 'GEPT-MH' },
    { word: 'aqueduct', parts: [['aqua','水'],['duct','帶']], def: 'n. 水道', mnemonic: '帶水的通道', level: 'GEPT-MH' },
    { word: 'abduct', parts: [['ab','離開'],['duct','帶']], def: 'v. 綁架', mnemonic: '帶走', level: 'GEPT-MH' },
  ]},
  { root: 'mit / miss', meaning: '送、放', origin: '拉丁文 mittere', category: '動作', words: [
    { word: 'submit', parts: [['sub','在下'],['mit','送']], def: 'v. 提交', mnemonic: '送到下面', level: 'SH' },
    { word: 'admit', parts: [['ad','朝向'],['mit','送']], def: 'v. 承認、准入', mnemonic: '送進來', level: 'JH' },
    { word: 'permit', parts: [['per','穿過'],['mit','送']], def: 'v. 允許', mnemonic: '讓人穿過 → 允許', level: 'SH' },
    { word: 'commit', parts: [['com','一起'],['mit','送']], def: 'v. 承諾、犯(罪)', mnemonic: '送出承諾', level: 'SH' },
    { word: 'emit', parts: [['e','向外'],['mit','送']], def: 'v. 發出、排放', mnemonic: '送出去', level: 'GEPT-M' },
    { word: 'transmit', parts: [['trans','跨越'],['mit','送']], def: 'v. 傳送', mnemonic: '送到對面', level: 'GEPT-M' },
    { word: 'mission', parts: [['miss','送'],['ion','n.']], def: 'n. 任務', mnemonic: '送出去的任務', level: 'JH' },
    { word: 'dismiss', parts: [['dis','分開'],['miss','送']], def: 'v. 解散、駁回', mnemonic: '送走', level: 'SH' },
    { word: 'omit', parts: [['o','離開'],['mit','送']], def: 'v. 省略', mnemonic: '送出去 → 漏掉', level: 'GEPT-MH' },
    { word: 'promise', parts: [['pro','向前'],['mise','送']], def: 'n./v. 承諾', mnemonic: '預先送出的話', level: 'JH' },
  ]},
  { root: 'port', meaning: '攜帶、搬運', origin: '拉丁文 portare', category: '動作', words: [
    { word: 'export', parts: [['ex','向外'],['port','搬']], def: 'v./n. 出口', mnemonic: '搬出去', level: 'JH' },
    { word: 'import', parts: [['im','向內'],['port','搬']], def: 'v./n. 進口', mnemonic: '搬進來', level: 'JH' },
    { word: 'transport', parts: [['trans','跨越'],['port','搬']], def: 'v./n. 運輸', mnemonic: '搬到另一邊', level: 'SH' },
    { word: 'report', parts: [['re','再'],['port','搬']], def: 'v./n. 報告', mnemonic: '再帶回來說', level: 'JH' },
    { word: 'support', parts: [['sup','在下'],['port','搬']], def: 'v. 支持', mnemonic: '從下面搬 → 支撐', level: 'JH' },
    { word: 'portable', parts: [['port','搬'],['able','可…的']], def: 'adj. 可攜帶的', mnemonic: '可以搬的', level: 'SH' },
    { word: 'porter', parts: [['port','搬'],['er','人']], def: 'n. 搬運工', mnemonic: '搬東西的人', level: 'GEPT-MH' },
    { word: 'deport', parts: [['de','離開'],['port','搬']], def: 'v. 驅逐出境', mnemonic: '搬離', level: 'GEPT-MH' },
  ]},
  { root: 'ject', meaning: '丟、投擲', origin: '拉丁文 iacere', category: '動作', words: [
    { word: 'reject', parts: [['re','向後'],['ject','丟']], def: 'v. 拒絕', mnemonic: '丟回去', level: 'SH' },
    { word: 'project', parts: [['pro','向前'],['ject','丟']], def: 'v./n. 計畫、投射', mnemonic: '往前丟', level: 'JH' },
    { word: 'inject', parts: [['in','向內'],['ject','丟']], def: 'v. 注射', mnemonic: '丟進去', level: 'SH' },
    { word: 'object', parts: [['ob','對抗'],['ject','丟']], def: 'n. 物體;v. 反對', mnemonic: '丟出去對抗', level: 'JH' },
    { word: 'subject', parts: [['sub','在下'],['ject','丟']], def: 'n. 主題、科目', mnemonic: '丟在下面討論', level: 'JH' },
    { word: 'eject', parts: [['e','向外'],['ject','丟']], def: 'v. 噴出、彈出', mnemonic: '丟出去', level: 'GEPT-MH' },
    { word: 'projector', parts: [['pro','向前'],['ject','丟'],['or','物']], def: 'n. 投影機', mnemonic: '往前投射的東西', level: 'SH' },
    { word: 'injection', parts: [['in','向內'],['ject','丟'],['ion','n.']], def: 'n. 注射', mnemonic: '丟進去的動作', level: 'GEPT-M' },
  ]},
  { root: 'tract', meaning: '拉、拖', origin: '拉丁文 trahere', category: '動作', words: [
    { word: 'attract', parts: [['at','朝向'],['tract','拉']], def: 'v. 吸引', mnemonic: '把人拉過來', level: 'JH' },
    { word: 'extract', parts: [['ex','向外'],['tract','拉']], def: 'v. 提取、抽出', mnemonic: '拉出來', level: 'GEPT-M' },
    { word: 'distract', parts: [['dis','分開'],['tract','拉']], def: 'v. 分心', mnemonic: '注意力被拉開', level: 'GEPT-M' },
    { word: 'subtract', parts: [['sub','在下'],['tract','拉']], def: 'v. 減去', mnemonic: '從下拉走', level: 'SH' },
    { word: 'contract', parts: [['con','一起'],['tract','拉']], def: 'n. 合約;v. 收縮', mnemonic: '一起拉緊', level: 'SH' },
    { word: 'tractor', parts: [['tract','拉'],['or','物']], def: 'n. 拖拉機', mnemonic: '拉東西的車', level: 'SH' },
    { word: 'abstract', parts: [['abs','離開'],['tract','拉']], def: 'adj. 抽象的', mnemonic: '從具體中拉開', level: 'SH' },
    { word: 'protract', parts: [['pro','向前'],['tract','拉']], def: 'v. 拖延', mnemonic: '一直拉長', level: 'GEPT-MH' },
  ]},
  { root: 'pos / pon', meaning: '放置', origin: '拉丁文 ponere', category: '動作', words: [
    { word: 'compose', parts: [['com','一起'],['pose','放']], def: 'v. 組成、作曲', mnemonic: '放在一起', level: 'SH' },
    { word: 'oppose', parts: [['op','相反'],['pose','放']], def: 'v. 反對', mnemonic: '放在對立面', level: 'SH' },
    { word: 'expose', parts: [['ex','向外'],['pose','放']], def: 'v. 暴露', mnemonic: '放到外面', level: 'SH' },
    { word: 'propose', parts: [['pro','向前'],['pose','放']], def: 'v. 提議', mnemonic: '把想法放出來', level: 'SH' },
    { word: 'suppose', parts: [['sup','在下'],['pose','放']], def: 'v. 假設', mnemonic: '放在底下作前提', level: 'JH' },
    { word: 'position', parts: [['pos','放'],['ition','n.']], def: 'n. 位置', mnemonic: '放的地方', level: 'JH' },
    { word: 'positive', parts: [['pos','放'],['itive','adj.']], def: 'adj. 積極的、肯定的', mnemonic: '放定立場', level: 'JH' },
    { word: 'deposit', parts: [['de','向下'],['posit','放']], def: 'v./n. 存放、押金', mnemonic: '放下來', level: 'GEPT-M' },
    { word: 'opponent', parts: [['op','相反'],['pon','放'],['ent','人']], def: 'n. 對手', mnemonic: '放在對面的人', level: 'GEPT-M' },
    { word: 'component', parts: [['com','一起'],['pon','放'],['ent','物']], def: 'n. 零件', mnemonic: '放在一起的東西', level: 'GEPT-M' },
  ]},
  { root: 'fer', meaning: '帶、攜帶', origin: '拉丁文 ferre', category: '動作', words: [
    { word: 'transfer', parts: [['trans','跨越'],['fer','帶']], def: 'v. 轉移', mnemonic: '帶到另一邊', level: 'SH' },
    { word: 'prefer', parts: [['pre','前'],['fer','帶']], def: 'v. 偏好', mnemonic: '帶到前面', level: 'JH' },
    { word: 'refer', parts: [['re','再'],['fer','帶']], def: 'v. 參考、提及', mnemonic: '再帶回來看', level: 'SH' },
    { word: 'offer', parts: [['of','朝向'],['fer','帶']], def: 'v./n. 提供', mnemonic: '帶向某人', level: 'JH' },
    { word: 'suffer', parts: [['suf','在下'],['fer','帶']], def: 'v. 受苦', mnemonic: '帶著重擔在底下', level: 'JH' },
    { word: 'differ', parts: [['dif','分開'],['fer','帶']], def: 'v. 不同', mnemonic: '帶開 → 分歧', level: 'SH' },
    { word: 'confer', parts: [['con','一起'],['fer','帶']], def: 'v. 商議、授予', mnemonic: '帶一起討論', level: 'GEPT-MH' },
    { word: 'infer', parts: [['in','向內'],['fer','帶']], def: 'v. 推斷', mnemonic: '帶到心裡推想', level: 'GEPT-M' },
    { word: 'fertile', parts: [['fer','帶'],['tile','adj.']], def: 'adj. 肥沃的', mnemonic: '能帶出產量的', level: 'GEPT-M' },
  ]},
  { root: 'mob / mot / mov', meaning: '移動', origin: '拉丁文 movere', category: '動作', words: [
    { word: 'move', parts: [['mov','動']], def: 'v. 移動', mnemonic: '動', level: 'JH' },
    { word: 'movie', parts: [['mov','動'],['ie','n.']], def: 'n. 電影', mnemonic: '會動的畫面', level: 'JH' },
    { word: 'mobile', parts: [['mob','動'],['ile','adj.']], def: 'adj. 行動的', mnemonic: '可以動的', level: 'SH' },
    { word: 'motion', parts: [['mot','動'],['ion','n.']], def: 'n. 動作、運動', mnemonic: '動的狀態', level: 'SH' },
    { word: 'motor', parts: [['mot','動'],['or','物']], def: 'n. 馬達', mnemonic: '讓東西動的機器', level: 'JH' },
    { word: 'promote', parts: [['pro','向前'],['mote','動']], def: 'v. 促進、提升', mnemonic: '往前推動', level: 'SH' },
    { word: 'remove', parts: [['re','向後'],['move','動']], def: 'v. 移除', mnemonic: '搬離', level: 'JH' },
    { word: 'emotion', parts: [['e','向外'],['mot','動'],['ion','n.']], def: 'n. 情緒', mnemonic: '動到心裡', level: 'SH' },
    { word: 'motivate', parts: [['mot','動'],['ivate','v.']], def: 'v. 激勵', mnemonic: '使動起來', level: 'SH' },
    { word: 'demote', parts: [['de','向下'],['mote','動']], def: 'v. 降職', mnemonic: '向下動', level: 'GEPT-MH' },
  ]},
  { root: 'vert / vers', meaning: '轉', origin: '拉丁文 vertere', category: '動作', words: [
    { word: 'convert', parts: [['con','一起'],['vert','轉']], def: 'v. 轉換', mnemonic: '轉成另一個', level: 'SH' },
    { word: 'reverse', parts: [['re','向後'],['verse','轉']], def: 'v. 反轉', mnemonic: '轉回去', level: 'SH' },
    { word: 'universe', parts: [['uni','一'],['verse','轉']], def: 'n. 宇宙', mnemonic: '繞著一個中心轉', level: 'SH' },
    { word: 'version', parts: [['vers','轉'],['ion','n.']], def: 'n. 版本', mnemonic: '轉換出的形式', level: 'SH' },
    { word: 'advertise', parts: [['ad','朝向'],['vert','轉'],['ise','v.']], def: 'v. 廣告', mnemonic: '轉向群眾的注意', level: 'SH' },
    { word: 'divert', parts: [['di','分開'],['vert','轉']], def: 'v. 轉移', mnemonic: '轉開', level: 'GEPT-M' },
    { word: 'invert', parts: [['in','向內'],['vert','轉']], def: 'v. 倒轉', mnemonic: '向內轉', level: 'GEPT-MH' },
    { word: 'controversy', parts: [['contro','相反'],['vers','轉'],['y','n.']], def: 'n. 爭議', mnemonic: '轉到相反方向 → 對立', level: 'GEPT-MH' },
  ]},

  // ========== 2. 感官知覺類 ==========
  { root: 'aud / audi', meaning: '聽', origin: '拉丁文 audire', category: '感官', words: [
    { word: 'audience', parts: [['audi','聽'],['ence','n.']], def: 'n. 聽眾、觀眾', mnemonic: '在聽的人', level: 'JH' },
    { word: 'audio', parts: [['audi','聽'],['o','n.']], def: 'n. 音檔', mnemonic: '可聽的', level: 'JH' },
    { word: 'auditory', parts: [['audi','聽'],['tory','adj.']], def: 'adj. 聽覺的', mnemonic: '與聽有關', level: 'GEPT-M' },
    { word: 'audible', parts: [['aud','聽'],['ible','可…']], def: 'adj. 聽得見的', mnemonic: '可以聽到的', level: 'GEPT-M' },
    { word: 'auditorium', parts: [['audi','聽'],['torium','地方']], def: 'n. 禮堂', mnemonic: '聽演講的地方', level: 'GEPT-M' },
    { word: 'audit', parts: [['aud','聽'],['it','v.']], def: 'v. 稽核', mnemonic: '聽帳目報告', level: 'GEPT-MH' },
    { word: 'audition', parts: [['audi','聽'],['tion','n.']], def: 'n. 試鏡、試演', mnemonic: '聽你表演', level: 'GEPT-M' },
    { word: 'inaudible', parts: [['in','不'],['aud','聽'],['ible','可…']], def: 'adj. 聽不見的', mnemonic: '不可聽的', level: 'GEPT-MH' },
  ]},
  { root: 'spec / spect', meaning: '看', origin: '拉丁文 specere', category: '感官', words: [
    { word: 'inspect', parts: [['in','向內'],['spect','看']], def: 'v. 檢查', mnemonic: '往裡面看', level: 'SH' },
    { word: 'respect', parts: [['re','再'],['spect','看']], def: 'v./n. 尊重', mnemonic: '回頭再看 → 重視', level: 'JH' },
    { word: 'expect', parts: [['ex','向外'],['pect','看']], def: 'v. 期待', mnemonic: '向外看 → 期盼', level: 'JH' },
    { word: 'spectator', parts: [['spect','看'],['ator','人']], def: 'n. 觀眾', mnemonic: '看的人', level: 'SH' },
    { word: 'perspective', parts: [['per','穿過'],['spect','看'],['ive','n.']], def: 'n. 觀點、視角', mnemonic: '穿過去看', level: 'GEPT-M' },
    { word: 'suspect', parts: [['sus','在下'],['pect','看']], def: 'v./n. 懷疑、嫌疑犯', mnemonic: '從下往上偷看', level: 'SH' },
    { word: 'aspect', parts: [['a','朝向'],['spect','看']], def: 'n. 方面', mnemonic: '看的角度', level: 'SH' },
    { word: 'spectacle', parts: [['spect','看'],['acle','n.']], def: 'n. 景象', mnemonic: '值得看的東西', level: 'GEPT-MH' },
    { word: 'speculate', parts: [['spec','看'],['ulate','v.']], def: 'v. 推測', mnemonic: '看了再猜', level: 'GEPT-MH' },
    { word: 'spectacular', parts: [['spect','看'],['acular','adj.']], def: 'adj. 壯觀的', mnemonic: '值得看的', level: 'GEPT-M' },
  ]},
  { root: 'vid / vis', meaning: '看', origin: '拉丁文 videre', category: '感官', words: [
    { word: 'video', parts: [['vid','看'],['eo','n.']], def: 'n. 影片', mnemonic: '可看的', level: 'JH' },
    { word: 'vision', parts: [['vis','看'],['ion','n.']], def: 'n. 視力、願景', mnemonic: '看見的能力', level: 'SH' },
    { word: 'visible', parts: [['vis','看'],['ible','可…']], def: 'adj. 可見的', mnemonic: '可以看見的', level: 'SH' },
    { word: 'visit', parts: [['vis','看'],['it','v.']], def: 'v. 拜訪', mnemonic: '去看看', level: 'JH' },
    { word: 'evidence', parts: [['e','向外'],['vid','看'],['ence','n.']], def: 'n. 證據', mnemonic: '看得出來的', level: 'SH' },
    { word: 'revise', parts: [['re','再'],['vise','看']], def: 'v. 修訂、複習', mnemonic: '再看一次', level: 'SH' },
    { word: 'television', parts: [['tele','遠'],['vision','看']], def: 'n. 電視', mnemonic: '看遠處的影像', level: 'JH' },
    { word: 'supervise', parts: [['super','上方'],['vise','看']], def: 'v. 監督', mnemonic: '從上面看', level: 'GEPT-M' },
    { word: 'envision', parts: [['en','使'],['vision','看']], def: 'v. 想像', mnemonic: '在心裡看見', level: 'GEPT-MH' },
    { word: 'visualize', parts: [['vis','看'],['ualize','v.']], def: 'v. 視覺化', mnemonic: '使可見', level: 'GEPT-M' },
  ]},
  { root: 'sens / sent', meaning: '感覺', origin: '拉丁文 sentire', category: '感官', words: [
    { word: 'sense', parts: [['sens','感覺']], def: 'n. 感覺', mnemonic: '感覺', level: 'JH' },
    { word: 'sensitive', parts: [['sens','感覺'],['itive','adj.']], def: 'adj. 敏感的', mnemonic: '容易感覺到的', level: 'SH' },
    { word: 'sensible', parts: [['sens','感覺'],['ible','可…']], def: 'adj. 明智的', mnemonic: '有感知能力的', level: 'SH' },
    { word: 'sensation', parts: [['sens','感覺'],['ation','n.']], def: 'n. 感覺、轟動', mnemonic: '強烈的感受', level: 'GEPT-M' },
    { word: 'consent', parts: [['con','一起'],['sent','感覺']], def: 'v./n. 同意', mnemonic: '感覺一樣', level: 'GEPT-M' },
    { word: 'resent', parts: [['re','再'],['sent','感覺']], def: 'v. 憤恨', mnemonic: '一再感覺到不快', level: 'GEPT-MH' },
    { word: 'sentiment', parts: [['sent','感覺'],['iment','n.']], def: 'n. 情感、感受', mnemonic: '心中的感覺', level: 'GEPT-MH' },
    { word: 'nonsense', parts: [['non','無'],['sense','感覺']], def: 'n. 廢話', mnemonic: '沒道理的', level: 'SH' },
  ]},

  // ========== 3. 言說溝通類 ==========
  { root: 'dict', meaning: '說', origin: '拉丁文 dicere', category: '溝通', words: [
    { word: 'predict', parts: [['pre','前'],['dict','說']], def: 'v. 預測', mnemonic: '事前說', level: 'SH' },
    { word: 'dictate', parts: [['dict','說'],['ate','v.']], def: 'v. 口述、命令', mnemonic: '說出來讓人記', level: 'GEPT-M' },
    { word: 'contradict', parts: [['contra','相反'],['dict','說']], def: 'v. 反駁', mnemonic: '說相反的話', level: 'GEPT-M' },
    { word: 'dictionary', parts: [['dict','說'],['ionary','n.']], def: 'n. 字典', mnemonic: '說明字義的書', level: 'JH' },
    { word: 'verdict', parts: [['ver','真'],['dict','說']], def: 'n. 裁決', mnemonic: '說出真相', level: 'GEPT-MH' },
    { word: 'dictator', parts: [['dict','說'],['ator','人']], def: 'n. 獨裁者', mnemonic: '說了算的人', level: 'GEPT-MH' },
    { word: 'indicate', parts: [['in','向內'],['dic','說'],['ate','v.']], def: 'v. 指出、暗示', mnemonic: '說出來', level: 'SH' },
    { word: 'dedicate', parts: [['de','向下'],['dic','說'],['ate','v.']], def: 'v. 奉獻', mnemonic: '說出承諾', level: 'GEPT-M' },
    { word: 'addict', parts: [['ad','朝向'],['dict','說']], def: 'n. 上癮者', mnemonic: '被說服歸順的人', level: 'GEPT-M' },
  ]},
  { root: 'log / logue', meaning: '言語、學問', origin: '希臘文 logos', category: '溝通', words: [
    { word: 'biology', parts: [['bio','生命'],['logy','學']], def: 'n. 生物學', mnemonic: '研究生命的學問', level: 'JH' },
    { word: 'psychology', parts: [['psycho','心靈'],['logy','學']], def: 'n. 心理學', mnemonic: '研究心靈的學問', level: 'SH' },
    { word: 'technology', parts: [['techno','技術'],['logy','學']], def: 'n. 科技', mnemonic: '技術的學問', level: 'JH' },
    { word: 'sociology', parts: [['socio','社會'],['logy','學']], def: 'n. 社會學', mnemonic: '研究社會的學問', level: 'GEPT-M' },
    { word: 'dialogue', parts: [['dia','穿過'],['logue','說']], def: 'n. 對話', mnemonic: '互相說話', level: 'SH' },
    { word: 'monologue', parts: [['mono','一'],['logue','說']], def: 'n. 獨白', mnemonic: '一個人說', level: 'GEPT-MH' },
    { word: 'logic', parts: [['log','言'],['ic','n.']], def: 'n. 邏輯', mnemonic: '說話的條理', level: 'SH' },
    { word: 'apology', parts: [['apo','離開'],['logy','說']], def: 'n. 道歉', mnemonic: '說出來消解', level: 'SH' },
    { word: 'prologue', parts: [['pro','前'],['logue','說']], def: 'n. 序言', mnemonic: '前面說的話', level: 'GEPT-MH' },
  ]},
  { root: 'scrib / script', meaning: '寫', origin: '拉丁文 scribere', category: '溝通', words: [
    { word: 'describe', parts: [['de','向下'],['scribe','寫']], def: 'v. 描述', mnemonic: '寫下來', level: 'JH' },
    { word: 'subscribe', parts: [['sub','在下'],['scribe','寫']], def: 'v. 訂閱', mnemonic: '在下面簽名', level: 'SH' },
    { word: 'prescribe', parts: [['pre','前'],['scribe','寫']], def: 'v. 開處方、規定', mnemonic: '事先寫好', level: 'GEPT-M' },
    { word: 'manuscript', parts: [['manu','手'],['script','寫']], def: 'n. 手稿', mnemonic: '手寫的稿', level: 'GEPT-MH' },
    { word: 'script', parts: [['script','寫']], def: 'n. 劇本、腳本', mnemonic: '寫好的東西', level: 'SH' },
    { word: 'inscribe', parts: [['in','向內'],['scribe','寫']], def: 'v. 銘刻', mnemonic: '寫進去', level: 'GEPT-MH' },
    { word: 'transcript', parts: [['trans','跨越'],['script','寫']], def: 'n. 抄本、成績單', mnemonic: '寫到另一處', level: 'GEPT-MH' },
    { word: 'description', parts: [['de','向下'],['script','寫'],['ion','n.']], def: 'n. 描述', mnemonic: '寫下來的內容', level: 'SH' },
  ]},
  { root: 'graph / gram', meaning: '寫、畫', origin: '希臘文 graphein', category: '溝通', words: [
    { word: 'autograph', parts: [['auto','自己'],['graph','寫']], def: 'n. 親筆簽名', mnemonic: '自己寫的字', level: 'GEPT-M' },
    { word: 'photograph', parts: [['photo','光'],['graph','寫']], def: 'n. 照片', mnemonic: '用光畫的', level: 'JH' },
    { word: 'paragraph', parts: [['para','旁'],['graph','寫']], def: 'n. 段落', mnemonic: '一段寫的文字', level: 'SH' },
    { word: 'diagram', parts: [['dia','穿過'],['gram','畫']], def: 'n. 圖表', mnemonic: '貫穿說明的圖', level: 'SH' },
    { word: 'program', parts: [['pro','前'],['gram','寫']], def: 'n. 節目、程式', mnemonic: '預先寫好的', level: 'JH' },
    { word: 'biography', parts: [['bio','生命'],['graphy','寫']], def: 'n. 傳記', mnemonic: '寫生命的故事', level: 'SH' },
    { word: 'graphic', parts: [['graph','畫'],['ic','adj.']], def: 'adj. 圖像的', mnemonic: '畫出來的', level: 'SH' },
    { word: 'telegram', parts: [['tele','遠'],['gram','寫']], def: 'n. 電報', mnemonic: '遠處傳寫的訊息', level: 'GEPT-MH' },
    { word: 'geography', parts: [['geo','地'],['graphy','寫']], def: 'n. 地理學', mnemonic: '描寫土地的學問', level: 'JH' },
  ]},
  { root: 'phon', meaning: '聲音', origin: '希臘文 phone', category: '溝通', words: [
    { word: 'telephone', parts: [['tele','遠'],['phone','聲音']], def: 'n. 電話', mnemonic: '把聲音傳到遠處', level: 'JH' },
    { word: 'microphone', parts: [['micro','小'],['phone','聲音']], def: 'n. 麥克風', mnemonic: '把小聲放大', level: 'JH' },
    { word: 'symphony', parts: [['sym','一起'],['phony','聲音']], def: 'n. 交響樂', mnemonic: '聲音一起發出', level: 'SH' },
    { word: 'phonetic', parts: [['phon','聲音'],['etic','adj.']], def: 'adj. 語音的', mnemonic: '關於聲音的', level: 'GEPT-MH' },
    { word: 'phonics', parts: [['phon','聲音'],['ics','n.']], def: 'n. 自然發音法', mnemonic: '聲音的學問', level: 'GEPT-M' },
    { word: 'megaphone', parts: [['mega','大'],['phone','聲音']], def: 'n. 擴音器', mnemonic: '放大聲音', level: 'GEPT-MH' },
    { word: 'saxophone', parts: [['saxo','人名'],['phone','聲音']], def: 'n. 薩克斯風', mnemonic: 'Sax 發明的聲音樂器', level: 'SH' },
  ]},

  // ========== 4. 認知思維類 ==========
  { root: 'cred', meaning: '相信', origin: '拉丁文 credere', category: '認知', words: [
    { word: 'credit', parts: [['cred','信'],['it','n.']], def: 'n. 信用、學分', mnemonic: '被相信的東西', level: 'SH' },
    { word: 'incredible', parts: [['in','不'],['cred','信'],['ible','可']], def: 'adj. 難以置信的', mnemonic: '不可相信的', level: 'SH' },
    { word: 'credible', parts: [['cred','信'],['ible','可']], def: 'adj. 可信的', mnemonic: '可以相信的', level: 'GEPT-M' },
    { word: 'credential', parts: [['cred','信'],['ential','n.']], def: 'n. 證書、資歷', mnemonic: '讓人相信的證明', level: 'GEPT-MH' },
    { word: 'discredit', parts: [['dis','不'],['credit','信']], def: 'v. 使丟臉、不信', mnemonic: '失去信用', level: 'GEPT-MH' },
    { word: 'creditor', parts: [['cred','信'],['itor','人']], def: 'n. 債權人', mnemonic: '相信你會還的人', level: 'GEPT-MH' },
    { word: 'credibility', parts: [['cred','信'],['ibility','n.']], def: 'n. 可信度', mnemonic: '被相信的程度', level: 'GEPT-MH' },
  ]},
  { root: 'sci', meaning: '知道', origin: '拉丁文 scire', category: '認知', words: [
    { word: 'science', parts: [['sci','知'],['ence','n.']], def: 'n. 科學', mnemonic: '知道的學問', level: 'JH' },
    { word: 'scientist', parts: [['sci','知'],['entist','人']], def: 'n. 科學家', mnemonic: '研究知識的人', level: 'JH' },
    { word: 'conscious', parts: [['con','一起'],['scious','知']], def: 'adj. 有意識的', mnemonic: '都知道', level: 'SH' },
    { word: 'conscience', parts: [['con','一起'],['science','知']], def: 'n. 良心', mnemonic: '心裡都知道', level: 'SH' },
    { word: 'subconscious', parts: [['sub','在下'],['conscious','意識']], def: 'adj./n. 潛意識的', mnemonic: '意識下面', level: 'GEPT-MH' },
    { word: 'omniscient', parts: [['omni','全'],['scient','知']], def: 'adj. 全知的', mnemonic: '什麼都知道', level: 'GEPT-MH' },
  ]},
  { root: 'mem / mor', meaning: '記憶', origin: '拉丁文 memor', category: '認知', words: [
    { word: 'memory', parts: [['mem','記'],['ory','n.']], def: 'n. 記憶', mnemonic: '記得的事', level: 'JH' },
    { word: 'memorize', parts: [['mem','記'],['orize','v.']], def: 'v. 背誦', mnemonic: '使進入記憶', level: 'JH' },
    { word: 'memorable', parts: [['mem','記'],['orable','可…的']], def: 'adj. 難忘的', mnemonic: '可以記住的', level: 'SH' },
    { word: 'memorial', parts: [['mem','記'],['orial','adj.']], def: 'adj./n. 紀念的', mnemonic: '為了記住', level: 'SH' },
    { word: 'remember', parts: [['re','再'],['member','記']], def: 'v. 記得', mnemonic: '再次回想', level: 'JH' },
    { word: 'commemorate', parts: [['com','一起'],['memor','記'],['ate','v.']], def: 'v. 紀念', mnemonic: '一起記住', level: 'GEPT-MH' },
  ]},
  { root: 'cogn', meaning: '知道、認識', origin: '拉丁文 cognoscere', category: '認知', words: [
    { word: 'recognize', parts: [['re','再'],['cogn','知'],['ize','v.']], def: 'v. 認出', mnemonic: '再次知道', level: 'SH' },
    { word: 'cognition', parts: [['cogn','知'],['ition','n.']], def: 'n. 認知', mnemonic: '知道的過程', level: 'GEPT-MH' },
    { word: 'cognitive', parts: [['cogn','知'],['itive','adj.']], def: 'adj. 認知的', mnemonic: '與認知有關', level: 'GEPT-MH' },
    { word: 'incognito', parts: [['in','不'],['cogn','知'],['ito','adj.']], def: 'adj./adv. 隱姓埋名的', mnemonic: '不被認出', level: 'GEPT-MH' },
    { word: 'acknowledge', parts: [['ac','朝向'],['knowledge','知']], def: 'v. 承認', mnemonic: '表示知道', level: 'SH' },
  ]},

  // ========== 5. 生命自然類 ==========
  { root: 'bio', meaning: '生命', origin: '希臘文 bios', category: '自然', words: [
    { word: 'biology', parts: [['bio','生命'],['logy','學']], def: 'n. 生物學', mnemonic: '研究生命', level: 'JH' },
    { word: 'biography', parts: [['bio','生命'],['graphy','寫']], def: 'n. 傳記', mnemonic: '寫生命', level: 'SH' },
    { word: 'biological', parts: [['bio','生命'],['logical','adj.']], def: 'adj. 生物的', mnemonic: '與生命有關', level: 'SH' },
    { word: 'antibiotic', parts: [['anti','對抗'],['bio','生命'],['tic','n.']], def: 'n. 抗生素', mnemonic: '對抗細菌生命', level: 'GEPT-MH' },
    { word: 'symbiosis', parts: [['sym','一起'],['bio','生命'],['sis','n.']], def: 'n. 共生', mnemonic: '一起生活', level: 'GEPT-MH' },
    { word: 'autobiography', parts: [['auto','自己'],['bio','生命'],['graphy','寫']], def: 'n. 自傳', mnemonic: '寫自己的生命', level: 'SH' },
    { word: 'biotech', parts: [['bio','生命'],['tech','技術']], def: 'n. 生物技術', mnemonic: '生命的技術', level: 'GEPT-MH' },
  ]},
  { root: 'geo', meaning: '地、土地', origin: '希臘文 ge', category: '自然', words: [
    { word: 'geography', parts: [['geo','地'],['graphy','寫']], def: 'n. 地理學', mnemonic: '描寫土地', level: 'JH' },
    { word: 'geology', parts: [['geo','地'],['logy','學']], def: 'n. 地質學', mnemonic: '研究土地', level: 'SH' },
    { word: 'geometry', parts: [['geo','地'],['metry','測量']], def: 'n. 幾何學', mnemonic: '測量土地', level: 'SH' },
    { word: 'geographic', parts: [['geo','地'],['graphic','adj.']], def: 'adj. 地理的', mnemonic: '與地理有關', level: 'GEPT-M' },
    { word: 'geothermal', parts: [['geo','地'],['thermal','熱']], def: 'adj. 地熱的', mnemonic: '地下的熱', level: 'GEPT-MH' },
  ]},
  { root: 'hydr', meaning: '水', origin: '希臘文 hydor', category: '自然', words: [
    { word: 'hydrogen', parts: [['hydr','水'],['gen','產生']], def: 'n. 氫', mnemonic: '產生水的元素', level: 'SH' },
    { word: 'hydrant', parts: [['hydr','水'],['ant','物']], def: 'n. 消防栓', mnemonic: '提供水的設備', level: 'GEPT-MH' },
    { word: 'dehydrate', parts: [['de','離開'],['hydr','水'],['ate','v.']], def: 'v. 脫水', mnemonic: '失去水分', level: 'GEPT-MH' },
    { word: 'hydraulic', parts: [['hydr','水'],['aulic','adj.']], def: 'adj. 液壓的', mnemonic: '靠水運作的', level: 'GEPT-MH' },
    { word: 'hydrate', parts: [['hydr','水'],['ate','v.']], def: 'v. 補水', mnemonic: '加水進去', level: 'GEPT-MH' },
  ]},
  { root: 'astro / aster', meaning: '星星', origin: '希臘文 aster', category: '自然', words: [
    { word: 'astronaut', parts: [['astro','星'],['naut','航行者']], def: 'n. 太空人', mnemonic: '星際航行者', level: 'JH' },
    { word: 'astronomy', parts: [['astro','星'],['nomy','學']], def: 'n. 天文學', mnemonic: '星星的學問', level: 'SH' },
    { word: 'astrology', parts: [['astro','星'],['logy','學']], def: 'n. 占星術', mnemonic: '星象的學問', level: 'GEPT-MH' },
    { word: 'asterisk', parts: [['aster','星'],['isk','n.']], def: 'n. 星號 (*)', mnemonic: '小星星', level: 'GEPT-MH' },
    { word: 'disaster', parts: [['dis','不好'],['aster','星']], def: 'n. 災難', mnemonic: '不吉利的星象', level: 'SH' },
  ]},
  { root: 'sol', meaning: '太陽', origin: '拉丁文 sol', category: '自然', words: [
    { word: 'solar', parts: [['sol','太陽'],['ar','adj.']], def: 'adj. 太陽的', mnemonic: '與太陽有關', level: 'SH' },
    { word: 'solstice', parts: [['sol','太陽'],['stice','停']], def: 'n. 至日', mnemonic: '太陽停的點', level: 'GEPT-MH' },
    { word: 'parasol', parts: [['para','防護'],['sol','太陽']], def: 'n. 陽傘', mnemonic: '擋太陽的', level: 'GEPT-MH' },
  ]},
  { root: 'luna / lumin', meaning: '月亮、光', origin: '拉丁文 luna/lumen', category: '自然', words: [
    { word: 'lunar', parts: [['lun','月'],['ar','adj.']], def: 'adj. 月亮的', mnemonic: '與月亮有關', level: 'SH' },
    { word: 'illuminate', parts: [['il','使'],['lumin','光'],['ate','v.']], def: 'v. 照亮', mnemonic: '使發光', level: 'GEPT-MH' },
    { word: 'luminous', parts: [['lumin','光'],['ous','adj.']], def: 'adj. 發光的', mnemonic: '有光的', level: 'GEPT-MH' },
    { word: 'lunatic', parts: [['lun','月'],['atic','adj.']], def: 'adj./n. 瘋狂的', mnemonic: '被月亮影響的', level: 'GEPT-MH' },
  ]},
  { root: 'aqua', meaning: '水', origin: '拉丁文 aqua', category: '自然', words: [
    { word: 'aquarium', parts: [['aqua','水'],['rium','地方']], def: 'n. 水族館', mnemonic: '水的地方', level: 'JH' },
    { word: 'aquatic', parts: [['aqua','水'],['tic','adj.']], def: 'adj. 水生的', mnemonic: '住在水中的', level: 'GEPT-MH' },
    { word: 'aqueduct', parts: [['aqua','水'],['duct','帶']], def: 'n. 水道', mnemonic: '帶水的管', level: 'GEPT-MH' },
    { word: 'aquamarine', parts: [['aqua','水'],['marine','海']], def: 'n. 海藍寶石', mnemonic: '水海般的', level: 'GEPT-MH' },
  ]},

  // ========== 6. 人/身體類 ==========
  { root: 'man / manu', meaning: '手', origin: '拉丁文 manus', category: '人體', words: [
    { word: 'manual', parts: [['manu','手'],['al','adj.']], def: 'adj./n. 手動的、手冊', mnemonic: '用手的', level: 'SH' },
    { word: 'manufacture', parts: [['manu','手'],['fact','做'],['ure','n.']], def: 'v. 製造', mnemonic: '用手做', level: 'SH' },
    { word: 'manuscript', parts: [['manu','手'],['script','寫']], def: 'n. 手稿', mnemonic: '手寫的', level: 'GEPT-MH' },
    { word: 'manage', parts: [['man','手'],['age','v.']], def: 'v. 管理', mnemonic: '掌握在手中', level: 'JH' },
    { word: 'manipulate', parts: [['mani','手'],['pul','拉'],['ate','v.']], def: 'v. 操縱', mnemonic: '用手操作', level: 'GEPT-MH' },
    { word: 'manner', parts: [['man','手'],['ner','n.']], def: 'n. 方式、禮貌', mnemonic: '手的處事方式', level: 'JH' },
  ]},
  { root: 'ped / pod', meaning: '腳', origin: '拉丁文/希臘文 pes/pous', category: '人體', words: [
    { word: 'pedal', parts: [['ped','腳'],['al','n.']], def: 'n. 踏板', mnemonic: '腳踩的', level: 'SH' },
    { word: 'pedestrian', parts: [['ped','腳'],['estrian','人']], def: 'n. 行人', mnemonic: '用腳走的人', level: 'GEPT-M' },
    { word: 'podium', parts: [['pod','腳'],['ium','地方']], def: 'n. 講台', mnemonic: '腳站的地方', level: 'GEPT-MH' },
    { word: 'centipede', parts: [['centi','百'],['pede','腳']], def: 'n. 蜈蚣', mnemonic: '百足蟲', level: 'GEPT-MH' },
    { word: 'expedition', parts: [['ex','向外'],['ped','腳'],['ition','n.']], def: 'n. 遠征、探險', mnemonic: '腳走出去', level: 'GEPT-MH' },
    { word: 'tripod', parts: [['tri','三'],['pod','腳']], def: 'n. 三腳架', mnemonic: '三隻腳', level: 'GEPT-MH' },
  ]},
  { root: 'cap / capit', meaning: '頭', origin: '拉丁文 caput', category: '人體', words: [
    { word: 'capital', parts: [['capit','頭'],['al','adj.']], def: 'n. 首都;adj. 主要的', mnemonic: '國家的頭', level: 'JH' },
    { word: 'captain', parts: [['capt','頭'],['ain','人']], def: 'n. 隊長、船長', mnemonic: '帶頭的人', level: 'JH' },
    { word: 'chapter', parts: [['chap','頭'],['ter','n.']], def: 'n. 章節', mnemonic: '一章的開頭', level: 'JH' },
    { word: 'cape', parts: [['cape','頭']], def: 'n. 海角、披肩', mnemonic: '陸地的頭', level: 'GEPT-M' },
    { word: 'capsize', parts: [['cap','頭'],['size','變']], def: 'v. 翻船', mnemonic: '船頭翻過去', level: 'GEPT-MH' },
  ]},
  { root: 'cor / cord', meaning: '心', origin: '拉丁文 cor', category: '人體', words: [
    { word: 'core', parts: [['cor','心']], def: 'n. 核心', mnemonic: '中心', level: 'SH' },
    { word: 'cordial', parts: [['cord','心'],['ial','adj.']], def: 'adj. 熱誠的', mnemonic: '從心發出的', level: 'GEPT-MH' },
    { word: 'accord', parts: [['ac','朝向'],['cord','心']], def: 'n./v. 一致', mnemonic: '心向一處', level: 'GEPT-M' },
    { word: 'record', parts: [['re','再'],['cord','心']], def: 'v./n. 記錄', mnemonic: '再放回心裡', level: 'JH' },
    { word: 'discord', parts: [['dis','分開'],['cord','心']], def: 'n. 不和', mnemonic: '心分開', level: 'GEPT-MH' },
    { word: 'encourage', parts: [['en','使'],['cour','心'],['age','v.']], def: 'v. 鼓勵', mnemonic: '注入勇心', level: 'JH' },
  ]},
  { root: 'corp', meaning: '身體', origin: '拉丁文 corpus', category: '人體', words: [
    { word: 'corporation', parts: [['corp','身體'],['oration','n.']], def: 'n. 公司', mnemonic: '一個團體身', level: 'SH' },
    { word: 'corpse', parts: [['corp','身體'],['se','n.']], def: 'n. 屍體', mnemonic: '失去靈魂的身體', level: 'GEPT-MH' },
    { word: 'incorporate', parts: [['in','向內'],['corp','身體'],['orate','v.']], def: 'v. 合併', mnemonic: '納入身體', level: 'GEPT-MH' },
    { word: 'corporate', parts: [['corp','身體'],['orate','adj.']], def: 'adj. 公司的', mnemonic: '團體的', level: 'GEPT-M' },
  ]},

  // ========== 7. 數量類 ==========
  { root: 'mono / uni', meaning: '一', origin: '希臘/拉丁文', category: '數量', words: [
    { word: 'monopoly', parts: [['mono','一'],['poly','賣']], def: 'n. 壟斷', mnemonic: '只有一家賣', level: 'GEPT-MH' },
    { word: 'monotonous', parts: [['mono','一'],['tonous','音']], def: 'adj. 單調的', mnemonic: '只有一個音', level: 'GEPT-MH' },
    { word: 'unique', parts: [['uni','一'],['que','adj.']], def: 'adj. 獨特的', mnemonic: '獨一無二', level: 'JH' },
    { word: 'uniform', parts: [['uni','一'],['form','形式']], def: 'n. 制服', mnemonic: '統一的形式', level: 'JH' },
    { word: 'unify', parts: [['uni','一'],['fy','v.']], def: 'v. 統一', mnemonic: '變成一個', level: 'GEPT-M' },
    { word: 'union', parts: [['uni','一'],['on','n.']], def: 'n. 聯盟', mnemonic: '合而為一', level: 'JH' },
    { word: 'unite', parts: [['uni','一'],['te','v.']], def: 'v. 團結', mnemonic: '合為一體', level: 'JH' },
    { word: 'monologue', parts: [['mono','一'],['logue','說']], def: 'n. 獨白', mnemonic: '一個人說', level: 'GEPT-MH' },
  ]},
  { root: 'bi / du', meaning: '二', origin: '拉丁文', category: '數量', words: [
    { word: 'bicycle', parts: [['bi','二'],['cycle','輪']], def: 'n. 腳踏車', mnemonic: '兩個輪子', level: 'JH' },
    { word: 'bilingual', parts: [['bi','二'],['lingual','語言']], def: 'adj. 雙語的', mnemonic: '兩種語言', level: 'SH' },
    { word: 'biweekly', parts: [['bi','二'],['weekly','週']], def: 'adj./adv. 雙週的', mnemonic: '兩週一次', level: 'GEPT-M' },
    { word: 'duet', parts: [['du','二'],['et','n.']], def: 'n. 二重奏', mnemonic: '兩人合演', level: 'GEPT-M' },
    { word: 'duplicate', parts: [['du','二'],['plic','摺'],['ate','v.']], def: 'v./n. 複製', mnemonic: '摺成兩份', level: 'GEPT-MH' },
    { word: 'dual', parts: [['du','二'],['al','adj.']], def: 'adj. 雙重的', mnemonic: '兩個的', level: 'GEPT-M' },
  ]},
  { root: 'tri', meaning: '三', origin: '希臘/拉丁文', category: '數量', words: [
    { word: 'triangle', parts: [['tri','三'],['angle','角']], def: 'n. 三角形', mnemonic: '三個角', level: 'JH' },
    { word: 'tricycle', parts: [['tri','三'],['cycle','輪']], def: 'n. 三輪車', mnemonic: '三個輪子', level: 'JH' },
    { word: 'triple', parts: [['tri','三'],['ple','倍']], def: 'adj. 三倍的', mnemonic: '三倍', level: 'SH' },
    { word: 'trilogy', parts: [['tri','三'],['logy','系列']], def: 'n. 三部曲', mnemonic: '三部作品', level: 'GEPT-MH' },
    { word: 'tripod', parts: [['tri','三'],['pod','腳']], def: 'n. 三腳架', mnemonic: '三隻腳', level: 'GEPT-MH' },
  ]},
  { root: 'multi / poly', meaning: '多', origin: '拉丁/希臘文', category: '數量', words: [
    { word: 'multiple', parts: [['multi','多'],['ple','倍']], def: 'adj. 多重的', mnemonic: '多倍的', level: 'SH' },
    { word: 'multiply', parts: [['multi','多'],['ply','摺']], def: 'v. 乘、繁殖', mnemonic: '變多', level: 'JH' },
    { word: 'multimedia', parts: [['multi','多'],['media','媒體']], def: 'n. 多媒體', mnemonic: '多種媒體', level: 'SH' },
    { word: 'polygon', parts: [['poly','多'],['gon','角']], def: 'n. 多邊形', mnemonic: '多個角', level: 'GEPT-MH' },
    { word: 'polite', parts: [['pol','多'],['ite','adj.']], def: 'adj. 有禮貌的', mnemonic: '受過多次磨練的', level: 'JH' },
  ]},
  { root: 'cent', meaning: '百', origin: '拉丁文 centum', category: '數量', words: [
    { word: 'century', parts: [['cent','百'],['ury','n.']], def: 'n. 世紀', mnemonic: '一百年', level: 'JH' },
    { word: 'percent', parts: [['per','每'],['cent','百']], def: 'n. 百分比', mnemonic: '每一百', level: 'JH' },
    { word: 'centimeter', parts: [['centi','百'],['meter','米']], def: 'n. 公分', mnemonic: '百分之一米', level: 'JH' },
    { word: 'centennial', parts: [['cent','百'],['ennial','年']], def: 'adj./n. 百年的', mnemonic: '百年紀念', level: 'GEPT-MH' },
    { word: 'centipede', parts: [['centi','百'],['pede','腳']], def: 'n. 蜈蚣', mnemonic: '百足', level: 'GEPT-MH' },
  ]},

  // ========== 8. 空間方位類 ==========
  { root: 'tele', meaning: '遠', origin: '希臘文 tele', category: '方位', words: [
    { word: 'telephone', parts: [['tele','遠'],['phone','聲音']], def: 'n. 電話', mnemonic: '遠處的聲音', level: 'JH' },
    { word: 'television', parts: [['tele','遠'],['vision','看']], def: 'n. 電視', mnemonic: '看遠處的', level: 'JH' },
    { word: 'telescope', parts: [['tele','遠'],['scope','看']], def: 'n. 望遠鏡', mnemonic: '看遠處的工具', level: 'JH' },
    { word: 'telegram', parts: [['tele','遠'],['gram','寫']], def: 'n. 電報', mnemonic: '遠處的訊息', level: 'GEPT-MH' },
    { word: 'telepathy', parts: [['tele','遠'],['pathy','感覺']], def: 'n. 心電感應', mnemonic: '遠距感應', level: 'GEPT-MH' },
    { word: 'telecast', parts: [['tele','遠'],['cast','投']], def: 'v./n. 電視播放', mnemonic: '遠處播送', level: 'GEPT-MH' },
  ]},
  { root: 'sub', meaning: '在下', origin: '拉丁文 sub', category: '方位', words: [
    { word: 'submarine', parts: [['sub','在下'],['marine','海']], def: 'n. 潛水艇', mnemonic: '海面下的', level: 'SH' },
    { word: 'subway', parts: [['sub','在下'],['way','路']], def: 'n. 地鐵', mnemonic: '地下的路', level: 'JH' },
    { word: 'submit', parts: [['sub','在下'],['mit','送']], def: 'v. 提交', mnemonic: '送到下面', level: 'SH' },
    { word: 'subtract', parts: [['sub','在下'],['tract','拉']], def: 'v. 減去', mnemonic: '從下拉走', level: 'SH' },
    { word: 'suburb', parts: [['sub','在下'],['urb','城']], def: 'n. 郊區', mnemonic: '城下的地方', level: 'SH' },
    { word: 'subtitle', parts: [['sub','在下'],['title','標題']], def: 'n. 字幕', mnemonic: '影像下的字', level: 'SH' },
    { word: 'subjective', parts: [['sub','在下'],['jective','adj.']], def: 'adj. 主觀的', mnemonic: '受個體在下影響', level: 'GEPT-M' },
  ]},
  { root: 'super', meaning: '在上、超越', origin: '拉丁文 super', category: '方位', words: [
    { word: 'superior', parts: [['super','上'],['ior','adj.']], def: 'adj. 上等的', mnemonic: '在上面的', level: 'SH' },
    { word: 'supermarket', parts: [['super','超'],['market','市場']], def: 'n. 超市', mnemonic: '超大市場', level: 'JH' },
    { word: 'supervise', parts: [['super','上'],['vise','看']], def: 'v. 監督', mnemonic: '從上面看', level: 'GEPT-M' },
    { word: 'superficial', parts: [['super','上'],['ficial','面']], def: 'adj. 表面的', mnemonic: '只在上面', level: 'GEPT-MH' },
    { word: 'superb', parts: [['super','超'],['b','adj.']], def: 'adj. 極好的', mnemonic: '超棒', level: 'GEPT-M' },
    { word: 'superstition', parts: [['super','上'],['stition','站']], def: 'n. 迷信', mnemonic: '站在合理之上', level: 'GEPT-M' },
  ]},
  { root: 'inter', meaning: '在…之間', origin: '拉丁文 inter', category: '方位', words: [
    { word: 'international', parts: [['inter','之間'],['national','國家']], def: 'adj. 國際的', mnemonic: '國與國之間', level: 'JH' },
    { word: 'internet', parts: [['inter','之間'],['net','網']], def: 'n. 網際網路', mnemonic: '互聯的網', level: 'JH' },
    { word: 'interact', parts: [['inter','之間'],['act','行動']], def: 'v. 互動', mnemonic: '彼此行動', level: 'SH' },
    { word: 'interview', parts: [['inter','之間'],['view','看']], def: 'v./n. 面試、訪問', mnemonic: '互相對視', level: 'JH' },
    { word: 'interrupt', parts: [['inter','之間'],['rupt','破']], def: 'v. 打斷', mnemonic: '從中打破', level: 'SH' },
    { word: 'intermediate', parts: [['inter','之間'],['mediate','中']], def: 'adj. 中級的', mnemonic: '在中間的', level: 'GEPT-M' },
  ]},
  { root: 'trans', meaning: '橫越、轉換', origin: '拉丁文 trans', category: '方位', words: [
    { word: 'transfer', parts: [['trans','橫越'],['fer','帶']], def: 'v. 轉移', mnemonic: '帶過去', level: 'SH' },
    { word: 'transport', parts: [['trans','橫越'],['port','搬']], def: 'v. 運輸', mnemonic: '搬到另一邊', level: 'SH' },
    { word: 'translate', parts: [['trans','橫越'],['late','帶']], def: 'v. 翻譯', mnemonic: '帶到另一語言', level: 'JH' },
    { word: 'transform', parts: [['trans','橫越'],['form','形式']], def: 'v. 轉變', mnemonic: '換形式', level: 'SH' },
    { word: 'transmit', parts: [['trans','橫越'],['mit','送']], def: 'v. 傳送', mnemonic: '送到另一邊', level: 'GEPT-M' },
    { word: 'transparent', parts: [['trans','橫越'],['parent','顯現']], def: 'adj. 透明的', mnemonic: '可以看穿的', level: 'SH' },
  ]},
  { root: 'pre', meaning: '在前', origin: '拉丁文 prae', category: '方位', words: [
    { word: 'prepare', parts: [['pre','前'],['pare','預備']], def: 'v. 準備', mnemonic: '事前安排', level: 'JH' },
    { word: 'predict', parts: [['pre','前'],['dict','說']], def: 'v. 預測', mnemonic: '事前說', level: 'SH' },
    { word: 'preview', parts: [['pre','前'],['view','看']], def: 'v./n. 預覽', mnemonic: '事前看', level: 'JH' },
    { word: 'prefix', parts: [['pre','前'],['fix','固定']], def: 'n. 字首', mnemonic: '固定在前面的', level: 'SH' },
    { word: 'precaution', parts: [['pre','前'],['caution','小心']], def: 'n. 預防措施', mnemonic: '事前小心', level: 'GEPT-MH' },
    { word: 'precede', parts: [['pre','前'],['cede','走']], def: 'v. 在…之前', mnemonic: '走在前', level: 'GEPT-M' },
  ]},
  { root: 'post', meaning: '在後', origin: '拉丁文 post', category: '方位', words: [
    { word: 'postpone', parts: [['post','後'],['pone','放']], def: 'v. 延期', mnemonic: '放到後面', level: 'SH' },
    { word: 'postscript', parts: [['post','後'],['script','寫']], def: 'n. 附筆 (PS)', mnemonic: '寫在後面的', level: 'GEPT-MH' },
    { word: 'postgraduate', parts: [['post','後'],['graduate','畢業']], def: 'n. 研究生', mnemonic: '畢業後的', level: 'GEPT-MH' },
    { word: 'posterior', parts: [['post','後'],['erior','adj.']], def: 'adj. 後面的', mnemonic: '在後的', level: 'GEPT-MH' },
  ]},
  { root: 'ex', meaning: '向外', origin: '拉丁文 ex', category: '方位', words: [
    { word: 'exit', parts: [['ex','向外'],['it','走']], def: 'n./v. 出口', mnemonic: '走出去', level: 'JH' },
    { word: 'export', parts: [['ex','向外'],['port','搬']], def: 'v. 出口', mnemonic: '搬出去', level: 'JH' },
    { word: 'extend', parts: [['ex','向外'],['tend','伸']], def: 'v. 延伸', mnemonic: '向外伸', level: 'SH' },
    { word: 'expand', parts: [['ex','向外'],['pand','張']], def: 'v. 擴展', mnemonic: '向外擴張', level: 'SH' },
    { word: 'expose', parts: [['ex','向外'],['pose','放']], def: 'v. 暴露', mnemonic: '放到外面', level: 'SH' },
    { word: 'exhale', parts: [['ex','向外'],['hale','呼吸']], def: 'v. 呼氣', mnemonic: '把氣呼出', level: 'GEPT-MH' },
  ]},

  // ========== 9. 否定/反向類 ==========
  { root: 'un', meaning: '不、無', origin: '日耳曼語 un-', category: '否定', words: [
    { word: 'unhappy', parts: [['un','不'],['happy','快樂']], def: 'adj. 不快樂的', mnemonic: '不快樂', level: 'JH' },
    { word: 'unable', parts: [['un','不'],['able','能']], def: 'adj. 不能的', mnemonic: '不能', level: 'JH' },
    { word: 'unfair', parts: [['un','不'],['fair','公平']], def: 'adj. 不公平的', mnemonic: '不公平', level: 'JH' },
    { word: 'unknown', parts: [['un','不'],['known','知']], def: 'adj. 未知的', mnemonic: '不知道', level: 'JH' },
    { word: 'unlock', parts: [['un','解除'],['lock','鎖']], def: 'v. 解鎖', mnemonic: '解除鎖', level: 'JH' },
    { word: 'undo', parts: [['un','解除'],['do','做']], def: 'v. 取消、解開', mnemonic: '解除做過的', level: 'SH' },
    { word: 'unprecedented', parts: [['un','無'],['pre','前'],['ced','走'],['ent','adj.']], def: 'adj. 史無前例的', mnemonic: '無前人走過', level: 'GEPT-MH' },
  ]},
  { root: 'dis', meaning: '不、分開', origin: '拉丁文 dis-', category: '否定', words: [
    { word: 'dislike', parts: [['dis','不'],['like','喜歡']], def: 'v. 不喜歡', mnemonic: '不喜歡', level: 'JH' },
    { word: 'disagree', parts: [['dis','不'],['agree','同意']], def: 'v. 不同意', mnemonic: '不同意', level: 'JH' },
    { word: 'discover', parts: [['dis','解除'],['cover','蓋']], def: 'v. 發現', mnemonic: '揭開蓋子', level: 'JH' },
    { word: 'disappear', parts: [['dis','不'],['appear','出現']], def: 'v. 消失', mnemonic: '不出現', level: 'JH' },
    { word: 'discount', parts: [['dis','解除'],['count','算']], def: 'n. 折扣', mnemonic: '減去計算', level: 'JH' },
    { word: 'disconnect', parts: [['dis','分開'],['connect','連接']], def: 'v. 斷開', mnemonic: '分開連接', level: 'SH' },
    { word: 'discourage', parts: [['dis','不'],['courage','勇']], def: 'v. 使氣餒', mnemonic: '失去勇氣', level: 'SH' },
    { word: 'disaster', parts: [['dis','不好'],['aster','星']], def: 'n. 災難', mnemonic: '壞星象', level: 'SH' },
  ]},
  { root: 'anti', meaning: '反對', origin: '希臘文 anti', category: '否定', words: [
    { word: 'antibiotic', parts: [['anti','對抗'],['biotic','生命']], def: 'n. 抗生素', mnemonic: '對抗細菌', level: 'GEPT-MH' },
    { word: 'antibody', parts: [['anti','對抗'],['body','身體']], def: 'n. 抗體', mnemonic: '對抗入侵', level: 'GEPT-MH' },
    { word: 'antisocial', parts: [['anti','反'],['social','社會']], def: 'adj. 反社會的', mnemonic: '反社會', level: 'SH' },
    { word: 'antarctic', parts: [['ant','對立'],['arctic','北']], def: 'adj. 南極的', mnemonic: '北極的對面', level: 'SH' },
    { word: 'antonym', parts: [['ant','反'],['onym','名字']], def: 'n. 反義字', mnemonic: '相反的字', level: 'SH' },
  ]},
  { root: 'mis', meaning: '錯誤、壞', origin: '古英語 mis-', category: '否定', words: [
    { word: 'mistake', parts: [['mis','錯'],['take','拿']], def: 'n./v. 錯誤', mnemonic: '拿錯', level: 'JH' },
    { word: 'misunderstand', parts: [['mis','錯'],['understand','理解']], def: 'v. 誤解', mnemonic: '理解錯', level: 'JH' },
    { word: 'mislead', parts: [['mis','錯'],['lead','帶']], def: 'v. 誤導', mnemonic: '帶錯路', level: 'SH' },
    { word: 'misuse', parts: [['mis','錯'],['use','用']], def: 'v. 誤用', mnemonic: '用錯', level: 'SH' },
    { word: 'misfortune', parts: [['mis','壞'],['fortune','運']], def: 'n. 不幸', mnemonic: '壞運氣', level: 'GEPT-M' },
    { word: 'mischief', parts: [['mis','壞'],['chief','頭']], def: 'n. 惡作劇', mnemonic: '壞點子', level: 'GEPT-MH' },
  ]},
  { root: 'in / im', meaning: '不', origin: '拉丁文 in-', category: '否定', words: [
    { word: 'invisible', parts: [['in','不'],['visible','可見']], def: 'adj. 看不見的', mnemonic: '不可見', level: 'SH' },
    { word: 'impossible', parts: [['im','不'],['possible','可能']], def: 'adj. 不可能的', mnemonic: '不可能', level: 'JH' },
    { word: 'incorrect', parts: [['in','不'],['correct','對']], def: 'adj. 不正確的', mnemonic: '不對', level: 'SH' },
    { word: 'impatient', parts: [['im','不'],['patient','耐心']], def: 'adj. 不耐煩的', mnemonic: '沒耐心', level: 'SH' },
    { word: 'incredible', parts: [['in','不'],['credible','可信']], def: 'adj. 難以置信的', mnemonic: '不可信', level: 'SH' },
    { word: 'independent', parts: [['in','不'],['dependent','依賴']], def: 'adj. 獨立的', mnemonic: '不依賴', level: 'JH' },
    { word: 'illegal', parts: [['il','不'],['legal','法']], def: 'adj. 非法的', mnemonic: '不合法', level: 'SH' },
  ]},

  // ========== 10. 動作/狀態 (擴充) ==========
  { root: 'struct', meaning: '建造', origin: '拉丁文 struere', category: '動作', words: [
    { word: 'construct', parts: [['con','一起'],['struct','建']], def: 'v. 建造', mnemonic: '一起建起來', level: 'SH' },
    { word: 'destroy', parts: [['de','向下'],['stroy','建']], def: 'v. 摧毀', mnemonic: '向下拆建造物', level: 'JH' },
    { word: 'instruct', parts: [['in','向內'],['struct','建']], def: 'v. 教導', mnemonic: '建構知識', level: 'SH' },
    { word: 'structure', parts: [['struct','建'],['ure','n.']], def: 'n. 結構', mnemonic: '建起來的形態', level: 'SH' },
    { word: 'construction', parts: [['con','一起'],['struct','建'],['ion','n.']], def: 'n. 建設', mnemonic: '建造的過程', level: 'SH' },
    { word: 'obstruct', parts: [['ob','對抗'],['struct','建']], def: 'v. 阻擋', mnemonic: '建在前面擋住', level: 'GEPT-MH' },
    { word: 'infrastructure', parts: [['infra','下'],['structure','結構']], def: 'n. 基礎建設', mnemonic: '底下的結構', level: 'GEPT-MH' },
  ]},
  { root: 'flu', meaning: '流動', origin: '拉丁文 fluere', category: '動作', words: [
    { word: 'fluent', parts: [['flu','流'],['ent','adj.']], def: 'adj. 流利的', mnemonic: '會流動的', level: 'SH' },
    { word: 'influence', parts: [['in','向內'],['flu','流'],['ence','n.']], def: 'n. 影響', mnemonic: '流入心裡', level: 'SH' },
    { word: 'fluid', parts: [['flu','流'],['id','n.']], def: 'n. 液體', mnemonic: '會流的東西', level: 'SH' },
    { word: 'flush', parts: [['flu','流'],['sh','v.']], def: 'v. 沖洗、臉紅', mnemonic: '使流動', level: 'SH' },
    { word: 'affluent', parts: [['af','朝向'],['flu','流'],['ent','adj.']], def: 'adj. 富裕的', mnemonic: '財富流入', level: 'GEPT-MH' },
    { word: 'influenza', parts: [['in','向內'],['flu','流'],['enza','n.']], def: 'n. 流感', mnemonic: '流動傳播的病', level: 'GEPT-MH' },
  ]},
  { root: 'pend / pens', meaning: '懸掛、衡量', origin: '拉丁文 pendere', category: '動作', words: [
    { word: 'depend', parts: [['de','向下'],['pend','掛']], def: 'v. 依賴', mnemonic: '掛在某物之下', level: 'JH' },
    { word: 'suspend', parts: [['sus','在下'],['pend','掛']], def: 'v. 暫停', mnemonic: '掛起來', level: 'SH' },
    { word: 'expensive', parts: [['ex','向外'],['pens','衡量'],['ive','adj.']], def: 'adj. 昂貴的', mnemonic: '要衡量花費', level: 'JH' },
    { word: 'expense', parts: [['ex','向外'],['pense','衡量']], def: 'n. 花費', mnemonic: '衡量花掉的', level: 'SH' },
    { word: 'pendant', parts: [['pend','掛'],['ant','物']], def: 'n. 墜飾', mnemonic: '掛著的東西', level: 'GEPT-MH' },
    { word: 'compensate', parts: [['com','一起'],['pens','衡量'],['ate','v.']], def: 'v. 補償', mnemonic: '一起衡量補回來', level: 'GEPT-MH' },
    { word: 'pension', parts: [['pens','衡量'],['ion','n.']], def: 'n. 退休金', mnemonic: '衡量後給的', level: 'GEPT-MH' },
  ]},
  { root: 'reg / rect', meaning: '統治、直', origin: '拉丁文 regere', category: '動作', words: [
    { word: 'correct', parts: [['cor','一起'],['rect','直']], def: 'adj. 正確的', mnemonic: '一起變直', level: 'JH' },
    { word: 'direct', parts: [['di','分開'],['rect','直']], def: 'adj. 直接的', mnemonic: '直接的', level: 'JH' },
    { word: 'regular', parts: [['reg','直'],['ular','adj.']], def: 'adj. 規律的', mnemonic: '有規矩的', level: 'JH' },
    { word: 'region', parts: [['reg','統治'],['ion','n.']], def: 'n. 地區', mnemonic: '所統治的地', level: 'SH' },
    { word: 'regulate', parts: [['reg','治'],['ulate','v.']], def: 'v. 調節、管制', mnemonic: '使有規矩', level: 'SH' },
    { word: 'erect', parts: [['e','向上'],['rect','直']], def: 'v./adj. 豎立', mnemonic: '使直立', level: 'GEPT-MH' },
    { word: 'rectangle', parts: [['rect','直'],['angle','角']], def: 'n. 長方形', mnemonic: '直角形', level: 'JH' },
    { word: 'royal', parts: [['roy','王'],['al','adj.']], def: 'adj. 皇家的', mnemonic: '統治者的', level: 'SH' },
  ]},
  { root: 'gen', meaning: '產生、種類', origin: '希臘/拉丁文', category: '動作', words: [
    { word: 'generate', parts: [['gen','產生'],['erate','v.']], def: 'v. 產生', mnemonic: '使產生', level: 'SH' },
    { word: 'genetic', parts: [['gen','基因'],['etic','adj.']], def: 'adj. 基因的', mnemonic: '與產生後代有關', level: 'GEPT-M' },
    { word: 'generation', parts: [['gen','產生'],['eration','n.']], def: 'n. 世代', mnemonic: '一代代產生', level: 'SH' },
    { word: 'gene', parts: [['gene','基因']], def: 'n. 基因', mnemonic: '產生生命的單位', level: 'SH' },
    { word: 'general', parts: [['gen','種類'],['eral','adj.']], def: 'adj. 一般的', mnemonic: '同種類的', level: 'JH' },
    { word: 'genuine', parts: [['gen','產生'],['uine','adj.']], def: 'adj. 真正的', mnemonic: '原本產生的', level: 'GEPT-MH' },
    { word: 'genius', parts: [['gen','產生'],['ius','n.']], def: 'n. 天才', mnemonic: '生來有才', level: 'SH' },
    { word: 'pregnant', parts: [['pre','前'],['gn','生'],['ant','adj.']], def: 'adj. 懷孕的', mnemonic: '產生新生命前', level: 'SH' },
  ]},
  { root: 'fac / fec / fic', meaning: '做、製造', origin: '拉丁文 facere', category: '動作', words: [
    { word: 'factory', parts: [['fac','做'],['tory','地方']], def: 'n. 工廠', mnemonic: '做東西的地方', level: 'JH' },
    { word: 'effect', parts: [['ef','向外'],['fect','做']], def: 'n. 效果', mnemonic: '做出來的結果', level: 'JH' },
    { word: 'efficient', parts: [['ef','向外'],['fic','做'],['ient','adj.']], def: 'adj. 有效率的', mnemonic: '做得出成果', level: 'SH' },
    { word: 'difficult', parts: [['dif','分開'],['fic','做'],['ult','adj.']], def: 'adj. 困難的', mnemonic: '不易做', level: 'JH' },
    { word: 'manufacture', parts: [['manu','手'],['fact','做'],['ure','n.']], def: 'v./n. 製造', mnemonic: '用手做', level: 'SH' },
    { word: 'fiction', parts: [['fic','做'],['tion','n.']], def: 'n. 小說、虛構', mnemonic: '編造的東西', level: 'SH' },
    { word: 'sufficient', parts: [['suf','下'],['fic','做'],['ient','adj.']], def: 'adj. 足夠的', mnemonic: '做到底', level: 'GEPT-M' },
    { word: 'magnificent', parts: [['magni','大'],['fic','做'],['ent','adj.']], def: 'adj. 壯麗的', mnemonic: '做得壯大', level: 'GEPT-M' },
  ]},
  { root: 'cap / cept / cip', meaning: '拿、取', origin: '拉丁文 capere', category: '動作', words: [
    { word: 'capture', parts: [['cap','拿'],['ture','v.']], def: 'v. 捕獲', mnemonic: '把…拿到', level: 'SH' },
    { word: 'accept', parts: [['ac','朝向'],['cept','拿']], def: 'v. 接受', mnemonic: '拿過來', level: 'JH' },
    { word: 'concept', parts: [['con','一起'],['cept','拿']], def: 'n. 概念', mnemonic: '一起拿到的想法', level: 'SH' },
    { word: 'except', parts: [['ex','向外'],['cept','拿']], def: 'prep. 除…之外', mnemonic: '拿出去', level: 'JH' },
    { word: 'receive', parts: [['re','再'],['ceive','拿']], def: 'v. 收到', mnemonic: '拿回來', level: 'JH' },
    { word: 'perceive', parts: [['per','穿過'],['ceive','拿']], def: 'v. 察覺', mnemonic: '徹底掌握', level: 'GEPT-M' },
    { word: 'deceive', parts: [['de','離開'],['ceive','拿']], def: 'v. 欺騙', mnemonic: '把真相拿走', level: 'GEPT-MH' },
    { word: 'participate', parts: [['parti','部分'],['cip','拿'],['ate','v.']], def: 'v. 參加', mnemonic: '拿一部分', level: 'SH' },
  ]},

  // ========== 11. 抽象概念類 ==========
  { root: 'mort', meaning: '死亡', origin: '拉丁文 mors', category: '抽象', words: [
    { word: 'mortal', parts: [['mort','死'],['al','adj.']], def: 'adj. 會死的', mnemonic: '會死的', level: 'GEPT-M' },
    { word: 'immortal', parts: [['im','不'],['mortal','會死']], def: 'adj. 不朽的', mnemonic: '不會死', level: 'GEPT-M' },
    { word: 'mortgage', parts: [['mort','死'],['gage','抵押']], def: 'n. 抵押貸款', mnemonic: '至死方休的擔保', level: 'GEPT-MH' },
    { word: 'mortality', parts: [['mort','死'],['ality','n.']], def: 'n. 死亡率', mnemonic: '會死的特性', level: 'GEPT-MH' },
    { word: 'mortician', parts: [['mort','死'],['ician','人']], def: 'n. 殯葬業者', mnemonic: '處理死亡的人', level: 'GEPT-MH' },
  ]},
  { root: 'vit / viv', meaning: '生命', origin: '拉丁文 vivere', category: '抽象', words: [
    { word: 'vital', parts: [['vit','生'],['al','adj.']], def: 'adj. 至關重要的', mnemonic: '生命攸關的', level: 'SH' },
    { word: 'vitamin', parts: [['vit','生'],['amin','n.']], def: 'n. 維他命', mnemonic: '維持生命', level: 'JH' },
    { word: 'survive', parts: [['sur','超過'],['vive','生']], def: 'v. 存活', mnemonic: '生過難關', level: 'SH' },
    { word: 'revive', parts: [['re','再'],['vive','生']], def: 'v. 復活、復甦', mnemonic: '再次活', level: 'GEPT-M' },
    { word: 'vivid', parts: [['viv','生'],['id','adj.']], def: 'adj. 生動的', mnemonic: '充滿生命力', level: 'SH' },
    { word: 'survivor', parts: [['sur','超過'],['viv','生'],['or','人']], def: 'n. 倖存者', mnemonic: '存活的人', level: 'SH' },
  ]},
  { root: 'liber / liver', meaning: '自由', origin: '拉丁文 liber', category: '抽象', words: [
    { word: 'liberty', parts: [['liber','自由'],['ty','n.']], def: 'n. 自由', mnemonic: '自由', level: 'SH' },
    { word: 'liberal', parts: [['liber','自由'],['al','adj.']], def: 'adj. 自由派的', mnemonic: '崇尚自由的', level: 'GEPT-M' },
    { word: 'liberate', parts: [['liber','自由'],['ate','v.']], def: 'v. 解放', mnemonic: '使自由', level: 'GEPT-MH' },
    { word: 'deliver', parts: [['de','離開'],['liver','自由']], def: 'v. 遞送', mnemonic: '使脫離', level: 'JH' },
  ]},
  { root: 'pac / pace', meaning: '和平', origin: '拉丁文 pax', category: '抽象', words: [
    { word: 'peace', parts: [['peace','和平']], def: 'n. 和平', mnemonic: '和平', level: 'JH' },
    { word: 'pacific', parts: [['pac','和平'],['ific','adj.']], def: 'adj. 太平的', mnemonic: '和平的', level: 'SH' },
    { word: 'pacify', parts: [['pac','和平'],['ify','v.']], def: 'v. 平息', mnemonic: '使和平', level: 'GEPT-MH' },
  ]},
  { root: 'jud / jur', meaning: '判斷、法律', origin: '拉丁文 judicare', category: '抽象', words: [
    { word: 'judge', parts: [['judge','判']], def: 'v./n. 判斷、法官', mnemonic: '判斷', level: 'JH' },
    { word: 'judgment', parts: [['judg','判'],['ment','n.']], def: 'n. 判斷', mnemonic: '判斷的結果', level: 'SH' },
    { word: 'justice', parts: [['just','正'],['ice','n.']], def: 'n. 正義', mnemonic: '正當的判斷', level: 'SH' },
    { word: 'prejudice', parts: [['pre','前'],['judice','判']], def: 'n. 偏見', mnemonic: '事先判斷', level: 'GEPT-M' },
    { word: 'jury', parts: [['jur','判']], def: 'n. 陪審團', mnemonic: '判決的人', level: 'GEPT-M' },
  ]},

  // ========== 12. 量度與計算 ==========
  { root: 'meter / metr', meaning: '測量', origin: '希臘文 metron', category: '量度', words: [
    { word: 'meter', parts: [['meter','測量']], def: 'n. 公尺、計量器', mnemonic: '測量單位', level: 'JH' },
    { word: 'thermometer', parts: [['thermo','熱'],['meter','測量']], def: 'n. 溫度計', mnemonic: '測量熱度', level: 'SH' },
    { word: 'diameter', parts: [['dia','穿過'],['meter','測量']], def: 'n. 直徑', mnemonic: '穿過去量', level: 'SH' },
    { word: 'symmetry', parts: [['sym','一起'],['metry','測量']], def: 'n. 對稱', mnemonic: '一樣的量度', level: 'GEPT-MH' },
    { word: 'parameter', parts: [['para','旁'],['meter','測量']], def: 'n. 參數', mnemonic: '旁邊的量度', level: 'GEPT-MH' },
    { word: 'geometry', parts: [['geo','地'],['metry','測量']], def: 'n. 幾何', mnemonic: '測量土地', level: 'SH' },
  ]},
  { root: 'equ', meaning: '相等', origin: '拉丁文 aequus', category: '量度', words: [
    { word: 'equal', parts: [['equ','相等'],['al','adj.']], def: 'adj. 相等的', mnemonic: '一樣的', level: 'JH' },
    { word: 'equator', parts: [['equ','相等'],['ator','n.']], def: 'n. 赤道', mnemonic: '把地球分成相等', level: 'SH' },
    { word: 'adequate', parts: [['ad','朝向'],['equ','相等'],['ate','adj.']], def: 'adj. 足夠的', mnemonic: '達到相等', level: 'GEPT-M' },
    { word: 'equivalent', parts: [['equi','相等'],['val','價值'],['ent','adj.']], def: 'adj. 相等的', mnemonic: '價值相等', level: 'GEPT-M' },
    { word: 'equation', parts: [['equ','相等'],['ation','n.']], def: 'n. 方程式', mnemonic: '使相等', level: 'SH' },
  ]},

  // ========== 13. 心智情感類 ==========
  { root: 'path', meaning: '感受、痛', origin: '希臘文 pathos', category: '心智', words: [
    { word: 'sympathy', parts: [['sym','一起'],['pathy','感']], def: 'n. 同情', mnemonic: '一起感受', level: 'SH' },
    { word: 'empathy', parts: [['em','在內'],['pathy','感']], def: 'n. 同理心', mnemonic: '感同身受', level: 'GEPT-M' },
    { word: 'apathy', parts: [['a','無'],['pathy','感']], def: 'n. 冷漠', mnemonic: '沒感覺', level: 'GEPT-MH' },
    { word: 'pathetic', parts: [['path','感'],['etic','adj.']], def: 'adj. 可悲的', mnemonic: '引起感傷的', level: 'GEPT-MH' },
    { word: 'telepathy', parts: [['tele','遠'],['pathy','感']], def: 'n. 心電感應', mnemonic: '遠距感受', level: 'GEPT-MH' },
    { word: 'pathology', parts: [['path','病'],['ology','學']], def: 'n. 病理學', mnemonic: '研究病痛', level: 'GEPT-MH' },
  ]},
  { root: 'phil', meaning: '愛', origin: '希臘文 philos', category: '心智', words: [
    { word: 'philosophy', parts: [['phil','愛'],['osophy','智']], def: 'n. 哲學', mnemonic: '愛智慧', level: 'SH' },
    { word: 'philosopher', parts: [['phil','愛'],['osopher','智者']], def: 'n. 哲學家', mnemonic: '愛智慧的人', level: 'SH' },
    { word: 'philanthropy', parts: [['phil','愛'],['anthropy','人']], def: 'n. 慈善', mnemonic: '愛人類', level: 'GEPT-MH' },
  ]},
  { root: 'phob', meaning: '懼怕', origin: '希臘文 phobos', category: '心智', words: [
    { word: 'phobia', parts: [['phob','怕'],['ia','n.']], def: 'n. 恐懼症', mnemonic: '怕的狀態', level: 'GEPT-MH' },
    { word: 'claustrophobia', parts: [['claustro','封閉'],['phobia','怕']], def: 'n. 幽閉恐懼症', mnemonic: '怕封閉', level: 'GEPT-MH' },
    { word: 'xenophobia', parts: [['xeno','陌生'],['phobia','怕']], def: 'n. 仇外', mnemonic: '怕陌生人', level: 'GEPT-MH' },
  ]},

  // ========== 14. 力量類 ==========
  { root: 'val / vail', meaning: '價值、強', origin: '拉丁文 valere', category: '價值', words: [
    { word: 'value', parts: [['val','價值'],['ue','n.']], def: 'n. 價值', mnemonic: '價值', level: 'JH' },
    { word: 'valuable', parts: [['val','價值'],['uable','adj.']], def: 'adj. 有價值的', mnemonic: '有價值', level: 'JH' },
    { word: 'available', parts: [['a','朝向'],['vail','強'],['able','可…']], def: 'adj. 可得到的', mnemonic: '可以取用', level: 'JH' },
    { word: 'evaluate', parts: [['e','向外'],['val','價值'],['uate','v.']], def: 'v. 評估', mnemonic: '把價值評出來', level: 'SH' },
    { word: 'invalid', parts: [['in','不'],['val','強'],['id','adj.']], def: 'adj. 無效的', mnemonic: '沒效力', level: 'GEPT-M' },
    { word: 'prevail', parts: [['pre','前'],['vail','強']], def: 'v. 盛行、勝過', mnemonic: '在前面強', level: 'GEPT-MH' },
  ]},
  { root: 'fort', meaning: '強', origin: '拉丁文 fortis', category: '價值', words: [
    { word: 'effort', parts: [['ef','向外'],['fort','強']], def: 'n. 努力', mnemonic: '使出力量', level: 'JH' },
    { word: 'comfort', parts: [['com','一起'],['fort','強']], def: 'n. 舒適、安慰', mnemonic: '一起強壯', level: 'JH' },
    { word: 'fortify', parts: [['fort','強'],['ify','v.']], def: 'v. 強化', mnemonic: '使強', level: 'GEPT-MH' },
    { word: 'fortress', parts: [['fort','強'],['ress','n.']], def: 'n. 堡壘', mnemonic: '強固的地方', level: 'GEPT-MH' },
    { word: 'force', parts: [['force','力']], def: 'n. 力量', mnemonic: '力量', level: 'JH' },
  ]},

  // ========== 15. 形狀類 ==========
  { root: 'form', meaning: '形狀', origin: '拉丁文 forma', category: '形狀', words: [
    { word: 'form', parts: [['form','形']], def: 'n./v. 形式、形成', mnemonic: '形狀', level: 'JH' },
    { word: 'uniform', parts: [['uni','一'],['form','形']], def: 'n. 制服', mnemonic: '一致的形式', level: 'JH' },
    { word: 'inform', parts: [['in','向內'],['form','形']], def: 'v. 通知', mnemonic: '在心中形成', level: 'JH' },
    { word: 'transform', parts: [['trans','轉'],['form','形']], def: 'v. 轉變', mnemonic: '轉換形式', level: 'SH' },
    { word: 'reform', parts: [['re','再'],['form','形']], def: 'v./n. 改革', mnemonic: '再造形式', level: 'SH' },
    { word: 'conform', parts: [['con','一起'],['form','形']], def: 'v. 順從、符合', mnemonic: '一起符合', level: 'GEPT-MH' },
    { word: 'perform', parts: [['per','完全'],['form','做']], def: 'v. 表演、執行', mnemonic: '完整做出', level: 'JH' },
    { word: 'formal', parts: [['form','形'],['al','adj.']], def: 'adj. 正式的', mnemonic: '依形式的', level: 'JH' },
  ]},

  // ========== 16. 時間類 ==========
  { root: 'chron', meaning: '時間', origin: '希臘文 chronos', category: '時間', words: [
    { word: 'chronic', parts: [['chron','時間'],['ic','adj.']], def: 'adj. 慢性的', mnemonic: '長期的', level: 'GEPT-MH' },
    { word: 'chronology', parts: [['chron','時間'],['ology','學']], def: 'n. 年代學', mnemonic: '時間順序', level: 'GEPT-MH' },
    { word: 'synchronize', parts: [['syn','一起'],['chron','時間'],['ize','v.']], def: 'v. 使同步', mnemonic: '時間一起', level: 'GEPT-MH' },
  ]},
  { root: 'tempor', meaning: '時間', origin: '拉丁文 tempus', category: '時間', words: [
    { word: 'temporary', parts: [['tempor','時間'],['ary','adj.']], def: 'adj. 暫時的', mnemonic: '只有一段時間', level: 'SH' },
    { word: 'contemporary', parts: [['con','一起'],['tempor','時間'],['ary','adj.']], def: 'adj. 當代的', mnemonic: '同一個時代', level: 'GEPT-M' },
    { word: 'tempo', parts: [['tempo','時間']], def: 'n. 節奏', mnemonic: '時間的快慢', level: 'GEPT-M' },
  ]},

  // ========== 17. 行動類 ==========
  { root: 'act / ag', meaning: '做、行動', origin: '拉丁文 agere', category: '動作', words: [
    { word: 'act', parts: [['act','做']], def: 'v./n. 行動', mnemonic: '做', level: 'JH' },
    { word: 'action', parts: [['act','做'],['ion','n.']], def: 'n. 動作', mnemonic: '做的動作', level: 'JH' },
    { word: 'active', parts: [['act','做'],['ive','adj.']], def: 'adj. 活躍的', mnemonic: '常做的', level: 'JH' },
    { word: 'react', parts: [['re','回'],['act','做']], def: 'v. 反應', mnemonic: '回應動作', level: 'SH' },
    { word: 'interact', parts: [['inter','之間'],['act','做']], def: 'v. 互動', mnemonic: '彼此做', level: 'SH' },
    { word: 'agent', parts: [['ag','做'],['ent','人']], def: 'n. 代理人', mnemonic: '幫忙做事的人', level: 'SH' },
    { word: 'agency', parts: [['ag','做'],['ency','n.']], def: 'n. 機構、代理處', mnemonic: '做事的機構', level: 'SH' },
    { word: 'transaction', parts: [['trans','跨越'],['act','做'],['ion','n.']], def: 'n. 交易', mnemonic: '跨越雙方的動作', level: 'GEPT-M' },
  ]},
  { root: 'ven / vent', meaning: '來', origin: '拉丁文 venire', category: '動作', words: [
    { word: 'event', parts: [['e','向外'],['vent','來']], def: 'n. 事件', mnemonic: '出現的事', level: 'JH' },
    { word: 'invent', parts: [['in','向內'],['vent','來']], def: 'v. 發明', mnemonic: '把東西帶來', level: 'JH' },
    { word: 'prevent', parts: [['pre','前'],['vent','來']], def: 'v. 預防', mnemonic: '事前阻止來', level: 'SH' },
    { word: 'convention', parts: [['con','一起'],['vent','來'],['ion','n.']], def: 'n. 大會、慣例', mnemonic: '一起來', level: 'GEPT-M' },
    { word: 'venture', parts: [['vent','來'],['ure','n.']], def: 'n. 冒險事業', mnemonic: '來自冒險', level: 'GEPT-M' },
    { word: 'adventure', parts: [['ad','朝向'],['vent','來'],['ure','n.']], def: 'n. 冒險', mnemonic: '朝著未知來', level: 'JH' },
    { word: 'avenue', parts: [['a','朝向'],['ven','來'],['ue','n.']], def: 'n. 大街', mnemonic: '人們來的路', level: 'JH' },
    { word: 'intervene', parts: [['inter','之間'],['vene','來']], def: 'v. 介入', mnemonic: '從中間來', level: 'GEPT-MH' },
  ]},
];


// ========== Vodafone 設計系統 ==========
const VF = {
  red:        '#E60000',  // Vodafone Red - 主色
  redDark:    '#A00000',  // 深紅 - active 狀態
  redSoft:    '#FFE5E5',  // 極淺紅 - 微高亮
  black:      '#000000',  // 純黑文字
  white:      '#FFFFFF',  // 白
  bg:         '#FFFFFF',  // 主背景純白
  surface:    '#F7F7F7',  // 卡片淺灰
  border:     '#E5E5E5',  // 邊框淺灰
  borderHi:   '#CCCCCC',  // 強調邊框
  text:       '#000000',  // 主文字黑
  textDim:    '#4A4D4E',  // Vodafone Abbey 灰 - 次文字
  textMute:   '#878787',  // 弱化文字
};

// 難度等級配色 (融入 Vodafone 識別 - 主紅 + 輔助色)
const LEVELS = {
  'JH':       { label: '國中',     color: '#00B0CA', text: '#FFFFFF' },  // Vodafone Cerulean
  'SH':       { label: '高中',     color: '#007C92', text: '#FFFFFF' },  // Vodafone Blue Lagoon
  'GEPT-M':   { label: '英檢中級', color: '#9C2AA0', text: '#FFFFFF' },  // Vodafone Seance
  'GEPT-MH':  { label: '英檢中高', color: '#E60000', text: '#FFFFFF' },  // Vodafone Red
};

// 字根拆解配色 - Vodafone 品牌色系
const PART_COLORS = [
  { color: '#E60000' },  // Vodafone Red
  { color: '#00B0CA' },  // Cerulean
  { color: '#9C2AA0' },  // Seance
  { color: '#007C92' },  // Blue Lagoon
  { color: '#5E2750' },  // Finn
];

// ========== 字根拆解視覺化 ==========
function WordBreakdown({ word, parts, def, mnemonic, level }) {
  const lv = LEVELS[level];
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: VF.white,
        border: `1px solid ${VF.border}`,
      }}
    >
      {/* Vodafone 標誌性紅色頂部 chapter band */}
      <div
        className="px-6 py-3 flex justify-between items-center"
        style={{ backgroundColor: VF.red }}
      >
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: VF.white }}>
          WORD STUDY
        </span>
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm"
          style={{ backgroundColor: lv.color, color: lv.text }}
        >
          {lv.label}
        </span>
      </div>

      <div className="p-6">
        {/* 拆解元件 */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {parts.map(([p, m], i) => {
            const c = PART_COLORS[i % PART_COLORS.length];
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="px-3 py-1.5 font-bold text-sm"
                  style={{
                    backgroundColor: c.color,
                    color: VF.white,
                  }}
                >
                  {p}
                </div>
                <div className="text-xs mt-1.5 font-medium" style={{ color: VF.textDim }}>
                  = {m}
                </div>
              </div>
            );
          })}
        </div>

        {/* 主單字 - 紀念碑式大寫字體 */}
        <div className="text-center mb-6 py-4" style={{ borderTop: `2px solid ${VF.black}`, borderBottom: `2px solid ${VF.black}` }}>
          <div className="text-5xl font-black tracking-tight uppercase" style={{ letterSpacing: '-0.02em' }}>
            {parts.map(([p], i) => {
              const c = PART_COLORS[i % PART_COLORS.length];
              return (
                <span key={i} style={{ color: c.color }}>{p}</span>
              );
            })}
          </div>
        </div>

        {/* 定義與口訣 - 極簡無裝飾 */}
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: VF.textMute }}>
            DEFINITION
          </div>
          <div className="text-lg font-bold mb-4" style={{ color: VF.text }}>{def}</div>

          <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: VF.textMute }}>
            MNEMONIC
          </div>
          <div className="text-sm" style={{ color: VF.textDim }}>「{mnemonic}」</div>
        </div>
      </div>
    </div>
  );
}

// ========== 難度篩選 ==========
function LevelFilter({ activeLevels, onToggle }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(LEVELS).map(([key, lv]) => {
        const active = activeLevels.has(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className="text-xs font-bold tracking-wider uppercase px-3 py-2 transition-all"
            style={
              active
                ? { backgroundColor: lv.color, color: lv.text }
                : { backgroundColor: VF.white, color: VF.textMute, border: `1px solid ${VF.borderHi}` }
            }
          >
            {lv.label}
          </button>
        );
      })}
    </div>
  );
}

// ========== 學習頁 ==========
function ExplorePage({ activeLevels, onStudy }) {
  const filteredRoots = useMemo(() => {
    return ROOTS_DATA.map(r => ({
      ...r,
      words: r.words.filter(w => activeLevels.has(w.level))
    })).filter(r => r.words.length > 0);
  }, [activeLevels]);

  const [selectedRoot, setSelectedRoot] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => { setSelectedRoot(0); setWordIdx(0); }, [activeLevels]);

  const root = filteredRoots[selectedRoot];
  const word = root?.words[wordIdx];

  useEffect(() => {
    if (word && root) onStudy(`${root.root}-${word.word}`, word.word);
  }, [selectedRoot, wordIdx, root, word]);

  if (filteredRoots.length === 0 || !root || !word) {
    return (
      <div className="rounded-lg p-8 text-center" style={{ backgroundColor: VF.surface, border: `1px solid ${VF.border}` }}>
        <Filter className="w-10 h-10 mx-auto mb-3" style={{ color: VF.textMute }} />
        <p style={{ color: VF.text }}>請至少選擇一個難度等級</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 字根選擇條 */}
      <div className="rounded-lg p-4" style={{ backgroundColor: VF.white, border: `1px solid ${VF.border}` }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.text }}>
            ROOTS · {filteredRoots.length}
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.textMute }}>
            {filteredRoots.reduce((s, r) => s + r.words.length, 0)} WORDS
          </span>
        </div>
        <div className="overflow-x-auto -mx-1">
          <div className="flex gap-1.5 px-1 pb-1">
            {filteredRoots.map((r, i) => {
              const active = i === selectedRoot;
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedRoot(i); setWordIdx(0); }}
                  className="shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                  style={
                    active
                      ? { backgroundColor: VF.red, color: VF.white }
                      : { backgroundColor: VF.surface, color: VF.text, border: `1px solid ${VF.border}` }
                  }
                >
                  {r.root}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 字根說明 - Vodafone 招牌紅色 chapter band */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: VF.red }}
      >
        <div className="px-6 py-5">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span
              className="text-4xl font-black tracking-tight uppercase"
              style={{
                color: VF.white,
                letterSpacing: '-0.02em',
              }}
            >
              {root.root}
            </span>
            <span className="text-lg font-medium" style={{ color: VF.white, opacity: 0.85 }}>
              = {root.meaning}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span style={{ color: VF.white, opacity: 0.75 }}>{root.origin}</span>
            <span
              className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
              style={{ backgroundColor: VF.white, color: VF.red }}
            >
              {root.category}
            </span>
          </div>
        </div>
      </div>

      {/* 例字切換 */}
      <div className="overflow-x-auto -mx-1">
        <div className="flex gap-1.5 px-1 pb-1">
          {root.words.map((w, i) => (
            <button
              key={i}
              onClick={() => setWordIdx(i)}
              className="shrink-0 py-2 px-3 text-xs font-bold transition-all"
              style={
                i === wordIdx
                  ? { backgroundColor: VF.black, color: VF.white }
                  : { backgroundColor: VF.white, color: VF.text, border: `1px solid ${VF.border}` }
              }
            >
              {w.word}
            </button>
          ))}
        </div>
      </div>

      <WordBreakdown {...word} />
    </div>
  );
}

// ========== 閃卡頁 ==========
function FlashcardPage({ srsData, updateSRS, activeLevels, dailyGoal }) {
  const allWords = useMemo(() => {
    const list = [];
    ROOTS_DATA.forEach(r => r.words.forEach(w => {
      if (activeLevels.has(w.level)) list.push({ ...w, rootInfo: r });
    }));
    return list;
  }, [activeLevels]);

  const queue = useMemo(() => {
    return [...allWords]
      .map(w => ({ ...w, srsLevel: srsData[w.word] ?? 0 }))
      .sort((a, b) => a.srsLevel - b.srsLevel)
      .slice(0, dailyGoal);
  }, [allWords, srsData, dailyGoal]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { setIdx(0); setFlipped(false); setDone(false); }, [activeLevels, dailyGoal]);

  const card = queue[idx];

  const handleResponse = (known) => {
    const currentLevel = srsData[card.word] ?? 0;
    const newLevel = known ? Math.min(currentLevel + 1, 5) : Math.max(currentLevel - 1, 0);
    updateSRS(card.word, newLevel);
    if (idx + 1 >= queue.length) setDone(true);
    else { setIdx(idx + 1); setFlipped(false); }
  };

  if (queue.length === 0) {
    return (
      <div className="rounded-lg p-8 text-center" style={{ backgroundColor: VF.surface, border: `1px solid ${VF.border}` }}>
        <Filter className="w-10 h-10 mx-auto mb-3" style={{ color: VF.textMute }} />
        <p style={{ color: VF.text }}>沒有可用單字</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-4" style={{ backgroundColor: VF.red }}>
          <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
            SESSION COMPLETE
          </div>
        </div>
        <div className="p-8 text-center bg-white">
          <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: VF.red }} />
          <div className="text-4xl font-black mb-2" style={{ color: VF.black }}>
            {queue.length}
          </div>
          <p className="text-sm mb-6" style={{ color: VF.textDim }}>cards reviewed today</p>
          <button
            onClick={() => { setIdx(0); setDone(false); setFlipped(false); }}
            className="px-8 py-3 font-bold tracking-widest text-xs uppercase"
            style={{ backgroundColor: VF.red, color: VF.white }}
          >
            START NEW ROUND
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;
  const lv = LEVELS[card.level];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider" style={{ color: VF.text }}>
          {String(idx + 1).padStart(2, '0')} <span style={{ color: VF.textMute }}>/ {String(queue.length).padStart(2, '0')}</span>
        </span>
        <div className="flex gap-1.5">
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
            style={{ backgroundColor: lv.color, color: lv.text }}
          >
            {lv.label}
          </span>
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
            style={{ backgroundColor: VF.surface, color: VF.text, border: `1px solid ${VF.border}` }}
          >
            LV.{card.srsLevel}
          </span>
        </div>
      </div>

      {/* 進度條 */}
      <div className="h-1 w-full" style={{ backgroundColor: VF.border }}>
        <div
          className="h-1 transition-all"
          style={{
            width: `${((idx + 1) / queue.length) * 100}%`,
            backgroundColor: VF.red,
          }}
        />
      </div>

      {/* 卡片 */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="rounded-lg overflow-hidden cursor-pointer transition-all"
        style={{
          backgroundColor: flipped ? VF.white : VF.red,
          border: `1px solid ${flipped ? VF.border : VF.red}`,
        }}
      >
        {!flipped ? (
          <div className="px-6 py-16 text-center">
            <div
              className="text-5xl font-black tracking-tight uppercase mb-6"
              style={{ color: VF.white, letterSpacing: '-0.02em' }}
            >
              {card.word}
            </div>
            <div
              className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1.5"
              style={{ backgroundColor: VF.white, color: VF.red }}
            >
              TAP TO REVEAL
            </div>
          </div>
        ) : (
          <WordBreakdown {...card} />
        )}
      </div>

      {flipped && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleResponse(false)}
            className="py-4 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2"
            style={{
              backgroundColor: VF.white,
              color: VF.black,
              border: `1px solid ${VF.black}`,
            }}
          >
            <X size={16} /> SKIP
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="py-4 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2"
            style={{ backgroundColor: VF.red, color: VF.white }}
          >
            <Check size={16} /> GOT IT
          </button>
        </div>
      )}
    </div>
  );
}

// ========== 測驗頁 ==========
function QuizPage({ onAnswer, activeLevels }) {
  const allWords = useMemo(() => {
    const list = [];
    ROOTS_DATA.forEach(r => r.words.forEach(w => {
      if (activeLevels.has(w.level)) list.push(w);
    }));
    return list;
  }, [activeLevels]);

  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const generateQuiz = () => {
    if (allWords.length < 4) return;
    const num = Math.min(10, allWords.length);
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, num);
    const qs = shuffled.map(correct => {
      const wrongs = allWords
        .filter(w => w.word !== correct.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [...wrongs.map(w => w.def), correct.def].sort(() => Math.random() - 0.5);
      return { word: correct, options, correctDef: correct.def };
    });
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  useEffect(() => { generateQuiz(); }, [activeLevels]);

  if (allWords.length < 4) {
    return (
      <div className="rounded-lg p-8 text-center" style={{ backgroundColor: VF.surface, border: `1px solid ${VF.border}` }}>
        <p style={{ color: VF.text }}>字數太少,請選更多難度</p>
      </div>
    );
  }

  if (questions.length === 0) return null;

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-4" style={{ backgroundColor: VF.red }}>
          <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
            FINAL SCORE
          </div>
        </div>
        <div className="p-8 text-center bg-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: VF.red }} />
          <div className="text-6xl font-black my-4" style={{ color: VF.black, letterSpacing: '-0.02em' }}>
            {score}<span style={{ color: VF.textMute }}>/{questions.length}</span>
          </div>
          <p className="text-sm uppercase tracking-widest font-bold mb-6" style={{ color: VF.textDim }}>
            {pct >= 80 ? 'EXCELLENT' : pct >= 60 ? 'KEEP GOING' : 'PRACTICE MORE'}
          </p>
          <button
            onClick={generateQuiz}
            className="px-8 py-3 font-bold tracking-widest text-xs uppercase"
            style={{ backgroundColor: VF.red, color: VF.white }}
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  const lv = LEVELS[q.word.level];

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === q.correctDef;
    if (correct) setScore(score + 1);
    onAnswer(q.word.word, correct);

    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setShowResult(true);
      else { setQIdx(qIdx + 1); setSelected(null); }
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider" style={{ color: VF.text }}>
          Q.{String(qIdx + 1).padStart(2, '0')} <span style={{ color: VF.textMute }}>/ {questions.length}</span>
        </span>
        <span className="text-xs font-bold" style={{ color: VF.red }}>
          ✓ {score}
        </span>
      </div>

      {/* 題目卡 - Vodafone 風格 */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-3 flex justify-between items-center" style={{ backgroundColor: VF.red }}>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
            DEFINE
          </span>
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
            style={{ backgroundColor: lv.color, color: lv.text }}
          >
            {lv.label}
          </span>
        </div>
        <div className="p-6 bg-white">
          <div
            className="text-4xl font-black text-center uppercase mb-3"
            style={{ color: VF.black, letterSpacing: '-0.02em' }}
          >
            {q.word.word}
          </div>
          <div className="text-xs text-center font-medium" style={{ color: VF.textDim }}>
            {q.word.parts.map(([p]) => p).join(' + ')}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.correctDef;
          let style = {
            backgroundColor: VF.white,
            borderColor: VF.border,
            color: VF.text,
          };
          if (selected !== null) {
            if (isCorrect) style = { backgroundColor: VF.red, borderColor: VF.red, color: VF.white };
            else if (isSelected) style = { backgroundColor: VF.black, borderColor: VF.black, color: VF.white };
            else style = { backgroundColor: VF.white, borderColor: VF.border, color: VF.textMute, opacity: 0.4 };
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className="w-full p-4 text-left font-bold transition-all flex items-center justify-between"
              style={{ ...style, border: `1px solid ${style.borderColor}` }}
            >
              <span>{opt}</span>
              {selected !== null && isCorrect && <Check size={16} />}
              {selected !== null && isSelected && !isCorrect && <X size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ========== 不熟字雲 ==========
function WordCloudView({ srsData, activeLevels }) {
  const wordList = useMemo(() => {
    const list = [];
    ROOTS_DATA.forEach(r => r.words.forEach(w => {
      if (!activeLevels.has(w.level)) return;
      const lvl = srsData[w.word] ?? 0;
      list.push({ ...w, srsLevel: lvl });
    }));
    return list.filter(w => w.srsLevel < 3).sort((a, b) => a.srsLevel - b.srsLevel).slice(0, 80);
  }, [srsData, activeLevels]);

  const getStyle = (lvl) => {
    if (lvl === 0) return { fontSize: '1.4rem', color: VF.red, fontWeight: 900 };
    if (lvl === 1) return { fontSize: '1.15rem', color: VF.black, fontWeight: 700 };
    return { fontSize: '0.95rem', color: VF.textDim, fontWeight: 500 };
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
      <div className="px-6 py-3 flex justify-between items-center" style={{ backgroundColor: VF.red }}>
        <div className="flex items-center gap-2">
          <Cloud size={14} style={{ color: VF.white }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
            WEAK ZONE
          </span>
        </div>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: VF.white, opacity: 0.85 }}>
          SIZE = WEAKNESS
        </span>
      </div>
      <div className="p-5 bg-white">
        {wordList.length === 0 ? (
          <div className="text-center py-6 text-sm font-bold tracking-widest uppercase" style={{ color: VF.textDim }}>
            ALL MASTERED ✓
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {wordList.map((w, i) => (
              <span
                key={i}
                className="inline-block px-1.5 py-0.5 transition-all"
                style={getStyle(w.srsLevel)}
                title={`${w.def} (Lv.${w.srsLevel})`}
              >
                {w.word}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-4 pt-3 text-[10px] font-bold tracking-widest uppercase" style={{ borderTop: `1px solid ${VF.border}` }}>
          <span className="flex items-center gap-1.5">
            <span style={{ color: VF.red }}>■</span>
            <span style={{ color: VF.textDim }}>CRITICAL</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: VF.black }}>■</span>
            <span style={{ color: VF.textDim }}>WEAK</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: VF.textDim }}>■</span>
            <span style={{ color: VF.textDim }}>REVIEW</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ========== 進度頁 ==========
function ProgressPage({ srsData, studiedSet, quizStats, streak, dailyGoal, setDailyGoal, activeLevels }) {
  const totalWords = useMemo(() =>
    ROOTS_DATA.reduce((s, r) => s + r.words.filter(w => activeLevels.has(w.level)).length, 0),
    [activeLevels]
  );
  const studiedCount = studiedSet.size;
  const masteredCount = Object.values(srsData).filter(l => l >= 3).length;

  const levelStats = useMemo(() => {
    const stats = {};
    Object.keys(LEVELS).forEach(k => { stats[k] = { total: 0, studied: 0, mastered: 0 }; });
    ROOTS_DATA.forEach(r => r.words.forEach(w => {
      stats[w.level].total++;
      const lvl = srsData[w.word] ?? -1;
      if (lvl >= 0) stats[w.level].studied++;
      if (lvl >= 3) stats[w.level].mastered++;
    }));
    return stats;
  }, [srsData]);

  return (
    <div className="space-y-4">
      {/* 主資料卡 - Vodafone 紅色 chapter band 開頭 */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-3 flex justify-between items-center" style={{ backgroundColor: VF.red }}>
          <div className="flex items-center gap-2">
            <Flame size={14} style={{ color: VF.white }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
              STREAK · {streak} DAY
            </span>
          </div>
        </div>
        <div className="p-5 bg-white">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: VF.textMute }}>
                STUDIED
              </div>
              <div className="text-3xl font-black" style={{ color: VF.red, letterSpacing: '-0.02em' }}>
                {studiedCount}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: VF.textMute }}>
                MASTERED
              </div>
              <div className="text-3xl font-black" style={{ color: VF.red, letterSpacing: '-0.02em' }}>
                {masteredCount}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: VF.textMute }}>
                TOTAL
              </div>
              <div className="text-3xl font-black" style={{ color: VF.black, letterSpacing: '-0.02em' }}>
                {totalWords}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 每日目標 */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-3 flex justify-between items-center" style={{ backgroundColor: VF.red }}>
          <div className="flex items-center gap-2">
            <Target size={14} style={{ color: VF.white }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
              DAILY TARGET
            </span>
          </div>
          <span className="text-2xl font-black" style={{ color: VF.white, letterSpacing: '-0.02em' }}>
            {dailyGoal}
          </span>
        </div>
        <div className="p-5 bg-white">
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: VF.red }}
          />
          <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mt-2" style={{ color: VF.textMute }}>
            <span>5</span><span>25</span><span>50</span>
          </div>
        </div>
      </div>

      {/* 各等級進度 */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-3" style={{ backgroundColor: VF.red }}>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
            LEVEL BREAKDOWN
          </span>
        </div>
        <div className="p-5 bg-white space-y-4">
          {Object.entries(LEVELS).map(([key, lv]) => {
            const s = levelStats[key];
            const pct = s.total > 0 ? (s.studied / s.total) * 100 : 0;
            const masteredPct = s.total > 0 ? (s.mastered / s.total) * 100 : 0;
            return (
              <div key={key}>
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-1.5">
                  <span style={{ color: lv.color }}>{lv.label}</span>
                  <span style={{ color: VF.textDim }}>
                    {s.mastered}<span style={{ color: VF.textMute }}>/</span>{s.studied}<span style={{ color: VF.textMute }}>/</span>{s.total}
                  </span>
                </div>
                <div className="w-full h-2 relative overflow-hidden" style={{ backgroundColor: VF.surface }}>
                  <div
                    className="h-2 absolute left-0 top-0"
                    style={{ width: `${pct}%`, backgroundColor: lv.color, opacity: 0.25 }}
                  />
                  <div
                    className="h-2 absolute left-0 top-0"
                    style={{ width: `${masteredPct}%`, backgroundColor: lv.color }}
                  />
                </div>
              </div>
            );
          })}
          <div className="text-[10px] font-bold tracking-widest uppercase pt-2" style={{ color: VF.textMute, borderTop: `1px solid ${VF.border}` }}>
            MASTERED / STUDIED / TOTAL
          </div>
        </div>
      </div>

      {/* 測驗統計 */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${VF.border}` }}>
        <div className="px-6 py-3" style={{ backgroundColor: VF.red }}>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: VF.white }}>
            QUIZ PERFORMANCE
          </span>
        </div>
        <div className="p-5 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: VF.textMute }}>
                CORRECT
              </div>
              <div className="text-2xl font-black" style={{ color: VF.red, letterSpacing: '-0.02em' }}>
                {quizStats.correct}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: VF.textMute }}>
                ACCURACY
              </div>
              <div className="text-2xl font-black" style={{ color: VF.red, letterSpacing: '-0.02em' }}>
                {quizStats.total > 0 ? Math.round((quizStats.correct / quizStats.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <WordCloudView srsData={srsData} activeLevels={activeLevels} />
    </div>
  );
}

// ========== 主 App ==========
export default function VocabApp() {
  const [tab, setTab] = useState('explore');
  const [srsData, setSrsData] = useState({});
  const [studiedSet, setStudiedSet] = useState(new Set());
  const [quizStats, setQuizStats] = useState({ correct: 0, total: 0 });
  const [streak] = useState(1);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [activeLevels, setActiveLevels] = useState(new Set(['JH', 'SH', 'GEPT-M', 'GEPT-MH']));
  const [showFilter, setShowFilter] = useState(false);

  const onStudy = (key, word) => {
    setStudiedSet(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setSrsData(prev => prev[word] === undefined ? { ...prev, [word]: 0 } : prev);
  };

  const updateSRS = (word, level) => {
    setSrsData(prev => ({ ...prev, [word]: level }));
  };

  const onQuizAnswer = (word, correct) => {
    setQuizStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
    if (correct) {
      const currentLevel = srsData[word] ?? 0;
      updateSRS(word, Math.min(currentLevel + 1, 5));
    } else {
      updateSRS(word, Math.max((srsData[word] ?? 0) - 1, 0));
    }
  };

  const toggleLevel = (key) => {
    setActiveLevels(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const tabs = [
    { id: 'explore', label: 'LEARN', icon: BookOpen },
    { id: 'flash', label: 'FLASH', icon: Layers },
    { id: 'quiz', label: 'QUIZ', icon: PenTool },
    { id: 'progress', label: 'STATS', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: VF.bg }}>
      {/* 頂部標題 - Vodafone speech mark icon 風格 */}
      <header className="px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            {/* Vodafone 招牌紅圈引號 icon */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: VF.red }}
            >
              <MessageCircle size={22} style={{ color: VF.white }} strokeWidth={2.5} fill={VF.red} />
            </div>
            <div>
              <h1
                className="text-2xl font-black tracking-tight uppercase"
                style={{ color: VF.black, letterSpacing: '-0.02em' }}
              >
                ROOT<span style={{ color: VF.red }}>·</span>DICT
              </h1>
              <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: VF.textMute }}>
                Etymology Driven Learning
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-2.5 transition-all"
            style={
              showFilter
                ? { backgroundColor: VF.red, color: VF.white }
                : { backgroundColor: VF.white, color: VF.text, border: `1px solid ${VF.borderHi}` }
            }
          >
            <Filter size={16} />
          </button>
        </div>

        {showFilter && (
          <div className="mt-4 p-4" style={{ backgroundColor: VF.surface, border: `1px solid ${VF.border}` }}>
            <div className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: VF.text }}>
              DIFFICULTY FILTER
            </div>
            <LevelFilter activeLevels={activeLevels} onToggle={toggleLevel} />
          </div>
        )}
      </header>

      <main className="px-4">
        {tab === 'explore' && <ExplorePage activeLevels={activeLevels} onStudy={onStudy} />}
        {tab === 'flash' && <FlashcardPage srsData={srsData} updateSRS={updateSRS} activeLevels={activeLevels} dailyGoal={dailyGoal} />}
        {tab === 'quiz' && <QuizPage onAnswer={onQuizAnswer} activeLevels={activeLevels} />}
        {tab === 'progress' && (
          <ProgressPage
            srsData={srsData}
            studiedSet={studiedSet}
            quizStats={quizStats}
            streak={streak}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            activeLevels={activeLevels}
          />
        )}
      </main>

      {/* 底部 Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0"
        style={{
          backgroundColor: VF.white,
          borderTop: `1px solid ${VF.border}`,
        }}
      >
        <div className="grid grid-cols-4 max-w-md mx-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex flex-col items-center py-3 transition-all relative"
                style={{ color: active ? VF.red : VF.textMute }}
              >
                {active && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5"
                    style={{ backgroundColor: VF.red }}
                  />
                )}
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-bold tracking-widest uppercase mt-1">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
