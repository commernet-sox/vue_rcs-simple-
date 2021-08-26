<template>
  <div class="rcsmap-container">
    <div class="rcsmap-header">
      <div
        class="tab"
        v-for="item in TotalFloor"
        :key="item"
        :class="item == selectTabIndex ? 'tabSelect' : 'tabUnselect'"
        @click="tabChange(item)"
      >
        <div class="icon-item">
          <i class="el-icon-map-location" />
        </div>
        <p class="font">{{ item }} 层</p>
      </div>
    </div>
    <div class="rcsmap-main">
      <div class="warning mapInfo">{{ mapInfo }}</div>
      <div
        id="div1"
        class="box"
        @mousewheel="scaleDom"
        @mousedown="handleDragDown"
      >
        <canvas id="scaleDragCanvas" width="1920" height="1080"></canvas>
        <!-- <canvas id="carCanvas" width="1920" height="1080"></canvas> -->
        <img
          src="../../assets/sku.png"
          class="icon"
          alt=""
          @mouseover="IconOver(item)"
          @mouseout="IconOut()"
          v-for="item in imgList"
          :key="item.key"
          :style="
            'margin-left:' +
            item.l +
            'px;margin-top:' +
            item.t +
            'px;width:' +
            item.w +
            'px;height:' +
            item.h +
            'px;'
          "
        />

        <div
          v-for="item in carList"
          :key="item.code"
          v-show="item.floor == selectTabIndex"
          :style="
            'margin-left:' +
            item.left +
            'px;margin-top:' +
            item.top +
            'px;position:absolute;'
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.code + ' 电量:' + item.power + '%'"
            placement="top"
          >
            <img
              src="../../assets/AGV4.png"
              :id="item.code"
              class="carIcon"
              :style="
                'width:' + item.width + 'px;height:' + item.height + 'px;'
              "
              alt=""
              @mouseenter="transform(item.code)"
              @mouseout="transformOut"
            />
          </el-tooltip>
          <span class="pulse delay-01"></span>
          <span class="pulse delay-02"></span>
        </div>
      </div>
    </div>
    <div class="rcsmap-right">
      <div
        class="menutab"
        v-for="item in menuList"
        :key="item.index"
        :class="item.index == selectMenuIndex ? 'tabSelect' : 'tabUnselect'"
        @click="menuChange(item)"
      >
        <div class="icon-item">
          <i :class="item.content" />
        </div>
        <p class="font">{{ item.name }}</p>
      </div>
    </div>
    <div id="menu0" v-show="menu0" class="right-menu">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备信息" name="first" class="tabcolor">
          <el-row>
            <el-select
              v-model="value"
              clearable
              placeholder="请选择设备编号"
              size="small"
            >
              <el-option
                v-for="item in carList"
                :key="item.code"
                :label="item.code"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <el-button
              type="primary"
              icon="el-icon-search"
              plain
              size="small"
              @click="carSearch()"
              >查询</el-button
            >
          </el-row>
          <el-row v-for="item in carShow" :key="item.code">
            <el-row class="car-header">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="追踪"></el-checkbox>
                <el-checkbox label="隐匿"></el-checkbox>
              </el-checkbox-group>
            </el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple textCenter">
                <img :src="carPng" alt="" srcset="" />
                <p class="textCenter">电量</p>
                <p class="textColor">{{ item.power }}%</p>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple-light">
                <el-row :gutter="10" class="row-bg">
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText"
                        >设备编号 {{ item.code }}</label
                      >
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText">IP 192.168.0.1</label>
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText">设备类型 潜伏</label>
                    </div></el-col
                  >
                </el-row>
                <el-row :gutter="10" class="row-bg">
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText">所在地图 1</label>
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText"
                        >所在楼层 {{ item.floor }}</label
                      >
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText"
                        >是否在线 <span class="normal">在线</span></label
                      >
                    </div></el-col
                  >
                </el-row>
                <el-row :gutter="10" class="row-bg">
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText"
                        >任务状态 <span class="warning">运行中</span></label
                      >
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText"
                        >设备状态 <span class="warning">运行中</span></label
                      >
                    </div></el-col
                  >
                  <el-col :span="8"
                    ><div class="grid-content bg-purple">
                      <label for="" class="labelText"
                        >负载情况 <span class="normal">空载</span></label
                      >
                    </div></el-col
                  >
                </el-row>
                <el-row class="row-bg"
                  ><label for="" class="labelText"
                    >当前坐标角度 [{{ item.left }},{{ item.top }}]</label
                  ></el-row
                >
                <el-row class="row-bg"
                  ><label for="" class="labelText"
                    >目的坐标角度 [{{ item.endleft }},{{ item.endtop }}]</label
                  ></el-row
                >
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="货架信息" name="second" class="tabcolor"
          >配置管理</el-tab-pane
        >
      </el-tabs>
    </div>
    <div id="menu1" v-show="menu1" class="right-menu">控制调度</div>
    <div id="menu2" v-show="menu2" class="right-menu">屏幕录制</div>
    <div id="menu3" v-show="menu3" class="right-menu">辅助工具</div>
  </div>
</template>

<script>
import {
  drawAgvMap1,
  arcImg,
  watermark,
  removeWatermark,
} from "@/views/RCSNew/rcs.js";
import { GetWS } from "@../../../public/config.js";
export default {
  name: "RCSMapNew",
  data() {
    return {
      //定义对象
      canvas: null,
      context: null,
      canvas1: null,
      ctx: null,
      oDiv: null, //div1对象
      icon: null, //图标
      speed: 0,
      space: 0,
      step: 0,
      i: 0,
      finish: true,
      ws: null,
      Position: { X: 0, Y: 0 }, //agv当前坐标
      imgHtml: "",
      imgList: [],
      scale: 1,
      flowData: null,
      AGVCarList: [{}],
      editableTabsValue: "2",
      positionList: [
        {
          title: "Tab 1",
          name: "1-1 haining",
          content: "Tab 1 content",
          index: 0,
        },
        {
          title: "Tab 2",
          name: "1-2 haining",
          content: "Tab 2 content",
          index: 1,
        },
        {
          title: "Tab 2",
          name: "1-3 haining",
          content: "Tab 2 content",
          index: 2,
        },
        {
          title: "Tab 2",
          name: "1-4 haining",
          content: "Tab 2 content",
          index: 3,
        },
        {
          title: "Tab 2",
          name: "1-5 haining",
          content: "Tab 2 content",
          index: 4,
        },
        {
          title: "Tab 2",
          name: "1-6 haining",
          content: "Tab 2 content",
          index: 5,
        },
        {
          title: "Tab 2",
          name: "1-7 haining",
          content: "Tab 2 content",
          index: 6,
        },
        {
          title: "Tab 2",
          name: "1-8 haining",
          content: "Tab 2 content",
          index: 7,
        },
        {
          title: "Tab 2",
          name: "1-9 haining",
          content: "Tab 2 content",
          index: 8,
        },
        {
          title: "Tab 2",
          name: "1-10 haining",
          content: "Tab 2 content",
          index: 9,
        },
        {
          title: "Tab 2",
          name: "1-11 haining",
          content: "Tab 2 content",
          index: 10,
        },
        {
          title: "Tab 2",
          name: "1-12 haining",
          content: "Tab 2 content",
          index: 11,
        },
        {
          title: "Tab 2",
          name: "1-13 haining",
          content: "Tab 2 content",
          index: 12,
        },
        {
          title: "Tab 2",
          name: "1-14 haining",
          content: "Tab 2 content",
          index: 13,
        },
        {
          title: "Tab 2",
          name: "1-15 haining",
          content: "Tab 2 content",
          index: 14,
        },
        {
          title: "Tab 2",
          name: "1-16 haining",
          content: "Tab 2 content",
          index: 15,
        },
        {
          title: "Tab 2",
          name: "1-17 haining",
          content: "Tab 2 content",
          index: 16,
        },
      ],
      selectTabIndex: 1,
      menuList: [
        {
          title: "Tab 1",
          name: "信息监视",
          content: "el-icon-view",
          index: 0,
        },
        {
          title: "Tab 1",
          name: "控制调度",
          content: "el-icon-set-up",
          index: 1,
        },
        {
          title: "Tab 1",
          name: "屏幕录制",
          content: "el-icon-video-camera-solid",
          index: 2,
        },
        {
          title: "Tab 1",
          name: "辅助工具",
          content: "el-icon-setting",
          index: 3,
        },
      ],
      selectMenuIndex: 0,
      activeName: "first",
      options: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
      ],
      value: "",
      carPng: require("../../assets/car.png"),
      carList: null,
      carShow: null,
      checkList: [],
      menu0: true,
      menu1: false,
      menu2: false,
      menu3: false,
      mapInfo: "",
      mousex: 0,
      mousey: 0,
      transformId: null,
      rotateVal: 0,
      TotalFloor: 0,
      agv_register: {
        Params: { UserName: "admin", Password: "123456" },
        ID: "1",
        Action: "agv_register",
      },
      agv_map: { Params: { Floor: 1 }, ID: "1", Action: "agv_map" },
      agv_allcars: { Params: {}, ID: "1", Action: "agv_allcars" },
    };
  },
  //dom初始化后调用
  created() {},
  //dom初始化后调用
  mounted() {
    //获取json
    // console.log(json1);
    // this.flowData = json1[0];
    // get("1", "2", "3");
    this.webSocket();
    window.onbeforeunload = function () {
      try {
        this.ws.send("quit");
        this.ws.close();
        this.ws = null;
      } catch (ex) {
        console.log(ex);
      }
    };
    //this.WebSocketServer();

    // 当调整窗口大小时重绘canvas
    // window.onresize = () => {
    //   this.initCanvas();
    // };
  },
  //数据改变
  watch: {},
  methods: {
    initCanvas() {
      var _this = this;
      console.log("初始化canvas");
      this.canvas = document.getElementById("scaleDragCanvas"); //画布对象
      this.context = this.canvas.getContext("2d"); //画布显示二维图片

      // this.canvas1 = document.getElementById("carCanvas"); //小车对象
      // this.ctx = this.canvas1.getContext("2d"); //画布显示二维图片

      _this.oDiv = document.getElementById("div1");

      // canvas.width = window.innerWidth
      // canvas.height = window.innerHeight
      //this.space = drawAgvMap(this.context, this.canvas, this.flowData);
      if (_this.flowData != null) {
        _this.oDiv.style.width = _this.flowData.canvasWidth + "px";
        _this.oDiv.style.height = _this.flowData.canvasHeight + "px";
        drawAgvMap1(this.context, this.canvas, this.flowData);
        this.addIcon();
        //加水印
        removeWatermark();
        watermark(
          "第" + this.selectTabIndex + "层",
          document.getElementById("div1")
        );
      } else {
        console.log("楼层信息未获取。。。");
        setTimeout(() => {
          _this.initCanvas();
        }, 5000);
      }
      // this.step = this.space / 10;
      // console.log(this.space, this.step);
    },
    //div缩放
    scaleDom: function (e) {
      let div = document.getElementById("div1");
      let scale = parseFloat(
        (div.style.transform || `scale(1)`).replace(/[^0-9.]/gi, "")
      );
      let size = e.wheelDelta / 1200;
      scale += size;
      if (scale >= 0.5) div.style.transform = `scale(${scale})`;
    },
    //鼠标按下
    handleDragDown(e) {
      var _this = this;
      e = e || window.event;
      _this.mousex = e.clientX - _this.oDiv.offsetLeft;
      _this.mousey = e.clientY - _this.oDiv.offsetTop;
      //console.log(_this.mousex, _this.mousey);

      document.onmousemove = function (e) {
        //console.log("onmousemove");
        e = e || window.event;
        // 解决拖拽鼠标粘滞的问题
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        var moveX = e.clientX - _this.mousex; //得到距离左边移动距离
        var moveY = e.clientY - _this.mousey; //得到距离上边移动距离
        //可移动最大距离
        // var maxX = document.documentElement.clientWidth - box.offsetWidth;
        // var maxY = document.documentElement.clientHeight - box.offsetHeight;

        //范围限定  当移动的距离最小时取最大  移动的距离最大时取最小
        //范围限定方法二
        // moveX=Math.min(maxX, Math.max(0,moveX));
        // moveY=Math.min(maxY, Math.max(0,moveY));
        _this.oDiv.style.left = moveX + "px";
        _this.oDiv.style.top = moveY + "px";
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    //图标
    addIcon() {
      var _this = this;
      _this.imgList = [];
      _this.flowData.mapinfo.forEach(function (element) {
        if (element.dtype === "CustomEllipse") {
          _this.imgList.push(element);
        }
        // for (var i = 0; i < row.data.length; i++) {
        //   if (row.data[i].show == undefined || row.data[i].show == true) {
        //     _this.imgList.push(row.data[i]);
        //     // _this.imgHtml+="<img src='../../assets/sku.png' class='icon' style='margin-left:"+row.data[i].x+"px;margin-top:"+row.data[i].y+"px;'>";
        //     // $('#div1').append("<img src='./sku.png' class='icon' style='margin-left:"+row.data[i].x+"px;margin-top:"+row.data[i].y+"px;'>");
        //   }
        // }
      });
      console.log(_this.imgList);
    },
    //图片旋转
    transform(code) {
      var _this = this;
      // current=(current+90)%360;
      // document.getElementById('carIcon')[0].style.transform='rotate('+current+'deg)';
      this.transformId = setInterval(function () {
        var img = document.getElementById(code);
        _this.rotateVal += 1;
        // 设置旋转属性(顺时针)
        img.style.transform = "rotate(" + _this.rotateVal + "deg)";
        // 设置旋转属性(逆时针)
        //img.style.transform = 'rotate(-' + rotateVal + 'deg)'
        // 设置旋转时的动画  匀速0.1s
        img.style.transition = "0.1s linear";
      }, 100);
    },
    transformOut() {
      clearInterval(this.transformId);
    },
    initCar() {
      var _this = this;
      for (let i = 0; i < 4; i++) {
        eval("_this.car" + (i + 1)).x = _this.flowData[0].data[i].x;
        eval("_this.car" + (i + 1)).y = _this.flowData[0].data[i].y;
      }
    },
    drawCar() {
      var _this = this;
      for (let i = 0; i < 4; i++) {
        _this.ctx.fillStyle = eval("_this.car" + (i + 1)).color;
        arcImg(
          _this.ctx,
          eval("_this.car" + (i + 1)).x,
          eval("_this.car" + (i + 1)).y
        );
      }
    },
    webSocket() {
      var _this = this;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持WebSocket");
        var wsConnect = GetWS();
        _this.ws = new WebSocket(wsConnect); //创建WebSocket连接
        //ws = new WebSocket("ws://10.27.9.187:5000/ws");
        //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
        _this.ws.onopen = function () {
          //当WebSocket创建成功时，触发onopen事件
          console.log("open");
          //重置小车位置
          //_this.returnData.Type = "Reset";
          _this.ws.send(JSON.stringify(_this.agv_register));
          setInterval(function () {
            _this.ws.send(`{"Params": {},"ID": "1","Action": "ping"}`);
            //_this.ws.send(new ArrayBuffer(["9"]));
          }, 10000);
          //ws.send("hello"); //将消息发送到服务端
        };
        _this.ws.onmessage = function (e) {
          //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
          console.log(e);
          //console.log("接受: " + e.data,_this.returnData);
          var data = JSON.parse(e.data);

          switch (data.Action) {
            case "agv_register": //注册
              if (data.errCode == 0) {
                console.log(data.errText);
                _this.ws.send(JSON.stringify(_this.agv_map));
              } else {
                console.log(data.errText);
              }
              break;
            case "agv_map":
              if (data.errCode == 0) {
                _this.flowData = data.params.Result;
                _this.TotalFloor = data.params.Result.TotalFloor;
                _this.mapInfo =
                  "地图大小(" +
                  data.params.Result.gridRows +
                  "," +
                  data.params.Result.gridColumns +
                  ")";
                _this.initCanvas();
                _this.ws.send(JSON.stringify(_this.agv_allcars));
              } else {
                console.log("获取楼层信息失败", data.errText);
              }
              break;
            case "agv_allcars":
              if (data.errCode == 0) {
                _this.carList = data.params.Result;
                _this.carShow = _this.carList;
              } else {
                console.log("获取所有agv信息失败", data.errText);
              }
              break;
            case "agv_move":
              if (data.errCode == 0) {
                if (_this.carList != null) {
                  var startpoint = data.params.Result.startPoint.split(",");
                  var endpoint = data.params.Result.endPoint.split(",");
                  console.log(typeof startpoint, startpoint[0]);
                  _this.carList.forEach((element) => {
                    if (element.code == data.params.Result.code) {
                      if (
                        element.path == undefined ||
                        element.path == null ||
                        element.path == []
                      ) {
                        element.power = data.params.Result.power;
                        element.floor = data.params.Result.floor;
                        element.left = Number(startpoint[0]);
                        element.top = Number(startpoint[1]);
                        element.endleft = Number(endpoint[0]);
                        element.endtop = Number(endpoint[1]);
                        element.path = new Array();
                        element.distance = new Array();
                        element.times = new Array();
                        element.times.push(data.params.Result.distance);
                        element.path.push(data.params.Result.command);
                        if (startpoint[0] == endpoint[0]) {
                          element.distance.push(
                            Math.abs(
                              Number(endpoint[1]) - Number(startpoint[1])
                            )
                          );
                        } else {
                          element.distance.push(
                            Math.abs(
                              Number(endpoint[0]) - Number(startpoint[0])
                            )
                          );
                        }
                        element.i = 0;
                        console.log(element, startpoint);
                        _this.$options.methods.move(element, _this);
                      } else {
                        element.endleft = Number(endpoint[0]);
                        element.endtop = Number(endpoint[1]);
                        element.power = data.params.Result.power;
                        element.floor = data.params.Result.floor;
                        element.times.push(data.params.Result.distance);
                        element.path.push(data.params.Result.command);
                        if (startpoint[0] == endpoint[0]) {
                          element.distance.push(
                            Math.abs(
                              Number(endpoint[1]) - Number(startpoint[1])
                            )
                          );
                        } else {
                          element.distance.push(
                            Math.abs(
                              Number(endpoint[0]) - Number(startpoint[0])
                            )
                          );
                        }
                      }
                    }
                  });
                }
              } else {
                console.log("获取agv实时位置失败", data.errText);
              }
              break;
          }
        };
        _this.ws.onclose = function () {
          //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
          console.log("close");
        };
        _this.ws.onerror = function (e) {
          //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
          console.log("断开", e);
        };
      } else {
        console.log("您的浏览器不支持WebSocket");
      }
    },
    WebSocketServer() {
      var _this = this;
      var wsConnect = GetWS();
      console.log(wsConnect);
      _this.ws = new WebSocket(wsConnect); //创建WebSocket连接
      _this.ws.on("open", function open() {
        console.log("open");
        _this.ws.send(JSON.stringify(_this.agv_register));
      });
      _this.ws.on("message", function incoming(data) {
        console.log(data);
      });
      _this.ws.on("close", function close() {
        console.log("disconnected");
      });
      _this.ws.on("error", function close() {
        console.log("error");
      });
    },
    //调用小车
    move(car, _this) {
      console.log("move...", car);
      //var _this=this;
      if (car.i == car.path.length) {
        //结束
        console.log("agv:" + car.code + "移动结束");
        car.i = 0;
        car.path = null;
        car.distance = null;
        car.times = null;
      } else {
        var element = car.path[car.i];
        var distance = car.distance[car.i];
        var time = car.times[car.i];
        switch (element) {
          case 3:
            _this.$options.methods.up(car, _this, distance, time);

            break;
          case 4:
            _this.$options.methods.down(car, _this, distance, time);

            break;
          case 1:
            _this.$options.methods.left(car, _this, distance, time);

            break;
          case 2:
            _this.$options.methods.right(car, _this, distance, time);

            break;
        }
        car.i++;
      }
    },
    //小车移动
    up(car, _this, distance, time) {
      //var _this = this;
      console.log("上");
      var i = 0;
      var step = distance / (10 * time);
      var id = setInterval(() => {
        i += step;
        if (i <= distance) {
          _this.$options.methods.run("up", car, _this, step);
        } else {
          //console.log('up...')
          clearInterval(id);
          _this.$options.methods.move(car, _this);
        }
      }, 100);
    },
    down(car, _this, distance, time) {
      //var _this = this;
      //console.log('下')
      var i = 0;
      var step = distance / (10 * time);
      var id = setInterval(() => {
        i += step;
        if (i <= distance) {
          _this.$options.methods.run("down", car, _this, step);
        } else {
          //console.log('down...')
          clearInterval(id);
          _this.$options.methods.move(car, _this);
        }
      }, 100);
    },
    left(car, _this, distance, time) {
      //var _this = this;
      //console.log('左')
      var i = 0;
      var step = distance / (10 * time);
      var id = setInterval(() => {
        i += step;
        if (i <= distance) {
          _this.$options.methods.run("left", car, _this, step);
        } else {
          //console.log('left...')

          clearInterval(id);
          _this.$options.methods.move(car, _this);
        }
      }, 100);
    },
    right(car, _this, distance, time) {
      //var _this = this;
      //console.log('右')
      var i = 0;
      var step = distance / (10 * time);
      var id = setInterval(() => {
        i += step;
        if (i <= distance) {
          _this.$options.methods.run("right", car, _this, step);
        } else {
          //console.log('right...')

          clearInterval(id);
          _this.$options.methods.move(car, _this);
        }
      }, 100);
    },
    run(position, car, _this, step) {
      //var _this = this;
      console.log("run...", step);
      switch (position) {
        case "up":
          car.top += -step;
          break;
        case "down":
          car.top += step;
          break;
        case "left":
          car.left += -step;
          break;
        case "right":
          car.left += step;
          break;
      }
    },
    //切换楼层
    tabChange(item) {
      var _this = this;
      console.log(item);
      _this.selectTabIndex = item;
      // removeWatermark();
      // watermark(
      //   "第" + (this.selectTabIndex + 1) + "层",
      //   document.getElementById("div1")
      // );
      _this.agv_map.Params.Floor = _this.selectTabIndex;
      _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
      _this.flowData = null;
      _this.ws.send(JSON.stringify(_this.agv_map));
      //切换楼层地图
    },
    //切换右侧菜单
    menuChange(item) {
      var _this = this;
      console.log(this, item);
      _this.selectMenuIndex = item.index;
      console.log(
        eval("_this.menu" + item.index),
        _this[`${"menu" + item.index}`]
      );
      if (_this[`${"menu" + item.index}`] == true) {
        _this[`${"menu" + item.index}`] = false;
      } else {
        _this.menuList.forEach((element) => {
          if (element.index == item.index) {
            _this[`${"menu" + item.index}`] = true;
          } else {
            _this[`${"menu" + element.index}`] = false;
          }
        });
      }
      //切换楼层地图
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    IconOver(item) {
      this.mapInfo += "  位置 X:" + item.l + ",Y:" + item.t;
    },
    IconOut() {
      this.mapInfo =
        "地图大小(" +
        this.flowData.gridRows +
        "," +
        this.flowData.gridColumns +
        ")";
    },
    carSearch() {
      var _this = this;
      _this.carShow = [];
      //console.log(_this.value);
      _this.carList.forEach((element) => {
        if (element.code == _this.value || _this.value == "") {
          _this.carShow.push(element);
        }
      });
      //console.log(_this.carShow);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  // width: 1920px;
  // height: 1080px;
  //float: left;
  transform: scale(1);
  top: 0px;
  left: 0px;
  position: absolute;
}

#scaleDragCanvas {
  height: auto;
  background-color: #d5e6e9;
  position: absolute;
}

.tool {
  float: right;
}

#carCanvas {
  position: absolute;
  height: auto;
}

.robot,
.sku {
  border: thin solid #aaaaaa;
  height: 200px;
}
.icon {
  position: absolute;
}
.carIcon {
  position: absolute;
  z-index: 99;
}
.carIcon:hover {
  cursor: pointer;
  // border: thin solid #000;
}
.icon:hover {
  cursor: pointer;
  border: thin solid #000;
}
.rcsmap-header {
  background-color: rgb(21, 32, 95);
  width: 100%;
  position: absolute;
  float: left;
  z-index: 99;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
.rcsmap-main {
  height: 100%;
  position: absolute;
  width: 100%;
  overflow: hidden;
}
.tab {
  display: inline-block;
  padding: 0 8px;
  cursor: pointer;
}
.menutab {
  display: inline-block;
  padding: 8px 0;
  cursor: pointer;
}
.font {
  color: #ffffff;
  font-size: 5px;
}
.icon-item {
  text-align: center;
  color: #ffffff;
  cursor: pointer;
}
.tabSelect {
  background-color: #aaaaaa;
}
.rcsmap-right {
  background-color: rgb(21, 32, 95);
  width: 50px;
  position: absolute;
  float: right;
  // height: 100%;
  right: 0;
  top: 58px;
}
.right-menu {
  background-color: rgb(41, 46, 75);
  width: 400px;
  position: absolute;
  float: right;
  height: 90%;
  right: 51px;
  top: 58px;
  overflow-y: auto;
  padding: 6px;
  border-radius: 8px;
}
.tabcolor {
  color: #ffffff;
}
.el-tabs__item {
  color: #ffffff !important;
}
.textCenter {
  text-align: center;
}
.textColor {
  text-align: center;
  color: rgb(233, 199, 49);
}
.normal {
  color: green;
}
.warning {
  color: rgb(233, 199, 49);
}
.car-header {
  background-color: rgb(7, 202, 202);
}
.labelText {
  font-size: 1px;
}
.row-bg {
  padding: 4px 0;
}
.mapInfo {
  position: absolute;
  top: 58px;
  z-index: 99;
  background-color: #aaaaaa;
  border-radius: 8px;
  line-height: 23px;
  padding: 4px;
}

.dot {
  position: absolute;
  top: 5px;
  width: 10px;
  height: 10px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background: #a2a9b4;
  opacity: 1;
  filter: alpha(opacity=100);
}

.pulse {
  position: absolute;
  top: -14px;
  left: -14px;
  height: 66px;
  width: 66px;
  border: 2px solid #009fd9;
  -webkit-border-radius: 48px;
  -moz-border-radius: 48px;
  border-radius: 48px;
  -webkit-box-shadow: 0 0 4px #009fd9, 0 0 10px #009fd9 inset;
  -moz-box-shadow: 0 0 4px #009fd9, 0 0 10px #009fd9 inset;
  box-shadow: 0 0 4px #009fd9, 0 0 10px #009fd9 inset;
  opacity: 0.12;
  filter: alpha(opacity=0);
  -webkit-animation: warn 2s ease-out both;
  -moz-animation: warn 2s ease-out both;
  -o-animation: warn 2s ease-out both;
  animation: warn 2s ease-out both;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  background: 0 0;
}

.delay-01 {
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
}

.delay-02 {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  -o-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

@-webkit-keyframes warn {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@-moz-keyframes warn {
  0% {
    -moz-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }

  100% {
    -moz-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@-o-keyframes warn {
  0% {
    -o-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }

  100% {
    -o-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes warn {
  0% {
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>