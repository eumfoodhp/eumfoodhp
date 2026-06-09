-- ============================================================
-- 중문(ZH) 콘텐츠 마이그레이션
--   1) notices / press_releases / history_entries 에 *_zh 컬럼 추가
--   2) 기존 내용(연혁 2009~2025 + 공지/보도 테스트)의 중문 번역 채우기
--
-- 사용법: Supabase → SQL Editor 에 붙여넣고 1회 실행.
--   - ADD COLUMN IF NOT EXISTS / 매칭 UPDATE 라서 재실행해도 안전.
--   - 연혁은 (연도 + 한글 제목) 으로 매칭. 제목이 안 맞으면 그 항목만 건너뜀(한글 유지).
--   - 브랜드명 중문은 통용 표기 기준 — 필요시 자유롭게 수정.
-- ============================================================

-- ── 1) ZH 컬럼 추가 ───────────────────────────────────────
ALTER TABLE public.history_entries ADD COLUMN IF NOT EXISTS title_zh TEXT, ADD COLUMN IF NOT EXISTS description_zh TEXT;
ALTER TABLE public.notices         ADD COLUMN IF NOT EXISTS title_zh TEXT, ADD COLUMN IF NOT EXISTS content_zh TEXT;
ALTER TABLE public.press_releases  ADD COLUMN IF NOT EXISTS title_zh TEXT, ADD COLUMN IF NOT EXISTS content_zh TEXT;

-- ── 2) 연혁 번역 (연도 + 한글 제목 매칭) ──────────────────

-- 2025
UPDATE public.history_entries SET title_zh = 'Mom''s Touch 酱料供货'                         WHERE year = 2025 AND title = '맘스터치 소스 납품';
UPDATE public.history_entries SET title_zh = 'Welstory 酱料供货'                             WHERE year = 2025 AND title = '웰스토리 소스 납품';
UPDATE public.history_entries SET title_zh = '李在模披萨 酱料供货'                            WHERE year = 2025 AND title = '이재모피자 소스 납품';
UPDATE public.history_entries SET title_zh = 'GS购物频道品牌"宫厨房"酱料销售'                  WHERE year = 2025 AND title = 'GS홈쇼핑 브랜드 ''궁키친'' 소스 판매';

-- 2024
UPDATE public.history_entries SET title_zh = '签订 CJ Freshway 自有品牌(PB)合约'            WHERE year = 2024 AND title = 'CJ 프레시웨이 PB 체결';
UPDATE public.history_entries SET title_zh = '荣获三星 Welstory 优秀合作伙伴感谢牌'          WHERE year = 2024 AND title = '삼성웰스토리 우수 협력사 감사패 수상';
UPDATE public.history_entries SET title_zh = 'The Taco Bouth 酱料类供货'                     WHERE year = 2024 AND title = '더타코부스 소스류 납품';
UPDATE public.history_entries SET title_zh = '开设自营智能商店"以音食品市场(EumFood Market)"' WHERE year = 2024 AND title = '자사 스마트스토어 ''이음푸드마켓'' 오픈';

-- 2023
UPDATE public.history_entries SET title_zh = '新设并扩建黄瓜泡菜生产线'                      WHERE year = 2023 AND title = '오이피클라인 신설 및 증축';
UPDATE public.history_entries SET title_zh = '向 Pizza Alvolo、Outback、7番街披萨、李在模披萨供应黄瓜泡菜' WHERE year = 2023 AND title = '알볼로피자, 아웃백스테이크하우스, 7번가피자, 이재모피자 오이피클 납품';

-- 2022
UPDATE public.history_entries SET title_zh = '乌山细桥综合社会福利馆感谢牌'                  WHERE year = 2022 AND title = '오산세교종합사회복지관 감사패';
UPDATE public.history_entries SET title_zh = '向 Pizza Eataly、披萨파는집供应酱料类'         WHERE year = 2022 AND title = '피자이탈리, 피자파는집 소스류 납품';

-- 2021
UPDATE public.history_entries SET title_zh = '推出方便菜套装 Coupang 自有品牌(PB)产品'      WHERE year = 2021 AND title = '간편조리세트 쿠팡 PB 제품 런칭';
UPDATE public.history_entries SET title_zh = '向 Shabu Mania、汉阳烤肉店供应酱料类'          WHERE year = 2021 AND title = '샤브마니아, 한양고깃집 소스류 납품';
UPDATE public.history_entries SET title_zh = '《食品Journal》7月刊介绍"小菜专业企业(株)以音食品系统"' WHERE year = 2021 AND title = '식품저널 7월호 발간 ''반찬 전문업체 (주)이음푸드시스템'' 소개';

-- 2020
UPDATE public.history_entries SET title_zh = '扩建第二工厂 (株)以音食品系统 B栋'             WHERE year = 2020 AND title = '제2공장 증축 (주)이음푸드시스템 나동';
UPDATE public.history_entries SET title_zh = '新设方便菜套装(meal kit)、酱料类、液态茶、混合酱生产线' WHERE year = 2020 AND title = '간편조리세트(밀키트), 소스류, 액상차, 혼합장 라인 신설';
UPDATE public.history_entries SET title_zh = '酱料类、液态茶、混合酱 小规模 HACCP 认证'      WHERE year = 2020 AND title = '소스류, 액상차, 혼합장 소규모 HACCP 인증';
UPDATE public.history_entries SET title_zh = '签订 Coupang(小菜类)OEM 合约'                WHERE year = 2020 AND title = '쿠팡(반찬류) OEM 체결';
UPDATE public.history_entries SET title_zh = '入选 2020 年龙仁市优秀企业'                    WHERE year = 2020 AND title = '2020년 용인시 우수기업 선정';

-- 2019
UPDATE public.history_entries SET title_zh = '与中国合作伙伴"科尔利食品"签订谅解备忘录(MOU)' WHERE year = 2019 AND title = '중국파트너사 ''커얼리식품'' MOU 체결';

-- 2018
UPDATE public.history_entries SET title_zh = '签订 CJ Freshway 合约'                        WHERE year = 2018 AND title = 'CJ프레시웨이 계약 체결';
UPDATE public.history_entries SET title_zh = '调味鱼酱、鱼酱类 HACCP 认证'                   WHERE year = 2018 AND title = '양념젓갈, 젓갈류 HACCP 인증';
UPDATE public.history_entries SET title_zh = '与中国合作伙伴"会明食品"签订谅解备忘录(MOU)'   WHERE year = 2018 AND title = '중국파트너사 ''회명식품'' MOU 체결';
UPDATE public.history_entries SET title_zh = '与中国合作伙伴"俊味食品"签订谅解备忘录(MOU)'   WHERE year = 2018 AND title = '중국파트너사 ''준웨이식품'' MOU 체결';

-- 2017
UPDATE public.history_entries SET title_zh = 'CJ O Shopping 及新世界电视购物播出销售'        WHERE year = 2017 AND title = 'CJ 오쇼핑 및 신세계 TV 홈쇼핑 방영 판매';
UPDATE public.history_entries SET title_zh = '乐天玛特 HMR 小菜类 20 种入驻'                 WHERE year = 2017 AND title = '롯데마트 HMR 반찬류 20종 입점';
UPDATE public.history_entries SET title_zh = '荣获韩华酒店及度假村功劳牌'                    WHERE year = 2017 AND title = '한화호텔 및 리조트 공로패 수상';

-- 2016
UPDATE public.history_entries SET title_zh = '完成第二工厂用地购置'                          WHERE year = 2016 AND title = '제2공장 부지 매입 완료';
UPDATE public.history_entries SET title_zh = '签订 BGF Retail(CU便利店)炖海鲜供货合约'      WHERE year = 2016 AND title = 'BGF리테일(CU편의점) 수산물조림 납품 계약';
UPDATE public.history_entries SET title_zh = '龙仁市长表彰(残疾人福利发展领域)'              WHERE year = 2016 AND title = '용인시장표창 (장애인복지발전분야)';

-- 2015
UPDATE public.history_entries SET title_zh = '签订(株)乐天食品合约'                          WHERE year = 2015 AND title = '(주)롯데푸드 계약 체결';
UPDATE public.history_entries SET title_zh = '签订 Pulmuone(株)OEM 合约'                    WHERE year = 2015 AND title = '풀무원(주) OEM 체결';

-- 2014
UPDATE public.history_entries SET title_zh = '签订海军司令部合约(镇海)'                      WHERE year = 2014 AND title = '해군사령부 계약 (진해)';
UPDATE public.history_entries SET title_zh = '签订 Our Home 合约'                           WHERE year = 2014 AND title = '아워홈 계약 체결';
UPDATE public.history_entries SET title_zh = '签订 SPC 合约'                                WHERE year = 2014 AND title = 'SPC 계약 체결';
UPDATE public.history_entries SET title_zh = '签订韩华酒店&度假村合约'                       WHERE year = 2014 AND title = '한화호텔&리조트 계약 체결';
UPDATE public.history_entries SET title_zh = '向 Misoya 供应小菜'                           WHERE year = 2014 AND title = '미소야 반찬 납품';
UPDATE public.history_entries SET title_zh = '推进三星 Welstory 自有品牌(PB)(大酱拌菜类)'   WHERE year = 2014 AND title = '삼성웰스토리 PB 진행 (된장 무침류)';

-- 2013
UPDATE public.history_entries SET title_zh = '迁至现工厂(2013.5.5)'                         WHERE year = 2013 AND title = '현 공장 이전 (2013.5.5)';
UPDATE public.history_entries SET title_zh = '签订东远 Home Food 合约'                       WHERE year = 2013 AND title = '동원홈푸드 계약 체결';
UPDATE public.history_entries SET title_zh = '炖海鲜、炖农产品 HACCP 认证'                   WHERE year = 2013 AND title = '수산물조림, 농산물조림 HACCP 인증';

-- 2012
UPDATE public.history_entries SET title_zh = '签订(株)Foodmerce OEM 合约'                   WHERE year = 2012 AND title = '(주)푸드머스 OEM 체결';
UPDATE public.history_entries SET title_zh = '线上(Gmarket、Auction、11街)销售'             WHERE year = 2012 AND title = '온라인(G마켓, 옥션, 11번가) 판매';

-- 2011
UPDATE public.history_entries SET title_zh = '签订(株)新世界食品合约'                        WHERE year = 2011 AND title = '(주)신세계푸드 계약 체결';
UPDATE public.history_entries SET title_zh = '签订(株)现代 Green Food 合约'                  WHERE year = 2011 AND title = '(주)현대그린푸드 계약 체결';
UPDATE public.history_entries SET title_zh = '获得韩国国内第二个腌制食品 HACCP 认证'         WHERE year = 2011 AND title = '국내 2번째로 절임식품 HACCP 인증';

-- 2010
UPDATE public.history_entries SET title_zh = '签订三星 Welstory 合约'                        WHERE year = 2010 AND title = '삼성웰스토리 계약 체결';
UPDATE public.history_entries SET title_zh = 'ISO22000 认证'                                WHERE year = 2010 AND title = 'ISO22000 인증';
UPDATE public.history_entries SET title_zh = 'CLEAN 工作场所认证'                            WHERE year = 2010 AND title = 'CLEAN 사업장 인증';

-- 2009
UPDATE public.history_entries SET title_zh = '(株)以音食品系统成立'                          WHERE year = 2009 AND title = '(주)이음푸드시스템 설립';
UPDATE public.history_entries SET title_zh = '开始食材流通业务'                              WHERE year = 2009 AND title = '식자재 유통사업 시작';
UPDATE public.history_entries SET title_zh = '黄万植代表理事就任'                            WHERE year = 2009 AND title = '황만식 대표이사 취임';

-- ── 3) 공지/보도 (현재 테스트 데이터 — 제목만 번역) ────────
UPDATE public.notices        SET title_zh = '顶部置顶公告测试' WHERE title = '상단 고정 공지사항 테스트';
UPDATE public.notices        SET title_zh = '未置顶公告'       WHERE title = '미고정 공지사항';
UPDATE public.press_releases SET title_zh = 'AVING News 测试'  WHERE title = '에이빙뉴스 테스트';
UPDATE public.press_releases SET title_zh = '国际新闻测试'     WHERE title = '국제뉴스 테스트';
