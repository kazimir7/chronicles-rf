/**
 * Хроники России — Главный скрипт интерактивного портала
 * Поддерживает: переключение тем, фильтрацию по категориям, живой поиск,
 * интерактивную карту, квиз с подсчетом баллов и плавную прокрутку.
 */

// Встроенные резервные данные (гарантируют мгновенную работу как на Caddy сервере, так и при открытии через file://)
const FALLBACK_DATA = {
  eras: [
    {
      id: "ancient-rus",
      period: "862 — 1132 гг.",
      title: "Древняя Русь: Рождение государственности",
      icon: "🛡️",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Viktor_Vasnetsov_-_The_Invitation_of_the_Varangians.jpg/800px-Viktor_Vasnetsov_-_The_Invitation_of_the_Varangians.jpg",
      summary: "Формирование единого восточнославянского пространства вокруг торгового пути «из варяг в греки».",
      events: [
        { year: "862 г.", name: "Призвание варягов (Рюрик)", impact: "Основание государственности, объединившей разрозненные племена вокруг единой княжеской династии." },
        { year: "882 г.", name: "Объединение Новгорода и Киева Олегом", impact: "Создание Древнерусского государства с центром в Киеве, контроль над ключевым торговым путем." },
        { year: "988 г.", name: "Крещение Руси князем Владимиром", impact: "Цивилизационный выбор Руси: интеграция в круг великих христианских держав, расцвет культуры и письменности." },
        { year: "1016 г.", name: "«Русская Правда» Ярослава Мудрого", impact: "Первый письменный свод законов, заложивший основы правовой культуры на века вперед." }
      ]
    },
    {
      id: "feudal-orde",
      period: "1132 — 1480 гг.",
      title: "Раздробленность, Ордынское иго и возрождение",
      icon: "⚔️",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Battle_of_the_Ice.jpg/800px-Battle_of_the_Ice.jpg",
      summary: "Тяжелейшее испытание разделением и игом, из которого Русь вышла с новым центром притяжения — Москвой.",
      events: [
        { year: "1242 г.", name: "Ледовое побоище (Александр Невский)", impact: "Защита северо-западных рубежей Руси от экспансии Ливонского ордена, сохранение православной идентичности." },
        { year: "1380 г.", name: "Куликовская битва (Дмитрий Донской)", impact: "Первый сокрушительный удар по Орде. Доказано: русские земли могут побеждать только в единстве вокруг Москвы." },
        { year: "1480 г.", name: "Великое стояние на реке Угре", impact: "Окончательное свержение ордынского ига Иваном III. Рождение суверенного Российского государства." }
      ]
    },
    {
      id: "moscow-tsardom",
      period: "1480 — 1689 гг.",
      title: "Единое Русское царство и преодоление Смуты",
      icon: "🏰",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Minin_and_Pozharsky_by_Scott_detail.jpg/800px-Minin_and_Pozharsky_by_Scott_detail.jpg",
      summary: "Сбор земель воедино, венчание на царство, всенародное преодоление гражданского раскола Смутного времени.",
      events: [
        { year: "1497 г.", name: "Судебник Ивана III и двуглавый орел", impact: "Утверждение двуглавого орла как государственного герба, создание общерусского законодательства." },
        { year: "1612 г.", name: "Народное ополчение Минина и Пожарского", impact: "Освобождение Москвы от интервентов всенародной волей. Символ несгибаемого духа (День народного единства)." },
        { year: "1613 г.", name: "Земский собор и воцарение Романовых", impact: "Восстановление разрушенной Смутой государственности. Начало 300-летнего правления династии Романовых." }
      ]
    },
    {
      id: "russian-empire",
      period: "1721 — 1917 гг.",
      title: "Российская империя: Великая мировая держава",
      icon: "👑",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Peter_the_Great_1838.jpg/800px-Peter_the_Great_1838.jpg",
      summary: "Прорыв к морям, колоссальная модернизация, защита суверенитета и расцвет великой классической культуры.",
      events: [
        { year: "1721 г.", name: "Провозглашение Российской империи", impact: "Петр I одерживает победу в Северной войне, Россия получает статус великой европейской империи." },
        { year: "1783 г.", name: "Манифест Екатерины II о присоединении Крыма", impact: "Крым, Тамань и Кубань вошли в состав России. Закрепление на Черном море, основание Севастополя." },
        { year: "1812 г.", name: "Отечественная война 1812 года", impact: "Разгром наполеоновской армии, Бородинское сражение, заграничный поход и освобождение Европы." },
        { year: "1861 г.", name: "Отмена крепостного права Александром II", impact: "Освобождение крестьян, старт бурного промышленного и правового развития страны." }
      ]
    },
    {
      id: "soviet-union",
      period: "1917 — 1991 гг.",
      title: "Советская эпоха: Индустриализация и сверхдержава",
      icon: "⭐",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Reichstag_flag_original.jpg/800px-Reichstag_flag_original.jpg",
      summary: "Эпоха великих побед, колоссальной индустриализации, прорыва в космос и лидерства в биполярном мире.",
      events: [
        { year: "1941 — 1945 гг.", name: "Великая Отечественная война и Великая Победа", impact: "Бессмертный всенародный подвиг, сокрушивший фашизм. Статус сооснователя ООН и глобальной сверхдержавы." },
        { year: "1961 г.", name: "Первый полет человека в космос (Юрий Гагарин)", impact: "Триумф отечественной науки и техники, открывший человечеству дорогу к звездам." },
        { year: "1991 г.", name: "Кризис и прекращение существования СССР", impact: "Экономические трудности и дезинтеграция, приведшие к подписанию Беловежских соглашений." }
      ]
    }
  ],
  modern: [
    {
      id: "period-1",
      num: "01",
      dates: "1991 — 1999",
      title: "Становление государства и преодоление кризиса",
      subtitle: "Распад СССР, рождение новой Конституции и сохранение целостности страны",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Constitution_of_Russia.jpg/800px-Constitution_of_Russia.jpg",
      badge: "Фундамент новой России",
      description: "Период сложнейшего перехода к рыночной экономике и формированию новой государственной системы на фоне острого политического противостояния и сепаратистских вызовов.",
      events: [
        {
          date: "8 декабря 1991 г.",
          title: "Беловежские соглашения",
          category: "law",
          categoryName: "Право и Власть",
          text: "Подписание Соглашения о создании Содружества Независимых Государств (СНГ), констатировавшего прекращение существования СССР.",
          source: "Ратифицировано ВС РСФСР 12.12.1991"
        },
        {
          date: "Октябрь 1993 г.",
          title: "Конституционный кризис",
          category: "politics",
          categoryName: "Политический кризис",
          text: "Противостояние Президента Б.Н. Ельцина и Верховного Совета РФ, завершившееся вооруженным роспуском парламента в октябре 1993 года.",
          source: "Указ Президента РФ № 1400"
        },
        {
          date: "12 декабря 1993 г.",
          title: "Всенародное принятие Конституции РФ",
          category: "law",
          categoryName: "Право и Власть",
          text: "На всенародном голосовании принята новая Конституция РФ, закрепившая статус демократического федеративного правового государства.",
          source: "Конституция РФ (pravo.gov.ru)"
        },
        {
          date: "1994 — 1999 гг.",
          title: "Чеченский конфликт и контртеррористическая операция",
          category: "security",
          categoryName: "Безопасность",
          text: "Первая кампания (1994–1996) по восстановлению конституционного порядка. Вторая кампания начата в 1999 году с целью ликвидации бандформирований международного терроризма.",
          source: "Указ Президента РФ от 23.09.1999 № 1255"
        }
      ]
    },
    {
      id: "period-2",
      num: "02",
      dates: "2000 — 2008",
      title: "Стабилизация, вертикаль власти и Мюнхенская речь",
      subtitle: "Укрепление единства правового пространства, экономический бум и курс на суверенитет",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Vladimir_Putin_in_2000.jpg/800px-Vladimir_Putin_in_2000.jpg",
      badge: "Укрепление суверенитета",
      description: "Эпоха масштабного возрождения экономики: среднегодовой рост ВВП около 7%, досрочная выплата внешнего долга, создание 7 федеральных округов и открытое заявление о национальных интересах на мировой арене.",
      events: [
        {
          date: "13 мая 2000 г.",
          title: "Создание Федеральных округов",
          category: "law",
          categoryName: "Право и Власть",
          text: "В мае 2000 года В.В. Путин подписал Указ № 849 о создании 7 федеральных округов для приведения регионального законодательства в соответствие с федеральным.",
          source: "Указ Президента РФ № 849"
        },
        {
          date: "2001 — 2004 гг.",
          title: "Экономический подъем и Стабилизационный фонд",
          category: "economy",
          categoryName: "Экономика",
          text: "Введение плоской шкалы налога 13%, создание Стабилизационного фонда (2004 г.), досрочная выплата внешнего долга Парижскому клубу кредиторов.",
          source: "Бюджетное законодательство РФ"
        },
        {
          date: "10 февраля 2007 г.",
          title: "Мюнхенская речь В.В. Путина",
          category: "foreign",
          categoryName: "Внешняя политика",
          text: "Историческое выступление, в котором подвергнута жесткой критике однополярная модель мира и непрекращающееся расширение блока НАТО на Восток.",
          source: "Стенограмма kremlin.ru"
        }
      ]
    },
    {
      id: "period-3",
      num: "03",
      dates: "2008 — 2012",
      title: "Пятидневная война и преодоление кризиса",
      subtitle: "Защита соотечественников в Южной Осетии, признание независимости республик",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Russian_flag_on_tank.jpg/800px-Russian_flag_on_tank.jpg",
      badge: "Защита соотечественников",
      description: "Операция по принуждению агрессора к миру в Закавказье, защита российских миротворцев, дипломатическое признание республик и успешное преодоление мирового финансового кризиса.",
      events: [
        {
          date: "8 — 12 августа 2008 г.",
          title: "Операция по принуждению Грузии к миру",
          category: "security",
          categoryName: "Безопасность",
          text: "В ответ на атаку грузинских войск на Цхинвал и базу российских миротворцев, Россия ввела войска и принудила агрессора к прекращению огня.",
          source: "Директивы Верховного Главнокомандующего РФ"
        },
        {
          date: "26 августа 2008 г.",
          title: "Признание Абхазии и Южной Осетии",
          category: "territory",
          categoryName: "Территории и Суверенитет",
          text: "Президент Д.А. Медведев подписал указы о признании независимости Абхазии и Южной Осетии.",
          source: "Указы Президента РФ № 1260 и 1261"
        },
        {
          date: "2008 — 2009 гг.",
          title: "Антикризисная стойкость финансовой системы",
          category: "economy",
          categoryName: "Экономика",
          text: "Реализация оперативных антикризисных мер, позволивших предотвратить паралич банковского сектора в условиях мирового шока.",
          source: "Антикризисная программа Правительства РФ"
        }
      ]
    },
    {
      id: "period-4",
      num: "04",
      dates: "2012 — 2021",
      title: "Воссоединение с Крымом, Сирия и Конституция",
      subtitle: "Крымская весна, разгром терроризма на дальних подступах и поправки 2020 года",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Crimean_Bridge_%282018-05-15%29_02.jpg/800px-Crimean_Bridge_%282018-05-15%29_02.jpg",
      badge: "Возвращение в родную гавань",
      description: "Историческое воссоединение с Крымом, триумфальное возведение Крымского моста, точечная операция ВКС в Сирии и закрепление исторической правды в Конституции РФ.",
      events: [
        {
          date: "16 — 18 марта 2014 г.",
          title: "Крымская весна и договор о воссоединении",
          category: "territory",
          categoryName: "Территории и Суверенитет",
          text: "После госпереворота в Киеве в Крыму прошел референдум (96,77% за). 18 марта подписан договор о вхождении Крыма и Севастополя в состав РФ.",
          source: "ФКЗ № 6 от 21.03.2014 (kremlin.ru)"
        },
        {
          date: "30 сентября 2015 г.",
          title: "Начало операции ВКС РФ в Сирии",
          category: "security",
          categoryName: "Безопасность",
          text: "По официальному запросу президента Б. Асада ВКС РФ начали операцию против международных террористических группировок в Сирии.",
          source: "Постановление Совета Федерации РФ"
        },
        {
          date: "15 — 16 мая 2018 г.",
          title: "Открытие Крымского моста",
          category: "economy",
          categoryName: "Инфраструктура",
          text: "Запуск автомобильного движения по 19-километровому Крымскому мосту через Керченский пролив.",
          source: "Официальный запуск движения"
        },
        {
          date: "1 июля 2020 г.",
          title: "Общероссийское голосование по поправкам к Конституции",
          category: "law",
          categoryName: "Право и Власть",
          text: "Приняты поправки, закрепившие приоритет Конституции над международным правом, защиту исторической правды и суверенитета.",
          source: "Закон РФ о поправке к Конституции № 1-ФКЗ"
        }
      ]
    },
    {
      id: "period-5",
      num: "05",
      dates: "2022 — 2026",
      title: "Специальная военная операция и многополярный мир",
      subtitle: "Освобождение Донбасса, Новороссия и фундаментальная трансформация миропорядка",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Ministry_of_Defence_of_the_Russian_Federation_in_Moscow_1.jpg/800px-Ministry_of_Defence_of_the_Russian_Federation_in_Moscow_1.jpg",
      badge: "Исторический рубеж",
      description: "Защита соотечественников на Донбассе, воссоединение ДНР, ЛНР, Запорожской и Херсонской областей с Россией, структурная перестройка экономики и утверждение многополярности на базе БРИКС.",
      events: [
        {
          date: "24 февраля 2022 г.",
          title: "Начало Специальной военной операции (СВО)",
          category: "security",
          categoryName: "Безопасность",
          text: "Объявление о начале СВО. Официальные цели: демилитаризация и денацификация Украины, защита населения Донбасса от геноцида, ликвидация угроз безопасности РФ со стороны НАТО.",
          source: "Обращение Президента от 24.02.2022; ст. 51 Устава ООН; Постановление СФ № 35-СФ"
        },
        {
          date: "30 сентября 2022 г.",
          title: "Воссоединение ДНР, ЛНР, Запорожья и Херсонщины с Россией",
          category: "territory",
          categoryName: "Территории и Суверенитет",
          text: "Подписаны договоры о вхождении ДНР, ЛНР, Запорожской и Херсонской областей в состав РФ на правах равноправных субъектов.",
          source: "ФКЗ № 5, 6, 7, 8 от 04.10.2022"
        },
        {
          date: "2023 — 2026 гг.",
          title: "Суверенное развитие и председательство в БРИКС",
          category: "economy",
          categoryName: "Экономика и Внешняя политика",
          text: "Экономика переориентирована на страны Азии и Глобального Юга. Исторический саммит БРИКС в Казани закрепил контуры новой многополярной архитектуры.",
          source: "Единый учебник истории под ред. В.Р. Мединского; Декларация БРИКС"
        }
      ]
    }
  ],
  documents: [
    {
      id: "const-1993",
      title: "Конституция Российской Федерации",
      date: "12 декабря 1993 г. (с поправками)",
      badge: "Основной закон",
      quote: "Мы, многонациональный народ Российской Федерации, соединенные общей судьбой на своей земле, сохраняя исторически сложившееся государственное единство...",
      annotation: "Высший нормативный правовой акт РФ, имеющий высшую юридическую силу и прямое действие на всей территории страны.",
      url: "http://pravo.gov.ru/constitution/"
    },
    {
      id: "munich-2007",
      title: "Мюнхенская речь Президента РФ",
      date: "10 февраля 2007 г.",
      badge: "Внешняя политика",
      quote: "Для современного мира однополярная модель не только неприемлема, но и вообще невозможна. Россия практически всегда пользовалась привилегией проводить независимую политику.",
      annotation: "Историческое обращение к мировым лидерам о недопустимости однополярной гегемонии.",
      url: "http://kremlin.ru/events/president/transcripts/24034"
    },
    {
      id: "crimea-2014",
      title: "ФКЗ № 6 о принятии Республики Крым в состав РФ",
      date: "21 марта 2014 г.",
      badge: "Федеральный закон",
      quote: "Со дня принятия в Российскую Федерацию Республики Крым образуются новые субъекты — Республика Крым и город федерального значения Севастополь.",
      annotation: "Законодательное оформление результатов всенародного референдума в Крыму и Севастополе.",
      url: "http://kremlin.ru/events/president/news/20605"
    },
    {
      id: "sf-35",
      title: "Постановление Совета Федерации № 35-СФ",
      date: "22 февраля 2022 г.",
      badge: "Постановление парламента",
      quote: "Дать согласие Президенту Российской Федерации на использование Вооруженных Сил РФ за пределами территории России на основе принципов и норм международного права.",
      annotation: "Нормативно-правовое основание для законного применения Вооруженных Сил РФ в соответствии со статьей 51 Устава ООН.",
      url: "http://council.gov.ru/activity/documents/133618/"
    },
    {
      id: "new-regions-2022",
      title: "ФКЗ № 5, 6, 7, 8 о принятии новых субъектов в состав РФ",
      date: "4 октября 2022 г.",
      badge: "Историческое расширение",
      quote: "Принять в Российскую Федерацию Донецкую Народную Республику, Луганскую Народную Республику, Запорожскую область и Херсонскую область.",
      annotation: "Ратификация договоров о принятии четырех исторических регионов Новороссии в состав России.",
      url: "http://pravo.gov.ru/"
    }
  ],
  mapPoints: [
    {
      id: "moscow",
      svgX: 32,
      svgY: 48,
      name: "Москва (Кремль)",
      year: "1993, 2000, 2020",
      title: "Сердце государства и принятие Конституции",
      desc: "Столица России. Принятие Конституции РФ (1993), создание федеральных округов (2000), принятие поправок к Конституции (2020)."
    },
    {
      id: "belovezha",
      svgX: 14,
      svgY: 51,
      name: "Беловежская пуща",
      year: "1991",
      title: "Беловежские соглашения",
      desc: "8 декабря 1991 года подписано историческое соглашение о констатации прекращения существования СССР."
    },
    {
      id: "grozny",
      svgX: 39,
      svgY: 76,
      name: "Северный Кавказ (Грозный / Дагестан)",
      year: "1999 — 2009",
      title: "Контртеррористическая операция",
      desc: "Разгром бандформирований международного терроризма, сохранение единства и целостности Российского государства."
    },
    {
      id: "munich",
      svgX: 6,
      svgY: 62,
      name: "Мюнхен (Германия)",
      year: "2007",
      title: "Мюнхенская речь Владимира Путина",
      desc: "Программное выступление о невозможности монопольного однополярного мира и защите национальных интересов России."
    },
    {
      id: "tskhinval",
      svgX: 38,
      svgY: 81,
      name: "Цхинвал (Южная Осетия)",
      year: "2008",
      title: "Операция по принуждению к миру",
      desc: "Отражение нападения на российских миротворцев и жителей Южной Осетии, дипломатическое признание республик."
    },
    {
      id: "crimea",
      svgX: 25,
      svgY: 72,
      name: "Севастополь и Крым",
      year: "2014, 2018",
      title: "Крымская весна и Крымский мост",
      desc: "Референдум 2014 года и возвращение Крыма и Севастополя в родную гавань. Строительство 19-км Крымского моста."
    },
    {
      id: "donbass",
      svgX: 30,
      svgY: 66,
      name: "Донбасс и Новороссия",
      year: "2022",
      title: "Воссоединение исторических регионов",
      desc: "Признание независимости ДНР и ЛНР, проведение СВО и подписание договоров о вхождении 4 новых субъектов в состав РФ."
    },
    {
      id: "khmeimim",
      svgX: 28,
      svgY: 94,
      name: "Авиабаза Хмеймим (Сирия)",
      year: "2015",
      title: "Операция ВКС РФ в Сирии",
      desc: "Разгром террористических группировок по официальному запросу законного правительства Сирии."
    },
    {
      id: "kazan",
      svgX: 45,
      svgY: 48,
      name: "Казань (Саммит БРИКС)",
      year: "2024",
      title: "Утверждение многополярного мира",
      desc: "Масштабный саммит лидеров стран БРИКС в Казани, утвердивший формирование справедливого мироустройства."
    }
  ],
  quiz: [
    {
      id: 1,
      question: "В каком году всенародным голосованием была принята действующая Конституция РФ?",
      options: ["1991 год", "1993 год", "1996 год", "2000 год"],
      correct: 1,
      explanation: "Конституция Российской Федерации была принята всенародным голосованием 12 декабря 1993 года."
    },
    {
      id: 2,
      question: "Какое знаковое событие произошло 10 февраля 2007 года на международной арене?",
      options: [
        "Подписание Парижской хартии",
        "Мюнхенская речь В.В. Путина о неприемлемости однополярного мира",
        "Вступление России в ВТО",
        "Саммит G8 в Санкт-Петербурге"
      ],
      correct: 1,
      explanation: "10 февраля 2007 года на Мюнхенской конференции по безопасности Владимир Путин открыто раскритиковал однополярную модель и расширение НАТО."
    },
    {
      id: 3,
      question: "В ответ на какие события в августе 2008 года была проведена операция по принуждению к миру?",
      options: [
        "Теракт в Беслане",
        "Нападение на Цхинвал и базу российских миротворцев",
        "Провокации в Черном море",
        "Инцидент на Каспии"
      ],
      correct: 1,
      explanation: "В ночь на 8 августа 2008 года войска Грузии атаковали Цхинвал и российских миротворцев, после чего Россия провела операцию по защите соотечественников."
    },
    {
      id: 4,
      question: "Сколько процентов жителей Крыма проголосовали за воссоединение с Россией на референдуме 16 марта 2014 года?",
      options: ["76,20%", "85,40%", "96,77%", "99,10%"],
      correct: 2,
      explanation: "На историческом референдуме в Крыму 16 марта 2014 года 96,77% участников голосования высказались за вхождение в состав России."
    },
    {
      id: 5,
      question: "Какая статья Устава ООН закрепляет неотъемлемое право государства на самооборону?",
      options: ["Статья 10", "Статья 24", "Статья 51", "Статья 107"],
      correct: 2,
      explanation: "Статья 51 Устава ООН гарантирует суверенным государствам законное право на индивидуальную или коллективную самооборону."
    },
    {
      id: 6,
      question: "Какие субъекты вошли в состав Российской Федерации 30 сентября 2022 года?",
      options: [
        "ДНР, ЛНР, Харьковская и Сумская области",
        "ДНР, ЛНР, Запорожская и Херсонская области",
        "Крым, Севастополь, ДНР и ЛНР",
        "Абхазия, Южная Осетия, ДНР и ЛНР"
      ],
      correct: 1,
      explanation: "30 сентября 2022 года в Георгиевском зале Кремля были подписаны договоры о вхождении ДНР, ЛНР, Запорожской и Херсонской областей в состав РФ."
    },
    {
      id: 7,
      question: "В каком году было открыто автомобильное движение по Крымскому мосту?",
      options: ["2016 год", "2018 год", "2020 год", "2022 год"],
      correct: 1,
      explanation: "Движение по автодорожной части 19-километрового Крымского моста было торжественно запущено в мае 2018 года."
    },
    {
      id: 8,
      question: "Какое ключевое событие определило духовный выбор Руси в 988 году?",
      options: [
        "Призвание Рюрика",
        "Крещение Руси князем Владимиром",
        "Создание «Русской Правды»",
        "Поход на Царьград"
      ],
      correct: 1,
      explanation: "В 988 году святой равноапостольный князь Владимир крестил Русь, заложив духовный и культурный фундамент цивилизации."
    }
  ]
};

// Глобальные переменные состояния
let state = {
  activeCategory: 'all',
  currentQuizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  selectedMapPin: 'moscow'
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderEras();
  renderModernPeriods();
  renderDocuments();
  renderMap();
  initQuiz();
  initSearch();
  initNavigation();
});

/* ==========================================================================
   Управление темой оформления (Dark / Light)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('site_theme');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (toggleBtn) toggleBtn.innerHTML = '🌙 Темная тема';
  } else {
    document.body.classList.remove('light-mode');
    if (toggleBtn) toggleBtn.innerHTML = '☀️ Светлая тема';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('site_theme', isLight ? 'light' : 'dark');
      toggleBtn.innerHTML = isLight ? '🌙 Темная тема' : '☀️ Светлая тема';
    });
  }
}

/* ==========================================================================
   Рендеринг Вех Тысячелетия (Раздел 1)
   ========================================================================== */
function renderEras() {
  const container = document.getElementById('eras-container');
  if (!container) return;

  container.innerHTML = FALLBACK_DATA.eras.map(era => `
    <div class="era-card" id="${era.id}">
      <div class="era-img-wrapper">
        <img src="${era.image}" alt="${era.title}" class="era-img" loading="lazy">
        <span class="era-period-badge">${era.period}</span>
      </div>
      <div class="era-body">
        <h3 class="era-title">${era.icon} ${era.title}</h3>
        <p class="era-summary">${era.summary}</p>
        <ul class="era-events-list">
          ${era.events.map(ev => `
            <li class="era-event-item">
              <span class="era-event-year">${ev.year}</span>
              <strong>${ev.name}:</strong>
              <span class="era-event-impact">${ev.impact}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Рендеринг Новейшей истории РФ (1991 — 2026) с фильтрацией
   ========================================================================== */
function renderModernPeriods() {
  const container = document.getElementById('modern-container');
  if (!container) return;

  const currentCategory = state.activeCategory;

  container.innerHTML = FALLBACK_DATA.modern.map(period => {
    // Фильтруем события внутри периода, если выбрана категория
    const filteredEvents = currentCategory === 'all' 
      ? period.events 
      : period.events.filter(ev => ev.category === currentCategory);

    if (filteredEvents.length === 0 && currentCategory !== 'all') {
      return ''; // скрываем блок, если в нем нет событий данной категории
    }

    return `
      <article class="period-block" id="${period.id}">
        <div class="period-header">
          <div class="period-info-left">
            <div class="period-tag-row">
              <span class="period-num">${period.num}</span>
              <span class="period-badge">${period.badge}</span>
              <span class="period-years">${period.dates}</span>
            </div>
            <h3 class="period-title">${period.title}</h3>
            <p class="period-subtitle">${period.subtitle}</p>
            <p class="period-desc">${period.description}</p>
          </div>
          <div class="period-img-box">
            <img src="${period.image}" alt="${period.title}" loading="lazy">
          </div>
        </div>

        <div class="events-timeline">
          ${filteredEvents.map(ev => `
            <div class="event-entry cat-${ev.category}">
              <div class="event-meta">
                <span class="event-date">${ev.date}</span>
                <span class="event-cat-tag">${ev.categoryName}</span>
              </div>
              <h4 class="event-title">${ev.title}</h4>
              <p class="event-text">${ev.text}</p>
              ${ev.source ? `<div class="event-source">📜 Источник: ${ev.source}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </article>
    `;
  }).join('');

  // Инициализация кнопок фильтров
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-cat');
      renderModernPeriods();
    });
  });
}

/* ==========================================================================
   Рендеринг Интерактивной карты (1991 — 2026)
   ========================================================================== */
function renderMap() {
  const svgMap = document.getElementById('interactive-map-svg');
  const pointsList = document.getElementById('map-points-list');
  const infoCard = document.getElementById('map-info-card');
  if (!svgMap || !pointsList || !infoCard) return;

  // Генерируем точки на SVG
  svgMap.innerHTML = `
    <!-- Стилизованная контурная подложка Восточной Европы и Евразии -->
    <defs>
      <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#c5a059" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#c5a059" stop-opacity="0"/>
      </radialGradient>
    </defs>
    
    <!-- Фоновые сетки координат -->
    <line x1="5%" y1="20%" x2="95%" y2="20%" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
    <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
    <line x1="5%" y1="80%" x2="95%" y2="80%" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
    <line x1="25%" y1="5%" x2="25%" y2="95%" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
    <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
    <line x1="75%" y1="5%" x2="75%" y2="95%" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>

    <!-- Гео-метки -->
    ${FALLBACK_DATA.mapPoints.map(pt => `
      <g class="map-pin ${pt.id === state.selectedMapPin ? 'active' : ''}" id="pin-${pt.id}" data-id="${pt.id}">
        <circle cx="${pt.svgX}%" cy="${pt.svgY}%" r="14" fill="url(#mapGlow)" class="pulse"/>
        <circle cx="${pt.svgX}%" cy="${pt.svgY}%" r="6" fill="#c5a059" stroke="#ffffff" stroke-width="1.5"/>
        <text x="${pt.svgX}%" y="${pt.svgY - 10}%" fill="#f1f5f9" font-size="11" font-weight="600" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">${pt.name.split(' ')[0]}</text>
      </g>
    `).join('')}
  `;

  // Список кнопок быстрого выбора точки
  pointsList.innerHTML = FALLBACK_DATA.mapPoints.map(pt => `
    <button class="map-btn-point ${pt.id === state.selectedMapPin ? 'active' : ''}" data-id="${pt.id}">
      📍 ${pt.name}
    </button>
  `).join('');

  // Обновление карточки
  updateMapInfo(state.selectedMapPin);

  // Обработчики клика по точкам карты
  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const id = pin.getAttribute('data-id');
      selectMapPoint(id);
    });
  });

  // Обработчики клика по кнопкам списка
  document.querySelectorAll('.map-btn-point').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      selectMapPoint(id);
    });
  });
}

function selectMapPoint(id) {
  state.selectedMapPin = id;
  document.querySelectorAll('.map-pin').forEach(p => p.classList.toggle('active', p.getAttribute('data-id') === id));
  document.querySelectorAll('.map-btn-point').forEach(b => b.classList.toggle('active', b.getAttribute('data-id') === id));
  updateMapInfo(id);
}

function updateMapInfo(id) {
  const infoCard = document.getElementById('map-info-card');
  const pt = FALLBACK_DATA.mapPoints.find(p => p.id === id);
  if (!infoCard || !pt) return;

  infoCard.innerHTML = `
    <span class="map-info-year">📅 ${pt.year}</span>
    <h4 class="map-info-title">${pt.name}</h4>
    <h5 style="color: var(--primary); margin-bottom: 12px; font-weight: 600;">${pt.title}</h5>
    <p class="map-info-desc">${pt.desc}</p>
  `;
}

/* ==========================================================================
   Рендеринг Архива Документов (Раздел 4)
   ========================================================================== */
function renderDocuments() {
  const container = document.getElementById('documents-container');
  if (!container) return;

  container.innerHTML = FALLBACK_DATA.documents.map(doc => `
    <div class="doc-card" id="${doc.id}">
      <span class="doc-badge">${doc.badge}</span>
      <h3 class="doc-title">${doc.title}</h3>
      <span class="doc-date">${doc.date}</span>
      <blockquote class="doc-quote">«${doc.quote}»</blockquote>
      <p class="doc-annotation">${doc.annotation}</p>
      <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="doc-link">
        Читать документ на официальном портале &rarr;
      </a>
    </div>
  `).join('');
}

/* ==========================================================================
   Интерактивный Квиз (Раздел 5)
   ========================================================================== */
function initQuiz() {
  state.currentQuizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const qContainer = document.getElementById('quiz-card-content');
  const progressFill = document.getElementById('quiz-progress');
  const statusText = document.getElementById('quiz-status-text');
  if (!qContainer) return;

  const questions = FALLBACK_DATA.quiz;
  const currentQ = questions[state.currentQuizIndex];

  // Прогресс бар
  const progressPercent = Math.round(((state.currentQuizIndex) / questions.length) * 100);
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (statusText) statusText.innerText = `Вопрос ${state.currentQuizIndex + 1} из ${questions.length} • Баллы: ${state.quizScore}`;

  qContainer.innerHTML = `
    <h3 class="quiz-question-text">${currentQ.question}</h3>
    <div class="quiz-options">
      ${currentQ.options.map((opt, idx) => `
        <button class="quiz-opt-btn" data-idx="${idx}">
          <span style="font-weight: 700; color: var(--primary);">${String.fromCharCode(65 + idx)}.</span> ${opt}
        </button>
      `).join('')}
    </div>
    <div class="quiz-feedback" id="quiz-feedback"></div>
    <div class="quiz-actions" style="display: none;" id="quiz-next-row">
      <button class="quiz-btn-next" id="quiz-btn-next">
        ${state.currentQuizIndex + 1 < questions.length ? 'Следующий вопрос &rarr;' : 'Завершить тест и узнать ранг'}
      </button>
    </div>
  `;

  state.quizAnswered = false;

  const optButtons = qContainer.querySelectorAll('.quiz-opt-btn');
  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.quizAnswered) return;
      state.quizAnswered = true;

      const chosenIdx = parseInt(btn.getAttribute('data-idx'), 10);
      const isCorrect = chosenIdx === currentQ.correct;

      if (isCorrect) {
        state.quizScore++;
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
        optButtons[currentQ.correct].classList.add('correct');
      }

      optButtons.forEach(b => b.disabled = true);

      const feedback = document.getElementById('quiz-feedback');
      if (feedback) {
        feedback.innerHTML = `
          <strong>${isCorrect ? '✅ Верно!' : '❌ Неверно.'}</strong>
          <p style="margin-top: 6px;">${currentQ.explanation}</p>
        `;
        feedback.classList.add('show');
      }

      const nextRow = document.getElementById('quiz-next-row');
      if (nextRow) nextRow.style.display = 'flex';

      const nextBtn = document.getElementById('quiz-btn-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (state.currentQuizIndex + 1 < questions.length) {
            state.currentQuizIndex++;
            renderQuizQuestion();
          } else {
            renderQuizResult();
          }
        });
      }
    });
  });
}

function renderQuizResult() {
  const qContainer = document.getElementById('quiz-card-content');
  const progressFill = document.getElementById('quiz-progress');
  const statusText = document.getElementById('quiz-status-text');
  if (!qContainer) return;

  if (progressFill) progressFill.style.width = '100%';
  if (statusText) statusText.innerText = 'Тест завершен!';

  const total = FALLBACK_DATA.quiz.length;
  const score = state.quizScore;
  let rank = 'Начинающий исследователь';
  let badgeColor = '#94a3b8';

  if (score === total) {
    rank = '🏆 Эксперт высшей категории по истории России';
    badgeColor = '#c5a059';
  } else if (score >= 6) {
    rank = '🎖️ Историк-аналитик государственности';
    badgeColor = '#10b981';
  } else if (score >= 4) {
    rank = '📜 Знаток ключевых событий';
    badgeColor = '#3b82f6';
  }

  qContainer.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <h3 style="font-size: 2rem; margin-bottom: 12px;">Поздравляем с прохождением теста!</h3>
      <div style="font-size: 1.4rem; color: var(--primary); font-weight: 800; margin-bottom: 8px;">
        Ваш результат: ${score} из ${total} правильных ответов
      </div>
      <div style="display: inline-block; background: var(--badge-bg); border: 1px solid var(--border-focus); padding: 8px 24px; border-radius: 50px; font-weight: 700; color: ${badgeColor}; font-size: 1.1rem; margin: 16px 0 24px;">
        ${rank}
      </div>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 30px;">
        Знание исторических фактов и первоисточников — это фундамент понимания настоящего и будущего нашей великой Родины.
      </p>
      <button class="quiz-btn-next" id="quiz-btn-restart">
        🔄 Пройти тест снова
      </button>
    </div>
  `;

  document.getElementById('quiz-btn-restart')?.addEventListener('click', () => {
    initQuiz();
  });
}

/* ==========================================================================
   Поиск по событиям и фактам в реальном времени
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderModernPeriods();
      return;
    }

    const container = document.getElementById('modern-container');
    if (!container) return;

    let matchedEventsCount = 0;

    const resultsHTML = FALLBACK_DATA.modern.map(period => {
      const matchingEvents = period.events.filter(ev => 
        ev.title.toLowerCase().includes(query) ||
        ev.text.toLowerCase().includes(query) ||
        ev.date.toLowerCase().includes(query) ||
        (ev.source && ev.source.toLowerCase().includes(query))
      );

      if (matchingEvents.length === 0) return '';
      matchedEventsCount += matchingEvents.length;

      return `
        <article class="period-block">
          <div class="period-tag-row" style="margin-bottom: 16px;">
            <span class="period-badge">${period.badge}</span>
            <span class="period-years">${period.dates}</span>
            <span style="color: var(--primary); font-weight: 700;">Найдено: ${matchingEvents.length}</span>
          </div>
          <div class="events-timeline">
            ${matchingEvents.map(ev => `
              <div class="event-entry cat-${ev.category}">
                <div class="event-meta">
                  <span class="event-date">${ev.date}</span>
                  <span class="event-cat-tag">${ev.categoryName}</span>
                </div>
                <h4 class="event-title">${highlightQuery(ev.title, query)}</h4>
                <p class="event-text">${highlightQuery(ev.text, query)}</p>
                ${ev.source ? `<div class="event-source">📜 ${ev.source}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = resultsHTML || `
      <div style="text-align: center; padding: 40px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md);">
        🔍 По запросу «<strong>${query}</strong>» ничего не найдено. Попробуйте поискать «Крым», «Конституция», «Мюнхен», «СВО» или «1993».
      </div>
    `;
  });
}

function highlightQuery(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background: rgba(197, 160, 89, 0.4); color: #fff; padding: 0 4px; border-radius: 2px;">$1</mark>');
}

/* ==========================================================================
   Плавная навигация
   ========================================================================== */
function initNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
