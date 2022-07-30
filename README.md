# Chatty - чат мессенджер

Данный проект был сконфигурирован при помощи шаблона `cra-template-redux-typescript`

Приложение адаптировано под desktop, tablet, mobile

Приложение разрабатывалось совместно с back-end разработчиком, мой вклад в разработку включает в себя полностью клиентскую часть


## Установка

Склонируйте проект себе, загрузите все необходимые зависимости командой:
### `npm i`

и запустите командой:
### `npm start`


## Используемые технологии:

### Front-end

* `TypeScript`
* `React`
* `Redux RTK Slice` 
* `Apollo`
* `Styled Components`

### Back-end

* `Kotlin`
* `Spring Boot`
* `GraphQL`
* `Postgres`
* `STOMP Over WebSocket`
* `Heroku`


## Описание проекта


### Страница авторизации 

При первом открытии приложения вы попадете на страницу с авторизацией. Авторизоваться можно через учетную запись Google. Имя пользователя, а также аватар будут установлены исходя из данных учетной записи Google. При повторном открытии приложения информация об авторизации будет проверяться, повторная авторизация потребуется в случае разлогирования или при смене браузера. При успешной авторизации вы будете перенаправлены на страницу с чатом.

<img width="440" alt="Screen Shot 2022-07-31 at 01 20 42" src="https://user-images.githubusercontent.com/99764749/181952380-2bd28b98-a5de-4f64-b24c-e5e083b07027.png">


### Главная страница чата

Пройдя авторизацию вам откроется страница чата с приветствием, для того, чтобы начать вести диалог вам нужно найти интересующего вас пользователя и добавить его в друзья, либо начать диалог с одним из ранее добавленных пользователей во вкладке FRIENDS или открыть существующий диалог во вкладке CHATS.

На главной странице чата доступны следующие возможности:
* Статус пользователя: online/offline;
* Количество непрочитанных сообщений от определенного пользователя;
* Удаление пользователя из списка друзей;
* Удаление одного чата;
* Количество новых заявок в друзья.  

<img width="1440" alt="Screen Shot 2022-07-31 at 01 04 12" src="https://user-images.githubusercontent.com/99764749/181941704-87cde429-7c2f-4237-9cd5-2ee48fcd7979.png">


### Диалоговое окно

Начав диалог с пользователем вы сможете обмениваться сообщениям и изображениями, сообщения доставляются мгновенно, новые сообщения добавляются в конец списка, каждое сообщение помечается текущей датой и временем:

<img width="1440" alt="Screen Shot 2022-07-31 at 01 31 12" src="https://user-images.githubusercontent.com/99764749/181962697-8e40bae7-c05f-44ab-b44f-d696569a048f.png">


### Модальное окно

Кликнув на иконку группы пользователей в правом верхнем углу вам откроется модальное окно с возможностью поиска пользователей и просмотра активных запросов в друзья.

Вкладка USERS - поиск пользователей осуществляется по всем залогиненым пользователям, без учета регистра и с транскрипцией языка, здесь вы можете отправить заявку на добавление в друзья:

<img width="449" alt="Screen Shot 2022-07-31 at 01 39 04" src="https://user-images.githubusercontent.com/99764749/181977887-55be1f2d-e335-49c4-856e-d8bef9c89b61.png">

Вкладка REQUESTS - список всех активных заявок в друзья, здесь вы можете подтвердить заявку:

<img width="429" alt="Screen Shot 2022-07-31 at 01 40 37" src="https://user-images.githubusercontent.com/99764749/181983834-746ff351-4e06-41f6-a54f-6571664bd673.png">


### Меню управления

Кликнув на три точки вам откроется выпадающее меню с полями My profile и кнопкой разлогирования:

<img width="208" alt="Screen Shot 2022-07-31 at 01 51 20" src="https://user-images.githubusercontent.com/99764749/181988469-79d7ca81-a0c2-48c9-9fdf-3091ff3cf983.png">

Поле My profile содержит информацию об текущем пользователе:

<img width="525" alt="Screen Shot 2022-07-31 at 01 57 29" src="https://user-images.githubusercontent.com/99764749/181994543-27aef7cf-a817-4726-ab78-4fff98597e79.png">










