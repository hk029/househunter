<template>
  <div class="aboutme">
    <div class="pattern-img">
      <div class="about-title">
        关于我
      </div>
      <div class="mask"></div>
    </div>
    <div class="container">
      <div class="entry">
        <h2>我是谁？</h2>
        <p>我的主人是一名刚毕业的研究生程序猿，他在找房阶段忍无可忍，一气之下创造了
          <code>我</code>。下面是我的个站介绍：</p>
        <ul class="card">
          <li>姓名：易有方</li>
          <li>英文名：eyoufang 尝试模仿小沈阳的发音（域名eyoufang.cn目前正在备案中）</li>
          <li>爱好：一个超级收集狂</li>
        </ul>
        <p>我问过我主人，为什么叫易有方，他说因为「易有房」不让用，所以叫了这个o(≧口≦)o。</p>
        <p>不过看在他给我了一个合理的解释的情况下，就原谅他了，他是这么说的：</p>
        <blockquote>
          <p>小方，你的名字其实很有诗意，取自：父母在不远游，游必
            <strong>有方</strong>。</p>
          <p>我们的目的就是
            <strong>帮助大家早日找到家的方向</strong>，让出门在外的游子能感受到家的温暖，也让父母少点担心。</p>
        </blockquote>
        <p>我是免费为大家提供服务的，而且绝对不获取您的隐私信息，所有跟您相关的数据只会存储在您自己的浏览器上。</p>
        <p class="red">当然考虑到我也是个大胃王，会吃服务器和的带宽资源。我的主人说养我挺费劲的(๑•́ ₃ •̀๑) ，因此如果你想喂养我，欢迎翻到最底下给我主人打赏，让他给我买零食。</p>
        <h2>我在干嘛？</h2>
        <p> “我”的目的是为您提供房源信息直观展示的平台，我可以方便的为你筛选想要的房源信息，免去你人工筛选的麻烦。</p>

        <p>所有的内容均会以图片（会滚动显示）和详情的形式直观展示，并且鼠标移动到简介部分会直接显示详细内容，免去你多次打开新页面的烦恼(这个只有在PC端可以哦)</p>
        <img src='../assets/pic3.png' />
        <p>我提供了常见的筛选条件：
          <strong>城市，地区，地铁线路</strong> 筛选方式，更重要的是，提供了
          <strong>关键词复合</strong>筛选：</p>
        <pre><code>'&amp;'表示与操作  '|'表示或操作</code></pre>
        <p>
          <code>&amp;</code>操作会被默认作为分组依据，因此您不需要加括号，例如</p>
        <pre>A &amp; B | C &amp; D  会被自动分析成： A &amp; （B | C） &amp; D</pre>
        <p>例如，您想找滨江带阳台和独卫的房间只用这样就行了：</p>
        <p>
          <img src='../assets/pic0.png' />
        </p>
        <p>如果你想搜索带阳台靠近天街，但是主卧或者独卫二选一就行，你可以这样输入</p>
        <p>
          <img src='../assets/pic1.png' alt='image-20180511164427372' />
        </p>
        <p>是不是很方便？？快点体验吧！</p>
        <h2>Ta为什么做这个？</h2>
        <p>以下是我的主人的描述：</p>
        <blockquote>
          <p>网上的信息很杂，特别是像豆瓣小组这样的平台只提供了发帖的功能并
            <strong>没有提供任何的信息筛选功能</strong>，导致我要找到特定的房源无异于大海捞针。很多时候我只能靠我一双慧眼苦苦翻阅,浪费了数瓶眼药水仍然找不到想要的房源，过程之痛苦，相信找过的人都清楚。因此我决定做一个网站解决这个问题，或许这就是作为程序猿的一些本能想法吧。</p>
          <p>当我做了第一版出来的时候，觉得还挺好用的，因此介绍给我身边同样有困扰的同学使用，然后不断的改进，就有了现在这个小产品。</p>
          <p>我觉得它应该能真正解决一些人的痛点问题，为一些人节约自己宝贵的时间。
            <strong>当身边使用过的人跟我说，我觉得你那个东西挺好用的，这其实就是对开发者最大的鼓励吧，也是支撑我一直做下去的动力</strong>
          </p>
          <p>也欢迎推荐给同样有困扰的童鞋使用。</p>
        </blockquote>
        <h2>打赏地址</h2>
        <p>如果你觉得我帮助到你了，欢迎给我投食，阿里嘎多(｡･ω･｡)ﾉ♡</p>
        <p>
          <img src='../assets/money.png' alt='image-20180511164427372' />
        </p>
        <h2>联系我主人</h2>
        <p>如果你想联系我主人，我这里给你提供几个方式哈：</p>
        <ul>
          <li>电话：我主人说，给了就打死我</li>
          <li>邮箱：<a href="mailto:hk2291976@hotmail.com">hk2291976@hotmail.com</a></li>
          <li>github: <a href="github.com/hk029">github.com/hk029</a></li>
          <li>个人网站：<a href="voidsky.cc">voidsky.cc</a> (他都好久没在上面更新了)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"Aboutme"
}
</script>

<style scoped>
   .pattern-img {
      background-image: url(http://voidsky.cc/wp-content/uploads/2016/12/pexels-photo-3.jpg);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      background-origin: border-box;
      width: 100%;
      height: 200px;
      position: relative;
    }

    .mask {
      width: 100%;
      height: 200px;
      background: rgba(144, 144, 144, 0.31);
      position: absolute;
      top: 0;
    }

    .about-title {
      text-align: center;
      font-size: 38px;
      line-height: 200px;
      color: white;
      font-family: PingFang SC, Hiragino Sans GB, Microsoft YaHei, STHeiti, WenQuanYi Micro Hei, Helvetica, Arial;
    }

    .container {
      width: 750px;
      margin: 0 auto;
      margin-top: 20px;
    }

    .card {
      border: 1px solid #eee;
      background: #fafafa;
      border-radius: 5px
    }

    @media screen and (max-width: 980px) {
      .container {
        width: 80%;
        margin: 0 auto;
        margin-top: 20px;
      }
    }
</style>
