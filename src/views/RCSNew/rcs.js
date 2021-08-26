module.exports = {
    get(a, b, c) {
        console.log(a, b, c);
    },
    // 画agv地图
    drawAgvMap1(context, canvas, flowdata) {
        console.log('drawAgvMap1...');
        // 1、计算xy的数据
        canvas.width = flowdata.canvasWidth
        canvas.height = flowdata.canvasHeight
        flowdata.mapinfo.forEach(function (element) {
            if (element.dtype === 'CustomEllipse') {
                context.globalAlpha = 1
                var rep=element.fill.substring(1,element.fill.length-6)
                context.fillStyle =element.fill.replace(rep,'')
                //context.fillStyle = '#f1bbc4'// 5B9BD5
                context.lineWidth = element.thickness
                context.fillRect(element.l, element.t, element.w, element.h)
            } else if (element.dtype === 'CustomLine') {
                try {
                    context.globalAlpha = 1
                    var sp = element.sp.split(',')
                    var ep = element.ep.split(',')
                    var movel = element.l + parseFloat(sp[0])
                    var movet = element.t + parseFloat(sp[1])
                    var linel = element.l + parseFloat(ep[0])
                    var linet = element.t + parseFloat(ep[1])
                    // draw the line
                    context.beginPath()
                    rep=element.stroke.substring(1,element.stroke.length-6)
                    
                    //context.strokeStyle = element.stroke.replace(rep,'')// 设置线条的颜色white
                    context.strokeStyle ='white'
                    // context.fillStyle = this.color;
                    context.lineWidth = element.thickness+3// 设置线条的宽度
                    context.moveTo(movel, movet)// 起点
                    // console.log(this.tmpX1,this.tmpY1,this.tmpX2,this.tmpY2)
                    context.lineTo(linel, linet)// 终点

                    context.stroke()
                } catch {
                    console.log('huaxian fail')
                }
            }
        })
        //return 10
    },
    //画圆数字
    arcImg(ctx, x, y) {
        ctx.beginPath();//开始绘制
        ctx.arc(x + 8, y + 8, 10, 0, 2 * Math.PI);//arc 的意思是“弧”
        //ctx.fillStyle="#ff0";//设置填充颜色
        ctx.fill();//开始填充
        //ctx.strokeStyle="blue";//将线条颜色设置为蓝色
        ctx.stroke();//stroke() 方法默认颜色是黑色（如果没有上面一行，则会是黑色）。
    },

    watermark(settings, currDocument) {
        //默认设置
        var defaultSettings = {
            watermark_txt: settings,
            watermark_x: currDocument.clientWidth / 2 - 350, //水印起始位置x轴坐标
            watermark_y: currDocument.clientHeight / 2 - 150, //水印起始位置Y轴坐标
            watermark_rows: 1, //水印行数
            watermark_cols: 1, //水印列数
            watermark_x_space: 100, //水印x轴间隔
            watermark_y_space: 50, //水印y轴间隔
            watermark_color: '#aaa', //水印字体颜色
            watermark_alpha: 0.15, //水印透明度
            watermark_fontsize: '200px', //水印字体大小
            watermark_font: '微软雅黑', //水印字体
            watermark_width: 700, //水印宽度
            watermark_height: 300, //水印长度
            watermark_angle: 0 //水印倾斜度数
        };
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            var src = arguments[0] || {};
            for (var key in src) {
                if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
                else if (src[key]) defaultSettings[key] = src[key];
            }
        }
        var oTemp = document.createDocumentFragment();
        //获取页面最大宽度
        var page_width = Math.max(currDocument.scrollWidth, currDocument.clientWidth);
        var cutWidth = page_width * 0.0150;
        page_width = page_width - cutWidth;
        //获取页面最大高度
        var page_height = Math.max(currDocument.scrollHeight, currDocument.clientHeight) + 450;
        page_height = Math.max(page_height, window.innerHeight - 30);
        //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
        if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
            defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
            defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
        }
        //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
        if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
            defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
            defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
        }
        var x;
        var y;
        for (var i = 0; i < defaultSettings.watermark_rows; i++) {
            y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
            for (var j = 0; j < defaultSettings.watermark_cols; j++) {
                x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
                var mask_div = document.createElement('div');
                mask_div.id = 'mask_div' + i + j;
                mask_div.className = 'mask_div';
                mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
                //设置水印div倾斜显示
                mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.visibility = "";
                mask_div.style.position = "absolute";
                mask_div.style.left = x + 'px';
                mask_div.style.top = y + 'px';
                mask_div.style.overflow = "hidden";
                mask_div.style.zIndex = "9999";
                //让水印不遮挡页面的点击事件
                mask_div.style.pointerEvents = 'none';
                mask_div.style.opacity = defaultSettings.watermark_alpha;
                mask_div.style.fontSize = defaultSettings.watermark_fontsize;
                mask_div.style.fontFamily = defaultSettings.watermark_font;
                mask_div.style.color = defaultSettings.watermark_color;
                mask_div.style.textAlign = "center";
                mask_div.style.width = defaultSettings.watermark_width + 'px';
                mask_div.style.height = defaultSettings.watermark_height + 'px';
                mask_div.style.display = "block";
                oTemp.appendChild(mask_div);
            }
        }
        currDocument.appendChild(oTemp);
    },
    removeWatermark() {
        if (document.getElementById('mask_div00') != undefined) {
            document.getElementById('mask_div00').remove()
        }
    }
}

//Step 矩形对象
function Step(context, x, y, item) {
    this.flag = "step";
    this.h = 16;
    this.w = 16;
    this.x = x;
    this.y = y;
    if (item.show != undefined && !item.show) {
        //console.log(item)
        context.globalAlpha = 0;
    }
    else {
        context.globalAlpha = 1;
    }
    if (item.color != undefined && item.color != "") {
        context.fillStyle = item.color;
    }
    else {
        context.fillStyle = "#f1bbc4";//5B9BD5
    }
    context.lineWidth = "1";

    context.fillRect(x, y, this.w, this.h);

}







//箭头从step矩形bottom——>top
Step.prototype.drawBottomToTop = function (obj, context) {
    if (obj.flag == "step") {
        var arrow = new Arrow(this.x + obj.w / 2, this.y + obj.h, this.x + obj.w / 2, obj.y);
        arrow.drawBottomToTop(context);
    }
}

//箭头从step矩形right——>left
Step.prototype.drawRightToLeft = function (obj, context) {
    var arrow = null;
    if (obj.flag == "step") {
        arrow = new Arrow(this.x + obj.w, this.y + obj.h / 2, obj.x, obj.y + obj.h / 2);
    }
    arrow.drawLeftToRightOrRightToLeft(context);
}

function Arrow(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.tmpX1 = null;
    this.tmpY1 = null;
    this.tmpX2 = null;
    this.tmpY2 = null;
    this.color = "#ffffff";

}
Arrow.prototype.setColor = function (color) {
    this.color = color;
}

Arrow.prototype.drawBottomToTop = function (context) {
    if (this.x1 != this.x2) {
        //this.setP1(this.x1,(this.y1+this.y2)/2);
        //this.setP2(this.x2,(this.y1+this.y2)/2);
        //this.draw(context);
    } else {
        this.draw(context);
    }
}
Arrow.prototype.drawLeftToRightOrRightToLeft = function (context) {
    if (this.y1 != this.y2) {
        // this.setP1((this.x1+this.x2)/2,this.y1);
        // this.setP2((this.x1+this.x2)/2,this.y2);
        // this.draw(context);
    } else {
        this.draw(context);
    }
}

Arrow.prototype.draw = function (context) {
    //console.log('draw...')
    // arbitrary styling
    context.strokeStyle = this.color;//设置线条的颜色
    //context.fillStyle = this.color;
    context.lineWidth = 6;// 设置线条的宽度
    // draw the line
    context.beginPath();
    context.moveTo(this.x1, this.y1);//起点
    //console.log(this.tmpX1,this.tmpY1,this.tmpX2,this.tmpY2)
    context.lineTo(this.x2, this.y2);//终点
    context.closePath();
    context.stroke();
}
