# househunter 租房猎手

测试地址：[点击使用](http://easyread.top)

这是一个租房信息整合的webapp，旨在方便用户查找想要的租房信息，避免了用户在豆瓣小组上瞎逛浪费时间,你可以轻松根据多种筛选条件选择你想要的结果，比如：在滨江网易附近有独卫带阳台的房间。

下面是操作演示

![](https://github.com/hk029/househunter/blob/master/src/assets/preview.gif?raw=true)



# 主要特点
特别强调一下**关键词多条件筛选**：（&是与，|是或）
>独卫|主卧|公寓   表示 满足(独卫,主卧,公寓)三个条件其中任意一个均可
>独卫&主卧  表示 有独卫的主卧
>阳台&独卫|公寓&天街  表示 需要有阳台靠近天街，但是公寓或独卫两者满足其一就行

- 重要信息直观显示（图片+文字，避免豆瓣小组那种不直观的显示模式）
- 多条件筛选，方便定位
- 多平台信息聚合（目前只有豆瓣小组，后续会加入别的平台）
- 数据动态更新（每小时更新）
# 安装方法

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

你在本地运行的话是没有数据的，你可以在src/components下List.vue文件，把data里的api改成`http://easyread.top/api` 使用。

```
src/components
└── List.vue
```

# 更新情况
### v1.3.0
- 调整了整体布局，加入了其他平台信息（5i5j)
- 调整了租房条件布局，加入了价格，同时整体做成了折叠式
- 区域内容增加了更细化的区域筛选
### v1.2.0
- 增加了北京的数据
- 增加了地铁线路数据
### v1.1.1
- 修改了每页的数量，加快加载速度
- 加入了loading，提升体验
### v.1.1.0

- 增加了多条件筛选功能
- 增加了分页功能
- 增加了回到顶部功能
- 增加了图片预览
- 修改了介绍内容过多显示不美观，改成了弹出显示
- 数据存入mongoDB

### v.1.0.0

- 基本前端框架搭建，可以根据豆瓣api显示内容
- 每小时数据缓存，防止多次访问接口被禁止
